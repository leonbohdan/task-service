export interface QueueNode<T> {
  item: T;
  priority: number; // Smaller number = higher priority (Min-Heap: 1 is more important than 10)
}

export class PriorityQueue<T> {
  private heap: QueueNode<T>[] = [];

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private leftChild(i: number): number {
    return 2 * i + 1;
  }

  private rightChild(i: number): number {
    return 2 * i + 2;
  }

  public size(): number {
    return this.heap.length;
  }

  public peek(): T | undefined {
    return this.heap[0]?.item;
  }

  public isEmpty(): boolean {
    return this.size() === 0;
  }

  public enqueue(item: T, priority: number): void {
    this.heap.push({ item, priority });

    this.siftUp(this.heap.length - 1);
  }

  private siftUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.parent(currentIndex);

    while (
      currentIndex > 0 &&
      this.heap[currentIndex].priority < this.heap[parentIndex].priority
    ) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.parent(currentIndex);
    }
  }

  public dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    if (this.size() === 1) {
      return this.heap.pop()?.item;
    }

    const root = this.heap[0].item;
    const last = this.heap.pop();

    if (last) {
      this.heap[0] = last;
      this.siftDown(0);
    }

    return root;
  }

  private siftDown(index: number): void {
    let currentIndex = index;
    const size = this.size();

    while (true) {
      const left = this.leftChild(currentIndex);
      const right = this.rightChild(currentIndex);

      let smallest = currentIndex;

      if (
        left < size &&
        this.heap[left].priority < this.heap[smallest].priority
      ) {
        smallest = left;
      }

      if (
        right < size &&
        this.heap[right].priority < this.heap[smallest].priority
      ) {
        smallest = right;
      }

      if (smallest !== currentIndex) {
        this.swap(currentIndex, smallest);
        currentIndex = smallest;
      } else {
        break;
      }
    }
  }
}

export function testPriorityQueue() {
  const pq = new PriorityQueue<string>();

  pq.enqueue("Регулярний щотижневий звіт", 10);
  pq.enqueue("Оформлення замовлення (Checkout)", 1);
  pq.enqueue("Маркетингова email-розсилка", 20);
  pq.enqueue("Термінове SMS-сповіщення банку", 2);
  pq.enqueue("Логування аудиту дій", 15);

  console.log(
    "--- Вилучення завдань за пріоритетом (Min-Heap: менше число = вищий пріоритет) ---"
  );
  const extracted: string[] = [];
  while (!pq.isEmpty()) {
    const item = pq.dequeue();
    if (item) extracted.push(item);
  }

  console.log("Порядок обробки:", extracted);
  console.assert(
    extracted[0] === "Оформлення замовлення (Checkout)" &&
      extracted[1] === "Термінове SMS-сповіщення банку" &&
      extracted[4] === "Маркетингова email-розсилка",
    "Помилка: елементи вилучено в неправильному порядку!"
  );
  console.log("✅ Тест пріоритетної черги успішно пройдено!");
}

testPriorityQueue();
