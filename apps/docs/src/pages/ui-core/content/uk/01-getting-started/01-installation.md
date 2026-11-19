# Встановлення

ui-core постачається як CSS-класи та невеликі помічники на TypeScript, тож працює з будь-яким
фреймворком — або без нього.

```sh
pnpm add @mainset/ui-core
```

## Використання

**Зі збирачем JS** (адаптер React, Vite, rspack, webpack…) — нічого налаштовувати не треба:
кожен модуль елемента імпортує власний CSS (і спільну основу), тож у бандлі опиняється лише CSS
тих елементів, які ви використовуєте. Імпортуйте [шрифти](#шрифти) один раз, у корені застосунку.

**Без збирача** (звичайний HTML, серверні шаблони, Vue/Svelte/…):

```html
<!-- the reset is optional; when used, load it first -->
<link rel="stylesheet" href="@mainset/ui-core/styles/reset.css" />
<!-- includes the typefaces -->
<link rel="stylesheet" href="@mainset/ui-core/styles/index.min.css" />

<button
  class="ms-surface ms-surface--variant-outlined ms-surface--hover-all ms-tone-error
         ms-control ms-control--size-sm ms-button"
>
  Delete
</button>
```

Ті самі класи повертає рецепт (він також додає базові утилітарні класи `ms-background ms-border`):

```ts
buttonRecipe({ srfVariant: 'outlined', srfTheme: 'error', ctlSize: 'sm' });
// → "ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined
//    ms-control ms-control--size-sm ms-button ms-tone-error"
```

| Вхід                                        | Вміст                                                                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@mainset/ui-core`                          | конфігурації класів, рецепти, типи, утиліти                                                                                                       |
| `@mainset/ui-core/styles/index.css`         | шрифти + основа + усі елементи                                                                                                                    |
| `@mainset/ui-core/styles/index.min.css`     | те саме, мініфіковане (без збирача)                                                                                                               |
| `@mainset/ui-core/styles/normalize.min.css` | без вигляду: шар normalize кожного компонента, без стилю mainset ([шари](../01-getting-started/layers-and-direction.md#two-layers-per-component)) |
| `@mainset/ui-core/styles/foundation.css`    | усі дизайн-токени + базові стилі + класи тонів                                                                                                    |
| `@mainset/ui-core/styles/reset.css`         | необов’язковий сучасний reset (`normalize.css` — псевдонім)                                                                                       |
| `@mainset/ui-core/styles/fonts.css`         | шрифти mainset, лише `@font-face` ([шрифти](#шрифти))                                                                                             |
| `@mainset/ui-core/scss/mixins`              | `media-up()`, `responsive-variants`, помічники                                                                                                    |

## Шрифти

Текст mainset набрано шрифтом [Onest](https://fonts.google.com/specimen/Onest), а технічні мітки
(надзаголовки, код, дані) — [JetBrains Mono](https://www.jetbrains.com/lp/mono/): змінні шрифти,
латиниця та кирилиця, обидва під ліцензією SIL OFL 1.1 (ліцензії лежать поруч із файлами).
Токени шрифтів називають їх за замовчуванням; файли завантажує одна таблиця стилів, яку
**імпортують один раз на сторінку**:

```ts
// app root, or the micro-frontend shell (not in each remote)
import '@mainset/ui-core/styles/fonts.css';
```

Вона навмисно не входить до CSS окремих елементів: кожен бандл, що її імпортує, отримує власну
копію файлів, тож віддалені модулі одного shell завантажували б ті самі шрифти кілька разів.
Шрифти поділено за писемністю (`unicode-range`): сторінка завантажує лише ті файли, які потрібні
її тексту. Поки файл не завантажився, його заміняє локальний шрифт, підігнаний під метрики
(`Onest Fallback`: Arial; `JetBrains Mono Fallback`: Courier New), тож текст не зсувається, коли
з’являється вебшрифт. Без цієї таблиці стилів показуються системні шрифти. Інший шрифт — це
один токен: `:root { --ms-font-family-text-sans: 'Inter', system-ui, sans-serif; }`.
