// 插件功能描述:在每个console.xx 的时候  在它之前打印console.log(行号,列号) 比如 console.log('a') ---> console.log('filename: (2,0):') console.log('a')

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

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
      if (path.node.isNew) { // 是新生成的节点不做处理
        return;
      }       
      // 简化判断
      const callName = generate(path.node.callee).code;
      if(codeTempalte.includes(callName)){
        
        const { line, column } = path.node.loc.start;

        // 使用template生成ast 
        const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();

        // 创建要插入的 console.log 语句 ast
        // const newNode = types.callExpression(
        //   types.memberExpression(types.identifier('console'), types.identifier('log')),
        //   [types.stringLiteral(`filename: (${line}, ${column})`)]
        // );
        
        newNode.isNew = true; // 用来标记是新生成的节点,深度递归遍历的时候 新生成的节点也会遍历

        if (path.findParent(path => path.isJSXElement())) { // dom节点替换
          path.replaceWith(types.arrayExpression([newNode, path.node]))
          path.skip(); 
        } else {
          path.insertBefore(newNode);
        }
      }
    
    }
});

const { code, map } = generate(ast);

console.log(code);
