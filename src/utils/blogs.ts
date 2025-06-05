import type { InferEntrySchema } from "astro:content";

interface Blog {
  data: InferEntrySchema<"blog">;
}

export const blogSort = (a: Blog, b: Blog): number => {
  // Prioritize draft blogs
  if (a.data.draft != b.data.draft)
    return Number(b.data.draft) - Number(a.data.draft);

  // Sort by dates if they have the same pinned status
  if (b.data.pinned == a.data.pinned) {
    const aDate = a.data.updatedDate ?? a.data.pubDate; // Use updatedDate if available, else pubDate
    const bDate = b.data.updatedDate ?? b.data.pubDate;
    return bDate.valueOf() - aDate.valueOf();
  }

  // Prioritize pinned blogs
  return Number(b.data.pinned) - Number(a.data.pinned);
};

export const blogDateSort = (a: Blog, b: Blog): number => {
  const d1 = a.data.updatedDate ?? a.data.pubDate;
  const d2 = b.data.updatedDate ?? b.data.pubDate;

  return d2.valueOf() - d1.valueOf();
};
