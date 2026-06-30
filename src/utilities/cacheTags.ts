/**
 * Centralized Next.js Data Cache tag names.
 *
 * `unstable_cache` producers (the per-slug document queries) and the Payload
 * `revalidate*` hooks MUST agree on these exact strings. If they drift apart,
 * a CMS edit won't bust the cached read and the public site would serve stale
 * content — so always build tags through these helpers on both sides.
 */
export const cacheTags = {
  /** All documents in a collection — bust on any create/update/delete. */
  collection: (collection: string) => `collection:${collection}`,
  /** A single document addressed by its slug. */
  docBySlug: (collection: string, slug: string) => `doc:${collection}:${slug}`,
}
