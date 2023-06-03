# calcite-segmented-control

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<calcite-segmented-control layout="horizontal" appearance="solid" scale="m" width="auto">
  <calcite-segmented-control-item value="apple" checked>Apple</calcite-segmented-control-item>
  <calcite-segmented-control-item value="mango">Mango</calcite-segmented-control-item>
  <calcite-segmented-control-item value="tomato">Tomato</calcite-segmented-control-item>
  <calcite-segmented-control-item value="banana">Banana</calcite-segmented-control-item>
</calcite-segmented-control>
```

## Properties

| Property       | Attribute       | Description                                                                                       | Type                                     | Default        |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------- |
| `appearance`   | `appearance`    | Specifies the appearance style of the component.                                                  | `"outline" \| "outline-fill" \| "solid"` | `"solid"`      |
| `disabled`     | `disabled`      | When `true`, interaction is prevented and the component is displayed with lower opacity.          | `boolean`                                | `false`        |
| `layout`       | `layout`        | Defines the layout of the component.                                                              | `"grid" \| "horizontal" \| "vertical"`   | `"horizontal"` |
| `name`         | `name`          | Specifies the name of the component. Required to pass the component's `value` on form submission. | `string`                                 | `undefined`    |
| `scale`        | `scale`         | Specifies the size of the component.                                                              | `"l" \| "m" \| "s"`                      | `"m"`          |
| `selectedItem` | `selected-item` | The component's selected item `HTMLElement`.                                                      | `HTMLCalciteSegmentedControlItemElement` | `undefined`    |
| `value`        | `value`         | The component's `selectedItem` value.                                                             | `string`                                 | `null`         |
| `width`        | `width`         | Specifies the width of the component.                                                             | `"auto" \| "full"`                       | `"auto"`       |

## Events

| Event                           | Description                                                                      | Type                |
| ------------------------------- | -------------------------------------------------------------------------------- | ------------------- |
| `calciteSegmentedControlChange` | Fires when the selected option changes, where the event detail is the new value. | `CustomEvent<void>` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Slots

| Slot | Description                                          |
| ---- | ---------------------------------------------------- |
|      | A slot for adding `calcite-segmented-control-item`s. |

---

_Built with [StencilJS](https://stenciljs.com/)_
