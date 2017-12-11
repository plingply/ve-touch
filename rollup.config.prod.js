import json from 'rollup-plugin-json';
import progress from 'rollup-plugin-progress'
import postcss from 'rollup-plugin-postcss'
import cssnext from 'postcss-cssnext'
//允许使用变量
import vars from 'postcss-simple-vars'
//css嵌套
import nested from 'postcss-nested'
//加供应商前缀
import autoprefixer from 'autoprefixer'
//去css 空格
import clean from 'postcss-clean'
//可提供导入css
import atImport from 'postcss-import'
//转es5
import buble from 'rollup-plugin-buble';
import html from 'rollup-plugin-html'
//
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace'
import license from 'rollup-plugin-license'

import { version } from './package.json';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/index.js',
        format: 'umd'
    },
    moduleName: 'veTouch',
    plugins: [
        license({
            banner: `ve-touch ${version}\n created at ${new Date()}`
        }),
        json(),
        progress({
            clearLine: false
        }),
        postcss({
            plugins: [
                atImport(),
                cssnext({
                    warnForDuplicates: false
                }),
                // vars(),
                // nested(),
                autoprefixer(),
                clean()
            ],
            extensions: ['.css', '.pcss']
        }),
        html({
            include: "**/*.html",
            htmlMinifierOptions: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                conservativeCollapse: true
            }
        }),
        replace({
            VERSION: version
        }),
        resolve({
            jsnext: true
        }),
        commonjs({
            include: 'node_modules/lrz/**'
        }),
        buble({
            include: '**/*.js'
        })
    ]
};