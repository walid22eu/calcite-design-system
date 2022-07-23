# calcite-handle

<!-- Auto Generated Below -->

## Properties

| Property    | Attribute    | Description                          | Type     | Default    |
| ----------- | ------------ | ------------------------------------ | -------- | ---------- |
| `textTitle` | `text-title` | Value for the button title attribute | `string` | `"handle"` |

## Events

| Event                | Description                                                                                                                                                                                     | Type               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `calciteHandleNudge` | Emitted when the the handle is activated and the up or down arrow key is pressed. **Note:**: The `handle` event payload prop is deprecated, please use the event's target/currentTarget instead | `CustomEvent<any>` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [calcite-block](../block)

### Depends on

- [calcite-icon](../icon)

### Graph

```mermaid
graph TD;
  calcite-handle --> calcite-icon
  calcite-block --> calcite-handle
  style calcite-handle fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
