import Image from "next/image";
import { PETCH } from "../../../lib/sections";
import TagPill from "../../ui/TagPill";
import ScreenColumn from "./ScreenColumn";

/**
 * @mobile — screen 1 of the Petch case study (Figma 275:4105). Matches the
 * existing project detail layout — hero, title, overview copy, tags. Swiping up
 * snaps to the Research screen.
 */
export default function OverviewScreen() {
  return (
    <ScreenColumn>
      <div className="relative min-h-0 w-full flex-1">
        <Image
          src={PETCH.hero}
          alt="The Petch app open on a phone"
          fill
          sizes="300px"
          loading="eager"
          className="object-contain"
        />
      </div>

      <article className="mt-3 flex flex-col gap-3">
        <header className="flex flex-col">
          <h1 className="text-[20px] text-ink">{PETCH.name}</h1>
          <p className="text-[20px] text-muted">{PETCH.subtitle}</p>
        </header>
        <p className="text-[14px] text-ink">{PETCH.overview}</p>
        <div className="flex flex-wrap gap-1">
          {PETCH.tags.map((tag) => (
            <TagPill key={tag} size="sm">
              {tag}
            </TagPill>
          ))}
        </div>
      </article>
    </ScreenColumn>
  );
}
