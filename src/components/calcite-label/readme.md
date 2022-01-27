# calcite-label

Renders a `<label>` around its children and can be used with any [labelable native](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Form_labelable) or labelable calcite element.

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<calcite-label>
  Invalid input
  <calcite-input type="search" placeholder="Filter your files" value="adfo2h2" status="invalid"></calcite-input>
  <calcite-input-message active icon status="invalid"> Something doesn't look right </calcite-input-message>
</calcite-label>
```

### Browser-caveat

When using the `default`, `inline` or `inline-space-between` layout option with [browsers that do not support the CSS `gap` property when used with flexbox](https://caniuse.com/flexbox-gap), you will need to use the `disable-spacing` attribute and apply spacing manually to the label by wrapping it in a styled span like so:

```html
<calcite-label layout="inline" disable-spacing>
  <span style="margin-right: 0.75rem">Text leading inline</span>
  <calcite-checkbox></calcite-checkbox>
</calcite-label>
```

## Properties

| Property         | Attribute         | Description                                                          | Type                                              | Default     |
| ---------------- | ----------------- | -------------------------------------------------------------------- | ------------------------------------------------- | ----------- |
| `alignment`      | `alignment`       | specify the text alignment of the label                              | `"center" \| "end" \| "start"`                    | `"start"`   |
| `disableSpacing` | `disable-spacing` | eliminates any space around the label                                | `boolean`                                         | `false`     |
| `disabled`       | `disabled`        | is the label disabled                                                | `boolean`                                         | `false`     |
| `for`            | `for`             | The id of the input associated with the label                        | `string`                                          | `undefined` |
| `layout`         | `layout`          | is the wrapped element positioned inline with the label slotted text | `"default" \| "inline" \| "inline-space-between"` | `"default"` |
| `scale`          | `scale`           | specify the scale of the label, defaults to m                        | `"l" \| "m" \| "s"`                               | `"m"`       |
| `status`         | `status`          | specify the status of the label and any child input / input messages | `"idle" \| "invalid" \| "valid"`                  | `"idle"`    |

## Slots

| Slot | Description                                                 |
| ---- | ----------------------------------------------------------- |
|      | A slot for adding text and a component that can be labeled. |

## Dependencies

### Used by

- [calcite-card](../calcite-card)

### Graph

```mermaid
graph TD;
  calcite-card --> calcite-label
  style calcite-label fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
