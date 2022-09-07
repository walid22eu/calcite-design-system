import { number, select, text } from "@storybook/addon-knobs";
import { boolean, storyFilters } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import readme from "./readme.md";
import { html } from "../../../support/formatting";
import { defaultMenuPlacement, menuPlacements } from "../../utils/floating-ui";

export default {
  title: "Components/Controls/Time/Input Time Picker",
  parameters: {
    notes: readme
  },
  ...storyFilters()
};

export const simple = (): string => html`
  <calcite-input-time-picker
    ${boolean("disabled", false)}
    ${boolean("hidden", false)}
    name="${text("name", "simple")}"
    placement="${select("placement", menuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    step="${number("step", 1)}"
    value="${text("value", "10:37")}"
  >
  </calcite-input-time-picker>
`;

export const disabled_TestOnly = (): string => html`<calcite-input-time-picker disabled></calcite-input-time-picker>`;

export const darkThemeRTL_TestOnly = (): string => html`
  <calcite-input-time-picker
    ${boolean("disabled", false)}
    ${boolean("hidden", false)}
    class="calcite-theme-dark"
    name="${text("name", "dark")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    step="${number("step", 1)}"
    value="${text("value", "22:37")}"
  >
  </calcite-input-time-picker>
`;

darkThemeRTL_TestOnly.parameters = { themes: themesDarkDefault };

export const open_TestOnly = (): string => html`
  <calcite-input-time-picker
    name="${text("name", "placement-top")}"
    value="${text("value", "10:37")}"
    ${boolean("open", true)}
  >
  </calcite-input-time-picker>
`;

export const koreanLocale_TestOnly = (): string => html`
  <calcite-input-time-picker
    id="reference-element"
    ${boolean("disabled", false)}
    ${boolean("hidden", false)}
    name="${text("name", "light")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    step="${number("step", 1)}"
    value="${text("value", "10:37")}"
    lang="ko"
    open
  >
  </calcite-input-time-picker>
`;

export const arabicLocale_TestOnly = (): string => html`
  <calcite-input-time-picker
    id="reference-element"
    ${boolean("disabled", false)}
    ${boolean("hidden", false)}
    name="${text("name", "light")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    step="${number("step", 1)}"
    value="${text("value", "10:37")}"
    lang="ar"
    dir="rtl"
    open
  >
  </calcite-input-time-picker>
`;
