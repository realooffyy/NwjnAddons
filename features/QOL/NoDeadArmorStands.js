import Feature from "../../core/Feature";

new Feature({setting: "noDeadArmorStands"})
    .addEvent("armorStandDeath", (entity, event) => {
        cancel(event)
        entity.func_70106_y()
    })