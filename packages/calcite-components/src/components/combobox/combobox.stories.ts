import { select, number, text } from "@storybook/addon-knobs";
import { boolean, storyFilters } from "../../../.storybook/helpers";
import { modesDarkDefault } from "../../../.storybook/utils";
import readme1 from "./readme.md";
import readme2 from "../combobox-item/readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Controls/Combobox",
  parameters: {
    notes: [readme1, readme2],
  },
  ...storyFilters(),
};

export const simple = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      ${boolean("clear-disabled", false)}
      label="demo combobox"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      selection-mode="${select("selection-mode", ["multiple", "single", "ancestors"], "multiple")}"
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

export const single = (): string => html`
  <div style="width:150px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      label="demo combobox"
      selection-mode="${select("selection-mode", ["multiple", "single", "ancestors"], "single")}"
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

export const multiple = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      label="demo combobox"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      selection-mode="${select("selection-mode", ["multiple", "single", "ancestors"], "multiple")}"
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

export const nestedItems = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox
      open
      label="demo combobox"
      selection-mode="${select("selection-mode", ["multiple", "single", "ancestors"], "multiple")}"
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

export const longItems_TestOnly = (): string => html`<style>
    calcite-combobox {
      width: 260px;
    }
    calcite-combobox-item {
      width: 260px;
    }
  </style>
  <calcite-combobox open>
    <calcite-combobox-item text-label="Layers">
      <calcite-combobox-item text-label="Enriched USA Census Tract Areas Aug29"></calcite-combobox-item>
      <calcite-combobox-item text-label="Viewer_Reservable_Equipments_Capacity_V2_WFL1"></calcite-combobox-item>
    </calcite-combobox-item>
  </calcite-combobox>`;

export const disabled_TestOnly = (): string => html`<calcite-combobox disabled>
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

export const flipPlacements_TestOnly = (): string => html`
  <style>
    .my-combobox {
      position: unset;
      margin-top: 50px;
    }
  </style>
  <div style="height: 100px; overflow:scroll;">
    <calcite-combobox class="my-combobox" placeholder="placeholder" open>
      <calcite-combobox-item value="Trees" text-label="Trees" aria-hidden="true">
        <calcite-combobox-item value="Pine" text-label="Pine" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item
          value="Sequoia"
          disabled=""
          text-label="Sequoia"
          aria-hidden="true"
        ></calcite-combobox-item>
        <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir" aria-hidden="true"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Flowers" text-label="Flowers" aria-hidden="true">
        <calcite-combobox-item value="Daffodil" text-label="Daffodil" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item
          value="Black Eyed Susan"
          text-label="Black Eyed Susan"
          aria-hidden="true"
        ></calcite-combobox-item>
        <calcite-combobox-item value="Nasturtium" text-label="Nasturtium" aria-hidden="true"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Animals" text-label="Animals" aria-hidden="true">
        <calcite-combobox-item value="Birds" text-label="Birds" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item value="Reptiles" text-label="Reptiles" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item value="Amphibians" text-label="Amphibians" aria-hidden="true"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Rocks" text-label="Rocks" aria-hidden="true"></calcite-combobox-item>
      <calcite-combobox-item value="Insects" text-label="Insects" aria-hidden="true"></calcite-combobox-item>
      <calcite-combobox-item value="Rivers" text-label="Rivers" aria-hidden="true"></calcite-combobox-item>
    </calcite-combobox>
  </div>
  <script>
    document.querySelector(".my-combobox").flipPlacements = ["right"];
  </script>
`;

