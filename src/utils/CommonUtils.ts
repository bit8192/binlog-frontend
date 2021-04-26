import ElementPosition from "@/domain/ElementPosition";

export default class CommonUtils{
    /**
     * 格式化数值, 只支持正整数
     * @param num
     * @param len
     */
    static formatInteger(num: number, len: number): string{
        num = Math.abs(parseInt(num.toString()));
        const numStr = num.toString();
        const currLen = numStr.length;
        if(currLen >= len) return numStr;
        return [...new Array(len - currLen)].map(()=>"0").join() + numStr;
    }

    /**
     * 获取元素相对位置
     * @param target 目标元素
     * @param relativeTarget 相对目标元素
     */
    static getElementPosition(target: HTMLElement, relativeTarget: Element = document.scrollingElement): ElementPosition{
        const result:ElementPosition = {x:0, y:0}
        while (target && target !== relativeTarget && target !== target.parentElement){
            result.x += target.offsetLeft
            result.y += target.offsetTop
            target = target.offsetParent as HTMLElement
        }
        return result
    }

    /**
     * map 转 object
     * @param map
     */
    static map2obj(map: Map<unknown, unknown>): unknown{
        const result = {};
        for (const [k, v] of map) {
            switch (typeof k){
                case "string":
                case "number":
                    result[k] = v
                    break
                default:
                    break
            }
        }
        return result
    }
}