import Feature from "../../core/Feature";

new Feature({setting: "noDeathAnimation"})
    .addEvent(net.minecraftforge.event.entity.living.LivingDeathEvent, (event) => event.entity.func_70106_y())