Components:

```
'OverlayProvider',
'Col',
'Container',
'Row',
'Popover',
'ModalBasic',
+ 'extendClassName', => RENAMED: `createClassNamedRC`
+ 'Hr',
'createListElements',
'SidebarBasic',
'createSVGMaker',
'asSVG',
'withTabsManager',
+ 'createTypographyElements', => direct import Heading / Paragraph / TextSection
+ 'useCallbackDebounce',
'useFormHandler',
```

Styles:

```
@forward '@mainset/react/styles/main.css';
@use '@mainset/react/scss/utilities' as *;
+ @use '@mainset/react/scss/mixins' as *;
+ @use '@mainset/react/scss/mixins' as *;
+ @use '@mainset/react/scss/mixins' as *;
+ @use '@mainset/react/scss/mixins' as *;

@use '@mainset/react/scss/typography-builder' as *;
x-small => xx-small
smaller => x-small
sm => sm:smaller
xx-large => xl:larger
```
