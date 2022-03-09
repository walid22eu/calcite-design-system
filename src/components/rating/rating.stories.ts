import { number, select, text } from "@storybook/addon-knobs";
import { boolean } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import readme from "./readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Controls/Rating",

  parameters: {
    notes: readme
  }
};

export const Simple = (): string => html`
  <calcite-rating
    scale="${select("scale", ["s", "m", "l"], "m")}"
    value="${number("value", 0)}"
    ${boolean("show-chip", true)}
    average="${number("average", 4.4)}"
    count="${number("count", 10)}"
    ${boolean("read-only", false)}
    ${boolean("disabled", false)}
    intl-rating="${text("intl-rating", "Rating")}"
    intl-stars="${text("intl-rating", "Stars: ${num}")}"
  ></calcite-rating>
`;

export const DarkMode = (): string => html`
  <calcite-rating
    class="calcite-theme-dark"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    value="${number("value", 0)}"
    ${boolean("show-chip", true)}
    average="${number("average", 4.4)}"
    count="${number("count", 10)}"
    ${boolean("read-only", false)}
    ${boolean("disabled", false)}
    intl-rating="${text("intl-rating", "Rating")}"
    intl-stars="${text("intl-rating", "Stars: ${num}")}"
  ></calcite-rating>
`;

DarkMode.storyName = "Dark mode";
DarkMode.parameters = { themes: themesDarkDefault };

export const WrappedInCalciteLabel = (): string => html`
  <calcite-label layout="${select("input layout", ["default", "inline", "inline-space-between"], "default")}">
    Rate this!
    <calcite-rating
      scale="${select("scale", ["s", "m", "l"], "m")}"
      value="${number("value", 0)}"
      ${boolean("show-chip", false)}
      average="${number("average", 0)}"
      count="${number("count", 0)}"
      ${boolean("read-only", false)}
      ${boolean("disabled", false)}
      intl-rating="${text("intl-rating", "Rating")}"
      intl-stars="${text("intl-rating", "Stars: ${num}")}"
    ></calcite-rating>
  </calcite-label>
`;

WrappedInCalciteLabel.storyName = "Wrapped in calcite-label";

export const Rtl = (): string => html`
  <div dir="rtl">
    <calcite-rating
      scale="${select("scale", ["s", "m", "l"], "m")}"
      value="${number("value", 0)}"
      ${boolean("show-chip", true)}
      average="${number("average", 4.4)}"
      count="${number("count", 10)}"
      ${boolean("read-only", false)}
      ${boolean("disabled", false)}
      intl-rating="${text("intl-rating", "Rating")}"
      intl-stars="${text("intl-rating", "Stars: ${num}")}"
    ></calcite-rating>
  </div>
`;

Rtl.storyName = "RTL";

export const disabled = (): string => html`<calcite-rating disabled value="3"></calcite-rating>`;
