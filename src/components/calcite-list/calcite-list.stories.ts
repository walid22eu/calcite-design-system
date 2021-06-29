import { darkBackground } from "../../../.storybook/utils";
import readme from "./readme.md";
import { html } from "../../tests/utils";

export default {
  title: "Components/List",

  parameters: {
    notes: readme
  }
};

export const Simple = (): string => html`
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
`;

export const RTL = (): string => html`
  <calcite-list dir="rtl">
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
`;

export const DarkMode = (): string => html`
  <calcite-list class="calcite-theme-dark">
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
`;

DarkMode.story = {
  name: "Dark mode",
  parameters: { backgrounds: darkBackground }
};
