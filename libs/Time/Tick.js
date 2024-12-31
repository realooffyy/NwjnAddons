export default class Tick {
    static fromSeconds(seconds) {
        return new Tick(seconds?.toTicks() ?? seconds * 20)
    }

    constructor(val) {
        this.val = val | 0
    }

    toSeconds() {
        return this.val * 0.05
    }

    get value() {
        return this.val
    }

    set value(value) {
        this.val = value

        if ("changeListener" in this) this.changeListener(this.val)
        if ("valueListener" in this && this.valueListener.val === this.val) this.valueListener()
    }

    atTick(value, fn) {
        fn.val = value
        this.valueListener = fn

        return this
    }

    onChange(fn) {
        this.changeListener = fn

        return this
    }
}