import Image from "next/image";
import ScreenColumn from "./ScreenColumn";

const OUTCOME_BODY =
  "Petch gamifies the chat-based AI experience to make learning about your health genuinely fun, not another chore. Every healthy action you take earns a reward, turning engagement into something purposeful rather than performative. It’s how Petch bridges knowing into doing, building health literacy one rewarded habit at a time.";

/**
 * @mobile — screen 4 of the Petch case study (Figma 290:5028). The closing
 * screen is expressive rather than interactive: the brand lockup, a statement
 * of what Petch is for, and a final in-hand shot of the app.
 */
export default function OutcomeScreen() {
  return (
    <ScreenColumn className="gap-3">
      <div className="relative min-h-0 w-full flex-1">
        <Image
          src="/figma/petch/outcome1.png"
          alt="The Petch brand lockup above a phone showing the app"
          fill
          sizes="300px"
          className="object-contain"
        />
      </div>
      <p className="text-[14px] text-ink">{OUTCOME_BODY}</p>
      <div className="relative min-h-0 w-full flex-1">
        <Image
          src="/figma/petch/outcome2.png"
          alt="The Petch app held in hand"
          fill
          sizes="300px"
          className="object-contain"
        />
      </div>
    </ScreenColumn>
  );
}
