'use strict';
var h, aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
        a != Array.prototype && a != Object.prototype && (a[b] = c.value)
    },
    ba = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this,
    ca = function () {
        ca = function () {
        };
        ba.Symbol || (ba.Symbol = da)
    }, da = function () {
        var a = 0;
        return function (b) {
            return "jscomp_symbol_" + (b || "") + a++
        }
    }(), fa = function () {
        ca();
        var a = ba.Symbol.iterator;
        a || (a = ba.Symbol.iterator = ba.Symbol("iterator"));
        "function" !=
        typeof Array.prototype[a] && aa(Array.prototype, a, {
            configurable: !0, writable: !0, value: function () {
                return ea(this)
            }
        });
        fa = function () {
        }
    }, ea = function (a) {
        var b = 0;
        return ha(function () {
            return b < a.length ? {done: !1, value: a[b++]} : {done: !0}
        })
    }, ha = function (a) {
        fa();
        a = {next: a};
        a[ba.Symbol.iterator] = function () {
            return this
        };
        return a
    }, ia = function (a) {
        fa();
        var b = a[Symbol.iterator];
        return b ? b.call(a) : ea(a)
    }, ja = function (a, b) {
        if (b) {
            var c = ba;
            a = a.split(".");
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                e in c || (c[e] = {});
                c = c[e]
            }
            a =
                a[a.length - 1];
            d = c[a];
            b = b(d);
            b != d && null != b && aa(c, a, {configurable: !0, writable: !0, value: b})
        }
    }, ka = function (a, b, c) {
        if (null == a) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
        if (b instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
        return a + ""
    };
ja("String.prototype.endsWith", function (a) {
    return a ? a : function (a, c) {
        var b = ka(this, a, "endsWith");
        a += "";
        void 0 === c && (c = b.length);
        c = Math.max(0, Math.min(c | 0, b.length));
        for (var e = a.length; 0 < e && 0 < c;) if (b[--c] != a[--e]) return !1;
        return 0 >= e
    }
});
ja("String.prototype.startsWith", function (a) {
    return a ? a : function (a, c) {
        var b = ka(this, a, "startsWith");
        a += "";
        var e = b.length, f = a.length;
        c = Math.max(0, Math.min(c | 0, b.length));
        for (var g = 0; g < f && c < e;) if (b[c++] != a[g++]) return !1;
        return g >= f
    }
});
var la = la || {}, k = this, m = function (a) {
    return void 0 !== a
}, n = function (a) {
    return "string" == typeof a
}, ma = function (a) {
    return "number" == typeof a
}, q = function () {
}, na = function (a) {
    var b = typeof a;
    if ("object" == b) if (a) {
        if (a instanceof Array) return "array";
        if (a instanceof Object) return b;
        var c = Object.prototype.toString.call(a);
        if ("[object Window]" == c) return "object";
        if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
        if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
    } else return "null"; else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b
}, oa = function (a) {
    return "array" == na(a)
}, pa = function (a) {
    var b = na(a);
    return "array" == b || "object" == b && "number" == typeof a.length
}, qa = function (a) {
    return "function" == na(a)
}, ra = function (a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
}, sa = "closure_uid_" + (1E9 * Math.random() >>>
    0), ta = 0, ua = function (a, b, c) {
    return a.call.apply(a.bind, arguments)
}, va = function (a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function () {
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, d);
            return a.apply(b, c)
        }
    }
    return function () {
        return a.apply(b, arguments)
    }
}, wa = function (a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? wa = ua : wa = va;
    return wa.apply(null, arguments)
}, xa = function (a,
                  b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function () {
        var b = c.slice();
        b.push.apply(b, arguments);
        return a.apply(this, b)
    }
}, ya = Date.now || function () {
    return +new Date
}, r = function (a, b) {
    a = a.split(".");
    var c = k;
    a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());) !a.length && m(b) ? c[d] = b : c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {}
}, t = function (a, b) {
    function c() {
    }

    c.prototype = b.prototype;
    a.F = b.prototype;
    a.prototype = new c;
    a.prototype.constructor =
        a;
    a.ub = function (a, c, f) {
        for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) d[e - 2] = arguments[e];
        return b.prototype[c].apply(a, d)
    }
};
var v = function (a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, v); else {
        var b = Error().stack;
        b && (this.stack = b)
    }
    a && (this.message = String(a))
};
t(v, Error);
v.prototype.name = "CustomError";
var za = Array.prototype.indexOf ? function (a, b) {
    return Array.prototype.indexOf.call(a, b, void 0)
} : function (a, b) {
    if (n(a)) return n(b) && 1 == b.length ? a.indexOf(b, 0) : -1;
    for (var c = 0; c < a.length; c++) if (c in a && a[c] === b) return c;
    return -1
}, Aa = Array.prototype.lastIndexOf ? function (a, b) {
    return Array.prototype.lastIndexOf.call(a, b, a.length - 1)
} : function (a, b) {
    var c = a.length - 1;
    0 > c && (c = Math.max(0, a.length + c));
    if (n(a)) return n(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
    for (; 0 <= c; c--) if (c in a && a[c] === b) return c;
    return -1
}, Ba =
    Array.prototype.forEach ? function (a, b, c) {
        Array.prototype.forEach.call(a, b, c)
    } : function (a, b, c) {
        for (var d = a.length, e = n(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
    }, Ca = Array.prototype.map ? function (a, b) {
    return Array.prototype.map.call(a, b, void 0)
} : function (a, b) {
    for (var c = a.length, d = Array(c), e = n(a) ? a.split("") : a, f = 0; f < c; f++) f in e && (d[f] = b.call(void 0, e[f], f, a));
    return d
}, Da = function (a, b) {
    a:{
        for (var c = a.length, d = n(a) ? a.split("") : a, e = 0; e < c; e++) if (e in d && b.call(void 0, d[e], e, a)) {
            b = e;
            break a
        }
        b =
            -1
    }
    return 0 > b ? null : n(a) ? a.charAt(b) : a[b]
}, Ea = function (a) {
    if (!oa(a)) for (var b = a.length - 1; 0 <= b; b--) delete a[b];
    a.length = 0
}, Ga = function (a, b) {
    b = za(a, b);
    var c;
    (c = 0 <= b) && Fa(a, b);
    return c
}, Fa = function (a, b) {
    Array.prototype.splice.call(a, b, 1)
}, Ha = function (a) {
    return Array.prototype.concat.apply([], arguments)
}, Ia = function (a) {
    return Array.prototype.concat.apply([], arguments)
}, Ja = function (a) {
    var b = a.length;
    if (0 < b) {
        for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
        return c
    }
    return []
}, Ka = function (a, b) {
    for (var c = 1; c < arguments.length; c++) {
        var d =
            arguments[c];
        if (pa(d)) {
            var e = a.length || 0, f = d.length || 0;
            a.length = e + f;
            for (var g = 0; g < f; g++) a[e + g] = d[g]
        } else a.push(d)
    }
}, Ma = function (a, b, c, d) {
    Array.prototype.splice.apply(a, La(arguments, 1))
}, La = function (a, b, c) {
    return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c)
}, Na = function (a, b) {
    return a > b ? 1 : a < b ? -1 : 0
};
var Oa = String.prototype.trim ? function (a) {
    return a.trim()
} : function (a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
}, Pa = function (a, b) {
    a = String(a).toLowerCase();
    b = String(b).toLowerCase();
    return a < b ? -1 : a == b ? 0 : 1
}, Qa = function () {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ ya()).toString(36)
}, Sa = function (a, b) {
    var c = 0;
    a = Oa(String(a)).split(".");
    b = Oa(String(b)).split(".");
    for (var d = Math.max(a.length, b.length), e = 0; 0 == c && e < d; e++) {
        var f = a[e] || "",
            g = b[e] || "";
        do {
            f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
            g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
            if (0 == f[0].length && 0 == g[0].length) break;
            c = Ra(0 == f[1].length ? 0 : parseInt(f[1], 10), 0 == g[1].length ? 0 : parseInt(g[1], 10)) || Ra(0 == f[2].length, 0 == g[2].length) || Ra(f[2], g[2]);
            f = f[3];
            g = g[3]
        } while (0 == c)
    }
    return c
}, Ra = function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0
};
var Ta;
a:{
    var Ua = k.navigator;
    if (Ua) {
        var Va = Ua.userAgent;
        if (Va) {
            Ta = Va;
            break a
        }
    }
    Ta = ""
}
var w = function (a) {
    return -1 != Ta.indexOf(a)
};
var Wa = function (a, b, c) {
        for (var d in a) b.call(c, a[d], d, a)
    }, Xa = function (a) {
        var b = [], c = 0, d;
        for (d in a) b[c++] = a[d];
        return b
    }, Ya = function (a) {
        var b = [], c = 0, d;
        for (d in a) b[c++] = d;
        return b
    }, x = function (a, b, c) {
        b in a || (a[b] = c)
    }, Za = function (a) {
        var b = {}, c;
        for (c in a) b[c] = a[c];
        return b
    }, $a = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
    ab = function (a, b) {
        for (var c, d, e = 1; e < arguments.length; e++) {
            d = arguments[e];
            for (c in d) a[c] = d[c];
            for (var f = 0; f < $a.length; f++) c =
                $a[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
        }
    };
var bb = function () {
    return (w("Chrome") || w("CriOS")) && !w("Edge")
};
var cb = function () {
    return w("iPhone") && !w("iPod") && !w("iPad")
};
var db = function (a) {
    db[" "](a);
    return a
};
db[" "] = q;
var fb = function (a, b) {
    var c = eb;
    return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a)
};
var gb = w("Opera"), hb = w("Trident") || w("MSIE"), ib = w("Edge"),
    jb = w("Gecko") && !(-1 != Ta.toLowerCase().indexOf("webkit") && !w("Edge")) && !(w("Trident") || w("MSIE")) && !w("Edge"),
    kb = -1 != Ta.toLowerCase().indexOf("webkit") && !w("Edge"), lb = function () {
        var a = k.document;
        return a ? a.documentMode : void 0
    }, mb;
