import { storiesOf } from "@storybook/html";
import { withKnobs, text, select, boolean } from "@storybook/addon-knobs";
import { darkBackground, parseReadme } from "../../../.storybook/helpers";
import * as icons from "../../../node_modules/@esri/calcite-ui-icons";
import readme from "./readme.md";

const notes = parseReadme(readme);

const iconNames = Object.keys(icons)
  .filter(iconName => iconName.endsWith("16"))
  .map(iconName => iconName.replace("16", ""));

storiesOf("Button with Dropdown", module)
  .addDecorator(withKnobs)
  .add(
    "Simple",
    () => `
    <calcite-button-with-dropdown
        color="${select("color", ["blue", "red", "dark", "light"], "blue")}"
        scale="${select("size", ["xs", "s", "m", "l", "xl"], "m")}"
        loading="${boolean("loading", false)}"
        disabled="${boolean("disabled", false)}"
        primary-icon="${select("primary-icon", iconNames, iconNames[0])}"
        primary-text="${text("primary-text", "Primary Option")}"
        dropdown-label="${text("dropdown-label", "Additional Options")}">
      <calcite-dropdown-group selection-mode="none">
        <calcite-dropdown-item>Option 2</calcite-dropdown-item>
        <calcite-dropdown-item>Option 3</calcite-dropdown-item>
        <calcite-dropdown-item>Option 4</calcite-dropdown-item>
      </calcite-dropdown-group>
    </calcite-button-with-dropdown>
  `,
    { notes }
  )
  .add(
    "RTL",
    () => `
    <div dir='rtl'>
      <calcite-button-with-dropdown
          color="${select("color", ["blue", "red", "dark", "light"], "blue")}"
          scale="${select("size", ["xs", "s", "m", "l", "xl"], "m")}"
          loading="${boolean("loading", false)}"
          disabled="${boolean("disabled", false)}"
          primary-icon="${select("primary-icon", iconNames, iconNames[0])}"
          primary-text="${text("primary-text", "Primary Option")}"
          dropdown-label="${text("dropdown-label", "Additional Options")}">
        <calcite-dropdown-group selection-mode="none">
          <calcite-dropdown-item>Option 2</calcite-dropdown-item>
          <calcite-dropdown-item>Option 3</calcite-dropdown-item>
          <calcite-dropdown-item>Option 4</calcite-dropdown-item>
        </calcite-dropdown-group>
      </calcite-button-with-dropdown>
    </div>
  `,
    { notes }
  )
  .add(
    "Dark mode",
    () => `
    <calcite-button-with-dropdown
        color="${select("color", ["blue", "red", "dark", "light"], "blue")}"
        scale="${select("size", ["xs", "s", "m", "l", "xl"], "m")}"
        loading="${boolean("loading", false)}"
        disabled="${boolean("disabled", false)}"
        primary-icon="${select("primary-icon", iconNames, iconNames[0])}"
        primary-text="${text("primary-text", "Primary Option")}"
        dropdown-label="${text("dropdown-label", "Additional Options")}"
        theme="dark">
      <calcite-dropdown-group selection-mode="none">
        <calcite-dropdown-item>Option 2</calcite-dropdown-item>
        <calcite-dropdown-item>Option 3</calcite-dropdown-item>
        <calcite-dropdown-item>Option 4</calcite-dropdown-item>
      </calcite-dropdown-group>
    </calcite-button-with-dropdown>
  `,
    { notes, backgrounds: darkBackground }
  )
  .add(
    "No primary text",
    () => `
    <calcite-button-with-dropdown
        color="${select("color", ["blue", "red", "dark", "light"], "blue")}"
        scale="${select("size", ["xs", "s", "m", "l", "xl"], "m")}"
        loading="${boolean("loading", false)}"
        disabled="${boolean("disabled", false)}"
        primary-icon="${select("primary-icon", iconNames, iconNames[0])}"
        dropdown-label="${text("dropdown-label", "Additional Options")}">
      <calcite-dropdown-group selection-mode="none">
        <calcite-dropdown-item>Option 2</calcite-dropdown-item>
        <calcite-dropdown-item>Option 3</calcite-dropdown-item>
        <calcite-dropdown-item>Option 4</calcite-dropdown-item>
      </calcite-dropdown-group>
    </calcite-button-with-dropdown>
  `,
    { notes }
  )
