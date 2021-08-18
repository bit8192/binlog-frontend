import ElementPosition from "@/domain/ElementPosition";

export default class ElementUtils{
    /**
     * 获取元素相对位置
     * @param target 目标元素
     * @param relativeTarget 相对目标元素
     */
    static getElementPosition(target: HTMLElement, relativeTarget: Element = document.body): ElementPosition{
        const result:ElementPosition = {offsetLeft:0, offsetTop:0, clientLeft: 0, clientTop: 0}
        while (target && target !== relativeTarget && target !== target.parentElement){
            if(target.offsetLeft !== undefined && target.offsetTop !== undefined){
                result.offsetLeft += target.offsetLeft
                result.offsetTop += target.offsetTop
                result.clientLeft += target.offsetLeft - target.scrollLeft
                result.clientTop += target.offsetTop - target.scrollTop
            }
            target = target.offsetParent as HTMLElement
        }
        result.clientLeft -= document.scrollingElement.scrollLeft
        result.clientTop -= document.scrollingElement.scrollTop
        return result
    }

    /**
     * 判断一个节点是否是另一个节点的子节点
     * @param target
     * @param parent
     */
    static inElement(target: HTMLElement, parent: HTMLElement): boolean{
        while (target){
            target = target.parentElement
            if(parent === target) return true
        }
        return false
    }

    /**
     * 获取剩余滚动距离
     * @param target 目标
     */
    static getScrollSurplus(target: HTMLElement = document.scrollingElement as HTMLElement): number{
        return target.scrollHeight - target.scrollTop - target.clientHeight
    }
}
