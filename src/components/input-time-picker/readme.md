# calcite-input-time-picker

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<calcite-input-time-picker
  hour-display-format="12"
  name="light"
  scale="m"
  step="1"
  value="12:21"
></calcite-input-time-picker>
```

## Properties

| Property             | Attribute             | Description                                                                                                                                                                                                                                                                                                                                                                 | Type                                                                                                                                                                                                                                    | Default      |
| -------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `active`             | `active`              | <span style="color:red">**[DEPRECATED]**</span> Use `open` instead.<br/><br/>When `true`, the component is active.                                                                                                                                                                                                                                                          | `boolean`                                                                                                                                                                                                                               | `false`      |
| `disabled`           | `disabled`            | When `true`, interaction is prevented and the component is displayed with lower opacity.                                                                                                                                                                                                                                                                                    | `boolean`                                                                                                                                                                                                                               | `false`      |
| `intlHour`           | `intl-hour`           | Accessible name for the component's hour input.                                                                                                                                                                                                                                                                                                                             | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlHourDown`       | `intl-hour-down`      | Accessible name for the component's hour down button.                                                                                                                                                                                                                                                                                                                       | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlHourUp`         | `intl-hour-up`        | Accessible name for the component's hour up button.                                                                                                                                                                                                                                                                                                                         | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlMeridiem`       | `intl-meridiem`       | Accessible name for the component's meridiem (am/pm) input.                                                                                                                                                                                                                                                                                                                 | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlMeridiemDown`   | `intl-meridiem-down`  | Accessible name for the component's meridiem (am/pm) down button.                                                                                                                                                                                                                                                                                                           | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlMeridiemUp`     | `intl-meridiem-up`    | Accessible name for the component's meridiem (am/pm) up button.                                                                                                                                                                                                                                                                                                             | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlMinute`         | `intl-minute`         | Accessible name for the component's minute input.                                                                                                                                                                                                                                                                                                                           | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlMinuteDown`     | `intl-minute-down`    | Accessible name for the component's minute down button.                                                                                                                                                                                                                                                                                                                     | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlMinuteUp`       | `intl-minute-up`      | Accessible name for the component's minute up button.                                                                                                                                                                                                                                                                                                                       | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlSecond`         | `intl-second`         | Accessible name for the component's second input.                                                                                                                                                                                                                                                                                                                           | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlSecondDown`     | `intl-second-down`    | Accessible name for the component's second down button.                                                                                                                                                                                                                                                                                                                     | `string`                                                                                                                                                                                                                                | `undefined`  |
| `intlSecondUp`       | `intl-second-up`      | Accessible name for the component's second up button.                                                                                                                                                                                                                                                                                                                       | `string`                                                                                                                                                                                                                                | `undefined`  |
| `name`               | `name`                | Specifies the name of the component on form submission.                                                                                                                                                                                                                                                                                                                     | `string`                                                                                                                                                                                                                                | `undefined`  |
| `numberingSystem`    | `numbering-system`    | Specifies the Unicode numeral system used by the component for localization.                                                                                                                                                                                                                                                                                                | `"arab" \| "arabext" \| "bali" \| "beng" \| "deva" \| "fullwide" \| "gujr" \| "guru" \| "hanidec" \| "khmr" \| "knda" \| "laoo" \| "latn" \| "limb" \| "mlym" \| "mong" \| "mymr" \| "orya" \| "tamldec" \| "telu" \| "thai" \| "tibt"` | `undefined`  |
| `open`               | `open`                | When `true`, displays the `calcite-time-picker` component.                                                                                                                                                                                                                                                                                                                  | `boolean`                                                                                                                                                                                                                               | `false`      |
| `overlayPositioning` | `overlay-positioning` | Determines the type of positioning to use for the overlaid content. Using `"absolute"` will work for most cases. The component will be positioned inside of overflowing parent containers and will affect the container's layout. `"fixed"` should be used to escape an overflowing parent container, or when the reference element's `position` CSS property is `"fixed"`. | `"absolute" \| "fixed"`                                                                                                                                                                                                                 | `"absolute"` |
| `placement`          | `placement`           | Determines where the popover will be positioned relative to the input.                                                                                                                                                                                                                                                                                                      | `Placement \| VariationPlacement \| AutoPlacement \| DeprecatedPlacement`                                                                                                                                                               | `"auto"`     |
| `readOnly`           | `read-only`           | When `true`, the component's value can be read, but controls are not accessible and the value cannot be modified.                                                                                                                                                                                                                                                           | `boolean`                                                                                                                                                                                                                               | `false`      |
| `scale`              | `scale`               | Specifies the size of the component.                                                                                                                                                                                                                                                                                                                                        | `"l" \| "m" \| "s"`                                                                                                                                                                                                                     | `"m"`        |
| `step`               | `step`                | Specifies the granularity the component's `value` must adhere to (in seconds).                                                                                                                                                                                                                                                                                              | `number`                                                                                                                                                                                                                                | `60`         |
| `value`              | `value`               | The component's value in UTC (always 24-hour format).                                                                                                                                                                                                                                                                                                                       | `string`                                                                                                                                                                                                                                | `null`       |

## Events

| Event                          | Description                                                     | Type                  |
| ------------------------------ | --------------------------------------------------------------- | --------------------- |
| `calciteInputTimePickerChange` | Fires when the time value is changed as a result of user input. | `CustomEvent<string>` |

## Methods

### `reposition() => Promise<void>`

Updates the position of the component.

#### Returns

Type: `Promise<void>`

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Depends on

- [calcite-input](../input)
- [calcite-popover](../popover)
- [calcite-time-picker](../time-picker)

### Graph

```mermaid
graph TD;
  calcite-input-time-picker --> calcite-input
  calcite-input-time-picker --> calcite-popover
  calcite-input-time-picker --> calcite-time-picker
  calcite-input --> calcite-progress
  calcite-input --> calcite-icon
  calcite-popover --> calcite-action
  calcite-popover --> calcite-icon
  calcite-action --> calcite-loader
  calcite-action --> calcite-icon
  calcite-time-picker --> calcite-icon
  style calcite-input-time-picker fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
