import Feature from "../../core/Feature";

new Feature({setting: "noDeathAnimation"})
    .addEvent("entityDeath", (entity) => entity.entity.func_70106_y())