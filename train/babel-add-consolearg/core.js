const generate = require('@babel/generator').default;
const codeTempalte = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

module.exports = function({types,template}){
  return {
    visitor:{
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
    }
  }
}