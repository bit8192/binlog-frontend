import CommonUtils from "@/utils/CommonUtils";

export default class DateUtils{
    static INTERVAL_1_HOUR = 3600000;
    static INTERVAL_8_HOUR = DateUtils.INTERVAL_1_HOUR * 8;
    static INTERVAL_1_DAY = DateUtils.INTERVAL_8_HOUR * 3;
    static DATE_NUMBER_OF_MONTH = [31, [28, 29], 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    static FORMAT_KEYWORDS: Array<{keywords: string, replace: (date: Date)=>string}> = [
        {keywords: "yyyy", replace: (date:Date):string=>date.getFullYear().toFixed(0)},
        {keywords: "MM", replace: (date:Date):string=>CommonUtils.formatInteger(date.getMonth() + 1, 2)},
        {keywords: "dd", replace: (date:Date):string=>CommonUtils.formatInteger(date.getDate(), 2)},
        {keywords: "HH", replace: (date:Date):string=>CommonUtils.formatInteger(date.getHours(), 2)},
        {keywords: "mm", replace: (date:Date):string=>CommonUtils.formatInteger(date.getMinutes(), 2)},
        {keywords: "ss", replace: (date:Date):string=>CommonUtils.formatInteger(date.getSeconds(), 2)},
    ]

    /**
     * 格式化时间
     * @param date
     * @param formatter
     */
    static format(date: string | Date | number, formatter = "yyyy-MM-dd HH:mm:ss"): string{
        let result = formatter;
        date = new Date(date);
        for (const formatKeywords of this.FORMAT_KEYWORDS) {
            let index = 0;
            while((index = result.indexOf(formatKeywords.keywords, index)) > -1){
                const replaceContent = formatKeywords.replace(date);
                result = result.substr(0, index) + replaceContent + result.substr(index + formatKeywords.keywords.length);
                index = index + replaceContent.length;
            }
        }
        return result;
    }

    /**
     * 格式化年月
     * @param date
     */
    static formatMonth(date: string | Date | number): string {
        date = new Date(date);
        return `${date.getFullYear()}-${CommonUtils.formatInteger(date.getMonth() + 1, 2)}`;
    }

    /**
     * 格式化日期
     * @param date
     */
    static formatDate(date?: string | Date | number): string{
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

    /**
     * 清除时间部分，即将时间清0
     */
    static clearTime(date: Date): Date{
        if(date.getHours() > 8){
            return new Date(date.getTime() - date.getTime() % this.INTERVAL_1_DAY - this.INTERVAL_8_HOUR)
        }
        return new Date(date.getTime() - (date.getTime() + this.INTERVAL_8_HOUR) % this.INTERVAL_1_DAY)
    }

    /**
     * 今天0点
     */
    static today(): Date{
        return this.clearTime(new Date())
    }

    /**
     * 明天
     */
    static tomorrow(): Date{
        return new Date(this.today().getTime() + this.INTERVAL_1_DAY)
    }

    /**
     * 昨天
     */
    static yesterday(): Date{
        return new Date(this.today().getTime() - this.INTERVAL_1_DAY);
    }

    /**
     * 这周一
     */
    static thisMonday(): Date{
        const today = this.today();
        return new Date(today.getTime() + (1 - today.getDay()) * this.INTERVAL_1_DAY);
    }

    /**
     * 上周一
     */
    static lastMonday(): Date{
        return new Date(this.thisMonday().getTime() - this.INTERVAL_1_DAY * 7)
    }

    /**
     * 这个月1号
     */
    static thisMonth(): Date{
        const today = this.today();
        return new Date(today.getTime() - (today.getDate() - 1) * this.INTERVAL_1_DAY);
    }

    /**
     * 上个月1号
     */
    static lastMonth(): Date{
        const date = this.thisMonth();
        const thisMonth = date.getMonth();//这个月的月份
        const lastMonth = thisMonth < 1 ? 11 : thisMonth - 1;//上个月的月份
        //上个月天数
        const lastMonthDateNum = this.getMonthDateNum(date.getFullYear(), lastMonth);
        return new Date(date.getTime() - lastMonthDateNum * this.INTERVAL_1_DAY);
    }

    /**
     * 获取该月份的天数
     */
    static getMonthDateNum(year: number, month: number): number{
        return month == 1 ? (this.isLeapYear(year) ? this.DATE_NUMBER_OF_MONTH[1][1] : this.DATE_NUMBER_OF_MONTH[1][0]) : this.DATE_NUMBER_OF_MONTH[month];
    }

    /**
     * 今年1月1号
     */
    static thisYear(): Date{
        const date = this.thisMonth();
        let dateNum = 0;
        for (let i = date.getMonth() - 1; i > -1; i--) {
            dateNum += this.getMonthDateNum(date.getFullYear(), i);
        }
        return new Date(date.getTime() - dateNum * this.INTERVAL_1_DAY);
    }

    /**
     * 去年1月1号
     */
    static lastYear(): Date{
        const thisYear = this.thisYear();
        return new Date(thisYear.getTime() - (this.isLeapYear(thisYear.getFullYear() - 1) ? 366 : 365) * this.INTERVAL_1_DAY);
    }

    /**
     * 是否为闰年
     */
    static isLeapYear(year: number): boolean{
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
    }
}
