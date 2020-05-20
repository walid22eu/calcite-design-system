# Component Guidelines

This is a living document defining our best practices and reasoning for authoring Calcite Components.

<!-- TOC depthFrom:2 -->

- [General Guidelines](#general-guidelines)
- [Color](#color)
- [Light Theme/Dark Theme](#light-themedark-theme)
- [Form Elements and Custom Inputs](#form-elements-and-custom-inputs)
- [Component Responsibilities](#component-responsibilities)
- [Event Names](#event-names)
- [Private Events](#private-events)
- [Event Details](#event-details)
- [CSS Class Names](#css-class-names)
- [a11y](#a11y)
- [i18n](#i18n)
- [Bundling and Loading](#bundling-and-loading)
- [Custom Themes](#custom-themes)
- [Unique IDs for Components](#unique-ids-for-components)
- [Prerendering/SSR](#prerendering-and-ssr)

<!-- /TOC -->

## General Guidelines

Generally adhere to and follow these best practices for authoring components.

- [Google Web Component Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices)
- [Custom Element Conformance - W3C Editor's Draft](https://w3c.github.io/webcomponents/spec/custom/#custom-element-conformance)

## Color

If a component has multiple color themes (for example Blue, Red, Green, and Yellow) representing various state implement a `color` prop and reflect it to an attributes.

```tsx
enum Colors {
  red = "red",
  blue = "blue",
  green = "green",
  yellow = "yellow",
}

export class CalciteComponent {

// ...

@Prop({ reflect: true }) color: Colors = 'blue'

// ...
```

You can then use the `:host()` selector to define your custom colors:

```scss
:host([color="blue"]) {
  .something {
    // make it blue
  }
}

:host([color="red"]) {
  .something {
    // make it red
  }
}
```

**Discussed In**:

- https://github.com/Esri/calcite-components/pull/24/files/3446c89010e3ef0421803d68d627aba2e7c4bfa0#r289427838

## Light Theme/Dark Theme

All components should allow developers to supply a `theme` property. This theme should _not_ have default value set:

```tsx
@Prop({ reflect: true }) theme: "light" | "dark";
```

In the [global CSS file](https://github.com/Esri/calcite-components/blob/master/src/assets/styles/global.scss), we specify the values of each color for both light and dark theme. This enables theming to be inherited throughout a component tree. Consider this valid example:

```html
<div theme="dark">
  <calcite-button>Button text</calcite-button>
  <calcite-date></calcite-date>
</div>
```

This will cause both the button and the date picker to use the dark theme color variables declared in the global file. This makes it very easy for developers to move an entire app from light to dark and vice versa.

To make this work, inside a component's SASS file, _you must use colors from the theme variables_. For example

```scss
// 🙅‍♀️ using the sass var will not correctly inherit or change in light/dark mode
:host {
  color: $ui-blue-1;
}

// 👍 using the CSS var will inherit correctly
:host {
  color: var(--calcite-ui-blue-1);
}
```

## Custom Themes

Since Calcite Components might be used in many different contexts such as configurable apps, multiple themes and appearances need to be supported. The most common use case for custom themes are applications where the end user needs to be able to customize brand colors and typography. To this end custom theming can be accomplished by overriding the [CSS Custom Properties (CSS Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) from the main light and dark themes with new values:

```css
:root {
  --calcite-ui-blue-1: red;
}
```

You can apply these overrides to individual components as well:

```css
calcite-slider {
  --calcite-ui-blue-1: red;
}
```

Or, add a class to the specific instance:

```css
.my-custom-theme {
  --calcite-ui-blue-1: red;
}
```

```html
<calcite-slider class="my-custom-theme"></calcite-slider>
```

### Typography

All components have been constructed to inherit their `font-family`. This enables you to change the font much like changing the colors:

```css
:root {
  font-family: "Comic Sans";
}
```

### Palette

The current light theme colors and their hex values can be found below:

| CSS variable name           | Hex value |
| --------------------------- | --------- |
| `--calcite-ui-blue-1`       | `#007ac2` |
| `--calcite-ui-blue-2`       | `#2890ce` |
| `--calcite-ui-blue-3`       | `#00619b` |
| `--calcite-ui-green-1`      | `#35ac46` |
| `--calcite-ui-green-2`      | `#50ba5f` |
| `--calcite-ui-green-3`      | `#288835` |
| `--calcite-ui-yellow-1`     | `#edd317` |
| `--calcite-ui-yellow-2`     | `#f9e54e` |
| `--calcite-ui-yellow-3`     | `#d9bc00` |
| `--calcite-ui-red-1`        | `#d83020` |
| `--calcite-ui-red-2`        | `#e65240` |
| `--calcite-ui-red-3`        | `#a82b1e` |
| `--calcite-ui-background`   | `#f8f8f8` |
| `--calcite-ui-foreground-1` | `#ffffff` |
| `--calcite-ui-foreground-2` | `#f3f3f3` |
| `--calcite-ui-foreground-3` | `#eaeaea` |
| `--calcite-ui-text-1`       | `#151515` |
| `--calcite-ui-text-2`       | `#4a4a4a` |
| `--calcite-ui-text-3`       | `#6a6a6a` |
| `--calcite-ui-border-1`     | `#cacaca` |
| `--calcite-ui-border-2`     | `#dfdfdf` |
| `--calcite-ui-border-3`     | `#eaeaea` |
| `--calcite-ui-border-4`     | `#9f9f9f` |
| `--calcite-ui-border-5`     | `#757575` |

**Discussed In**:

- https://github.com/Esri/calcite-components/issues/507

## Form Elements and Custom Inputs

Custom form elements represent a particularly tricky part of Calcite Components. Other Stencil based frameworks such as a [Ionic](https://github.com/ionic-team/ionic) ship additional wrappers around their Web Components such as [`@ionic/react`](https://github.com/ionic-team/ionic/tree/master/react), [`@ionic/angular`](https://github.com/ionic-team/ionic/tree/master/angular) and [`@ionic.vue`](https://github.com/ionic-team/ionic/tree/master/vue). These wrapper adapt the custom events of the Ionic components like `ionChange` to work with things like Reacts synthetic `onChange={}` event, and Angular's `[(ngModel)]` to support standard form handling within those frameworks. However the additional effort to build and maintain these wrappers is likely not worth it.

Instead we will allow a native `<input>` or `select` element to become the source of truth for a component.

```html
<!-- <calcite-checkbox> is the source of truth -->
<calcite-checkbox checked disabled></calcite-checkbox>
```

and

```html
<calcite-checkbox>
  <!-- the <input> is the source of truth -->
  <input type="checkbox" checked disabled />
</calcite-checkbox>
```

Frameworks can use their native tools to interact with the provided `<input>` while the input can also be omitted if the application only needs a more basic interaction. The input can be hidden inside the component like so:

```html
<div hidden>
  <slot>
    <!-- a default checkbox in case the user doesn't pass one-->
    <input type="checkbox" checked disabled />
  </slot>
  <div></div>
</div>
```

Several interactions are required to properly implement:

- If the `value`, `disabled`, `selected`, or `checked` properties on the input change, update the state of the custom input. The attributes of the passed input can be observed with a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe).
- Update the state of the input when the user interacts with the custom input.
- Focus the custom input when the user focuses the passed input. This allows the standard `<label>` element to be wrapped around the custom element.
  ```html
  <label>
    My Checkbox
    <calcite-checkbox>
      <input type="checkbox" checked disabled />
    </calcite-checkbox>
  </label>
  ```

**Discussed In:**

- https://github.com/ArcGIS/calcite-components/pull/24#discussion_r289444267
- https://github.com/ArcGIS/calcite-components/pull/24#issuecomment-497813876
- https://github.com/ArcGIS/calcite-components/pull/24#issuecomment-497888962
- https://github.com/ArcGIS/calcite-components/pull/24#issuecomment-497894715

## Component Responsibilities

Calcite Components broadly targets two groups of projects inside Esri:

- **Sites** like [esri.com](https://esri.com) and [developers.arcgis.com](https://developers.arcgis.com).
- **Apps** like [ArcGIS Online](https://arcgis.com), [Vector Tile Style Editor](https://developers.arcgis.com/vector-tile-style-editor), [Workforce](https://www.esri.com/en-us/arcgis/products/workforce/overview), [ArcGIS Hub](https://hub.arcgis.com) etc...

Components should present the the minimum possible implementation to be usable by both sites and apps and leave as much as possible to users.

It is generally agreed on that components should not:

- Make network requests. Authentication and the exact environment of the request is difficult to mange and better left to the specific application or site.
- Manage routing or manipulate the URL. managing the URL is the the domain and the specific site or app.
- Implement any feature which can easily be achieved with simple CSS and HTML. E.x. it was decided that `<calcite-switch>` should not support `text` or `position` properties because those could be easily duplicated with CSS ([ref](https://github.com/ArcGIS/calcite-components/pull/24#discussion_r289424140))
- Implement any component which might replace a browser feature, without adding functionality that goes above and beyond what browser defaults would provide.

However components are allowed to:

- Use or implement `localStorage` if there is specific use case.
- Communicate with other components if a specific use case exists.

**Discussed In**:

- [Should tabs support syncing and loading from localstorage](https://github.com/ArcGIS/calcite-components/pull/27) . **Yes** because such feature are difficult to implement for **Sites** and would require lots of additional JavaScript work on the part of teams and authors
- [Should switch support a label](https://github.com/ArcGIS/calcite-components/pull/24#discussion_r289424140). **No** because label place

## Event Names

Event names should be treated like global variables since they can collide with any other event names and global variables. As such follow these guidelines when naming events.

- Name events list `Component + Event name` for example the `change` event on `<calcite-tabs>` should be named `calciteTabsChange`.
- Always prefix event names with `calcite` and never use an event name used by existing DOM standards https://developer.mozilla.org/en-US/docs/Web/Events.
- For example:
  - Bad: `change`
  - Good: `calciteTabChange`

**Discussed In:**

- https://github.com/Esri/calcite-components/pull/24/files/3446c89010e3ef0421803d68d627aba2e7c4bfa0#r289430227

## Private Events

If you need to use events to pass information inside your components for example to communicate between parents and children make sure you call `event.stopPropagation();` and `event.preventDefault();` to prevent the event from reaching outside the component.

## Event Details

Only attach additional data to your event if that data cannot be determined from the state of the component. This is because events also get a reference to the component the fired the event also passes a reference to the component that fired the event. For example you do not need to pass anything exposed as a `@Prop()` in the event details.

```tsx
@Listen("calciteCustomEvent") customEventHandler(
  event: CustomEvent
) {
  console.log(event.target.prop); // event.target is the component that fired the event.
}
```

`<calcite-tab-nav>` is also an example of this. The `event.details.tab` item contains the index of the selected tab or the tab name which cannot be easily determined from the state of `<calcite-tab-nav>` in some cases so it makes sense to include in the event.

## CSS Class Names

Because most components utilize shadow DOM, there is far less concern over naming collisions in a global CSS namespace. In addition, it's better for file transfer times and easier to write if class names are shorter. For these reasons, full BEM is not necessary. Instead, we can omit the "Block", and use the host instead. Consider the following BEM markup:

```html
<div class="card">
  <h3 class="card__title card__title--large">Title</h3>
  <p class="card__text">Text</p>
</div>
```

In a component using shadow DOM, this should instead be written as:

```jsx
<Host>
  <h3 class="title title--large">Title</h3>
  <p class="text">Text</p>
</Host>
```

Notice `.card` does not appear anywhere. We would then apply styles to the host element itself:

```scss
:host {
  // card styles here
}

.title {
}
.title--large {
}
.text {
}
```

Modifier classes on the "block" (host element) can often be written by reflecting the prop and selecting it directly via an attribute selector:

```scss
:host([color="blue"]) {
}
```

This builds a nice symmetry between the styling and the public API of a component.

- https://github.com/ArcGIS/calcite-components/issues/28
- https://github.com/ArcGIS/calcite-components/pull/24#discussion_r287462934
- https://github.com/ArcGIS/calcite-components/pull/24#issuecomment-495788683
- https://github.com/ArcGIS/calcite-components/pull/24#issuecomment-497962263

## a11y

In generally follow the guidelines and standards in these articles:

- [Google Accessibility Overview](https://developers.google.com/web/fundamentals/accessibility/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)

## i18n

Components should require as a few text translations as possible. In general, components should let users supply text values via slots and attributes; this lets a user handle translation within their apps.

If you component involves formatting numbers or dates use the [`Intl` APIs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) for formatting the display of numbers and dates in your component.

To add RTL support to your components you should use the internal `getElementDir` helper to apply the `dir` attribute to your component. This means that your components `dir` attribute will always match the documents `dir`.

```tsx
import { Component, Host, Element, h} from "@stencil/core";
import { getElementDir } from "../../utils/dom";

@Component({
  tag: "calcite-component",
  styleUrl: "calcite-component.scss",
  shadow: true
})
export class CalciteComponent {
  @Element() el: HTMLElement;

  // ...

  render() {
    const dir = getElementDir(this.el);

    return (
      <Host dir={dir}>
        <!-- The rest of your component -->
      </Host>
    );
  }
}
```

You can then implement direction specific CSS with CSS variables:

```scss
:host {
  --calcite-tabs-tab-margin-start: 1.25rem;
  --calcite-tabs-tab-margin-end: 0;
}

:host([dir="rtl"]) {
  --calcite-tabs-tab-margin-start: 0;
  --calcite-tabs-tab-margin-end: 1.25rem;
}
```

Your component and its child components can then use `var(--calcite-tabs-tab-margin-start)` to access their proper values based on the direction of the document.

### Translated strings

In future it will likely become necessary to provide sting translations for components. An example would be the `aria-label` for the `<calcite-modal>` close button. Initial research looks promising and we could likely implement one of these approaches and set a `lang` for each component similar to how we set `dir`.

- https://medium.com/stencil-tricks/implementing-internationalisation-i18n-with-stencil-5e6559554117 and https://codesandbox.io/s/43pmx55vo9
- https://github.com/ionic-team/ionic-stencil-conference-app/issues/69

Until we implement a `lang` facility and set up translations for all components, we have been allowing a small number of strings to be passed in as props. Props that represent translated strings should have the syntax: `text-label-x`, where `x` is the name for the string. For example, when providing a string from "Close", use the prop name `text-label-close`. In the component, these props should default to their English equivalent (this is useful for non-localized apps):

```
@Prop() textLabelClose: string = 'Close';
```

## Bundling and Loading

Stencil has the capability to build and distribute a large variety of outputs based on our needs. You can read more about this in the [output targets](https://github.com/ionic-team/stencil/blob/cc55401555ff5c28757cf99edf372dcada2c0b25/src/compiler/output-targets/readme.md) documentation.

As a best practice we should follow [Ionic's configuration](https://github.com/ionic-team/ionic/blob/master/core/stencil.config.ts) and generate a `bundle` for each component. Stencil will then generate a loader that will dynamically load the components used on the page.

**Note:** This is highly likely to change as we move closer to our first release and as Stencil improves their documentation around their specific methods and build processes.

## Unique IDs for Components

Many times it is necessary for components to have a `id="something"` attribute for things like `<label>` and various `aria-*` properties. To safely generate a unique id for a component but to also allow a user supplied `id` attribute to work follow the following pattern:

```tsx
import { guid } from "../../utils/guid";

@Component({
  tag: "calcite-example",
  styleUrl: "calcite-example.scss",
  shadow: true,
})
export class CalciteExample {
  // ...

  guid: string = `calcite-example-${guid()}`;

  render() {
    const id = this.el.id || this.guid;
    return <Host id={id}></Host>;
  }

  // ...
}
```

This will create a unique id attribute like `id="calcite-example-51af-0941-54ae-22c14d441beb"` which should have a VERY low collision change since `guid()` generates IDs with `window.crypto.getRandomValues`. If a user supplies an `id` this will respect the users `id`.

## Prerendering and SSR

Stencil provide the capability to render web components on the server and seamlessly hydrate them on the client. This is handled by the `dist-hydrate-script` output target in `stencil.config.ts`.

This generates a `hydrate` directory which exposes `renderToString()` (for the server) and `hydrateDocument()` for the client.

Since many of the same lifecycle methods are called on the client and server you may need to differentiate any code that relies on browser APIs like so:

```ts
import { Build } from "@stencil/core";

if (Build.isBrowser) {
  // client side
} else {
  // server side
}
```

Checking if the necessary APIs are present is also acceptable:

```ts
const elements = this.el.shadowRoot
  ? this.el.shadowRoot.querySelector("slot").assignedElements()
  : [];
```

To ensure that all components are compatible for prerendering a prerender build is done as part of `npm test`.
