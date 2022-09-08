import { select, number } from "@storybook/addon-knobs";
import readme from "./readme.md";
import { html } from "../../../support/formatting";
import { boolean, storyFilters } from "../../../.storybook/helpers";
import { placements } from "../../utils/floating-ui";
import { themesDarkDefault } from "../../../.storybook/utils";

const contentHTML = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`;

const referenceElementHTML = `Ut enim ad minim veniam, quis <calcite-button appearance="transparent" color="neutral" title="Reference element" id="reference-element">nostrud exercitation</calcite-button> ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

export default {
  title: "Components/Tooltip",
  parameters: {
    notes: readme
  },
  ...storyFilters()
};

export const simple = (): string => html`
  <div style="width: 400px;">
    ${referenceElementHTML}
    <calcite-tooltip
      reference-element="reference-element"
      placement="${select("placement", placements, "auto")}"
      offset-distance="${number("offset-distance", 6)}"
      offset-skidding="${number("offset-skidding", 0)}"
      ${boolean("open", false)}
    >
      ${contentHTML}
    </calcite-tooltip>
  </div>
`;

export const open_TestOnly = (): string => html`
  <div style="width: 400px;">
    ${referenceElementHTML}
    <calcite-tooltip
      reference-element="reference-element"
      placement="${select("placement", placements, "auto")}"
      offset-distance="${number("offset-distance", 6)}"
      offset-skidding="${number("offset-skidding", 0)}"
      ${boolean("open", true)}
    >
      ${contentHTML}
    </calcite-tooltip>
  </div>
`;

export const darkThemeRTL_TestOnly = (): string => html`
  <div style="width: 400px;">
    ${referenceElementHTML}
    <calcite-tooltip
      class="calcite-theme-dark"
      dir="rtl"
      reference-element="reference-element"
      placement="${select("placement", placements, "auto")}"
      offset-distance="${number("offset-distance", 6)}"
      offset-skidding="${number("offset-skidding", 0)}"
      ${boolean("open", false)}
    >
      ${contentHTML}
    </calcite-tooltip>
  </div>
`;

darkThemeRTL_TestOnly.parameters = { themes: themesDarkDefault };
