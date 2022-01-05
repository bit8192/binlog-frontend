export * from "@vue/runtime-dom"
declare module "@vue/runtime-core" {
    import {Store} from "vuex";
    import {BinlogStore} from "@/createStore";

    interface ComponentCustomProperties {
        $store: Store<BinlogStore>
    }
}