a:{
    var nb = "", ob = function () {
        var a = Ta;
        if (jb) return /rv:([^\);]+)(\)|;)/.exec(a);
        if (ib) return /Edge\/([\d\.]+)/.exec(a);
        if (hb) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
        if (kb) return /WebKit\/(\S+)/.exec(a);
        if (gb) return /(?:Version)[ \/]?(\S+)/.exec(a)
    }();
    ob && (nb = ob ? ob[1] : "");
    if (hb) {
        var pb = lb();
        if (null != pb && pb > parseFloat(nb)) {
            mb = String(pb);
            break a
        }
    }
    mb = nb
}
var qb = mb, eb = {}, rb = function (a) {
    return fb(a, function () {
        return 0 <= Sa(qb, a)
    })
}, sb;
var tb = k.document;
sb = tb && hb ? lb() || ("CSS1Compat" == tb.compatMode ? parseInt(qb, 10) : 5) : void 0;
var ub = function (a, b) {
    this.c = a;
    this.f = b;
    this.b = 0;
    this.a = null
};
ub.prototype.get = function () {
    if (0 < this.b) {
        this.b--;
        var a = this.a;
        this.a = a.next;
        a.next = null
    } else a = this.c();
    return a
};
var vb = function (a, b) {
    a.f(b);
    100 > a.b && (a.b++, b.next = a.a, a.a = b)
};
var wb = function (a) {
    k.setTimeout(function () {
        throw a;
    }, 0)
}, xb, yb = function () {
    var a = k.MessageChannel;
    "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !w("Presto") && (a = function () {
        var a = document.createElement("IFRAME");
        a.style.display = "none";
        a.src = "";
        document.documentElement.appendChild(a);
        var b = a.contentWindow;
        a = b.document;
        a.open();
        a.write("");
        a.close();
        var c = "callImmediate" + Math.random(),
            d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host;
        a = wa(function (a) {
            if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage()
        }, this);
        b.addEventListener("message", a, !1);
        this.port1 = {};
        this.port2 = {
            postMessage: function () {
                b.postMessage(c, d)
            }
        }
    });
    if ("undefined" !== typeof a && !w("Trident") && !w("MSIE")) {
        var b = new a, c = {}, d = c;
        b.port1.onmessage = function () {
            if (m(c.next)) {
                c = c.next;
                var a = c.sa;
                c.sa = null;
                a()
            }
        };
        return function (a) {
            d.next = {sa: a};
            d = d.next;
            b.port2.postMessage(0)
        }
    }
    return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ?
        function (a) {
            var b = document.createElement("SCRIPT");
            b.onreadystatechange = function () {
                b.onreadystatechange = null;
                b.parentNode.removeChild(b);
                b = null;
                a();
                a = null
            };
            document.documentElement.appendChild(b)
        } : function (a) {
            k.setTimeout(a, 0)
        }
};
var zb = function () {
    this.b = this.a = null
}, Bb = new ub(function () {
    return new Ab
}, function (a) {
    a.reset()
});
zb.prototype.add = function (a, b) {
    var c = Bb.get();
    c.set(a, b);
    this.b ? this.b.next = c : this.a = c;
    this.b = c
};
zb.prototype.remove = function () {
    var a = null;
    this.a && (a = this.a, this.a = this.a.next, this.a || (this.b = null), a.next = null);
    return a
};
var Ab = function () {
    this.next = this.b = this.a = null
};
Ab.prototype.set = function (a, b) {
    this.a = a;
    this.b = b;
    this.next = null
};
Ab.prototype.reset = function () {
    this.next = this.b = this.a = null
};
var Gb = function (a, b) {
    Cb || Db();
    Eb || (Cb(), Eb = !0);
    Fb.add(a, b)
}, Cb, Db = function () {
    if (k.Promise && k.Promise.resolve) {
        var a = k.Promise.resolve(void 0);
        Cb = function () {
            a.then(Hb)
        }
    } else Cb = function () {
        var a = Hb;
        !qa(k.setImmediate) || k.Window && k.Window.prototype && !w("Edge") && k.Window.prototype.setImmediate == k.setImmediate ? (xb || (xb = yb()), xb(a)) : k.setImmediate(a)
    }
}, Eb = !1, Fb = new zb, Hb = function () {
    for (var a; a = Fb.remove();) {
        try {
            a.a.call(a.b)
        } catch (b) {
            wb(b)
        }
        vb(Bb, a)
    }
    Eb = !1
};
var y = function (a) {
    this.a = 0;
    this.i = void 0;
    this.f = this.b = this.c = null;
    this.g = this.h = !1;
    if (a != q) try {
        var b = this;
        a.call(void 0, function (a) {
            Ib(b, 2, a)
        }, function (a) {
            Ib(b, 3, a)
        })
    } catch (c) {
        Ib(this, 3, c)
    }
}, Jb = function () {
    this.next = this.context = this.b = this.f = this.a = null;
    this.c = !1
};
Jb.prototype.reset = function () {
    this.context = this.b = this.f = this.a = null;
    this.c = !1
};
var Kb = new ub(function () {
    return new Jb
}, function (a) {
    a.reset()
}), Lb = function (a, b, c) {
    var d = Kb.get();
    d.f = a;
    d.b = b;
    d.context = c;
    return d
}, z = function (a) {
    if (a instanceof y) return a;
    var b = new y(q);
    Ib(b, 2, a);
    return b
}, Mb = function (a) {
    return new y(function (b, c) {
        c(a)
    })
}, Ob = function (a, b, c) {
    Nb(a, b, c, null) || Gb(xa(b, a))
}, A = function (a) {
    return new y(function (b, c) {
        var d = a.length, e = [];
        if (d) for (var f = function (a, c) {
            d--;
            e[a] = c;
            0 == d && b(e)
        }, g = function (a) {
            c(a)
        }, l = 0, p; l < a.length; l++) p = a[l], Ob(p, xa(f, l), g); else b(e)
    })
}, B = function () {
    var a,
        b, c = new y(function (c, e) {
            a = c;
            b = e
        });
    return new Pb(c, a, b)
};
y.prototype.then = function (a, b, c) {
    return Qb(this, qa(a) ? a : null, qa(b) ? b : null, c)
};
y.prototype.then = y.prototype.then;
y.prototype.$goog_Thenable = !0;
var C = function (a, b) {
    b = Lb(b, b, void 0);
    b.c = !0;
    Rb(a, b);
    return a
}, D = function (a, b, c) {
    return Qb(a, null, b, c)
};
y.prototype.cancel = function (a) {
    0 == this.a && Gb(function () {
        var b = new E(a);
        Sb(this, b)
    }, this)
};
var Sb = function (a, b) {
    if (0 == a.a) if (a.c) {
        var c = a.c;
        if (c.b) {
            for (var d = 0, e = null, f = null, g = c.b; g && (g.c || (d++, g.a == a && (e = g), !(e && 1 < d))); g = g.next) e || (f = g);
            e && (0 == c.a && 1 == d ? Sb(c, b) : (f ? (d = f, d.next == c.f && (c.f = d), d.next = d.next.next) : Tb(c), Ub(c, e, 3, b)))
        }
        a.c = null
    } else Ib(a, 3, b)
}, Rb = function (a, b) {
    a.b || 2 != a.a && 3 != a.a || Vb(a);
    a.f ? a.f.next = b : a.b = b;
    a.f = b
}, Qb = function (a, b, c, d) {
    var e = Lb(null, null, null);
    e.a = new y(function (a, g) {
        e.f = b ? function (c) {
            try {
                var e = b.call(d, c);
                a(e)
            } catch (u) {
                g(u)
            }
        } : a;
        e.b = c ? function (b) {
            try {
                var e = c.call(d,
                    b);
                !m(e) && b instanceof E ? g(b) : a(e)
            } catch (u) {
                g(u)
            }
        } : g
    });
    e.a.c = a;
    Rb(a, e);
    return e.a
};
y.prototype.l = function (a) {
    this.a = 0;
    Ib(this, 2, a)
};
y.prototype.m = function (a) {
    this.a = 0;
    Ib(this, 3, a)
};
var Ib = function (a, b, c) {
    0 == a.a && (a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself")), a.a = 1, Nb(c, a.l, a.m, a) || (a.i = c, a.a = b, a.c = null, Vb(a), 3 != b || c instanceof E || Wb(a, c)))
}, Nb = function (a, b, c, d) {
    if (a instanceof y) return Rb(a, Lb(b || q, c || null, d)), !0;
    if (a) try {
        var e = !!a.$goog_Thenable
    } catch (g) {
        e = !1
    } else e = !1;
    if (e) return a.then(b, c, d), !0;
    if (ra(a)) try {
        var f = a.then;
        if (qa(f)) return Xb(a, f, b, c, d), !0
    } catch (g) {
        return c.call(d, g), !0
    }
    return !1
}, Xb = function (a, b, c, d, e) {
    var f = !1, g = function (a) {
        f || (f = !0, c.call(e,
            a))
    }, l = function (a) {
        f || (f = !0, d.call(e, a))
    };
    try {
        b.call(a, g, l)
    } catch (p) {
        l(p)
    }
}, Vb = function (a) {
    a.h || (a.h = !0, Gb(a.j, a))
}, Tb = function (a) {
    var b = null;
    a.b && (b = a.b, a.b = b.next, b.next = null);
    a.b || (a.f = null);
    return b
};
y.prototype.j = function () {
    for (var a; a = Tb(this);) Ub(this, a, this.a, this.i);
    this.h = !1
};
var Ub = function (a, b, c, d) {
    if (3 == c && b.b && !b.c) for (; a && a.g; a = a.c) a.g = !1;
    if (b.a) b.a.c = null, Yb(b, c, d); else try {
        b.c ? b.f.call(b.context) : Yb(b, c, d)
    } catch (e) {
        Zb.call(null, e)
    }
    vb(Kb, b)
}, Yb = function (a, b, c) {
    2 == b ? a.f.call(a.context, c) : a.b && a.b.call(a.context, c)
}, Wb = function (a, b) {
    a.g = !0;
    Gb(function () {
        a.g && Zb.call(null, b)
    })
}, Zb = wb, E = function (a) {
    v.call(this, a)
};
t(E, v);
E.prototype.name = "cancel";
var Pb = function (a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c
};
var F = function () {
    return z("")
};
var G = function (a) {
    this.type = a
};
r("castApp.protocol.Message", G);
var $b = function (a) {
    this.type = a;
    this.requestId = Qa()
};
t($b, G);
r("castApp.protocol.Request", $b);
var H = function (a, b) {
    this.type = a;
    this.responseTo = b.requestId
};
t(H, G);
r("castApp.protocol.Response", H);
var ac = function (a, b) {
    H.call(this, "Error", a);
    this.errorName = b || "err-unknown"
};
t(ac, H);
r("castApp.protocol.Error", ac);
var bc = function () {
};
r("castApp.protocol.Handshake", bc);
var cc = function () {
    $b.call(this, "Handshake.Request");
    this.coreVersion = 6
};
t(cc, $b);
bc.Request = cc;
var dc = function (a) {
    H.call(this, "Handshake.Response", a);
    this.version = 6;
    this.latestVersion = void 0
};
t(dc, H);
bc.Response = dc;
var ec = function (a, b) {
    H.call(this, "Handshake.UiVersionNotSupported", a);
    this.latestVersion = b
};
t(ec, H);
bc.UiVersionNotSupported = ec;
var fc = function (a) {
    this.type = "SetSimpleState";
    this.state = a
};
t(fc, G);
r("castApp.protocol.SetSimpleState", fc);
var gc = function () {
};
r("castApp.protocol.ModalDialog", gc);
var hc = function (a) {
    $b.call(this, "ModalDialog.Request");
    this.dialogId = a
};
t(hc, $b);
gc.Request = hc;
var ic = function (a, b) {
    H.call(this, "ModalDialog.Response", a);
    this.button = b
};
t(ic, H);
gc.Response = ic;
var jc = function (a, b) {
    this.type = a;
    this.deviceType = b
};
t(jc, G);
r("castApp.protocol.MessageWithDeviceType", jc);
var kc = function () {
};
r("castApp.protocol.DeviceDiscovery", kc);
var lc = function (a) {
    this.type = "DeviceDiscovery.ShowScanner";
    this.showTips = a
};
t(lc, G);
kc.ShowScanner = lc;
var mc = function () {
};
r("castApp.protocol.SetupStart", mc);
var nc = function (a, b, c) {
    this.type = "SetupStart.ShowDevice";
    this.state = a;
    this.deviceType = b;
    this.deviceName = c;
    this.analyticsOptIn = this.otherDevicesExist = !1
};
t(nc, G);
mc.ShowDevice = nc;
var oc = function (a) {
    this.type = "SetupStart.TosAccepted";
    this.analyticsOptIn = a
};
t(oc, G);
mc.TosAccepted = oc;
var pc = function () {
};
r("castApp.protocol.WiFiSwitching", pc);
var qc = function (a, b, c) {
    this.type = "WiFiSwitching.ConnectHotSpot";
    this.state = a;
    this.deviceName = b;
    this.ssid = c
};
t(qc, G);
pc.ConnectHotSpot = qc;
var rc = function (a, b) {
    this.type = "WiFiSwitching.ReconnectWiFi";
    this.state = a;
    this.ssid = b
};
t(rc, G);
pc.ReconnectWiFi = rc;
var sc = function () {
};
r("castApp.protocol.CodeConfirmation", sc);
var tc = function (a) {
    $b.call(this, "CodeConfirmation.Request");
    this.code = a
};
t(tc, $b);
sc.Request = tc;
var uc = function (a, b) {
    H.call(this, "CodeConfirmation.Response", a);
    this.confirmed = b
};
t(uc, H);
sc.Response = uc;
var vc = function () {
};
r("castApp.protocol.AudioConfirmation", vc);
var wc = function (a) {
    this.type = "AudioConfirmation.PromptUser";
    this.state = a
};
t(wc, G);
vc.PromptUser = wc;
var xc = function (a) {
    this.type = "AudioConfirmation.UserAction";
    this.action = a
};
t(xc, G);
vc.UserAction = xc;
var yc = function () {
};
r("castApp.protocol.DeviceConfig", yc);
var zc = function (a, b, c) {
    $b.call(this, "DeviceConfig.Request");
    this.deviceType = a;
    this.name = b;
    this.country = c
};
t(zc, $b);
yc.Request = zc;
var Ac = function (a, b, c) {
    H.call(this, "DeviceConfig.Response", a);
    this.name = b;
    this.country = c
};
t(Ac, H);
yc.Response = Ac;
var Bc = function () {
};
r("castApp.protocol.WiFiConfig", Bc);
var Cc = function (a, b, c) {
    this.id = a;
    this.ssid = b;
    this.security = c
};
Bc.Network = Cc;
var Dc = function (a, b, c, d) {
    this.type = "WiFiConfig.Show";
    this.state = a;
    this.deviceType = b;
    this.networks = c;
    this.selectedNetwork = d
};
t(Dc, G);
Bc.Show = Dc;
var Ec = function (a) {
    this.type = "WiFiConfig.UpdateNetworks";
    this.networks = a
};
t(Ec, G);
Bc.UpdateNetworks = Ec;
var Fc = function (a, b) {
    this.type = "WiFiConfig.Connect";
    this.network = a;
    this.password = b
};
t(Fc, G);
Bc.Connect = Fc;
var Gc = function (a) {
    this.type = "WiFiConfig.Retry";
    this.network = a
};
t(Gc, G);
Bc.Retry = Gc;
var Hc = function () {
};
r("castApp.protocol.Features", Hc);
var Ic = function () {
};
Hc.DeviceSettings = Ic;
var Jc = function () {
    this.supportsDisplay = this.supportsSetup = !1
};
Hc.Device = Jc;
var Kc = function () {
};
r("castApp.protocol.Devices", Kc);
var Lc = function (a, b, c) {
    this.id = a;
    this.type = b;
    this.displayName = c
};
Kc.DeviceProperties = Lc;
var Mc = function (a, b) {
    this.type = "Devices.Show";
    this.devices = a;
    this.deviceName = b
};
t(Mc, G);
Kc.Show = Mc;
var Nc = function (a, b) {
    this.type = "Devices.UserAction";
    this.device = a;
    this.action = b
};
t(Nc, G);
Kc.UserAction = Nc;
var Oc = function () {
};
r("castApp.protocol.DeviceSettings", Oc);
var Pc = function (a, b) {
    this.localeId = a;
    this.displayString = b
};
Oc.Locale = Pc;
var Qc = function (a, b, c) {
    this.timeZoneId = a;
    this.displayString = b;
    this.offset = c
};
Oc.TimeZone = Qc;
var Rc = function (a, b, c) {
    this.type = "DeviceSettings.Show";
    this.state = a;
    this.features = b;
    this.deviceType = c.deviceType;
    this.name = c.name;
    this.ssid = c.ssid;
    this.timeZoneId = c.timeZoneId;
    this.supportedTimeZones = c.supportedTimeZones;
    this.timeFormat = c.timeFormat;
    this.localeId = c.localeId;
    this.supportedLocales = c.supportedLocales;
    this.statsOptIn = c.statsOptIn;
    this.firmwareVersion = c.firmwareVersion;
    this.countryCode = c.countryCode;
    this.macAddress = c.macAddress;
    this.ipAddress = c.ipAddress
};
t(Rc, G);
Oc.Show = Rc;
var Sc = function (a) {
    this.type = "DeviceSettings.Apply";
    this.name = a.name;
    this.timeZoneId = a.timeZoneId;
    this.timeFormat = a.timeFormat;
    this.localeId = a.localeId;
    this.statsOptIn = a.statsOptIn
};
t(Sc, G);
Oc.Apply = Sc;
var Tc = function () {
};
r("castApp.protocol.DetectCountry", Tc);
var Uc = function () {
    $b.call(this, "DetectCountry.Request")
};
t(Uc, $b);
Tc.Request = Uc;
var Vc = function (a, b) {
    H.call(this, "DetectCountry.Response", a);
    this.countryCode = b
};
t(Vc, H);
Tc.Response = Vc;
var Wc = function () {
};
r("castApp.protocol.Offers", Wc);
var Xc = function () {
    this.type = "Offers.Scan";
    this.scanId = Qa()
};
t(Xc, G);
Wc.Scan = Xc;
var Yc = function (a, b, c, d) {
    this.token = a;
    this.displayName = b;
    this.deviceType = c;
    this.ssdpUdn = d
};
Wc.Device = Yc;
var Zc = function (a, b, c) {
    this.type = "Offers.ScanResults";
    this.scanId = a;
    this.devices = b;
    this.scanComplete = c
};
t(Zc, G);
Wc.ScanResults = Zc;
var $c = function (a) {
    this.type = "Offers.Redeem";
    this.url = a
};
t($c, G);
Wc.Redeem = $c;
var ad = function (a, b) {
    this.type = "Offers.AnalyticsEvent";
    this.eventType = a;
    this.offerId = b
};
t(ad, G);
Wc.AnalyticsEvent = ad;
var I = function (a, b) {
    this.b = [];
    this.a = b;
    for (var c = !0, d = a.length - 1; 0 <= d; d--) {
        var e = a[d] | 0;
        c && e == b || (this.b[d] = e, c = !1)
    }
}, bd = {}, cd = function (a) {
    if (-128 <= a && 128 > a) {
        var b = bd[a];
        if (b) return b
    }
    b = new I([a | 0], 0 > a ? -1 : 0);
    -128 <= a && 128 > a && (bd[a] = b);
    return b
}, ed = function (a) {
    if (isNaN(a) || !isFinite(a)) return dd;
    if (0 > a) return J(ed(-a));
    for (var b = [], c = 1, d = 0; a >= c; d++) b[d] = a / c | 0, c *= 4294967296;
    return new I(b, 0)
}, fd = function (a, b) {
    if (0 == a.length) throw Error("number format error: empty string");
    b = b || 10;
    if (2 > b || 36 < b) throw Error("radix out of range: " +
        b);
    if ("-" == a.charAt(0)) return J(fd(a.substring(1), b));
    if (0 <= a.indexOf("-")) throw Error('number format error: interior "-" character');
    for (var c = ed(Math.pow(b, 8)), d = dd, e = 0; e < a.length; e += 8) {
        var f = Math.min(8, a.length - e), g = parseInt(a.substring(e, e + f), b);
        8 > f ? (f = ed(Math.pow(b, f)), d = gd(d, f).add(ed(g))) : (d = gd(d, c), d = d.add(ed(g)))
    }
    return d
}, dd = cd(0), hd = cd(1), id = cd(16777216), jd = function (a) {
    if (-1 == a.a) return -jd(J(a));
    for (var b = 0, c = 1, d = 0; d < a.b.length; d++) b += kd(a, d) * c, c *= 4294967296;
    return b
};
I.prototype.toString = function (a) {
    a = a || 10;
    if (2 > a || 36 < a) throw Error("radix out of range: " + a);
    if (ld(this)) return "0";
    if (-1 == this.a) return "-" + J(this).toString(a);
    for (var b = ed(Math.pow(a, 6)), c = this, d = ""; ;) {
        var e = md(c, b);
        c = nd(c, gd(e, b));
        var f = ((0 < c.b.length ? c.b[0] : c.a) >>> 0).toString(a);
        c = e;
        if (ld(c)) return f + d;
        for (; 6 > f.length;) f = "0" + f;
        d = "" + f + d
    }
};
var K = function (a, b) {
    return 0 > b ? 0 : b < a.b.length ? a.b[b] : a.a
}, kd = function (a, b) {
    a = K(a, b);
    return 0 <= a ? a : 4294967296 + a
}, ld = function (a) {
    if (0 != a.a) return !1;
    for (var b = 0; b < a.b.length; b++) if (0 != a.b[b]) return !1;
    return !0
}, od = function (a, b) {
    a = nd(a, b);
    return -1 == a.a ? -1 : ld(a) ? 0 : 1
}, J = function (a) {
    for (var b = a.b.length, c = [], d = 0; d < b; d++) c[d] = ~a.b[d];
    return (new I(c, ~a.a)).add(hd)
};
I.prototype.add = function (a) {
    for (var b = Math.max(this.b.length, a.b.length), c = [], d = 0, e = 0; e <= b; e++) {
        var f = d + (K(this, e) & 65535) + (K(a, e) & 65535), g = (f >>> 16) + (K(this, e) >>> 16) + (K(a, e) >>> 16);
        d = g >>> 16;
        f &= 65535;
        g &= 65535;
        c[e] = g << 16 | f
    }
    return new I(c, c[c.length - 1] & -2147483648 ? -1 : 0)
};
var nd = function (a, b) {
    return a.add(J(b))
}, gd = function (a, b) {
    if (ld(a) || ld(b)) return dd;
    if (-1 == a.a) return -1 == b.a ? gd(J(a), J(b)) : J(gd(J(a), b));
    if (-1 == b.a) return J(gd(a, J(b)));
    if (0 > od(a, id) && 0 > od(b, id)) return ed(jd(a) * jd(b));
    for (var c = a.b.length + b.b.length, d = [], e = 0; e < 2 * c; e++) d[e] = 0;
    for (e = 0; e < a.b.length; e++) for (var f = 0; f < b.b.length; f++) {
        var g = K(a, e) >>> 16, l = K(a, e) & 65535, p = K(b, f) >>> 16, u = K(b, f) & 65535;
        d[2 * e + 2 * f] += l * u;
        pd(d, 2 * e + 2 * f);
        d[2 * e + 2 * f + 1] += g * u;
        pd(d, 2 * e + 2 * f + 1);
        d[2 * e + 2 * f + 1] += l * p;
        pd(d, 2 * e + 2 * f + 1);
        d[2 * e + 2 * f +
        2] += g * p;
        pd(d, 2 * e + 2 * f + 2)
    }
    for (e = 0; e < c; e++) d[e] = d[2 * e + 1] << 16 | d[2 * e];
    for (e = c; e < 2 * c; e++) d[e] = 0;
    return new I(d, 0)
}, pd = function (a, b) {
    for (; (a[b] & 65535) != a[b];) a[b + 1] += a[b] >>> 16, a[b] &= 65535, b++
}, md = function (a, b) {
    if (ld(b)) throw Error("division by zero");
    if (ld(a)) return dd;
    if (-1 == a.a) return -1 == b.a ? md(J(a), J(b)) : J(md(J(a), b));
    if (-1 == b.a) return J(md(a, J(b)));
    if (30 < a.b.length) {
        if (-1 == a.a || -1 == b.a) throw Error("slowDivide_ only works with positive integers.");
        for (var c = hd; 0 >= od(b, a);) c = qd(c, 1), b = qd(b, 1);
        var d = rd(c,
            1), e = rd(b, 1);
        b = rd(b, 2);
        for (c = rd(c, 2); !ld(b);) {
            var f = e.add(b);
            0 >= od(f, a) && (d = d.add(c), e = f);
            b = rd(b, 1);
            c = rd(c, 1)
        }
        return d
    }
    for (c = dd; 0 <= od(a, b);) {
        d = Math.max(1, Math.floor(jd(a) / jd(b)));
        e = Math.ceil(Math.log(d) / Math.LN2);
        e = 48 >= e ? 1 : Math.pow(2, e - 48);
        f = ed(d);
        for (var g = gd(f, b); -1 == g.a || 0 < od(g, a);) d -= e, f = ed(d), g = gd(f, b);
        ld(f) && (f = hd);
        c = c.add(f);
        a = nd(a, g)
    }
    return c
};
I.prototype.and = function (a) {
    for (var b = Math.max(this.b.length, a.b.length), c = [], d = 0; d < b; d++) c[d] = K(this, d) & K(a, d);
    return new I(c, this.a & a.a)
};
I.prototype.or = function (a) {
    for (var b = Math.max(this.b.length, a.b.length), c = [], d = 0; d < b; d++) c[d] = K(this, d) | K(a, d);
    return new I(c, this.a | a.a)
};
I.prototype.xor = function (a) {
    for (var b = Math.max(this.b.length, a.b.length), c = [], d = 0; d < b; d++) c[d] = K(this, d) ^ K(a, d);
    return new I(c, this.a ^ a.a)
};
var qd = function (a, b) {
    var c = b >> 5;
    b %= 32;
    for (var d = a.b.length + c + (0 < b ? 1 : 0), e = [], f = 0; f < d; f++) e[f] = 0 < b ? K(a, f - c) << b | K(a, f - c - 1) >>> 32 - b : K(a, f - c);
    return new I(e, a.a)
}, rd = function (a, b) {
    var c = b >> 5;
    b %= 32;
    for (var d = a.b.length - c, e = [], f = 0; f < d; f++) e[f] = 0 < b ? K(a, f + c) >>> b | K(a, f + c + 1) << 32 - b : K(a, f + c);
    return new I(e, a.a)
};
var sd = function (a) {
    this.a = a
}, vd = function (a) {
    try {
        return -1 != a.indexOf(":") ? new td(a) : new ud(a)
    } catch (b) {
        return null
    }
}, ud = function (a) {
    this.b = null;
    var b = dd;
    if (a instanceof I) {
        if (0 != a.a || 0 > od(a, dd) || 0 < od(a, wd)) throw Error("The address does not look like an IPv4.");
        b = Za(a)
    } else {
        if (!xd.test(a)) throw Error(a + " does not look like an IPv4 address.");
        var c = a.split(".");
        if (4 != c.length) throw Error(a + " does not look like an IPv4 address.");
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            var f = Number(e);
            e = 0 == f && /^[\s\xa0]*$/.test(e) ?
                NaN : f;
            if (isNaN(e) || 0 > e || 255 < e || 1 != c[d].length && 0 == c[d].lastIndexOf("0", 0)) throw Error("In " + a + ", octet " + d + " is not valid");
            e = ed(e);
            b = qd(b, 8).or(e)
        }
    }
    this.a = b
};
t(ud, sd);
var xd = /^[0-9.]*$/, wd = nd(qd(hd, 32), hd);
ud.prototype.toString = function () {
    if (this.b) return this.b;
    for (var a = kd(this.a, 0), b = [], c = 3; 0 <= c; c--) b[c] = String(a & 255), a >>>= 8;
    return this.b = b.join(".")
};
var td = function (a) {
    this.b = null;
    var b = dd;
    if (a instanceof I) {
        if (0 != a.a || 0 > od(a, dd) || 0 < od(a, yd)) throw Error("The address does not look like a valid IPv6.");
        b = Za(a)
    } else {
        if (!zd.test(a)) throw Error(a + " is not a valid IPv6 address.");
        var c = a.split(":");
        if (-1 != c[c.length - 1].indexOf(".")) {
            a = kd(Za((new ud(c[c.length - 1])).a), 0);
            var d = [];
            d.push((a >>> 16 & 65535).toString(16));
            d.push((a & 65535).toString(16));
            Fa(c, c.length - 1);
            Ka(c, d);
            a = c.join(":")
        }
        d = a.split("::");
        if (2 < d.length || 1 == d.length && 8 != c.length) throw Error(a +
            " is not a valid IPv6 address.");
        if (1 < d.length) {
            c = d[0].split(":");
            d = d[1].split(":");
            1 == c.length && "" == c[0] && (c = []);
            1 == d.length && "" == d[0] && (d = []);
            var e = 8 - (c.length + d.length);
            if (1 > e) c = []; else {
                for (var f = [], g = 0; g < e; g++) f[g] = "0";
                c = Ia(c, f, d)
            }
        }
        if (8 != c.length) throw Error(a + " is not a valid IPv6 address");
        for (d = 0; d < c.length; d++) {
            e = fd(c[d], 16);
            if (0 > od(e, dd) || 0 < od(e, Ad)) throw Error(c[d] + " in " + a + " is not a valid hextet.");
            b = qd(b, 16).or(e)
        }
    }
    this.a = b
};
t(td, sd);
var zd = /^([a-fA-F0-9]*:){2}[a-fA-F0-9:.]*$/, Ad = cd(65535), yd = nd(qd(hd, 128), hd);
td.prototype.toString = function () {
    if (this.b) return this.b;
    for (var a = [], b = 3; 0 <= b; b--) {
        var c = kd(this.a, b), d = c & 65535;
        a.push((c >>> 16).toString(16));
        a.push(d.toString(16))
    }
    c = b = -1;
    for (var e = d = 0, f = 0; f < a.length; f++) "0" == a[f] ? (e++, -1 == c && (c = f), e > d && (d = e, b = c)) : (c = -1, e = 0);
    0 < d && (b + d == a.length && a.push(""), a.splice(b, d, ""), 0 == b && (a = [""].concat(a)));
    return this.b = a.join(":")
};
var Bd = "StopIteration" in k ? k.StopIteration : {message: "StopIteration", stack: ""}, Cd = function () {
};
Cd.prototype.next = function () {
    throw Bd;
};
Cd.prototype.K = function () {
    return this
};
var Dd = function (a) {
    if (a instanceof Cd) return a;
    if ("function" == typeof a.K) return a.K(!1);
    if (pa(a)) {
        var b = 0, c = new Cd;
        c.next = function () {
            for (; ;) {
                if (b >= a.length) throw Bd;
                if (b in a) return a[b++];
                b++
            }
        };
        return c
    }
    throw Error("Not implemented");
}, Ed = function (a, b) {
    if (pa(a)) try {
        Ba(a, b, void 0)
    } catch (c) {
        if (c !== Bd) throw c;
    } else {
        a = Dd(a);
        try {
            for (; ;) b.call(void 0, a.next(), void 0, a)
        } catch (c) {
            if (c !== Bd) throw c;
        }
    }
}, Fd = function (a, b) {
    var c = null;
    Ed(a, function (a) {
        c = b.call(void 0, c, a)
    });
    return c
}, Gd = function (a, b) {
    a = Dd(a);
    try {
        for (; ;) if (!b.call(void 0, a.next(), void 0, a)) return !1
    } catch (c) {
        if (c !== Bd) throw c;
    }
    return !0
};
var L = function (a, b) {
    this.c = {};
    this.b = [];
    this.f = this.a = 0;
    var c = arguments.length;
    if (1 < c) {
        if (c % 2) throw Error("Uneven number of arguments");
        for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
    } else if (a) if (a instanceof L) for (c = a.A(), d = 0; d < c.length; d++) this.set(c[d], a.get(c[d])); else for (d in a) this.set(d, a[d])
};
L.prototype.u = function () {
    Hd(this);
    for (var a = [], b = 0; b < this.b.length; b++) a.push(this.c[this.b[b]]);
    return a
};
L.prototype.A = function () {
    Hd(this);
    return this.b.concat()
};
var Jd = function (a, b) {
    return Id(a.c, b)
};
L.prototype.clear = function () {
    this.c = {};
    this.f = this.a = this.b.length = 0
};
L.prototype.remove = function (a) {
    return Id(this.c, a) ? (delete this.c[a], this.a--, this.f++, this.b.length > 2 * this.a && Hd(this), !0) : !1
};
var Hd = function (a) {
    if (a.a != a.b.length) {
        for (var b = 0, c = 0; b < a.b.length;) {
            var d = a.b[b];
            Id(a.c, d) && (a.b[c++] = d);
            b++
        }
        a.b.length = c
    }
    if (a.a != a.b.length) {
        var e = {};
        for (c = b = 0; b < a.b.length;) d = a.b[b], Id(e, d) || (a.b[c++] = d, e[d] = 1), b++;
        a.b.length = c
    }
};
L.prototype.get = function (a, b) {
    return Id(this.c, a) ? this.c[a] : b
};
L.prototype.set = function (a, b) {
    Id(this.c, a) || (this.a++, this.b.push(a), this.f++);
    this.c[a] = b
};
L.prototype.forEach = function (a, b) {
    for (var c = this.A(), d = 0; d < c.length; d++) {
        var e = c[d], f = this.get(e);
        a.call(b, f, e, this)
    }
};
L.prototype.K = function (a) {
    Hd(this);
    var b = 0, c = this.f, d = this, e = new Cd;
    e.next = function () {
        if (c != d.f) throw Error("The map has changed since the iterator was created");
        if (b >= d.b.length) throw Bd;
        var e = d.b[b++];
        return a ? e : d.c[e]
    };
    return e
};
var Id = function (a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
};
var Kd = function (a) {
    if (a.u && "function" == typeof a.u) return a.u();
    if (n(a)) return a.split("");
    if (pa(a)) {
        for (var b = [], c = a.length, d = 0; d < c; d++) b.push(a[d]);
        return b
    }
    return Xa(a)
}, Ld = function (a, b) {
    if (a.forEach && "function" == typeof a.forEach) a.forEach(b, void 0); else if (pa(a) || n(a)) Ba(a, b, void 0); else {
        if (a.A && "function" == typeof a.A) var c = a.A(); else if (a.u && "function" == typeof a.u) c = void 0; else if (pa(a) || n(a)) {
            c = [];
            for (var d = a.length, e = 0; e < d; e++) c.push(e)
        } else c = Ya(a);
        d = Kd(a);
        e = d.length;
        for (var f = 0; f < e; f++) b.call(void 0,
            d[f], c && c[f], a)
    }
};
var Md = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,
    Nd = function (a, b) {
        if (a) {
            a = a.split("&");
            for (var c = 0; c < a.length; c++) {
                var d = a[c].indexOf("="), e = null;
                if (0 <= d) {
                    var f = a[c].substring(0, d);
                    e = a[c].substring(d + 1)
                } else f = a[c];
                b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
            }
        }
    };