export const flipPositioning_TestOnly = (): string => html`
  <div style="position: absolute; bottom: 10px; left: 10px;">
    <calcite-combobox
      max-items="${number("max-items", 6)}"
      placeholder="${text("placeholder", "placeholder")}"
      label="${text("label (for screen readers)", "demo")}"
      selection-mode="${select("selection-mode", ["multiple", "single", "ancestors"], "multiple")}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      ${boolean("disabled", false)}
      ${boolean("allow-custom-values", false)}
      open
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
flipPositioning_TestOnly.parameters = {
  layout: "fullscreen",
};

export const darkModeRTL_TestOnly = (): string => html`
  <div style="width:400px;max-width:100%;padding:100px">
    <calcite-combobox
      label="demo combobox"
      selection-mode="${select("selection-mode", ["multiple", "single", "ancestors"], "multiple")}"
      class="calcite-mode-dark"
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
darkModeRTL_TestOnly.parameters = { modes: modesDarkDefault };

export const singleLongLabel_TestOnly = (): string => html`
  <calcite-combobox open selection-mode="single" allow-custom-values>
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

export const withPlaceholderIcon_TestOnly = (): string => html` <calcite-combobox
  id="labelFour"
  label="test"
  placeholder="${text("placeholder", "select folder")}"
  placeholder-icon="${text("placeholder-icon", "select")}"
  max-items="6"
  selection-mode="single"
  scale="s"
>
  <calcite-combobox-item value="root" text-label="username" icon="home"></calcite-combobox-item>
  <calcite-combobox-item value="1" text-label="Folder 1" icon="folder"></calcite-combobox-item>
  <calcite-combobox-item value="2" text-label="Folder 2" icon="folder"></calcite-combobox-item>
</calcite-combobox>`;

export const withoutPlaceholderIcon_TestOnly = (): string => html` <div
  style="width:400px;max-width:100%;background-color:white;padding:100px"
>
  <calcite-combobox placeholder="${text("placeholder", "select folder")}" selection-mode="multiple" open>
    <calcite-combobox-item value="root" text-label="username" icon="home" selected></calcite-combobox-item>
    <calcite-combobox-item value="1" text-label="Folder 1" icon="folder"></calcite-combobox-item>
    <calcite-combobox-item value="2" text-label="Folder 2" icon="folder"></calcite-combobox-item>
  </calcite-combobox>
</div>`;

export const scrollingWithoutMaxItems_TestOnly = (): string => html`
  <div style="width:400px;max-width:100%;background-color:white;padding:100px">
    <calcite-combobox label="demo combobox" open>
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

export const optionListMinWidthMatchesInputWhenOverlayPositioningIsFixed_TestOnly = (): string => html`
  <style>
    .wrapper {
      display: flex;
      width: 100%;
    }

    calcite-combobox {
      width: 400px;
      margin: 0 auto;
    }
  </style>
  <div class="wrapper">
    <calcite-combobox placeholder="placeholder" overlay-positioning="fixed" placement="bottom" open>
      <calcite-combobox-item value="Trees" text-label="Trees" aria-hidden="true">
        <calcite-combobox-item value="Pine" text-label="Pine" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item
          value="Sequoia"
          disabled=""
          text-label="Sequoia"
          aria-hidden="true"
        ></calcite-combobox-item>
        <calcite-combobox-item value="Douglas Fir" text-label="Douglas Fir" aria-hidden="true"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Flowers" text-label="Flowers" aria-hidden="true">
        <calcite-combobox-item value="Daffodil" text-label="Daffodil" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item
          value="Black Eyed Susan"
          text-label="Black Eyed Susan"
          aria-hidden="true"
        ></calcite-combobox-item>
        <calcite-combobox-item value="Nasturtium" text-label="Nasturtium" aria-hidden="true"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Animals" text-label="Animals" aria-hidden="true">
        <calcite-combobox-item value="Birds" text-label="Birds" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item value="Reptiles" text-label="Reptiles" aria-hidden="true"></calcite-combobox-item>
        <calcite-combobox-item value="Amphibians" text-label="Amphibians" aria-hidden="true"></calcite-combobox-item>
      </calcite-combobox-item>
      <calcite-combobox-item value="Rocks" text-label="Rocks" aria-hidden="true"></calcite-combobox-item>
      <calcite-combobox-item value="Insects" text-label="Insects" aria-hidden="true"></calcite-combobox-item>
      <calcite-combobox-item value="Rivers" text-label="Rivers" aria-hidden="true"></calcite-combobox-item>
    </calcite-combobox>
  </div>
`;

