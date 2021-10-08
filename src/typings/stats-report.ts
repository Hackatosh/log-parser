export interface StatsReport {
  // Number of hits for each request (example : POST /api/users)
  requestsStats: Record<string, number>;
  // Number of each status
  statusesStats: Record<number, number>;
  totalHits: number;
  startTimestamp: number;
  endTimestamp: number;
}

// Stats report is converted to this by display stats
export interface StatsReportForDisplay {
  // The number of hits for each request (example : POST /api/users), ordered by number of hits (desc)
  requestsStats: Array<{ request: string; hits: number }>;
  // The number of hits for each status, ordered by number of hits (desc)
  statusesStats: Array<{ status: number; hits: number }>;
  totalHits: number;
  startTimestamp: number;
  endTimestamp: number;
}