/**
 * @file ASCIIGalaxy.js
 */
import * as React from 'react';
import PropTypes from 'prop-types';

import { useWindowSize } from '@/hooks/useWindowSize';
import { useLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import styles from './ASCIIGalaxy.module.css';

/* Scale a value from one range to another
 * Example of use:
 *
 * // Convert 33 from a 0-100 range to a 0-65535 range
 * var n = scaleValue(33, [0,100], [0,65535]);
 *
 * // Ranges don't have to be positive
 * var n = scaleValue(0, [-50,+50], [0,65535]);
 *
 * Ranges are defined as arrays of two values, inclusive
 *
 * The ~~ trick on return value does the equivalent of Math.floor, just faster.
 *
 */
const scaleValue = (value, from, to) => {
  var scale = (to[1] - to[0]) / (from[1] - from[0]);
  var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return ~~(capped * scale + to[0]);
};

const ASCIIGalaxy = ({
  tagName: Tag = 'pre',
  className = 'absolute top-0 left-0 flex items-center justify-center w-screen h-screen overflow-hidden font-mono text-white opacity-50',
  variant = 'default',
  width: tWidth,
  height: tHeight,
  stars = 10,
  trails = 20,
  ds = ' ',
}) => {
  const { height: _height, width: _width } = useWindowSize();
  const [galaxy, setGalaxy] = React.useState('');

  const field = React.useRef([]);

  /**
   * createField
   */
  const createField = React.useCallback(
    ({ width, height }) => {
      for (var y = 0; y < height; y++) {
        field.current[y] = [];
        for (var x = 0; x < width; x++) {
          field.current[y][x] = ds;
        }
      }
    },
    [field, ds],
  );

  /**
   * buildTrail
   * @param {*} props
   * @returns
   */
  const buildTrail = React.useCallback(
    ({ width, height, symbols = ['.', '_', '-', '~', '°', '+'] }) => {
      try {
        var ys = Math.floor(Math.random() * height);
        var xs = Math.floor(Math.random() * width);
        var len = Math.floor(Math.random() * (width - xs - 1) + 1);
        var yc = 0;

        for (var i = 0; i < len; i++) {
          var rndSym = Math.floor(Math.random() * symbols.length);
          var rndY = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
          if (rndY == 1) {
            yc += 1;
          } else if (rndY == 2) {
            yc -= 1;
          } else {
            yc = yc;
          }

          if (ys + yc > height || ys - yc < 0) return;
          try {
            field.current[ys + yc][xs + i] = symbols[rndSym];
          } catch (e) {
            console.log(e);
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
    [field],
  );

  /**
   * buildStar
   * @param {*} props
   */
  const buildStar = React.useCallback(
    ({ width, height }) => {
      try {
        var rndStar = Math.floor(Math.random() * 6);
        var ys = Math.floor(Math.random() * height);
        var xs = Math.floor(Math.random() * width);
        if (
          ys + 1 > height - 1 ||
          ys - 1 < 0 ||
          xs + 1 > width - 1 ||
          xs - 1 < 0
        ) {
          field.current[ys][xs] = ds;
        } else {
          switch (rndStar) {
            case 0:
              //  |
              // -o-
              //  |
              field.current[ys][xs] = 'o';
              field.current[ys + 1][xs] = '|';
              field.current[ys - 1][xs] = '|';
              field.current[ys][xs + 1] = '-';
              field.current[ys][xs - 1] = '-';
              break;
            case 1:
              field.current[ys][xs] = '.';
              break;
            case 2:
              field.current[ys][xs] = `'`;
              break;
            case 3:
              field.current[ys][xs] = '~';
              field.current[ys][xs + 1] = '°';
              break;
            case 4:
              field.current[ys][xs] = ',';
              break;
            case 5:
              field.current[ys][xs] = '+';
              break;
            default:
              field.current[ys][xs] = '*';
              break;
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
    [field, ds],
  );

  /**
   * render
   * @returns
   */
  const render = React.useCallback(
    ({ width, height }) => {
      let _galaxy = '';
      for (var y = 0; y < height; y++) {
        if (!y == 0) _galaxy += '\n';
        for (var x = 0; x < width; x++) {
          _galaxy += field.current[y][x];
        }
      }
      return _galaxy;
    },
    [field],
  );

  useLayoutEffect(() => {
    if (!galaxy && _width && _height) {
      // let width = tWidth || _width;
      // let height = tHeight || _height;
      let width = scaleValue(
        tWidth || _width,
        [0, tWidth || _width],
        [30, 200],
      );
      let height = scaleValue(
        tHeight || _height,
        [0, tHeight || _height],
        [10, 50],
      );

      createField({ width, height });

      for (var i = 0; i < trails; i++) {
        buildTrail({ width, height });
      }

      for (var i = 0; i < stars; i++) {
        buildStar({ width, height });
      }

      const data = render({ width, height });
      setGalaxy(data);
    }
  }, [
    galaxy,
    ds,
    field,
    buildStar,
    buildTrail,
    createField,
    render,
    tHeight,
    tWidth,
    _height,
    _width,
    stars,
    trails,
  ]);

  // React.useEffect(() => {
  //   const int = setInterval(() => setGalaxy(null), 2000);

  //   return () => clearInterval(int);
  // }, []);

  return (
    <Tag
      className={`${styles.a_s_c_i_i_galaxy} ${
        styles[`a_s_c_i_i_galaxy__${variant}`]
      } ${className}`}
    >
      <code>{`${galaxy}`}</code>
    </Tag>
  );
};

ASCIIGalaxy.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
};

export default ASCIIGalaxy;
