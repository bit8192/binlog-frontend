import SortOrder from "@/domain/SortOrder";

export default interface Pageable{
    page: number
    size: number
    sort?: SortOrder[]
}

export function pageable2RequestParameters(pageable: Pageable): any{
    return {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort ? pageable.sort.map(o=>o.name + (o.direction ? "" : "," + o.direction)) : undefined
    }
}