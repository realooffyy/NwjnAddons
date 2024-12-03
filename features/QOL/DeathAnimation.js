import Feature from "../../core/Feature";

new Feature({setting: "deathAnimation"})
    .addEvent("entityDeath", (entity) => entity.entity.func_70106_y())
    .addEvent("armorStandDeath", (entity) => entity.func_70106_y())