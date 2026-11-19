# Кнопка

Кнопка — це три класи, що працюють разом: **поверхня** (тон × варіант — її кольори),
**контрол** (висота та внутрішні відступи, спільні з полями вводу) і механіка **кнопки**.
Рецепт поєднує їх, тож один виклик дає весь рядок класів.

## Варіанти

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button"
>
  Суцільна
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-soft ms-control ms-control--size-base ms-button"
>
  М’яка
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ms-control ms-control--size-base ms-button"
>
  Контурна
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-base ms-button"
>
  Прозора
</button>
```

`srfVariant`: `solid` (головна дія), `soft`, `outlined`, `ghost` (панелі інструментів, тихі дії).

## Тони

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-primary"
>
  Основний
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-secondary"
>
  Другорядний
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-tertiary"
>
  Третинний
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-success"
>
  Успіх
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-error"
>
  Помилка
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ms-control ms-control--size-base ms-button ms-tone-base"
>
  Базовий
</button>
```

`srfTheme` додає кнопці клас тону. Тон на будь-якому предку однаково фарбує всі кнопки всередині —
без жодного пропса:

```html
<div class="ms-tone-error">
  <button class="… ms-button">Retry</button>
</div>
```

## Розміри

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-xs ms-button"
>
  Дуже мала
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-sm ms-button"
>
  Мала
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button"
>
  Базова
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-lg ms-button"
>
  Велика
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-xl ms-button"
>
  Дуже велика
</button>
```

`btnSize` (`ctlSize` у рецепті): `xs`, `sm`, `base` (за замовчуванням), `lg`, `xl`. Поле вводу того
самого розміру має таку саму висоту, тож вони вирівнюються в рядку.

## Кнопка-іконка

`ms-button--icon` (`btnIsIcon`) робить кнопку квадратом висотою з контрол — для самої іконки.
Дайте їй `aria-label`.

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-base ms-button ms-button--icon ms-tone-base"
  aria-label="Закрити"
>
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ms-control ms-control--size-base ms-button ms-button--icon ms-tone-base"
  aria-label="Закрити"
>
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-button--icon ms-tone-error"
  aria-label="Закрити"
>
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
</button>
```

## Іконки в кнопці

Іконка перед підписом або після нього кладеться у `span` з класом `ms-button__icon` розміром із
текст (`1.15em`); відступ між ними — це `gap` кнопки. З `ms-hover--group` наведення на кнопку
запускає власний ефект наведення іконки.

```html preview
<a
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-hover--group"
  href="#іконки-в-кнопці"
  >Почати<span class="ms-button__icon"
    ><svg
      class="ms-hover--nudge-end"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" /></svg></span
></a>
```

## Використання

```ts
import { buttonRecipe } from '@mainset/ui-core';

buttonRecipe({ srfVariant: 'solid', srfTheme: 'primary', ctlSize: 'lg' });
```

```tsx
// React
<Button srfVariant="solid" btnSize="lg">Save</Button>
<Button btnAs="a" href="/pricing" srfVariant="outlined">See pricing</Button>
```

Натиснута кнопка опускається на піксель і трохи зменшується; кожен варіант показує колір
наведення під час натискання, тож сенсорні екрани також отримують відгук. Налаштування: токени
`--ms-button-*` і `--ms-control-*` ([токени](../../02-theming/04-tokens.md#button)).