export const mediumIconForLargeComoboboxItem_TestOnly = (): string => html`
  <calcite-combobox open scale="l">
    <calcite-combobox-item
      icon="altitude"
      value="altitude"
      text-label="Altitude"
      selected
      scale="l"
    ></calcite-combobox-item>
    <calcite-combobox-item icon="article" value="article" text-label="Article" scale="l"></calcite-combobox-item>
    <calcite-combobox-item value="altitude" text-label="Altitude" scale="l"></calcite-combobox-item>
    <calcite-combobox-item value="article" text-label="Article" scale="l"></calcite-combobox-item>
  </calcite-combobox>
`;

export const withSelectorIndicatorAndIcons_TestOnly = (): string => html`
  <calcite-combobox label="test" placeholder="select folder" selection-mode="multiple" open>
    <calcite-combobox-item text-label="Folder 1" icon="folder" selected>
      <calcite-combobox-item text-label="Sub Folder 1" icon="folder" selected>
        <calcite-combobox-item text-label="Sub Folder 2 " icon="folder" selected></calcite-combobox-item>
      </calcite-combobox-item>
    </calcite-combobox-item>
    <calcite-combobox-item text-label="Folder 2" icon="folder"></calcite-combobox-item>
    <calcite-combobox-item text-label="Folder 3" icon="folder"></calcite-combobox-item>
    <calcite-combobox-item text-label="Folder 4"></calcite-combobox-item>
    <calcite-combobox-item-group label="Files">
      <calcite-combobox-item text-label="File 1" icon="file" selected>
        <calcite-combobox-item text-label="file 2" icon="file" selected></calcite-combobox-item>
      </calcite-combobox-item>
    </calcite-combobox-item-group>
  </calcite-combobox>
`;

export const nestedGroups_TestOnly =
  (): string => html`<calcite-combobox open selection-mode="single" style="width:400px" placeholder="Type to filter">
<calcite-combobox-item-group label="Level 1">
  <calcite-combobox-item-group label="Level 2">
    <calcite-combobox-item-group label="Level 3">
      <calcite-combobox-item value="Item 1" text-label="Item 1">
      </calcite-combobox-item>
      <calcite-combobox-item value="Item 2" text-label="Item 2">
      </calcite-combobox-item>
    </calcite-combobox-item-group>
</calcite-combobox>`;

export const clearDisabled_TestOnly = (): string => html`
  <calcite-combobox clear-disabled selection-mode="single" style="width:400px">
    <calcite-combobox-item selected id="one" value="one" text-label="one"></calcite-combobox-item>
    <calcite-combobox-item id="two" value="two" text-label="two"></calcite-combobox-item>
    <calcite-combobox-item id="three" value="three" text-label="three"></calcite-combobox-item>
  </calcite-combobox>
  <br />
  <calcite-combobox clear-disabled selection-mode="multiple" style="width:400px">
    <calcite-combobox-item selected id="one" value="one" text-label="one"></calcite-combobox-item>
    <calcite-combobox-item selected id="two" value="two" text-label="two"></calcite-combobox-item>
    <calcite-combobox-item selected id="three" value="three" text-label="three"></calcite-combobox-item>
  </calcite-combobox>
  <br />
  <calcite-combobox clear-disabled selection-mode="ancestors">
    <calcite-combobox-item value="parent" text-label="parent" style="width:400px">
      <calcite-combobox-item value="child1" text-label="child1"></calcite-combobox-item>
      <calcite-combobox-item selected value="child2" text-label="child2"></calcite-combobox-item>
    </calcite-combobox-item>
  </calcite-combobox>
`;
