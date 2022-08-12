# calcite-shell

The `calcite-shell` component is used for application layout management. It is a container for the view as well as other calcite components like `calcite-shell-panel` and `calcite-tip-manager`.

_note: calcite-shell supports tablet as the smallest screen size_

<!-- Auto Generated Below -->

## Usage

### Advanced

Renders a shell with leading and trailing floating panels, action bar/pad, block, flow, tip manager, footer.

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-start" position="start" detached>
    <calcite-action-bar slot="action-bar">
      <calcite-action-group>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Save" disabled icon="save"></calcite-action>
        <calcite-action text="Layers" active indicator icon="layers"></calcite-action>
      </calcite-action-group>
      <calcite-action-group>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Layers" indicator icon="layers"></calcite-action>
      </calcite-action-group>
    </calcite-action-bar>
    <calcite-block collapsible  heading="Primary Content" summary="This is the primary.">
      <calcite-block-content>
        <calcite-action text="Puppies" text-enabled indicator icon="plus"></calcite-action>
        <calcite-action text="Kittens" text-enabled icon="save"></calcite-action>
        <calcite-action text="Birds?" text-enabled icon="banana"></calcite-action>
      </calcite-block-content>
    </calcite-block>
    <calcite-block collapsible  heading="Additional Block" summary="Baby shark doo doo doo doo.">
      <calcite-block-content>
          <p>Cool thing.</p>
      </calcite-block-content>
    </calcite-block>
  </calcite-shell-panel>

   <calcite-shell-panel slot="panel-end" position="end" detached height-scale="l">
      <calcite-action-bar slot="action-bar">
        <calcite-action-group>
          <calcite-action text="Add" active icon="plus"></calcite-action>
          <calcite-action text="Save" disabled icon="save"></calcite-action>
          <calcite-action text="Layers" icon="layers"></calcite-action>
        </calcite-action-group>
        <calcite-action-group>
          <calcite-action text="Add" icon="plus"></calcite-action>
          <calcite-action text="Save" disabled icon="save"></calcite-action>
          <calcite-action text="Layers" icon="layers"></calcite-action>
        </calcite-action-group>
        <calcite-action slot="bottom-actions" text="Tips" icon="lightbulb"></calcite-action>
      </calcite-action-bar>
      <calcite-flow>
        <calcite-panel heading="Layer settings">
          <calcite-block collapsible open heading="Contextual Content" summary="Select goodness">
            <calcite-value-list multiple filter-enabled>
              <calcite-value-list-item label="2018 Population Density (Esri)" description="{POPDENS_CY}" value="POPDENS_CY">
                <calcite-action slot="actions-end" icon="camera-flash-on"></calcite-action>
              </calcite-value-list-item>
              <calcite-value-list-item label="2018 Population Density [Updated]" description="{POPDENS_CY}" value="POPDENS_CY2">
                <calcite-action slot="actions-end" icon="banana"></calcite-action>
              </calcite-value-list-item>
              <calcite-value-list-item label="2018 Total Households (Esri)" description="{TOTHH_CY}" value="TOTHH_CY">
                <calcite-action slot="actions-end" icon="person2"></calcite-action>
              </calcite-value-list-item>
            </calcite-value-list>
          </calcite-block>
        </calcite-panel>
      </calcite-flow>
  </calcite-shell-panel>
  <calcite-tip-manager slot="center-row">
    <calcite-tip heading="The Red Rocks and Blue Water" thumbnail="https://placeimg.com/1000/600" text-thumbnail="This is an image of nature.">
    <calcite-tip heading="The Long Trees" thumbnail="https://placeimg.com/1000/600" text-thumbnail="This is an image of trees.">
  </calcite-tip-manager>
  <footer slot="footer">Footer</footer>
</calcite-shell>
```

### Basic

Renders a basic shell with a header and a footer.

```html
<calcite-shell>
  <div slot="header">
    <header>
      <h2>Shell Header: My App</h2>
    </header>
  </div>
  <p>Shell Content</p>
  <!-- insert map or fillable content here -->
  <footer slot="footer">Footer</footer>
</calcite-shell>
```

### With-panel-and-action-bar

Renders a single panel with actions in an action bar.

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-start" position="start">
    <img src="https://via.placeholder.com/300x200" alt="placeholder" />
    <calcite-action-bar slot="action-bar">
      <calcite-action text="Add" active icon="plus"></calcite-action>
      <calcite-action text="Save" disabled icon="save"></calcite-action>
      <calcite-action text="Layers" icon="layers"></calcite-action>
    </calcite-action-bar>
  </calcite-shell-panel>
</calcite-shell>
```

### With-panels

Renders a shell with a header and panels on the left and right sides of the app.

```html
<calcite-shell>
  <calcite-shell-panel slot="panel-start" position="start">
    Leading panel! (on the left side, since this is a LTR app)
  </calcite-shell-panel>
  <calcite-shell-panel slot="panel-end" position="end"> Trailing panel! (right side) </calcite-shell-panel>
  <calcite-shell-center-row slot="center-row" position="end" height-scale="m">
    Center Row! (center bottom)
  </calcite-shell-center-row>
  <div slot="header">
    <header>
      <h2>Shell Header: My App</h2>
    </header>
  </div>
  <p>Shell Content</p>
  <!-- insert map or fillable content here -->
</calcite-shell>
```

## Properties

| Property        | Attribute        | Description                                                     | Type      | Default |
| --------------- | ---------------- | --------------------------------------------------------------- | --------- | ------- |
| `contentBehind` | `content-behind` | Positions the center content behind any `calcite-shell-panel`s. | `boolean` | `false` |

## Slots

| Slot                 | Description                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|                      | A slot for adding content to the component. This content will appear between any leading and trailing panels added to the component, such as a map. |
| `"center-row"`       | A slot for adding content to the center row.                                                                                                        |
| `"contextual-panel"` | [DEPRECATED] A slot for adding the trailing `calcite-shell-panel`.                                                                                  |
| `"footer"`           | A slot for adding footer content. This content will be positioned at the bottom of the component.                                                   |
| `"header"`           | A slot for adding header content. This content will be positioned at the top of the component.                                                      |
| `"panel-end"`        | A slot for adding the ending `calcite-shell-panel`.                                                                                                 |
| `"panel-start"`      | A slot for adding the starting `calcite-shell-panel`.                                                                                               |
| `"primary-panel"`    | [DEPRECATED] A slot for adding the leading `calcite-shell-panel`.                                                                                   |

## CSS Custom Properties

| Name                          | Description                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `--calcite-shell-tip-spacing` | The left and right spacing of the `calcite-tip-manager` when slotted in the component. |

---

_Built with [StencilJS](https://stenciljs.com/)_
