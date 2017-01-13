interface String {
    /** Convert a Base64 string to other format
     * @param to {String} Desired format: bytes, hex, ascii
     * @param [flag] {boolean} True to ByteArray using Array. False to UInt8Array
     */
    fromBase64(to: string, flag?: any): any;
    /** Convert a Unsigned Base64 string to other format
     * @param to {String} Desired format: base64
     */
    fromUBase64(to: string, flag?: any): any;
    /** Convert a Hex string to other format
     * @param to {String} The desired format: ascii, base64
     */
    fromHex(to: string, flag?: any): any;
    /** Convert a Ascii string to other format
     * @param to {String} The desired format: bytes, bytes16, uint8array (toab16), base64, hex
     * @param asArray {boolean} When to == "bytes", asArray == true will return an Array. Will return an Uint8Array otherwise. Default to false;
     */
    fromAscii(to: string, asArray?: any): any;
    /** Convert a Unicode string to other format
     * @param to {String} The desired format: ascii
     */
    fromUnicode(to: string): any;
    /** Convert a string to boolean */
    toBoolean(): boolean;
    endsWith(searchvalue: string, length?: any): any;
}
interface StringConstructor {
    /** Convert a ByteArray to other format
     * @param byteArray The bytearray to convert
     * @param to {String} The desired format: ascii, base64
     */
    fromByteArray(byteArray: any, to: string): any;
}
declare function unescape(uri: string): string;
declare module StringUtils {
    function serialize(str: string): Array<any>;
    function toBinary(str: string): any[];
    function getUnicodeCharacter(cp: number): string;
}
