_xamzrequire = function() {
    function e(t, r, n) {
        function i(s, a) {
            if (!r[s]) {
                if (!t[s]) {
                    var u = "function" == typeof require && require;
                    if (!a && u) return u(s, !0);
                    if (o) return o(s, !0);
                    var c = new Error("Cannot find module '" + s + "'");
                    throw c.code = "MODULE_NOT_FOUND",
                    c
                }
                var h = r[s] = {
                    exports: {}
                };
                t[s][0].call(h.exports,
                function(e) {
                    return i(t[s][1][e] || e)
                },
                h, h.exports, e, t, r, n)
            }
            return r[s].exports
        }
        for (var o = "function" == typeof require && require,
        s = 0; s < n.length; s++) i(n[s]);
        return i
    }
    return e
} ()({
    38 : [function(e, t, r) {
        var n = {
            util: e("./util")
        }; ({}).toString(),
        t.exports = n,
        n.util.update(n, {
            VERSION: "2.456.0",
            Signers: {},
            Protocol: {
                Json: e("./protocol/json"),
                Query: e("./protocol/query"),
                Rest: e("./protocol/rest"),
                RestJson: e("./protocol/rest_json"),
                RestXml: e("./protocol/rest_xml")
            },
            XML: {
                Builder: e("./xml/builder"),
                Parser: null
            },
            JSON: {
                Builder: e("./json/builder"),
                Parser: e("./json/parser")
            },
            Model: {
                Api: e("./model/api"),
                Operation: e("./model/operation"),
                Shape: e("./model/shape"),
                Paginator: e("./model/paginator"),
                ResourceWaiter: e("./model/resource_waiter")
            },
            apiLoader: e("./api_loader"),
            EndpointCache: e("../vendor/endpoint-cache").EndpointCache
        }),
        e("./sequential_executor"),
        e("./service"),
        e("./config"),
        e("./http"),
        e("./event_listeners"),
        e("./request"),
        e("./response"),
        e("./resource_waiter"),
        e("./signers/request_signer"),
        e("./param_validator"),
        n.events = new n.SequentialExecutor,
        n.util.memoizedProperty(n, "endpointCache",
        function() {
            return new n.EndpointCache(n.config.endpointCacheSize)
        },
        !0)
    },
    {
        "../vendor/endpoint-cache": 124,
        "./api_loader": 27,
        "./config": 37,
        "./event_listeners": 60,
        "./http": 61,
        "./json/builder": 63,
        "./json/parser": 64,
        "./model/api": 65,
        "./model/operation": 67,
        "./model/paginator": 68,
        "./model/resource_waiter": 69,
        "./model/shape": 70,
        "./param_validator": 71,
        "./protocol/json": 74,
        "./protocol/query": 75,
        "./protocol/rest": 76,
        "./protocol/rest_json": 77,
        "./protocol/rest_xml": 78,
        "./request": 84,
        "./resource_waiter": 85,
        "./response": 86,
        "./sequential_executor": 88,
        "./service": 89,
        "./signers/request_signer": 109,
        "./util": 117,
        "./xml/builder": 119
    }],
    124 : [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./utils/LRU"),
        i = 1e3,
        o = function() {
            function e(e) {
                void 0 === e && (e = i),
                this.maxSize = e,
                this.cache = new n.LRUCache(e)
            }
            return Object.defineProperty(e.prototype, "size", {
                get: function() {
                    return this.cache.length
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.put = function(t, r) {
                var n = "string" != typeof t ? e.getKeyString(t) : t,
                i = this.populateValue(r);
                this.cache.put(n, i)
            },
            e.prototype.get = function(t) {
                var r = "string" != typeof t ? e.getKeyString(t) : t,
                n = Date.now(),
                i = this.cache.get(r);
                if (i) for (var o = 0; o < i.length; o++) {
                    var s = i[o];
                    if (s.Expire < n) return void this.cache.remove(r)
                }
                return i
            },
            e.getKeyString = function(e) {
                for (var t = [], r = Object.keys(e).sort(), n = 0; n < r.length; n++) {
                    var i = r[n];
                    void 0 !== e[i] && t.push(e[i])
                }
                return t.join(" ")
            },
            e.prototype.populateValue = function(e) {
                var t = Date.now();
                return e.map(function(e) {
                    return {
                        Address: e.Address || "",
                        Expire: t + 60 * (e.CachePeriodInMinutes || 1) * 1e3
                    }
                })
            },
            e.prototype.empty = function() {
                this.cache.empty()
            },
            e.prototype.remove = function(t) {
                var r = "string" != typeof t ? e.getKeyString(t) : t;
                this.cache.remove(r)
            },
            e
        } ();
        r.EndpointCache = o
    },
    {
        "./utils/LRU": 125
    }],
    125 : [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                this.key = e,
                this.value = t
            }
            return e
        } (),
        i = function() {
            function e(e) {
                if (this.nodeMap = {},
                this.size = 0, "number" != typeof e || e < 1) throw new Error("Cache size can only be positive number");
                this.sizeLimit = e
            }
            return Object.defineProperty(e.prototype, "length", {
                get: function() {
                    return this.size
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.prependToList = function(e) {
                this.headerNode ? (this.headerNode.prev = e, e.next = this.headerNode) : this.tailNode = e,
                this.headerNode = e,
                this.size++
            },
            e.prototype.removeFromTail = function() {
                if (this.tailNode) {
                    var e = this.tailNode,
                    t = e.prev;
                    return t && (t.next = void 0),
                    e.prev = void 0,
                    this.tailNode = t,
                    this.size--,
                    e
                }
            },
            e.prototype.detachFromList = function(e) {
                this.headerNode === e && (this.headerNode = e.next),
                this.tailNode === e && (this.tailNode = e.prev),
                e.prev && (e.prev.next = e.next),
                e.next && (e.next.prev = e.prev),
                e.next = void 0,
                e.prev = void 0,
                this.size--
            },
            e.prototype.get = function(e) {
                if (this.nodeMap[e]) {
                    var t = this.nodeMap[e];
                    return this.detachFromList(t),
                    this.prependToList(t),
                    t.value
                }
            },
            e.prototype.remove = function(e) {
                if (this.nodeMap[e]) {
                    var t = this.nodeMap[e];
                    this.detachFromList(t),
                    delete this.nodeMap[e]
                }
            },
            e.prototype.put = function(e, t) {
                if (this.nodeMap[e]) this.remove(e);
                else if (this.size === this.sizeLimit) {
                    var r = this.removeFromTail(),
                    i = r.key;
                    delete this.nodeMap[i]
                }
                var o = new n(e, t);
                this.nodeMap[e] = o,
                this.prependToList(o)
            },
            e.prototype.empty = function() {
                for (var e = Object.keys(this.nodeMap), t = 0; t < e.length; t++) {
                    var r = e[t],
                    n = this.nodeMap[r];
                    this.detachFromList(n),
                    delete this.nodeMap[r]
                }
            },
            e
        } ();
        r.LRUCache = i
    },
    {}],
    119 : [function(e, t, r) {
        function n() {}
        function i(e, t, r) {
            switch (r.type) {
            case "structure":
                return o(e, t, r);
            case "map":
                return s(e, t, r);
            case "list":
                return a(e, t, r);
            default:
                return u(e, t, r)
            }
        }
        function o(e, t, r) {
            h.arrayEach(r.memberNames,
            function(n) {
                var o = r.members[n];
                if ("body" === o.location) {
                    var s = t[n],
                    a = o.name;
                    if (void 0 !== s && null !== s) if (o.isXmlAttribute) e.addAttribute(a, s);
                    else if (o.flattened) i(e, s, o);
                    else {
                        var u = new l(a);
                        e.addChildNode(u),
                        c(u, o),
                        i(u, s, o)
                    }
                }
            })
        }
        function s(e, t, r) {
            var n = r.key.name || "key",
            o = r.value.name || "value";
            h.each(t,
            function(t, s) {
                var a = new l(r.flattened ? r.name: "entry");
                e.addChildNode(a);
                var u = new l(n),
                c = new l(o);
                a.addChildNode(u),
                a.addChildNode(c),
                i(u, t, r.key),
                i(c, s, r.value)
            })
        }
        function a(e, t, r) {
            r.flattened ? h.arrayEach(t,
            function(t) {
                var n = r.member.name || r.name,
                o = new l(n);
                e.addChildNode(o),
                i(o, t, r.member)
            }) : h.arrayEach(t,
            function(t) {
                var n = r.member.name || "member",
                o = new l(n);
                e.addChildNode(o),
                i(o, t, r.member)
            })
        }
        function u(e, t, r) {
            e.addChildNode(new p(r.toWireFormat(t)))
        }
        function c(e, t, r) {
            var n, i = "xmlns";
            t.xmlNamespaceUri ? (n = t.xmlNamespaceUri, t.xmlNamespacePrefix && (i += ":" + t.xmlNamespacePrefix)) : r && t.api.xmlNamespaceUri && (n = t.api.xmlNamespaceUri),
            n && e.addAttribute(i, n)
        }
        var h = e("../util"),
        l = e("./xml-node").XmlNode,
        p = e("./xml-text").XmlText;
        n.prototype.toXML = function(e, t, r, n) {
            var o = new l(r);
            return c(o, t, !0),
            i(o, e, t),
            o.children.length > 0 || n ? o.toString() : ""
        },
        t.exports = n
    },
    {
        "../util": 117,
        "./xml-node": 122,
        "./xml-text": 123
    }],
    123 : [function(e, t, r) {
        function n(e) {
            this.value = e
        }
        var i = e("./escape-element").escapeElement;
        n.prototype.toString = function() {
            return i("" + this.value)
        },
        t.exports = {
            XmlText: n
        }
    },
    {
        "./escape-element": 121
    }],
    121 : [function(e, t, r) {
        function n(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        t.exports = {
            escapeElement: n
        }
    },
    {}],
    122 : [function(e, t, r) {
        function n(e, t) {
            void 0 === t && (t = []),
            this.name = e,
            this.children = t,
            this.attributes = {}
        }
        var i = e("./escape-attribute").escapeAttribute;
        n.prototype.addAttribute = function(e, t) {
            return this.attributes[e] = t,
            this
        },
        n.prototype.addChildNode = function(e) {
            return this.children.push(e),
            this
        },
        n.prototype.removeAttribute = function(e) {
            return delete this.attributes[e],
            this
        },
        n.prototype.toString = function() {
            for (var e = Boolean(this.children.length), t = "<" + this.name, r = this.attributes, n = 0, o = Object.keys(r); n < o.length; n++) {
                var s = o[n],
                a = r[s];
                void 0 !== a && null !== a && (t += " " + s + '="' + i("" + a) + '"')
            }
            return t += e ? ">" + this.children.map(function(e) {
                return e.toString()
            }).join("") + "</" + this.name + ">": "/>"
        },
        t.exports = {
            XmlNode: n
        }
    },
    {
        "./escape-attribute": 120
    }],
    120 : [function(e, t, r) {
        function n(e) {
            return e.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        }
        t.exports = {
            escapeAttribute: n
        }
    },
    {}],
    109 : [function(e, t, r) {
        var n = e("../core"),
        i = n.util.inherit;
        n.Signers.RequestSigner = i({
            constructor: function(e) {
                this.request = e
            },
            setServiceClientId: function(e) {
                this.serviceClientId = e
            },
            getServiceClientId: function() {
                return this.serviceClientId
            }
        }),
        n.Signers.RequestSigner.getVersion = function(e) {
            switch (e) {
            case "v2":
                return n.Signers.V2;
            case "v3":
                return n.Signers.V3;
            case "s3v4":
            case "v4":
                return n.Signers.V4;
            case "s3":
                return n.Signers.S3;
            case "v3https":
                return n.Signers.V3Https
            }
            throw new Error("Unknown signing version " + e)
        },
        e("./v2"),
        e("./v3"),
        e("./v3https"),
        e("./v4"),
        e("./s3"),
        e("./presign")
    },
    {
        "../core": 38,
        "./presign": 108,
        "./s3": 110,
        "./v2": 111,
        "./v3": 112,
        "./v3https": 113,
        "./v4": 114
    }],
    114 : [function(e, t, r) {
        var n = e("../core"),
        i = e("./v4_credentials"),
        o = n.util.inherit;
        n.Signers.V4 = o(n.Signers.RequestSigner, {
            constructor: function(e, t, r) {
                n.Signers.RequestSigner.call(this, e),
                this.serviceName = t,
                r = r || {},
                this.signatureCache = "boolean" != typeof r.signatureCache || r.signatureCache,
                this.operation = r.operation,
                this.signatureVersion = r.signatureVersion
            },
            algorithm: "AWS4-HMAC-SHA256",
            addAuthorization: function(e, t) {
                var r = n.util.date.iso8601(t).replace(/[:\-]|\.\d{3}/g, "");
                this.isPresigned() ? this.updateForPresigned(e, r) : this.addHeaders(e, r),
                this.request.headers.Authorization = this.authorization(e, r)
            },
            addHeaders: function(e, t) {
                this.request.headers["X-Amz-Date"] = t,
                e.sessionToken && (this.request.headers["x-amz-security-token"] = e.sessionToken)
            },
            updateForPresigned: function(e, t) {
                var r = this.credentialString(t),
                i = {
                    "X-Amz-Date": t,
                    "X-Amz-Algorithm": this.algorithm,
                    "X-Amz-Credential": e.accessKeyId + "/" + r,
                    "X-Amz-Expires": this.request.headers["presigned-expires"],
                    "X-Amz-SignedHeaders": this.signedHeaders()
                };
                e.sessionToken && (i["X-Amz-Security-Token"] = e.sessionToken),
                this.request.headers["Content-Type"] && (i["Content-Type"] = this.request.headers["Content-Type"]),
                this.request.headers["Content-MD5"] && (i["Content-MD5"] = this.request.headers["Content-MD5"]),
                this.request.headers["Cache-Control"] && (i["Cache-Control"] = this.request.headers["Cache-Control"]),
                n.util.each.call(this, this.request.headers,
                function(e, t) {
                    if ("presigned-expires" !== e && this.isSignableHeader(e)) {
                        var r = e.toLowerCase();
                        0 === r.indexOf("x-amz-meta-") ? i[r] = t: 0 === r.indexOf("x-amz-") && (i[e] = t)
                    }
                });
                var o = this.request.path.indexOf("?") >= 0 ? "&": "?";
                this.request.path += o + n.util.queryParamsToString(i)
            },
            authorization: function(e, t) {
                var r = [],
                n = this.credentialString(t);
                return r.push(this.algorithm + " Credential=" + e.accessKeyId + "/" + n),
                r.push("SignedHeaders=" + this.signedHeaders()),
                r.push("Signature=" + this.signature(e, t)),
                r.join(", ")
            },
            signature: function(e, t) {
                var r = i.getSigningKey(e, t.substr(0, 8), this.request.region, this.serviceName, this.signatureCache);
                return n.util.crypto.hmac(r, this.stringToSign(t), "hex")
            },
            stringToSign: function(e) {
                var t = [];
                return t.push("AWS4-HMAC-SHA256"),
                t.push(e),
                t.push(this.credentialString(e)),
                t.push(this.hexEncodedHash(this.canonicalString())),
                t.join("\n")
            },
            canonicalString: function() {
                var e = [],
                t = this.request.pathname();
                return "s3" !== this.serviceName && "s3v4" !== this.signatureVersion && (t = n.util.uriEscapePath(t)),
                e.push(this.request.method),
                e.push(t),
                e.push(this.request.search()),
                e.push(this.canonicalHeaders() + "\n"),
                e.push(this.signedHeaders()),
                e.push(this.hexEncodedBodyHash()),
                e.join("\n")
            },
            canonicalHeaders: function() {
                var e = [];
                n.util.each.call(this, this.request.headers,
                function(t, r) {
                    e.push([t, r])
                }),
                e.sort(function(e, t) {
                    return e[0].toLowerCase() < t[0].toLowerCase() ? -1 : 1
                });
                var t = [];
                return n.util.arrayEach.call(this, e,
                function(e) {
                    var r = e[0].toLowerCase();
                    if (this.isSignableHeader(r)) {
                        var i = e[1];
                        if (void 0 === i || null === i || "function" != typeof i.toString) throw n.util.error(new Error("Header " + r + " contains invalid value"), {
                            code: "InvalidHeader"
                        });
                        t.push(r + ":" + this.canonicalHeaderValues(i.toString()))
                    }
                }),
                t.join("\n")
            },
            canonicalHeaderValues: function(e) {
                return e.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")
            },
            signedHeaders: function() {
                var e = [];
                return n.util.each.call(this, this.request.headers,
                function(t) {
                    t = t.toLowerCase(),
                    this.isSignableHeader(t) && e.push(t)
                }),
                e.sort().join(";")
            },
            credentialString: function(e) {
                return i.createScope(e.substr(0, 8), this.request.region, this.serviceName)
            },
            hexEncodedHash: function(e) {
                return n.util.crypto.sha256(e, "hex")
            },
            hexEncodedBodyHash: function() {
                var e = this.request;
                return this.isPresigned() && "s3" === this.serviceName && !e.body ? "UNSIGNED-PAYLOAD": e.headers["X-Amz-Content-Sha256"] ? e.headers["X-Amz-Content-Sha256"] : this.hexEncodedHash(this.request.body || "")
            },
            unsignableHeaders: ["authorization", "content-type", "content-length", "user-agent", "presigned-expires", "expect", "x-amzn-trace-id"],
            isSignableHeader: function(e) {
                return 0 === e.toLowerCase().indexOf("x-amz-") || this.unsignableHeaders.indexOf(e) < 0
            },
            isPresigned: function() {
                return !! this.request.headers["presigned-expires"]
            }
        }),
        t.exports = n.Signers.V4
    },
    {
        "../core": 38,
        "./v4_credentials": 115
    }],
    115 : [function(e, t, r) {
        var n = e("../core"),
        i = {},
        o = [];
        t.exports = {
            createScope: function(e, t, r) {
                return [e.substr(0, 8), t, r, "aws4_request"].join("/")
            },
            getSigningKey: function(e, t, r, s, a) {
                var u = n.util.crypto.hmac(e.secretAccessKey, e.accessKeyId, "base64"),
                c = [u, t, r, s].join("_");
                if ((a = !1 !== a) && c in i) return i[c];
                var h = n.util.crypto.hmac("AWS4" + e.secretAccessKey, t, "buffer"),
                l = n.util.crypto.hmac(h, r, "buffer"),
                p = n.util.crypto.hmac(l, s, "buffer"),
                f = n.util.crypto.hmac(p, "aws4_request", "buffer");
                return a && (i[c] = f, o.push(c), o.length > 50 && delete i[o.shift()]),
                f
            },
            emptyCache: function() {
                i = {},
                o = []
            }
        }
    },
    {
        "../core": 38
    }],
    113 : [function(e, t, r) {
        var n = e("../core"),
        i = n.util.inherit;
        e("./v3"),
        n.Signers.V3Https = i(n.Signers.V3, {
            authorization: function(e) {
                return "AWS3-HTTPS AWSAccessKeyId=" + e.accessKeyId + ",Algorithm=HmacSHA256,Signature=" + this.signature(e)
            },
            stringToSign: function() {
                return this.request.headers["X-Amz-Date"]
            }
        }),
        t.exports = n.Signers.V3Https
    },
    {
        "../core": 38,
        "./v3": 112
    }],
    112 : [function(e, t, r) {
        var n = e("../core"),
        i = n.util.inherit;
        n.Signers.V3 = i(n.Signers.RequestSigner, {
            addAuthorization: function(e, t) {
                var r = n.util.date.rfc822(t);
                this.request.headers["X-Amz-Date"] = r,
                e.sessionToken && (this.request.headers["x-amz-security-token"] = e.sessionToken),
                this.request.headers["X-Amzn-Authorization"] = this.authorization(e, r)
            },
            authorization: function(e) {
                return "AWS3 AWSAccessKeyId=" + e.accessKeyId + ",Algorithm=HmacSHA256,SignedHeaders=" + this.signedHeaders() + ",Signature=" + this.signature(e)
            },
            signedHeaders: function() {
                var e = [];
                return n.util.arrayEach(this.headersToSign(),
                function(t) {
                    e.push(t.toLowerCase())
                }),
                e.sort().join(";")
            },
            canonicalHeaders: function() {
                var e = this.request.headers,
                t = [];
                return n.util.arrayEach(this.headersToSign(),
                function(r) {
                    t.push(r.toLowerCase().trim() + ":" + String(e[r]).trim())
                }),
                t.sort().join("\n") + "\n"
            },
            headersToSign: function() {
                var e = [];
                return n.util.each(this.request.headers,
                function(t) { ("Host" === t || "Content-Encoding" === t || t.match(/^X-Amz/i)) && e.push(t)
                }),
                e
            },
            signature: function(e) {
                return n.util.crypto.hmac(e.secretAccessKey, this.stringToSign(), "base64")
            },
            stringToSign: function() {
                var e = [];
                return e.push(this.request.method),
                e.push("/"),
                e.push(""),
                e.push(this.canonicalHeaders()),
                e.push(this.request.body),
                n.util.crypto.sha256(e.join("\n"))
            }
        }),
        t.exports = n.Signers.V3
    },
    {
        "../core": 38
    }],
    111 : [function(e, t, r) {
        var n = e("../core"),
        i = n.util.inherit;
        n.Signers.V2 = i(n.Signers.RequestSigner, {
            addAuthorization: function(e, t) {
                t || (t = n.util.date.getDate());
                var r = this.request;
                r.params.Timestamp = n.util.date.iso8601(t),
                r.params.SignatureVersion = "2",
                r.params.SignatureMethod = "HmacSHA256",
                r.params.AWSAccessKeyId = e.accessKeyId,
                e.sessionToken && (r.params.SecurityToken = e.sessionToken),
                delete r.params.Signature,
                r.params.Signature = this.signature(e),
                r.body = n.util.queryParamsToString(r.params),
                r.headers["Content-Length"] = r.body.length
            },
            signature: function(e) {
                return n.util.crypto.hmac(e.secretAccessKey, this.stringToSign(), "base64")
            },
            stringToSign: function() {
                var e = [];
                return e.push(this.request.method),
                e.push(this.request.endpoint.host.toLowerCase()),
                e.push(this.request.pathname()),
                e.push(n.util.queryParamsToString(this.request.params)),
                e.join("\n")
            }
        }),
        t.exports = n.Signers.V2
    },
    {
        "../core": 38
    }],
    110 : [function(e, t, r) {
        var n = e("../core"),
        i = n.util.inherit;
        n.Signers.S3 = i(n.Signers.RequestSigner, {
            subResources: {
                acl: 1,
                accelerate: 1,
                analytics: 1,
                cors: 1,
                lifecycle: 1,
                delete: 1,
                inventory: 1,
                location: 1,
                logging: 1,
                metrics: 1,
                notification: 1,
                partNumber: 1,
                policy: 1,
                requestPayment: 1,
                replication: 1,
                restore: 1,
                tagging: 1,
                torrent: 1,
                uploadId: 1,
                uploads: 1,
                versionId: 1,
                versioning: 1,
                versions: 1,
                website: 1
            },
            responseHeaders: {
                "response-content-type": 1,
                "response-content-language": 1,
                "response-expires": 1,
                "response-cache-control": 1,
                "response-content-disposition": 1,
                "response-content-encoding": 1
            },
            addAuthorization: function(e, t) {
                this.request.headers["presigned-expires"] || (this.request.headers["X-Amz-Date"] = n.util.date.rfc822(t)),
                e.sessionToken && (this.request.headers["x-amz-security-token"] = e.sessionToken);
                var r = this.sign(e.secretAccessKey, this.stringToSign()),
                i = "AWS " + e.accessKeyId + ":" + r;
                this.request.headers.Authorization = i
            },
            stringToSign: function() {
                var e = this.request,
                t = [];
                t.push(e.method),
                t.push(e.headers["Content-MD5"] || ""),
                t.push(e.headers["Content-Type"] || ""),
                t.push(e.headers["presigned-expires"] || "");
                var r = this.canonicalizedAmzHeaders();
                return r && t.push(r),
                t.push(this.canonicalizedResource()),
                t.join("\n")
            },
            canonicalizedAmzHeaders: function() {
                var e = [];
                n.util.each(this.request.headers,
                function(t) {
                    t.match(/^x-amz-/i) && e.push(t)
                }),
                e.sort(function(e, t) {
                    return e.toLowerCase() < t.toLowerCase() ? -1 : 1
                });
                var t = [];
                return n.util.arrayEach.call(this, e,
                function(e) {
                    t.push(e.toLowerCase() + ":" + String(this.request.headers[e]))
                }),
                t.join("\n")
            },
            canonicalizedResource: function() {
                var e = this.request,
                t = e.path.split("?"),
                r = t[0],
                i = t[1],
                o = "";
                if (e.virtualHostedBucket && (o += "/" + e.virtualHostedBucket), o += r, i) {
                    var s = [];
                    n.util.arrayEach.call(this, i.split("&"),
                    function(e) {
                        var t = e.split("=")[0],
                        r = e.split("=")[1];
                        if (this.subResources[t] || this.responseHeaders[t]) {
                            var n = {
                                name: t
                            };
                            void 0 !== r && (this.subResources[t] ? n.value = r: n.value = decodeURIComponent(r)),
                            s.push(n)
                        }
                    }),
                    s.sort(function(e, t) {
                        return e.name < t.name ? -1 : 1
                    }),
                    s.length && (i = [], n.util.arrayEach(s,
                    function(e) {
                        void 0 === e.value ? i.push(e.name) : i.push(e.name + "=" + e.value)
                    }), o += "?" + i.join("&"))
                }
                return o
            },
            sign: function(e, t) {
                return n.util.crypto.hmac(e, t, "base64", "sha1")
            }
        }),
        t.exports = n.Signers.S3
    },
    {
        "../core": 38
    }],
    108 : [function(e, t, r) {
        function n(e) {
            var t = e.httpRequest.headers[a],
            r = e.service.getSignerClass(e);
            if (delete e.httpRequest.headers["User-Agent"], delete e.httpRequest.headers["X-Amz-User-Agent"], r === o.Signers.V4) {
                if (t > 604800) {
                    throw o.util.error(new Error, {
                        code: "InvalidExpiryTime",
                        message: "Presigning does not support expiry time greater than a week with SigV4 signing.",
                        retryable: !1
                    })
                }
                e.httpRequest.headers[a] = t
            } else {
                if (r !== o.Signers.S3) throw o.util.error(new Error, {
                    message: "Presigning only supports S3 or SigV4 signing.",
                    code: "UnsupportedSigner",
                    retryable: !1
                });
                var n = e.service ? e.service.getSkewCorrectedDate() : o.util.date.getDate();
                e.httpRequest.headers[a] = parseInt(o.util.date.unixTimestamp(n) + t, 10).toString()
            }
        }
        function i(e) {
            var t = e.httpRequest.endpoint,
            r = o.util.urlParse(e.httpRequest.path),
            n = {};
            r.search && (n = o.util.queryStringParse(r.search.substr(1)));
            var i = e.httpRequest.headers.Authorization.split(" ");
            if ("AWS" === i[0]) i = i[1].split(":"),
            n.AWSAccessKeyId = i[0],
            n.Signature = i[1],
            o.util.each(e.httpRequest.headers,
            function(e, t) {
                e === a && (e = "Expires"),
                0 === e.indexOf("x-amz-meta-") && (delete n[e], e = e.toLowerCase()),
                n[e] = t
            }),
            delete e.httpRequest.headers[a],
            delete n.Authorization,
            delete n.Host;
            else if ("AWS4-HMAC-SHA256" === i[0]) {
                i.shift();
                var s = i.join(" "),
                u = s.match(/Signature=(.*?)(?:,|\s|\r?\n|$)/)[1];
                n["X-Amz-Signature"] = u,
                delete n.Expires
            }
            t.pathname = r.pathname,
            t.search = o.util.queryParamsToString(n)
        }
        var o = e("../core"),
        s = o.util.inherit,
        a = "presigned-expires";
        o.Signers.Presign = s({
            sign: function(e, t, r) {
                if (e.httpRequest.headers[a] = t || 3600, e.on("build", n), e.on("sign", i), e.removeListener("afterBuild", o.EventListeners.Core.SET_CONTENT_LENGTH), e.removeListener("afterBuild", o.EventListeners.Core.COMPUTE_SHA256), e.emit("beforePresign", [e]), !r) {
                    if (e.build(), e.response.error) throw e.response.error;
                    return o.util.urlFormat(e.httpRequest.endpoint)
                }
                e.build(function() {
                    this.response.error ? r(this.response.error) : r(null, o.util.urlFormat(e.httpRequest.endpoint))
                })
            }
        }),
        t.exports = o.Signers.Presign
    },
    {
        "../core": 38
    }],
    89 : [function(e, t, r) { (function(r) {
            var n = e("./core"),
            i = e("./model/api"),
            o = e("./region_config"),
            s = n.util.inherit,
            a = 0;
            n.Service = s({
                constructor: function(e) {
                    if (!this.loadServiceClass) throw n.util.error(new Error, "Service must be constructed with `new' operator");
                    var t = this.loadServiceClass(e || {});
                    if (t) {
                        var r = n.util.copy(e),
                        i = new t(e);
                        return Object.defineProperty(i, "_originalConfig", {
                            get: function() {
                                return r
                            },
                            enumerable: !1,
                            configurable: !0
                        }),
                        i._clientId = ++a,
                        i
                    }
                    this.initialize(e)
                },
                initialize: function(e) {
                    var t = n.config[this.serviceIdentifier];
                    if (this.config = new n.Config(n.config), t && this.config.update(t, !0), e && this.config.update(e, !0), this.validateService(), this.config.endpoint || o(this), this.config.endpoint = this.endpointFromTemplate(this.config.endpoint), this.setEndpoint(this.config.endpoint), n.SequentialExecutor.call(this), n.Service.addDefaultMonitoringListeners(this), (this.config.clientSideMonitoring || n.Service._clientSideMonitoring) && this.publisher) {
                        var i = this.publisher;
                        this.addNamedListener("PUBLISH_API_CALL", "apiCall",
                        function(e) {
                            r.nextTick(function() {
                                i.eventHandler(e)
                            })
                        }),
                        this.addNamedListener("PUBLISH_API_ATTEMPT", "apiCallAttempt",
                        function(e) {
                            r.nextTick(function() {
                                i.eventHandler(e)
                            })
                        })
                    }
                },
                validateService: function() {},
                loadServiceClass: function(e) {
                    var t = e;
                    if (n.util.isEmpty(this.api)) {
                        if (t.apiConfig) return n.Service.defineServiceApi(this.constructor, t.apiConfig);
                        if (this.constructor.services) {
                            t = new n.Config(n.config),
                            t.update(e, !0);
                            var r = t.apiVersions[this.constructor.serviceIdentifier];
                            return r = r || t.apiVersion,
                            this.getLatestServiceClass(r)
                        }
                        return null
                    }
                    return null
                },
                getLatestServiceClass: function(e) {
                    return e = this.getLatestServiceVersion(e),
                    null === this.constructor.services[e] && n.Service.defineServiceApi(this.constructor, e),
                    this.constructor.services[e]
                },
                getLatestServiceVersion: function(e) {
                    if (!this.constructor.services || 0 === this.constructor.services.length) throw new Error("No services defined on " + this.constructor.serviceIdentifier);
                    if (e ? n.util.isType(e, Date) && (e = n.util.date.iso8601(e).split("T")[0]) : e = "latest", Object.hasOwnProperty(this.constructor.services, e)) return e;
                    for (var t = Object.keys(this.constructor.services).sort(), r = null, i = t.length - 1; i >= 0; i--) if ("*" !== t[i][t[i].length - 1] && (r = t[i]), t[i].substr(0, 10) <= e) return r;
                    throw new Error("Could not find " + this.constructor.serviceIdentifier + " API to satisfy version constraint `" + e + "'")
                },
                api: {},
                defaultRetryCount: 3,
                customizeRequests: function(e) {
                    if (e) {
                        if ("function" != typeof e) throw new Error("Invalid callback type '" + typeof e + "' provided in customizeRequests");
                        this.customRequestHandler = e
                    } else this.customRequestHandler = null
                },
                makeRequest: function(e, t, r) {
                    if ("function" == typeof t && (r = t, t = null), t = t || {},
                    this.config.params) {
                        var i = this.api.operations[e];
                        i && (t = n.util.copy(t), n.util.each(this.config.params,
                        function(e, r) {
                            i.input.members[e] && (void 0 !== t[e] && null !== t[e] || (t[e] = r))
                        }))
                    }
                    var o = new n.Request(this, e, t);
                    return this.addAllRequestListeners(o),
                    this.attachMonitoringEmitter(o),
                    r && o.send(r),
                    o
                },
                makeUnauthenticatedRequest: function(e, t, r) {
                    "function" == typeof t && (r = t, t = {});
                    var n = this.makeRequest(e, t).toUnauthenticated();
                    return r ? n.send(r) : n
                },
                waitFor: function(e, t, r) {
                    return new n.ResourceWaiter(this, e).wait(t, r)
                },
                addAllRequestListeners: function(e) {
                    for (var t = [n.events, n.EventListeners.Core, this.serviceInterface(), n.EventListeners.CorePost], r = 0; r < t.length; r++) t[r] && e.addListeners(t[r]);
                    this.config.paramValidation || e.removeListener("validate", n.EventListeners.Core.VALIDATE_PARAMETERS),
                    this.config.logger && e.addListeners(n.EventListeners.Logger),
                    this.setupRequestListeners(e),
                    "function" == typeof this.constructor.prototype.customRequestHandler && this.constructor.prototype.customRequestHandler(e),
                    Object.prototype.hasOwnProperty.call(this, "customRequestHandler") && "function" == typeof this.customRequestHandler && this.customRequestHandler(e)
                },
                apiCallEvent: function(e) {
                    var t = e.service.api.operations[e.operation],
                    r = {
                        Type: "ApiCall",
                        Api: t ? t.name: e.operation,
                        Version: 1,
                        Service: e.service.api.serviceId || e.service.api.endpointPrefix,
                        Region: e.httpRequest.region,
                        MaxRetriesExceeded: 0,
                        UserAgent: e.httpRequest.getUserAgent()
                    },
                    n = e.response;
                    if (n.httpResponse.statusCode && (r.FinalHttpStatusCode = n.httpResponse.statusCode), n.error) {
                        var i = n.error;
                        n.httpResponse.statusCode > 299 ? (i.code && (r.FinalAwsException = i.code), i.message && (r.FinalAwsExceptionMessage = i.message)) : ((i.code || i.name) && (r.FinalSdkException = i.code || i.name), i.message && (r.FinalSdkExceptionMessage = i.message))
                    }
                    return r
                },
                apiAttemptEvent: function(e) {
                    var t = e.service.api.operations[e.operation],
                    r = {
                        Type: "ApiCallAttempt",
                        Api: t ? t.name: e.operation,
                        Version: 1,
                        Service: e.service.api.serviceId || e.service.api.endpointPrefix,
                        Fqdn: e.httpRequest.endpoint.hostname,
                        UserAgent: e.httpRequest.getUserAgent()
                    },
                    n = e.response;
                    return n.httpResponse.statusCode && (r.HttpStatusCode = n.httpResponse.statusCode),
                    !e._unAuthenticated && e.service.config.credentials && e.service.config.credentials.accessKeyId && (r.AccessKey = e.service.config.credentials.accessKeyId),
                    n.httpResponse.headers ? (e.httpRequest.headers["x-amz-security-token"] && (r.SessionToken = e.httpRequest.headers["x-amz-security-token"]), n.httpResponse.headers["x-amzn-requestid"] && (r.XAmznRequestId = n.httpResponse.headers["x-amzn-requestid"]), n.httpResponse.headers["x-amz-request-id"] && (r.XAmzRequestId = n.httpResponse.headers["x-amz-request-id"]), n.httpResponse.headers["x-amz-id-2"] && (r.XAmzId2 = n.httpResponse.headers["x-amz-id-2"]), r) : r
                },
                attemptFailEvent: function(e) {
                    var t = this.apiAttemptEvent(e),
                    r = e.response,
                    n = r.error;
                    return r.httpResponse.statusCode > 299 ? (n.code && (t.AwsException = n.code), n.message && (t.AwsExceptionMessage = n.message)) : ((n.code || n.name) && (t.SdkException = n.code || n.name), n.message && (t.SdkExceptionMessage = n.message)),
                    t
                },
                attachMonitoringEmitter: function(e) {
                    var t, r, i, o, s, a, u = 0,
                    c = this;
                    e.on("validate",
                    function() {
                        o = n.util.realClock.now(),
                        a = Date.now()
                    },
                    !0),
                    e.on("sign",
                    function() {
                        r = n.util.realClock.now(),
                        t = Date.now(),
                        s = e.httpRequest.region,
                        u++
                    },
                    !0),
                    e.on("validateResponse",
                    function() {
                        i = Math.round(n.util.realClock.now() - r)
                    }),
                    e.addNamedListener("API_CALL_ATTEMPT", "success",
                    function() {
                        var r = c.apiAttemptEvent(e);
                        r.Timestamp = t,
                        r.AttemptLatency = i >= 0 ? i: 0,
                        r.Region = s,
                        c.emit("apiCallAttempt", [r])
                    }),
                    e.addNamedListener("API_CALL_ATTEMPT_RETRY", "retry",
                    function() {
                        var o = c.attemptFailEvent(e);
                        o.Timestamp = t,
                        i = i || Math.round(n.util.realClock.now() - r),
                        o.AttemptLatency = i >= 0 ? i: 0,
                        o.Region = s,
                        c.emit("apiCallAttempt", [o])
                    }),
                    e.addNamedListener("API_CALL", "complete",
                    function() {
                        var t = c.apiCallEvent(e);
                        if (t.AttemptCount = u, !(t.AttemptCount <= 0)) {
                            t.Timestamp = a;
                            var r = Math.round(n.util.realClock.now() - o);
                            t.Latency = r >= 0 ? r: 0;
                            var i = e.response;
                            "number" == typeof i.retryCount && "number" == typeof i.maxRetries && i.retryCount >= i.maxRetries && (t.MaxRetriesExceeded = 1),
                            c.emit("apiCall", [t])
                        }
                    })
                },
                setupRequestListeners: function(e) {},
                getSignerClass: function(e) {
                    var t, r = null,
                    i = "";
                    if (e) {
                        r = (e.service.api.operations || {})[e.operation] || null,
                        i = r ? r.authtype: ""
                    }
                    return t = this.config.signatureVersion ? this.config.signatureVersion: "v4" === i || "v4-unsigned-body" === i ? "v4": this.api.signatureVersion,
                    n.Signers.RequestSigner.getVersion(t)
                },
                serviceInterface: function() {
                    switch (this.api.protocol) {
                    case "ec2":
                    case "query":
                        return n.EventListeners.Query;
                    case "json":
                        return n.EventListeners.Json;
                    case "rest-json":
                        return n.EventListeners.RestJson;
                    case "rest-xml":
                        return n.EventListeners.RestXml
                    }
                    if (this.api.protocol) throw new Error("Invalid service `protocol' " + this.api.protocol + " in API config")
                },
                successfulResponse: function(e) {
                    return e.httpResponse.statusCode < 300
                },
                numRetries: function() {
                    return void 0 !== this.config.maxRetries ? this.config.maxRetries: this.defaultRetryCount
                },
                retryDelays: function(e) {
                    return n.util.calculateRetryDelay(e, this.config.retryDelayOptions)
                },
                retryableError: function(e) {
                    return !! this.timeoutError(e) || ( !! this.networkingError(e) || ( !! this.expiredCredentialsError(e) || ( !! this.throttledError(e) || e.statusCode >= 500)))
                },
                networkingError: function(e) {
                    return "NetworkingError" === e.code
                },
                timeoutError: function(e) {
                    return "TimeoutError" === e.code
                },
                expiredCredentialsError: function(e) {
                    return "ExpiredTokenException" === e.code
                },
                clockSkewError: function(e) {
                    switch (e.code) {
                    case "RequestTimeTooSkewed":
                    case "RequestExpired":
                    case "InvalidSignatureException":
                    case "SignatureDoesNotMatch":
                    case "AuthFailure":
                    case "RequestInTheFuture":
                        return ! 0;
                    default:
                        return ! 1
                    }
                },
                getSkewCorrectedDate: function() {
                    return new Date(Date.now() + this.config.systemClockOffset)
                },
                applyClockOffset: function(e) {
                    e && (this.config.systemClockOffset = e - Date.now())
                },
                isClockSkewed: function(e) {
                    if (e) return Math.abs(this.getSkewCorrectedDate().getTime() - e) >= 3e4
                },
                throttledError: function(e) {
                    switch (e.code) {
                    case "ProvisionedThroughputExceededException":
                    case "Throttling":
                    case "ThrottlingException":
                    case "RequestLimitExceeded":
                    case "RequestThrottled":
                    case "RequestThrottledException":
                    case "TooManyRequestsException":
                    case "TransactionInProgressException":
                        return ! 0;
                    default:
                        return ! 1
                    }
                },
                endpointFromTemplate: function(e) {
                    if ("string" != typeof e) return e;
                    var t = e;
                    return t = t.replace(/\{service\}/g, this.api.endpointPrefix),
                    t = t.replace(/\{region\}/g, this.config.region),
                    t = t.replace(/\{scheme\}/g, this.config.sslEnabled ? "https": "http")
                },
                setEndpoint: function(e) {
                    this.endpoint = new n.Endpoint(e, this.config)
                },
                paginationConfig: function(e, t) {
                    var r = this.api.operations[e].paginator;
                    if (!r) {
                        if (t) {
                            var i = new Error;
                            throw n.util.error(i, "No pagination configuration for " + e)
                        }
                        return null
                    }
                    return r
                }
            }),
            n.util.update(n.Service, {
                defineMethods: function(e) {
                    n.util.each(e.prototype.api.operations,
                    function(t) {
                        if (!e.prototype[t]) {
                            "none" === e.prototype.api.operations[t].authtype ? e.prototype[t] = function(e, r) {
                                return this.makeUnauthenticatedRequest(t, e, r)
                            }: e.prototype[t] = function(e, r) {
                                return this.makeRequest(t, e, r)
                            }
                        }
                    })
                },
                defineService: function(e, t, r) {
                    n.Service._serviceMap[e] = !0,
                    Array.isArray(t) || (r = t, t = []);
                    var i = s(n.Service, r || {});
                    if ("string" == typeof e) {
                        n.Service.addVersions(i, t);
                        var o = i.serviceIdentifier || e;
                        i.serviceIdentifier = o
                    } else i.prototype.api = e,
                    n.Service.defineMethods(i);
                    if (n.SequentialExecutor.call(this.prototype), !this.prototype.publisher && n.util.clientSideMonitoring) {
                        var a = n.util.clientSideMonitoring.Publisher,
                        u = n.util.clientSideMonitoring.configProvider,
                        c = u();
                        this.prototype.publisher = new a(c),
                        c.enabled && (n.Service._clientSideMonitoring = !0)
                    }
                    return n.SequentialExecutor.call(i.prototype),
                    n.Service.addDefaultMonitoringListeners(i.prototype),
                    i
                },
                addVersions: function(e, t) {
                    Array.isArray(t) || (t = [t]),
                    e.services = e.services || {};
                    for (var r = 0; r < t.length; r++) void 0 === e.services[t[r]] && (e.services[t[r]] = null);
                    e.apiVersions = Object.keys(e.services).sort()
                },
                defineServiceApi: function(e, t, r) {
                    function o(e) {
                        e.isApi ? a.prototype.api = e: a.prototype.api = new i(e)
                    }
                    var a = s(e, {
                        serviceIdentifier: e.serviceIdentifier
                    });
                    if ("string" == typeof t) {
                        if (r) o(r);
                        else try {
                            o(n.apiLoader(e.serviceIdentifier, t))
                        } catch(r) {
                            throw n.util.error(r, {
                                message: "Could not find API configuration " + e.serviceIdentifier + "-" + t
                            })
                        }
                        Object.prototype.hasOwnProperty.call(e.services, t) || (e.apiVersions = e.apiVersions.concat(t).sort()),
                        e.services[t] = a
                    } else o(t);
                    return n.Service.defineMethods(a),
                    a
                },
                hasService: function(e) {
                    return Object.prototype.hasOwnProperty.call(n.Service._serviceMap, e)
                },
                addDefaultMonitoringListeners: function(e) {
                    e.addNamedListener("MONITOR_EVENTS_BUBBLE", "apiCallAttempt",
                    function(t) {
                        var r = Object.getPrototypeOf(e);
                        r._events && r.emit("apiCallAttempt", [t])
                    }),
                    e.addNamedListener("CALL_EVENTS_BUBBLE", "apiCall",
                    function(t) {
                        var r = Object.getPrototypeOf(e);
                        r._events && r.emit("apiCall", [t])
                    })
                },
                _serviceMap: {}
            }),
            n.util.mixin(n.Service, n.SequentialExecutor),
            t.exports = n.Service
        }).call(this, e("_process"))
    },
    {
        "./core": 38,
        "./model/api": 65,
        "./region_config": 82,
        _process: 9
    }],
    82 : [function(e, t, r) {
        function n(e) {
            if (!e) return null;
            var t = e.split("-");
            return t.length < 3 ? null: t.slice(0, t.length - 2).join("-") + "-*"
        }
        function i(e) {
            var t = e.config.region,
            r = n(t),
            i = e.api.endpointPrefix;
            return [[t, i], [r, i], [t, "*"], [r, "*"], ["*", i], ["*", "*"]].map(function(e) {
                return e[0] && e[1] ? e.join("/") : null
            })
        }
        function o(e, t) {
            a.each(t,
            function(t, r) {
                "globalEndpoint" !== t && (void 0 !== e.config[t] && null !== e.config[t] || (e.config[t] = r))
            })
        }
        function s(e) {
            for (var t = i(e), r = 0; r < t.length; r++) {
                var n = t[r];
                if (n && Object.prototype.hasOwnProperty.call(u.rules, n)) {
                    var s = u.rules[n];
                    return "string" == typeof s && (s = u.patterns[s]),
                    e.config.useDualstack && a.isDualstackAvailable(e) && (s = a.copy(s), s.endpoint = "{service}.dualstack.{region}.amazonaws.com"),
                    e.isGlobalEndpoint = !!s.globalEndpoint,
                    s.signatureVersion || (s.signatureVersion = "v4"),
                    void o(e, s)
                }
            }
        }
        var a = e("./util"),
        u = e("./region_config_data.json");
        t.exports = s
    },
    {
        "./region_config_data.json": 83,
        "./util": 117
    }],
    83 : [function(e, t, r) {
        t.exports = {
            rules: {
                "*/*": {
                    endpoint: "{service}.{region}.amazonaws.com"
                },
                "cn-*/*": {
                    endpoint: "{service}.{region}.amazonaws.com.cn"
                },
                "*/budgets": "globalSSL",
                "*/cloudfront": "globalSSL",
                "*/iam": "globalSSL",
                "*/sts": "globalSSL",
                "*/importexport": {
                    endpoint: "{service}.amazonaws.com",
                    signatureVersion: "v2",
                    globalEndpoint: !0
                },
                "*/route53": {
                    endpoint: "https://{service}.amazonaws.com",
                    signatureVersion: "v3https",
                    globalEndpoint: !0
                },
                "*/waf": "globalSSL",
                "us-gov-*/iam": "globalGovCloud",
                "us-gov-*/sts": {
                    endpoint: "{service}.{region}.amazonaws.com"
                },
                "us-gov-west-1/s3": "s3signature",
                "us-west-1/s3": "s3signature",
                "us-west-2/s3": "s3signature",
                "eu-west-1/s3": "s3signature",
                "ap-southeast-1/s3": "s3signature",
                "ap-southeast-2/s3": "s3signature",
                "ap-northeast-1/s3": "s3signature",
                "sa-east-1/s3": "s3signature",
                "us-east-1/s3": {
                    endpoint: "{service}.amazonaws.com",
                    signatureVersion: "s3"
                },
                "us-east-1/sdb": {
                    endpoint: "{service}.amazonaws.com",
                    signatureVersion: "v2"
                },
                "*/sdb": {
                    endpoint: "{service}.{region}.amazonaws.com",
                    signatureVersion: "v2"
                }
            },
            patterns: {
                globalSSL: {
                    endpoint: "https://{service}.amazonaws.com",
                    globalEndpoint: !0
                },
                globalGovCloud: {
                    endpoint: "{service}.us-gov.amazonaws.com"
                },
                s3signature: {
                    endpoint: "{service}.{region}.amazonaws.com",
                    signatureVersion: "s3"
                }
            }
        }
    },
    {}],
    86 : [function(e, t, r) {
        var n = e("./core"),
        i = n.util.inherit,
        o = e("jmespath");
        n.Response = i({
            constructor: function(e) {
                this.request = e,
                this.data = null,
                this.error = null,
                this.retryCount = 0,
                this.redirectCount = 0,
                this.httpResponse = new n.HttpResponse,
                e && (this.maxRetries = e.service.numRetries(), this.maxRedirects = e.service.config.maxRedirects)
            },
            nextPage: function(e) {
                var t, r = this.request.service,
                i = this.request.operation;
                try {
                    t = r.paginationConfig(i, !0)
                } catch(e) {
                    this.error = e
                }
                if (!this.hasNextPage()) {
                    if (e) e(this.error, null);
                    else if (this.error) throw this.error;
                    return null
                }
                var o = n.util.copy(this.request.params);
                if (this.nextPageTokens) {
                    var s = t.inputToken;
                    "string" == typeof s && (s = [s]);
                    for (var a = 0; a < s.length; a++) o[s[a]] = this.nextPageTokens[a];
                    return r.makeRequest(this.request.operation, o, e)
                }
                return e ? e(null, null) : null
            },
            hasNextPage: function() {
                return this.cacheNextPageTokens(),
                !!this.nextPageTokens || void 0 === this.nextPageTokens && void 0
            },
            cacheNextPageTokens: function() {
                if (Object.prototype.hasOwnProperty.call(this, "nextPageTokens")) return this.nextPageTokens;
                this.nextPageTokens = void 0;
                var e = this.request.service.paginationConfig(this.request.operation);
                if (!e) return this.nextPageTokens;
                if (this.nextPageTokens = null, e.moreResults && !o.search(this.data, e.moreResults)) return this.nextPageTokens;
                var t = e.outputToken;
                return "string" == typeof t && (t = [t]),
                n.util.arrayEach.call(this, t,
                function(e) {
                    var t = o.search(this.data, e);
                    t && (this.nextPageTokens = this.nextPageTokens || [], this.nextPageTokens.push(t))
                }),
                this.nextPageTokens
            }
        })
    },
    {
        "./core": 38,
        jmespath: 8
    }],
    85 : [function(e, t, r) {
        function n(e) {
            var t = e.request._waiter,
            r = t.config.acceptors,
            n = !1,
            i = "retry";
            r.forEach(function(r) {
                if (!n) {
                    var o = t.matchers[r.matcher];
                    o && o(e, r.expected, r.argument) && (n = !0, i = r.state)
                }
            }),
            !n && e.error && (i = "failure"),
            "success" === i ? t.setSuccess(e) : t.setError(e, "retry" === i)
        }
        var i = e("./core"),
        o = i.util.inherit,
        s = e("jmespath");
        i.ResourceWaiter = o({
            constructor: function(e, t) {
                this.service = e,
                this.state = t,
                this.loadWaiterConfig(this.state)
            },
            service: null,
            state: null,
            config: null,
            matchers: {
                path: function(e, t, r) {
                    try {
                        var n = s.search(e.data, r)
                    } catch(e) {
                        return ! 1
                    }
                    return s.strictDeepEqual(n, t)
                },
                pathAll: function(e, t, r) {
                    try {
                        var n = s.search(e.data, r)
                    } catch(e) {
                        return ! 1
                    }
                    Array.isArray(n) || (n = [n]);
                    var i = n.length;
                    if (!i) return ! 1;
                    for (var o = 0; o < i; o++) if (!s.strictDeepEqual(n[o], t)) return ! 1;
                    return ! 0
                },
                pathAny: function(e, t, r) {
                    try {
                        var n = s.search(e.data, r)
                    } catch(e) {
                        return ! 1
                    }
                    Array.isArray(n) || (n = [n]);
                    for (var i = n.length,
                    o = 0; o < i; o++) if (s.strictDeepEqual(n[o], t)) return ! 0;
                    return ! 1
                },
                status: function(e, t) {
                    var r = e.httpResponse.statusCode;
                    return "number" == typeof r && r === t
                },
                error: function(e, t) {
                    return "string" == typeof t && e.error ? t === e.error.code: t === !!e.error
                }
            },
            listeners: (new i.SequentialExecutor).addNamedListeners(function(e) {
                e("RETRY_CHECK", "retry",
                function(e) {
                    var t = e.request._waiter;
                    e.error && "ResourceNotReady" === e.error.code && (e.error.retryDelay = 1e3 * (t.config.delay || 0))
                }),
                e("CHECK_OUTPUT", "extractData", n),
                e("CHECK_ERROR", "extractError", n)
            }),
            wait: function(e, t) {
                "function" == typeof e && (t = e, e = void 0),
                e && e.$waiter && (e = i.util.copy(e), "number" == typeof e.$waiter.delay && (this.config.delay = e.$waiter.delay), "number" == typeof e.$waiter.maxAttempts && (this.config.maxAttempts = e.$waiter.maxAttempts), delete e.$waiter);
                var r = this.service.makeRequest(this.config.operation, e);
                return r._waiter = this,
                r.response.maxRetries = this.config.maxAttempts,
                r.addListeners(this.listeners),
                t && r.send(t),
                r
            },
            setSuccess: function(e) {
                e.error = null,
                e.data = e.data || {},
                e.request.removeAllListeners("extractData")
            },
            setError: function(e, t) {
                e.data = null,
                e.error = i.util.error(e.error || new Error, {
                    code: "ResourceNotReady",
                    message: "Resource is not in the state " + this.state,
                    retryable: t
                })
            },
            loadWaiterConfig: function(e) {
                if (!this.service.api.waiters[e]) throw new i.util.error(new Error, {
                    code: "StateNotFoundError",
                    message: "State " + e + " not found."
                });
                this.config = i.util.copy(this.service.api.waiters[e])
            }
        })
    },
    {
        "./core": 38,
        jmespath: 8
    }],
    84 : [function(e, t, r) { (function(t) {
            function r(e) {
                return Object.prototype.hasOwnProperty.call(u, e._asm.currentState)
            }
            var n = e("./core"),
            i = e("./state_machine"),
            o = n.util.inherit,
            s = n.util.domain,
            a = e("jmespath"),
            u = {
                success: 1,
                error: 1,
                complete: 1
            },
            c = new i;
            c.setupStates = function() {
                var e = function(e, t) {
                    var n = this;
                    n._haltHandlersOnError = !1,
                    n.emit(n._asm.currentState,
                    function(e) {
                        if (e) if (r(n)) {
                            if (! (s && n.domain instanceof s.Domain)) throw e;
                            e.domainEmitter = n,
                            e.domain = n.domain,
                            e.domainThrown = !1,
                            n.domain.emit("error", e)
                        } else n.response.error = e,
                        t(e);
                        else t(n.response.error)
                    })
                };
                this.addState("validate", "build", "error", e),
                this.addState("build", "afterBuild", "restart", e),
                this.addState("afterBuild", "sign", "restart", e),
                this.addState("sign", "send", "retry", e),
                this.addState("retry", "afterRetry", "afterRetry", e),
                this.addState("afterRetry", "sign", "error", e),
                this.addState("send", "validateResponse", "retry", e),
                this.addState("validateResponse", "extractData", "extractError", e),
                this.addState("extractError", "extractData", "retry", e),
                this.addState("extractData", "success", "retry", e),
                this.addState("restart", "build", "error", e),
                this.addState("success", "complete", "complete", e),
                this.addState("error", "complete", "complete", e),
                this.addState("complete", null, null, e)
            },
            c.setupStates(),
            n.Request = o({
                constructor: function(e, t, r) {
                    var o = e.endpoint,
                    a = e.config.region,
                    u = e.config.customUserAgent;
                    e.isGlobalEndpoint && (a = "us-east-1"),
                    this.domain = s && s.active,
                    this.service = e,
                    this.operation = t,
                    this.params = r || {},
                    this.httpRequest = new n.HttpRequest(o, a),
                    this.httpRequest.appendToUserAgent(u),
                    this.startTime = e.getSkewCorrectedDate(),
                    this.response = new n.Response(this),
                    this._asm = new i(c.states, "validate"),
                    this._haltHandlersOnError = !1,
                    n.SequentialExecutor.call(this),
                    this.emit = this.emitEvent
                },
                send: function(e) {
                    return e && (this.httpRequest.appendToUserAgent("callback"), this.on("complete",
                    function(t) {
                        e.call(t, t.error, t.data)
                    })),
                    this.runTo(),
                    this.response
                },
                build: function(e) {
                    return this.runTo("send", e)
                },
                runTo: function(e, t) {
                    return this._asm.runTo(e, t, this),
                    this
                },
                abort: function() {
                    return this.removeAllListeners("validateResponse"),
                    this.removeAllListeners("extractError"),
                    this.on("validateResponse",
                    function(e) {
                        e.error = n.util.error(new Error("Request aborted by user"), {
                            code: "RequestAbortedError",
                            retryable: !1
                        })
                    }),
                    this.httpRequest.stream && !this.httpRequest.stream.didCallback && (this.httpRequest.stream.abort(), this.httpRequest._abortCallback ? this.httpRequest._abortCallback() : this.removeAllListeners("send")),
                    this
                },
                eachPage: function(e) {
                    function t(r) {
                        e.call(r, r.error, r.data,
                        function(i) { ! 1 !== i && (r.hasNextPage() ? r.nextPage().on("complete", t).send() : e.call(r, null, null, n.util.fn.noop))
                        })
                    }
                    e = n.util.fn.makeAsync(e, 3),
                    this.on("complete", t).send()
                },
                eachItem: function(e) {
                    function t(t, i) {
                        if (t) return e(t, null);
                        if (null === i) return e(null, null);
                        var o = r.service.paginationConfig(r.operation),
                        s = o.resultKey;
                        Array.isArray(s) && (s = s[0]);
                        var u = a.search(i, s),
                        c = !0;
                        return n.util.arrayEach(u,
                        function(t) {
                            if (!1 === (c = e(null, t))) return n.util.abort
                        }),
                        c
                    }
                    var r = this;
                    this.eachPage(t)
                },
                isPageable: function() {
                    return !! this.service.paginationConfig(this.operation)
                },
                createReadStream: function() {
                    var e = n.util.stream,
                    r = this,
                    i = null;
                    return 2 === n.HttpClient.streamsApiVersion ? (i = new e.PassThrough, t.nextTick(function() {
                        r.send()
                    })) : (i = new e.Stream, i.readable = !0, i.sent = !1, i.on("newListener",
                    function(e) {
                        i.sent || "data" !== e || (i.sent = !0, t.nextTick(function() {
                            r.send()
                        }))
                    })),
                    this.on("error",
                    function(e) {
                        i.emit("error", e)
                    }),
                    this.on("httpHeaders",
                    function(t, o, s) {
                        if (t < 300) {
                            r.removeListener("httpData", n.EventListeners.Core.HTTP_DATA),
                            r.removeListener("httpError", n.EventListeners.Core.HTTP_ERROR),
                            r.on("httpError",
                            function(e) {
                                s.error = e,
                                s.error.retryable = !1
                            });
                            var a, u = !1;
                            if ("HEAD" !== r.httpRequest.method && (a = parseInt(o["content-length"], 10)), void 0 !== a && !isNaN(a) && a >= 0) {
                                u = !0;
                                var c = 0
                            }
                            var h = function() {
                                u && c !== a ? i.emit("error", n.util.error(new Error("Stream content length mismatch. Received " + c + " of " + a + " bytes."), {
                                    code: "StreamContentLengthMismatch"
                                })) : 2 === n.HttpClient.streamsApiVersion ? i.end() : i.emit("end")
                            },
                            l = s.httpResponse.createUnbufferedStream();
                            if (2 === n.HttpClient.streamsApiVersion) if (u) {
                                var p = new e.PassThrough;
                                p._write = function(t) {
                                    return t && t.length && (c += t.length),
                                    e.PassThrough.prototype._write.apply(this, arguments)
                                },
                                p.on("end", h),
                                i.on("error",
                                function(e) {
                                    u = !1,
                                    l.unpipe(p),
                                    p.emit("end"),
                                    p.end()
                                }),
                                l.pipe(p).pipe(i, {
                                    end: !1
                                })
                            } else l.pipe(i);
                            else u && l.on("data",
                            function(e) {
                                e && e.length && (c += e.length)
                            }),
                            l.on("data",
                            function(e) {
                                i.emit("data", e)
                            }),
                            l.on("end", h);
                            l.on("error",
                            function(e) {
                                u = !1,
                                i.emit("error", e)
                            })
                        }
                    }),
                    i
                },
                emitEvent: function(e, t, r) {
                    "function" == typeof t && (r = t, t = null),
                    r || (r = function() {}),
                    t || (t = this.eventParameters(e, this.response)),
                    n.SequentialExecutor.prototype.emit.call(this, e, t,
                    function(e) {
                        e && (this.response.error = e),
                        r.call(this, e)
                    })
                },
                eventParameters: function(e) {
                    switch (e) {
                    case "restart":
                    case "validate":
                    case "sign":
                    case "build":
                    case "afterValidate":
                    case "afterBuild":
                        return [this];
                    case "error":
                        return [this.response.error, this.response];
                    default:
                        return [this.response]
                    }
                },
                presign: function(e, t) {
                    return t || "function" != typeof e || (t = e, e = null),
                    (new n.Signers.Presign).sign(this.toGet(), e, t)
                },
                isPresigned: function() {
                    return Object.prototype.hasOwnProperty.call(this.httpRequest.headers, "presigned-expires")
                },
                toUnauthenticated: function() {
                    return this._unAuthenticated = !0,
                    this.removeListener("validate", n.EventListeners.Core.VALIDATE_CREDENTIALS),
                    this.removeListener("sign", n.EventListeners.Core.SIGN),
                    this
                },
                toGet: function() {
                    return "query" !== this.service.api.protocol && "ec2" !== this.service.api.protocol || (this.removeListener("build", this.buildAsGet), this.addListener("build", this.buildAsGet)),
                    this
                },
                buildAsGet: function(e) {
                    e.httpRequest.method = "GET",
                    e.httpRequest.path = e.service.endpoint.path + "?" + e.httpRequest.body,
                    e.httpRequest.body = "",
                    delete e.httpRequest.headers["Content-Length"],
                    delete e.httpRequest.headers["Content-Type"]
                },
                haltHandlersOnError: function() {
                    this._haltHandlersOnError = !0
                }
            }),
            n.Request.addPromisesToClass = function(e) {
                this.prototype.promise = function() {
                    var t = this;
                    return this.httpRequest.appendToUserAgent("promise"),
                    new e(function(e, r) {
                        t.on("complete",
                        function(t) {
                            t.error ? r(t.error) : e(Object.defineProperty(t.data || {},
                            "$response", {
                                value: t
                            }))
                        }),
                        t.runTo()
                    })
                }
            },
            n.Request.deletePromisesFromClass = function() {
                delete this.prototype.promise
            },
            n.util.addPromises(n.Request),
            n.util.mixin(n.Request, n.SequentialExecutor)
        }).call(this, e("_process"))
    },
    {
        "./core": 38,
        "./state_machine": 116,
        _process: 9,
        jmespath: 8
    }],
    116 : [function(e, t, r) {
        function n(e, t) {
            this.currentState = t || null,
            this.states = e || {}
        }
        n.prototype.runTo = function(e, t, r, n) {
            "function" == typeof e && (n = r, r = t, t = e, e = null);
            var i = this,
            o = i.states[i.currentState];
            o.fn.call(r || i, n,
            function(n) {
                if (n) {
                    if (!o.fail) return t ? t.call(r, n) : null;
                    i.currentState = o.fail
                } else {
                    if (!o.accept) return t ? t.call(r) : null;
                    i.currentState = o.accept
                }
                if (i.currentState === e) return t ? t.call(r, n) : null;
                i.runTo(e, t, r, n)
            })
        },
        n.prototype.addState = function(e, t, r, n) {
            return "function" == typeof t ? (n = t, t = null, r = null) : "function" == typeof r && (n = r, r = null),
            this.currentState || (this.currentState = e),
            this.states[e] = {
                accept: t,
                fail: r,
                fn: n
            },
            this
        },
        t.exports = n
    },
    {}],
    71 : [function(e, t, r) {
        var n = e("./core");
        n.ParamValidator = n.util.inherit({
            constructor: function(e) { ! 0 !== e && void 0 !== e || (e = {
                    min: !0
                }),
                this.validation = e
            },
            validate: function(e, t, r) {
                if (this.errors = [], this.validateMember(e, t || {},
                r || "params"), this.errors.length > 1) {
                    var i = this.errors.join("\n* ");
                    throw i = "There were " + this.errors.length + " validation errors:\n* " + i,
                    n.util.error(new Error(i), {
                        code: "MultipleValidationErrors",
                        errors: this.errors
                    })
                }
                if (1 === this.errors.length) throw this.errors[0];
                return ! 0
            },
            fail: function(e, t) {
                this.errors.push(n.util.error(new Error(t), {
                    code: e
                }))
            },
            validateStructure: function(e, t, r) {
                this.validateType(t, r, ["object"], "structure");
                for (var n, i = 0; e.required && i < e.required.length; i++) {
                    n = e.required[i];
                    var o = t[n];
                    void 0 !== o && null !== o || this.fail("MissingRequiredParameter", "Missing required key '" + n + "' in " + r)
                }
                for (n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
                    var s = t[n],
                    a = e.members[n];
                    if (void 0 !== a) {
                        var u = [r, n].join(".");
                        this.validateMember(a, s, u)
                    } else this.fail("UnexpectedParameter", "Unexpected key '" + n + "' found in " + r)
                }
                return ! 0
            },
            validateMember: function(e, t, r) {
                switch (e.type) {
                case "structure":
                    return this.validateStructure(e, t, r);
                case "list":
                    return this.validateList(e, t, r);
                case "map":
                    return this.validateMap(e, t, r);
                default:
                    return this.validateScalar(e, t, r)
                }
            },
            validateList: function(e, t, r) {
                if (this.validateType(t, r, [Array])) {
                    this.validateRange(e, t.length, r, "list member count");
                    for (var n = 0; n < t.length; n++) this.validateMember(e.member, t[n], r + "[" + n + "]")
                }
            },
            validateMap: function(e, t, r) {
                if (this.validateType(t, r, ["object"], "map")) {
                    var n = 0;
                    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (this.validateMember(e.key, i, r + "[key='" + i + "']"), this.validateMember(e.value, t[i], r + "['" + i + "']"), n++);
                    this.validateRange(e, n, r, "map member count")
                }
            },
            validateScalar: function(e, t, r) {
                switch (e.type) {
                case null:
                case void 0:
                case "string":
                    return this.validateString(e, t, r);
                case "base64":
                case "binary":
                    return this.validatePayload(t, r);
                case "integer":
                case "float":
                    return this.validateNumber(e, t, r);
                case "boolean":
                    return this.validateType(t, r, ["boolean"]);
                case "timestamp":
                    return this.validateType(t, r, [Date, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/, "number"], "Date object, ISO-8601 string, or a UNIX timestamp");
                default:
                    return this.fail("UnkownType", "Unhandled type " + e.type + " for " + r)
                }
            },
            validateString: function(e, t, r) {
                var n = ["string"];
                e.isJsonValue && (n = n.concat(["number", "object", "boolean"])),
                null !== t && this.validateType(t, r, n) && (this.validateEnum(e, t, r), this.validateRange(e, t.length, r, "string length"), this.validatePattern(e, t, r), this.validateUri(e, t, r))
            },
            validateUri: function(e, t, r) {
                "uri" === e.location && 0 === t.length && this.fail("UriParameterError", 'Expected uri parameter to have length >= 1, but found "' + t + '" for ' + r)
            },
            validatePattern: function(e, t, r) {
                this.validation.pattern && void 0 !== e.pattern && (new RegExp(e.pattern).test(t) || this.fail("PatternMatchError", 'Provided value "' + t + '" does not match regex pattern /' + e.pattern + "/ for " + r))
            },
            validateRange: function(e, t, r, n) {
                this.validation.min && void 0 !== e.min && t < e.min && this.fail("MinRangeError", "Expected " + n + " >= " + e.min + ", but found " + t + " for " + r),
                this.validation.max && void 0 !== e.max && t > e.max && this.fail("MaxRangeError", "Expected " + n + " <= " + e.max + ", but found " + t + " for " + r)
            },
            validateEnum: function(e, t, r) {
                this.validation.enum && void 0 !== e.enum && -1 === e.enum.indexOf(t) && this.fail("EnumError", "Found string value of " + t + ", but expected " + e.enum.join("|") + " for " + r)
            },
            validateType: function(e, t, r, i) {
                if (null === e || void 0 === e) return ! 1;
                for (var o = !1,
                s = 0; s < r.length; s++) {
                    if ("string" == typeof r[s]) {
                        if (typeof e === r[s]) return ! 0
                    } else if (r[s] instanceof RegExp) {
                        if ((e || "").toString().match(r[s])) return ! 0
                    } else {
                        if (e instanceof r[s]) return ! 0;
                        if (n.util.isType(e, r[s])) return ! 0;
                        i || o || (r = r.slice()),
                        r[s] = n.util.typeName(r[s])
                    }
                    o = !0
                }
                var a = i;
                a || (a = r.join(", ").replace(/,([^,]+)$/, ", or$1"));
                var u = a.match(/^[aeiou]/i) ? "n": "";
                return this.fail("InvalidParameterType", "Expected " + t + " to be a" + u + " " + a),
                !1
            },
            validateNumber: function(e, t, r) {
                if (null !== t && void 0 !== t) {
                    if ("string" == typeof t) {
                        var n = parseFloat(t);
                        n.toString() === t && (t = n)
                    }
                    this.validateType(t, r, ["number"]) && this.validateRange(e, t, r, "numeric value")
                }
            },
            validatePayload: function(e, t) {
                if (null !== e && void 0 !== e && "string" != typeof e && (!e || "number" != typeof e.byteLength)) {
                    if (n.util.isNode()) {
                        var r = n.util.stream.Stream;
                        if (n.util.Buffer.isBuffer(e) || e instanceof r) return
                    } else if (void 0 !== typeof Blob && e instanceof Blob) return;
                    var i = ["Buffer", "Stream", "File", "Blob", "ArrayBuffer", "DataView"];
                    if (e) for (var o = 0; o < i.length; o++) {
                        if (n.util.isType(e, i[o])) return;
                        if (n.util.typeName(e.constructor) === i[o]) return
                    }
                    this.fail("InvalidParameterType", "Expected " + t + " to be a string, Buffer, Stream, Blob, or typed array object")
                }
            }
        })
    },
    {
        "./core": 38
    }],
    65 : [function(e, t, r) {
        function n(e, t) {
            function r(e, t) { ! 0 === t.endpointoperation && h(n, "endpointOperation", c.string.lowerFirst(e))
            }
            var n = this;
            e = e || {},
            t = t || {},
            t.api = this,
            e.metadata = e.metadata || {},
            h(this, "isApi", !0, !1),
            h(this, "apiVersion", e.metadata.apiVersion),
            h(this, "endpointPrefix", e.metadata.endpointPrefix),
            h(this, "signingName", e.metadata.signingName),
            h(this, "globalEndpoint", e.metadata.globalEndpoint),
            h(this, "signatureVersion", e.metadata.signatureVersion),
            h(this, "jsonVersion", e.metadata.jsonVersion),
            h(this, "targetPrefix", e.metadata.targetPrefix),
            h(this, "protocol", e.metadata.protocol),
            h(this, "timestampFormat", e.metadata.timestampFormat),
            h(this, "xmlNamespaceUri", e.metadata.xmlNamespace),
            h(this, "abbreviation", e.metadata.serviceAbbreviation),
            h(this, "fullName", e.metadata.serviceFullName),
            h(this, "serviceId", e.metadata.serviceId),
            l(this, "className",
            function() {
                var t = e.metadata.serviceAbbreviation || e.metadata.serviceFullName;
                return t ? (t = t.replace(/^Amazon|AWS\s*|\(.*|\s+|\W+/g, ""), "ElasticLoadBalancing" === t && (t = "ELB"), t) : null
            }),
            h(this, "operations", new i(e.operations, t,
            function(e, r) {
                return new o(e, r, t)
            },
            c.string.lowerFirst, r)),
            h(this, "shapes", new i(e.shapes, t,
            function(e, r) {
                return s.create(r, t)
            })),
            h(this, "paginators", new i(e.paginators, t,
            function(e, r) {
                return new a(e, r, t)
            })),
            h(this, "waiters", new i(e.waiters, t,
            function(e, r) {
                return new u(e, r, t)
            },
            c.string.lowerFirst)),
            t.documentation && (h(this, "documentation", e.documentation), h(this, "documentationUrl", e.documentationUrl))
        }
        var i = e("./collection"),
        o = e("./operation"),
        s = e("./shape"),
        a = e("./paginator"),
        u = e("./resource_waiter"),
        c = e("../util"),
        h = c.property,
        l = c.memoizedProperty;
        t.exports = n
    },
    {
        "../util": 117,
        "./collection": 66,
        "./operation": 67,
        "./paginator": 68,
        "./resource_waiter": 69,
        "./shape": 70
    }],
    69 : [function(e, t, r) {
        function n(e, t, r) {
            r = r || {},
            o(this, "name", e),
            o(this, "api", r.api, !1),
            t.operation && o(this, "operation", i.string.lowerFirst(t.operation));
            var n = this; ["type", "description", "delay", "maxAttempts", "acceptors"].forEach(function(e) {
                var r = t[e];
                r && o(n, e, r)
            })
        }
        var i = e("../util"),
        o = i.property;
        t.exports = n
    },
    {
        "../util": 117
    }],
    68 : [function(e, t, r) {
        function n(e, t) {
            i(this, "inputToken", t.input_token),
            i(this, "limitKey", t.limit_key),
            i(this, "moreResults", t.more_results),
            i(this, "outputToken", t.output_token),
            i(this, "resultKey", t.result_key)
        }
        var i = e("../util").property;
        t.exports = n
    },
    {
        "../util": 117
    }],
    67 : [function(e, t, r) {
        function n(e, t, r) {
            var n = this;
            r = r || {},
            a(this, "name", t.name || e),
            a(this, "api", r.api, !1),
            t.http = t.http || {},
            a(this, "endpoint", t.endpoint),
            a(this, "httpMethod", t.http.method || "POST"),
            a(this, "httpPath", t.http.requestUri || "/"),
            a(this, "authtype", t.authtype || ""),
            a(this, "endpointDiscoveryRequired", t.endpointdiscovery ? t.endpointdiscovery.required ? "REQUIRED": "OPTIONAL": "NULL"),
            u(this, "input",
            function() {
                return t.input ? o.create(t.input, r) : new o.create({
                    type: "structure"
                },
                r)
            }),
            u(this, "output",
            function() {
                return t.output ? o.create(t.output, r) : new o.create({
                    type: "structure"
                },
                r)
            }),
            u(this, "errors",
            function() {
                var e = [];
                if (!t.errors) return null;
                for (var n = 0; n < t.errors.length; n++) e.push(o.create(t.errors[n], r));
                return e
            }),
            u(this, "paginator",
            function() {
                return r.api.paginators[e]
            }),
            r.documentation && (a(this, "documentation", t.documentation), a(this, "documentationUrl", t.documentationUrl)),
            u(this, "idempotentMembers",
            function() {
                var e = [],
                t = n.input,
                r = t.members;
                if (!t.members) return e;
                for (var i in r) r.hasOwnProperty(i) && !0 === r[i].isIdempotent && e.push(i);
                return e
            }),
            u(this, "hasEventOutput",
            function() {
                return i(n.output)
            })
        }
        function i(e) {
            var t = e.members,
            r = e.payload;
            if (!e.members) return ! 1;
            if (r) {
                return t[r].isEventStream
            }
            for (var n in t) if (!t.hasOwnProperty(n) && !0 === t[n].isEventStream) return ! 0;
            return ! 1
        }
        var o = e("./shape"),
        s = e("../util"),
        a = s.property,
        u = s.memoizedProperty;
        t.exports = n
    },
    {
        "../util": 117,
        "./shape": 70
    }],
    61 : [function(e, t, r) {
        var n = e("./core"),
        i = n.util.inherit;
        n.Endpoint = i({
            constructor: function(e, t) {
                if (n.util.hideProperties(this, ["slashes", "auth", "hash", "search", "query"]), void 0 === e || null === e) throw new Error("Invalid endpoint: " + e);
                if ("string" != typeof e) return n.util.copy(e);
                if (!e.match(/^http/)) {
                    e = ((t && void 0 !== t.sslEnabled ? t.sslEnabled: n.config.sslEnabled) ? "https": "http") + "://" + e
                }
                n.util.update(this, n.util.urlParse(e)),
                this.port ? this.port = parseInt(this.port, 10) : this.port = "https:" === this.protocol ? 443 : 80
            }
        }),
        n.HttpRequest = i({
            constructor: function(e, t) {
                e = new n.Endpoint(e),
                this.method = "POST",
                this.path = e.path || "/",
                this.headers = {},
                this.body = "",
                this.endpoint = e,
                this.region = t,
                this._userAgent = "",
                this.setUserAgent()
            },
            setUserAgent: function() {
                this._userAgent = this.headers[this.getUserAgentHeaderName()] = n.util.userAgent()
            },
            getUserAgentHeaderName: function() {
                return (n.util.isBrowser() ? "X-Amz-": "") + "User-Agent"
            },
            appendToUserAgent: function(e) {
                "string" == typeof e && e && (this._userAgent += " " + e),
                this.headers[this.getUserAgentHeaderName()] = this._userAgent
            },
            getUserAgent: function() {
                return this._userAgent
            },
            pathname: function() {
                return this.path.split("?", 1)[0]
            },
            search: function() {
                var e = this.path.split("?", 2)[1];
                return e ? (e = n.util.queryStringParse(e), n.util.queryParamsToString(e)) : ""
            },
            updateEndpoint: function(e) {
                var t = new n.Endpoint(e);
                this.endpoint = t,
                this.path = t.path || "/"
            }
        }),
        n.HttpResponse = i({
            constructor: function() {
                this.statusCode = void 0,
                this.headers = {},
                this.body = void 0,
                this.streaming = !1,
                this.stream = null
            },
            createUnbufferedStream: function() {
                return this.streaming = !0,
                this.stream
            }
        }),
        n.HttpClient = i({}),
        n.HttpClient.getInstance = function() {
            return void 0 === this.singleton && (this.singleton = new this),
            this.singleton
        }
    },
    {
        "./core": 38
    }],
    60 : [function(e, t, r) {
        function n(e) {
            if (!e.service.api.operations) return "";
            var t = e.service.api.operations[e.operation];
            return t ? t.authtype: ""
        }
        var i = e("./core"),
        o = e("./sequential_executor"),
        s = e("./discover_endpoint").discoverEndpoint;
        i.EventListeners = {
            Core: {}
        },
        i.EventListeners = {
            Core: (new o).addNamedListeners(function(e, t) {
                t("VALIDATE_CREDENTIALS", "validate",
                function(e, t) {
                    if (!e.service.api.signatureVersion) return t();
                    e.service.config.getCredentials(function(r) {
                        r && (e.response.error = i.util.error(r, {
                            code: "CredentialsError",
                            message: "Missing credentials in config"
                        })),
                        t()
                    })
                }),
                e("VALIDATE_REGION", "validate",
                function(e) {
                    e.service.config.region || e.service.isGlobalEndpoint || (e.response.error = i.util.error(new Error, {
                        code: "ConfigError",
                        message: "Missing region in config"
                    }))
                }),
                e("BUILD_IDEMPOTENCY_TOKENS", "validate",
                function(e) {
                    if (e.service.api.operations) {
                        var t = e.service.api.operations[e.operation];
                        if (t) {
                            var r = t.idempotentMembers;
                            if (r.length) {
                                for (var n = i.util.copy(e.params), o = 0, s = r.length; o < s; o++) n[r[o]] || (n[r[o]] = i.util.uuid.v4());
                                e.params = n
                            }
                        }
                    }
                }),
                e("VALIDATE_PARAMETERS", "validate",
                function(e) {
                    if (e.service.api.operations) {
                        var t = e.service.api.operations[e.operation].input,
                        r = e.service.config.paramValidation;
                        new i.ParamValidator(r).validate(t, e.params)
                    }
                }),
                t("COMPUTE_SHA256", "afterBuild",
                function(e, t) {
                    if (e.haltHandlersOnError(), e.service.api.operations) {
                        var r = e.service.api.operations[e.operation],
                        n = r ? r.authtype: "";
                        if (!e.service.api.signatureVersion && !n) return t();
                        if (e.service.getSignerClass(e) === i.Signers.V4) {
                            var o = e.httpRequest.body || "";
                            if (n.indexOf("unsigned-body") >= 0) return e.httpRequest.headers["X-Amz-Content-Sha256"] = "UNSIGNED-PAYLOAD",
                            t();
                            i.util.computeSha256(o,
                            function(r, n) {
                                r ? t(r) : (e.httpRequest.headers["X-Amz-Content-Sha256"] = n, t())
                            })
                        } else t()
                    }
                }),
                e("SET_CONTENT_LENGTH", "afterBuild",
                function(e) {
                    var t = n(e),
                    r = i.util.getRequestPayloadShape(e);
                    if (void 0 === e.httpRequest.headers["Content-Length"]) try {
                        var o = i.util.string.byteLength(e.httpRequest.body);
                        e.httpRequest.headers["Content-Length"] = o
                    } catch(n) {
                        if (r && r.isStreaming) {
                            if (r.requiresLength) throw n;
                            if (t.indexOf("unsigned-body") >= 0) return void(e.httpRequest.headers["Transfer-Encoding"] = "chunked");
                            throw n
                        }
                        throw n
                    }
                }),
                e("SET_HTTP_HOST", "afterBuild",
                function(e) {
                    e.httpRequest.headers.Host = e.httpRequest.endpoint.host
                }),
                e("RESTART", "restart",
                function() {
                    var e = this.response.error;
                    e && e.retryable && (this.httpRequest = new i.HttpRequest(this.service.endpoint, this.service.region), this.response.retryCount < this.service.config.maxRetries ? this.response.retryCount++:this.response.error = null)
                });
                t("DISCOVER_ENDPOINT", "sign", s, !0),
                t("SIGN", "sign",
                function(e, t) {
                    var r = e.service,
                    n = e.service.api.operations || {},
                    i = n[e.operation],
                    o = i ? i.authtype: "";
                    if (!r.api.signatureVersion && !o) return t();
                    r.config.getCredentials(function(n, o) {
                        if (n) return e.response.error = n,
                        t();
                        try {
                            var s = r.getSkewCorrectedDate(),
                            a = r.getSignerClass(e),
                            u = new a(e.httpRequest, r.api.signingName || r.api.endpointPrefix, {
                                signatureCache: r.config.signatureCache,
                                operation: i,
                                signatureVersion: r.api.signatureVersion
                            });
                            u.setServiceClientId(r._clientId),
                            delete e.httpRequest.headers.Authorization,
                            delete e.httpRequest.headers.Date,
                            delete e.httpRequest.headers["X-Amz-Date"],
                            u.addAuthorization(o, s),
                            e.signedAt = s
                        } catch(t) {
                            e.response.error = t
                        }
                        t()
                    })
                }),
                e("VALIDATE_RESPONSE", "validateResponse",
                function(e) {
                    this.service.successfulResponse(e, this) ? (e.data = {},
                    e.error = null) : (e.data = null, e.error = i.util.error(new Error, {
                        code: "UnknownError",
                        message: "An unknown error occurred."
                    }))
                }),
                t("SEND", "send",
                function(e, t) {
                    function r(r) {
                        e.httpResponse.stream = r;
                        var n = e.request.httpRequest.stream,
                        o = e.request.service,
                        s = o.api,
                        a = e.request.operation,
                        u = s.operations[a] || {};
                        r.on("headers",
                        function(n, s, a) {
                            if (e.request.emit("httpHeaders", [n, s, e, a]), !e.httpResponse.streaming) if (2 === i.HttpClient.streamsApiVersion) {
                                if (u.hasEventOutput && o.successfulResponse(e)) return e.request.emit("httpDone"),
                                void t();
                                r.on("readable",
                                function() {
                                    var t = r.read();
                                    null !== t && e.request.emit("httpData", [t, e])
                                })
                            } else r.on("data",
                            function(t) {
                                e.request.emit("httpData", [t, e])
                            })
                        }),
                        r.on("end",
                        function() {
                            if (!n || !n.didCallback) {
                                if (2 === i.HttpClient.streamsApiVersion && u.hasEventOutput && o.successfulResponse(e)) return;
                                e.request.emit("httpDone"),
                                t()
                            }
                        })
                    }
                    function n(t) {
                        t.on("sendProgress",
                        function(t) {
                            e.request.emit("httpUploadProgress", [t, e])
                        }),
                        t.on("receiveProgress",
                        function(t) {
                            e.request.emit("httpDownloadProgress", [t, e])
                        })
                    }
                    function o(r) {
                        if ("RequestAbortedError" !== r.code) {
                            var n = "TimeoutError" === r.code ? r.code: "NetworkingError";
                            r = i.util.error(r, {
                                code: n,
                                region: e.request.httpRequest.region,
                                hostname: e.request.httpRequest.endpoint.hostname,
                                retryable: !0
                            })
                        }
                        e.error = r,
                        e.request.emit("httpError", [e.error, e],
                        function() {
                            t()
                        })
                    }
                    function s() {
                        var t = i.HttpClient.getInstance(),
                        s = e.request.service.config.httpOptions || {};
                        try {
                            n(t.handleRequest(e.request.httpRequest, s, r, o))
                        } catch(e) {
                            o(e)
                        }
                    }
                    e.httpResponse._abortCallback = t,
                    e.error = null,
                    e.data = null,
                    (e.request.service.getSkewCorrectedDate() - this.signedAt) / 1e3 >= 600 ? this.emit("sign", [this],
                    function(e) {
                        e ? t(e) : s()
                    }) : s()
                }),
                e("HTTP_HEADERS", "httpHeaders",
                function(e, t, r, n) {
                    r.httpResponse.statusCode = e,
                    r.httpResponse.statusMessage = n,
                    r.httpResponse.headers = t,
                    r.httpResponse.body = new i.util.Buffer(""),
                    r.httpResponse.buffers = [],
                    r.httpResponse.numBytes = 0;
                    var o = t.date || t.Date,
                    s = r.request.service;
                    if (o) {
                        var a = Date.parse(o);
                        s.config.correctClockSkew && s.isClockSkewed(a) && s.applyClockOffset(a)
                    }
                }),
                e("HTTP_DATA", "httpData",
                function(e, t) {
                    if (e) {
                        if (i.util.isNode()) {
                            t.httpResponse.numBytes += e.length;
                            var r = t.httpResponse.headers["content-length"],
                            n = {
                                loaded: t.httpResponse.numBytes,
                                total: r
                            };
                            t.request.emit("httpDownloadProgress", [n, t])
                        }
                        t.httpResponse.buffers.push(new i.util.Buffer(e))
                    }
                }),
                e("HTTP_DONE", "httpDone",
                function(e) {
                    if (e.httpResponse.buffers && e.httpResponse.buffers.length > 0) {
                        var t = i.util.buffer.concat(e.httpResponse.buffers);
                        e.httpResponse.body = t
                    }
                    delete e.httpResponse.numBytes,
                    delete e.httpResponse.buffers
                }),
                e("FINALIZE_ERROR", "retry",
                function(e) {
                    e.httpResponse.statusCode && (e.error.statusCode = e.httpResponse.statusCode, void 0 === e.error.retryable && (e.error.retryable = this.service.retryableError(e.error, this)))
                }),
                e("INVALIDATE_CREDENTIALS", "retry",
                function(e) {
                    if (e.error) switch (e.error.code) {
                    case "RequestExpired":
                    case "ExpiredTokenException":
                    case "ExpiredToken":
                        e.error.retryable = !0,
                        e.request.service.config.credentials.expired = !0
                    }
                }),
                e("EXPIRED_SIGNATURE", "retry",
                function(e) {
                    var t = e.error;
                    t && "string" == typeof t.code && "string" == typeof t.message && t.code.match(/Signature/) && t.message.match(/expired/) && (e.error.retryable = !0)
                }),
                e("CLOCK_SKEWED", "retry",
                function(e) {
                    e.error && this.service.clockSkewError(e.error) && this.service.config.correctClockSkew && (e.error.retryable = !0)
                }),
                e("REDIRECT", "retry",
                function(e) {
                    e.error && e.error.statusCode >= 300 && e.error.statusCode < 400 && e.httpResponse.headers.location && (this.httpRequest.endpoint = new i.Endpoint(e.httpResponse.headers.location), this.httpRequest.headers.Host = this.httpRequest.endpoint.host, e.error.redirect = !0, e.error.retryable = !0)
                }),
                e("RETRY_CHECK", "retry",
                function(e) {
                    e.error && (e.error.redirect && e.redirectCount < e.maxRedirects ? e.error.retryDelay = 0 : e.retryCount < e.maxRetries && (e.error.retryDelay = this.service.retryDelays(e.retryCount) || 0))
                }),
                t("RESET_RETRY_STATE", "afterRetry",
                function(e, t) {
                    var r, n = !1;
                    e.error && (r = e.error.retryDelay || 0, e.error.retryable && e.retryCount < e.maxRetries ? (e.retryCount++, n = !0) : e.error.redirect && e.redirectCount < e.maxRedirects && (e.redirectCount++, n = !0)),
                    n ? (e.error = null, setTimeout(t, r)) : t()
                })
            }),
            CorePost: (new o).addNamedListeners(function(e) {
                e("EXTRACT_REQUEST_ID", "extractData", i.util.extractRequestId),
                e("EXTRACT_REQUEST_ID", "extractError", i.util.extractRequestId),
                e("ENOTFOUND_ERROR", "httpError",
                function(e) {
                    if ("NetworkingError" === e.code && "ENOTFOUND" === e.errno) {
                        var t = "Inaccessible host: `" + e.hostname + "'. This service may not be available in the `" + e.region + "' region.";
                        this.response.error = i.util.error(new Error(t), {
                            code: "UnknownEndpoint",
                            region: e.region,
                            hostname: e.hostname,
                            retryable: !0,
                            originalError: e
                        })
                    }
                })
            }),
            Logger: (new o).addNamedListeners(function(t) {
                t("LOG_REQUEST", "complete",
                function(t) {
                    function r(e, t) {
                        if (!t) return t;
                        switch (e.type) {
                        case "structure":
                            var n = {};
                            return i.util.each(t,
                            function(t, i) {
                                Object.prototype.hasOwnProperty.call(e.members, t) ? n[t] = r(e.members[t], i) : n[t] = i
                            }),
                            n;
                        case "list":
                            var o = [];
                            return i.util.arrayEach(t,
                            function(t, n) {
                                o.push(r(e.member, t))
                            }),
                            o;
                        case "map":
                            var s = {};
                            return i.util.each(t,
                            function(t, n) {
                                s[t] = r(e.value, n)
                            }),
                            s;
                        default:
                            return e.isSensitive ? "***SensitiveInformation***": t
                        }
                    }
                    var n = t.request,
                    o = n.service.config.logger;
                    if (o) {
                        var s = function() {
                            var s = t.request.service.getSkewCorrectedDate().getTime(),
                            a = (s - n.startTime.getTime()) / 1e3,
                            u = !!o.isTTY,
                            c = t.httpResponse.statusCode,
                            h = n.params;
                            if (n.service.api.operations && n.service.api.operations[n.operation] && n.service.api.operations[n.operation].input) {
                                h = r(n.service.api.operations[n.operation].input, n.params)
                            }
                            var l = e("util").inspect(h, !0, null),
                            p = "";
                            return u && (p += "[33m"),
                            p += "[AWS " + n.service.serviceIdentifier + " " + c,
                            p += " " + a.toString() + "s " + t.retryCount + " retries]",
                            u && (p += "[0;1m"),
                            p += " " + i.util.string.lowerFirst(n.operation),
                            p += "(" + l + ")",
                            u && (p += "[0m"),
                            p
                        } ();
                        "function" == typeof o.log ? o.log(s) : "function" == typeof o.write && o.write(s + "\n")
                    }
                })
            }),
            Json: (new o).addNamedListeners(function(t) {
                var r = e("./protocol/json");
                t("BUILD", "build", r.buildRequest),
                t("EXTRACT_DATA", "extractData", r.extractData),
                t("EXTRACT_ERROR", "extractError", r.extractError)
            }),
            Rest: (new o).addNamedListeners(function(t) {
                var r = e("./protocol/rest");
                t("BUILD", "build", r.buildRequest),
                t("EXTRACT_DATA", "extractData", r.extractData),
                t("EXTRACT_ERROR", "extractError", r.extractError)
            }),
            RestJson: (new o).addNamedListeners(function(t) {
                var r = e("./protocol/rest_json");
                t("BUILD", "build", r.buildRequest),
                t("EXTRACT_DATA", "extractData", r.extractData),
                t("EXTRACT_ERROR", "extractError", r.extractError)
            }),
            RestXml: (new o).addNamedListeners(function(t) {
                var r = e("./protocol/rest_xml");
                t("BUILD", "build", r.buildRequest),
                t("EXTRACT_DATA", "extractData", r.extractData),
                t("EXTRACT_ERROR", "extractError", r.extractError)
            }),
            Query: (new o).addNamedListeners(function(t) {
                var r = e("./protocol/query");
                t("BUILD", "build", r.buildRequest),
                t("EXTRACT_DATA", "extractData", r.extractData),
                t("EXTRACT_ERROR", "extractError", r.extractError)
            })
        }
    },
    {
        "./core": 38,
        "./discover_endpoint": 46,
        "./protocol/json": 74,
        "./protocol/query": 75,
        "./protocol/rest": 76,
        "./protocol/rest_json": 77,
        "./protocol/rest_xml": 78,
        "./sequential_executor": 88,
        util: 20
    }],
    88 : [function(e, t, r) {
        var n = e("./core");
        n.SequentialExecutor = n.util.inherit({
            constructor: function() {
                this._events = {}
            },
            listeners: function(e) {
                return this._events[e] ? this._events[e].slice(0) : []
            },
            on: function(e, t, r) {
                return this._events[e] ? r ? this._events[e].unshift(t) : this._events[e].push(t) : this._events[e] = [t],
                this
            },
            onAsync: function(e, t, r) {
                return t._isAsync = !0,
                this.on(e, t, r)
            },
            removeListener: function(e, t) {
                var r = this._events[e];
                if (r) {
                    for (var n = r.length,
                    i = -1,
                    o = 0; o < n; ++o) r[o] === t && (i = o);
                    i > -1 && r.splice(i, 1)
                }
                return this
            },
            removeAllListeners: function(e) {
                return e ? delete this._events[e] : this._events = {},
                this
            },
            emit: function(e, t, r) {
                r || (r = function() {});
                var n = this.listeners(e),
                i = n.length;
                return this.callListeners(n, t, r),
                i > 0
            },
            callListeners: function(e, t, r, i) {
                function o(i) {
                    if (i && (a = n.util.error(a || new Error, i), s._haltHandlersOnError)) return r.call(s, a);
                    s.callListeners(e, t, r, a)
                }
                for (var s = this,
                a = i || null; e.length > 0;) {
                    var u = e.shift();
                    if (u._isAsync) return void u.apply(s, t.concat([o]));
                    try {
                        u.apply(s, t)
                    } catch(e) {
                        a = n.util.error(a || new Error, e)
                    }
                    if (a && s._haltHandlersOnError) return void r.call(s, a)
                }
                r.call(s, a)
            },
            addListeners: function(e) {
                var t = this;
                return e._events && (e = e._events),
                n.util.each(e,
                function(e, r) {
                    "function" == typeof r && (r = [r]),
                    n.util.arrayEach(r,
                    function(r) {
                        t.on(e, r)
                    })
                }),
                t
            },
            addNamedListener: function(e, t, r, n) {
                return this[e] = r,
                this.addListener(t, r, n),
                this
            },
            addNamedAsyncListener: function(e, t, r, n) {
                return r._isAsync = !0,
                this.addNamedListener(e, t, r, n)
            },
            addNamedListeners: function(e) {
                var t = this;
                return e(function() {
                    t.addNamedListener.apply(t, arguments)
                },
                function() {
                    t.addNamedAsyncListener.apply(t, arguments)
                }),
                this
            }
        }),
        n.SequentialExecutor.prototype.addListener = n.SequentialExecutor.prototype.on,
        t.exports = n.SequentialExecutor
    },
    {
        "./core": 38
    }],
    78 : [function(e, t, r) {
        function n(e) {
            var t = e.service.api.operations[e.operation].input,
            r = new a.XML.Builder,
            n = e.params,
            i = t.payload;
            if (i) {
                var o = t.members[i];
                if (void 0 === (n = n[i])) return;
                if ("structure" === o.type) {
                    var s = o.name;
                    e.httpRequest.body = r.toXML(n, o, s, !0)
                } else e.httpRequest.body = n
            } else e.httpRequest.body = r.toXML(n, t, t.name || t.shape || u.string.upperFirst(e.operation) + "Request")
        }
        function i(e) {
            c.buildRequest(e),
            ["GET", "HEAD"].indexOf(e.httpRequest.method) < 0 && n(e)
        }
        function o(e) {
            c.extractError(e);
            var t;
            try {
                t = (new a.XML.Parser).parse(e.httpResponse.body.toString())
            } catch(r) {
                t = {
                    Code: e.httpResponse.statusCode,
                    Message: e.httpResponse.statusMessage
                }
            }
            t.Errors && (t = t.Errors),
            t.Error && (t = t.Error),
            t.Code ? e.error = u.error(new Error, {
                code: t.Code,
                message: t.Message
            }) : e.error = u.error(new Error, {
                code: e.httpResponse.statusCode,
                message: null
            })
        }
        function s(e) {
            c.extractData(e);
            var t, r = e.request,
            n = e.httpResponse.body,
            i = r.service.api.operations[r.operation],
            o = i.output,
            s = (i.hasEventOutput, o.payload);
            if (s) {
                var h = o.members[s];
                h.isEventStream ? (t = new a.XML.Parser, e.data[s] = u.createEventStream(2 === a.HttpClient.streamsApiVersion ? e.httpResponse.stream: e.httpResponse.body, t, h)) : "structure" === h.type ? (t = new a.XML.Parser, e.data[s] = t.parse(n.toString(), h)) : "binary" === h.type || h.isStreaming ? e.data[s] = n: e.data[s] = h.toType(n)
            } else if (n.length > 0) {
                t = new a.XML.Parser;
                var l = t.parse(n.toString(), o);
                u.update(e.data, l)
            }
        }
        var a = e("../core"),
        u = e("../util"),
        c = e("./rest");
        t.exports = {
            buildRequest: i,
            extractError: o,
            extractData: s
        }
    },
    {
        "../core": 38,
        "../util": 117,
        "./rest": 76
    }],
    77 : [function(e, t, r) {
        function n(e) {
            var t = new l,
            r = e.service.api.operations[e.operation].input;
            if (r.payload) {
                var n = {},
                o = r.members[r.payload];
                if (void 0 === (n = e.params[r.payload])) return;
                "structure" === o.type ? (e.httpRequest.body = t.build(n, o), i(e)) : (e.httpRequest.body = n, ("binary" === o.type || o.isStreaming) && i(e, !0))
            } else {
                var s = t.build(e.params, r);
                "{}" === s && "GET" === e.httpRequest.method || (e.httpRequest.body = s),
                i(e)
            }
        }
        function i(e, t) {
            var r = e.service.api.operations[e.operation];
            r.input;
            if (!e.httpRequest.headers["Content-Type"]) {
                var n = t ? "binary/octet-stream": "application/json";
                e.httpRequest.headers["Content-Type"] = n
            }
        }
        function o(e) {
            c.buildRequest(e),
            ["HEAD", "DELETE"].indexOf(e.httpRequest.method) < 0 && n(e)
        }
        function s(e) {
            h.extractError(e)
        }
        function a(e) {
            c.extractData(e);
            var t, r = e.request,
            n = r.service.api.operations[r.operation],
            i = r.service.api.operations[r.operation].output || {};
            n.hasEventOutput;
            if (i.payload) {
                var o = i.members[i.payload],
                s = e.httpResponse.body;
                if (o.isEventStream) t = new p,
                e.data[payload] = u.createEventStream(2 === AWS.HttpClient.streamsApiVersion ? e.httpResponse.stream: s, t, o);
                else if ("structure" === o.type || "list" === o.type) {
                    var t = new p;
                    e.data[i.payload] = t.parse(s, o)
                } else "binary" === o.type || o.isStreaming ? e.data[i.payload] = s: e.data[i.payload] = o.toType(s)
            } else {
                var a = e.data;
                h.extractData(e),
                e.data = u.merge(a, e.data)
            }
        }
        var u = e("../util"),
        c = e("./rest"),
        h = e("./json"),
        l = e("../json/builder"),
        p = e("../json/parser");
        t.exports = {
            buildRequest: o,
            extractError: s,
            extractData: a
        }
    },
    {
        "../json/builder": 63,
        "../json/parser": 64,
        "../util": 117,
        "./json": 74,
        "./rest": 76
    }],
    76 : [function(e, t, r) {
        function n(e) {
            e.httpRequest.method = e.service.api.operations[e.operation].httpMethod
        }
        function i(e, t, r, n) {
            var i = [e, t].join("/");
            i = i.replace(/\/+/g, "/");
            var o = {},
            s = !1;
            if (h.each(r.members,
            function(e, t) {
                var r = n[e];
                if (null !== r && void 0 !== r) if ("uri" === t.location) {
                    var a = new RegExp("\\{" + t.name + "(\\+)?\\}");
                    i = i.replace(a,
                    function(e, t) {
                        return (t ? h.uriEscapePath: h.uriEscape)(String(r))
                    })
                } else "querystring" === t.location && (s = !0, "list" === t.type ? o[t.name] = r.map(function(e) {
                    return h.uriEscape(t.member.toWireFormat(e).toString())
                }) : "map" === t.type ? h.each(r,
                function(e, t) {
                    Array.isArray(t) ? o[e] = t.map(function(e) {
                        return h.uriEscape(String(e))
                    }) : o[e] = h.uriEscape(String(t))
                }) : o[t.name] = h.uriEscape(t.toWireFormat(r).toString()))
            }), s) {
                i += i.indexOf("?") >= 0 ? "&": "?";
                var a = [];
                h.arrayEach(Object.keys(o).sort(),
                function(e) {
                    Array.isArray(o[e]) || (o[e] = [o[e]]);
                    for (var t = 0; t < o[e].length; t++) a.push(h.uriEscape(String(e)) + "=" + o[e][t])
                }),
                i += a.join("&")
            }
            return i
        }
        function o(e) {
            var t = e.service.api.operations[e.operation],
            r = t.input,
            n = i(e.httpRequest.endpoint.path, t.httpPath, r, e.params);
            e.httpRequest.path = n
        }
        function s(e) {
            var t = e.service.api.operations[e.operation];
            h.each(t.input.members,
            function(t, r) {
                var n = e.params[t];
                null !== n && void 0 !== n && ("headers" === r.location && "map" === r.type ? h.each(n,
                function(t, n) {
                    e.httpRequest.headers[r.name + t] = n
                }) : "header" === r.location && (n = r.toWireFormat(n).toString(), r.isJsonValue && (n = h.base64.encode(n)), e.httpRequest.headers[r.name] = n))
            })
        }
        function a(e) {
            n(e),
            o(e),
            s(e),
            l(e)
        }
        function u() {}
        function c(e) {
            var t = e.request,
            r = {},
            n = e.httpResponse,
            i = t.service.api.operations[t.operation],
            o = i.output,
            s = {};
            h.each(n.headers,
            function(e, t) {
                s[e.toLowerCase()] = t
            }),
            h.each(o.members,
            function(e, t) {
                var i = (t.name || e).toLowerCase();
                if ("headers" === t.location && "map" === t.type) {
                    r[e] = {};
                    var o = t.isLocationName ? t.name: "",
                    a = new RegExp("^" + o + "(.+)", "i");
                    h.each(n.headers,
                    function(t, n) {
                        var i = t.match(a);
                        null !== i && (r[e][i[1]] = n)
                    })
                } else if ("header" === t.location) {
                    if (void 0 !== s[i]) {
                        var u = t.isJsonValue ? h.base64.decode(s[i]) : s[i];
                        r[e] = t.toType(u)
                    }
                } else "statusCode" === t.location && (r[e] = parseInt(n.statusCode, 10))
            }),
            e.data = r
        }
        var h = e("../util"),
        l = e("./helpers").populateHostPrefix;
        t.exports = {
            buildRequest: a,
            extractError: u,
            extractData: c,
            generateURI: i
        }
    },
    {
        "../util": 117,
        "./helpers": 73
    }],
    75 : [function(e, t, r) {
        function n(e) {
            var t = e.service.api.operations[e.operation],
            r = e.httpRequest;
            r.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8",
            r.params = {
                Version: e.service.api.apiVersion,
                Action: t.name
            },
            (new u).serialize(e.params, t.input,
            function(e, t) {
                r.params[e] = t
            }),
            r.body = a.queryParamsToString(r.params),
            h(e)
        }
        function i(e) {
            var t, r = e.httpResponse.body.toString();
            if (r.match("<UnknownOperationException")) t = {
                Code: "UnknownOperation",
                Message: "Unknown operation " + e.request.operation
            };
            else try {
                t = (new s.XML.Parser).parse(r)
            } catch(r) {
                t = {
                    Code: e.httpResponse.statusCode,
                    Message: e.httpResponse.statusMessage
                }
            }
            t.requestId && !e.requestId && (e.requestId = t.requestId),
            t.Errors && (t = t.Errors),
            t.Error && (t = t.Error),
            t.Code ? e.error = a.error(new Error, {
                code: t.Code,
                message: t.Message
            }) : e.error = a.error(new Error, {
                code: e.httpResponse.statusCode,
                message: null
            })
        }
        function o(e) {
            var t = e.request,
            r = t.service.api.operations[t.operation],
            n = r.output || {},
            i = n;
            if (i.resultWrapper) {
                var o = c.create({
                    type: "structure"
                });
                o.members[i.resultWrapper] = n,
                o.memberNames = [i.resultWrapper],
                a.property(n, "name", n.resultWrapper),
                n = o
            }
            var u = new s.XML.Parser;
            if (n && n.members && !n.members._XAMZRequestId) {
                var h = c.create({
                    type: "string"
                },
                {
                    api: {
                        protocol: "query"
                    }
                },
                "requestId");
                n.members._XAMZRequestId = h
            }
            var l = u.parse(e.httpResponse.body.toString(), n);
            e.requestId = l._XAMZRequestId || l.requestId,
            l._XAMZRequestId && delete l._XAMZRequestId,
            i.resultWrapper && l[i.resultWrapper] && (a.update(l, l[i.resultWrapper]), delete l[i.resultWrapper]),
            e.data = l
        }
        var s = e("../core"),
        a = e("../util"),
        u = e("../query/query_param_serializer"),
        c = e("../model/shape"),
        h = e("./helpers").populateHostPrefix;
        t.exports = {
            buildRequest: n,
            extractError: i,
            extractData: o
        }
    },
    {
        "../core": 38,
        "../model/shape": 70,
        "../query/query_param_serializer": 79,
        "../util": 117,
        "./helpers": 73
    }],
    79 : [function(e, t, r) {
        function n() {}
        function i(e) {
            return e.isQueryName || "ec2" !== e.api.protocol ? e.name: e.name[0].toUpperCase() + e.name.substr(1)
        }
        function o(e, t, r, n) {
            c.each(r.members,
            function(r, o) {
                var s = t[r];
                if (null !== s && void 0 !== s) {
                    var a = i(o);
                    a = e ? e + "." + a: a,
                    u(a, s, o, n)
                }
            })
        }
        function s(e, t, r, n) {
            var i = 1;
            c.each(t,
            function(t, o) {
                var s = r.flattened ? ".": ".entry.",
                a = s + i+++".",
                c = a + (r.key.name || "key"),
                h = a + (r.value.name || "value");
                u(e + c, t, r.key, n),
                u(e + h, o, r.value, n)
            })
        }
        function a(e, t, r, n) {
            var o = r.member || {};
            if (0 === t.length) return void n.call(this, e, null);
            c.arrayEach(t,
            function(t, s) {
                var a = "." + (s + 1);
                if ("ec2" === r.api.protocol) a += "";
                else if (r.flattened) {
                    if (o.name) {
                        var c = e.split(".");
                        c.pop(),
                        c.push(i(o)),
                        e = c.join(".")
                    }
                } else a = "." + (o.name ? o.name: "member") + a;
                u(e + a, t, o, n)
            })
        }
        function u(e, t, r, n) {
            null !== t && void 0 !== t && ("structure" === r.type ? o(e, t, r, n) : "list" === r.type ? a(e, t, r, n) : "map" === r.type ? s(e, t, r, n) : n(e, r.toWireFormat(t).toString()))
        }
        var c = e("../util");
        n.prototype.serialize = function(e, t, r) {
            o("", e, t, r)
        },
        t.exports = n
    },
    {
        "../util": 117
    }],
    70 : [function(e, t, r) {
        function n(e, t, r) {
            null !== r && void 0 !== r && y.property.apply(this, arguments)
        }
        function i(e, t) {
            e.constructor.prototype[t] || y.memoizedProperty.apply(this, arguments)
        }
        function o(e, t, r) {
            t = t || {},
            n(this, "shape", e.shape),
            n(this, "api", t.api, !1),
            n(this, "type", e.type),
            n(this, "enum", e.enum),
            n(this, "min", e.min),
            n(this, "max", e.max),
            n(this, "pattern", e.pattern),
            n(this, "location", e.location || this.location || "body"),
            n(this, "name", this.name || e.xmlName || e.queryName || e.locationName || r),
            n(this, "isStreaming", e.streaming || this.isStreaming || !1),
            n(this, "requiresLength", e.requiresLength, !1),
            n(this, "isComposite", e.isComposite || !1),
            n(this, "isShape", !0, !1),
            n(this, "isQueryName", Boolean(e.queryName), !1),
            n(this, "isLocationName", Boolean(e.locationName), !1),
            n(this, "isIdempotent", !0 === e.idempotencyToken),
            n(this, "isJsonValue", !0 === e.jsonvalue),
            n(this, "isSensitive", !0 === e.sensitive || e.prototype && !0 === e.prototype.sensitive),
            n(this, "isEventStream", Boolean(e.eventstream), !1),
            n(this, "isEvent", Boolean(e.event), !1),
            n(this, "isEventPayload", Boolean(e.eventpayload), !1),
            n(this, "isEventHeader", Boolean(e.eventheader), !1),
            n(this, "isTimestampFormatSet", Boolean(e.timestampFormat) || e.prototype && !0 === e.prototype.isTimestampFormatSet, !1),
            n(this, "endpointDiscoveryId", Boolean(e.endpointdiscoveryid), !1),
            n(this, "hostLabel", Boolean(e.hostLabel), !1),
            t.documentation && (n(this, "documentation", e.documentation), n(this, "documentationUrl", e.documentationUrl)),
            e.xmlAttribute && n(this, "isXmlAttribute", e.xmlAttribute || !1),
            n(this, "defaultValue", null),
            this.toWireFormat = function(e) {
                return null === e || void 0 === e ? "": e
            },
            this.toType = function(e) {
                return e
            }
        }
        function s(e) {
            o.apply(this, arguments),
            n(this, "isComposite", !0),
            e.flattened && n(this, "flattened", e.flattened || !1)
        }
        function a(e, t) {
            var r = this,
            a = null,
            u = !this.isShape;
            s.apply(this, arguments),
            u && (n(this, "defaultValue",
            function() {
                return {}
            }), n(this, "members", {}), n(this, "memberNames", []), n(this, "required", []), n(this, "isRequired",
            function() {
                return ! 1
            })),
            e.members && (n(this, "members", new g(e.members, t,
            function(e, r) {
                return o.create(r, t, e)
            })), i(this, "memberNames",
            function() {
                return e.xmlOrder || Object.keys(e.members)
            }), e.event && (i(this, "eventPayloadMemberName",
            function() {
                for (var e = r.members,
                t = r.memberNames,
                n = 0,
                i = t.length; n < i; n++) if (e[t[n]].isEventPayload) return t[n]
            }), i(this, "eventHeaderMemberNames",
            function() {
                for (var e = r.members,
                t = r.memberNames,
                n = [], i = 0, o = t.length; i < o; i++) e[t[i]].isEventHeader && n.push(t[i]);
                return n
            }))),
            e.required && (n(this, "required", e.required), n(this, "isRequired",
            function(t) {
                if (!a) {
                    a = {};
                    for (var r = 0; r < e.required.length; r++) a[e.required[r]] = !0
                }
                return a[t]
            },
            !1, !0)),
            n(this, "resultWrapper", e.resultWrapper || null),
            e.payload && n(this, "payload", e.payload),
            "string" == typeof e.xmlNamespace ? n(this, "xmlNamespaceUri", e.xmlNamespace) : "object" == typeof e.xmlNamespace && (n(this, "xmlNamespacePrefix", e.xmlNamespace.prefix), n(this, "xmlNamespaceUri", e.xmlNamespace.uri))
        }
        function u(e, t) {
            var r = this,
            a = !this.isShape;
            if (s.apply(this, arguments), a && n(this, "defaultValue",
            function() {
                return []
            }), e.member && i(this, "member",
            function() {
                return o.create(e.member, t)
            }), this.flattened) {
                var u = this.name;
                i(this, "name",
                function() {
                    return r.member.name || u
                })
            }
        }
        function c(e, t) {
            var r = !this.isShape;
            s.apply(this, arguments),
            r && (n(this, "defaultValue",
            function() {
                return {}
            }), n(this, "key", o.create({
                type: "string"
            },
            t)), n(this, "value", o.create({
                type: "string"
            },
            t))),
            e.key && i(this, "key",
            function() {
                return o.create(e.key, t)
            }),
            e.value && i(this, "value",
            function() {
                return o.create(e.value, t)
            })
        }
        function h(e) {
            var t = this;
            if (o.apply(this, arguments), e.timestampFormat) n(this, "timestampFormat", e.timestampFormat);
            else if (t.isTimestampFormatSet && this.timestampFormat) n(this, "timestampFormat", this.timestampFormat);
            else if ("header" === this.location) n(this, "timestampFormat", "rfc822");
            else if ("querystring" === this.location) n(this, "timestampFormat", "iso8601");
            else if (this.api) switch (this.api.protocol) {
            case "json":
            case "rest-json":
                n(this, "timestampFormat", "unixTimestamp");
                break;
            case "rest-xml":
            case "query":
            case "ec2":
                n(this, "timestampFormat", "iso8601")
            }
            this.toType = function(e) {
                return null === e || void 0 === e ? null: "function" == typeof e.toUTCString ? e: "string" == typeof e || "number" == typeof e ? y.date.parseTimestamp(e) : null
            },
            this.toWireFormat = function(e) {
                return y.date.format(e, t.timestampFormat)
            }
        }
        function l() {
            o.apply(this, arguments);
            var e = ["rest-xml", "query", "ec2"];
            this.toType = function(t) {
                return t = this.api && e.indexOf(this.api.protocol) > -1 ? t || "": t,
                this.isJsonValue ? JSON.parse(t) : t && "function" == typeof t.toString ? t.toString() : t
            },
            this.toWireFormat = function(e) {
                return this.isJsonValue ? JSON.stringify(e) : e
            }
        }
        function p() {
            o.apply(this, arguments),
            this.toType = function(e) {
                return null === e || void 0 === e ? null: parseFloat(e)
            },
            this.toWireFormat = this.toType
        }
        function f() {
            o.apply(this, arguments),
            this.toType = function(e) {
                return null === e || void 0 === e ? null: parseInt(e, 10)
            },
            this.toWireFormat = this.toType
        }
        function d() {
            o.apply(this, arguments),
            this.toType = function(e) {
                var t = y.base64.decode(e);
                if (this.isSensitive && y.isNode() && "function" == typeof y.Buffer.alloc) {
                    var r = y.Buffer.alloc(t.length, t);
                    t.fill(0),
                    t = r
                }
                return t
            },
            this.toWireFormat = y.base64.encode
        }
        function m() {
            d.apply(this, arguments)
        }
        function v() {
            o.apply(this, arguments),
            this.toType = function(e) {
                return "boolean" == typeof e ? e: null === e || void 0 === e ? null: "true" === e
            }
        }
        var g = e("./collection"),
        y = e("../util");
        o.normalizedTypes = {
            character: "string",
            double: "float",
            long: "integer",
            short: "integer",
            biginteger: "integer",
            bigdecimal: "float",
            blob: "binary"
        },
        o.types = {
            structure: a,
            list: u,
            map: c,
            boolean: v,
            timestamp: h,
            float: p,
            integer: f,
            string: l,
            base64: m,
            binary: d
        },
        o.resolve = function(e, t) {
            if (e.shape) {
                var r = t.api.shapes[e.shape];
                if (!r) throw new Error("Cannot find shape reference: " + e.shape);
                return r
            }
            return null
        },
        o.create = function(e, t, r) {
            if (e.isShape) return e;
            var n = o.resolve(e, t);
            if (n) {
                var i = Object.keys(e);
                t.documentation || (i = i.filter(function(e) {
                    return ! e.match(/documentation/)
                }));
                var s = function() {
                    n.constructor.call(this, e, t, r)
                };
                return s.prototype = n,
                new s
            }
            e.type || (e.members ? e.type = "structure": e.member ? e.type = "list": e.key ? e.type = "map": e.type = "string");
            var a = e.type;
            if (o.normalizedTypes[e.type] && (e.type = o.normalizedTypes[e.type]), o.types[e.type]) return new o.types[e.type](e, t, r);
            throw new Error("Unrecognized shape type: " + a)
        },
        o.shapes = {
            StructureShape: a,
            ListShape: u,
            MapShape: c,
            StringShape: l,
            BooleanShape: v,
            Base64Shape: m
        },
        t.exports = o
    },
    {
        "../util": 117,
        "./collection": 66
    }],
    66 : [function(e, t, r) {
        function n(e, t, r, n) {
            o(this, n(e),
            function() {
                return r(e, t)
            })
        }
        function i(e, t, r, i, o) {
            i = i || String;
            var s = this;
            for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (n.call(s, a, e[a], r, i), o && o(a, e[a]))
        }
        var o = e("../util").memoizedProperty;
        t.exports = i
    },
    {
        "../util": 117
    }],
    74 : [function(e, t, r) {
        function n(e) {
            var t = e.httpRequest,
            r = e.service.api,
            n = r.targetPrefix + "." + r.operations[e.operation].name,
            i = r.jsonVersion || "1.0",
            o = r.operations[e.operation].input,
            s = new a;
            1 === i && (i = "1.0"),
            t.body = s.build(e.params || {},
            o),
            t.headers["Content-Type"] = "application/x-amz-json-" + i,
            t.headers["X-Amz-Target"] = n,
            c(e)
        }
        function i(e) {
            var t = {},
            r = e.httpResponse;
            if (t.code = r.headers["x-amzn-errortype"] || "UnknownError", "string" == typeof t.code && (t.code = t.code.split(":")[0]), r.body.length > 0) try {
                var n = JSON.parse(r.body.toString()); (n.__type || n.code) && (t.code = (n.__type || n.code).split("#").pop()),
                "RequestEntityTooLarge" === t.code ? t.message = "Request body must be less than 1 MB": t.message = n.message || n.Message || null
            } catch(n) {
                t.statusCode = r.statusCode,
                t.message = r.statusMessage
            } else t.statusCode = r.statusCode,
            t.message = r.statusCode.toString();
            e.error = s.error(new Error, t)
        }
        function o(e) {
            var t = e.httpResponse.body.toString() || "{}";
            if (!1 === e.request.service.config.convertResponseTypes) e.data = JSON.parse(t);
            else {
                var r = e.request.service.api.operations[e.request.operation],
                n = r.output || {},
                i = new u;
                e.data = i.parse(t, n)
            }
        }
        var s = e("../util"),
        a = e("../json/builder"),
        u = e("../json/parser"),
        c = e("./helpers").populateHostPrefix;
        t.exports = {
            buildRequest: n,
            extractError: i,
            extractData: o
        }
    },
    {
        "../json/builder": 63,
        "../json/parser": 64,
        "../util": 117,
        "./helpers": 73
    }],
    73 : [function(e, t, r) {
        function n(e) {
            if (!e.service.config.hostPrefixEnabled) return e;
            var t = e.service.api.operations[e.operation];
            if (i(e)) return e;
            if (t.endpoint && t.endpoint.hostPrefix) {
                var r = t.endpoint.hostPrefix,
                n = o(r, e.params, t.input);
                s(e.httpRequest.endpoint, n),
                a(e.httpRequest.endpoint.hostname)
            }
            return e
        }
        function i(e) {
            var t = e.service.api,
            r = t.operations[e.operation],
            n = t.endpointOperation && t.endpointOperation === u.string.lowerFirst(r.name);
            return "NULL" !== r.endpointDiscoveryRequired || !0 === n
        }
        function o(e, t, r) {
            return u.each(r.members,
            function(r, n) {
                if (!0 === n.hostLabel) {
                    if ("string" != typeof t[r] || "" === t[r]) throw u.error(new Error, {
                        message: "Parameter " + r + " should be a non-empty string.",
                        code: "InvalidParameter"
                    });
                    var i = new RegExp("\\{" + r + "\\}", "g");
                    e = e.replace(i, t[r])
                }
            }),
            e
        }
        function s(e, t) {
            e.host && (e.host = t + e.host),
            e.hostname && (e.hostname = t + e.hostname)
        }
        function a(e) {
            var t = e.split("."),
            r = /^[a-zA-Z0-9]{1}$|^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/;
            u.arrayEach(t,
            function(e) {
                if (!e.length || e.length < 1 || e.length > 63) throw u.error(new Error, {
                    code: "ValidationError",
                    message: "Hostname label length should be between 1 to 63 characters, inclusive."
                });
                if (!r.test(e)) throw c.util.error(new Error, {
                    code: "ValidationError",
                    message: e + " is not hostname compatible."
                })
            })
        }
        var u = e("../util"),
        c = e("../core");
        t.exports = {
            populateHostPrefix: n
        }
    },
    {
        "../core": 38,
        "../util": 117
    }],
    64 : [function(e, t, r) {
        function n() {}
        function i(e, t) {
            if (t && void 0 !== e) switch (t.type) {
            case "structure":
                return o(e, t);
            case "map":
                return a(e, t);
            case "list":
                return s(e, t);
            default:
                return u(e, t)
            }
        }
        function o(e, t) {
            if (null != e) {
                var r = {},
                n = t.members;
                return c.each(n,
                function(t, n) {
                    var o = n.isLocationName ? n.name: t;
                    if (Object.prototype.hasOwnProperty.call(e, o)) {
                        var s = e[o],
                        a = i(s, n);
                        void 0 !== a && (r[t] = a)
                    }
                }),
                r
            }
        }
        function s(e, t) {
            if (null != e) {
                var r = [];
                return c.arrayEach(e,
                function(e) {
                    var n = i(e, t.member);
                    void 0 === n ? r.push(null) : r.push(n)
                }),
                r
            }
        }
        function a(e, t) {
            if (null != e) {
                var r = {};
                return c.each(e,
                function(e, n) {
                    var o = i(n, t.value);
                    r[e] = void 0 === o ? null: o
                }),
                r
            }
        }
        function u(e, t) {
            return t.toType(e)
        }
        var c = e("../util");
        n.prototype.parse = function(e, t) {
            return i(JSON.parse(e), t)
        },
        t.exports = n
    },
    {
        "../util": 117
    }],
    63 : [function(e, t, r) {
        function n() {}
        function i(e, t) {
            if (t && void 0 !== e && null !== e) switch (t.type) {
            case "structure":
                return o(e, t);
            case "map":
                return a(e, t);
            case "list":
                return s(e, t);
            default:
                return u(e, t)
            }
        }
        function o(e, t) {
            var r = {};
            return c.each(e,
            function(e, n) {
                var o = t.members[e];
                if (o) {
                    if ("body" !== o.location) return;
                    var s = o.isLocationName ? o.name: e,
                    a = i(n, o);
                    void 0 !== a && (r[s] = a)
                }
            }),
            r
        }
        function s(e, t) {
            var r = [];
            return c.arrayEach(e,
            function(e) {
                var n = i(e, t.member);
                void 0 !== n && r.push(n)
            }),
            r
        }
        function a(e, t) {
            var r = {};
            return c.each(e,
            function(e, n) {
                var o = i(n, t.value);
                void 0 !== o && (r[e] = o)
            }),
            r
        }
        function u(e, t) {
            return t.toWireFormat(e)
        }
        var c = e("../util");
        n.prototype.build = function(e, t) {
            return JSON.stringify(i(e, t))
        },
        t.exports = n
    },
    {
        "../util": 117
    }],
    46 : [function(e, t, r) { (function(r) {
            function n(e) {
                var t = e.service,
                r = t.api || {},
                n = {};
                return t.config.region && (n.region = t.config.region),
                r.serviceId && (n.serviceId = r.serviceId),
                t.config.credentials.accessKeyId && (n.accessKeyId = t.config.credentials.accessKeyId),
                n
            }
            function i(e, t, r) {
                r && void 0 !== t && null !== t && "structure" === r.type && r.required && r.required.length > 0 && m.arrayEach(r.required,
                function(n) {
                    var o = r.members[n];
                    if (!0 === o.endpointDiscoveryId) {
                        var s = o.isLocationName ? o.name: n;
                        e[s] = String(t[n])
                    } else i(e, t[n], o)
                })
            }
            function o(e, t) {
                var r = {};
                return i(r, e.params, t),
                r
            }
            function s(e) {
                var t = e.service,
                r = t.api,
                i = r.operations ? r.operations[e.operation] : void 0,
                s = i ? i.input: void 0,
                a = o(e, s),
                c = n(e);
                Object.keys(a).length > 0 && (c = m.update(c, a), i && (c.operation = i.name));
                var h = d.endpointCache.get(c);
                if (!h || 1 !== h.length || "" !== h[0].Address) if (h && h.length > 0) e.httpRequest.updateEndpoint(h[0].Address);
                else {
                    var l = t.makeRequest(r.endpointOperation, {
                        Operation: i.name,
                        Identifiers: a
                    });
                    u(l),
                    l.removeListener("validate", d.EventListeners.Core.VALIDATE_PARAMETERS),
                    l.removeListener("retry", d.EventListeners.Core.RETRY_CHECK),
                    d.endpointCache.put(c, [{
                        Address: "",
                        CachePeriodInMinutes: 1
                    }]),
                    l.send(function(e, t) {
                        t && t.Endpoints ? d.endpointCache.put(c, t.Endpoints) : e && d.endpointCache.put(c, [{
                            Address: "",
                            CachePeriodInMinutes: 1
                        }])
                    })
                }
            }
            function a(e, t) {
                var r = e.service,
                i = r.api,
                s = i.operations ? i.operations[e.operation] : void 0,
                a = s ? s.input: void 0,
                c = o(e, a),
                h = n(e);
                Object.keys(c).length > 0 && (h = m.update(h, c), s && (h.operation = s.name));
                var l = d.EndpointCache.getKeyString(h),
                p = d.endpointCache.get(l);
                if (p && 1 === p.length && "" === p[0].Address) return g[l] || (g[l] = []),
                void g[l].push({
                    request: e,
                    callback: t
                });
                if (p && p.length > 0) e.httpRequest.updateEndpoint(p[0].Address),
                t();
                else {
                    var f = r.makeRequest(i.endpointOperation, {
                        Operation: s.name,
                        Identifiers: c
                    });
                    f.removeListener("validate", d.EventListeners.Core.VALIDATE_PARAMETERS),
                    u(f),
                    d.endpointCache.put(l, [{
                        Address: "",
                        CachePeriodInMinutes: 60
                    }]),
                    f.send(function(r, n) {
                        if (r) {
                            var i = {
                                code: "EndpointDiscoveryException",
                                message: "Request cannot be fulfilled without specifying an endpoint",
                                retryable: !1
                            };
                            if (e.response.error = m.error(r, i), d.endpointCache.remove(h), g[l]) {
                                var o = g[l];
                                m.arrayEach(o,
                                function(e) {
                                    e.request.response.error = m.error(r, i),
                                    e.callback()
                                }),
                                delete g[l]
                            }
                        } else if (n && (d.endpointCache.put(l, n.Endpoints), e.httpRequest.updateEndpoint(n.Endpoints[0].Address), g[l])) {
                            var o = g[l];
                            m.arrayEach(o,
                            function(e) {
                                e.request.httpRequest.updateEndpoint(n.Endpoints[0].Address),
                                e.callback()
                            }),
                            delete g[l]
                        }
                        t()
                    })
                }
            }
            function u(e) {
                var t = e.service.api,
                r = t.apiVersion;
                r && !e.httpRequest.headers["x-amz-api-version"] && (e.httpRequest.headers["x-amz-api-version"] = r)
            }
            function c(e) {
                var t = e.error,
                r = e.httpResponse;
                if (t && ("InvalidEndpointException" === t.code || 421 === r.statusCode)) {
                    var i = e.request,
                    s = i.service.api.operations || {},
                    a = s[i.operation] ? s[i.operation].input: void 0,
                    u = o(i, a),
                    c = n(i);
                    Object.keys(u).length > 0 && (c = m.update(c, u), s[i.operation] && (c.operation = s[i.operation].name)),
                    d.endpointCache.remove(c)
                }
            }
            function h(e) {
                if (e._originalConfig && e._originalConfig.endpoint && !0 === e._originalConfig.endpointDiscoveryEnabled) throw m.error(new Error, {
                    code: "ConfigurationException",
                    message: "Custom endpoint is supplied; endpointDiscoveryEnabled must not be true."
                });
                var t = d.config[e.serviceIdentifier] || {};
                return Boolean(d.config.endpoint || t.endpoint || e._originalConfig && e._originalConfig.endpoint)
            }
            function l(e) {
                return ["false", "0"].indexOf(e) >= 0
            }
            function p(e) {
                if (!0 === (e.service || {}).config.endpointDiscoveryEnabled) return ! 0;
                if (m.isBrowser()) return ! 1;
                for (var t = 0; t < v.length; t++) {
                    var n = v[t];
                    if (Object.prototype.hasOwnProperty.call(r.env, n)) {
                        if ("" === r.env[n] || void 0 === r.env[n]) throw m.error(new Error, {
                            code: "ConfigurationException",
                            message: "environmental variable " + n + " cannot be set to nothing"
                        });
                        if (!l(r.env[n])) return ! 0
                    }
                }
                var i = {};
                try {
                    i = d.util.iniLoader ? d.util.iniLoader.loadFrom({
                        isConfig: !0,
                        filename: r.env[d.util.sharedConfigFileEnv]
                    }) : {}
                } catch(e) {}
                var o = i[r.env.AWS_PROFILE || d.util.defaultProfile] || {};
                if (Object.prototype.hasOwnProperty.call(o, "endpoint_discovery_enabled")) {
                    if (void 0 === o.endpoint_discovery_enabled) throw m.error(new Error, {
                        code: "ConfigurationException",
                        message: "config file entry 'endpoint_discovery_enabled' cannot be set to nothing"
                    });
                    if (!l(o.endpoint_discovery_enabled)) return ! 0
                }
                return ! 1
            }
            function f(e, t) {
                var r = e.service || {};
                if (h(r) || e.isPresigned()) return t();
                if (!p(e)) return t();
                e.httpRequest.appendToUserAgent("endpoint-discovery");
                var n = r.api.operations || {},
                i = n[e.operation];
                switch (i ? i.endpointDiscoveryRequired: "NULL") {
                case "OPTIONAL":
                    s(e),
                    e.addNamedListener("INVALIDATE_CACHED_ENDPOINTS", "extractError", c),
                    t();
                    break;
                case "REQUIRED":
                    e.addNamedListener("INVALIDATE_CACHED_ENDPOINTS", "extractError", c),
                    a(e, t);
                    break;
                case "NULL":
                default:
                    t()
                }
            }
            var d = e("./core"),
            m = e("./util"),
            v = ["AWS_ENABLE_ENDPOINT_DISCOVERY", "AWS_ENDPOINT_DISCOVERY_ENABLED"],
            g = {};
            t.exports = {
                discoverEndpoint: f,
                requiredDiscoverEndpoint: a,
                optionalDiscoverEndpoint: s,
                marshallCustomIdentifiers: o,
                getCacheKey: n,
                invalidateCachedEndpoint: c
            }
        }).call(this, e("_process"))
    },
    {
        "./core": 38,
        "./util": 117,
        _process: 9
    }],
    117 : [function(e, t, r) { (function(r, n) {
            var i, o = {
                environment: "nodejs",
                engine: function() {
                    if (o.isBrowser() && "undefined" != typeof navigator) return navigator.userAgent;
                    var e = r.platform + "/" + r.version;
                    return r.env.AWS_EXECUTION_ENV && (e += " exec-env/" + r.env.AWS_EXECUTION_ENV),
                    e
                },
                userAgent: function() {
                    var t = o.environment,
                    r = "aws-sdk-" + t + "/" + e("./core").VERSION;
                    return "nodejs" === t && (r += " " + o.engine()),
                    r
                },
                uriEscape: function(e) {
                    var t = encodeURIComponent(e);
                    return t = t.replace(/[^A-Za-z0-9_.~\-%]+/g, escape),
                    t = t.replace(/[*]/g,
                    function(e) {
                        return "%" + e.charCodeAt(0).toString(16).toUpperCase()
                    })
                },
                uriEscapePath: function(e) {
                    var t = [];
                    return o.arrayEach(e.split("/"),
                    function(e) {
                        t.push(o.uriEscape(e))
                    }),
                    t.join("/")
                },
                urlParse: function(e) {
                    return o.url.parse(e)
                },
                urlFormat: function(e) {
                    return o.url.format(e)
                },
                queryStringParse: function(e) {
                    return o.querystring.parse(e)
                },
                queryParamsToString: function(e) {
                    var t = [],
                    r = o.uriEscape,
                    n = Object.keys(e).sort();
                    return o.arrayEach(n,
                    function(n) {
                        var i = e[n],
                        s = r(n),
                        a = s + "=";
                        if (Array.isArray(i)) {
                            var u = [];
                            o.arrayEach(i,
                            function(e) {
                                u.push(r(e))
                            }),
                            a = s + "=" + u.sort().join("&" + s + "=")
                        } else void 0 !== i && null !== i && (a = s + "=" + r(i));
                        t.push(a)
                    }),
                    t.join("&")
                },
                readFileSync: function(t) {
                    return o.isBrowser() ? null: e("fs").readFileSync(t, "utf-8")
                },
                base64: {
                    encode: function(e) {
                        if ("number" == typeof e) throw o.error(new Error("Cannot base64 encode number " + e));
                        return null === e || void 0 === e ? e: ("function" == typeof o.Buffer.from && o.Buffer.from !== Uint8Array.from ? o.Buffer.from(e) : new o.Buffer(e)).toString("base64")
                    },
                    decode: function(e) {
                        if ("number" == typeof e) throw o.error(new Error("Cannot base64 decode number " + e));
                        return null === e || void 0 === e ? e: "function" == typeof o.Buffer.from && o.Buffer.from !== Uint8Array.from ? o.Buffer.from(e, "base64") : new o.Buffer(e, "base64")
                    }
                },
                buffer: {
                    toStream: function(e) {
                        o.Buffer.isBuffer(e) || (e = new o.Buffer(e));
                        var t = new o.stream.Readable,
                        r = 0;
                        return t._read = function(n) {
                            if (r >= e.length) return t.push(null);
                            var i = r + n;
                            i > e.length && (i = e.length),
                            t.push(e.slice(r, i)),
                            r = i
                        },
                        t
                    },
                    concat: function(e) {
                        var t, r = 0,
                        n = 0,
                        i = null;
                        for (t = 0; t < e.length; t++) r += e[t].length;
                        for (i = new o.Buffer(r), t = 0; t < e.length; t++) e[t].copy(i, n),
                        n += e[t].length;
                        return i
                    }
                },
                string: {
                    byteLength: function(t) {
                        if (null === t || void 0 === t) return 0;
                        if ("string" == typeof t && (t = new o.Buffer(t)), "number" == typeof t.byteLength) return t.byteLength;
                        if ("number" == typeof t.length) return t.length;
                        if ("number" == typeof t.size) return t.size;
                        if ("string" == typeof t.path) return e("fs").lstatSync(t.path).size;
                        throw o.error(new Error("Cannot determine length of " + t), {
                            object: t
                        })
                    },
                    upperFirst: function(e) {
                        return e[0].toUpperCase() + e.substr(1)
                    },
                    lowerFirst: function(e) {
                        return e[0].toLowerCase() + e.substr(1)
                    }
                },
                ini: {
                    parse: function(e) {
                        var t, r = {};
                        return o.arrayEach(e.split(/\r?\n/),
                        function(e) {
                            e = e.split(/(^|\s)[;#]/)[0];
                            var n = e.match(/^\s*\[([^\[\]]+)\]\s*$/);
                            if (n) t = n[1];
                            else if (t) {
                                var i = e.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
                                i && (r[t] = r[t] || {},
                                r[t][i[1]] = i[2])
                            }
                        }),
                        r
                    }
                },
                fn: {
                    noop: function() {},
                    callback: function(e) {
                        if (e) throw e
                    },
                    makeAsync: function(e, t) {
                        return t && t <= e.length ? e: function() {
                            var t = Array.prototype.slice.call(arguments, 0);
                            t.pop()(e.apply(null, t))
                        }
                    }
                },
                date: {
                    getDate: function() {
                        return i || (i = e("./core")),
                        i.config.systemClockOffset ? new Date((new Date).getTime() + i.config.systemClockOffset) : new Date
                    },
                    iso8601: function(e) {
                        return void 0 === e && (e = o.date.getDate()),
                        e.toISOString().replace(/\.\d{3}Z$/, "Z")
                    },
                    rfc822: function(e) {
                        return void 0 === e && (e = o.date.getDate()),
                        e.toUTCString()
                    },
                    unixTimestamp: function(e) {
                        return void 0 === e && (e = o.date.getDate()),
                        e.getTime() / 1e3
                    },
                    from: function(e) {
                        return "number" == typeof e ? new Date(1e3 * e) : new Date(e)
                    },
                    format: function(e, t) {
                        return t || (t = "iso8601"),
                        o.date[t](o.date.from(e))
                    },
                    parseTimestamp: function(e) {
                        if ("number" == typeof e) return new Date(1e3 * e);
                        if (e.match(/^\d+$/)) return new Date(1e3 * e);
                        if (e.match(/^\d{4}/)) return new Date(e);
                        if (e.match(/^\w{3},/)) return new Date(e);
                        throw o.error(new Error("unhandled timestamp format: " + e), {
                            code: "TimestampParserError"
                        })
                    }
                },
                crypto: {
                    crc32Table: [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
                    crc32: function(e) {
                        var t = o.crypto.crc32Table,
                        r = -1;
                        "string" == typeof e && (e = new o.Buffer(e));
                        for (var n = 0; n < e.length; n++) {
                            r = r >>> 8 ^ t[255 & (r ^ e.readUInt8(n))]
                        }
                        return ( - 1 ^ r) >>> 0
                    },
                    hmac: function(e, t, r, n) {
                        return r || (r = "binary"),
                        "buffer" === r && (r = void 0),
                        n || (n = "sha256"),
                        "string" == typeof t && (t = new o.Buffer(t)),
                        o.crypto.lib.createHmac(n, e).update(t).digest(r)
                    },
                    md5: function(e, t, r) {
                        return o.crypto.hash("md5", e, t, r)
                    },
                    sha256: function(e, t, r) {
                        return o.crypto.hash("sha256", e, t, r)
                    },
                    hash: function(e, t, r, n) {
                        var i = o.crypto.createHash(e);
                        r || (r = "binary"),
                        "buffer" === r && (r = void 0),
                        "string" == typeof t && (t = new o.Buffer(t));
                        var s = o.arraySliceFn(t),
                        a = o.Buffer.isBuffer(t);
                        if (o.isBrowser() && "undefined" != typeof ArrayBuffer && t && t.buffer instanceof ArrayBuffer && (a = !0), n && "object" == typeof t && "function" == typeof t.on && !a) t.on("data",
                        function(e) {
                            i.update(e)
                        }),
                        t.on("error",
                        function(e) {
                            n(e)
                        }),
                        t.on("end",
                        function() {
                            n(null, i.digest(r))
                        });
                        else {
                            if (!n || !s || a || "undefined" == typeof FileReader) {
                                o.isBrowser() && "object" == typeof t && !a && (t = new o.Buffer(new Uint8Array(t)));
                                var u = i.update(t).digest(r);
                                return n && n(null, u),
                                u
                            }
                            var c = 0,
                            h = new FileReader;
                            h.onerror = function() {
                                n(new Error("Failed to read data."))
                            },
                            h.onload = function() {
                                var e = new o.Buffer(new Uint8Array(h.result));
                                i.update(e),
                                c += e.length,
                                h._continueReading()
                            },
                            h._continueReading = function() {
                                if (c >= t.size) return void n(null, i.digest(r));
                                var e = c + 524288;
                                e > t.size && (e = t.size),
                                h.readAsArrayBuffer(s.call(t, c, e))
                            },
                            h._continueReading()
                        }
                    },
                    toHex: function(e) {
                        for (var t = [], r = 0; r < e.length; r++) t.push(("0" + e.charCodeAt(r).toString(16)).substr( - 2, 2));
                        return t.join("")
                    },
                    createHash: function(e) {
                        return o.crypto.lib.createHash(e)
                    }
                },
                abort: {},
                each: function(e, t) {
                    for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r)) {
                        var n = t.call(this, r, e[r]);
                        if (n === o.abort) break
                    }
                },
                arrayEach: function(e, t) {
                    for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r)) {
                        var n = t.call(this, e[r], parseInt(r, 10));
                        if (n === o.abort) break
                    }
                },
                update: function(e, t) {
                    return o.each(t,
                    function(t, r) {
                        e[t] = r
                    }),
                    e
                },
                merge: function(e, t) {
                    return o.update(o.copy(e), t)
                },
                copy: function(e) {
                    if (null === e || void 0 === e) return e;
                    var t = {};
                    for (var r in e) t[r] = e[r];
                    return t
                },
                isEmpty: function(e) {
                    for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return ! 1;
                    return ! 0
                },
                arraySliceFn: function(e) {
                    var t = e.slice || e.webkitSlice || e.mozSlice;
                    return "function" == typeof t ? t: null
                },
                isType: function(e, t) {
                    return "function" == typeof t && (t = o.typeName(t)),
                    Object.prototype.toString.call(e) === "[object " + t + "]"
                },
                typeName: function(e) {
                    if (Object.prototype.hasOwnProperty.call(e, "name")) return e.name;
                    var t = e.toString(),
                    r = t.match(/^\s*function (.+)\(/);
                    return r ? r[1] : t
                },
                error: function(e, t) {
                    var r = null;
                    return "string" == typeof e.message && "" !== e.message && ("string" == typeof t || t && t.message) && (r = o.copy(e), r.message = e.message),
                    e.message = e.message || null,
                    "string" == typeof t ? e.message = t: "object" == typeof t && null !== t && (o.update(e, t), t.message && (e.message = t.message), (t.code || t.name) && (e.code = t.code || t.name), t.stack && (e.stack = t.stack)),
                    "function" == typeof Object.defineProperty && (Object.defineProperty(e, "name", {
                        writable: !0,
                        enumerable: !1
                    }), Object.defineProperty(e, "message", {
                        enumerable: !0
                    })),
                    e.name = t && t.name || e.name || e.code || "Error",
                    e.time = new Date,
                    r && (e.originalError = r),
                    e
                },
                inherit: function(e, t) {
                    var r = null;
                    if (void 0 === t) t = e,
                    e = Object,
                    r = {};
                    else {
                        var n = function() {};
                        n.prototype = e.prototype,
                        r = new n
                    }
                    return t.constructor === Object && (t.constructor = function() {
                        if (e !== Object) return e.apply(this, arguments)
                    }),
                    t.constructor.prototype = r,
                    o.update(t.constructor.prototype, t),
                    t.constructor.__super__ = e,
                    t.constructor
                },
                mixin: function() {
                    for (var e = arguments[0], t = 1; t < arguments.length; t++) for (var r in arguments[t].prototype) {
                        var n = arguments[t].prototype[r];
                        "constructor" !== r && (e.prototype[r] = n)
                    }
                    return e
                },
                hideProperties: function(e, t) {
                    "function" == typeof Object.defineProperty && o.arrayEach(t,
                    function(t) {
                        Object.defineProperty(e, t, {
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        })
                    })
                },
                property: function(e, t, r, n, i) {
                    var o = {
                        configurable: !0,
                        enumerable: void 0 === n || n
                    };
                    "function" != typeof r || i ? (o.value = r, o.writable = !0) : o.get = r,
                    Object.defineProperty(e, t, o)
                },
                memoizedProperty: function(e, t, r, n) {
                    var i = null;
                    o.property(e, t,
                    function() {
                        return null === i && (i = r()),
                        i
                    },
                    n)
                },
                hoistPayloadMember: function(e) {
                    var t = e.request,
                    r = t.operation,
                    n = t.service.api.operations[r],
                    i = n.output;
                    if (i.payload && !n.hasEventOutput) {
                        var s = i.members[i.payload],
                        a = e.data[i.payload];
                        "structure" === s.type && o.each(a,
                        function(t, r) {
                            o.property(e.data, t, r, !1)
                        })
                    }
                },
                computeSha256: function(t, r) {
                    if (o.isNode()) {
                        var n = o.stream.Stream,
                        i = e("fs");
                        if ("function" == typeof n && t instanceof n) {
                            if ("string" != typeof t.path) return r(new Error("Non-file stream objects are not supported with SigV4"));
                            var s = {};
                            "number" == typeof t.start && (s.start = t.start),
                            "number" == typeof t.end && (s.end = t.end),
                            t = i.createReadStream(t.path, s)
                        }
                    }
                    o.crypto.sha256(t, "hex",
                    function(e, t) {
                        e ? r(e) : r(null, t)
                    })
                },
                isClockSkewed: function(e) {
                    if (e) return o.property(i.config, "isClockSkewed", Math.abs((new Date).getTime() - e) >= 3e5, !1),
                    i.config.isClockSkewed
                },
                applyClockOffset: function(e) {
                    e && (i.config.systemClockOffset = e - (new Date).getTime())
                },
                extractRequestId: function(e) {
                    var t = e.httpResponse.headers["x-amz-request-id"] || e.httpResponse.headers["x-amzn-requestid"]; ! t && e.data && e.data.ResponseMetadata && (t = e.data.ResponseMetadata.RequestId),
                    t && (e.requestId = t),
                    e.error && (e.error.requestId = t)
                },
                addPromises: function(e, t) {
                    var r = !1;
                    void 0 === t && i && i.config && (t = i.config.getPromisesDependency()),
                    void 0 === t && "undefined" != typeof Promise && (t = Promise),
                    "function" != typeof t && (r = !0),
                    Array.isArray(e) || (e = [e]);
                    for (var n = 0; n < e.length; n++) {
                        var o = e[n];
                        r ? o.deletePromisesFromClass && o.deletePromisesFromClass() : o.addPromisesToClass && o.addPromisesToClass(t)
                    }
                },
                promisifyMethod: function(e, t) {
                    return function() {
                        var r = this;
                        return new t(function(t, n) {
                            r[e](function(e, r) {
                                e ? n(e) : t(r)
                            })
                        })
                    }
                },
                isDualstackAvailable: function(t) {
                    if (!t) return ! 1;
                    var r = e("../apis/metadata.json");
                    return "string" != typeof t && (t = t.serviceIdentifier),
                    !("string" != typeof t || !r.hasOwnProperty(t)) && !!r[t].dualstackAvailable
                },
                calculateRetryDelay: function(e, t) {
                    t || (t = {});
                    var r = t.customBackoff || null;
                    if ("function" == typeof r) return r(e);
                    var n = "number" == typeof t.base ? t.base: 100;
                    return Math.random() * (Math.pow(2, e) * n)
                },
                handleRequestWithRetries: function(e, t, r) {
                    t || (t = {});
                    var n = i.HttpClient.getInstance(),
                    s = t.httpOptions || {},
                    a = 0,
                    u = function(e) {
                        var n = t.maxRetries || 0;
                        if (e && "TimeoutError" === e.code && (e.retryable = !0), e && e.retryable && a < n) {
                            a++;
                            var i = o.calculateRetryDelay(a, t.retryDelayOptions);
                            setTimeout(c, i + (e.retryAfter || 0))
                        } else r(e)
                    },
                    c = function() {
                        var t = "";
                        n.handleRequest(e, s,
                        function(e) {
                            e.on("data",
                            function(e) {
                                t += e.toString()
                            }),
                            e.on("end",
                            function() {
                                var n = e.statusCode;
                                if (n < 300) r(null, t);
                                else {
                                    var i = 1e3 * parseInt(e.headers["retry-after"], 10) || 0,
                                    s = o.error(new Error, {
                                        retryable: n >= 500 || 429 === n
                                    });
                                    i && s.retryable && (s.retryAfter = i),
                                    u(s)
                                }
                            })
                        },
                        u)
                    };
                    i.util.defer(c)
                },
                uuid: {
                    v4: function() {
                        return e("uuid").v4()
                    }
                },
                convertPayloadToString: function(e) {
                    var t = e.request,
                    r = t.operation,
                    n = t.service.api.operations[r].output || {};
                    n.payload && e.data[n.payload] && (e.data[n.payload] = e.data[n.payload].toString())
                },
                defer: function(e) {
                    "object" == typeof r && "function" == typeof r.nextTick ? r.nextTick(e) : "function" == typeof n ? n(e) : setTimeout(e, 0)
                },
                getRequestPayloadShape: function(e) {
                    var t = e.service.api.operations;
                    if (t) {
                        var r = (t || {})[e.operation];
                        if (r && r.input && r.input.payload) return r.input.members[r.input.payload]
                    }
                },
                defaultProfile: "default",
                configOptInEnv: "AWS_SDK_LOAD_CONFIG",
                sharedCredentialsFileEnv: "AWS_SHARED_CREDENTIALS_FILE",
                sharedConfigFileEnv: "AWS_CONFIG_FILE",
                imdsDisabledEnv: "AWS_EC2_METADATA_DISABLED"
            };
            t.exports = o
        }).call(this, e("_process"), e("timers").setImmediate)
    },
    {
        "../apis/metadata.json": 26,
        "./core": 38,
        _process: 9,
        fs: 2,
        timers: 17,
        uuid: 21
    }],
    37 : [function(e, t, r) {
        var n = e("./core");
        e("./credentials"),
        e("./credentials/credential_provider_chain");
        var i;
        n.Config = n.util.inherit({
            constructor: function(e) {
                void 0 === e && (e = {}),
                e = this.extractCredentials(e),
                n.util.each.call(this, this.keys,
                function(t, r) {
                    this.set(t, e[t], r)
                })
            },
            getCredentials: function(e) {
                function t(t) {
                    e(t, t ? null: i.credentials)
                }
                function r(e, t) {
                    return new n.util.error(t || new Error, {
                        code: "CredentialsError",
                        message: e,
                        name: "CredentialsError"
                    })
                }
                var i = this;
                i.credentials ? "function" == typeof i.credentials.get ?
                function() {
                    i.credentials.get(function(e) {
                        e && (e = r("Could not load credentials from " + i.credentials.constructor.name, e)),
                        t(e)
                    })
                } () : function() {
                    var e = null;
                    i.credentials.accessKeyId && i.credentials.secretAccessKey || (e = r("Missing credentials")),
                    t(e)
                } () : i.credentialProvider ? i.credentialProvider.resolve(function(e, n) {
                    e && (e = r("Could not load credentials from any providers", e)),
                    i.credentials = n,
                    t(e)
                }) : t(r("No credentials to load"))
            },
            update: function(e, t) {
                t = t || !1,
                e = this.extractCredentials(e),
                n.util.each.call(this, e,
                function(e, r) { (t || Object.prototype.hasOwnProperty.call(this.keys, e) || n.Service.hasService(e)) && this.set(e, r)
                })
            },
            loadFromPath: function(e) {
                this.clear();
                var t = JSON.parse(n.util.readFileSync(e)),
                r = new n.FileSystemCredentials(e),
                i = new n.CredentialProviderChain;
                return i.providers.unshift(r),
                i.resolve(function(e, r) {
                    if (e) throw e;
                    t.credentials = r
                }),
                this.constructor(t),
                this
            },
            clear: function() {
                n.util.each.call(this, this.keys,
                function(e) {
                    delete this[e]
                }),
                this.set("credentials", void 0),
                this.set("credentialProvider", void 0)
            },
            set: function(e, t, r) {
                void 0 === t ? (void 0 === r && (r = this.keys[e]), this[e] = "function" == typeof r ? r.call(this) : r) : "httpOptions" === e && this[e] ? this[e] = n.util.merge(this[e], t) : this[e] = t
            },
            keys: {
                credentials: null,
                credentialProvider: null,
                region: null,
                logger: null,
                apiVersions: {},
                apiVersion: null,
                endpoint: void 0,
                httpOptions: {
                    timeout: 12e4
                },
                maxRetries: void 0,
                maxRedirects: 10,
                paramValidation: !0,
                sslEnabled: !0,
                s3ForcePathStyle: !1,
                s3BucketEndpoint: !1,
                s3DisableBodySigning: !0,
                computeChecksums: !0,
                convertResponseTypes: !0,
                correctClockSkew: !1,
                customUserAgent: null,
                dynamoDbCrc32: !0,
                systemClockOffset: 0,
                signatureVersion: null,
                signatureCache: !0,
                retryDelayOptions: {},
                useAccelerateEndpoint: !1,
                clientSideMonitoring: !1,
                endpointDiscoveryEnabled: !1,
                endpointCacheSize: 1e3,
                hostPrefixEnabled: !0
            },
            extractCredentials: function(e) {
                return e.accessKeyId && e.secretAccessKey && (e = n.util.copy(e), e.credentials = new n.Credentials(e)),
                e
            },
            setPromisesDependency: function(e) {
                i = e,
                null === e && "function" == typeof Promise && (i = Promise);
                var t = [n.Request, n.Credentials, n.CredentialProviderChain];
                n.S3 && n.S3.ManagedUpload && t.push(n.S3.ManagedUpload),
                n.util.addPromises(t, i)
            },
            getPromisesDependency: function() {
                return i
            }
        }),
        n.config = new n.Config
    },
    {
        "./core": 38,
        "./credentials": 39,
        "./credentials/credential_provider_chain": 42
    }],
    42 : [function(e, t, r) {
        var n = e("../core");
        n.CredentialProviderChain = n.util.inherit(n.Credentials, {
            constructor: function(e) {
                this.providers = e || n.CredentialProviderChain.defaultProviders.slice(0),
                this.resolveCallbacks = []
            },
            resolve: function(e) {
                function t(e, s) {
                    if (!e && s || i === o.length) return n.util.arrayEach(r.resolveCallbacks,
                    function(t) {
                        t(e, s)
                    }),
                    void(r.resolveCallbacks.length = 0);
                    var a = o[i++];
                    s = "function" == typeof a ? a.call() : a,
                    s.get ? s.get(function(e) {
                        t(e, e ? null: s)
                    }) : t(null, s)
                }
                var r = this;
                if (0 === r.providers.length) return e(new Error("No providers")),
                r;
                if (1 === r.resolveCallbacks.push(e)) {
                    var i = 0,
                    o = r.providers.slice(0);
                    t()
                }
                return r
            }
        }),
        n.CredentialProviderChain.defaultProviders = [],
        n.CredentialProviderChain.addPromisesToClass = function(e) {
            this.prototype.resolvePromise = n.util.promisifyMethod("resolve", e)
        },
        n.CredentialProviderChain.deletePromisesFromClass = function() {
            delete this.prototype.resolvePromise
        },
        n.util.addPromises(n.CredentialProviderChain)
    },
    {
        "../core": 38
    }],
    39 : [function(e, t, r) {
        var n = e("./core");
        n.Credentials = n.util.inherit({
            constructor: function() {
                if (n.util.hideProperties(this, ["secretAccessKey"]), this.expired = !1, this.expireTime = null, this.refreshCallbacks = [], 1 === arguments.length && "object" == typeof arguments[0]) {
                    var e = arguments[0].credentials || arguments[0];
                    this.accessKeyId = e.accessKeyId,
                    this.secretAccessKey = e.secretAccessKey,
                    this.sessionToken = e.sessionToken
                } else this.accessKeyId = arguments[0],
                this.secretAccessKey = arguments[1],
                this.sessionToken = arguments[2]
            },
            expiryWindow: 15,
            needsRefresh: function() {
                var e = n.util.date.getDate().getTime(),
                t = new Date(e + 1e3 * this.expiryWindow);
                return !! (this.expireTime && t > this.expireTime) || (this.expired || !this.accessKeyId || !this.secretAccessKey)
            },
            get: function(e) {
                var t = this;
                this.needsRefresh() ? this.refresh(function(r) {
                    r || (t.expired = !1),
                    e && e(r)
                }) : e && e()
            },
            refresh: function(e) {
                this.expired = !1,
                e()
            },
            coalesceRefresh: function(e, t) {
                var r = this;
                1 === r.refreshCallbacks.push(e) && r.load(function(e) {
                    n.util.arrayEach(r.refreshCallbacks,
                    function(r) {
                        t ? r(e) : n.util.defer(function() {
                            r(e)
                        })
                    }),
                    r.refreshCallbacks.length = 0
                })
            },
            load: function(e) {
                e()
            }
        }),
        n.Credentials.addPromisesToClass = function(e) {
            this.prototype.getPromise = n.util.promisifyMethod("get", e),
            this.prototype.refreshPromise = n.util.promisifyMethod("refresh", e)
        },
        n.Credentials.deletePromisesFromClass = function() {
            delete this.prototype.getPromise,
            delete this.prototype.refreshPromise
        },
        n.util.addPromises(n.Credentials)
    },
    {
        "./core": 38
    }],
    27 : [function(e, t, r) {
        function n(e, t) {
            if (!n.services.hasOwnProperty(e)) throw new Error("InvalidService: Failed to load api for " + e);
            return n.services[e][t]
        }
        n.services = {},
        t.exports = n
    },
    {}],
    26 : [function(e, t, r) {
        t.exports = {
            acm: {
                name: "ACM",
                cors: !0
            },
            apigateway: {
                name: "APIGateway",
                cors: !0
            },
            applicationautoscaling: {
                prefix: "application-autoscaling",
                name: "ApplicationAutoScaling",
                cors: !0
            },
            appstream: {
                name: "AppStream"
            },
            autoscaling: {
                name: "AutoScaling",
                cors: !0
            },
            batch: {
                name: "Batch"
            },
            budgets: {
                name: "Budgets"
            },
            clouddirectory: {
                name: "CloudDirectory",
                versions: ["2016-05-10*"]
            },
            cloudformation: {
                name: "CloudFormation",
                cors: !0
            },
            cloudfront: {
                name: "CloudFront",
                versions: ["2013-05-12*", "2013-11-11*", "2014-05-31*", "2014-10-21*", "2014-11-06*", "2015-04-17*", "2015-07-27*", "2015-09-17*", "2016-01-13*", "2016-01-28*", "2016-08-01*", "2016-08-20*", "2016-09-07*", "2016-09-29*", "2016-11-25*", "2017-03-25*", "2017-10-30*", "2018-06-18*"],
                cors: !0
            },
            cloudhsm: {
                name: "CloudHSM",
                cors: !0
            },
            cloudsearch: {
                name: "CloudSearch"
            },
            cloudsearchdomain: {
                name: "CloudSearchDomain"
            },
            cloudtrail: {
                name: "CloudTrail",
                cors: !0
            },
            cloudwatch: {
                prefix: "monitoring",
                name: "CloudWatch",
                cors: !0
            },
            cloudwatchevents: {
                prefix: "events",
                name: "CloudWatchEvents",
                versions: ["2014-02-03*"],
                cors: !0
            },
            cloudwatchlogs: {
                prefix: "logs",
                name: "CloudWatchLogs",
                cors: !0
            },
            codebuild: {
                name: "CodeBuild",
                cors: !0
            },
            codecommit: {
                name: "CodeCommit",
                cors: !0
            },
            codedeploy: {
                name: "CodeDeploy",
                cors: !0
            },
            codepipeline: {
                name: "CodePipeline",
                cors: !0
            },
            cognitoidentity: {
                prefix: "cognito-identity",
                name: "CognitoIdentity",
                cors: !0
            },
            cognitoidentityserviceprovider: {
                prefix: "cognito-idp",
                name: "CognitoIdentityServiceProvider",
                cors: !0
            },
            cognitosync: {
                prefix: "cognito-sync",
                name: "CognitoSync",
                cors: !0
            },
            configservice: {
                prefix: "config",
                name: "ConfigService",
                cors: !0
            },
            cur: {
                name: "CUR",
                cors: !0
            },
            datapipeline: {
                name: "DataPipeline"
            },
            devicefarm: {
                name: "DeviceFarm",
                cors: !0
            },
            directconnect: {
                name: "DirectConnect",
                cors: !0
            },
            directoryservice: {
                prefix: "ds",
                name: "DirectoryService"
            },
            discovery: {
                name: "Discovery"
            },
            dms: {
                name: "DMS"
            },
            dynamodb: {
                name: "DynamoDB",
                cors: !0
            },
            dynamodbstreams: {
                prefix: "streams.dynamodb",
                name: "DynamoDBStreams",
                cors: !0
            },
            ec2: {
                name: "EC2",
                versions: ["2013-06-15*", "2013-10-15*", "2014-02-01*", "2014-05-01*", "2014-06-15*", "2014-09-01*", "2014-10-01*", "2015-03-01*", "2015-04-15*", "2015-10-01*", "2016-04-01*", "2016-09-15*"],
                cors: !0
            },
            ecr: {
                name: "ECR",
                cors: !0
            },
            ecs: {
                name: "ECS",
                cors: !0
            },
            efs: {
                prefix: "elasticfilesystem",
                name: "EFS",
                cors: !0
            },
            elasticache: {
                name: "ElastiCache",
                versions: ["2012-11-15*", "2014-03-24*", "2014-07-15*", "2014-09-30*"],
                cors: !0
            },
            elasticbeanstalk: {
                name: "ElasticBeanstalk",
                cors: !0
            },
            elb: {
                prefix: "elasticloadbalancing",
                name: "ELB",
                cors: !0
            },
            elbv2: {
                prefix: "elasticloadbalancingv2",
                name: "ELBv2",
                cors: !0
            },
            emr: {
                prefix: "elasticmapreduce",
                name: "EMR",
                cors: !0
            },
            es: {
                name: "ES"
            },
            elastictranscoder: {
                name: "ElasticTranscoder",
                cors: !0
            },
            firehose: {
                name: "Firehose",
                cors: !0
            },
            gamelift: {
                name: "GameLift",
                cors: !0
            },
            glacier: {
                name: "Glacier"
            },
            health: {
                name: "Health"
            },
            iam: {
                name: "IAM",
                cors: !0
            },
            importexport: {
                name: "ImportExport"
            },
            inspector: {
                name: "Inspector",
                versions: ["2015-08-18*"],
                cors: !0
            },
            iot: {
                name: "Iot",
                cors: !0
            },
            iotdata: {
                prefix: "iot-data",
                name: "IotData",
                cors: !0
            },
            kinesis: {
                name: "Kinesis",
                cors: !0
            },
            kinesisanalytics: {
                name: "KinesisAnalytics"
            },
            kms: {
                name: "KMS",
                cors: !0
            },
            lambda: {
                name: "Lambda",
                cors: !0
            },
            lexruntime: {
                prefix: "runtime.lex",
                name: "LexRuntime",
                cors: !0
            },
            lightsail: {
                name: "Lightsail"
            },
            machinelearning: {
                name: "MachineLearning",
                cors: !0
            },
            marketplacecommerceanalytics: {
                name: "MarketplaceCommerceAnalytics",
                cors: !0
            },
            marketplacemetering: {
                prefix: "meteringmarketplace",
                name: "MarketplaceMetering"
            },
            mturk: {
                prefix: "mturk-requester",
                name: "MTurk",
                cors: !0
            },
            mobileanalytics: {
                name: "MobileAnalytics",
                cors: !0
            },
            opsworks: {
                name: "OpsWorks",
                cors: !0
            },
            opsworkscm: {
                name: "OpsWorksCM"
            },
            organizations: {
                name: "Organizations"
            },
            pinpoint: {
                name: "Pinpoint"
            },
            polly: {
                name: "Polly",
                cors: !0
            },
            rds: {
                name: "RDS",
                versions: ["2014-09-01*"],
                cors: !0
            },
            redshift: {
                name: "Redshift",
                cors: !0
            },
            rekognition: {
                name: "Rekognition",
                cors: !0
            },
            resourcegroupstaggingapi: {
                name: "ResourceGroupsTaggingAPI"
            },
            route53: {
                name: "Route53",
                cors: !0
            },
            route53domains: {
                name: "Route53Domains",
                cors: !0
            },
            s3: {
                name: "S3",
                dualstackAvailable: !0,
                cors: !0
            },
            s3control: {
                name: "S3Control",
                dualstackAvailable: !0
            },
            servicecatalog: {
                name: "ServiceCatalog",
                cors: !0
            },
            ses: {
                prefix: "email",
                name: "SES",
                cors: !0
            },
            shield: {
                name: "Shield"
            },
            simpledb: {
                prefix: "sdb",
                name: "SimpleDB"
            },
            sms: {
                name: "SMS"
            },
            snowball: {
                name: "Snowball"
            },
            sns: {
                name: "SNS",
                cors: !0
            },
            sqs: {
                name: "SQS",
                cors: !0
            },
            ssm: {
                name: "SSM",
                cors: !0
            },
            storagegateway: {
                name: "StorageGateway",
                cors: !0
            },
            stepfunctions: {
                prefix: "states",
                name: "StepFunctions"
            },
            sts: {
                name: "STS",
                cors: !0
            },
            support: {
                name: "Support"
            },
            swf: {
                name: "SWF"
            },
            xray: {
                name: "XRay"
            },
            waf: {
                name: "WAF",
                cors: !0
            },
            wafregional: {
                prefix: "waf-regional",
                name: "WAFRegional"
            },
            workdocs: {
                name: "WorkDocs",
                cors: !0
            },
            workspaces: {
                name: "WorkSpaces"
            },
            codestar: {
                name: "CodeStar"
            },
            lexmodelbuildingservice: {
                prefix: "lex-models",
                name: "LexModelBuildingService",
                cors: !0
            },
            marketplaceentitlementservice: {
                prefix: "entitlement.marketplace",
                name: "MarketplaceEntitlementService"
            },
            athena: {
                name: "Athena"
            },
            greengrass: {
                name: "Greengrass"
            },
            dax: {
                name: "DAX"
            },
            migrationhub: {
                prefix: "AWSMigrationHub",
                name: "MigrationHub"
            },
            cloudhsmv2: {
                name: "CloudHSMV2"
            },
            glue: {
                name: "Glue"
            },
            mobile: {
                name: "Mobile"
            },
            pricing: {
                name: "Pricing",
                cors: !0
            },
            costexplorer: {
                prefix: "ce",
                name: "CostExplorer",
                cors: !0
            },
            mediaconvert: {
                name: "MediaConvert"
            },
            medialive: {
                name: "MediaLive"
            },
            mediapackage: {
                name: "MediaPackage"
            },
            mediastore: {
                name: "MediaStore"
            },
            mediastoredata: {
                prefix: "mediastore-data",
                name: "MediaStoreData",
                cors: !0
            },
            appsync: {
                name: "AppSync"
            },
            guardduty: {
                name: "GuardDuty"
            },
            mq: {
                name: "MQ"
            },
            comprehend: {
                name: "Comprehend",
                cors: !0
            },
            iotjobsdataplane: {
                prefix: "iot-jobs-data",
                name: "IoTJobsDataPlane"
            },
            kinesisvideoarchivedmedia: {
                prefix: "kinesis-video-archived-media",
                name: "KinesisVideoArchivedMedia",
                cors: !0
            },
            kinesisvideomedia: {
                prefix: "kinesis-video-media",
                name: "KinesisVideoMedia",
                cors: !0
            },
            kinesisvideo: {
                name: "KinesisVideo",
                cors: !0
            },
            sagemakerruntime: {
                prefix: "runtime.sagemaker",
                name: "SageMakerRuntime"
            },
            sagemaker: {
                name: "SageMaker"
            },
            translate: {
                name: "Translate",
                cors: !0
            },
            resourcegroups: {
                prefix: "resource-groups",
                name: "ResourceGroups",
                cors: !0
            },
            alexaforbusiness: {
                name: "AlexaForBusiness"
            },
            cloud9: {
                name: "Cloud9"
            },
            serverlessapplicationrepository: {
                prefix: "serverlessrepo",
                name: "ServerlessApplicationRepository"
            },
            servicediscovery: {
                name: "ServiceDiscovery"
            },
            workmail: {
                name: "WorkMail"
            },
            autoscalingplans: {
                prefix: "autoscaling-plans",
                name: "AutoScalingPlans"
            },
            transcribeservice: {
                prefix: "transcribe",
                name: "TranscribeService"
            },
            connect: {
                name: "Connect"
            },
            acmpca: {
                prefix: "acm-pca",
                name: "ACMPCA"
            },
            fms: {
                name: "FMS"
            },
            secretsmanager: {
                name: "SecretsManager",
                cors: !0
            },
            iotanalytics: {
                name: "IoTAnalytics"
            },
            iot1clickdevicesservice: {
                prefix: "iot1click-devices",
                name: "IoT1ClickDevicesService"
            },
            iot1clickprojects: {
                prefix: "iot1click-projects",
                name: "IoT1ClickProjects"
            },
            pi: {
                name: "PI"
            },
            neptune: {
                name: "Neptune"
            },
            mediatailor: {
                name: "MediaTailor"
            },
            eks: {
                name: "EKS"
            },
            macie: {
                name: "Macie"
            },
            dlm: {
                name: "DLM"
            },
            signer: {
                name: "Signer"
            },
            chime: {
                name: "Chime"
            },
            pinpointemail: {
                prefix: "pinpoint-email",
                name: "PinpointEmail"
            },
            ram: {
                name: "RAM"
            },
            route53resolver: {
                name: "Route53Resolver"
            },
            pinpointsmsvoice: {
                prefix: "sms-voice",
                name: "PinpointSMSVoice"
            },
            quicksight: {
                name: "QuickSight"
            },
            rdsdataservice: {
                prefix: "rds-data",
                name: "RDSDataService"
            },
            amplify: {
                name: "Amplify"
            },
            datasync: {
                name: "DataSync"
            },
            robomaker: {
                name: "RoboMaker"
            },
            transfer: {
                name: "Transfer"
            },
            globalaccelerator: {
                name: "GlobalAccelerator"
            },
            comprehendmedical: {
                name: "ComprehendMedical",
                cors: !0
            },
            kinesisanalyticsv2: {
                name: "KinesisAnalyticsV2"
            },
            mediaconnect: {
                name: "MediaConnect"
            },
            fsx: {
                name: "FSx"
            },
            securityhub: {
                name: "SecurityHub"
            },
            appmesh: {
                name: "AppMesh",
                versions: ["2018-10-01*"]
            },
            licensemanager: {
                prefix: "license-manager",
                name: "LicenseManager"
            },
            kafka: {
                name: "Kafka"
            },
            apigatewaymanagementapi: {
                name: "ApiGatewayManagementApi"
            },
            apigatewayv2: {
                name: "ApiGatewayV2"
            },
            docdb: {
                name: "DocDB"
            },
            backup: {
                name: "Backup"
            },
            worklink: {
                name: "WorkLink"
            },
            textract: {
                name: "Textract"
            },
            managedblockchain: {
                name: "ManagedBlockchain"
            }
        }
    },
    {}],
    21 : [function(e, t, r) {
        var n = e("./v1"),
        i = e("./v4"),
        o = i;
        o.v1 = n,
        o.v4 = i,
        t.exports = o
    },
    {
        "./v1": 24,
        "./v4": 25
    }],
    25 : [function(e, t, r) {
        function n(e, t, r) {
            var n = t && r || 0;
            "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null),
            e = e || {};
            var s = e.random || (e.rng || i)();
            if (s[6] = 15 & s[6] | 64, s[8] = 63 & s[8] | 128, t) for (var a = 0; a < 16; ++a) t[n + a] = s[a];
            return t || o(s)
        }
        var i = e("./lib/rng"),
        o = e("./lib/bytesToUuid");
        t.exports = n
    },
    {
        "./lib/bytesToUuid": 22,
        "./lib/rng": 23
    }],
    24 : [function(e, t, r) {
        function n(e, t, r) {
            var n = t && r || 0,
            h = t || [];
            e = e || {};
            var l = e.node || i,
            p = void 0 !== e.clockseq ? e.clockseq: o;
            if (null == l || null == p) {
                var f = s();
                null == l && (l = i = [1 | f[0], f[1], f[2], f[3], f[4], f[5]]),
                null == p && (p = o = 16383 & (f[6] << 8 | f[7]))
            }
            var d = void 0 !== e.msecs ? e.msecs: (new Date).getTime(),
            m = void 0 !== e.nsecs ? e.nsecs: c + 1,
            v = d - u + (m - c) / 1e4;
            if (v < 0 && void 0 === e.clockseq && (p = p + 1 & 16383), (v < 0 || d > u) && void 0 === e.nsecs && (m = 0), m >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            u = d,
            c = m,
            o = p,
            d += 122192928e5;
            var g = (1e4 * (268435455 & d) + m) % 4294967296;
            h[n++] = g >>> 24 & 255,
            h[n++] = g >>> 16 & 255,
            h[n++] = g >>> 8 & 255,
            h[n++] = 255 & g;
            var y = d / 4294967296 * 1e4 & 268435455;
            h[n++] = y >>> 8 & 255,
            h[n++] = 255 & y,
            h[n++] = y >>> 24 & 15 | 16,
            h[n++] = y >>> 16 & 255,
            h[n++] = p >>> 8 | 128,
            h[n++] = 255 & p;
            for (var b = 0; b < 6; ++b) h[n + b] = l[b];
            return t || a(h)
        }
        var i, o, s = e("./lib/rng"),
        a = e("./lib/bytesToUuid"),
        u = 0,
        c = 0;
        t.exports = n
    },
    {
        "./lib/bytesToUuid": 22,
        "./lib/rng": 23
    }],
    23 : [function(e, t, r) {
        var n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
        if (n) {
            var i = new Uint8Array(16);
            t.exports = function() {
                return n(i),
                i
            }
        } else {
            var o = new Array(16);
            t.exports = function() {
                for (var e, t = 0; t < 16; t++) 0 == (3 & t) && (e = 4294967296 * Math.random()),
                o[t] = e >>> ((3 & t) << 3) & 255;
                return o
            }
        }
    },
    {}],
    22 : [function(e, t, r) {
        function n(e, t) {
            var r = t || 0,
            n = i;
            return [n[e[r++]], n[e[r++]], n[e[r++]], n[e[r++]], "-", n[e[r++]], n[e[r++]], "-", n[e[r++]], n[e[r++]], "-", n[e[r++]], n[e[r++]], "-", n[e[r++]], n[e[r++]], n[e[r++]], n[e[r++]], n[e[r++]], n[e[r++]]].join("")
        }
        for (var i = [], o = 0; o < 256; ++o) i[o] = (o + 256).toString(16).substr(1);
        t.exports = n
    },
    {}],
    20 : [function(e, t, r) { (function(t, n) {
            function i(e, t) {
                var n = {
                    seen: [],
                    stylize: s
                };
                return arguments.length >= 3 && (n.depth = arguments[2]),
                arguments.length >= 4 && (n.colors = arguments[3]),
                m(t) ? n.showHidden = t: t && r._extend(n, t),
                E(n.showHidden) && (n.showHidden = !1),
                E(n.depth) && (n.depth = 2),
                E(n.colors) && (n.colors = !1),
                E(n.customInspect) && (n.customInspect = !0),
                n.colors && (n.stylize = o),
                u(n, e, n.depth)
            }
            function o(e, t) {
                var r = i.styles[t];
                return r ? "[" + i.colors[r][0] + "m" + e + "[" + i.colors[r][1] + "m": e
            }
            function s(e, t) {
                return e
            }
            function a(e) {
                var t = {};
                return e.forEach(function(e, r) {
                    t[e] = !0
                }),
                t
            }
            function u(e, t, n) {
                if (e.customInspect && t && R(t.inspect) && t.inspect !== r.inspect && (!t.constructor || t.constructor.prototype !== t)) {
                    var i = t.inspect(n, e);
                    return b(i) || (i = u(e, i, n)),
                    i
                }
                var o = c(e, t);
                if (o) return o;
                var s = Object.keys(t),
                m = a(s);
                if (e.showHidden && (s = Object.getOwnPropertyNames(t)), x(t) && (s.indexOf("message") >= 0 || s.indexOf("description") >= 0)) return h(t);
                if (0 === s.length) {
                    if (R(t)) {
                        var v = t.name ? ": " + t.name: "";
                        return e.stylize("[Function" + v + "]", "special")
                    }
                    if (_(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
                    if (C(t)) return e.stylize(Date.prototype.toString.call(t), "date");
                    if (x(t)) return h(t)
                }
                var g = "",
                y = !1,
                w = ["{", "}"];
                if (d(t) && (y = !0, w = ["[", "]"]), R(t)) {
                    g = " [Function" + (t.name ? ": " + t.name: "") + "]"
                }
                if (_(t) && (g = " " + RegExp.prototype.toString.call(t)), C(t) && (g = " " + Date.prototype.toUTCString.call(t)), x(t) && (g = " " + h(t)), 0 === s.length && (!y || 0 == t.length)) return w[0] + g + w[1];
                if (n < 0) return _(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
                e.seen.push(t);
                var E;
                return E = y ? l(e, t, n, m, s) : s.map(function(r) {
                    return p(e, t, n, m, r, y)
                }),
                e.seen.pop(),
                f(E, g, w)
            }
            function c(e, t) {
                if (E(t)) return e.stylize("undefined", "undefined");
                if (b(t)) {
                    var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return e.stylize(r, "string")
                }
                return y(t) ? e.stylize("" + t, "number") : m(t) ? e.stylize("" + t, "boolean") : v(t) ? e.stylize("null", "null") : void 0
            }
            function h(e) {
                return "[" + Error.prototype.toString.call(e) + "]"
            }
            function l(e, t, r, n, i) {
                for (var o = [], s = 0, a = t.length; s < a; ++s) L(t, String(s)) ? o.push(p(e, t, r, n, String(s), !0)) : o.push("");
                return i.forEach(function(i) {
                    i.match(/^\d+$/) || o.push(p(e, t, r, n, i, !0))
                }),
                o
            }
            function p(e, t, r, n, i, o) {
                var s, a, c;
                if (c = Object.getOwnPropertyDescriptor(t, i) || {
                    value: t[i]
                },
                c.get ? a = c.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : c.set && (a = e.stylize("[Setter]", "special")), L(n, i) || (s = "[" + i + "]"), a || (e.seen.indexOf(c.value) < 0 ? (a = v(r) ? u(e, c.value, null) : u(e, c.value, r - 1), a.indexOf("\n") > -1 && (a = o ? a.split("\n").map(function(e) {
                    return "  " + e
                }).join("\n").substr(2) : "\n" + a.split("\n").map(function(e) {
                    return "   " + e
                }).join("\n"))) : a = e.stylize("[Circular]", "special")), E(s)) {
                    if (o && i.match(/^\d+$/)) return a;
                    s = JSON.stringify("" + i),
                    s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = e.stylize(s, "string"))
                }
                return s + ": " + a
            }
            function f(e, t, r) {
                var n = 0;
                return e.reduce(function(e, t) {
                    return n++,
                    t.indexOf("\n") >= 0 && n++,
                    e + t.replace(/\u001b\[\d\d?m/g, "").length + 1
                },
                0) > 60 ? r[0] + ("" === t ? "": t + "\n ") + " " + e.join(",\n  ") + " " + r[1] : r[0] + t + " " + e.join(", ") + " " + r[1]
            }
            function d(e) {
                return Array.isArray(e)
            }
            function m(e) {
                return "boolean" == typeof e
            }
            function v(e) {
                return null === e
            }
            function g(e) {
                return null == e
            }
            function y(e) {
                return "number" == typeof e
            }
            function b(e) {
                return "string" == typeof e
            }
            function w(e) {
                return "symbol" == typeof e
            }
            function E(e) {
                return void 0 === e
            }
            function _(e) {
                return S(e) && "[object RegExp]" === T(e)
            }
            function S(e) {
                return "object" == typeof e && null !== e
            }
            function C(e) {
                return S(e) && "[object Date]" === T(e)
            }
            function x(e) {
                return S(e) && ("[object Error]" === T(e) || e instanceof Error)
            }
            function R(e) {
                return "function" == typeof e
            }
            function A(e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
            }
            function T(e) {
                return Object.prototype.toString.call(e)
            }
            function k(e) {
                return e < 10 ? "0" + e.toString(10) : e.toString(10)
            }
            function I() {
                var e = new Date,
                t = [k(e.getHours()), k(e.getMinutes()), k(e.getSeconds())].join(":");
                return [e.getDate(), U[e.getMonth()], t].join(" ")
            }
            function L(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }
            var P = /%[sdj%]/g;
            r.format = function(e) {
                if (!b(e)) {
                    for (var t = [], r = 0; r < arguments.length; r++) t.push(i(arguments[r]));
                    return t.join(" ")
                }
                for (var r = 1,
                n = arguments,
                o = n.length,
                s = String(e).replace(P,
                function(e) {
                    if ("%%" === e) return "%";
                    if (r >= o) return e;
                    switch (e) {
                    case "%s":
                        return String(n[r++]);
                    case "%d":
                        return Number(n[r++]);
                    case "%j":
                        try {
                            return JSON.stringify(n[r++])
                        } catch(e) {
                            return "[Circular]"
                        }
                    default:
                        return e
                    }
                }), a = n[r]; r < o; a = n[++r]) v(a) || !S(a) ? s += " " + a: s += " " + i(a);
                return s
            },
            r.deprecate = function(e, i) {
                function o() {
                    if (!s) {
                        if (t.throwDeprecation) throw new Error(i);
                        t.traceDeprecation ? console.trace(i) : console.error(i),
                        s = !0
                    }
                    return e.apply(this, arguments)
                }
                if (E(n.process)) return function() {
                    return r.deprecate(e, i).apply(this, arguments)
                };
                if (!0 === t.noDeprecation) return e;
                var s = !1;
                return o
            };
            var q, O = {};
            r.debuglog = function(e) {
                if (E(q) && (q = t.env.NODE_DEBUG || ""), e = e.toUpperCase(), !O[e]) if (new RegExp("\\b" + e + "\\b", "i").test(q)) {
                    var n = t.pid;
                    O[e] = function() {
                        var t = r.format.apply(r, arguments);
                        console.error("%s %d: %s", e, n, t)
                    }
                } else O[e] = function() {};
                return O[e]
            },
            r.inspect = i,
            i.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            },
            i.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            },
            r.isArray = d,
            r.isBoolean = m,
            r.isNull = v,
            r.isNullOrUndefined = g,
            r.isNumber = y,
            r.isString = b,
            r.isSymbol = w,
            r.isUndefined = E,
            r.isRegExp = _,
            r.isObject = S,
            r.isDate = C,
            r.isError = x,
            r.isFunction = R,
            r.isPrimitive = A,
            r.isBuffer = e("./support/isBuffer");
            var U = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            r.log = function() {
                console.log("%s - %s", I(), r.format.apply(r, arguments))
            },
            r.inherits = e("inherits"),
            r._extend = function(e, t) {
                if (!t || !S(t)) return e;
                for (var r = Object.keys(t), n = r.length; n--;) e[r[n]] = t[r[n]];
                return e
            }
        }).call(this, e("_process"), "undefined" != typeof global ? global: "undefined" != typeof self ? self: "undefined" != typeof window ? window: {})
    },
    {
        "./support/isBuffer": 19,
        _process: 9,
        inherits: 6
    }],
    19 : [function(e, t, r) {
        t.exports = function(e) {
            return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8
        }
    },
    {}],
    17 : [function(e, t, r) { (function(t, n) {
            function i(e, t) {
                this._id = e,
                this._clearFn = t
            }
            var o = e("process/browser.js").nextTick,
            s = Function.prototype.apply,
            a = Array.prototype.slice,
            u = {},
            c = 0;
            r.setTimeout = function() {
                return new i(s.call(setTimeout, window, arguments), clearTimeout)
            },
            r.setInterval = function() {
                return new i(s.call(setInterval, window, arguments), clearInterval)
            },
            r.clearTimeout = r.clearInterval = function(e) {
                e.close()
            },
            i.prototype.unref = i.prototype.ref = function() {},
            i.prototype.close = function() {
                this._clearFn.call(window, this._id)
            },
            r.enroll = function(e, t) {
                clearTimeout(e._idleTimeoutId),
                e._idleTimeout = t
            },
            r.unenroll = function(e) {
                clearTimeout(e._idleTimeoutId),
                e._idleTimeout = -1
            },
            r._unrefActive = r.active = function(e) {
                clearTimeout(e._idleTimeoutId);
                var t = e._idleTimeout;
                t >= 0 && (e._idleTimeoutId = setTimeout(function() {
                    e._onTimeout && e._onTimeout()
                },
                t))
            },
            r.setImmediate = "function" == typeof t ? t: function(e) {
                var t = c++,
                n = !(arguments.length < 2) && a.call(arguments, 1);
                return u[t] = !0,
                o(function() {
                    u[t] && (n ? e.apply(null, n) : e.call(null), r.clearImmediate(t))
                }),
                t
            },
            r.clearImmediate = "function" == typeof n ? n: function(e) {
                delete u[e]
            }
        }).call(this, e("timers").setImmediate, e("timers").clearImmediate)
    },
    {
        "process/browser.js": 9,
        timers: 17
    }],
    9 : [function(e, t, r) {
        function n() {
            throw new Error("setTimeout has not been defined")
        }
        function i() {
            throw new Error("clearTimeout has not been defined")
        }
        function o(e) {
            if (l === setTimeout) return setTimeout(e, 0);
            if ((l === n || !l) && setTimeout) return l = setTimeout,
            setTimeout(e, 0);
            try {
                return l(e, 0)
            } catch(t) {
                try {
                    return l.call(null, e, 0)
                } catch(t) {
                    return l.call(this, e, 0)
                }
            }
        }
        function s(e) {
            if (p === clearTimeout) return clearTimeout(e);
            if ((p === i || !p) && clearTimeout) return p = clearTimeout,
            clearTimeout(e);
            try {
                return p(e)
            } catch(t) {
                try {
                    return p.call(null, e)
                } catch(t) {
                    return p.call(this, e)
                }
            }
        }
        function a() {
            v && d && (v = !1, d.length ? m = d.concat(m) : g = -1, m.length && u())
        }
        function u() {
            if (!v) {
                var e = o(a);
                v = !0;
                for (var t = m.length; t;) {
                    for (d = m, m = []; ++g < t;) d && d[g].run();
                    g = -1,
                    t = m.length
                }
                d = null,
                v = !1,
                s(e)
            }
        }
        function c(e, t) {
            this.fun = e,
            this.array = t
        }
        function h() {}
        var l, p, f = t.exports = {}; !
        function() {
            try {
                l = "function" == typeof setTimeout ? setTimeout: n
            } catch(e) {
                l = n
            }
            try {
                p = "function" == typeof clearTimeout ? clearTimeout: i
            } catch(e) {
                p = i
            }
        } ();
        var d, m = [],
        v = !1,
        g = -1;
        f.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
            m.push(new c(e, t)),
            1 !== m.length || v || o(u)
        },
        c.prototype.run = function() {
            this.fun.apply(null, this.array)
        },
        f.title = "browser",
        f.browser = !0,
        f.env = {},
        f.argv = [],
        f.version = "",
        f.versions = {},
        f.on = h,
        f.addListener = h,
        f.once = h,
        f.off = h,
        f.removeListener = h,
        f.removeAllListeners = h,
        f.emit = h,
        f.prependListener = h,
        f.prependOnceListener = h,
        f.listeners = function(e) {
            return []
        },
        f.binding = function(e) {
            throw new Error("process.binding is not supported")
        },
        f.cwd = function() {
            return "/"
        },
        f.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        },
        f.umask = function() {
            return 0
        }
    },
    {}],
    8 : [function(e, t, r) { !
        function(e) {
            "use strict";
            function t(e) {
                return null !== e && "[object Array]" === Object.prototype.toString.call(e)
            }
            function r(e) {
                return null !== e && "[object Object]" === Object.prototype.toString.call(e)
            }
            function n(e, i) {
                if (e === i) return ! 0;
                if (Object.prototype.toString.call(e) !== Object.prototype.toString.call(i)) return ! 1;
                if (!0 === t(e)) {
                    if (e.length !== i.length) return ! 1;
                    for (var o = 0; o < e.length; o++) if (!1 === n(e[o], i[o])) return ! 1;
                    return ! 0
                }
                if (!0 === r(e)) {
                    var s = {};
                    for (var a in e) if (hasOwnProperty.call(e, a)) {
                        if (!1 === n(e[a], i[a])) return ! 1;
                        s[a] = !0
                    }
                    for (var u in i) if (hasOwnProperty.call(i, u) && !0 !== s[u]) return ! 1;
                    return ! 0
                }
                return ! 1
            }
            function i(e) {
                if ("" === e || !1 === e || null === e) return ! 0;
                if (t(e) && 0 === e.length) return ! 0;
                if (r(e)) {
                    for (var n in e) if (e.hasOwnProperty(n)) return ! 1;
                    return ! 0
                }
                return ! 1
            }
            function o(e) {
                for (var t = Object.keys(e), r = [], n = 0; n < t.length; n++) r.push(e[t[n]]);
                return r
            }
            function s(e) {
                return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || "_" === e
            }
            function a(e) {
                return e >= "0" && e <= "9" || "-" === e
            }
            function u(e) {
                return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9" || "_" === e
            }
            function c() {}
            function h() {}
            function l(e) {
                this.runtime = e
            }
            function p(e) {
                this._interpreter = e,
                this.functionTable = {
                    abs: {
                        _func: this._functionAbs,
                        _signature: [{
                            types: [g]
                        }]
                    },
                    avg: {
                        _func: this._functionAvg,
                        _signature: [{
                            types: [S]
                        }]
                    },
                    ceil: {
                        _func: this._functionCeil,
                        _signature: [{
                            types: [g]
                        }]
                    },
                    contains: {
                        _func: this._functionContains,
                        _signature: [{
                            types: [b, w]
                        },
                        {
                            types: [y]
                        }]
                    },
                    ends_with: {
                        _func: this._functionEndsWith,
                        _signature: [{
                            types: [b]
                        },
                        {
                            types: [b]
                        }]
                    },
                    floor: {
                        _func: this._functionFloor,
                        _signature: [{
                            types: [g]
                        }]
                    },
                    length: {
                        _func: this._functionLength,
                        _signature: [{
                            types: [b, w, E]
                        }]
                    },
                    map: {
                        _func: this._functionMap,
                        _signature: [{
                            types: [_]
                        },
                        {
                            types: [w]
                        }]
                    },
                    max: {
                        _func: this._functionMax,
                        _signature: [{
                            types: [S, C]
                        }]
                    },
                    merge: {
                        _func: this._functionMerge,
                        _signature: [{
                            types: [E],
                            variadic: !0
                        }]
                    },
                    max_by: {
                        _func: this._functionMaxBy,
                        _signature: [{
                            types: [w]
                        },
                        {
                            types: [_]
                        }]
                    },
                    sum: {
                        _func: this._functionSum,
                        _signature: [{
                            types: [S]
                        }]
                    },
                    starts_with: {
                        _func: this._functionStartsWith,
                        _signature: [{
                            types: [b]
                        },
                        {
                            types: [b]
                        }]
                    },
                    min: {
                        _func: this._functionMin,
                        _signature: [{
                            types: [S, C]
                        }]
                    },
                    min_by: {
                        _func: this._functionMinBy,
                        _signature: [{
                            types: [w]
                        },
                        {
                            types: [_]
                        }]
                    },
                    type: {
                        _func: this._functionType,
                        _signature: [{
                            types: [y]
                        }]
                    },
                    keys: {
                        _func: this._functionKeys,
                        _signature: [{
                            types: [E]
                        }]
                    },
                    values: {
                        _func: this._functionValues,
                        _signature: [{
                            types: [E]
                        }]
                    },
                    sort: {
                        _func: this._functionSort,
                        _signature: [{
                            types: [C, S]
                        }]
                    },
                    sort_by: {
                        _func: this._functionSortBy,
                        _signature: [{
                            types: [w]
                        },
                        {
                            types: [_]
                        }]
                    },
                    join: {
                        _func: this._functionJoin,
                        _signature: [{
                            types: [b]
                        },
                        {
                            types: [C]
                        }]
                    },
                    reverse: {
                        _func: this._functionReverse,
                        _signature: [{
                            types: [b, w]
                        }]
                    },
                    to_array: {
                        _func: this._functionToArray,
                        _signature: [{
                            types: [y]
                        }]
                    },
                    to_string: {
                        _func: this._functionToString,
                        _signature: [{
                            types: [y]
                        }]
                    },
                    to_number: {
                        _func: this._functionToNumber,
                        _signature: [{
                            types: [y]
                        }]
                    },
                    not_null: {
                        _func: this._functionNotNull,
                        _signature: [{
                            types: [y],
                            variadic: !0
                        }]
                    }
                }
            }
            function f(e) {
                return (new h).parse(e)
            }
            function d(e) {
                return (new c).tokenize(e)
            }
            function m(e, t) {
                var r = new h,
                n = new p,
                i = new l(n);
                n._interpreter = i;
                var o = r.parse(t);
                return i.search(o, e)
            }
            var v;
            v = "function" == typeof String.prototype.trimLeft ?
            function(e) {
                return e.trimLeft()
            }: function(e) {
                return e.match(/^\s*(.*)/)[1]
            };
            var g = 0,
            y = 1,
            b = 2,
            w = 3,
            E = 4,
            _ = 6,
            S = 8,
            C = 9,
            x = {
                ".": "Dot",
                "*": "Star",
                ",": "Comma",
                ":": "Colon",
                "{": "Lbrace",
                "}": "Rbrace",
                "]": "Rbracket",
                "(": "Lparen",
                ")": "Rparen",
                "@": "Current"
            },
            R = {
                "<": !0,
                ">": !0,
                "=": !0,
                "!": !0
            },
            A = {
                " ": !0,
                "\t": !0,
                "\n": !0
            };
            c.prototype = {
                tokenize: function(e) {
                    var t = [];
                    this._current = 0;
                    for (var r, n, i; this._current < e.length;) if (s(e[this._current])) r = this._current,
                    n = this._consumeUnquotedIdentifier(e),
                    t.push({
                        type: "UnquotedIdentifier",
                        value: n,
                        start: r
                    });
                    else if (void 0 !== x[e[this._current]]) t.push({
                        type: x[e[this._current]],
                        value: e[this._current],
                        start: this._current
                    }),
                    this._current++;
                    else if (a(e[this._current])) i = this._consumeNumber(e),
                    t.push(i);
                    else if ("[" === e[this._current]) i = this._consumeLBracket(e),
                    t.push(i);
                    else if ('"' === e[this._current]) r = this._current,
                    n = this._consumeQuotedIdentifier(e),
                    t.push({
                        type: "QuotedIdentifier",
                        value: n,
                        start: r
                    });
                    else if ("'" === e[this._current]) r = this._current,
                    n = this._consumeRawStringLiteral(e),
                    t.push({
                        type: "Literal",
                        value: n,
                        start: r
                    });
                    else if ("`" === e[this._current]) {
                        r = this._current;
                        var o = this._consumeLiteral(e);
                        t.push({
                            type: "Literal",
                            value: o,
                            start: r
                        })
                    } else if (void 0 !== R[e[this._current]]) t.push(this._consumeOperator(e));
                    else if (void 0 !== A[e[this._current]]) this._current++;
                    else if ("&" === e[this._current]) r = this._current,
                    this._current++,
                    "&" === e[this._current] ? (this._current++, t.push({
                        type: "And",
                        value: "&&",
                        start: r
                    })) : t.push({
                        type: "Expref",
                        value: "&",
                        start: r
                    });
                    else {
                        if ("|" !== e[this._current]) {
                            var u = new Error("Unknown character:" + e[this._current]);
                            throw u.name = "LexerError",
                            u
                        }
                        r = this._current,
                        this._current++,
                        "|" === e[this._current] ? (this._current++, t.push({
                            type: "Or",
                            value: "||",
                            start: r
                        })) : t.push({
                            type: "Pipe",
                            value: "|",
                            start: r
                        })
                    }
                    return t
                },
                _consumeUnquotedIdentifier: function(e) {
                    var t = this._current;
                    for (this._current++; this._current < e.length && u(e[this._current]);) this._current++;
                    return e.slice(t, this._current)
                },
                _consumeQuotedIdentifier: function(e) {
                    var t = this._current;
                    this._current++;
                    for (var r = e.length;
                    '"' !== e[this._current] && this._current < r;) {
                        var n = this._current;
                        "\\" !== e[n] || "\\" !== e[n + 1] && '"' !== e[n + 1] ? n++:n += 2,
                        this._current = n
                    }
                    return this._current++,
                    JSON.parse(e.slice(t, this._current))
                },
                _consumeRawStringLiteral: function(e) {
                    var t = this._current;
                    this._current++;
                    for (var r = e.length;
                    "'" !== e[this._current] && this._current < r;) {
                        var n = this._current;
                        "\\" !== e[n] || "\\" !== e[n + 1] && "'" !== e[n + 1] ? n++:n += 2,
                        this._current = n
                    }
                    return this._current++,
                    e.slice(t + 1, this._current - 1).replace("\\'", "'")
                },
                _consumeNumber: function(e) {
                    var t = this._current;
                    this._current++;
                    for (var r = e.length; a(e[this._current]) && this._current < r;) this._current++;
                    return {
                        type: "Number",
                        value: parseInt(e.slice(t, this._current)),
                        start: t
                    }
                },
                _consumeLBracket: function(e) {
                    var t = this._current;
                    return this._current++,
                    "?" === e[this._current] ? (this._current++, {
                        type: "Filter",
                        value: "[?",
                        start: t
                    }) : "]" === e[this._current] ? (this._current++, {
                        type: "Flatten",
                        value: "[]",
                        start: t
                    }) : {
                        type: "Lbracket",
                        value: "[",
                        start: t
                    }
                },
                _consumeOperator: function(e) {
                    var t = this._current,
                    r = e[t];
                    return this._current++,
                    "!" === r ? "=" === e[this._current] ? (this._current++, {
                        type: "NE",
                        value: "!=",
                        start: t
                    }) : {
                        type: "Not",
                        value: "!",
                        start: t
                    }: "<" === r ? "=" === e[this._current] ? (this._current++, {
                        type: "LTE",
                        value: "<=",
                        start: t
                    }) : {
                        type: "LT",
                        value: "<",
                        start: t
                    }: ">" === r ? "=" === e[this._current] ? (this._current++, {
                        type: "GTE",
                        value: ">=",
                        start: t
                    }) : {
                        type: "GT",
                        value: ">",
                        start: t
                    }: "=" === r && "=" === e[this._current] ? (this._current++, {
                        type: "EQ",
                        value: "==",
                        start: t
                    }) : void 0
                },
                _consumeLiteral: function(e) {
                    this._current++;
                    for (var t, r = this._current,
                    n = e.length;
                    "`" !== e[this._current] && this._current < n;) {
                        var i = this._current;
                        "\\" !== e[i] || "\\" !== e[i + 1] && "`" !== e[i + 1] ? i++:i += 2,
                        this._current = i
                    }
                    var o = v(e.slice(r, this._current));
                    return o = o.replace("\\`", "`"),
                    t = this._looksLikeJSON(o) ? JSON.parse(o) : JSON.parse('"' + o + '"'),
                    this._current++,
                    t
                },
                _looksLikeJSON: function(e) {
                    var t = '[{"',
                    r = ["true", "false", "null"],
                    n = "-0123456789";
                    if ("" === e) return ! 1;
                    if (t.indexOf(e[0]) >= 0) return ! 0;
                    if (r.indexOf(e) >= 0) return ! 0;
                    if (! (n.indexOf(e[0]) >= 0)) return ! 1;
                    try {
                        return JSON.parse(e),
                        !0
                    } catch(e) {
                        return ! 1
                    }
                }
            };
            var T = {};
            T.EOF = 0,
            T.UnquotedIdentifier = 0,
            T.QuotedIdentifier = 0,
            T.Rbracket = 0,
            T.Rparen = 0,
            T.Comma = 0,
            T.Rbrace = 0,
            T.Number = 0,
            T.Current = 0,
            T.Expref = 0,
            T.Pipe = 1,
            T.Or = 2,
            T.And = 3,
            T.EQ = 5,
            T.GT = 5,
            T.LT = 5,
            T.GTE = 5,
            T.LTE = 5,
            T.NE = 5,
            T.Flatten = 9,
            T.Star = 20,
            T.Filter = 21,
            T.Dot = 40,
            T.Not = 45,
            T.Lbrace = 50,
            T.Lbracket = 55,
            T.Lparen = 60,
            h.prototype = {
                parse: function(e) {
                    this._loadTokens(e),
                    this.index = 0;
                    var t = this.expression(0);
                    if ("EOF" !== this._lookahead(0)) {
                        var r = this._lookaheadToken(0),
                        n = new Error("Unexpected token type: " + r.type + ", value: " + r.value);
                        throw n.name = "ParserError",
                        n
                    }
                    return t
                },
                _loadTokens: function(e) {
                    var t = new c,
                    r = t.tokenize(e);
                    r.push({
                        type: "EOF",
                        value: "",
                        start: e.length
                    }),
                    this.tokens = r
                },
                expression: function(e) {
                    var t = this._lookaheadToken(0);
                    this._advance();
                    for (var r = this.nud(t), n = this._lookahead(0); e < T[n];) this._advance(),
                    r = this.led(n, r),
                    n = this._lookahead(0);
                    return r
                },
                _lookahead: function(e) {
                    return this.tokens[this.index + e].type
                },
                _lookaheadToken: function(e) {
                    return this.tokens[this.index + e]
                },
                _advance: function() {
                    this.index++
                },
                nud: function(e) {
                    var t, r, n;
                    switch (e.type) {
                    case "Literal":
                        return {
                            type:
                            "Literal",
                            value: e.value
                        };
                    case "UnquotedIdentifier":
                        return {
                            type:
                            "Field",
                            name: e.value
                        };
                    case "QuotedIdentifier":
                        var i = {
                            type: "Field",
                            name: e.value
                        };
                        if ("Lparen" === this._lookahead(0)) throw new Error("Quoted identifier not allowed for function names.");
                        return i;
                    case "Not":
                        return r = this.expression(T.Not),
                        {
                            type: "NotExpression",
                            children: [r]
                        };
                    case "Star":
                        return t = {
                            type: "Identity"
                        },
                        r = null,
                        r = "Rbracket" === this._lookahead(0) ? {
                            type: "Identity"
                        }: this._parseProjectionRHS(T.Star),
                        {
                            type: "ValueProjection",
                            children: [t, r]
                        };
                    case "Filter":
                        return this.led(e.type, {
                            type: "Identity"
                        });
                    case "Lbrace":
                        return this._parseMultiselectHash();
                    case "Flatten":
                        return t = {
                            type: "Flatten",
                            children: [{
                                type: "Identity"
                            }]
                        },
                        r = this._parseProjectionRHS(T.Flatten),
                        {
                            type: "Projection",
                            children: [t, r]
                        };
                    case "Lbracket":
                        return "Number" === this._lookahead(0) || "Colon" === this._lookahead(0) ? (r = this._parseIndexExpression(), this._projectIfSlice({
                            type: "Identity"
                        },
                        r)) : "Star" === this._lookahead(0) && "Rbracket" === this._lookahead(1) ? (this._advance(), this._advance(), r = this._parseProjectionRHS(T.Star), {
                            type: "Projection",
                            children: [{
                                type: "Identity"
                            },
                            r]
                        }) : this._parseMultiselectList();
                    case "Current":
                        return {
                            type:
                            "Current"
                        };
                    case "Expref":
                        return n = this.expression(T.Expref),
                        {
                            type: "ExpressionReference",
                            children: [n]
                        };
                    case "Lparen":
                        for (var o = [];
                        "Rparen" !== this._lookahead(0);)"Current" === this._lookahead(0) ? (n = {
                            type: "Current"
                        },
                        this._advance()) : n = this.expression(0),
                        o.push(n);
                        return this._match("Rparen"),
                        o[0];
                    default:
                        this._errorToken(e)
                    }
                },
                led: function(e, t) {
                    var r;
                    switch (e) {
                    case "Dot":
                        var n = T.Dot;
                        return "Star" !== this._lookahead(0) ? (r = this._parseDotRHS(n), {
                            type: "Subexpression",
                            children: [t, r]
                        }) : (this._advance(), r = this._parseProjectionRHS(n), {
                            type: "ValueProjection",
                            children: [t, r]
                        });
                    case "Pipe":
                        return r = this.expression(T.Pipe),
                        {
                            type: "Pipe",
                            children: [t, r]
                        };
                    case "Or":
                        return r = this.expression(T.Or),
                        {
                            type: "OrExpression",
                            children: [t, r]
                        };
                    case "And":
                        return r = this.expression(T.And),
                        {
                            type: "AndExpression",
                            children: [t, r]
                        };
                    case "Lparen":
                        for (var i, o = t.name,
                        s = [];
                        "Rparen" !== this._lookahead(0);)"Current" === this._lookahead(0) ? (i = {
                            type: "Current"
                        },
                        this._advance()) : i = this.expression(0),
                        "Comma" === this._lookahead(0) && this._match("Comma"),
                        s.push(i);
                        return this._match("Rparen"),
                        {
                            type: "Function",
                            name: o,
                            children: s
                        };
                    case "Filter":
                        var a = this.expression(0);
                        return this._match("Rbracket"),
                        r = "Flatten" === this._lookahead(0) ? {
                            type: "Identity"
                        }: this._parseProjectionRHS(T.Filter),
                        {
                            type: "FilterProjection",
                            children: [t, r, a]
                        };
                    case "Flatten":
                        return {
                            type:
                            "Projection",
                            children: [{
                                type: "Flatten",
                                children: [t]
                            },
                            this._parseProjectionRHS(T.Flatten)]
                        };
                    case "EQ":
                    case "NE":
                    case "GT":
                    case "GTE":
                    case "LT":
                    case "LTE":
                        return this._parseComparator(t, e);
                    case "Lbracket":
                        var u = this._lookaheadToken(0);
                        return "Number" === u.type || "Colon" === u.type ? (r = this._parseIndexExpression(), this._projectIfSlice(t, r)) : (this._match("Star"), this._match("Rbracket"), r = this._parseProjectionRHS(T.Star), {
                            type: "Projection",
                            children: [t, r]
                        });
                    default:
                        this._errorToken(this._lookaheadToken(0))
                    }
                },
                _match: function(e) {
                    if (this._lookahead(0) !== e) {
                        var t = this._lookaheadToken(0),
                        r = new Error("Expected " + e + ", got: " + t.type);
                        throw r.name = "ParserError",
                        r
                    }
                    this._advance()
                },
                _errorToken: function(e) {
                    var t = new Error("Invalid token (" + e.type + '): "' + e.value + '"');
                    throw t.name = "ParserError",
                    t
                },
                _parseIndexExpression: function() {
                    if ("Colon" === this._lookahead(0) || "Colon" === this._lookahead(1)) return this._parseSliceExpression();
                    var e = {
                        type: "Index",
                        value: this._lookaheadToken(0).value
                    };
                    return this._advance(),
                    this._match("Rbracket"),
                    e
                },
                _projectIfSlice: function(e, t) {
                    var r = {
                        type: "IndexExpression",
                        children: [e, t]
                    };
                    return "Slice" === t.type ? {
                        type: "Projection",
                        children: [r, this._parseProjectionRHS(T.Star)]
                    }: r
                },
                _parseSliceExpression: function() {
                    for (var e = [null, null, null], t = 0, r = this._lookahead(0);
                    "Rbracket" !== r && t < 3;) {
                        if ("Colon" === r) t++,
                        this._advance();
                        else {
                            if ("Number" !== r) {
                                var n = this._lookahead(0),
                                i = new Error("Syntax error, unexpected token: " + n.value + "(" + n.type + ")");
                                throw i.name = "Parsererror",
                                i
                            }
                            e[t] = this._lookaheadToken(0).value,
                            this._advance()
                        }
                        r = this._lookahead(0)
                    }
                    return this._match("Rbracket"),
                    {
                        type: "Slice",
                        children: e
                    }
                },
                _parseComparator: function(e, t) {
                    return {
                        type: "Comparator",
                        name: t,
                        children: [e, this.expression(T[t])]
                    }
                },
                _parseDotRHS: function(e) {
                    var t = this._lookahead(0);
                    return ["UnquotedIdentifier", "QuotedIdentifier", "Star"].indexOf(t) >= 0 ? this.expression(e) : "Lbracket" === t ? (this._match("Lbracket"), this._parseMultiselectList()) : "Lbrace" === t ? (this._match("Lbrace"), this._parseMultiselectHash()) : void 0
                },
                _parseProjectionRHS: function(e) {
                    var t;
                    if (T[this._lookahead(0)] < 10) t = {
                        type: "Identity"
                    };
                    else if ("Lbracket" === this._lookahead(0)) t = this.expression(e);
                    else if ("Filter" === this._lookahead(0)) t = this.expression(e);
                    else {
                        if ("Dot" !== this._lookahead(0)) {
                            var r = this._lookaheadToken(0),
                            n = new Error("Sytanx error, unexpected token: " + r.value + "(" + r.type + ")");
                            throw n.name = "ParserError",
                            n
                        }
                        this._match("Dot"),
                        t = this._parseDotRHS(e)
                    }
                    return t
                },
                _parseMultiselectList: function() {
                    for (var e = [];
                    "Rbracket" !== this._lookahead(0);) {
                        var t = this.expression(0);
                        if (e.push(t), "Comma" === this._lookahead(0) && (this._match("Comma"), "Rbracket" === this._lookahead(0))) throw new Error("Unexpected token Rbracket")
                    }
                    return this._match("Rbracket"),
                    {
                        type: "MultiSelectList",
                        children: e
                    }
                },
                _parseMultiselectHash: function() {
                    for (var e, t, r, n, i = [], o = ["UnquotedIdentifier", "QuotedIdentifier"];;) {
                        if (e = this._lookaheadToken(0), o.indexOf(e.type) < 0) throw new Error("Expecting an identifier token, got: " + e.type);
                        if (t = e.value, this._advance(), this._match("Colon"), r = this.expression(0), n = {
                            type: "KeyValuePair",
                            name: t,
                            value: r
                        },
                        i.push(n), "Comma" === this._lookahead(0)) this._match("Comma");
                        else if ("Rbrace" === this._lookahead(0)) {
                            this._match("Rbrace");
                            break
                        }
                    }
                    return {
                        type: "MultiSelectHash",
                        children: i
                    }
                }
            },
            l.prototype = {
                search: function(e, t) {
                    return this.visit(e, t)
                },
                visit: function(e, s) {
                    var a, u, c, h, l, p, f, d, m;
                    switch (e.type) {
                    case "Field":
                        return null === s ? null: r(s) ? (p = s[e.name], void 0 === p ? null: p) : null;
                    case "Subexpression":
                        for (c = this.visit(e.children[0], s), m = 1; m < e.children.length; m++) if (null === (c = this.visit(e.children[1], c))) return null;
                        return c;
                    case "IndexExpression":
                        return f = this.visit(e.children[0], s),
                        this.visit(e.children[1], f);
                    case "Index":
                        if (!t(s)) return null;
                        var v = e.value;
                        return v < 0 && (v = s.length + v),
                        c = s[v],
                        void 0 === c && (c = null),
                        c;
                    case "Slice":
                        if (!t(s)) return null;
                        var g = e.children.slice(0),
                        y = this.computeSliceParams(s.length, g),
                        b = y[0],
                        w = y[1],
                        E = y[2];
                        if (c = [], E > 0) for (m = b; m < w; m += E) c.push(s[m]);
                        else for (m = b; m > w; m += E) c.push(s[m]);
                        return c;
                    case "Projection":
                        var _ = this.visit(e.children[0], s);
                        if (!t(_)) return null;
                        for (d = [], m = 0; m < _.length; m++) null !== (u = this.visit(e.children[1], _[m])) && d.push(u);
                        return d;
                    case "ValueProjection":
                        if (_ = this.visit(e.children[0], s), !r(_)) return null;
                        d = [];
                        var S = o(_);
                        for (m = 0; m < S.length; m++) null !== (u = this.visit(e.children[1], S[m])) && d.push(u);
                        return d;
                    case "FilterProjection":
                        if (_ = this.visit(e.children[0], s), !t(_)) return null;
                        var C = [],
                        x = [];
                        for (m = 0; m < _.length; m++) a = this.visit(e.children[2], _[m]),
                        i(a) || C.push(_[m]);
                        for (var R = 0; R < C.length; R++) null !== (u = this.visit(e.children[1], C[R])) && x.push(u);
                        return x;
                    case "Comparator":
                        switch (h = this.visit(e.children[0], s), l = this.visit(e.children[1], s), e.name) {
                        case "EQ":
                            c = n(h, l);
                            break;
                        case "NE":
                            c = !n(h, l);
                            break;
                        case "GT":
                            c = h > l;
                            break;
                        case "GTE":
                            c = h >= l;
                            break;
                        case "LT":
                            c = h < l;
                            break;
                        case "LTE":
                            c = h <= l;
                            break;
                        default:
                            throw new Error("Unknown comparator: " + e.name)
                        }
                        return c;
                    case "Flatten":
                        var A = this.visit(e.children[0], s);
                        if (!t(A)) return null;
                        var T = [];
                        for (m = 0; m < A.length; m++) u = A[m],
                        t(u) ? T.push.apply(T, u) : T.push(u);
                        return T;
                    case "Identity":
                        return s;
                    case "MultiSelectList":
                        if (null === s) return null;
                        for (d = [], m = 0; m < e.children.length; m++) d.push(this.visit(e.children[m], s));
                        return d;
                    case "MultiSelectHash":
                        if (null === s) return null;
                        d = {};
                        var k;
                        for (m = 0; m < e.children.length; m++) k = e.children[m],
                        d[k.name] = this.visit(k.value, s);
                        return d;
                    case "OrExpression":
                        return a = this.visit(e.children[0], s),
                        i(a) && (a = this.visit(e.children[1], s)),
                        a;
                    case "AndExpression":
                        return h = this.visit(e.children[0], s),
                        !0 === i(h) ? h: this.visit(e.children[1], s);
                    case "NotExpression":
                        return h = this.visit(e.children[0], s),
                        i(h);
                    case "Literal":
                        return e.value;
                    case "Pipe":
                        return f = this.visit(e.children[0], s),
                        this.visit(e.children[1], f);
                    case "Current":
                        return s;
                    case "Function":
                        var I = [];
                        for (m = 0; m < e.children.length; m++) I.push(this.visit(e.children[m], s));
                        return this.runtime.callFunction(e.name, I);
                    case "ExpressionReference":
                        var L = e.children[0];
                        return L.jmespathType = "Expref",
                        L;
                    default:
                        throw new Error("Unknown node type: " + e.type)
                    }
                },
                computeSliceParams: function(e, t) {
                    var r = t[0],
                    n = t[1],
                    i = t[2],
                    o = [null, null, null];
                    if (null === i) i = 1;
                    else if (0 === i) {
                        var s = new Error("Invalid slice, step cannot be 0");
                        throw s.name = "RuntimeError",
                        s
                    }
                    var a = i < 0;
                    return r = null === r ? a ? e - 1 : 0 : this.capSliceRange(e, r, i),
                    n = null === n ? a ? -1 : e: this.capSliceRange(e, n, i),
                    o[0] = r,
                    o[1] = n,
                    o[2] = i,
                    o
                },
                capSliceRange: function(e, t, r) {
                    return t < 0 ? (t += e) < 0 && (t = r < 0 ? -1 : 0) : t >= e && (t = r < 0 ? e - 1 : e),
                    t
                }
            },
            p.prototype = {
                callFunction: function(e, t) {
                    var r = this.functionTable[e];
                    if (void 0 === r) throw new Error("Unknown function: " + e + "()");
                    return this._validateArgs(e, t, r._signature),
                    r._func.call(this, t)
                },
                _validateArgs: function(e, t, r) {
                    var n;
                    if (r[r.length - 1].variadic) {
                        if (t.length < r.length) throw n = 1 === r.length ? " argument": " arguments",
                        new Error("ArgumentError: " + e + "() takes at least" + r.length + n + " but received " + t.length)
                    } else if (t.length !== r.length) throw n = 1 === r.length ? " argument": " arguments",
                    new Error("ArgumentError: " + e + "() takes " + r.length + n + " but received " + t.length);
                    for (var i, o, s, a = 0; a < r.length; a++) {
                        s = !1,
                        i = r[a].types,
                        o = this._getTypeName(t[a]);
                        for (var u = 0; u < i.length; u++) if (this._typeMatches(o, i[u], t[a])) {
                            s = !0;
                            break
                        }
                        if (!s) throw new Error("TypeError: " + e + "() expected argument " + (a + 1) + " to be type " + i + " but received type " + o + " instead.")
                    }
                },
                _typeMatches: function(e, t, r) {
                    if (t === y) return ! 0;
                    if (t !== C && t !== S && t !== w) return e === t;
                    if (t === w) return e === w;
                    if (e === w) {
                        var n;
                        t === S ? n = g: t === C && (n = b);
                        for (var i = 0; i < r.length; i++) if (!this._typeMatches(this._getTypeName(r[i]), n, r[i])) return ! 1;
                        return ! 0
                    }
                },
                _getTypeName: function(e) {
                    switch (Object.prototype.toString.call(e)) {
                    case "[object String]":
                        return b;
                    case "[object Number]":
                        return g;
                    case "[object Array]":
                        return w;
                    case "[object Boolean]":
                        return 5;
                    case "[object Null]":
                        return 7;
                    case "[object Object]":
                        return "Expref" === e.jmespathType ? _: E
                    }
                },
                _functionStartsWith: function(e) {
                    return 0 === e[0].lastIndexOf(e[1])
                },
                _functionEndsWith: function(e) {
                    var t = e[0],
                    r = e[1];
                    return - 1 !== t.indexOf(r, t.length - r.length)
                },
                _functionReverse: function(e) {
                    if (this._getTypeName(e[0]) === b) {
                        for (var t = e[0], r = "", n = t.length - 1; n >= 0; n--) r += t[n];
                        return r
                    }
                    var i = e[0].slice(0);
                    return i.reverse(),
                    i
                },
                _functionAbs: function(e) {
                    return Math.abs(e[0])
                },
                _functionCeil: function(e) {
                    return Math.ceil(e[0])
                },
                _functionAvg: function(e) {
                    for (var t = 0,
                    r = e[0], n = 0; n < r.length; n++) t += r[n];
                    return t / r.length
                },
                _functionContains: function(e) {
                    return e[0].indexOf(e[1]) >= 0
                },
                _functionFloor: function(e) {
                    return Math.floor(e[0])
                },
                _functionLength: function(e) {
                    return r(e[0]) ? Object.keys(e[0]).length: e[0].length
                },
                _functionMap: function(e) {
                    for (var t = [], r = this._interpreter, n = e[0], i = e[1], o = 0; o < i.length; o++) t.push(r.visit(n, i[o]));
                    return t
                },
                _functionMerge: function(e) {
                    for (var t = {},
                    r = 0; r < e.length; r++) {
                        var n = e[r];
                        for (var i in n) t[i] = n[i]
                    }
                    return t
                },
                _functionMax: function(e) {
                    if (e[0].length > 0) {
                        if (this._getTypeName(e[0][0]) === g) return Math.max.apply(Math, e[0]);
                        for (var t = e[0], r = t[0], n = 1; n < t.length; n++) r.localeCompare(t[n]) < 0 && (r = t[n]);
                        return r
                    }
                    return null
                },
                _functionMin: function(e) {
                    if (e[0].length > 0) {
                        if (this._getTypeName(e[0][0]) === g) return Math.min.apply(Math, e[0]);
                        for (var t = e[0], r = t[0], n = 1; n < t.length; n++) t[n].localeCompare(r) < 0 && (r = t[n]);
                        return r
                    }
                    return null
                },
                _functionSum: function(e) {
                    for (var t = 0,
                    r = e[0], n = 0; n < r.length; n++) t += r[n];
                    return t
                },
                _functionType: function(e) {
                    switch (this._getTypeName(e[0])) {
                    case g:
                        return "number";
                    case b:
                        return "string";
                    case w:
                        return "array";
                    case E:
                        return "object";
                    case 5:
                        return "boolean";
                    case _:
                        return "expref";
                    case 7:
                        return "null"
                    }
                },
                _functionKeys: function(e) {
                    return Object.keys(e[0])
                },
                _functionValues: function(e) {
                    for (var t = e[0], r = Object.keys(t), n = [], i = 0; i < r.length; i++) n.push(t[r[i]]);
                    return n
                },
                _functionJoin: function(e) {
                    var t = e[0];
                    return e[1].join(t)
                },
                _functionToArray: function(e) {
                    return this._getTypeName(e[0]) === w ? e[0] : [e[0]]
                },
                _functionToString: function(e) {
                    return this._getTypeName(e[0]) === b ? e[0] : JSON.stringify(e[0])
                },
                _functionToNumber: function(e) {
                    var t, r = this._getTypeName(e[0]);
                    return r === g ? e[0] : r !== b || (t = +e[0], isNaN(t)) ? null: t
                },
                _functionNotNull: function(e) {
                    for (var t = 0; t < e.length; t++) if (7 !== this._getTypeName(e[t])) return e[t];
                    return null
                },
                _functionSort: function(e) {
                    var t = e[0].slice(0);
                    return t.sort(),
                    t
                },
                _functionSortBy: function(e) {
                    var t = e[0].slice(0);
                    if (0 === t.length) return t;
                    var r = this._interpreter,
                    n = e[1],
                    i = this._getTypeName(r.visit(n, t[0]));
                    if ([g, b].indexOf(i) < 0) throw new Error("TypeError");
                    for (var o = this,
                    s = [], a = 0; a < t.length; a++) s.push([a, t[a]]);
                    s.sort(function(e, t) {
                        var s = r.visit(n, e[1]),
                        a = r.visit(n, t[1]);
                        if (o._getTypeName(s) !== i) throw new Error("TypeError: expected " + i + ", received " + o._getTypeName(s));
                        if (o._getTypeName(a) !== i) throw new Error("TypeError: expected " + i + ", received " + o._getTypeName(a));
                        return s > a ? 1 : s < a ? -1 : e[0] - t[0]
                    });
                    for (var u = 0; u < s.length; u++) t[u] = s[u][1];
                    return t
                },
                _functionMaxBy: function(e) {
                    for (var t, r, n = e[1], i = e[0], o = this.createKeyFunction(n, [g, b]), s = -1 / 0, a = 0; a < i.length; a++)(r = o(i[a])) > s && (s = r, t = i[a]);
                    return t
                },
                _functionMinBy: function(e) {
                    for (var t, r, n = e[1], i = e[0], o = this.createKeyFunction(n, [g, b]), s = 1 / 0, a = 0; a < i.length; a++)(r = o(i[a])) < s && (s = r, t = i[a]);
                    return t
                },
                createKeyFunction: function(e, t) {
                    var r = this,
                    n = this._interpreter;
                    return function(i) {
                        var o = n.visit(e, i);
                        if (t.indexOf(r._getTypeName(o)) < 0) {
                            var s = "TypeError: expected one of " + t + ", received " + r._getTypeName(o);
                            throw new Error(s)
                        }
                        return o
                    }
                }
            },
            e.tokenize = d,
            e.compile = f,
            e.search = m,
            e.strictDeepEqual = n
        } (void 0 === r ? this.jmespath = {}: r)
    },
    {}],
    6 : [function(e, t, r) {
        "function" == typeof Object.create ? t.exports = function(e, t) {
            e.super_ = t,
            e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        }: t.exports = function(e, t) {
            e.super_ = t;
            var r = function() {};
            r.prototype = t.prototype,
            e.prototype = new r,
            e.prototype.constructor = e
        }
    },
    {}],
    2 : [function(e, t, r) {},
    {}]
},
{},
[]),
_xamzrequire = function e(t, r, n) {
    function i(s, a) {
        if (!r[s]) {
            if (!t[s]) {
                var u = "function" == typeof _xamzrequire && _xamzrequire;
                if (!a && u) return u(s, !0);
                if (o) return o(s, !0);
                var c = new Error("Cannot find module '" + s + "'");
                throw c.code = "MODULE_NOT_FOUND",
                c
            }
            var h = r[s] = {
                exports: {}
            };
            t[s][0].call(h.exports,
            function(e) {
                var r = t[s][1][e];
                return i(r || e)
            },
            h, h.exports, e, t, r, n)
        }
        return r[s].exports
    }
    for (var o = "function" == typeof _xamzrequire && _xamzrequire,
    s = 0; s < n.length; s++) i(n[s]);
    return i
} ({
    28 : [function(e, t, r) {
        e("./browser_loader");
        var n = e("./core");
        "undefined" != typeof window && (window.AWS = n),
        void 0 !== t && (t.exports = n),
        "undefined" != typeof self && (self.AWS = n)
    },
    {
        "./browser_loader": 35,
        "./core": 38
    }],
    35 : [function(e, t, r) { (function(r) {
            var n = e("./util");
            n.crypto.lib = e("./browserCryptoLib"),
            n.Buffer = e("buffer/").Buffer,
            n.url = e("url/"),
            n.querystring = e("querystring/"),
            n.realClock = e("./realclock/browserClock"),
            n.environment = "js",
            n.createEventStream = e("./event-stream/buffered-create-event-stream").createEventStream,
            n.isBrowser = function() {
                return ! 0
            },
            n.isNode = function() {
                return ! 1
            };
            var i = e("./core");
            t.exports = i,
            e("./credentials"),
            e("./credentials/credential_provider_chain"),
            e("./credentials/temporary_credentials"),
            e("./credentials/chainable_temporary_credentials"),
            e("./credentials/web_identity_credentials"),
            e("./credentials/cognito_identity_credentials"),
            e("./credentials/saml_credentials"),
            i.XML.Parser = e("./xml/browser_parser"),
            e("./http/xhr"),
            void 0 === r && (r = {
                browser: !0
            })
        }).call(this, e("_process"))
    },
    {
        "./browserCryptoLib": 29,
        "./core": 38,
        "./credentials": 39,
        "./credentials/chainable_temporary_credentials": 40,
        "./credentials/cognito_identity_credentials": 41,
        "./credentials/credential_provider_chain": 42,
        "./credentials/saml_credentials": 43,
        "./credentials/temporary_credentials": 44,
        "./credentials/web_identity_credentials": 45,
        "./event-stream/buffered-create-event-stream": 53,
        "./http/xhr": 62,
        "./realclock/browserClock": 81,
        "./util": 117,
        "./xml/browser_parser": 118,
        _process: 9,
        "buffer/": 3,
        "querystring/": 16,
        "url/": 18
    }],
    118 : [function(e, t, r) {
        function n() {}
        function i(e, t) {
            for (var r = e.getElementsByTagName(t), n = 0, i = r.length; n < i; n++) if (r[n].parentNode === e) return r[n]
        }
        function o(e, t) {
            switch (t || (t = {}), t.type) {
            case "structure":
                return s(e, t);
            case "map":
                return a(e, t);
            case "list":
                return u(e, t);
            case void 0:
            case null:
                return h(e);
            default:
                return c(e, t)
            }
        }
        function s(e, t) {
            var r = {};
            return null === e ? r: (l.each(t.members,
            function(t, n) {
                if (n.isXmlAttribute) {
                    if (Object.prototype.hasOwnProperty.call(e.attributes, n.name)) {
                        var s = e.attributes[n.name].value;
                        r[t] = o({
                            textContent: s
                        },
                        n)
                    }
                } else {
                    var a = n.flattened ? e: i(e, n.name);
                    a ? r[t] = o(a, n) : n.flattened || "list" !== n.type || (r[t] = n.defaultValue)
                }
            }), r)
        }
        function a(e, t) {
            for (var r = {},
            n = t.key.name || "key",
            s = t.value.name || "value",
            a = t.flattened ? t.name: "entry", u = e.firstElementChild; u;) {
                if (u.nodeName === a) {
                    var c = i(u, n).textContent,
                    h = i(u, s);
                    r[c] = o(h, t.value)
                }
                u = u.nextElementSibling
            }
            return r
        }
        function u(e, t) {
            for (var r = [], n = t.flattened ? t.name: t.member.name || "member", i = e.firstElementChild; i;) i.nodeName === n && r.push(o(i, t.member)),
            i = i.nextElementSibling;
            return r
        }
        function c(e, t) {
            if (e.getAttribute) {
                var r = e.getAttribute("encoding");
                "base64" === r && (t = new p.create({
                    type: r
                }))
            }
            var n = e.textContent;
            return "" === n && (n = null),
            "function" == typeof t.toType ? t.toType(n) : n
        }
        function h(e) {
            if (void 0 === e || null === e) return "";
            if (!e.firstElementChild) return null === e.parentNode.parentNode ? {}: 0 === e.childNodes.length ? "": e.textContent;
            for (var t = {
                type: "structure",
                members: {}
            },
            r = e.firstElementChild; r;) {
                var n = r.nodeName;
                Object.prototype.hasOwnProperty.call(t.members, n) ? t.members[n].type = "list": t.members[n] = {
                    name: n
                },
                r = r.nextElementSibling
            }
            return s(e, t)
        }
        var l = e("../util"),
        p = e("../model/shape");
        n.prototype.parse = function(e, t) {
            if ("" === e.replace(/^\s+/, "")) return {};
            var r, n;
            try {
                if (window.DOMParser) {
                    try {
                        r = (new DOMParser).parseFromString(e, "text/xml")
                    } catch(e) {
                        throw l.error(new Error("Parse error in document"), {
                            originalError: e,
                            code: "XMLParserError",
                            retryable: !0
                        })
                    }
                    if (null === r.documentElement) throw l.error(new Error("Cannot parse empty document."), {
                        code: "XMLParserError",
                        retryable: !0
                    });
                    var s = r.getElementsByTagName("parsererror")[0];
                    if (s && (s.parentNode === r || "body" === s.parentNode.nodeName || s.parentNode.parentNode === r || "body" === s.parentNode.parentNode.nodeName)) {
                        var a = s.getElementsByTagName("div")[0] || s;
                        throw l.error(new Error(a.textContent || "Parser error in document"), {
                            code: "XMLParserError",
                            retryable: !0
                        })
                    }
                } else {
                    if (!window.ActiveXObject) throw new Error("Cannot load XML parser");
                    if (r = new window.ActiveXObject("Microsoft.XMLDOM"), r.async = !1, !r.loadXML(e)) throw l.error(new Error("Parse error in document"), {
                        code: "XMLParserError",
                        retryable: !0
                    })
                }
            } catch(e) {
                n = e
            }
            if (r && r.documentElement && !n) {
                var u = o(r.documentElement, t),
                c = i(r.documentElement, "ResponseMetadata");
                return c && (u.ResponseMetadata = o(c, {})),
                u
            }
            if (n) throw l.error(n || new Error, {
                code: "XMLParserError",
                retryable: !0
            });
            return {}
        },
        t.exports = n
    },
    {
        "../model/shape": 70,
        "../util": 117
    }],
    81 : [function(e, t, r) {
        t.exports = {
            now: function() {
                return "undefined" != typeof performance && "function" == typeof performance.now ? performance.now() : Date.now()
            }
        }
    },
    {}],
    62 : [function(e, t, r) {
        var n = e("../core"),
        i = e("events").EventEmitter;
        e("../http"),
        n.XHRClient = n.util.inherit({
            handleRequest: function(e, t, r, o) {
                var s = this,
                a = e.endpoint,
                u = new i,
                c = a.protocol + "//" + a.hostname;
                80 !== a.port && 443 !== a.port && (c += ":" + a.port),
                c += e.path;
                var h = new XMLHttpRequest,
                l = !1;
                e.stream = h,
                h.addEventListener("readystatechange",
                function() {
                    try {
                        if (0 === h.status) return
                    } catch(e) {
                        return
                    }
                    this.readyState >= this.HEADERS_RECEIVED && !l && (u.statusCode = h.status, u.headers = s.parseHeaders(h.getAllResponseHeaders()), u.emit("headers", u.statusCode, u.headers, h.statusText), l = !0),
                    this.readyState === this.DONE && s.finishRequest(h, u)
                },
                !1),
                h.upload.addEventListener("progress",
                function(e) {
                    u.emit("sendProgress", e)
                }),
                h.addEventListener("progress",
                function(e) {
                    u.emit("receiveProgress", e)
                },
                !1),
                h.addEventListener("timeout",
                function() {
                    o(n.util.error(new Error("Timeout"), {
                        code: "TimeoutError"
                    }))
                },
                !1),
                h.addEventListener("error",
                function() {
                    o(n.util.error(new Error("Network Failure"), {
                        code: "NetworkingError"
                    }))
                },
                !1),
                h.addEventListener("abort",
                function() {
                    o(n.util.error(new Error("Request aborted"), {
                        code: "RequestAbortedError"
                    }))
                },
                !1),
                r(u),
                h.open(e.method, c, !1 !== t.xhrAsync),
                n.util.each(e.headers,
                function(e, t) {
                    "Content-Length" !== e && "User-Agent" !== e && "Host" !== e && h.setRequestHeader(e, t)
                }),
                t.timeout && !1 !== t.xhrAsync && (h.timeout = t.timeout),
                t.xhrWithCredentials && (h.withCredentials = !0);
                try {
                    h.responseType = "arraybuffer"
                } catch(e) {}
                try {
                    e.body ? h.send(e.body) : h.send()
                } catch(t) {
                    if (!e.body || "object" != typeof e.body.buffer) throw t;
                    h.send(e.body.buffer)
                }
                return u
            },
            parseHeaders: function(e) {
                var t = {};
                return n.util.arrayEach(e.split(/\r?\n/),
                function(e) {
                    var r = e.split(":", 1)[0],
                    n = e.substring(r.length + 2);
                    r.length > 0 && (t[r.toLowerCase()] = n)
                }),
                t
            },
            finishRequest: function(e, t) {
                var r;
                if ("arraybuffer" === e.responseType && e.response) {
                    var i = e.response;
                    r = new n.util.Buffer(i.byteLength);
                    for (var o = new Uint8Array(i), s = 0; s < r.length; ++s) r[s] = o[s]
                }
                try {
                    r || "string" != typeof e.responseText || (r = new n.util.Buffer(e.responseText))
                } catch(e) {}
                r && t.emit("data", r),
                t.emit("end")
            }
        }),
        n.HttpClient.prototype = n.XHRClient.prototype,
        n.HttpClient.streamsApiVersion = 1
    },
    {
        "../core": 38,
        "../http": 61,
        events: 4
    }],
    53 : [function(e, t, r) {
        function n(e, t, r) {
            for (var n = i(e), s = [], a = 0; a < n.length; a++) s.push(o(t, n[a], r));
            return s
        }
        var i = e("../event-stream/event-message-chunker").eventMessageChunker,
        o = e("./parse-event").parseEvent;
        t.exports = {
            createEventStream: n
        }
    },
    {
        "../event-stream/event-message-chunker": 54,
        "./parse-event": 56
    }],
    56 : [function(e, t, r) {
        function n(e, t, r) {
            var n = o(t),
            s = n.headers[":message-type"];
            if (s) {
                if ("error" === s.value) throw i(n);
                if ("event" !== s.value) return
            }
            var a = n.headers[":event-type"],
            u = r.members[a.value];
            if (u) {
                var c = {},
                h = u.eventPayloadMemberName;
                if (h) {
                    var l = u.members[h];
                    "binary" === l.type ? c[h] = n.body: c[h] = e.parse(n.body.toString(), l)
                }
                for (var p = u.eventHeaderMemberNames,
                f = 0; f < p.length; f++) {
                    var d = p[f];
                    n.headers[d] && (c[d] = u.members[d].toType(n.headers[d].value))
                }
                var m = {};
                return m[a.value] = c,
                m
            }
        }
        function i(e) {
            var t = e.headers[":error-code"],
            r = e.headers[":error-message"],
            n = new Error(r.value || r);
            return n.code = n.name = t.value || t,
            n
        }
        var o = e("./parse-message").parseMessage;
        t.exports = {
            parseEvent: n
        }
    },
    {
        "./parse-message": 57
    }],
    57 : [function(e, t, r) {
        function n(e) {
            for (var t = {},
            r = 0; r < e.length;) {
                var n = e.readUInt8(r++),
                i = e.slice(r, r + n).toString();
                switch (r += n, e.readUInt8(r++)) {
                case 0:
                    t[i] = {
                        type: a,
                        value: !0
                    };
                    break;
                case 1:
                    t[i] = {
                        type: a,
                        value: !1
                    };
                    break;
                case 2:
                    t[i] = {
                        type: u,
                        value: e.readInt8(r++)
                    };
                    break;
                case 3:
                    t[i] = {
                        type: c,
                        value: e.readInt16BE(r)
                    },
                    r += 2;
                    break;
                case 4:
                    t[i] = {
                        type: h,
                        value: e.readInt32BE(r)
                    },
                    r += 4;
                    break;
                case 5:
                    t[i] = {
                        type: l,
                        value: new o(e.slice(r, r + 8))
                    },
                    r += 8;
                    break;
                case 6:
                    var s = e.readUInt16BE(r);
                    r += 2,
                    t[i] = {
                        type: p,
                        value: e.slice(r, r + s)
                    },
                    r += s;
                    break;
                case 7:
                    var v = e.readUInt16BE(r);
                    r += 2,
                    t[i] = {
                        type: f,
                        value: e.slice(r, r + v).toString()
                    },
                    r += v;
                    break;
                case 8:
                    t[i] = {
                        type: d,
                        value: new Date(new o(e.slice(r, r + 8)).valueOf())
                    },
                    r += 8;
                    break;
                case 9:
                    var g = e.slice(r, r + 16).toString("hex");
                    r += 16,
                    t[i] = {
                        type: m,
                        value: g.substr(0, 8) + "-" + g.substr(8, 4) + "-" + g.substr(12, 4) + "-" + g.substr(16, 4) + "-" + g.substr(20)
                    };
                    break;
                default:
                    throw new Error("Unrecognized header type tag")
                }
            }
            return t
        }
        function i(e) {
            var t = s(e);
            return {
                headers: n(t.headers),
                body: t.body
            }
        }
        var o = e("./int64").Int64,
        s = e("./split-message").splitMessage,
        a = "boolean",
        u = "byte",
        c = "short",
        h = "integer",
        l = "long",
        p = "binary",
        f = "string",
        d = "timestamp",
        m = "uuid";
        t.exports = {
            parseMessage: i
        }
    },
    {
        "./int64": 55,
        "./split-message": 58
    }],
    58 : [function(e, t, r) {
        function n(e) {
            if (i.Buffer.isBuffer(e) || (e = o(e)), e.length < c) throw new Error("Provided message too short to accommodate event stream message overhead");
            if (e.length !== e.readUInt32BE(0)) throw new Error("Reported message length does not match received message length");
            var t = e.readUInt32BE(a);
            if (t !== i.crypto.crc32(e.slice(0, a))) throw new Error("The prelude checksum specified in the message (" + t + ") does not match the calculated CRC32 checksum.");
            var r = e.readUInt32BE(e.length - u);
            if (r !== i.crypto.crc32(e.slice(0, e.length - u))) throw new Error("The message checksum did not match the expected value of " + r);
            var n = a + u,
            h = n + e.readUInt32BE(s);
            return {
                headers: e.slice(n, h),
                body: e.slice(h, e.length - u)
            }
        }
        var i = e("../core").util,
        o = e("./to-buffer").toBuffer,
        s = 4,
        a = 2 * s,
        u = 4,
        c = a + 2 * u;
        t.exports = {
            splitMessage: n
        }
    },
    {
        "../core": 38,
        "./to-buffer": 59
    }],
    55 : [function(e, t, r) {
        function n(e) {
            if (8 !== e.length) throw new Error("Int64 buffers must be exactly 8 bytes");
            o.Buffer.isBuffer(e) || (e = s(e)),
            this.bytes = e
        }
        function i(e) {
            for (var t = 0; t < 8; t++) e[t] ^= 255;
            for (var t = 7; t > -1 && 0 === ++e[t]; t--);
        }
        var o = e("../core").util,
        s = e("./to-buffer").toBuffer;
        n.fromNumber = function(e) {
            if (e > 0x8000000000000000 || e < -0x8000000000000000) throw new Error(e + " is too large (or, if negative, too small) to represent as an Int64");
            for (var t = new Uint8Array(8), r = 7, o = Math.abs(Math.round(e)); r > -1 && o > 0; r--, o /= 256) t[r] = o;
            return e < 0 && i(t),
            new n(t)
        },
        n.prototype.valueOf = function() {
            var e = this.bytes.slice(0),
            t = 128 & e[0];
            return t && i(e),
            parseInt(e.toString("hex"), 16) * (t ? -1 : 1)
        },
        n.prototype.toString = function() {
            return String(this.valueOf())
        },
        t.exports = {
            Int64: n
        }
    },
    {
        "../core": 38,
        "./to-buffer": 59
    }],
    59 : [function(e, t, r) {
        function n(e, t) {
            return "function" == typeof i.from && i.from !== Uint8Array.from ? i.from(e, t) : new i(e, t)
        }
        var i = e("../core").util.Buffer;
        t.exports = {
            toBuffer: n
        }
    },
    {
        "../core": 38
    }],
    54 : [function(e, t, r) {
        function n(e) {
            for (var t = [], r = 0; r < e.length;) {
                var n = e.readInt32BE(r),
                i = e.slice(r, n + r);
                r += n,
                t.push(i)
            }
            return t
        }
        t.exports = {
            eventMessageChunker: n
        }
    },
    {}],
    45 : [function(e, t, r) {
        var n = e("../core");
        n.WebIdentityCredentials = n.util.inherit(n.Credentials, {
            constructor: function(e, t) {
                n.Credentials.call(this),
                this.expired = !0,
                this.params = e,
                this.params.RoleSessionName = this.params.RoleSessionName || "web-identity",
                this.data = null,
                this._clientConfig = n.util.copy(t || {})
            },
            refresh: function(e) {
                this.coalesceRefresh(e || n.util.fn.callback)
            },
            load: function(e) {
                var t = this;
                t.createClients(),
                t.service.assumeRoleWithWebIdentity(function(r, n) {
                    t.data = null,
                    r || (t.data = n, t.service.credentialsFrom(n, t)),
                    e(r)
                })
            },
            createClients: function() {
                if (!this.service) {
                    var e = n.util.merge({},
                    this._clientConfig);
                    e.params = this.params,
                    this.service = new n.STS(e)
                }
            }
        })
    },
    {
        "../core": 38
    }],
    44 : [function(e, t, r) {
        var n = e("../core");
        n.TemporaryCredentials = n.util.inherit(n.Credentials, {
            constructor: function(e, t) {
                n.Credentials.call(this),
                this.loadMasterCredentials(t),
                this.expired = !0,
                this.params = e || {},
                this.params.RoleArn && (this.params.RoleSessionName = this.params.RoleSessionName || "temporary-credentials")
            },
            refresh: function(e) {
                this.coalesceRefresh(e || n.util.fn.callback)
            },
            load: function(e) {
                var t = this;
                t.createClients(),
                t.masterCredentials.get(function() {
                    t.service.config.credentials = t.masterCredentials,
                    (t.params.RoleArn ? t.service.assumeRole: t.service.getSessionToken).call(t.service,
                    function(r, n) {
                        r || t.service.credentialsFrom(n, t),
                        e(r)
                    })
                })
            },
            loadMasterCredentials: function(e) {
                for (this.masterCredentials = e || n.config.credentials; this.masterCredentials.masterCredentials;) this.masterCredentials = this.masterCredentials.masterCredentials;
                "function" != typeof this.masterCredentials.get && (this.masterCredentials = new n.Credentials(this.masterCredentials))
            },
            createClients: function() {
                this.service = this.service || new n.STS({
                    params: this.params
                })
            }
        })
    },
    {
        "../core": 38
    }],
    43 : [function(e, t, r) {
        var n = e("../core");
        n.SAMLCredentials = n.util.inherit(n.Credentials, {
            constructor: function(e) {
                n.Credentials.call(this),
                this.expired = !0,
                this.params = e
            },
            refresh: function(e) {
                this.coalesceRefresh(e || n.util.fn.callback)
            },
            load: function(e) {
                var t = this;
                t.createClients(),
                t.service.assumeRoleWithSAML(function(r, n) {
                    r || t.service.credentialsFrom(n, t),
                    e(r)
                })
            },
            createClients: function() {
                this.service = this.service || new n.STS({
                    params: this.params
                })
            }
        })
    },
    {
        "../core": 38
    }],
    41 : [function(e, t, r) {
        var n = e("../core");
        n.CognitoIdentityCredentials = n.util.inherit(n.Credentials, {
            localStorageKey: {
                id: "aws.cognito.identity-id.",
                providers: "aws.cognito.identity-providers."
            },
            constructor: function(e, t) {
                n.Credentials.call(this),
                this.expired = !0,
                this.params = e,
                this.data = null,
                this._identityId = null,
                this._clientConfig = n.util.copy(t || {}),
                this.loadCachedId();
                var r = this;
                Object.defineProperty(this, "identityId", {
                    get: function() {
                        return r.loadCachedId(),
                        r._identityId || r.params.IdentityId
                    },
                    set: function(e) {
                        r._identityId = e
                    }
                })
            },
            refresh: function(e) {
                this.coalesceRefresh(e || n.util.fn.callback)
            },
            load: function(e) {
                var t = this;
                t.createClients(),
                t.data = null,
                t._identityId = null,
                t.getId(function(r) {
                    r ? (t.clearIdOnNotAuthorized(r), e(r)) : t.params.RoleArn ? t.getCredentialsFromSTS(e) : t.getCredentialsForIdentity(e)
                })
            },
            clearCachedId: function() {
                this._identityId = null,
                delete this.params.IdentityId;
                var e = this.params.IdentityPoolId,
                t = this.params.LoginId || "";
                delete this.storage[this.localStorageKey.id + e + t],
                delete this.storage[this.localStorageKey.providers + e + t]
            },
            clearIdOnNotAuthorized: function(e) {
                var t = this;
                "NotAuthorizedException" == e.code && t.clearCachedId()
            },
            getId: function(e) {
                var t = this;
                if ("string" == typeof t.params.IdentityId) return e(null, t.params.IdentityId);
                t.cognito.getId(function(r, n) { ! r && n.IdentityId ? (t.params.IdentityId = n.IdentityId, e(null, n.IdentityId)) : e(r)
                })
            },
            loadCredentials: function(e, t) {
                e && t && (t.expired = !1, t.accessKeyId = e.Credentials.AccessKeyId, t.secretAccessKey = e.Credentials.SecretKey, t.sessionToken = e.Credentials.SessionToken, t.expireTime = e.Credentials.Expiration)
            },
            getCredentialsForIdentity: function(e) {
                var t = this;
                t.cognito.getCredentialsForIdentity(function(r, n) {
                    r ? t.clearIdOnNotAuthorized(r) : (t.cacheId(n), t.data = n, t.loadCredentials(t.data, t)),
                    e(r)
                })
            },
            getCredentialsFromSTS: function(e) {
                var t = this;
                t.cognito.getOpenIdToken(function(r, n) {
                    r ? (t.clearIdOnNotAuthorized(r), e(r)) : (t.cacheId(n), t.params.WebIdentityToken = n.Token, t.webIdentityCredentials.refresh(function(r) {
                        r || (t.data = t.webIdentityCredentials.data, t.sts.credentialsFrom(t.data, t)),
                        e(r)
                    }))
                })
            },
            loadCachedId: function() {
                var e = this;
                if (n.util.isBrowser() && !e.params.IdentityId) {
                    var t = e.getStorage("id");
                    if (t && e.params.Logins) {
                        var r = Object.keys(e.params.Logins);
                        0 !== (e.getStorage("providers") || "").split(",").filter(function(e) {
                            return - 1 !== r.indexOf(e)
                        }).length && (e.params.IdentityId = t)
                    } else t && (e.params.IdentityId = t)
                }
            },
            createClients: function() {
                var e = this._clientConfig;
                if (this.webIdentityCredentials = this.webIdentityCredentials || new n.WebIdentityCredentials(this.params, e), !this.cognito) {
                    var t = n.util.merge({},
                    e);
                    t.params = this.params,
                    this.cognito = new n.CognitoIdentity(t)
                }
                this.sts = this.sts || new n.STS(e)
            },
            cacheId: function(e) {
                this._identityId = e.IdentityId,
                this.params.IdentityId = this._identityId,
                n.util.isBrowser() && (this.setStorage("id", e.IdentityId), this.params.Logins && this.setStorage("providers", Object.keys(this.params.Logins).join(",")))
            },
            getStorage: function(e) {
                return this.storage[this.localStorageKey[e] + this.params.IdentityPoolId + (this.params.LoginId || "")]
            },
            setStorage: function(e, t) {
                try {
                    this.storage[this.localStorageKey[e] + this.params.IdentityPoolId + (this.params.LoginId || "")] = t
                } catch(e) {}
            },
            storage: function() {
                try {
                    var e = n.util.isBrowser() && null !== window.localStorage && "object" == typeof window.localStorage ? window.localStorage: {};
                    return e["aws.test-storage"] = "foobar",
                    delete e["aws.test-storage"],
                    e
                } catch(e) {
                    return {}
                }
            } ()
        })
    },
    {
        "../core": 38
    }],
    40 : [function(e, t, r) {
        var n = e("../core");
        n.ChainableTemporaryCredentials = n.util.inherit(n.Credentials, {
            constructor: function(e) {
                n.Credentials.call(this),
                e = e || {},
                this.errorCode = "ChainableTemporaryCredentialsProviderFailure",
                this.expired = !0,
                this.tokenCodeFn = null;
                var t = n.util.copy(e.params) || {};
                if (t.RoleArn && (t.RoleSessionName = t.RoleSessionName || "temporary-credentials"), t.SerialNumber) {
                    if (!e.tokenCodeFn || "function" != typeof e.tokenCodeFn) throw new n.util.error(new Error("tokenCodeFn must be a function when params.SerialNumber is given"), {
                        code: this.errorCode
                    });
                    this.tokenCodeFn = e.tokenCodeFn
                }
                this.service = new n.STS({
                    params: t,
                    credentials: e.masterCredentials || n.config.credentials
                })
            },
            refresh: function(e) {
                this.coalesceRefresh(e || n.util.fn.callback)
            },
            load: function(e) {
                var t = this,
                r = t.service.config.params.RoleArn ? "assumeRole": "getSessionToken";
                this.getTokenCode(function(n, i) {
                    var o = {};
                    if (n) return void e(n);
                    i && (o.TokenCode = i),
                    t.service[r](o,
                    function(r, n) {
                        r || t.service.credentialsFrom(n, t),
                        e(r)
                    })
                })
            },
            getTokenCode: function(e) {
                var t = this;
                this.tokenCodeFn ? this.tokenCodeFn(this.service.config.params.SerialNumber,
                function(r, i) {
                    if (r) {
                        var o = r;
                        return r instanceof Error && (o = r.message),
                        void e(n.util.error(new Error("Error fetching MFA token: " + o), {
                            code: t.errorCode
                        }))
                    }
                    e(null, i)
                }) : e(null)
            }
        })
    },
    {
        "../core": 38
    }],
    29 : [function(e, t, r) {
        var n = e("./browserHmac"),
        i = e("./browserMd5"),
        o = e("./browserSha1"),
        s = e("./browserSha256");
        t.exports = {
            createHash: function(e) {
                if ("md5" === (e = e.toLowerCase())) return new i;
                if ("sha256" === e) return new s;
                if ("sha1" === e) return new o;
                throw new Error("Hash algorithm " + e + " is not supported in the browser SDK")
            },
            createHmac: function(e, t) {
                if ("md5" === (e = e.toLowerCase())) return new n(i, t);
                if ("sha256" === e) return new n(s, t);
                if ("sha1" === e) return new n(o, t);
                throw new Error("HMAC algorithm " + e + " is not supported in the browser SDK")
            },
            createSign: function() {
                throw new Error("createSign is not implemented in the browser")
            }
        }
    },
    {
        "./browserHmac": 31,
        "./browserMd5": 32,
        "./browserSha1": 33,
        "./browserSha256": 34
    }],
    34 : [function(e, t, r) {
        function n() {
            this.state = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
            this.temp = new Int32Array(64),
            this.buffer = new Uint8Array(64),
            this.bufferLength = 0,
            this.bytesHashed = 0,
            this.finished = !1
        }
        var i = e("buffer/").Buffer,
        o = e("./browserHashUtils"),
        s = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
        a = Math.pow(2, 53) - 1;
        t.exports = n,
        n.BLOCK_SIZE = 64,
        n.prototype.update = function(e) {
            if (this.finished) throw new Error("Attempted to update an already finished hash.");
            if (o.isEmptyData(e)) return this;
            e = o.convertToBuffer(e);
            var t = 0,
            r = e.byteLength;
            if (this.bytesHashed += r, 8 * this.bytesHashed > a) throw new Error("Cannot hash more than 2^53 - 1 bits");
            for (; r > 0;) this.buffer[this.bufferLength++] = e[t++],
            r--,
            64 === this.bufferLength && (this.hashBuffer(), this.bufferLength = 0);
            return this
        },
        n.prototype.digest = function(e) {
            if (!this.finished) {
                var t = 8 * this.bytesHashed,
                r = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength),
                n = this.bufferLength;
                if (r.setUint8(this.bufferLength++, 128), n % 64 >= 56) {
                    for (var o = this.bufferLength; o < 64; o++) r.setUint8(o, 0);
                    this.hashBuffer(),
                    this.bufferLength = 0
                }
                for (var o = this.bufferLength; o < 56; o++) r.setUint8(o, 0);
                r.setUint32(56, Math.floor(t / 4294967296), !0),
                r.setUint32(60, t),
                this.hashBuffer(),
                this.finished = !0
            }
            for (var s = new i(32), o = 0; o < 8; o++) s[4 * o] = this.state[o] >>> 24 & 255,
            s[4 * o + 1] = this.state[o] >>> 16 & 255,
            s[4 * o + 2] = this.state[o] >>> 8 & 255,
            s[4 * o + 3] = this.state[o] >>> 0 & 255;
            return e ? s.toString(e) : s
        },
        n.prototype.hashBuffer = function() {
            for (var e = this,
            t = e.buffer,
            r = e.state,
            n = r[0], i = r[1], o = r[2], a = r[3], u = r[4], c = r[5], h = r[6], l = r[7], p = 0; p < 64; p++) {
                if (p < 16) this.temp[p] = (255 & t[4 * p]) << 24 | (255 & t[4 * p + 1]) << 16 | (255 & t[4 * p + 2]) << 8 | 255 & t[4 * p + 3];
                else {
                    var f = this.temp[p - 2],
                    d = (f >>> 17 | f << 15) ^ (f >>> 19 | f << 13) ^ f >>> 10;
                    f = this.temp[p - 15];
                    var m = (f >>> 7 | f << 25) ^ (f >>> 18 | f << 14) ^ f >>> 3;
                    this.temp[p] = (d + this.temp[p - 7] | 0) + (m + this.temp[p - 16] | 0)
                }
                var v = (((u >>> 6 | u << 26) ^ (u >>> 11 | u << 21) ^ (u >>> 25 | u << 7)) + (u & c ^ ~u & h) | 0) + (l + (s[p] + this.temp[p] | 0) | 0) | 0,
                g = ((n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10)) + (n & i ^ n & o ^ i & o) | 0;
                l = h,
                h = c,
                c = u,
                u = a + v | 0,
                a = o,
                o = i,
                i = n,
                n = v + g | 0
            }
            r[0] += n,
            r[1] += i,
            r[2] += o,
            r[3] += a,
            r[4] += u,
            r[5] += c,
            r[6] += h,
            r[7] += l
        }
    },
    {
        "./browserHashUtils": 30,
        "buffer/": 3
    }],
    33 : [function(e, t, r) {
        function n() {
            this.h0 = 1732584193,
            this.h1 = 4023233417,
            this.h2 = 2562383102,
            this.h3 = 271733878,
            this.h4 = 3285377520,
            this.block = new Uint32Array(80),
            this.offset = 0,
            this.shift = 24,
            this.totalLength = 0
        }
        var i = e("buffer/").Buffer,
        o = e("./browserHashUtils");
        new Uint32Array([1518500249, 1859775393, -1894007588, -899497514]),
        Math.pow(2, 53);
        t.exports = n,
        n.BLOCK_SIZE = 64,
        n.prototype.update = function(e) {
            if (this.finished) throw new Error("Attempted to update an already finished hash.");
            if (o.isEmptyData(e)) return this;
            e = o.convertToBuffer(e);
            var t = e.length;
            this.totalLength += 8 * t;
            for (var r = 0; r < t; r++) this.write(e[r]);
            return this
        },
        n.prototype.write = function(e) {
            this.block[this.offset] |= (255 & e) << this.shift,
            this.shift ? this.shift -= 8 : (this.offset++, this.shift = 24),
            16 === this.offset && this.processBlock()
        },
        n.prototype.digest = function(e) {
            this.write(128),
            (this.offset > 14 || 14 === this.offset && this.shift < 24) && this.processBlock(),
            this.offset = 14,
            this.shift = 24,
            this.write(0),
            this.write(0),
            this.write(this.totalLength > 0xffffffffff ? this.totalLength / 1099511627776 : 0),
            this.write(this.totalLength > 4294967295 ? this.totalLength / 4294967296 : 0);
            for (var t = 24; t >= 0; t -= 8) this.write(this.totalLength >> t);
            var r = new i(20),
            n = new DataView(r.buffer);
            return n.setUint32(0, this.h0, !1),
            n.setUint32(4, this.h1, !1),
            n.setUint32(8, this.h2, !1),
            n.setUint32(12, this.h3, !1),
            n.setUint32(16, this.h4, !1),
            e ? r.toString(e) : r
        },
        n.prototype.processBlock = function() {
            for (var e = 16; e < 80; e++) {
                var t = this.block[e - 3] ^ this.block[e - 8] ^ this.block[e - 14] ^ this.block[e - 16];
                this.block[e] = t << 1 | t >>> 31
            }
            var r, n, i = this.h0,
            o = this.h1,
            s = this.h2,
            a = this.h3,
            u = this.h4;
            for (e = 0; e < 80; e++) {
                e < 20 ? (r = a ^ o & (s ^ a), n = 1518500249) : e < 40 ? (r = o ^ s ^ a, n = 1859775393) : e < 60 ? (r = o & s | a & (o | s), n = 2400959708) : (r = o ^ s ^ a, n = 3395469782);
                var c = (i << 5 | i >>> 27) + r + u + n + (0 | this.block[e]);
                u = a,
                a = s,
                s = o << 30 | o >>> 2,
                o = i,
                i = c
            }
            for (this.h0 = this.h0 + i | 0, this.h1 = this.h1 + o | 0, this.h2 = this.h2 + s | 0, this.h3 = this.h3 + a | 0, this.h4 = this.h4 + u | 0, this.offset = 0, e = 0; e < 16; e++) this.block[e] = 0
        }
    },
    {
        "./browserHashUtils": 30,
        "buffer/": 3
    }],
    32 : [function(e, t, r) {
        function n() {
            this.state = [1732584193, 4023233417, 2562383102, 271733878],
            this.buffer = new DataView(new ArrayBuffer(l)),
            this.bufferLength = 0,
            this.bytesHashed = 0,
            this.finished = !1
        }
        function i(e, t, r, n, i, o) {
            return ((t = (t + e & 4294967295) + (n + o & 4294967295) & 4294967295) << i | t >>> 32 - i) + r & 4294967295
        }
        function o(e, t, r, n, o, s, a) {
            return i(t & r | ~t & n, e, t, o, s, a)
        }
        function s(e, t, r, n, o, s, a) {
            return i(t & n | r & ~n, e, t, o, s, a)
        }
        function a(e, t, r, n, o, s, a) {
            return i(t ^ r ^ n, e, t, o, s, a)
        }
        function u(e, t, r, n, o, s, a) {
            return i(r ^ (t | ~n), e, t, o, s, a)
        }
        var c = e("./browserHashUtils"),
        h = e("buffer/").Buffer,
        l = 64;
        t.exports = n,
        n.BLOCK_SIZE = l,
        n.prototype.update = function(e) {
            if (c.isEmptyData(e)) return this;
            if (this.finished) throw new Error("Attempted to update an already finished hash.");
            var t = c.convertToBuffer(e),
            r = 0,
            n = t.byteLength;
            for (this.bytesHashed += n; n > 0;) this.buffer.setUint8(this.bufferLength++, t[r++]),
            n--,
            this.bufferLength === l && (this.hashBuffer(), this.bufferLength = 0);
            return this
        },
        n.prototype.digest = function(e) {
            if (!this.finished) {
                var t = this,
                r = t.buffer,
                n = t.bufferLength,
                i = t.bytesHashed,
                o = 8 * i;
                if (r.setUint8(this.bufferLength++, 128), n % l >= l - 8) {
                    for (var s = this.bufferLength; s < l; s++) r.setUint8(s, 0);
                    this.hashBuffer(),
                    this.bufferLength = 0
                }
                for (var s = this.bufferLength; s < l - 8; s++) r.setUint8(s, 0);
                r.setUint32(l - 8, o >>> 0, !0),
                r.setUint32(l - 4, Math.floor(o / 4294967296), !0),
                this.hashBuffer(),
                this.finished = !0
            }
            for (var a = new DataView(new ArrayBuffer(16)), s = 0; s < 4; s++) a.setUint32(4 * s, this.state[s], !0);
            var u = new h(a.buffer, a.byteOffset, a.byteLength);
            return e ? u.toString(e) : u
        },
        n.prototype.hashBuffer = function() {
            var e = this,
            t = e.buffer,
            r = e.state,
            n = r[0],
            i = r[1],
            c = r[2],
            h = r[3];
            n = o(n, i, c, h, t.getUint32(0, !0), 7, 3614090360),
            h = o(h, n, i, c, t.getUint32(4, !0), 12, 3905402710),
            c = o(c, h, n, i, t.getUint32(8, !0), 17, 606105819),
            i = o(i, c, h, n, t.getUint32(12, !0), 22, 3250441966),
            n = o(n, i, c, h, t.getUint32(16, !0), 7, 4118548399),
            h = o(h, n, i, c, t.getUint32(20, !0), 12, 1200080426),
            c = o(c, h, n, i, t.getUint32(24, !0), 17, 2821735955),
            i = o(i, c, h, n, t.getUint32(28, !0), 22, 4249261313),
            n = o(n, i, c, h, t.getUint32(32, !0), 7, 1770035416),
            h = o(h, n, i, c, t.getUint32(36, !0), 12, 2336552879),
            c = o(c, h, n, i, t.getUint32(40, !0), 17, 4294925233),
            i = o(i, c, h, n, t.getUint32(44, !0), 22, 2304563134),
            n = o(n, i, c, h, t.getUint32(48, !0), 7, 1804603682),
            h = o(h, n, i, c, t.getUint32(52, !0), 12, 4254626195),
            c = o(c, h, n, i, t.getUint32(56, !0), 17, 2792965006),
            i = o(i, c, h, n, t.getUint32(60, !0), 22, 1236535329),
            n = s(n, i, c, h, t.getUint32(4, !0), 5, 4129170786),
            h = s(h, n, i, c, t.getUint32(24, !0), 9, 3225465664),
            c = s(c, h, n, i, t.getUint32(44, !0), 14, 643717713),
            i = s(i, c, h, n, t.getUint32(0, !0), 20, 3921069994),
            n = s(n, i, c, h, t.getUint32(20, !0), 5, 3593408605),
            h = s(h, n, i, c, t.getUint32(40, !0), 9, 38016083),
            c = s(c, h, n, i, t.getUint32(60, !0), 14, 3634488961),
            i = s(i, c, h, n, t.getUint32(16, !0), 20, 3889429448),
            n = s(n, i, c, h, t.getUint32(36, !0), 5, 568446438),
            h = s(h, n, i, c, t.getUint32(56, !0), 9, 3275163606),
            c = s(c, h, n, i, t.getUint32(12, !0), 14, 4107603335),
            i = s(i, c, h, n, t.getUint32(32, !0), 20, 1163531501),
            n = s(n, i, c, h, t.getUint32(52, !0), 5, 2850285829),
            h = s(h, n, i, c, t.getUint32(8, !0), 9, 4243563512),
            c = s(c, h, n, i, t.getUint32(28, !0), 14, 1735328473),
            i = s(i, c, h, n, t.getUint32(48, !0), 20, 2368359562),
            n = a(n, i, c, h, t.getUint32(20, !0), 4, 4294588738),
            h = a(h, n, i, c, t.getUint32(32, !0), 11, 2272392833),
            c = a(c, h, n, i, t.getUint32(44, !0), 16, 1839030562),
            i = a(i, c, h, n, t.getUint32(56, !0), 23, 4259657740),
            n = a(n, i, c, h, t.getUint32(4, !0), 4, 2763975236),
            h = a(h, n, i, c, t.getUint32(16, !0), 11, 1272893353),
            c = a(c, h, n, i, t.getUint32(28, !0), 16, 4139469664),
            i = a(i, c, h, n, t.getUint32(40, !0), 23, 3200236656),
            n = a(n, i, c, h, t.getUint32(52, !0), 4, 681279174),
            h = a(h, n, i, c, t.getUint32(0, !0), 11, 3936430074),
            c = a(c, h, n, i, t.getUint32(12, !0), 16, 3572445317),
            i = a(i, c, h, n, t.getUint32(24, !0), 23, 76029189),
            n = a(n, i, c, h, t.getUint32(36, !0), 4, 3654602809),
            h = a(h, n, i, c, t.getUint32(48, !0), 11, 3873151461),
            c = a(c, h, n, i, t.getUint32(60, !0), 16, 530742520),
            i = a(i, c, h, n, t.getUint32(8, !0), 23, 3299628645),
            n = u(n, i, c, h, t.getUint32(0, !0), 6, 4096336452),
            h = u(h, n, i, c, t.getUint32(28, !0), 10, 1126891415),
            c = u(c, h, n, i, t.getUint32(56, !0), 15, 2878612391),
            i = u(i, c, h, n, t.getUint32(20, !0), 21, 4237533241),
            n = u(n, i, c, h, t.getUint32(48, !0), 6, 1700485571),
            h = u(h, n, i, c, t.getUint32(12, !0), 10, 2399980690),
            c = u(c, h, n, i, t.getUint32(40, !0), 15, 4293915773),
            i = u(i, c, h, n, t.getUint32(4, !0), 21, 2240044497),
            n = u(n, i, c, h, t.getUint32(32, !0), 6, 1873313359),
            h = u(h, n, i, c, t.getUint32(60, !0), 10, 4264355552),
            c = u(c, h, n, i, t.getUint32(24, !0), 15, 2734768916),
            i = u(i, c, h, n, t.getUint32(52, !0), 21, 1309151649),
            n = u(n, i, c, h, t.getUint32(16, !0), 6, 4149444226),
            h = u(h, n, i, c, t.getUint32(44, !0), 10, 3174756917),
            c = u(c, h, n, i, t.getUint32(8, !0), 15, 718787259),
            i = u(i, c, h, n, t.getUint32(36, !0), 21, 3951481745),
            r[0] = n + r[0] & 4294967295,
            r[1] = i + r[1] & 4294967295,
            r[2] = c + r[2] & 4294967295,
            r[3] = h + r[3] & 4294967295
        }
    },
    {
        "./browserHashUtils": 30,
        "buffer/": 3
    }],
    31 : [function(e, t, r) {
        function n(e, t) {
            this.hash = new e,
            this.outer = new e;
            var r = i(e, t),
            n = new Uint8Array(e.BLOCK_SIZE);
            n.set(r);
            for (var o = 0; o < e.BLOCK_SIZE; o++) r[o] ^= 54,
            n[o] ^= 92;
            this.hash.update(r),
            this.outer.update(n);
            for (var o = 0; o < r.byteLength; o++) r[o] = 0
        }
        function i(e, t) {
            var r = o.convertToBuffer(t);
            if (r.byteLength > e.BLOCK_SIZE) {
                var n = new e;
                n.update(r),
                r = n.digest()
            }
            var i = new Uint8Array(e.BLOCK_SIZE);
            return i.set(r),
            i
        }
        var o = e("./browserHashUtils");
        t.exports = n,
        n.prototype.update = function(e) {
            if (o.isEmptyData(e) || this.error) return this;
            try {
                this.hash.update(o.convertToBuffer(e))
            } catch(e) {
                this.error = e
            }
            return this
        },
        n.prototype.digest = function(e) {
            return this.outer.finished || this.outer.update(this.hash.digest()),
            this.outer.digest(e)
        }
    },
    {
        "./browserHashUtils": 30
    }],
    30 : [function(e, t, r) {
        function n(e) {
            return "string" == typeof e ? 0 === e.length: 0 === e.byteLength
        }
        function i(e) {
            return "string" == typeof e && (e = new o(e, "utf8")),
            ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e)
        }
        var o = e("buffer/").Buffer;
        "undefined" != typeof ArrayBuffer && void 0 === ArrayBuffer.isView && (ArrayBuffer.isView = function(e) {
            return s.indexOf(Object.prototype.toString.call(e)) > -1
        });
        var s = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]", "[object DataView]"];
        t.exports = {
            isEmptyData: n,
            convertToBuffer: i
        }
    },
    {
        "buffer/": 3
    }],
    18 : [function(e, t, r) {
        function n() {
            this.protocol = null,
            this.slashes = null,
            this.auth = null,
            this.host = null,
            this.port = null,
            this.hostname = null,
            this.hash = null,
            this.search = null,
            this.query = null,
            this.pathname = null,
            this.path = null,
            this.href = null
        }
        function i(e, t, r) {
            if (e && c(e) && e instanceof n) return e;
            var i = new n;
            return i.parse(e, t, r),
            i
        }
        function o(e) {
            return u(e) && (e = i(e)),
            e instanceof n ? e.format() : n.prototype.format.call(e)
        }
        function s(e, t) {
            return i(e, !1, !0).resolve(t)
        }
        function a(e, t) {
            return e ? i(e, !1, !0).resolveObject(t) : t
        }
        function u(e) {
            return "string" == typeof e
        }
        function c(e) {
            return "object" == typeof e && null !== e
        }
        function h(e) {
            return null === e
        }
        function l(e) {
            return null == e
        }
        var p = e("punycode");
        r.parse = i,
        r.resolve = s,
        r.resolveObject = a,
        r.format = o,
        r.Url = n;
        var f = /^([a-z0-9.+-]+:)/i,
        d = /:[0-9]*$/,
        m = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
        v = ["{", "}", "|", "\\", "^", "`"].concat(m),
        g = ["'"].concat(v),
        y = ["%", "/", "?", ";", "#"].concat(g),
        b = ["/", "?", "#"],
        w = /^[a-z0-9A-Z_-]{0,63}$/,
        E = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
        _ = {
            javascript: !0,
            "javascript:": !0
        },
        S = {
            javascript: !0,
            "javascript:": !0
        },
        C = {
            http: !0,
            https: !0,
            ftp: !0,
            gopher: !0,
            file: !0,
            "http:": !0,
            "https:": !0,
            "ftp:": !0,
            "gopher:": !0,
            "file:": !0
        },
        x = e("querystring");
        n.prototype.parse = function(e, t, r) {
            if (!u(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
            var n = e;
            n = n.trim();
            var i = f.exec(n);
            if (i) {
                i = i[0];
                var o = i.toLowerCase();
                this.protocol = o,
                n = n.substr(i.length)
            }
            if (r || i || n.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                var s = "//" === n.substr(0, 2); ! s || i && S[i] || (n = n.substr(2), this.slashes = !0)
            }
            if (!S[i] && (s || i && !C[i])) {
                for (var a = -1,
                c = 0; c < b.length; c++) {
                    var h = n.indexOf(b[c]); - 1 !== h && ( - 1 === a || h < a) && (a = h)
                }
                var l, d;
                d = -1 === a ? n.lastIndexOf("@") : n.lastIndexOf("@", a),
                -1 !== d && (l = n.slice(0, d), n = n.slice(d + 1), this.auth = decodeURIComponent(l)),
                a = -1;
                for (var c = 0; c < y.length; c++) {
                    var h = n.indexOf(y[c]); - 1 !== h && ( - 1 === a || h < a) && (a = h)
                } - 1 === a && (a = n.length),
                this.host = n.slice(0, a),
                n = n.slice(a),
                this.parseHost(),
                this.hostname = this.hostname || "";
                var m = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                if (!m) for (var v = this.hostname.split(/\./), c = 0, R = v.length; c < R; c++) {
                    var A = v[c];
                    if (A && !A.match(w)) {
                        for (var T = "",
                        k = 0,
                        I = A.length; k < I; k++) A.charCodeAt(k) > 127 ? T += "x": T += A[k];
                        if (!T.match(w)) {
                            var L = v.slice(0, c),
                            P = v.slice(c + 1),
                            q = A.match(E);
                            q && (L.push(q[1]), P.unshift(q[2])),
                            P.length && (n = "/" + P.join(".") + n),
                            this.hostname = L.join(".");
                            break
                        }
                    }
                }
                if (this.hostname.length > 255 ? this.hostname = "": this.hostname = this.hostname.toLowerCase(), !m) {
                    for (var O = this.hostname.split("."), U = [], c = 0; c < O.length; ++c) {
                        var N = O[c];
                        U.push(N.match(/[^A-Za-z0-9_-]/) ? "xn--" + p.encode(N) : N)
                    }
                    this.hostname = U.join(".")
                }
                var D = this.port ? ":" + this.port: "",
                M = this.hostname || "";
                this.host = M + D,
                this.href += this.host,
                m && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== n[0] && (n = "/" + n))
            }
            if (!_[o]) for (var c = 0,
            R = g.length; c < R; c++) {
                var j = g[c],
                B = encodeURIComponent(j);
                B === j && (B = escape(j)),
                n = n.split(j).join(B)
            }
            var H = n.indexOf("#"); - 1 !== H && (this.hash = n.substr(H), n = n.slice(0, H));
            var F = n.indexOf("?");
            if ( - 1 !== F ? (this.search = n.substr(F), this.query = n.substr(F + 1), t && (this.query = x.parse(this.query)), n = n.slice(0, F)) : t && (this.search = "", this.query = {}), n && (this.pathname = n), C[o] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                var D = this.pathname || "",
                N = this.search || "";
                this.path = D + N
            }
            return this.href = this.format(),
            this
        },
        n.prototype.format = function() {
            var e = this.auth || "";
            e && (e = encodeURIComponent(e), e = e.replace(/%3A/i, ":"), e += "@");
            var t = this.protocol || "",
            r = this.pathname || "",
            n = this.hash || "",
            i = !1,
            o = "";
            this.host ? i = e + this.host: this.hostname && (i = e + ( - 1 === this.hostname.indexOf(":") ? this.hostname: "[" + this.hostname + "]"), this.port && (i += ":" + this.port)),
            this.query && c(this.query) && Object.keys(this.query).length && (o = x.stringify(this.query));
            var s = this.search || o && "?" + o || "";
            return t && ":" !== t.substr( - 1) && (t += ":"),
            this.slashes || (!t || C[t]) && !1 !== i ? (i = "//" + (i || ""), r && "/" !== r.charAt(0) && (r = "/" + r)) : i || (i = ""),
            n && "#" !== n.charAt(0) && (n = "#" + n),
            s && "?" !== s.charAt(0) && (s = "?" + s),
            r = r.replace(/[?#]/g,
            function(e) {
                return encodeURIComponent(e)
            }),
            s = s.replace("#", "%23"),
            t + i + r + s + n
        },
        n.prototype.resolve = function(e) {
            return this.resolveObject(i(e, !1, !0)).format()
        },
        n.prototype.resolveObject = function(e) {
            if (u(e)) {
                var t = new n;
                t.parse(e, !1, !0),
                e = t
            }
            var r = new n;
            if (Object.keys(this).forEach(function(e) {
                r[e] = this[e]
            },
            this), r.hash = e.hash, "" === e.href) return r.href = r.format(),
            r;
            if (e.slashes && !e.protocol) return Object.keys(e).forEach(function(t) {
                "protocol" !== t && (r[t] = e[t])
            }),
            C[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"),
            r.href = r.format(),
            r;
            if (e.protocol && e.protocol !== r.protocol) {
                if (!C[e.protocol]) return Object.keys(e).forEach(function(t) {
                    r[t] = e[t]
                }),
                r.href = r.format(),
                r;
                if (r.protocol = e.protocol, e.host || S[e.protocol]) r.pathname = e.pathname;
                else {
                    for (var i = (e.pathname || "").split("/"); i.length && !(e.host = i.shift()););
                    e.host || (e.host = ""),
                    e.hostname || (e.hostname = ""),
                    "" !== i[0] && i.unshift(""),
                    i.length < 2 && i.unshift(""),
                    r.pathname = i.join("/")
                }
                if (r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, r.hostname = e.hostname || e.host, r.port = e.port, r.pathname || r.search) {
                    var o = r.pathname || "",
                    s = r.search || "";
                    r.path = o + s
                }
                return r.slashes = r.slashes || e.slashes,
                r.href = r.format(),
                r
            }
            var a = r.pathname && "/" === r.pathname.charAt(0),
            c = e.host || e.pathname && "/" === e.pathname.charAt(0),
            p = c || a || r.host && e.pathname,
            f = p,
            d = r.pathname && r.pathname.split("/") || [],
            i = e.pathname && e.pathname.split("/") || [],
            m = r.protocol && !C[r.protocol];
            if (m && (r.hostname = "", r.port = null, r.host && ("" === d[0] ? d[0] = r.host: d.unshift(r.host)), r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === i[0] ? i[0] = e.host: i.unshift(e.host)), e.host = null), p = p && ("" === i[0] || "" === d[0])), c) r.host = e.host || "" === e.host ? e.host: r.host,
            r.hostname = e.hostname || "" === e.hostname ? e.hostname: r.hostname,
            r.search = e.search,
            r.query = e.query,
            d = i;
            else if (i.length) d || (d = []),
            d.pop(),
            d = d.concat(i),
            r.search = e.search,
            r.query = e.query;
            else if (!l(e.search)) {
                if (m) {
                    r.hostname = r.host = d.shift();
                    var v = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@");
                    v && (r.auth = v.shift(), r.host = r.hostname = v.shift())
                }
                return r.search = e.search,
                r.query = e.query,
                h(r.pathname) && h(r.search) || (r.path = (r.pathname ? r.pathname: "") + (r.search ? r.search: "")),
                r.href = r.format(),
                r
            }
            if (!d.length) return r.pathname = null,
            r.search ? r.path = "/" + r.search: r.path = null,
            r.href = r.format(),
            r;
            for (var g = d.slice( - 1)[0], y = (r.host || e.host) && ("." === g || ".." === g) || "" === g, b = 0, w = d.length; w >= 0; w--) g = d[w],
            "." == g ? d.splice(w, 1) : ".." === g ? (d.splice(w, 1), b++) : b && (d.splice(w, 1), b--);
            if (!p && !f) for (; b--; b) d.unshift(".."); ! p || "" === d[0] || d[0] && "/" === d[0].charAt(0) || d.unshift(""),
            y && "/" !== d.join("/").substr( - 1) && d.push("");
            var E = "" === d[0] || d[0] && "/" === d[0].charAt(0);
            if (m) {
                r.hostname = r.host = E ? "": d.length ? d.shift() : "";
                var v = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@");
                v && (r.auth = v.shift(), r.host = r.hostname = v.shift())
            }
            return p = p || r.host && d.length,
            p && !E && d.unshift(""),
            d.length ? r.pathname = d.join("/") : (r.pathname = null, r.path = null),
            h(r.pathname) && h(r.search) || (r.path = (r.pathname ? r.pathname: "") + (r.search ? r.search: "")),
            r.auth = e.auth || r.auth,
            r.slashes = r.slashes || e.slashes,
            r.href = r.format(),
            r
        },
        n.prototype.parseHost = function() {
            var e = this.host,
            t = d.exec(e);
            t && (t = t[0], ":" !== t && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)),
            e && (this.hostname = e)
        }
    },
    {
        punycode: 10,
        querystring: 13
    }],
    16 : [function(e, t, r) {
        arguments[4][13][0].apply(r, arguments)
    },
    {
        "./decode": 14,
        "./encode": 15,
        dup: 13
    }],
    15 : [function(e, t, r) {
        "use strict";
        var n = function(e) {
            switch (typeof e) {
            case "string":
                return e;
            case "boolean":
                return e ? "true": "false";
            case "number":
                return isFinite(e) ? e: "";
            default:
                return ""
            }
        };
        t.exports = function(e, t, r, i) {
            return t = t || "&",
            r = r || "=",
            null === e && (e = void 0),
            "object" == typeof e ? Object.keys(e).map(function(i) {
                var o = encodeURIComponent(n(i)) + r;
                return Array.isArray(e[i]) ? e[i].map(function(e) {
                    return o + encodeURIComponent(n(e))
                }).join(t) : o + encodeURIComponent(n(e[i]))
            }).join(t) : i ? encodeURIComponent(n(i)) + r + encodeURIComponent(n(e)) : ""
        }
    },
    {}],
    14 : [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        t.exports = function(e, t, r, i) {
            t = t || "&",
            r = r || "=";
            var o = {};
            if ("string" != typeof e || 0 === e.length) return o;
            var s = /\+/g;
            e = e.split(t);
            var a = 1e3;
            i && "number" == typeof i.maxKeys && (a = i.maxKeys);
            var u = e.length;
            a > 0 && u > a && (u = a);
            for (var c = 0; c < u; ++c) {
                var h, l, p, f, d = e[c].replace(s, "%20"),
                m = d.indexOf(r);
                m >= 0 ? (h = d.substr(0, m), l = d.substr(m + 1)) : (h = d, l = ""),
                p = decodeURIComponent(h),
                f = decodeURIComponent(l),
                n(o, p) ? Array.isArray(o[p]) ? o[p].push(f) : o[p] = [o[p], f] : o[p] = f
            }
            return o
        }
    },
    {}],
    13 : [function(e, t, r) {
        "use strict";
        r.decode = r.parse = e("./decode"),
        r.encode = r.stringify = e("./encode")
    },
    {
        "./decode": 11,
        "./encode": 12
    }],
    12 : [function(e, t, r) {
        "use strict";
        function n(e, t) {
            if (e.map) return e.map(t);
            for (var r = [], n = 0; n < e.length; n++) r.push(t(e[n], n));
            return r
        }
        var i = function(e) {
            switch (typeof e) {
            case "string":
                return e;
            case "boolean":
                return e ? "true": "false";
            case "number":
                return isFinite(e) ? e: "";
            default:
                return ""
            }
        };
        t.exports = function(e, t, r, a) {
            return t = t || "&",
            r = r || "=",
            null === e && (e = void 0),
            "object" == typeof e ? n(s(e),
            function(s) {
                var a = encodeURIComponent(i(s)) + r;
                return o(e[s]) ? n(e[s],
                function(e) {
                    return a + encodeURIComponent(i(e))
                }).join(t) : a + encodeURIComponent(i(e[s]))
            }).join(t) : a ? encodeURIComponent(i(a)) + r + encodeURIComponent(i(e)) : ""
        };
        var o = Array.isArray ||
        function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        },
        s = Object.keys ||
        function(e) {
            var t = [];
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
            return t
        }
    },
    {}],
    11 : [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        t.exports = function(e, t, r, o) {
            t = t || "&",
            r = r || "=";
            var s = {};
            if ("string" != typeof e || 0 === e.length) return s;
            var a = /\+/g;
            e = e.split(t);
            var u = 1e3;
            o && "number" == typeof o.maxKeys && (u = o.maxKeys);
            var c = e.length;
            u > 0 && c > u && (c = u);
            for (var h = 0; h < c; ++h) {
                var l, p, f, d, m = e[h].replace(a, "%20"),
                v = m.indexOf(r);
                v >= 0 ? (l = m.substr(0, v), p = m.substr(v + 1)) : (l = m, p = ""),
                f = decodeURIComponent(l),
                d = decodeURIComponent(p),
                n(s, f) ? i(s[f]) ? s[f].push(d) : s[f] = [s[f], d] : s[f] = d
            }
            return s
        };
        var i = Array.isArray ||
        function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
    },
    {}],
    10 : [function(e, t, r) { (function(e) { !
            function(n) {
                function i(e) {
                    throw RangeError(q[e])
                }
                function o(e, t) {
                    for (var r = e.length,
                    n = []; r--;) n[r] = t(e[r]);
                    return n
                }
                function s(e, t) {
                    var r = e.split("@"),
                    n = "";
                    return r.length > 1 && (n = r[0] + "@", e = r[1]),
                    e = e.replace(P, "."),
                    n + o(e.split("."), t).join(".")
                }
                function a(e) {
                    for (var t, r, n = [], i = 0, o = e.length; i < o;) t = e.charCodeAt(i++),
                    t >= 55296 && t <= 56319 && i < o ? (r = e.charCodeAt(i++), 56320 == (64512 & r) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), i--)) : n.push(t);
                    return n
                }
                function u(e) {
                    return o(e,
                    function(e) {
                        var t = "";
                        return e > 65535 && (e -= 65536, t += N(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e),
                        t += N(e)
                    }).join("")
                }
                function c(e) {
                    return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : _
                }
                function h(e, t) {
                    return e + 22 + 75 * (e < 26) - ((0 != t) << 5)
                }
                function l(e, t, r) {
                    var n = 0;
                    for (e = r ? U(e / R) : e >> 1, e += U(e / t); e > O * C >> 1; n += _) e = U(e / O);
                    return U(n + (O + 1) * e / (e + x))
                }
                function p(e) {
                    var t, r, n, o, s, a, h, p, f, d, m = [],
                    v = e.length,
                    g = 0,
                    y = T,
                    b = A;
                    for (r = e.lastIndexOf(k), r < 0 && (r = 0), n = 0; n < r; ++n) e.charCodeAt(n) >= 128 && i("not-basic"),
                    m.push(e.charCodeAt(n));
                    for (o = r > 0 ? r + 1 : 0; o < v;) {
                        for (s = g, a = 1, h = _; o >= v && i("invalid-input"), p = c(e.charCodeAt(o++)), (p >= _ || p > U((E - g) / a)) && i("overflow"), g += p * a, f = h <= b ? S: h >= b + C ? C: h - b, !(p < f); h += _) d = _ - f,
                        a > U(E / d) && i("overflow"),
                        a *= d;
                        t = m.length + 1,
                        b = l(g - s, t, 0 == s),
                        U(g / t) > E - y && i("overflow"),
                        y += U(g / t),
                        g %= t,
                        m.splice(g++, 0, y)
                    }
                    return u(m)
                }
                function f(e) {
                    var t, r, n, o, s, u, c, p, f, d, m, v, g, y, b, w = [];
                    for (e = a(e), v = e.length, t = T, r = 0, s = A, u = 0; u < v; ++u)(m = e[u]) < 128 && w.push(N(m));
                    for (n = o = w.length, o && w.push(k); n < v;) {
                        for (c = E, u = 0; u < v; ++u)(m = e[u]) >= t && m < c && (c = m);
                        for (g = n + 1, c - t > U((E - r) / g) && i("overflow"), r += (c - t) * g, t = c, u = 0; u < v; ++u) if (m = e[u], m < t && ++r > E && i("overflow"), m == t) {
                            for (p = r, f = _; d = f <= s ? S: f >= s + C ? C: f - s, !(p < d); f += _) b = p - d,
                            y = _ - d,
                            w.push(N(h(d + b % y, 0))),
                            p = U(b / y);
                            w.push(N(h(p, 0))),
                            s = l(r, g, n == o),
                            r = 0,
                            ++n
                        }++r,
                        ++t
                    }
                    return w.join("")
                }
                function d(e) {
                    return s(e,
                    function(e) {
                        return I.test(e) ? p(e.slice(4).toLowerCase()) : e
                    })
                }
                function m(e) {
                    return s(e,
                    function(e) {
                        return L.test(e) ? "xn--" + f(e) : e
                    })
                }
                var v = "object" == typeof r && r && !r.nodeType && r,
                g = "object" == typeof t && t && !t.nodeType && t,
                y = "object" == typeof e && e;
                y.global !== y && y.window !== y && y.self !== y || (n = y);
                var b, w, E = 2147483647,
                _ = 36,
                S = 1,
                C = 26,
                x = 38,
                R = 700,
                A = 72,
                T = 128,
                k = "-",
                I = /^xn--/,
                L = /[^\x20-\x7E]/,
                P = /[\x2E\u3002\uFF0E\uFF61]/g,
                q = {
                    overflow: "Overflow: input needs wider integers to process",
                    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                    "invalid-input": "Invalid input"
                },
                O = _ - S,
                U = Math.floor,
                N = String.fromCharCode;
                if (b = {
                    version: "1.3.2",
                    ucs2: {
                        decode: a,
                        encode: u
                    },
                    decode: p,
                    encode: f,
                    toASCII: m,
                    toUnicode: d
                },
                "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode",
                function() {
                    return b
                });
                else if (v && g) if (t.exports == v) g.exports = b;
                else for (w in b) b.hasOwnProperty(w) && (v[w] = b[w]);
                else n.punycode = b
            } (this)
        }).call(this, "undefined" != typeof global ? global: "undefined" != typeof self ? self: "undefined" != typeof window ? window: {})
    },
    {}],
    4 : [function(e, t, r) {
        function n() {
            this._events = this._events || {},
            this._maxListeners = this._maxListeners || void 0
        }
        function i(e) {
            return "function" == typeof e
        }
        function o(e) {
            return "number" == typeof e
        }
        function s(e) {
            return "object" == typeof e && null !== e
        }
        function a(e) {
            return void 0 === e
        }
        t.exports = n,
        n.EventEmitter = n,
        n.prototype._events = void 0,
        n.prototype._maxListeners = void 0,
        n.defaultMaxListeners = 10,
        n.prototype.setMaxListeners = function(e) {
            if (!o(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
            return this._maxListeners = e,
            this
        },
        n.prototype.emit = function(e) {
            var t, r, n, o, u, c;
            if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
                if ((t = arguments[1]) instanceof Error) throw t;
                var h = new Error('Uncaught, unspecified "error" event. (' + t + ")");
                throw h.context = t,
                h
            }
            if (r = this._events[e], a(r)) return ! 1;
            if (i(r)) switch (arguments.length) {
            case 1:
                r.call(this);
                break;
            case 2:
                r.call(this, arguments[1]);
                break;
            case 3:
                r.call(this, arguments[1], arguments[2]);
                break;
            default:
                o = Array.prototype.slice.call(arguments, 1),
                r.apply(this, o)
            } else if (s(r)) for (o = Array.prototype.slice.call(arguments, 1), c = r.slice(), n = c.length, u = 0; u < n; u++) c[u].apply(this, o);
            return ! 0
        },
        n.prototype.addListener = function(e, t) {
            var r;
            if (!i(t)) throw TypeError("listener must be a function");
            return this._events || (this._events = {}),
            this._events.newListener && this.emit("newListener", e, i(t.listener) ? t.listener: t),
            this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t,
            s(this._events[e]) && !this._events[e].warned && (r = a(this._maxListeners) ? n.defaultMaxListeners: this._maxListeners) && r > 0 && this._events[e].length > r && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()),
            this
        },
        n.prototype.on = n.prototype.addListener,
        n.prototype.once = function(e, t) {
            function r() {
                this.removeListener(e, r),
                n || (n = !0, t.apply(this, arguments))
            }
            if (!i(t)) throw TypeError("listener must be a function");
            var n = !1;
            return r.listener = t,
            this.on(e, r),
            this
        },
        n.prototype.removeListener = function(e, t) {
            var r, n, o, a;
            if (!i(t)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[e]) return this;
            if (r = this._events[e], o = r.length, n = -1, r === t || i(r.listener) && r.listener === t) delete this._events[e],
            this._events.removeListener && this.emit("removeListener", e, t);
            else if (s(r)) {
                for (a = o; a-->0;) if (r[a] === t || r[a].listener && r[a].listener === t) {
                    n = a;
                    break
                }
                if (n < 0) return this;
                1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(n, 1),
                this._events.removeListener && this.emit("removeListener", e, t)
            }
            return this
        },
        n.prototype.removeAllListeners = function(e) {
            var t, r;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {}: this._events[e] && delete this._events[e],
            this;
            if (0 === arguments.length) {
                for (t in this._events)"removeListener" !== t && this.removeAllListeners(t);
                return this.removeAllListeners("removeListener"),
                this._events = {},
                this
            }
            if (r = this._events[e], i(r)) this.removeListener(e, r);
            else if (r) for (; r.length;) this.removeListener(e, r[r.length - 1]);
            return delete this._events[e],
            this
        },
        n.prototype.listeners = function(e) {
            return this._events && this._events[e] ? i(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
        },
        n.prototype.listenerCount = function(e) {
            if (this._events) {
                var t = this._events[e];
                if (i(t)) return 1;
                if (t) return t.length
            }
            return 0
        },
        n.listenerCount = function(e, t) {
            return e.listenerCount(t)
        }
    },
    {}],
    3 : [function(e, t, r) { (function(t, n) {
            "use strict";
            function i() {
                return n.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            }
            function o(e, t) {
                if (i() < t) throw new RangeError("Invalid typed array length");
                return n.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = n.prototype) : (null === e && (e = new n(t)), e.length = t),
                e
            }
            function n(e, t, r) {
                if (! (n.TYPED_ARRAY_SUPPORT || this instanceof n)) return new n(e, t, r);
                if ("number" == typeof e) {
                    if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                    return c(this, e)
                }
                return s(this, e, t, r)
            }
            function s(e, t, r, n) {
                if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? p(e, t, r, n) : "string" == typeof t ? h(e, t, r) : f(e, t)
            }
            function a(e) {
                if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
                if (e < 0) throw new RangeError('"size" argument must not be negative')
            }
            function u(e, t, r, n) {
                return a(t),
                t <= 0 ? o(e, t) : void 0 !== r ? "string" == typeof n ? o(e, t).fill(r, n) : o(e, t).fill(r) : o(e, t)
            }
            function c(e, t) {
                if (a(t), e = o(e, t < 0 ? 0 : 0 | d(t)), !n.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) e[r] = 0;
                return e
            }
            function h(e, t, r) {
                if ("string" == typeof r && "" !== r || (r = "utf8"), !n.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
                var i = 0 | v(t, r);
                e = o(e, i);
                var s = e.write(t, r);
                return s !== i && (e = e.slice(0, s)),
                e
            }
            function l(e, t) {
                var r = t.length < 0 ? 0 : 0 | d(t.length);
                e = o(e, r);
                for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
                return e
            }
            function p(e, t, r, i) {
                if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
                if (t.byteLength < r + (i || 0)) throw new RangeError("'length' is out of bounds");
                return t = void 0 === r && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, r) : new Uint8Array(t, r, i),
                n.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = n.prototype) : e = l(e, t),
                e
            }
            function f(e, t) {
                if (n.isBuffer(t)) {
                    var r = 0 | d(t.length);
                    return e = o(e, r),
                    0 === e.length ? e: (t.copy(e, 0, 0, r), e)
                }
                if (t) {
                    if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || G(t.length) ? o(e, 0) : l(e, t);
                    if ("Buffer" === t.type && $(t.data)) return l(e, t.data)
                }
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }
            function d(e) {
                if (e >= i()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i().toString(16) + " bytes");
                return 0 | e
            }
            function m(e) {
                return + e != e && (e = 0),
                n.alloc( + e)
            }
            function v(e, t) {
                if (n.isBuffer(e)) return e.length;
                if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
                "string" != typeof e && (e = "" + e);
                var r = e.length;
                if (0 === r) return 0;
                for (var i = !1;;) switch (t) {
                case "ascii":
                case "latin1":
                case "binary":
                    return r;
                case "utf8":
                case "utf-8":
                case void 0:
                    return V(e).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return 2 * r;
                case "hex":
                    return r >>> 1;
                case "base64":
                    return W(e).length;
                default:
                    if (i) return V(e).length;
                    t = ("" + t).toLowerCase(),
                    i = !0
                }
            }
            function g(e, t, r) {
                var n = !1;
                if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                if (r >>>= 0, t >>>= 0, r <= t) return "";
                for (e || (e = "utf8");;) switch (e) {
                case "hex":
                    return P(this, t, r);
                case "utf8":
                case "utf-8":
                    return T(this, t, r);
                case "ascii":
                    return I(this, t, r);
                case "latin1":
                case "binary":
                    return L(this, t, r);
                case "base64":
                    return A(this, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return q(this, t, r);
                default:
                    if (n) throw new TypeError("Unknown encoding: " + e);
                    e = (e + "").toLowerCase(),
                    n = !0
                }
            }
            function y(e, t, r) {
                var n = e[t];
                e[t] = e[r],
                e[r] = n
            }
            function b(e, t, r, i, o) {
                if (0 === e.length) return - 1;
                if ("string" == typeof r ? (i = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = o ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                    if (o) return - 1;
                    r = e.length - 1
                } else if (r < 0) {
                    if (!o) return - 1;
                    r = 0
                }
                if ("string" == typeof t && (t = n.from(t, i)), n.isBuffer(t)) return 0 === t.length ? -1 : w(e, t, r, i, o);
                if ("number" == typeof t) return t &= 255,
                n.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : w(e, [t], r, i, o);
                throw new TypeError("val must be string, number or Buffer")
            }
            function w(e, t, r, n, i) {
                function o(e, t) {
                    return 1 === s ? e[t] : e.readUInt16BE(t * s)
                }
                var s = 1,
                a = e.length,
                u = t.length;
                if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                    if (e.length < 2 || t.length < 2) return - 1;
                    s = 2,
                    a /= 2,
                    u /= 2,
                    r /= 2
                }
                var c;
                if (i) {
                    var h = -1;
                    for (c = r; c < a; c++) if (o(e, c) === o(t, -1 === h ? 0 : c - h)) {
                        if ( - 1 === h && (h = c), c - h + 1 === u) return h * s
                    } else - 1 !== h && (c -= c - h),
                    h = -1
                } else for (r + u > a && (r = a - u), c = r; c >= 0; c--) {
                    for (var l = !0,
                    p = 0; p < u; p++) if (o(e, c + p) !== o(t, p)) {
                        l = !1;
                        break
                    }
                    if (l) return c
                }
                return - 1
            }
            function E(e, t, r, n) {
                r = Number(r) || 0;
                var i = e.length - r;
                n ? (n = Number(n)) > i && (n = i) : n = i;
                var o = t.length;
                if (o % 2 != 0) throw new TypeError("Invalid hex string");
                n > o / 2 && (n = o / 2);
                for (var s = 0; s < n; ++s) {
                    var a = parseInt(t.substr(2 * s, 2), 16);
                    if (isNaN(a)) return s;
                    e[r + s] = a
                }
                return s
            }
            function _(e, t, r, n) {
                return Y(V(t, e.length - r), e, r, n)
            }
            function S(e, t, r, n) {
                return Y(K(t), e, r, n)
            }
            function C(e, t, r, n) {
                return S(e, t, r, n)
            }
            function x(e, t, r, n) {
                return Y(W(t), e, r, n)
            }
            function R(e, t, r, n) {
                return Y(X(t, e.length - r), e, r, n)
            }
            function A(e, t, r) {
                return 0 === t && r === e.length ? J.fromByteArray(e) : J.fromByteArray(e.slice(t, r))
            }
            function T(e, t, r) {
                r = Math.min(e.length, r);
                for (var n = [], i = t; i < r;) {
                    var o = e[i],
                    s = null,
                    a = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
                    if (i + a <= r) {
                        var u, c, h, l;
                        switch (a) {
                        case 1:
                            o < 128 && (s = o);
                            break;
                        case 2:
                            u = e[i + 1],
                            128 == (192 & u) && (l = (31 & o) << 6 | 63 & u) > 127 && (s = l);
                            break;
                        case 3:
                            u = e[i + 1],
                            c = e[i + 2],
                            128 == (192 & u) && 128 == (192 & c) && (l = (15 & o) << 12 | (63 & u) << 6 | 63 & c) > 2047 && (l < 55296 || l > 57343) && (s = l);
                            break;
                        case 4:
                            u = e[i + 1],
                            c = e[i + 2],
                            h = e[i + 3],
                            128 == (192 & u) && 128 == (192 & c) && 128 == (192 & h) && (l = (15 & o) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & h) > 65535 && l < 1114112 && (s = l)
                        }
                    }
                    null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, n.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s),
                    n.push(s),
                    i += a
                }
                return k(n)
            }
            function k(e) {
                var t = e.length;
                if (t <= Q) return String.fromCharCode.apply(String, e);
                for (var r = "",
                n = 0; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += Q));
                return r
            }
            function I(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
                return n
            }
            function L(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
                return n
            }
            function P(e, t, r) {
                var n = e.length; (!t || t < 0) && (t = 0),
                (!r || r < 0 || r > n) && (r = n);
                for (var i = "",
                o = t; o < r; ++o) i += z(e[o]);
                return i
            }
            function q(e, t, r) {
                for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                return i
            }
            function O(e, t, r) {
                if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
            }
            function U(e, t, r, i, o, s) {
                if (!n.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > o || t < s) throw new RangeError('"value" argument is out of bounds');
                if (r + i > e.length) throw new RangeError("Index out of range")
            }
            function N(e, t, r, n) {
                t < 0 && (t = 65535 + t + 1);
                for (var i = 0,
                o = Math.min(e.length - r, 2); i < o; ++i) e[r + i] = (t & 255 << 8 * (n ? i: 1 - i)) >>> 8 * (n ? i: 1 - i)
            }
            function D(e, t, r, n) {
                t < 0 && (t = 4294967295 + t + 1);
                for (var i = 0,
                o = Math.min(e.length - r, 4); i < o; ++i) e[r + i] = t >>> 8 * (n ? i: 3 - i) & 255
            }
            function M(e, t, r, n, i, o) {
                if (r + n > e.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range")
            }
            function j(e, t, r, n, i) {
                return i || M(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38),
                Z.write(e, t, r, n, 23, 4),
                r + 4
            }
            function B(e, t, r, n, i) {
                return i || M(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308),
                Z.write(e, t, r, n, 52, 8),
                r + 8
            }
            function H(e) {
                if (e = F(e).replace(ee, ""), e.length < 2) return "";
                for (; e.length % 4 != 0;) e += "=";
                return e
            }
            function F(e) {
                return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
            }
            function z(e) {
                return e < 16 ? "0" + e.toString(16) : e.toString(16)
            }
            function V(e, t) {
                t = t || 1 / 0;
                for (var r, n = e.length,
                i = null,
                o = [], s = 0; s < n; ++s) {
                    if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                        if (!i) {
                            if (r > 56319) { (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === n) { (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            i = r;
                            continue
                        }
                        if (r < 56320) { (t -= 3) > -1 && o.push(239, 191, 189),
                            i = r;
                            continue
                        }
                        r = 65536 + (i - 55296 << 10 | r - 56320)
                    } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                    if (i = null, r < 128) {
                        if ((t -= 1) < 0) break;
                        o.push(r)
                    } else if (r < 2048) {
                        if ((t -= 2) < 0) break;
                        o.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((t -= 3) < 0) break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else {
                        if (! (r < 1114112)) throw new Error("Invalid code point");
                        if ((t -= 4) < 0) break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    }
                }
                return o
            }
            function K(e) {
                for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                return t
            }
            function X(e, t) {
                for (var r, n, i, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s),
                n = r >> 8,
                i = r % 256,
                o.push(i),
                o.push(n);
                return o
            }
            function W(e) {
                return J.toByteArray(H(e))
            }
            function Y(e, t, r, n) {
                for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
                return i
            }
            function G(e) {
                return e !== e
            }
            var J = e("base64-js"),
            Z = e("ieee754"),
            $ = e("isarray");
            r.Buffer = n,
            r.SlowBuffer = m,
            r.INSPECT_MAX_BYTES = 50,
            n.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT: function() {
                try {
                    var e = new Uint8Array(1);
                    return e.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function() {
                            return 42
                        }
                    },
                    42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
                } catch(e) {
                    return ! 1
                }
            } (),
            r.kMaxLength = i(),
            n.poolSize = 8192,
            n._augment = function(e) {
                return e.__proto__ = n.prototype,
                e
            },
            n.from = function(e, t, r) {
                return s(null, e, t, r)
            },
            n.TYPED_ARRAY_SUPPORT && (n.prototype.__proto__ = Uint8Array.prototype, n.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && n[Symbol.species] === n && Object.defineProperty(n, Symbol.species, {
                value: null,
                configurable: !0
            })),
            n.alloc = function(e, t, r) {
                return u(null, e, t, r)
            },
            n.allocUnsafe = function(e) {
                return c(null, e)
            },
            n.allocUnsafeSlow = function(e) {
                return c(null, e)
            },
            n.isBuffer = function(e) {
                return ! (null == e || !e._isBuffer)
            },
            n.compare = function(e, t) {
                if (!n.isBuffer(e) || !n.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                if (e === t) return 0;
                for (var r = e.length,
                i = t.length,
                o = 0,
                s = Math.min(r, i); o < s; ++o) if (e[o] !== t[o]) {
                    r = e[o],
                    i = t[o];
                    break
                }
                return r < i ? -1 : i < r ? 1 : 0
            },
            n.isEncoding = function(e) {
                switch (String(e).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return ! 0;
                default:
                    return ! 1
                }
            },
            n.concat = function(e, t) {
                if (!$(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === e.length) return n.alloc(0);
                var r;
                if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                var i = n.allocUnsafe(t),
                o = 0;
                for (r = 0; r < e.length; ++r) {
                    var s = e[r];
                    if (!n.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');
                    s.copy(i, o),
                    o += s.length
                }
                return i
            },
            n.byteLength = v,
            n.prototype._isBuffer = !0,
            n.prototype.swap16 = function() {
                var e = this.length;
                if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var t = 0; t < e; t += 2) y(this, t, t + 1);
                return this
            },
            n.prototype.swap32 = function() {
                var e = this.length;
                if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var t = 0; t < e; t += 4) y(this, t, t + 3),
                y(this, t + 1, t + 2);
                return this
            },
            n.prototype.swap64 = function() {
                var e = this.length;
                if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var t = 0; t < e; t += 8) y(this, t, t + 7),
                y(this, t + 1, t + 6),
                y(this, t + 2, t + 5),
                y(this, t + 3, t + 4);
                return this
            },
            n.prototype.toString = function() {
                var e = 0 | this.length;
                return 0 === e ? "": 0 === arguments.length ? T(this, 0, e) : g.apply(this, arguments)
            },
            n.prototype.equals = function(e) {
                if (!n.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                return this === e || 0 === n.compare(this, e)
            },
            n.prototype.inspect = function() {
                var e = "",
                t = r.INSPECT_MAX_BYTES;
                return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")),
                "<Buffer " + e + ">"
            },
            n.prototype.compare = function(e, t, r, i, o) {
                if (!n.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length: 0), void 0 === i && (i = 0), void 0 === o && (o = this.length), t < 0 || r > e.length || i < 0 || o > this.length) throw new RangeError("out of range index");
                if (i >= o && t >= r) return 0;
                if (i >= o) return - 1;
                if (t >= r) return 1;
                if (t >>>= 0, r >>>= 0, i >>>= 0, o >>>= 0, this === e) return 0;
                for (var s = o - i,
                a = r - t,
                u = Math.min(s, a), c = this.slice(i, o), h = e.slice(t, r), l = 0; l < u; ++l) if (c[l] !== h[l]) {
                    s = c[l],
                    a = h[l];
                    break
                }
                return s < a ? -1 : a < s ? 1 : 0
            },
            n.prototype.includes = function(e, t, r) {
                return - 1 !== this.indexOf(e, t, r)
            },
            n.prototype.indexOf = function(e, t, r) {
                return b(this, e, t, r, !0)
            },
            n.prototype.lastIndexOf = function(e, t, r) {
                return b(this, e, t, r, !1)
            },
            n.prototype.write = function(e, t, r, n) {
                if (void 0 === t) n = "utf8",
                r = this.length,
                t = 0;
                else if (void 0 === r && "string" == typeof t) n = t,
                r = this.length,
                t = 0;
                else {
                    if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    t |= 0,
                    isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
                }
                var i = this.length - t;
                if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                n || (n = "utf8");
                for (var o = !1;;) switch (n) {
                case "hex":
                    return E(this, e, t, r);
                case "utf8":
                case "utf-8":
                    return _(this, e, t, r);
                case "ascii":
                    return S(this, e, t, r);
                case "latin1":
                case "binary":
                    return C(this, e, t, r);
                case "base64":
                    return x(this, e, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return R(this, e, t, r);
                default:
                    if (o) throw new TypeError("Unknown encoding: " + n);
                    n = ("" + n).toLowerCase(),
                    o = !0
                }
            },
            n.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            };
            var Q = 4096;
            n.prototype.slice = function(e, t) {
                var r = this.length;
                e = ~~e,
                t = void 0 === t ? r: ~~t,
                e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
                t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
                t < e && (t = e);
                var i;
                if (n.TYPED_ARRAY_SUPPORT) i = this.subarray(e, t),
                i.__proto__ = n.prototype;
                else {
                    var o = t - e;
                    i = new n(o, void 0);
                    for (var s = 0; s < o; ++s) i[s] = this[s + e]
                }
                return i
            },
            n.prototype.readUIntLE = function(e, t, r) {
                e |= 0,
                t |= 0,
                r || O(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                return n
            },
            n.prototype.readUIntBE = function(e, t, r) {
                e |= 0,
                t |= 0,
                r || O(e, t, this.length);
                for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) n += this[e + --t] * i;
                return n
            },
            n.prototype.readUInt8 = function(e, t) {
                return t || O(e, 1, this.length),
                this[e]
            },
            n.prototype.readUInt16LE = function(e, t) {
                return t || O(e, 2, this.length),
                this[e] | this[e + 1] << 8
            },
            n.prototype.readUInt16BE = function(e, t) {
                return t || O(e, 2, this.length),
                this[e] << 8 | this[e + 1]
            },
            n.prototype.readUInt32LE = function(e, t) {
                return t || O(e, 4, this.length),
                (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
            },
            n.prototype.readUInt32BE = function(e, t) {
                return t || O(e, 4, this.length),
                16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            },
            n.prototype.readIntLE = function(e, t, r) {
                e |= 0,
                t |= 0,
                r || O(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                return i *= 128,
                n >= i && (n -= Math.pow(2, 8 * t)),
                n
            },
            n.prototype.readIntBE = function(e, t, r) {
                e |= 0,
                t |= 0,
                r || O(e, t, this.length);
                for (var n = t,
                i = 1,
                o = this[e + --n]; n > 0 && (i *= 256);) o += this[e + --n] * i;
                return i *= 128,
                o >= i && (o -= Math.pow(2, 8 * t)),
                o
            },
            n.prototype.readInt8 = function(e, t) {
                return t || O(e, 1, this.length),
                128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
            },
            n.prototype.readInt16LE = function(e, t) {
                t || O(e, 2, this.length);
                var r = this[e] | this[e + 1] << 8;
                return 32768 & r ? 4294901760 | r: r
            },
            n.prototype.readInt16BE = function(e, t) {
                t || O(e, 2, this.length);
                var r = this[e + 1] | this[e] << 8;
                return 32768 & r ? 4294901760 | r: r
            },
            n.prototype.readInt32LE = function(e, t) {
                return t || O(e, 4, this.length),
                this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            },
            n.prototype.readInt32BE = function(e, t) {
                return t || O(e, 4, this.length),
                this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            },
            n.prototype.readFloatLE = function(e, t) {
                return t || O(e, 4, this.length),
                Z.read(this, e, !0, 23, 4)
            },
            n.prototype.readFloatBE = function(e, t) {
                return t || O(e, 4, this.length),
                Z.read(this, e, !1, 23, 4)
            },
            n.prototype.readDoubleLE = function(e, t) {
                return t || O(e, 8, this.length),
                Z.read(this, e, !0, 52, 8)
            },
            n.prototype.readDoubleBE = function(e, t) {
                return t || O(e, 8, this.length),
                Z.read(this, e, !1, 52, 8)
            },
            n.prototype.writeUIntLE = function(e, t, r, n) {
                if (e = +e, t |= 0, r |= 0, !n) {
                    U(this, e, t, r, Math.pow(2, 8 * r) - 1, 0)
                }
                var i = 1,
                o = 0;
                for (this[t] = 255 & e; ++o < r && (i *= 256);) this[t + o] = e / i & 255;
                return t + r
            },
            n.prototype.writeUIntBE = function(e, t, r, n) {
                if (e = +e, t |= 0, r |= 0, !n) {
                    U(this, e, t, r, Math.pow(2, 8 * r) - 1, 0)
                }
                var i = r - 1,
                o = 1;
                for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) this[t + i] = e / o & 255;
                return t + r
            },
            n.prototype.writeUInt8 = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 1, 255, 0),
                n.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
                this[t] = 255 & e,
                t + 1
            },
            n.prototype.writeUInt16LE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 2, 65535, 0),
                n.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0),
                t + 2
            },
            n.prototype.writeUInt16BE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 2, 65535, 0),
                n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1),
                t + 2
            },
            n.prototype.writeUInt32LE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 4, 4294967295, 0),
                n.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : D(this, e, t, !0),
                t + 4
            },
            n.prototype.writeUInt32BE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 4, 4294967295, 0),
                n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : D(this, e, t, !1),
                t + 4
            },
            n.prototype.writeIntLE = function(e, t, r, n) {
                if (e = +e, t |= 0, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    U(this, e, t, r, i - 1, -i)
                }
                var o = 0,
                s = 1,
                a = 0;
                for (this[t] = 255 & e; ++o < r && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1),
                this[t + o] = (e / s >> 0) - a & 255;
                return t + r
            },
            n.prototype.writeIntBE = function(e, t, r, n) {
                if (e = +e, t |= 0, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    U(this, e, t, r, i - 1, -i)
                }
                var o = r - 1,
                s = 1,
                a = 0;
                for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1),
                this[t + o] = (e / s >> 0) - a & 255;
                return t + r
            },
            n.prototype.writeInt8 = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 1, 127, -128),
                n.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
                e < 0 && (e = 255 + e + 1),
                this[t] = 255 & e,
                t + 1
            },
            n.prototype.writeInt16LE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 2, 32767, -32768),
                n.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0),
                t + 2
            },
            n.prototype.writeInt16BE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 2, 32767, -32768),
                n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1),
                t + 2
            },
            n.prototype.writeInt32LE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 4, 2147483647, -2147483648),
                n.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : D(this, e, t, !0),
                t + 4
            },
            n.prototype.writeInt32BE = function(e, t, r) {
                return e = +e,
                t |= 0,
                r || U(this, e, t, 4, 2147483647, -2147483648),
                e < 0 && (e = 4294967295 + e + 1),
                n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : D(this, e, t, !1),
                t + 4
            },
            n.prototype.writeFloatLE = function(e, t, r) {
                return j(this, e, t, !0, r)
            },
            n.prototype.writeFloatBE = function(e, t, r) {
                return j(this, e, t, !1, r)
            },
            n.prototype.writeDoubleLE = function(e, t, r) {
                return B(this, e, t, !0, r)
            },
            n.prototype.writeDoubleBE = function(e, t, r) {
                return B(this, e, t, !1, r)
            },
            n.prototype.copy = function(e, t, r, i) {
                if (r || (r = 0), i || 0 === i || (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < r && (i = r), i === r) return 0;
                if (0 === e.length || 0 === this.length) return 0;
                if (t < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length),
                e.length - t < i - r && (i = e.length - t + r);
                var o, s = i - r;
                if (this === e && r < t && t < i) for (o = s - 1; o >= 0; --o) e[o + t] = this[o + r];
                else if (s < 1e3 || !n.TYPED_ARRAY_SUPPORT) for (o = 0; o < s; ++o) e[o + t] = this[o + r];
                else Uint8Array.prototype.set.call(e, this.subarray(r, r + s), t);
                return s
            },
            n.prototype.fill = function(e, t, r, i) {
                if ("string" == typeof e) {
                    if ("string" == typeof t ? (i = t, t = 0, r = this.length) : "string" == typeof r && (i = r, r = this.length), 1 === e.length) {
                        var o = e.charCodeAt(0);
                        o < 256 && (e = o)
                    }
                    if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                    if ("string" == typeof i && !n.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                } else "number" == typeof e && (e &= 255);
                if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                if (r <= t) return this;
                t >>>= 0,
                r = void 0 === r ? this.length: r >>> 0,
                e || (e = 0);
                var s;
                if ("number" == typeof e) for (s = t; s < r; ++s) this[s] = e;
                else {
                    var a = n.isBuffer(e) ? e: V(new n(e, i).toString()),
                    u = a.length;
                    for (s = 0; s < r - t; ++s) this[s + t] = a[s % u]
                }
                return this
            };
            var ee = /[^+\/0-9A-Za-z-_]/g
        }).call(this, "undefined" != typeof global ? global: "undefined" != typeof self ? self: "undefined" != typeof window ? window: {},
        e("buffer").Buffer)
    },
    {
        "base64-js": 1,
        buffer: 3,
        ieee754: 5,
        isarray: 7
    }],
    7 : [function(e, t, r) {
        var n = {}.toString;
        t.exports = Array.isArray ||
        function(e) {
            return "[object Array]" == n.call(e)
        }
    },
    {}],
    5 : [function(e, t, r) {
        r.read = function(e, t, r, n, i) {
            var o, s, a = 8 * i - n - 1,
            u = (1 << a) - 1,
            c = u >> 1,
            h = -7,
            l = r ? i - 1 : 0,
            p = r ? -1 : 1,
            f = e[t + l];
            for (l += p, o = f & (1 << -h) - 1, f >>= -h, h += a; h > 0; o = 256 * o + e[t + l], l += p, h -= 8);
            for (s = o & (1 << -h) - 1, o >>= -h, h += n; h > 0; s = 256 * s + e[t + l], l += p, h -= 8);
            if (0 === o) o = 1 - c;
            else {
                if (o === u) return s ? NaN: 1 / 0 * (f ? -1 : 1);
                s += Math.pow(2, n),
                o -= c
            }
            return (f ? -1 : 1) * s * Math.pow(2, o - n)
        },
        r.write = function(e, t, r, n, i, o) {
            var s, a, u, c = 8 * o - i - 1,
            h = (1 << c) - 1,
            l = h >> 1,
            p = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            f = n ? 0 : o - 1,
            d = n ? 1 : -1,
            m = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = h) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), t += s + l >= 1 ? p / u: p * Math.pow(2, 1 - l), t * u >= 2 && (s++, u /= 2), s + l >= h ? (a = 0, s = h) : s + l >= 1 ? (a = (t * u - 1) * Math.pow(2, i), s += l) : (a = t * Math.pow(2, l - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + f] = 255 & a, f += d, a /= 256, i -= 8);
            for (s = s << i | a, c += i; c > 0; e[r + f] = 255 & s, f += d, s /= 256, c -= 8);
            e[r + f - d] |= 128 * m
        }
    },
    {}],
    1 : [function(e, t, r) {
        "use strict";
        function n(e) {
            var t = e.length;
            if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
            var r = e.indexOf("=");
            return - 1 === r && (r = t),
            [r, r === t ? 0 : 4 - r % 4]
        }
        function i(e) {
            var t = n(e),
            r = t[0],
            i = t[1];
            return 3 * (r + i) / 4 - i
        }
        function o(e, t, r) {
            return 3 * (t + r) / 4 - r
        }
        function s(e) {
            for (var t, r = n(e), i = r[0], s = r[1], a = new p(o(e, i, s)), u = 0, c = s > 0 ? i - 4 : i, h = 0; h < c; h += 4) t = l[e.charCodeAt(h)] << 18 | l[e.charCodeAt(h + 1)] << 12 | l[e.charCodeAt(h + 2)] << 6 | l[e.charCodeAt(h + 3)],
            a[u++] = t >> 16 & 255,
            a[u++] = t >> 8 & 255,
            a[u++] = 255 & t;
            return 2 === s && (t = l[e.charCodeAt(h)] << 2 | l[e.charCodeAt(h + 1)] >> 4, a[u++] = 255 & t),
            1 === s && (t = l[e.charCodeAt(h)] << 10 | l[e.charCodeAt(h + 1)] << 4 | l[e.charCodeAt(h + 2)] >> 2, a[u++] = t >> 8 & 255, a[u++] = 255 & t),
            a
        }
        function a(e) {
            return h[e >> 18 & 63] + h[e >> 12 & 63] + h[e >> 6 & 63] + h[63 & e]
        }
        function u(e, t, r) {
            for (var n, i = [], o = t; o < r; o += 3) n = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (255 & e[o + 2]),
            i.push(a(n));
            return i.join("")
        }
        function c(e) {
            for (var t, r = e.length,
            n = r % 3,
            i = [], o = 0, s = r - n; o < s; o += 16383) i.push(u(e, o, o + 16383 > s ? s: o + 16383));
            return 1 === n ? (t = e[r - 1], i.push(h[t >> 2] + h[t << 4 & 63] + "==")) : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], i.push(h[t >> 10] + h[t >> 4 & 63] + h[t << 2 & 63] + "=")),
            i.join("")
        }
        r.byteLength = i,
        r.toByteArray = s,
        r.fromByteArray = c;
        for (var h = [], l = [], p = "undefined" != typeof Uint8Array ? Uint8Array: Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", d = 0, m = f.length; d < m; ++d) h[d] = f[d],
        l[f.charCodeAt(d)] = d;
        l["-".charCodeAt(0)] = 62,
        l["_".charCodeAt(0)] = 63
    },
    {}]
},
{},
[28]);
AWS.apiLoader.services.s3 = {},
AWS.S3 = AWS.Service.defineService("s3", ["2006-03-01"]),
_xamzrequire = function e(t, r, n) {
    function i(o, s) {
        if (!r[o]) {
            if (!t[o]) {
                var u = "function" == typeof _xamzrequire && _xamzrequire;
                if (!s && u) return u(o, !0);
                if (a) return a(o, !0);
                var c = new Error("Cannot find module '" + o + "'");
                throw c.code = "MODULE_NOT_FOUND",
                c
            }
            var l = r[o] = {
                exports: {}
            };
            t[o][0].call(l.exports,
            function(e) {
                var r = t[o][1][e];
                return i(r || e)
            },
            l, l.exports, e, t, r, n)
        }
        return r[o].exports
    }
    for (var a = "function" == typeof _xamzrequire && _xamzrequire,
    o = 0; o < n.length; o++) i(n[o]);
    return i
} ({
    103 : [function(e, t, r) {
        var n = e("../core"),
        i = e("../signers/v4_credentials");
        e("../s3/managed_upload");
        var a = {
            completeMultipartUpload: !0,
            copyObject: !0,
            uploadPartCopy: !0
        },
        o = ["AuthorizationHeaderMalformed", "BadRequest", "PermanentRedirect", 301];
        n.util.update(n.S3.prototype, {
            getSignatureVersion: function(e) {
                var t = this.api.signatureVersion,
                r = this._originalConfig ? this._originalConfig.signatureVersion: null,
                n = this.config.signatureVersion,
                i = !!e && e.isPresigned();
                return r ? r = "v2" === r ? "s3": r: (!0 !== i ? t = "v4": n && (t = n), t)
            },
            getSignerClass: function(e) {
                var t = this.getSignatureVersion(e);
                return n.Signers.RequestSigner.getVersion(t)
            },
            validateService: function() {
                var e, t = [];
                if (this.config.region || (this.config.region = "us-east-1"), !this.config.endpoint && this.config.s3BucketEndpoint && t.push("An endpoint must be provided when configuring `s3BucketEndpoint` to true."), 1 === t.length ? e = t[0] : t.length > 1 && (e = "Multiple configuration errors:\n" + t.join("\n")), e) throw n.util.error(new Error, {
                    name: "InvalidEndpoint",
                    message: e
                })
            },
            shouldDisableBodySigning: function(e) {
                var t = this.getSignerClass();
                return ! 0 === this.config.s3DisableBodySigning && t === n.Signers.V4 && "https:" === e.httpRequest.endpoint.protocol
            },
            setupRequestListeners: function(e) {
                e.addListener("validate", this.validateScheme),
                e.addListener("validate", this.validateBucketEndpoint),
                e.addListener("validate", this.correctBucketRegionFromCache),
                e.addListener("validate", this.validateBucketName, !0),
                e.addListener("build", this.addContentType),
                e.addListener("build", this.populateURI),
                e.addListener("build", this.computeContentMd5),
                e.addListener("build", this.computeSseCustomerKeyMd5),
                e.addListener("afterBuild", this.addExpect100Continue),
                e.removeListener("validate", n.EventListeners.Core.VALIDATE_REGION),
                e.addListener("extractError", this.extractError),
                e.onAsync("extractError", this.requestBucketRegion),
                e.addListener("extractData", this.extractData),
                e.addListener("extractData", n.util.hoistPayloadMember),
                e.addListener("beforePresign", this.prepareSignedUrl),
                n.util.isBrowser() && e.onAsync("retry", this.reqRegionForNetworkingError),
                this.shouldDisableBodySigning(e) && (e.removeListener("afterBuild", n.EventListeners.Core.COMPUTE_SHA256), e.addListener("afterBuild", this.disableBodySigning))
            },
            validateScheme: function(e) {
                var t = e.params,
                r = e.httpRequest.endpoint.protocol;
                if ((t.SSECustomerKey || t.CopySourceSSECustomerKey) && "https:" !== r) throw n.util.error(new Error, {
                    code: "ConfigError",
                    message: "Cannot send SSE keys over HTTP. Set 'sslEnabled'to 'true' in your configuration"
                })
            },
            validateBucketEndpoint: function(e) {
                if (!e.params.Bucket && e.service.config.s3BucketEndpoint) {
                    throw n.util.error(new Error, {
                        code: "ConfigError",
                        message: "Cannot send requests to root API with `s3BucketEndpoint` set."
                    })
                }
            },
            validateBucketName: function(e) {
                var t = e.service,
                r = t.getSignatureVersion(e),
                i = e.params && e.params.Bucket,
                a = e.params && e.params.Key,
                o = i && i.indexOf("/");
                if (i && o >= 0) if ("string" == typeof a && o > 0) {
                    e.params = n.util.copy(e.params);
                    var s = i.substr(o + 1) || "";
                    e.params.Key = s + "/" + a,
                    e.params.Bucket = i.substr(0, o)
                } else if ("v4" === r) {
                    var u = "Bucket names cannot contain forward slashes. Bucket: " + i;
                    throw n.util.error(new Error, {
                        code: "InvalidBucket",
                        message: u
                    })
                }
            },
            isValidAccelerateOperation: function(e) {
                return - 1 === ["createBucket", "deleteBucket", "listBuckets"].indexOf(e)
            },
            populateURI: function(e) {
                var t = e.httpRequest,
                r = e.params.Bucket,
                n = e.service,
                i = t.endpoint;
                if (r && !n.pathStyleBucketName(r)) {
                    n.config.useAccelerateEndpoint && n.isValidAccelerateOperation(e.operation) ? n.config.useDualstack ? i.hostname = r + ".s3-accelerate.dualstack.amazonaws.com": i.hostname = r + ".s3-accelerate.amazonaws.com": n.config.s3BucketEndpoint || (i.hostname = r + "." + i.hostname);
                    var a = i.port;
                    i.host = 80 !== a && 443 !== a ? i.hostname + ":" + i.port: i.hostname,
                    t.virtualHostedBucket = r,
                    n.removeVirtualHostedBucketFromPath(e)
                }
            },
            removeVirtualHostedBucketFromPath: function(e) {
                var t = e.httpRequest,
                r = t.virtualHostedBucket;
                if (r && t.path) {
                    if (e.params && e.params.Key) {
                        var i = "/" + n.util.uriEscapePath(e.params.Key);
                        if (0 === t.path.indexOf(i) && (t.path.length === i.length || "?" === t.path[i.length])) return
                    }
                    t.path = t.path.replace(new RegExp("/" + r), ""),
                    "/" !== t.path[0] && (t.path = "/" + t.path)
                }
            },
            addExpect100Continue: function(e) {
                var t = e.httpRequest.headers["Content-Length"];
                n.util.isNode() && (t >= 1048576 || e.params.Body instanceof n.util.stream.Stream) && (e.httpRequest.headers.Expect = "100-continue")
            },
            addContentType: function(e) {
                var t = e.httpRequest;
                if ("GET" === t.method || "HEAD" === t.method) return void delete t.headers["Content-Type"];
                t.headers["Content-Type"] || (t.headers["Content-Type"] = "application/octet-stream");
                var r = t.headers["Content-Type"];
                if (n.util.isBrowser()) if ("string" != typeof t.body || r.match(/;\s*charset=/)) {
                    var i = function(e, t, r) {
                        return t + r.toUpperCase()
                    };
                    t.headers["Content-Type"] = r.replace(/(;\s*charset=)(.+)$/, i)
                } else {
                    t.headers["Content-Type"] += "; charset=UTF-8"
                }
            },
            computableChecksumOperations: {
                putBucketCors: !0,
                putBucketLifecycle: !0,
                putBucketLifecycleConfiguration: !0,
                putBucketTagging: !0,
                deleteObjects: !0,
                putBucketReplication: !0,
                putObjectLegalHold: !0,
                putObjectRetention: !0,
                putObjectLockConfiguration: !0
            },
            willComputeChecksums: function(e) {
                if (this.computableChecksumOperations[e.operation]) return ! 0;
                if (!this.config.computeChecksums) return ! 1;
                if (!n.util.Buffer.isBuffer(e.httpRequest.body) && "string" != typeof e.httpRequest.body) return ! 1;
                var t = e.service.api.operations[e.operation].input.members;
                return ! (!e.service.shouldDisableBodySigning(e) || Object.prototype.hasOwnProperty.call(e.httpRequest.headers, "presigned-expires") || !t.ContentMD5 || e.params.ContentMD5) || !(e.service.getSignerClass(e) === n.Signers.V4 && t.ContentMD5 && !t.ContentMD5.required) && (!(!t.ContentMD5 || e.params.ContentMD5) || void 0)
            },
            computeContentMd5: function(e) {
                if (e.service.willComputeChecksums(e)) {
                    var t = n.util.crypto.md5(e.httpRequest.body, "base64");
                    e.httpRequest.headers["Content-MD5"] = t
                }
            },
            computeSseCustomerKeyMd5: function(e) {
                var t = {
                    SSECustomerKey: "x-amz-server-side-encryption-customer-key-MD5",
                    CopySourceSSECustomerKey: "x-amz-copy-source-server-side-encryption-customer-key-MD5"
                };
                n.util.each(t,
                function(t, r) {
                    if (e.params[t]) {
                        var i = n.util.crypto.md5(e.params[t], "base64");
                        e.httpRequest.headers[r] = i
                    }
                })
            },
            pathStyleBucketName: function(e) {
                return !! this.config.s3ForcePathStyle || !this.config.s3BucketEndpoint && (!this.dnsCompatibleBucketName(e) || !(!this.config.sslEnabled || !e.match(/\./)))
            },
            dnsCompatibleBucketName: function(e) {
                var t = e,
                r = new RegExp(/^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/),
                n = new RegExp(/(\d+\.){3}\d+/),
                i = new RegExp(/\.\./);
                return ! (!t.match(r) || t.match(n) || t.match(i))
            },
            successfulResponse: function(e) {
                var t = e.request,
                r = e.httpResponse;
                return (!a[t.operation] || !r.body.toString().match("<Error>")) && r.statusCode < 300
            },
            retryableError: function(e, t) {
                return ! (!a[t.operation] || 200 !== e.statusCode) || (!t._requestRegionForBucket || !t.service.bucketRegionCache[t._requestRegionForBucket]) && (!(!e || "RequestTimeout" !== e.code) || (e && -1 != o.indexOf(e.code) && e.region && e.region != t.httpRequest.region ? (t.httpRequest.region = e.region, 301 === e.statusCode && t.service.updateReqBucketRegion(t), !0) : n.Service.prototype.retryableError.call(this, e, t)))
            },
            updateReqBucketRegion: function(e, t) {
                var r = e.httpRequest;
                if ("string" == typeof t && t.length && (r.region = t), r.endpoint.host.match(/s3(?!-accelerate).*\.amazonaws\.com$/)) {
                    var i = e.service,
                    a = i.config,
                    o = a.s3BucketEndpoint;
                    o && delete a.s3BucketEndpoint;
                    var s = n.util.copy(a);
                    delete s.endpoint,
                    s.region = r.region,
                    r.endpoint = new n.S3(s).endpoint,
                    i.populateURI(e),
                    a.s3BucketEndpoint = o,
                    r.headers.Host = r.endpoint.host,
                    "validate" === e._asm.currentState && (e.removeListener("build", i.populateURI), e.addListener("build", i.removeVirtualHostedBucketFromPath))
                }
            },
            extractData: function(e) {
                var t = e.request;
                if ("getBucketLocation" === t.operation) {
                    var r = e.httpResponse.body.toString().match(/>(.+)<\/Location/);
                    delete e.data._,
                    e.data.LocationConstraint = r ? r[1] : ""
                }
                var n = t.params.Bucket || null;
                if ("deleteBucket" !== t.operation || "string" != typeof n || e.error) {
                    var i = e.httpResponse.headers || {},
                    a = i["x-amz-bucket-region"] || null;
                    if (!a && "createBucket" === t.operation && !e.error) {
                        var o = t.params.CreateBucketConfiguration;
                        a = o ? "EU" === o.LocationConstraint ? "eu-west-1": o.LocationConstraint: "us-east-1"
                    }
                    a && n && a !== t.service.bucketRegionCache[n] && (t.service.bucketRegionCache[n] = a)
                } else t.service.clearBucketRegionCache(n);
                t.service.extractRequestIds(e)
            },
            extractError: function(e) {
                var t = {
                    304 : "NotModified",
                    403 : "Forbidden",
                    400 : "BadRequest",
                    404 : "NotFound"
                },
                r = e.request,
                i = e.httpResponse.statusCode,
                a = e.httpResponse.body || "",
                o = e.httpResponse.headers || {},
                s = o["x-amz-bucket-region"] || null,
                u = r.params.Bucket || null,
                c = r.service.bucketRegionCache;
                s && u && s !== c[u] && (c[u] = s);
                var l;
                if (t[i] && 0 === a.length) u && !s && (l = c[u] || null) !== r.httpRequest.region && (s = l),
                e.error = n.util.error(new Error, {
                    code: t[i],
                    message: null,
                    region: s
                });
                else {
                    var p = (new n.XML.Parser).parse(a.toString());
                    p.Region && !s ? (s = p.Region, u && s !== c[u] && (c[u] = s)) : !u || s || p.Region || (l = c[u] || null) !== r.httpRequest.region && (s = l),
                    e.error = n.util.error(new Error, {
                        code: p.Code || i,
                        message: p.Message || null,
                        region: s
                    })
                }
                r.service.extractRequestIds(e)
            },
            requestBucketRegion: function(e, t) {
                var r = e.error,
                i = e.request,
                a = i.params.Bucket || null;
                if (!r || !a || r.region || "listObjects" === i.operation || n.util.isNode() && "headBucket" === i.operation || 400 === r.statusCode && "headObject" !== i.operation || -1 === o.indexOf(r.code)) return t();
                var s = n.util.isNode() ? "headBucket": "listObjects",
                u = {
                    Bucket: a
                };
                "listObjects" === s && (u.MaxKeys = 0);
                var c = i.service[s](u);
                c._requestRegionForBucket = a,
                c.send(function() {
                    var e = i.service.bucketRegionCache[a] || null;
                    r.region = e,
                    t()
                })
            },
            reqRegionForNetworkingError: function(e, t) {
                if (!n.util.isBrowser()) return t();
                var r = e.error,
                i = e.request,
                a = i.params.Bucket;
                if (!r || "NetworkingError" !== r.code || !a || "us-east-1" === i.httpRequest.region) return t();
                var o = i.service,
                s = o.bucketRegionCache,
                u = s[a] || null;
                if (u && u !== i.httpRequest.region) o.updateReqBucketRegion(i, u),
                t();
                else if (o.dnsCompatibleBucketName(a)) if (i.httpRequest.virtualHostedBucket) {
                    var c = o.listObjects({
                        Bucket: a,
                        MaxKeys: 0
                    });
                    o.updateReqBucketRegion(c, "us-east-1"),
                    c._requestRegionForBucket = a,
                    c.send(function() {
                        var e = o.bucketRegionCache[a] || null;
                        e && e !== i.httpRequest.region && o.updateReqBucketRegion(i, e),
                        t()
                    })
                } else t();
                else o.updateReqBucketRegion(i, "us-east-1"),
                "us-east-1" !== s[a] && (s[a] = "us-east-1"),
                t()
            },
            bucketRegionCache: {},
            clearBucketRegionCache: function(e) {
                var t = this.bucketRegionCache;
                e ? "string" == typeof e && (e = [e]) : e = Object.keys(t);
                for (var r = 0; r < e.length; r++) delete t[e[r]];
                return t
            },
            correctBucketRegionFromCache: function(e) {
                var t = e.params.Bucket || null;
                if (t) {
                    var r = e.service,
                    n = e.httpRequest.region,
                    i = r.bucketRegionCache[t];
                    i && i !== n && r.updateReqBucketRegion(e, i)
                }
            },
            extractRequestIds: function(e) {
                var t = e.httpResponse.headers ? e.httpResponse.headers["x-amz-id-2"] : null,
                r = e.httpResponse.headers ? e.httpResponse.headers["x-amz-cf-id"] : null;
                e.extendedRequestId = t,
                e.cfId = r,
                e.error && (e.error.requestId = e.requestId || null, e.error.extendedRequestId = t, e.error.cfId = r)
            },
            getSignedUrl: function(e, t, r) {
                t = n.util.copy(t || {});
                var i = t.Expires || 900;
                delete t.Expires;
                var a = this.makeRequest(e, t);
                if (!r) return a.presign(i, r);
                n.util.defer(function() {
                    a.presign(i, r)
                })
            },
            createPresignedPost: function(e, t) {
                function r() {
                    return {
                        url: n.util.urlFormat(u),
                        fields: o.preparePostFields(s.credentials, s.region, a, e.Fields, e.Conditions, e.Expires)
                    }
                }
                "function" == typeof e && void 0 === t && (t = e, e = null),
                e = n.util.copy(e || {});
                var i = this.config.params || {},
                a = e.Bucket || i.Bucket,
                o = this,
                s = this.config,
                u = n.util.copy(this.endpoint);
                if (s.s3BucketEndpoint || (u.pathname = "/" + a), !t) return r();
                s.getCredentials(function(e) {
                    e && t(e),
                    t(null, r())
                })
            },
            preparePostFields: function(e, t, r, a, o, s) {
                var u = this.getSkewCorrectedDate();
                if (!e || !t || !r) throw new Error("Unable to create a POST object policy without a bucket, region, and credentials");
                a = n.util.copy(a || {}),
                o = (o || []).slice(0),
                s = s || 3600;
                var c = n.util.date.iso8601(u).replace(/[:\-]|\.\d{3}/g, ""),
                l = c.substr(0, 8),
                p = i.createScope(l, t, "s3"),
                d = e.accessKeyId + "/" + p;
                a.bucket = r,
                a["X-Amz-Algorithm"] = "AWS4-HMAC-SHA256",
                a["X-Amz-Credential"] = d,
                a["X-Amz-Date"] = c,
                e.sessionToken && (a["X-Amz-Security-Token"] = e.sessionToken);
                for (var f in a) if (a.hasOwnProperty(f)) {
                    var h = {};
                    h[f] = a[f],
                    o.push(h)
                }
                return a.Policy = this.preparePostPolicy(new Date(u.valueOf() + 1e3 * s), o),
                a["X-Amz-Signature"] = n.util.crypto.hmac(i.getSigningKey(e, l, t, "s3", !0), a.Policy, "hex"),
                a
            },
            preparePostPolicy: function(e, t) {
                return n.util.base64.encode(JSON.stringify({
                    expiration: n.util.date.iso8601(e),
                    conditions: t
                }))
            },
            prepareSignedUrl: function(e) {
                e.addListener("validate", e.service.noPresignedContentLength),
                e.removeListener("build", e.service.addContentType),
                e.params.Body ? e.addListener("afterBuild", n.EventListeners.Core.COMPUTE_SHA256) : e.removeListener("build", e.service.computeContentMd5)
            },
            disableBodySigning: function(e) {
                var t = e.httpRequest.headers;
                Object.prototype.hasOwnProperty.call(t, "presigned-expires") || (t["X-Amz-Content-Sha256"] = "UNSIGNED-PAYLOAD")
            },
            noPresignedContentLength: function(e) {
                if (void 0 !== e.params.ContentLength) throw n.util.error(new Error, {
                    code: "UnexpectedParameter",
                    message: "ContentLength is not supported in pre-signed URLs."
                })
            },
            createBucket: function(e, t) {
                return "function" != typeof e && e || (t = t || e, e = {}),
                this.endpoint.hostname === this.api.globalEndpoint || e.CreateBucketConfiguration || (e.CreateBucketConfiguration = {
                    LocationConstraint: this.config.region
                }),
                this.makeRequest("createBucket", e, t)
            },
            upload: function(e, t, r) {
                "function" == typeof t && void 0 === r && (r = t, t = null),
                t = t || {},
                t = n.util.merge(t || {},
                {
                    service: this,
                    params: e
                });
                var i = new n.S3.ManagedUpload(t);
                return "function" == typeof r && i.send(r),
                i
            }
        })
    },
    {
        "../core": 38,
        "../s3/managed_upload": 87,
        "../signers/v4_credentials": 115
    }],
    87 : [function(e, t, r) {
        var n = e("../core"),
        i = n.util.string.byteLength,
        a = n.util.Buffer;
        n.S3.ManagedUpload = n.util.inherit({
            constructor: function(e) {
                var t = this;
                n.SequentialExecutor.call(t),
                t.body = null,
                t.sliceFn = null,
                t.callback = null,
                t.parts = {},
                t.completeInfo = [],
                t.fillQueue = function() {
                    t.callback(new Error("Unsupported body payload " + typeof t.body))
                },
                t.configure(e)
            },
            configure: function(e) {
                if (e = e || {},
                this.partSize = this.minPartSize, e.queueSize && (this.queueSize = e.queueSize), e.partSize && (this.partSize = e.partSize), e.leavePartsOnError && (this.leavePartsOnError = !0), e.tags) {
                    if (!Array.isArray(e.tags)) throw new Error("Tags must be specified as an array; " + typeof e.tags + " provided.");
                    this.tags = e.tags
                }
                if (this.partSize < this.minPartSize) throw new Error("partSize must be greater than " + this.minPartSize);
                this.service = e.service,
                this.bindServiceObject(e.params),
                this.validateBody(),
                this.adjustTotalBytes()
            },
            leavePartsOnError: !1,
            queueSize: 4,
            partSize: null,
            minPartSize: 5242880,
            maxTotalParts: 1e4,
            send: function(e) {
                var t = this;
                t.failed = !1,
                t.callback = e ||
                function(e) {
                    if (e) throw e
                };
                var r = !0;
                if (t.sliceFn) t.fillQueue = t.fillBuffer;
                else if (n.util.isNode()) {
                    var i = n.util.stream.Stream;
                    t.body instanceof i && (r = !1, t.fillQueue = t.fillStream, t.partBuffers = [], t.body.on("error",
                    function(e) {
                        t.cleanup(e)
                    }).on("readable",
                    function() {
                        t.fillQueue()
                    }).on("end",
                    function() {
                        t.isDoneChunking = !0,
                        t.numParts = t.totalPartNumbers,
                        t.fillQueue.call(t),
                        t.isDoneChunking && t.totalPartNumbers >= 1 && t.doneParts === t.numParts && t.finishMultiPart()
                    }))
                }
                r && t.fillQueue.call(t)
            },
            abort: function() {
                var e = this; ! 0 === e.isDoneChunking && 1 === e.totalPartNumbers && e.singlePart ? e.singlePart.abort() : e.cleanup(n.util.error(new Error("Request aborted by user"), {
                    code: "RequestAbortedError",
                    retryable: !1
                }))
            },
            validateBody: function() {
                var e = this;
                if (e.body = e.service.config.params.Body, "string" == typeof e.body) e.body = new n.util.Buffer(e.body);
                else if (!e.body) throw new Error("params.Body is required");
                e.sliceFn = n.util.arraySliceFn(e.body)
            },
            bindServiceObject: function(e) {
                e = e || {};
                var t = this;
                if (t.service) {
                    var r = t.service,
                    i = n.util.copy(r.config);
                    i.signatureVersion = r.getSignatureVersion(),
                    t.service = new r.constructor.__super__(i),
                    t.service.config.params = n.util.merge(t.service.config.params || {},
                    e)
                } else t.service = new n.S3({
                    params: e
                })
            },
            adjustTotalBytes: function() {
                var e = this;
                try {
                    e.totalBytes = i(e.body)
                } catch(e) {}
                if (e.totalBytes) {
                    var t = Math.ceil(e.totalBytes / e.maxTotalParts);
                    t > e.partSize && (e.partSize = t)
                } else e.totalBytes = void 0
            },
            isDoneChunking: !1,
            partPos: 0,
            totalChunkedBytes: 0,
            totalUploadedBytes: 0,
            totalBytes: void 0,
            numParts: 0,
            totalPartNumbers: 0,
            activeParts: 0,
            doneParts: 0,
            parts: null,
            completeInfo: null,
            failed: !1,
            multipartReq: null,
            partBuffers: null,
            partBufferLength: 0,
            fillBuffer: function() {
                var e = this,
                t = i(e.body);
                if (0 === t) return e.isDoneChunking = !0,
                e.numParts = 1,
                void e.nextChunk(e.body);
                for (; e.activeParts < e.queueSize && e.partPos < t;) {
                    var r = Math.min(e.partPos + e.partSize, t),
                    n = e.sliceFn.call(e.body, e.partPos, r);
                    e.partPos += e.partSize,
                    (i(n) < e.partSize || e.partPos === t) && (e.isDoneChunking = !0, e.numParts = e.totalPartNumbers + 1),
                    e.nextChunk(n)
                }
            },
            fillStream: function() {
                var e = this;
                if (! (e.activeParts >= e.queueSize)) {
                    var t = e.body.read(e.partSize - e.partBufferLength) || e.body.read();
                    if (t && (e.partBuffers.push(t), e.partBufferLength += t.length, e.totalChunkedBytes += t.length), e.partBufferLength >= e.partSize) {
                        var r = 1 === e.partBuffers.length ? e.partBuffers[0] : a.concat(e.partBuffers);
                        if (e.partBuffers = [], e.partBufferLength = 0, r.length > e.partSize) {
                            var n = r.slice(e.partSize);
                            e.partBuffers.push(n),
                            e.partBufferLength += n.length,
                            r = r.slice(0, e.partSize)
                        }
                        e.nextChunk(r)
                    }
                    e.isDoneChunking && !e.isDoneSending && (r = 1 === e.partBuffers.length ? e.partBuffers[0] : a.concat(e.partBuffers), e.partBuffers = [], e.partBufferLength = 0, e.totalBytes = e.totalChunkedBytes, e.isDoneSending = !0, (0 === e.numParts || r.length > 0) && (e.numParts++, e.nextChunk(r))),
                    e.body.read(0)
                }
            },
            nextChunk: function(e) {
                var t = this;
                if (t.failed) return null;
                var r = ++t.totalPartNumbers;
                if (t.isDoneChunking && 1 === r) {
                    var i = {
                        Body: e
                    };
                    this.tags && (i.Tagging = this.getTaggingHeader());
                    var a = t.service.putObject(i);
                    return a._managedUpload = t,
                    a.on("httpUploadProgress", t.progress).send(t.finishSinglePart),
                    t.singlePart = a,
                    null
                }
                if (t.service.config.params.ContentMD5) {
                    var o = n.util.error(new Error("The Content-MD5 you specified is invalid for multi-part uploads."), {
                        code: "InvalidDigest",
                        retryable: !1
                    });
                    return t.cleanup(o),
                    null
                }
                if (t.completeInfo[r] && null !== t.completeInfo[r].ETag) return null;
                t.activeParts++,
                t.service.config.params.UploadId ? t.uploadPart(e, r) : t.multipartReq ? t.queueChunks(e, r) : (t.multipartReq = t.service.createMultipartUpload(), t.multipartReq.on("success",
                function(e) {
                    t.service.config.params.UploadId = e.data.UploadId,
                    t.multipartReq = null
                }), t.queueChunks(e, r), t.multipartReq.on("error",
                function(e) {
                    t.cleanup(e)
                }), t.multipartReq.send())
            },
            getTaggingHeader: function() {
                for (var e = [], t = 0; t < this.tags.length; t++) e.push(n.util.uriEscape(this.tags[t].Key) + "=" + n.util.uriEscape(this.tags[t].Value));
                return e.join("&")
            },
            uploadPart: function(e, t) {
                var r = this,
                i = {
                    Body: e,
                    ContentLength: n.util.string.byteLength(e),
                    PartNumber: t
                },
                a = {
                    ETag: null,
                    PartNumber: t
                };
                r.completeInfo[t] = a;
                var o = r.service.uploadPart(i);
                r.parts[t] = o,
                o._lastUploadedBytes = 0,
                o._managedUpload = r,
                o.on("httpUploadProgress", r.progress),
                o.send(function(e, o) {
                    if (delete r.parts[i.PartNumber], r.activeParts--, !(e || o && o.ETag)) {
                        var s = "No access to ETag property on response.";
                        n.util.isBrowser() && (s += " Check CORS configuration to expose ETag header."),
                        e = n.util.error(new Error(s), {
                            code: "ETagMissing",
                            retryable: !1
                        })
                    }
                    return e ? r.cleanup(e) : r.completeInfo[t] && null !== r.completeInfo[t].ETag ? null: (a.ETag = o.ETag, r.doneParts++, void(r.isDoneChunking && r.doneParts === r.numParts ? r.finishMultiPart() : r.fillQueue.call(r)))
                })
            },
            queueChunks: function(e, t) {
                var r = this;
                r.multipartReq.on("success",
                function() {
                    r.uploadPart(e, t)
                })
            },
            cleanup: function(e) {
                var t = this;
                t.failed || ("function" == typeof t.body.removeAllListeners && "function" == typeof t.body.resume && (t.body.removeAllListeners("readable"), t.body.removeAllListeners("end"), t.body.resume()), t.multipartReq && (t.multipartReq.removeAllListeners("success"), t.multipartReq.removeAllListeners("error"), t.multipartReq.removeAllListeners("complete"), delete t.multipartReq), t.service.config.params.UploadId && !t.leavePartsOnError ? t.service.abortMultipartUpload().send() : t.leavePartsOnError && (t.isDoneChunking = !1), n.util.each(t.parts,
                function(e, t) {
                    t.removeAllListeners("complete"),
                    t.abort()
                }), t.activeParts = 0, t.partPos = 0, t.numParts = 0, t.totalPartNumbers = 0, t.parts = {},
                t.failed = !0, t.callback(e))
            },
            finishMultiPart: function() {
                var e = this,
                t = {
                    MultipartUpload: {
                        Parts: e.completeInfo.slice(1)
                    }
                };
                e.service.completeMultipartUpload(t,
                function(t, r) {
                    if (t) return e.cleanup(t);
                    if (r && "string" == typeof r.Location && (r.Location = r.Location.replace(/%2F/g, "/")), Array.isArray(e.tags)) {
                        for (var n = 0; n < e.tags.length; n++) e.tags[n].Value = String(e.tags[n].Value);
                        e.service.putObjectTagging({
                            Tagging: {
                                TagSet: e.tags
                            }
                        },
                        function(t, n) {
                            t ? e.callback(t) : e.callback(t, r)
                        })
                    } else e.callback(t, r)
                })
            },
            finishSinglePart: function(e, t) {
                var r = this.request._managedUpload,
                n = this.request.httpRequest,
                i = n.endpoint;
                if (e) return r.callback(e);
                t.Location = [i.protocol, "//", i.host, n.path].join(""),
                t.key = this.request.params.Key,
                t.Key = this.request.params.Key,
                t.Bucket = this.request.params.Bucket,
                r.callback(e, t)
            },
            progress: function(e) {
                var t = this._managedUpload;
                "putObject" === this.operation ? (e.part = 1, e.key = this.params.Key) : (t.totalUploadedBytes += e.loaded - this._lastUploadedBytes, this._lastUploadedBytes = e.loaded, e = {
                    loaded: t.totalUploadedBytes,
                    total: t.totalBytes,
                    part: this.params.PartNumber,
                    key: this.params.Key
                }),
                t.emit("httpUploadProgress", [e])
            }
        }),
        n.util.mixin(n.S3.ManagedUpload, n.SequentialExecutor),
        n.S3.ManagedUpload.addPromisesToClass = function(e) {
            this.prototype.promise = n.util.promisifyMethod("send", e)
        },
        n.S3.ManagedUpload.deletePromisesFromClass = function() {
            delete this.prototype.promise
        },
        n.util.addPromises(n.S3.ManagedUpload),
        t.exports = n.S3.ManagedUpload
    },
    {
        "../core": 38
    }]
},
{},
[103]);
AWS.apiLoader.services.s3["2006-03-01"] = {
    version: "2.0",
    metadata: {
        apiVersion: "2006-03-01",
        checksumFormat: "md5",
        endpointPrefix: "s3",
        globalEndpoint: "s3.amazonaws.com",
        protocol: "rest-xml",
        serviceAbbreviation: "Amazon S3",
        serviceFullName: "Amazon Simple Storage Service",
        serviceId: "S3",
        signatureVersion: "s3",
        uid: "s3-2006-03-01"
    },
    operations: {
        AbortMultipartUpload: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}/{Key+}",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key", "UploadId"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    UploadId: {
                        location: "querystring",
                        locationName: "uploadId"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        CompleteMultipartUpload: {
            http: {
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key", "UploadId"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    MultipartUpload: {
                        locationName: "CompleteMultipartUpload",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        members: {
                            Parts: {
                                locationName: "Part",
                                type: "list",
                                member: {
                                    type: "structure",
                                    members: {
                                        ETag: {},
                                        PartNumber: {
                                            type: "integer"
                                        }
                                    }
                                },
                                flattened: !0
                            }
                        }
                    },
                    UploadId: {
                        location: "querystring",
                        locationName: "uploadId"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                },
                payload: "MultipartUpload"
            },
            output: {
                type: "structure",
                members: {
                    Location: {},
                    Bucket: {},
                    Key: {},
                    Expiration: {
                        location: "header",
                        locationName: "x-amz-expiration"
                    },
                    ETag: {},
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        CopyObject: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "CopySource", "Key"],
                members: {
                    ACL: {
                        location: "header",
                        locationName: "x-amz-acl"
                    },
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    CacheControl: {
                        location: "header",
                        locationName: "Cache-Control"
                    },
                    ContentDisposition: {
                        location: "header",
                        locationName: "Content-Disposition"
                    },
                    ContentEncoding: {
                        location: "header",
                        locationName: "Content-Encoding"
                    },
                    ContentLanguage: {
                        location: "header",
                        locationName: "Content-Language"
                    },
                    ContentType: {
                        location: "header",
                        locationName: "Content-Type"
                    },
                    CopySource: {
                        location: "header",
                        locationName: "x-amz-copy-source"
                    },
                    CopySourceIfMatch: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-match"
                    },
                    CopySourceIfModifiedSince: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-modified-since",
                        type: "timestamp"
                    },
                    CopySourceIfNoneMatch: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-none-match"
                    },
                    CopySourceIfUnmodifiedSince: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-unmodified-since",
                        type: "timestamp"
                    },
                    Expires: {
                        location: "header",
                        locationName: "Expires",
                        type: "timestamp"
                    },
                    GrantFullControl: {
                        location: "header",
                        locationName: "x-amz-grant-full-control"
                    },
                    GrantRead: {
                        location: "header",
                        locationName: "x-amz-grant-read"
                    },
                    GrantReadACP: {
                        location: "header",
                        locationName: "x-amz-grant-read-acp"
                    },
                    GrantWriteACP: {
                        location: "header",
                        locationName: "x-amz-grant-write-acp"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    Metadata: {
                        shape: "S11",
                        location: "headers",
                        locationName: "x-amz-meta-"
                    },
                    MetadataDirective: {
                        location: "header",
                        locationName: "x-amz-metadata-directive"
                    },
                    TaggingDirective: {
                        location: "header",
                        locationName: "x-amz-tagging-directive"
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    StorageClass: {
                        location: "header",
                        locationName: "x-amz-storage-class"
                    },
                    WebsiteRedirectLocation: {
                        location: "header",
                        locationName: "x-amz-website-redirect-location"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    CopySourceSSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-copy-source-server-side-encryption-customer-algorithm"
                    },
                    CopySourceSSECustomerKey: {
                        shape: "S1c",
                        location: "header",
                        locationName: "x-amz-copy-source-server-side-encryption-customer-key"
                    },
                    CopySourceSSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-copy-source-server-side-encryption-customer-key-MD5"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    Tagging: {
                        location: "header",
                        locationName: "x-amz-tagging"
                    },
                    ObjectLockMode: {
                        location: "header",
                        locationName: "x-amz-object-lock-mode"
                    },
                    ObjectLockRetainUntilDate: {
                        shape: "S1g",
                        location: "header",
                        locationName: "x-amz-object-lock-retain-until-date"
                    },
                    ObjectLockLegalHoldStatus: {
                        location: "header",
                        locationName: "x-amz-object-lock-legal-hold"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    CopyObjectResult: {
                        type: "structure",
                        members: {
                            ETag: {},
                            LastModified: {
                                type: "timestamp"
                            }
                        }
                    },
                    Expiration: {
                        location: "header",
                        locationName: "x-amz-expiration"
                    },
                    CopySourceVersionId: {
                        location: "header",
                        locationName: "x-amz-copy-source-version-id"
                    },
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                },
                payload: "CopyObjectResult"
            },
            alias: "PutObjectCopy"
        },
        CreateBucket: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    ACL: {
                        location: "header",
                        locationName: "x-amz-acl"
                    },
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    CreateBucketConfiguration: {
                        locationName: "CreateBucketConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        members: {
                            LocationConstraint: {}
                        }
                    },
                    GrantFullControl: {
                        location: "header",
                        locationName: "x-amz-grant-full-control"
                    },
                    GrantRead: {
                        location: "header",
                        locationName: "x-amz-grant-read"
                    },
                    GrantReadACP: {
                        location: "header",
                        locationName: "x-amz-grant-read-acp"
                    },
                    GrantWrite: {
                        location: "header",
                        locationName: "x-amz-grant-write"
                    },
                    GrantWriteACP: {
                        location: "header",
                        locationName: "x-amz-grant-write-acp"
                    },
                    ObjectLockEnabledForBucket: {
                        location: "header",
                        locationName: "x-amz-bucket-object-lock-enabled",
                        type: "boolean"
                    }
                },
                payload: "CreateBucketConfiguration"
            },
            output: {
                type: "structure",
                members: {
                    Location: {
                        location: "header",
                        locationName: "Location"
                    }
                }
            },
            alias: "PutBucket"
        },
        CreateMultipartUpload: {
            http: {
                requestUri: "/{Bucket}/{Key+}?uploads"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    ACL: {
                        location: "header",
                        locationName: "x-amz-acl"
                    },
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    CacheControl: {
                        location: "header",
                        locationName: "Cache-Control"
                    },
                    ContentDisposition: {
                        location: "header",
                        locationName: "Content-Disposition"
                    },
                    ContentEncoding: {
                        location: "header",
                        locationName: "Content-Encoding"
                    },
                    ContentLanguage: {
                        location: "header",
                        locationName: "Content-Language"
                    },
                    ContentType: {
                        location: "header",
                        locationName: "Content-Type"
                    },
                    Expires: {
                        location: "header",
                        locationName: "Expires",
                        type: "timestamp"
                    },
                    GrantFullControl: {
                        location: "header",
                        locationName: "x-amz-grant-full-control"
                    },
                    GrantRead: {
                        location: "header",
                        locationName: "x-amz-grant-read"
                    },
                    GrantReadACP: {
                        location: "header",
                        locationName: "x-amz-grant-read-acp"
                    },
                    GrantWriteACP: {
                        location: "header",
                        locationName: "x-amz-grant-write-acp"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    Metadata: {
                        shape: "S11",
                        location: "headers",
                        locationName: "x-amz-meta-"
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    StorageClass: {
                        location: "header",
                        locationName: "x-amz-storage-class"
                    },
                    WebsiteRedirectLocation: {
                        location: "header",
                        locationName: "x-amz-website-redirect-location"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    Tagging: {
                        location: "header",
                        locationName: "x-amz-tagging"
                    },
                    ObjectLockMode: {
                        location: "header",
                        locationName: "x-amz-object-lock-mode"
                    },
                    ObjectLockRetainUntilDate: {
                        shape: "S1g",
                        location: "header",
                        locationName: "x-amz-object-lock-retain-until-date"
                    },
                    ObjectLockLegalHoldStatus: {
                        location: "header",
                        locationName: "x-amz-object-lock-legal-hold"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    AbortDate: {
                        location: "header",
                        locationName: "x-amz-abort-date",
                        type: "timestamp"
                    },
                    AbortRuleId: {
                        location: "header",
                        locationName: "x-amz-abort-rule-id"
                    },
                    Bucket: {
                        locationName: "Bucket"
                    },
                    Key: {},
                    UploadId: {},
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            },
            alias: "InitiateMultipartUpload"
        },
        DeleteBucket: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteBucketAnalyticsConfiguration: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?analytics",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    }
                }
            }
        },
        DeleteBucketCors: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?cors",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteBucketEncryption: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?encryption",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteBucketInventoryConfiguration: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?inventory",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    }
                }
            }
        },
        DeleteBucketLifecycle: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?lifecycle",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteBucketMetricsConfiguration: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?metrics",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    }
                }
            }
        },
        DeleteBucketPolicy: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?policy",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteBucketReplication: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?replication",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteBucketTagging: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?tagging",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteBucketWebsite: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?website",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        DeleteObject: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}/{Key+}",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    MFA: {
                        location: "header",
                        locationName: "x-amz-mfa"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    BypassGovernanceRetention: {
                        location: "header",
                        locationName: "x-amz-bypass-governance-retention",
                        type: "boolean"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    DeleteMarker: {
                        location: "header",
                        locationName: "x-amz-delete-marker",
                        type: "boolean"
                    },
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        DeleteObjectTagging: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}/{Key+}?tagging",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    }
                }
            }
        },
        DeleteObjects: {
            http: {
                requestUri: "/{Bucket}?delete"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Delete"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Delete: {
                        locationName: "Delete",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        required: ["Objects"],
                        members: {
                            Objects: {
                                locationName: "Object",
                                type: "list",
                                member: {
                                    type: "structure",
                                    required: ["Key"],
                                    members: {
                                        Key: {},
                                        VersionId: {}
                                    }
                                },
                                flattened: !0
                            },
                            Quiet: {
                                type: "boolean"
                            }
                        }
                    },
                    MFA: {
                        location: "header",
                        locationName: "x-amz-mfa"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    BypassGovernanceRetention: {
                        location: "header",
                        locationName: "x-amz-bypass-governance-retention",
                        type: "boolean"
                    }
                },
                payload: "Delete"
            },
            output: {
                type: "structure",
                members: {
                    Deleted: {
                        type: "list",
                        member: {
                            type: "structure",
                            members: {
                                Key: {},
                                VersionId: {},
                                DeleteMarker: {
                                    type: "boolean"
                                },
                                DeleteMarkerVersionId: {}
                            }
                        },
                        flattened: !0
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    },
                    Errors: {
                        locationName: "Error",
                        type: "list",
                        member: {
                            type: "structure",
                            members: {
                                Key: {},
                                VersionId: {},
                                Code: {},
                                Message: {}
                            }
                        },
                        flattened: !0
                    }
                }
            },
            alias: "DeleteMultipleObjects"
        },
        DeletePublicAccessBlock: {
            http: {
                method: "DELETE",
                requestUri: "/{Bucket}?publicAccessBlock",
                responseCode: 204
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        GetBucketAccelerateConfiguration: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?accelerate"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Status: {}
                }
            }
        },
        GetBucketAcl: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?acl"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Owner: {
                        shape: "S31"
                    },
                    Grants: {
                        shape: "S34",
                        locationName: "AccessControlList"
                    }
                }
            }
        },
        GetBucketAnalyticsConfiguration: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?analytics"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    AnalyticsConfiguration: {
                        shape: "S3d"
                    }
                },
                payload: "AnalyticsConfiguration"
            }
        },
        GetBucketCors: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?cors"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    CORSRules: {
                        shape: "S3t",
                        locationName: "CORSRule"
                    }
                }
            }
        },
        GetBucketEncryption: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?encryption"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    ServerSideEncryptionConfiguration: {
                        shape: "S46"
                    }
                },
                payload: "ServerSideEncryptionConfiguration"
            }
        },
        GetBucketInventoryConfiguration: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?inventory"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    InventoryConfiguration: {
                        shape: "S4c"
                    }
                },
                payload: "InventoryConfiguration"
            }
        },
        GetBucketLifecycle: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?lifecycle"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Rules: {
                        shape: "S4s",
                        locationName: "Rule"
                    }
                }
            },
            deprecated: !0
        },
        GetBucketLifecycleConfiguration: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?lifecycle"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Rules: {
                        shape: "S57",
                        locationName: "Rule"
                    }
                }
            }
        },
        GetBucketLocation: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?location"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    LocationConstraint: {}
                }
            }
        },
        GetBucketLogging: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?logging"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    LoggingEnabled: {
                        shape: "S5h"
                    }
                }
            }
        },
        GetBucketMetricsConfiguration: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?metrics"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    MetricsConfiguration: {
                        shape: "S5p"
                    }
                },
                payload: "MetricsConfiguration"
            }
        },
        GetBucketNotification: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?notification"
            },
            input: {
                shape: "S5s"
            },
            output: {
                shape: "S5t"
            },
            deprecated: !0
        },
        GetBucketNotificationConfiguration: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?notification"
            },
            input: {
                shape: "S5s"
            },
            output: {
                shape: "S64"
            }
        },
        GetBucketPolicy: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?policy"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Policy: {}
                },
                payload: "Policy"
            }
        },
        GetBucketPolicyStatus: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?policyStatus"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    PolicyStatus: {
                        type: "structure",
                        members: {
                            IsPublic: {
                                locationName: "IsPublic",
                                type: "boolean"
                            }
                        }
                    }
                },
                payload: "PolicyStatus"
            }
        },
        GetBucketReplication: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?replication"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    ReplicationConfiguration: {
                        shape: "S6r"
                    }
                },
                payload: "ReplicationConfiguration"
            }
        },
        GetBucketRequestPayment: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?requestPayment"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Payer: {}
                }
            }
        },
        GetBucketTagging: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?tagging"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                required: ["TagSet"],
                members: {
                    TagSet: {
                        shape: "S3j"
                    }
                }
            }
        },
        GetBucketVersioning: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?versioning"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Status: {},
                    MFADelete: {
                        locationName: "MfaDelete"
                    }
                }
            }
        },
        GetBucketWebsite: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?website"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    RedirectAllRequestsTo: {
                        shape: "S7k"
                    },
                    IndexDocument: {
                        shape: "S7n"
                    },
                    ErrorDocument: {
                        shape: "S7p"
                    },
                    RoutingRules: {
                        shape: "S7q"
                    }
                }
            }
        },
        GetObject: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    IfMatch: {
                        location: "header",
                        locationName: "If-Match"
                    },
                    IfModifiedSince: {
                        location: "header",
                        locationName: "If-Modified-Since",
                        type: "timestamp"
                    },
                    IfNoneMatch: {
                        location: "header",
                        locationName: "If-None-Match"
                    },
                    IfUnmodifiedSince: {
                        location: "header",
                        locationName: "If-Unmodified-Since",
                        type: "timestamp"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    Range: {
                        location: "header",
                        locationName: "Range"
                    },
                    ResponseCacheControl: {
                        location: "querystring",
                        locationName: "response-cache-control"
                    },
                    ResponseContentDisposition: {
                        location: "querystring",
                        locationName: "response-content-disposition"
                    },
                    ResponseContentEncoding: {
                        location: "querystring",
                        locationName: "response-content-encoding"
                    },
                    ResponseContentLanguage: {
                        location: "querystring",
                        locationName: "response-content-language"
                    },
                    ResponseContentType: {
                        location: "querystring",
                        locationName: "response-content-type"
                    },
                    ResponseExpires: {
                        location: "querystring",
                        locationName: "response-expires",
                        type: "timestamp"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    PartNumber: {
                        location: "querystring",
                        locationName: "partNumber",
                        type: "integer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Body: {
                        streaming: !0,
                        type: "blob"
                    },
                    DeleteMarker: {
                        location: "header",
                        locationName: "x-amz-delete-marker",
                        type: "boolean"
                    },
                    AcceptRanges: {
                        location: "header",
                        locationName: "accept-ranges"
                    },
                    Expiration: {
                        location: "header",
                        locationName: "x-amz-expiration"
                    },
                    Restore: {
                        location: "header",
                        locationName: "x-amz-restore"
                    },
                    LastModified: {
                        location: "header",
                        locationName: "Last-Modified",
                        type: "timestamp"
                    },
                    ContentLength: {
                        location: "header",
                        locationName: "Content-Length",
                        type: "long"
                    },
                    ETag: {
                        location: "header",
                        locationName: "ETag"
                    },
                    MissingMeta: {
                        location: "header",
                        locationName: "x-amz-missing-meta",
                        type: "integer"
                    },
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    },
                    CacheControl: {
                        location: "header",
                        locationName: "Cache-Control"
                    },
                    ContentDisposition: {
                        location: "header",
                        locationName: "Content-Disposition"
                    },
                    ContentEncoding: {
                        location: "header",
                        locationName: "Content-Encoding"
                    },
                    ContentLanguage: {
                        location: "header",
                        locationName: "Content-Language"
                    },
                    ContentRange: {
                        location: "header",
                        locationName: "Content-Range"
                    },
                    ContentType: {
                        location: "header",
                        locationName: "Content-Type"
                    },
                    Expires: {
                        location: "header",
                        locationName: "Expires",
                        type: "timestamp"
                    },
                    WebsiteRedirectLocation: {
                        location: "header",
                        locationName: "x-amz-website-redirect-location"
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    Metadata: {
                        shape: "S11",
                        location: "headers",
                        locationName: "x-amz-meta-"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    StorageClass: {
                        location: "header",
                        locationName: "x-amz-storage-class"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    },
                    ReplicationStatus: {
                        location: "header",
                        locationName: "x-amz-replication-status"
                    },
                    PartsCount: {
                        location: "header",
                        locationName: "x-amz-mp-parts-count",
                        type: "integer"
                    },
                    TagCount: {
                        location: "header",
                        locationName: "x-amz-tagging-count",
                        type: "integer"
                    },
                    ObjectLockMode: {
                        location: "header",
                        locationName: "x-amz-object-lock-mode"
                    },
                    ObjectLockRetainUntilDate: {
                        shape: "S1g",
                        location: "header",
                        locationName: "x-amz-object-lock-retain-until-date"
                    },
                    ObjectLockLegalHoldStatus: {
                        location: "header",
                        locationName: "x-amz-object-lock-legal-hold"
                    }
                },
                payload: "Body"
            }
        },
        GetObjectAcl: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}/{Key+}?acl"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Owner: {
                        shape: "S31"
                    },
                    Grants: {
                        shape: "S34",
                        locationName: "AccessControlList"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        GetObjectLegalHold: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}/{Key+}?legal-hold"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    LegalHold: {
                        shape: "S8p"
                    }
                },
                payload: "LegalHold"
            }
        },
        GetObjectLockConfiguration: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?object-lock"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    ObjectLockConfiguration: {
                        shape: "S8s"
                    }
                },
                payload: "ObjectLockConfiguration"
            }
        },
        GetObjectRetention: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}/{Key+}?retention"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Retention: {
                        shape: "S90"
                    }
                },
                payload: "Retention"
            }
        },
        GetObjectTagging: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}/{Key+}?tagging"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    }
                }
            },
            output: {
                type: "structure",
                required: ["TagSet"],
                members: {
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    },
                    TagSet: {
                        shape: "S3j"
                    }
                }
            }
        },
        GetObjectTorrent: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}/{Key+}?torrent"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Body: {
                        streaming: !0,
                        type: "blob"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                },
                payload: "Body"
            }
        },
        GetPublicAccessBlock: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?publicAccessBlock"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    PublicAccessBlockConfiguration: {
                        shape: "S97"
                    }
                },
                payload: "PublicAccessBlockConfiguration"
            }
        },
        HeadBucket: {
            http: {
                method: "HEAD",
                requestUri: "/{Bucket}"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    }
                }
            }
        },
        HeadObject: {
            http: {
                method: "HEAD",
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    IfMatch: {
                        location: "header",
                        locationName: "If-Match"
                    },
                    IfModifiedSince: {
                        location: "header",
                        locationName: "If-Modified-Since",
                        type: "timestamp"
                    },
                    IfNoneMatch: {
                        location: "header",
                        locationName: "If-None-Match"
                    },
                    IfUnmodifiedSince: {
                        location: "header",
                        locationName: "If-Unmodified-Since",
                        type: "timestamp"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    Range: {
                        location: "header",
                        locationName: "Range"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    PartNumber: {
                        location: "querystring",
                        locationName: "partNumber",
                        type: "integer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    DeleteMarker: {
                        location: "header",
                        locationName: "x-amz-delete-marker",
                        type: "boolean"
                    },
                    AcceptRanges: {
                        location: "header",
                        locationName: "accept-ranges"
                    },
                    Expiration: {
                        location: "header",
                        locationName: "x-amz-expiration"
                    },
                    Restore: {
                        location: "header",
                        locationName: "x-amz-restore"
                    },
                    LastModified: {
                        location: "header",
                        locationName: "Last-Modified",
                        type: "timestamp"
                    },
                    ContentLength: {
                        location: "header",
                        locationName: "Content-Length",
                        type: "long"
                    },
                    ETag: {
                        location: "header",
                        locationName: "ETag"
                    },
                    MissingMeta: {
                        location: "header",
                        locationName: "x-amz-missing-meta",
                        type: "integer"
                    },
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    },
                    CacheControl: {
                        location: "header",
                        locationName: "Cache-Control"
                    },
                    ContentDisposition: {
                        location: "header",
                        locationName: "Content-Disposition"
                    },
                    ContentEncoding: {
                        location: "header",
                        locationName: "Content-Encoding"
                    },
                    ContentLanguage: {
                        location: "header",
                        locationName: "Content-Language"
                    },
                    ContentType: {
                        location: "header",
                        locationName: "Content-Type"
                    },
                    Expires: {
                        location: "header",
                        locationName: "Expires",
                        type: "timestamp"
                    },
                    WebsiteRedirectLocation: {
                        location: "header",
                        locationName: "x-amz-website-redirect-location"
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    Metadata: {
                        shape: "S11",
                        location: "headers",
                        locationName: "x-amz-meta-"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    StorageClass: {
                        location: "header",
                        locationName: "x-amz-storage-class"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    },
                    ReplicationStatus: {
                        location: "header",
                        locationName: "x-amz-replication-status"
                    },
                    PartsCount: {
                        location: "header",
                        locationName: "x-amz-mp-parts-count",
                        type: "integer"
                    },
                    ObjectLockMode: {
                        location: "header",
                        locationName: "x-amz-object-lock-mode"
                    },
                    ObjectLockRetainUntilDate: {
                        shape: "S1g",
                        location: "header",
                        locationName: "x-amz-object-lock-retain-until-date"
                    },
                    ObjectLockLegalHoldStatus: {
                        location: "header",
                        locationName: "x-amz-object-lock-legal-hold"
                    }
                }
            }
        },
        ListBucketAnalyticsConfigurations: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?analytics"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContinuationToken: {
                        location: "querystring",
                        locationName: "continuation-token"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    IsTruncated: {
                        type: "boolean"
                    },
                    ContinuationToken: {},
                    NextContinuationToken: {},
                    AnalyticsConfigurationList: {
                        locationName: "AnalyticsConfiguration",
                        type: "list",
                        member: {
                            shape: "S3d"
                        },
                        flattened: !0
                    }
                }
            }
        },
        ListBucketInventoryConfigurations: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?inventory"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContinuationToken: {
                        location: "querystring",
                        locationName: "continuation-token"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    ContinuationToken: {},
                    InventoryConfigurationList: {
                        locationName: "InventoryConfiguration",
                        type: "list",
                        member: {
                            shape: "S4c"
                        },
                        flattened: !0
                    },
                    IsTruncated: {
                        type: "boolean"
                    },
                    NextContinuationToken: {}
                }
            }
        },
        ListBucketMetricsConfigurations: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?metrics"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContinuationToken: {
                        location: "querystring",
                        locationName: "continuation-token"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    IsTruncated: {
                        type: "boolean"
                    },
                    ContinuationToken: {},
                    NextContinuationToken: {},
                    MetricsConfigurationList: {
                        locationName: "MetricsConfiguration",
                        type: "list",
                        member: {
                            shape: "S5p"
                        },
                        flattened: !0
                    }
                }
            }
        },
        ListBuckets: {
            http: {
                method: "GET"
            },
            output: {
                type: "structure",
                members: {
                    Buckets: {
                        type: "list",
                        member: {
                            locationName: "Bucket",
                            type: "structure",
                            members: {
                                Name: {},
                                CreationDate: {
                                    type: "timestamp"
                                }
                            }
                        }
                    },
                    Owner: {
                        shape: "S31"
                    }
                }
            },
            alias: "GetService"
        },
        ListMultipartUploads: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?uploads"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Delimiter: {
                        location: "querystring",
                        locationName: "delimiter"
                    },
                    EncodingType: {
                        location: "querystring",
                        locationName: "encoding-type"
                    },
                    KeyMarker: {
                        location: "querystring",
                        locationName: "key-marker"
                    },
                    MaxUploads: {
                        location: "querystring",
                        locationName: "max-uploads",
                        type: "integer"
                    },
                    Prefix: {
                        location: "querystring",
                        locationName: "prefix"
                    },
                    UploadIdMarker: {
                        location: "querystring",
                        locationName: "upload-id-marker"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Bucket: {},
                    KeyMarker: {},
                    UploadIdMarker: {},
                    NextKeyMarker: {},
                    Prefix: {},
                    Delimiter: {},
                    NextUploadIdMarker: {},
                    MaxUploads: {
                        type: "integer"
                    },
                    IsTruncated: {
                        type: "boolean"
                    },
                    Uploads: {
                        locationName: "Upload",
                        type: "list",
                        member: {
                            type: "structure",
                            members: {
                                UploadId: {},
                                Key: {},
                                Initiated: {
                                    type: "timestamp"
                                },
                                StorageClass: {},
                                Owner: {
                                    shape: "S31"
                                },
                                Initiator: {
                                    shape: "Sa4"
                                }
                            }
                        },
                        flattened: !0
                    },
                    CommonPrefixes: {
                        shape: "Sa5"
                    },
                    EncodingType: {}
                }
            }
        },
        ListObjectVersions: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?versions"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Delimiter: {
                        location: "querystring",
                        locationName: "delimiter"
                    },
                    EncodingType: {
                        location: "querystring",
                        locationName: "encoding-type"
                    },
                    KeyMarker: {
                        location: "querystring",
                        locationName: "key-marker"
                    },
                    MaxKeys: {
                        location: "querystring",
                        locationName: "max-keys",
                        type: "integer"
                    },
                    Prefix: {
                        location: "querystring",
                        locationName: "prefix"
                    },
                    VersionIdMarker: {
                        location: "querystring",
                        locationName: "version-id-marker"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    IsTruncated: {
                        type: "boolean"
                    },
                    KeyMarker: {},
                    VersionIdMarker: {},
                    NextKeyMarker: {},
                    NextVersionIdMarker: {},
                    Versions: {
                        locationName: "Version",
                        type: "list",
                        member: {
                            type: "structure",
                            members: {
                                ETag: {},
                                Size: {
                                    type: "integer"
                                },
                                StorageClass: {},
                                Key: {},
                                VersionId: {},
                                IsLatest: {
                                    type: "boolean"
                                },
                                LastModified: {
                                    type: "timestamp"
                                },
                                Owner: {
                                    shape: "S31"
                                }
                            }
                        },
                        flattened: !0
                    },
                    DeleteMarkers: {
                        locationName: "DeleteMarker",
                        type: "list",
                        member: {
                            type: "structure",
                            members: {
                                Owner: {
                                    shape: "S31"
                                },
                                Key: {},
                                VersionId: {},
                                IsLatest: {
                                    type: "boolean"
                                },
                                LastModified: {
                                    type: "timestamp"
                                }
                            }
                        },
                        flattened: !0
                    },
                    Name: {},
                    Prefix: {},
                    Delimiter: {},
                    MaxKeys: {
                        type: "integer"
                    },
                    CommonPrefixes: {
                        shape: "Sa5"
                    },
                    EncodingType: {}
                }
            },
            alias: "GetBucketObjectVersions"
        },
        ListObjects: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Delimiter: {
                        location: "querystring",
                        locationName: "delimiter"
                    },
                    EncodingType: {
                        location: "querystring",
                        locationName: "encoding-type"
                    },
                    Marker: {
                        location: "querystring",
                        locationName: "marker"
                    },
                    MaxKeys: {
                        location: "querystring",
                        locationName: "max-keys",
                        type: "integer"
                    },
                    Prefix: {
                        location: "querystring",
                        locationName: "prefix"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    IsTruncated: {
                        type: "boolean"
                    },
                    Marker: {},
                    NextMarker: {},
                    Contents: {
                        shape: "San"
                    },
                    Name: {},
                    Prefix: {},
                    Delimiter: {},
                    MaxKeys: {
                        type: "integer"
                    },
                    CommonPrefixes: {
                        shape: "Sa5"
                    },
                    EncodingType: {}
                }
            },
            alias: "GetBucket"
        },
        ListObjectsV2: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}?list-type=2"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Delimiter: {
                        location: "querystring",
                        locationName: "delimiter"
                    },
                    EncodingType: {
                        location: "querystring",
                        locationName: "encoding-type"
                    },
                    MaxKeys: {
                        location: "querystring",
                        locationName: "max-keys",
                        type: "integer"
                    },
                    Prefix: {
                        location: "querystring",
                        locationName: "prefix"
                    },
                    ContinuationToken: {
                        location: "querystring",
                        locationName: "continuation-token"
                    },
                    FetchOwner: {
                        location: "querystring",
                        locationName: "fetch-owner",
                        type: "boolean"
                    },
                    StartAfter: {
                        location: "querystring",
                        locationName: "start-after"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    IsTruncated: {
                        type: "boolean"
                    },
                    Contents: {
                        shape: "San"
                    },
                    Name: {},
                    Prefix: {},
                    Delimiter: {},
                    MaxKeys: {
                        type: "integer"
                    },
                    CommonPrefixes: {
                        shape: "Sa5"
                    },
                    EncodingType: {},
                    KeyCount: {
                        type: "integer"
                    },
                    ContinuationToken: {},
                    NextContinuationToken: {},
                    StartAfter: {}
                }
            }
        },
        ListParts: {
            http: {
                method: "GET",
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key", "UploadId"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    MaxParts: {
                        location: "querystring",
                        locationName: "max-parts",
                        type: "integer"
                    },
                    PartNumberMarker: {
                        location: "querystring",
                        locationName: "part-number-marker",
                        type: "integer"
                    },
                    UploadId: {
                        location: "querystring",
                        locationName: "uploadId"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    AbortDate: {
                        location: "header",
                        locationName: "x-amz-abort-date",
                        type: "timestamp"
                    },
                    AbortRuleId: {
                        location: "header",
                        locationName: "x-amz-abort-rule-id"
                    },
                    Bucket: {},
                    Key: {},
                    UploadId: {},
                    PartNumberMarker: {
                        type: "integer"
                    },
                    NextPartNumberMarker: {
                        type: "integer"
                    },
                    MaxParts: {
                        type: "integer"
                    },
                    IsTruncated: {
                        type: "boolean"
                    },
                    Parts: {
                        locationName: "Part",
                        type: "list",
                        member: {
                            type: "structure",
                            members: {
                                PartNumber: {
                                    type: "integer"
                                },
                                LastModified: {
                                    type: "timestamp"
                                },
                                ETag: {},
                                Size: {
                                    type: "integer"
                                }
                            }
                        },
                        flattened: !0
                    },
                    Initiator: {
                        shape: "Sa4"
                    },
                    Owner: {
                        shape: "S31"
                    },
                    StorageClass: {},
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        PutBucketAccelerateConfiguration: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?accelerate"
            },
            input: {
                type: "structure",
                required: ["Bucket", "AccelerateConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    AccelerateConfiguration: {
                        locationName: "AccelerateConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        members: {
                            Status: {}
                        }
                    }
                },
                payload: "AccelerateConfiguration"
            }
        },
        PutBucketAcl: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?acl"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    ACL: {
                        location: "header",
                        locationName: "x-amz-acl"
                    },
                    AccessControlPolicy: {
                        shape: "Sb5",
                        locationName: "AccessControlPolicy",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    },
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    GrantFullControl: {
                        location: "header",
                        locationName: "x-amz-grant-full-control"
                    },
                    GrantRead: {
                        location: "header",
                        locationName: "x-amz-grant-read"
                    },
                    GrantReadACP: {
                        location: "header",
                        locationName: "x-amz-grant-read-acp"
                    },
                    GrantWrite: {
                        location: "header",
                        locationName: "x-amz-grant-write"
                    },
                    GrantWriteACP: {
                        location: "header",
                        locationName: "x-amz-grant-write-acp"
                    }
                },
                payload: "AccessControlPolicy"
            }
        },
        PutBucketAnalyticsConfiguration: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?analytics"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id", "AnalyticsConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    },
                    AnalyticsConfiguration: {
                        shape: "S3d",
                        locationName: "AnalyticsConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "AnalyticsConfiguration"
            }
        },
        PutBucketCors: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?cors"
            },
            input: {
                type: "structure",
                required: ["Bucket", "CORSConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    CORSConfiguration: {
                        locationName: "CORSConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        required: ["CORSRules"],
                        members: {
                            CORSRules: {
                                shape: "S3t",
                                locationName: "CORSRule"
                            }
                        }
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    }
                },
                payload: "CORSConfiguration"
            }
        },
        PutBucketEncryption: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?encryption"
            },
            input: {
                type: "structure",
                required: ["Bucket", "ServerSideEncryptionConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    ServerSideEncryptionConfiguration: {
                        shape: "S46",
                        locationName: "ServerSideEncryptionConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "ServerSideEncryptionConfiguration"
            }
        },
        PutBucketInventoryConfiguration: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?inventory"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id", "InventoryConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    },
                    InventoryConfiguration: {
                        shape: "S4c",
                        locationName: "InventoryConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "InventoryConfiguration"
            }
        },
        PutBucketLifecycle: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?lifecycle"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    LifecycleConfiguration: {
                        locationName: "LifecycleConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        required: ["Rules"],
                        members: {
                            Rules: {
                                shape: "S4s",
                                locationName: "Rule"
                            }
                        }
                    }
                },
                payload: "LifecycleConfiguration"
            },
            deprecated: !0
        },
        PutBucketLifecycleConfiguration: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?lifecycle"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    LifecycleConfiguration: {
                        locationName: "LifecycleConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        required: ["Rules"],
                        members: {
                            Rules: {
                                shape: "S57",
                                locationName: "Rule"
                            }
                        }
                    }
                },
                payload: "LifecycleConfiguration"
            }
        },
        PutBucketLogging: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?logging"
            },
            input: {
                type: "structure",
                required: ["Bucket", "BucketLoggingStatus"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    BucketLoggingStatus: {
                        locationName: "BucketLoggingStatus",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        members: {
                            LoggingEnabled: {
                                shape: "S5h"
                            }
                        }
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    }
                },
                payload: "BucketLoggingStatus"
            }
        },
        PutBucketMetricsConfiguration: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?metrics"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Id", "MetricsConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Id: {
                        location: "querystring",
                        locationName: "id"
                    },
                    MetricsConfiguration: {
                        shape: "S5p",
                        locationName: "MetricsConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "MetricsConfiguration"
            }
        },
        PutBucketNotification: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?notification"
            },
            input: {
                type: "structure",
                required: ["Bucket", "NotificationConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    NotificationConfiguration: {
                        shape: "S5t",
                        locationName: "NotificationConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "NotificationConfiguration"
            },
            deprecated: !0
        },
        PutBucketNotificationConfiguration: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?notification"
            },
            input: {
                type: "structure",
                required: ["Bucket", "NotificationConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    NotificationConfiguration: {
                        shape: "S64",
                        locationName: "NotificationConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "NotificationConfiguration"
            }
        },
        PutBucketPolicy: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?policy"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Policy"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    ConfirmRemoveSelfBucketAccess: {
                        location: "header",
                        locationName: "x-amz-confirm-remove-self-bucket-access",
                        type: "boolean"
                    },
                    Policy: {}
                },
                payload: "Policy"
            }
        },
        PutBucketReplication: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?replication"
            },
            input: {
                type: "structure",
                required: ["Bucket", "ReplicationConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    ReplicationConfiguration: {
                        shape: "S6r",
                        locationName: "ReplicationConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "ReplicationConfiguration"
            }
        },
        PutBucketRequestPayment: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?requestPayment"
            },
            input: {
                type: "structure",
                required: ["Bucket", "RequestPaymentConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    RequestPaymentConfiguration: {
                        locationName: "RequestPaymentConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        required: ["Payer"],
                        members: {
                            Payer: {}
                        }
                    }
                },
                payload: "RequestPaymentConfiguration"
            }
        },
        PutBucketTagging: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?tagging"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Tagging"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    Tagging: {
                        shape: "Sbr",
                        locationName: "Tagging",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "Tagging"
            }
        },
        PutBucketVersioning: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?versioning"
            },
            input: {
                type: "structure",
                required: ["Bucket", "VersioningConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    MFA: {
                        location: "header",
                        locationName: "x-amz-mfa"
                    },
                    VersioningConfiguration: {
                        locationName: "VersioningConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        members: {
                            MFADelete: {
                                locationName: "MfaDelete"
                            },
                            Status: {}
                        }
                    }
                },
                payload: "VersioningConfiguration"
            }
        },
        PutBucketWebsite: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?website"
            },
            input: {
                type: "structure",
                required: ["Bucket", "WebsiteConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    WebsiteConfiguration: {
                        locationName: "WebsiteConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        members: {
                            ErrorDocument: {
                                shape: "S7p"
                            },
                            IndexDocument: {
                                shape: "S7n"
                            },
                            RedirectAllRequestsTo: {
                                shape: "S7k"
                            },
                            RoutingRules: {
                                shape: "S7q"
                            }
                        }
                    }
                },
                payload: "WebsiteConfiguration"
            }
        },
        PutObject: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    ACL: {
                        location: "header",
                        locationName: "x-amz-acl"
                    },
                    Body: {
                        streaming: !0,
                        type: "blob"
                    },
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    CacheControl: {
                        location: "header",
                        locationName: "Cache-Control"
                    },
                    ContentDisposition: {
                        location: "header",
                        locationName: "Content-Disposition"
                    },
                    ContentEncoding: {
                        location: "header",
                        locationName: "Content-Encoding"
                    },
                    ContentLanguage: {
                        location: "header",
                        locationName: "Content-Language"
                    },
                    ContentLength: {
                        location: "header",
                        locationName: "Content-Length",
                        type: "long"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    ContentType: {
                        location: "header",
                        locationName: "Content-Type"
                    },
                    Expires: {
                        location: "header",
                        locationName: "Expires",
                        type: "timestamp"
                    },
                    GrantFullControl: {
                        location: "header",
                        locationName: "x-amz-grant-full-control"
                    },
                    GrantRead: {
                        location: "header",
                        locationName: "x-amz-grant-read"
                    },
                    GrantReadACP: {
                        location: "header",
                        locationName: "x-amz-grant-read-acp"
                    },
                    GrantWriteACP: {
                        location: "header",
                        locationName: "x-amz-grant-write-acp"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    Metadata: {
                        shape: "S11",
                        location: "headers",
                        locationName: "x-amz-meta-"
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    StorageClass: {
                        location: "header",
                        locationName: "x-amz-storage-class"
                    },
                    WebsiteRedirectLocation: {
                        location: "header",
                        locationName: "x-amz-website-redirect-location"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    Tagging: {
                        location: "header",
                        locationName: "x-amz-tagging"
                    },
                    ObjectLockMode: {
                        location: "header",
                        locationName: "x-amz-object-lock-mode"
                    },
                    ObjectLockRetainUntilDate: {
                        shape: "S1g",
                        location: "header",
                        locationName: "x-amz-object-lock-retain-until-date"
                    },
                    ObjectLockLegalHoldStatus: {
                        location: "header",
                        locationName: "x-amz-object-lock-legal-hold"
                    }
                },
                payload: "Body"
            },
            output: {
                type: "structure",
                members: {
                    Expiration: {
                        location: "header",
                        locationName: "x-amz-expiration"
                    },
                    ETag: {
                        location: "header",
                        locationName: "ETag"
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        PutObjectAcl: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}?acl"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    ACL: {
                        location: "header",
                        locationName: "x-amz-acl"
                    },
                    AccessControlPolicy: {
                        shape: "Sb5",
                        locationName: "AccessControlPolicy",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    },
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    GrantFullControl: {
                        location: "header",
                        locationName: "x-amz-grant-full-control"
                    },
                    GrantRead: {
                        location: "header",
                        locationName: "x-amz-grant-read"
                    },
                    GrantReadACP: {
                        location: "header",
                        locationName: "x-amz-grant-read-acp"
                    },
                    GrantWrite: {
                        location: "header",
                        locationName: "x-amz-grant-write"
                    },
                    GrantWriteACP: {
                        location: "header",
                        locationName: "x-amz-grant-write-acp"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    }
                },
                payload: "AccessControlPolicy"
            },
            output: {
                type: "structure",
                members: {
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        PutObjectLegalHold: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}?legal-hold"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    LegalHold: {
                        shape: "S8p",
                        locationName: "LegalHold",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    }
                },
                payload: "LegalHold"
            },
            output: {
                type: "structure",
                members: {
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        PutObjectLockConfiguration: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?object-lock"
            },
            input: {
                type: "structure",
                required: ["Bucket"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ObjectLockConfiguration: {
                        shape: "S8s",
                        locationName: "ObjectLockConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    Token: {
                        location: "header",
                        locationName: "x-amz-bucket-object-lock-token"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    }
                },
                payload: "ObjectLockConfiguration"
            },
            output: {
                type: "structure",
                members: {
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        PutObjectRetention: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}?retention"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    Retention: {
                        shape: "S90",
                        locationName: "Retention",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    BypassGovernanceRetention: {
                        location: "header",
                        locationName: "x-amz-bypass-governance-retention",
                        type: "boolean"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    }
                },
                payload: "Retention"
            },
            output: {
                type: "structure",
                members: {
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        PutObjectTagging: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}?tagging"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key", "Tagging"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    Tagging: {
                        shape: "Sbr",
                        locationName: "Tagging",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "Tagging"
            },
            output: {
                type: "structure",
                members: {
                    VersionId: {
                        location: "header",
                        locationName: "x-amz-version-id"
                    }
                }
            }
        },
        PutPublicAccessBlock: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}?publicAccessBlock"
            },
            input: {
                type: "structure",
                required: ["Bucket", "PublicAccessBlockConfiguration"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    PublicAccessBlockConfiguration: {
                        shape: "S97",
                        locationName: "PublicAccessBlockConfiguration",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        }
                    }
                },
                payload: "PublicAccessBlockConfiguration"
            }
        },
        RestoreObject: {
            http: {
                requestUri: "/{Bucket}/{Key+}?restore"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    VersionId: {
                        location: "querystring",
                        locationName: "versionId"
                    },
                    RestoreRequest: {
                        locationName: "RestoreRequest",
                        xmlNamespace: {
                            uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                        },
                        type: "structure",
                        members: {
                            Days: {
                                type: "integer"
                            },
                            GlacierJobParameters: {
                                type: "structure",
                                required: ["Tier"],
                                members: {
                                    Tier: {}
                                }
                            },
                            Type: {},
                            Tier: {},
                            Description: {},
                            SelectParameters: {
                                type: "structure",
                                required: ["InputSerialization", "ExpressionType", "Expression", "OutputSerialization"],
                                members: {
                                    InputSerialization: {
                                        shape: "Sci"
                                    },
                                    ExpressionType: {},
                                    Expression: {},
                                    OutputSerialization: {
                                        shape: "Scx"
                                    }
                                }
                            },
                            OutputLocation: {
                                type: "structure",
                                members: {
                                    S3: {
                                        type: "structure",
                                        required: ["BucketName", "Prefix"],
                                        members: {
                                            BucketName: {},
                                            Prefix: {},
                                            Encryption: {
                                                type: "structure",
                                                required: ["EncryptionType"],
                                                members: {
                                                    EncryptionType: {},
                                                    KMSKeyId: {
                                                        shape: "Sj"
                                                    },
                                                    KMSContext: {}
                                                }
                                            },
                                            CannedACL: {},
                                            AccessControlList: {
                                                shape: "S34"
                                            },
                                            Tagging: {
                                                shape: "Sbr"
                                            },
                                            UserMetadata: {
                                                type: "list",
                                                member: {
                                                    locationName: "MetadataEntry",
                                                    type: "structure",
                                                    members: {
                                                        Name: {},
                                                        Value: {}
                                                    }
                                                }
                                            },
                                            StorageClass: {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                },
                payload: "RestoreRequest"
            },
            output: {
                type: "structure",
                members: {
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    },
                    RestoreOutputPath: {
                        location: "header",
                        locationName: "x-amz-restore-output-path"
                    }
                }
            },
            alias: "PostObjectRestore"
        },
        SelectObjectContent: {
            http: {
                requestUri: "/{Bucket}/{Key+}?select&select-type=2"
            },
            input: {
                locationName: "SelectObjectContentRequest",
                xmlNamespace: {
                    uri: "http://s3.amazonaws.com/doc/2006-03-01/"
                },
                type: "structure",
                required: ["Bucket", "Key", "Expression", "ExpressionType", "InputSerialization", "OutputSerialization"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    Expression: {},
                    ExpressionType: {},
                    RequestProgress: {
                        type: "structure",
                        members: {
                            Enabled: {
                                type: "boolean"
                            }
                        }
                    },
                    InputSerialization: {
                        shape: "Sci"
                    },
                    OutputSerialization: {
                        shape: "Scx"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Payload: {
                        type: "structure",
                        members: {
                            Records: {
                                type: "structure",
                                members: {
                                    Payload: {
                                        eventpayload: !0,
                                        type: "blob"
                                    }
                                },
                                event: !0
                            },
                            Stats: {
                                type: "structure",
                                members: {
                                    Details: {
                                        eventpayload: !0,
                                        type: "structure",
                                        members: {
                                            BytesScanned: {
                                                type: "long"
                                            },
                                            BytesProcessed: {
                                                type: "long"
                                            },
                                            BytesReturned: {
                                                type: "long"
                                            }
                                        }
                                    }
                                },
                                event: !0
                            },
                            Progress: {
                                type: "structure",
                                members: {
                                    Details: {
                                        eventpayload: !0,
                                        type: "structure",
                                        members: {
                                            BytesScanned: {
                                                type: "long"
                                            },
                                            BytesProcessed: {
                                                type: "long"
                                            },
                                            BytesReturned: {
                                                type: "long"
                                            }
                                        }
                                    }
                                },
                                event: !0
                            },
                            Cont: {
                                type: "structure",
                                members: {},
                                event: !0
                            },
                            End: {
                                type: "structure",
                                members: {},
                                event: !0
                            }
                        },
                        eventstream: !0
                    }
                },
                payload: "Payload"
            }
        },
        UploadPart: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "Key", "PartNumber", "UploadId"],
                members: {
                    Body: {
                        streaming: !0,
                        type: "blob"
                    },
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    ContentLength: {
                        location: "header",
                        locationName: "Content-Length",
                        type: "long"
                    },
                    ContentMD5: {
                        location: "header",
                        locationName: "Content-MD5"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    PartNumber: {
                        location: "querystring",
                        locationName: "partNumber",
                        type: "integer"
                    },
                    UploadId: {
                        location: "querystring",
                        locationName: "uploadId"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                },
                payload: "Body"
            },
            output: {
                type: "structure",
                members: {
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    ETag: {
                        location: "header",
                        locationName: "ETag"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                }
            }
        },
        UploadPartCopy: {
            http: {
                method: "PUT",
                requestUri: "/{Bucket}/{Key+}"
            },
            input: {
                type: "structure",
                required: ["Bucket", "CopySource", "Key", "PartNumber", "UploadId"],
                members: {
                    Bucket: {
                        location: "uri",
                        locationName: "Bucket"
                    },
                    CopySource: {
                        location: "header",
                        locationName: "x-amz-copy-source"
                    },
                    CopySourceIfMatch: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-match"
                    },
                    CopySourceIfModifiedSince: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-modified-since",
                        type: "timestamp"
                    },
                    CopySourceIfNoneMatch: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-none-match"
                    },
                    CopySourceIfUnmodifiedSince: {
                        location: "header",
                        locationName: "x-amz-copy-source-if-unmodified-since",
                        type: "timestamp"
                    },
                    CopySourceRange: {
                        location: "header",
                        locationName: "x-amz-copy-source-range"
                    },
                    Key: {
                        location: "uri",
                        locationName: "Key"
                    },
                    PartNumber: {
                        location: "querystring",
                        locationName: "partNumber",
                        type: "integer"
                    },
                    UploadId: {
                        location: "querystring",
                        locationName: "uploadId"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKey: {
                        shape: "S19",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    CopySourceSSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-copy-source-server-side-encryption-customer-algorithm"
                    },
                    CopySourceSSECustomerKey: {
                        shape: "S1c",
                        location: "header",
                        locationName: "x-amz-copy-source-server-side-encryption-customer-key"
                    },
                    CopySourceSSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-copy-source-server-side-encryption-customer-key-MD5"
                    },
                    RequestPayer: {
                        location: "header",
                        locationName: "x-amz-request-payer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    CopySourceVersionId: {
                        location: "header",
                        locationName: "x-amz-copy-source-version-id"
                    },
                    CopyPartResult: {
                        type: "structure",
                        members: {
                            ETag: {},
                            LastModified: {
                                type: "timestamp"
                            }
                        }
                    },
                    ServerSideEncryption: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption"
                    },
                    SSECustomerAlgorithm: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-algorithm"
                    },
                    SSECustomerKeyMD5: {
                        location: "header",
                        locationName: "x-amz-server-side-encryption-customer-key-MD5"
                    },
                    SSEKMSKeyId: {
                        shape: "Sj",
                        location: "header",
                        locationName: "x-amz-server-side-encryption-aws-kms-key-id"
                    },
                    RequestCharged: {
                        location: "header",
                        locationName: "x-amz-request-charged"
                    }
                },
                payload: "CopyPartResult"
            }
        }
    },
    shapes: {
        Sj: {
            type: "string",
            sensitive: !0
        },
        S11: {
            type: "map",
            key: {},
            value: {}
        },
        S19: {
            type: "blob",
            sensitive: !0
        },
        S1c: {
            type: "blob",
            sensitive: !0
        },
        S1g: {
            type: "timestamp",
            timestampFormat: "iso8601"
        },
        S31: {
            type: "structure",
            members: {
                DisplayName: {},
                ID: {}
            }
        },
        S34: {
            type: "list",
            member: {
                locationName: "Grant",
                type: "structure",
                members: {
                    Grantee: {
                        shape: "S36"
                    },
                    Permission: {}
                }
            }
        },
        S36: {
            type: "structure",
            required: ["Type"],
            members: {
                DisplayName: {},
                EmailAddress: {},
                ID: {},
                Type: {
                    locationName: "xsi:type",
                    xmlAttribute: !0
                },
                URI: {}
            },
            xmlNamespace: {
                prefix: "xsi",
                uri: "http://www.w3.org/2001/XMLSchema-instance"
            }
        },
        S3d: {
            type: "structure",
            required: ["Id", "StorageClassAnalysis"],
            members: {
                Id: {},
                Filter: {
                    type: "structure",
                    members: {
                        Prefix: {},
                        Tag: {
                            shape: "S3g"
                        },
                        And: {
                            type: "structure",
                            members: {
                                Prefix: {},
                                Tags: {
                                    shape: "S3j",
                                    flattened: !0,
                                    locationName: "Tag"
                                }
                            }
                        }
                    }
                },
                StorageClassAnalysis: {
                    type: "structure",
                    members: {
                        DataExport: {
                            type: "structure",
                            required: ["OutputSchemaVersion", "Destination"],
                            members: {
                                OutputSchemaVersion: {},
                                Destination: {
                                    type: "structure",
                                    required: ["S3BucketDestination"],
                                    members: {
                                        S3BucketDestination: {
                                            type: "structure",
                                            required: ["Format", "Bucket"],
                                            members: {
                                                Format: {},
                                                BucketAccountId: {},
                                                Bucket: {},
                                                Prefix: {}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        S3g: {
            type: "structure",
            required: ["Key", "Value"],
            members: {
                Key: {},
                Value: {}
            }
        },
        S3j: {
            type: "list",
            member: {
                shape: "S3g",
                locationName: "Tag"
            }
        },
        S3t: {
            type: "list",
            member: {
                type: "structure",
                required: ["AllowedMethods", "AllowedOrigins"],
                members: {
                    AllowedHeaders: {
                        locationName: "AllowedHeader",
                        type: "list",
                        member: {},
                        flattened: !0
                    },
                    AllowedMethods: {
                        locationName: "AllowedMethod",
                        type: "list",
                        member: {},
                        flattened: !0
                    },
                    AllowedOrigins: {
                        locationName: "AllowedOrigin",
                        type: "list",
                        member: {},
                        flattened: !0
                    },
                    ExposeHeaders: {
                        locationName: "ExposeHeader",
                        type: "list",
                        member: {},
                        flattened: !0
                    },
                    MaxAgeSeconds: {
                        type: "integer"
                    }
                }
            },
            flattened: !0
        },
        S46: {
            type: "structure",
            required: ["Rules"],
            members: {
                Rules: {
                    locationName: "Rule",
                    type: "list",
                    member: {
                        type: "structure",
                        members: {
                            ApplyServerSideEncryptionByDefault: {
                                type: "structure",
                                required: ["SSEAlgorithm"],
                                members: {
                                    SSEAlgorithm: {},
                                    KMSMasterKeyID: {
                                        shape: "Sj"
                                    }
                                }
                            }
                        }
                    },
                    flattened: !0
                }
            }
        },
        S4c: {
            type: "structure",
            required: ["Destination", "IsEnabled", "Id", "IncludedObjectVersions", "Schedule"],
            members: {
                Destination: {
                    type: "structure",
                    required: ["S3BucketDestination"],
                    members: {
                        S3BucketDestination: {
                            type: "structure",
                            required: ["Bucket", "Format"],
                            members: {
                                AccountId: {},
                                Bucket: {},
                                Format: {},
                                Prefix: {},
                                Encryption: {
                                    type: "structure",
                                    members: {
                                        SSES3: {
                                            locationName: "SSE-S3",
                                            type: "structure",
                                            members: {}
                                        },
                                        SSEKMS: {
                                            locationName: "SSE-KMS",
                                            type: "structure",
                                            required: ["KeyId"],
                                            members: {
                                                KeyId: {
                                                    shape: "Sj"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                IsEnabled: {
                    type: "boolean"
                },
                Filter: {
                    type: "structure",
                    required: ["Prefix"],
                    members: {
                        Prefix: {}
                    }
                },
                Id: {},
                IncludedObjectVersions: {},
                OptionalFields: {
                    type: "list",
                    member: {
                        locationName: "Field"
                    }
                },
                Schedule: {
                    type: "structure",
                    required: ["Frequency"],
                    members: {
                        Frequency: {}
                    }
                }
            }
        },
        S4s: {
            type: "list",
            member: {
                type: "structure",
                required: ["Prefix", "Status"],
                members: {
                    Expiration: {
                        shape: "S4u"
                    },
                    ID: {},
                    Prefix: {},
                    Status: {},
                    Transition: {
                        shape: "S4z"
                    },
                    NoncurrentVersionTransition: {
                        shape: "S51"
                    },
                    NoncurrentVersionExpiration: {
                        shape: "S52"
                    },
                    AbortIncompleteMultipartUpload: {
                        shape: "S53"
                    }
                }
            },
            flattened: !0
        },
        S4u: {
            type: "structure",
            members: {
                Date: {
                    shape: "S4v"
                },
                Days: {
                    type: "integer"
                },
                ExpiredObjectDeleteMarker: {
                    type: "boolean"
                }
            }
        },
        S4v: {
            type: "timestamp",
            timestampFormat: "iso8601"
        },
        S4z: {
            type: "structure",
            members: {
                Date: {
                    shape: "S4v"
                },
                Days: {
                    type: "integer"
                },
                StorageClass: {}
            }
        },
        S51: {
            type: "structure",
            members: {
                NoncurrentDays: {
                    type: "integer"
                },
                StorageClass: {}
            }
        },
        S52: {
            type: "structure",
            members: {
                NoncurrentDays: {
                    type: "integer"
                }
            }
        },
        S53: {
            type: "structure",
            members: {
                DaysAfterInitiation: {
                    type: "integer"
                }
            }
        },
        S57: {
            type: "list",
            member: {
                type: "structure",
                required: ["Status"],
                members: {
                    Expiration: {
                        shape: "S4u"
                    },
                    ID: {},
                    Prefix: {
                        deprecated: !0
                    },
                    Filter: {
                        type: "structure",
                        members: {
                            Prefix: {},
                            Tag: {
                                shape: "S3g"
                            },
                            And: {
                                type: "structure",
                                members: {
                                    Prefix: {},
                                    Tags: {
                                        shape: "S3j",
                                        flattened: !0,
                                        locationName: "Tag"
                                    }
                                }
                            }
                        }
                    },
                    Status: {},
                    Transitions: {
                        locationName: "Transition",
                        type: "list",
                        member: {
                            shape: "S4z"
                        },
                        flattened: !0
                    },
                    NoncurrentVersionTransitions: {
                        locationName: "NoncurrentVersionTransition",
                        type: "list",
                        member: {
                            shape: "S51"
                        },
                        flattened: !0
                    },
                    NoncurrentVersionExpiration: {
                        shape: "S52"
                    },
                    AbortIncompleteMultipartUpload: {
                        shape: "S53"
                    }
                }
            },
            flattened: !0
        },
        S5h: {
            type: "structure",
            required: ["TargetBucket", "TargetPrefix"],
            members: {
                TargetBucket: {},
                TargetGrants: {
                    type: "list",
                    member: {
                        locationName: "Grant",
                        type: "structure",
                        members: {
                            Grantee: {
                                shape: "S36"
                            },
                            Permission: {}
                        }
                    }
                },
                TargetPrefix: {}
            }
        },
        S5p: {
            type: "structure",
            required: ["Id"],
            members: {
                Id: {},
                Filter: {
                    type: "structure",
                    members: {
                        Prefix: {},
                        Tag: {
                            shape: "S3g"
                        },
                        And: {
                            type: "structure",
                            members: {
                                Prefix: {},
                                Tags: {
                                    shape: "S3j",
                                    flattened: !0,
                                    locationName: "Tag"
                                }
                            }
                        }
                    }
                }
            }
        },
        S5s: {
            type: "structure",
            required: ["Bucket"],
            members: {
                Bucket: {
                    location: "uri",
                    locationName: "Bucket"
                }
            }
        },
        S5t: {
            type: "structure",
            members: {
                TopicConfiguration: {
                    type: "structure",
                    members: {
                        Id: {},
                        Events: {
                            shape: "S5w",
                            locationName: "Event"
                        },
                        Event: {
                            deprecated: !0
                        },
                        Topic: {}
                    }
                },
                QueueConfiguration: {
                    type: "structure",
                    members: {
                        Id: {},
                        Event: {
                            deprecated: !0
                        },
                        Events: {
                            shape: "S5w",
                            locationName: "Event"
                        },
                        Queue: {}
                    }
                },
                CloudFunctionConfiguration: {
                    type: "structure",
                    members: {
                        Id: {},
                        Event: {
                            deprecated: !0
                        },
                        Events: {
                            shape: "S5w",
                            locationName: "Event"
                        },
                        CloudFunction: {},
                        InvocationRole: {}
                    }
                }
            }
        },
        S5w: {
            type: "list",
            member: {},
            flattened: !0
        },
        S64: {
            type: "structure",
            members: {
                TopicConfigurations: {
                    locationName: "TopicConfiguration",
                    type: "list",
                    member: {
                        type: "structure",
                        required: ["TopicArn", "Events"],
                        members: {
                            Id: {},
                            TopicArn: {
                                locationName: "Topic"
                            },
                            Events: {
                                shape: "S5w",
                                locationName: "Event"
                            },
                            Filter: {
                                shape: "S67"
                            }
                        }
                    },
                    flattened: !0
                },
                QueueConfigurations: {
                    locationName: "QueueConfiguration",
                    type: "list",
                    member: {
                        type: "structure",
                        required: ["QueueArn", "Events"],
                        members: {
                            Id: {},
                            QueueArn: {
                                locationName: "Queue"
                            },
                            Events: {
                                shape: "S5w",
                                locationName: "Event"
                            },
                            Filter: {
                                shape: "S67"
                            }
                        }
                    },
                    flattened: !0
                },
                LambdaFunctionConfigurations: {
                    locationName: "CloudFunctionConfiguration",
                    type: "list",
                    member: {
                        type: "structure",
                        required: ["LambdaFunctionArn", "Events"],
                        members: {
                            Id: {},
                            LambdaFunctionArn: {
                                locationName: "CloudFunction"
                            },
                            Events: {
                                shape: "S5w",
                                locationName: "Event"
                            },
                            Filter: {
                                shape: "S67"
                            }
                        }
                    },
                    flattened: !0
                }
            }
        },
        S67: {
            type: "structure",
            members: {
                Key: {
                    locationName: "S3Key",
                    type: "structure",
                    members: {
                        FilterRules: {
                            locationName: "FilterRule",
                            type: "list",
                            member: {
                                type: "structure",
                                members: {
                                    Name: {},
                                    Value: {}
                                }
                            },
                            flattened: !0
                        }
                    }
                }
            }
        },
        S6r: {
            type: "structure",
            required: ["Role", "Rules"],
            members: {
                Role: {},
                Rules: {
                    locationName: "Rule",
                    type: "list",
                    member: {
                        type: "structure",
                        required: ["Status", "Destination"],
                        members: {
                            ID: {},
                            Priority: {
                                type: "integer"
                            },
                            Prefix: {
                                deprecated: !0
                            },
                            Filter: {
                                type: "structure",
                                members: {
                                    Prefix: {},
                                    Tag: {
                                        shape: "S3g"
                                    },
                                    And: {
                                        type: "structure",
                                        members: {
                                            Prefix: {},
                                            Tags: {
                                                shape: "S3j",
                                                flattened: !0,
                                                locationName: "Tag"
                                            }
                                        }
                                    }
                                }
                            },
                            Status: {},
                            SourceSelectionCriteria: {
                                type: "structure",
                                members: {
                                    SseKmsEncryptedObjects: {
                                        type: "structure",
                                        required: ["Status"],
                                        members: {
                                            Status: {}
                                        }
                                    }
                                }
                            },
                            Destination: {
                                type: "structure",
                                required: ["Bucket"],
                                members: {
                                    Bucket: {},
                                    Account: {},
                                    StorageClass: {},
                                    AccessControlTranslation: {
                                        type: "structure",
                                        required: ["Owner"],
                                        members: {
                                            Owner: {}
                                        }
                                    },
                                    EncryptionConfiguration: {
                                        type: "structure",
                                        members: {
                                            ReplicaKmsKeyID: {}
                                        }
                                    }
                                }
                            },
                            DeleteMarkerReplication: {
                                type: "structure",
                                members: {
                                    Status: {}
                                }
                            }
                        }
                    },
                    flattened: !0
                }
            }
        },
        S7k: {
            type: "structure",
            required: ["HostName"],
            members: {
                HostName: {},
                Protocol: {}
            }
        },
        S7n: {
            type: "structure",
            required: ["Suffix"],
            members: {
                Suffix: {}
            }
        },
        S7p: {
            type: "structure",
            required: ["Key"],
            members: {
                Key: {}
            }
        },
        S7q: {
            type: "list",
            member: {
                locationName: "RoutingRule",
                type: "structure",
                required: ["Redirect"],
                members: {
                    Condition: {
                        type: "structure",
                        members: {
                            HttpErrorCodeReturnedEquals: {},
                            KeyPrefixEquals: {}
                        }
                    },
                    Redirect: {
                        type: "structure",
                        members: {
                            HostName: {},
                            HttpRedirectCode: {},
                            Protocol: {},
                            ReplaceKeyPrefixWith: {},
                            ReplaceKeyWith: {}
                        }
                    }
                }
            }
        },
        S8p: {
            type: "structure",
            members: {
                Status: {}
            }
        },
        S8s: {
            type: "structure",
            members: {
                ObjectLockEnabled: {},
                Rule: {
                    type: "structure",
                    members: {
                        DefaultRetention: {
                            type: "structure",
                            members: {
                                Mode: {},
                                Days: {
                                    type: "integer"
                                },
                                Years: {
                                    type: "integer"
                                }
                            }
                        }
                    }
                }
            }
        },
        S90: {
            type: "structure",
            members: {
                Mode: {},
                RetainUntilDate: {
                    shape: "S4v"
                }
            }
        },
        S97: {
            type: "structure",
            members: {
                BlockPublicAcls: {
                    locationName: "BlockPublicAcls",
                    type: "boolean"
                },
                IgnorePublicAcls: {
                    locationName: "IgnorePublicAcls",
                    type: "boolean"
                },
                BlockPublicPolicy: {
                    locationName: "BlockPublicPolicy",
                    type: "boolean"
                },
                RestrictPublicBuckets: {
                    locationName: "RestrictPublicBuckets",
                    type: "boolean"
                }
            }
        },
        Sa4: {
            type: "structure",
            members: {
                ID: {},
                DisplayName: {}
            }
        },
        Sa5: {
            type: "list",
            member: {
                type: "structure",
                members: {
                    Prefix: {}
                }
            },
            flattened: !0
        },
        San: {
            type: "list",
            member: {
                type: "structure",
                members: {
                    Key: {},
                    LastModified: {
                        type: "timestamp"
                    },
                    ETag: {},
                    Size: {
                        type: "integer"
                    },
                    StorageClass: {},
                    Owner: {
                        shape: "S31"
                    }
                }
            },
            flattened: !0
        },
        Sb5: {
            type: "structure",
            members: {
                Grants: {
                    shape: "S34",
                    locationName: "AccessControlList"
                },
                Owner: {
                    shape: "S31"
                }
            }
        },
        Sbr: {
            type: "structure",
            required: ["TagSet"],
            members: {
                TagSet: {
                    shape: "S3j"
                }
            }
        },
        Sci: {
            type: "structure",
            members: {
                CSV: {
                    type: "structure",
                    members: {
                        FileHeaderInfo: {},
                        Comments: {},
                        QuoteEscapeCharacter: {},
                        RecordDelimiter: {},
                        FieldDelimiter: {},
                        QuoteCharacter: {},
                        AllowQuotedRecordDelimiter: {
                            type: "boolean"
                        }
                    }
                },
                CompressionType: {},
                JSON: {
                    type: "structure",
                    members: {
                        Type: {}
                    }
                },
                Parquet: {
                    type: "structure",
                    members: {}
                }
            }
        },
        Scx: {
            type: "structure",
            members: {
                CSV: {
                    type: "structure",
                    members: {
                        QuoteFields: {},
                        QuoteEscapeCharacter: {},
                        RecordDelimiter: {},
                        FieldDelimiter: {},
                        QuoteCharacter: {}
                    }
                },
                JSON: {
                    type: "structure",
                    members: {
                        RecordDelimiter: {}
                    }
                }
            }
        }
    },
    paginators: {
        ListBuckets: {
            result_key: "Buckets"
        },
        ListMultipartUploads: {
            input_token: ["KeyMarker", "UploadIdMarker"],
            limit_key: "MaxUploads",
            more_results: "IsTruncated",
            output_token: ["NextKeyMarker", "NextUploadIdMarker"],
            result_key: ["Uploads", "CommonPrefixes"]
        },
        ListObjectVersions: {
            input_token: ["KeyMarker", "VersionIdMarker"],
            limit_key: "MaxKeys",
            more_results: "IsTruncated",
            output_token: ["NextKeyMarker", "NextVersionIdMarker"],
            result_key: ["Versions", "DeleteMarkers", "CommonPrefixes"]
        },
        ListObjects: {
            input_token: "Marker",
            limit_key: "MaxKeys",
            more_results: "IsTruncated",
            output_token: "NextMarker || Contents[-1].Key",
            result_key: ["Contents", "CommonPrefixes"]
        },
        ListObjectsV2: {
            input_token: "ContinuationToken",
            limit_key: "MaxKeys",
            output_token: "NextContinuationToken",
            result_key: ["Contents", "CommonPrefixes"]
        },
        ListParts: {
            input_token: "PartNumberMarker",
            limit_key: "MaxParts",
            more_results: "IsTruncated",
            output_token: "NextPartNumberMarker",
            result_key: "Parts"
        }
    },
    waiters: {
        BucketExists: {
            delay: 5,
            operation: "HeadBucket",
            maxAttempts: 20,
            acceptors: [{
                expected: 200,
                matcher: "status",
                state: "success"
            },
            {
                expected: 301,
                matcher: "status",
                state: "success"
            },
            {
                expected: 403,
                matcher: "status",
                state: "success"
            },
            {
                expected: 404,
                matcher: "status",
                state: "retry"
            }]
        },
        BucketNotExists: {
            delay: 5,
            operation: "HeadBucket",
            maxAttempts: 20,
            acceptors: [{
                expected: 404,
                matcher: "status",
                state: "success"
            }]
        },
        ObjectExists: {
            delay: 5,
            operation: "HeadObject",
            maxAttempts: 20,
            acceptors: [{
                expected: 200,
                matcher: "status",
                state: "success"
            },
            {
                expected: 404,
                matcher: "status",
                state: "retry"
            }]
        },
        ObjectNotExists: {
            delay: 5,
            operation: "HeadObject",
            maxAttempts: 20,
            acceptors: [{
                expected: 404,
                matcher: "status",
                state: "success"
            }]
        }
    }
};
AWS.apiLoader.services.s3control = {},
AWS.S3Control = AWS.Service.defineService("s3control", ["2018-08-20"]),
_xamzrequire = function e(t, r, o) {
    function n(i, c) {
        if (!r[i]) {
            if (!t[i]) {
                var s = "function" == typeof _xamzrequire && _xamzrequire;
                if (!c && s) return s(i, !0);
                if (a) return a(i, !0);
                var d = new Error("Cannot find module '" + i + "'");
                throw d.code = "MODULE_NOT_FOUND",
                d
            }
            var u = r[i] = {
                exports: {}
            };
            t[i][0].call(u.exports,
            function(e) {
                var r = t[i][1][e];
                return n(r || e)
            },
            u, u.exports, e, t, r, o)
        }
        return r[i].exports
    }
    for (var a = "function" == typeof _xamzrequire && _xamzrequire,
    i = 0; i < o.length; i++) n(o[i]);
    return n
} ({
    104 : [function(e, t, r) {
        var o = e("../core");
        o.util.update(o.S3Control.prototype, {
            setupRequestListeners: function(e) {
                e.addListener("afterBuild", this.prependAccountId),
                e.addListener("extractError", this.extractHostId),
                e.addListener("extractData", this.extractHostId),
                e.addListener("validate", this.validateAccountId)
            },
            prependAccountId: function(e) {
                var t = e.service.api,
                r = t.operations[e.operation],
                o = r.input,
                n = e.params;
                if (o.members.AccountId && n.AccountId) {
                    var a = n.AccountId,
                    i = e.httpRequest.endpoint,
                    c = String(a) + "." + i.hostname;
                    i.hostname = c,
                    e.httpRequest.headers.Host = c,
                    delete e.httpRequest.headers["x-amz-account-id"]
                }
            },
            extractHostId: function(e) {
                var t = e.httpResponse.headers ? e.httpResponse.headers["x-amz-id-2"] : null;
                e.extendedRequestId = t,
                e.error && (e.error.extendedRequestId = t)
            },
            validateAccountId: function(e) {
                var t = e.params;
                if (Object.prototype.hasOwnProperty.call(t, "AccountId")) {
                    var r = t.AccountId;
                    if ("string" != typeof r) throw o.util.error(new Error, {
                        code: "ValidationError",
                        message: "AccountId must be a string."
                    });
                    if (r.length < 1 || r.length > 63) throw o.util.error(new Error, {
                        code: "ValidationError",
                        message: "AccountId length should be between 1 to 63 characters, inclusive."
                    });
                    if (!/^[a-zA-Z0-9]{1}$|^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/.test(r)) throw o.util.error(new Error, {
                        code: "ValidationError",
                        message: "AccountId should be hostname compatible. AccountId: " + r
                    })
                }
            }
        })
    },
    {
        "../core": 38
    }]
},
{},
[104]);
AWS.apiLoader.services.s3control["2018-08-20"] = {
    version: "2.0",
    metadata: {
        apiVersion: "2018-08-20",
        endpointPrefix: "s3-control",
        protocol: "rest-xml",
        serviceFullName: "AWS S3 Control",
        serviceId: "S3 Control",
        signatureVersion: "s3v4",
        signingName: "s3",
        uid: "s3control-2018-08-20"
    },
    operations: {
        CreateJob: {
            http: {
                requestUri: "/v20180820/jobs"
            },
            input: {
                locationName: "CreateJobRequest",
                xmlNamespace: {
                    uri: "http://awss3control.amazonaws.com/doc/2018-08-20/"
                },
                type: "structure",
                required: ["AccountId", "Operation", "Report", "ClientRequestToken", "Manifest", "Priority", "RoleArn"],
                members: {
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    },
                    ConfirmationRequired: {
                        type: "boolean"
                    },
                    Operation: {
                        shape: "S4"
                    },
                    Report: {
                        shape: "S12"
                    },
                    ClientRequestToken: {
                        idempotencyToken: !0
                    },
                    Manifest: {
                        shape: "S17"
                    },
                    Description: {},
                    Priority: {
                        type: "integer"
                    },
                    RoleArn: {}
                }
            },
            output: {
                type: "structure",
                members: {
                    JobId: {}
                }
            }
        },
        DeletePublicAccessBlock: {
            http: {
                method: "DELETE",
                requestUri: "/v20180820/configuration/publicAccessBlock"
            },
            input: {
                type: "structure",
                required: ["AccountId"],
                members: {
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    }
                }
            }
        },
        DescribeJob: {
            http: {
                method: "GET",
                requestUri: "/v20180820/jobs/{id}"
            },
            input: {
                type: "structure",
                required: ["AccountId", "JobId"],
                members: {
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    },
                    JobId: {
                        location: "uri",
                        locationName: "id"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    Job: {
                        type: "structure",
                        members: {
                            JobId: {},
                            ConfirmationRequired: {
                                type: "boolean"
                            },
                            Description: {},
                            JobArn: {},
                            Status: {},
                            Manifest: {
                                shape: "S17"
                            },
                            Operation: {
                                shape: "S4"
                            },
                            Priority: {
                                type: "integer"
                            },
                            ProgressSummary: {
                                shape: "S1q"
                            },
                            StatusUpdateReason: {},
                            FailureReasons: {
                                type: "list",
                                member: {
                                    type: "structure",
                                    members: {
                                        FailureCode: {},
                                        FailureReason: {}
                                    }
                                }
                            },
                            Report: {
                                shape: "S12"
                            },
                            CreationTime: {
                                type: "timestamp"
                            },
                            TerminationDate: {
                                type: "timestamp"
                            },
                            RoleArn: {},
                            SuspendedDate: {
                                type: "timestamp"
                            },
                            SuspendedCause: {}
                        }
                    }
                }
            }
        },
        GetPublicAccessBlock: {
            http: {
                method: "GET",
                requestUri: "/v20180820/configuration/publicAccessBlock"
            },
            input: {
                type: "structure",
                required: ["AccountId"],
                members: {
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    PublicAccessBlockConfiguration: {
                        shape: "S25"
                    }
                },
                payload: "PublicAccessBlockConfiguration"
            }
        },
        ListJobs: {
            http: {
                method: "GET",
                requestUri: "/v20180820/jobs"
            },
            input: {
                type: "structure",
                required: ["AccountId"],
                members: {
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    },
                    JobStatuses: {
                        location: "querystring",
                        locationName: "jobStatuses",
                        type: "list",
                        member: {}
                    },
                    NextToken: {
                        location: "querystring",
                        locationName: "nextToken"
                    },
                    MaxResults: {
                        location: "querystring",
                        locationName: "maxResults",
                        type: "integer"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    NextToken: {},
                    Jobs: {
                        type: "list",
                        member: {
                            type: "structure",
                            members: {
                                JobId: {},
                                Description: {},
                                Operation: {},
                                Priority: {
                                    type: "integer"
                                },
                                Status: {},
                                CreationTime: {
                                    type: "timestamp"
                                },
                                TerminationDate: {
                                    type: "timestamp"
                                },
                                ProgressSummary: {
                                    shape: "S1q"
                                }
                            }
                        }
                    }
                }
            }
        },
        PutPublicAccessBlock: {
            http: {
                method: "PUT",
                requestUri: "/v20180820/configuration/publicAccessBlock"
            },
            input: {
                type: "structure",
                required: ["PublicAccessBlockConfiguration", "AccountId"],
                members: {
                    PublicAccessBlockConfiguration: {
                        shape: "S25",
                        locationName: "PublicAccessBlockConfiguration",
                        xmlNamespace: {
                            uri: "http://awss3control.amazonaws.com/doc/2018-08-20/"
                        }
                    },
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    }
                },
                payload: "PublicAccessBlockConfiguration"
            }
        },
        UpdateJobPriority: {
            http: {
                requestUri: "/v20180820/jobs/{id}/priority"
            },
            input: {
                type: "structure",
                required: ["AccountId", "JobId", "Priority"],
                members: {
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    },
                    JobId: {
                        location: "uri",
                        locationName: "id"
                    },
                    Priority: {
                        location: "querystring",
                        locationName: "priority",
                        type: "integer"
                    }
                }
            },
            output: {
                type: "structure",
                required: ["JobId", "Priority"],
                members: {
                    JobId: {},
                    Priority: {
                        type: "integer"
                    }
                }
            }
        },
        UpdateJobStatus: {
            http: {
                requestUri: "/v20180820/jobs/{id}/status"
            },
            input: {
                type: "structure",
                required: ["AccountId", "JobId", "RequestedJobStatus"],
                members: {
                    AccountId: {
                        location: "header",
                        locationName: "x-amz-account-id"
                    },
                    JobId: {
                        location: "uri",
                        locationName: "id"
                    },
                    RequestedJobStatus: {
                        location: "querystring",
                        locationName: "requestedJobStatus"
                    },
                    StatusUpdateReason: {
                        location: "querystring",
                        locationName: "statusUpdateReason"
                    }
                }
            },
            output: {
                type: "structure",
                members: {
                    JobId: {},
                    Status: {},
                    StatusUpdateReason: {}
                }
            }
        }
    },
    shapes: {
        S4: {
            type: "structure",
            members: {
                LambdaInvoke: {
                    type: "structure",
                    members: {
                        FunctionArn: {}
                    }
                },
                S3PutObjectCopy: {
                    type: "structure",
                    members: {
                        TargetResource: {},
                        CannedAccessControlList: {},
                        AccessControlGrants: {
                            shape: "Sa"
                        },
                        MetadataDirective: {},
                        ModifiedSinceConstraint: {
                            type: "timestamp"
                        },
                        NewObjectMetadata: {
                            type: "structure",
                            members: {
                                CacheControl: {},
                                ContentDisposition: {},
                                ContentEncoding: {},
                                ContentLanguage: {},
                                UserMetadata: {
                                    type: "map",
                                    key: {},
                                    value: {}
                                },
                                ContentLength: {
                                    type: "long"
                                },
                                ContentMD5: {},
                                ContentType: {},
                                HttpExpiresDate: {
                                    type: "timestamp"
                                },
                                RequesterCharged: {
                                    type: "boolean"
                                },
                                SSEAlgorithm: {}
                            }
                        },
                        NewObjectTagging: {
                            shape: "Sn"
                        },
                        RedirectLocation: {},
                        RequesterPays: {
                            type: "boolean"
                        },
                        StorageClass: {},
                        UnModifiedSinceConstraint: {
                            type: "timestamp"
                        },
                        SSEAwsKmsKeyId: {},
                        TargetKeyPrefix: {},
                        ObjectLockLegalHoldStatus: {},
                        ObjectLockMode: {},
                        ObjectLockRetainUntilDate: {
                            type: "timestamp"
                        }
                    }
                },
                S3PutObjectAcl: {
                    type: "structure",
                    members: {
                        AccessControlPolicy: {
                            type: "structure",
                            members: {
                                AccessControlList: {
                                    type: "structure",
                                    required: ["Owner"],
                                    members: {
                                        Owner: {
                                            type: "structure",
                                            members: {
                                                ID: {},
                                                DisplayName: {}
                                            }
                                        },
                                        Grants: {
                                            shape: "Sa"
                                        }
                                    }
                                },
                                CannedAccessControlList: {}
                            }
                        }
                    }
                },
                S3PutObjectTagging: {
                    type: "structure",
                    members: {
                        TagSet: {
                            shape: "Sn"
                        }
                    }
                },
                S3InitiateRestoreObject: {
                    type: "structure",
                    members: {
                        ExpirationInDays: {
                            type: "integer"
                        },
                        GlacierJobTier: {}
                    }
                }
            }
        },
        Sa: {
            type: "list",
            member: {
                type: "structure",
                members: {
                    Grantee: {
                        type: "structure",
                        members: {
                            TypeIdentifier: {},
                            Identifier: {},
                            DisplayName: {}
                        }
                    },
                    Permission: {}
                }
            }
        },
        Sn: {
            type: "list",
            member: {
                type: "structure",
                required: ["Key", "Value"],
                members: {
                    Key: {},
                    Value: {}
                }
            }
        },
        S12: {
            type: "structure",
            required: ["Enabled"],
            members: {
                Bucket: {},
                Format: {},
                Enabled: {
                    type: "boolean"
                },
                Prefix: {},
                ReportScope: {}
            }
        },
        S17: {
            type: "structure",
            required: ["Spec", "Location"],
            members: {
                Spec: {
                    type: "structure",
                    required: ["Format"],
                    members: {
                        Format: {},
                        Fields: {
                            type: "list",
                            member: {}
                        }
                    }
                },
                Location: {
                    type: "structure",
                    required: ["ObjectArn", "ETag"],
                    members: {
                        ObjectArn: {},
                        ObjectVersionId: {},
                        ETag: {}
                    }
                }
            }
        },
        S1q: {
            type: "structure",
            members: {
                TotalNumberOfTasks: {
                    type: "long"
                },
                NumberOfTasksSucceeded: {
                    type: "long"
                },
                NumberOfTasksFailed: {
                    type: "long"
                }
            }
        },
        S25: {
            type: "structure",
            members: {
                BlockPublicAcls: {
                    locationName: "BlockPublicAcls",
                    type: "boolean"
                },
                IgnorePublicAcls: {
                    locationName: "IgnorePublicAcls",
                    type: "boolean"
                },
                BlockPublicPolicy: {
                    locationName: "BlockPublicPolicy",
                    type: "boolean"
                },
                RestrictPublicBuckets: {
                    locationName: "RestrictPublicBuckets",
                    type: "boolean"
                }
            }
        }
    },
    paginators: {
        ListJobs: {
            input_token: "NextToken",
            output_token: "NextToken",
            limit_key: "MaxResults"
        }
    }
};
AWS.apiLoader.services.sts = {},
AWS.STS = AWS.Service.defineService("sts", ["2011-06-15"]),
_xamzrequire = function e(r, t, n) {
    function i(o, a) {
        if (!t[o]) {
            if (!r[o]) {
                var u = "function" == typeof _xamzrequire && _xamzrequire;
                if (!a && u) return u(o, !0);
                if (s) return s(o, !0);
                var c = new Error("Cannot find module '" + o + "'");
                throw c.code = "MODULE_NOT_FOUND",
                c
            }
            var d = t[o] = {
                exports: {}
            };
            r[o][0].call(d.exports,
            function(e) {
                var t = r[o][1][e];
                return i(t || e)
            },
            d, d.exports, e, r, t, n)
        }
        return t[o].exports
    }
    for (var s = "function" == typeof _xamzrequire && _xamzrequire,
    o = 0; o < n.length; o++) i(n[o]);
    return i
} ({
    106 : [function(e, r, t) {
        var n = e("../core");
        n.util.update(n.STS.prototype, {
            credentialsFrom: function(e, r) {
                return e ? (r || (r = new n.TemporaryCredentials), r.expired = !1, r.accessKeyId = e.Credentials.AccessKeyId, r.secretAccessKey = e.Credentials.SecretAccessKey, r.sessionToken = e.Credentials.SessionToken, r.expireTime = e.Credentials.Expiration, r) : null
            },
            assumeRoleWithWebIdentity: function(e, r) {
                return this.makeUnauthenticatedRequest("assumeRoleWithWebIdentity", e, r)
            },
            assumeRoleWithSAML: function(e, r) {
                return this.makeUnauthenticatedRequest("assumeRoleWithSAML", e, r)
            }
        })
    },
    {
        "../core": 38
    }]
},
{},
[106]);
AWS.apiLoader.services.sts["2011-06-15"] = {
    version: "2.0",
    metadata: {
        apiVersion: "2011-06-15",
        endpointPrefix: "sts",
        globalEndpoint: "sts.amazonaws.com",
        protocol: "query",
        serviceAbbreviation: "AWS STS",
        serviceFullName: "AWS Security Token Service",
        serviceId: "STS",
        signatureVersion: "v4",
        uid: "sts-2011-06-15",
        xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/"
    },
    operations: {
        AssumeRole: {
            input: {
                type: "structure",
                required: ["RoleArn", "RoleSessionName"],
                members: {
                    RoleArn: {},
                    RoleSessionName: {},
                    PolicyArns: {
                        shape: "S4"
                    },
                    Policy: {},
                    DurationSeconds: {
                        type: "integer"
                    },
                    ExternalId: {},
                    SerialNumber: {},
                    TokenCode: {}
                }
            },
            output: {
                resultWrapper: "AssumeRoleResult",
                type: "structure",
                members: {
                    Credentials: {
                        shape: "Sc"
                    },
                    AssumedRoleUser: {
                        shape: "Sh"
                    },
                    PackedPolicySize: {
                        type: "integer"
                    }
                }
            }
        },
        AssumeRoleWithSAML: {
            input: {
                type: "structure",
                required: ["RoleArn", "PrincipalArn", "SAMLAssertion"],
                members: {
                    RoleArn: {},
                    PrincipalArn: {},
                    SAMLAssertion: {},
                    PolicyArns: {
                        shape: "S4"
                    },
                    Policy: {},
                    DurationSeconds: {
                        type: "integer"
                    }
                }
            },
            output: {
                resultWrapper: "AssumeRoleWithSAMLResult",
                type: "structure",
                members: {
                    Credentials: {
                        shape: "Sc"
                    },
                    AssumedRoleUser: {
                        shape: "Sh"
                    },
                    PackedPolicySize: {
                        type: "integer"
                    },
                    Subject: {},
                    SubjectType: {},
                    Issuer: {},
                    Audience: {},
                    NameQualifier: {}
                }
            }
        },
        AssumeRoleWithWebIdentity: {
            input: {
                type: "structure",
                required: ["RoleArn", "RoleSessionName", "WebIdentityToken"],
                members: {
                    RoleArn: {},
                    RoleSessionName: {},
                    WebIdentityToken: {},
                    ProviderId: {},
                    PolicyArns: {
                        shape: "S4"
                    },
                    Policy: {},
                    DurationSeconds: {
                        type: "integer"
                    }
                }
            },
            output: {
                resultWrapper: "AssumeRoleWithWebIdentityResult",
                type: "structure",
                members: {
                    Credentials: {
                        shape: "Sc"
                    },
                    SubjectFromWebIdentityToken: {},
                    AssumedRoleUser: {
                        shape: "Sh"
                    },
                    PackedPolicySize: {
                        type: "integer"
                    },
                    Provider: {},
                    Audience: {}
                }
            }
        },
        DecodeAuthorizationMessage: {
            input: {
                type: "structure",
                required: ["EncodedMessage"],
                members: {
                    EncodedMessage: {}
                }
            },
            output: {
                resultWrapper: "DecodeAuthorizationMessageResult",
                type: "structure",
                members: {
                    DecodedMessage: {}
                }
            }
        },
        GetCallerIdentity: {
            input: {
                type: "structure",
                members: {}
            },
            output: {
                resultWrapper: "GetCallerIdentityResult",
                type: "structure",
                members: {
                    UserId: {},
                    Account: {},
                    Arn: {}
                }
            }
        },
        GetFederationToken: {
            input: {
                type: "structure",
                required: ["Name"],
                members: {
                    Name: {},
                    Policy: {},
                    PolicyArns: {
                        shape: "S4"
                    },
                    DurationSeconds: {
                        type: "integer"
                    }
                }
            },
            output: {
                resultWrapper: "GetFederationTokenResult",
                type: "structure",
                members: {
                    Credentials: {
                        shape: "Sc"
                    },
                    FederatedUser: {
                        type: "structure",
                        required: ["FederatedUserId", "Arn"],
                        members: {
                            FederatedUserId: {},
                            Arn: {}
                        }
                    },
                    PackedPolicySize: {
                        type: "integer"
                    }
                }
            }
        },
        GetSessionToken: {
            input: {
                type: "structure",
                members: {
                    DurationSeconds: {
                        type: "integer"
                    },
                    SerialNumber: {},
                    TokenCode: {}
                }
            },
            output: {
                resultWrapper: "GetSessionTokenResult",
                type: "structure",
                members: {
                    Credentials: {
                        shape: "Sc"
                    }
                }
            }
        }
    },
    shapes: {
        S4: {
            type: "list",
            member: {
                type: "structure",
                members: {
                    arn: {}
                }
            }
        },
        Sc: {
            type: "structure",
            required: ["AccessKeyId", "SecretAccessKey", "SessionToken", "Expiration"],
            members: {
                AccessKeyId: {},
                SecretAccessKey: {},
                SessionToken: {},
                Expiration: {
                    type: "timestamp"
                }
            }
        },
        Sh: {
            type: "structure",
            required: ["AssumedRoleId", "Arn"],
            members: {
                AssumedRoleId: {},
                Arn: {}
            }
        }
    },
    paginators: {}
};