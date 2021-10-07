export interface ParsedLogLine {
  remoteHost: string;
  rfc931: string;
  authUser: string;
  date: number;
  request: string;
  status: number;
  bytes: number;
}