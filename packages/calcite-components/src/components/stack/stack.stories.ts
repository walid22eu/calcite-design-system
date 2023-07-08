import { modesDarkDefault } from "../../../.storybook/utils";
import { placeholderImage } from "../../../.storybook/placeholderImage";
import readme from "./readme.md";
import { html } from "../../../support/formatting";
import { storyFilters } from "../../../.storybook/helpers";

export default {
  title: "Components/Support/Stack",
  parameters: {
    notes: [readme]
  },
  ...storyFilters()
};

const thumbnailImage = placeholderImage({ width: 44, height: 44 });

const simpleHTML = html`<calcite-stack>
  <calcite-action appearance="transparent" text="banana" icon="banana" slot="actions-start"></calcite-action>
  Hello World
  <calcite-avatar slot="content-end" thumbnail="${thumbnailImage}" scale="s"> </calcite-avatar>
  <calcite-chip slot="content-start" value="chip" scale="s" appearance="outline">My great chip</calcite-chip>
  <calcite-action appearance="transparent" text="Close" icon="x" slot="actions-end"></calcite-action>
</calcite-stack>`;

export const simple = (): string => simpleHTML;

export const simpleDarkMode_TestOnly = (): string => simpleHTML;
simpleDarkMode_TestOnly.parameters = { modes: modesDarkDefault };

export const disabled_TestOnly = (): string => html`<calcite-stack disabled>
  <calcite-action appearance="transparent" text="banana" icon="banana" slot="actions-start"></calcite-action>
  Hello World
  <calcite-avatar slot="content-end" thumbnail="${thumbnailImage}" scale="s"> </calcite-avatar>
  <calcite-chip slot="content-start" value="chip" scale="s" appearance="outline">My great chip</calcite-chip>
  <calcite-action appearance="transparent" text="Close" icon="x" slot="actions-end"></calcite-action>
</calcite-stack>`;

export const panelFooter_TestOnly = (): string => html`<calcite-panel>
  <div slot="header-content">My Panel</div>
  <p>My content</p>
  <calcite-stack slot="footer">
    <calcite-action text="select" icon="check" slot="actions-start"></calcite-action>
    <calcite-input disabled></calcite-input>
    <calcite-avatar slot="content-start" thumbnail="${thumbnailImage}" scale="s"> </calcite-avatar>
    <calcite-chip slot="content-end" value="chip" scale="s" appearance="outline">My great chip</calcite-chip>
    <calcite-action text="delete" icon="trash" slot="actions-end"></calcite-action>
  </calcite-stack>
</calcite-panel>`;
