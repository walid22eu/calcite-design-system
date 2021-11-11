# calcite-filter

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute     | Description                                                                                                                                                                                                                                           | Type       | Default     |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| `data`          | --            | <span style="color:red">**[DEPRECATED]**</span> use `items` instead.<br/><br/>The input data. The filter uses this as the starting point, and returns items that contain the string entered in the input, using a partial match and recursive search. | `object[]` | `undefined` |
| `disabled`      | `disabled`    | When true, disabled prevents interaction. This state shows items with lower opacity/grayed.                                                                                                                                                           | `boolean`  | `false`     |
| `filteredItems` | --            | The resulting items after filtering.                                                                                                                                                                                                                  | `object[]` | `[]`        |
| `intlClear`     | `intl-clear`  | A text label that will appear on the clear button.                                                                                                                                                                                                    | `string`   | `undefined` |
| `intlLabel`     | `intl-label`  | A text label that will appear next to the input field.                                                                                                                                                                                                | `string`   | `undefined` |
| `items`         | --            | The items to filter through. The filter uses this as the starting point, and returns items that contain the string entered in the input, using a partial match and recursive search. This property is required.                                       | `object[]` | `undefined` |
| `placeholder`   | `placeholder` | Placeholder text for the input element's placeholder attribute                                                                                                                                                                                        | `string`   | `undefined` |
| `value`         | `value`       | Filter value.                                                                                                                                                                                                                                         | `string`   | `undefined` |

## Events

| Event                 | Description                                    | Type               |
| --------------------- | ---------------------------------------------- | ------------------ |
| `calciteFilterChange` | This event fires when the filter text changes. | `CustomEvent<any>` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [calcite-pick-list](../calcite-pick-list)
- [calcite-value-list](../calcite-value-list)

### Depends on

- [calcite-scrim](../calcite-scrim)
- [calcite-input](../calcite-input)
- [calcite-icon](../calcite-icon)

### Graph

```mermaid
graph TD;
  calcite-filter --> calcite-scrim
  calcite-filter --> calcite-input
  calcite-filter --> calcite-icon
  calcite-scrim --> calcite-loader
  calcite-input --> calcite-progress
  calcite-input --> calcite-icon
  calcite-pick-list --> calcite-filter
  calcite-value-list --> calcite-filter
  style calcite-filter fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
