/** 
 * An adaption of ImagePreview by Sk1er
 * @author Sk1erLLC
 * @credit https://github.com/Sk1erLLC/Patcher/blob/master/src/main/java/club/sk1er/patcher/screen/render/overlay/ImagePreview.java
 */

import TextUtil from "./TextUtil"
const IOUtils = org.apache.commons.io.IOUtils
const ImageIO = javax.imageio.ImageIO
const URL = java.net.URL

export default class ImageUtil {
    static fixIfImgur(imgur) {
        const [wrongImgur, id] = TextUtil.getMatches(/^(https:\/\/imgur.com\/(\S+))$/)
        if (!wrongImgur) return imgur
        return `https://i.imgur.com/${id}.png`
    }

    static findImageInUrl(url, thenFn) {
        try {
            const makeURL = new URL(ImageUtil.fixIfImgur(url))
            if (!makeURL) throw new Error(`NwjnAddons failed to parse URL: ${url}`)
            const conn = makeURL.openConnection()
    
            conn.setRequestMethod("GET")
            conn.setUseCaches(true)
            conn.setInstanceFollowRedirects(true)
            conn.addRequestProperty("User-Agent", "Mozilla/5.0 (ChatTriggers)")
    
            // Prevent imgur redirects
            if (url.includes("imgur.com/")) conn.addRequestProperty('Referer', 'https://imgur.com/')
            conn.setReadTimeout(3000)
            conn.setConnectTimeout(3000)
            conn.setDoOutput(true)
    
            const stream = conn.getInputStream()
            const BufferedImage = ImageIO.read(stream)
            const shouldRecurse = conn.getHeaderField("Content-Type").includes("text/html")
            
            conn.disconnect()
            if (!shouldRecurse) return thenFn(new Image(BufferedImage))
    
            const [protocol, host] = [makeURL.getProtocol(), makeURL.getHost()]
            const body = IOUtils.toString(stream, "UTF-8")
    
            const [valid, slash, match] = TextUtil.getMatches(/<((?:meta property=\"\S+:image\" content=\"|img.*src=\")(\/)?(.+)\").*\/?>/, body)
            if (!valid) throw new Error(`NwjnAddons couldn't find any image in ${url}`)
    
            const imageURL = slash ? `${protocol}://${host}/${match}`.trim() : match
            if (imageURL) return ImageUtil.findImageInUrl(imageURL)
        } catch (err) {console.log(err)}
    }
}