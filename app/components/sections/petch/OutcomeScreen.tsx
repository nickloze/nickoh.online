import Image from "next/image";

const OUTCOME_BODY =
  "Petch gamifies the chat-based AI experience to make learning about your health genuinely fun, not another chore. Every healthy action you take earns a reward, turning engagement into something purposeful rather than performative. It’s how Petch bridges knowing into doing, building health literacy one rewarded habit at a time.";

/**
 * @mobile — screen 4 of the Petch case study (Figma 290:5028). Unlike the three
 * paginated screens, the Outcome screen scrolls inside its own snap page: the
 * closing imagery runs at full frame width and the page grows taller than the
 * viewport, so the brand lockup and final in-hand shot read at full size rather
 * than being squeezed into a single swipe.
 */
export default function OutcomeScreen() {
  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto">
      <div className="mx-auto flex w-[calc(100vw-36px)] max-w-[440px] flex-col gap-6 pt-[calc(env(safe-area-inset-top)+54px)] pb-[calc(env(safe-area-inset-bottom)+100px)]">
        <Image
          src="/figma/petch/outcome1.png"
          alt="The Petch brand lockup above a phone showing the app"
          width={900}
          height={1035}
          sizes="440px"
          className="h-auto w-full"
        />
        <p className="text-[14px] text-ink">{OUTCOME_BODY}</p>
        <Image
          src="/figma/petch/outcome2.png"
          alt="The Petch app held in hand"
          width={900}
          height={1350}
          sizes="440px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
