import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerPawn3D, useToonGradient } from './PlayerPawn3D';
import { LocationState } from '../game/gameStore';
import { palette } from '../style/palette';
import { useAnimatedCamera, CameraPhase } from '../hooks/useAnimatedCamera';

// ─── Pitch constants ──────────────────────────────────────────────────────────

export const PW = 22;
export const PD = 14;

export const PLAYER_ZONE_Z = [6.0, 4.2, 2.4, 0.7];
export const AI_ZONE_Z     = [-6.0, -4.2, -2.4, -0.7];

export const ZONE_X_SLOTS: number[][] = [
  [0],
  [-4.5, -1.5, 1.5, 4.5],
  [-3.0, 0, 3.0],
  [-3.5, 0, 3.5],
];

export function getSlots(zoneIdx: number, team: 'player' | 'ai'): [number, number, number][] {
  const xs = ZONE_X_SLOTS[zoneIdx];
  const z  = team === 'player' ? PLAYER_ZONE_Z[zoneIdx] : AI_ZONE_Z[zoneIdx];
  return xs.map(x => [x, 0, z]);
}

// ─── Reusable toon gradient ───────────────────────────────────────────────────

function useTG() {
  return useMemo(() => {
    const data = new Uint8Array([40, 100, 180, 255]);
    const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// ─── Pitch ground ─────────────────────────────────────────────────────────────

export function PitchGround() {
  const g = useTG();
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[PW, PD]} />
        <meshToonMaterial color="#2e7d32" gradientMap={g} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => i - 3).map(n => (
        <mesh key={n} rotation={[-Math.PI / 2, 0, 0]} position={[n * 3.1, 0.001, 0]}>
          <planeGeometry args={[1.5, PD]} />
          <meshToonMaterial color="#358c3a" gradientMap={g} transparent opacity={0.35} />
        </mesh>
      ))}
    </>
  );
}

// ─── Line helper ─────────────────────────────────────────────────────────────

function Line({ pos, args }: { pos: [number,number,number]; args: [number,number,number] }) {
  const g = useTG();
  return (
    <mesh position={pos}>
      <boxGeometry args={args} />
      <meshToonMaterial color="#ffffff" gradientMap={g} />
    </mesh>
  );
}

// ─── Pitch markings ───────────────────────────────────────────────────────────

export function PitchMarkings() {
  const g = useTG();
  const ly = 0.004;
  const lw = 0.07;

  return (
    <>
      <Line pos={[-PW/2, ly, 0]}   args={[lw, 0.01, PD]} />
      <Line pos={[ PW/2, ly, 0]}   args={[lw, 0.01, PD]} />
      <Line pos={[0, ly, -PD/2]}   args={[PW, 0.01, lw]} />
      <Line pos={[0, ly,  PD/2]}   args={[PW, 0.01, lw]} />
      <Line pos={[0, ly, 0]}       args={[PW, 0.01, lw]} />

      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, ly+0.001, 0]}>
        <ringGeometry args={[1.6, 1.72, 48]} />
        <meshToonMaterial color="#ffffff" gradientMap={g} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, ly+0.001, 0]}>
        <circleGeometry args={[0.12, 12]} />
        <meshToonMaterial color="#ffffff" gradientMap={g} />
      </mesh>

      {/* Penalty areas */}
      <Line pos={[-3.5, ly,  PD/2-2.2]}  args={[7.0, 0.01, lw]} />
      <Line pos={[-3.5, ly,  PD/2-1.1]}  args={[lw, 0.01, 2.2]} />
      <Line pos={[ 3.5, ly,  PD/2-1.1]}  args={[lw, 0.01, 2.2]} />
      <Line pos={[-3.5, ly, -PD/2+2.2]}  args={[7.0, 0.01, lw]} />
      <Line pos={[-3.5, ly, -PD/2+1.1]}  args={[lw, 0.01, 2.2]} />
      <Line pos={[ 3.5, ly, -PD/2+1.1]}  args={[lw, 0.01, 2.2]} />

      <GoalMesh position={[0, 0,  PD/2]} color={palette.playerColor} flip={false} />
      <GoalMesh position={[0, 0, -PD/2]} color={palette.aiColor}     flip={true}  />
    </>
  );
}

