export default class Enum {
    /**
     * Creates a new object with the [key, val] pair of the input and its inverse
     * @param {Object} object 
     * @returns {Enum}
     */
    static fromObject(object) {
        const target = {}
        for (let key in object) 
            target[                                                 
                target[key] = object[key] 
            ] = key

        return Object.freeze(target)
    }

    /**
     * - Makes an Enum where each value in the array has a key with a value of its index
     * and each index has a key with a value of the value at the array index
     * @param {Array} array 
     */
    static fromArray(array) {
        const target = {}
        for (let i = 0; i < array.length; i++) 
            target[                                                 
                    target[i] = array[i] 
                ] = i

        return Object.freeze(target)
    }
}
