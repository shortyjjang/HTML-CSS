# Static files Readme

## Regarding JS modules

A few JS modules are built via [NPM](https://www.npmjs.com/) command. Available commands are on `/package.json`'s 'script' section. You can run those `$ npm run <script name> `.  Built bundles are linked via `/templates/fancy4_0/_overlay-thing.html`, which get included from `/templates/fancy4_0/_base.v2.html`. Bundles are built with Webpack/Babel.

- Current structure: (see `/asset_pipeline/pipeline_settings.py` also for original filenames)
    - `/_static/_ui/js/shared-deps.min.js` - Shared deps
    - `/_static/_ui/js/fancy-utils.min.js` - Fancy utils, mostly fancy.com specific and have no external dependencies
    - if viewer is admin:
        - `/_static/_ui/js/overlay-admin.js` - admin sidebar component for detail overlay.
    - `_ui/js/overlay-thing.bundle.min.js` - Detail overlay component and biz logics

All modules are able to access from `window.__F`

### Building modules

Build everything except apple pay v1/v2: `npm run build-commit` (`npm run clean` `npm run build`)
Build Apple Pay v1: `npm run build:applepay` / `npm run build:applepay-v2`

### Source location

`_static/modules/ui/` contains the most of modern UI modules (article-admin, overlay-article, overlay-thing, etc.)

### Projects

`overlay-thing`: /things/...

`overlay-article`: /articles/...

`storefront-checkout`: Storfront checkout page module.

### Overlay thing project structure

Using React, Redux, React Router, TypeScript

TypeScript is lightly used, there are still a lot of errors generated still since it is hard to mock server-side data shape, needs time to work on. Currently type errors are ignored on build. 

Global fetching and data managing are done via Redux, local data managements are done via React. It requests from REST Thing API (See `action/action-helpers.ts > fetchThing()`) on initial mount and when it 'hydrates', React renders subcomponents.

project root: `_static/modules/ui/overlay-thing/`

#### components

- `index.tsx` : imports components and mounts it to DOM
- `components/Overlay.tsx` : root component which handles most of root-component level logic
- `components/Recommendation.js` : bottom-scrolling recommended items
- `components/popup/...` : popups, mostly dynamic imports (see `import(/* webpackChunkName: "OverlayThing.popup" ...`) and loaded on actual render
- `components/sidebar/...` : sidebar components by its type
- `components/Admin, components/AdminSimple.js` : admin component

#### Redux actions

- `action/action-helpers.ts` : mostly server requesting actions and overlay-related

### fancyutils

main: `_static/modules/ui/libf/FancyUtils.ts`

many js utility functions used across projects.

### common-components

root: `_static/modules/ui/libf/common-components/index.js`

React components used across projects. (Video, Share popover etc)
