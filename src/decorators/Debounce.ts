/**
 * 节流, 方法将延迟执行，在延迟期间重复调用方法只会重置延迟时间
 * 节流后方法将不会返回数据
 * @param timeout 延迟时长
 */
export default function (timeout = 200) :any{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) :any{
        const method = descriptor.value
        let timeoutId = -1
        descriptor.value = function (...args) :void{
            if(timeoutId > 0){
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(()=>{
                timeoutId = -1
                method.apply(this, args)
            }, timeout)
        }
    }
}