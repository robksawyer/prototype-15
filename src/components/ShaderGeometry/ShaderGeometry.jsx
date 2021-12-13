/**
 * @file ShaderGeometry.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'

import { useTweaks } from 'use-tweaks'
import { extend } from 'react-three-fiber'
import { Color } from 'three'
import { useSubdivision, shaderMaterial } from '@react-three/drei'

import styles from './ShaderGeometry.module.css'

import vertex from './shaders/colorShift/colorShift.vert'
import fragment from './shaders/colorShift/colorShift.frag'

const ColorShiftMaterial = shaderMaterial({
  uniforms: {
    time: {
      value: 0,
    },
    color: {
      value: new Color(0.2, 0.0, 0.1),
    },
  },
  vertexShader: vertex,
  fragmentShader: fragment,
})

extend({ ColorShiftMaterial })

const Everything = () => {
  const mesh = useSubdivision(Math.PI / 0.5)

  const { time } = useTweaks({
    time: { value: 1, min: 0, max: 1 },
  })

  useFrame(({ clock, mouse }) => {
    mesh.current.material.uniforms['time'].value = clock.getElapsedTime()
  })

  return (
    <mesh ref={mesh} position={[0, 2.5, 0]} castShadow>
      <boxGeometry />
      <colorShiftMaterial attach="material" color="black" time={time} />
    </mesh>
  )
}

const ShaderGeometry = (props) => {
  return <Everything />
}

ShaderGeometry.propTypes = {}

ShaderGeometry.defaultProps = {}

export default ShaderGeometry
