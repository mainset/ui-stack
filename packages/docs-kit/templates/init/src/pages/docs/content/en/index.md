---
title: Introduction
---

# Introduction

The first page of the `docs` section: `src/pages/docs/content/en/index.md`.

Add pages next to it, and folders for the sidebar's categories:

```
src/pages/docs/content/
├── _categories.json             ← optional: { "getting-started": { "collapsed": false } }
└── en/
    ├── index.md                 → /docs
    └── 01-getting-started/      ← the category "Getting started"
        └── 01-installation.md   → /docs/getting-started/installation
```

> [!TIP]
> Another folder `src/pages/<section>/content` is another section, in the header.
