const promiseMap = new Map()
/**
 * 保证方法同步
 */
export default function () :any{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) :any{
        const method = descriptor.value
        descriptor.value = function (...args) :any{
            let cache = promiseMap.get(method)
            if(!cache){
                cache = method.apply(this, args)
                promiseMap.set(method, cache)
                cache.then(()=>promiseMap.delete(method))
            }
            return cache
        }
    }
}