# Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

Note: New contributors should first contact [Ben Elan](mailto:belan@esri.com) or [Juan Carlos Franco](mailto:JFranco@esri.com) to join the [Calcite Components GitHub team](https://github.com/orgs/Esri/teams/calcite-components/members). Then, clone the repo via SSH key on your machine (this Git workflow is required in order to work with our Chromatic test integration).

## I want to contribute, what should I work on?

Calcite Components is still in its early stages. You can help most by:

- Adding ideas for components by [creating a New Component issue](https://github.com/Esri/calcite-components/issues/new?assignees=&labels=new+component%2C0+-+new%2Cneeds+triage&template=new-component.yml).
- Requesting features for existing components by [creating a Enhancement issue](https://github.com/Esri/calcite-components/issues/new?assignees=&labels=enhancement%2C0+-+new%2Cneeds+triage&template=enhancement.yml).
- Reporting problems by [creating a Bug issue](https://github.com/Esri/calcite-components/issues/new?assignees=&labels=bug%2C0+-+new%2Cneeds+triage&template=bug.yml).
- Working on [the issues marked as `help wanted`](https://github.com/Esri/calcite-components/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee). There is also a `good first issue` label if you are just getting started.
  - Comment on the issue and ask for the action items before you start working. Sometimes additional context is needed, which may not be specified in the issue.
- If you want to help develop components take a look at the [new component issues](https://github.com/Esri/calcite-components/issues?q=is%3Aopen+is%3Aissue+label%3A%22new+component%22). Before starting development please review our [component conventions](./conventions/README.md) and the [Stencil documentation](https://stenciljs.com/docs/introduction).

If you aren't familiar with the basics of Web Components and Shadow DOM, please read through some of the following resources before contributing:

- [Google - Custom Elements v1: Reusable Web Components](https://developers.google.com/web/fundamentals/web-components/customelements)
- [Google - Shadow DOM v1: Self-Contained Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom)
- [CSS Tricks - An Introduction to Web Components](https://css-tricks.com/an-introduction-to-web-components/)

## Before filing an issue

If something isn't working the way you expect, please take a look at the [existing issues](https://github.com/Esri/calcite-components/issues) before logging a new one. Have you found a new bug? Want to request a new feature? We'd love to hear from you! Please make sure to provide all of the requested info from the appropriate [issue template](https://github.com/Esri/calcite-components/issues/new/choose) so we can work on resolving the issue as soon as possible. A sample that reproduces the issue is required for logging bugs, we created templates in [codepen](https://codepen.io/pen?template=RwgrjEx), [codesandbox](https://codesandbox.io/s/calcite-template-p95kp?file=/src/App.js), and [jsbin](https://jsbin.com/lopumatiru/edit?html,output) (with the ArcGIS Maps SDK for JavaScript) to help get started. Alternatively, a [documentation](https://developers.arcgis.com/calcite-design-system/components/) sample can be used if the issue is reproducible. Some other things to consider:

- Use a clear and descriptive title
- Detail what is happening now vs what should happen
- Tell us how to reproduce the issue (e.g. is it happening in a specific browser?)
- Can it be reliably reproduced? If not, tell us how often it happens and under what circumstances.
- Screenshots and GIFs are our friends!
- Did this problem start happening after a recent release or was it always a bug?

## Issue management

### Labels

GitHub labels are used for organizing issues and providing context. You can familiarize yourself with the [label descriptions](https://github.com/Esri/calcite-components/labels) to understand what they signify.

### Lifecycle

There are four issue lifecycle labels:

- `0 - new`: Issues that are up for grabs.
- `1 - assigned`: Issues that someone will work on soon.
- `2 - in development`: Issues are currently being worked on.
- `3 - installed`: Issues that have been merged to master.
- `4 - verified`: Issues that have been tested and are ready to close.

An issue can only have one of the lifecycle labels at any time. Please make sure to keep these up to date.

### Issues that cannot be worked on

There are three labels that mean an issue is not ready for development:

- `design`: Issues that need design consultation, such as interaction research/feedback, visual mockups, and general approval. Once design completes their review, the `design` label will be removed, which means a developer can pick up the issue.
- `need more info`: Issues that are missing information and/or a clear, actionable description. This can mean we are waiting on a user to provide additional context, we can't reproduce the issue, or further discussion is needed in order to determine a solution.
- `blocked`: Issues that cannot be worked on until a different issue is resolved. The blocking issue may be from an external library (Stencil, Storybook, Jest, etc.) or a Calcite Components issue. The blocking issue should be linked to in the blocked issue's body or comment.

### Milestones

Milestones are used to manage sprints, which are two weeks long. Sprint milestones are not closed until all of the issues are verified. We usually have a couple sprint milestones open at a time to help with future planning. Calcite Core team members should grab issues from the current sprint when you are looking for something to work on. External contributors should ask before working on issues in upcoming sprints, since some of them need to be completed in a timely manner. There are also two constant milestones:

- **Backburner:** Issues we want to tackle soon, but not in the immediate sprint. If you didn't find anything to work on in the current sprint, this is the second place to look.
- **Freezer:** Items that we want to look into, but do not have an immediate timeline associated. Try not to work on these issues unless they have a `help wanted` label.

### Estimates

Estimates are used to determine how much work needs to go into an issue. The total estimate helps product managers triage issues effectively so developers are not overwhelmed during sprints. If you are not on the team, please do not add estimates when creating cases. Here are some guidelines for time estimates using an `estimate-#` label for tracking:

- `estimate - 1`: Very small fix or change, a one line update.
- `estimate - 2`: Small fix or update, does not require updates to tests.
- `estimate - 3`: A day or two of work, may require changes to tests.
- `estimate - 5`: A few days of work, requires updates to tests.
- `estimate - 8`: Requires input from team, consider smaller steps.
- `estimate - 13`: Requires planning and input from team, consider smaller steps.
- `estimate - 21`: Requires planning, input from team members and possibly others.
- `estimate - 34`: Issue should be converted into an epic. Requires all hands on deck.

### Epics

Epics are specified by the `epic` label. Epics are changes that require a lot of work and wouldn't fit into a single milestone. An epic should be a single concept, and have child issues for individual tasks created and listed in the epic's issue body.

## Code base

Our code base is written in TypeScript and must adhere to specific conventions and formatting. Please do the following while developing:

1. Avoid setting types as `any`.
2. Try to always provide a type.
3. Provide JSDoc for all public APIs.
4. Fix linting errors, don't ignore them.

## Getting a development environment set up

An installation of Node is required for development. If you don't have Node installed, we recommend [Volta](https://docs.volta.sh/guide/getting-started), which will automatically use the Node/NPM versions pinned at the bottom of [`package.json`](./package.json). If you prefer a different Node version manager, make sure to use the major versions of Node/NPM specified in [`package.json`](./package.json).

We also recommend installing the following extensions in your editor of choice: TypeScript, TailwindCSS, ESLint, Stylelint, and Prettier. If you use VS Code, you will see a pop up in the bottom right corner prompting you to install or view the workspaces's recommended extensions. Here are instructions for manually installing the extensions in a variety of editors:

- <https://tailwindcss.com/docs/intellisense>
- <https://eslint.org/docs/latest/user-guide/integrations>
- <https://stylelint.io/user-guide/integrations/editor>
- <https://prettier.io/docs/en/editors.html>

If your IDE supports the [Language Server Protocol (LSP) specification](https://microsoft.github.io/language-server-protocol/) but isn't mentioned in the links above, ask Ben for help getting set up.

**NOTE:** If you are on Windows, we strongly recommend using the Bash emulation that ships with [Git for Windows](https://gitforwindows.org/). Or better yet, use [Ubuntu in WSL](https://ubuntu.com/wsl)! Otherwise, keep in mind that some of the scripts used by maintainers (such as for releasing) likely won't work in Command Prompt or PowerShell. However, please log an issue if scripts used for normal development (start/test/build/etc) don't work in your Windows environment.

## Starting the demos

First, clone the repo and install the NPM dependencies from within the `calcite-components` directory:

```sh
git clone git@github.com:Esri/calcite-components.git
cd calcite-components
npm install
```

Next, start the local Stencil development server on localhost:

```sh
npm start
```

The demos will open in the browser after building. Edit the pages in [`src/demos`](./src/demos) to modify the component demos, such as changing attributes or adding content to slots. When adding a new demo page, make sure to add a link in [`index.html`](./src/index.html) so others can find it. You can also edit the component code in [`src/components`](./src/components), and the changes will be reflected in the demos.

## Linting

This project uses [lint-staged](https://www.npmjs.com/package/lint-staged) to automatically format code on commit, making it easier to contribute. There are also NPM scripts in [`package.json`](./package.json) to lint a variety of filetypes. To run them all:

```sh
npm run lint
```

## Running the tests

`npm test` will run the current test suite.

Calcite Components include Stencil's default testing tools which are built on [Jest](https://jestjs.io/) and [Puppeteer](https://github.com/GoogleChrome/puppeteer).

If you're working on writing tests for a particular component, it can be helpful to use `npm run test:watch` to retest on file changes. Once the initial tests run, typing `o` at the prompt will run tests only on changed files, allowing you to quickly iterate on tests for a specific component.

Please refer to the [Stencil testing documentation](https://stenciljs.com/docs/testing-overview) and Calcite's [testing conventions](./conventions/Testing.md) for more information.

## Adding a new component

Before adding a new component, please read through the [component conventions guide](./conventions/README.md). This guide covers everything from colors to event naming syntax and will help you create a component that is consistent with those that already exist. All new components should have an [issue](https://github.com/Esri/calcite-components/issues/new?assignees=&labels=new+component%2C+0+-+new%2C+architecture&template=new-component.md&title=New+Component%3A+).

## Documenting a component

Stencil creates API reference documentation using JSDoc, here is their [documentation page](https://stenciljs.com/docs/docs-json). Calcite Components utilizes [Storybook](https://storybook.js.org/) for documenting components. Adding a new component is very simple:

1. Create a new file inside your component directory like `X.stories.js`
2. Write stories
3. Run the documentation locally with `npm run docs:preview`

The `docs:preview` command will build Calcite Components and open your browser to view the storybook docs locally.

Please refer to the [Documentation Conventions](./conventions/Documentation.md) for more information.

## Branch naming conventions

When submitting a pull request, please use one of the following formats for your branch name:

For pull requests associated with an existing issue:

```text
<username>/<issue-id><issue-description>
johndoe/15-update-modal
johndoe/update-modal-15
```

For pull requests without an associated issue:

```text
<username>/<issue-description>
johndoe/modal-styling
```

```text
<username>/<type-of-pr><issue-description>
johndoe/docs/update-modal-docs
johndoe/feature/add-something-to-modal

```

## Commit message format

This project follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), which are used to generate the changelog. Be sure to provide clear and sufficient information in commit messages. This is important because the commit messages are used to automatically update the changelog.

[Stencil's contributing document](https://github.com/ionic-team/stencil/blob/master/.github/CONTRIBUTING.md#commit-message-format) explains this in great detail, so please refer to this for more details and examples.

## Breaking changes

Commit messages for breaking changes should use both the header (`!`) and body (`BREAKING CHANGE:`) syntax:

```text
<type>!: <descriptive summary>

<optional info>

BREAKING CHANGE: <details about the change and migration options (this can span multiple lines)>
```

When adding a `BREAKING CHANGE:` note to the summary block right before confirming a squash merge, remove all the info except the `BREAKING CHANGE:` note itself, or else everything ends up being added to the changelog.

See the [conventional commits doc](https://www.conventionalcommits.org/en/v1.0.0/) for more helpful information.

## Pull requests

In order to ensure conventional commits are followed, pull requests will run a check to indicate whether the PR is following the convention or not. The [Semantic Pull Request](https://github.com/amannn/action-semantic-pull-request) status check will ensure your pull requests are semantic before you merge them.

You can update the PR title any time before merging the PR. This may be necessary when the scope or type of the PR changes, or if additional details are needed for the changelog entry.
