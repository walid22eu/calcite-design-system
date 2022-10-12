# calcite-hex-input

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                     | Type                                                                                                                                                                                                                                    | Default                             |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `allowEmpty`      | `allow-empty`      | When false, empty color (null) will be allowed as a value. Otherwise, a color value is always enforced by the component. When true, clearing the input and blurring will restore the last valid color set. When false, it will set it to empty. | `boolean`                                                                                                                                                                                                                               | `false`                             |
| `intlHex`         | `intl-hex`         | Label used for the hex input.                                                                                                                                                                                                                   | `string`                                                                                                                                                                                                                                | `TEXT.hex`                          |
| `intlNoColor`     | `intl-no-color`    | Label used for the hex input when there is no color selected.                                                                                                                                                                                   | `string`                                                                                                                                                                                                                                | `TEXT.noColor`                      |
| `numberingSystem` | `numbering-system` | Specifies the Unicode numeral system used by the component for localization.                                                                                                                                                                    | `"arab" \| "arabext" \| "bali" \| "beng" \| "deva" \| "fullwide" \| "gujr" \| "guru" \| "hanidec" \| "khmr" \| "knda" \| "laoo" \| "latn" \| "limb" \| "mlym" \| "mong" \| "mymr" \| "orya" \| "tamldec" \| "telu" \| "thai" \| "tibt"` | `undefined`                         |
| `scale`           | `scale`            | The component's scale.                                                                                                                                                                                                                          | `"l" \| "m" \| "s"`                                                                                                                                                                                                                     | `"m"`                               |
| `value`           | `value`            | The hex value.                                                                                                                                                                                                                                  | `string`                                                                                                                                                                                                                                | `normalizeHex(DEFAULT_COLOR.hex())` |

## Events

| Event                              | Description                         | Type                |
| ---------------------------------- | ----------------------------------- | ------------------- |
| `calciteColorPickerHexInputChange` | Emitted when the hex value changes. | `CustomEvent<void>` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [calcite-color-picker](../color-picker)

### Depends on

- [calcite-input](../input)
- [calcite-color-picker-swatch](../color-picker-swatch)

### Graph

```mermaid
graph TD;
  calcite-color-picker-hex-input --> calcite-input
  calcite-color-picker-hex-input --> calcite-color-picker-swatch
  calcite-input --> calcite-progress
  calcite-input --> calcite-icon
  calcite-color-picker --> calcite-color-picker-hex-input
  style calcite-color-picker-hex-input fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
