/** 
 * Virtually entirely taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/CustomRegisters.js
 */

import { scheduleTask } from "../utils/Ticker";
import TextUtil from "./static/TextUtil";
import ItemUtil from "./static/ItemUtil"
import EventEnums from "./EventEnums"

export const customTriggers = new Map()

const createCustomEvent = (id, invokeFn) => customTriggers.set(id, invokeFn)

// Constant used to get the packet's ENUMS
// and also filter the class in packetReceived event
const S38PacketPlayerListItem = net.minecraft.network.play.server.S38PacketPlayerListItem

// [Interval]
createCustomEvent(EventEnums.INTERVAL.FPS, (fn, fps = 3) => register("step", fn).setFps(fps).unregister())

createCustomEvent(EventEnums.INTERVAL.SECONDS, (fn, sec = 1) => register("step", fn).setDelay(sec).unregister())

createCustomEvent(EventEnums.INTERVAL.TICK, (fn) =>
    register("packetReceived", (packet) => {
        if (packet.func_148890_d() <= 0) fn()
    }).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction).unregister()
)

// [Entity]

createCustomEvent(EventEnums.ENTITY.JOINWORLD, (fn, clazz) => 
    // Credits: https://github.com/BetterMap/BetterMap/blob/main/Extra/Events/SecretTracker.js
    register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
        if (!(event.entity instanceof clazz)) return
    
        const entity = event.entity
        const entityID = entity.func_145782_y()
        fn(entity, entityID)
    }).unregister()
)

createCustomEvent(EventEnums.ENTITY.SPAWNMOB, (fn, clazz) =>
    register("packetReceived", (packet) => {
        scheduleTask(() => {
            const entityID = packet.func_149024_d()
            const entity = World.getWorld().func_73045_a(entityID)
            if (!(entity instanceof clazz)) return

            fn(entity, entityID)
        })
    }).setFilteredClass(net.minecraft.network.play.server.S0FPacketSpawnMob).unregister()
)

createCustomEvent(EventEnums.ENTITY.DEATH, (fn, clazz) =>
    register("entityDeath", (entity) => {
        if (clazz && !(entity.entity instanceof clazz)) return

        fn(entity, entity.entity)
    }).unregister()
)

// [Client]
createCustomEvent(EventEnums.CLIENT.CHAT, (fn, criteria = "") => register("chat", fn).setCriteria(criteria).unregister())

createCustomEvent(EventEnums.CLIENT.COMMAND, (fn, name) => register("command", fn).setName(name).unregister())

createCustomEvent(EventEnums.CLIENT.SOUNDPLAY, (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        if (packet.func_149212_c()/*getSoundName*/ !== criteria) return

        const pitch = packet.func_149209_h()
        const volume = packet.func_149208_g()
        
        fn(pitch, volume, event)
    }).setFilteredClass(net.minecraft.network.play.server.S29PacketSoundEffect).unregister()
)

createCustomEvent(EventEnums.CLIENT.HELDITEMCHANGE, (fn) => 
    register("packetSent", (packet) => {
        const item = Player.getHeldItem()
        if (!item) return fn()

        const index = packet.func_149614_c()
        const attr = ItemUtil.getExtraAttribute(item)
        const sbID = ItemUtil.getSkyblockItemID(item)
        
        fn(item, index, attr, sbID)
    }).setFilteredClass(net.minecraft.network.play.client.C09PacketHeldItemChange).unregister()
)

createCustomEvent(EventEnums.CLIENT.ARMORCHANGE, (fn, criteria) => 
    register("packetSent", (packet) => {
        if (Player.getPlayer().func_145782_y() !== packet.func_149389_d()) return
        const item = packet.func_149390_c().serializeNBT().toObject()
        
        console.log(item)
        // fn(item)
    }).setFilteredClass(net.minecraft.network.play.server.S04PacketEntityEquipment).unregister()
)

// [Server]
createCustomEvent(EventEnums.SERVER.CHAT, (fn, criteria = "") => 
    register("packetReceived", (packet, event) => {
        // Check if the packet is for the actionbar
        if (packet.func_148916_d()) return

        const chatComponent = packet.func_148915_c()        
        const formatted = chatComponent?.func_150254_d()
        const unformatted = formatted?.removeFormatting()
    
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted, chatComponent)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat).unregister()
)

createCustomEvent(EventEnums.SERVER.ACTIONBAR, (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        // Check if the packet is for the actionbar
        if (!packet.func_148916_d()) return

        const chatComponent = packet.func_148915_c()        
        const formatted = chatComponent?.func_150254_d()
        const unformatted = formatted?.removeFormatting()
        
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat).unregister()
)

createCustomEvent(EventEnums.SERVER.SCOREBOARD, (fn, criteria) => 
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
    }).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams).unregister()
)

createCustomEvent(EventEnums.SERVER.TABUPDATE, (fn, criteria) => 
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
    }).setFilteredClass(S38PacketPlayerListItem).unregister()
)

createCustomEvent(EventEnums.SERVER.TABADD, (fn, criteria) => 
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
    }).setFilteredClass(S38PacketPlayerListItem).unregister()
)

// [Window]
createCustomEvent(EventEnums.WINDOW.OPEN, (fn) => 
    register("packetReceived", (packet) => {
        const windowTitle = packet.func_179840_c().func_150254_d().removeFormatting()
        const windowID = packet.func_148901_c()
        const hasSlots = packet.func_148900_g()
        const slotCount = packet.func_148898_f()
        const guiID = packet.func_148902_e()
        const entityID = packet.func_148897_h()
    
        fn(windowTitle, windowID, hasSlots, slotCount, guiID, entityID)
    }).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow).unregister()
)

createCustomEvent(EventEnums.WINDOW.CLOSE, (fn) => 
    register("guiClosed", (screen) => {
        if (screen instanceof net.minecraft.client.gui.inventory.GuiContainer) fn(screen)
    }).unregister()
)

createCustomEvent(EventEnums.WINDOW.CLICK, (fn) => 
    register("packetSent", (packet) => {
        // Container name, Slot clicked
        fn(Player.getContainer().getName(), packet.func_149544_d())
    }).setFilteredClass(net.minecraft.network.play.client.C0EPacketClickWindow).unregister()
)