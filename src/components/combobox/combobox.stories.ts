import { select, number, text } from "@storybook/addon-knobs";
import { boolean, createSteps, stepStory } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import readme1 from "./readme.md";
import readme2 from "../combobox-item/readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Controls/Combobox",

  parameters: {
    notes: [readme1, readme2]
  }
};

export const Simple = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      label="demo combobox"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      selection-mode="${select("selection-mode", ["multi", "single", "ancestors"], "multi")}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      ${boolean("disabled", false)}
      ${boolean("allow-custom-values", false)}
      max-items="${number("max-items", 0)}"
    >
      <calcite-combobox-item value="Trees" text-label="Trees" selected>
        <calcite-combobox-item value="Pine" text-label="Pine"></calcite-combobox-item>
        <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
        <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Flowers" text-label="Flowers">
        <calcite-combobox-item value="Daffodil" text-label="Daffodil"></calcite-combobox-item>
        <calcite-combobox-item value="Black Eyed Susan" text-label="Black Eyed Susan"></calcite-combobox-item>
        <calcite-combobox-item value="Nasturtium" text-label="Nasturtium"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Animals" text-label="Animals">
        <calcite-combobox-item value="Birds" text-label="Birds"></calcite-combobox-item>
        <calcite-combobox-item value="Reptiles" text-label="Reptiles"></calcite-combobox-item>
        <calcite-combobox-item value="Amphibians" text-label="Amphibians"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Rocks" text-label="Rocks"></calcite-combobox-item>
      <calcite-combobox-item value="Insects" text-label="Insects"></calcite-combobox-item>
      <calcite-combobox-item value="Rivers" text-label="Rivers"></calcite-combobox-item>
    </calcite-combobox>
  </div>
`;

export const Single = (): string => html`
  <div style="width:150px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      label="demo combobox"
      selection-mode="${select("selection-mode", ["multi", "single", "ancestors"], "single")}"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      ${boolean("disabled", false)}
      max-items="${number("max-items", 0)}"
    >
      <calcite-combobox-item icon="altitude" value="altitude" text-label="Altitude" selected></calcite-combobox-item>
      <calcite-combobox-item icon="article" value="article" text-label="Article"></calcite-combobox-item>
      <calcite-combobox-item icon="attachment" value="attachment" text-label="Attachment"></calcite-combobox-item>
      <calcite-combobox-item icon="banana" value="banana" text-label="Banana"></calcite-combobox-item>
      <calcite-combobox-item icon="battery3" value="battery" text-label="Batterycharging"></calcite-combobox-item>
      <calcite-combobox-item icon="beaker" value="beaker" text-label="Beaker"></calcite-combobox-item>
      <calcite-combobox-item icon="bell" value="bell" text-label="Bell"></calcite-combobox-item>
      <calcite-combobox-item icon="bookmark" value="bookmark" text-label="Bookmark"></calcite-combobox-item>
      <calcite-combobox-item icon="brightness" value="brightness" text-label="Brightness"></calcite-combobox-item>
      <calcite-combobox-item icon="calendar" value="calendar" text-label="Calendar"></calcite-combobox-item>
      <calcite-combobox-item icon="camera" value="camera" text-label="Camera"></calcite-combobox-item>
      <calcite-combobox-item icon="car" value="car" text-label="Car"></calcite-combobox-item>
      <calcite-combobox-item icon="clock" value="clock" text-label="Clock"></calcite-combobox-item>
    </calcite-combobox>
  </div>
`;

export const Multiple = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      label="demo combobox"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      selection-mode="${select("selection-mode", ["multi", "single", "ancestors"], "multi")}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      ${boolean("disabled", false)}
      ${boolean("allow-custom-values", false)}
      max-items="${number("max-items", 0)}"
    >
      <calcite-combobox-item value="Trees" text-label="Trees" selected></calcite-combobox-item>
      <calcite-combobox-item value="Flowers" text-label="Flowers" selected></calcite-combobox-item>
      <calcite-combobox-item value="Animals" text-label="Animals"></calcite-combobox-item>
      <calcite-combobox-item value="Rocks" text-label="Rocks"></calcite-combobox-item>
      <calcite-combobox-item value="Insects" text-label="Insects"></calcite-combobox-item>
      <calcite-combobox-item value="Rivers" text-label="Rivers"></calcite-combobox-item>
      <calcite-combobox-item
        value="CommercialDamageAssessment - Damage to Commercial Buildings & Damage to Commercial Buildings"
        text-label="CommercialDamageAssessment - Damage to Commercial Buildings & Damage to Commercial Buildings"
        selected
      ></calcite-combobox-item>
    </calcite-combobox>
  </div>
`;

