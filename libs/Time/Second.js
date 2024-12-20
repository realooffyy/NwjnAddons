export default class Second {
    static fromTicks(tick) {
        return new Second(tick.toSeconds())
    }

    constructor(val) {
        this.changeListeners = []
        this.valueListeners = []

        this.val = val
    }

    toTicks() {
        return this.val * 20
    }

    get value() {
        return this.val
    }

    set value(value) {
        this.val = value

        this.changeListeners.forEach(it => it(this.val))
        this.valueListeners.forEach(([val, fn]) => this.val === val && fn())
    }

    atSecond(value, fn) {
        this.valueListeners.push([value, fn])

        return this
    }

    onChange(fn) {
        this.changeListeners.push(fn)

        return this
    }
}