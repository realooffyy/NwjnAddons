/** 
 * @inspo https://github.com/DocilElm/Doc/blob/main/core/EventEnums.js
 */

export default (i => ({
    "Interval": i++,
    "ServerTick": i++,

    "EntityLoad": i++,
    // "EntityUnload": i++,
    "SpawnMob": i++,
    // "SpawnObject": i++,
    "EntityDeath": i++,

    // "ClientChat": i++,
    "ServerChat": i++,
    "MessageSent": i++,
    "ActionBarChange": i++,

    "SidebarChange": i++,
    "TabUpdate": i++,
    "TabAdd": i++,
    
    "WorldSound": i++,
    "HeldItemChange": i++,
    "InventoryUpdate": i++,

    "OpenContainer": i++,
    "CloseContainer": i++,
    "ContainerClick": i++
}))(0)
