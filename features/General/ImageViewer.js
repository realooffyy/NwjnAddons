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
        /((?:https?:\/\/)?\S+\/\S+(?:\.(?:png|jpe?g|gif))?)/,
        textComp.getHoverValue().removeFormatting()
      )
      if (!url || IMAGE.url === url) return

      // If the link returns an image, update values
      try {
        const image = Image.fromUrl(url); // Will return if this throws err
        
        const screenWidth = Renderer.screen.getWidth()
        const screenHeight = Renderer.screen.getHeight()

        const imgWidth = image.getTextureWidth()
        const imgHeight = image.getTextureHeight()

        const ratio = Math.max(imgWidth / screenWidth, imgHeight / screenHeight) * 0.15
        const width = imgWidth * ratio
        const height = imgHeight * ratio
          
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
    () => IMAGE.image
  )
  .addSubEvent(
    new Event("guiClosed", () => {
      resetImage()
      feat.update()
    }),
    () => IMAGE.image
  )
  .onUnregister(() => 
    resetImage()
  )
  
function resetImage() {
  try {
    IMAGE.image.destroy()
    IMAGE = {}
  } catch (err) {}
}