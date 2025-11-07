export function BlogContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-invert"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Blog content is from trusted markdown source
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
