# 🚀 14-денний інтенсив: TypeScript, NestJS та Архітектура Бекенду

Репозиторій навчальних матеріалів, щоденних практичних завдань, алгоритмічних розігрівів та підготовки до технічних інтерв'ю для рівня Middle/Senior Backend Developer (NestJS / TypeScript).

---

## 📁 Структура репозиторію

```text
task-service/
├── index.day_1.ts        # Розв'язок розігріву Дня 1 (агрегація подій користувачів)
├── index.day_2.ts        # Розв'язок розігріву Дня 2 (побудова дерева категорій Flat-to-Tree)
├── index.day_3.ts        # Розв'язок розігріву Дня 3 (симуляція INNER JOIN та LEFT JOIN за O(N+M))
├── index.day_4.ts        # Розв'язок розігріву Дня 4 (композитний індекс: Hash Map + Binary Search)
├── index.day_5.ts        # Розв'язок розігріву Дня 5 (Mutex та усунення Race Condition)
├── index.day_6.ts        # Розв'язок розігріву Дня 6 (багатовимірний агрегатор масиву)
├── index.day_7.ts        # Розв'язок розігріву Дня 7 (розгортання масивів unwind)
├── index.day_8.ts        # Розв'язок розігріву Дня 8 (Field Masking у GraphQL)
└── docs/                 # Теоретичні матеріали, завдання та відповіді на питання співбесід
    ├── tasks/                # Щоденні завдання
    │   ├── p-1_d-1.md ... p-1_d-5.md  # Завдання Проєкту 1 (Дні 1–5)
    │   ├── p-2_d-1.md ... p-2_d-4.md  # Завдання Проєкту 2 (Дні 6–9)
    │   └── p-3_d-1.md ... p-3_d-4.md  # Завдання Проєкту 3 (Дні 10–13)
    └── answers/              # Детальні відповіді на питання та розбори
```

---

## 🗺️ Програма та навігація по днях

### [День 1: TypeScript Utility Types, Docker (Postgres) та Основи NestJS](./docs/tasks/p-1_d-1.md)
* **Алгоритмічний розігрів:** Агрегація масиву подій `RawEvent[]` за допомогою методу `.reduce()` без використання `any` ([index.day_1.ts](./index.day_1.ts)).
* **Інфраструктура:** Створення `docker-compose.yml` з сервісами PostgreSQL 16/17 та pgAdmin, налаштування bridge-мережі та healthcheck.
* **NestJS ядро:** Ініціалізація проєкту `order-service`, створення модулів `Inventory` та `Orders`, демонстрація Dependency Injection (DI).
* **Теорія та співбесіда:** Розбір `Record` vs Index Signature, generics в Utility Types, DI vs IoC ([docs/answers/p-1_d-1.md](./docs/answers/p-1_d-1.md)).

### [День 2: Життєвий цикл запиту в NestJS (Pipes, Guards, Interceptors, Decorators)](./docs/tasks/p-1_d-2.md)
* **Алгоритмічний розігрів:** Перетворення плаского списку категорій у деревоподібну структуру (`buildCategoryTree`) за $O(N)$ з сортуванням за `order` ([index.day_2.ts](./index.day_2.ts)).
* **Валідація та безпека:** DTO валідація за допомогою `class-validator`, глобальний `ValidationPipe`, авторизація за ролями через `RolesGuard` та `@Roles()`.
* **Інтерцептори та декоратори:** `LoggingInterceptor`, уніфікація формату відповідей через `TransformInterceptor`, кастомний param decorator `@CurrentUser()`.
* **Теорія та співбесіда:** Точний порядок виклику компонентів у NestJS Request Lifecycle, Interceptor vs Middleware, нюанси `transform: true` ([docs/answers/p-1_d-2.md](./docs/answers/p-1_d-2.md)).

