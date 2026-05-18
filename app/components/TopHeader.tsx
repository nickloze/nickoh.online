import { ChevronRight } from "lucide-react";

export default function TopHeader() {
  return (
    <header className="flex items-start border-b-[0.0781vw] border-divider bg-header px-[1.6667vw] py-[1.25vw]">
      <div className="flex items-start gap-[1.6667vw]">
        <p className="text-[1.4583vw] leading-none tracking-[-0.01em] text-text-strong whitespace-nowrap">
          Nicholas&rsquo; Online Work Documentation
        </p>
        <div className="flex items-center gap-[0.2083vw]">
          <span className="text-[1.4583vw] leading-none tracking-[-0.01em] text-text-faint whitespace-nowrap">
            Welcome
          </span>
          <ChevronRight
            className="h-[1.7708vw] w-[1.7708vw] text-text-faint"
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="text-[1.4583vw] leading-none tracking-[-0.01em] text-white whitespace-nowrap">
            Online Home
          </span>
        </div>
      </div>
    </header>
  );
}
