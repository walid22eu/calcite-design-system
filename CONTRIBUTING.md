# Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

Note: New contributors should first contact [Ben Elan](mailto:belan@esri.com) or [Juan Carlos Franco](mailto:JFranco@esri.com) to join the [Calcite Components GitHub team](https://github.com/orgs/Esri/teams/calcite-components/members). Then, clone the repo via SSH key on your machine (this Git workflow is required in order to work with our Screener test integration).

## I want to contribute, what should I work on?

Calcite Components is still in its early stages. You can help most by:

- Adding ideas for components to our [wishlist project](https://github.com/Esri/calcite-components/projects/2). We are using the wishlist to gather ideas about useful components which we may be able to add to Calcite Components.
- Working on [the issues](https://github.com/Esri/calcite-components/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee) marked as `help wanted`. There is also a `good first issue` label if you are just getting started.
- If you want to help develop components take a look at [1.0.0 components](https://github.com/Esri/calcite-components/projects/1) which are the components we are targeting for the first release of Calcite Components. Before starting development please review our [component conventions](./conventions/README.md) and the [Stencil documentation](https://stenciljs.com/docs/host-element).

If you aren't familiar with the basics of Web Components and Shadow DOM, please read through some of the following resources before contributing:

- [Google - Custom Elements v1: Reusable Web Components ](https://developers.google.com/web/fundamentals/web-components/customelements)
- [Google - Shadow DOM v1: Self-Contained Web Components ](https://developers.google.com/web/fundamentals/web-components/shadowdom)
- [CSS Tricks - An Introduction to Web Components ](https://css-tricks.com/an-introduction-to-web-components/)

## Before filing an issue

If something isn't working the way you expect, please take a look at the [existing issues](https://github.com/Esri/calcite-components/issues) before logging a new one. Have you found a new bug? Want to request a new feature? We'd love to hear from you! Please make sure to provide all of the requested info from the appropriate [issue template](https://github.com/Esri/calcite-components/issues/new/choose) so we can work on resolving the issue as soon as possible. A sample that reproduces the issue is required for logging bugs, we created templates in [codepen](https://codepen.io/pen?template=RwgrjEx), [codesandbox](https://codesandbox.io/s/calcite-template-p95kp?file=/src/App.js), and [jsbin](https://jsbin.com/lopumatiru/edit?html,output) (with the ArcGIS API for JavaScript) to help get started. Alternatively, a [documentation](https://developers.arcgis.com/calcite-design-system/components/) sample can be used if the issue is reproducible. Some other things to consider:

- Use a clear and descriptive title
- Detail what is happening now vs what should happen
- Tell us how to reproduce the issue (e.g. is it happening in a specific browser?)
- Can it be reliably reproduced? If not, tell us how often it happens and under what circumstances.
- Screenshots and GIFs are our friends!
- Did this problem start happening after a recent release or was it always a bug?

## Issue management

### Lifecycle

There are four issue lifecycle labels:

- `0 - new`: Issues that are up for grabs.
- `1 - assigned`: Issues that someone will work on soon.
- `2 - in development`: Issues are currently being worked on.
- `3 - installed`: Issues that have been merged to master.
- `4 - verified`: Issues that have been tested and are ready to close.

An issue can only have one of the lifecycle labels at any time. Please make sure to keep these up to date.

### Milestones

Milestones are used to manage sprints, which are two weeks long. Sprint milestones are not closed until all of the issues are verified. We usually have a couple sprint milestones open at a time to help with future planning. Grab issues from the current sprint when you are looking for something to work on. There are also two constant milestones:

- **Backburner:** Issues we want to tackle soon, but not in the immediate sprint. If you didn't find anything to work on in the current sprint, this is the second place to look.
- **Freezer:** Items that we want to look into, but do not have an immediate timeline associated. Try not to work on these issues unless they have a `help wanted` label.

### Estimates

[ZenHub](https://www.zenhub.com/) estimates are used to determine how much work needs to go into an issue. The total estimate helps the product managers triage issues effectively so developers are not overwhelmed during sprints. If you are not on the team, please do not add estimates when creating cases. Here are some guidelines for the numbering system:

- **1:** Fixing a typo, small syntax issue, or tweaking a css property. Something that can be done in a couple minutes.
- **5:** Fixing bugs or adding small features that don't require comprehensive planning.
- **13:** Issues that are more complicated and need some workflow or design planning. These issues usually need additional unit tests written.
- **40:** If an issue is this complicated it should be converted into an epic.

## Code base

Our code base is written in TypeScript and must adhere to specific conventions and formatting. Please do the following while developing:

1. Avoid setting types as `any`.
2. Try to always provide a type.
3. Provide JSDoc for all public APIs.
4. Fix linting errors, don't ignore them.

## Getting a development environment set up

We recommend installing the following extensions in your editor of choice: TypeScript, Sass, TailwindCSS, ESLint and Prettier.

- https://code.visualstudio.com/
- https://atom.io/packages/atom-typescript
- https://github.com/Microsoft/TypeScript-Sublime-Plugin
- https://tailwindcss.com/docs/intellisense
- https://github.com/neoclide/coc.nvim
- etc...

To start the local development environment run `npm start` this will start the local Stencil development server on http://localhost:3333. You can modify the [index.html](./src/index.html) to add and test your new component. Just add another HTML file to the `demos` folder and link to this new page from `index.html`.

## Linting

This project uses [lint-staged](https://www.npmjs.com/package/lint-staged) to automatically format code on commit, making it easier to contribute.

## Running the tests

`npm test` will run the current test suite.

Calcite Components include Stencil's default testing tools which are built on [Jest](https://jestjs.io/) and [Puppeteer](https://github.com/GoogleChrome/puppeteer).

If you're working on writing tests for a particular component, it can be helpful to use `npm run test:watch` to retest on file changes. Once the initial tests run, typing `o` at the prompt will run tests only on changed files, allowing you to quickly iterate on tests for a specific component.

Please refer to the [Stencil testing documentation](https://stenciljs.com/docs/testing-overview) for more information.

## Adding a new component

Before adding a new component, please read through the [component conventions guide](./conventions/README.md). This guide covers everything from colors to event naming syntax and will help you create a component that is consistent with those that exist already. All new components should have an [issue](https://github.com/Esri/calcite-components/issues/new?assignees=&labels=new+component%2C+0+-+new%2C+architecture&template=new-component.md&title=New+Component%3A+).

## Documenting a component

Calcite Components utilizes [Storybook](https://storybook.js.org/) for documenting components. Adding a new component is very simple:

1. Create a new file inside your component directory like `X.stories.js`
2. Write stories (see below)
3. Run the documentation locally with `npm run docs:preview`

The `docs:preview` command will build Calcite Components and open your browser to view the storybook docs locally.

### Writing stories

Each component should use a `storiesOf` with at least one story. It's a great idea to add the component's auto-generated `readme.md` as notes. If your component has props that effect visual styles, you can use the [storybook knobs addon](https://www.npmjs.com/package/@storybook/addon-knobs) to allow people to manipulate props and see live updates in the documentation. A minimal stories file might look something like this:

```
import { storiesOf } from '@storybook/html';
import { boolean } from '@storybook/addon-knobs'
import notes from './readme.md';

storiesOf('My component', module)
  .add('Simple', () => `
    <my-component demo-prop="${boolean("demo-prop", true)}"></my-component>
  , { notes })`
```

## Branch naming conventions

When submitting a pull request, please use one of the following formats for your branch name:

For pull requests associated with an existing issue:

```
<username>/<issue-id><issue-description>
johndoe/15-update-modal
johndoe/update-modal-15
```

For pull requests without an associated issue:

```
<username>/<issue-description>
johndoe/modal-styling
```

```
<username>/<type-of-pr><issue-description>
johndoe/docs/update-modal-docs
johndoe/feature/add-something-to-modal

```

## Commit message format

This project follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), which are used to generate the changelog. Be sure to provide clear and sufficient information in commit messages. This is important because the commit messages are used to automatically update the changelog.

[Stencil's contributing document](https://github.com/ionic-team/stencil/blob/master/.github/CONTRIBUTING.md#commit-message-format) explains this in great detail, so please refer to this for more details and examples.'

## Breaking Changes

For ease of discoverability, commit messages for breaking changes should use both the header (`!`) and body (`BREAKING CHANGE:`) syntax:

```
<type>!: <descriptive summary>

<optional info>

BREAKING CHANGE: <details about the change and migration options (this can span multiple lines)>
```

See the [conventional commits doc](https://www.conventionalcommits.org/en/v1.0.0/) for more helpful information.

## Pull requests

In order to ensure conventional commits are followed, pull requests will run a check to indicate whether the PR is following the convention or not. The [Semantic Pull Request](https://github.com/probot/semantic-pull-requests) status check will ensure your pull requests are semantic before you merge them.
