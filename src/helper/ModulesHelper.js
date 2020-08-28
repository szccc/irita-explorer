export const moduleSupport = function m(moduleId, navFuncList){
    if (navFuncList && 
        navFuncList.length && 
        moduleId) {
        for(let item of navFuncList){
            if (String(item.id) == String(moduleId)) {
                return true;
            }else if(item.children && item.children.length){
                if (m(moduleId, item.children)) {return true;}
            }
        }
    }
    return false;
}