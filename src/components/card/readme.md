# calcite-card

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<div style="width:260px">
  <calcite-card>
    <h3 slot="title">ArcGIS Online: Gallery and Organization pages</h3>
    <span slot="subtitle">
      A great example of a study description that might wrap to a line or two, but isn't overly verbose.
    </span>
  </calcite-card>
</div>
```

## Properties

| Property            | Attribute            | Description                                                             | Type                                                             | Default         |
| ------------------- | -------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------- |
| `loading`           | `loading`            | When `true`, a busy indicator is displayed.                             | `boolean`                                                        | `false`         |
| `messageOverrides`  | `message-overrides`  | Use this property to override individual strings used by the component. | `CardMessages`                                                   | `undefined`     |
| `selectable`        | `selectable`         | When `true`, the component is selectable.                               | `boolean`                                                        | `false`         |
| `selected`          | `selected`           | When `true`, the component is selected.                                 | `boolean`                                                        | `false`         |
| `thumbnailPosition` | `thumbnail-position` | Sets the placement of the thumbnail defined in the `thumbnail` slot.    | `"block-end" \| "block-start" \| "inline-end" \| "inline-start"` | `"block-start"` |

## Events

| Event               | Description                                                      | Type                |
| ------------------- | ---------------------------------------------------------------- | ------------------- |
| `calciteCardSelect` | Fires when `selectable` is `true` and the component is selected. | `CustomEvent<void>` |

## Slots

| Slot             | Description                                      |
| ---------------- | ------------------------------------------------ |
|                  | A slot for adding subheader/description content. |
| `"footer-start"` | A slot for adding a leading footer.              |
| `"footer-end"`   | A slot for adding a trailing footer.             |
| `"subtitle"`     | A slot for adding a subtitle or short summary.   |
| `"thumbnail"`    | A slot for adding a thumbnail to the component.  |
| `"title"`        | A slot for adding a title.                       |

## Dependencies

### Depends on

- [calcite-loader](../loader)
- [calcite-label](../label)
- [calcite-checkbox](../checkbox)

### Graph

```mermaid
graph TD;
  calcite-card --> calcite-loader
  calcite-card --> calcite-label
  calcite-card --> calcite-checkbox
  style calcite-card fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
