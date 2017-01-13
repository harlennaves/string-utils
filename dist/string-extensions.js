var StringUtils;
(function (StringUtils) {
    function serialize(str) {
        var stringIdentifier = [0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0];
        var endBuffer = 11;
        var bStr = str.fromAscii("bytes", true);
        var size = bStr.length;
        var ret = [];
        ret = ret.concat(stringIdentifier);
        while (size > 0) {
            var div = Math.floor(size / 128);
            var rest = size % 128;
            if (div > 0) {
                ret.push(128 + rest);
            }
            else {
                ret.push(rest);
            }
            size = div;
        }
        ret = ret.concat(bStr);
        ret.push(endBuffer);
        return ret;
    }
    StringUtils.serialize = serialize;
    function toBinary(str) {
        var res = [];
        var padding = 0;
        str.split('').forEach(function (letter) {
            var bin = letter.charCodeAt(0).toString(2);
            padding = 8 - bin.length;
            res.push(new Array(padding + 1).join('0') + bin);
        });
        return res;
    }
    StringUtils.toBinary = toBinary;
    function getUnicodeCharacter(cp) {
        if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
            return String.fromCharCode(cp);
        }
        else if (cp >= 0x10000 && cp <= 0x10FFFF) {
            // we substract 0x10000 from cp to get a 20-bits number
            // in the range 0..0xFFFF
            cp -= 0x10000;
            // we add 0xD800 to the number formed by the first 10 bits
            // to give the first byte
            var first = ((0xffc00 & cp) >> 10) + 0xD800;
            // we add 0xDC00 to the number formed by the low 10 bits
            // to give the second byte
            var second = (0x3ff & cp) + 0xDC00;
            return String.fromCharCode(first) + String.fromCharCode(second);
        }
    }
    StringUtils.getUnicodeCharacter = getUnicodeCharacter;
})(StringUtils || (StringUtils = {}));
String.fromByteArray = function (byteArray, to) {
    var toAscii = function () {
        return String.fromCharCode.apply(null, new Uint8Array(byteArray));
    };
    var toBase64 = function () {
        var binary = '';
        var bytes = new Uint8Array(byteArray);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };
    switch (to) {
        case "ascii": return toAscii();
        case "base64": return toBase64();
        default: throw new Error("Can't convert from ByteArray to " + to);
    }
};
String.prototype.fromAscii = function (to, asArray) {
    var str = this.toString();
    var toByteArray = function () {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return bufView;
    };
    var toBytes = function () {
        var buf = new Array(str.length); // 2 bytes for each char
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            buf[i] = str.charCodeAt(i);
        }
        return buf;
    };
    var toHex = function () {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i++) {
            var hex = Number(str.charCodeAt(i)).toString(16);
            arr.push(hex.length > 1 && hex || "0" + hex);
        }
        return arr.join('');
    };
    var toUInt8Array = function () {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, j = 0, strLen = str.length * 2; i < strLen; i += 2, j++) {
            bufView[i] = str.charCodeAt(j);
        }
        return bufView;
    };
    var toBase64 = function () {
        return String.fromByteArray(toByteArray(), "base64");
    };
    var toBytes16 = function () {
        var bytes = [];
        var charCode;
        for (var i = 0; i < str.length; ++i) {
            charCode = str.charCodeAt(i);
            bytes.push(charCode & 0xFF);
            bytes.push((charCode & 0xFF00) >> 8);
        }
        return bytes;
    };
    switch (to) {
        case "bytes": return asArray && toBytes() || toByteArray();
        case "bytes16": return toBytes16();
        case "uint8array": return toUInt8Array(); //toAb16
        case "base64": return toBase64();
        case "hex": return toHex();
        default: throw new Error("Can't convert from Ascii to " + to);
    }
};
String.prototype.fromUnicode = function (to) {
    var unicode = this.toString();
    var toAscii = function () {
        var str = "";
        for (var i = 0; i < unicode.length; i = i + 2) {
            str += unicode[i];
        }
        ;
        while (str.charCodeAt(str.length - 1) != 125) {
            str = str.slice(0, str.length - 1);
        }
        return str;
    };
    switch (to) {
        case "ascii": return toAscii();
        default: throw new Error("Can't convert from Unicode to " + to);
    }
};
String.prototype.fromHex = function (to) {
    var hex = this.toString();
    var toBase64 = function () {
        var h = hex.replace(/\r|\n/g, "")
            .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
            .replace(/ +$/, "")
            .split(" ");
        return btoa(String.fromCharCode.apply(null, h));
    };
    var toAscii = function () {
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    };
    switch (to) {
        case "base64": return toBase64();
        case "ascii": return toAscii();
        default: throw new Error("Can't convert from Hex to " + to);
    }
};
String.prototype.fromUBase64 = function (to) {
    var s = this.toString();
    var toBase64 = function () {
        if (s.length % 4 == 2)
            s = s + "==";
        else if (s.length % 4 == 3)
            s = s + "=";
        s = s.replace(/-/g, "+");
        s = s.replace(/_/g, "/");
        return s;
    };
    switch (to) {
        case "base64": return toBase64();
        default: throw new Error("Can't convert from UBase64 to " + to);
    }
};
String.prototype.fromBase64 = function (to, flag) {
    var base64 = this.toString();
    var toByteArray = function (inArrayFormat) {
        if (inArrayFormat === void 0) { inArrayFormat = false; }
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = inArrayFormat && new Array(len) || new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            var ascii = binary_string.charCodeAt(i);
            bytes[i] = ascii;
        }
        ;
        return bytes;
    };
    var toAscii = function () {
        return String.fromByteArray(toByteArray(false), "ascii");
    };
    var toHex = function () {
        return String.fromByteArray(toByteArray(false), "ascii")
            .fromAscii("hex");
    };
    switch (to) {
        case "bytes": return toByteArray(flag);
        case "hex": return toHex();
        case "ascii": return toAscii();
        default: throw new Error("Can't convert from Base64 to " + to);
    }
};
String.prototype.toBoolean = function () {
    return this.toString() == "true";
};
