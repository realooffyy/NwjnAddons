export default class Second {
    static fromTicks(ticks) {
        return new Second(ticks?.toSeconds() ?? ticks * 0.05)
    }

    constructor(val) {
        this.val = val | 0
    }

    toTicks() {
        return this.val * 20
    }

    get value() {
        return this.val
    }

    set value(value) {
        this.val = value

        if ("changeListener" in this) this.changeListener(this.val)
        if ("valueListener" in this && this.valueListener.val === this.val) this.valueListener()
    }

    atSecond(value, fn) {
        fn.val = value
        this.valueListener = fn

        return this
    }

    onChange(fn) {
        this.changeListener = fn

        return this
    }
}