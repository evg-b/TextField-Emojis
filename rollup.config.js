import { terser } from 'rollup-plugin-terser';

export default {
    input: 'dist/index.js',
    output: [
        {
            file: 'bundle.js',
            format: 'umd',
            sourcemap: false,
            plugins: [terser()]
        }
    ]
};