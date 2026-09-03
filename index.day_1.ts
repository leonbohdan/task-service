export type EventAction = "login" | "purchase" | "logout";

export type RawEvent = {
  userId: string;
  action: EventAction;
  timestamp: number;
  metadata?: {
    amount?: number;
    device?: string;
  };
};

type UserSummary = {
  actionsCount: Record<EventAction, number>;
  totalSpent: number;
  lastActive: number;
};

function aggregateUserEvents(events: RawEvent[]): Record<string, UserSummary> {
  return events.reduce((acc: Record<string, UserSummary>, event: RawEvent) => {
    const { userId, action, timestamp, metadata } = event;

    const currentSummary = acc[userId] ?? {
      actionsCount: {
        login: 0,
        purchase: 0,
        logout: 0,
      },
      totalSpent: 0,
      lastActive: 0,
    };

    return {
      ...acc,
      [userId]: {
        actionsCount: {
          ...currentSummary.actionsCount,
          [action]: currentSummary.actionsCount[action] + 1,
        },
        totalSpent: currentSummary.totalSpent + (metadata?.amount ?? 0),
        lastActive: Math.max(currentSummary.lastActive, timestamp),
      },
    };
  }, {});
}

const rawEvents: RawEvent[] = [
  {
    userId: "u1",
    action: "login",
    timestamp: 1620000001,
    metadata: { device: "mobile" },
  },
  {
    userId: "u1",
    action: "purchase",
    timestamp: 1620000005,
    metadata: { amount: 150 },
  },
  {
    userId: "u2",
    action: "login",
    timestamp: 1620000010,
    metadata: { device: "desktop" },
  },
  {
    userId: "u1",
    action: "purchase",
    timestamp: 1620000020,
    metadata: { amount: 50 },
  },
  { userId: "u2", action: "logout", timestamp: 1620000030 },
  { userId: "u3", action: "login", timestamp: 1620000040 },
  { userId: "u1", action: "logout", timestamp: 1620000050 },
];

console.log(JSON.stringify(aggregateUserEvents(rawEvents), null, 2));
