import { select, optionsKnob } from "@storybook/addon-knobs";
import { createSteps, iconNames, stepStory } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import readme1 from "./readme.md";
import readme2 from "../calcite-tab/readme.md";
import readme3 from "../calcite-tab-nav/readme.md";
import readme4 from "../calcite-tab-title/readme.md";
import { html, placeholderImage } from "../../tests/utils";

export default {
  title: "Components/Tabs",

  parameters: {
    notes: [readme1, readme2, readme3, readme4]
  }
};

export const Simple = stepStory(
  (): string => html`
    <calcite-tabs
      layout="${select("layout", ["inline", "center"], "inline")}"
      position="${select("position", ["above", "below"], "above")}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
    >
      <calcite-tab-nav slot="tab-nav">
        <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
        <calcite-tab-title id="reference-element">Tab 2 Title</calcite-tab-title>
        <calcite-tab-title>Tab 3 Title</calcite-tab-title>
        <calcite-tab-title>Tab 4 Title</calcite-tab-title>
      </calcite-tab-nav>

      <calcite-tab active>
        <p>Tab 1 Content</p><br />
      </calcite-tab>
      <calcite-tab><p>Tab 2 Content</p>
      <img src="${placeholderImage({
        width: 1000,
        height: 200
      })}"></img>
      </calcite-tab>
      <calcite-tab><p>Tab 3 Content</p></calcite-tab>
      <calcite-tab><p>Tab 4 Content</p></calcite-tab>
    </calcite-tabs>
  `,
  createSteps("calcite-tabs").snapshot("simple").click("#reference-element").snapshot("horizontal scroll")
);

// export const Simple = (): string => html`
//   <calcite-tabs
//     layout="${select("layout", ["inline", "center"], "inline")}"
//     position="${select("position", ["above", "below"], "above")}"
//     scale="${select("scale", ["s", "m", "l"], "m")}"
//   >
//     <calcite-tab-nav slot="tab-nav">
//       <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
//       <calcite-tab-title>Tab 2 Title</calcite-tab-title>
//       <calcite-tab-title>Tab 3 Title</calcite-tab-title>
//       <calcite-tab-title>Tab 4 Title</calcite-tab-title>
//     </calcite-tab-nav>

//     <calcite-tab active>
//       <p>Tab 1 Content</p><br />
//       <img src="${placeholderImage({
//         width: 1000,
//         height: 200
//       })}"></img>
//     </calcite-tab>
//     <calcite-tab><p>Tab 2 Content</p></calcite-tab>
//     <calcite-tab><p>Tab 3 Content</p></calcite-tab>
//     <calcite-tab><p>Tab 4 Content</p></calcite-tab>
//   </calcite-tabs>
// `;

export const Bordered = (): string => html`
  <calcite-tabs
    layout="inline"
    position="${select("position", ["above", "below"], "above")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    bordered
  >
    <calcite-tab-nav slot="tab-nav">
      <calcite-tab-title tab="tab1">Tab 1 Title</calcite-tab-title>
      <calcite-tab-title tab="tab2">Tab 2 Title</calcite-tab-title>
      <calcite-tab-title tab="tab3">Tab 3 Title</calcite-tab-title>
      <calcite-tab-title tab="tab4" active>Tab 4 Title</calcite-tab-title>
    </calcite-tab-nav>
    <calcite-tab tab="tab1">Tab 1 Content</calcite-tab>
    <calcite-tab tab="tab2">Tab 2 Content</calcite-tab>
    <calcite-tab tab="tab3">Tab 3 Content</calcite-tab>
    <calcite-tab tab="tab4" active>Tab 4 Content</calcite-tab>
  </calcite-tabs>
`;

export const BorderedRTLDark = (): string => html`
  <calcite-tabs
    layout="inline"
    position="${select("position", ["above", "below"], "above")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    bordered
    dir="rtl"
    class="calcite-theme-dark"
  >
    <calcite-tab-nav slot="tab-nav">
      <calcite-tab-title tab="tab1">Tab 1 Title</calcite-tab-title>
      <calcite-tab-title tab="tab2">Tab 2 Title</calcite-tab-title>
      <calcite-tab-title tab="tab3">Tab 3 Title</calcite-tab-title>
      <calcite-tab-title tab="tab4" active>Tab 4 Title</calcite-tab-title>
    </calcite-tab-nav>
    <calcite-tab tab="tab1">Tab 1 Content</calcite-tab>
    <calcite-tab tab="tab2">Tab 2 Content</calcite-tab>
    <calcite-tab tab="tab3">Tab 3 Content</calcite-tab>
    <calcite-tab tab="tab4" active>Tab 4 Content</calcite-tab>
  </calcite-tabs>
`;
BorderedRTLDark.parameters = { themes: themesDarkDefault };

const selectedIcon = iconNames[0];