export const NestedItems = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      active
      label="demo combobox"
      selection-mode="${select("selection-mode", ["multi", "single", "ancestors"], "multi")}"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      ${boolean("disabled", false)}
      ${boolean("allow-custom-values", false)}
      max-items="${number("max-items", 0)}"
    >
      <calcite-combobox-item value="ITEM-0-0" text-label="Level 1">
        <calcite-combobox-item value="ITEM-0-1" text-label="Level 2"></calcite-combobox-item>
        <calcite-combobox-item value="ITEM-0-2" text-label="Level 2"></calcite-combobox-item>
        <calcite-combobox-item value="ITEM-0-3" text-label="Level 2"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="ITEM-1-0" text-label="Level 1">
        <calcite-combobox-item value="ITEM-1-1" text-label="Level 2">
          <calcite-combobox-item value="ITEM-1-1-0" text-label="Level 3"></calcite-combobox-item>
          <calcite-combobox-item value="ITEM-1-1-1" text-label="Level 3">
            <calcite-combobox-item value="ITEM-1-1-1-0" text-label="Level 4"></calcite-combobox-item>
            <calcite-combobox-item value="ITEM-1-1-1-1" text-label="Level 4"></calcite-combobox-item>
          </calcite-combobox-item>
        </calcite-combobox-item>
        <calcite-combobox-item value="ITEM-1-2" text-label="Level 2"></calcite-combobox-item>
        <calcite-combobox-item value="ITEM-1-3" text-label="Level 2"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="ITEM-2-0" text-label="Level 1">
        <calcite-combobox-item value="ITEM-2-1" text-label="Level 2"></calcite-combobox-item>
        <calcite-combobox-item value="ITEM-2-2" text-label="Level 2">
          <calcite-combobox-item value="ITEM-2-2-0" text-label="Level 3"></calcite-combobox-item>
        </calcite-combobox-item>
        <calcite-combobox-item value="ITEM-2-3" text-label="Level 2"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="ITEM-0-4" text-label="Level 1"></calcite-combobox-item>
      <calcite-combobox-item value="ITEM-0-5" text-label="Level 1"></calcite-combobox-item>
      <calcite-combobox-item value="ITEM-0-6" text-label="Level 1"></calcite-combobox-item>
    </calcite-combobox>
  </div>
`;

export const DarkTheme = (): string => html`
  <div style="width:400px;max-width:100%;padding:100px">
    <calcite-combobox
      label="demo combobox"
      selection-mode="${select("selection-mode", ["multi", "single", "ancestors"], "multi")}"
      class="calcite-theme-dark"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      ${boolean("disabled", false)}
      ${boolean("allow-custom-values", false)}
      max-items="${number("max-items", 0)}"
    >
      <calcite-combobox-item value="Trees" text-label="Trees">
        <calcite-combobox-item value="Pine" text-label="Pine"></calcite-combobox-item>
        <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
        <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Flowers" text-label="Flowers">
        <calcite-combobox-item value="Daffodil" text-label="Daffodil"></calcite-combobox-item>
        <calcite-combobox-item value="Black Eyed Susan" text-label="Black Eyed Susan"></calcite-combobox-item>
        <calcite-combobox-item value="Nasturtium" text-label="Nasturtium"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Animals" text-label="Animals">
        <calcite-combobox-item value="Birds" text-label="Birds"></calcite-combobox-item>
        <calcite-combobox-item value="Reptiles" text-label="Reptiles"></calcite-combobox-item>
        <calcite-combobox-item value="Amphibians" text-label="Amphibians"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Rocks" text-label="Rocks"></calcite-combobox-item>
      <calcite-combobox-item value="Insects" text-label="Insects"></calcite-combobox-item>
      <calcite-combobox-item value="Rivers" text-label="Rivers"></calcite-combobox-item>
    </calcite-combobox>
  </div>
