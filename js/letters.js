/*
 * letters.js
 * Hand-built stroke paths for printed letters, plus a layout helper that turns
 * any word or phrase into numbered, ordered strokes on 4-line handwriting paper.
 *
 * Coordinate system (per text line, y grows downward):
 *   AT = 15   top line (capitals, tall letters)
 *   XT = 60   middle dashed line (x-height)
 *   BL = 110  baseline
 *   DT = 155  bottom line (descenders: g j p q y)
 *
 * Each glyph = { w: advance width, s: [stroke, stroke, ...] }
 * Each stroke is an array of [x, y] points, listed in the order a child draws them.
 */
(function (root) {
  'use strict';

  const AT = 15, XT = 60, BL = 110, DT = 155;
  const LINE_H = 175, GAP = 12, SPACE = 40, PAD = 28, TIGHT = 3;

  // Sample an elliptical arc. Angles in degrees, counterclockwise on screen is "increasing".
  function arc(cx, cy, rx, ry, a0, a1) {
    const n = Math.max(4, Math.ceil(Math.abs(a1 - a0) / 6));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
      pts.push([cx + rx * Math.cos(a), cy - ry * Math.sin(a)]);
    }
    return pts;
  }

  const ln = (x1, y1, x2, y2) => [[x1, y1], [x2, y2]];

  // Join several point lists into one stroke, dropping duplicate joints.
  function join() {
    const out = [];
    for (const part of arguments) {
      for (const pt of part) {
        const last = out[out.length - 1];
        if (!last || Math.abs(last[0] - pt[0]) > 0.01 || Math.abs(last[1] - pt[1]) > 0.01) out.push(pt);
      }
    }
    return out;
  }

  // Round "bowl" shared by a, c, d, e, g, o, q
  const bowl = (a0, a1) => arc(27, 85, 24, 25, a0, a1);

  const G = {
    a: { w: 60, s: [bowl(45, 360), ln(51, XT, 51, BL)] },
    b: { w: 58, s: [ln(5, AT, 5, BL), arc(29, 85, 24, 25, 180, -180)] },
    c: { w: 56, s: [bowl(45, 315)] },
    d: { w: 60, s: [bowl(45, 360), ln(51, AT, 51, BL)] },
    e: { w: 58, s: [join(ln(3, 85, 51, 85), bowl(0, 315))] },
    f: { w: 50, s: [join(arc(38, 35, 16, 20, 25, 180), ln(22, 35, 22, BL)), ln(6, XT, 40, XT)] },
    g: { w: 60, s: [bowl(45, 360), join(ln(51, XT, 51, 135), arc(30, 135, 21, 20, 0, -150))] },
    h: { w: 56, s: [ln(5, AT, 5, BL), join(arc(28, 88, 23, 28, 180, 0), ln(51, 88, 51, BL))] },
    i: { w: 22, s: [ln(11, XT, 11, BL), ln(11, 34, 11, 35)] },
    j: { w: 40, s: [join(ln(30, XT, 30, 135), arc(12, 135, 18, 20, 0, -120)), ln(30, 34, 30, 35)] },
    k: { w: 54, s: [ln(5, AT, 5, BL), ln(45, XT, 5, 88), ln(20, 77, 50, BL)] },
    l: { w: 16, s: [ln(8, AT, 8, BL)] },
    m: {
      w: 88,
      s: [
        ln(5, XT, 5, BL),
        join(arc(24, 80, 19, 20, 180, 0), ln(43, 80, 43, BL)),
        join(arc(62, 80, 19, 20, 180, 0), ln(81, 80, 81, BL)),
      ],
    },
    n: { w: 58, s: [ln(5, XT, 5, BL), join(arc(28, 82, 23, 22, 180, 0), ln(51, 82, 51, BL))] },
    o: { w: 54, s: [arc(27, 85, 24, 25, 90, 450)] },
    p: { w: 58, s: [ln(5, XT, 5, DT), arc(29, 85, 24, 25, 180, -180)] },
    q: { w: 60, s: [bowl(45, 360), ln(51, XT, 51, DT)] },
    r: { w: 44, s: [ln(5, XT, 5, BL), arc(25, 78, 20, 18, 180, 50)] },
    s: { w: 50, s: [join(arc(26, 72, 20, 12, 35, 270), arc(26, 97, 22, 13, 90, -160))] },
    t: { w: 46, s: [join(ln(20, 25, 20, 98), arc(36, 98, 16, 12, 180, 300)), ln(4, XT, 38, XT)] },
    u: { w: 56, s: [join(ln(5, XT, 5, 88), arc(28, 88, 23, 22, 180, 360)), ln(51, XT, 51, BL)] },
    v: { w: 56, s: [[[3, XT], [28, BL], [53, XT]]] },
    w: { w: 62, s: [[[3, XT], [16, BL], [31, XT], [46, BL], [59, XT]]] },
    x: { w: 54, s: [ln(3, XT, 50, BL), ln(50, XT, 3, BL)] },
    y: { w: 58, s: [ln(3, XT, 28, BL), ln(53, XT, 5, DT)] },
    z: { w: 54, s: [[[3, XT], [50, XT], [3, BL], [50, BL]]] },
    // capitals we need so far
    I: { w: 40, s: [ln(20, AT, 20, BL), ln(8, AT, 32, AT), ln(8, BL, 32, BL)] },
    T: { w: 60, s: [ln(5, AT, 55, AT), ln(30, AT, 30, BL)] },
    '-': { w: 36, s: [ln(5, 85, 31, 85)] },

    // capitals used in the sentence patterns (stroke order as taught: top to bottom, left to right)
    B: {
      w: 64,
      s: [
        ln(6, AT, 6, BL),
        join(ln(6, AT, 28, AT), arc(28, 37, 22, 22, 90, -90), ln(28, 59, 6, 59)),
        join(ln(6, 59, 30, 59), arc(30, 84.5, 25, 25.5, 90, -90), ln(30, BL, 6, BL)),
      ],
    },
    C: { w: 66, s: [arc(36, 62.5, 30, 47.5, 40, 320)] },
    G: { w: 70, s: [arc(36, 62.5, 30, 47.5, 40, 360), ln(66, 62.5, 38, 62.5)] },
    H: { w: 62, s: [ln(6, AT, 6, BL), ln(52, AT, 52, BL), ln(6, 62, 52, 62)] },
    M: { w: 74, s: [ln(6, BL, 6, AT), ln(6, AT, 34, BL), ln(34, BL, 62, AT), ln(62, AT, 62, BL)] },
    N: { w: 62, s: [ln(6, BL, 6, AT), ln(6, AT, 52, BL), ln(52, BL, 52, AT)] },
    O: { w: 68, s: [arc(34, 62.5, 30, 47.5, 90, 450)] },
    P: { w: 58, s: [ln(6, AT, 6, BL), join(ln(6, AT, 28, AT), arc(28, 42, 24, 27, 90, -90), ln(28, 69, 6, 69))] },
    S: { w: 62, s: [join(arc(31, 39, 22, 24, 40, 270), arc(31, 86, 25, 24, 90, -140))] },
    W: { w: 92, s: [[[4, AT], [24, BL], [46, AT], [68, BL], [88, AT]]] },

    // punctuation (t: 1 means "sit close to the letter before me")
    '.': { w: 20, t: 1, s: [ln(8, 106, 8, 107)] },
    ',': { w: 20, t: 1, s: [[[9, 102], [8, 112], [3, 122]]] },
    '!': { w: 18, t: 1, s: [ln(8, AT, 8, 82), ln(8, 106, 8, 107)] },
    '?': { w: 52, t: 1, s: [join(arc(26, 38, 20, 22, 160, -80), [[26, 68], [26, 84]]), ln(26, 106, 26, 107)] },
    "'": { w: 14, t: 1, s: [ln(7, 17, 5, 38)] },
  };

  const glyphFor = (ch) => G[ch] || G[ch.toLowerCase()] || null;

  function wordWidth(word) {
    let w = 0, first = true;
    for (const ch of word) {
      const g = glyphFor(ch);
      if (!g) continue;
      w += (first ? 0 : g.t ? TIGHT : GAP) + g.w;
      first = false;
    }
    return w;
  }

  const fmt = (n) => Math.round(n * 10) / 10;
  const toPath = (pts, dx, dy) =>
    pts.map((p, i) => (i ? 'L' : 'M') + fmt(p[0] + dx) + ' ' + fmt(p[1] + dy)).join(' ');

  /**
   * layout("nice to meet you") ->
   *   { width, height, lineCount, glyphs: [{ ch, line, strokes: [{ d, start:[x,y] }] }] }
   * Long phrases wrap onto extra writing lines.
   */
  function layout(text, maxLine) {
    maxLine = maxLine || 700;
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [{ words: [], w: 0 }];
    words.forEach((wd) => {
      const ww = wordWidth(wd);
      let line = lines[lines.length - 1];
      const need = (line.words.length ? SPACE : 0) + ww;
      if (line.words.length && line.w + need > maxLine) {
        line = { words: [], w: 0 };
        lines.push(line);
        line.w = ww;
      } else {
        line.w += need;
      }
      line.words.push(wd);
    });

    const glyphs = [];
    let widest = 0;
    lines.forEach((line, li) => {
      widest = Math.max(widest, line.w);
      let x = PAD;
      const dy = li * LINE_H;
      line.words.forEach((wd, wi) => {
        let first = true;
        for (const ch of wd) {
          const g = glyphFor(ch);
          if (!g) continue;
          if (!first) x += g.t ? TIGHT : GAP;
          first = false;
          glyphs.push({
            ch,
            line: li,
            punct: !!g.t,
            strokes: g.s.map((pts) => ({
              d: toPath(pts, x, dy),
              start: [fmt(pts[0][0] + x), fmt(pts[0][1] + dy)],
            })),
          });
          x += g.w;
        }
        if (wi < line.words.length - 1) x += SPACE;
      });
    });

    return {
      width: widest + PAD * 2,
      height: lines.length * LINE_H,
      lineCount: lines.length,
      glyphs,
    };
  }

  const Letters = { layout, glyphFor, metrics: { AT, XT, BL, DT, LINE_H } };
  root.Letters = Letters;
  if (typeof module !== 'undefined' && module.exports) module.exports = Letters;
})(typeof window !== 'undefined' ? window : globalThis);
