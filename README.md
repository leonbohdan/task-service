# 🚀 14-денний інтенсив: TypeScript, NestJS та Архітектура Бекенду

Репозиторій навчальних матеріалів, щоденних практичних завдань, алгоритмічних розігрівів та підготовки до технічних інтерв'ю для рівня Middle/Senior Backend Developer (NestJS / TypeScript).

---

## 📁 Структура репозиторію

```text
task-service/
├── day_1.md              # День 1: Utility Types, Docker (Postgres), основи NestJS
├── day_2.md              # День 2: Життєвий цикл запиту (Pipes, Guards, Interceptors, Decorators)
├── day_3.md              # День 3: Реляційні БД, зв'язки (1:1, 1:N, N:M) та ORM-міграції
├── day_4.md              # День 4: Індексація в SQL, оптимізація запитів та EXPLAIN ANALYZE
├── index.day_1.ts        # Розв'язок розігріву Дня 1 (агрегація подій користувачів)
├── index.day_2.ts        # Розв'язок розігріву Дня 2 (побудова дерева категорій Flat-to-Tree)
├── index.day_3.ts        # Розв'язок розігріву Дня 3 (симуляція INNER JOIN та LEFT JOIN за O(N+M))
├── index.day_4.ts        # Розв'язок розігріву Дня 4 (композитний індекс: Hash Map + Binary Search)
└── docs/                 # Теоретичні матеріали та відповіді на питання співбесід
    ├── day_1_answers.md  # Детальні відповіді на питання Дня 1
    ├── day_2_answers.md  # Детальні відповіді на питання Дня 2
    ├── day_3_answers.md  # Детальні відповіді на питання Дня 3
    └── day_4_answers.md  # Детальні відповіді на питання Дня 4
```

---

## 🗺️ Програма та навігація по днях

### [День 1: TypeScript Utility Types, Docker (Postgres) та Основи NestJS](./day_1.md)
* **Алгоритмічний розігрів:** Агрегація масиву подій `RawEvent[]` за допомогою методу `.reduce()` без використання `any` ([index.day_1.ts](./index.day_1.ts)).
* **Інфраструктура:** Створення `docker-compose.yml` з сервісами PostgreSQL 16/17 та pgAdmin, налаштування bridge-мережі та healthcheck.
* **NestJS ядро:** Ініціалізація проєкту `order-service`, створення модулів `Inventory` та `Orders`, демонстрація Dependency Injection (DI).
* **Теорія та співбесіда:** Розбір `Record` vs Index Signature, generics в Utility Types, DI vs IoC ([docs/day_1_answers.md](./docs/day_1_answers.md)).

### [День 2: Життєвий цикл запиту в NestJS (Pipes, Guards, Interceptors, Decorators)](./day_2.md)
* **Алгоритмічний розігрів:** Перетворення плаского списку категорій у деревоподібну структуру (`buildCategoryTree`) за $O(N)$ з сортуванням за `order` ([index.day_2.ts](./index.day_2.ts)).
* **Валідація та безпека:** DTO валідація за допомогою `class-validator`, глобальний `ValidationPipe`, авторизація за ролями через `RolesGuard` та `@Roles()`.
* **Інтерцептори та декоратори:** `LoggingInterceptor`, уніфікація формату відповідей через `TransformInterceptor`, кастомний param decorator `@CurrentUser()`.
* **Теорія та співбесіда:** Точний порядок виклику компонентів у NestJS Request Lifecycle, Interceptor vs Middleware, нюанси `transform: true` ([docs/day_2_answers.md](./docs/day_2_answers.md)).

### [День 3: Реляційні бази даних, SQL-зв'язки (1:1, 1:N, N:M) та ORM-міграції](./day_3.md)
* **Алгоритмічний розігрів:** Симуляція SQL `INNER JOIN` та `LEFT JOIN` у пам'яті через Generics та `Map` за $O(N + M)$ ([index.day_3.ts](./index.day_3.ts)).
* **Моделювання даних:** Проєктування зв'язків між сутностями: 1:1 (`User` $\leftrightarrow$ `Profile`), 1:N (`User` $\leftrightarrow$ `Order`, `Order` $\leftrightarrow$ `OrderItem`), N:M (`Product` $\leftrightarrow$ `Category`).
* **Міграції та Seeding:** Створення та накатка міграцій, foreign keys, `ON DELETE CASCADE/RESTRICT`, генерація тестових даних.
* **Теорія та співбесіда:** Розбір проблеми N+1, фіксація ціни в `OrderItem`, стратегії `ON DELETE`, Eager vs Lazy Loading у Node.js ([docs/day_3_answers.md](./docs/day_3_answers.md)).

### [День 4: Індексація в SQL, оптимізація запитів та EXPLAIN ANALYZE](./day_4.md)
* **Алгоритмічний розігрів:** Власний композитний індекс у пам'яті (`ProductIndex`) з хешуванням `category:inStock` ($O(1)$) та бінарним пошуком за діапазоном цін `price` ($O(\log K)$) проти лінійного пошуку ($O(N)$) ([index.day_4.ts](./index.day_4.ts)).
* **Аналіз запитів у PostgreSQL:** Генерація 200,000+ записів, дослідження `EXPLAIN (ANALYZE, BUFFERS)`, порівняння `Seq Scan`, `Index Scan`, `Bitmap Index Scan`.
* **Проєктування індексів:** Складені B-Tree індекси, перевірка правила лівого префікса (Leftmost Prefix Rule), часткові індекси (Partial Indexes) для оптимізації черг замовлень.
* **Теорія та співбесіда:** Внутрішня будова $B^+$ Tree, порівняння типів сканування (`Index Scan` vs `Bitmap Index Scan` vs `Index Only Scan`), компроміси та ціна надлишкової індексації (Write penalty, Bloat, HOT updates) ([docs/day_4_answers.md](./docs/day_4_answers.md)).

---

## 🛠️ Запуск алгоритмічних завдань

Для швидкого виконання TypeScript файлів без попередньої компіляції використовуйте [tsx](https://github.com/privatenumber/tsx):

```bash
# Запуск розігріву Дня 1
npx tsx index.day_1.ts

# Запуск розігріву Дня 2
npx tsx index.day_2.ts

# Запуск розігріву Дня 3
npx tsx index.day_3.ts

# Запуск розігріву Дня 4
npx tsx index.day_4.ts
```

---

## 📦 Супутні проєкти

* **`order-inventory-service`** — повноцінний мікросервіс (Transactional Order & Inventory API), що розробляється паралельно в ході інтенсиву на базі NestJS, TypeORM/Prisma, PostgreSQL та Docker.
