import { boolean, select, text } from "@storybook/addon-knobs";
import { createBreakpointStories, modesDarkDefault } from "../../../.storybook/utils";
import readme from "./readme.md";
import { html } from "../../../support/formatting";
import { locales } from "../../utils/locale";
import { defaultMenuPlacement, menuPlacements } from "../../utils/floating-ui";
import { iconNames, storyFilters } from "../../../.storybook/helpers";

export default {
  title: "Components/Controls/InputDatePicker",
  parameters: {
    notes: readme,
  },
  ...storyFilters(),
};

export const simple = (): string => html`
  <div style="width: 400px">
    <calcite-input-date-picker
      scale="${select("scale", ["s", "m", "l"], "m")}"
      status="${select("status", ["idle", "invalid", "valid"], "idle")}"
      value="${text("value", "2020-12-12")}"
      min="${text("min", "2016-08-09")}"
      max="${text("max", "2023-12-18")}"
      lang="${select("locale", locales, "en")}"
      placement="${select("placement", menuPlacements, defaultMenuPlacement)}"
      validation-message="${text("validation-message", "")}"
      validation-icon="${select("validation-icon", ["", ...iconNames], "")}"
    ></calcite-input-date-picker
  </div>
`;

export const range = (): string => html`
  <div style="width: 400px">
    <calcite-input-date-picker
      scale="${select("scale", ["s", "m", "l"], "m")}"
      status="${select("status", ["idle", "invalid", "valid"], "idle")}"
      min="${text("min", "2016-08-09")}"
      max="${text("max", "2023-12-18")}"
      lang="${select("locale", locales, "en")}"
      next-month-label="${text("next-month-label", "Next month")}"
      prev-month-label="${text("prev-month-label", "Previous month")}"
      range="${boolean("range", true)}"
      layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
      validation-message="${text("validation-message", "")}"
      validation-icon="${select("validation-icon", ["", ...iconNames], "")}"
    ></calcite-input-date-picker>
  </div>
`;

export const disabled_TestOnly = (): string => html`<calcite-input-date-picker disabled></calcite-input-date-picker>`;

export const flipPlacements_TestOnly = (): string => html`
  <style>
    .my-input-date-picker-div {
      margin-top: 50px;
    }

    .my-input-date-picker {
      position: unset;
    }
  </style>
  <div style="height: 100px; overflow:scroll;">
    <div class="my-input-date-picker-div">
      <calcite-input-date-picker open class="my-input-date-picker" value="2020-02-12"></calcite-input-date-picker>
    </div>
  </div>
  <script>
    document.querySelector(".my-input-date-picker").flipPlacements = ["right"];
  </script>
`;

export const mediumIconForLargeInput_TestOnly = (): string => html`
  <div style="width: 400px">
    <calcite-input-date-picker
      open
      value="1/1/1"
      lang="zh-CN"
      scale="l"
      start="2020-12-12"
      end="2020-12-16"
      range=""
      layout="horizontal"
    ></calcite-input-date-picker>
  </div>
`;

export const readOnlyHasNoDropdownAffordance_TestOnly = (): string => html`
  <div style="width: 400px">
    <calcite-input-date-picker read-only value="2020-12-12"></calcite-input-date-picker>
  </div>
`;

export const validationMessageAllScales_TestOnly = (): string => html`
  <style>
    .container {
      display: flex;
      flex-direction: column;
      width: 400px;
      height: 200px;
      gap: 20px;
    }
  </style>
  <div class="container">
    <calcite-input-date-picker
      scale="s"
      status="invalid"
      value="2020-12-12"
      validation-message="Choose a more recent date"
      validation-icon
    ></calcite-input-date-picker>
    <calcite-input-date-picker
      scale="m"
      status="invalid"
      value="2020-12-12"
      validation-message="Choose a more recent date"
      validation-icon
    ></calcite-input-date-picker>
    <calcite-input-date-picker
      scale="l"
      status="invalid"
      value="2020-12-12"
      validation-message="Choose a more recent date"
      validation-icon
    ></calcite-input-date-picker>
  </div>
`;

export const scales_TestOnly = (): string => html`
  <style>
    .container {
      display: flex;
      flex-direction: column;
      width: 1400px;
      height: 1200px;
      gap: 400px;
    }

    .use-case {
      display: flex;
      gap: 100px;
    }
  </style>
  <div class="container">
    <div class="use-case">
      <calcite-input-date-picker scale="s" icon open value="2020-12-12"></calcite-input-date-picker>
      <calcite-input-date-picker scale="m" icon open value="2020-12-12"></calcite-input-date-picker>
      <calcite-input-date-picker scale="l" icon open value="2020-12-12"></calcite-input-date-picker>
    </div>
    <div class="use-case">
      <calcite-input-date-picker
        scale="s"
        open
        start="2020-12-12"
        end="2020-12-16"
        range
        layout="horizontal"
        value="2020-12-12"
      ></calcite-input-date-picker>
      <calcite-input-date-picker
        scale="m"
        open
        start="2020-12-12"
        end="2020-12-16"
        range
        layout="horizontal"
        value="2020-12-12"
      ></calcite-input-date-picker>
      <calcite-input-date-picker
        scale="l"
        open
        start="2020-12-12"
        end="2020-12-16"
        range
        layout="horizontal"
        value="2020-12-12"
      ></calcite-input-date-picker>
    </div>
  </div>
`;

export const arabicLocaleDarkModeRTL_TestOnly = (): string => html`
  <div style="width: 400px">
    <calcite-input-date-picker
      class="calcite-mode-dark"
      dir="rtl"
      value="2020-12-12"
      numbering-system="arab"
      lang="ar"
      validation-message="This should not appear because the status is not 'invalid'"
    ></calcite-input-date-picker
  </div>
`;
arabicLocaleDarkModeRTL_TestOnly.parameters = { modes: modesDarkDefault };

export const widthSetToBreakpoints_TestOnly = (): string =>
  createBreakpointStories(
    html`<calcite-input-date-picker scale="{scale}" value="2020-12-12"></calcite-input-date-picker>`,
  );
