/**
 * @file MainScene.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'
import useErrorBoundary from 'use-error-boundary'

import { Canvas, useFrame, useThree } from '@react-three/fiber'

// Enabled for effects
// import {
//   EffectComposer,
//   // Bloom,
//   // ChromaticAberration,
// } from '@react-three/postprocessing'

import * as THREE from 'three'
import {
  useHelper,
  Html,
  useTexture,
  OrbitControls,
  Stats,
} from '@react-three/drei'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as STDLIB from 'three-stdlib'

import styles from './MainScene.module.css'

import Loader from '@/components/Loader'

// Shader stack
import './shaders/defaultShaderMaterial'

// Texture loading examples
// const envMap = useCubeTexture(
//   [
//     'sky_px.png',
//     'sky_nx.png',
//     'sky_py.png',
//     'sky_ny.png',
//     'sky_pz.png',
//     'sky_nz.png',
//   ],
//   { path: '/3d/sky0/' }
// )

// const bumpMap = useLoader(TextureLoader, '/3d/bumps/fabric-bump.png')
// bumpMap.wrapS = bumpMap.wrapT = RepeatWrapping
// bumpMap.repeat.set(1, 1)
//
// Application
// <meshStandardMaterial
//    envMap={envMap}
//    attach="material"
//    roughness={0}
//    metalness={0.9}
//    bumpMap={bumpMap}
//    color="#3083DC"
//  />

// Enable for effects in the main scene
// const Effects = () => {
//   return <EffectComposer></EffectComposer>
// }

const ENABLE_HELPERS = 1

const Scene = () => {
  const mesh = React.useRef()
  const { scene, size } = useThree()
  const group = React.useRef()

  const spotLight = React.useRef()
  const pointLight = React.useRef()

  // Texture loading example
  const texture = useTexture('/3d/textures/checkerboard.jpg')
  // const texture = useLoader(
  //   THREE.TextureLoader,
  //   '/3d/textures/checkerboard.jpg'
  // )
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  useFrame(({ clock, mouse }) => {
    mesh.current.rotation.x = (Math.sin(clock.elapsedTime) * Math.PI) / 4
    mesh.current.rotation.y = (Math.sin(clock.elapsedTime) * Math.PI) / 4
    mesh.current.rotation.z = (Math.sin(clock.elapsedTime) * Math.PI) / 4
    mesh.current.position.x = Math.sin(clock.elapsedTime)
    mesh.current.position.z = Math.sin(clock.elapsedTime)
    group.current.rotation.y += 0.02

    mesh.current.material.uniforms.iTime.value = clock.getElapsedTime()
    mesh.current.material.uniforms.iMouse.value = new THREE.Vector2(
      mouse.x,
      mouse.y
    )
  })

  React.useEffect(() => void (spotLight.current.target = mesh.current), [scene])
  if (ENABLE_HELPERS) {
    useHelper(spotLight, THREE.SpotLightHelper, 'teal')
    useHelper(pointLight, THREE.PointLightHelper, 0.5, 'hotpink')
    useHelper(mesh, THREE.BoxHelper, '#272740')
    useHelper(mesh, STDLIB.VertexNormalsHelper, 1, '#272740')
  }

  return (
    <>
      <pointLight position={[-10, 0, -20]} color="lightblue" intensity={2.5} />
      <group ref={group}>
        <pointLight
          ref={pointLight}
          color="red"
          position={[4, 4, 0]}
          intensity={5}
        />
      </group>
      <spotLight
        castShadow
        position={[2, 5, 2]}
        ref={spotLight}
        angle={0.5}
        distance={20}
      />
      <mesh ref={mesh} position={[0, 2, 0]} castShadow>
        <boxBufferGeometry attach="geometry" args={[1, 1]} />
        {/* Shader Material Example */}
        <defaultShaderMaterial
          attach="material"
          // time={0}
          // texture={new THREE.TextureLoader().load(
          //   '/3d/textures/checkerboard.jpg',
          //   (texture) => {
          //     texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          //   }
          // )}
          // texture1={texture}
          iResolution={new THREE.Vector2(size.width, size.height)}
          // uvRate1={new THREE.Vector2(1, 1)}
        />

        {/* Standard Color Material Example */}
        {/* <meshStandardMaterial attach="material" color="lightblue" /> */}

        {/* Texture Material Example */}
        {/* <meshBasicMaterial attach="material" map={texture} /> */}
      </mesh>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeBufferGeometry args={[100, 100]} attach="geometry" />
        <shadowMaterial attach="material" opacity={0.5} />
      </mesh>
      <gridHelper args={[30, 30, 30]} />
    </>
  )
}

const MainScene = ({
  className = 'fixed top-0 left-0 w-screen h-screen',
  variant = 'default',
}) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()

  return (
    <main
      className={`${styles.main_scene} ${
        styles[`main_scene__${variant}`]
      } ${className}`}
      style={{
        maxHeight: `calc(100vh - 50px)`,
      }}
    >
      <Stats showPanel={0} className="ml-0" />
      {/* <Stats showPanel={1} className="ml-[80px]" />
      <Stats showPanel={2} className="ml-160px" /> */}
      <ErrorBoundary>
        {/* https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#canvas */}
        <Canvas
          pixelRatio={window.devicePixelRatio || 1}
          colorManagement
          shadowMap
          camera={{ position: [-5, 5, 5] }}
          onCreated={({ gl }) => {
            gl.physicallyCorrectLights = true
            // gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.outputEncoding = THREE.sRGBEncoding
          }}
          style={{
            background: '#5865F2',
          }}
        >
          <fog attach="fog" args={['floralwhite', 0, 20]} />
          <React.Suspense
            fallback={
              <Html center lang="en">
                <Loader />
              </Html>
            }
          >
            <Scene />
          </React.Suspense>

          {/* <Effects /> */}
          <OrbitControls />
        </Canvas>
      </ErrorBoundary>
    </main>
  )
}

MainScene.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
}

export default MainScene
