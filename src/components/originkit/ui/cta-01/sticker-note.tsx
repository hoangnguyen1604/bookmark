// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { useEffect, useRef, useState } from "react";

import StickerDrag from "@/components/originkit/ui/cta-01/draggable-sticker";

/**
 * One of the four notes pinned around the board — Figma `sticker 1`–`sticker 4`
 * (desktop 2410:7276 / 7297 / 7287 / 7264), rendered as a peelable, draggable
 * sticker rather than a flat crop.
 *
 * Each note is a single SVG, carrying the paper, its torn edge, the folded
 * corner, the handwriting and the clip or pin as one piece. StickerDrag wants
 * one image regardless — it uploads it as a WebGL texture and deforms it on a
 * 32 x 32 mesh — and having the clip inside the same file is what makes it peel
 * with the note rather than hang in the air above it.
 *
 * Two things about the files are load-bearing, and both live in the `<svg>` tag
 * rather than in this component.
 *
 * An SVG handed to an `<img>` rasterises at its *intrinsic* size, and that
 * bitmap is what reaches `texImage2D` — the vector does not help past that
 * point. Drawn at their natural ~243px these would upload a texture at half the
 * device resolution of the note on screen and read soft. So each file states a
 * width and height three times its `viewBox`, which is the one number that
 * decides texture sharpness here.
 *
 * The box is also square, and that is not cosmetic. StickerDrag scales the mesh
 * by `min(width, height) / (that side + padding)` and applies the one factor to
 * both axes, so a 225 x 244 box would draw the art 8% short across. The
 * `viewBox` is widened symmetrically to square instead of the art being moved,
 * so the note keeps its position inside the box.
 *
 * The artwork carries its own resting shadow, so `staticShadow` is transparent
 * and only the drag shadow is left to grow — the two stacked would read as a
 * double drop.
 *
 * The sizes in the caller are the artwork's own, not Figma's `sticker N` box,
 * which is smaller than the drawing and would render every note a few per cent
 * short. They were checked back against the frame renders: the paper lands
 * within a pixel at 1280 and 744, and at exactly 0.75 of that on the phone.
 *
 * StickerDrag needs its box in pixels while the layout is a set of breakpoint
 * classes, so the host reserves the note, measures itself, and mounts only
 * then. The measurement is rounded before it crosses into the component: it
 * sizes its backing store from it, and a fractional width lands that on an odd
 * pixel count.
 */

/** The SVG already carries the resting shadow; this is only the lift. */
const REST_SHADOW = "0px 0px 0px rgba(0, 0, 0, 0)";
const DRAG_SHADOW = "0px 18px 22px rgba(0, 0, 0, 0.30)";

type StickerNoteProps = {
  src: string;
  /** What the note says — the handwriting is inside the texture. */
  label: string;
  /** Placement and per-breakpoint width. No `z-*`: see `section-cta`. */
  className?: string;
};

export const StickerNote = ({
  src,
  label,
  className = "",
}: StickerNoteProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    setSize(Math.round(host.getBoundingClientRect().width));
    const observer = new ResizeObserver(([entry]) =>
      setSize(Math.round(entry.contentRect.width)),
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={`Sticky note: ${label}`}
      className={`absolute aspect-square ${className}`}
    >
      {size > 0 && (
        <StickerDrag
          image={src}
          imageWidth={size}
          imageHeight={size}
          tilt={28}
          elevation={6}
          /* Paper, not vinyl — the design carries no sheen across the notes. */
          lighting={false}
          staticShadow={REST_SHADOW}
          dynamicShadow={DRAG_SHADOW}
        />
      )}
    </div>
  );
};
