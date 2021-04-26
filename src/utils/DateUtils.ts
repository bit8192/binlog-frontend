import CommonUtils from "@/utils/CommonUtils";

export default class DateUtils{
    /**
     * 格式化日期
     * @param date
     */
    static formatDate(date: string | Date | number): string{
        date = new Date(date);
        return `${date.getFullYear()}-${CommonUtils.formatInteger(date.getMonth() + 1, 2)}-${CommonUtils.formatInteger(date.getDate(), 2)}`;
    }

    /**
     * 格式化时间
     * @param date
     */
    static formatTime(date: string | Date | number): string{
        date = new Date(date);
        return `${CommonUtils.formatInteger(date.getHours(), 2)}-${CommonUtils.formatInteger(date.getMinutes(), 2)}-${CommonUtils.formatInteger(date.getSeconds(), 2)}`;
    }

    /**
     * 格式化日期时间
     * @param date
     */
    static formatDateTime(date: string | Date | number): string{
        return this.formatDate(date) + " " + this.formatTime(date);
    }
}