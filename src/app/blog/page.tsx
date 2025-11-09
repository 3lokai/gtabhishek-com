import Link from "next/link";
import { blog as posts } from "#site/content";
import { PageShell } from "@/components/page-shell";

export default function BlogIndex() {
  const list = [...posts]
    .filter((p) => !!p.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <PageShell>
      <section className="container mx-auto px-4 py-16">
        <h1 className="heading-1-lg">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Notes on growth, systems, and coffee.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((post) => (
            <article
              className="group rounded-2xl border border-white/10 bg-white/5 p-6"
              key={post.slug}
            >
              <header className="space-y-2">
                <h2 className="heading-2-card">
                  <Link className="hover:underline" href={post.permalink}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-white/60 text-xs">
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </p>
                {post.excerpt ? (
                  <p className="line-clamp-3 text-muted-foreground text-sm">
                    {post.excerpt}
                  </p>
                ) : null}
              </header>
              {post.coverImage ? (
                // coverImage has {src, width, height, blurDataURL}
                <picture>
                  <source srcSet={post.coverImage.src} />
                  <img
                    alt={post.title}
                    className="mt-4 h-40 w-full rounded-xl object-cover"
                    height={post.coverImage.height}
                    src={post.coverImage.src}
                    style={{
                      aspectRatio: `${post.coverImage.width} / ${post.coverImage.height}`,
                    }}
                    width={post.coverImage.width}
                  />
                </picture>
              ) : null}
              {post.tags && post.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs"
                      key={t}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
