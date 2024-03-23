const { transformSync } = require('@babel/core');
const fs = require('node:fs');
const path = require('path');
const addConsoleBeforeConsolelugin = require('./core');


const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'),{
  encoding:'utf-8'
})

const { code } = transformSync(sourceCode, {
    plugins: [addConsoleBeforeConsolelugin],
    parserOpts: {
      sourceType: 'unambiguous',
      plugins: ['jsx']       
    }    
});

console.log(code);