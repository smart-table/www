import buble from 'rollup-plugin-buble';
import node from 'rollup-plugin-node-resolve';

export default {
	input: "./src/examples/index.js",
	plugins: [
		node({jsnext: true}),
		buble({
			jsx: 'h',
			target: {chrome: 52},
			objectAssign: 'Object.assign'
		})
	],
	output: {
		file: './src/assets/demo.js',
		name: 'demo',
		format: 'iife'
	}
};
