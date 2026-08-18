// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { useState, type FormEvent } from "react";

/**
 * The waitlist row — Figma 2410:6849 (mobile) / 2410:7005 (tablet) /
 * 2410:7161 (desktop).
 *
 * A field and a submit sharing a row, both 4px-rounded. Figma gives the row the
 * plate's full width on the phone and pins it to 450px from tablet up, so the
 * field is the flexible half and the button is only as wide as its label — the
 * same split at all three frames.
 *
 * Figma states the row height outright (48 on the phone, 50 above it) rather
 * than letting the 16px padding set it, so it is written as a height here. Its
 * mobile button is drawn a pixel shorter than the field; `items-stretch` gives
 * both the same 48, because a row whose two halves disagree by a pixel is the
 * more visible of the two errors.
 */
export const EmailCapture = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-[48px] w-full items-stretch gap-[8px] ipad:h-[50px] ipad:w-[450px]"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        aria-label="Email address"
        className="min-w-0 flex-1 touch-manipulation rounded-[4px] border border-solid border-[#dedede] bg-[#f5f5f5] px-[16px] font-geist text-[16px] leading-[1.4] text-[#2a2722] placeholder:text-[#2a2722] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#203331] ipad:px-[24px]"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-[4px] bg-[#203331] px-[16px] font-geist text-[16px] leading-[1.4] whitespace-nowrap text-white transition-[opacity,transform] duration-200 ease-out [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#203331] active:scale-[0.97] motion-reduce:active:scale-100 ipad:px-[24px] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-90"
      >
        Get Notified
      </button>
    </form>
  );
};
