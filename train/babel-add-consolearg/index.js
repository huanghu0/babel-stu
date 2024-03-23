const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const fs = require('node:fs');
const path = require('path');
const addConsoleArgPlugin = require('./core');


const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'),{
  encoding:'utf-8'
})

const ast = parser.parse(sourceCode,{
  sourceType:'unambiguous',
  plugins:['jsx']
})



const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [addConsoleArgPlugin]
});

console.log(code);