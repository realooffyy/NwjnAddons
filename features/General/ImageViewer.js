/** 
 * An adaption of ImageViewer (Approved by Allen Zheng)
 * @author Allen Zheng
 * @credit https://github.com/zhenga8533/VolcAddons/blob/main/features/general/ImageViewer.js
 */

import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import TextUtil from "../../core/static/TextUtil";

let IMAGE = {}
const feat = new Feature({setting: "imageViewer"})
    .addEvent(
        new Event("chatComponentHovered", (textComp) => {
            // Checks if hovered value is a link
            const [url] = TextUtil.getMatches(
                /([a-z\d]{2,}:\/\/[-\w.]+\.[a-z]{2,}(?:\d{1,5})?(?:\S*)?(?:\.\S+)?(?=[!"§ \n]|$))/,
                textComp.getClickValue().removeFormatting()
            )
            if (!url || IMAGE.url === url) return
            IMAGE.url = url

            // If the link returns an image, update values
            /** @todo get request image? */
            try {
                const image = Image.fromUrl(url); // Will return if this throws err

                const width = Math.min(
                    image.getTextureWidth(), 
                    Renderer.screen.getWidth() * 0.15
                )
                const height = Math.min(
                    image.getTextureHeight(), 
                    Renderer.screen.getHeight() * 0.15
                )
                    
                IMAGE = {
                    image,
                    url,
                    width,
                    height
                }

                feat.update()
            } catch (err) {}
        })
    )
    .addSubEvent(
        new Event("renderOverlay", () => {
            const { image, _, width, height } = IMAGE
            
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