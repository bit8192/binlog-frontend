import {Store, createStore as createVuexStore} from "vuex";
import UserInfo from "@/domain/UserInfo";
import SystemProfile from "@/domain/SystemProfile";

export interface BinlogStore {
    isLogged: boolean
    userInfo?: UserInfo
    isHappy: boolean
    systemProfile?: SystemProfile
}
export const MUTATION_IS_LOGGED = "isLogged";
export const MUTATION_USER_INFO = "userInfo";
export const MUTATION_IS_HAPPY = "isHappy";
export const MUTATION_SYSTEM_PROFILE = "systemProfile";

export default function createStore(): Store<BinlogStore>{
    return createVuexStore({
        state(): BinlogStore{
            return {
                isLogged: false,
                isHappy: false,
            };
        },
        mutations: {
            [MUTATION_IS_LOGGED](state: BinlogStore, value: boolean){
                state.isLogged = value;
            },
            [MUTATION_USER_INFO](state: BinlogStore, value: UserInfo){
                state.userInfo = value;
            },
            [MUTATION_IS_HAPPY](state: BinlogStore, value: boolean){
                state.isHappy = value;
            },
            [MUTATION_SYSTEM_PROFILE](state: BinlogStore, value: SystemProfile){
                state.systemProfile = value;
            },
        }
    })
}
