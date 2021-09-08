import Vue from "vue";
import Vuex, {Store} from "vuex";

Vue.use(Vuex)
export default function createStore(): Store<any>{
    return new Vuex.Store({
        state: {
            msg: ""
        },
        mutations: {
            setMsg: state => {
                state.msg = "hello world"
            }
        }
    })
}
