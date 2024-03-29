export interface StatsReport {
  // Number of hits for each section (example : /api)
  sectionStats: Record<string, number>;
  // Number of hits for each request (example : POST /api/users)
  requestsStats: Record<string, number>;
  // Number of each status
  statusesStats: Record<number, number>;
  totalHits: number;
  startTimestamp: number; // Unix time
  endTimestamp: number; // Unix time
}

// Stats report is converted to this by display stats
export interface StatsReportForDisplay {
  // The number of hits for each section (example : /api), ordered by number of hits (desc)
  sectionStats: Array<{ section: string; hits: number }>;
  // The number of hits for each request (example : POST /api/users), ordered by number of hits (desc)
  requestsStats: Array<{ request: string; hits: number }>;
  // The number of hits for each status, ordered by number of hits (desc)
  statusesStats: Array<{ status: number; hits: number }>;
  totalHits: number;
  startTimestamp: number; // Unix time
  endTimestamp: number; // Unix time
}