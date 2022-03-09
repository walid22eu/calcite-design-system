import { select } from "@storybook/addon-knobs";
import { boolean } from "../../../.storybook/helpers";
import readme from "./readme.md";
import { html } from "../../../support/formatting";
import { themesDarkDefault } from "../../../.storybook/utils";

export default {
  title: "Components/Controls/Switch",

  parameters: {
    notes: readme
  }
};

export const Simple = (): string => html`
  <calcite-switch
    name="setting"
    value="enabled"
    ${boolean("checked", true)}
    ${boolean("disabled", false)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
  ></calcite-switch>
`;

export const WrappingCalciteLabel = (): string => html`
  <calcite-label
    layout="${select("layout", ["inline", "inline-space-between", "default"], "inline")}"
    ${boolean("disabled", false)}
  >
    Enable setting
    <calcite-switch
      name="setting"
      value="enabled"
      ${boolean("checked", true)}
      ${boolean("disabled", false)}
    ></calcite-switch>
  </calcite-label>
`;

WrappingCalciteLabel.storyName = "Wrapping calcite-label";

export const DarkMode = (): string => html`
  <calcite-switch
    class="calcite-theme-dark"
    name="setting"
    value="enabled"
    ${boolean("checked", true)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
  ></calcite-switch>
`;

DarkMode.storyName = "Dark mode";
DarkMode.parameters = { themes: themesDarkDefault };

export const Rtl = (): string => html`
  Enable setting
  <calcite-switch
    dir="rtl"
    name="setting"
    value="enabled"
    ${boolean("checked", true)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
  ></calcite-switch>
`;

Rtl.storyName = "RTL";

export const disabled = (): string => html`<calcite-switch disabled checked></calcite-switch>`;