### [День 3: Реляційні бази даних, SQL-зв'язки (1:1, 1:N, N:M) та ORM-міграції](./docs/tasks/p-1_d-3.md)
* **Алгоритмічний розігрів:** Симуляція SQL `INNER JOIN` та `LEFT JOIN` у пам'яті через Generics та `Map` за $O(N + M)$ ([index.day_3.ts](./index.day_3.ts)).
* **Моделювання даних:** Проєктування зв'язків між сутностями: 1:1 (`User` $\leftrightarrow$ `Profile`), 1:N (`User` $\leftrightarrow$ `Order`, `Order` $\leftrightarrow$ `OrderItem`), N:M (`Product` $\leftrightarrow$ `Category`).
* **Міграції та Seeding:** Створення та накатка міграцій, foreign keys, `ON DELETE CASCADE/RESTRICT`, генерація тестових даних.
* **Теорія та співбесіда:** Розбір проблеми N+1, фіксація ціни в `OrderItem`, стратегії `ON DELETE`, Eager vs Lazy Loading у Node.js ([docs/answers/p-1_d-3.md](./docs/answers/p-1_d-3.md)).

### [День 4: Індексація в SQL, оптимізація запитів та EXPLAIN ANALYZE](./docs/tasks/p-1_d-4.md)
* **Алгоритмічний розігрів:** Власний композитний індекс у пам'яті (`ProductIndex`) з хешуванням `category:inStock` ($O(1)$) та бінарним пошуком за діапазоном цін `price` ($O(\log K)$) проти лінійного пошуку ($O(N)$) ([index.day_4.ts](./index.day_4.ts)).
* **Аналіз запитів у PostgreSQL:** Генерація 200,000+ записів, дослідження `EXPLAIN (ANALYZE, BUFFERS)`, порівняння `Seq Scan`, `Index Scan`, `Bitmap Index Scan`.
* **Проєктування індексів:** Складені B-Tree індекси, перевірка правила лівого префікса (Leftmost Prefix Rule), часткові індекси (Partial Indexes) для оптимізації черг замовлень.
* **Теорія та співбесіда:** Внутрішня будова $B^+$ Tree, порівняння типів сканування (`Index Scan` vs `Bitmap Index Scan` vs `Index Only Scan`), компроміси та ціна надлишкової індексації (Write penalty, Bloat, HOT updates) ([docs/answers/p-1_d-4.md](./docs/answers/p-1_d-4.md)).

### [День 5: Конкурентність, Mutex та Рівні Ізоляції Транзакцій](./docs/tasks/p-1_d-5.md)
* **Алгоритмічний розігрів:** Примітив взаємного виключення (`Mutex`) для запобігання Race Condition в асинхронному середовищі Node.js ([index.day_5.ts](./index.day_5.ts)).
* **Транзакції та блокування:** Рівні ізоляції транзакцій у PostgreSQL, аномалії паралельного доступу (Dirty Read, Non-repeatable Read, Phantom Read, Serialization Anomaly).
* **Теорія та співбесіда:** Pessimistic vs Optimistic Locking, патерн `runExclusive`, взаємні блокування (Deadlocks) ([docs/answers/p-1_d-5.md](./docs/answers/p-1_d-5.md)).

### [День 6: InsightPulse — MongoDB Aggregation Pipeline (Основи) та Docker для NoSQL](./docs/tasks/p-2_d-1.md)
* **Алгоритмічний розігрів:** Власний багатовимірний агрегатор масиву об'єктів з розрахунком метрик (`aggregateSales`) за $O(N)$ ([index.day_6.ts](./index.day_6.ts)).
* **NoSQL інфраструктура:** Docker Compose для MongoDB 7.0 та Mongo Express, аналітичний модуль на базі `@nestjs/mongoose`.
* **Теорія та співбесіда:** Pipeline-модель обробки, індекси у конвеєрі, системні ліміти RAM (100 МБ) та `allowDiskUse`, `$project` vs `$addFields` ([docs/answers/p-2_d-1.md](./docs/answers/p-2_d-1.md)).

### [День 7: InsightPulse — Складні агрегації, джоїни ($lookup) та $facet](./docs/tasks/p-2_d-2.md)
* **Алгоритмічний розігрів:** Універсальна generic-утиліта `unwind` для розгортання вкладених масивів у плаский список об'єктів ([index.day_7.ts](./index.day_7.ts)).
* **Реляційні джоїни у NoSQL:** Корельовані підзапити через `$lookup`, `$unwind` з `preserveNullAndEmptyArrays`.
* **Мульти-аналітика:** Побудова комплексного бізнес-дашборду за один запит через `$facet` та `$bucket` ([docs/answers/p-2_d-2.md](./docs/answers/p-2_d-2.md)).

