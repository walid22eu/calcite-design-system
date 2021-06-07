import { select, number } from "@storybook/addon-knobs";
import { boolean } from "../../../.storybook/helpers";
import readme from "./readme.md";

const placements = [
  "auto",
  "auto-start",
  "auto-end",
  "top-start",
  "top-end",
  "bottom-start",
  "bottom-end",
  "right-start",
  "right-end",
  "left-start",
  "left-end"
];

const calcite_placements = placements.concat([
  "leading-start",
  "leading",
  "leading-end",
  "trailing-end",
  "trailing",
  "trailing-start"
]);

const contentHTML = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`;

const referenceElementHTML = `<calcite-tooltip-manager>Ut enim ad minim veniam, quis <calcite-button appearance="inline" title="Reference element" id="reference-element">nostrud exercitation</calcite-button> ullamco laboris nisi ut aliquip ex ea commodo consequat.</calcite-tooltip-manager>`;

export default {
  title: "Components/Tooltip",

  parameters: {
    notes: readme
  }
};

export const Simple = (): string => {
  return `
      <div>
        ${referenceElementHTML}
        <calcite-tooltip
        class="calcite-theme-light"
          reference-element="reference-element"
          placement="${select("placement", calcite_placements, "auto")}"
          offset-distance="${number("offset-distance", 6)}"
          offset-skidding="${number("offset-skidding", 0)}"
          ${boolean("open", true)}
        >
          ${contentHTML}
        </calcite-tooltip>
      </div>
    `;
};

export const RTL = (): string => {
  return `
      <div dir="rtl">
        ${referenceElementHTML}
        <calcite-tooltip
          reference-element="reference-element"
          placement="${select("placement", calcite_placements, "auto")}"
          offset-distance="${number("offset-distance", 6)}"
          offset-skidding="${number("offset-skidding", 0)}"
          ${boolean("open", true)}
        >
          ${contentHTML}
        </calcite-tooltip>
      </div>
    `;
};

export const DarkMode = (): string => {
  return `
      <div>
        ${referenceElementHTML}
        <calcite-tooltip
        class="calcite-theme-dark"
          reference-element="reference-element"
          placement="${select("placement", calcite_placements, "auto")}"
          offset-distance="${number("offset-distance", 6)}"
          offset-skidding="${number("offset-skidding", 0)}"
          ${boolean("open", true)}
        >
          ${contentHTML}
        </calcite-tooltip>
      </div>
    `;
};
