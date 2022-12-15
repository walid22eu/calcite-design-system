# calcite-action-group

The `calcite-action-group` is a wrapper for multiple `calcite-action`s and housed in `calcite-action-bar` and `calcite-action-pad`.

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute           | Description                                                             | Type                                   | Default      |
| ------------------ | ------------------- | ----------------------------------------------------------------------- | -------------------------------------- | ------------ |
| `columns`          | `columns`           | Indicates number of columns.                                            | `1 \| 2 \| 3 \| 4 \| 5 \| 6`           | `undefined`  |
| `expanded`         | `expanded`          | When `true`, the component is expanded.                                 | `boolean`                              | `false`      |
| `layout`           | `layout`            | Indicates the layout of the component.                                  | `"grid" \| "horizontal" \| "vertical"` | `"vertical"` |
| `menuOpen`         | `menu-open`         | When `true`, the `calcite-action-menu` is open.                         | `boolean`                              | `false`      |
| `messageOverrides` | `message-overrides` | Use this property to override individual strings used by the component. | `Messages`                             | `undefined`  |
| `scale`            | `scale`             | Specifies the size of the `calcite-action-menu`.                        | `"l" \| "m" \| "s"`                    | `undefined`  |

## Slots

| Slot             | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
|                  | A slot for adding a group of `calcite-action`s.                                        |
| `"menu-actions"` | A slot for adding an overflow menu with `calcite-action`s inside a `calcite-dropdown`. |
| `"menu-tooltip"` | A slot for adding a `calcite-tooltip` for the menu.                                    |

## CSS Custom Properties

| Name                             | Description                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `--calcite-action-group-columns` | Sets number of grid-template-columns when the `layout` property is `"grid"`. |

## Dependencies

### Used by

- [calcite-action-bar](../action-bar)
- [calcite-action-pad](../action-pad)

### Depends on

- [calcite-action-menu](../action-menu)
- [calcite-action](../action)

### Graph

```mermaid
graph TD;
  calcite-action-group --> calcite-action-menu
  calcite-action-group --> calcite-action
  calcite-action-menu --> calcite-action
  calcite-action-menu --> calcite-popover
  calcite-action --> calcite-loader
  calcite-action --> calcite-icon
  calcite-popover --> calcite-action
  calcite-popover --> calcite-icon
  calcite-action-bar --> calcite-action-group
  calcite-action-pad --> calcite-action-group
  style calcite-action-group fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
