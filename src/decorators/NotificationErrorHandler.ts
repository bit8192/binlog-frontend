import {Notification} from "element-ui";

function processError(e, type: "info" | "warning" | "success" | "error", isCatch: boolean, isPrint: boolean) {
    if (e && e.tipMsg) {
        Notification[type](e.tipMsg)
    }
    if (isCatch) {
        isPrint && console.error(e)
    } else {
        throw e
    }
}

/**
 * 捕获到异常时，弹出提示框提示
 * @param type 提示类型
 * @param isCatch 是否捕获（是否不再向上层抛出）
 * @param isPrint 是否打印
 */
export default function (type: "info" | "warning" | "success" | "error" = "error", isCatch = true, isPrint = true) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): any{
        const oldMethod = descriptor.value
        descriptor.value = function (...args) {
            try {
                const result = oldMethod.call(this, ...args)
                if(result instanceof Promise){
                    result.catch(e=>processError(e, type, isCatch, isPrint))
                }
                return result
            }catch (e) {
                processError(e, type, isCatch, isPrint);
            }
        }
    }
}