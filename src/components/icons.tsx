export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5.5 21A2.5 2.5 0 0 1 3 18.5V14a2 2 0 0 1 2-2h1" />
      <path d="M18.5 3A2.5 2.5 0 0 1 21 5.5V10a2 2 0 0 1-2 2h-1" />
      <path d="M3 10v1.5A2.5 2.5 0 0 0 5.5 14H8" />
      <path d="M21 14v-1.5A2.5 2.5 0 0 0 18.5 10H16" />
      <rect width="8" height="8" x="8" y="8" rx="1" className="fill-primary/20 stroke-primary" />
    </svg>
  );
}
