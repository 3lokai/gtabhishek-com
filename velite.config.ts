import { defineCollection, defineConfig, s } from "velite";

// Blog posts live under content/blog/*.md
const blog = defineCollection({
  name: "BlogPost",
  pattern: "blog/**/*.md",
  schema: s
    .object({
      slug: s.slug("blog"), // or s.path()
      title: s.string().max(120),
      date: s.isodate(),
      excerpt: s.string().max(280).optional(),
      coverImage: s.image().optional(),
      tags: s.array(s.string()).optional(),
      // transform markdown → HTML; you can swap to s.mdx() later
      content: s.markdown(),
      // metadata like readingTime/wordCount if you want
      metadata: s.metadata().optional(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/blog/${data.slug}`,
    })),
});

export default defineConfig({
  collections: { blog },
});
