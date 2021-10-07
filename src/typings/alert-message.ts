export enum AlertMessageType {
  FIRED = 'fired',
  RESOLVED = 'resolved',
}

export abstract class AlertMessage {
  public readonly messageType: AlertMessageType;

  protected constructor(messageType: AlertMessageType) {
    this.messageType = messageType;
  }
}

export class AlertFired extends AlertMessage {
  public readonly request: string;

  public readonly hits: number;

  public readonly timestamp: number; // Unix time

  constructor(request: string, hits: number, timestamp: number) {
    super(AlertMessageType.FIRED);
    this.request = request;
    this.hits = hits;
    this.timestamp = timestamp;
  }
}

export class AlertResolved extends AlertMessage {
  request: string;

  timestamp: number; // Unix time

  constructor(request: string, timestamp: number) {
    super(AlertMessageType.RESOLVED);
    this.request = request;
    this.timestamp = timestamp;
  }
}
