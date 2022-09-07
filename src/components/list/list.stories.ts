import { placeholderImage, themesDarkDefault } from "../../../.storybook/utils";
import readme from "./readme.md";
import itemReadme from "../list-item/readme.md";
import groupReadme from "../list-item-group/readme.md";
import { html } from "../../../support/formatting";
import { storyFilters } from "../../../.storybook/helpers";

export default {
  title: "Components/List",
  parameters: {
    notes: [readme, itemReadme, groupReadme]
  },
  ...storyFilters()
};

const thumbnailImage = placeholderImage({ width: 44, height: 44 });

export const simple = (): string => html`
  <calcite-list>
    <calcite-list-item
      label="Cras iaculis ultricies nulla."
      description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
    ></calcite-list-item>
    <calcite-list-item
      label="Ut aliquam sollicitudin leo."
      description="Aliquam tincidunt mauris eu risus."
    ></calcite-list-item>
    <calcite-list-item
      label="Vestibulum commodo felis quis tortor.
    "
      description="Vestibulum auctor dapibus neque.
    "
    ></calcite-list-item>
  </calcite-list>
`;

export const onlyLabelVersusOnlyDescription_TestOnly = (): string => html`
  <calcite-list>
    <calcite-list-item label="This has no description."> </calcite-list-item>
  </calcite-list>
  <calcite-list>
    <calcite-list-item description="This has no label."> </calcite-list-item>
  </calcite-list>
`;

export const nestedListItemsAndGroupItems = (): string => html`
  <calcite-list>
    <calcite-list-item
      label="Cras iaculis ultricies nulla."
      description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
    >
      <calcite-list-item label="Ut aliquam sollicitudin leo." description="Aliquam tincidunt mauris eu risus.">
        <calcite-list-item
          label="Vestibulum commodo felis quis tortor."
          description="Vestibulum auctor dapibus neque."
        ></calcite-list-item></calcite-list-item
    ></calcite-list-item>
  </calcite-list>
  <calcite-list>
    <calcite-list-item-group heading="Digits">
      <calcite-list-item
        label="One"
        description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
      ></calcite-list-item>
      <calcite-list-item label="Two" description="Aliquam tincidunt mauris eu risus."></calcite-list-item>
      <calcite-list-item label="Three" description="Vestibulum auctor dapibus neque."></calcite-list-item>
    </calcite-list-item-group>
    <calcite-list-item-group heading="Letters">
      <calcite-list-item
        label="A"
        description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
      ></calcite-list-item>
      <calcite-list-item label="B" description="Aliquam tincidunt mauris eu risus."></calcite-list-item>
      <calcite-list-item
        label="C"
        description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
      ></calcite-list-item>
    </calcite-list-item-group>
  </calcite-list>
`;

export const startAndEndContentSlots = (): string => html`<calcite-list>
  <calcite-list-item>
    <calcite-action slot="actions-end" icon="ellipsis"> </calcite-action>
    <calcite-icon icon="layers" scale="m" slot="content-start"></calcite-icon>
    <span slot="content-start">Some value or something and a <b>thing</b>.</span>
    <div slot="content-end" style="display: flex; justify-content: flex-end">
      <calcite-chip class="list-chip" icon="ribbon-rosette" scale="s">Review</calcite-chip>
      <calcite-chip class="list-chip" icon="globe" scale="s" color="green">Good</calcite-chip>
    </div>
  </calcite-list-item>
  <calcite-list-item>
    <calcite-action slot="actions-end" icon="ellipsis"> </calcite-action>
    <calcite-icon icon="user" scale="m" slot="content-start"></calcite-icon>
    <span slot="content-start">Some value or something and a <b>thing</b>.</span>
    <div slot="content-end" style="display: flex; justify-content: flex-end">
      <calcite-chip class="list-chip" icon="globe" scale="s" color="green">Good</calcite-chip>
    </div>
  </calcite-list-item>
  <calcite-list-item>
    <calcite-action slot="actions-end" icon="ellipsis"> </calcite-action>
    <calcite-icon icon="user" scale="m" slot="content-start"></calcite-icon>
    <span slot="content-start">Some value or something and a <b>thing</b>.</span>
    <div slot="content-end" style="display: flex; justify-content: flex-end">
      <calcite-chip class="list-chip" icon="bell" color="red" scale="s">Halp!</calcite-chip>
    </div>
  </calcite-list-item>
</calcite-list> `;

