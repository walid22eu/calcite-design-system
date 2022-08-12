# calcite-switch

`calcite-switch` is used to toggle a value on or off.

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<label> <calcite-switch checked></calcite-switch> Switch is on </label>
```

## Properties

| Property   | Attribute  | Description                                                                                                          | Type                | Default     |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------- |
| `checked`  | `checked`  | When true, the component is checked.                                                                                 | `boolean`           | `false`     |
| `disabled` | `disabled` | When true, interaction is prevented and the component is displayed with lower opacity.                               | `boolean`           | `false`     |
| `label`    | `label`    | Accessible name for the component.                                                                                   | `string`            | `undefined` |
| `name`     | `name`     | Specifies the name of the component on form submission.                                                              | `string`            | `undefined` |
| `scale`    | `scale`    | Specifies the size of the component.                                                                                 | `"l" \| "m" \| "s"` | `"m"`       |
| `switched` | `switched` | <span style="color:red">**[DEPRECATED]**</span> use "checked" instead.<br/><br/>When true, the component is checked. | `boolean`           | `false`     |
| `value`    | `value`    | The component's value.                                                                                               | `any`               | `undefined` |

## Events

| Event                 | Description                                                                                                                          | Type               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `calciteSwitchChange` | Fires when the checked value has changed. **Note:** The event payload is deprecated, use the component's "checked" property instead. | `CustomEvent<any>` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [calcite-block-section](../block-section)

### Graph

```mermaid
graph TD;
  calcite-block-section --> calcite-switch
  style calcite-switch fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
