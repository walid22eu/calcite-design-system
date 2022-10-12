# calcite-color-picker

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<calcite-color-picker dir="ltr" scale="m" value="#b33f33" appearance="default"></calcite-color-picker>
```

### Minimal

For a minimal design, you can hide unused color formats and options:

```html
<calcite-color-picker appearance="minimal" value="" allow-empty hide-saved hide-channels></calcite-color-picker>
```

## Properties

| Property          | Attribute           | Description                                                                                                                                                                                                                                     | Type                                                                                                                                                                                                                                    | Default            |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `allowEmpty`      | `allow-empty`       | When false, empty color (null) will be allowed as a value. Otherwise, a color value is always enforced by the component. When true, clearing the input and blurring will restore the last valid color set. When false, it will set it to empty. | `boolean`                                                                                                                                                                                                                               | `false`            |
| `appearance`      | `appearance`        | specify the appearance - solid (containing border), or minimal (no containing border)                                                                                                                                                           | `"default" \| "minimal" \| "solid"`                                                                                                                                                                                                     | `"solid"`          |
| `disabled`        | `disabled`          | When true, disabled prevents user interaction.                                                                                                                                                                                                  | `boolean`                                                                                                                                                                                                                               | `false`            |
| `format`          | `format`            | The format of the value property. When "auto", the format will be inferred from `value` when set.                                                                                                                                               | `"auto" \| "hex" \| "hexa" \| "hsl" \| "hsl-css" \| "hsla" \| "hsla-css" \| "hsv" \| "hsva" \| "rgb" \| "rgb-css" \| "rgba" \| "rgba-css"`                                                                                              | `defaultFormat`    |
| `hideChannels`    | `hide-channels`     | When true, hides the RGB/HSV channel inputs                                                                                                                                                                                                     | `boolean`                                                                                                                                                                                                                               | `false`            |
| `hideHex`         | `hide-hex`          | When true, hides the hex input                                                                                                                                                                                                                  | `boolean`                                                                                                                                                                                                                               | `false`            |
| `hideSaved`       | `hide-saved`        | When true, hides the saved colors section                                                                                                                                                                                                       | `boolean`                                                                                                                                                                                                                               | `false`            |
| `intlB`           | `intl-b`            | Label used for the blue channel                                                                                                                                                                                                                 | `string`                                                                                                                                                                                                                                | `TEXT.b`           |
| `intlBlue`        | `intl-blue`         | Label used for the blue channel description                                                                                                                                                                                                     | `string`                                                                                                                                                                                                                                | `TEXT.blue`        |
| `intlDeleteColor` | `intl-delete-color` | Label used for the delete color button.                                                                                                                                                                                                         | `string`                                                                                                                                                                                                                                | `TEXT.deleteColor` |
| `intlG`           | `intl-g`            | Label used for the green channel                                                                                                                                                                                                                | `string`                                                                                                                                                                                                                                | `TEXT.g`           |
| `intlGreen`       | `intl-green`        | Label used for the green channel description                                                                                                                                                                                                    | `string`                                                                                                                                                                                                                                | `TEXT.green`       |
| `intlH`           | `intl-h`            | Label used for the hue channel                                                                                                                                                                                                                  | `string`                                                                                                                                                                                                                                | `TEXT.h`           |
| `intlHex`         | `intl-hex`          | Label used for the hex input                                                                                                                                                                                                                    | `string`                                                                                                                                                                                                                                | `TEXT.hex`         |
| `intlHsv`         | `intl-hsv`          | Label used for the HSV mode                                                                                                                                                                                                                     | `string`                                                                                                                                                                                                                                | `TEXT.hsv`         |
| `intlHue`         | `intl-hue`          | Label used for the hue channel description                                                                                                                                                                                                      | `string`                                                                                                                                                                                                                                | `TEXT.hue`         |
| `intlNoColor`     | `intl-no-color`     | Label used for the hex input when there is no color selected.                                                                                                                                                                                   | `string`                                                                                                                                                                                                                                | `TEXT.noColor`     |
| `intlR`           | `intl-r`            | Label used for the red channel                                                                                                                                                                                                                  | `string`                                                                                                                                                                                                                                | `TEXT.r`           |
| `intlRed`         | `intl-red`          | Label used for the red channel description                                                                                                                                                                                                      | `string`                                                                                                                                                                                                                                | `TEXT.red`         |
| `intlRgb`         | `intl-rgb`          | Label used for the RGB mode                                                                                                                                                                                                                     | `string`                                                                                                                                                                                                                                | `TEXT.rgb`         |
| `intlS`           | `intl-s`            | Label used for the saturation channel                                                                                                                                                                                                           | `string`                                                                                                                                                                                                                                | `TEXT.s`           |
| `intlSaturation`  | `intl-saturation`   | Label used for the saturation channel description                                                                                                                                                                                               | `string`                                                                                                                                                                                                                                | `TEXT.saturation`  |
| `intlSaveColor`   | `intl-save-color`   | Label used for the save color button.                                                                                                                                                                                                           | `string`                                                                                                                                                                                                                                | `TEXT.saveColor`   |
| `intlSaved`       | `intl-saved`        | Label used for the saved colors section                                                                                                                                                                                                         | `string`                                                                                                                                                                                                                                | `TEXT.saved`       |
| `intlV`           | `intl-v`            | Label used for the value channel                                                                                                                                                                                                                | `string`                                                                                                                                                                                                                                | `TEXT.v`           |
| `intlValue`       | `intl-value`        | Label used for the                                                                                                                                                                                                                              | `string`                                                                                                                                                                                                                                | `TEXT.value`       |
| `numberingSystem` | `numbering-system`  | Specifies the Unicode numeral system used by the component for localization.                                                                                                                                                                    | `"arab" \| "arabext" \| "bali" \| "beng" \| "deva" \| "fullwide" \| "gujr" \| "guru" \| "hanidec" \| "khmr" \| "knda" \| "laoo" \| "latn" \| "limb" \| "mlym" \| "mong" \| "mymr" \| "orya" \| "tamldec" \| "telu" \| "thai" \| "tibt"` | `undefined`        |
| `scale`           | `scale`             | The scale of the color picker.                                                                                                                                                                                                                  | `"l" \| "m" \| "s"`                                                                                                                                                                                                                     | `"m"`              |
| `storageId`       | `storage-id`        | Storage ID for colors.                                                                                                                                                                                                                          | `string`                                                                                                                                                                                                                                | `undefined`        |
| `value`           | `value`             | The component's value. This value can be either a CSS color string, a RGB, HSL or HSV object. The type will be preserved as the color is updated.                                                                                               | `HSL \| HSL & ObjectWithAlpha \| HSV \| HSV & ObjectWithAlpha \| RGB \| RGB & ObjectWithAlpha \| string`                                                                                                                                | `defaultValue`     |

## Events

| Event                      | Description                                                                                                                                                                                      | Type                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `calciteColorPickerChange` | Fires when the color value has changed.                                                                                                                                                          | `CustomEvent<void>` |
| `calciteColorPickerInput`  | Fires as the color value changes. This is similar to the change event with the exception of dragging. When dragging the color field or hue slider thumb, this event fires as the thumb is moved. | `CustomEvent<void>` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Depends on

- [calcite-tab-title](../tab-title)
- [calcite-tab](../tab)
- [calcite-input](../input)
- [calcite-color-picker-hex-input](../color-picker-hex-input)
- [calcite-tabs](../tabs)
- [calcite-tab-nav](../tab-nav)
- [calcite-button](../button)
- [calcite-color-picker-swatch](../color-picker-swatch)

### Graph

```mermaid
graph TD;
  calcite-color-picker --> calcite-tab-title
  calcite-color-picker --> calcite-tab
  calcite-color-picker --> calcite-input
  calcite-color-picker --> calcite-color-picker-hex-input
  calcite-color-picker --> calcite-tabs
  calcite-color-picker --> calcite-tab-nav
  calcite-color-picker --> calcite-button
  calcite-color-picker --> calcite-color-picker-swatch
  calcite-tab-title --> calcite-icon
  calcite-input --> calcite-progress
  calcite-input --> calcite-icon
  calcite-color-picker-hex-input --> calcite-input
  calcite-color-picker-hex-input --> calcite-color-picker-swatch
  calcite-button --> calcite-loader
  calcite-button --> calcite-icon
  style calcite-color-picker fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
