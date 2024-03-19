// 插件功能描述:在每个console.xx 的时候  要打印它的行列号 比如 console.log('a') ---> console.log('filename: (2,0)','a')

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');

// console.log(types,'types--------------------')

const sourceCode = `
console.log(1);

function func() {
    console.info(2);
}

export default class Clazz {
    say() {
        console.debug(3);
    }
    render() {
        return <div>{console.error(4)}</div>
    }
}
`;



const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins:['jsx']
});

const codeTempalte = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`)



traverse(ast, {
    CallExpression(path, state) {    
      //   if ( types.isMemberExpression(path.node.callee) 
      //   && path.node.callee.object.name === 'console' 
      //   && ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name) 
      //  ) {
      //     const { line, column } = path.node.loc.start;
      //     path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
      //   }  

      // 简化判断
      const callName = generate(path.node.callee).code;
      if(codeTempalte.includes(callName)){
        const { line,column } = path.node.loc.start;
        path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
      }
    
    }
});

const { code, map } = generate(ast);

console.log(code);
