/**
 * External destinations surfaced by the floating island.
 *
 * This is the single source of truth for the island's outbound links — edit a
 * value here and it flows straight through to the popovers; no other file
 * needs to change.
 */

export interface NamedLink {
  label: string;
  href: string;
}

/**
 * Social profiles shown in the Messages (chat icon) popover. Add more entries
 * to this array and they render automatically, in order.
 */
export const SOCIAL_LINKS: NamedLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nickoh-archive" },
  { label: "Instagram", href: "https://www.instagram.com/nichawyee" },
];

/**
 * CV file offered by the Résumé (document icon) popover. The file lives at
 * /public/nicholas-koh-resume.pdf — swap that file to update the CV.
 */
export const CV_FILE = "/nicholas-koh-resume.pdf";

/**
 * Direct contact channels shown in the Contact (envelope icon) popover.
 */
export const CONTACT = {
  // Used as mailto:<email>.
  email: "nicklozekoh@gmail.com",
  // WhatsApp number: country code + number, digits only. Used as wa.me/<whatsapp>.
  whatsapp: "6593362344",
};
