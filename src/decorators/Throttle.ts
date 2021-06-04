/**
 * 防抖，防抖后方法将被延迟调用，在延迟期间继续调用方法将被丢弃
 * 防抖后方法将不会返回数据
 * @param timeout 延迟时长
 */
export default function (timeout = 200) :any{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) :void{
        const method = descriptor.value
        let timeoutId = -1
        descriptor.value = function (...args) :void{
            if(timeoutId < 0){
                timeoutId = setTimeout(()=>{
                    timeoutId = -1
                    method.apply(this, args)
                }, timeout)
            }
        }
    }
}