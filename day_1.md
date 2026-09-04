# День 1: TypeScript Utility Types, Docker (Postgres) та Основи NestJS

Ласкаво просимо до Дня 1 нашого 14-денного інтенсиву! Сьогодні ми закладаємо фундамент: розбираємося зі складною типізацією та трансформацією даних, піднімаємо базу даних через Docker та ініціалізуємо ядро проєкту на NestJS.

---

## ⏱️ Розклад Дня 1 (6 годин)

| Блок       | Тривалість | Тема                           | Опис                                                                          |
| :--------- | :--------- | :----------------------------- | :---------------------------------------------------------------------------- |
| **Блок 1** | 1 год      | Алгоритмічний розігрів (TS/JS) | Маніпуляція масивами об'єктів, `reduce`, вбудовані `Utility Types`            |
| **Блок 2** | 1.5 год    | Інфраструктура (Docker)        | Написання `docker-compose.yml` для PostgreSQL та pgAdmin, налаштування мережі |
| **Блок 3** | 2.5 год    | Архітектура NestJS             | Ініціалізація проєкту, Modules, Controllers, Providers, Dependency Injection  |
| **Блок 4** | 1 год      | Рев'ю та інтерв'ю-підготовка   | Розбір Utility Types, концепції DI та IoC, аналіз типових запитань            |

---

## 🧩 Завдання 1: Алгоритмічний розігрів (TypeScript + Data Manipulation)

### Мета:

Опрацювати маніпуляцію складними структурами даних за допомогою чистих функцій та строго типізувати вихідні дані без використання `any`.

### Вхідні дані:

Масив подій користувачів, який приходить у пласкому форматі:

```typescript
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

export const rawEvents: RawEvent[] = [
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
```

### Вимоги до реалізації:

1. **Типізація результату:**
   Створи тип `UserSummary`, використовуючи вбудовані утиліти (`Record`, `Partial`, тощо):
   - `actionsCount`: словник, де ключ — `EventAction`, значення — кількість таких дій.
   - `totalSpent`: число (сума всіх покупок `metadata.amount`).
   - `lastActive`: `number` (найновіший `timestamp`).

   Результуючий тип агрегованого звіту має бути: `Record<string, UserSummary>`.

2. **Функція агрегації:**
   Напиши чисту функцію:

   ```typescript
   function aggregateUserEvents(
     events: RawEvent[],
   ): Record<string, UserSummary>;
   ```

   - Обов'язково використати метод масиву `.reduce()`.
   - Забезпечити захист від відсутніх полів (`metadata?.amount` може бути `undefined`).
   - Не мутувати вхідні об'єкти.

### Перевірка:
Запустіть файл через термінал (наприклад, `npx tsx index.day_1.ts`).

---

## 🐳 Завдання 2: Docker-середовище для бази даних

### Мета:

Створити ізольоване середовище для першого мікропроєкту (Transactional Order & Inventory API).

### Вимоги:

Створи у корені проєкту файл `docker-compose.yml`, який описує:

1. **Сервіс `postgres_db`:**
   - Образ: `postgres:16-alpine`.
   - Змінні середовища: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (винести в `.env`).
   - Порти: прокинути `5432:5432`.
   - Volume: підключити persistent volume для збереження даних бази.
   - Healthcheck: налаштувати перевірку готовності БД за допомогою `pg_isready`.

2. **Сервіс `pgadmin`:**
   - Образ: `dpage/pgadmin4`.
   - Порти: `8080:80`.
   - Залежність від `postgres_db` (через `depends_on`).

3. **Спільна Docker-мережа:**
   - Обидва сервіси мають бути підключені до кастомної bridge-мережі `order_network`.

---

## ⚙️ Завдання 3: Ініціалізація ядра NestJS & Dependency Injection

### Мета:

Створити каркас додатку `order-service` та реалізувати базову взаємодію між модулями.

### Кроки:

1. Ініціалізувати новий проєкт:
   ```bash
   npx @nestjs/cli new order-service --skip-git --package-manager npm
   ```
2. Створити доменний модуль `Inventory`:
   ```bash
   nest g module inventory
   nest g controller inventory
   nest g service inventory
   ```
3. Реалізувати базовий in-memory склад (`InventoryService`):
   - Створити типізований список товарів (id, title, quantity, price).
   - Написати метод `checkAvailability(productId: string, quantity: number): boolean`.
   - Написати метод `reserve(productId: string, quantity: number): boolean`.
4. Створити модуль `Orders`, заінжектити `InventoryService` у `OrdersService` через експорт модуля `InventoryModule` (демонстрація DI).

---

## 🎯 Питання для самоперевірки та інтерв'ю

1. Чим `Record<K, T>` відрізняється від index signature `{[key: string]: T}`?
2. Як працюють utility types `Pick`, `Omit`, `Partial`, `Required` на рівні TypeScript Generics (як би ти реалізував `MyPartial<T>`)?
3. У чому різниця між Dependency Injection (DI) та Inversion of Control (IoC)? Як це реалізовано в контейнері NestJS?
4. Навіщо у Docker Compose вказувати `healthcheck` для БД і як `condition: service_healthy` допомагає залежним сервісам?
