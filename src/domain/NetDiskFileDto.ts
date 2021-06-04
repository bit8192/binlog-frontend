export default interface NetDiskFileDto{
    id?: number
    name?: string
    parentId?: number
    everyoneReadable?: boolean
    everyoneWritable?: boolean
    readableUserList?: number[]
    writableUserList?: number[]
}