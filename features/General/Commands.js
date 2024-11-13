import EntityUtil from "../../core/static/EntityUtil.js";
import TextUtil, { log } from "../../core/static/TextUtil.js";
import MathUtil from "../../core/static/MathUtil.js";
import ItemUtil from "../../core/static/ItemUtil.js"
import { addCommand } from "../../utils/Command.js";
import Settings from "../../data/Settings.js";

register("command", () => ChatLib.command("nwjn clearChat", true)).setName("clearChat", true)
addCommand(
  "clearChat",
  "Clears entire chat log (may improve performance if you've been on for a long time)",
  () => ChatLib.clearChat()
)

register("command", () => ChatLib.command("nwjn deal", true)).setName("deal", true)
addCommand(
  "deal", 
  "Sends a trade request to the player in front of you",
  () => {
    const looking = Player.lookingAt()
    if (!(looking instanceof PlayerMP)) return

    const name = looking.getName()
    log(`Trading with &e${name}`)
    ChatLib.command(`trade ${ name }`);
    ChatLib.addToSentMessageHistory(-1, `/trade ${ name }`)
  }
)

register("command", (...args) => ChatLib.command(`nwjn calc ${args.join(" ")}`, true)).setName("calc", true)
addCommand(
  "calc",
  "Simple calculator",
  (args) => {
    try {
      const equat = args.join(" ").replace(/,/g, "");
      log(`${ equat } = ${ MathUtil.addCommas(eval(equat)) }`);
    } catch (err) { log("Failed equation") }
  }
)

// [Dev tools]
register("command", () => ChatLib.command("nwjn Entity", true)).setName("entity", true)
addCommand(
  "Entity",
  "(Dev) Get data of entities in world",
  () => {
    let res = {}
    World.getAllEntities().forEach(it => {
      res[it.entity.func_145782_y()] = {
        name: it.getName(),
        clazz: it.getClassName(),
        currentHealth: MathUtil.addCommas(~~EntityUtil?.getHP(it)),
        maxHealth: MathUtil.addCommas(~~EntityUtil?.getMaxHP(it))
      }
    })

    FileLib.write("NwjnAddons", "/Dev/Entity.json", JSON.stringify(res, null, 4), true)
  }
)

register("command", () => ChatLib.command("nwjn Item", true)).setName("item", true)
addCommand(
  "Item",
  "(Dev) Get held item data",
  () => {
    const holding = Player.getHeldItem()
    if (!holding) return
    const rarity = holding.getLore().find(l => /COMMON|RARE|EPIC|LEGENDARY|MYTHIC|DIVINE|SPECIAL/.test(l.removeFormatting()))
    
    ChatLib.chat(ChatLib.getChatBreak("-"))
    ChatLib.chat(`Name: ${ holding.getName() }`)
    ChatLib.chat(`Registry: ${ holding.getRegistryName() }`)
    ChatLib.chat(`ID: ${ ItemUtil.getSkyblockItemID(holding) }`)
    ChatLib.chat(`Rarity: ${rarity}`)
    ChatLib.chat(ChatLib.getChatBreak("-"))
    FileLib.write("NwjnAddons", "/Dev/Item.json", JSON.stringify(holding.getNBT().toObject(), null, 4), true)
  }
)

register("command", () => ChatLib.command("nwjn Versions", true)).setName("versions", true)
addCommand(
  "Versions",
  "(Dev) Module and dependency versions",
  () => {
    ChatLib.chat(ChatLib.getChatBreak("-"))

    ChatLib.chat(`${ TextUtil.NWJNADDONS } &bYou are currently on version ${ TextUtil.VERSION }`)
    ChatLib.chat(`Dependencies:`)
    const libraries = JSON.parse(FileLib.read("NwjnAddons", "metadata.json")).requires

    for (let lib of libraries) 
      ChatLib.chat(`  &b${ lib }&r: &e${ JSON.parse(FileLib.read(lib, "metadata.json")).version }`)

    ChatLib.chat(ChatLib.getChatBreak("-"))
  }
)

register("command", () => ChatLib.command("nwjn Apply", true)).setName("apply", true)
addCommand(
  "Apply",
  "(Dev) Apply scheme setting changes",
  () =>
    Settings().getConfig().setScheme("/data/Scheme.json").apply()
)