import { themesDarkDefault } from "../../../.storybook/utils";
import readme from "./readme.md";
import { html } from "../../../support/formatting";
import { createSteps, stepStory } from "../../../.storybook/helpers";
export default {
  title: "Components/Label",

  parameters: {
    notes: readme
  }
};

export const WrappingComponentsOtherThanInput = (): string => html`
  <div style="width:300px;max-width:100%;text-align:center;">
    <calcite-label>
      Default label wrapping a switch
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label>
      Default label wrapping a radio group
      <calcite-radio-group>
        <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
        <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
        <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
      </calcite-radio-group>
    </calcite-label>
    <calcite-label layout="inline">
      Text leading inline
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label layout="inline">
      <calcite-switch></calcite-switch>
      Text trailing inline
    </calcite-label>
    <calcite-label layout="inline">
      Off
      <calcite-switch></calcite-switch>
      On
    </calcite-label>
    <calcite-label layout="inline">
      Text leading inline
      <calcite-checkbox></calcite-checkbox>
    </calcite-label>
    <calcite-label>
      Focus slider test
      <calcite-slider></calcite-slider>
    </calcite-label>
    <calcite-label>
      Focus slider test
      <calcite-slider min-value="10" max-value="80"></calcite-slider>
    </calcite-label>
    <calcite-label layout="inline">
      <calcite-checkbox></calcite-checkbox>
      Text trailing inline
    </calcite-label>
    <calcite-label layout="inline-space-between">
      Text leading inline-space-between
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label layout="inline-space-between">
      <calcite-switch></calcite-switch>
      Text trailing inline-space-between
    </calcite-label>
    <calcite-label layout="inline-space-between">
      Text leading inline-space-between
      <calcite-checkbox></calcite-checkbox>
    </calcite-label>
    <calcite-label layout="inline-space-between">
      <calcite-checkbox></calcite-checkbox>
      Text trailing inline-space-between
    </calcite-label>
    <calcite-label>
      Default label wrapping a select
      <calcite-select>
        <calcite-option>a</calcite-option>
        <calcite-option>b</calcite-option>
        <calcite-option>c</calcite-option>
      </calcite-select>
    </calcite-label>
  </div>
`;

WrappingComponentsOtherThanInput.storyName = "Wrapping components other than input";

export const DarkTheme = (): string => html`
  <div style="width:300px;max-width:100%;text-align:center;" class="calcite-theme-dark">
    <calcite-label class="calcite-theme-dark">
      Default label wrapping a switch
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label class="calcite-theme-dark">
      Default label wrapping a radio group
      <calcite-radio-group>
        <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
        <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
        <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
      </calcite-radio-group>
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline">
      Text leading inline
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline">
      <calcite-switch></calcite-switch>
      Text trailing inline
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline">
      Off
      <calcite-switch></calcite-switch>
      On
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline">
      Text leading inline
      <calcite-checkbox></calcite-checkbox>
    </calcite-label>
    <calcite-label class="calcite-theme-dark">
      Focus slider test
      <calcite-slider></calcite-slider>
    </calcite-label>
    <calcite-label class="calcite-theme-dark">
      Focus slider test
      <calcite-slider min-value="10" max-value="80"></calcite-slider>
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline">
      <calcite-checkbox></calcite-checkbox>
      Text trailing inline
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline-space-between">
      Text leading inline-space-between
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline-space-between">
      <calcite-switch></calcite-switch>
      Text trailing inline-space-between
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline-space-between">
      Text leading inline-space-between
      <calcite-checkbox></calcite-checkbox>
    </calcite-label>
    <calcite-label class="calcite-theme-dark" layout="inline-space-between">
      <calcite-checkbox></calcite-checkbox>
      Text trailing inline-space-between
    </calcite-label>
  </div>
`;

DarkTheme.parameters = { themes: themesDarkDefault };

export const WrappingComponentsOtherThanInputRTL = (): string => html`
  <div style="width:300px;max-width:100%;text-align:center;" dir="rtl">
    <calcite-label>
      Default label wrapping a switch
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label>
      Default label wrapping a radio group
      <calcite-radio-group>
        <calcite-radio-group-item value="react" checked>React</calcite-radio-group-item>
        <calcite-radio-group-item value="ember">Ember</calcite-radio-group-item>
        <calcite-radio-group-item value="angular">Angular</calcite-radio-group-item>
      </calcite-radio-group>
    </calcite-label>
    <calcite-label layout="inline">
      Text leading inline
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label layout="inline">
      <calcite-switch></calcite-switch>
      Text trailing inline
    </calcite-label>
    <calcite-label layout="inline">
      Off
      <calcite-switch></calcite-switch>
      On
    </calcite-label>
    <calcite-label layout="inline">
      Text leading inline
      <calcite-checkbox></calcite-checkbox>
    </calcite-label>
    <calcite-label>
      Focus slider test
      <calcite-slider></calcite-slider>
    </calcite-label>
    <calcite-label>
      Focus slider test
      <calcite-slider min-value="10" max-value="80"></calcite-slider>
    </calcite-label>
    <calcite-label layout="inline">
      <calcite-checkbox></calcite-checkbox>
      Text trailing inline
    </calcite-label>
    <calcite-label layout="inline-space-between">
      Text leading inline-space-between
      <calcite-switch></calcite-switch>
    </calcite-label>
    <calcite-label layout="inline-space-between">
      <calcite-switch></calcite-switch>
      Text trailing inline-space-between
    </calcite-label>
    <calcite-label layout="inline-space-between">
      Text leading inline-space-between
      <calcite-checkbox></calcite-checkbox>
    </calcite-label>
    <calcite-label layout="inline-space-between">
      <calcite-checkbox></calcite-checkbox>
      Text trailing inline-space-between
    </calcite-label>
    <calcite-label>
      Default label wrapping a select
      <calcite-select>
        <calcite-option>a</calcite-option>
        <calcite-option>b</calcite-option>
        <calcite-option>c</calcite-option>
      </calcite-select>
    </calcite-label>
  </div>
`;

export const toggleSwitchWithLabel = stepStory(
  (): string => html`<calcite-label layout="inline">
    Toggle theme
    <calcite-switch id="theme-switch"></calcite-switch>
  </calcite-label>`,
  createSteps("calcite-label").click("calcite-label").snapshot("Toggle switch with label")
);