var Od = function (a, b) {
    this.f = this.j = this.c = "";
    this.h = null;
    this.g = this.b = "";
    this.a = !1;
    if (a instanceof Od) {
        this.a = m(b) ? b : a.a;
        Pd(this, a.c);
        this.j = a.j;
        this.f = a.f;
        Qd(this, a.h);
        this.b = a.b;
        b = a.i;
        var c = new Rd;
        c.c = b.c;
        b.a && (c.a = new L(b.a), c.b = b.b);
        Sd(this, c);
        this.g = a.g
    } else a && (c = String(a).match(Md)) ? (this.a = !!b, Pd(this, c[1] || "", !0), this.j = Td(c[2] || ""), this.f = Td(c[3] || "", !0), Qd(this, c[4]), this.b = Td(c[5] || "", !0), Sd(this, c[6] || "", !0), this.g = Td(c[7] || "")) : (this.a = !!b, this.i = new Rd(null, this.a))
};
Od.prototype.toString = function () {
    var a = [], b = this.c;
    b && a.push(Ud(b, Vd, !0), ":");
    var c = this.f;
    if (c || "file" == b) a.push("//"), (b = this.j) && a.push(Ud(b, Vd, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.h, null != c && a.push(":", String(c));
    if (c = this.b) this.f && "/" != c.charAt(0) && a.push("/"), a.push(Ud(c, "/" == c.charAt(0) ? Wd : Xd, !0));
    (c = this.i.toString()) && a.push("?", c);
    (c = this.g) && a.push("#", Ud(c, Yd));
    return a.join("")
};
var Pd = function (a, b, c) {
    a.c = c ? Td(b, !0) : b;
    a.c && (a.c = a.c.replace(/:$/, ""))
}, Qd = function (a, b) {
    if (b) {
        b = Number(b);
        if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);
        a.h = b
    } else a.h = null
}, Sd = function (a, b, c) {
    b instanceof Rd ? (a.i = b, Zd(a.i, a.a)) : (c || (b = Ud(b, $d)), a.i = new Rd(b, a.a))
}, ae = function (a) {
    return a instanceof Od ? new Od(a) : new Od(a, void 0)
}, Td = function (a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
}, Ud = function (a, b, c) {
    return n(a) ? (a = encodeURI(a).replace(b, be), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g,
        "%$1")), a) : null
}, be = function (a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}, Vd = /[#\/\?@]/g, Xd = /[#\?:]/g, Wd = /[#\?]/g, $d = /[#\?@]/g, Yd = /#/g, Rd = function (a, b) {
    this.b = this.a = null;
    this.c = a || null;
    this.f = !!b
}, ce = function (a) {
    a.a || (a.a = new L, a.b = 0, a.c && Nd(a.c, function (b, c) {
        a.add(decodeURIComponent(b.replace(/\+/g, " ")), c)
    }))
};
Rd.prototype.add = function (a, b) {
    ce(this);
    this.c = null;
    a = de(this, a);
    var c = this.a.get(a);
    c || this.a.set(a, c = []);
    c.push(b);
    this.b += 1;
    return this
};
Rd.prototype.remove = function (a) {
    ce(this);
    a = de(this, a);
    return Jd(this.a, a) ? (this.c = null, this.b -= this.a.get(a).length, this.a.remove(a)) : !1
};
Rd.prototype.clear = function () {
    this.a = this.c = null;
    this.b = 0
};
var ee = function (a, b) {
    ce(a);
    b = de(a, b);
    return Jd(a.a, b)
};
h = Rd.prototype;
h.forEach = function (a, b) {
    ce(this);
    this.a.forEach(function (c, d) {
        Ba(c, function (c) {
            a.call(b, c, d, this)
        }, this)
    }, this)
};
h.A = function () {
    ce(this);
    for (var a = this.a.u(), b = this.a.A(), c = [], d = 0; d < b.length; d++) for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
    return c
};
h.u = function (a) {
    ce(this);
    var b = [];
    if (n(a)) ee(this, a) && (b = Ha(b, this.a.get(de(this, a)))); else {
        a = this.a.u();
        for (var c = 0; c < a.length; c++) b = Ha(b, a[c])
    }
    return b
};
h.set = function (a, b) {
    ce(this);
    this.c = null;
    a = de(this, a);
    ee(this, a) && (this.b -= this.a.get(a).length);
    this.a.set(a, [b]);
    this.b += 1;
    return this
};
h.get = function (a, b) {
    if (!a) return b;
    a = this.u(a);
    return 0 < a.length ? String(a[0]) : b
};
h.toString = function () {
    if (this.c) return this.c;
    if (!this.a) return "";
    for (var a = [], b = this.a.A(), c = 0; c < b.length; c++) {
        var d = b[c], e = encodeURIComponent(String(d));
        d = this.u(d);
        for (var f = 0; f < d.length; f++) {
            var g = e;
            "" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));
            a.push(g)
        }
    }
    return this.c = a.join("&")
};
var de = function (a, b) {
    b = String(b);
    a.f && (b = b.toLowerCase());
    return b
}, Zd = function (a, b) {
    b && !a.f && (ce(a), a.c = null, a.a.forEach(function (a, b) {
        var c = b.toLowerCase();
        b != c && (this.remove(b), this.remove(c), 0 < a.length && (this.c = null, this.a.set(de(this, c), Ja(a)), this.b += a.length))
    }, a));
    a.f = b
};
r("castApp.core.setupApi.ConfiguredNetworkMsg", function (a, b, c, d) {
    this.ssid = a;
    this.wpa_auth = b;
    this.wpa_cipher = c;
    this.wpa_id = d
});
var fe = function (a, b) {
    this.ssid = a;
    this.wpa_auth = b
};
r("castApp.core.setupApi.ConnectWiFiMsg", fe);
var ge = function (a, b, c, d, e, f, g, l, p, u, T) {
    this.version = a;
    this.name = b;
    this.build_version = c;
    this.has_update = d;
    this.ssdp_udn = e;
    this.mac_address = f;
    this.connected = g;
    this.ssid = l;
    this.wpa_state = p;
    this.setup_state = u;
    this.wpa_configured = T
};
r("castApp.core.setupApi.EurekaInfoMsg34Base", ge);
var he = function (a, b, c, d, e, f, g, l, p, u) {
    ge.call(this, 3, a, b, c, d, e, f, g, l, p, u)
};
t(he, ge);
r("castApp.core.setupApi.EurekaInfoMsgV3", he);
he.Location = function (a, b) {
    this.latitude = a;
    this.longitude = b
};
var ie = function (a, b, c) {
    this.certificate = a;
    this.nonce = b;
    this.signed_data = c
};
he.Sign = ie;
var je = function () {
};
he.Detail = je;
je.Timezone = function (a, b) {
    this.display_string = a;
    this.offset = b
};
je.Locale = function (a) {
    this.display_string = a
};
var ke = function (a, b, c, d, e, f, g, l, p, u, T, $g) {
    ge.call(this, a, b, c, d, e, f, g, l, p, u, T);
    this.uptime = $g
};
t(ke, ge);
r("castApp.core.setupApi.EurekaInfoMsgV4", ke);
var le = function (a) {
    x(a, "locale", "en-US");
    x(a, "debug_build", !1);
    x(a, "update_only_build", !1);
    x(a, "ethernet_connected", !1);
    x(a, "tos_accepted", !0);
    x(a, "time_format", 0);
    x(a, "hdmi_control", !0);
    !n(a.hotspot_bssid) && a.mac_address && 5 <= a.mac_address.length && (a.hotspot_bssid = "00:1A:11:FF:" + a.mac_address.substr(a.mac_address.length - 5));
    if (a.opt_in) {
        var b = a.opt_in;
        x(b, "crash", !0);
        x(b, "stats", !0);
        x(b, "device_id", !1);
        x(b, "location", !1);
        x(b, "opencast", !1)
    }
    return a
};
ke.SetupStats = function () {
};
var me = function () {
};
ke.Location = me;
var ne = function () {
};
ke.OptIn = ne;
var oe = function (a, b, c) {
    ie.call(this, a, b, c)
};
t(oe, ie);
ke.Sign = oe;
var pe = function (a) {
    this.manufacturer = "Google Inc.";
    this.model_name = "Eureka Dongle";
    this.icon_list = a
};
t(pe, je);
ke.Detail = pe;
pe.Icon = function (a, b, c, d) {
    this.mimetype = "image/png";
    this.width = a;
    this.height = b;
    this.depth = c;
    this.url = d
};
var qe = function () {
};
r("castApp.core.setupApi.EurekaInfoMsgV7", qe);
var re = function (a) {
    if (a.device_info) {
        var b = a.device_info;
        !b.hotspot_bssid && b.mac_address && (b.hotspot_bssid = "00:1A:11:FF:" + b.mac_address.substr(b.mac_address.length - 5));
        b.capabilities && (b = b.capabilities, x(b, "display_supported", !0), x(b, "wifi_supported", !0), x(b, "wifi_regulatory_domain_locked", !1), x(b, "hotspot_supported", !0), x(b, "ble_supported", !1), x(b, "multizone_supported", !1))
    }
    a.net && x(a.net, "ethernet_connected", !1);
    a.setup && x(a.setup, "tos_accepted", !0);
    a.settings && (b = a.settings, x(b, "time_format", 1),
        x(b, "locale", "en-US"));
    return a
};
qe.BuildInfo = function () {
};
var se = function () {
};
qe.DeviceInfo = se;
se.Capabilities = function () {
};
qe.OtaStatus = function () {
};
qe.Net = function () {
};
qe.WiFi = function () {
};
var te = function () {
};
qe.Setup = te;
te.Stats = function () {
};
var ue = function () {
};
qe.Settings = ue;
var ve = function () {
};
qe.OptIn = ve;
qe.OpenCast = function () {
};
qe.Multizone = function () {
};
var we = function (a) {
    this.wpa_id = a
};
r("castApp.core.setupApi.ForgetWiFiMsg", we);
r("castApp.core.setupApi.GetAppDeviceIdRequestMsg", function (a) {
    this.app_id = a
});
r("castApp.core.setupApi.GetAppDeviceIdResponseMsg", function (a, b, c) {
    this.app_device_id = a;
    this.certificate = b;
    this.signed_data = c
});
r("castApp.core.setupApi.OfferMsg", function (a) {
    this.token = a
});
var xe = function (a) {
    this.sound_id = a
};
r("castApp.core.setupApi.PlaySoundRequestMsg", xe);
r("castApp.core.setupApi.PlaySoundResponseMsg", function (a, b) {
    this.volume = a;
    this.duration = b
});
var ye = function (a) {
    this.params = a
};
r("castApp.core.setupApi.RebootMsg", ye);
var ze = function (a, b, c, d, e) {
    this.ssid = a;
    this.wpa_auth = b;
    this.wpa_cipher = c;
    this.bssid = d;
    this.signal_level = e
};
r("castApp.core.setupApi.ScanResultMsgBase", ze);
var Ae = function (a, b, c, d, e, f) {
    ze.call(this, a, b, c, d, e);
    this.ap_list = f
};
t(Ae, ze);
r("castApp.core.setupApi.ScanResultMsgV7", Ae);
Ae.Ap = function (a, b, c) {
    this.bssid = a;
    this.signal_level = b;
    this.frequency = c
};
var Be = function () {
};
r("castApp.core.setupApi.SaveWiFiRequestMsg", Be);
r("castApp.core.setupApi.SaveWiFiResponseMsg", function (a) {
    this.setup_state = a
});
r("castApp.core.setupApi.SendLogReportRequestMsg", function (a) {
    this.uuid = a
});
r("castApp.core.setupApi.SendLogReportResponseMsg", function (a) {
    this.crash_report_id = a
});
var Ce = function () {
};
r("castApp.core.setupApi.SetEurekaInfoMsgBase", Ce);
var De = function () {
};
t(De, Ce);
r("castApp.core.setupApi.SetEurekaInfoMsgV3", De);
var Ee = function () {
};
t(Ee, Ce);
r("castApp.core.setupApi.SetEurekaInfoMsgV4", Ee);
var Fe = function () {
};
t(Fe, Ce);
r("castApp.core.setupApi.SetEurekaInfoMsgV7", Fe);
r("castApp.core.setupApi.SupportedLocale", function (a, b) {
    this.locale = a;
    this.display_string = b
});
r("castApp.core.setupApi.SupportedTimeZone", function (a, b, c) {
    this.timezone = a;
    this.display_string = b;
    this.offset = c
});
var Ge = function (a) {
    this.id = a
};
r("castApp.core.storage.SetupSession", Ge);
var He = function () {
};
r("castApp.core.storage.CommonSetupState", He);
var Ie = function (a) {
    this.type = a.type;
    this.name = a.name;
    this.bssid = a.bssid;
    this.ssid = a.ssid;
    this.ipAddress = a.ipAddress
};
r("castApp.core.storage.DeviceToSetUp", Ie);
var Je = function (a) {
    this.deviceIpAddress = a
};
r("castApp.core.storage.SetupApiClientState", Je);
var Ke = function (a) {
    this.msg = a
};
r("castApp.core.storage.ConnectWiFiState", Ke);
r("castApp.core.storage.EurekaInfoState", function (a, b, c, d, e, f, g, l) {
    this.setupApiVersion = a;
    this.name = b;
    this.setupState = c;
    this.ssdpUdn = d;
    this.deviceType = e;
    this.features = f;
    this.ethernetConnected = g;
    this.tosAccepted = l
});
var Le = function (a, b) {
    this.timeStamp = a;
    this.verificationProperties = b
};
r("castApp.core.storage.VerificationState", Le);
var M = function (a) {
    this.type = a
};
r("castApp.core.storage.SetupState", M);
var Me = function (a, b) {
    this.all = b;
    this.current = a
};
r("castApp.core.storage.SetupStateCollection", Me);
var Ne = function (a, b, c) {
    this.type = a;
    this.time = b;
    this.deviceId = c
}, Oe = function (a) {
    for (var b = [], c = 0, d = a.length; c < d; ++c) {
        var e = a.key(c);
        if (e && 0 == e.lastIndexOf("setupSession_", 0)) {
            a:{
                var f = a, g = f.getItem(e);
                if (g) try {
                    var l = JSON.parse(g);
                    break a
                } catch (p) {
                    f.removeItem(e)
                }
                l = null
            }
            l && b.push(l)
        }
    }
    return b
}, Pe = function () {
    var a = ya() - 432E5;
    Oe(window.localStorage).forEach(function (b) {
        (!b.timestamp || b.timestamp < a) && window.localStorage.removeItem("setupSession_" + b.id)
    })
}, Qe = function (a, b) {
    b.timestamp = ya();
    a.setItem("setupSession_" +
        b.id, JSON.stringify(b))
}, Re = function (a, b) {
    a.removeItem("setupSession_" + b.id)
}, Se = function (a) {
    var b = a.getItem("setupDeviceState");
    if (b) try {
        return JSON.parse(b)
    } catch (c) {
        a.removeItem("setupDeviceState")
    }
    return []
}, Te = function (a, b) {
    0 === b.length ? a.removeItem("setupDeviceState") : a.setItem("setupDeviceState", JSON.stringify(b))
}, Ue = function (a) {
    return "false" === a.getItem("setupAutoNetworkSwitching") ? !1 : !0
}, Ve = function (a, b) {
    1 === b ? a.removeItem("castApp.analyticsOptIn") : a.setItem("castApp.analyticsOptIn", b.toString())
};
var We = function () {
}, Xe = function () {
};
t(Xe, We);
Xe.prototype.b = function () {
};
Xe.prototype.f = function () {
};
Xe.prototype.a = function () {
    return z(3)
};
Xe.prototype.h = function () {
};
var Ye = function (a) {
    this.g = chrome.metricsPrivate;
    this.c = a
};
t(Ye, We);
Ye.prototype.b = function (a) {
    this.g.recordUserAction("Cast.Chrome.App." + a.toString())
};
Ye.prototype.f = function (a) {
    switch (a.eventType) {
        case 1:
            var b = "List";
            break;
        case 2:
            b = "View";
            break;
        case 3:
            b = "Redeem";
            break;
        default:
            return
    }
    b = "Cast.Chrome.App.Offers." + b;
    if (m(a.offerId)) {
        if (!ma(a.offerId) || 0 > a.offerId) return;
        b += "." + a.offerId
    }
    this.g.recordUserAction(b)
};
Ye.prototype.a = function () {
    var a = parseInt(this.c.getItem("castApp.analyticsOptIn"), 10);
    if (isNaN(a) || 1 > a || 3 < a) a = 1;
    return z(a)
};
Ye.prototype.h = function (a) {
    a ? (Ve(this.c, 2), this.b(1)) : (Ve(this.c, 3), this.b(2))
};
var Ze = function () {
    this.g = this.g;
    this.s = this.s
};
Ze.prototype.g = !1;
Ze.prototype.aa = function () {
    this.g || (this.g = !0, this.C())
};
Ze.prototype.C = function () {
    if (this.s) for (; this.s.length;) this.s.shift()()
};
var $e;
($e = !hb) || ($e = 9 <= Number(sb));
var af = $e, bf = hb && !rb("9"), cf = function () {
    if (!k.addEventListener || !Object.defineProperty) return !1;
    var a = !1, b = Object.defineProperty({}, "passive", {
        get: function () {
            a = !0
        }
    });
    k.addEventListener("test", q, b);
    k.removeEventListener("test", q, b);
    return a
}();
var N = function (a, b) {
    this.type = a;
    this.a = this.target = b;
    this.Ba = !0
};
N.prototype.b = function () {
    this.Ba = !1
};
var ef = function (a, b) {
    N.call(this, a ? a.type : "");
    this.relatedTarget = this.a = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
    this.key = "";
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.c = null;
    if (a) {
        var c = this.type = a.type, d = a.changedTouches ? a.changedTouches[0] : null;
        this.target = a.target || a.srcElement;
        this.a = b;
        if (b = a.relatedTarget) {
            if (jb) {
                a:{
                    try {
                        db(b.nodeName);
                        var e = !0;
                        break a
                    } catch (f) {
                    }
                    e = !1
                }
                e || (b = null)
            }
        } else "mouseover" ==
        c ? b = a.fromElement : "mouseout" == c && (b = a.toElement);
        this.relatedTarget = b;
        null === d ? (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0);
        this.button = a.button;
        this.key = a.key || "";
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey =
            a.metaKey;
        this.pointerId = a.pointerId || 0;
        this.pointerType = n(a.pointerType) ? a.pointerType : df[a.pointerType] || "";
        this.state = a.state;
        this.c = a;
        a.defaultPrevented && this.b()
    }
};
t(ef, N);
var df = {2: "touch", 3: "pen", 4: "mouse"};
ef.prototype.b = function () {
    ef.F.b.call(this);
    var a = this.c;
    if (a.preventDefault) a.preventDefault(); else if (a.returnValue = !1, bf) try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1
    } catch (b) {
    }
};
var ff = "closure_listenable_" + (1E6 * Math.random() | 0), gf = function (a) {
    return !(!a || !a[ff])
}, hf = 0;
var jf = function (a, b, c, d, e) {
    this.listener = a;
    this.proxy = null;
    this.src = b;
    this.type = c;
    this.capture = !!d;
    this.fa = e;
    this.key = ++hf;
    this.removed = this.$ = !1
}, kf = function (a) {
    a.removed = !0;
    a.listener = null;
    a.proxy = null;
    a.src = null;
    a.fa = null
};
var lf = function (a) {
    this.src = a;
    this.a = {};
    this.b = 0
};
lf.prototype.add = function (a, b, c, d, e) {
    var f = a.toString();
    a = this.a[f];
    a || (a = this.a[f] = [], this.b++);
    var g = mf(a, b, d, e);
    -1 < g ? (b = a[g], c || (b.$ = !1)) : (b = new jf(b, this.src, f, !!d, e), b.$ = c, a.push(b));
    return b
};
lf.prototype.remove = function (a, b, c, d) {
    a = a.toString();
    if (!(a in this.a)) return !1;
    var e = this.a[a];
    b = mf(e, b, c, d);
    return -1 < b ? (kf(e[b]), Fa(e, b), 0 == e.length && (delete this.a[a], this.b--), !0) : !1
};
var nf = function (a, b) {
    var c = b.type;
    c in a.a && Ga(a.a[c], b) && (kf(b), 0 == a.a[c].length && (delete a.a[c], a.b--))
};
lf.prototype.removeAll = function (a) {
    a = a && a.toString();
    var b = 0, c;
    for (c in this.a) if (!a || c == a) {
        for (var d = this.a[c], e = 0; e < d.length; e++) ++b, kf(d[e]);
        delete this.a[c];
        this.b--
    }
    return b
};
var of = function (a, b, c, d, e) {
    a = a.a[b.toString()];
    b = -1;
    a && (b = mf(a, c, d, e));
    return -1 < b ? a[b] : null
}, mf = function (a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
        var f = a[e];
        if (!f.removed && f.listener == b && f.capture == !!c && f.fa == d) return e
    }
    return -1
};
var pf = "closure_lm_" + (1E6 * Math.random() | 0), qf = {}, rf = 0, tf = function (a, b, c, d, e) {
    if (d && d.once) return sf(a, b, c, d, e);
    if (oa(b)) {
        for (var f = 0; f < b.length; f++) tf(a, b[f], c, d, e);
        return null
    }
    c = uf(c);
    return gf(a) ? a.listen(b, c, ra(d) ? !!d.capture : !!d, e) : vf(a, b, c, !1, d, e)
}, vf = function (a, b, c, d, e, f) {
    if (!b) throw Error("Invalid event type");
    var g = ra(e) ? !!e.capture : !!e, l = wf(a);
    l || (a[pf] = l = new lf(a));
    c = l.add(b, c, d, g, f);
    if (c.proxy) return c;
    d = xf();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    if (a.addEventListener) cf || (e = g), void 0 === e && (e =
        !1), a.addEventListener(b.toString(), d, e); else if (a.attachEvent) a.attachEvent(yf(b.toString()), d); else if (a.addListener && a.removeListener) a.addListener(d); else throw Error("addEventListener and attachEvent are unavailable.");
    rf++;
    return c
}, xf = function () {
    var a = zf, b = af ? function (c) {
        return a.call(b.src, b.listener, c)
    } : function (c) {
        c = a.call(b.src, b.listener, c);
        if (!c) return c
    };
    return b
}, sf = function (a, b, c, d, e) {
    if (oa(b)) {
        for (var f = 0; f < b.length; f++) sf(a, b[f], c, d, e);
        return null
    }
    c = uf(c);
    return gf(a) ? a.c.add(String(b),
        c, !0, ra(d) ? !!d.capture : !!d, e) : vf(a, b, c, !0, d, e)
}, Af = function (a, b, c, d, e) {
    if (oa(b)) for (var f = 0; f < b.length; f++) Af(a, b[f], c, d, e); else d = ra(d) ? !!d.capture : !!d, c = uf(c), gf(a) ? O(a, b, c, d, e) : a && (a = wf(a)) && (b = of(a, b, c, d, e)) && Bf(b)
}, Bf = function (a) {
    if (!ma(a) && a && !a.removed) {
        var b = a.src;
        if (gf(b)) nf(b.c, a); else {
            var c = a.type, d = a.proxy;
            b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(yf(c), d) : b.addListener && b.removeListener && b.removeListener(d);
            rf--;
            (c = wf(b)) ? (nf(c, a), 0 == c.b &&
            (c.src = null, b[pf] = null)) : kf(a)
        }
    }
}, yf = function (a) {
    return a in qf ? qf[a] : qf[a] = "on" + a
}, Df = function (a, b, c, d) {
    var e = !0;
    if (a = wf(a)) if (b = a.a[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) {
        var f = b[a];
        f && f.capture == c && !f.removed && (f = Cf(f, d), e = e && !1 !== f)
    }
    return e
}, Cf = function (a, b) {
    var c = a.listener, d = a.fa || a.src;
    a.$ && Bf(a);
    return c.call(d, b)
}, zf = function (a, b) {
    if (a.removed) return !0;
    if (!af) {
        if (!b) a:{
            b = ["window", "event"];
            for (var c = k, d = 0; d < b.length; d++) if (c = c[b[d]], null == c) {
                b = null;
                break a
            }
            b = c
        }
        d = b;
        b = new ef(d,
            this);
        c = !0;
        if (!(0 > d.keyCode || void 0 != d.returnValue)) {
            a:{
                var e = !1;
                if (0 == d.keyCode) try {
                    d.keyCode = -1;
                    break a
                } catch (g) {
                    e = !0
                }
                if (e || void 0 == d.returnValue) d.returnValue = !0
            }
            d = [];
            for (e = b.a; e; e = e.parentNode) d.push(e);
            a = a.type;
            for (e = d.length - 1; 0 <= e; e--) {
                b.a = d[e];
                var f = Df(d[e], a, !0, b);
                c = c && f
            }
            for (e = 0; e < d.length; e++) b.a = d[e], f = Df(d[e], a, !1, b), c = c && f
        }
        return c
    }
    return Cf(a, new ef(b, this))
}, wf = function (a) {
    a = a[pf];
    return a instanceof lf ? a : null
}, Ef = "__closure_events_fn_" + (1E9 * Math.random() >>> 0), uf = function (a) {
    if (qa(a)) return a;
    a[Ef] || (a[Ef] = function (b) {
        return a.handleEvent(b)
    });
    return a[Ef]
};
var P = function () {
    Ze.call(this);
    this.c = new lf(this);
    this.Ha = this;
    this.P = null
};
t(P, Ze);
P.prototype[ff] = !0;
P.prototype.removeEventListener = function (a, b, c, d) {
    Af(this, a, b, c, d)
};
var Q = function (a, b) {
    var c, d = a.P;
    if (d) for (c = []; d; d = d.P) c.push(d);
    a = a.Ha;
    d = b.type || b;
    if (n(b)) b = new N(b, a); else if (b instanceof N) b.target = b.target || a; else {
        var e = b;
        b = new N(d, a);
        ab(b, e)
    }
    e = !0;
    if (c) for (var f = c.length - 1; 0 <= f; f--) {
        var g = b.a = c[f];
        e = Ff(g, d, !0, b) && e
    }
    g = b.a = a;
    e = Ff(g, d, !0, b) && e;
    e = Ff(g, d, !1, b) && e;
    if (c) for (f = 0; f < c.length; f++) g = b.a = c[f], e = Ff(g, d, !1, b) && e
};
P.prototype.C = function () {
    P.F.C.call(this);
    this.c && this.c.removeAll(void 0);
    this.P = null
};
P.prototype.listen = function (a, b, c, d) {
    return this.c.add(String(a), b, !1, c, d)
};
var O = function (a, b, c, d, e) {
    a.c.remove(String(b), c, d, e)
}, Ff = function (a, b, c, d) {
    b = a.c.a[String(b)];
    if (!b) return !0;
    b = b.concat();
    for (var e = !0, f = 0; f < b.length; ++f) {
        var g = b[f];
        if (g && !g.removed && g.capture == c) {
            var l = g.listener, p = g.fa || g.src;
            g.$ && nf(a.c, g);
            e = !1 !== l.call(p, d) && e
        }
    }
    return e && 0 != d.Ba
};
var Gf = function () {
    v.call(this)
};
t(Gf, v);
Gf.prototype.name = "httpTimeout";
var Hf = function (a, b) {
    var c = B(), d = function (a) {
        c.b(a)
    };
    a.listen(b, d);
    return C(c.a, function () {
        O(a, b, d)
    })
}, If = function (a) {
    if (a instanceof E) throw a;
}, Jf = function (a, b) {
    var c = setTimeout(function () {
        a.cancel()
    }, b);
    C(a, function () {
        clearTimeout(c);
        c = null
    });
    return a
}, Kf = function () {
    var a = B();
    Jf(a.a, 2E3);
    return a
};
if (hb && hb) try {
    new ActiveXObject("MSXML2.DOMDocument")
} catch (a) {
}
;var R = function (a) {
    this.a = new L;
    if (a) {
        a = Kd(a);
        for (var b = a.length, c = 0; c < b; c++) this.add(a[c])
    }
}, Lf = function (a) {
    var b = typeof a;
    return "object" == b && a || "function" == b ? "o" + (a[sa] || (a[sa] = ++ta)) : b.substr(0, 1) + a
};
h = R.prototype;
h.add = function (a) {
    this.a.set(Lf(a), a)
};
h.removeAll = function (a) {
    a = Kd(a);
    for (var b = a.length, c = 0; c < b; c++) this.remove(a[c])
};
h.remove = function (a) {
    return this.a.remove(Lf(a))
};
h.clear = function () {
    this.a.clear()
};
h.contains = function (a) {
    return Jd(this.a, Lf(a))
};
var Mf = function (a, b) {
    a = new R(a);
    a.removeAll(b);
    return a
};
R.prototype.u = function () {
    return this.a.u()
};
R.prototype.K = function () {
    return this.a.K(!1)
};
var Nf = function (a) {
    v.call(this, a)
};
t(Nf, v);
Nf.prototype.name = "chrome.runtime.lastError";
var Of = function (a, b) {
    this.onNetworksChanged = a;
    this.onNetworkListChanged = b
};
r("castApp.core.NetworkingPrivateApi.WiFiProperties", function () {
});
r("castApp.core.NetworkingPrivateApi.NetworkProperties", function () {
});
var Pf = [[0xfa8fca000000, 0xfa8fcaffffff], [111971074048, 111971139583]], Qf = new function (a) {
        this.b = new L;
        this.a = new L;
        for (var b = a.length, c = 0; c < b; ++c) this.b.set(a[c], a[c + 1]), this.a.set(a[c + 1], a[c])
    }(["a", 4, "b", 2, "c", 3, "d", 5, "e", 6, "f", 1, "g", 7, "h", 8, "i", 9, "j", 10, "k", 11, "l", 12, "m", 13]),
    Rf = new R("bcamde".split("")), Sf = new R("adghjkl".split("")), Tf = new R("bcamde".split("")),
    Uf = new R(["b", "c", "a", "m"]), Vf = new R(["b", "c", "a", "m"]), Wf = new R(["d"]), Xf = function (a) {
        if (/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/.test(a)) {
            var b =
                parseInt;
            var c = RegExp;
            var d = ":".replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
            c = new c(d, "g");
            a = a.replace(c, "");
            b = b(a, 16)
        } else b = NaN;
        return b
    }, Yf = function (a, b) {
        return !(!a || !b || 0 !== Pa(a, b))
    }, Zf = function (a) {
        var b = Xf(a);
        return !!Da(Pf, function (a) {
            return b >= a[0] && b <= a[1]
        })
    }, ag = function (a) {
        return !a.WiFi || !a.WiFi.BSSID || a.WiFi.Security && "None" !== a.WiFi.Security || !Zf(a.WiFi.BSSID) ? !1 : Rf.contains($f(a.WiFi.SSID || "").type)
    }, $f = function (a) {
        var b = /^(.*)\.([^\.]*)$/.exec(a), c = null;
        return b &&
        3 === b.length && (c = bg(b[2])) ? {name: b[1], type: c.type, subtype: c.subtype} : {
            name: a,
            type: "c",
            subtype: null
        }
    }, bg = function (a) {
        a = /^([a-m])(\d{0,3})$/.exec(a);
        if (!a || 3 !== a.length) return null;
        var b = parseInt(a[2], 10);
        return {type: a[1], subtype: isNaN(b) ? null : b}
    }, cg = function (a, b) {
        var c = new Jc;
        c.supportsSetup = Rf.contains(a);
        b && !1 === b.setup_supported && (c.supportsSetup = !1);
        c.supportsDisplay = !Sf.contains(a);
        b && void 0 !== b.display_supported && (c.supportsDisplay = !!b.display_supported);
        if (Tf.contains(a)) {
            var d = c.deviceSettings =
                new Ic;
            d.supportsForgetWiFi = !0;
            b && !1 === b.wifi_supported && (d.supportsForgetWiFi = !1);
            c.supportsSetup || (d.supportsForgetWiFi = !1);
            d.supportsReboot = Uf.contains(a);
            b && void 0 !== b.reboot_supported && (d.supportsReboot = !!b.reboot_supported);
            d.supportsFdr = Vf.contains(a);
            b && void 0 !== b.fdr_supported && (d.supportsFdr = !!b.fdr_supported);
            c.supportsSetup || (d.supportsFdr = !1);
            d.supportsDataCollectionToggle = !0;
            b && void 0 !== b.stats_supported && (d.supportsDataCollectionToggle = !!b.stats_supported);
            d.supportsTimeFormatChange =
                !0;
            c.supportsDisplay || (d.supportsTimeFormatChange = !1);
            d.supportsOtherLicenses = !Wf.contains(a)
        }
        return c
    }, dg = function (a) {
        return Qf.b.get(a) || 3
    }, eg = function (a) {
        switch (a) {
            case 2:
            case 3:
            case 4:
                return 3;
            case 5:
            case 6:
                return 4;
            case 7:
            case 8:
                return 5
        }
        return 2
    }, fg = function (a) {
        switch (a) {
            case 2:
                return 1;
            case 3:
                return 2;
            case 4:
                return 5;
            case 5:
                return 7
        }
        return 0
    }, gg = function (a) {
        switch (a) {
            case chrome.cast.media.PlayerState.PLAYING:
                return 2;
            case chrome.cast.media.PlayerState.PAUSED:
                return 3;
            case chrome.cast.media.PlayerState.BUFFERING:
                return 4
        }
        return 1
    },
    hg = function (a) {
        switch (a) {
            case chrome.cast.SessionStatus.CONNECTED:
                return 1;
            case chrome.cast.SessionStatus.STOPPED:
                return 3
        }
        return 2
    }, ig = function (a, b) {
        var c = 2;
        1 === a.a ? c = 3 : 2 === a.a && (c = 4);
        b = new Dc(c, b, [], null);
        b.selectedNetwork = new Cc(a.b || null, a.msg.ssid, eg(a.msg.wpa_auth));
        a.b && b.networks.push(b.selectedNetwork);
        return b
    }, jg = function (a, b, c) {
        switch (a) {
            case 3:
                return c = new De, c.name = b, c;
            case 4:
            case 5:
            case 6:
                return a = new Ee, a.name = b, a.opt_in = new ne, a.opt_in.crash = a.opt_in.stats = c, a;
            default:
                return a = new Fe,
                    a.name = b, a.opt_in = new ve, a.opt_in.stats = c, a
        }
    }, kg = function (a) {
        return "E8C28D3C" == a || "00000000-0000-0000-0000-000000000000" == a
    };
var lg = function () {
}, ng = function () {
    this.b = {};
    this.a = {};
    mg || (mg = new y(function (a, b) {
        window.__onGCastApiAvailable = function (c) {
            c ? a() : b()
        }.bind(this);
        var c = document.createElement("script");
        c.setAttribute("src", chrome.extension.getURL("cast_sender.js"));
        document.head.appendChild(c)
    }.bind(this)))
};
t(ng, lg);
var mg = null, og = function (a, b, c) {
    return mg.then(function () {
        var a = b + c, e = this.b[a];
        if (e) return e.a;
        e = Kf();
        this.b[a] = e;
        var f = this.a[a];
        f || (f = new chrome.cast.SessionRequest(b), f = new chrome.cast.ApiConfig(f, this.c.bind(this), q, chrome.cast.AutoJoinPolicy.CUSTOM_CONTROLLER_SCOPED), f.invisibleSender = !kg(b), f = chrome.cast.initializeWithContext(f, q, function () {
        }.bind(this)), this.a[a] = f);
        chrome.cast.requestSessionByIdWithContext(f, c);
        return e.a
    }.bind(a))
};
ng.prototype.c = function (a) {
    var b = a.appId + a.sessionId, c = this.b[b];
    c && c.b({session: a, context: this.a[b]})
};
var pg = function () {
    Of.call(this, chrome.networkingPrivate.onNetworksChanged, chrome.networkingPrivate.onNetworkListChanged)
};
t(pg, Of);
pg.a = void 0;
pg.b = function () {
    return pg.a ? pg.a : pg.a = new pg
};
var qg = function (a) {
    return chrome.runtime.lastError ? (a.c(new Nf(chrome.runtime.lastError.message)), !0) : !1
};
h = pg.prototype;
h.getNetworks = function (a) {
    var b = B();
    chrome.networkingPrivate.getNetworks(a, function (a) {
        qg(b) || b.b(a)
    });
    return b.a
};
h.getProperties = function (a) {
    var b = B();
    chrome.networkingPrivate.getProperties(a, function (a) {
        qg(b) || b.b(a)
    });
    return b.a
};
h.requestNetworkScan = function () {
    chrome.networkingPrivate.requestNetworkScan()
};
h.startConnect = function (a) {
    var b = B();
    chrome.networkingPrivate.startConnect(a, function () {
        qg(b) || b.b()
    });
    return b.a
};
h.startDisconnect = function (a) {
    var b = B();
    chrome.networkingPrivate.startDisconnect(a, function () {
        qg(b) || b.b()
    });
    return b.a
};
h.verifyDestination = function (a) {
    var b = B();
    chrome.networkingPrivate.verifyDestination(a, function (a) {
        qg(b) || b.b(a)
    });
    return b.a
};
h.verifyAndEncryptData = function (a, b) {
    var c = B();
    chrome.networkingPrivate.verifyAndEncryptData(a, b, function (a) {
        qg(c) || c.b(a)
    });
    return c.a
};
var rg = function () {
    this.a = new R
}, sg = function (a, b) {
    a.a.add(b);
    return C(b, function () {
        this.a.remove(b)
    }.bind(a))
}, tg = function (a) {
    if (0 == a.a.a.a) return z();
    var b = a.a;
    a.a = new R;
    return new y(function (a) {
        Ed(b, function (c) {
            C(c, function () {
                b.remove(c) && 0 == b.a.a && a()
            });
            c.cancel()
        })
    })
};
var S = function (a, b) {
    this.h = a;
    this.g = b;
    this.f = new rg;
    this.c = new P;
    this.a = "stopped"
};
S.prototype.getState = function () {
    return this.a
};
S.prototype.b = function (a) {
    a !== this.a && (this.a = a, Q(this.c, a))
};
S.prototype.start = function () {
    switch (this.a) {
        case "stopped":
        case "stopping":
            return this.restart();
        case "starting":
        case "stoppingStartPending":
            return ug(this);
        case "started":
            return z();
        default:
            return z()
    }
};
S.prototype.restart = function () {
    switch (this.a) {
        case "starting":
        case "started":
            this.b("stoppingStartPending");
            vg(this);
            break;
        case "stopping":
            this.b("stoppingStartPending");
            break;
        case "stopped":
            this.b("starting"), wg(this)
    }
    return ug(this)
};
var ug = function (a) {
    var b = new rg;
    return C(D(new y(function (a, d) {
        sg(b, Hf(this.c, "started")).then(function () {
            a()
        });
        sg(b, Hf(this.c, "stopped")).then(function () {
            d()
        })
    }.bind(a)), function (a) {
        a instanceof E && this.stop();
        throw a;
    }, a), function () {
        tg(b)
    })
};
S.prototype.stop = function () {
    if ("stopped" === this.a) return z();
    var a = this.a;
    this.b("stopping");
    "starting" !== a && "started" !== a || vg(this);
    return Hf(this.c, "stopped")
};
var U = function (a, b) {
    if ("starting" === a.a || "started" === a.a) return sg(a.f, b), b;
    b.cancel();
    return Mb(new E)
}, xg = function (a) {
    return "started" === a.a ? z() : Hf(a.c, "started")
}, vg = function (a) {
    tg(a.f).then(function () {
        try {
            if (this.g) return this.g()
        } catch (b) {
        }
    }.bind(a)).then(function () {
        "stoppingStartPending" === this.a ? (this.b("starting"), wg(this)) : this.b("stopped")
    }.bind(a))
}, wg = function (a) {
    var b = null;
    try {
        b = a.h()
    } catch (c) {
        b = Mb(c)
    }
    "starting" !== a.a ? b.cancel() : D(sg(a.f, b).then(a.b.bind(a, "started")), function () {
        this.stop()
    }.bind(a))
};
var yg = function (a, b, c) {
    if (qa(a)) c && (a = wa(a, c)); else if (a && "function" == typeof a.handleEvent) a = wa(a.handleEvent, a); else throw Error("Invalid listener argument");
    return 2147483647 < Number(b) ? -1 : k.setTimeout(a, b || 0)
}, V = function (a) {
    var b = null;
    return D(new y(function (c, d) {
        b = yg(function () {
            c(void 0)
        }, a);
        -1 == b && d(Error("Failed to schedule timer."))
    }), function (a) {
        k.clearTimeout(b);
        throw a;
    })
};
var Og = function (a) {
        zg || (zg = new L("SetupStart.ShowDevice", Ag, "WiFiSwitching.ConnectHotSpot", Bg, "WiFiSwitching.ReconnectWiFi", Cg, "CodeConfirmation.Request", Dg, "DeviceConfig.Request", Eg, "DeviceConfig.Response", Fg, "WiFiConfig.Show", Gg, "WiFiConfig.UpdateNetworks", Hg, "WiFiConfig.Connect", Ig, "WiFiConfig.Retry", Jg, "Devices.Show", Kg, "Devices.UserAction", Lg, "DeviceSettings.Show", Mg, "DeviceSettings.Apply", Ng), "Error Handshake.Request Handshake.Response Handshake.UiVersionNotSupported OfflineUiReady SetupSessionTakeoverConfirmed SetSimpleState ModalDialog.Request ModalDialog.Response ShowGenericSetupError DeviceDiscovery.ShowScanner DeviceDiscovery.NotFound SetupStart.Proceed SetupStart.TosAccepted WiFiSwitching.Proceed WiFiSwitching.RetryConnection BadDeviceAck CodeConfirmation.Response AudioConfirmation.PromptUser AudioConfirmation.UserAction WiFiConfig.ErrorAck OtaUpdate.Pending OtaUpdate.Done OtaUpdate.Proceed DeviceSettings.Reboot DeviceSettings.FactoryReset DeviceSettings.ForgetWiFi DeviceSettings.Exit RestartSetup GoToDeviceList DetectCountry.Request DetectCountry.Response Offers.Show Offers.Scan Offers.ScanResults Offers.Redeem Offers.AnalyticsEvent".split(" ").forEach(function (a) {
            zg.set(a,
                function (a) {
                    return z(a)
                })
        }));
        return zg.get(a.type)(a).then(function (a) {
            return JSON.stringify(a)
        })
    }, zg = null, Ag = function (a) {
        return F(a.deviceName).then(function (b) {
            b = new nc(a.state, a.deviceType, b);
            b.otherDevicesExist = a.otherDevicesExist;
            b.analyticsOptIn = a.analyticsOptIn;
            return b
        })
    }, Bg = function (a) {
        return A([F(a.deviceName), F(a.ssid)]).then(function (b) {
            return new qc(a.state, b[0], b[1])
        })
    }, Cg = function (a) {
        return F(a.ssid).then(function (b) {
            return new rc(a.state, b)
        })
    }, Dg = function (a) {
        return A(a.code.map(F)).then(function (a) {
            return new tc(a)
        })
    },
    Eg = function (a) {
        return F(a.name).then(function (b) {
            return new zc(a.deviceType, b, a.country)
        })
    }, Fg = function (a) {
        return F(a.name).then(function (b) {
            return {requestId: a.responseTo, name: b, a: a.country}
        })
    }, Pg = function (a) {
        return A([a.id ? F(a.id) : null, F(a.ssid)]).then(function (b) {
            var c = ia(b);
            b = c.next().value;
            c = c.next().value;
            return new Cc(b, c, a.security)
        })
    }, Gg = function (a) {
        return A([A(a.networks.map(Pg)), a.selectedNetwork ? Pg(a.selectedNetwork) : null]).then(function (b) {
            var c = ia(b);
            b = c.next().value;
            c = c.next().value;
            return new Dc(a.state, a.deviceType, b, c)
        })
    }, Hg = function (a) {
        return A(a.networks.map(Pg)).then(function (a) {
            return new Ec(a)
        })
    }, Ig = function (a) {
        return Pg(a.network).then(function (a) {
            return new Fc(a, "********")
        })
    }, Jg = function (a) {
        return Pg(a.network).then(function (a) {
            return new Gc(a)
        })
    }, Qg = function (a) {
        return A([F(a.id), F(a.displayName)]).then(function (b) {
            var c = ia(b);
            b = c.next().value;
            c = c.next().value;
            var d = Za(a);
            d.id = b;
            d.displayName = c;
            return d
        })
    }, Kg = function (a) {
        return A([A(a.devices.map(Qg)), a.deviceName ?
            F(a.deviceName) : void 0]).then(function (a) {
            var b = ia(a);
            a = b.next().value;
            b = b.next().value;
            return new Mc(a, b)
        })
    }, Lg = function (a) {
        return Qg(a.device).then(function (b) {
            return new Nc(b, a.action)
        })
    }, Mg = function (a) {
        return A([F(a.name), F(a.ssid || ""), F(a.macAddress), F(a.ipAddress)]).then(function (b) {
            var c = ia(b);
            b = c.next().value;
            var d = c.next().value, e = c.next().value;
            c = c.next().value;
            return new Rc(a.state, a.features, {
                deviceType: a.deviceType,
                name: b,
                ssid: a.ssid ? d : null,
                timeZoneId: a.timeZoneId,
                supportedTimeZones: a.supportedTimeZones,
                timeFormat: a.timeFormat,
                localeId: a.localeId,
                supportedLocales: a.supportedLocales,
                statsOptIn: a.statsOptIn,
                firmwareVersion: a.firmwareVersion,
                countryCode: a.countryCode,
                macAddress: e,
                ipAddress: c
            })
        })
    }, Ng = function (a) {
        return F(a.name).then(function (b) {
            var c = new Sc(a);
            c.name = b;
            return c
        })
    };
var Rg = function () {
    this.a = {};
    this.b = {};
    this.c = new R
};
Rg.prototype.sendMessage = function (a) {
    a.responseTo ? this.c.contains(a.responseTo) && (this.c.remove(a.responseTo), Sg(this, a)) : Sg(this, a)
};
Rg.prototype.sendRequest = function (a, b) {
    var c = B();
    this.a[a.requestId] = {I: c, Da: b ? setTimeout(wa(this.i, this, a.requestId), b) : null};
    Sg(this, a);
    return c.a
};
Rg.prototype.i = function (a) {
    a in this.a && (this.a[a].I.a.cancel(), delete this.a[a])
};
Rg.prototype.addListener = function (a, b) {
    var c = this.b[a];
    c || (c = this.b[a] = new R);
    c.add(b)
};
var Tg = function (a, b) {
    var c = B(), d = wa(function (a) {
        c.b(a)
    }, a);
    a.addListener(b, d);
    return C(c.a, function () {
        this.removeListener(b, d)
    }.bind(a))
};
Rg.prototype.removeListener = function (a, b) {
    (a = this.b[a]) && a.remove(b)
};
var Ug = function (a, b) {
    if (b.requestId) a.c.add(b.requestId); else if (b.responseTo) {
        var c = a.a[b.responseTo];
        c && (delete a.a[b.responseTo], null !== c.Da && clearTimeout(c.Da), b instanceof ac ? c.I.c(b) : c.I.b(b))
    }
    var d = a.b[b.type];
    d && d.u().forEach(function (a) {
        d.contains(a) && a(b)
    })
};
var Vg = function (a, b, c, d, e) {
    Rg.call(this);
    this.f = "object" === typeof b ? b : null;
    this.j = "function" === typeof b ? b : null;
    this.h = c;
    this.m = d || q;
    this.g = e || function (a) {
        return z(JSON.stringify(a))
    };
    a.addEventListener("message", this.l.bind(this))
};
t(Vg, Rg);
Vg.prototype.l = function (a) {
    a.origin === this.h ? (this.g(a.data), Ug(this, a.data)) : this.m()
};
var Sg = function (a, b) {
    a.g(b);
    a.f = a.f || a.j();
    a.f.postMessage(b, a.h)
};
var Wg = function (a, b, c, d) {
    this.f = new P;
    this.h = new S(c, d);
    this.c = a;
    this.B = b + "/v6";
    this.w = b;
    this.g = []
}, Xg = function () {
    N.call(this, "redirect")
};
t(Xg, N);
Wg.prototype.start = function () {
    return this.h.start().then(this.s.bind(this))
};
Wg.prototype.stop = function () {
    return this.h.stop()
};
Wg.prototype.j = function (a) {
    0 <= za(this.g, a) || this.g.push(a)
};
var Yg = function (a) {
    var b = a.localStorage.getItem("castApp.uiOrigin") || "https://castappui.google.com";
    Wg.call(this, a, b, this.m.bind(this), this.l.bind(this));
    this.a = this.b = null;
    this.i = [["newwindow", this.v.bind(this)], ["loadredirect", this.o.bind(this)]]
};
t(Yg, Wg);
var Zg = ["exit", "loadabort", "unresponsive"];
Yg.prototype.s = function () {
    return this.a
};
var ah = function (a) {
    var b = setInterval(function () {
        document.activeElement === this.b ? clearInterval(b) : this.b.focus()
    }.bind(a), 20);
    window.addEventListener("focus", a.b.focus.bind(a.b), !0)
};
Yg.prototype.m = function () {
    var a = this, b = B(), c = b.c.bind(b), d = a.c.document.querySelector("#cast-app-ui");
    d || (d = a.c.document.createElement("webview"), d.setAttribute("id", "cast-app-ui"), d.setAttribute("src", a.B));
    Zg.forEach(function (a) {
        d.addEventListener(a, c)
    });
    var e = function () {
        var c = d.contentWindow;
        a.b = d;
        a.a = new Vg(a.c, c, a.w, function () {
            Q(a.f, new N("originViolation"))
        }, Og);
        b.b();
        ah(a)
    };
    d.addEventListener("contentload", e);
    C(b.a, function () {
        Zg.forEach(function (a) {
            d.removeEventListener(a, c)
        });
        d.removeEventListener("contentload",
            e)
    });
    a.i.forEach(function (a) {
        d.addEventListener.apply(d, a)
    });
    d.parentElement || a.c.document.body.appendChild(d);
    a.b = d;
    return b.a
};
Yg.prototype.l = function () {
    this.a = null;
    if (this.b && this.b.parentElement) {
        var a = this.b;
        this.b = null;
        a.parentElement.removeChild(a);
        this.i.forEach(function (b) {
            a.removeEventListener.apply(a, b)
        })
    }
    return z()
};
Yg.prototype.o = function (a) {
    Q(this.f, new Xg(a.newUrl, a.oldUrl))
};
Yg.prototype.v = function (a) {
    var b = a.targetUrl, c = a.windowOpenDisposition, d = ae(b), e = d.c, f = d.f;
    d = "https" === e && ("www.google.com" === f || "support.google.com" === f || "chromecast.com" === f) || "http" === e && vd(f) && 8008 === d.h && "/setup/NOTICE.html.gz" === d.b;
    !d && 0 <= za(this.g, b) && (d = !0);
    e = "new_foreground_tab" === c;
    d && (e || "new_background_tab" === c) && chrome.tabs.create({url: b, active: e});
    a.window.discard()
};
var bh = function (a, b, c, d, e, f, g, l, p, u, T) {
    this.b = b;
    this.g = c;
    this.f = a.localStorage;
    this.l = d;
    this.c = e;
    this.m = p;
    this.j = f;
    this.reload = g;
    this.i = l;
    this.h = u;
    this.a = T
};
var ch = function (a) {
    this.a = this.b = this.c = a
};
ch.prototype.reset = function () {
    this.a = this.b = this.c
};
var dh = function (a) {
    a.a = Math.min(6E4, 2 * a.a);
    a.b = Math.min(6E4, a.a + 0)
};
var eh = function (a, b) {
    this.type = "cast_app";
    this.originId = window["castApp.eventPage.Message.OriginID"] || void 0;
    this.subtype = a;
    this.devices = b;
    this.logRecord = this.deviceJustSetUp = void 0
};
r("castApp.eventPage.Message", eh);
eh.DeviceData = function (a, b, c) {
    this.ipAddress = a;
    this.appId = b;
    this.sessionId = c
};
var fh = function (a, b, c, d) {
    this.ipAddress = a;
    this.name = b;
    this.udn = c;
    this.modelName = d
};
eh.DeviceJustSetUp = fh;
var gh = function () {
};
eh.DeviceCapabilities = gh;
eh.LogRecord = function (a, b, c, d) {
    this.levelValue = a;
    this.msg = b;
    this.loggerName = c;
    this.time = d
};
var jh = function (a) {
    a.devices || a.deviceJustSetUp ? A([a.devices ? hh(a.devices) : void 0, a.deviceJustSetUp ? ih(a.deviceJustSetUp) : void 0]).then(function (b) {
        var c = ia(b);
        b = c.next().value;
        c = c.next().value;
        var d = Za(a);
        d.devices = b;
        d.deviceJustSetUp = c;
        return JSON.stringify(d)
    }) : z(JSON.stringify(a))
}, hh = function (a) {
    return A(a.map(function (a) {
        return F(a.ipAddress).then(function (b) {
            var c = Za(a);
            c.ipAddress = b;
            return c
        })
    }))
}, ih = function (a) {
    return A([F(a.ipAddress), F(a.name), F(a.udn)]).then(function (b) {
        var c = ia(b);
        b =
            c.next().value;
        var d = c.next().value;
        c = c.next().value;
        b = new fh(b, d, c, a.modelName);
        a.capabilities && (b.capabilities = a.capabilities);
        return b
    })
};
var kh = function () {
    P.call(this)
};
t(kh, P);
var lh = function (a) {
    N.call(this, a.subtype);
    this.msg = a
};
t(lh, N);
var mh = function () {
    this.b = new ch(100);
    this.f = null;
    P.call(this)
};
t(mh, kh);
var nh = null;
mh.prototype.start = function () {
    var a = this;
    nh || (chrome.runtime.onMessage.addListener(this.h.bind(this)), nh = D(C(new y(function (b, c) {
        chrome.runtime.getBackgroundPage(function () {
            chrome.runtime.lastError ? c(new Nf(chrome.runtime.lastError.message)) : (window["castApp.eventPage.Message.OriginID"] = Qa(), a.a(), Hf(a, "serviceReady").then(function () {
                b()
            }, c))
        })
    }), function () {
        clearTimeout(a.f)
    }), function (a) {
        throw a;
    }));
    return nh
};
mh.prototype.a = function () {
    oh("serviceCheck");
    this.f = setTimeout(this.a.bind(this), this.b.b);
    dh(this.b)
};
mh.prototype.sendMessage = function (a) {
    return this.start().then(function () {
        oh(a)
    })
};
var oh = function (a) {
    a = ra(a) ? a : new eh(a);
    "logRecord" !== a.subtype && jh(a);
    chrome.runtime.sendMessage(a)
}, ph = function (a) {
    a.sendMessage("startDeviceMonitor")
};
mh.prototype.h = function (a) {
    "object" === typeof a && "cast_app" === a.type && "logRecord" !== a.subtype && (jh(a), Q(this, new lh(a)));
    return !1
};
var qh = function (a) {
    return (a = a.match(/^\w{2,3}([-_]|$)/)) ? a[0].replace(/[_-]/g, "") : ""
}, rh = function (a) {
    return (a = a.match(/[-_]([a-zA-Z]{2}|\d{3})([-_]|$)/)) ? a[0].replace(/[_-]/g, "") : ""
};
var sh = w("Firefox"), th = cb() || w("iPod"), uh = w("iPad"),
    vh = w("Android") && !(bb() || w("Firefox") || w("Opera") || w("Silk")), wh = bb(),
    xh = w("Safari") && !(bb() || w("Coast") || w("Opera") || w("Edge") || w("Silk") || w("Android")) && !(cb() || w("iPad") || w("iPod"));
var yh = function (a) {
    return (a = a.exec(Ta)) ? a[1] : ""
}, zh = function () {
    if (sh) return yh(/Firefox\/([0-9.]+)/);
    if (hb || ib || gb) return qb;
    if (wh) return cb() || w("iPad") || w("iPod") ? yh(/CriOS\/([0-9.]+)/) : yh(/Chrome\/([0-9.]+)/);
    if (xh && !(cb() || w("iPad") || w("iPod"))) return yh(/Version\/([0-9.]+)/);
    if (th || uh) {
        var a = /Version\/(\S+).*Mobile\/(\S+)/.exec(Ta);
        if (a) return a[1] + "." + a[2]
    } else if (vh) return (a = yh(/Android\s+([0-9.]+)/)) ? a : yh(/Version\/([0-9.]+)/);
    return ""
}();
var Ah = null, Bh = null, Dh = function (a) {
    var b = [];
    Ch(a, function (a) {
        b.push(a)
    });
    return b
}, Ch = function (a, b) {
    function c(b) {
        for (; d < a.length;) {
            var c = a.charAt(d++), e = Bh[c];
            if (null != e) return e;
            if (!/^[\s\xa0]*$/.test(c)) throw Error("Unknown base64 encoding at char: " + c);
        }
        return b
    }

    Eh();
    for (var d = 0; ;) {
        var e = c(-1), f = c(0), g = c(64), l = c(64);
        if (64 === l && -1 === e) break;
        b(e << 2 | f >> 4);
        64 != g && (b(f << 4 & 240 | g >> 2), 64 != l && b(g << 6 & 192 | l))
    }
}, Eh = function () {
    if (!Ah) {
        Ah = {};
        Bh = {};
        for (var a = 0; 65 > a; a++) Ah[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),
            Bh[Ah[a]] = a, 62 <= a && (Bh["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)] = a)
    }
};
var Fh = function () {
    this.b = -1
};
var Gh = function () {
    this.b = 64;
    this.a = [];
    this.h = [];
    this.i = [];
    this.f = [];
    this.f[0] = 128;
    for (var a = 1; a < this.b; ++a) this.f[a] = 0;
    this.g = this.c = 0;
    this.reset()
};
t(Gh, Fh);
Gh.prototype.reset = function () {
    this.a[0] = 1732584193;
    this.a[1] = 4023233417;
    this.a[2] = 2562383102;
    this.a[3] = 271733878;
    this.a[4] = 3285377520;
    this.g = this.c = 0
};
var Hh = function (a, b, c) {
    c || (c = 0);
    var d = a.i;
    if (n(b)) for (var e = 0; 16 > e; e++) d[e] = b.charCodeAt(c) << 24 | b.charCodeAt(c + 1) << 16 | b.charCodeAt(c + 2) << 8 | b.charCodeAt(c + 3), c += 4; else for (e = 0; 16 > e; e++) d[e] = b[c] << 24 | b[c + 1] << 16 | b[c + 2] << 8 | b[c + 3], c += 4;
    for (e = 16; 80 > e; e++) {
        var f = d[e - 3] ^ d[e - 8] ^ d[e - 14] ^ d[e - 16];
        d[e] = (f << 1 | f >>> 31) & 4294967295
    }
    b = a.a[0];
    c = a.a[1];
    var g = a.a[2], l = a.a[3], p = a.a[4];
    for (e = 0; 80 > e; e++) {
        if (40 > e) if (20 > e) {
            f = l ^ c & (g ^ l);
            var u = 1518500249
        } else f = c ^ g ^ l, u = 1859775393; else 60 > e ? (f = c & g | l & (c | g), u = 2400959708) : (f = c ^ g ^
            l, u = 3395469782);
        f = (b << 5 | b >>> 27) + f + p + u + d[e] & 4294967295;
        p = l;
        l = g;
        g = (c << 30 | c >>> 2) & 4294967295;
        c = b;
        b = f
    }
    a.a[0] = a.a[0] + b & 4294967295;
    a.a[1] = a.a[1] + c & 4294967295;
    a.a[2] = a.a[2] + g & 4294967295;
    a.a[3] = a.a[3] + l & 4294967295;
    a.a[4] = a.a[4] + p & 4294967295
};
Gh.prototype.update = function (a, b) {
    if (null != a) {
        m(b) || (b = a.length);
        for (var c = b - this.b, d = 0, e = this.h, f = this.c; d < b;) {
            if (0 == f) for (; d <= c;) Hh(this, a, d), d += this.b;
            if (n(a)) for (; d < b;) {
                if (e[f] = a.charCodeAt(d), ++f, ++d, f == this.b) {
                    Hh(this, e);
                    f = 0;
                    break
                }
            } else for (; d < b;) if (e[f] = a[d], ++f, ++d, f == this.b) {
                Hh(this, e);
                f = 0;
                break
            }
        }
        this.c = f;
        this.g += b
    }
};
var Ih = function (a, b) {
        if (b + 1 >= a.length) return null;
        if (!(a[b + 1] & 128)) return {length: a[b + 1], ka: 1};
        var c = a[b + 1] & 127;
        if (b + c + 1 >= a.length || 2 < c) return null;
        for (var d = 0, e = 2; e <= c + 1; e++) d = d << 8 | a[b + e];
        return {length: d, ka: c + 1}
    }, Jh = function (a) {
        var b = [{action: "step", code: 48, optional: !1}, {action: "step", code: 48, optional: !1}, {
            action: "skip",
            code: 160,
            optional: !0
        }, {action: "skip", code: 2, optional: !1}, {action: "skip", code: 48, optional: !1}, {
            action: "skip",
            code: 48,
            optional: !1
        }, {action: "skip", code: 48, optional: !1}, {
            action: "skip",
            code: 48, optional: !1
        }, {action: "return", code: 48, optional: !1}], c = 0, d = -1;
        if (65535 < a.length) return null;
        for (; b.length;) {
            var e = b.shift();
            d++;
            if (a[c] != e.code) {
                if (e.optional) continue;
                break
            }
            var f = Ih(a, c);
            if (!f) break;
            var g = c + f.length + f.ka;
            if (g >= a.length) break;
            switch (e.action) {
                case "step":
                    c += f.ka + 1;
                    continue;
                case "skip":
                    c = g + 1;
                    continue;
                case "return":
                    return La(a, c, g + 1);
                default:
                    return null
            }
        }
        return null
    }, Kh = function (a) {
        for (var b = a.length, c = 0, d = 0; d < b - 1; d++) c += a[d];
        c = (a[b - 1] + 16 * c) % 24;
        a = 65 + c;
        73 <= a && a++;
        79 <= a && a++;
        return String.fromCharCode(a)
    },
    Lh = function (a) {
        return String.fromCharCode(50 + a[a.length - 1] % 8)
    }, Mh = function (a, b) {
        for (var c = [], d = 0; 4 > d; d++) c[d] = a[b + d] ^ a[16 + d];
        return c
    };
var Nh = function (a) {
    this.a = a
}, Oh = function (a, b, c, d) {
    if (!a.f(d)) return Mb();
    var e = a.b(d.bssid);
    if (!e || !a.c(c)) return Mb();
    a = b.verifyDestination(e);
    D(a, function () {
    });
    return a.then(function (a) {
        if (!a) return Mb();
        a = new Le((new Date).getTime(), e);
        var b = e.certificate.replace(/[\r\n]/g, "");
        b = b.replace("-----BEGIN CERTIFICATE-----", "");
        b = b.replace("-----END CERTIFICATE-----", "");
        try {
            var c = Dh(b)
        } catch ($g) {
            c = null
        }
        if (c) if (b = Jh(c)) {
            c = new Gh;
            c.update(b);
            b = [];
            var d = 8 * c.g;
            56 > c.c ? c.update(c.f, 56 - c.c) : c.update(c.f, c.b -
                (c.c - 56));
            for (var f = c.b - 1; 56 <= f; f--) c.h[f] = d & 255, d /= 256;
            Hh(c, c.h);
            for (f = d = 0; 5 > f; f++) for (var T = 24; 0 <= T; T -= 8) b[d] = c.a[f] >> T & 255, ++d;
            b ? (c = [], c[0] = Kh(Mh(b, 0)), c[1] = Lh(Mh(b, 4)), c[2] = Kh(Mh(b, 8)), c[3] = Lh(Mh(b, 12))) : c = null
        } else c = null; else c = null;
        if (!c) return Mb();
        a.pin = c;
        return a
    })
}, Ph = function (a) {
    this.a = a
};
t(Ph, Nh);
Ph.prototype.f = function (a) {
    return a.ssid === this.a.name
};
Ph.prototype.c = function () {
    return !0
};
Ph.prototype.b = function (a) {
    var b = this.a, c = {};
    if (!(b.public_key && b.ssdp_udn && b.name && b.sign && b.sign.certificate && b.sign.nonce && b.sign.signed_data)) return null;
    c.certificate = b.sign.certificate;
    c.publicKey = b.public_key;
    c.nonce = b.sign.nonce;
    c.signedData = b.sign.signed_data;
    c.deviceSerial = b.ssdp_udn;
    c.deviceSsid = b.name;
    c.deviceBssid = a;
    return c
};
var Qh = function (a) {
    this.a = a
};
t(Qh, Nh);
Qh.prototype.f = function (a) {
    var b = this.a.hotspot_bssid.toLowerCase();
    return a.ssid === this.a.name && a.bssid.toLowerCase() === b
};
Qh.prototype.c = function (a) {
    return !(!this.a.sign || this.a.sign.nonce !== a)
};
Qh.prototype.b = function () {
    var a = this.a, b = {};
    if (!(a.public_key && a.ssdp_udn && a.name && a.sign && a.sign.certificate && a.sign.nonce && a.sign.signed_data && a.hotspot_bssid)) return null;
    b.certificate = a.sign.certificate;
    b.publicKey = a.public_key;
    b.nonce = a.sign.nonce;
    b.signedData = a.sign.signed_data;
    b.deviceSerial = a.ssdp_udn;
    b.deviceSsid = a.name;
    b.deviceBssid = a.hotspot_bssid;
    a.sign.intermediate_certs && 0 <= Sa(zh, 42) && (b.intermediateCertificates = a.sign.intermediate_certs);
    return b
};
var Rh = function (a) {
    this.a = a
};
t(Rh, Nh);
Rh.prototype.f = function (a) {
    var b = this.a;
    if (!b.name || !b.device_info || !b.device_info.hotspot_bssid) return !1;
    var c = b.name;
    b.setup && b.setup.ssid_suffix && "c" !== b.setup.ssid_suffix && (c += "." + b.setup.ssid_suffix);
    return a.ssid === c && Yf(b.device_info.hotspot_bssid, a.bssid)
};
Rh.prototype.c = function (a) {
    return !(!this.a.sign || this.a.sign.nonce !== a)
};
Rh.prototype.b = function () {
    var a = this.a, b = {};
    if (!(a.name && a.device_info && a.device_info.public_key && a.device_info.ssdp_udn && a.device_info.hotspot_bssid && a.sign && a.sign.certificate && a.sign.nonce && a.sign.signed_data)) return null;
    b.certificate = a.sign.certificate;
    b.publicKey = a.device_info.public_key;
    b.nonce = a.sign.nonce;
    b.signedData = a.sign.signed_data;
    b.deviceSerial = a.device_info.ssdp_udn;
    b.deviceSsid = a.name;
    b.deviceBssid = a.device_info.hotspot_bssid;
    a.sign.intermediate_certs && 0 <= Sa(zh, 42) && (b.intermediateCertificates =
        a.sign.intermediate_certs);
    return b
};
var Sh = function () {
};
Sh.prototype.a = null;
var Uh = function (a) {
    var b;
    (b = a.a) || (b = {}, Th(a) && (b[0] = !0, b[1] = !0), b = a.a = b);
    return b
};
var Vh, Wh = function () {
};
t(Wh, Sh);
var Xh = function (a) {
    return (a = Th(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}, Th = function (a) {
    if (!a.b && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
        for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0; c < b.length; c++) {
            var d = b[c];
            try {
                return new ActiveXObject(d), a.b = d
            } catch (e) {
            }
        }
        throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
    }
    return a.b
};
Vh = new Wh;
var Yh = function (a) {
    P.call(this);
    this.headers = new L;
    this.w = a || null;
    this.b = !1;
    this.v = this.a = null;
    this.H = "";
    this.h = 0;
    this.f = this.G = this.m = this.B = !1;
    this.l = 0;
    this.o = null;
    this.j = "";
    this.R = this.i = !1
};
t(Yh, P);
var Zh = /^https?$/i, $h = ["POST", "PUT"];
Yh.prototype.wa = function () {
    return this.j
};
Yh.prototype.xa = function () {
    return this.i
};
Yh.prototype.send = function (a, b, c, d) {
    if (this.a) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.H + "; newUri=" + a);
    b = b ? b.toUpperCase() : "GET";
    this.H = a;
    this.h = 0;
    this.B = !1;
    this.b = !0;
    this.a = this.w ? Xh(this.w) : Xh(Vh);
    this.v = this.w ? Uh(this.w) : Uh(Vh);
    this.a.onreadystatechange = wa(this.oa, this);
    try {
        this.G = !0, this.a.open(b, String(a), !0), this.G = !1
    } catch (f) {
        ai(this);
        return
    }
    a = c || "";
    var e = new L(this.headers);
    d && Ld(d, function (a, b) {
        e.set(b, a)
    });
    d = Da(e.A(), bi);
    c = k.FormData && a instanceof k.FormData;
    !(0 <= za($h, b)) || d || c || e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    e.forEach(function (a, b) {
        this.a.setRequestHeader(b, a)
    }, this);
    this.j && (this.a.responseType = this.j);
    "withCredentials" in this.a && this.a.withCredentials !== this.i && (this.a.withCredentials = this.i);
    try {
        ci(this), 0 < this.l && ((this.R = di(this.a)) ? (this.a.timeout = this.l, this.a.ontimeout = wa(this.X, this)) : this.o = yg(this.X, this.l, this)), this.m = !0, this.a.send(a), this.m = !1
    } catch (f) {
        ai(this)
    }
};
var di = function (a) {
    return hb && rb(9) && ma(a.timeout) && m(a.ontimeout)
}, bi = function (a) {
    return "content-type" == a.toLowerCase()
};
Yh.prototype.X = function () {
    "undefined" != typeof la && this.a && (this.h = 8, Q(this, "timeout"), this.abort(8))
};
var ai = function (a) {
    a.b = !1;
    a.a && (a.f = !0, a.a.abort(), a.f = !1);
    a.h = 5;
    ei(a);
    fi(a)
}, ei = function (a) {
    a.B || (a.B = !0, Q(a, "complete"), Q(a, "error"))
};
Yh.prototype.abort = function (a) {
    this.a && this.b && (this.b = !1, this.f = !0, this.a.abort(), this.f = !1, this.h = a || 7, Q(this, "complete"), Q(this, "abort"), fi(this))
};
Yh.prototype.C = function () {
    this.a && (this.b && (this.b = !1, this.f = !0, this.a.abort(), this.f = !1), fi(this, !0));
    Yh.F.C.call(this)
};
Yh.prototype.oa = function () {
    this.g || (this.G || this.m || this.f ? gi(this) : this.Ia())
};
Yh.prototype.Ia = function () {
    gi(this)
};
var gi = function (a) {
    if (a.b && "undefined" != typeof la && (!a.v[1] || 4 != hi(a) || 2 != a.getStatus())) if (a.m && 4 == hi(a)) yg(a.oa, 0, a); else if (Q(a, "readystatechange"), 4 == hi(a)) {
        a.b = !1;
        try {
            ii(a) ? (Q(a, "complete"), Q(a, "success")) : (a.h = 6, a.getStatus(), ei(a))
        } finally {
            fi(a)
        }
    }
}, fi = function (a, b) {
    if (a.a) {
        ci(a);
        var c = a.a, d = a.v[0] ? q : null;
        a.a = null;
        a.v = null;
        b || Q(a, "ready");
        try {
            c.onreadystatechange = d
        } catch (e) {
        }
    }
}, ci = function (a) {
    a.a && a.R && (a.a.ontimeout = null);
    a.o && (k.clearTimeout(a.o), a.o = null)
}, ii = function (a) {
    var b = a.getStatus();
    a:switch (b) {
        case 200:
        case 201:
        case 202:
        case 204:
        case 206:
        case 304:
        case 1223:
            var c = !0;
            break a;
        default:
            c = !1
    }
    if (!c) {
        if (b = 0 === b) a = String(a.H).match(Md)[1] || null, !a && k.self && k.self.location && (a = k.self.location.protocol, a = a.substr(0, a.length - 1)), b = !Zh.test(a ? a.toLowerCase() : "");
        c = b
    }
    return c
}, hi = function (a) {
    return a.a ? a.a.readyState : 0
};
Yh.prototype.getStatus = function () {
    try {
        return 2 < hi(this) ? this.a.status : -1
    } catch (a) {
        return -1
    }
};
Yh.prototype.ca = function () {
    try {
        return this.a ? this.a.responseText : ""
    } catch (a) {
        return ""
    }
};
Yh.prototype.getResponseHeader = function (a) {
    if (this.a && 4 == hi(this)) return a = this.a.getResponseHeader(a), null === a ? void 0 : a
};
var ji = function (a) {
    var b = {};
    a = (a.a && 4 == hi(a) ? a.a.getAllResponseHeaders() || "" : "").split("\r\n");
    for (var c = 0; c < a.length; c++) if (!/^[\s\xa0]*$/.test(a[c])) {
        var d = 2;
        for (var e = a[c].split(": "), f = []; 0 < d && e.length;) f.push(e.shift()), d--;
        e.length && f.push(e.join(": "));
        d = f;
        b[d[0]] = b[d[0]] ? b[d[0]] + (", " + d[1]) : d[1]
    }
    return b
};
var ki = function (a) {
    Ze.call(this);
    this.b = a;
    this.a = {}
};
t(ki, Ze);
var li = [];
ki.prototype.listen = function (a, b, c, d) {
    oa(b) || (b && (li[0] = b.toString()), b = li);
    for (var e = 0; e < b.length; e++) {
        var f = tf(a, b[e], c || this.handleEvent, d || !1, this.b || this);
        if (!f) break;
        this.a[f.key] = f
    }
    return this
};
var mi = function (a, b, c, d, e, f) {
    if (oa(c)) for (var g = 0; g < c.length; g++) mi(a, b, c[g], d, e, f); else d = d || a.handleEvent, e = ra(e) ? !!e.capture : !!e, f = f || a.b || a, d = uf(d), e = !!e, c = gf(b) ? of(b.c, String(c), d, e, f) : b ? (b = wf(b)) ? of(b, c, d, e, f) : null : null, c && (Bf(c), delete a.a[c.key])
};
ki.prototype.removeAll = function () {
    Wa(this.a, function (a, b) {
        this.a.hasOwnProperty(b) && Bf(a)
    }, this);
    this.a = {}
};
ki.prototype.C = function () {
    ki.F.C.call(this);
    this.removeAll()
};
ki.prototype.handleEvent = function () {
    throw Error("EventHandler.handleEvent not implemented");
};
var ni = function () {
    this.b = [];
    this.a = []
}, oi = function (a) {
    0 == a.b.length && (a.b = a.a, a.b.reverse(), a.a = []);
    return a.b.pop()
}, pi = function (a) {
    return a.b.length + a.a.length
};
ni.prototype.clear = function () {
    this.b = [];
    this.a = []
};
ni.prototype.contains = function (a) {
    return 0 <= za(this.b, a) || 0 <= za(this.a, a)
};
ni.prototype.remove = function (a) {
    var b = this.b;
    var c = Aa(b, a);
    0 <= c ? (Fa(b, c), b = !0) : b = !1;
    return b || Ga(this.a, a)
};
ni.prototype.u = function () {
    for (var a = [], b = this.b.length - 1; 0 <= b; --b) a.push(this.b[b]);
    var c = this.a.length;
    for (b = 0; b < c; ++b) a.push(this.a[b]);
    return a
};
var qi = function (a, b) {
    Ze.call(this);
    this.m = a || 0;
    this.c = b || 10;
    if (this.m > this.c) throw Error("[goog.structs.Pool] Min can not be greater than max");
    this.a = new ni;
    this.b = new R;
    this.delay = 0;
    this.i = null;
    this.Y()
};
t(qi, Ze);
qi.prototype.ba = function () {
    var a = ya();
    if (!(null != this.i && a - this.i < this.delay)) {
        for (var b; 0 < pi(this.a) && (b = oi(this.a), !this.j(b));) this.Y();
        !b && ri(this) < this.c && (b = this.h());
        b && (this.i = a, this.b.add(b));
        return b
    }
};
qi.prototype.S = function (a) {
    this.b.remove(a);
    this.j(a) && ri(this) < this.c ? this.a.a.push(a) : si(a)
};
qi.prototype.Y = function () {
    for (var a = this.a; ri(this) < this.m;) {
        var b = this.h();
        a.a.push(b)
    }
    for (; ri(this) > this.c && 0 < pi(this.a);) si(oi(a))
};
qi.prototype.h = function () {
    return {}
};
var si = function (a) {
    if ("function" == typeof a.aa) a.aa(); else for (var b in a) a[b] = null
};
qi.prototype.j = function (a) {
    return "function" == typeof a.Ka ? a.Ka() : !0
};
qi.prototype.contains = function (a) {
    return this.a.contains(a) || this.b.contains(a)
};
var ri = function (a) {
    return pi(a.a) + a.b.a.a
};
qi.prototype.C = function () {
    qi.F.C.call(this);
    if (0 < this.b.a.a) throw Error("[goog.structs.Pool] Objects not released");
    delete this.b;
    for (var a = this.a; 0 != a.b.length || 0 != a.a.length;) si(oi(a));
    delete this.a
};
var ti = function (a, b) {
    this.a = a;
    this.b = b
};
var ui = function (a) {
    this.a = [];
    if (a) a:{
        if (a instanceof ui) {
            var b = a.A();
            a = a.u();
            if (0 >= this.a.length) {
                for (var c = this.a, d = 0; d < b.length; d++) c.push(new ti(b[d], a[d]));
                break a
            }
        } else b = Ya(a), a = Xa(a);
        for (d = 0; d < b.length; d++) vi(this, b[d], a[d])
    }
}, vi = function (a, b, c) {
    var d = a.a;
    d.push(new ti(b, c));
    b = d.length - 1;
    a = a.a;
    for (c = a[b]; 0 < b;) if (d = b - 1 >> 1, a[d].a > c.a) a[b] = a[d], b = d; else break;
    a[b] = c
};
ui.prototype.remove = function () {
    var a = this.a, b = a.length, c = a[0];
    if (!(0 >= b)) {
        if (1 == b) Ea(a); else {
            a[0] = a.pop();
            a = 0;
            b = this.a;
            for (var d = b.length, e = b[a]; a < d >> 1;) {
                var f = 2 * a + 1, g = 2 * a + 2;
                f = g < d && b[g].a < b[f].a ? g : f;
                if (b[f].a > e.a) break;
                b[a] = b[f];
                a = f
            }
            b[a] = e
        }
        return c.b
    }
};
ui.prototype.u = function () {
    for (var a = this.a, b = [], c = a.length, d = 0; d < c; d++) b.push(a[d].b);
    return b
};
ui.prototype.A = function () {
    for (var a = this.a, b = [], c = a.length, d = 0; d < c; d++) b.push(a[d].a);
    return b
};
ui.prototype.clear = function () {
    Ea(this.a)
};
var wi = function () {
    ui.call(this)
};
t(wi, ui);
var xi = function (a, b) {
    this.l = void 0;
    this.f = new wi;
    qi.call(this, a, b)
};
t(xi, qi);
h = xi.prototype;
h.ba = function (a, b) {
    if (!a) return (a = xi.F.ba.call(this)) && this.delay && (this.l = k.setTimeout(wa(this.da, this), this.delay)), a;
    vi(this.f, m(b) ? b : 100, a);
    this.da()
};
h.da = function () {
    for (var a = this.f; 0 < a.a.length;) {
        var b = this.ba();
        if (b) a.remove().apply(this, [b]); else break
    }
};
h.S = function (a) {
    xi.F.S.call(this, a);
    this.da()
};
h.Y = function () {
    xi.F.Y.call(this);
    this.da()
};
h.C = function () {
    xi.F.C.call(this);
    k.clearTimeout(this.l);
    this.f.clear();
    this.f = null
};
var yi = function (a, b, c, d) {
    this.o = a;
    this.v = !!d;
    xi.call(this, b, c)
};
t(yi, xi);
yi.prototype.h = function () {
    var a = new Yh, b = this.o;
    b && b.forEach(function (b, d) {
        a.headers.set(d, b)
    });
    this.v && (a.i = !0);
    return a
};
yi.prototype.j = function (a) {
    return !a.g && !a.a
};
var zi = function (a, b, c, d, e, f) {
    P.call(this);
    this.i = m(a) ? a : 1;
    this.h = m(e) ? Math.max(0, e) : 0;
    this.j = !!f;
    this.b = new yi(b, c, d, f);
    this.a = new L;
    this.f = new ki(this)
};
t(zi, P);
var Ai = "ready complete success error abort timeout".split(" ");
zi.prototype.send = function (a, b, c, d, e, f, g, l, p, u) {
    if (this.a.get(a)) throw Error("[goog.net.XhrManager] ID in use");
    b = new Bi(b, wa(this.m, this, a), c, d, e, g, m(l) ? l : this.i, p, m(u) ? u : this.j);
    this.a.set(a, b);
    a = wa(this.l, this, a);
    this.b.ba(a, f);
    return b
};
zi.prototype.abort = function (a, b) {
    var c = this.a.get(a);
    if (c) {
        var d = c.ha;
        c.pa = !0;
        b && (d && (mi(this.f, d, Ai, c.na), sf(d, "ready", function () {
            var a = this.b;
            a.b.remove(d) && a.S(d)
        }, !1, this)), this.a.remove(a));
        d && d.abort()
    }
};
zi.prototype.l = function (a, b) {
    var c = this.a.get(a);
    c && !c.ha ? (this.f.listen(b, Ai, c.na), b.l = Math.max(0, this.h), b.j = c.wa(), b.i = c.xa(), c.ha = b, Q(this, new Ci("ready", this, a, b)), Di(this, a, b), c.pa && b.abort()) : (a = this.b, a.b.remove(b) && a.S(b))
};
zi.prototype.m = function (a, b) {
    var c = b.target;
    switch (b.type) {
        case "ready":
            Di(this, a, c);
            break;
        case "complete":
            a:{
                var d = this.a.get(a);
                if (7 == c.h || ii(c) || d.Z > d.ja) if (Q(this, new Ci("complete", this, a, c)), d && (d.ua = !0, d.ta)) {
                    a = d.ta.call(c, b);
                    break a
                }
                a = null
            }
            return a;
        case "success":
            Q(this, new Ci("success", this, a, c));
            break;
        case "timeout":
        case "error":
            b = this.a.get(a);
            b.Z > b.ja && Q(this, new Ci("error", this, a, c));
            break;
        case "abort":
            Q(this, new Ci("abort", this, a, c))
    }
    return null
};
var Di = function (a, b, c) {
    var d = a.a.get(b);
    !d || d.ua || d.Z > d.ja ? (d && (mi(a.f, c, Ai, d.na), a.a.remove(b)), a = a.b, a.b.remove(c) && a.S(c)) : (d.Z++, c.send(d.cb, d.pb, d.getContent(), d.bb))
};
zi.prototype.C = function () {
    zi.F.C.call(this);
    this.b.aa();
    this.b = null;
    this.f.aa();
    this.f = null;
    this.a.clear();
    this.a = null
};
var Ci = function (a, b, c, d) {
    N.call(this, a, b);
    this.id = c;
    this.ha = d
};
t(Ci, N);
var Bi = function (a, b, c, d, e, f, g, l, p) {
    this.cb = a;
    this.pb = c || "GET";
    this.a = d;
    this.bb = e || null;
    this.ja = m(g) ? g : 1;
    this.Z = 0;
    this.pa = this.ua = !1;
    this.na = b;
    this.ta = f;
    this.b = l || "";
    this.c = !!p;
    this.ha = null
};
Bi.prototype.getContent = function () {
    return this.a
};
Bi.prototype.xa = function () {
    return this.c
};
Bi.prototype.wa = function () {
    return this.b
};
var Ei = function () {
}, Fi = function () {
    v.call(this)
};
t(Fi, v);
Fi.prototype.name = "httpStatus";
var Gi = function () {
    v.call(this)
};
t(Gi, v);
Gi.prototype.name = "httpResponseParsing";
var Hi = function (a, b) {
    return a.request(b).then(function (a) {
        if ((a.getResponseHeader("content-type") || "").toLowerCase().startsWith("application/json")) {
            a = a.ca();
            a.startsWith(")]}'") && (a = a.substr(4));
            try {
                return JSON.parse(a)
            } catch (d) {
            }
        }
        throw new Gi;
    })
}, Ii = function () {
    this.a = new L;
    this.b = 0
};
t(Ii, Ei);
var Ji = function (a) {
    this.b = a.ca();
    this.a = {};
    Wa(ji(a), function (a, c) {
        this.a[c.toLowerCase()] = a
    }, this)
};
Ji.prototype.ca = function () {
    return this.b
};
Ji.prototype.getResponseHeader = function (a) {
    return this.a[a.toLowerCase()] || void 0
};
Ii.prototype.request = function (a) {
    var b = B(), c = a.timeout || 1E4, d = this.a.get(c);
    d || (d = new zi, d.h = Math.max(0, c), this.a.set(c, d));
    c = a.method || "GET";
    d.send(this.b++, a.url, c, a.content, a.headers, 0, function (a) {
        a = a.target;
        ii(a) ? b.b(new Ji(a)) : b.c(new Fi(a.getStatus()))
    }, a.D);
    return b.a
};
var Ki = function (a, b, c) {
    var d = b.read();
    this.a = d.eurekaInfoState && d.eurekaInfoState.setupApiVersion || null;
    this.g = new Od("http://" + d.deviceIpAddress + ":8008");
    this.b = a;
    this.c = b;
    c ? (a = qh(c), c = (c = rh(c)) ? "en" == a ? a + "-" + c + ", en;q=0.8" : a + "-" + c + ", " + a + ";q=0.8, en;q=0.5" : a + ", en;q=0.5") : c = null;
    this.f = c
}, Li = function (a) {
    var b = new Je(a);
    return {
        read: function () {
            return b
        }, write: function (a) {
            b = a
        }
    }
}, Oi = function (a, b, c) {
    var d = new Ki(a, b, c);
    return d.a ? z(d) : Mi(d, {options: Ni()}).then(function () {
        return d
    })
}, Qi = function (a, b,
                  c, d, e) {
    var f = new Ki(a, b, e), g = b.read();
    if (g.eurekaInfoState && g.eurekaInfoState.ethernetConnected) return z(f);
    if (g.verificationState) {
        if (Yf(g.verificationState.verificationProperties.deviceBssid, d.bssid)) return z(f);
        g = new Je(g.deviceIpAddress);
        b.write(g)
    }
    a = {};
    var l = a.nonce = Qa();
    a.options = Ni().concat(["name", "sign", "device_info.public_key", "device_info.hotspot_bssid"]);
    return Mi(f, a).then(function (a) {
        a:switch (a.version) {
            case 3:
                a = Oh(new Ph(a), c, l, d);
                break a;
            case 4:
            case 5:
            case 6:
                a = Oh(new Qh(a), c, l, d);
                break a;
            default:
                a = Oh(new Rh(a), c, l, d)
        }
        return a
    }).then(function (a) {
        g = b.read();
        g.verificationState = a;
        b.write(g);
        return f
    }, function (a) {
        If(a);
        if (a instanceof Fi) throw a;
        throw new Pi;
    })
}, Ri = function () {
    v.call(this)
};
t(Ri, v);
Ri.prototype.name = "setupApiVersionError";
var Pi = function () {
    v.call(this)
};
t(Pi, v);
Pi.prototype.name = "deviceVerificationError";
var Ni = function () {
    return "version name setup.setup_state net.ethernet_connected net.ip_address device_info.ssdp_udn device_info.model_name device_info.capabilities setup.ssid_suffix setup.tos_accepted".split(" ")
};
new R(["now", "fdr", "ota"]);
Ki.prototype.i = new R([3, 4, 5, 6, 7, 8]);
Ki.prototype.h = new L(3, function (a) {
    x(a, "locale", "en-US");
    return a
}, 4, le, 5, le, 6, le, 7, re);
Ki.prototype.getState = function () {
    return this.c.read()
};
var Si = function (a) {
    return a.c.read().eurekaInfoState
}, Ui = function (a, b) {
    return a.b.request({
        url: Ti(a, "/setup/connect_wifi"),
        method: "POST",
        headers: {"Content-Type": "application/json"},
        content: JSON.stringify(b),
        D: 0
    })
}, Mi = function (a, b) {
    var c = new Od(a.g);
    c.b = "/setup/eureka_info";
    if (b) {
        var d = [];
        if (b.options) {
            var e = new R(b.options), f = e.contains("sign");
            if (null === a.a || 7 > a.a) {
                var g = new R(["sign", "detail"]), l = new R;
                g = Kd(g);
                for (var p = 0; p < g.length; p++) {
                    var u = g[p];
                    e.contains(u) && l.add(u)
                }
                l.a.a && d.push("options=" +
                    l.u().join(","))
            }
            e.a.a && (null === a.a || 7 <= a.a) && d.push("params=" + e.u().join(","))
        }
        b.nonce && d.push("nonce=" + b.nonce);
        d.length && Sd(c, d.join("&"), void 0)
    }
    b = void 0;
    a.f && (b = {"Accept-Language": a.f});
    return Hi(a.b, {
        url: c.toString(),
        method: "GET",
        headers: b,
        timeout: f ? 4E4 : 1E4,
        D: f ? 1 : 2
    }).then(a.j.bind(a)).then(a.l.bind(a))
};
Ki.prototype.j = function (a) {
    if (!a.version) return a;
    if (!this.i.contains(a.version)) throw new Ri(a.version);
    this.a = parseInt(a.version, 10);
    var b = this.h.get(this.a, null);
    !b && 7 <= this.a && (b = re);
    return b(a)
};
Ki.prototype.l = function (a) {
    var b = this.c.read(), c = b.eurekaInfoState, d = {};
    this.a && (d.setupApiVersion = this.a);
    if (3 <= this.a && 6 >= this.a) d.name = a.name, d.setupState = a.setup_state, d.ssdpUdn = a.ssdp_udn, 3 === this.a ? (d.ethernetConnected = !1, d.tosAccepted = !0, d.modelName = "Chromecast") : (d.ethernetConnected = 6 === this.a ? !!a.ethernet_connected : !1, d.tosAccepted = !!a.tos_accepted, a.detail && (d.modelName = a.detail.model_name)), a.ip_address && (d.connectedIpAddress = a.ip_address), d.deviceType = "c"; else if (7 <= this.a) {
        a.name && (d.name =
            a.name);
        if (a.setup && (void 0 !== a.setup.setup_state && (d.setupState = a.setup.setup_state), 63 === d.setupState ? d.tosAccepted = !1 : void 0 !== a.setup.tos_accepted && (d.tosAccepted = a.setup.tos_accepted), void 0 !== a.setup.ssid_suffix)) {
            var e = bg(a.setup.ssid_suffix);
            d.deviceType = e ? e.type : "c"
        }
        a.device_info && (a.device_info.model_name && (d.modelName = a.device_info.model_name), a.device_info.ssdp_udn && (d.ssdpUdn = a.device_info.ssdp_udn), a.device_info.capabilities && (d.features = cg(d.deviceType || c && c.deviceType || "b", a.device_info.capabilities)));
        a.net && (void 0 !== a.net.ethernet_connected && (d.ethernetConnected = a.net.ethernet_connected), a.net.ip_address && (d.connectedIpAddress = a.net.ip_address))
    }
    c ? ab(c, d) : b.eurekaInfoState = d;
    b.eurekaInfoState.features || (b.eurekaInfoState.features = cg(d.deviceType || c && c.deviceType || "b"));
    this.c.write(b);
    return a
};
var Vi = function (a) {
    return Hi(a.b, {url: Ti(a, "/setup/offer"), method: "GET", timeout: 1E4, D: 2}).then(function (a) {
        return a
    })
}, Wi = function (a, b) {
    a.b.request({
        url: Ti(a, "/setup/reboot"),
        method: "POST",
        headers: {"Content-Type": "application/json"},
        content: JSON.stringify(new ye(b)),
        timeout: 1E4,
        D: 2
    })
}, Xi = function (a) {
    var b = new Be;
    b.immediate = !0;
    return Hi(a.b, {
        url: Ti(a, "/setup/save_wifi"),
        method: "POST",
        headers: {"Content-Type": "application/json"},
        content: JSON.stringify(b),
        timeout: 2E4,
        D: 1
    }).then(function (a) {
        var b = this.c.read();
        b.eurekaInfoState && b.eurekaInfoState.setupState !== a.setup_state && (b.eurekaInfoState.setupState = a.setup_state, this.c.write(b));
        return a
    }.bind(a))
}, Yi = function (a) {
    return Hi(a.b, {url: Ti(a, "/setup/scan_results"), method: "GET", timeout: 1E4, D: 5}).then(function (a) {
        return a
    })
}, Zi = function (a) {
    return a.b.request({url: Ti(a, "/setup/scan_wifi"), method: "POST", D: 0})
}, $i = function (a, b) {
    return a.b.request({
        url: Ti(a, "/setup/set_eureka_info"),
        method: "POST",
        headers: {"Content-Type": "application/json"},
        content: JSON.stringify(b),
        D: 0
    })
}, aj = function (a) {
    return Hi(a.b, {url: Ti(a, "/setup/supported_locales"), method: "GET", timeout: 1E4, D: 2}).then(function (a) {
        return a
    })
}, bj = function (a) {
    return Hi(a.b, {url: Ti(a, "/setup/supported_timezones"), method: "GET", timeout: 1E4, D: 2}).then(function (a) {
        return a
    })
}, Ti = function (a, b) {
    a = new Od(a.g);
    a.b = b;
    return a.toString()
};
var cj = function (a, b) {
    this.networks = new L;
    this.f = new S(this.Ya.bind(this), this.Xa.bind(this));
    this.b = a;
    this.g = [];
    for (var c = 1, d = arguments.length; c < d; ++c) this.g.push(arguments[c]);
    this.c = new R;
    this.h = this.fb.bind(this);
    this.i = this.gb.bind(this);
    this.a = new P
}, dj = function (a, b) {
    N.call(this, a);
    this.properties = b
};
t(dj, N);
var ej = function () {
};
ej.prototype.c = function () {
    return !0
};
ej.prototype.a = function () {
    return !0
};
var fj = function (a) {
    this.b = a || null
};
t(fj, ej);
fj.prototype.c = function (a) {
    return !(!a.WiFi || a.WiFi.Security && "None" !== a.WiFi.Security)
};
fj.prototype.a = function (a) {
    return this.b ? !(!a.WiFi || a.WiFi.BSSID !== this.b) : ag(a)
};
var gj = function (a) {
    var b = [];
    ["GUID", "Name"].forEach(function (c) {
        c in a && (b.push(" " + c + ": "), b.push(F("" + a[c])))
    });
    ["ConnectionState", "Type"].forEach(function (c) {
        c in a && b.push(" " + c + ": " + a[c])
    });
    a.WiFi && (["SSID", "BSSID"].forEach(function (c) {
        c in a.WiFi && (b.push(" WiFi." + c + ": "), b.push(F("" + a.WiFi[c])))
    }), ["Security", "SignalStrength"].forEach(function (c) {
        b.push(" WiFi." + c + ": " + a.WiFi[c])
    }));
    return z("")
};
h = cj.prototype;
h.start = function () {
    return this.f.start()
};
h.stop = function () {
    return this.f.stop()
};
h.Ya = function () {
    var a = this.b;
    a.onNetworkListChanged.addListener(this.h);
    a.onNetworksChanged.addListener(this.i);
    return U(this.f, this.b.getNetworks({networkType: "WiFi", visible: !0})).then(this.ob.bind(this))
};
h.ob = function (a) {
    return A(a.filter(function (a) {
        if (hj(this, a)) return !0;
        this.c.add(a.GUID);
        return !1
    }.bind(this)).map(function (a) {
        return this.ma(a.GUID)
    }.bind(this)))
};
h.Xa = function () {
    this.b.onNetworkListChanged.removeListener(this.h);
    this.b.onNetworksChanged.removeListener(this.i);
    this.networks.clear();
    this.c.clear();
    return z()
};
h.fb = function (a) {
    var b = new R(this.networks.A());
    a = Mf(new R(a), this.c);
    Ed(Mf(a, b), this.ma.bind(this));
    Ed(Mf(b, a), this.Aa.bind(this))
};
h.Aa = function (a) {
    var b = this.networks.get(a);
    this.networks.remove(a);
    a = "Connected" === b.ConnectionState;
    b.ConnectionState = "NotConnected";
    a && ij(this, "disconnected", b);
    ij(this, "removed", b)
};
h.gb = function (a) {
    a = Mf(new R(a), this.c);
    Ed(a, this.ma.bind(this))
};
h.ma = function (a) {
    var b = this, c = B();
    C(D(jj(b, a).then(function (c) {
        var d = b.networks.get(a), f = !(!d || "Connected" !== d.ConnectionState);
        b.networks.set(c.GUID, c);
        var g = "Connected" === c.ConnectionState;
        d || ij(b, "added", c);
        !f && g ? ij(b, "connected", c) : f && !g && ij(b, "disconnected", c)
    }), function () {
        Jd(b.networks, a) && b.Aa(a)
    }), function () {
        c.b()
    });
    return c.a
};
var ij = function (a, b, c) {
    gj.bind(a, c);
    Q(a.a, new dj(b, c))
}, jj = function (a, b) {
    return D(U(a.f, a.b.getProperties(b)), function (a) {
        a instanceof E || F(b);
        throw a;
    }.bind(a)).then(function (a) {
        if (!kj(this, a)) throw this.c.add(b), new E;
        return a
    }.bind(a))
}, hj = function (a, b) {
    return !Da(a.g, function (a) {
        return !a.c(b)
    })
}, kj = function (a, b) {
    return !Da(a.g, function (a) {
        return !a.a(b)
    })
};
var lj = function (a) {
    this.b = a;
    this.a = null
}, mj = new L(1, 2E4, 3, 6E4, 2, 6E4), oj = function (a, b) {
    var c = Se(a).filter(nj);
    c.push(b);
    Te(a, c)
}, nj = function (a) {
    var b = mj.get(a.type, Infinity);
    return ya() - a.time < b
}, pj = function (a) {
    this.b = a
};
t(pj, ej);
pj.prototype.a = function (a) {
    a = a.WiFi && a.WiFi.BSSID;
    var b = qj(this.b, a, 2);
    b && F(a);
    return !b
};
var rj = function (a) {
    a.a = new L;
    for (var b = Se(a.b), c = [], d = 0, e = b.length; d < e; ++d) {
        var f = b[d];
        if (nj(f)) {
            c.push(f);
            Jd(a.a, f.type) || a.a.set(f.type, new L);
            var g = a.a.get(f.type);
            g && g.get(f.deviceId, -Infinity) < f.time && g.set(f.deviceId, f.time)
        }
    }
    c.length !== b.length && Te(a.b, c)
}, qj = function (a, b, c) {
    a.a || rj(a);
    a = a.a.get(c, null);
    if (null === a || !Jd(a, b)) return !1;
    b = a.get(b) + mj.get(c, 0);
    return ya() < b
}, sj = function (a, b) {
    (a = qj(a, b, 1) || qj(a, b, 3)) && F(b);
    return a
};
var tj = function (a, b, c, d) {
    P.call(this);
    this.m = new lj(d.localStorage);
    this.f = new cj(a, new fj, new pj(this.m));
    this.h = b;
    this.G = a;
    this.B = c;
    this.l = d
};
t(tj, P);
var uj = function (a) {
    N.call(this, "devices");
    this.devices = a
};
t(uj, N);
var vj = function (a, b, c, d) {
    tj.call(this, a, b, c, d);
    this.a = null;
    this.j = 0;
    this.b = new L;
    this.i = new ch(5E3);
    this.v = this.H.bind(this);
    this.w = this.kb.bind(this);
    this.o = new S(this.Wa.bind(this), this.Va.bind(this))
};
t(vj, tj);
var wj = function (a, b) {
    return D(Oi(a.B, Li(b)).then(function (a) {
        var c = a.getState(), e = c.eurekaInfoState;
        if (c.deviceIpAddress && e && e.name && e.ssdpUdn && void 0 !== e.ethernetConnected && void 0 !== e.tosAccepted && e.deviceType && void 0 !== e.features) return a;
        F(b);
        return Mb()
    }.bind(a)), function () {
        F(b)
    }.bind(a))
};
h = vj.prototype;
h.Wa = function () {
    this.l.document.addEventListener("visibilitychange", this.w);
    this.h.listen("devices", this.v);
    ph(this.h);
    this.j = 0;
    return this.f.start().then(this.N.bind(this))
};
h.Va = function () {
    this.l.document.removeEventListener("visibilitychange", this.w);
    O(this.h, "devices", this.v);
    this.j = 0;
    this.i = new ch(5E3);
    this.a && (this.a.cancel(), this.a = null);
    this.b.clear();
    return this.f.stop()
};
h.start = function () {
    return this.o.start()
};
h.stop = function () {
    return this.o.stop()
};
h.kb = function () {
    this.l.document.hidden ? this.a && (this.a.cancel(), this.a = null) : (this.i = new ch(5E3), this.N())
};
h.N = function () {
    this.a && this.a.cancel();
    rj(this.m);
    this.G.requestNetworkScan();
    this.j++;
    1 <= this.j && this.l.document.hidden ? this.a = null : (this.a = V(this.i.b), U(this.o, this.a).then(this.N.bind(this)), dh(this.i))
};
var xj = function (a) {
    var b = [];
    a.b.u().forEach(function (a) {
        a.U && !sj(this.m, a.ipAddress) && b.push(a)
    }.bind(a));
    Q(a, new uj(b))
};
vj.prototype.H = function (a) {
    var b = new R;
    a.msg.devices.forEach(function (a) {
        b.add(a.ipAddress);
        var c = this.b.get(a.ipAddress);
        c || (c = {ipAddress: a.ipAddress}, wj(this, a.ipAddress).then(function (b) {
            var c = this.b.get(a.ipAddress);
            c ? (c.U = b, this.b.set(a.ipAddress, c), xj(this)) : F(a.ipAddress)
        }.bind(this)));
        a.sessionId && a.appId && (c.sessionId = a.sessionId, c.appId = a.appId);
        this.b.set(a.ipAddress, c)
    }.bind(this));
    Ed(Mf(new R(this.b.A()), b), this.b.remove.bind(this.b));
    xj(this)
};
var yj = function () {
}, zj = "function" == typeof Uint8Array, Cj = function (a, b, c, d) {
    a.c = null;
    b || (b = c ? [c] : []);
    a.j = c ? String(c) : void 0;
    a.f = 0 === c ? -1 : 0;
    a.a = b;
    a:{
        if (b = a.a.length) if (--b, (c = a.a[b]) && "object" == typeof c && !oa(c) && !(zj && c instanceof Uint8Array)) {
            a.g = b - a.f;
            a.b = c;
            break a
        }
        a.g = Number.MAX_VALUE
    }
    a.i = {};
    if (d) for (b = 0; b < d.length; b++) c = d[b], c < a.g ? (c += a.f, a.a[c] = a.a[c] || Aj) : (Bj(a), a.b[c] = a.b[c] || Aj)
}, Aj = [], Bj = function (a) {
    var b = a.g + a.f;
    a.a[b] || (a.b = a.a[b] = {})
}, Dj = function (a, b) {
    if (b < a.g) {
        b += a.f;
        var c = a.a[b];
        return c ===
        Aj ? a.a[b] = [] : c
    }
    if (a.b) return c = a.b[b], c === Aj ? a.b[b] = [] : c
}, Ej = function (a, b, c) {
    b < a.g ? a.a[b + a.f] = c : (Bj(a), a.b[b] = c)
}, Fj = function (a, b, c) {
    a.c || (a.c = {});
    if (!a.c[c]) {
        if (c < a.g) {
            var d = c + a.f;
            var e = a.a[d];
            d = e === Aj ? a.a[d] = [] : e
        } else e = a.b[c], d = e === Aj ? a.b[c] = [] : e;
        e = [];
        for (var f = 0; f < d.length; f++) e[f] = new b(d[f]);
        a.c[c] = e
    }
    b = a.c[c];
    b == Aj && (b = a.c[c] = []);
    return b
}, Hj = function (a) {
    if (a.c) for (var b in a.c) {
        var c = a.c[b];
        if (oa(c)) for (var d = 0; d < c.length; d++) c[d] && Gj(c[d]); else c && Gj(c)
    }
}, Gj = function (a) {
    Hj(a);
    return a.a
};
yj.prototype.h = zj ? function () {
    var a = Uint8Array.prototype.toJSON;
    Uint8Array.prototype.toJSON = function () {
        Eh();
        for (var a = Ah, c = [], d = 0; d < this.length; d += 3) {
            var e = this[d], f = d + 1 < this.length, g = f ? this[d + 1] : 0, l = d + 2 < this.length,
                p = l ? this[d + 2] : 0, u = e >> 2;
            e = (e & 3) << 4 | g >> 4;
            g = (g & 15) << 2 | p >> 6;
            p &= 63;
            l || (p = 64, f || (g = 64));
            c.push(a[u], a[e], a[g], a[p])
        }
        return c.join("")
    };
    try {
        return JSON.stringify(this.a && Gj(this), Ij)
    } finally {
        Uint8Array.prototype.toJSON = a
    }
} : function () {
    return JSON.stringify(this.a && Gj(this), Ij)
};
var Ij = function (a, b) {
    return ma(b) && (isNaN(b) || Infinity === b || -Infinity === b) ? String(b) : b
};
yj.prototype.toString = function () {
    Hj(this);
    return this.a.toString()
};
var Jj = function (a) {
    Cj(this, a, 0, null)
};
t(Jj, yj);
var Lj = function (a) {
    Cj(this, a, "is.gsser", Kj)
};
t(Lj, yj);
var Kj = [3, 5, 13];
Lj.messageId = "is.gsser";
Lj.prototype.getTitle = function () {
    return Dj(this, 1)
};
Lj.prototype.setTitle = function (a) {
    Ej(this, 1, a)
};
var Mj = function (a) {
    Cj(this, a, 0, null)
};
t(Mj, yj);
var Nj = function (a) {
    Cj(this, a, 0, null)
};
t(Nj, yj);
var Oj = function (a, b, c) {
    this.b = a;
    this.a = c;
    this.c = "https://clients3.google.com/cast/chromecast/home/gsse?rt=j&hl=" + b
};
Oj.prototype.request = function (a) {
    var b = new Jj;
    Ej(b, 3, a);
    Ej(b, 1, "E8C28D3C");
    return this.b.request({
        url: this.c,
        method: "POST",
        content: b.h(),
        headers: {"Content-Type": "application/json"}
    }).then(function (a) {
        a = a.ca();
        a.startsWith(")]}'\n") && (a = a.slice(5));
        a = JSON.parse(a);
        a = new Lj(a[0][0]);
        var b = [], c = Dj(a, 4);
        c && b.push(c);
        (c = Fj(a, Nj, 5)) && c.forEach(function (a) {
            b.push(Dj(a, 2))
        });
        b.forEach(this.a.j.bind(this.a));
        return a
    }.bind(this))
};
var Pj = function (a) {
    this.b = a;
    this.a = new L;
    this.f = new S(this.Qa.bind(this), this.Pa.bind(this));
    this.i = this.lb.bind(this);
    this.j = this.mb.bind(this);
    this.h = this.Oa.bind(this);
    this.l = this.jb.bind(this);
    this.g = this.Na.bind(this);
    this.c = null
}, Qj = function (a) {
    this.a = a
};
Qj.prototype.T = function () {
    var a = $f(this.a.WiFi.SSID), b = new Lc("wifi:" + this.a.GUID, dg(a.type), a.name);
    b.needsSetup = !0;
    b.features = cg(a.type);
    return b
};
Qj.prototype.va = function () {
    var a = this.T();
    a = {name: a.displayName, type: Qf.a.get(a.type) || "c"};
    a.ssid = this.a.WiFi.SSID;
    a.bssid = this.a.WiFi.BSSID;
    return new Ie(a)
};
Qj.prototype.start = function () {
    return z()
};
Qj.prototype.stop = function () {
    return z()
};
var Rj = function (a, b, c, d) {
    this.j = b;
    this.a = null;
    this.c = d;
    this.m = a;
    this.h = new S(this.Ma.bind(this), this.La.bind(this));
    this.v = c;
    this.g = this.b = this.f = null;
    this.w = new Oj(a.g, a.h(), this.m.m);
    this.i = this.l.bind(this);
    this.o = this.hb.bind(this);
    this.s = this.eb.bind(this)
};
Rj.prototype.va = function () {
    var a = this.T();
    return new Ie({name: a.displayName, type: Qf.a.get(a.type) || "c", ipAddress: this.j})
};
var Sj = function (a, b) {
    if (!kg(a.a.appId) || kg(a.a.appId) && !a.f) return b;
    a.a.status && (b.sessionStatus = hg(a.a.status));
    var c = Fj(a.f, Mj, 3);
    0 < c.length && (b.backdropImageAttributions = Ca(c, function (a) {
        return Dj(a, 1)
    }.bind(a)));
    c = Fj(a.f, Nj, 5);
    0 < c.length && (b.backdropSecondaryActions = Ca(c, function (a) {
        var b = {}, c = Dj(a, 1);
        c && (b.text = c);
        (a = Dj(a, 2)) && (b.url = a);
        return b
    }.bind(a)));
    if (c = a.f.getTitle()) b.mediaTitle = c;
    var d = Dj(a.f, 2);
    d && (b.imgUrl = d);
    if (a = Dj(a.f, 4)) b.backdropPrimaryActionUrl = a;
    c || 1 !== b.backdropImageAttributions.length ||
    (b.mediaTitle = b.backdropImageAttributions[0], b.backdropImageAttributions = []);
    return b
};
h = Rj.prototype;
h.T = function () {
    var a = "ip:" + this.j, b = this.v.getState().eurekaInfoState;
    a = new Lc(a, dg(b.deviceType), b.name);
    a.features = b.features;
    a.displayName = b.name;
    a.needsSetup = b.ethernetConnected && !b.tosAccepted;
    if (a.needsSetup && !a.features.supportsSetup) a = null; else if (this.a && this.a.status !== chrome.cast.SessionStatus.STOPPED) if (kg(this.a.appId)) a = Sj(this, a); else if (a.isCasting = !0, this.a.receiver.volume && (b = this.a.receiver.volume.level, null !== b && (a.volumeLevel = b), b = this.a.receiver.volume.muted, null !== b && (a.isMuted =
            b)), this.a.status && (a.sessionStatus = hg(this.a.status)), b = this.a.appId, "85CDB22F" === b || "0F5096E8" === b) this.a.displayName && (a.mediaTitle = this.a.displayName), this.a.statusText && (a.mediaSource = this.a.statusText); else if (this.a.displayName && (a.mediaSource = this.a.displayName), b = Tj(this)) if (0 <= za(b.supportedMediaCommands, chrome.cast.media.MediaCommand.PAUSE) && (a.canPause = !0), b.playerState && (a.playerState = gg(b.playerState)), b.media && (b.media.duration && (a.mediaDuration = b.media.duration), b = b.media.metadata ||
            b.media.vb)) b.title && (a.mediaTitle = b.title), b.images && 0 < b.images.length && b.images[0].url && !b.images[0].url.endsWith(".ico") && (a.imgUrl = b.images[0].url);
    return a
};
h.qb = function () {
    if (this.g) if (!this.g.appId || !this.g.sessionId) Uj(this), this.c(); else if (!this.a || this.a.sessionId != this.g.sessionId) {
        var a = og(this.m.i, this.g.appId, this.g.sessionId);
        a.then(this.ib.bind(this));
        U(this.h, a);
        this.g = null
    }
};
h.ib = function (a) {
    a.session.status !== chrome.cast.SessionStatus.STOPPED && (this.a && Uj(this), this.a = a.session, this.b = a.context, this.a.addMediaListenerWithContext(this.b, this.o), this.a.addUpdateListenerWithContext(this.b, this.i), kg(this.a.appId) && (this.a.addMessageListenerWithContext(this.b, "urn:x-cast:com.google.cast.sse", this.s), this.a.sendMessageWithContext(this.b, "urn:x-cast:com.google.cast.sse", {
        type: "GET_STATUS",
        requestId: Math.floor(4294967295 * Math.random())
    }, q, function () {
    })), this.a.media && this.a.media.forEach(function (a) {
        a.addUpdateListenerWithContext(this.b,
            this.i)
    }.bind(this)), this.l())
};
h.eb = function (a, b) {
    "urn:x-cast:com.google.cast.sse" === a && (a = JSON.parse(b), a = this.w.request(a.backendData), a.then(function (a) {
        this.f = a;
        this.c()
    }.bind(this)), U(this.h, a))
};
h.hb = function (a) {
    this.l();
    a.addUpdateListenerWithContext(this.b, this.i)
};
h.start = function () {
    return this.h.start()
};
h.stop = function () {
    return this.h.stop()
};
h.Ma = function () {
    return z()
};
h.La = function () {
    Uj(this);
    return z()
};
var Uj = function (a) {
    a.f = null;
    a.a && (a.a.media && a.a.media.forEach(function (a) {
        a.removeUpdateListenerWithContext(this.b, this.i)
    }.bind(a)), a.a.removeUpdateListenerWithContext(a.b, a.i), a.a.removeMediaListenerWithContext(a.b, a.o), kg(a.a.appId) && a.a.removeMessageListenerWithContext(a.b, "urn:x-cast:com.google.cast.sse", a.s), a.a = null, a.b = null)
}, Tj = function (a) {
    if (!a.a || !a.a.media) return null;
    var b = null;
    a.a.media.forEach(function (a) {
        a && (b ? !b.media && a.media ? b = a : b.playerState == chrome.cast.media.PlayerState.IDLE &&
            a.playerState != chrome.cast.media.PlayerState.IDLE && (b = a) : b = a)
    }.bind(a));
    return b
};
Rj.prototype.l = function () {
    this.a.status === chrome.cast.SessionStatus.STOPPED && Uj(this);
    this.c()
};
var Vj = function (a, b) {
    if (a.a && a.b) {
        var c = Tj(a);
        c && 0 <= za(c.supportedMediaCommands, chrome.cast.media.MediaCommand.PAUSE) && (3 == b && c.playerState == chrome.cast.media.PlayerState.PAUSED ? c.playWithContext(a.b, null, a.c, function () {
        }) : 4 == b && c.playerState == chrome.cast.media.PlayerState.PLAYING && c.pauseWithContext(a.b, null, a.c, function () {
        }))
    }
}, Wj = function (a, b, c) {
    if (a.a && a.b) switch (c) {
        case 4:
        case 3:
            Vj(a, c);
            break;
        case 5:
            a.a.stopWithContext(a.b, a.c, function () {
            });
            break;
        case 6:
            a.a.setReceiverMutedWithContext(a.b, !0,
                a.c, function () {
                });
            break;
        case 7:
            a.a.setReceiverMutedWithContext(a.b, !1, a.c, function () {
            });
            break;
        case 8:
            b.volumeLevel !== a.a.receiver.volume.level && a.a.setReceiverVolumeLevelWithContext(a.b, b.volumeLevel, a.c, function () {
            })
    }
}, Xj = function (a, b) {
    if (a.id === b.id) return 0;
    if (a.needsSetup !== b.needsSetup) return a.needsSetup ? -1 : 1;
    var c = Pa(a.displayName, b.displayName);
    return 0 !== c ? c : a.id < b.id ? -1 : a.id > b.id ? 1 : 0
};
h = Pj.prototype;
h.start = function () {
    return this.f.start()
};
h.stop = function () {
    return this.f.stop()
};
h.Qa = function () {
    this.O();
    var a = this.b.a.f.a;
    a.listen("added", this.i);
    a.listen("removed", this.j);
    a = this.b.b.a.a;
    a.addListener("Devices.UserAction", this.h);
    a.addListener("DeviceDiscovery.ScanAgain", this.l);
    this.b.a.listen("devices", this.g);
    a = this.b.a;
    ph(a.h);
    a.N();
    return this.b.a.start()
};
h.Pa = function () {
    this.b.b.a.a.removeListener("Devices.UserAction", this.h);
    var a = this.b.a.f.a;
    O(a, "added", this.i);
    O(a, "removed", this.j);
    O(this.b.a, "devices", this.g);
    var b = [this.b.a.stop()];
    this.a.forEach(function (a) {
        b.push(a.stop())
    }.bind(this));
    this.a = new L;
    return A(b)
};
h.lb = function (a) {
    var b = "wifi:" + a.properties.GUID;
    a = this.a.get(b) || new Qj(a.properties);
    this.a.set(b, a);
    a.start();
    this.O()
};
h.mb = function (a) {
    a = "wifi:" + a.properties.GUID;
    var b = this.a.get(a);
    b && (b.stop(), this.a.remove(a), this.O())
};
h.Na = function (a) {
    var b = new L, c = !1;
    a.devices.forEach(function (a) {
        if (a.ipAddress) {
            var d = "ip:" + a.ipAddress, f = this.a.get(d);
            f || (f = new Rj(this.b, a.ipAddress, a.U, this.O.bind(this)), f.start(), c = !0);
            var g = f;
            a.ipAddress != g.j ? (F(a.ipAddress), F(g.j)) : (g.g = a, xg(g.h).then(g.qb.bind(g)));
            b.set(d, f);
            this.a.remove(d)
        }
    }.bind(this));
    this.a.A().forEach(function (a) {
        var c = this.a.get(a);
        c instanceof Qj && (b.set(a, c), this.a.remove(a))
    }.bind(this));
    0 < this.a.a && (c = !0);
    this.a.forEach(function (a) {
        a.stop()
    }.bind(this));
    this.a =
        b;
    c && this.O()
};
h.O = function (a) {
    var b = [];
    this.a.forEach(function (a) {
        if (a = a.T()) {
            for (var c, d = Xj || Na, g = 0, l = b.length; g < l;) {
                var p = g + l >> 1;
                var u = d(a, b[p]);
                0 < u ? g = p + 1 : (l = p, c = !u)
            }
            c = c ? g : ~g;
            0 > c && Ma(b, -(c + 1), 0, a)
        }
    });
    var c = this.b.b.a.a;
    c.sendMessage(new Mc(b, a));
    0 === b.length ? null === this.c && (this.c = U(this.f, V(3E4)).then(function () {
        this.c = null;
        var a = 0;
        this.a.forEach(function (b) {
            a += b.T() ? 1 : 0
        });
        0 === a && c.sendMessage(new G("DeviceDiscovery.NotFound"))
    }.bind(this))) : null !== this.c && (a = this.c, this.c = null, a.cancel())
};
h.Oa = function (a) {
    var b = this.a.get(a.device.id);
    if (b) switch (a.action) {
        case 1:
            a = new Ge(Qa());
            a.states = new Me(0, [new M(1)]);
            a.commonState = new He;
            a.commonState.device = b.va();
            a.commonState.pinned = !0;
            Qe(this.b.f, a);
            this.b.l(a.id);
            break;
        case 2:
            this.b.j(b.j);
            break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            Wj(b, a.device, a.action)
    } else F(a.device.id)
};
h.jb = function () {
    this.O();
    var a = this.b.a;
    ph(a.h);
    a.N()
};
var Yj = function (a, b) {
    this.c = a;
    this.i = b;
    this.b = null;
    this.j = Li(b);
    this.g = this.a = null;
    this.f = new S(this.Sa.bind(this), this.Ra.bind(this));
    this.h = new L("DeviceSettings.Apply", this.Ja.bind(this), "DeviceSettings.Reboot", this.o.bind(this), "DeviceSettings.FactoryReset", this.m.bind(this), "DeviceSettings.ForgetWiFi", this.s.bind(this), "DeviceSettings.Exit", this.l.bind(this))
};
h = Yj.prototype;
h.start = function () {
    return this.f.start()
};
h.stop = function () {
    return this.f.stop()
};
h.Sa = function () {
    return U(this.f, Oi(this.c.g, this.j)).then(function (a) {
        this.b = a;
        return A([U(this.f, Mi(a, {options: "build_info.cast_build_revision device_info.mac_address detail net.ip_address settings.country_code settings.locale settings.timezone settings.time_format opt_in.stats wifi.ssid wifi.wpa_id".split(" ")})), U(this.f, aj(a)), U(this.f, bj(a))])
    }.bind(this)).then(function (a) {
        this.nb.apply(this, a);
        var b = this.c.b.a.a;
        this.h.forEach(function (a, d) {
            b.addListener(d, a)
        });
        Zj(this, 1)
    }.bind(this))
};
h.Ra = function () {
    var a = this.c.b.a.a;
    this.h.forEach(function (b, c) {
        a.removeListener(c, b)
    });
    this.b = null;
    this.j = Li(this.i);
    this.a = null;
    return z()
};
h.nb = function (a, b, c) {
    var d = Si(this.b), e = d.setupApiVersion, f = dg(d.deviceType);
    c = c.map(function (a) {
        return new Qc(a.timezone, a.display_string, a.offset)
    });
    b = b.map(function (a) {
        return new Pc(a.locale, a.display_string)
    });
    var g = this.a = {};
    if (7 <= e) {
        e = a.wifi;
        var l = a.settings, p = a.opt_in, u = a.build_info, T = a.device_info;
        a = a.net;
        g.deviceType = f;
        g.name = d.name;
        g.ssid = !d.ethernetConnected && e.ssid || null;
        g.timeZoneId = l.timezone || null;
        g.supportedTimeZones = c;
        g.timeFormat = 1 === l.time_format ? 1 : 2;
        g.localeId = l.locale || "";
        g.supportedLocales =
            b;
        g.statsOptIn = !!p.stats;
        g.firmwareVersion = u.cast_build_revision || "";
        g.countryCode = l.country_code || null;
        g.macAddress = T.mac_address || "";
        g.ipAddress = a.ip_address;
        this.g = void 0 !== e.wpa_id ? e.wpa_id : null
    } else l = 1 === (3 < e ? a.time_format : 2) ? 1 : 2, g.deviceType = f, g.name = d.name, g.ssid = !d.ethernetConnected && a.ssid || null, g.timeZoneId = a.timezone || null, g.supportedTimeZones = c, g.timeFormat = l, g.localeId = a.locale, g.supportedLocales = b, g.statsOptIn = !!(3 < e && a.opt_in && a.opt_in.stats), g.firmwareVersion = a.build_version, g.countryCode =
        3 < e && a.location && a.location.country_code || null, g.macAddress = a.mac_address, g.ipAddress = a.ip_address, this.g = void 0 !== a.wpa_id ? a.wpa_id : null
};
h.Ja = function (a) {
    var b = this, c = Si(this.b).features.deviceSettings;
    a.timeFormat === b.a.timeFormat || c.supportsTimeFormatChange || (a.timeFormat = b.a.timeFormat);
    a.statsOptIn === b.a.statsOptIn || c.supportsDataCollectionToggle || (a.statsOptIn = b.a.statsOptIn);
    if (a.name === b.a.name && a.timeZoneId === b.a.timeZoneId && a.timeFormat === b.a.timeFormat && a.localeId === b.a.localeId && a.statsOptIn === b.a.statsOptIn) Zj(b, 1); else {
        var d = Za(b.a);
        b.a.name = a.name;
        b.a.timeZoneId = a.timeZoneId;
        b.a.timeFormat = a.timeFormat;
        b.a.localeId = a.localeId;
        b.a.statsOptIn = a.statsOptIn;
        Zj(b, 2);
        D(U(b.f, $i(b.b, ak(b, a))).then(function () {
            b.a.localeId !== d.localeId ? b.c.reload() : Zj(b, 1)
        }), function () {
            b.a = d;
            Zj(b, 3)
        })
    }
};
var ak = function (a, b) {
    var c = a.b.a;
    a = 1 === b.timeFormat ? 1 : 2;
    if (7 <= c) return c = new Fe, c.name = b.name, c.settings = new ue, b.timeZoneId && (c.settings.timezone = b.timeZoneId), c.settings.time_format = a, c.settings.locale = b.localeId, c.opt_in = new ve, c.opt_in.stats = b.statsOptIn, c;
    if (4 <= c && 6 >= c) return c = new Ee, c.name = b.name, b.timeZoneId && (c.timezone = b.timeZoneId), c.time_format = a, c.locale = b.localeId, c.opt_in = new ne, c.opt_in.stats = b.statsOptIn, c;
    a = new De;
    a.name = b.name;
    b.timeZoneId && (a.timezone = b.timeZoneId);
    a.locale = b.localeId;
    return a
}, Zj = function (a, b) {
    a.c.b.a.a.sendMessage(new Rc(b, Si(a.b).features, a.a))
};
Yj.prototype.o = function () {
    if (Si(this.b).features.deviceSettings.supportsReboot) {
        Wi(this.b, "now");
        var a = this.b.c.read().deviceIpAddress;
        oj(this.c.f, new Ne(1, ya(), a));
        this.c.c()
    }
};
Yj.prototype.m = function () {
    if (Si(this.b).features.deviceSettings.supportsFdr) {
        Wi(this.b, "fdr");
        var a = this.b.c.read().deviceIpAddress;
        oj(this.c.f, new Ne(3, ya(), a));
        this.c.c()
    }
};
Yj.prototype.s = function () {
    if (Si(this.b).features.deviceSettings.supportsForgetWiFi) {
        var a = this.b, b = this.g;
        a.b.request({
            url: Ti(a, "/setup/forget_wifi"),
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify(new we(b)),
            timeout: 1E4,
            D: 2
        });
        this.c.c()
    }
};
Yj.prototype.l = function () {
    this.c.c()
};
var bk = chrome.i18n.getMessage("3254351313955764967"), ck = chrome.i18n.getMessage("3485206350043289145");
var dk = function (a) {
    this.c = window;
    this.a = a;
    this.b = new P;
    this.f = new S(this.h.bind(this), this.g.bind(this))
};
dk.prototype.start = function () {
    return this.f.start()
};
dk.prototype.h = function () {
    var a = B();
    ek(this.c, "start");
    fk(this);
    var b = U(this.f, V(18E4)).then(function () {
        ek(this.c, "load-failed");
        Q(this.b, "loadTimedOut");
        a.c(new Gf)
    }.bind(this));
    U(this.f, this.a.start()).then(function () {
        var a = this.a.a;
        U(this.f, Tg(a, "OfflineUiReady")).then(function () {
            Q(this.b, "offlineUiReady")
        }.bind(this));
        Q(this.b, "waitingForHandshake");
        return U(this.f, a.sendRequest(new cc))
    }.bind(this)).then(function (c) {
        switch (c.type) {
            case "Handshake.Response":
                ek(this.c, "hosting-embedded-ui");
                Q(this.b,
                    "embeddedUiReady");
                b.cancel();
                a.b();
                break;
            case "Handshake.UiVersionNotSupported":
                ek(this.c, "update-required");
                Q(this.b, "updateRequired");
                a.c(c);
                break;
            default:
                ek(this.c, "load-failed"), Q(this.b, "loadFailed")
        }
    }.bind(this));
    return a.a
};
var fk = function (a) {
    var b = a.c.document;
    [["#load-failed-message", bk], ["#update-required-message", ck]].forEach(function (a) {
        var c = b.querySelector(a[0]);
        c && (c.textContent = a[1])
    })
};
dk.prototype.g = function () {
    return this.a.stop()
};
var ek = function (a, b) {
    (a = a.document && a.document.body || null) && a.setAttribute("class", b)
};
var gk = function (a, b, c, d, e) {
    this.b = b;
    this.a = c;
    this.f = d;
    this.g = a.localStorage;
    this.c = e
}, hk = function (a, b) {
    this.b = a;
    this.l = b;
    this.m = m(void 0) ? void 0 : 3E4;
    this.c = new L;
    this.h = !0;
    this.g = !1;
    this.a = new R;
    this.j = new lj(a.g);
    this.f = new S(this.ab.bind(this), this.$a.bind(this));
    this.i = this.Za.bind(this)
};
h = hk.prototype;
h.start = function () {
    return this.f.start()
};
h.stop = function () {
    if (!this.g) {
        var a = new Zc(this.l, this.c.u(), !0);
        this.b.b.a.a.sendMessage(a);
        this.g = !0
    }
    return this.f.stop()
};
h.ab = function () {
    this.b.a.listen("devices", this.i);
    ph(this.b.a);
    U(this.f, V(this.m)).then(function () {
        this.h = !1;
        this.Ca()
    }.bind(this));
    return z()
};
h.$a = function () {
    O(this.b.a, "devices", this.i);
    this.c = new L;
    this.h = !0;
    this.g = !1;
    this.a = new R;
    return z()
};
h.Za = function (a) {
    var b = this;
    rj(this.j);
    (a.msg.devices || []).forEach(function (a) {
        var c = a.ipAddress;
        Jd(b.c, c) || b.a.contains(c) || sj(b.j, c) || (b.a.add(c), C(D(Oi(b.b.f, Li(c)).then(function (a) {
            if (7 > a.a) throw new E;
            return U(b.f, Vi(a)).then(function (d) {
                var e = Si(a);
                d = new Yc(d.token, e.name, dg(e.deviceType), e.ssdpUdn);
                b.c.set(c, d);
                b.a.remove(c);
                b.g || (d = new Zc(b.l, b.c.u(), !b.h && 0 === b.a.a.a), b.g = d.scanComplete, b.b.b.a.a.sendMessage(d))
            })
        }), function () {
            b.a.remove(c)
        }), b.Ca.bind(b)))
    })
};
h.Ca = function () {
    this.h || 0 !== this.a.a.a || this.stop()
};
var W = function (a, b, c) {
    this.b = new S(b || function () {
        return z()
    }, c || void 0);
    this.a = a
};
W.prototype.start = function () {
    return this.b.start()
};
W.prototype.stop = function () {
    return this.b.stop()
};
var X = function (a) {
    return a.a.j.a.a
};
var kk = function (a, b, c, d) {
    var e = ik, f = jk, g = window.location.reload.bind(window.location), l = chrome.i18n.getUILanguage, p = new mh;
    this.window = a;
    this.b = b;
    this.g = c;
    this.a = a.localStorage;
    this.l = a.sessionStorage;
    this.c = d;
    this.j = e;
    this.f = f;
    this.m = g;
    this.h = l;
    this.i = p
};
var lk = function (a) {
    W.call(this, a, this.l.bind(this), this.j.bind(this));
    this.c = this.f = null;
    this.g = this.i.bind(this);
    this.m = this.h.bind(this)
};
t(lk, W);
lk.prototype.l = function () {
    return U(this.b, mk(this.a)).then(function (a) {
        this.f = a;
        X(this).addListener("AudioConfirmation.UserAction", this.g);
        X(this).sendMessage(new wc(1));
        this.c = 3;
        this.h()
    }.bind(this))
};
lk.prototype.j = function () {
    this.c = this.f = null;
    X(this).removeListener("AudioConfirmation.UserAction", this.g);
    return z()
};
lk.prototype.h = function () {
    if (null !== this.c) {
        var a = this.b;
        var b = this.f;
        var c = this.c;
        b = b.b.request({
            url: Ti(b, "/setup/play_sound"),
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify(new xe(c)),
            timeout: 1E4,
            D: 2
        });
        U(a, b);
        this.c = 3;
        U(this.b, V(1 === this.c ? 3E3 : 1900)).then(this.m)
    }
};
lk.prototype.i = function (a) {
    var b = null;
    switch (a.action) {
        case 1:
            this.c = 1;
            b = 2;
            break;
        case 2:
            Y(this.a, 12);
            nk(this.a, new M(5));
            break;
        case 3:
            b = 3;
            break;
        case 4:
            Y(this.a, 13), a = this.a, Re(a.a.a, a.b), a.a.f()
    }
    b && X(this).sendMessage(new wc(b))
};
var ok = function (a) {
    W.call(this, a, this.c.bind(this), null)
};
t(ok, W);
ok.prototype.c = function () {
    var a = this;
    U(this.b, X(this).sendRequest(new tc((this.a.b.setupApiClientState || null).verificationState.pin))).then(function (b) {
        b.confirmed ? (Y(a.a, 10), nk(a.a, new M(5))) : (Y(a.a, 11), U(a.b, X(a).sendRequest(new hc(1))).then(function () {
            var b = a.a;
            Re(b.a.a, b.b);
            b.a.f()
        }))
    });
    return z()
};
var pk = function (a, b) {
    this.i = a;
    this.a = new cj(a, new fj(b));
    this.b = "connected";
    this.c = null;
    this.f = new S(this.Ua.bind(this), this.Ta.bind(this));
    this.g = new P
}, qk = ["added", "removed", "connected", "disconnected"];
h = pk.prototype;
h.start = function () {
    return this.f.start()
};
h.stop = function () {
    return this.f.stop()
};
h.getState = function () {
    return this.b
};
h.Ua = function () {
    var a = this;
    return a.a.start().then(function () {
        a.h();
        qk.forEach(function (b) {
            a.a.a.listen(b, a.h, !0, a)
        })
    })
};
h.Ta = function () {
    this.b = "connected";
    this.c = null;
    if (!this.a) return z();
    var a = this.a;
    this.a = null;
    qk.forEach(function (b) {
        O(a.a, b, this.h, !0, this)
    }.bind(this));
    return a.stop()
};
var rk = function (a, b) {
    a.b !== b && (a.b = b, Q(a.g, new N(b)))
};
pk.prototype.h = function () {
    if ("failed" !== this.b) {
        var a = null;
        1 === this.a.networks.a && (a = this.a.networks.u()[0]);
        if (!a) "connected" === this.b && (sk(this), rk(this, "disconnected")); else if ("Connected" === a.ConnectionState) this.c && (a = this.c, this.c = null, a.cancel()), rk(this, "connected"); else if ("connected" === this.b || "disconnected" === this.b) sk(this), rk(this, "reconnecting"), tk(this, a.GUID)
    }
};
var tk = function (a, b) {
    D(U(a.f, a.i.startConnect(b)), function () {
        rk(this, "failed");
        this.a.stop()
    }.bind(a))
}, sk = function (a) {
    a.c || (a.c = U(a.f, V(9E4)).then(function () {
        rk(this, "failed");
        this.a.stop()
    }.bind(a)))
};
var uk = function (a) {
    W.call(this, a, this.s.bind(this), this.m.bind(this));
    this.f = null;
    this.o = 0;
    this.h = this.g = this.j = this.c = null
};
t(uk, W);
var vk = ["connected", "disconnected", "reconnecting", "failed"];
uk.prototype.s = function () {
    var a = this, b = Z(a.a);
    X(a).sendMessage(ig(b.connectWiFi, wk(a.a)));
    a.g = new pk(a.a.a.b, b.connectedHotSpotBssid);
    vk.forEach(function (b) {
        a.g.g.listen(b, a.i, !0, a)
    });
    return A([U(a.b, a.g.start()), U(a.b, mk(a.a)).then(function (b) {
        a.f = b;
        xk(a)
    })]).then(a.v.bind(a))
};
uk.prototype.m = function () {
    var a = this;
    yk(a);
    zk(a);
    if (!a.g) return z();
    var b = a.g;
    a.g = null;
    vk.forEach(function (c) {
        O(b.g, c, a.i, !0, a)
    });
    return b.stop()
};
var xk = function (a, b) {
    a.c || (a.c = D(V(b || 0).then(function () {
        ++a.o;
        a.c = Mi(a.f, {options: ["version", "setup.setup_state", "net.ip_address"]});
        return a.c
    }).then(a.l.bind(a)), function (a) {
        If(a)
    }).then(function () {
        a.c = null;
        xk(a, 3E3)
    }))
}, zk = function (a) {
    if (a.c) {
        var b = a.c;
        a.c = null;
        b.cancel()
    }
};
uk.prototype.l = function () {
    var a = Si(this.f).setupState;
    if (a !== this.j) switch (this.j = a, a) {
        case 31:
            return Ak(this, 2), Mb(new E);
        case 21:
        case 41:
        case 10:
        case 11:
            return Ak(this, 1), Mb(new E);
        case 60:
        case 61:
        case 51:
            return Bk(this), Mb(new E)
    }
};
var Bk = function (a) {
    yk(a);
    Y(a.a, 19);
    var b = Si(a.f);
    C(D(U(a.b, a.a.a.c.a()).then(function (c) {
        c = jg(b.setupApiVersion, Z(a.a).deviceName, 3 !== c);
        return U(a.b, $i(a.f, c))
    }), function (a) {
        If(a)
    }).then(function () {
        var c = Z(a.a), d = c.connectedHotSpotBssid;
        oj(a.a.a.a, new Ne(2, ya(), d));
        delete c.connectedHotSpotBssid;
        Ck(a.a, c);
        if (60 !== b.setupState && 4 <= b.setupApiVersion) return D(U(a.b, Xi(a.f)), q)
    }), function () {
        nk(a.a, new M(8))
    })
}, Ak = function (a, b) {
    yk(a);
    Y(a.a, 2 === b ? 17 : 18);
    var c = Z(a.a);
    c.connectWiFi.a = b;
    Ck(a.a, c);
    nk(a.a,
        new M(6))
};
uk.prototype.i = function (a) {
    switch (a.type) {
        case "connected":
            xk(this);
            break;
        case "disconnected":
        case "reconnecting":
            zk(this);
            break;
        case "failed":
            Ak(this, 1)
    }
};
uk.prototype.v = function () {
    clearTimeout(this.h);
    this.h = setTimeout(function () {
        Ak(this, 1)
    }.bind(this), 9E4)
};
var yk = function (a) {
    clearTimeout(a.h);
    a.h = null
};
var Dk = "AC AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CP CR CU CV CW CX CY CZ DE DG DJ DK DM DO DZ EA EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU IC ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TA TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW".split(" ");
var Ek = function (a) {
    W.call(this, a, this.g.bind(this), null);
    this.f = !1;
    this.c = null
};
t(Ek, W);
Ek.prototype.g = function () {
    var a = Z(this.a);
    this.f = !!a.device.ipAddress;
    var b = (this.a.b.setupApiClientState || null).eurekaInfoState, c = a.deviceName || b.name;
    b = 3 === b.setupApiVersion;
    this.f || b || a.country ? a = null : (a = this.a.a.h(), a = (b = rh(a)) && -1 !== Dk.indexOf(b) ? b : (a = qh(a).toUpperCase()) && -1 !== Dk.indexOf(a) ? a : "US");
    this.c = a;
    D(U(this.b, X(this).sendRequest(new zc(wk(this.a), c, this.c))).then(this.h.bind(this)), this.a.g.bind(this.a));
    return z()
};
Ek.prototype.h = function (a) {
    var b = this;
    Y(b.a, 14);
    var c = Z(b.a);
    c.deviceName = a.name;
    b.c && a.country && (c.country = a.country);
    Ck(b.a, c);
    if (b.f) {
        var d = null;
        return A([U(b.b, mk(b.a)), b.a.a.c.a()]).then(function (a) {
            d = a[0];
            a = a[1];
            var e = [];
            7 <= d.a && e.push(U(b.b, d.b.request({
                url: Ti(d, "/setup/accept_tos"),
                method: "POST",
                timeout: 1E4,
                D: 2
            })));
            e.push(U(b.b, $i(d, jg(d.a, c.deviceName, 3 !== a))));
            return A(e)
        }).then(function () {
            return U(b.b, Mi(d, {options: ["setup.setup_state"]}))
        }).then(function () {
            switch (Si(d).setupState) {
                case 60:
                    Fk(b.a);
                    break;
                case 62:
                    nk(b.a, new M(10));
                    break;
                default:
                    return Mb()
            }
        })
    }
    nk(b.a, new M(6))
};
var Gk = function (a) {
    W.call(this, a, this.c.bind(this), null)
};
t(Gk, W);
Gk.prototype.c = function () {
    var a = this, b = null;
    return A([U(this.b, mk(this.a)), this.a.a.c.a()]).then(function (c) {
        b = c[0];
        c = jg(b.a, Z(a.a).deviceName, 3 !== c[1]);
        c = [U(a.b, $i(b, c))];
        4 <= b.a && c.push(U(a.b, Xi(b)));
        return A(c)
    }).then(function () {
        return U(a.b, Mi(b, {options: ["setup.setup_state"]}))
    }).then(function () {
        switch (Si(b).setupState) {
            case 60:
            case 52:
                Fk(a.a);
                break;
            case 62:
                nk(a.a, new M(10));
                break;
            default:
                return Mb()
        }
    })
};
var Hk = function (a, b, c, d) {
    W.call(this, a, this.X.bind(this), this.m.bind(this));
    this.g = 1;
    this.c = new rg;
    this.w = c;
    this.B = b;
    this.i = null;
    this.G = void 0 !== d ? d : Ue(a.a.a);
    this.h = null;
    this.s = this.R.bind(this);
    this.l = this.j.bind(this);
    this.H = this.P.bind(this)
};
t(Hk, W);
Hk.prototype.X = function () {
    var a = this;
    Ik(a, 1);
    a.h = new cj(this.a.a.b);
    var b = a.h.a;
    b.listen("connected", a.ea, !0, a);
    b.listen("added", a.o, !0, a);
    b = X(a);
    b.addListener("WiFiSwitching.Proceed", a.s);
    b.addListener("WiFiSwitching.RetryConnection", a.l);
    b.addListener("WiFiConfig.Retry", a.l);
    return U(a.b, a.h.start()).then(function () {
        var b = a.h.networks;
        (b = a.i && b.get(a.i) || null) ? "Connected" === b.ConnectionState ? a.j() : a.G ? (a.M(1), Ik(a, 2), a.V(1), sg(a.c, V(25E3)).then(a.v.bind(a)), a.a.a.b.startConnect(a.i)) : a.v() : (Ik(a,
            11), a.a.g())
    })
};
Hk.prototype.m = function () {
    this.g = 1;
    this.i = null;
    var a = this.c;
    this.c = new rg;
    a = [tg(a)];
    var b = this.h;
    this.h = null;
    if (b) {
        var c = b.a;
        O(c, "connected", this.ea, !0, this);
        c.listen("added", this.o, !0, this);
        a.push(b.stop())
    }
    b = X(this);
    b.removeListener("WiFiSwitching.Proceed", this.s);
    b.removeListener("WiFiSwitching.RetryConnection", this.l);
    b.removeListener("WiFiConfig.Retry", this.l);
    return A(a)
};
Hk.prototype.ea = function (a) {
    if (Jk(this, a)) switch (this.g) {
        case 2:
            this.M(2);
            this.j();
            break;
        case 6:
            this.M(4), this.j()
    }
};
Hk.prototype.o = function (a) {
    Jk(this, a) && 1 === this.g && (this.i = a.properties.GUID)
};
var Jk = function (a, b) {
    b = b.properties.WiFi;
    return a.w && !Yf(b.BSSID, a.w) || a.B && b.SSID !== a.B ? !1 : !0
};
Hk.prototype.v = function () {
    this.M(3);
    Ik(this, 5);
    this.J(1)
};
Hk.prototype.R = function () {
    var a = this;
    Ik(a, 6);
    a.J(2);
    var b = a.h.networks.get(this.i);
    b && "Connected" === b.ConnectionState ? a.j() : sg(a.c, V(1E4)).then(function () {
        Ik(a, 7);
        a.J(3)
    })
};
var Kk = function (a) {
    var b = B();
    sg(a.c, b.a);
    var c = null, d = function (e) {
        c = V(e).then(a.qa.bind(a)).then(function (c) {
            a.M(5);
            b.b(c)
        }, function (c) {
            c instanceof Fi ? d(2E3) : c instanceof Pi && (Y(a.a, 9), b.c(c))
        })
    };
    C(b.a, function () {
        if (c) {
            var a = c;
            c = null;
            a.cancel()
        }
    });
    d(0);
    return b.a
};
Hk.prototype.j = function () {
    var a = this;
    6 === a.g || 9 === a.g ? (Ik(a, 8), this.J(2)) : (Ik(a, 3), this.V(1));
    var b = Kk(a).then(function (b) {
        Ik(a, 11);
        a.ra(b)
    }, this.H);
    sg(a.c, V(12E4)).then(function () {
        b.cancel()
    })
};
Hk.prototype.P = function (a) {
    a = a instanceof Ri || a instanceof Pi;
    8 === this.g ? a ? (Ik(this, 10), this.J(5)) : (Ik(this, 9), this.J(4)) : a ? (Ik(this, 10), this.V(3)) : (Ik(this, 4), this.V(2))
};
var Ik = function (a, b) {
    b !== a.g && (a.g = b, b = a.c, a.c = new rg, tg(b))
};
var Lk = function (a) {
    this.f = Z(a).device;
    Hk.call(this, a, null, this.f.bssid)
};
t(Lk, Hk);
var Mk = new L(1, 4, 2, 5, 3, 6, 4, 7, 5, 8);
h = Lk.prototype;
h.ea = function (a) {
    var b = a.properties.WiFi, c = null;
    Yf(b.BSSID, this.f.bssid) ? (c = Z(this.a), c.connectedHotSpotBssid = b.BSSID) : ag(a.properties) || (c = Z(this.a), c.originalWiFiNetwork = {
        ssid: b.SSID,
        bssid: b.BSSID
    });
    c && Ck(this.a, c);
    Lk.F.ea.call(this, a)
};
h.qa = function () {
    var a = this.a.a;
    return U(this.b, Qi(a.g, Li("192.168.255.249"), a.b, {ssid: this.f.ssid, bssid: this.f.bssid}, a.h()))
};
h.V = function (a) {
    var b = this.a.a, c = X(this), d = dg(this.f.type);
    c.sendMessage(new nc(1 === a && 3 || 2 === a && 4 || 3 === a && 5 || null, d, this.f.name));
    3 === a && sg(this.c, Tg(c, "BadDeviceAck")).then(b.f.bind(b))
};
h.J = function (a) {
    var b = this.a.a, c = X(this);
    c.sendMessage(new qc(a, this.f.name, this.f.ssid));
    5 === a && sg(this.c, Tg(c, "BadDeviceAck")).then(b.f.bind(b))
};
h.ra = function (a) {
    a = a.getState();
    this.a.h(a);
    a.eurekaInfoState.features.supportsDisplay ? nk(this.a, new M(3)) : nk(this.a, new M(4))
};
h.M = function (a) {
    (a = Mk.get(a)) && Y(this.a, a)
};
var Nk = function (a, b, c, d, e) {
    var f = B(), g = new vj(b, c, d, e), l = function (b) {
        return b.U.getState().eurekaInfoState.ssdpUdn === a
    }, p = function (a) {
        (a = Da(a.devices, l)) && f.b(a.ipAddress)
    };
    g.listen("devices", p);
    var u = null;
    g.start().then(function () {
        u = setInterval(function () {
            ph(g.h);
            g.N()
        }, 5E3)
    });
    var T = setTimeout(f.c.bind(f), 18E4);
    return C(f.a, function () {
        clearTimeout(T);
        clearInterval(u);
        O(g, "devices", p);
        g.stop()
    })
};
var Ok = function (a) {
    W.call(this, a, this.i.bind(this), null);
    this.c = null;
    this.l = 0;
    this.f = null;
    this.h = 0
};
t(Ok, W);
Ok.prototype.i = function () {
    var a = this;
    Y(a.a, 30);
    return U(this.b, mk(this.a)).then(function (b) {
        a.c = b;
        X(a).sendMessage(new jc("OtaUpdate.Pending", wk(a.a)));
        Pk(a, 0)
    })
};
var Pk = function (a, b) {
    D(U(a.b, V(b)).then(function () {
        ++a.l;
        return U(a.b, Mi(a.c, {options: ["ota_status", "setup.setup_state"]}))
    }).then(function (b) {
        var c = Si(a.c), e = 0;
        7 <= a.c.a && (e = b.ota_status.download_progress);
        if (a.f !== c.setupState || e !== a.h) a.f = c.setupState, a.h = e, 60 === a.f && a.g();
        Pk(a, 3E3)
    }), function (b) {
        If(b);
        b = a.c.getState().eurekaInfoState.ssdpUdn;
        var c = a.a.a;
        U(a.b, Nk(b, c.b, c.i, c.g, c.window)).then(a.g.bind(a), a.j.bind(a))
    })
};
Ok.prototype.g = function () {
    Y(this.a, 31);
    var a = X(this);
    U(this.b, Tg(a, "OtaUpdate.Proceed")).then(function () {
        Fk(this.a)
    }.bind(this));
    a.sendMessage(new jc("OtaUpdate.Done", wk(this.a)))
};
Ok.prototype.j = function () {
};
var Qk = function (a, b, c) {
    this.f = new S(this.m.bind(this), this.l.bind(this));
    this.a = a;
    this.j = b;
    this.b = c;
    this.c = null;
    this.i = new P;
    b.a.a.addListener("RestartSetup", this.s.bind(this));
    b.a.a.addListener("GoToDeviceList", this.a.f.bind(this.a))
}, Rk = function (a) {
    N.call(this, "newState");
    this.state = a
};
t(Rk, N);
Qk.prototype.start = function () {
    return this.f.start()
};
Qk.prototype.stop = function () {
    return this.f.stop()
};
var Fk = function (a) {
    var b = Z(a), c = a.b.setupApiClientState || null, d = c.deviceIpAddress;
    c = c.eurekaInfoState;
    Y(a, b.device && b.device.bssid ? 25 : 28);
    b = new eh("deviceJustSetUp");
    b.deviceJustSetUp = new fh(d, c.name, c.ssdpUdn, c.modelName);
    var e = new gh;
    e.audioOutSupported = !0;
    e.videoOutSupported = !!c.features.supportsDisplay;
    b.deviceJustSetUp.capabilities = e;
    a.a.l.setItem("showDeviceBanner", d);
    Re(a.a.a, a.b);
    C(U(a.f, Jf(a.a.i.sendMessage(b), 1E4)), function () {
        C(a.stop(), function () {
            a.a.f()
        })
    })
}, wk = function (a) {
    return (a = a.b.commonState &&
        a.b.commonState.device && a.b.commonState.device.type) ? dg(a) : 2
}, mk = function (a) {
    var b = {
        read: function () {
            return a.b.setupApiClientState || null
        }, write: a.h.bind(a)
    };
    return Oi(a.a.g, b, a.a.h())
};
Qk.prototype.h = function (a) {
    a ? this.b.setupApiClientState = a : delete this.b.setupApiClientState;
    Qe(this.a.a, this.b)
};
var Z = function (a) {
    return a.b.commonState || new He
}, Ck = function (a, b) {
    b ? a.b.commonState = b : delete a.b.commonState;
    Qe(a.a.a, a.b)
}, nk = function (a, b) {
    a.c.stop().then(function () {
        if (a.b.states) {
            var c = a.b.states;
            c.all = c.all.slice(0, c.current + 1);
            c.all.push(b);
            c.current = c.all.length - 1
        } else a.b.states = new Me(0, [b]);
        Qe(a.a.a, a.b);
        a.c = a.a.j(a, b.type);
        Q(a.i, new Rk(b.type));
        D(U(a.f, a.c.start()), function (b) {
            if (b instanceof E) switch (a.f.getState()) {
                case "starting":
                case "started":
                    a.g()
            } else a.g()
        })
    })
};
Qk.prototype.g = function () {
    Re(this.a.a, this.b);
    this.j.a.a.sendMessage(new jc("ShowGenericSetupError", wk(this)));
    D(this.stop(), q)
};
var Y = function (a, b) {
    a.a.c.b(b)
};
Qk.prototype.m = function () {
    var a = this.b.states.all[this.b.states.current].type;
    this.c = this.a.j(this, a);
    Q(this.i, new Rk(a));
    null === this.a.a.getItem("setupNoCountryDetection") && (a = Z(this), a.country || a.connectedHotSpotBssid || U(this.f, this.j.a.a.sendRequest(new Uc)).then(function (a) {
        var b = Z(this);
        b.country || (b.country = a.countryCode, Ck(this, b))
    }.bind(this)));
    return this.c.start()
};
Qk.prototype.l = function () {
    var a = this.c;
    this.c = null;
    Q(this.i, new Rk(null));
    return a.stop()
};
Qk.prototype.s = function () {
    Re(this.a.a, this.b);
    this.a.m()
};
var Sk = function (a) {
    W.call(this, a, this.B.bind(this), this.w.bind(this));
    this.c = 1;
    this.f = this.h = null;
    this.g = new L;
    this.i = new L;
    this.j = null;
    this.o = this.H.bind(this);
    this.l = this.v.bind(this)
};
t(Sk, W);
Sk.prototype.B = function () {
    var a = this;
    Tk(a, 1);
    X(a).addListener("SetupStart.Proceed", a.o);
    var b = [];
    b.push(U(a.b, this.a.a.c.a()).then(function (b) {
        a.j = b
    }));
    var c = Z(a.a);
    c.device && !c.pinned && (c.device = void 0, Ck(a.a, c));
    var d = a.a.a;
    a.f = new vj(d.b, d.i, d.g, d.window);
    d = a.f.f.a;
    d.listen("added", a.m, !0, a);
    d.listen("connected", a.s, !0, a);
    a.f.listen("devices", this.l);
    b.push(U(a.b, a.f.start()));
    xg(a.b).then(function () {
        c.pinned && c.device ? (a.h = c.device, Tk(a, 5), Uk(a)) : 0 != a.i.a ? Vk(a, a.i.K(!1).next()) : Gd(a.g, function (b) {
            if ("NotConnected" ===
                b.ConnectionState) return !0;
            Wk(a, b);
            return !1
        }) && (Tk(a, 2), Uk(a), U(a.b, V(5E3)).then(a.G.bind(a)))
    });
    return A(b)
};
Sk.prototype.w = function () {
    this.c = 1;
    this.h = null;
    this.g = new L;
    this.i = new L;
    this.j = null;
    X(this).removeListener("SetupStart.Proceed", this.o);
    if (!this.f) return z();
    var a = this.f;
    this.f = null;
    var b = a.f.a;
    O(b, "added", this.m, !0, this);
    O(b, "connected", this.s, !0, this);
    O(a, "devices", this.l);
    return a.stop()
};
var Tk = function (a, b) {
    b !== a.c && (a.c = b)
}, Uk = function (a) {
    var b = X(a);
    switch (a.c) {
        case 1:
        case 2:
            b.sendMessage(new lc(!1));
            break;
        case 3:
            b.sendMessage(new lc(!0));
            break;
        case 4:
            b.sendMessage(new G("DeviceDiscovery.NotFound"));
            break;
        case 5:
            Xk(a, 1);
            break;
        case 6:
            Xk(a, 2);
            break;
        case 7:
            Xk(a, 3);
            break;
        case 8:
            Xk(a, 4)
    }
}, Xk = function (a, b) {
    var c = dg(a.h.type);
    b = new nc(b, c, a.h.name);
    b.otherDevicesExist = 1 < a.g.a + a.i.a;
    b.analyticsOptIn = 3 !== a.j;
    X(a).sendMessage(b)
};
Sk.prototype.G = function () {
    if (2 === this.c) if (0 === this.g.a) Tk(this, 3), Uk(this), U(this.b, V(45E3)).then(function () {
        3 === this.c && (this.f.stop(), Tk(this, 4), Uk(this))
    }.bind(this)); else {
        var a = Fd(this.g, function (a, c) {
            return "NotConnected" !== c.ConnectionState ? c : (c.WiFi && c.WiFi.SignalStrength || -Infinity) < (a && a.WiFi && a.WiFi.SignalStrength || -Infinity) ? a : c
        });
        Wk(this, a)
    }
};
var Wk = function (a, b) {
    b = b && b.WiFi;
    var c = b.SSID, d = $f(c);
    a.h = new Ie({name: d.name, type: d.type, ssid: c, bssid: b.BSSID});
    Tk(a, 5);
    Uk(a)
}, Vk = function (a, b) {
    var c = b.U.getState().eurekaInfoState;
    a.h = new Ie({name: c.name, type: c.deviceType, ipAddress: b.ipAddress});
    Tk(a, 5);
    Uk(a)
};
Sk.prototype.m = function (a) {
    a = a.properties;
    var b = !Jd(this.g, a.GUID);
    this.g.set(a.GUID, a);
    5 === this.c ? b && Uk(this) : 3 === this.c && Wk(this, a)
};
Sk.prototype.s = function (a) {
    2 !== this.c && 3 !== this.c || Wk(this, a.properties)
};
Sk.prototype.v = function (a) {
    var b = this, c = null;
    a.devices.filter(function (a) {
        a = a.U.getState().eurekaInfoState;
        return a.features.supportsSetup && a.ethernetConnected && !a.tosAccepted
    }).forEach(function (a) {
        Jd(b.i, a.ipAddress) || (b.i.set(a.ipAddress, a), c = c || a)
    });
    c && (2 === b.c || 3 === b.c ? Vk(b, c) : 5 === b.c && Uk(b))
};
Sk.prototype.H = function () {
    var a = this;
    5 !== a.c && 8 !== a.c || Yk(a).then(function () {
        var b = Z(a.a);
        b.device = a.h;
        Ck(a.a, b);
        if (b.device.bssid) Y(a.a, 3), nk(a.a, new M(2)); else {
            Y(a.a, 27);
            Tk(a, 7);
            Uk(a);
            var c = a.a.a;
            D(U(a.b, Oi(c.g, Li(b.device.ipAddress), c.h())).then(function (b) {
                a.a.h(b.getState());
                Y(a.a, 27);
                nk(a.a, new M(5))
            }), function () {
                Tk(a, 8);
                Uk(a)
            })
        }
    })
};
var Yk = function (a) {
    var b = a.a.a.a;
    if (null !== b.getItem("setupTosAccepted")) return z();
    var c = a.a.a.c, d = U(a.b, Tg(X(a), "SetupStart.TosAccepted")).then(function (a) {
        c.h(a.analyticsOptIn);
        b.setItem("setupTosAccepted", "")
    }.bind(a));
    Tk(a, 6);
    Uk(a);
    return d
};
var $k = function (a) {
    this.f = a;
    this.b = new P;
    this.networks = new L;
    this.c = !1;
    this.a = new S(function () {
        Zk(this);
        return z()
    }.bind(this), function () {
        this.networks.clear();
        this.c = !1;
        return z()
    }.bind(this))
}, cl = function (a) {
    this.id = al(a);
    this.ssid = a.ssid;
    this.Ea = a.wpa_auth;
    this.Fa = a.wpa_cipher;
    this.Ga = a.wpa_id;
    this.ia = new R;
    this.W = a.signal_level;
    this.ya = this.ga = !1;
    bl(this, a)
}, bl = function (a, b) {
    a.ia.add(b.bssid);
    a.W = Math.max(a.W, b.signal_level);
    b.ap_list && b.ap_list.forEach(function (a) {
        this.ia.add(a.bssid);
        this.W =
            Math.max(this.W, a.signal_level);
        this.ga = this.ga || 5E3 <= a.frequency
    }.bind(a))
}, dl = function () {
    N.call(this, "error")
};
t(dl, N);
var el = function () {
    this.networks = new L;
    this.a = 0;
    this.I = B()
}, al = function (a) {
    return a.wpa_id ? a.wpa_id.toString() : a.ssid + ":" + a.wpa_auth + ":" + a.wpa_cipher
};
$k.prototype.start = function () {
    return this.a.start()
};
$k.prototype.stop = function () {
    return this.a.stop()
};
var Zk = function (a) {
    D(U(a.a, Zi(a.f)).then(function () {
        U(a.a, V(3E3))
    }).then(function () {
        var b = new el;
        a.g(b);
        return b.I.a
    }).then(a.h.bind(a)).then(function () {
        return U(a.a, V(1E3))
    }).then(function () {
        Zk(a)
    }), function (b) {
        If(b);
        Q(a.b, new dl(b));
        a.stop()
    })
};
$k.prototype.g = function (a) {
    D(U(this.a, Yi(this.f)).then(this.i.bind(this, a)).then(function () {
        3 === a.a ? a.I.b(a.networks) : U(this.a, V(2E3)).then(this.g.bind(this, a))
    }.bind(this)), function (b) {
        a.I.c(b)
    })
};
$k.prototype.i = function (a, b) {
    var c = !1, d = !1;
    b.filter(function (a) {
        return 1 !== a.wpa_auth ? !0 : !Zf(a.bssid)
    }).forEach(function (b) {
        var e = al(b), g = a.networks.get(e);
        g ? bl(g, b) : (g = new cl(b), a.networks.set(e, g), c = !0, Jd(this.networks, e) || (this.networks.set(e, g), d = !0))
    }.bind(this));
    a.a = c ? 0 : a.a + 1;
    if (d || !this.c) Q(this.b, new N("networksAdded")), this.c = !0
};
$k.prototype.h = function (a) {
    a.forEach(function (a) {
        a.ya = !0
    });
    Ed(Mf(new R(this.networks.A()), a.A()), function (b) {
        var c = this.networks.get(b);
        c.W = -Infinity;
        a.set(b, c)
    }.bind(this));
    this.networks = a;
    Q(this.b, new N("scanCompleted"))
};
var fl = function (a) {
    W.call(this, a, this.v.bind(this), this.o.bind(this));
    this.h = this.f = this.c = this.g = null;
    this.s = this.i.bind(this);
    this.j = this.w.bind(this);
    this.m = this.B.bind(this)
};
t(fl, W);
fl.prototype.v = function () {
    var a = this;
    return U(a.b, mk(a.a)).then(function (b) {
        a.g = b;
        var c = null;
        b = X(a);
        c = Z(a.a);
        a.f = c.connectWiFi || null;
        if (a.f) {
            var d = ig(a.f, wk(a.a));
            delete c.connectWiFi;
            Ck(a.a, c);
            2 === a.f.a ? c = a.i() : (b.addListener("WiFiConfig.ErrorAck", a.s), c = z());
            gl(a, d)
        } else c = a.i(), U(a.b, V(7E3)).then(function () {
            a.h || gl(a, new Dc(1, wk(a.a), [], null))
        });
        b.addListener("WiFiConfig.Retry", a.m);
        return c
    })
};
fl.prototype.i = function () {
    if (this.c) return z();
    this.c = new $k(this.g);
    this.c.b.listen("networksAdded", this.l, !0, this);
    X(this).addListener("WiFiConfig.Connect", this.j);
    hl(this);
    return this.c.start()
};
fl.prototype.o = function () {
    this.h = this.g = null;
    var a = X(this);
    a.removeListener("WiFiConfig.Connect", this.j);
    a.removeListener("WiFiConfig.Retry", this.m);
    a.removeListener("WiFiConfig.ErrorAck", this.s);
    return this.c ? (O(this.c.b, "networksAdded", this.l, !0, this), a = this.c, this.c = null, a.stop()) : z()
};
var gl = function (a, b) {
    a.h = b;
    X(a).sendMessage(b)
};
fl.prototype.l = function () {
    if (this.h) X(this).sendMessage(new Ec(this.c.networks.u().map(function (a) {
        return new Cc(a.id, a.ssid, eg(a.Ea))
    }))); else {
        var a = Z(this.a), b = a.originalWiFiNetwork && a.originalWiFiNetwork.bssid, c = [], d = null;
        Ed(this.c.networks, function (a) {
            var e = new Cc(a.id, a.ssid, eg(a.Ea));
            c.push(e);
            b && a.ia.contains(b) && (d = e)
        });
        gl(this, new Dc(1, wk(this.a), c, d))
    }
};
fl.prototype.w = function (a) {
    var b = this, c = il(b, a);
    U(b.b, new y(function (d) {
        a.password ? d(jl(b, a.password).then(function (a) {
            c.msg.enc_passwd = a
        })) : d()
    })).then(function () {
        return U(b.b, kl(b, c))
    }).then(function (d) {
        d ? (b.f = c, gl(b, new Dc(5, wk(b.a), b.h.networks, a.network))) : (d = Z(b.a), d.connectWiFi = c, Ck(b.a, d), D(Ui(b.g, c.msg), q), Y(b.a, 15), nk(b.a, new M(7)))
    })
};
var il = function (a, b) {
    var c = new Ke(new fe(b.network.ssid, fg(b.network.security)));
    b.network.id && (c.b = b.network.id, a.c && Jd(a.c.networks, b.network.id) ? (a = a.c.networks.get(b.network.id), a.Fa && (c.msg.wpa_cipher = a.Fa), a.Ga && (c.msg.wpa_id = a.Ga)) : a.f && a.f.b === b.network.id && (a = a.f.msg, a.wpa_cipher && (c.msg.wpa_cipher = a.wpa_cipher), a.wpa_id && (c.msg.wpa_id = a.wpa_id)));
    return c
}, kl = function (a, b) {
    var c = Z(a.a);
    if ("m" !== (c.device && c.device.type)) return z(!1);
    var d = b.b;
    if (!d) return z(!1);
    if (b = a.c.networks.get(d)) {
        if (b.ga) return z(!1);
        if (b.ya) return z(!0)
    }
    return Hf(a.c.b, "scanCompleted").then(function () {
        var b = a.c.networks.get(d);
        return b && !b.ga
    })
};
fl.prototype.B = function () {
    var a = Z(this.a);
    a.connectWiFi = this.f;
    Ck(this.a, a);
    D(Ui(this.g, a.connectWiFi.msg), q);
    Y(this.a, 15);
    nk(this.a, new M(7))
};
var jl = function (a, b) {
    var c = a.g.getState().verificationState.verificationProperties;
    return a.a.a.b.verifyAndEncryptData(c, b)
}, hl = function (a) {
    var b = a.g.a;
    if (!(4 > b)) {
        var c = Z(a.a).country, d = null;
        7 > b ? (b = new Ee, b.location = new me, b.location.country_code = c, d = b) : (b = new Fe, b.settings = new ue, b.settings.country_code = c, d = b);
        D(U(a.b, $i(a.g, d)), function () {
        })
    }
};
var ll = function (a) {
    var b = Z(a).connectWiFi, c = Ue(a.a.a);
    w("Macintosh") && 1 !== b.msg.wpa_auth && (c = !1);
    Hk.call(this, a, b.msg.ssid, null, c);
    this.f = null
};
t(ll, Hk);
var ml = new L(1, 20, 2, 21, 3, 22, 4, 23, 5, 24);
ll.prototype.m = function () {
    this.f = null;
    return ll.F.m.call(this)
};
var nl = function (a) {
    return a.f ? z(a.f) : U(a.b, mk(a.a)).then(function (b) {
        a.f = Si(b).connectedIpAddress;
        return a.f
    })
};
h = ll.prototype;
h.qa = function () {
    var a = this;
    return nl(a).then(function (b) {
        return U(a.b, Oi(a.a.a.g, Li(b)))
    })
};
h.V = function (a) {
    var b = Z(this.a), c = b.connectWiFi;
    a = 2 === a || 3 === a ? 1 : void 0;
    c.a !== a && (c.a = a, Ck(this.a, b));
    X(this).sendMessage(ig(c, wk(this.a)))
};
h.J = function (a) {
    X(this).sendMessage(new rc(a, Z(this.a).connectWiFi.msg.ssid))
};
h.ra = function (a) {
    this.a.h(a.getState());
    nk(this.a, new M(9))
};
h.M = function (a) {
    (a = ml.get(a)) && Y(this.a, a)
};
var ik = function (a, b) {
    switch (b) {
        case 1:
            return new Sk(a);
        case 2:
            return new Lk(a);
        case 3:
            return new ok(a);
        case 4:
            return new lk(a);
        case 5:
            return new Ek(a);
        case 6:
            return new fl(a);
        case 7:
            return new uk(a);
        case 8:
            return new ll(a);
        case 9:
            return new Gk(a);
        case 10:
            return new Ok(a);
        default:
            return new W(a, null, null)
    }
};
var ol = null;
r("castApp.app.setupManager", ol);
var pl = {rb: "devices", sb: "offers", tb: "setup", ERROR: "error"}, ql = /^https?:/i, rl = function (a) {
    if (!a || "#" == a) return {};
    a.startsWith("#") && (a = a.slice(1));
    var b = a.split("/");
    if (!(0 <= za(Xa(pl), b[0]))) return {};
    a = {L: b[0]};
    if (b[1]) switch (a.L) {
        case "devices":
            b = decodeURIComponent(b[1]);
            vd(b) && (a.ipAddress = b);
            break;
        case "setup":
            a.la = b[1];
            break;
        case "offers":
            b = decodeURIComponent(b[1]), ql.test(b) && (a.za = b)
    }
    return a
};
window.addEventListener("hashchange", function (a) {
    var b = ae(a.oldURL).g;
    a = ae(a.newURL).g;
    rl(b).L !== rl(a).L && location.reload()
});
var jk = function () {
    window.location.hash = "devices"
}, sl = function (a) {
    window.location.hash = "setup/" + a
}, tl = function (a) {
    window.location.hash = "devices/" + encodeURIComponent(a)
}, ul = function () {
    window.location.hash = "error"
}, vl = function (a) {
    if (w("Linux")) ul(); else {
        var b = chrome.metricsPrivate ? new Ye(window.localStorage) : new Xe,
            c = chrome.networkingPrivate ? pg.b() : null, d = new kk(window, c, new Ii, b), e = new dk(a),
            f = function () {
                var a = rl(window.location.hash);
                if ("setup" === a.L) {
                    var b = null;
                    if (a.la) {
                        if (ol && ol.b.id === a.la) return;
                        b = Da(Oe(d.a), function (b) {
                            return b.id === a.la
                        })
                    }
                    b || (b = new Ge(Qa()), b.states = new Me(0, [new M(1)]), Qe(d.a, b), window.history.replaceState(null, "", "#setup/" + b.id));
                    ol && ol.stop();
                    ol = new Qk(d, e, b);
                    ol.start()
                }
            };
        e.start().then(function () {
            f();
            window.addEventListener("hashchange", f)
        })
    }
}, wl = function (a, b) {
    if (w("Linux")) ul(); else {
        var c = new dk(a), d = chrome.networkingPrivate ? pg.b() : null, e = new Ii,
            f = new bh(window, c, e, sl, jk, tl, window.location.reload.bind(window.location), new ng, a, chrome.i18n.getUILanguage, new vj(d, b,
                e, window)), g = null, l = null, p = function (a) {
                if (!l || l.i !== a) {
                    var b = g && g.stop() || l && l.stop() || z();
                    g = null;
                    var c = l = new Yj(f, a);
                    b.then(function () {
                        l === c && D(l.start(), jk)
                    })
                }
            }, u = function () {
                if (!g) {
                    var a = l && l.stop() || z(), b = g = new Pj(f);
                    l = null;
                    a.then(function () {
                        b === g && g.start()
                    })
                }
            }, T = function () {
                var a = rl(location.hash);
                "devices" === a.L && (a.ipAddress ? p(a.ipAddress) : u())
            };
        c.start().then(function () {
            T();
            window.addEventListener("hashchange", T)
        })
    }
}, yl = function (a, b) {
    var c = new dk(a);
    a = chrome.metricsPrivate ? new Ye(window.localStorage) :
        new Xe;
    var d = new gk(window, c, b, new Ii, a);
    c.start().then(function () {
        var a = c.a.a, b = new L;
        a.addListener("Offers.Scan", function (a) {
            var c = a.scanId;
            Jd(b, c) || (a = new hk(d, c), b.set(c, a), Hf(a.f.c, "stopped").then(function () {
                b.remove(c)
            }), a.start())
        });
        a.addListener("Offers.Redeem", function (a) {
            var b = encodeURIComponent(a.url);
            xl(b).then(function (a) {
                0 === a.length ? chrome.tabs.create({
                    url: "chrome://cast/#offers/" + b,
                    active: !0
                }) : (chrome.tabs.update(a[0].tabId, {active: !0}), chrome.windows.update(a[0].windowId, {active: !0}))
            })
        });
        a.addListener("Offers.AnalyticsEvent", function (a) {
            d.c.f(a)
        });
        a.sendMessage(new G("Offers.Show"))
    })
}, zl = function (a) {
    ek(window, "start");
    D(Hi(new Ii, {url: a}).then(function (b) {
        var c = b.url;
        return c && ql.test(c) ? xl(encodeURIComponent(a)).then(function (a) {
            a.forEach(function (a) {
                chrome.tabs.update(a.id, {url: c})
            })
        }) : Mb()
    }), function () {
        ek(window, "unknown-error")
    })
}, xl = function (a) {
    return new y(function (b) {
        chrome.tabs.query({url: ["chrome://cast/*", "chrome-extension://" + chrome.runtime.id + "/cast_setup*"]}, function (c) {
            var d =
                [];
            c.forEach(function (b) {
                -1 !== b.url.indexOf(a) && d.push(b)
            });
            b(d)
        })
    })
};
window.addEventListener("load", function () {
    var a = new mh, b = new Yg(window);
    b.f.listen("originViolation", ul);
    Pe();
    var c = rl(location.hash);
    switch (c.L) {
        case "devices":
            wl(b, a);
            break;
        case "offers":
            c.za ? zl(c.za) : yl(b, a);
            break;
        case "setup":
            vl(b);
            break;
        case "error":
            ek(window, "unknown-error");
            break;
        default:
            JSON.stringify(c), jk()
    }
});
