export interface ParsedLogLine {
  remoteHost: string;
  rfc931: string;
  authUser: string;
  timestamp: number;
  requestMethod: string;
  requestRoute: string;
  requestProtocol: string;
  status: number;
  bytes: number;
}