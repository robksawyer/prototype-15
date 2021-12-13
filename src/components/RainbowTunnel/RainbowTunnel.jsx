/**
 * @file RainbowTunnel.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing'
import { Environment } from '@react-three/drei'

import { useWindowSize } from '@/hooks/useWindowSize'

import styles from './RainbowTunnel.module.css'

/**
 * StarField
 * An alternate star field.
 * @param {*} param0
 * @returns
 */
const StarField = ({ count = 3000 }) => {
  const geom = React.useRef()
  const [positions] = React.useMemo(() => {
    const initialPositions = []

    for (let i = 0; i < count; i += 1) {
      initialPositions.push(THREE.Math.randFloatSpread(1500))
      initialPositions.push(THREE.Math.randFloatSpread(1500))
      initialPositions.push(THREE.Math.randFloatSpread(1500))
    }

    const positions = new Float32Array(initialPositions)
    return [positions]
  }, [count])

  return (
    <points
      ref={geom}
      position={[0, 10, 0]}
      rotation={[-Math.PI / 4, 0, Math.PI / 6]}
    >
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.5} />
    </points>
  )
}

const Tunnel = ({
  tubularSegments = 1000,
  radialSegments = 3,
  tubeRadius = 2,
  hueStart,
  hueEnd,
  shapePath = [],
  cameraSpeed,
  lightSpeed,
  lightColor,
  lightIntensity,
  lightDistance,
  ambientLight,
}) => {
  const geometry = React.useRef()
  const groupRef = React.useRef()
  const [vertCount, setVertCount] = React.useState(0)

  const { camera, gl } = useThree()
  const { width, height } = useWindowSize()

  const points = []
  for (let i = 0; i < shapePath.length; i++) {
    var x = shapePath[i][0]
    var y = shapePath[i][2]
    var z = shapePath[i][1]
    points[i] = new THREE.Vector3(x, y, z)
  }

  const path = new THREE.CatmullRomCurve3(points)

  let pct = React.useRef(0)
  let pct2 = React.useRef(0)

  React.useLayoutEffect(() => {
    if (geometry.current && !vertCount) {
      const _count = geometry.current.attributes.position.count
      setVertCount(_count)
    }
  }, [geometry, vertCount])

  React.useEffect(() => {
    const resized = () => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      gl.setSize(width, height)
    }
    window.addEventListener('resize', resized)
    return () => window.removeEventListener('resize', resized)
  }, [camera, gl, height, width])

  // Build a hue array for the colors.
  // This is applied to buffer attribute
  const colorArray = React.useMemo(() => {
    try {
      let hue = hueStart
      let hup = true
      const tempColor = new THREE.Color()
      return Float32Array.from(
        new Array(vertCount).fill().flatMap((_, i) => {
          hup === 1 ? hue++ : hue--
          hup = hue === hueEnd ? false : hue === hueStart ? true : 0
          return tempColor.setHSL(hue / 100, 1, 0.5).toArray()
        })
      )
    } catch (err) {
      console.error('There was an error assigning the hues', err)
    }
  }, [vertCount, hueEnd, hueStart])

  useFrame(({ camera, mouse, viewport }) => {
    pct.current += cameraSpeed
    pct2.current += lightSpeed

    const pt1 = path.getPointAt(pct.current % 1)
    const pt2 = path.getPointAt((pct.current + 0.01) % 1)

    camera.position.x = pt1.x
    camera.position.y = pt1.y
    camera.position.z = pt1.z
    camera.lookAt(pt2)

    const { children } = groupRef.current

    if (children && children[0] && children[5]) {
      children[0].position.set(pt2.x, pt2.y, pt2.z)

      // Makes the light follow the mouse
      // children[0].position.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)

      children[1].position.set(
        path.getPointAt((pct2.current + 0.0) % 1).x,
        path.getPointAt((pct2.current + 0.0) % 1).y,
        path.getPointAt((pct2.current + 0.0) % 1).z
      )
      children[2].position.set(
        path.getPointAt((pct2.current + 0.2) % 1).x,
        path.getPointAt((pct2.current + 0.2) % 1).y,
        path.getPointAt((pct2.current + 0.2) % 1).z
      )
      children[3].position.set(
        path.getPointAt((pct2.current + 0.4) % 1).x,
        path.getPointAt((pct2.current + 0.4) % 1).y,
        path.getPointAt((pct2.current + 0.4) % 1).z
      )
      children[4].position.set(
        path.getPointAt((pct2.current + 0.6) % 1).x,
        path.getPointAt((pct2.current + 0.6) % 1).y,
        path.getPointAt((pct2.current + 0.6) % 1).z
      )
      children[5].position.set(
        path.getPointAt((pct2.current + 0.8) % 1).x,
        path.getPointAt((pct2.current + 0.8) % 1).y,
        path.getPointAt((pct2.current + 0.8) % 1).z
      )
    }

    camera.updateProjectionMatrix()
  })

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
        <tubeBufferGeometry
          ref={geometry}
          args={[path, tubularSegments, tubeRadius, radialSegments, true]}
        >
          <bufferAttribute
            attachObject={['attributes', 'color']}
            args={[colorArray, 3]}
          />
        </tubeBufferGeometry>
        <meshLambertMaterial side={THREE.BackSide} vertexColors wireframe />
      </mesh>
    </>
  )
}

const RainbowTunnel = ({
  tagName: Tag = 'div',
  className = 'fixed top-0 left-0 w-screen h-screen bg-hot-pink',
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
  stars = 3000,
}) => {
  const { width, height } = useWindowSize()

  return (
    <Tag
      className={`${styles.rainbow_tunnel} ${
        styles[`rainbow_tunnel__${variant}`]
      } ${className}`}
    >
      <Canvas
        camera={{
          fov: 60,
          aspect: width / height,
          near: 0.001,
          far: 1000,
        }}
      >
        <StarField count={stars} />
        <React.Suspense fallback={null}>
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
          <Environment preset="warehouse" />
        </React.Suspense>
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
  )
}

RainbowTunnel.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
}

export default RainbowTunnel
