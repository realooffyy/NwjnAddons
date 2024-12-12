// Credit: BloomCore
import Feature from "../core/Feature"
import TextUtil from "../core/static/TextUtil"
import { scheduleTask } from "./Ticker"

const members = new Set()
let leader
export default new class Party extends Feature {
	constructor() {
        super(); this
            .addEvent("serverChat", (member) => {
                members.add(TextUtil.getSenderName(member))
            }, /^(?:(.+) joined the party\.|.+ invited (.+) to the party! They have 60 seconds to accept\.|Party Finder > (.+) joined the (dungeon )?group! \(.+\))$/)
            
            .addEvent("serverChat", (member) => {
                members.delete(TextUtil.getSenderName(member))
            }, /^(?:(.+) has been removed from the party\.|(.+) has left the party\.|(.+) was removed from your party because they disconnected\.|Kicked (.+) because they were offline\.)$/)
            
            .addEvent("serverChat", () => {
                this.disbandParty()
            }, /^(?:.+ has disbanded the party!|The party was disbanded because all invites expired and the party was empty|You left the party\.|You are not currently in a party\.|You have been kicked from the party by .+|he party was disbanded because the party leader disconnected\.)$/)
            
            .addEvent("serverChat", (lead) => {
                leader = TextUtil.getSenderName(lead)
            }, /^(?:Party Leader: (.+) ●|You have joined (.+)'s? party!|The party was transferred to (.+) by .+)$/)
            
            .addEvent("serverChat", (pList) => {
                pList.split(", ").forEach(p => members.add(TextUtil.getSenderName(p)))
            }, /You'll be partying with: (.+)/)
            
            .addEvent("serverChat", (pList) => {
                pList.split(/ ?● ?/).forEach(p => members.add(TextUtil.getSenderName(p)))
            }, /^Party .+: (.+)/)
            
            .addEvent("serverChat", () => {
                this.checkParty()
            }, /^Party Finder > Your party has been queued in the (dungeon|party) finder!$/)
            
            .addEvent("serverChat", () => {
                this.checkParty()
            }, /You have joined .+'s party!/)
            
            .addEvent("serverChat", () => {
                if (!members.size()) leader = Player.getName()
            }, /^.+ invited .+ to the party! They have 60 seconds to accept\.$/)
            
            .addEvent("serverChat", (lead, left) => {
                if (TextUtil.getSenderName(lead) === Player.getName()) return this.disbandParty()

                leader = TextUtil.getSenderName(lead)
                members.delete(TextUtil.getSenderName(left))
            }, /The party was transferred to (.+) because (.+) left/)
            
            .addSubEvent("serverChat", (event) => cancel(event), /^(?:-{53}|Party (?:Members|Moderators|Leader)\:?.*|You are not currently in a party\.)$/)
            
            .addSubEvent("messageSent", (event) => cancel(event), /^\/(?:pl|party list)$/i)

        this.checkParty()
	}

    checkParty() {
        scheduleTask(() => {
            ChatLib.command("pl")
            this.register()
            scheduleTask(() => this.unregister(), 5)
        })
    }

	disbandParty() {
		members.clear()
		leader = null
    }
    
    amILeader() {
        return leader === Player.getName()
    }

    getMembers() {
        return members
    }
}