import { notFound } from "next/navigation";
import { blog as posts } from "#site/content";
import { BlogCover, BlogCoverFallback } from "@/components/blog/blog-cover";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { PageShell } from "@/components/page-shell";

// Regex to remove first H1 from markdown content (since we have it in the header)
const FIRST_H1_REGEX = /<h1[^>]*>.*?<\/h1>/i;

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return {};
  }

  const baseUrl = "https://gtabhishek.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage.src }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return notFound();
  }

  const baseUrl = "https://gtabhishek.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  // Remove the first H1 from content since we already have it in the header
  const processedContent = post.content.replace(FIRST_H1_REGEX, "").trim();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt ?? undefined,
    url: postUrl,
    ...(post.coverImage && {
      image: post.coverImage.src,
    }),
    ...(post.tags &&
      post.tags.length > 0 && {
        keywords: post.tags.join(", "),
      }),
  };

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <valid expression>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <PageShell>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
            <article className="max-w-3xl">
              <header className="not-prose mb-12">
                <h1 className="mb-4 font-bold text-4xl tracking-tight md:text-6xl">
                  {post.title}
                </h1>
                <p className="mt-4 text-base text-white/60">
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
                </p>
                {post.tags && post.tags.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-2">
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
                <div className="mt-8">
                  {post.coverImage ? (
                    <BlogCover
                      alt={post.title}
                      animate
                      objectPosition="center"
                      priority
                      src={post.coverImage.src}
                      title={post.title}
                    />
                  ) : (
                    <BlogCoverFallback tags={post.tags} title={post.title} />
                  )}
                </div>
              </header>

              {/* HTML string from s.markdown() */}
              <div
                className="prose prose-invert prose-lg"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <valid expression>
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </article>

            {/* Table of Contents */}
            <aside className="hidden lg:block">
              <TableOfContents content={processedContent} />
            </aside>
          </div>
        </div>
      </PageShell>
    </>
  );
}
