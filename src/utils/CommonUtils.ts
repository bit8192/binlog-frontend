
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
     * 格式化小数
     * @param num
     * @param len 小数点后保留几位
     */
    static formatDecimal(num: number, len: number): string{
        const result = num.toString()
        const dotIndex = result.indexOf(".");
        if(dotIndex == -1){
            return result + "." + [...Array(len)].map(()=>"0").join()
        }else{
            const dec = result.substr(dotIndex + 1);
            if(dec.length > len){
                return result.substr(0, dotIndex + 1) + dec.substr(0, len)
            }else{
                return result.substr(0, dotIndex + 1) + dec + [...Array(len - dec.length)].map(()=>"0").join()
            }
        }
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

    /**
     * 空函数, 一般用于忽略catch
     */
    static emptyFun() : void{
        /*empty*/
    }

    /**
     * 将字节大小转为人类可读
     * @param size
     */
    static humanReadableSize(size: number): string{
        if(size > 1024*1024*1024*1024){
            return Math.floor(size/(1024*1024*1024*1024) * 100)/100 + "TB"
        }else if(size > 1024*1024*1024){
            return Math.floor(size/(1024*1024*1024) * 100)/100 + "GB"
        }else if(size > 1024*1024){
            return Math.floor(size/(1024*1024) * 100)/100 + "MB"
        }else if(size > 1024){
            return Math.floor(size/1024 * 100)/100 + "KB"
        }else {
            return size + "B"
        }
    }
}
