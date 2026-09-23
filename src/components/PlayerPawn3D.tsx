import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayingCard } from '../game/PlayingCard';
import { palette } from '../style/palette';

// Shared toon gradient (4-step cel shading — prevents black rendering)
export function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([40, 100, 180, 255]);
    const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// ─── Floating action card above pawn ─────────────────────────────────────────

interface ActionCard3DProps {
  card: PlayingCard;
  team: 'player' | 'ai';
  yOffset: number;   // how high above pawn base
}

function ActionCard3D({ card, team, yOffset }: ActionCard3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const g = useToonGradient();
  const jerseyColor = team === 'player' ? palette.playerColor : palette.aiColor;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = yOffset + Math.sin(t * 1.6) * 0.08;
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <group ref={meshRef} position={[0, yOffset, 0]}>
      {/* Card border */}
      <mesh>
        <boxGeometry args={[0.42, 0.58, 0.025]} />
        <meshToonMaterial color={palette.outlineColor} gradientMap={g} />
      </mesh>
      {/* Card face */}
      <mesh position={[0, 0, 0.013]}>
        <boxGeometry args={[0.38, 0.54, 0.01]} />
        <meshToonMaterial color={card.color} gradientMap={g} />
      </mesh>
      {/* Power badge (top-right) */}
      <mesh position={[0.12, 0.2, 0.022]}>
        <circleGeometry args={[0.085, 8]} />
        <meshToonMaterial color="#FF3333" gradientMap={g} />
      </mesh>
      {/* Cost badge (top-left) */}
      <mesh position={[-0.12, 0.2, 0.022]}>
        <circleGeometry args={[0.085, 8]} />
        <meshToonMaterial color="#FFD700" gradientMap={g} />
      </mesh>
      {/* Jersey stripe accent */}
      <mesh position={[0, -0.05, 0.022]}>
        <boxGeometry args={[0.34, 0.1, 0.01]} />
        <meshToonMaterial color={jerseyColor} gradientMap={g} />
      </mesh>
    </group>
  );
}

// ─── Player pawn ──────────────────────────────────────────────────────────────

interface PlayerPawn3DProps {
  card: PlayingCard;
  position: [number, number, number];
  team: 'player' | 'ai';
  isWinning: boolean;
}

export function PlayerPawn3D({ card, position, team, isWinning }: PlayerPawn3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const g = useToonGradient();

  const jerseyColor = team === 'player' ? palette.playerColor : palette.aiColor;
  const shirtColor  = isWinning ? palette.winHighlight : jerseyColor;
  const skinColor   = '#f5c8a0';
  const outline     = palette.outlineColor;

  // Power drives pawn scale: 0.75 (power 1) → 1.2 (power 10)
  const scale = 0.75 + (card.power / 10) * 0.45;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 1.1 + position[0]) * 0.03;
    groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 1.6 + position[2])) * 0.03;
  });

  const pawnH = 0.85; // total pawn height at scale=1, card floats above this

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* ── Boots ── */}
      {([-0.09, 0.09] as number[]).map((xOff, i) => (
        <group key={i}>
          <mesh position={[xOff, 0.05, 0.02]}>
            <boxGeometry args={[0.1, 0.07, 0.15]} />
            <meshToonMaterial color="#1a1008" gradientMap={g} />
          </mesh>
        </group>
      ))}

      {/* ── Legs (shorts) ── */}
      {([-0.09, 0.09] as number[]).map((xOff, i) => (
        <group key={i}>
          <mesh position={[xOff, 0.22, 0]}>
            <boxGeometry args={[0.11, 0.26, 0.1]} />
            <meshToonMaterial color="#ffffff" gradientMap={g} />
          </mesh>
          {/* outline */}
          <mesh position={[xOff, 0.22, 0]}>
            <boxGeometry args={[0.13, 0.28, 0.12]} />
            <meshToonMaterial color={outline} gradientMap={g} />
          </mesh>
        </group>
      ))}

      {/* ── Body / jersey ── */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.16]} />
        <meshToonMaterial color={shirtColor} gradientMap={g} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.33, 0.33, 0.18]} />
        <meshToonMaterial color={outline} gradientMap={g} />
      </mesh>

      {/* ── Arms ── */}
      {([-0.22, 0.22] as number[]).map((xOff, i) => (
        <group key={i}>
          <mesh position={[xOff, 0.46, 0]}>
            <boxGeometry args={[0.1, 0.26, 0.1]} />
            <meshToonMaterial color={shirtColor} gradientMap={g} />
          </mesh>
          <mesh position={[xOff, 0.46, 0]}>
            <boxGeometry args={[0.12, 0.28, 0.12]} />
            <meshToonMaterial color={outline} gradientMap={g} />
          </mesh>
        </group>
      ))}

      {/* ── Head ── */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.2]} />
        <meshToonMaterial color={skinColor} gradientMap={g} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.25, 0.25, 0.23]} />
        <meshToonMaterial color={outline} gradientMap={g} />
      </mesh>

      {/* ── Hair ── */}
      <mesh position={[0, 0.87, 0]}>
        <boxGeometry args={[0.22, 0.06, 0.2]} />
        <meshToonMaterial color="#3a2010" gradientMap={g} />
      </mesh>

      {/* ── Floating action card above pawn ── */}
      <ActionCard3D card={card} team={team} yOffset={pawnH + 0.5} />
    </group>
  );
}
