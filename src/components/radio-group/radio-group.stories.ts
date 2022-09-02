import { select } from "@storybook/addon-knobs";
import { boolean } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import readme1 from "./readme.md";
import readme2 from "../radio-group-item/readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Controls/Radio/Radio Group",

  parameters: {
    notes: [readme1, readme2]
  }
};

export const Simple = (): string => html`
  <calcite-radio-group
    layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
    appearance="${select("appearance", ["solid", "outline"], "solid")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["auto", "full"], "auto")}"
    ${boolean("disabled", false)}
  >
    <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
    <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
    <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
    <calcite-radio-group-item value="vue">Vue</calcite-radio-group-item>
  </calcite-radio-group>
`;

export const WrappingCalciteLabel = (): string => html`
  <calcite-label scale="${select("scale", ["s", "m", "l"], "m")}">
    My great radio group
    <calcite-radio-group
      layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
      appearance="${select("appearance", ["solid", "outline"], "solid")}"
      width="${select("width", ["auto", "full"], "auto")}"
      ${boolean("disabled", false)}
    >
      <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
      <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
      <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
      <calcite-radio-group-item value="vue">Vue</calcite-radio-group-item>
    </calcite-radio-group>
  </calcite-label>
`;

export const WithIcons = (): string => html`
  <calcite-label scale="${select("scale", ["s", "m", "l"], "m")}">
    My great radio group
    <calcite-radio-group
      layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
      appearance="${select("appearance", ["solid", "outline"], "solid")}"
      width="${select("width", ["auto", "full"], "auto")}"
      ${boolean("disabled", false)}
    >
      <calcite-radio-group-item icon="car" value="car" checked>Car</calcite-radio-group-item>
      <calcite-radio-group-item icon="plane" value="plane">Plane</calcite-radio-group-item>
      <calcite-radio-group-item icon="biking" value="bicycle">Bicycle</calcite-radio-group-item>
    </calcite-radio-group>
  </calcite-label>
`;

WithIcons.storyName = "With icons";

export const DarkMode = (): string => html`
  <calcite-radio-group
    class="calcite-theme-dark"
    layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
    appearance="${select("appearance", ["solid", "outline"], "solid")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["auto", "full"], "auto")}"
    ${boolean("disabled", false)}
  >
    <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
    <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
    <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
    <calcite-radio-group-item value="vue">Vue</calcite-radio-group-item>
  </calcite-radio-group>
`;

DarkMode.storyName = "Dark mode";
DarkMode.parameters = { themes: themesDarkDefault };

export const FullWidth = (): string => html`
  <div style="width:33vw;">
    <calcite-radio-group
      layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
      appearance="${select("appearance", ["solid", "outline"], "solid")}"
      width="${select("width", ["auto", "full"], "full")}"
      ${boolean("disabled", false)}
    >
      <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
      <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
      <calcite-radio-group-item value="long-text-1">Longer text wraps.</calcite-radio-group-item>
      <calcite-radio-group-item value="long-text-2">Longer text wraps.</calcite-radio-group-item>
    </calcite-radio-group>
  </div>
`;

FullWidth.storyName = "Full width";

export const RTL = (): string => html`
  <calcite-radio-group
    dir="rtl"
    layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
    appearance="${select("appearance", ["solid", "outline"], "solid")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["auto", "full"], "auto")}"
    ${boolean("disabled", false)}
  >
    <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
    <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
    <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
    <calcite-radio-group-item value="vue">Vue</calcite-radio-group-item>
  </calcite-radio-group>
`;

export const disabled = (): string => html`<calcite-radio-group disabled>
  <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
  <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
  <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
  <calcite-radio-group-item value="vue">Vue</calcite-radio-group-item>
</calcite-radio-group>`;

export const WithIconStartAndEnd = (): string => html` <calcite-radio-group scale="s">
  <calcite-radio-group-item icon-start="car" icon-end="car" value="car" checked icon="plane" icon-positon="end"
    >Car</calcite-radio-group-item
  >
  <calcite-radio-group-item icon-end="plane" value="plane" icon="banana" icon-positon="start"
    >Plane</calcite-radio-group-item
  >
  <calcite-radio-group-item icon-start="biking" icon-end="biking" value="bicycle" icon="car" icon-positon="start"
    >Bicycle</calcite-radio-group-item
  >
  <calcite-radio-group-item value="nothing">Nothing</calcite-radio-group-item>
</calcite-radio-group>`;
