import Feature from "../../core/Feature"

let totalDamage = 0
new Feature({
    setting: "magma",
    worlds: "Crimson Isle",
    zones: "Magma Chamber"
})
    .addEvent("sidebarChange", (dmg) => {
        totalDamage = ~~dmg
    }, /** might be wrong regex */ /^Boss: (\d{1,3})%$/)
    
    .addEvent("serverChat", (dmg, event) => {
        totalDamage = MathLib.clamp(totalDamage += ~~dmg, 0, 100)
        cancel(event)
        ChatLib.chat(`&4&lMagma Boss&r &8> &c+${ dmg }% &7(${ totalDamage }%)`)
    }, /^The Magma Boss angers! \(\+\d{1,3}% Damage\S$/)

    .addEvent("serverChat", () => totalDamage = 0, /^\S+MAGMA BOSS DOWN!$/)

    .onUnregister(() => totalDamage = 0)