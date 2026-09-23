import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Comic-style card colors matching the game palette
const CARD_FACE_COLOR = '#f2e8d9';   // palette.backgroundMain
const CARD_BORDER_COLOR = '#1a1008'; // palette.ink
const CARD_BACK_COLOR = '#2c1f14';   // palette.darkPen
const CARD_ACCENT = '#FF3333';

interface FloatingCard3DProps {
  position: [number, number, number];
  rotationOffset?: number; // phase offset for bobbing animation
  tiltX?: number;
  tiltZ?: number;
}

export function FloatingCard3D({
  position,
  rotationOffset = 0,
  tiltX = 0,
  tiltZ = 0,
}: FloatingCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + rotationOffset;
    // Slow bobbing + gentle Y rotation
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.3;
  });

  const cardW = 0.9;
  const cardH = 1.26;
  const cardD = 0.04;

  return (
    <group ref={groupRef} position={position} rotation={[tiltX, 0, tiltZ]}>
      {/* Card body */}
      <mesh castShadow>
        <boxGeometry args={[cardW, cardH, cardD]} />
        <meshToonMaterial color={CARD_FACE_COLOR} />
      </mesh>

      {/* Border outline — slightly larger box behind */}
      <mesh position={[0, 0, -0.001]}>
        <boxGeometry args={[cardW + 0.06, cardH + 0.06, cardD - 0.01]} />
        <meshToonMaterial color={CARD_BORDER_COLOR} />
      </mesh>

      {/* Card back (dark face) */}
      <mesh position={[0, 0, -cardD / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cardW - 0.02, cardH - 0.02]} />
        <meshToonMaterial color={CARD_BACK_COLOR} />
      </mesh>

      {/* Red accent stripe on face */}
      <mesh position={[0, cardH * 0.28, cardD / 2 + 0.001]}>
        <planeGeometry args={[cardW - 0.1, 0.12]} />
        <meshToonMaterial color={CARD_ACCENT} />
      </mesh>

      {/* Gold cost dot */}
      <mesh position={[-cardW / 2 + 0.18, cardH / 2 - 0.18, cardD / 2 + 0.001]}>
        <circleGeometry args={[0.12, 16]} />
        <meshToonMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}
