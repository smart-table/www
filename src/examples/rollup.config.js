import buble from 'rollup-plugin-buble';
import node from 'rollup-plugin-node-resolve';

export default {
  entry: "./src/examples/index.js",
  plugins: [
    node({jsnext: true}),
    buble({
      jsx: 'h',
      target: {chrome: 52},
      objectAssign: 'Object.assign'
    })
  ],
  dest: "./src/assets/demo.js",
  moduleName: "demo",
  format: "iife"
};
