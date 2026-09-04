export type User = {
  id: string;
  name: string;
  email: string;
};

export type Order = {
  id: string;
  userId: string;
  total: number;
  status: "PENDING" | "PAID" | "SHIPPED";
};

export const users: User[] = [
  { id: "u1", name: "Олексій", email: "alex@example.com" },
  { id: "u2", name: "Марія", email: "maria@example.com" },
  { id: "u3", name: "Іван", email: "ivan@example.com" },
];

export const orders: Order[] = [
  { id: "o1", userId: "u1", total: 250, status: "PAID" },
  { id: "o2", userId: "u1", total: 120, status: "PENDING" },
  { id: "o3", userId: "u2", total: 500, status: "SHIPPED" },
  { id: "o4", userId: "u99", total: 70, status: "PAID" },
];

function buildIndexMap<T, K extends keyof T>(
  items: T[],
  key: K,
): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();

  for (const item of items) {
    const val = item[key];
    const group = map.get(val) ?? [];
    group.push(item);
    map.set(val, group);
  }

  return map;
}

function innerJoin<T, U, K extends keyof T, L extends keyof U>(
  left: T[],
  right: U[],
  leftKey: K,
  rightKey: L,
): Array<T & U> {
  const result: Array<T & U> = [];

  const rightMap = buildIndexMap(right, rightKey);

  for (const leftItem of left) {
    const matchingRightItems = rightMap.get(
      leftItem[leftKey] as unknown as U[L],
    );

    if (matchingRightItems) {
      for (const rightItem of matchingRightItems) {
        result.push({ ...leftItem, ...rightItem });
      }
    }
  }

  return result;
}

type Nullable<T> = { [K in keyof T]: T[K] | null };

function leftJoin<T, U, K extends keyof T, L extends keyof U>(
  left: T[],
  right: U[],
  leftKey: K,
  rightKey: L,
): Array<T & Nullable<U>> {
  const result: Array<T & Nullable<U>> = [];

  const rightMap = buildIndexMap(right, rightKey);

  const emptyRight: Record<string, null> =
    right.length > 0
      ? Object.keys(right[0] as object).reduce(
          (acc, key) => {
            acc[key] = null;
            return acc;
          },
          {} as Record<string, null>,
        )
      : {};

  for (const leftItem of left) {
    const matchingRightItems = rightMap.get(
      leftItem[leftKey] as unknown as U[L],
    );

    if (matchingRightItems && matchingRightItems.length > 0) {
      for (const rightItem of matchingRightItems) {
        result.push({ ...leftItem, ...rightItem } as T & Nullable<U>);
      }
    } else {
      result.push({
        ...leftItem,
        ...emptyRight,
        [rightKey]: leftItem[leftKey],
      } as T & Nullable<U>);
    }
  }

  return result;
}

console.log(
  "innerJoin:",
  JSON.stringify(innerJoin(users, orders, "id", "userId"), null, 2),
);

console.log(
  "leftJoin:",
  JSON.stringify(leftJoin(users, orders, "id", "userId"), null, 2),
);
