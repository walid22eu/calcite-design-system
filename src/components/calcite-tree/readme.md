# calcite-tree

<!-- Auto Generated Below -->

## Usage

### Basic

`<calcite-tree>` can be used as a sidebar navigation tree with optional lines and different selection modes.

```html
<calcite-tree>
  <calcite-tree-item>
    <a href="#">Child 1</a>
    <calcite-tree slot="children">
      <calcite-tree-item>
        <a href="#">Grandchild 1</a>
      </calcite-tree-item>
      <calcite-tree-item>
        <a href="#">Grandchild 2</a>
      </calcite-tree-item>
    </calcite-tree>
  </calcite-tree-item>
</calcite-tree>
```

## Properties

| Property        | Attribute        | Description                                                                                                              | Type                                                                                                                                                  | Default                    |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `inputEnabled`  | `input-enabled`  | <span style="color:red">**[DEPRECATED]**</span> use "ancestors" selection-mode for checkbox input<br/><br/>Display input | `boolean`                                                                                                                                             | `false`                    |
| `lines`         | `lines`          | Display indentation guide lines                                                                                          | `boolean`                                                                                                                                             | `false`                    |
| `scale`         | `scale`          | Specify the scale of the tree, defaults to m                                                                             | `"l" \| "m" \| "s"`                                                                                                                                   | `"m"`                      |
| `selectionMode` | `selection-mode` | Customize how tree selection works (single, multi, children, multi-children, ancestors)                                  | `TreeSelectionMode.Ancestors \| TreeSelectionMode.Children \| TreeSelectionMode.Multi \| TreeSelectionMode.MultiChildren \| TreeSelectionMode.Single` | `TreeSelectionMode.Single` |

## Events

| Event               | Description                                                                                                                                     | Type                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `calciteTreeSelect` | Emitted when user selects/deselects tree items. An object including an array of selected items will be passed in the event's `detail` property. | `CustomEvent<TreeSelectDetail>` |

## Slots

| Slot         | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `"children"` | a slot for adding child components, commonly calcite-tree-item |

---

_Built with [StencilJS](https://stenciljs.com/)_
