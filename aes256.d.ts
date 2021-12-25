declare module "aes256" {
    import * as Buffer from "buffer";

    export function encrypt<T=string|Buffer>(key: string, content: T): T
    export function decrypt<T=string|Buffer>(key: string, content: T): T
}
