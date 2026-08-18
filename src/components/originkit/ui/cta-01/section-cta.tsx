// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import { BoardMarks, BoardRules } from "@/components/originkit/ui/cta-01/board-backdrop";
import { EmailCapture } from "@/components/originkit/ui/cta-01/email-capture";
import { StickerNote } from "@/components/originkit/ui/cta-01/sticker-note";

function asset(file: string) {
  return `/originkit/cta-01/${file}`;
}

/**
 * Figma frames:
 * - Mobile  2410:6841 — 402 x 874
 * - iPad    2410:6997 — 744 x 1133  (`ipad:`)
 * - Desktop 2410:7153 — 1280 x 617  (`desktop-sm:`)
 *
 * A waitlist plate floating on a ruled pinboard, with four handwritten notes
 * clipped and pinned around its edges. The notes are the section — they peel
 * and drag, which is why the frame is called `Draggable Sticker`.
 *
 * Two anchors, and everything follows one of them. The plate is centred and the
 * whole lattice hangs off it, so the rules, the four sparkles on its corners
 * and the three faint note marks all stay in register at any width (see
 * `board-backdrop`). The notes anchor to the board's own edges instead, because
 * that is what they do at every frame — Figma hangs each one off the nearest
 * edge, several of them half outside it.
 *
 * Height is where the three frames disagree and it needs deciding rather than
 * inheriting. The phone and tablet frames are device height already; desktop is
 * a 617px band, which would end a third of the way down a laptop and leave bare
 * page under it. So Figma's height is the floor everywhere and the surplus is
 * split: notes 1 and 4 hold the top edge, notes 2 and 3 the bottom, and the
 * plate stays centred between them. At exactly 1280 x 617 that reproduces the
 * desktop frame; as the board grows, the right-hand pair — which desktop stacks
 * because it has no room — opens into the four-corner arrangement the phone and
 * tablet frames already use.
 *
 * That only holds while the board is the design's own size, which is why it is
 * a band with Figma's height rather than the viewport's. Pinned to the screen it
 * stretched: on a tall monitor the notes end hundreds of pixels from a plate
 * they are supposed to be crowding, and on a 4K screen at 100% — 2160 tall — the
 * section reads as four stickers marooned around a tiny island. The height is
 * the composition here, not a container to fill, so it is stated and left alone:
 * 874 / 1133 / 617.
 *
 * The rules stay on `<main>` rather than the band, so the lattice still runs to
 * all four edges of whatever screen it is on. That is the whole trick — the
 * page is the pinboard and the board is only the arrangement on it, so the
 * surplus on a tall screen comes out as more pinboard rather than as a stretched
 * composition. Both are centred, so the rules stay in phase with the plate at
 * any size.
 *
 * No `z-*` on the notes, and that is load-bearing. StickerDrag lifts the note
 * being dragged by writing an incrementing z-index onto its own container; a
 * z-index on the wrapper would make it a stacking context and trap that value
 * inside. Leaving the wrappers at `auto` puts them in the same painting group
 * as the `z-0` layers, ordered by DOM position, so at rest they sit above the
 * plate and on drag the note jumps clear of everything.
 */

/**
 * Each note ships as one square SVG — see `sticker-note` for why the box is the
 * artwork's own size rather than Figma's `sticker N` box, and why it is square.
 *
 * The widths are the SVGs' own; the phone draws all four at exactly 0.75 of
 * them. Every offset was read back off the frame renders by locating the paper
 * itself, so they place the note you can see rather than a bounding box that
 * includes a shadow. Where a note hangs off an edge its offset comes from the
 * edge it is *not* clipped on — the clipped side reports the frame's own border
 * and would place notes 3 and 1 tens of pixels too far in.
 */
