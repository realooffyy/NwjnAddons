/** 
 * Virtually entirely taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/CustomRegisters.js
 */

import { scheduleTask } from "../../utils/Ticker"
import TextUtil from "../../core/static/TextUtil"
import ItemUtil from "../../core/static/ItemUtil"
import EventList from "./EventList";

export const registerMap = new Map()

const createEvent = (id, invokeFn) => registerMap.set(id, invokeFn)

// Constant used to get the packet's ENUMS
// and also filter the class in packetReceived event
const S38PacketPlayerListItem = net.minecraft.network.play.server.S38PacketPlayerListItem

createEvent(EventList.Interval, (fn, interval) => {
    const reg = register("step", fn)

    if (interval >= 1) reg.setDelay(interval)
    return reg.setFps(1 / interval)
})

createEvent(EventList.ServerTick, (fn) =>
    register("packetReceived", (packet) => {
        if (packet.func_148890_d() <= 0) fn()
    }).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
)

createEvent(EventList.EntityLoad, (fn, clazz) => 
    register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
        const entity = event.entity
        if (clazz && !(entity instanceof clazz)) return
    
        const entityID = entity.func_145782_y()
        fn(entity, entityID)
    })
)

createEvent(EventList.SpawnMob, (fn, clazz) =>
    register("packetReceived", (packet) => {
        scheduleTask(() => {
            const entityID = packet.func_149024_d()
            const entity = World.getWorld().func_73045_a(entityID)
            if (clazz && !(entity instanceof clazz)) return

            fn(entity, entityID)
        })
    }).setFilteredClass(net.minecraft.network.play.server.S0FPacketSpawnMob)
)

createEvent(EventList.EntityDeath, (fn, clazz) =>
    register("entityDeath", (entity) => {
        if (clazz && !(entity.entity instanceof clazz)) return

        fn(entity, entity.entity)
    })
)

createEvent(EventList.ServerChat, (fn, criteria = "") => 
    register("packetReceived", (packet, event) => {
        // Check if the packet is for the actionbar
        if (packet.func_148916_d()) return

        const chatComponent = packet.func_148915_c()        
        const formatted = chatComponent?.func_150254_d()
        const unformatted = formatted?.removeFormatting()
    
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted, chatComponent)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)
)

createEvent(EventList.MessageSent, (fn, criteria) => 
    register("messageSent", (msg, event) => {
        TextUtil.matchesCriteria(fn, criteria, msg, event)
    })
)

createEvent(EventList.ActionBarChange, (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        // Check if the packet is for the actionbar
        if (!packet.func_148916_d()) return

        const chatComponent = packet.func_148915_c()        
        const formatted = chatComponent?.func_150254_d()
        const unformatted = formatted?.removeFormatting()
        
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)
)

createEvent(EventList.SidebarChange, (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const channel = packet.func_149307_h()

        if (channel !== 2) return

        const teamStr = packet.func_149312_c()
        const teamMatch = teamStr.match(/^team_(\d+)$/)

        if (!teamMatch) return

        const formatted = packet.func_149311_e().concat(packet.func_149309_f())
        const unformatted = formatted.removeFormatting()

        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
    }).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams)
)

createEvent(EventList.TabUpdate, (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const players = packet.func_179767_a() // .getPlayers()
        const action = packet.func_179768_b() // .getAction()

        if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) return

        players.forEach(addPlayerData => {
            const name = addPlayerData.func_179961_d() // .getDisplayName()
            
            if (!name) return

            const formatted = name.func_150254_d() // .getFormattedText()
            const unformatted = formatted.removeFormatting()
        
            if (action !== S38PacketPlayerListItem.Action.UPDATE_DISPLAY_NAME) return

            TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
        })
    }).setFilteredClass(S38PacketPlayerListItem)
)

createEvent(EventList.TabAdd, (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const players = packet.func_179767_a() // .getPlayers()
        const action = packet.func_179768_b() // .getAction()

        if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return

        players.forEach(addPlayerData => {
            const name = addPlayerData.func_179961_d() // .getDisplayName()
            
            if (!name) return
            const formatted = name.func_150254_d() // .getFormattedText()
            const unformatted = formatted.removeFormatting()
        
            if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return

            TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
        })
    }).setFilteredClass(S38PacketPlayerListItem)
)

createEvent(EventList.WorldSound, (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const name = packet.func_149212_c()

        TextUtil.matchesCriteria(fn, criteria, name, event)
    }).setFilteredClass(net.minecraft.network.play.server.S29PacketSoundEffect)
)

createEvent(EventList.HeldItemChange, (fn) => 
    register("packetSent", (packet) => {
        const item = Player.getHeldItem()
        if (!item) return fn()

        const index = packet.func_149614_c()
        const attr = ItemUtil.getExtraAttribute(item)
        const sbID = ItemUtil.getSkyblockItemID(item)
        
        fn(item, index, attr, sbID)
    }).setFilteredClass(net.minecraft.network.play.client.C09PacketHeldItemChange)
)

createEvent(EventList.InventoryUpdate, (fn) => 
    register("packetReceived", (packet) => {
        if (packet.func_149175_c() === 0) fn(packet.func_149174_e(), packet.func_149173_d())
    }).setFilteredClass(net.minecraft.network.play.server.S2FPacketSetSlot)
)

createEvent(EventList.OpenContainer, (fn) => 
    register("packetReceived", (packet) => {
        const windowTitle = packet.func_179840_c().func_150254_d().removeFormatting()
        const windowID = packet.func_148901_c()
        const hasSlots = packet.func_148900_g()
        const slotCount = packet.func_148898_f()
        const guiID = packet.func_148902_e()
        const entityID = packet.func_148897_h()
    
        fn(windowTitle, windowID, hasSlots, slotCount, guiID, entityID)
    }).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)
)

createEvent(EventList.CloseContainer, (fn) => 
    register("guiClosed", (screen) => {
        if (screen instanceof net.minecraft.client.gui.inventory.GuiContainer) fn(screen)
    })
)

createEvent(EventList.ContainerClick, (fn) => 
    register("packetSent", (packet) => {
        // Container name, Slot clicked
        fn(Player.getContainer().getName(), packet.func_149544_d())
    }).setFilteredClass(net.minecraft.network.play.client.C0EPacketClickWindow)
)