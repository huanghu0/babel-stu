const generate = require('@babel/generator').default;
const codeTempalte = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

module.exports = function({types,template}){
  return {
    visitor:{
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
    }
  }
}