// 插件功能描述: 删除console.xxx

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');

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
  plugins:['jsx'] // 代码里面有jsx
});

const codeTempalte = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`)



traverse(ast, {
    CallExpression(path, state) {    
    
      // 简化判断
      const callName = generate(path.node.callee).code;

      if(codeTempalte.includes(callName)){
        if(path.findParent(p => p.isJSXExpressionContainer())){ // 如果是jsx中的console.xx着替换问''
          path.replaceWith(types.stringLiteral(''))
        }else{
          path.remove()
        }
      }
    }
});

const { code, map } = generate(ast);

console.log(code);
