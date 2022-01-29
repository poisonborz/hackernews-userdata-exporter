
import path from 'path'

const __dirname = process.env.PWD

// commonjs compilation needed for pkg, which does not support ES modules at time of writing

export default {
    mode: 'production',
    entry: path.join(__dirname, 'src', 'exporter', 'node_run.js'),
    target: 'node',
    output: {
        path: path.join(__dirname, 'temp'),
        filename: 'build.js',
        chunkFormat: 'commonjs',
        clean: true
    }
}
