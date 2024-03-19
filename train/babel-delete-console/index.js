const { transformFileSync } = require('@babel/core');
const deleteConsolePlugin = require('./core');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
    plugins: [deleteConsolePlugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx']       
    }
});

console.log(code);