/**
 * ASCIIGalaxy.jsx
 */
 import * as React from 'react';

 // Component(s)
 import ASCIIGalaxy from './ASCIIGalaxy';

 export default {
   title: 'ASCIIGalaxy',
   component: ASCIIGalaxy,
   // Sets the layout parameter component wide.
   parameters: {
     layout: 'centered',
   },
 };

 export const Default = () => <ASCIIGalaxy />;

 Default.storyName = 'default';
