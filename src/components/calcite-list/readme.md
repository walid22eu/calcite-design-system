# calcite-list

<!-- Auto Generated Below -->

## Usage

### Advanced

```html
<calcite-list>
  <calcite-list-item label="Princess Bubblegum" description="Ruler of The Candy Kingdom">
    <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
    <calcite-icon scale="l" icon="effects" slot="content-start"></calcite-icon>
    <calcite-avatar
      scale="l"
      slot="content-start"
      thumbnail="https://slm-assets.secondlife.com/assets/19947929/view_large/Capture_du_2018-03-04_20-40-56.jpg?1520192584"
    ></calcite-avatar>
    <calcite-icon
      scale="s"
      icon="check"
      slot="content-end"
      style="color: var(--calcite-ui-success)"
    ></calcite-icon>
    <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
    <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
  </calcite-list-item>
  <calcite-list-item label="Finn Mertens" description="Part owner of the Tree House">
    <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
    <calcite-icon scale="l" icon="running" slot="content-start"></calcite-icon>
    <calcite-avatar
      scale="l"
      slot="content-start"
      thumbnail="https://www.seekpng.com/png/detail/90-906849_89kib-1024x631-finn-finn-adventure-time-face.png"
    ></calcite-avatar>
    <calcite-icon
      scale="s"
      icon="check"
      slot="content-end"
      style="color: var(--calcite-ui-success)"
    ></calcite-icon>
    <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
    <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
  </calcite-list-item>
  <calcite-list-item label="Jake T. Dog" description="Part owner of the Tree House">
    <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
    <calcite-icon scale="l" icon="walking" slot="content-start"></calcite-icon>
    <calcite-avatar
      scale="l"
      slot="content-start"
      thumbnail="https://static.wikia.nocookie.net/adventuretimewithfinnandjake/images/c/c9/603138_454321168018988_647044807_n.png/revision/latest/scale-to-width-down/250?cb=20140624024310"
    ></calcite-avatar>
    <calcite-icon
      scale="s"
      icon="exclamation-mark-triangle"
      slot="content-end"
      style="color: var(--calcite-ui-danger)"
    ></calcite-icon>
    <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
    <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
  </calcite-list-item>
</calcite-list>
</section>
<section class="example-container">
<h2>Non interactive</h2>
<calcite-list>
  <calcite-list-item non-interactive label="Princess Bubblegum" description="Ruler of The Candy Kingdom">
    <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
    <calcite-icon scale="l" icon="effects" slot="content-start"></calcite-icon>
    <calcite-avatar
      scale="l"
      slot="content-start"
      thumbnail="https://slm-assets.secondlife.com/assets/19947929/view_large/Capture_du_2018-03-04_20-40-56.jpg?1520192584"
    ></calcite-avatar>
    <calcite-icon
      scale="s"
      icon="check"
      slot="content-end"
      style="color: var(--calcite-ui-success)"
    ></calcite-icon>
    <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
    <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
  </calcite-list-item>
  <calcite-list-item non-interactive label="Finn Mertens" description="Part owner of the Tree House">
    <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
    <calcite-icon scale="l" icon="running" slot="content-start"></calcite-icon>
    <calcite-avatar
      scale="l"
      slot="content-start"
      thumbnail="https://www.seekpng.com/png/detail/90-906849_89kib-1024x631-finn-finn-adventure-time-face.png"
    ></calcite-avatar>
    <calcite-icon
      scale="s"
      icon="check"
      slot="content-end"
      style="color: var(--calcite-ui-success)"
    ></calcite-icon>
    <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
    <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
  </calcite-list-item>
  <calcite-list-item non-interactive label="Jake T. Dog" description="Part owner of the Tree House">
    <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
    <calcite-icon scale="l" icon="walking" slot="content-start"></calcite-icon>
    <calcite-avatar
      scale="l"
      slot="content-start"
      thumbnail="https://static.wikia.nocookie.net/adventuretimewithfinnandjake/images/c/c9/603138_454321168018988_647044807_n.png/revision/latest/scale-to-width-down/250?cb=20140624024310"
    ></calcite-avatar>
    <calcite-icon
      scale="s"
      icon="exclamation-mark-triangle"
      slot="content-end"
      style="color: var(--calcite-ui-danger)"
    ></calcite-icon>
    <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
    <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
  </calcite-list-item>
</calcite-list>
```

### Basic

```html
<calcite-list>
  <calcite-list-item label="Bananas" description="A banana is an elongated, edible fruit.">
    <calcite-action icon="banana" label="Banana button start" slot="actions-start"></calcite-action>
    <calcite-icon icon="banana" slot="content-start"></calcite-icon>
    <div slot="content-start">Start content</div>
    <div slot="content-end">End content</div>
    <calcite-icon icon="banana" slot="content-end"></calcite-icon>
    <calcite-action icon="banana" label="Banana button end" slot="actions-end"></calcite-action>
  </calcite-list-item>
  <calcite-list-item label="Hi!" description="hello world"></calcite-list-item>
  <calcite-list-item label="Hi!" description="hello world"></calcite-list-item>
</calcite-list>
```

## Slots

| Slot | Description                                     |
| ---- | ----------------------------------------------- |
|      | A slot for adding `calcite-list-item` elements. |

---

_Built with [StencilJS](https://stenciljs.com/)_
