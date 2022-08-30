# calcite-tip

The `calcite-tip` component can comprise of an image, text and hyperlink to give helpful hints to a user about using the platform.

<!-- Auto Generated Below -->

## Usage

### Basic

Renders a non-dismissible tip with a heading, thumbnail, info and a link.

```html
<calcite-tip non-dismissible heading="Celestial Bodies!">
  <img slot="thumbnail" src="https://placeimg.com/1000/600" alt="This is an image of nature." />
  <p>Normal tip with a landscape or square image and a small amount of text in the "info" slot.</p>
  <a href="http://www.esri.com">Put a link hurr!</a>
</calcite-tip>
```

## Properties

| Property         | Attribute         | Description                                                                                                                                              | Type                         | Default     |
| ---------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------- |
| `dismissed`      | `dismissed`       | When true, the component does not display.                                                                                                               | `boolean`                    | `false`     |
| `heading`        | `heading`         | The component header text.                                                                                                                               | `string`                     | `undefined` |
| `headingLevel`   | `heading-level`   | Specifies the number at which section headings should start.                                                                                             | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `undefined` |
| `intlClose`      | `intl-close`      | Accessible name for the component's close button.                                                                                                        | `string`                     | `undefined` |
| `nonDismissible` | `non-dismissible` | When true, the close button is not present on the component.                                                                                             | `boolean`                    | `false`     |
| `selected`       | `selected`        | When true and if it has a parent `calcite-tip-manager`, the component is selected. Only one tip can be selected within the `calcite-tip-manager` parent. | `boolean`                    | `false`     |

## Events

| Event               | Description                                  | Type                |
| ------------------- | -------------------------------------------- | ------------------- |
| `calciteTipDismiss` | Emits when the component has been dismissed. | `CustomEvent<void>` |

## Slots

| Slot          | Description                              |
| ------------- | ---------------------------------------- |
|               | A slot for adding text and a hyperlink.  |
| `"thumbnail"` | A slot for adding an HTML image element. |

## Dependencies

### Depends on

- [calcite-action](../action)

### Graph

```mermaid
graph TD;
  calcite-tip --> calcite-action
  calcite-action --> calcite-loader
  calcite-action --> calcite-icon
  style calcite-tip fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
