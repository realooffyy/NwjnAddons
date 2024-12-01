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
        if (_scheduleTaskList[key][1]-- > 0) continue

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
        if (tick <= 0) delete _countdownList[key]
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
        if (tick <= _timerList[key][1]) delete _timerList[key]
    }
}

const history = Array(3)
let tick = 0, lastSec = 0, avg = 0

export const getTPS = () => MathLib.clampFloat(avg, 0, 20).toFixed(2)
const _updateTPS = () => {
    if (tick++ % 20) return
    const ticked = 20000 / (-lastSec + (lastSec = Date.now()))
    history.push(ticked)
    avg = history.reduce((a,b) => a+b) / 4
    history.shift()
}

register("packetReceived", (packet) => {
    if (packet.func_148890_d() > 0) return

    _updateTasks()
    _updateCountdowns()
    _updateTimers()
    _updateTPS()
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)