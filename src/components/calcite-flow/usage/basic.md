#### Basic

Renders a basic flow with a couple `calcite-panel`s.

```html
<calcite-flow>
  <calcite-panel heading="one, two, three, four">
    <!-- image -->
  </calcite-panel>
  <calcite-panel heading="tell me that you love me more">
    <!-- image -->
  </calcite-panel>
</calcite-flow>
```

#### Menu-actions and footer-actions

Renders a flow with menu-actions and footer-actions in the form of buttons.

```html
<calcite-flow>
  <calcite-panel heading="What are the most popular commute alternatives?">
    <button slot="header-menu-actions">Reset</button>
    <button slot="header-menu-actions">Rename</button>
    <button slot="footer-actions">Save</button>
    <button slot="footer-actions">Cancel</button>
  </calcite-panel>
</calcite-flow>
```
