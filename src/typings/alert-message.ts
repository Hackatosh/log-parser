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
  public readonly hits: number;

  public readonly timestamp: number; // Unix time

  constructor(hits: number, timestamp: number) {
    super(AlertMessageType.FIRED);
    this.hits = hits;
    this.timestamp = timestamp;
  }
}

export class AlertResolved extends AlertMessage {
  timestamp: number; // Unix time

  constructor(timestamp: number) {
    super(AlertMessageType.RESOLVED);
    this.timestamp = timestamp;
  }
}
