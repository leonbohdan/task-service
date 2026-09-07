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
├── index.day_6.ts        # Розв'язок розігріву Дня 6
└── docs/                 # Теоретичні матеріали, завдання та відповіді на питання співбесід
    ├── tasks/                # Щоденні завдання (Project 1)
    │   ├── p-1_d-1.md        # Завдання Дня 1 (Project 1 Day 1)
    │   ├── p-1_d-2.md        # Завдання Дня 2 (Project 1 Day 2)
    │   ├── p-1_d-3.md        # Завдання Дня 3 (Project 1 Day 3)
    │   ├── p-1_d-4.md        # Завдання Дня 4 (Project 1 Day 4)
    │   ├── p-1_d-5.md        # Завдання Дня 5 (Project 1 Day 5)
    │   └── p-2_d-6.md        # Завдання Дня 6 (Project 1 Day 6)
    └── answers/              # Детальні відповіді (Project 1)
        ├── p-1_d-1.md        # Відповіді Дня 1 (Project 1 Day 1 Answers)
        ├── p-1_d-2.md        # Відповіді Дня 2 (Project 1 Day 2 Answers)
        ├── p-1_d-3.md        # Відповіді Дня 3 (Project 1 Day 3 Answers)
        ├── p-1_d-4.md        # Відповіді Дня 4 (Project 1 Day 4 Answers)
        └── p-1_d-5.md        # Відповіді Дня 5 (Project 1 Day 5 Answers)
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

### [День 6](./docs/tasks/p-2_d-6.md)
* **Алгоритмічний розігрів:** ([index.day_6.ts](./index.day_6.ts)).

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
