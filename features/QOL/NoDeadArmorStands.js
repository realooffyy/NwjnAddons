import Feature from "../../core/Feature";

new Feature({setting: "noDeadArmorStands"})
    .addEvent("armorStandDeath", (entity) => entity.func_70106_y())