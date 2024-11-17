// Credit: DocilElm's Doc Module https://github.com/DocilElm/Doc/blob/main/shared/Command.js
import Settings from "../data/Settings"
import { notify } from "../core/static/TextUtil"

const _commands = new Map()
/**
 * @param {String} name
 * @param {String} description
 * @param {?(...args: String) () => void} onRun
 */
export const addCommand = (name, description, onRun) => {
    description = new TextComponent(`&a- ${name}&f: &b${description}`)
        .setHover("show_text", `Click to run /nwjn ${name}`)
        .setClick("run_command", `/nwjn ${name}`)

    _commands.set(name.toLowerCase(), {
        chat: () => description.chat(),
        onRun
    })
}

addCommand("help", "Shows this list")

register("command", (...args) => {
    if (!args?.[0]) return Settings().getConfig().openGui()
    const command = args.shift().toLowerCase()

    if (command === "help") {
        notify("&aCommand List")
        _commands.forEach(it => it.chat())

        return
    }

    const run = _commands.get(command)
    if (!run) return notify("&cInvalid command.")

    run.onRun(...args) 
})
    .setTabCompletions((arg) => {
        if (arg.length > 1) return []
        const allCommands = _commands.keys()

        if (!arg?.[0]) return allCommands

        const curr = allCommands.find(it => it.startsWith(arg[0]?.toLowerCase()))

        if (!curr) return []

        return [curr]
    })
    .setName("nwjn")