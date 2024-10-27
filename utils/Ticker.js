export const secondsToTick = (seconds) => seconds * 20
export const tickToSeconds = (ticks) => ticks * 0.05

let _scheduleTaskList = {}
/**
 * Credit: DocilElm
 * @param {() => void} onEnd fn to run after the delay
 * @param {number} delay the delay in ticks
 * @returns {void}
 */
export const scheduleTask = (onEnd, delay = 1) => _scheduleTaskList[onEnd] = [onEnd, delay]
const _updateTasks = () => {
    for (let key in _scheduleTaskList) {
        let tick = _scheduleTaskList[key][1]--
        if (tick) continue

        _scheduleTaskList[key][0]()
        delete _scheduleTaskList[key]
    }
}


let _countdownList = {}
/**
 * @param {(secLeft: number) => void} onTick fn to run every tick
 * @param {number} elapse # of ticks to elapse
 * @returns {void}
 */
export const addCountdown = (onTick, elapse) => _countdownList[onTick] = [onTick, elapse]
const _updateCountdowns = () => {
    for (let key in _countdownList) {
        let tick = _countdownList[key][1]--
        _countdownList[key][0](tickToSeconds(tick))
        if (!tick) delete _countdownList[key]
    }
}
let _timerList = {}
/**
 * @param {(elapsed: number) => void} onTick fn to run every tick
 * @param {number} elapse ticks
 * @returns {void}
 */
export const addTimer = (onTick, elapse, _currentTime = 0) => _timerList[onTick] = [onTick, elapse, _currentTime]
const _updateTimers = () => {
    for (let key in _timerList) {
        let tick = _timerList[key][2]++
        _timerList[key][0](tickToSeconds(tick))
        if (tick === _timerList[key][1]) delete _timerList[key]
    }
}

let ticked = 0
const history = Array(5).fill(0)
export const getTPS = () => (history.reduce((a, b) => a + b) / history.length).toFixed(2)

register("step", () => {
    history.push(ticked)
    history.shift()
    ticked = 0
}).setDelay(1)

register("packetReceived", (packet) => {
    if (packet.func_148890_d() > 0) return

    _updateTasks()
    _updateCountdowns()
    _updateTimers()
    ticked++
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)