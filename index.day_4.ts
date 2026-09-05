export type Product = {
  id: string;
  category: string;
  price: number;
  inStock: boolean;
};

// Binary search and index search
export class ProductIndex {
  private index = new Map<string, Product[]>();

  /**
   * Find first index where price >= minPrice (O(log K))
   */
  private findLowerBound(arr: Product[], minPrice: number): number {
    let left = 0;
    let right = arr.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid].price >= minPrice) {
        right = mid; // continue searching left
      } else {
        left = mid + 1; // go right
      }
    }

    return left;
  }

  /**
   * Find first index where price > maxPrice (O(log K))
   */
  private findUpperBound(arr: Product[], maxPrice: number): number {
    let left = 0;
    let right = arr.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid].price > maxPrice) {
        right = mid; // continue searching left
      } else {
        left = mid + 1; // go right
      }
    }

    return left;
  }

  constructor(products: Product[]) {
    products.forEach((product) => {
      const key = `${product.category}:${product.inStock}`;

      let bucket = this.index.get(key);

      if (!bucket) {
        bucket = [];
        this.index.set(key, bucket);
      }

      bucket.push(product);
    });

    this.index.forEach((products) => {
      products.sort((a, b) => a.price - b.price);
    });
  }

  public query(
    category: string,
    inStock: boolean,
    minPrice: number,
    maxPrice: number,
  ): Product[] {
    const key = `${category}:${inStock}`;

    const bucket = this.index.get(key);
    if (!bucket) return [];

    const startIndex = bucket.findIndex((p) => p.price >= minPrice);
    if (startIndex === -1) return [];

    const endIndex = bucket.findIndex((p) => p.price > maxPrice);
    if (endIndex === -1) return bucket.slice(startIndex);

    return bucket.slice(startIndex, endIndex);
  }

  public binaryQuery(
    category: string,
    inStock: boolean,
    minPrice: number,
    maxPrice: number,
  ): Product[] {
    const key = `${category}:${inStock}`;

    const bucket = this.index.get(key);

    if (!bucket || bucket.length === 0) return [];

    const startIndex = this.findLowerBound(bucket, minPrice);
    const endIndex = this.findUpperBound(bucket, maxPrice);

    if (startIndex >= endIndex) return [];

    return bucket.slice(startIndex, endIndex);
  }
}

// O(n), linear search
// O(k log k), k - number of products in the bucket, or O(n log k) if we consider the worst case when all products fall into the same bucket
export function findProducts(
  products: Product[],
  category: string,
  inStock: boolean,
  minPrice: number,
  maxPrice: number,
): Product[] {
  return products.filter((p) => {
    return (
      p.category === category &&
      p.inStock === inStock &&
      p.price >= minPrice &&
      p.price <= maxPrice
    );
  });
}

// Sample products for fast manual testing
export const sampleProducts: Product[] = [
  { id: "p1", category: "electronics", price: 1200, inStock: true },
  { id: "p2", category: "electronics", price: 2500, inStock: true },
  { id: "p3", category: "electronics", price: 3200, inStock: false },
  { id: "p4", category: "electronics", price: 4500, inStock: true },
  { id: "p5", category: "books", price: 350, inStock: true },
  { id: "p6", category: "books", price: 800, inStock: false },
  { id: "p7", category: "clothing", price: 1500, inStock: true },
  { id: "p8", category: "clothing", price: 2200, inStock: true },
];

// Generator for a large sample of products (e.g., 50,000 objects for final benchmark)
export function generateProducts(count: number): Product[] {
  const categories = ["electronics", "books", "clothing", "home", "sports"];
  const products: Product[] = [];

  for (let i = 1; i <= count; i++) {
    products.push({
      id: `p_${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 10000) + 1, // price from 1 to 10 000
      inStock: Math.random() > 0.3, // ~70% in stock
    });
  }

  return products;
}

// ///////////////////////// //
//      TEST AREA            //
// ///////////////////////// //

// Small data test
const productIndex = new ProductIndex(sampleProducts);

console.time("Linear findProducts");
const linearResult = findProducts(
  sampleProducts,
  "electronics",
  true,
  1000,
  3000,
);
console.timeEnd("Linear findProducts");

console.time("ProductIndex query");
const indexedResult = productIndex.query("electronics", true, 1000, 3000);
console.timeEnd("ProductIndex query");

console.log("findProducts: ", linearResult);
console.log("ProductIndex: ", indexedResult);

// Large data test
const bigData = generateProducts(50_000);
const bigIndex = new ProductIndex(bigData);

console.time("Linear findProducts");
const resLinear = findProducts(bigData, "electronics", true, 1500, 3500);
console.timeEnd("Linear findProducts");

console.time("ProductIndex query");
const resIndexed = bigIndex.query("electronics", true, 1500, 3500);
console.timeEnd("ProductIndex query");

console.log("Number of found products:", {
  linear: resLinear.length,
  indexed: resIndexed.length,
});

// ----------------------------------------------------
// Benchmark: Comparing approaches over iterations
// ----------------------------------------------------

const ITERATIONS = 1_000;
console.log(
  `\n🔥 Running ${ITERATIONS.toLocaleString()} queries to compare the three approaches:\n`,
);

// 1. Full scan O(N)
console.time("1. Linear findProducts O(N)");
for (let i = 0; i < ITERATIONS; i++) {
  findProducts(bigData, "electronics", true, 1500, 3500);
}
console.timeEnd("1. Linear findProducts O(N)");

// 2. Index + findIndex O(K)
console.time("2. ProductIndex.query (findIndex) O(K)");
for (let i = 0; i < ITERATIONS; i++) {
  bigIndex.query("electronics", true, 1500, 3500);
}
console.timeEnd("2. ProductIndex.query (findIndex) O(K)");

// 3. Index + Binary Search O(log K)
console.time("3. ProductIndex.binaryQuery O(log K)");
for (let i = 0; i < ITERATIONS; i++) {
  bigIndex.binaryQuery("electronics", true, 1500, 3500);
}
console.timeEnd("3. ProductIndex.binaryQuery O(log K)");

// Verify that binary search returns the same number of products as linear search
const sampleLinear = findProducts(bigData, "electronics", true, 1500, 3500);
const sampleBinary = bigIndex.binaryQuery("electronics", true, 1500, 3500);
console.log(
  `\n✅ Validation: results match (${sampleLinear.length === sampleBinary.length}, ${sampleBinary.length} items)!`,
);

