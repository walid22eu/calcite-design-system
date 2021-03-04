# calcite-input-message

Displays a contextual message to a user. Allows the passing of content, links, etc.

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                                                                                                                                             | Type                             | Default     |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- |
| `active` | `active`  |                                                                                                                                                         | `boolean`                        | `false`     |
| `icon`   | `icon`    | when used as a boolean set to true, show a default icon based on status. You can also pass a calcite-ui-icon name to this prop to display a custom icon | `boolean \| string`              | `undefined` |
| `scale`  | `scale`   | specify the scale of the input, defaults to m                                                                                                           | `"l" \| "m" \| "s"`              | `"m"`       |
| `status` | `status`  | specify the status of the input field, determines message and icons                                                                                     | `"idle" \| "invalid" \| "valid"` | `"idle"`    |
| `theme`  | `theme`   | specify the theme, defaults to light                                                                                                                    | `"dark" \| "light"`              | `undefined` |
| `type`   | `type`    | specify the appearance of any slotted message - default (displayed under input), or floating (positioned absolutely under input)                        | `"default" \| "floating"`        | `"default"` |

## Dependencies

### Depends on

- [calcite-icon](../calcite-icon)

### Graph

```mermaid
graph TD;
  calcite-input-message --> calcite-icon
  style calcite-input-message fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