export const WithIcons = (): string => html`
  <calcite-tabs
    layout="${select("layout", ["inline", "center"], "inline")}"
    position="${select("position", ["above", "below"], "above")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
  >
    <calcite-tab-nav slot="tab-nav">
      <calcite-tab-title active icon-start="${select("tab 1 icon-start", iconNames, selectedIcon)}"
        >Tab 1 Title</calcite-tab-title
      >
      <calcite-tab-title icon-end="${select("tab 2 icon-end", iconNames, selectedIcon)}">Tab 2 Title</calcite-tab-title>
      <calcite-tab-title
        icon-start="${select("tab 3 icon-start", iconNames, selectedIcon)}"
        icon-end="${select("tab 3 icon-end", iconNames, selectedIcon)}"
        >Tab 3 Title</calcite-tab-title
      >
      <calcite-tab-title icon-start="${select("tab 4 icon-start", iconNames, selectedIcon)}"></calcite-tab-title>
    </calcite-tab-nav>

    <calcite-tab active><p>Tab 1 Content</p></calcite-tab>
    <calcite-tab><p>Tab 2 Content</p></calcite-tab>
    <calcite-tab><p>Tab 3 Content</p></calcite-tab>
    <calcite-tab><p>Tab 4 Content</p></calcite-tab>
  </calcite-tabs>
`;

WithIcons.storyName = "With icons";

export const JustTabNav = (): string => html`
  <calcite-tab-nav
    position="${select("position", ["above", "below"], "below")}"
    scale="${select("scale", ["s", "m", "l"], "l")}"
  >
    <calcite-tab-title>Tab 1 Title</calcite-tab-title>
    <calcite-tab-title>Tab 2 Title</calcite-tab-title>
    <calcite-tab-title>Tab 3 Title</calcite-tab-title>
    <calcite-tab-title active>Tab 4 Title</calcite-tab-title>
  </calcite-tab-nav>
`;

export const DarkMode = (): string => html`
  <calcite-tabs
    class="calcite-theme-dark"
    layout="${select("layout", ["inline", "center"], "inline")}"
    position="${select("position", ["above", "below"], "above")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
  >
    <calcite-tab-nav slot="tab-nav">
      <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
      <calcite-tab-title>Tab 2 Title</calcite-tab-title>
      <calcite-tab-title>Tab 3 Title</calcite-tab-title>
      <calcite-tab-title>Tab 4 Title</calcite-tab-title>
    </calcite-tab-nav>
    <calcite-tab active><p>Tab 1 Content</p></calcite-tab>
    <calcite-tab><p>Tab 2 Content</p></calcite-tab>
    <calcite-tab><p>Tab 3 Content</p></calcite-tab>
    <calcite-tab><p>Tab 4 Content</p></calcite-tab>
  </calcite-tabs>
`;

DarkMode.storyName = "Dark mode";
DarkMode.parameters = { themes: themesDarkDefault };

export const DisabledTabs = (): string => {
  const disabledLabel = "Disabled Tabs";
  const disabledValuesObj = {
    Tab1: "tab1",
    Tab2: "tab2",
    Tab3: "tab3"
  };
  const defaultValue = "tab2";
  const optionsKnobSelections = optionsKnob(
    disabledLabel,
    disabledValuesObj,
    defaultValue,
    { display: "multi-select" },
    "DISABLED-TABS"
  );
  const tab1disabled = optionsKnobSelections.includes(disabledValuesObj.Tab1);
  const tab2disabled = optionsKnobSelections.includes(disabledValuesObj.Tab2);
  const tab3disabled = optionsKnobSelections.includes(disabledValuesObj.Tab3);

  return `
      <calcite-tabs>
        <calcite-tab-nav slot="tab-nav">
          <calcite-tab-title active ${tab1disabled ? "disabled" : ""}>Tab 1 Title</calcite-tab-title>
          <calcite-tab-title ${tab2disabled ? "disabled" : ""}>Tab 2 Title</calcite-tab-title>
          <calcite-tab-title ${tab3disabled ? "disabled" : ""}>Tab 3 Title</calcite-tab-title>
        </calcite-tab-nav>

        <calcite-tab active><p>Tab 1 Content</p></calcite-tab>
        <calcite-tab><p>Tab 2 Content</p></calcite-tab>
        <calcite-tab><p>Tab 3 Content</p></calcite-tab>
      </calcite-tabs>
    `;
};

DisabledTabs.storyName = "Disabled tabs";

export const RTL = (): string => html`
  <calcite-tabs
    dir="rtl"
    layout="${select("layout", ["inline", "center"], "inline")}"
    position="${select("position", ["above", "below"], "above")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
  >
    <calcite-tab-nav slot="tab-nav">
      <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
      <calcite-tab-title>Tab 2 Title</calcite-tab-title>
      <calcite-tab-title>Tab 3 Title</calcite-tab-title>
      <calcite-tab-title>Tab 4 Title</calcite-tab-title>
    </calcite-tab-nav>

    <calcite-tab active><p>Tab 1 Content</p></calcite-tab>
    <calcite-tab><p>Tab 2 Content</p></calcite-tab>
    <calcite-tab><p>Tab 3 Content</p></calcite-tab>
    <calcite-tab><p>Tab 4 Content</p></calcite-tab>
  </calcite-tabs>
`;
