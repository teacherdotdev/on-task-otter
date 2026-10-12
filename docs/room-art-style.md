# Room art house style: "cozy"

Every room item lives in `src/assets/room-items/<id>.svg` and is placed by
`src/data/roomLayouts.js`. The otter lives in `src/components/Otter/Otter.jsx`
(colours in `src/dashboard.css`). This page is the shared brief for all of them.

## The feeling

A warm, lived-in storybook home on a rainy afternoon. Soft, plump, rounded,
slightly imperfect. Things look *used and loved*: a blanket draped rather than
folded flat, books leaning, a mug that steams, cushions that sag a little.

## Line

- One outline ink everywhere: **`#5a3d2b`** (warm cocoa). Never green-grey,
  never black.
- Round caps and joins on everything.
- **Outline width is set by display size**, so every item shows the same
  ~2.5px line on screen. For an item shown `D` px wide with a viewBox `W` units
  wide: `stroke-width = 2.5 × W ÷ D` (round to 0.5). Each item's `D` is in the
  brief. Inner detail lines (seams, wood grain, knit) use about 60% of that,
  at `opacity` .35–.6.

## Shape

- Plump and soft: generous corner radii (`rx` ≥ 15% of the shape's short side),
  cushions bulge, tops sag a touch. Avoid long perfectly straight edges on soft
  things; hard things (wood, ceramic) can be straight but with rounded corners.
- Slight tilt and asymmetry are welcome (a pillow at −8°, a leaning book).
- A gentle three-quarter-front view: you can see a sliver of the top surface of
  tables, beds and seats. Rugs are seen from a low angle (wide flat ellipse or
  trapezoid).
- Big shapes first. 15–50 shapes is normal for furniture; small objects 8–25.

## Colour

Warm and a little muted — no pure saturated hues, no cold greys.

| Role | Colours |
| --- | --- |
| Outline | `#5a3d2b` |
| Woods | honey `#d9a066`, walnut `#a86f45`, light oak `#e8c290` |
| Creams | cream `#fbf1dc`, oatmeal `#ead9bd` |
| Fabrics | terracotta `#d9785a`, mustard `#e8b44f`, sage `#9bb58a`, dusty rose `#e3a3a0`, denim `#7f9cc0`, plum `#a98fbf` |
| Greens | leaf `#7fae6e`, deep leaf `#5b8c5a`, light leaf `#a8cc8c` |
| Ceramics/metal | clay `#c9714f`, brass `#d8a84a`, teal glaze `#6fa7a0` |
| Warm light | glow `#ffe7a3` |

- **Shade with the outline ink**, not new colours: `#5a3d2b` at `opacity`
  .12–.22 on the underside / shadow side. **Highlights** with `#fff8ea` at
  .35–.55 on the lit (upper-left) side. Light comes from the upper left.
- Two touching shapes need clearly different values, or the edge vanishes.
- Lamps and candles may add a soft glow: one or two concentric circles of
  `#ffe7a3` at opacity .25–.4 behind the light source. No gradients, filters or
  blurs otherwise.

## Cozy texture (use a little, not a lot)

- Fabric: a stitched seam (dashed line, dashes ≥ 3 display px), one tuft button,
  a knit cable (two rows of small V's), a quilt patch.
- Wood: one or two grain curves, never a field of lines.
- Plants: overlapping leaves in 2–3 greens, a centre vein on big leaves.
- Steam: two or three soft S-curves above hot things.

## Technical

- `viewBox` only (keep the item's existing viewBox width of 240 and change the
  height only if the drawing needs it). Integer or .5 coordinates.
- Fill 90–100% of the viewBox width; the **bottom of the drawing touches the
  bottom of the viewBox** (items are placed by their bottom edge on the floor or
  on a surface). Wall items: just a small margin all round.
- No `<text>`, `<image>`, filters, scripts, fonts or external refs. Any ids must
  be prefixed with the item id.
- No drop shadow under the item: the room adds one.
