Thanks for contributing to Brim! Here are a few pointers to help you understand the code base and feel confident making changes.

- [Video](#video)
- [Entry Point](#entry-point)
- [Directory Structure](#directory-structure)
- [Libraries](#libraries)
- [Patterns](#patterns)
- [Diverging Patterns](#diverging-patterns)
- [Migrations](#migrations)

## Video

A [YouTube video](https://www.youtube.com/watch?v=CPel0iu1pig) is available that provides a detailed walk-through of the material covered in this outline.

## Entry Point

A very high level overview of the boot process goes like this:

The first file executed is `src/js/electron/main.js`. It will create a BrowserWindow and load the `search.html` file, which loads JavaScript in `src/js/search.js`. `src/js/search.js` creates the DOM needed to mount React, then renders the `src/js/components/App.js` component.

## Directory Structure

```
├── app (renderer code)
│   ├── core (generic shared code)
│   ├── features (larger app features)
│   ├── initializers (code run on startup)
│   ├── plugins (plugin code)
│   ├── routes (entry points for each url)
│   ├── state (ui state)
│   ├── window-a.tsx (window entry points)
│   └── window-b.tsx
├── electron (main process code)
└── ppl (licensed code)
```


**Import Rule**: Only import modules from "core", "state", or your own descendants. 

Exceptions:
* Components in "routes" can import modules from "features".
## Libraries

We are an Electron app, so [electron](https://www.electronjs.org/docs) is the core library we use. For those unfamiliar, it's helpful to understand the [main vs renderer processes](https://www.electronjs.org/docs/tutorial/quick-start#main-and-renderer-processes) in an Electron app.

Additionally, we rely heavily on the node modules listed here:

**JavaScript**

- [TypeScript](https://www.typescriptlang.org/) Check for errors with `npm run tsc`
- [ESLint](https://eslint.org/) Check for errors with `npm run lint`
- [Prettier](https://prettier.io/docs/en/index.html) All code must be formatted with `npm run format`

**Rendering**

- [React](https://reactjs.org/docs/getting-started.html)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html) We make use of the hooks api extensively
- [Styled Components](https://styled-components.com/) For CSS in JS

**State Management**

- [Redux](https://redux.js.org/introduction/getting-started)
- [Redux Thunk](https://github.com/reduxjs/redux-thunk) A small utility to allow for async actions
- [Immer](https://immerjs.github.io/immer/) Used in reducers to work with immutable state in a more convenient way

**Testing**

- [Jest ](https://jestjs.io/docs/en/getting-started) Unit tests are run with `npm run test`
- [Spectron](https://www.electronjs.org/spectron) Used for integration testing `npm run itest`

## Patterns

**Testing**

Tests go right next to file they are testing with a `.test.js` suffix. Tests can accompany:

- State slices (actions, selectors)
- Business logic
- Domain classes
- Utility classes
- React Components

## Diverging Patterns

Some areas of the code do the same thing in two different ways. It can be difficult for new developers to know which pattern to choose. Hopefully this will help.

**Models**

Don't put new classes in the `src/js/models` directory. Instead, put domain classes in the `src/js/brim` directory and put utility models in the `src/js/lib/` directory. The models directory used to contain all domain and utility classes. Note that the structures in `src/js/lib` are also in transition. There are some domain specific ones there that should be moved.

**Styles**

Use the Styled Components library to style new components. Previously, we used scss files located in `src/css`. Many of the components are styled with scss, and class names, but we recently committed to Styled Components. We also have a "theme" that holds all the common colors and styles used in our UI.

**Functional Components**

Do not make new components using the React "Class" component API. Instead use the functional component API.

**Animation**

There is no solid convention on how to create animations. We've attempted `anime.js`, `react-spring.js`, native Web Animations, and css animation/transition properties. New code can use any method they prefer and seems appropriate. Avoid react-spring because there are lots of API changes coming in v9. In the future, for drag and drop (like dragging around the tabs), we'd like to try out `react-beautiful-dnd`, which could replace our usage of `react-spring` and make the code more readable.

**API Client**

Use the `zealot` client to communicate with the backend. This is used for searching, getting the list of spaces, ingesting into a space, and more. We are transitioning away from using the `BoomClient` for this purpose.

## Migrations

Because we persist state on a user's computer, if they upgrade Brim and we've changed the expected state, we need to migrate the old state. If any of the reducers in `src/js/state` are changed, we need to write a migration. There is a tool we built to help with this. You can run, for example:

```bash
bin/gen migration addScrollPositionToViewer
```

This creates a file in `src/js/state/migrations` with a function that can manipulate the persisted state from the previous version.

See the [[Adding Migrations]] page for a more detailed guide.

## Questions?

We appreciate your interest in improving Brim. If you've got questions that aren't answered here or in the [video](#video), please join our [public Slack](https://www.brimsecurity.com/join-slack/) workspace and ask!
