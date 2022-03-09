import { text, select } from "@storybook/addon-knobs";
import { boolean } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import * as icons from "../../../node_modules/@esri/calcite-ui-icons";
import readme from "./readme.md";
import { html } from "../../../support/formatting";

// we can get all unique icon names from all size 16 non-filled icons.
const iconNames = Object.keys(icons)
  .filter((iconName) => iconName.endsWith("16"))
  .map((iconName) => iconName.replace("16", ""));

export default {
  title: "Components/Link",

  parameters: {
    notes: readme
  }
};

export const Simple = (): string => html`
  <div
    style="font-size: ${select(
      "containing font size",
      ["12", "14", "16", "18", "20", "24", "32"],
      "16"
    )}px; font-weight: ${select("containing font weight", ["300", "400", "500", "700"], "400")};"
  >
    Some wrapping text
    <calcite-link href="${text("href", "")}" ${boolean("disabled", false)}>
      ${text("text", "link text here")}</calcite-link
    >
    around the link
  </div>
`;

export const WithIconStart = (): string => html`
  <div
    style="font-size: ${select(
      "containing font size",
      ["12", "14", "16", "18", "20", "24", "32"],
      "16"
    )}px; font-weight: ${select("containing font weight", ["300", "400", "500", "700"], "400")};"
  >
    Some wrapping text
    <calcite-link
      href="${text("href", "")}"
      ${boolean("disabled", false)}
      icon-start="${select("icon-start", iconNames, iconNames[0])}"
    >
      ${text("text", "link text here")}</calcite-link
    >
    around the link
  </div>
`;

WithIconStart.storyName = "With icon-start";

export const WithIconEnd = (): string => html`
  <div
    style="font-size: ${select(
      "containing font size",
      ["12", "14", "16", "18", "20", "24", "32"],
      "16"
    )}px; font-weight: ${select("containing font weight", ["300", "400", "500", "700"], "400")};"
  >
    Some wrapping text
    <calcite-link
      href="${text("href", "")}"
      ${boolean("disabled", false)}
      icon-end="${select("icon-end", iconNames, iconNames[0])}"
    >
      ${text("text", "link text here")}</calcite-link
    >
    around the link
  </div>
`;

WithIconEnd.storyName = "With icon-end";

export const WithIconStartAndIconEnd = (): string => html`
  <div
    style="font-size: ${select(
      "containing font size",
      ["12", "14", "16", "18", "20", "24", "32"],
      "16"
    )}px; font-weight: ${select("containing font weight", ["300", "400", "500", "700"], "400")};"
  >
    Some wrapping text
    <calcite-link
      href="${text("href", "")}"
      ${boolean("disabled", false)}
      icon-start="${select("icon-start", iconNames, iconNames[0])}"
      icon-end="${select("icon-end", iconNames, iconNames[0])}"
    >
      ${text("text", "link text here")}</calcite-link
    >
    around the link
  </div>
`;

WithIconStartAndIconEnd.storyName = "With icon-start and icon-end";

export const DarkMode = (): string => html`
  <div
    class="calcite-theme-dark"
    style="color: white; font-size: ${select(
      "containing font size",
      ["12", "14", "16", "18", "20", "24", "32"],
      "16"
    )}px; font-weight: ${select("containing font weight", ["300", "400", "500", "700"], "400")};"
  >
    Some wrapping text
    <calcite-link class="calcite-theme-dark" href="${text("href", "")}" ${boolean("disabled", false)}
      >${text("text", "link text here")}</calcite-link
    >
    around the link
  </div>
`;

DarkMode.storyName = "Dark mode";
DarkMode.parameters = { themes: themesDarkDefault };

export const WithIconStartAndIconEndRTL = (): string => html`
  <div
    style="font-size: ${select(
      "containing font size",
      ["12", "14", "16", "18", "20", "24", "32"],
      "16"
    )}px; font-weight: ${select("containing font weight", ["300", "400", "500", "700"], "400")};"
  >
    Some wrapping text
    <calcite-link
      dir="rtl"
      href="${text("href", "")}"
      ${boolean("disabled", false)}
      icon-start="${select("icon-start", iconNames, iconNames[0])}"
      icon-end="${select("icon-end", iconNames, iconNames[1])}"
    >
      ${text("text", "link text here")}</calcite-link
    >
    around the link
  </div>
`;

export const disabled = (): string => html`<calcite-link disabled>disabled</calcite-link`;
