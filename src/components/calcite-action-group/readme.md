# calcite-action-group

The `calcite-action-group` is a wrapper for multiple `calcite-action`s and housed in `calcite-action-bar` and `calcite-action-pad`.

<!-- Auto Generated Below -->

## Properties

| Property      | Attribute      | Description                           | Type      | Default     |
| ------------- | -------------- | ------------------------------------- | --------- | ----------- |
| `expanded`    | `expanded`     | Indicates whether widget is expanded. | `boolean` | `false`     |
| `intlOptions` | `intl-options` | Text string for the actions menu.     | `string`  | `undefined` |
| `menuOpen`    | `menu-open`    | Opens the action menu.                | `boolean` | `false`     |

## Slots

| Slot             | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
|                  | A slot for adding a group of `calcite-action`s.                    |
| `"menu-actions"` | a slot for adding an overflow menu with actions inside a dropdown. |

## Dependencies

### Used by

- [calcite-action-bar](../calcite-action-bar)
- [calcite-action-pad](../calcite-action-pad)

### Depends on

- [calcite-action-menu](../calcite-action-menu)

### Graph

```mermaid
graph TD;
  calcite-action-group --> calcite-action-menu
  calcite-action-menu --> calcite-action
  calcite-action-menu --> calcite-popover
  calcite-action --> calcite-loader
  calcite-action --> calcite-icon
  calcite-popover --> calcite-icon
  calcite-action-bar --> calcite-action-group
  calcite-action-pad --> calcite-action-group
  style calcite-action-group fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
