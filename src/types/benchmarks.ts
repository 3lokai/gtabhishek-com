// API Response Types matching trigger_server.py schema

export type DashboardSummary = {
  tests_7d: number;
  avg_score: number;
  success_rate: number;
  last_run: string;
  best_model: string;
  best_score: number;
};

export type SystemHealth = {
  server: string;
  version: string;
  status: string;
  recent_benchmarks: number;
  cpu_usage: number;
  last_check: string;
  timestamp: string;
  endpoints: Record<string, string>;
  configuration: {
    benchmark_script: string;
    working_directory: string;
  };
};

export type BenchmarkSummary = {
  totalTests: number;
  models: number;
  roles: number;
  speedChampion: {
    model: string;
    time: number;
  } | null;
  qualityChampion: {
    model: string;
    score: number;
  } | null;
  lastUpdated: string;
};

export type BenchmarkMatrixItem = {
  task: string; // role_type
  model: string; // model_name
  score: number;
  time: number;
  test_count: number;
};

export type ChartData = {
  responseTimes: Array<{
    model: string;
    time: number;
  }>;
  qualityDistribution: Array<{
    model: string;
    score: number;
  }>;
};

export type BenchmarksResponse = {
  summary: BenchmarkSummary;
  matrix: BenchmarkMatrixItem[];
  chartData: ChartData;
};

export type BenchmarkDetail = {
  id: number;
  model: string;
  role: string;
  score: number;
  time: number;
  prompt: string;
  response: string;
  breakdown: Record<string, number>;
};

export type RoleList = {
  roles: string[];
  total_roles: number;
};

export type RoleTest = {
  id?: string;
  prompt?: string;
  criteria?: unknown;
  [key: string]: unknown;
};

export type RoleDetail = {
  name: string;
  test_count: number;
  tests: RoleTest[];
};

export type RolesResponse = {
  roles: RoleDetail[];
  total_roles: number;
  total_tests: number;
};

export type PerformanceMatrixItem = {
  task: string;
  model: string;
  score: number;
  time: number;
  test_count: number;
  success_rate: number;
  status: "YES" | "HYBRID" | "NO";
};

export type PerformanceMatrixResponse = {
  data: PerformanceMatrixItem[];
  total_tasks: number;
  local_ready: number;
  hybrid: number;
  cloud_only: number;
};

export type RunTestRequest = {
  model: string;
  role?: string;
  test_id?: string;
};

export type RunTestResponse = {
  status: string;
  model: string;
  role?: string;
  test_id?: string;
  test_type: string;
  timestamp: string;
  message: string;
};

export type RunBatchRequest = {
  models: string[];
  roles: string[];
};

export type RunBatchResponse = {
  status: string;
  models: string[];
  roles: string[];
  total_tests: number;
  timestamp: string;
  message: string;
};
