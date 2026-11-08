const paths = {
  code: "m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14",
  book: "M12 5.5C9 3.5 5 3.5 3 4.5v15c3-1.5 6-1 9 .5 3-1.5 6-2 9-.5v-15c-2-1-6-1-9 1Zm0 0V20",
  briefcase: "M9 7V4h6v3M4 7h16v13H4ZM4 12c5 3 11 3 16 0m-8 1v3",
  repository: "M5 3h14v18H5a3 3 0 0 1 0-6h14M5 3a2 2 0 0 0-2 2v13m5-12h7",
  trophy: "M8 3h8v7a4 4 0 0 1-8 0Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8",
  location: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  link: "m9 15 6-6m-7 3-2 2a4 4 0 0 0 6 6l3-3m-6-10 3-3a4 4 0 0 1 6 6l-2 2",
  mail: "M3 5h18v14H3Zm0 1 9 7 9-7",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  moon: "M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
