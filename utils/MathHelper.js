/**
 * Math helpers util
 */
export class MathHelper
{
    /**
     * Object property safe float increment
     * (fix for 52.899999999999999999999999 numbers)
     * @param {object} object
     * @param {string} target key of object
     * @param {number} value for increment
     * @public
     */
    static increment(object, key, value) {
        object[key] = +(object[key] + value).toFixed(1);
    }

}
