import Shell from "../components/Shell";

/* nickoh.online — one page, three tiers, same DOM (see Shell).

   The Shell lives here, in the layout, so it survives navigation between `/`
   and `/work/<slug>`: layouts are kept across routes, so the folder keeps its
   tab, the feed keeps its scroll position, and a project opens over the feed
   instead of replacing the page. The pages themselves render nothing — they
   exist for the URL, the server render and the metadata. The interaction lab
   under /test sits outside this group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Shell />
      {children}
    </>
  );
}
