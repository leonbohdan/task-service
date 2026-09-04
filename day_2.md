# День 2: Життєвий цикл запиту в NestJS (Pipes, Guards, Interceptors, Decorators)

Сьогодні ми переходимо до одного з найважливіших аспектів розробки на NestJS, про який запитують на кожній співбесіді — **Request Lifecycle** (життєвий цикл запиту), а також продовжуємо тренувати складні маніпуляції даними на TypeScript.

---

## ⏱️ Розклад Дня 2 (6 годин)

| Блок       | Тривалість | Тема                                                       | Опис                                                                                                 |
| :--------- | :--------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Блок 1** | 1 год      | Алгоритмічний розігрів (TS/JS)                             | Трансформація плаского списку категорій у дерево (Flat-to-Tree) або розрахунок замовлень зі знижками |
| **Блок 2** | 2 год      | Валідація та безпека (Pipes & Guards)                      | `ValidationPipe`, валідація вхідних DTO (`class-validator`), реалізація `AuthGuard` та `RolesGuard`  |
| **Блок 3** | 2 год      | Обробка відповідей та контекст (Interceptors & Decorators) | Response Transform Interceptor, Logging Interceptor, Custom Param Decorator (`@CurrentUser()`)       |
| **Блок 4** | 1 год      | Рев'ю та інтерв'ю-підготовка                               | Порядок виконання компонентів у ланцюжку NestJS, різниця між Middleware та Interceptor               |

---

## 🧩 Завдання 1: Алгоритмічний розігрів (Data Structures & Recursion/Reduce)

### Мета:

Розв'язати класичну задачу продуктового бекенду: перетворення плаского списку сутностей бази даних у деревоподібну структуру для меню/категорій товарів.

### Вхідні дані:

```typescript
export type FlatCategory = {
  id: string;
  parentId: string | null;
  name: string;
  order: number;
};

export const flatCategories: FlatCategory[] = [
  { id: "c1", parentId: null, name: "Електроніка", order: 1 },
  { id: "c2", parentId: "c1", name: "Смартфони", order: 1 },
  { id: "c3", parentId: "c1", name: "Ноутбуки", order: 2 },
  { id: "c4", parentId: "c2", name: "Аксесуари для смартфонів", order: 2 },
  { id: "c5", parentId: "c2", name: "Чохли", order: 1 },
  { id: "c6", parentId: null, name: "Одяг", order: 2 },
  { id: "c7", parentId: "c6", name: "Взуття", order: 1 },
];
```

### Вимоги:

1. **Тип вихідних даних:**
   Опиши рекурсивний тип `CategoryTreeNode`:
   ```typescript
   export type CategoryTreeNode = FlatCategory & {
     children: CategoryTreeNode[];
   };
   ```
2. **Функція перетворення:**
   Напиши функцію `buildCategoryTree(items: FlatCategory[]): CategoryTreeNode[]`:
   - Складність має бути $O(N)$ (використай хеш-мапу / `Map` чи об'єкт для швидкого доступу за `id`).
   - Дочірні елементи (`children`) на кожному рівні повинні бути відсортовані за зростанням поля `order`.
   - Кореневі елементи (`parentId === null`) повертаються у масиві верхнього рівня, також відсортовані за `order`.

---

## 🛡️ Завдання 2: Валідація (Pipes) та Авторизація (Guards)

### Мета:

Захистити ендпоінти створення замовлень у `order-service` від некоректних даних і неавторизованого доступу.

### Кроки:

1. **DTO з валідацією:**
   - Встанови необхідні пакети:
     ```bash
     npm i class-validator class-transformer
     ```
   - Створи `CreateOrderDto`:
     - `items`: непорожній масив об'єктів товару (`productId: string` у форматі UUID, `quantity: number` мінімум 1).
     - `deliveryAddress`: обов'язковий непорожній рядок.
     - `paymentMethod`: enum (`'CARD' | 'CASH' | 'CRYPTO'`).
   - Підключи глобальний `ValidationPipe` у `main.ts` з прапорцями `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.

2. **Roles Guard:**
   - Створи декоратор `@Roles('ADMIN', 'CUSTOMER')` за допомогою `SetMetadata` або `Reflector.createDecorator()`.
   - Реалізуй `RolesGuard` (`implements CanActivate`), який перевіряє роль користувача із заголовка запиту (наприклад, `x-user-role`) та порівнює її з ролями, дозволеними для ендпоінта.

---

## 🔄 Завдання 3: Interceptors та Custom Param Decorator

### Мета:

Уніфікувати формат відповіді API та спростити отримання даних користувача в контролерах.

### Кроки:

зуй `RolesGuard` (`implements CanActivate`), який перевіряє роль користувача із заголовка запиту (наприклад, `x-user-role`) та порівнює її з ролями, дозволеними для ендпоінта.

---

## 🔄 Завдання 3: Interceptors та Custom Param Decorator

### Мета

Уніфікувати формат відповіді API та спростити отримання даних користувача в контролерах.

### Кроки

1. **Logging & Timing Interceptor:**
   - Створи `LoggingInterceptor` (`implements NestInterceptor`).
   - Він повинен фіксувати метод, URL запиту, час виконання в мілісекундах та виводити результат у консоль (`[GET] /orders - 12ms`).

2. **Transform Response Interceptor:**
   - Створи `TransformInterceptor`, який загортає будь-яку успішну відповідь у стандартизовану структуру:

     ```json
     {
       "success": true,
       "data": { ... },
       "timestamp": "2026-09-03T17:00:00.000Z"
     }
     ```

3. **Custom Parameter Decorator `@CurrentUser()`:**
   - Створи декоратор за допомогою `createParamDecorator`, який витягує об'єкт користувача або конкретне поле (наприклад, `req.headers['x-user-id']`) безпосередньо в аргумент методу контролера:

     ```typescript
     @Post()
     createOrder(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) { ... }
     ```

---

## 🎯 Питання для самоперевірки та інтерв'ю

1. **Життєвий цикл запиту в NestJS:** Який точний порядок виконання між `Middleware`, `Guards`, `Interceptors`, `Pipes` та `Filters`?
2. **Interceptors vs Middleware:** Коли варто обрати Interceptor, а коли звичайний Express/Nest Middleware?
3. **Pipes:** Що насправді робить прапорець `transform: true` у `ValidationPipe`?
4. **Guards:** Якщо на контролері висить Guard, чи спрацює Pipe у разі відмови доступу (коли Guard повернув `false`)? Чому?
