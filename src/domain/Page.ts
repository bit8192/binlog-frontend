export default interface Page<T>{
    content: T[]
    first: boolean
    last: boolean
    number: number
    size: number
    numberOfElements: number
    totalPages: number
    totalElements: number
}