`;

DarkTheme.parameters = { themes: themesDarkDefault };

export const Rtl = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      selection-mode="${select("selection-mode", ["multi", "single", "ancestors"], "multi")}"
      dir="rtl"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      ${boolean("disabled", false)}
      ${boolean("allow-custom-values", false)}
    >
      <calcite-combobox-item value="Trees" text-label="Trees">
        <calcite-combobox-item value="Pine" text-label="Pine"></calcite-combobox-item>
        <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
        <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Flowers" text-label="Flowers">
        <calcite-combobox-item value="Daffodil" text-label="Daffodil"></calcite-combobox-item>
        <calcite-combobox-item value="Black Eyed Susan" text-label="Black Eyed Susan"></calcite-combobox-item>
        <calcite-combobox-item value="Nasturtium" text-label="Nasturtium"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Animals" text-label="Animals">
        <calcite-combobox-item value="Birds" text-label="Birds"></calcite-combobox-item>
        <calcite-combobox-item value="Reptiles" text-label="Reptiles"></calcite-combobox-item>
        <calcite-combobox-item value="Amphibians" text-label="Amphibians"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Rocks" text-label="Rocks"></calcite-combobox-item>
      <calcite-combobox-item value="Insects" text-label="Insects"></calcite-combobox-item>
      <calcite-combobox-item value="Rivers" text-label="Rivers"></calcite-combobox-item>
    </calcite-combobox>
  </div>
`;

Rtl.storyName = "RTL";

export const FlipPositioning = stepStory(
  (): string => html`
    <div style="position: absolute; bottom: 10px; left: 10px;">
      <calcite-combobox
        max-items="${number("max-items", 6)}"
        placeholder="${text("placeholder", "placeholder")}"
        label="${text("label (for screen readers)", "demo")}"
        selection-mode="${select("selection-mode", ["multi", "single", "ancestors"], "multi")}"
        scale="${select("scale", ["s", "m", "l"], "m")}"
        ${boolean("disabled", false)}
        ${boolean("allow-custom-values", false)}
      >
        <calcite-combobox-item value="Trees" text-label="Trees">
          <calcite-combobox-item value="Pine" text-label="Pine"></calcite-combobox-item>
          <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
          <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
        </calcite-combobox-item>
        <calcite-combobox-item value="Flowers" text-label="Flowers">
          <calcite-combobox-item value="Daffodil" text-label="Daffodil"></calcite-combobox-item>
          <calcite-combobox-item value="Black Eyed Susan" text-label="Black Eyed Susan"></calcite-combobox-item>
          <calcite-combobox-item value="Nasturtium" text-label="Nasturtium"></calcite-combobox-item>
        </calcite-combobox-item>
        <calcite-combobox-item value="Animals" text-label="Animals">
          <calcite-combobox-item value="Birds" text-label="Birds"></calcite-combobox-item>
          <calcite-combobox-item value="Reptiles" text-label="Reptiles"></calcite-combobox-item>
          <calcite-combobox-item value="Amphibians" text-label="Amphibians"></calcite-combobox-item>
        </calcite-combobox-item>
        <calcite-combobox-item value="Rocks" text-label="Rocks"></calcite-combobox-item>
        <calcite-combobox-item value="Insects" text-label="Insects"></calcite-combobox-item>
        <calcite-combobox-item value="Rivers" text-label="Rivers"></calcite-combobox-item>
      </calcite-combobox>
    </div>
  `,
  createSteps("calcite-combobox").snapshot("Default").click("calcite-combobox").snapshot("Open")
);
FlipPositioning.parameters = {
  layout: "fullscreen"
};


export const SingleLongLabel = (): string => html`
  <calcite-combobox active selection-mode="single" allow-custom-values>
    <calcite-combobox-item value="Trees" text-label="Trees">
      <calcite-combobox-item
        value="CommercialDamageAssessment - Damage to Commercial Buildings"
        text-label="CommercialDamageAssessment - Damage to Commercial Buildings &  Damage to Residential Buildings "
      ></calcite-combobox-item>
      <calcite-combobox-item value="Sequoia" text-label="Sequoia"></calcite-combobox-item>
      <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
    </calcite-combobox-item>
    <calcite-combobox-item value="Rivers" text-label="Rivers"></calcite-combobox-item>
  </calcite-combobox>
`;

export const disabled = (): string => html`<calcite-combobox disabled>
  <calcite-combobox-item value="Trees" text-label="Trees">
    <calcite-combobox-item value="Pine" text-label="Pine"></calcite-combobox-item>
    <calcite-combobox-item value="Sequoia" disabled text-label="Sequoia"></calcite-combobox-item>
    <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir"></calcite-combobox-item>
  </calcite-combobox-item>
  <calcite-combobox-item value="Flowers" text-label="Flowers" disabled>
    <calcite-combobox-item value="Daffodil" text-label="Daffodil"></calcite-combobox-item>
    <calcite-combobox-item value="Black Eyed Susan" text-label="Black Eyed Susan"></calcite-combobox-item>
    <calcite-combobox-item value="Nasturtium" text-label="Nasturtium"></calcite-combobox-item>
  </calcite-combobox-item>
</calcite-combobox>`;

