/**
 * 服务器上传的文件
 */
export default interface UploadFile{
    id?: string
    url?: string
    name?: string
    suffix?: string
    size?: number
    mediaType?: string
}