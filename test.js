/**
 * Created by kashi on 2016/10/11.
 */
"use strict";

try {
    (function () {
        var g = function () {
            var aq = "undefined", aD = "object", ab = "Shockwave Flash", X = "ShockwaveFlash.ShockwaveFlash", aE = "application/x-shockwave-flash", ac = "SWFObjectExprInst", ax = "onreadystatechange", af = window, aL = document, aB = navigator, aa = false, Z = [aN], aG = [], ag = [], al = [], aJ, ad, ap, at, ak = false, aU = false, aH, an, aI = true, ah = function () {
                var j = typeof aL.getElementById != aq && typeof aL.getElementsByTagName != aq && typeof aL.createElement != aq, n = aB.userAgent.toLowerCase(), l = aB.platform.toLowerCase(), q = l ? /win/.test(l) : /win/.test(n), s = l ? /mac/.test(l) : /mac/.test(n), p = /webkit/.test(n) ? parseFloat(n.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, m = !+"\v1", o = [0, 0, 0], t = null;
                if (typeof aB.plugins != aq && typeof aB.plugins[ab] == aD) {
                    t = aB.plugins[ab].description;
                    if (t && !(typeof aB.mimeTypes != aq && aB.mimeTypes[aE] && !aB.mimeTypes[aE].enabledPlugin)) {
                        aa = true;
                        m = false;
                        t = t.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                        o[0] = parseInt(t.replace(/^(.*)\..*$/, "$1"), 10);
                        o[1] = parseInt(t.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                        o[2] = /[a-zA-Z]/.test(t) ? parseInt(t.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
                    }
                } else {
                    if (typeof af.ActiveXObject != aq) {
                        try {
                            var r = new ActiveXObject(X);
                            if (r) {
                                t = r.GetVariable("$version");
                                if (t) {
                                    m = true;
                                    t = t.split(" ")[1].split(",");
                                    o = [parseInt(t[0], 10), parseInt(t[1], 10), parseInt(t[2], 10)]
                                }
                            }
                        } catch (k) {
                        }
                    }
                }
                return {w3: j, pv: o, wk: p, ie: m, win: q, mac: s}
            }(), aK = function () {
                if (!ah.w3) {
                    return
                }
                if ((typeof aL.readyState != aq && aL.readyState == "complete") || (typeof aL.readyState == aq && (aL.getElementsByTagName("body")[0] || aL.body))) {
                    aP()
                }
                if (!ak) {
                    if (typeof aL.addEventListener != aq) {
                        aL.addEventListener("DOMContentLoaded", aP, false)
                    }
                    if (ah.ie && ah.win) {
                        aL.attachEvent(ax, function () {
                            if (aL.readyState == "complete") {
                                aL.detachEvent(ax, arguments.callee);
                                aP()
                            }
                        });
                        if (af == top) {
                            (function () {
                                if (ak) {
                                    return
                                }
                                try {
                                    aL.documentElement.doScroll("left")
                                } catch (j) {
                                    setTimeout(arguments.callee, 0);
                                    return
                                }
                                aP()
                            })()
                        }
                    }
                    if (ah.wk) {
                        (function () {
                            if (ak) {
                                return
                            }
                            if (!/loaded|complete/.test(aL.readyState)) {
                                setTimeout(arguments.callee, 0);
                                return
                            }
                            aP()
                        })()
                    }
                    aC(aP)
                }
            }();

            function aP() {
                if (ak) {
                    return
                }
                try {
                    var k = aL.getElementsByTagName("body")[0].appendChild(ar("span"));
                    k.parentNode.removeChild(k)
                } catch (j) {
                    return
                }
                ak = true;
                var m = Z.length;
                for (var l = 0; l < m; l++) {
                    Z[l]()
                }
            }

            function aj(j) {
                if (ak) {
                    j()
                } else {
                    Z[Z.length] = j
                }
            }

            function aC(j) {
                if (typeof af.addEventListener != aq) {
                    af.addEventListener("load", j, false)
                } else {
                    if (typeof aL.addEventListener != aq) {
                        aL.addEventListener("load", j, false)
                    } else {
                        if (typeof af.attachEvent != aq) {
                            aM(af, "onload", j)
                        } else {
                            if (typeof af.onload == "function") {
                                var k = af.onload;
                                af.onload = function () {
                                    k();
                                    j()
                                }
                            } else {
                                af.onload = j
                            }
                        }
                    }
                }
            }

            function aN() {
                if (aa) {
                    Y()
                } else {
                    am()
                }
            }

            function Y() {
                var m = aL.getElementsByTagName("body")[0];
                var k = ar(aD);
                k.setAttribute("type", aE);
                var j = m.appendChild(k);
                if (j) {
                    var l = 0;
                    (function () {
                        if (typeof j.GetVariable != aq) {
                            var n = j.GetVariable("$version");
                            if (n) {
                                n = n.split(" ")[1].split(",");
                                ah.pv = [parseInt(n[0], 10), parseInt(n[1], 10), parseInt(n[2], 10)]
                            }
                        } else {
                            if (l < 10) {
                                l++;
                                setTimeout(arguments.callee, 10);
                                return
                            }
                        }
                        m.removeChild(k);
                        j = null;
                        am()
                    })()
                } else {
                    am()
                }
            }

            function am() {
                var p = aG.length;
                if (p > 0) {
                    for (var q = 0; q < p; q++) {
                        var l = aG[q].id;
                        var u = aG[q].callbackFn;
                        var j = {success: false, id: l};
                        if (ah.pv[0] > 0) {
                            var r = aS(l);
                            if (r) {
                                if (ao(aG[q].swfVersion) && !(ah.wk && ah.wk < 312)) {
                                    ay(l, true);
                                    if (u) {
                                        j.success = true;
                                        j.ref = av(l);
                                        u(j)
                                    }
                                } else {
                                    if (aG[q].expressInstall && au()) {
                                        var n = {};
                                        n.data = aG[q].expressInstall;
                                        n.width = r.getAttribute("width") || "0";
                                        n.height = r.getAttribute("height") || "0";
                                        if (r.getAttribute("class")) {
                                            n.styleclass = r.getAttribute("class")
                                        }
                                        if (r.getAttribute("align")) {
                                            n.align = r.getAttribute("align")
                                        }
                                        var o = {};
                                        var m = r.getElementsByTagName("param");
                                        var t = m.length;
                                        for (var s = 0; s < t; s++) {
                                            if (m[s].getAttribute("name").toLowerCase() != "movie") {
                                                o[m[s].getAttribute("name")] = m[s].getAttribute("value")
                                            }
                                        }
                                        ae(n, o, l, u)
                                    } else {
                                        aF(r);
                                        if (u) {
                                            u(j)
                                        }
                                    }
                                }
                            }
                        } else {
                            ay(l, true);
                            if (u) {
                                var k = av(l);
                                if (k && typeof k.SetVariable != aq) {
                                    j.success = true;
                                    j.ref = k
                                }
                                u(j)
                            }
                        }
                    }
                }
            }

            function av(k) {
                var m = null;
                var l = aS(k);
                if (l && l.nodeName == "OBJECT") {
                    if (typeof l.SetVariable != aq) {
                        m = l
                    } else {
                        var j = l.getElementsByTagName(aD)[0];
                        if (j) {
                            m = j
                        }
                    }
                }
                return m
            }

            function au() {
                return !aU && ao("6.0.65") && (ah.win || ah.mac) && !(ah.wk && ah.wk < 312)
            }

            function ae(o, m, q, n) {
                aU = true;
                ap = n || null;
                at = {success: false, id: q};
                var j = aS(q);
                if (j) {
                    if (j.nodeName == "OBJECT") {
                        aJ = aO(j);
                        ad = null
                    } else {
                        aJ = j;
                        ad = q
                    }
                    o.id = ac;
                    if (typeof o.width == aq || (!/%$/.test(o.width) && parseInt(o.width, 10) < 310)) {
                        o.width = "310"
                    }
                    if (typeof o.height == aq || (!/%$/.test(o.height) && parseInt(o.height, 10) < 137)) {
                        o.height = "137"
                    }
                    aL.title = aL.title.slice(0, 47) + " - Flash Player Installation";
                    var k = ah.ie && ah.win ? "ActiveX" : "PlugIn", l = "MMredirectURL=" + encodeURI(af.location).toString().replace(/&/g, "%26") + "&MMplayerType=" + k + "&MMdoctitle=" + aL.title;
                    if (typeof m.flashvars != aq) {
                        m.flashvars += "&" + l
                    } else {
                        m.flashvars = l
                    }
                    if (ah.ie && ah.win && j.readyState != 4) {
                        var p = ar("div");
                        q += "SWFObjectNew";
                        p.setAttribute("id", q);
                        j.parentNode.insertBefore(p, j);
                        j.style.display = "none";
                        (function () {
                            if (j.readyState == 4) {
                                j.parentNode.removeChild(j)
                            } else {
                                setTimeout(arguments.callee, 10)
                            }
                        })()
                    }
                    aA(o, m, q)
                }
            }

            function aF(j) {
                if (ah.ie && ah.win && j.readyState != 4) {
                    var k = ar("div");
                    j.parentNode.insertBefore(k, j);
                    k.parentNode.replaceChild(aO(j), k);
                    j.style.display = "none";
                    (function () {
                        if (j.readyState == 4) {
                            j.parentNode.removeChild(j)
                        } else {
                            setTimeout(arguments.callee, 10)
                        }
                    })()
                } else {
                    j.parentNode.replaceChild(aO(j), j)
                }
            }

            function aO(k) {
                var m = ar("div");
                if (ah.win && ah.ie) {
                    m.innerHTML = k.innerHTML
                } else {
                    var n = k.getElementsByTagName(aD)[0];
                    if (n) {
                        var j = n.childNodes;
                        if (j) {
                            var o = j.length;
                            for (var l = 0; l < o; l++) {
                                if (!(j[l].nodeType == 1 && j[l].nodeName == "PARAM") && !(j[l].nodeType == 8)) {
                                    m.appendChild(j[l].cloneNode(true))
                                }
                            }
                        }
                    }
                }
                return m
            }

            function aA(n, p, l) {
                var m, j = aS(l);
                if (ah.wk && ah.wk < 312) {
                    return m
                }
                if (j) {
                    if (typeof n.id == aq) {
                        n.id = l
                    }
                    if (ah.ie && ah.win) {
                        var o = "";
                        for (var r in n) {
                            if (n[r] != Object.prototype[r]) {
                                if (r.toLowerCase() == "data") {
                                    p.movie = n[r]
                                } else {
                                    if (r.toLowerCase() == "styleclass") {
                                        o += ' class="' + n[r] + '"'
                                    } else {
                                        if (r.toLowerCase() != "classid") {
                                            o += " " + r + '="' + n[r] + '"'
                                        }
                                    }
                                }
                            }
                        }
                        var q = "";
                        for (var s in p) {
                            if (p[s] != Object.prototype[s]) {
                                q += '<param name="' + s + '" value="' + p[s] + '" />'
                            }
                        }
                        j.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + o + ">" + q + "</object>";
                        ag[ag.length] = n.id;
                        m = aS(n.id)
                    } else {
                        var k = ar(aD);
                        k.setAttribute("type", aE);
                        for (var t in n) {
                            if (n[t] != Object.prototype[t]) {
                                if (t.toLowerCase() == "styleclass") {
                                    k.setAttribute("class", n[t])
                                } else {
                                    if (t.toLowerCase() != "classid") {
                                        k.setAttribute(t, n[t])
                                    }
                                }
                            }
                        }
                        for (var u in p) {
                            if (p[u] != Object.prototype[u] && u.toLowerCase() != "movie") {
                                aQ(k, u, p[u])
                            }
                        }
                        j.parentNode.replaceChild(k, j);
                        m = k
                    }
                }
                return m
            }

            function aQ(k, m, l) {
                var j = ar("param");
                j.setAttribute("name", m);
                j.setAttribute("value", l);
                k.appendChild(j)
            }

            function aw(j) {
                var k = aS(j);
                if (k && k.nodeName == "OBJECT") {
                    if (ah.ie && ah.win) {
                        k.style.display = "none";
                        (function () {
                            if (k.readyState == 4) {
                                aT(j)
                            } else {
                                setTimeout(arguments.callee, 10)
                            }
                        })()
                    } else {
                        k.parentNode.removeChild(k)
                    }
                }
            }

            function aT(j) {
                var k = aS(j);
                if (k) {
                    for (var l in k) {
                        if (typeof k[l] == "function") {
                            k[l] = null
                        }
                    }
                    k.parentNode.removeChild(k)
                }
            }

            function aS(j) {
                var l = null;
                try {
                    l = aL.getElementById(j)
                } catch (k) {
                }
                return l
            }

            function ar(j) {
                return aL.createElement(j)
            }

            function aM(j, l, k) {
                j.attachEvent(l, k);
                al[al.length] = [j, l, k]
            }

            function ao(j) {
                var k = ah.pv, l = j.split(".");
                l[0] = parseInt(l[0], 10);
                l[1] = parseInt(l[1], 10) || 0;
                l[2] = parseInt(l[2], 10) || 0;
                return (k[0] > l[0] || (k[0] == l[0] && k[1] > l[1]) || (k[0] == l[0] && k[1] == l[1] && k[2] >= l[2])) ? true : false
            }

            function az(k, o, j, l) {
                if (ah.ie && ah.mac) {
                    return
                }
                var n = aL.getElementsByTagName("head")[0];
                if (!n) {
                    return
                }
                var p = (j && typeof j == "string") ? j : "screen";
                if (l) {
                    aH = null;
                    an = null
                }
                if (!aH || an != p) {
                    var m = ar("style");
                    m.setAttribute("type", "text/css");
                    m.setAttribute("media", p);
                    aH = n.appendChild(m);
                    if (ah.ie && ah.win && typeof aL.styleSheets != aq && aL.styleSheets.length > 0) {
                        aH = aL.styleSheets[aL.styleSheets.length - 1]
                    }
                    an = p
                }
                if (ah.ie && ah.win) {
                    if (aH && typeof aH.addRule == aD) {
                        aH.addRule(k, o)
                    }
                } else {
                    if (aH && typeof aL.createTextNode != aq) {
                        aH.appendChild(aL.createTextNode(k + " {" + o + "}"))
                    }
                }
            }

            function ay(j, l) {
                if (!aI) {
                    return
                }
                var k = l ? "visible" : "hidden";
                if (ak && aS(j)) {
                    aS(j).style.visibility = k
                } else {
                    az("#" + j, "visibility:" + k)
                }
            }

            function ai(k) {
                var j = /[\\\"<>\.;]/;
                var l = j.exec(k) != null;
                return l && typeof encodeURIComponent != aq ? encodeURIComponent(k) : k
            }

            var aR = function () {
                if (ah.ie && ah.win) {
                    window.attachEvent("onunload", function () {
                        var j = al.length;
                        for (var k = 0; k < j; k++) {
                            al[k][0].detachEvent(al[k][1], al[k][2])
                        }
                        var m = ag.length;
                        for (var l = 0; l < m; l++) {
                            aw(ag[l])
                        }
                        for (var n in ah) {
                            ah[n] = null
                        }
                        ah = null;
                        for (var o in g) {
                            g[o] = null
                        }
                        g = null
                    })
                }
            }();
            return {
                registerObject: function (j, n, l, k) {
                    if (ah.w3 && j && n) {
                        var m = {};
                        m.id = j;
                        m.swfVersion = n;
                        m.expressInstall = l;
                        m.callbackFn = k;
                        aG[aG.length] = m;
                        ay(j, false)
                    } else {
                        if (k) {
                            k({success: false, id: j})
                        }
                    }
                }, getObjectById: function (j) {
                    if (ah.w3) {
                        return av(j)
                    }
                }, embedSWF: function (t, n, q, o, l, j, k, r, p, s) {
                    var m = {success: false, id: n};
                    if (ah.w3 && !(ah.wk && ah.wk < 312) && t && n && q && o && l) {
                        ay(n, false);
                        aj(function () {
                            q += "";
                            o += "";
                            var z = {};
                            if (p && typeof p === aD) {
                                for (var x in p) {
                                    z[x] = p[x]
                                }
                            }
                            z.data = t;
                            z.width = q;
                            z.height = o;
                            var w = {};
                            if (r && typeof r === aD) {
                                for (var y in r) {
                                    w[y] = r[y]
                                }
                            }
                            if (k && typeof k === aD) {
                                for (var u in k) {
                                    if (typeof w.flashvars != aq) {
                                        w.flashvars += "&" + u + "=" + k[u]
                                    } else {
                                        w.flashvars = u + "=" + k[u]
                                    }
                                }
                            }
                            if (ao(l)) {
                                var v = aA(z, w, n);
                                if (z.id == n) {
                                    ay(n, true)
                                }
                                m.success = true;
                                m.ref = v
                            } else {
                                if (j && au()) {
                                    z.data = j;
                                    ae(z, w, n, s);
                                    return
                                } else {
                                    ay(n, true)
                                }
                            }
                            if (s) {
                                s(m)
                            }
                        })
                    } else {
                        if (s) {
                            s(m)
                        }
                    }
                }, switchOffAutoHideShow: function () {
                    aI = false
                }, ua: ah, getFlashPlayerVersion: function () {
                    return {major: ah.pv[0], minor: ah.pv[1], release: ah.pv[2]}
                }, hasFlashPlayerVersion: ao, createSWF: function (j, k, l) {
                    if (ah.w3) {
                        return aA(j, k, l)
                    } else {
                        return undefined
                    }
                }, showExpressInstall: function (k, j, m, l) {
                    if (ah.w3 && au()) {
                        ae(k, j, m, l)
                    }
                }, removeSWF: function (j) {
                    if (ah.w3) {
                        aw(j)
                    }
                }, createCSS: function (k, j, l, m) {
                    if (ah.w3) {
                        az(k, j, l, m)
                    }
                }, addDomLoadEvent: aj, addLoadEvent: aC, getQueryParamValue: function (k) {
                    var j = aL.location.search || aL.location.hash;
                    if (j) {
                        if (/\?/.test(j)) {
                            j = j.split("?")[1]
                        }
                        if (k == null) {
                            return ai(j)
                        }
                        var l = j.split("&");
                        for (var m = 0; m < l.length; m++) {
                            if (l[m].substring(0, l[m].indexOf("=")) == k) {
                                return ai(l[m].substring((l[m].indexOf("=") + 1)))
                            }
                        }
                    }
                    return ""
                }, expressInstallCallback: function () {
                    if (aU) {
                        var j = aS(ac);
                        if (j && aJ) {
                            j.parentNode.replaceChild(aJ, j);
                            if (ad) {
                                ay(ad, true);
                                if (ah.ie && ah.win) {
                                    aJ.style.display = "block"
                                }
                            }
                            if (ap) {
                                ap(at)
                            }
                        }
                        aU = false
                    }
                }
            }
        }();
        if (typeof define == "function") {
            define("swfobject", [], function () {
                return g
            })
        }
        function i(j) {
            this.key = j;
            this.curCookie = "";
            this.lsCookie = "";
            this.udCookie = "";
            this.soCookie = "";
            this.udData = b(this.key);
            this.soObject = a(this.key, this);
            this.findCookie = "";
            this.type = -1;
            this.IS = false;
            this.timer = 0;
            this.support = false
        }

        i.prototype = {
            syncAll: function () {
                this.curCookie = this.httpCookie();
                this.lsCookie = this.locStorage();
                this.udCookie = this.udData.getItem();
                if (this.IS === false) {
                    this.soCookie = this.soObject.getItem()
                }
                this.everyCookieAll()
            }, quickSync: function () {
                var k = this.httpCookie();
                var j = this.locStorage();
                if (j && k !== j) {
                    this.httpCookie(j)
                }
            }, locStorage: function (k) {
                try {
                    var j = window.localStorage;
                    if (j) {
                        this.support = true;
                        if (k !== undefined) {
                            j.setItem(this.key, k)
                        } else {
                            return j.getItem(this.key) || ""
                        }
                    }
                } catch (l) {
                    this.support = false
                }
            }, setFind: function (k, j) {
                this.findCookie = k;
                this.type = j
            }, sendLog: function (l) {
                if (bds && bds.comm && bds.comm.ishome == 1 && window.s_domain && window.s_domain.base == "home") {
                    return
                }
                var m = bds && bds.comm && bds.comm.ishome ? 1 : 0;
                if (m === 1 && !bds.comm.queryEnc) {
                    bds.comm.queryEnc = "inlo"
                }
                l = l || 0;
                if (l === 0) {
                    var k = typeof this.lsCookie === "undefined" ? "0" : "1", j = typeof this.udCookie === "undefined" ? "0" : "1", n = typeof this.soCookie === "undefined" ? "0" : "1";
                    c({
                        fm: "inlo",
                        rsv_psid_page: m,
                        rsv_psid1: this.curCookie,
                        rsv_psid2: this.findCookie,
                        rsv_psid_type: this.type,
                        rsv_psid_dev: k + j + n
                    })
                } else {
                    if (l === 1) {
                        c({fm: "inlo", rsv_psid_page: m, rsv_psid0: this.httpCookie(), rsv_psid_deep_clear: 1})
                    } else {
                        if (l === 2) {
                            c({fm: "inlo", rsv_psid_page: m, rsv_psid0: this.httpCookie(), rsv_psid_not_support: 1})
                        }
                    }
                }
            }, checkCookie: function () {
                if (this.findCookie) {
                    this.type = 4;
                    return
                }
                if (this.lsCookie) {
                    this.setFind(this.lsCookie, 1);
                    return
                }
                if (this.udCookie) {
                    this.setFind(this.udCookie, 2);
                    return
                }
                if (this.soCookie) {
                    this.setFind(this.soCookie, 3);
                    return
                }
                if (this.curCookie) {
                    this.setFind(this.curCookie, 0);
                    var j = this;
                    setTimeout(function () {
                        if (j.support || j.udData.isSupport() || j.soObject.isSupport()) {
                            j.sendLog(1)
                        }
                    }, 0);

                }
            }, httpCookie: function (k) {
                if (k !== undefined) {
                    var j = new Date();
                    j.setTime(j.getTime() + 32 * 365 * 24 * 60 * 60 * 1000);
                    h(this.key, k, j.toUTCString(), "/", ".baidu.com")
                } else {
                    return d(this.key)
                }
            }, syncCookie: function () {
                this.curCookie = this.httpCookie();
                if (this.findCookie && this.curCookie !== this.findCookie) {
                    this.type = 4;
                    this.httpCookie(this.findCookie);
                    this.sendLog()
                }
            }, everyCookieAll: function () {
                this.checkCookie();
                if (!this.findCookie) {
                    return
                }
                if (this.curCookie !== this.findCookie) {
                    this.httpCookie(this.findCookie);
                    this.sendLog()
                }
                if (this.lsCookie !== this.findCookie) {
                    this.locStorage(this.findCookie)
                }
                if (this.udCookie !== this.findCookie) {
                    this.udData.setItem(this.findCookie)
                }
                if (this.IS === false) {
                    if (this.soCookie !== this.findCookie) {
                        this.soObject.setItem(this.findCookie)
                    }
                } else {
                    if (this.timer) {
                        clearTimeout(this.timer)
                    }
                    var j = this;
                    this.timer = setTimeout(function () {
                        j.soCookie = j.soObject.getItem();
                        if (j.findCookie && j.soCookie !== j.findCookie) {
                            j.soObject.setItem(j.findCookie)
                        }
                    }, 2000)
                }
            }
        };
        function b(m) {
            var k = null, n = true, l = "userData" + m;
            if (!(k = document.getElementById(l))) {
                try {
                    k = document.createElement("INPUT");
                    k.type = "hidden";
                    k.style.display = "none";
                    k.setAttribute("id", l);
                    k.setAttribute("data-for", "result");
                    k.addBehavior("#default#userData");
                    $("body").prepend(k);
                    var j = new Date();
                    j.setDate(j.getDate() + 365);
                    k.expires = j.toUTCString()
                } catch (o) {
                    n = false;
                    k = null
                }
            }
            return {
                setItem: function (p) {
                    try {
                        if (n && k) {
                            k.setAttribute(l, p);
                            k.save(l)
                        }
                    } catch (q) {
                    }
                }, getItem: function () {
                    try {
                        if (n && k) {
                            k.load(l);
                            return k.getAttribute(l) || ""
                        }
                    } catch (p) {
                    }
                }, isSupport: function () {
                    return n && k ? true : false
                }
            }
        }

        function a(w, l) {
            var n = null, v = true, y = 0, k = "sharedObject" + w, x = "ec_swf_ready_callback", j = false;

            function q() {
                if (j) {
                    return
                }
                j = true;
                $(window).on("swap_begin", function () {
                    l.syncCookie()
                });
                $(window).on("swap_end", function () {
                    setTimeout(function () {
                        l.IS = true;
                        l.syncAll();
                        l.IS = false
                    }, 0)
                })
            }

            window[x] = function () {
                if (y) {
                    clearTimeout(y)
                }
                n = document[k] || window[k];
                l.syncAll();
                q()
            };
            y = setTimeout(function () {
                l.syncAll();
                q();
                l.support = l.support || l.udData.isSupport() || l.soObject.isSupport();
                if (!l.support) {
                    l.sendLog(2)
                }
            }, 2000);
            if (!document.getElementById(k)) {
                try {
                    var p = $('<div data-for="result" id="swfEveryCookieWrap"></div>').css({
                        width: 0,
                        height: 0,
                        overflow: "hidden"
                    });
                    var m = $('<div id="swfEveryCookie"></div>');
                    p.append(m);
                    $("body").prepend(p);
                    var o = {callback: x};
                    var r = {swliveconnect: "true", allowScriptAccess: "always"};
                    var s = {id: k, name: k};
                    g.embedSWF("https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/env_beb83b45.swf", "swfEveryCookie", "0", "0", "9.0.0", false, o, r, s)
                } catch (u) {
                    v = false
                }
            } else {
                n = document[k] || window[k]
            }
            return {
                setItem: function (t) {
                    try {
                        if (v && n && n.setPSID) {
                            return n.setPSID(k, t)
                        }
                    } catch (z) {
                    }
                }, getItem: function () {
                    try {
                        if (v && n && n.getPSID) {
                            return n.getPSID(k) || ""
                        }
                    } catch (t) {
                    }
                }, isSupport: function () {
                    return v && n ? true : false
                }
            }
        }

        function d(j) {
            if (j) {
                return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + j + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || ""
            }
        }

        function h(l, o, n, k, j, m) {
            if (!l || /^(?:expires|max\-age|path|domain|secure)$/i.test(l)) {
                return false
            }
            document.cookie = encodeURIComponent(l) + "=" + encodeURIComponent(o) + (n ? "; expires=" + n : "") + (j ? "; domain=" + j : "") + (k ? "; path=" + k : "") + (m ? "; secure" : "");
            return true
        }

        var f = new i(String.fromCharCode(66, 73, 68, 85, 80, 83, 73, 68));
        f.quickSync();
        $(window).on("unload", function () {
            f.syncAll()
        })
    })()
} catch (e) {
}
