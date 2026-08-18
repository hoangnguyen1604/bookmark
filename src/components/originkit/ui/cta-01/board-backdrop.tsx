// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

function asset(file: string) {
  return `/originkit/cta-01/${file}`;
}

/**
 * The pinboard the copy sits on — Figma `Rectangle 1430107508` and the marks
 * scattered over it (mobile 2410:6841, tablet 2410:6997, desktop 2410:7153).
 *
 * Every mark here is a function of one square. Figma rules the board at 84px on
 * tablet and desktop and at 80.4px on the phone, then lands everything on that
 * lattice: the copy plate is exactly 7 x 5 cells (5 x 5 on the phone), the four
 * sparkles sit on its corners, and the three faint note marks are whole numbers
 * of cells out from it. So the plate is the origin, not the frame — `--cell`
 * plus the plate's half-width and half-height carry all three breakpoints and
 * nothing here holds a 1280-only pixel.
 *
 * Figma puts the plate 10px left of the desktop frame centre and ~15px above
 * it, which is the designer snapping to the lattice rather than a placement.
 * The plate is centred here and the lattice hangs off it instead, so the
 * sparkles keep landing on its corners and the rules keep passing through them
 * at any width.
 *
 * The plate paints its own board colour over the rules, which is what opens the
 * clear band behind the headline — they genuinely stop at its edge in Figma
 * rather than fading under it. The marks are the other side of that: they are a
 * separate export so the caller can put them *above* the plate, where Figma has
 * them.
 */

/** Board `#f1f1e9`, rule `#eaeadf`, mark `#e1e1d1` — sampled off the frames. */
const RULE = "#eaeadf";

/**
 * Both rule sets are one-pixel lines tiled at the cell, so the pair is two
 * gradients rather than a stack of spans — there is no fluid `justify-between`
 * here because the pitch is fixed and the board bleeds past the stage.
 *
 * The phase is the fiddly part. In `background-position` a percentage aligns
 * the *tile's* midpoint with the container's, so `50%` resolves to
 * `(box - cell) / 2` and not `box / 2`; adding half a cell back cancels that
 * and lands the first rule exactly on the plate's edge. Absolutely positioned
 * marks below use plain `calc(50% - half)` because there the percentage is the
 * container outright.
 */
const RULES = `linear-gradient(to right, ${RULE} 0 1px, transparent 1px), linear-gradient(to bottom, ${RULE} 0 1px, transparent 1px)`;

/**
 * Cell offsets of the three note marks from the plate's top-left corner, as
 * literal class strings because Tailwind only compiles what it can read in the
 * source. Figma re-places all three at every frame rather than moving them, so
 * these are three unrelated coordinates and not one that drifts.
 */
const NOTE_MARKS = [
  "[--m:3] [--n:-3] ipad:[--m:3] ipad:[--n:-2] desktop-sm:[--m:-1] desktop-sm:[--n:3]",
  "[--m:1] [--n:-1] ipad:[--m:2] ipad:[--n:5] desktop-sm:[--m:7] desktop-sm:[--n:1]",
  "[--m:2] [--n:5] ipad:[--m:4] ipad:[--n:7] desktop-sm:[--m:8] desktop-sm:[--n:5]",
];

/** The plate's four corners, as multipliers on its half-width / half-height. */
const SPARKLES = [
  { id: "tl", x: -1, y: -1 },
  { id: "tr", x: 1, y: -1 },
  { id: "bl", x: -1, y: 1 },
  { id: "br", x: 1, y: 1 },
];

const corner = (sign: number, half: string) =>
  sign < 0 ? `calc(50% - ${half})` : `calc(50% + ${half})`;

/**
 * Figma draws each note mark as eight rounded bars — four pairs of a full line
 * and a short one, the shorthand for a paragraph. The 54 x 56 stack of bars is
 * the same at every frame; only the box around it re-pitches with the cell.
 */
const NoteMark = () => (
  <div className="flex w-[54px] flex-col gap-[8px]">
    {[0, 1, 2, 3].map((row) => (
      <div key={row} className="flex flex-col gap-[2px]">
        <div className="flex gap-[2px]">
          <span className="h-[3px] w-[26px] rounded-full bg-[#e1e1d1]" />
          <span className="h-[3px] w-[26px] rounded-full bg-[#e1e1d1]" />
        </div>
        <div className="flex gap-[2px]">
          <span className="h-[3px] w-[26px] rounded-full bg-[#e1e1d1]" />
          <span className="h-[3px] w-[12px] rounded-full bg-[#e1e1d1]" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * The lattice both layers hang off, as one string so they cannot drift apart.
 */
const ANCHOR =
  "[--cell:80.4px] [--half-h:201px] [--half-w:min(201px,50%)] ipad:[--cell:84px] ipad:[--half-h:210px] ipad:[--half-w:294px]";

/**
 * Two components rather than one, because the plate goes *between* them: the
 * rules are painted under it and stop at its edge, while the sparkles sit on
 * its corners and Figma draws their rings unbroken across it. Returning both
 * from a single component puts them on the same side of the plate and clips
 * the inner half of every ring, which is exactly what it looks like.
 */
export const BoardRules = () => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 z-0 ${ANCHOR}`}
    style={{
      backgroundImage: RULES,
      backgroundSize: "var(--cell) 100%, 100% var(--cell)",
      backgroundPosition:
        "calc(50% - var(--half-w) + var(--cell) / 2) 0, 0 calc(50% - var(--half-h) + var(--cell) / 2)",
    }}
  />
);

export const BoardMarks = () => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 z-0 ${ANCHOR}`}
  >
    {SPARKLES.map(({ id, x, y }) => (
      <img
        key={id}
        src={asset("sparkle.svg")}
        alt=""
        className="absolute block size-[40px] max-w-none -translate-x-1/2 -translate-y-1/2"
        style={{
          left: corner(x, "var(--half-w)"),
          top: corner(y, "var(--half-h)"),
        }}
      />
    ))}

    {NOTE_MARKS.map((cell) => (
      <div
        key={cell}
        className={`absolute size-[80px] pt-[12px] pl-[13px] ipad:size-[84px] ipad:pt-[14px] ipad:pl-[15px] ${cell}`}
        style={{
          left: "calc(50% - var(--half-w) + var(--m) * var(--cell))",
          top: "calc(50% - var(--half-h) + var(--n) * var(--cell))",
        }}
      >
        <NoteMark />
      </div>
    ))}
  </div>
);
