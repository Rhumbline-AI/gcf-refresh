/**
 * Route-level loading boundary for the whole frontend group.
 *
 * Its presence is what lets the App Router commit a navigation INSTANTLY (the URL
 * changes right away and `<Link>` can prefetch dynamic routes) instead of holding
 * the previous page until the server responds. It shows only when a navigation is
 * slow enough to suspend — warm, cached navigations skip it entirely.
 *
 * Kept intentionally minimal and on the site's neutral paper tone so it reads as
 * "loading" rather than a blank/broken white screen, with no layout shift.
 */
export default function Loading() {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: '70vh', backgroundColor: '#f5f0eb' }}
      aria-busy="true"
      aria-live="polite"
    >
      <span
        className="inline-block h-10 w-10 animate-spin rounded-full"
        style={{
          border: '3px solid rgba(48, 127, 226, 0.25)',
          borderTopColor: '#307fe2',
        }}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
