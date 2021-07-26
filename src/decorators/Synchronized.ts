const promiseMap = new Map()
/**
 * 保证方法同步
 */
export default function () :any{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) :any{
        const method = descriptor.value
        descriptor.value = function (...args) :any{
            let result = promiseMap.get(method)
            if(!result){
                result = method.apply(this, args);
                if(result instanceof Promise){
                    result.finally(()=>{
                        if(promiseMap.get(method) === result){
                            promiseMap.delete(method)
                        }
                    })
                    promiseMap.set(method, result)
                }
            }else{
                result = result.finally(()=>{
                    if(promiseMap.get(method) === result){
                        promiseMap.delete(method)
                    }
                    return method.apply(this, args)
                })
                promiseMap.set(method, result)
            }
            return result
        }
    }
}
