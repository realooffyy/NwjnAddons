// Credit: DocilElm's Doc Module https://github.com/DocilElm/Doc/blob/main/shared/Command.js
import Settings from "../Settings"
import { TextHelper } from "./TextHelper"

const commands = {}

/**
 * @param {string} name
 * @param {string} description
 * @param {(...args: string) () => void} fn
 */
export const addCommand = (name, description, fn) => {
  const component = new TextComponent(`&a- ${name} &b${description}`)
    .setHover("show_text", `Click to run /nwjn ${name}`)
    .setClick("run_command", `/nwjn ${name}`)

  commands[name] = {
    description,
    chat: () => component.chat(),
    fn
  }
}
addCommand("help", "Shows this list")

register("command", (...args) => {
  if (!args?.[0]) return Settings().getConfig().openGui()

  if (args[0].toLowerCase() === "help") {
    ChatLib.chat(`${TextHelper.NAME} &aCommand List`)
    Object.keys(commands).forEach(k => {
      commands[k].chat()
    })

    return
  }

  const cmd = commands[args[0]]
  if (!cmd) return ChatLib.chat(`${TextHelper.NAME} &cInvalid command.`)

  cmd.fn?.(...args.slice(1))
})
  .setTabCompletions((arg) => {
      if (arg.length > 1) return []
      const allCommands = Object.keys(commands)
      if (!arg[0]) return allCommands

      const curr = allCommands.find(it => it.toLowerCase().startsWith(arg[0]?.toLowerCase()))
      if (!curr) return []

      return [curr]
  })
  .setName("nwjn")