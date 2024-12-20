export default class Tick {
    static fromSeconds(seconds) {
        return new Tick(seconds.toTicks())
    }

    constructor(val) {
        this.changeListeners = []
        this.valueListeners = []

        this.val = val
    }

    toSeconds() {
        return this.val * 0.05
    }

    get value() {
        return this.val
    }

    set value(value) {
        this.val = value

        this.changeListeners.forEach(it => it(this.toSeconds()))
        this.valueListeners.forEach(([val, fn]) => this.val === val && fn())
    }

    atTick(value, fn) {
        this.valueListeners.push([value, fn])

        return this
    }

    onChange(fn) {
        this.changeListeners.push(fn)

        return this
    }
}