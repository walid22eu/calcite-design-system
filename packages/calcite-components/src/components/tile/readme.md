# calcite-tile

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<calcite-tile
  description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
  heading="Tile heading lorem ipsum"
  href="#"
  icon="images"
></calcite-tile>
```

## Properties

| Property      | Attribute       | Description                                                                                                | Type      | Default     |
| ------------- | --------------- | ---------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `active`      | `active`        | When `true`, the component is active.                                                                      | `boolean` | `false`     |
| `description` | `description`   | A description for the component, which displays below the heading.                                         | `string`  | `undefined` |
| `disabled`    | `disabled`      | When `true`, interaction is prevented and the component is displayed with lower opacity.                   | `boolean` | `false`     |
| `embed`       | `embed`         | The component's embed mode. When `true`, renders without a border and padding for use by other components. | `boolean` | `false`     |
| `heading`     | `heading`       | The component header text, which displays between the icon and description.                                | `string`  | `undefined` |
| `hidden`      | `hidden`        | When `true`, the component is not displayed and is not focusable.                                          | `boolean` | `false`     |
| `href`        | `href`          | When embed is `"false"`, the URL for the component.                                                        | `string`  | `undefined` |
| `icon`        | `icon`          | Specifies an icon to display.                                                                              | `string`  | `undefined` |
| `iconFlipRtl` | `icon-flip-rtl` | When `true`, the icon will be flipped when the element direction is right-to-left (`"rtl"`).               | `boolean` | `false`     |

## Slots

| Slot              | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `"content-end"`   | A slot for adding non-actionable elements after the component's content.  |
| `"content-start"` | A slot for adding non-actionable elements before the component's content. |

## Dependencies

### Used by

- [calcite-tile-select](../tile-select)

### Depends on

- [calcite-icon](../icon)
- [calcite-link](../link)

### Graph

```mermaid
graph TD;
  calcite-tile --> calcite-icon
  calcite-tile --> calcite-link
  calcite-link --> calcite-icon
  calcite-tile-select --> calcite-tile
  style calcite-tile fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
