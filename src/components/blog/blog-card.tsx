import Link from "next/link";
import type { blog as Blog } from "#site/content";

export type BlogItem = (typeof Blog)[number];

export function BlogCard({ post }: { post: BlogItem }) {
  return (
    <article className="group rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-accent hover:bg-accent/10">
      <header className="space-y-2">
        <h2 className="heading-2-card">
          <Link
            className="transition-colors hover:text-accent-foreground hover:underline"
            href={post.permalink}
          >
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="line-clamp-3 text-muted-foreground text-sm">
            {post.excerpt}
          </p>
        ) : null}
      </header>
    </article>
  );
}
