/**
 * @file MainScene.js
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import useErrorBoundary from 'use-error-boundary';
import { Stats } from '@react-three/drei';

import RainbowTunnel from '@/components/RainbowTunnel';

import styles from './MainScene.module.css';

const MainScene = ({
  className = 'fixed top-0 left-0 w-screen h-screen bg-black',
  variant = 'default',
}) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

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
        <RainbowTunnel />
      </ErrorBoundary>
    </main>
  );
};

MainScene.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
};

export default MainScene;
