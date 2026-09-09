export type OrderWithItems = {
  orderId: string;
  customerId: string;
  createdAt: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
};

export const sampleOrders: OrderWithItems[] = [
  {
    orderId: "ord-101",
    customerId: "cust-1",
    createdAt: "2026-03-01",
    items: [
      { productId: "prod-A", quantity: 2, price: 100 },
      { productId: "prod-B", quantity: 1, price: 250 },
    ],
  },
  {
    orderId: "ord-102",
    customerId: "cust-2",
    createdAt: "2026-03-02",
    items: [{ productId: "prod-C", quantity: 5, price: 30 }],
  },
  {
    orderId: "ord-103",
    customerId: "cust-3",
    createdAt: "2026-03-03",
    items: [],
  },
];

export type UnwoundDocument<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[K] extends Array<infer Item> ? Item : never;
};

export function unwind<T extends Record<string, any>, K extends keyof T>(
  docs: T[],
  arrayKey: K,
  options?: { preserveNullAndEmptyArrays?: boolean },
): Array<UnwoundDocument<T, K> | (Omit<T, K> & { [P in K]?: null })> {
  if (!Array.isArray(docs) || docs.length === 0) {
    return [];
  }

  return docs.flatMap((doc) => {
    const target = doc[arrayKey];

    if (Array.isArray(target) && target.length > 0) {
      return target.map((item) => ({
        ...doc,
        [arrayKey]: item,
      }));
    }

    if (options?.preserveNullAndEmptyArrays) {
      return [
        {
          ...doc,
          [arrayKey]: null,
        },
      ];
    }

    return [];
  });
}

const unwoundDefault = unwind(sampleOrders, "items");
console.log(
  "Default unwind (items count):",
  unwoundDefault.length,
  unwoundDefault,
); // Expected 3 (2 from ord-101, 1 from ord-102, ord-103 excluded)

const unwoundPreserved = unwind(sampleOrders, "items", {
  preserveNullAndEmptyArrays: true,
});
console.log(
  "Preserved unwind (items count):",
  unwoundPreserved.length,
  unwoundPreserved,
); // Expected 4 (ord-103 preserved with items: null)
