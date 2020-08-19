import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
    state:{
        tempDenomId:'',
    },
    mutations:{
        SET_TEMP_DENOM_ID(state,data){
            state.tempDenomId = data
        }
    }
});
export default store
