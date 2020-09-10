const isDev = process.env.NODE_ENV === 'development'

const vue = require('rollup-plugin-vue')
const nodeResolve = require('rollup-plugin-node-resolve')
const json = require('rollup-plugin-json')
const uglify = require('rollup-plugin-terser').terser
const commonJs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const license = require('rollup-plugin-license')
const postcss = require('rollup-plugin-postcss')

module.exports = {
    input: './resources/js/main.js',
    output: {
        file: './dist/js/main.js',
        format: 'iife'
    },
    plugins: [
        vue({
            css: false,
            template: {
                compilerOptions: {
                    whitespace: 'condense',
                    preserveWhitespace: false
                }
            }
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        commonJs({
            include: 'node_modules/**'
        }),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        json(),
        postcss()
    ]
}

if ( ! isDev ) {
    module.exports.plugins = module.exports.plugins.concat([
        uglify(),
        license({
            banner: "Bundle of AWEMA <%= pkg.name %> \n Generated: <%= moment().format('YYYY-MM-DD HH:mm:ss') %> \n Version: <%= pkg.version %>"
        })
    ])
}
