import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60).min(10),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      description: z.string().max(160).min(80),
      draft: z.boolean().default(false),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      tags: z.string().array().optional(),
      pinned: z.boolean().default(false),
      external: z.boolean().default(false),
    }),
});

export const collections = {
  blog: blogCollection,
};
