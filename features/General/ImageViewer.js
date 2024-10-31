/** 
 * An adaption of ImageViewer (Approved by Allen Zheng)
 * @author Allen Zheng
 * @credit https://github.com/zhenga8533/VolcAddons/blob/main/features/general/ImageViewer.js
 */

import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import TextUtil from "../../core/static/TextUtil";
import ImageUtil from "../../core/static/ImageUtil";

let IMAGE = {}
const feat = new Feature({setting: "imageViewer"})
    .addEvent(
        new Event("chatComponentHovered", (textComp) => {
            // Checks if hovered value is a link
            const [url] = TextUtil.getMatches(
                /([a-z\d]{2,}:\/\/[-\w.]+\.[a-z]{2,}(?:\d{1,5})?(?:\S*)?(?:\.\S+)?(?=[!"§ \n]|$))/,
                textComp.getClickValue()?.removeFormatting()
            )
            if (!url || IMAGE.url === url) return
            IMAGE.url = url

            // If the link returns an image, update values
            ImageUtil.findImageInUrl(url, (image) => {
                
                const scale = 1 / Renderer.screen.getScale()
                const width = image.getTextureWidth() * scale
                const height = image.getTextureHeight() * scale
                    
                IMAGE = {
                    image,
                    url,
                    width,
                    height
                }

                feat.update()
            })
        })
    )
    .addSubEvent(
        new Event("renderOverlay", () => {
            const { image, width, height } = IMAGE

            image.draw(
                Client.getMouseX() - (width * 0.5),
                Client.getMouseY() - (height * 0.5),
                width,
                height
            )
        }),
        () => "image" in IMAGE
    )
    .addSubEvent(
        new Event("guiClosed", () => {
            resetImage()
            feat.update()
        }),
        () => "image" in IMAGE
    )
    .onUnregister(() => resetImage())

function resetImage() {
    if ("image" in IMAGE) IMAGE.image.destroy()
    IMAGE = {}
}