const importModule = require('@babel/helper-module-imports');

module.exports = function({types,template},options){
  return {
    visitor:{
      Program: {
        enter (path, state) {
            let trackerImportId = null
            let trackerAST = null
            path.traverse({
                ImportDeclaration (curPath) {
                    const requirePath = curPath.get('source').node.value;
                    if (requirePath === options.trackerPath) { // 如果已经导入
                        const specifierPath = curPath.get('specifiers.0');
                        if (specifierPath.isImportSpecifier()) {
                            trackerImportId = specifierPath.toString(); // 获取函
                        } else if(specifierPath.isImportNamespaceSpecifier()) {
                            trackerImportId = specifierPath.get('local').toString();
                        }
                        trackerAST = template.statement(`${trackerImportId}()`)()
                    }
                },
                'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(curPath) {
                    if(!trackerImportId){ // 如果没有就导入
                      trackerImportId  = importModule.addDefault(path, options.trackerPath,{
                        nameHint: path.scope.generateUid(options.trackerPath)
                      }).name;
                      trackerAST = template.statement(`${trackerImportId}()`)();
                    }
                    const bodyPath = curPath.get('body');
                    if (bodyPath.isBlockStatement()) { // 如果函数是块级作用域 自己插入函数
                        bodyPath.node.body.unshift(trackerAST);
                    } else { // 如果不是块级的 则替换函数内容
                        const ast = template.statement(`{${trackerImportId}();return PREV_BODY;}`)({PREV_BODY: bodyPath.node});
                        bodyPath.replaceWith(ast);
                    }
                }                
            });
        }
      },
    }
  }
}