// Credit: DocilElm's Doc Module https://github.com/DocilElm/Doc/blob/main/shared/Command.js
import Settings from "../data/Settings"
import { notify } from "../core/static/TextUtil"

let _commandList = {}
/**
 * @param {String} name
 * @param {String} description
 * @param {(...args: String) () => void} onRun
 */
export const addCommand = (name, description, onRun) => 
    _commandList[name.toLowerCase()] = {
        description,
        chat: 
            new TextComponent(`&a- ${name}&f: &b${description}`)
                .setHover("show_text", `Click to run /nwjn ${name}`)
                .setClick("run_command", `/nwjn ${name}`)
                .chat,
        onRun
    }

addCommand("help", "Shows this list")

register("command", (...args) => {
    if (!args?.[0]) return Settings().getConfig().openGui()

    if (args[0].toLowerCase() === "help") {
        notify("&aCommand List")
        return Object.keys(_commandList).forEach(key => _commandList[key].chat())
    }

    const cmd = _commandList[args[0].toLowerCase()]
    if (!cmd) return notify("&cInvalid command.")

    cmd.onRun?.(...args.slice(1)) 
})
    .setTabCompletions((arg) => {
        if (arg.length > 1) return []
        const allCommands = Object.keys(_commandList)
        if (!arg?.[0]) return allCommands

        const curr = allCommands.find(it => it.startsWith(arg[0]?.toLowerCase()))

        return curr ? [curr] : []
    })
    .setName("nwjn", true)