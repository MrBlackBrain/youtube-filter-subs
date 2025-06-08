# Code Refactoring Plan

This document outlines the plan to refactor the codebase to improve its structure, reduce repetition (DRY), and enhance maintainability.

## Task Checklist

### Phase 1: Refactor Popup Script

- [ ] 1.1. Create a settings configuration data structure
- [ ] 1.2. Generate UI from the configuration data
- [ ] 1.3. Clean up script loading

### Phase 2: Refactor Content Script

- [ ] 2.1. Create a context object for modules
- [ ] 2.2. Break down the `main` function

### Phase 3: Refactor Settings Logic

- [ ] 3.1. Replace hardcoded HTML with `document.createElement`
- [ ] 3.2. Split `settings.js` into smaller modules

### Phase 4: General Code Quality and Consistency

- [ ] 4.1. Centralize default settings
- [ ] 4.2. Refactor URL checking functions
- [ ] 4.3. Adopt a consistent coding style

### Phase 5: Local Development and Testing Setup

- [x] 5.1. Initialize a `package.json` file
- [x] 5.2. Add a Linter (ESLint)
- [x] 5.3. Introduce a Build Process
- [x] 5.4. Create npm scripts
- [ ] 5.5. Add Automated Testing (Optional)

### Phase 6: Advanced Refactoring (Optional)

- [x] 6.1. Introduce a build process

### Phase 7: Refactor Folder Structure (src/ Migration)

- [x] 7.1. Create a `src/` directory
- [x] 7.2. Organize scripts and styles
- [x] 7.3. Move and update other folders
- [x] 7.4. Update references and imports
- [x] 7.5. Adjust build and tooling configuration
- [x] 7.6. Update documentation
- [x] 7.7. Clean up root directory

---

## Detailed Task Descriptions

## Phase 1: Refactor Popup Script (`popup.js`)

The `popup.js` script is highly repetitive, with many similar calls to `settings.createRow`. We can refactor this by defining the settings in a data structure and then generating the UI from that structure.

### 1.1. Create a settings configuration data structure

- In a new file, `popup/settings-config.js` or directly in `popup.js`, define an array of objects. Each object will represent a setting row and contain all the necessary parameters for the `settings.createRow` function (label, mode, setting key, default value, etc.).
- This will centralize the configuration for the popup UI and make it easier to add, remove, or modify settings.

### 1.2. Generate UI from the configuration data

- In `popup.js`, replace the repetitive `settings.createRow` calls with a loop that iterates over the settings configuration array.
- Inside the loop, call `settings.createRow` with the data from the current object.
- This will significantly reduce the lines of code in `popup.js` and make it more maintainable.

### 1.3. Clean up script loading

- Use `Promise.all` to load `common.js`, `settings.js`, and `progress.js` in parallel, which is cleaner than the current nested `import()` structure.

## Phase 2: Refactor Content Script (`content.js`)

The `content.js` script has a good modular structure, but the dependency management can be improved, and the main function is too large.

### 2.1. Create a context object for modules

- Instead of destructuring all imported modules into a long list of constants and passing them as individual arguments, create a single `context` or `app` object.
- This object will hold all the imported modules. For example: `const context = { state, config, utils, ... };`.
- Pass this single context object to the `main` function and other functions that need it. This simplifies function signatures.

### 2.2. Break down the `main` function

- The `main` function in `content.js` is doing too much. Break it down into smaller, more focused functions. For example:
  - `initUI(context)`: Initializes all UI elements (buttons, menus, etc.).
  - `initState(context)`: Initializes the application state from storage.
  - `initObservers(context)`: Sets up the `MutationObserver` and other event listeners.
- The `main` function will then become a simple orchestrator that calls these initialization functions.

## Phase 3: Refactor Settings Logic (`settings.js`)

`settings.js` is a monolithic file that handles UI creation, state, and complex logic like drag-and-drop. It should be broken down into smaller modules.

### 3.1. Replace hardcoded HTML with `document.createElement`

- In functions like `createToggle` and `createDraggableIcon`, replace the `innerHTML` assignments with programmatic element creation using `document.createElement` and `element.appendChild`. This is safer and more maintainable.

### 3.2. Split `settings.js` into smaller modules

