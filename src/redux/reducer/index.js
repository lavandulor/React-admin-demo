/** 
 * Reducer 数据处理
 */
import { type } from './../action'
const initialState = {
    menuName: '首页',
    activeId: '0',
}

export default (state = initialState, action) => {
    switch(action.type){
        case type.SWITCH_MENU:
            return {
                ...state,
                menuName: action.menuName
            }
        case type.LIST_ACTIVE_ID:
            return {
                ...state,
                activeId: action.activeId
            }    
        default:
            return {...state}
    }
}