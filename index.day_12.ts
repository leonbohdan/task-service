export class CircularBuffer<T> {
  private buffer: (T | undefined)[];
  private head = 0; // Вказівник на найстаріший елемент (звідки читаємо)
  private tail = 0; // Вказівник на наступну вільну позицію (куди пишемо)
  private count = 0; // Кількість фактично збережених елементів
  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("Місткість буфера має бути більше 0");
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  public size(): number {
    return this.count;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  public isFull(): boolean {
    return this.count === this.capacity;
  }

  public push(item: T): boolean {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;

    if (this.isFull()) {
      this.head = (this.head + 1) % this.capacity;
    } else {
      this.count++;
    }

    return true;
  }

  public pop(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count--;

    return item;
  }

  public peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.buffer[this.head];
  }

  public toArray(): T[] {
    const result: T[] = [];

    for (let i = 0; i < this.count; i++) {
      const index = (this.head + i) % this.capacity;
      result.push(this.buffer[index] as T);
    }

    return result;
  }
}

export function testCircularBuffer() {
  const ring = new CircularBuffer<string>(3);

  console.log("--- Додавання до буфера місткістю 3 ---");
  ring.push("Event #1");
  ring.push("Event #2");
  ring.push("Event #3");

  console.log("Буфер заповнений?", ring.isFull()); // true
  console.log("Вміст:", ring.toArray()); // ['Event #1', 'Event #2', 'Event #3']

  console.log("--- Додаємо 4-й елемент у заповнений буфер (перезапис) ---");
  ring.push("Event #4"); // Event #1 має бути витіснений

  console.log("Вміст після витіснення:", ring.toArray());
  console.assert(
    ring.toArray()[0] === "Event #2" && ring.toArray()[2] === "Event #4",
    "Помилка: найстаріший елемент не був коректно витіснений!",
  );

  console.log("Читання елемента (pop):", ring.pop()); // 'Event #2'
  console.log("Залишок:", ring.toArray()); // ['Event #3', 'Event #4']
  console.log("✅ Тест кільцевого буфера успішно пройдено!");
}

testCircularBuffer();