function GoalMesh({ position, color, flip }: { position:[number,number,number]; color:string; flip:boolean }) {
  const g = useTG();
  const dir = flip ? -1 : 1;
  const pw = 0.1; const gh = 1.2; const gw = 3.0;
  return (
    <group position={position}>
      <mesh position={[-gw/2, gh/2, 0]}>
        <boxGeometry args={[pw, gh, pw]} />
        <meshToonMaterial color={color} gradientMap={g} />
      </mesh>
      <mesh position={[gw/2, gh/2, 0]}>
        <boxGeometry args={[pw, gh, pw]} />
        <meshToonMaterial color={color} gradientMap={g} />
      </mesh>
      <mesh position={[0, gh, 0]}>
        <boxGeometry args={[gw+pw, pw, pw]} />
        <meshToonMaterial color={color} gradientMap={g} />
      </mesh>
      <mesh position={[0, gh/2, dir * -0.55]}>
        <boxGeometry args={[gw-pw, gh-pw, 0.05]} />
        <meshToonMaterial color="#ffffff" gradientMap={g} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// ─── Stadium stands ───────────────────────────────────────────────────────────

export function StadiumStands() {
  const g = useTG();
  const standH = 4.0;
  const standD = 5.0;
  const seatColors = ['#1565c0','#c62828','#f9a825','#2e7d32'];

  const Stand = ({
    pos, rot, w, d,
  }: {
    pos: [number,number,number];
    rot?: [number,number,number];
    w: number;
    d: number;
  }) => (
    <group position={pos} rotation={rot ?? [0,0,0]}>
      {/* Concrete body */}
      <mesh castShadow>
        <boxGeometry args={[w, standH, d]} />
        <meshToonMaterial color="#37474f" gradientMap={g} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, standH/2 + 0.2, 0]}>
        <boxGeometry args={[w + 1.5, 0.35, d + 0.5]} />
        <meshToonMaterial color="#546e7a" gradientMap={g} />
      </mesh>
      {/* Seat rows */}
      {[0, 1, 2, 3].map(row => (
        <mesh key={row} position={[0, -standH/2 + 0.5 + row * 0.9, d/2 - 0.6 - row * 0.55]}>
          <boxGeometry args={[w - 0.5, 0.18, 0.55]} />
          <meshToonMaterial color={seatColors[row % 4]} gradientMap={g} />
        </mesh>
      ))}
    </group>
  );

  const halfW = PW / 2;
  const halfD = PD / 2;

  return (
    <>
      {/* North stand */}
      <Stand pos={[0, standH/2, -halfD - standD/2 - 0.6]} w={PW + standD*2 + 2} d={standD} />
      {/* South stand */}
      <Stand pos={[0, standH/2,  halfD + standD/2 + 0.6]} w={PW + standD*2 + 2} d={standD} />
      {/* West stand */}
      <Stand pos={[-halfW - standD/2 - 0.6, standH/2, 0]} rot={[0, Math.PI/2, 0]} w={PD} d={standD} />
      {/* East stand */}
      <Stand pos={[ halfW + standD/2 + 0.6, standH/2, 0]} rot={[0, Math.PI/2, 0]} w={PD} d={standD} />

      {/* Stadium floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[PW + standD*2 + 4, PD + standD*2 + 4]} />
        <meshToonMaterial color="#1c2833" gradientMap={g} />
      </mesh>

      {/* Floodlight poles — 4 corners */}
      {([-1,1] as number[]).flatMap(sx =>
        ([-1,1] as number[]).map(sz => {
          const px = sx * (halfW + standD + 2);
          const pz = sz * (halfD + standD + 2);
          return (
            <group key={`${sx}${sz}`} position={[px, 0, pz]}>
              <mesh position={[0, 5, 0]}>
                <cylinderGeometry args={[0.18, 0.24, 10, 8]} />
                <meshToonMaterial color="#78909c" gradientMap={g} />
              </mesh>
              <mesh position={[0, 10.2, 0]}>
                <boxGeometry args={[1.6, 0.35, 1.0]} />
                <meshToonMaterial color="#ffd54f" gradientMap={g} />
              </mesh>
            </group>
          );
        })
      )}
    </>
  );
}

// ─── Lights ───────────────────────────────────────────────────────────────────

export function StadiumLights() {
  return (
    <>
      <ambientLight intensity={0.85} color="#fff8f0" />
      <directionalLight position={[4, 20, 12]} intensity={2.2} castShadow color="#ffffff"
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      />
      <directionalLight position={[-6, 12, -8]} intensity={0.75} color="#cce0ff" />
      <pointLight position={[-14, 10, -10]} intensity={1.3} color="#fffde7" distance={40} />
      <pointLight position={[ 14, 10, -10]} intensity={1.3} color="#fffde7" distance={40} />
      <pointLight position={[-14, 10,  10]} intensity={1.3} color="#fffde7" distance={40} />
      <pointLight position={[ 14, 10,  10]} intensity={1.3} color="#fffde7" distance={40} />
    </>
  );
}

// ─── Players on pitch ─────────────────────────────────────────────────────────

interface PlayersOnPitchProps {
  locations: LocationState[];
}

export function PlayersOnPitch({ locations }: PlayersOnPitchProps) {
  return (
    <>
      {locations.map((loc, zoneIdx) => {
        const playerPow = loc.playerCards.reduce((s, c) => s + c.power, 0);
        const aiPow     = loc.aiCards.reduce((s, c) => s + c.power, 0);
        const playerSlots = getSlots(zoneIdx, 'player');
        const aiSlots     = getSlots(zoneIdx, 'ai');

        return (
          <group key={loc.name}>
            {loc.playerCards.map((card, i) => (
              <PlayerPawn3D key={card.id} card={card} position={playerSlots[i]}
                team="player" isWinning={playerPow > aiPow} />
            ))}
            {loc.aiCards.map((card, i) => (
              <PlayerPawn3D key={card.id} card={card} position={aiSlots[i]}
                team="ai" isWinning={aiPow > playerPow} />
            ))}
          </group>
        );
      })}
    </>
  );
}

// ─── Camera controller (inside Canvas) ───────────────────────────────────────

function CameraController({
  phase,
  onDiveComplete,
}: {
  phase: CameraPhase;
  onDiveComplete?: () => void;
}) {
  useAnimatedCamera({ phase, onDiveComplete });
  return null;
}

// ─── Exported scene ───────────────────────────────────────────────────────────

interface StadiumSceneProps {
  locations: LocationState[];
  cameraPhase: CameraPhase;
  onDiveComplete?: () => void;
  style?: object;
}

export function StadiumScene({ locations, cameraPhase, onDiveComplete, style }: StadiumSceneProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Canvas
        shadows
        // Start from above; CameraController takes over from here
        camera={{ position: [0, 20, 28], fov: 58 }}
        style={styles.canvas}
      >
        <CameraController phase={cameraPhase} onDiveComplete={onDiveComplete} />
        <StadiumLights />
        <StadiumStands />
        <PitchGround />
        <PitchMarkings />
        <PlayersOnPitch locations={locations} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, width: '100%' },
  canvas:  { flex: 1 },
});
