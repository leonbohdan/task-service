# 🚀 14-денний інтенсив: TypeScript, NestJS та Архітектура Бекенду

Репозиторій навчальних матеріалів, щоденних практичних завдань, алгоритмічних розігрівів та підготовки до технічних інтерв'ю для рівня Middle/Senior Backend Developer (NestJS / TypeScript).

---

## 📁 Структура репозиторію

```text
task-service/
├── day_1.md              # День 1: Utility Types, Docker (Postgres), основи NestJS
├── day_2.md              # День 2: Життєвий цикл запиту (Pipes, Guards, Interceptors, Decorators)
├── index.day_1.ts        # Розв'язок розігріву Дня 1 (агрегація подій користувачів)
├── index.day_2.ts        # Розв'язок розігріву Дня 2 (побудова дерева категорій Flat-to-Tree)
└── docs/                 # Теоретичні матеріали та відповіді на питання співбесід
    └── day_1_answers.md  # Детальні відповіді на питання Дня 1
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
* **Теорія та співбесіда:** Точний порядок виклику компонентів у NestJS Request Lifecycle, Interceptor vs Middleware, нюанси `transform: true`.

---

## 🛠️ Запуск алгоритмічних завдань

Для швидкого виконання TypeScript файлів без попередньої компіляції використовуйте [tsx](https://github.com/privatenumber/tsx):

```bash
# Запуск розігріву Дня 1
npx tsx index.day_1.ts

# Запуск розігріву Дня 2
npx tsx index.day_2.ts
```

---

## 📦 Супутні проєкти

* **`order-inventory-service`** — повноцінний мікросервіс (Transactional Order & Inventory API), що розробляється паралельно в ході інтенсиву на базі NestJS, TypeORM/Prisma, PostgreSQL та Docker.
