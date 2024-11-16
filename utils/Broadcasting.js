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
    const {description} = moduleApi
    const [secretMessage] = TextUtil.getMatches(/\[(.+)\]: # $/, description)

    if (secretMessage && secretMessage !== "Nothing" && secretMessage !== data.newMsg) {
        data.newMsg = secretMessage
        notify(`&dFrom &6nwjn: &7${ secretMessage }`)
    }
});

// [CT ModVersion Message]
const version = register("worldLoad", () => {
    version.unregister()
    const {releaseVersion, modVersion} = moduleApi.releases[0]

    const rel = compareVersions(TextUtil.VERSION, releaseVersion)
    const mod = compareVersions(ChatTriggers.MODVERSION, modVersion)

    if (rel === 0 && mod !== 0) 
        notify(`Please use Chattriggers-v${modVer} to run this module most efficiently. https://github.com/ChatTriggers/ChatTriggers/releases/tag/${modVer}`)
})

function compareVersions(current, compareTo) {
    const v1 = current.split(".")
    const v2 = compareTo.split(".")

    for (let i = 0; i < 3; i++) {
        let part1 = Number(v1[i])
        let part2 = Number(v2[i])

        if (part1 === part2) continue
        else if (part1 > part2) return 1
        else return -1
    }

    return 0
}
