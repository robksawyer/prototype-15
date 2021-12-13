/**
 * @file RainbowTunnel.js
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Stars } from '@react-three/drei';
import { useLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import styles from './RainbowTunnel.module.css';

const Tunnel = ({
  tubularSegments = 1000,
  radialSegments = 3,
  tubeRadius = 2,
  shapePath = [],
  hueStart,
  hueEnd,
  cameraSpeed,
  lightSpeed,
  lightColor,
  lightIntensity,
  lightDistance,
  ambientLight,
}) => {
  const pct = React.useRef(0);
  const pct2 = React.useRef(0);
  const geometry = React.useRef();
  const groupRef = React.useRef();
  const [vertCount, setVertCount] = React.useState(0);
  const path = React.useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        shapePath.map(path => new THREE.Vector3(...path)),
      ),
    [shapePath],
  );

  useLayoutEffect(() => {
    if (!vertCount) setVertCount(geometry.current.attributes.position.count);
  }, [geometry, vertCount]);

  const colorArray = React.useMemo(() => {
    let hue = hueStart;
    let hup = true;
    const tempColor = new THREE.Color();
    return Float32Array.from(
      new Array(vertCount).fill().flatMap((_, i) => {
        hup === 1 ? hue++ : hue--;
        hup = hue === hueEnd ? false : hue === hueStart ? true : 0;
        return tempColor.setHSL(hue / 100, 1, 0.5).toArray();
      }),
    );
  }, [vertCount, hueEnd, hueStart]);

  useFrame(({ camera }) => {
    const children = groupRef.current.children;
    const pt1 = path.getPointAt(pct.current % 1);
    const pt2 = path.getPointAt((pct.current + 0.01) % 1);
    pct.current += cameraSpeed;
    pct2.current += lightSpeed;
    camera.position.copy(pt1);
    camera.lookAt(pt2);
    children[0].position.copy(pt2);
    children[1].position.copy(path.getPointAt((pct2.current + 0.0) % 1));
    children[2].position.copy(path.getPointAt((pct2.current + 0.2) % 1));
    children[3].position.copy(path.getPointAt((pct2.current + 0.4) % 1));
    children[4].position.copy(path.getPointAt((pct2.current + 0.6) % 1));
    children[5].position.copy(path.getPointAt((pct2.current + 0.8) % 1));
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <group ref={groupRef}>
        <pointLight color={lightColor} intensity={1} distance={50} />
        <pointLight
          intensity={lightIntensity}
          color={lightColor}
          distance={lightDistance}
        />
        <pointLight
          intensity={lightIntensity}
          color={lightColor}
          distance={lightDistance}
        />
        <pointLight
          intensity={lightIntensity}
          color={lightColor}
          distance={lightDistance}
        />
        <pointLight
          intensity={lightIntensity}
          color={lightColor}
          distance={lightDistance}
        />
        <pointLight
          intensity={lightIntensity}
          color={lightColor}
          distance={lightDistance}
        />
        <ambientLight intensity={1} color={ambientLight} />
      </group>
      <mesh>
        <tubeGeometry
          ref={geometry}
          args={[path, tubularSegments, tubeRadius, radialSegments, true]}
        >
          <bufferAttribute
            attachObject={['attributes', 'color']}
            args={[colorArray, 3]}
          />
        </tubeGeometry>
        <meshLambertMaterial side={THREE.BackSide} vertexColors wireframe />
      </mesh>
    </>
  );
};

const RainbowTunnel = ({
  tagName: Tag = 'div',
  className = 'fixed top-0 left-0 w-screen h-screen bg-black',
  variant = 'default',
  children = '',
  shapePath = [
    [389, 246, 0],
    [410, 255, 20],
    [413, 268, 7],
    [431, 261, 12],
    [418, 244, 30],
    [416, 217, 25],
    [420, 205, 8],
    [427, 227, -20],
    [432, 236, 5],
    [444, 228, 12],
    [451, 232, 41],
    [446, 246, 72],
    [443, 264, 96],
    [446, 278, 65],
    [463, 267, 20],
    [460, 258, -10],
    [464, 243, -20],
    [459, 233, 0],
    [475, 225, 22],
    [484, 225, 29],
    [490, 214, 51],
    [476, 202, 55],
    [462, 202, 55],
    [446, 205, 42],
    [440, 192, 42],
    [430, 183, 72],
    [413, 184, 58],
    [406, 191, 32],
    [406, 207, 0],
    [402, 220, 0],
    [390, 222, 20],
    [385, 228, 10],
    [389, 246, 0],
  ], // http://www.cssplant.com/clip-path-generator
  cameraSpeed = 0.0003,
  lightSpeed = 0.001,
  tubularSegments = 1000,
  radialSegments = 3,
  tubeRadius = 2,
  ambientLight = '#222222',
  lightColor = '#ffffff',
  lightIntensity = 1,
  lightDistance = 20,
  hueStart = 0, // Hue-Start
  hueEnd = 360, // Hue-End
}) => {
  return (
    <Tag
      className={`${styles.rainbow_tunnel} ${
        styles[`rainbow_tunnel__${variant}`]
      } ${className}`}
    >
      <Canvas
        camera={{
          fov: 60,
          far: 20000,
        }}
      >
        <Tunnel
          cameraSpeed={cameraSpeed}
          lightSpeed={lightSpeed}
          tubularSegments={tubularSegments}
          radialSegments={radialSegments}
          tubeRadius={tubeRadius}
          hueStart={hueStart}
          hueEnd={hueEnd}
          shapePath={shapePath}
          lightColor={lightColor}
          lightIntensity={lightIntensity}
          lightDistance={lightDistance}
          ambientLight={ambientLight}
        />
        <Stars radius={500} />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.5}
            kernelSize={2}
            luminanceThreshold={0}
            luminanceSmoothing={0.3}
          />
          <Bloom
            intensity={1.5}
            kernelSize={4}
            luminanceThreshold={0}
            luminanceSmoothing={0.0}
          />
        </EffectComposer>
      </Canvas>
    </Tag>
  );
};

RainbowTunnel.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
};

export default RainbowTunnel;
