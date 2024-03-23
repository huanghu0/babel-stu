const fs = require('node:fs')
const path = require('node:path')
const parse = require('@babel/parser')
const { transformFromAstSync } = require('@babel/core')
const autoTrackPlugin = require('./plugin/auto-track-plugin')
const sourceCode = fs.readFileSync(path.join(__dirname,'./sourceCode.js'),{
  encoding:'utf-8'
})

const ast = parse.parse(sourceCode,{
  sourceType:'unambiguous'
})

const { code } = transformFromAstSync(ast,sourceCode,{
  plugins:[[autoTrackPlugin,{
    trackerPath:'tracker'
  }]],

})

console.log(code)