export default interface ElementPosition{
    //offset 是计算了滚动条的位置
    offsetLeft: number
    offsetTop: number
    //client 减掉了滚动条位置
    clientLeft: number
    clientTop: number
}