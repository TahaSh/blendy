function B(t) {
  return typeof t == "object" && t !== null && "x" in t && "y" in t && "unit" in t && typeof t.unit == "string" && typeof t.x == "object" && typeof t.y == "object" && "topLeft" in t.x && "topRight" in t.x && "bottomRight" in t.x && "bottomLeft" in t.x && "topLeft" in t.y && "topRight" in t.y && "bottomRight" in t.y && "bottomLeft" in t.y;
}
function A(t) {
  var y;
  const e = t.match(/(\d+(?:\.\d+)?)(px|%)/g);
  if (!e)
    return {
      x: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
      y: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
      unit: "px"
    };
  const n = e.map((f) => {
    const [u, g, m] = f.match(/(\d+(?:\.\d+)?)(px|%)/) ?? [];
    return { value: parseFloat(g), unit: m };
  }), o = ((y = n[0]) == null ? void 0 : y.unit) || "px";
  if (n.some((f) => f.unit !== o))
    throw new Error("Inconsistent units in border-radius string.");
  const [l, s, r, a] = n.map((f) => f.value), i = {
    topLeft: l ?? 0,
    topRight: s ?? l ?? 0,
    bottomRight: r ?? l ?? 0,
    bottomLeft: a ?? s ?? l ?? 0
  };
  return {
    x: { ...i },
    y: { ...i },
    unit: o
  };
}
function R({ x: t, y: e, unit: n }, o, l) {
  if (n === "px") {
    const s = {
      topLeft: t.topLeft / o,
      topRight: t.topRight / o,
      bottomLeft: t.bottomLeft / o,
      bottomRight: t.bottomRight / o
    }, r = {
      topLeft: e.topLeft / l,
      topRight: e.topRight / l,
      bottomLeft: e.bottomLeft / l,
      bottomRight: e.bottomRight / l
    };
    return { x: s, y: r, unit: "px" };
  } else if (n === "%")
    return { x: t, y: e, unit: "%" };
  return { x: t, y: e, unit: n };
}
function $(t) {
  return `
    ${t.x.topLeft}${t.unit} ${t.x.topRight}${t.unit} ${t.x.bottomRight}${t.unit} ${t.x.bottomLeft}${t.unit}
    /
    ${t.y.topLeft}${t.unit} ${t.y.topRight}${t.unit} ${t.y.bottomRight}${t.unit} ${t.y.bottomLeft}${t.unit}
  `;
}
function T(t) {
  return typeof t == "object" && "x" in t && "y" in t;
}
function d(t, e) {
  return { x: t, y: e };
}
function E(t, e) {
  return d(t.x + e.x, t.y + e.y);
}
function O(t, e) {
  return d(t.x - e.x, t.y - e.y);
}
function X(t, e) {
  return d(t.x * e, t.y * e);
}
function h(t, e, n) {
  return t + (e - t) * n;
}
function Y(t, e, n) {
  return E(t, X(O(e, t), n));
}
function q(t, e, n) {
  return {
    x: {
      topLeft: h(t.x.topLeft, e.x.topLeft, n),
      topRight: h(t.x.topRight, e.x.topRight, n),
      bottomRight: h(t.x.bottomRight, e.x.bottomRight, n),
      bottomLeft: h(t.x.bottomLeft, e.x.bottomLeft, n)
    },
    y: {
      topLeft: h(t.y.topLeft, e.y.topLeft, n),
      topRight: h(t.y.topRight, e.y.topRight, n),
      bottomRight: h(t.y.bottomRight, e.y.bottomRight, n),
      bottomLeft: h(t.y.bottomLeft, e.y.bottomLeft, n)
    },
    unit: t.unit
  };
}
function w(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
const M = {
  duration: 350,
  easing: (t) => t
};
function j(t, e, n, o) {
  let l = !1;
  const s = () => {
    l = !0;
  }, r = { ...M, ...o };
  let a;
  function i(y) {
    a === void 0 && (a = y);
    const f = y - a, u = w(f / r.duration, 0, 1), g = Object.keys(t), m = Object.keys(e);
    if (!g.every((c) => m.includes(c))) {
      console.error("animate Error: `from` keys are different than `to`");
      return;
    }
    const x = {};
    g.forEach((c) => {
      typeof t[c] == "number" && typeof e[c] == "number" ? x[c] = h(
        t[c],
        e[c],
        r.easing(u)
      ) : B(t[c]) && B(e[c]) ? x[c] = q(
        t[c],
        e[c],
        r.easing(u)
      ) : T(t[c]) && T(e[c]) && (x[c] = Y(
        t[c],
        e[c],
        r.easing(u)
      ));
    }), n(x, u >= 1, u), u < 1 && !l && requestAnimationFrame(i);
  }
  return requestAnimationFrame(i), s;
}
function k(t) {
  return 1 + 2.5 * Math.pow(t - 1, 3) + 1.5 * Math.pow(t - 1, 2);
}
function z(t) {
  return 1 - Math.pow(1 - t, 3);
}
function P(t) {
  return {
    x: t.x,
    y: t.y,
    width: t.width,
    height: t.height
  };
}
function N(t) {
  let e = t, n = 0, o = 0;
  for (; e; )
    n += e.offsetTop, o += e.offsetLeft, e = e.offsetParent;
  return {
    x: o,
    y: n,
    width: t.offsetWidth,
    height: t.offsetHeight
  };
}
function v(t, e) {
  let n = t, o = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1
  };
  typeof n.originalBorderRadius > "u" && (n.originalBorderRadius = window.getComputedStyle(n).borderRadius);
  const l = {
    el: () => n,
    id: () => e,
    setTransform: s,
    clearTransform: r,
    currentTransform: () => o,
    originalBorderRadius: () => A(n.originalBorderRadius),
    currentBorderRadius: () => A(window.getComputedStyle(n).borderRadius),
    layoutRect: () => N(n),
    boundingRect: () => P(n.getBoundingClientRect()),
    cssPosition: () => window.getComputedStyle(n).position
  };
  function s(i) {
    o = { ...o, ...i }, a();
  }
  function r() {
    o = {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1
    }, a();
  }
  function a() {
    const { translateX: i, translateY: y, scaleX: f, scaleY: u } = o;
    i === 0 && y === 0 && f === 1 && u === 1 ? n.style.transform = "" : n.style.transform = `translate(${i}px, ${y}px) scale(${f}, ${u})`;
  }
  return l;
}
function _({
  sourceViews: t,
  config: e
}) {
  const o = { ...{
    config: e,
    sourceViews: t,
    toggleStatus: /* @__PURE__ */ new Map(),
    targetViews: /* @__PURE__ */ new Map(),
    cancelAnimation: {
      blendy: null
    }
  } };
  function l(s) {
    const r = o.sourceViews.map(({ id: i }) => i()), a = s.filter(
      (i) => !r.includes(i.id())
    );
    o.sourceViews.push(...a), a.forEach((i) => {
      o.toggleStatus.set(i.id(), !1), o.targetViews.set(i.id(), null);
    });
  }
  return {
    sourceViewById: (s) => o.sourceViews.find((r) => s === r.id()),
    isToggled: (s) => o.toggleStatus.get(s) || !1,
    toggle: (s, r) => {
      o.toggleStatus.set(s, !0), o.targetViews.set(s, r);
    },
    untoggle: (s) => {
      o.toggleStatus.set(s, !1), o.targetViews.set(s, null);
    },
    targetView: (s) => o.targetViews.get(s),
    cancelAnimation: () => o.cancelAnimation,
    config: () => e,
    syncSourceViews: l
  };
}
const G = {
  animation: "dynamic"
};
function U(t) {
  switch (t) {
    case "dynamic":
      return { easing: z, duration: 450 };
    case "spring":
      return { easing: k, duration: 400 };
  }
}
function H(t) {
  const e = { ...G, ...t };
  let n = [];
  const o = _({ sourceViews: [], config: e });
  requestAnimationFrame(l);
  function l() {
    n = Array.from(
      document.querySelectorAll("[data-blendy-from]")
    ).map((i) => {
      const y = i;
      return v(y, y.dataset.blendyFrom);
    }), o.syncSourceViews(n);
  }
  function s(i, y) {
    o.isToggled(i) || requestAnimationFrame(() => {
      const f = o.sourceViewById(i), u = document.querySelector(
        `[data-blendy-to=${i}]`
      );
      if (u) {
        const g = v(u, i);
        o.toggle(i, g), C(f, g, o, y);
      }
    });
  }
  function r(i, y) {
    o.isToggled(i) && requestAnimationFrame(() => {
      const f = o.sourceViewById(i), u = o.targetView(i);
      f && (C(u, f, o, y), o.untoggle(i));
    });
  }
  function a() {
    requestAnimationFrame(() => {
      l();
    });
  }
  return {
    toggle: s,
    untoggle: r,
    update: a
  };
}
function C(t, e, n, o) {
  var c, S;
  (S = (c = n.cancelAnimation()).blendy) == null || S.call(c);
  const l = t.boundingRect(), s = e.boundingRect(), r = t.el().children[0], a = e.el().children[0], i = getComputedStyle(r).display === "inline", y = getComputedStyle(a).display === "inline", f = s.x - l.x, u = s.y - l.y, g = s.width / l.width, m = s.height / l.height, x = e.el().style.zIndex || "0";
  requestAnimationFrame(() => {
    e.el().style.opacity = "1", t.el().style.opacity = "1", e.el().style.pointerEvents = "", t.el().style.pointerEvents = "none", i && (r.style.display = "block"), y && (a.style.display = "block"), e.el().style.overflow = "hidden", t.el().style.overflow = "hidden";
  }), e.el().style.transformOrigin = "0 0", t.el().style.transformOrigin = "0 0", t.cssPosition() === "static" && (t.el().style.position = "relative"), e.cssPosition() === "static" && (e.el().style.position = "relative"), e.setTransform({
    translateX: -f,
    translateY: -u,
    scaleX: 1 / g,
    scaleY: 1 / m
  }), e.el().style.borderRadius = $(
    R(
      t.originalBorderRadius(),
      1 / g,
      1 / m
    )
  ), t.el().style.zIndex = `${Number(x + 1e3)}`, n.cancelAnimation().blendy = j(
    {
      translate: d(0, 0),
      scale: d(1, 1),
      borderRadius: t.originalBorderRadius()
    },
    {
      translate: d(f, u),
      scale: d(g, m),
      borderRadius: e.originalBorderRadius()
    },
    ({ translate: L, scale: p, borderRadius: b }, I, F) => {
      t.setTransform({
        translateX: L.x,
        translateY: L.y,
        scaleX: p.x,
        scaleY: p.y
      }), t.el().style.borderRadius = $(
        R(b, p.x, p.y)
      ), t.el().style.opacity = `${h(1, 0, F * 6)}`, r.style.transform = `scale(${1 / p.x}, ${1 / p.y})`, e.setTransform({
        translateX: L.x - f,
        translateY: L.y - u,
        scaleX: p.x / g,
        scaleY: p.y / m
      }), a.style.transform = `scale(${g / p.x}, ${m / p.y})`, e.el().style.borderRadius = $(
        R(b, p.x / g, p.y / m)
      ), I && (r.style.display = "", a.style.display = "", r.style.transform = "", a.style.transform = "", e.el().style.overflow = "", t.el().style.overflow = "", e.el().style.position = "", t.el().style.position = "", e.el().style.zIndex = "", t.el().style.zIndex = "", e.el().style.opacity = "", t.el().style.opacity = "0", t.el().style.pointerEvents = "none", t.clearTransform(), e.clearTransform(), t.el().style.transformOrigin = "", e.el().style.transformOrigin = "", t.el().style.borderRadius = "", e.el().style.borderRadius = "", o == null || o());
    },
    U(n.config().animation)
  );
}
export {
  H as createBlendy
};
