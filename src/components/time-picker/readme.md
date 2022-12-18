# calcite-time-picker

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute           | Description                                                                  | Type                                                                                                                                                                                                                                    | Default     |
| ------------------ | ------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `messageOverrides` | `message-overrides` | Use this property to override individual strings used by the component.      | `Messages`                                                                                                                                                                                                                              | `undefined` |
| `numberingSystem`  | `numbering-system`  | Specifies the Unicode numeral system used by the component for localization. | `"arab" \| "arabext" \| "bali" \| "beng" \| "deva" \| "fullwide" \| "gujr" \| "guru" \| "hanidec" \| "khmr" \| "knda" \| "laoo" \| "latn" \| "limb" \| "mlym" \| "mong" \| "mymr" \| "orya" \| "tamldec" \| "telu" \| "thai" \| "tibt"` | `undefined` |
| `scale`            | `scale`             | Specifies the size of the component.                                         | `"l" \| "m" \| "s"`                                                                                                                                                                                                                     | `"m"`       |
| `step`             | `step`              | Specifies the granularity the `value` must adhere to (in seconds).           | `number`                                                                                                                                                                                                                                | `60`        |
| `value`            | `value`             | The component's value in UTC (always 24-hour format).                        | `string`                                                                                                                                                                                                                                | `null`      |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [calcite-input-time-picker](../input-time-picker)

### Depends on

- [calcite-icon](../icon)

### Graph

```mermaid
graph TD;
  calcite-time-picker --> calcite-icon
  calcite-input-time-picker --> calcite-time-picker
  style calcite-time-picker fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
