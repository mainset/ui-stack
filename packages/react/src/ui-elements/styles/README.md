The best and most scalable strategy for handling color tokens in a modern UI kit is using a multi-tiered design token system (often referred to as an "Aliasing" or "Semantic" system).

Standardizing on just literal names (blue-500) or just context names (primary-500) both present problems at scale. Instead, the industry standard (used by Material Design, Atlassian, GitHub, and Figma) is to use both in a strict hierarchy.

Here is the 3-Tier strategy that will give you infinite flexibility and perfect multi-theme support:

Level 1: Primitive Tokens (The Palette)
These are your literal, literal base colors. They describe exactly what the color is, completely independent of how it is used. They should never change meaning.

Naming: color-[name]-[scale]
Examples: --blue-100, --blue-500, --gray-900, --red-500.
Rule: Never use these directly in your component CSS. If you put background: var(--blue-500) in a Button, it's impossible to switch that button to "Purple" in a new theme without overriding the button's internal CSS.
Level 2: Semantic Tokens (The Intent / Context)
This is the magic layer. Semantic tokens describe how or where the color is used, but not what the actual color is. They act as a bridge, pointing to your Primitive Tokens.

Naming: color-[category]-[variant/state]
Examples: --color-text-primary, --color-bg-surface, --color-border-subtle, --color-action-primary-hover, --color-feedback-danger.
Rule: This is what you use in your CSS Modules.
Level 3: Component Tokens (Optional, but great for UI Kits)
For ultimate flexibility in a commercial UI kit, you map Semantic Tokens to specific Component Tokens.

Naming: [component]-[element]-[state]
Examples: --button-bg-primary-hover
How this actually works for Multiple Themes (The Code)
The beauty of this system is that when you switch themes (Light vs. Dark, or Brand A vs. Brand B), you only change the Level 2 (Semantic) pointers. Your components never change.

```css
/* 1. Primitive Tokens (Never change) */
:root {
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --gray-50: #f9fafb;
  --gray-900: #111827;
  --red-500: #ef4444;
}

/* 2. Semantic Tokens - DEFAULT (Light Theme) */
:root,
[data-theme='light'] {
  --color-bg-base: var(--gray-50);
  --color-text-primary: var(--gray-900);

  --color-action-primary: var(--blue-500);
  --color-action-primary-hover: var(--blue-600);

  --color-feedback-error: var(--red-500);
}

/* 2. Semantic Tokens - DARK THEME */
[data-theme='dark'] {
  /* We flip the background and text... */
  --color-bg-base: var(--gray-900);
  --color-text-primary: var(--gray-50);

  /* Action colors might stay the same, or shift to a lighter blue */
  --color-action-primary: var(--blue-600);
}

/* 2. Semantic Tokens - "HALLOWEEN" THEME */
[data-theme='halloween'] {
  /* The layout remains identical, but the meaning of "primary" changes */
  --color-action-primary: var(--orange-500);
  --color-bg-base: var(--black);
}
```

Then, in your React CSS Module (`Button.module.scss`):

```css
.button {
  background-color: var(--color-action-primary);
  color: var(--color-text-primary);
  /* The button doesn't know if it's blue, orange, light, or dark.
     It just knows it needs the "Primary Action" color. */
}

.button:hover {
  background-color: var(--color-action-primary-hover);
}
```

Why primary-500 is a trap:
Many frameworks use primary-100 through primary-900. But what exactly is primary-100 used for? Is it a background for a badge? Is it text?

If primary-900 goes on primary-100 in light mode, does that invert in dark mode (where primary-100 text goes on a primary-900 background)? You end up writing crazy CSS rules trying to invert scales.

By using exact semantic intents (--color-text-primary-on-brand, --color-bg-surface), Dark Mode just means pointing that variable to a different Primitive Hex code.

Recommended Naming Taxonomy formula:
A great format used by many enterprise teams is:
[Category]-[Concept]-[Property]-[Variant]-[State]

Category: color, space, font
Concept: action, feedback, surface, text, border
Property/Context: primary, secondary, success, danger
State: default (implied), hover, active, disabled
Examples:

color-text-danger
color-bg-surface-hover
color-border-subtle
