/**
 * 可弹出提示的异常
 */
export default class NotificationError extends Error{
    tipMsg: string
    constructor(message: string, tipMsg: string = message) {
        super(message);
        this.tipMsg = tipMsg
    }
}