- Create a new directory, e.g., `settings/`, to house the refactored modules.
- `settings/ui.js`: Will contain functions for creating DOM elements (`createRow`, `createToggle`, etc.).
- `settings/drag-drop.js`: Will contain all the logic for drag-and-drop functionality.
- The main `settings.js` file will then import from these modules and expose the public API.

## Phase 4: General Code Quality and Consistency

### 4.1. Centralize default settings

- In `common.js`, group all `default_...` constants into a single `defaultSettings` object. This makes it easier to see all default values in one place.

### 4.2. Refactor URL checking functions

- In `common.js`, the `isSubscriptions`, `isShorts`, etc., functions are very similar. Create a generic function that takes a URL pattern and returns a boolean, reducing code duplication.

### 4.3. Adopt a consistent coding style

- Ensure consistent use of `const` vs. `let`, formatting, and naming conventions throughout the codebase.
- Add JSDoc comments to all major functions to document their purpose, parameters, and return values.

## Phase 5: Local Development and Testing Setup ✅ MOSTLY COMPLETED

To catch JavaScript errors and improve the development workflow without needing to manually load the extension in Chrome for every change, we will set up a local build and testing environment.

### 5.1. Initialize a `package.json` file ✅ COMPLETED

- ✅ Created `package.json` file with project metadata and dependencies.

### 5.2. Add a Linter (ESLint) ✅ COMPLETED

- ✅ Installed ESLint to statically analyze the code and catch common errors and style issues.
- ✅ Configured ESLint with a suitable ruleset for browser extensions and modern JavaScript.

### 5.3. Introduce a Build Process ✅ COMPLETED

- ✅ Set up a modern JavaScript build process using `esbuild`.
- ✅ Configured for bundling files to improve performance and automatic code minification.

### 5.4. Create npm scripts ✅ COMPLETED

- ✅ Added scripts to `package.json` to run the linter and build the extension (`pnpm run lint`, `pnpm run build`).

### 5.5. Add Automated Testing (Optional)

- Integrate a testing framework like Jest for unit tests and Puppeteer for end-to-end tests to automate the testing of the extension's functionality.

## Phase 6: Advanced Refactoring ✅ COMPLETED

### 6.1. Introduce a build process ✅ COMPLETED

- ✅ Set up a modern JavaScript build process using `esbuild`.
- ✅ Configured for:
  - Bundling files to improve performance
  - Automatic code minification
  - Modern JavaScript support

## Phase 7: Refactor Folder Structure (src/ Migration) ✅ COMPLETED

To improve maintainability, scalability, and clarity, refactor the repository to use a modern source folder structure.

### 7.1. Create a `src/` directory ✅ COMPLETED

- ✅ Moved all source files and folders (JavaScript, CSS, icons, locales, etc.) into a new `src/` directory at the root of the project.

### 7.2. Organize scripts and styles ✅ COMPLETED

- ✅ Under `src/`, created:
  - `src/scripts/` for all JavaScript/TypeScript source files (e.g., `content.js`, `popup.js`, `settings.js`, etc.).
  - `src/styles/` for all CSS files (e.g., `content.css`, `popup.css`).

### 7.3. Move and update other folders ✅ COMPLETED

- ✅ Moved the following into `src/`:
  - `icons/` → `src/icons/`
  - `_locales/` → `src/_locales/`
  - `lang/` → `src/lang/`
  - `functions/` → `src/functions/`
  - `popup.html` → `src/popup.html`

### 7.4. Update references and imports ✅ COMPLETED

- ✅ Updated all file references, imports, and paths in the codebase and in the manifest to reflect the new structure.
- ✅ Updated `manifest.json` with new paths for icons, content scripts, web accessible resources, and popup
- ✅ Updated `popup.html` with new paths for CSS and JavaScript files
- ✅ Updated `content.js` and `popup.js` with new import paths

### 7.5. Adjust build and tooling configuration ✅ COMPLETED

- ✅ Updated build scripts in `package.json` to use the new `src/` structure as the source root.
- ✅ ESLint configuration supports the new structure with `**/*.{js,mjs,cjs}` pattern.

### 7.6. Update documentation ✅ COMPLETED

- ✅ Updated the `README.md` to include the new folder structure and file locations.
- ✅ Added project structure documentation and development commands.

### 7.7. Clean up root directory ✅ COMPLETED

- ✅ All source files have been moved to the `src/` directory.
- ✅ Root directory now only contains configuration, manifest, and documentation files.
