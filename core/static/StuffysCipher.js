/** 
 * An adaption of STuF (Approved by Stuffy)
 * @author stuffyerface
 * @credit https://github.com/stuffyerface/ImageLinkFix
 */

import TextUtil from "./TextUtil";

const schemes = {
    "h": "http://",
    "H": "https://"
}
const extensions = {
    "1": ".png",
    "2": ".jpg",
    "3": ".jpeg",
    "4": ".gif"
}
const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
export default class StuffysCipher {
    /**
     * Decodes a string in Standardized Truncated url Format.
     * @param {String} encoded - The String to Decode.
     * @returns {String} url
     */
    static decode = (encoded) => {
        const [valid, scheme, extension, dots, body] = TextUtil.getMatches(/^(l\$(\S)?(\S)?(\d+)\|(\S+))$/, encoded, 5)
        if (!valid) return ""

        let url = StuffysCipher.translate(
            body.slice(0, 9 - dots.length) 
            + 
            body.slice(9 - dots.length).replace(/\^/g, "."),
            -1
        )
        for (let dot of dots) 
            url = url.slice(0, ~~dot) + "." + url.slice(~~dot)

        url = (schemes[scheme] ?? "") + url
        url += (extensions[extension] ?? "")
        return url
    }

    /**
     * Encodes a string in Standardized Truncated url Format.
     * @param {String} url - The URL to Encode.
     */
    static encode = (url) => {
        const [valid, scheme, host, dir, extension] = TextUtil.getMatches(/^((https?:\/\/)?(\S+)(\/\S+)(\.(?:png|jpe?g|gif))?)$/, url, 5)
        if (!valid) return ""
        const body = host + dir

        let encoded = "l$"
            + TextUtil.getKeyFromValue(schemes, scheme) ?? ""
            + TextUtil.getKeyFromValue(extensions, extension) ?? "0"

        for (let i in body)
            if (body[i] === ".")
                encoded += i

        encoded += "|"

        encoded += StuffysCipher.translate(
            body.substring(0, 9).replace(/\./g, "") 
            + 
            body.substring(9).replace(/\./g, "^"), 
            1
        )

        return encoded
    }

    /**
     * @param {String} input 
     * @param {Number} inc Encode uses 1, Decode uses -1
     * @returns {String}
     */
    static translate(input, inc) {
        let result = ""
        for (let char of input) {
            let idx = charSet.indexOf(char)

            result += 
                ~idx ?
                    charSet[(idx + inc) % 62 /** 62 is charSet.length */] :
                char
        }

        return result
    }
}
