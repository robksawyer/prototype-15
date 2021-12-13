/**
 * RainbowTunnel.jsx
 */
 import * as React from 'react';

 // Component(s)
 import RainbowTunnel from './RainbowTunnel';

 export default {
   title: 'RainbowTunnel',
   component: RainbowTunnel,
   // Sets the layout parameter component wide.
   parameters: {
     layout: 'centered',
   },
 };

 export const Default = () => <RainbowTunnel />;

 Default.storyName = 'default';
