import Feature from "../../core/Feature";

new Feature({
    setting: "damageTracker"
})
    .addEvent("spawnMob", (entity) => {
        const name = entity.func_95999_t()

        if ((/[^A-Za-z:-_.#]/.test(name?.removeFormatting()))) ChatLib.chat(name)
    }, net.minecraft.entity.item.EntityArmorStand)