# Overlays

Dialogs, drawers, popovers, tooltips and menus. ui-core has their classes and states; the
behaviour (focus, keyboard, positioning) is script: the [React containers](https://github.com/mainset/ui-stack/blob/main/packages/react/docs/components.md#overlays-containers),
or your own.

States are attributes, so any script can drive them: `data-state="open" | "closed"` runs the
enter / exit animations, `aria-expanded` / `aria-selected` / `aria-disabled` / `hidden` the rest.
Animations use the motion tokens, so they stop under reduced motion. Keep a closing element
rendered until its `animationend`.
