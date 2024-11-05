import TextUtil, { notify } from "../core/static/TextUtil"
import { data } from "../data/Data"

// [Welcome Message]
const welcome = register("worldLoad", () => {
  welcome.unregister()
  if (!data.newUser) return

  data.newUser = false

  notify(`&dFrom &6nwjn: &7Welcome! Open settings with '/nwjn'. Official Discord: https://discord.gg/3S3wXpC4gE`)
})

const moduleApi = JSON.parse(FileLib.getUrlContent("https://chattriggers.com/api/modules/NwjnAddons"))
// [Broadcast Message]
const messenger = register("worldLoad", () => {
  messenger.unregister()
  const description =  moduleApi.description
  const [secretMessage] = TextUtil.getMatches(/\[(.+)\]: # $/, description)

  if (secretMessage && secretMessage !== "Nothing" && secretMessage !== data.newMsg) {
    data.newMsg = secretMessage
    notify(`&dFrom &6nwjn: &7${ secretMessage }`)
  }
});

// [CT ModVersion Message]
const version = register("worldLoad", () => {
  version.unregister()
  const release = moduleApi.releases[0]
  const [modVer, moduleVer] = [release.modVersion, release.releaseVersion]

  if (TextUtil.VERSION === moduleVer || ChatTriggers.MODVERSION === modVer) return
  notify(`Please use Chattriggers-v${modVer} to run this module most efficiently. https://github.com/ChatTriggers/ChatTriggers/releases/tag/${modVer}`)
})