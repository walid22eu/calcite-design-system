# calcite-icon

To use a custom color for the icon fill, you can add a class to the `calcite-icon` component with the desired color.

```
<calcite-icon class="my-icon-color-class" icon="arrowBoldLeft"></calcite-icon>
```

```
.my-icon-color-class {
  color: #007ac2;
}
```

<!-- Auto Generated Below -->

## Properties

| Property    | Attribute    | Description                                                                                                                         | Type                | Default     |
| ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------- |
| `icon`      | `icon`       | The name of the icon to display. The value of this property must match the icon name from https://esri.github.io/calcite-ui-icons/. | `string`            | `null`      |
| `mirrored`  | `mirrored`   | When true, the icon will be mirrored when the element direction is 'rtl'.                                                           | `boolean`           | `false`     |
| `scale`     | `scale`      | Icon scale. Can be "s" \| "m" \| "l".                                                                                               | `"l" \| "m" \| "s"` | `"m"`       |
| `textLabel` | `text-label` | The icon label. It is recommended to set this value if your icon is semantic.                                                       | `string`            | `undefined` |
| `theme`     | `theme`      | Icon theme. Can be "light" or "dark".                                                                                               | `"dark" \| "light"` | `undefined` |

## Dependencies

### Used by

- [calcite-accordion-item](../calcite-accordion-item)
- [calcite-alert](../calcite-alert)
- [calcite-button](../calcite-button)
- [calcite-chip](../calcite-chip)
- [calcite-combobox-item](../calcite-combobox-item)
- [calcite-date-month-header](../calcite-date-month-header)
- [calcite-dropdown-item](../calcite-dropdown-item)
- [calcite-input](../calcite-input)
- [calcite-input-message](../calcite-input-message)
- [calcite-link](../calcite-link)
- [calcite-modal](../calcite-modal)
- [calcite-notice](../calcite-notice)
- [calcite-pagination](../calcite-pagination)
- [calcite-popover](../calcite-popover)
- [calcite-radio-group-item](../calcite-radio-group-item)
- [calcite-stepper-item](../calcite-stepper-item)
- [calcite-tree-item](../calcite-tree-item)

### Graph

```mermaid
graph TD;
  calcite-accordion-item --> calcite-icon
  calcite-alert --> calcite-icon
  calcite-button --> calcite-icon
  calcite-chip --> calcite-icon
  calcite-combobox-item --> calcite-icon
  calcite-date-month-header --> calcite-icon
  calcite-dropdown-item --> calcite-icon
  calcite-input --> calcite-icon
  calcite-input-message --> calcite-icon
  calcite-link --> calcite-icon
  calcite-modal --> calcite-icon
  calcite-notice --> calcite-icon
  calcite-pagination --> calcite-icon
  calcite-popover --> calcite-icon
  calcite-radio-group-item --> calcite-icon
  calcite-stepper-item --> calcite-icon
  calcite-tree-item --> calcite-icon
  style calcite-icon fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
