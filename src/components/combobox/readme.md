# calcite-combobox

<!-- Auto Generated Below -->

## Usage

### Ancestors

```html
<calcite-combobox label="Ancestors selection-mode combobox" selection-mode="ancestors">
  <calcite-combobox-item value="Trees" text-label="Trees">
    <calcite-combobox-item
      value="CommercialDamageAssessment - Damage to Commercial Buildings & Damage to Commercial Buildings"
      text-label="CommercialDamageAssessment - Damage to Commercial Buildings & Damage to Commercial Buildings"
      selected
    ></calcite-combobox-item>
    <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
    <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
  </calcite-combobox-item>
</calcite-combobox>
```

### Multi

```html
<calcite-combobox label="Mulit selection-mode combobox" selection-mode="multi">
  <calcite-combobox-item value="Trees" text-label="Trees">
    <calcite-combobox-item
      value="CommercialDamageAssessment - Damage to Commercial Buildings & Damage to Commercial Buildings"
      text-label="CommercialDamageAssessment - Damage to Commercial Buildings & Damage to Commercial Buildings"
      selected
    ></calcite-combobox-item>
    <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
    <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
  </calcite-combobox-item>
</calcite-combobox>
```

### Single

```html
<calcite-combobox label="Single selection-mode combobox" selection-mode="single">
  <calcite-combobox-item value="Trees" text-label="Trees">
    <calcite-combobox-item
      value="CommercialDamageAssessment - Damage to Commercial Buildings"
      text-label="CommercialDamageAssessment - Damage to Commercial Buildings"
      selected
    ></calcite-combobox-item>
    <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
    <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
  </calcite-combobox-item>
  <calcite-combobox-item value="Rivers" text-label="Rivers"></calcite-combobox-item>
</calcite-combobox>
```

## Properties

| Property             | Attribute             | Description                                                                                                                                                                                                                                                                                                                                                                 | Type                                               | Default          |
| -------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------- |
| `allowCustomValues`  | `allow-custom-values` | When `true`, allows entry of custom values, which are not in the original set of items.                                                                                                                                                                                                                                                                                     | `boolean`                                          | `undefined`      |
| `disabled`           | `disabled`            | When `true`, interaction is prevented and the component is displayed with lower opacity.                                                                                                                                                                                                                                                                                    | `boolean`                                          | `false`          |
| `flipPlacements`     | --                    | Defines the available placements that can be used when a flip occurs.                                                                                                                                                                                                                                                                                                       | `Placement[]`                                      | `undefined`      |
| `intlRemoveTag`      | `intl-remove-tag`     | Accessible name for the component's remove tag when a `calcite-combobox-item` is selected.                                                                                                                                                                                                                                                                                  | `string`                                           | `TEXT.removeTag` |
| `label` _(required)_ | `label`               | Accessible name for the component.                                                                                                                                                                                                                                                                                                                                          | `string`                                           | `undefined`      |
| `maxItems`           | `max-items`           | Specifies the maximum number of `calcite-combobox-item`s (including nested children) to display before displaying a scrollbar.                                                                                                                                                                                                                                              | `number`                                           | `0`              |
| `name`               | `name`                | Specifies the name of the component on form submission.                                                                                                                                                                                                                                                                                                                     | `string`                                           | `undefined`      |
| `open`               | `open`                | When `true`, displays and positions the component.                                                                                                                                                                                                                                                                                                                          | `boolean`                                          | `false`          |
| `overlayPositioning` | `overlay-positioning` | Determines the type of positioning to use for the overlaid content. Using `"absolute"` will work for most cases. The component will be positioned inside of overflowing parent containers and will affect the container's layout. `"fixed"` should be used to escape an overflowing parent container, or when the reference element's `position` CSS property is `"fixed"`. | `"absolute" \| "fixed"`                            | `"absolute"`     |
| `placeholder`        | `placeholder`         | Specifies the placeholder text for the input.                                                                                                                                                                                                                                                                                                                               | `string`                                           | `undefined`      |
| `placeholderIcon`    | `placeholder-icon`    | Specifies the placeholder icon for the input.                                                                                                                                                                                                                                                                                                                               | `string`                                           | `undefined`      |
| `scale`              | `scale`               | Specifies the size of the component.                                                                                                                                                                                                                                                                                                                                        | `"l" \| "m" \| "s"`                                | `"m"`            |
| `selectionMode`      | `selection-mode`      | specify the selection mode - multiple: allow any number of selected items (default) - single: only one selection) - ancestors: like multiple, but show ancestors of selected items as selected, only deepest children shown in chips                                                                                                                                        | `"ancestors" \| "multi" \| "multiple" \| "single"` | `"multi"`        |
| `value`              | `value`               | The component's value(s) from the selected `calcite-combobox-item`(s).                                                                                                                                                                                                                                                                                                      | `string \| string[]`                               | `null`           |

## Events

| Event                         | Description                                                                                              | Type                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `calciteComboboxBeforeClose`  | Fires when the component is requested to be closed, and before the closing transition begins.            | `CustomEvent<void>`                                                              |
| `calciteComboboxBeforeOpen`   | Fires when the component is added to the DOM but not rendered, and before the opening transition begins. | `CustomEvent<void>`                                                              |
| `calciteComboboxChange`       | Fires when the selected item(s) changes.                                                                 | `CustomEvent<{ selectedItems: HTMLCalciteComboboxItemElement[]; }>`              |
| `calciteComboboxChipClose`    | Fires when a selected item in the component is dismissed via its `calcite-chip`.                         | `CustomEvent<any>`                                                               |
| `calciteComboboxClose`        | Fires when the component is closed and animation is complete.                                            | `CustomEvent<void>`                                                              |
| `calciteComboboxFilterChange` | Fires when text is added to filter the options list.                                                     | `CustomEvent<{ visibleItems: HTMLCalciteComboboxItemElement[]; text: string; }>` |
| `calciteComboboxOpen`         | Fires when the component is open and animation is complete.                                              | `CustomEvent<void>`                                                              |

## Methods

### `reposition(delayed?: boolean) => Promise<void>`

Updates the position of the component.

#### Returns

Type: `Promise<void>`

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Slots

| Slot | Description                                 |
| ---- | ------------------------------------------- |
|      | A slot for adding `calcite-combobox-item`s. |

## CSS Custom Properties

| Name                              | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `--calcite-combobox-input-height` | Specifies the height of the component's input. |

## Dependencies

### Depends on

- [calcite-chip](../chip)
- [calcite-icon](../icon)

### Graph

```mermaid
graph TD;
  calcite-combobox --> calcite-chip
  calcite-combobox --> calcite-icon
  calcite-chip --> calcite-icon
  style calcite-combobox fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
