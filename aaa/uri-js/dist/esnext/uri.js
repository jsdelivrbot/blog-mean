/**
 * URI.js
 *
 * @fileoverview An RFC 3986 compliant, scheme extendable URI parsing/validating/resolving library for JavaScript.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/uri-js
 */
/**
 * Copyright 2011 Gary Court. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court.
 */
import URI_PROTOCOL from "./regexps-uri";
import IRI_PROTOCOL from "./regexps-iri";
import punycode from "punycode";
import { toUpperCase, typeOf } from "./util";
export const SCHEMES = {};
export function pctEncChar(chr) {
    const c = chr.charCodeAt(0);
    let e;
    if (c < 16)
        e = "%0" + c.toString(16).toUpperCase();
    else if (c < 128)
        e = "%" + c.toString(16).toUpperCase();
    else if (c < 2048)
        e = "%" + ((c >> 6) | 192).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
    else
        e = "%" + ((c >> 12) | 224).toString(16).toUpperCase() + "%" + (((c >> 6) & 63) | 128).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
    return e;
}
export function pctDecChars(str) {
    let newStr = "";
    let i = 0;
    const il = str.length;
    while (i < il) {
        const c = parseInt(str.substr(i + 1, 2), 16);
        if (c < 128) {
            newStr += String.fromCharCode(c);
            i += 3;
        }
        else if (c >= 194 && c < 224) {
            if ((il - i) >= 6) {
                const c2 = parseInt(str.substr(i + 4, 2), 16);
                newStr += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            }
            else {
                newStr += str.substr(i, 6);
            }
            i += 6;
        }
        else if (c >= 224) {
            if ((il - i) >= 9) {
                const c2 = parseInt(str.substr(i + 4, 2), 16);
                const c3 = parseInt(str.substr(i + 7, 2), 16);
                newStr += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            }
            else {
                newStr += str.substr(i, 9);
            }
            i += 9;
        }
        else {
            newStr += str.substr(i, 3);
            i += 3;
        }
    }
    return newStr;
}
function _normalizeComponentEncoding(components, protocol) {
    function decodeUnreserved(str) {
        const decStr = pctDecChars(str);
        return (!decStr.match(protocol.UNRESERVED) ? str : decStr);
    }
    if (components.scheme)
        components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_SCHEME, "");
    if (components.userinfo !== undefined)
        components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.host !== undefined)
        components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.path !== undefined)
        components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved).replace((components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME), pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.query !== undefined)
        components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    if (components.fragment !== undefined)
        components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
    return components;
}
;
const URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[\dA-F:.]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
const NO_MATCH_IS_UNDEFINED = ("").match(/(){0}/)[1] === undefined;
export function parse(uriString, options = {}) {
    const components = {};
    const protocol = (options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL);
    if (options.reference === "suffix")
        uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
    const matches = uriString.match(URI_PARSE);
    if (matches) {
        if (NO_MATCH_IS_UNDEFINED) {
            //store each component
            components.scheme = matches[1];
            components.userinfo = matches[3];
            components.host = matches[4];
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = matches[7];
            components.fragment = matches[8];
            //fix port number
            if (isNaN(components.port)) {
                components.port = matches[5];
            }
        }
        else {
            //store each component
            components.scheme = matches[1] || undefined;
            components.userinfo = (uriString.indexOf("@") !== -1 ? matches[3] : undefined);
            components.host = (uriString.indexOf("//") !== -1 ? matches[4] : undefined);
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = (uriString.indexOf("?") !== -1 ? matches[7] : undefined);
            components.fragment = (uriString.indexOf("#") !== -1 ? matches[8] : undefined);
            //fix port number
            if (isNaN(components.port)) {
                components.port = (uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : undefined);
            }
        }
        //strip brackets from IPv6 hosts
        if (components.host) {
            components.host = components.host.replace(protocol.IPV6ADDRESS, "$1");
        }
        //determine reference type
        if (components.scheme === undefined && components.userinfo === undefined && components.host === undefined && components.port === undefined && !components.path && components.query === undefined) {
            components.reference = "same-document";
        }
        else if (components.scheme === undefined) {
            components.reference = "relative";
        }
        else if (components.fragment === undefined) {
            components.reference = "absolute";
        }
        else {
            components.reference = "uri";
        }
        //check for reference errors
        if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
            components.error = components.error || "URI is not a " + options.reference + " reference.";
        }
        //find scheme handler
        const schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
        //check if scheme can't handle IRIs
        if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
            //if host component is a domain name
            if (components.host && (options.domainHost || (schemeHandler && schemeHandler.domainHost))) {
                //convert Unicode IDN -> ASCII IDN
                try {
                    components.host = punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
                }
                catch (e) {
                    components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
                }
            }
            //convert IRI -> URI
            _normalizeComponentEncoding(components, URI_PROTOCOL);
        }
        else {
            //normalize encodings
            _normalizeComponentEncoding(components, protocol);
        }
        //perform scheme specific parsing
        if (schemeHandler && schemeHandler.parse) {
            schemeHandler.parse(components, options);
        }
    }
    else {
        components.error = components.error || "URI can not be parsed.";
    }
    return components;
}
;
function _recomposeAuthority(components, options) {
    const protocol = (options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL);
    const uriTokens = [];
    if (components.userinfo !== undefined) {
        uriTokens.push(components.userinfo);
        uriTokens.push("@");
    }
    if (components.host !== undefined) {
        //ensure IPv6 addresses are bracketed
        uriTokens.push(String(components.host).replace(protocol.IPV6ADDRESS, "[$1]"));
    }
    if (typeof components.port === "number") {
        uriTokens.push(":");
        uriTokens.push(components.port.toString(10));
    }
    return uriTokens.length ? uriTokens.join("") : undefined;
}
;
const RDS1 = /^\.\.?\//;
const RDS2 = /^\/\.(\/|$)/;
const RDS3 = /^\/\.\.(\/|$)/;
const RDS4 = /^\.\.?$/;
const RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
export function removeDotSegments(input) {
    const output = [];
    while (input.length) {
        if (input.match(RDS1)) {
            input = input.replace(RDS1, "");
        }
        else if (input.match(RDS2)) {
            input = input.replace(RDS2, "/");
        }
        else if (input.match(RDS3)) {
            input = input.replace(RDS3, "/");
            output.pop();
        }
        else if (input === "." || input === "..") {
            input = "";
        }
        else {
            const im = input.match(RDS5);
            if (im) {
                const s = im[0];
                input = input.slice(s.length);
                output.push(s);
            }
            else {
                throw new Error("Unexpected dot segment condition");
            }
        }
    }
    return output.join("");
}
;
export function serialize(components, options = {}) {
    const protocol = (options.iri ? IRI_PROTOCOL : URI_PROTOCOL);
    const uriTokens = [];
    //find scheme handler
    const schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
    //perform scheme specific serialization
    if (schemeHandler && schemeHandler.serialize)
        schemeHandler.serialize(components, options);
    if (components.host) {
        //if host component is an IPv6 address
        if (protocol.IPV6ADDRESS.test(components.host)) {
            //TODO: normalize IPv6 address as per RFC 5952
        }
        else if (options.domainHost || (schemeHandler && schemeHandler.domainHost)) {
            //convert IDN via punycode
            try {
                components.host = (!options.iri ? punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : punycode.toUnicode(components.host));
            }
            catch (e) {
                components.error = components.error || "Host's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
            }
        }
    }
    //normalize encoding
    _normalizeComponentEncoding(components, protocol);
    if (options.reference !== "suffix" && components.scheme) {
        uriTokens.push(components.scheme);
        uriTokens.push(":");
    }
    const authority = _recomposeAuthority(components, options);
    if (authority !== undefined) {
        if (options.reference !== "suffix") {
            uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (components.path && components.path.charAt(0) !== "/") {
            uriTokens.push("/");
        }
    }
    if (components.path !== undefined) {
        let s = components.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
            s = removeDotSegments(s);
        }
        if (authority === undefined) {
            s = s.replace(/^\/\//, "/%2F"); //don't allow the path to start with "//"
        }
        uriTokens.push(s);
    }
    if (components.query !== undefined) {
        uriTokens.push("?");
        uriTokens.push(components.query);
    }
    if (components.fragment !== undefined) {
        uriTokens.push("#");
        uriTokens.push(components.fragment);
    }
    return uriTokens.join(""); //merge tokens into a string
}
;
export function resolveComponents(base, relative, options = {}, skipNormalization) {
    const target = {};
    if (!skipNormalization) {
        base = parse(serialize(base, options), options); //normalize base components
        relative = parse(serialize(relative, options), options); //normalize relative components
    }
    options = options || {};
    if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        //target.authority = relative.authority;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
    }
    else {
        if (relative.userinfo !== undefined || relative.host !== undefined || relative.port !== undefined) {
            //target.authority = relative.authority;
            target.userinfo = relative.userinfo;
            target.host = relative.host;
            target.port = relative.port;
            target.path = removeDotSegments(relative.path || "");
            target.query = relative.query;
        }
        else {
            if (!relative.path) {
                target.path = base.path;
                if (relative.query !== undefined) {
                    target.query = relative.query;
                }
                else {
                    target.query = base.query;
                }
            }
            else {
                if (relative.path.charAt(0) === "/") {
                    target.path = removeDotSegments(relative.path);
                }
                else {
                    if ((base.userinfo !== undefined || base.host !== undefined || base.port !== undefined) && !base.path) {
                        target.path = "/" + relative.path;
                    }
                    else if (!base.path) {
                        target.path = relative.path;
                    }
                    else {
                        target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
                    }
                    target.path = removeDotSegments(target.path);
                }
                target.query = relative.query;
            }
            //target.authority = base.authority;
            target.userinfo = base.userinfo;
            target.host = base.host;
            target.port = base.port;
        }
        target.scheme = base.scheme;
    }
    target.fragment = relative.fragment;
    return target;
}
;
export function resolve(baseURI, relativeURI, options) {
    return serialize(resolveComponents(parse(baseURI, options), parse(relativeURI, options), options, true), options);
}
;
export function normalize(uri, options) {
    if (typeof uri === "string") {
        uri = serialize(parse(uri, options), options);
    }
    else if (typeOf(uri) === "object") {
        uri = parse(serialize(uri, options), options);
    }
    return uri;
}
;
export function equal(uriA, uriB, options) {
    if (typeof uriA === "string") {
        uriA = serialize(parse(uriA, options), options);
    }
    else if (typeOf(uriA) === "object") {
        uriA = serialize(uriA, options);
    }
    if (typeof uriB === "string") {
        uriB = serialize(parse(uriB, options), options);
    }
    else if (typeOf(uriB) === "object") {
        uriB = serialize(uriB, options);
    }
    return uriA === uriB;
}
;
export function escapeComponent(str, options) {
    return str && str.toString().replace((!options || !options.iri ? URI_PROTOCOL.ESCAPE : IRI_PROTOCOL.ESCAPE), pctEncChar);
}
;
export function unescapeComponent(str, options) {
    return str && str.toString().replace((!options || !options.iri ? URI_PROTOCOL.PCT_ENCODED : IRI_PROTOCOL.PCT_ENCODED), pctDecChars);
}
;
//# sourceMappingURL=uri.js.map