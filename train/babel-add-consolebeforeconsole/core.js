const generate = require('@babel/generator').default;
const codeTempalte = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

module.exports = function({types,template}){
  return {
    visitor:{
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
    }
  }
}