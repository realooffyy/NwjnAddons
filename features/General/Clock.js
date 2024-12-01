import MathUtil from "../../core/static/MathUtil";
import GuiFeature from "../../core/GuiFeature";
import { data } from "../../data/Data";

const clock = new GuiFeature({
    setting: "clock",
    name: "Clock",
    dataObj: data.Clock,
    baseText: "0:00:00",
    color: "clockColor"
})
    .addEvent("interval", () => {
        clock.text = MathUtil.getTime()
    }, 1)