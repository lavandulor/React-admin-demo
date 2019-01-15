/** 
 * Action 类型
 * 
 */

export const type = {
    SWITCH_MENU: 'SWITCH_MENU',
    LIST_ACTIVE_ID: 'LIST_ACTIVE_ID'
}

export function switchMenu(menuName){
    return {
        type: type.SWITCH_MENU,
        menuName
    }
}

export function changeActiveId(activeId){
    return {
        type: type.LIST_ACTIVE_ID,
        activeId
    }
}