### [День 8: InsightPulse — GraphQL API в NestJS з Apollo Server (Code-First)](./docs/tasks/p-2_d-3.md)
* **Алгоритмічний розігрів:** Селектор полів (Field Masking & Projection) у пам'яті за графом вибірки ([index.day_8.ts](./index.day_8.ts)).
* **Code-First GraphQL:** Підключення Apollo Server до NestJS, декоратори `@ObjectType`, `@InputType`, `@Query`, `@Mutation`.
* **Теорія та співбесіда:** GraphQL vs REST, Over/Under-fetching, специфіка кешування та статус-коди ([docs/answers/p-2_d-3.md](./docs/answers/p-2_d-3.md)).

### [День 9: InsightPulse — Вирішення N+1 у GraphQL (DataLoader) та захист API](./docs/tasks/p-2_d-4.md)
* **Алгоритмічний розігрів:** Власний пакетний кешер `BatchLoader<K, V>` на черзі мікротасків Event Loop.
* **Оптимізація та N+1:** Впровадження `dataloader` у NestJS, per-request context фабрика, усунення множинних запитів до MongoDB.
* **Безпека API:** Захист від DoS через Query Depth Limiting, Query Complexity Analysis та Rate Limiting з `@nestjs/throttler`.

### [День 10: Event-Driven — Docker Compose Network та Мікросервісна архітектура](./docs/tasks/p-3_d-1.md)
* **Алгоритмічний розігрів:** Патерн `Retry with Exponential Backoff and Full Jitter` для стійких міжсервісних викликів.
* **Інфраструктура:** Об'єднання `order-service`, `analytics-service` та `notification-service` у мережу `microservices_net`.
* **Теорія та співбесіда:** Лавиноподібні відмови (Cascading Failures), теорема CAP, патерн Saga (Orchestration vs Choreography).

### [День 11: Event-Driven — Черги повідомлень з RabbitMQ (AMQP)](./docs/tasks/p-3_d-2.md)
* **Алгоритмічний розігрів:** Пріоритетна черга (`PriorityQueue`) на основі бінарної купи (Binary Min-Heap) за $O(\log N)$.
* **AMQP брокер:** Розгортання RabbitMQ з Management UI, підключення `@nestjs/microservices`.
* **Надійність доставки:** Ручні підтвердження (`ACK`/`NACK`), обробка збоїв через Dead Letter Queue (DLQ), `prefetch_count` (Backpressure).

### [День 12: Event-Driven — Apache Kafka: Стрімінг подій, топіки та партиції](./docs/tasks/p-3_d-3.md)
* **Алгоритмічний розігрів:** Кільцевий буфер (`CircularBuffer`) фіксованої місткості у пам'яті за $O(1)$ без зсуву масиву.
* **Стрімінг подій:** Запуск кластера Apache Kafka у режимі KRaft (без ZooKeeper) та Kafka UI у Docker.
* **Паралелізм і порядок:** Топіки, збереження порядку за Partition Key, Consumer Groups та балансування споживачів.

### [День 13: Event-Driven — Надійність розподілених систем (Outbox Pattern & Idempotency)](./docs/tasks/p-3_d-4.md)
* **Алгоритмічний розігрів:** Менеджер ідемпотентності (`IdempotencyManager`) з детермінованим хешуванням корисного навантаження (SHA-256).
* **Dual-Write Problem:** Атомарна транзакція БД та таблиця `outbox_events` у PostgreSQL.
* **Воркер публікації:** Реалізація `OutboxProcessor` з конкурентним блокуванням рядків `FOR UPDATE SKIP LOCKED`.

---

## 🛠️ Запуск алгоритмічних завдань

Для швидкого виконання TypeScript файлів без попередньої компіляції використовуйте [tsx](https://github.com/privatenumber/tsx):

```bash
# Запуск розігріву Дня N(1-15)
npx tsx index.day_N.ts
```

---

## 📦 Супутні проєкти

* **`order-inventory-service`** — повноцінний мікросервіс (Transactional Order & Inventory API), що розробляється паралельно в ході інтенсиву на базі NestJS, TypeORM/Prisma, PostgreSQL та Docker.
