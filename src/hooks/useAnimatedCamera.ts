import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type CameraPhase = 'orbit' | 'dive' | 'field';

interface UseAnimatedCameraOptions {
  phase: CameraPhase;
  onDiveComplete?: () => void;
}

/**
 * Drives the R3F camera through three phases:
 *  orbit — slow cinematic orbit high above the stadium (menu)
 *  dive  — smooth lerp from orbit position down to field level (transition)
 *  field — locked low angle looking down the pitch (gameplay)
 */
export function useAnimatedCamera({ phase, onDiveComplete }: UseAnimatedCameraOptions) {
  const { camera } = useThree();
  const diveProgress = useRef(0);
  const diveStartPos = useRef(new THREE.Vector3());
  const diveStarted  = useRef(false);
  const diveDone     = useRef(false);

  // Orbit params
  const ORBIT_RADIUS = 30;
  const ORBIT_HEIGHT = 20;
  const ORBIT_SPEED  = 0.12;

  // Field (gameplay) camera
  const FIELD_POS    = new THREE.Vector3(0, 10, 14);
  const FIELD_TARGET = new THREE.Vector3(0, 0, 0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (phase === 'orbit') {
      // Slow circle above stadium
      const angle = t * ORBIT_SPEED;
      camera.position.set(
        Math.sin(angle) * ORBIT_RADIUS,
        ORBIT_HEIGHT,
        Math.cos(angle) * ORBIT_RADIUS,
      );
      camera.lookAt(0, 0, 0);
      diveStarted.current = false;
      diveDone.current    = false;
      diveProgress.current = 0;
    }

    if (phase === 'dive') {
      if (!diveStarted.current) {
        diveStartPos.current.copy(camera.position);
        diveStarted.current = true;
      }
      if (!diveDone.current) {
        diveProgress.current = Math.min(diveProgress.current + 0.008, 1);
        const ease = easeInOutCubic(diveProgress.current);
        camera.position.lerpVectors(diveStartPos.current, FIELD_POS, ease);
        camera.lookAt(FIELD_TARGET);

        if (diveProgress.current >= 1) {
          diveDone.current = true;
          onDiveComplete?.();
        }
      }
    }

    if (phase === 'field') {
      camera.position.lerp(FIELD_POS, 0.05);
      camera.lookAt(FIELD_TARGET);
    }
  });
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
