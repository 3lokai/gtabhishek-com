"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  content: string;
  className?: string;
};

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const items: TocItem[] = [];
    headings.forEach((heading) => {
      const text = heading.textContent || "";
      const id = heading.id || generateId(text);

      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id;
      }

      items.push({
        id,
        text,
        level: Number.parseInt(heading.tagName.charAt(1), 10),
      });
    });

    setToc(items);

    // Add IDs to headings in the DOM after content is rendered
    const proseElement = document.querySelector(".prose");
    if (proseElement) {
      const domHeadings = proseElement.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
      domHeadings.forEach((heading, index) => {
        if (!heading.id && items[index]) {
          heading.id = items[index].id;
        }
      });
    }

    // Add scroll spy with better handling for multiple headings
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the heading that's most visible (closest to top of viewport)
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top,
          }))
          .sort((a, b) => a.top - b.top);

        if (visibleHeadings.length > 0) {
          // Highlight the heading closest to the top
          const newActiveId = visibleHeadings[0].id;
          setActiveId(newActiveId);
        }
      },
      { rootMargin: "-10% 0% -60% 0%", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    // Observe headings in the DOM
    const proseElementForObserver = document.querySelector(".prose");
    if (proseElementForObserver) {
      const domHeadings = proseElementForObserver.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
      domHeadings.forEach((heading) => {
        observer.observe(heading);
      });

      return () => {
        domHeadings.forEach((heading) => {
          observer.unobserve(heading);
        });
      };
    }
  }, [content]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        "sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pl-4",
        className
      )}
    >
      <div className="space-y-4">
        <h2 className="mb-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Table of Contents
        </h2>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                className={cn(
                  "block rounded-r-md py-1.5 text-sm leading-relaxed transition-all duration-200",
                  item.level === 1 && "pl-0 font-medium text-base",
                  item.level === 2 && "pl-3",
                  item.level === 3 && "pl-6",
                  item.level === 4 && "pl-9",
                  activeId === item.id
                    ? "-ml-4 border-primary border-l-2 bg-primary/10 pl-3 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                )}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    const offset = 100; // Offset for fixed header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
