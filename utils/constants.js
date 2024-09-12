export const version = (JSON.parse(FileLib.read("NwjnAddons", "metadata.json"))).version

export const PREFIX = "§r§d§l[NwjnAddons]§r"

export const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
export const EntityPlayer = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")
export const EntityMagmaCube = Java.type(`net.minecraft.entity.monster.EntityMagmaCube`)
export const EntityGiant = Java.type("net.minecraft.entity.monster.EntityGiantZombie");
export const SMA = Java.type('net.minecraft.entity.SharedMonsterAttributes');