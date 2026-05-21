import type { SVGProps } from "react";

/**
 * Line icons exported 1:1 from the Figma mobile frames. Stroke/fill use
 * `currentColor` so callers control colour with `text-*` utilities — which is
 * what drives the dot-nav and floating-island active states.
 */
type IconProps = SVGProps<SVGSVGElement>;

/** Books — floating island slot 1, and the Work Library label/title card. */
export function IconLibrary(props: IconProps) {
  return (
    <svg viewBox="0 0 25.2139 25.92" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.2933 0.96H2.29333C1.55695 0.96 0.96 1.55695 0.96 2.29333V23.6267C0.96 24.363 1.55695 24.96 2.29333 24.96H10.2933C11.0297 24.96 11.6267 24.363 11.6267 23.6267V2.29333C11.6267 1.55695 11.0297 0.96 10.2933 0.96Z"
        stroke="currentColor"
        strokeWidth="1.92"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.3004 0.96V24.96"
        stroke="currentColor"
        strokeWidth="1.92"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.1679 22.16C24.4345 22.8267 24.0345 23.6267 23.3679 23.8933L20.8345 24.8267C20.1679 25.0933 19.3679 24.6933 19.1012 24.0267L11.7679 3.76C11.5012 3.09333 11.9012 2.29333 12.5679 2.02667L15.1012 1.09333C15.7679 0.826666 16.5679 1.22667 16.8345 1.89333L24.1679 22.16Z"
        stroke="currentColor"
        strokeWidth="1.92"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Speech bubble — floating island slot 2. */
export function IconChat(props: IconProps) {
  return (
    <svg viewBox="0 0 27.7714 27.7714" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.56578 20.2604C3.66504 19.8095 3.62716 19.3392 3.45701 18.91C2.27299 16.4534 1.99468 13.6574 2.67119 11.0156C3.3477 8.37371 4.93555 6.05567 7.1546 4.47043C9.37364 2.8852 12.0813 2.13464 14.7998 2.35119C17.5183 2.56774 20.0729 3.73748 22.013 5.65402C23.9531 7.57057 25.154 10.1108 25.4037 12.8264C25.6535 15.5421 24.936 18.2587 23.378 20.4969C21.82 22.7351 19.5216 24.3512 16.8881 25.0599C14.2547 25.7686 11.4556 25.5245 8.98468 24.3706C8.57914 24.2166 8.13848 24.1797 7.71298 24.2641L3.76366 25.419C3.57315 25.4695 3.37288 25.4706 3.18184 25.422C2.99081 25.3735 2.81534 25.2769 2.67208 25.1416C2.52883 25.0062 2.42252 24.8364 2.36325 24.6485C2.30399 24.4605 2.29372 24.2605 2.33343 24.0674L3.56578 20.2604Z"
        stroke="currentColor"
        strokeWidth="2.31429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Document with arrow — floating island slot 3. */
export function IconDoc(props: IconProps) {
  return (
    <svg viewBox="0 0 30.8571 30.8571" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.20089 15.1736V5.14286C4.20089 4.46087 4.47181 3.80682 4.95405 3.32458C5.43628 2.84235 6.09033 2.57143 6.77232 2.57143H17.058C17.4655 2.57043 17.8691 2.65013 18.2455 2.80592C18.622 2.96172 18.9639 3.19053 19.2515 3.47915L23.8646 8.09229C24.1532 8.37987 24.382 8.72175 24.5378 9.09822C24.6936 9.47469 24.7733 9.87829 24.7723 10.2857V25.7143C24.7723 26.3963 24.5014 27.0503 24.0192 27.5326C23.5369 28.0148 22.8829 28.2857 22.2009 28.2857H6.77232C6.09033 28.2857 5.43628 28.0148 4.95405 27.5326C4.47181 27.0503 4.20089 26.3963 4.20089 25.7143V23.0069"
        stroke="currentColor"
        strokeWidth="2.31429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6009 2.57146V10.2172C15.6009 10.6228 15.762 11.0117 16.0488 11.2985C16.3355 11.5853 16.7245 11.7464 17.13 11.7464H24.7758"
        stroke="currentColor"
        strokeWidth="2.31429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.62745 19.2857H14.4846"
        stroke="currentColor"
        strokeWidth="2.31429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6321 23.1429L14.4893 19.2857L10.6321 15.4286"
        stroke="currentColor"
        strokeWidth="2.31429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Envelope — floating island slot 4. */
export function IconMail(props: IconProps) {
  return (
    <svg viewBox="0 0 30.086 24.5314" fill="none" aria-hidden="true" {...props}>
      <path
        d="M28.9287 5.32286L16.4441 13.2752C16.0204 13.5213 15.5392 13.6509 15.0493 13.6509C14.5593 13.6509 14.0781 13.5213 13.6544 13.2752L1.15729 5.32286"
        stroke="currentColor"
        strokeWidth="2.31429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.1516 1.15714H3.93443C2.40066 1.15714 1.15729 2.40051 1.15729 3.93429V20.5971C1.15729 22.1309 2.40066 23.3743 3.93443 23.3743H26.1516C27.6853 23.3743 28.9287 22.1309 28.9287 20.5971V3.93429C28.9287 2.40051 27.6853 1.15714 26.1516 1.15714Z"
        stroke="currentColor"
        strokeWidth="2.31429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Filled house — the first dot-nav indicator (the Landing/home section). */
export function IconHouse(props: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.91853 9.69118V5.97689C6.91853 5.85375 6.86961 5.73566 6.78254 5.64859C6.69547 5.56152 6.57738 5.5126 6.45424 5.5126H4.5971C4.47396 5.5126 4.35587 5.56152 4.2688 5.64859C4.18173 5.73566 4.13281 5.85375 4.13281 5.97689V9.69118"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 0.5C6.20408 0.5 6.39802 0.568629 6.54785 0.688477L11.2119 4.47559L11.2148 4.47852C11.3067 4.55212 11.3783 4.64229 11.4268 4.74121C11.4751 4.84004 11.5 4.94614 11.5 5.05273V10.7373C11.4999 10.9305 11.4189 11.1213 11.2656 11.2666C11.1112 11.4129 10.8963 11.4999 10.667 11.5H1.33301C1.10365 11.4999 0.888765 11.4129 0.734375 11.2666C0.581098 11.1213 0.50012 10.9305 0.5 10.7373V5.05273C0.5 4.94614 0.524869 4.84004 0.573242 4.74121C0.621694 4.64229 0.693296 4.55212 0.785156 4.47852L5.45215 0.688477C5.60198 0.568629 5.79592 0.5 6 0.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Double chevron — the About expand affordance. */
export function IconChevrons(props: IconProps) {
  return (
    <svg viewBox="0 0 28.8 28.8" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.19844 20.4L13.1984 14.4L7.19844 8.40002"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5984 20.4L21.5984 14.4L15.5984 8.40002"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
