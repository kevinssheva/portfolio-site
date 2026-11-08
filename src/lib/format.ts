const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// Content schemas validate YYYY-MM before values reach presentation.
export function formatMonth(value: string): string {
  return monthFormatter.format(new Date(`${value}-01T00:00:00Z`));
}