export const richContent = (): string => html`
  <calcite-list>
    <calcite-list-item label="Princess Bubblegum" description="Ruler of The Candy Kingdom">
      <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
      <calcite-icon scale="l" icon="effects" slot="content-start"></calcite-icon>
      <calcite-avatar scale="l" slot="content-start" thumbnail="${thumbnailImage}"></calcite-avatar>
      <calcite-icon scale="s" icon="check" slot="content-end" style="color: var(--calcite-ui-success)"></calcite-icon>
      <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
      <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
    </calcite-list-item>
    <calcite-list-item label="Finn Mertens" description="Part owner of the Tree House">
      <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
      <calcite-icon scale="l" icon="running" slot="content-start"></calcite-icon>
      <calcite-avatar scale="l" slot="content-start" thumbnail="${thumbnailImage}"></calcite-avatar>
      <calcite-icon scale="s" icon="check" slot="content-end" style="color: var(--calcite-ui-success)"></calcite-icon>
      <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
      <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
    </calcite-list-item>
    <calcite-list-item label="Jake T. Dog" description="Part owner of the Tree House">
      <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
      <calcite-icon scale="l" icon="walking" slot="content-start"></calcite-icon>
      <calcite-avatar scale="l" slot="content-start" thumbnail="${thumbnailImage}"></calcite-avatar>
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
`;

export const darkThemeRTL_TestOnly = (): string => html`
  <calcite-list class="calcite-theme-dark" dir="rtl">
    <calcite-list-item label="Princess Bubblegum" description="Ruler of The Candy Kingdom">
      <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
      <calcite-icon scale="l" icon="effects" slot="content-start"></calcite-icon>
      <calcite-avatar scale="l" slot="content-start" thumbnail="${thumbnailImage}"></calcite-avatar>
      <calcite-icon scale="s" icon="check" slot="content-end" style="color: var(--calcite-ui-success)"></calcite-icon>
      <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
      <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
    </calcite-list-item>
    <calcite-list-item label="Finn Mertens" description="Part owner of the Tree House">
      <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
      <calcite-icon scale="l" icon="running" slot="content-start"></calcite-icon>
      <calcite-avatar scale="l" slot="content-start" thumbnail="${thumbnailImage}"></calcite-avatar>
      <calcite-icon scale="s" icon="check" slot="content-end" style="color: var(--calcite-ui-success)"></calcite-icon>
      <calcite-action icon="ellipsis" label="menu" slot="actions-end"></calcite-action>
      <calcite-action icon="x" label="remove" slot="actions-end"></calcite-action>
    </calcite-list-item>
    <calcite-list-item label="Jake T. Dog" description="Part owner of the Tree House">
      <calcite-action icon="drag" label="drag" scale="s" slot="actions-start"></calcite-action>
      <calcite-icon scale="l" icon="walking" slot="content-start"></calcite-icon>
      <calcite-avatar scale="l" slot="content-start" thumbnail="${thumbnailImage}"></calcite-avatar>
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
`;

darkThemeRTL_TestOnly.parameters = { themes: themesDarkDefault };

export const disabled_TestOnly = (): string => html`<calcite-list disabled>
  <calcite-list-item
    label="Cras iaculis ultricies nulla."
    description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
  ></calcite-list-item>
  <calcite-list-item
    disabled
    label="Ut aliquam sollicitudin leo."
    description="Aliquam tincidunt mauris eu risus."
  ></calcite-list-item>
  <calcite-list-item
    label="Vestibulum commodo felis quis tortor.
    "
    description="Vestibulum auctor dapibus neque.
    "
  ></calcite-list-item>
</calcite-list>`;
