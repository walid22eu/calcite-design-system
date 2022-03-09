import { select } from "@storybook/addon-knobs";
import { iconNames, boolean } from "../../../.storybook/helpers";
import { placeholderImage, themesDarkDefault } from "../../../.storybook/utils";
import readme from "./readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Chip",

  parameters: {
    notes: readme
  }
};

export const Simple = (): string => html`
  <div style="background-color:white;padding:100px">
    <calcite-chip
      scale="${select("scale", ["s", "m", "l"], "m")}"
      appearance="${select("appearance", ["solid", "clear"], "solid")}"
      color="${select("color", ["blue", "red", "yellow", "green", "grey"], "grey")}"
      ${boolean("dismissible", false)}
      >My great chip</calcite-chip
    >
  </div>
`;

export const WithIcon = (): string => html`
  <div style="background-color:white;padding:100px">
    <calcite-chip
      icon="${select("icon", iconNames, iconNames[0])}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      appearance="${select("appearance", ["solid", "clear"], "solid")}"
      color="${select("color", ["blue", "red", "yellow", "green", "grey"], "grey")}"
      ${boolean("dismissible", false)}
    >
      My great chip</calcite-chip
    >
  </div>
`;

export const WithImage = (): string => html`
  <div style="background-color:white;padding:100px">
    <calcite-chip
      scale="${select("scale", ["s", "m", "l"], "m")}"
      appearance="${select("appearance", ["solid", "clear"], "solid")}"
      color="${select("color", ["blue", "red", "yellow", "green", "grey"], "grey")}"
      ${boolean("dismissible", false)}
    >
      <img alt="" slot="image" src="${placeholderImage({ width: 50, height: 50 })}" />
      My great chip</calcite-chip
    >
  </div>
`;

export const WithAvatar = (): string => {
  const scale = select("scale", ["s", "m", "l"], "m");

  return html`
    <div style="background-color:white;padding:100px">
      <calcite-chip
        scale="${scale}"
        appearance="${select("appearance", ["solid", "clear"], "solid")}"
        color="${select("color", ["blue", "red", "yellow", "green", "grey"], "grey")}"
        ${boolean("dismissible", false)}
      >
        <calcite-avatar
          slot="image"
          scale="${scale}"
          user-id="25684463a00c449585dbb32a065f6b74"
          full-name="user name"
        ></calcite-avatar>
        User Name
      </calcite-chip>
    </div>
  `;
};

export const DarkTheme = (): string => html`
  <div style="background-color:#2b2b2b;padding:100px">
    <calcite-chip
      class="calcite-theme-dark"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      appearance="${select("appearance", ["solid", "clear"], "solid")}"
      color="${select("color", ["blue", "red", "yellow", "green", "grey"], "grey")}"
      ${boolean("dismissible", false)}
      >My great chip</calcite-chip
    >
  </div>
`;

DarkTheme.storyName = "Dark theme";
DarkTheme.parameters = { themes: themesDarkDefault };

export const Rtl = (): string => html`
  <div style="background-color:white;padding:100px" dir="rtl">
    <calcite-chip
      icon="${select("icon", iconNames, iconNames[0])}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      appearance="${select("appearance", ["solid", "clear"], "solid")}"
      color="${select("color", ["blue", "red", "yellow", "green", "grey"], "grey")}"
      ${boolean("dismissible", false)}
      >My great chip</calcite-chip
    >
  </div>
`;

Rtl.storyName = "RTL";
