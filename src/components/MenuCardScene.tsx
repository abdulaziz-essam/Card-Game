import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import { FloatingCard3D } from './FloatingCard3D';

// Comic-style halftone table surface
function TableSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]} receiveShadow>
      <planeGeometry args={[12, 10]} />
      <meshToonMaterial color="#c8b89a" />
    </mesh>
  );
}

// Subtle comic-style ambient lighting
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#fff8f0" />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
      {/* Rim light for comic depth */}
      <pointLight position={[-4, 2, -2]} intensity={0.4} color="#ffe4b5" />
    </>
  );
}

// The three floating cards spread across the scene
function FloatingCardDeck() {
  return (
    <>
      <FloatingCard3D position={[-1.6, 0.2, 0]} rotationOffset={0}    tiltZ={0.15}  tiltX={-0.1} />
      <FloatingCard3D position={[0,   0.5, 0.4]} rotationOffset={1.2} tiltZ={0}     tiltX={-0.05} />
      <FloatingCard3D position={[1.6, 0.1, 0]} rotationOffset={2.4}   tiltZ={-0.15} tiltX={-0.1} />
    </>
  );
}

export function MenuCardScene() {
  return (
    <View style={styles.canvasWrapper}>
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        style={styles.canvas}
      >
        <SceneLights />
        <TableSurface />
        <FloatingCardDeck />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasWrapper: {
    width: '100%',
    height: 260,
  },
  canvas: {
    flex: 1,
  },
});
