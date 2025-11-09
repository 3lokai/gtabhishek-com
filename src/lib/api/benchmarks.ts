import type {
  BenchmarkDetail,
  BenchmarksResponse,
  DashboardSummary,
  PerformanceMatrixResponse,
  RoleList,
  RolesResponse,
  RunBatchRequest,
  RunBatchResponse,
  RunTestRequest,
  RunTestResponse,
  SystemHealth,
} from "@/types/benchmarks";

// Use Next.js API routes as proxy to avoid CORS issues
// These routes proxy requests to the actual API server
const API_BASE_URL = "/api";
const BENCHMARK_DETAIL_REGEX = /^\/api\/benchmarks\/\d+$/;

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    // Map endpoints to Next.js API routes
    let apiRoute = endpoint;
    if (
      endpoint.startsWith("/api/benchmarks/") &&
      BENCHMARK_DETAIL_REGEX.test(endpoint)
    ) {
      // Single benchmark detail: /api/benchmarks/123 -> /api/benchmarks/123
      const id = endpoint.split("/").pop();
      apiRoute = `/benchmarks/${id}`;
    } else if (endpoint.startsWith("/api/benchmarks")) {
      // Benchmarks list - extract query params from endpoint if present
      const [, queryString] = endpoint.split("?");
      apiRoute = queryString ? `/benchmarks?${queryString}` : "/benchmarks";
    } else if (endpoint === "/api/roles") {
      apiRoute = "/roles";
    } else if (endpoint === "/api/dashboard-summary") {
      apiRoute = "/dashboard-summary";
    }

    const response = await fetch(`${API_BASE_URL}${apiRoute}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Network error: Unable to reach API at ${API_BASE_URL}${endpoint}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
}

// Dashboard Summary
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return await fetchAPI<DashboardSummary>("/api/dashboard-summary");
}

// System Health
export async function getSystemHealth(): Promise<SystemHealth> {
  return await fetchAPI<SystemHealth>("/api/system-health");
}

// Benchmarks (main endpoint)
export async function getBenchmarks(params?: {
  model?: string[];
  role?: string[];
  minScore?: number;
  maxScore?: number;
  summary?: boolean;
}): Promise<BenchmarksResponse> {
  const searchParams = new URLSearchParams();

  if (params?.model) {
    params.model.forEach((m) => searchParams.append("model", m));
  }
  if (params?.role) {
    params.role.forEach((r) => searchParams.append("role", r));
  }
  if (params?.minScore !== undefined) {
    searchParams.append("minScore", params.minScore.toString());
  }
  if (params?.maxScore !== undefined) {
    searchParams.append("maxScore", params.maxScore.toString());
  }
  if (params?.summary) {
    searchParams.append("summary", "true");
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/benchmarks${queryString ? `?${queryString}` : ""}`;

  return await fetchAPI<BenchmarksResponse>(endpoint);
}

// Benchmark Detail
export async function getBenchmarkDetail(id: number): Promise<BenchmarkDetail> {
  return await fetchAPI<BenchmarkDetail>(`/api/benchmarks/${id}`);
}

// Role List (just names)
export async function getRoleList(): Promise<RoleList> {
  return await fetchAPI<RoleList>("/list-roles");
}

// Roles (full details with prompts)
export async function getRoles(): Promise<RolesResponse> {
  return await fetchAPI<RolesResponse>("/api/roles");
}

// Role Detail (single role)
export async function getRoleDetail(
  roleName: string
): Promise<RolesResponse["roles"][0]> {
  return await fetchAPI<RolesResponse["roles"][0]>(`/api/roles/${roleName}`);
}

// Performance Matrix
export async function getPerformanceMatrix(): Promise<PerformanceMatrixResponse> {
  return await fetchAPI<PerformanceMatrixResponse>("/api/performance-matrix");
}

// Run Test (POST)
export async function runTest(
  request: RunTestRequest
): Promise<RunTestResponse> {
  return await fetchAPI<RunTestResponse>("/run-test", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// Run Batch (POST)
export async function runBatch(
  request: RunBatchRequest
): Promise<RunBatchResponse> {
  return await fetchAPI<RunBatchResponse>("/run-batch", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
