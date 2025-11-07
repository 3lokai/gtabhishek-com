/**
 * Centralized query keys for TanStack Query
 *
 * This file helps prevent cache key chaos by providing a single source of truth
 * for all query keys used throughout the application.
 *
 * Usage:
 * import { queryKeys } from "@/lib/query-keys";
 *
 * // In your query
 * queryKey: queryKeys.user.all
 *
 * // In your mutation invalidation
 * invalidateQueries: [queryKeys.user.all]
 */

export const queryKeys = {
  // Posts (example)
  posts: {
    all: ["posts"] as const,
    list: (filters?: Record<string, any>) =>
      ["posts", "list", filters] as const,
    detail: (id: string) => ["posts", "detail", id] as const,
  },

  // Comments (example)
  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) => ["comments", "byPost", postId] as const,
  },
} as const;

// Type helper for query keys
export type QueryKeys = typeof queryKeys;
