export type ComplexReport = {
  id: string;
  category: string;
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageCheck: number;
  };
  metadata: {
    generatedAt: string;
    serverRegion: string;
  };
};

export const sampleReport: ComplexReport = {
  id: "rep-001",
  category: "Tech",
  metrics: {
    totalRevenue: 54000,
    totalOrders: 120,
    averageCheck: 450,
  },
  metadata: {
    generatedAt: "2026-03-08T10:00:00Z",
    serverRegion: "eu-central-1",
  },
};

export type FieldMask<T> = {
  [K in keyof T]?: T[K] extends object ? FieldMask<T[K]> | boolean : boolean;
};

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function applyFieldMask<T extends Record<string, any>>(
  data: T,
  mask: FieldMask<T>,
): Partial<T> {
  const result: Record<string, any> = {};

  const keys = Object.keys(mask) as Array<keyof T>;

  for (const key of keys) {
    if (!(key in data)) {
      continue;
    }

    const maskValue = mask[key];
    const dataValue = data[key];

    if (maskValue === true) {
      result[key] = dataValue;
    } else if (isPlainObject(maskValue) && isPlainObject(dataValue)) {
      const nestedMask = maskValue as FieldMask<Record<string, any>>;
      const nestedData = dataValue as Record<string, any>;

      result[key] = applyFieldMask(nestedData, nestedMask);
    } else if (Array.isArray(dataValue) && isPlainObject(maskValue)) {
      result[key] = dataValue.map((item) =>
        isPlainObject(item)
          ? applyFieldMask(item, maskValue as FieldMask<any>)
          : item,
      );
    }
  }

  return result as Partial<T>;
}

const masked = applyFieldMask(sampleReport, {
  id: true,
  metrics: {
    totalRevenue: true,
    averageCheck: true,
  },
  metadata: false,
});

console.log(JSON.stringify(masked, null, 2));
