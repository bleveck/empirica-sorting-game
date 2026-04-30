// ── POLI 172 Lecture Slides Template ──────────────────────────────
// Matches the Keynote slide style: cream background, red Baskerville
// titles, thin gray rules, ◆ diamond bullets.
//
// Usage:
//   #import "../../templates/lecture-slides.typ": *
//   #show: lecture-slides
//
// Then build slides with the provided functions:
//   #title-slide([Title], [Subtitle])
//   #slide([Title])[Content]
//   #section-slide([Title], subtitle: [Optional])
//   #img-slide([Title], [Text], image("img.jpg", width: 90%), caption: [Optional])
//
// For the last slide, use #stitle and raw content (no trailing pagebreak):
//   #stitle([Final Slide Title])
//   Content here...

// ── Theme colors ─────────────────────────────────────────────────
#let cream       = rgb("#f5f0e8")
#let title-red   = rgb("#c23b22")
#let rule-gray   = rgb("#bfb5a3")
#let body-dark   = rgb("#3a3a3a")
#let caption-clr = rgb("#999999")

// ── Horizontal rule ──────────────────────────────────────────────
#let hrule() = line(length: 100%, stroke: 0.5pt + rule-gray)

// ── Slide title bar (rules + centered red heading) ───────────────
#let stitle(t) = {
  hrule()
  v(4pt)
  align(center, text(size: 30pt, fill: title-red)[#t])
  v(4pt)
  hrule()
  v(12pt)
}

// ── Title slide (large title left, subtitle right) ───────────────
#let title-slide(title, subtitle) = {
  v(1fr)
  hrule()
  v(8pt)
  grid(
    columns: (auto, 1fr),
    column-gutter: 16pt,
    align(left + horizon, text(size: 32pt, fill: title-red)[#title]),
    align(left + horizon,
      box(
        inset: (left: 14pt),
        stroke: (left: 0.5pt + rule-gray),
        text(size: 14pt, fill: body-dark)[#subtitle],
      ),
    ),
  )
  v(8pt)
  hrule()
  v(0.3fr)
  pagebreak()
}

// ── Section divider (centered large title) ───────────────────────
#let section-slide(title, subtitle: none) = {
  v(1fr)
  align(center, text(size: 36pt, fill: title-red)[#title])
  if subtitle != none {
    v(8pt)
    align(center, text(size: 18pt, fill: body-dark, style: "italic")[#subtitle])
  }
  v(1fr)
  pagebreak()
}

// ── Standard content slide ───────────────────────────────────────
#let slide(title, body) = {
  stitle(title)
  body
  pagebreak()
}

// ── Content-left / image-right slide ─────────────────────────────
// The `img` parameter accepts content (e.g. `image("path.jpg", width: 90%)`)
// so that image paths resolve relative to the calling file, not this template.
#let img-slide(
  title,
  body-content,
  img,
  caption: none,
) = {
  stitle(title)
  grid(
    columns: (1fr, 1fr),
    column-gutter: 16pt,
    {
      set text(size: 14pt)
      body-content
    },
    align(center + horizon, {
      img
      if caption != none {
        v(4pt)
        text(size: 9pt, fill: caption-clr, style: "italic")[#caption]
      }
    }),
  )
  pagebreak()
}

// ── Main template function ───────────────────────────────────────
#let lecture-slides(doc) = {
  // 4:3 presentation page
  set page(
    width: 254mm,
    height: 190.5mm,
    margin: (left: 28mm, right: 28mm, top: 22mm, bottom: 18mm),
    fill: cream,
  )

  set text(font: "Baskerville", size: 18pt, fill: body-dark)
  set par(leading: 0.75em)
  set list(
    marker: text(fill: title-red, size: 10pt)[◆],
    indent: 0em,
    body-indent: 0.5em,
    spacing: 12pt,
  )
  set enum(indent: 0em, body-indent: 0.5em, spacing: 12pt)

  doc
}
