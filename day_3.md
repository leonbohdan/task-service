# День 3: Реляційні бази даних, SQL-зв'язки (1:1, 1:N, N:M) та ORM-міграції

Сьогодні ми інтегруємо наш сервіс `order-service` зі справжньою реляційною базою даних PostgreSQL, яку ми розгорнули у Docker. Ми навчимося проєктувати схеми даних, правильно налаштовувати зв'язки, керувати міграціями та розв'яжемо алгоритмічну задачу на симуляцію реляційного `JOIN` у TypeScript.

---

## ⏱️ Розклад Дня 3 (6 годин)

| Блок | Тривалість | Тема | Опис |
| :--- | :--- | :--- | :--- |
| **Блок 1** | 1 год | Алгоритмічний розігрів (TS/JS) | Симуляція SQL `INNER JOIN` та `LEFT JOIN` у пам'яті за допомогою Generics та `Map` |
| **Блок 2** | 2.5 год | Моделювання даних та ORM | Встановлення ORM (Prisma або TypeORM), проєктування зв'язків: 1:1, 1:N, N:M між сутностями |
| **Блок 3** | 1.5 год | Міграції, Constraints та Seeding | Створення та накатка міграцій, foreign keys, `ON DELETE CASCADE`, генерація тестових даних |
| **Блок 4** | 1 год | Рев'ю та інтерв'ю-підготовка | N+1 проблема в ORM, Eager vs Lazy loading, Foreign Key constraints vs валідація на рівні коду |

---

## 🧩 Завдання 1: Алгоритмічний розігрів (Data Joining in TypeScript)

### Мета:
Реалізувати типізовану утиліту для об'єднання двох масивів об'єктів за зовнішнім ключем (аналог SQL `INNER JOIN` та `LEFT JOIN`), оптимізовану за часом ($O(N + M)$).

### Вхідні дані:
```typescript
export type User = {
  id: string;
  name: string;
  email: string;
};

export type Order = {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED';
};

export const users: User[] = [
  { id: 'u1', name: 'Олексій', email: 'alex@example.com' },
  { id: 'u2', name: 'Марія', email: 'maria@example.com' },
  { id: 'u3', name: 'Іван', email: 'ivan@example.com' },
];

export const orders: Order[] = [
  { id: 'o1', userId: 'u1', total: 250, status: 'PAID' },
  { id: 'o2', userId: 'u1', total: 120, status: 'PENDING' },
  { id: 'o3', userId: 'u2', total: 500, status: 'SHIPPED' },
  { id: 'o4', userId: 'u99', total: 70, status: 'PAID' }, // Замовлення без користувача
];
```

### Вимоги:
1. **Типізація утиліти:**
   Напиши універсальну generic-функцію `innerJoin`:
   ```typescript
   function innerJoin<T, U, K extends keyof T, L extends keyof U>(
     left: T[],
     right: U[],
     leftKey: K,
     rightKey: L
   ): Array<T & U>
   ```
2. **Оптимізація:**
   - Не використовувати вкладені цикли `left.filter(...)` або `left.map(...)` з пошуком через `right.find(...)`, оскільки це $O(N \times M)$.
   - Створити хеш-мапу (`Map`) для однієї зі сторін, щоб загальна складність склала $O(N + M)$.
3. **Бонусне завдання:**
   Реалізуй функцію `leftJoin`, де поля з правої таблиці можуть бути `null` або `undefined`, якщо збігу не знайдено.

---

## 🗄️ Завдання 2: Проєктування схеми даних та зв'язків (Prisma або TypeORM)

### Мета:
Спроєктувати повноцінну схему для e-commerce системи та налаштувати зв'язки між таблицями.

### Модель сутностей:
1. **User (Користувач):**
   - `id` (UUID / CUID, Primary Key)
   - `email` (Unique, Not Null)
   - `name` (String)
   - `createdAt`, `updatedAt`
   - *Зв'язок 1:1* з `Profile` (телефон, адреса, аватар).
   - *Зв'язок 1:N* з `Order`.

2. **Profile (Профіль користувача):**
   - `id`, `userId` (Foreign Key, Unique)
   - `phone`, `city`, `address`

3. **Product (Товар):**
   - `id`, `sku` (Unique), `title`, `price` (Decimal/Int у копійках/центах), `stockQuantity`
   - *Зв'язок N:M* з `Category` (один товар може мати кілька категорій, категорія має багато товарів).

4. **Category (Категорія):**
   - `id`, `name`, `slug` (Unique)

5. **Order (Замовлення):**
   - `id`, `userId` (Foreign Key), `status`, `totalAmount`, `createdAt`
   - *Зв'язок 1:N* з `OrderItem`.

6. **OrderItem (Позиція замовлення — Join table з даними):**
   - `id`, `orderId`, `productId`, `quantity`, `unitPrice` (ціна товару на момент оформлення замовлення!).

---

## 🚀 Завдання 3: Міграції, Constraints та Seeding

### Мета:
Перенести схему в PostgreSQL через міграції та наповнити базу початковими даними.

### Кроки:
1. **Підключення до БД:**
   - Налаштувати `DATABASE_URL` у `.env` для підключення до контейнера `postgres_db`, створеного в День 1.
2. **Генерація та накатка міграції:**
   - Згенерувати початкову міграцію (наприклад, `prisma migrate dev --name init` або `typeorm migration:generate`).
   - Перевірити створений SQL-файл: знайти, де створені `FOREIGN KEY`, індекси для foreign keys та `ON DELETE` правила (наприклад, `CASCADE` для `OrderItem` при видаленні `Order`).
3. **Скрипт Seeding:**
   - Написати скрипт `seed.ts`, який автоматично наповнює базу 5 користувачами, 10 товарами з різними категоріями та кількома тестовими замовленнями.
   - Додати команду `npm run seed` у `package.json`.

---

## 🎯 Питання для самоперевірки та інтерв'ю

1. **Проблема N+1:** Що це таке при роботі з реляційними базами через ORM і якими двома основними способами її вирішують у SQL/ORM?
2. **Цілісність даних:** Чому ціну в `OrderItem` зберігають окремо, навіть якщо вона вже є в таблиці `Product`?
3. **ON DELETE CASCADE vs SET NULL vs RESTRICT:** У яких бізнес-сценаріях слід обрати кожен із цих варіантів при налаштуванні `Foreign Key`?
4. **Eager Loading vs Lazy Loading:** Чому Lazy Loading вважається антипатерном у високонавантажених Node.js бекендах?