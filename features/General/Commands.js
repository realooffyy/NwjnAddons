import EntityUtil from "../../core/static/EntityUtil.js";
import TextUtil, { log } from "../../core/static/TextUtil.js";
import MathUtil from "../../core/static/MathUtil.js";
import ItemUtil from "../../core/static/ItemUtil.js"
import { addCommand } from "../../utils/Command.js";
import Settings from "../../data/Settings.js";

addCommand(
  "clearChat",
  "Clears entire chat log (may improve performance if you've been on for a long time)",
  () => ChatLib.clearChat()
)

addCommand(
  "deal", 
  "Sends a trade request to the player in front of you",
  () => {
    const looking = Player.lookingAt()
    if (!(looking instanceof net.minecraft.client.entity.EntityOtherPlayerMP)) return

    const name = looking.getName()
    log(`Trading with &e${name}`)
    ChatLib.command(`trade ${ name }`);
    ChatLib.addToSentMessageHistory(-1, `/trade ${ name }`)
  }
)

addCommand(
  "calc <equation>",
  "Simple calculator",
  () => {
    try {
      const equat = args.join(" ").replace(/,/g, "");
      log(`${ equat } = ${ MathUtil.addCommas(eval(equat)) }`);
    } catch (err) { log("Failed equation") }
  }
)

// [Dev tools]
addCommand(
  "Entity",
  "(Dev) Get data of entity directly infront",
  () => {
    const looking = Player.lookingAt()
    if (!(looking instanceof Entity)) { ChatLib.chat(looking); return; }

    ChatLib.chat(ChatLib.getChatBreak("-"))
    ChatLib.chat(`Name: ${ looking?.getName() }`)
    ChatLib.chat(`EntityClass: ${ looking?.getClassName() }`)
    ChatLib.chat(`Current HP: ${ MathUtil.addCommas(~~EntityUtil.getHP(looking)) }`)
    ChatLib.chat(`Max HP: ${ MathUtil.addCommas(~~EntityUtil.getMaxHP(looking)) }`)
    ChatLib.chat(ChatLib.getChatBreak("-"))
    FileLib.write("NwjnAddons", "/Dev/Entity.json", JSON.stringify(Object(looking), null, 4), true)
  }
)

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
    FileLib.write("NwjnAddons", "/Dev/Item.json", JSON.stringify(Object(holding.getNBT()), null, 4), true)
  }
)

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

addCommand(
  "Apply",
  "(Dev) Apply scheme setting changes",
  () =>
    Settings().getConfig().setScheme("/data/Scheme.json").apply()
)