const NOTES = [
  {
    id: "note-1",
    label: "Good! Redesign the button",
    className:
      "top-[51.5px] left-[-36.88px] w-[183px] ipad:top-[31px] ipad:left-[-37.5px] ipad:w-[244px]",
  },
  {
    id: "note-4",
    label: "Keep track of critical details",
    className:
      "top-[18px] right-[-27.88px] w-[182.25px] ipad:top-[65px] ipad:right-[-10.5px] ipad:w-[243px] desktop-sm:right-[-7.5px]",
  },
  {
    id: "note-3",
    label: "This needs to be done ASAP",
    className:
      "bottom-[20.38px] left-[-53.38px] w-[192px] ipad:bottom-[102.5px] ipad:left-[-29.5px] ipad:w-[256px] desktop-sm:bottom-[15.5px] desktop-sm:left-[-4px]",
  },
  {
    id: "note-2",
    label: "Pay attention to details",
    className:
      "bottom-[1.12px] right-[-31.5px] w-[182.25px] ipad:bottom-[76.5px] ipad:right-[-49px] ipad:w-[243px] desktop-sm:bottom-[128.5px] desktop-sm:right-[-27px]",
  },
];

export const SectionCta = () => (
  <main className="animate-hero-reveal relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#f1f1e9]">
    <BoardRules />

    {/* The board the notes are pinned to — Figma's frame, at Figma's size, in
        the middle of whatever screen it lands on. Width still runs to the
        viewport up to 1600 because the notes hang off the left and right edges
        and the design has them near the margins; height does not, because the
        design has nothing holding the top and bottom edges apart. */}
    <div className="relative flex h-[874px] w-full max-w-[1600px] items-center justify-center ipad:h-[1133px] desktop-sm:h-[617px]">
      {/* The plate carries the board colour so the rules stop at its edge — the
        clear band behind the headline is Figma's own opaque fill, not a fade.
        Its height is a floor rather than Figma's fixed 402/420, so a narrow
        phone that wraps the sub onto a fourth line grows the plate instead of
        pushing the copy out of it.

        `border-t`/`border-l` put back the two rules the fill covers. A 1px rule
        at position p paints [p, p+1], and the plate spans [left, right): the
        rules on its right and bottom edges therefore land just outside it and
        survive, while the ones on its left and top land on the first pixel it
        paints and disappear. Figma shows the plate outlined on all four sides,
        so those two are redrawn as borders — box-sizing is border-box, so they
        occupy exactly the pixels the lattice would have. Only two sides: a full
        `border` would double up on the right and bottom, where the rule is
        already there. */}
      <div className="relative z-0 flex w-full max-w-[402px] min-h-[402px] flex-col items-center justify-center gap-[24px] border-t border-l border-solid border-[#eaeadf] bg-[#f1f1e9] p-[16px] ipad:w-[588px] ipad:max-w-none ipad:min-h-[420px] ipad:gap-[40px]">
        <div className="flex w-full flex-col items-center gap-[8px] ipad:gap-[16px]">
          <p className="rounded-[4px] border border-solid border-[#ddd] px-[8px] py-[6px] font-geist text-[12px] leading-[1.4] whitespace-nowrap text-[#2a2722] ipad:px-[12px] ipad:py-[8px] ipad:text-[14px]">
            2,500+ early adopters
          </p>

          {/*
          Tracking is Figma's -1.28px at 32 and -1.92px at 48, which is -0.04em
          at both — one ratio rather than two numbers that agree by accident.
        */}
          {/*
          No `text-balance`: Figma breaks after "Before" at both frames, which
          is where the plate's own width puts the break. Balancing moves it up
          to after "Access" and gives the headline a different silhouette.
        */}
          <h1 className="text-center font-hedvig-serif text-[32px] leading-[1.1] tracking-[-0.04em] text-[#2a2722] ipad:text-[48px]">
            Get Early Access Before Everyone Else
          </h1>

          <p className="max-w-[340px] text-center font-geist text-[14px] leading-[1.4] text-pretty text-black opacity-60 ipad:max-w-none ipad:text-[16px]">
            Join the waitlist to be among the first to experience the platform.
            Get exclusive early access, product updates, and launch-only perks.
          </p>
        </div>

        <EmailCapture />
      </div>

      {/* After the plate, so the sparkles on its corners keep their full ring —
          Figma draws them unbroken across it. */}
      <BoardMarks />

      {NOTES.map(({ id, label, className }) => (
        <StickerNote
          key={id}
          src={asset(`${id}.svg`)}
          label={label}
          className={className}
        />
      ))}
    </div>
  </main>
);
