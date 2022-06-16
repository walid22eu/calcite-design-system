import { select, text } from "@storybook/addon-knobs";
import { boolean, createSteps, stepStory } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import readme1 from "./readme.md";
import readme2 from "../stepper-item/readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Stepper",

  parameters: {
    notes: [readme1, readme2]
  }
};

export const Simple = (): string => html`
  <calcite-stepper
    scale="${select("scale", ["s", "m", "l"], "m")}"
    layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    ${boolean("numbered", true)}
    ${boolean("icon", true)}
  >
    <calcite-stepper-item
      item-title="${text("item-1-title", "Choose method")}"
      item-subtitle="${text("item-1-subtitle", "Add members without sending invitations")}"
      complete
    >
      <calcite-notice active width="full"><div slot="message">Step 1 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-2-title", "Compile member list")}"
      item-subtitle="${text("item-2-subtitle", "")}"
      complete
      error
    >
      <calcite-notice active width="full"><div slot="message">Step 2 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-3-title", "Set member properties")}"
      item-subtitle="${text("item-3-subtitle", "")}"
      active
    >
      <calcite-notice active width="full"><div slot="message">Step 3 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-4-title", "Confirm and complete")}"
      item-subtitle="${text("item-4-subtitle", "Disabled example")}"
      disabled
    >
      <calcite-notice active width="full"><div slot="message">Step 4 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
  </calcite-stepper>
`;

export const NoContent = (): string => html`
  <calcite-stepper
    scale="${select("scale", ["s", "m", "l"], "m")}"
    layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    ${boolean("numbered", true)}
    ${boolean("icon", true)}
  >
    <calcite-stepper-item
      item-title="${text("item-1-title", "Choose method")}"
      item-subtitle="${text("item-1-subtitle", "Add members without sending invitations")}"
      complete
    >
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-2-title", "Compile member list")}"
      item-subtitle="${text("item-2-subtitle", "")}"
      complete
      error
    >
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-3-title", "Set member properties")}"
      item-subtitle="${text("item-3-subtitle", "")}"
      active
    >
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-4-title", "Confirm and complete")}"
      item-subtitle="${text("item-4-subtitle", "Disabled example")}"
      disabled
    >
    </calcite-stepper-item>
  </calcite-stepper>
`;

NoContent.storyName = "No content";

export const DarkMode = (): string => html`
  <calcite-stepper
  class="calcite-theme-dark"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    ${boolean("numbered", true)}
    ${boolean("icon", true)}
  >
    <calcite-stepper-item
      item-title="${text("item-1-title", "Choose method")}"
      item-subtitle="${text("item-1-subtitle", "Add members without sending invitations")}"
      complete
    >
      <calcite-notice active width="full"><div slot=message">Step 1 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-2-title", "Compile member list")}"
      item-subtitle="${text("item-2-subtitle", "")}"
      complete
      error
    >
      <calcite-notice active width="full"><div slot="message">Step 2 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-3-title", "Set member properties")}"
      item-subtitle="${text("item-3-subtitle", "")}"
      active
    >
      <calcite-notice active width="full"><div slot="message">Step 3 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
    <calcite-stepper-item
      item-title="${text("item-4-title", "Confirm and complete")}"
      item-subtitle="${text("item-4-subtitle", "Disabled example")}"
      disabled
    >
      <calcite-notice active width="full"><div slot="message">Step 4 Content Goes Here</div></calcite-notice>
    </calcite-stepper-item>
  </calcite-stepper>
`;

DarkMode.parameters = { themes: themesDarkDefault };

export const Rtl = (): string => html`
  <div dir="rtl">
    <calcite-stepper
      layout="${select("layout", ["horizontal", "vertical"], "horizontal")}"
      ${boolean("numbered", true)}
      ${boolean("icon", true)}
    >
      <calcite-stepper-item
        item-title="${text("item-1-title", "Choose method")}"
        item-subtitle="${text("item-1-subtitle", "Add members without sending invitations")}"
        complete
      >
        <calcite-notice active width="full"><div slot="message">Step 1 Content Goes Here</div></calcite-notice>
      </calcite-stepper-item>
      <calcite-stepper-item
        item-title="${text("item-2-title", "Compile member list")}"
        item-subtitle="${text("item-3-2ubtitle", "")}"
        complete
        error
      >
        <calcite-notice active width="full"><div slot="message">Step 2 Content Goes Here</div></calcite-notice>
      </calcite-stepper-item>
      <calcite-stepper-item
        item-title="${text("item-3-title", "Set member properties")}"
        item-subtitle="${text("item-3-subtitle", "")}"
        active
      >
        <calcite-notice active width="full"><div slot="message">Step 3 Content Goes Here</div></calcite-notice>
      </calcite-stepper-item>
      <calcite-stepper-item
        item-title="${text("item-4-title", "Confirm and complete")}"
        item-subtitle="${text("item-4-subtitle", "Disabled example")}"
        disabled
      >
        <calcite-notice active width="full"><div slot="message">Step 4 Content Goes Here</div></calcite-notice>
      </calcite-stepper-item>
    </calcite-stepper>
  </div>
`;

Rtl.storyName = "RTL";

export const disabled = (): string => html`<calcite-stepper>
  <calcite-stepper-item item-title="item1" complete>1</calcite-stepper-item>
  <calcite-stepper-item item-title="item2">2</calcite-stepper-item>
  <calcite-stepper-item item-title="item3" active>3</calcite-stepper-item>
  <calcite-stepper-item item-title="item4" disabled>4</calcite-stepper-item>
</calcite-stepper>`;

export const MinHeight = stepStory(
  (): string => html`<calcite-stepper style="min-height: 500px;">
    <calcite-stepper-item item-title="Title one" id="one"> Step one </calcite-stepper-item>
    <calcite-stepper-item item-title="Title two"> Step two </calcite-stepper-item>
    <calcite-stepper-item item-title="Title three"> Step three </calcite-stepper-item>
  </calcite-stepper>`,
  createSteps("calcite-stepper").click("#one").snapshot("stepper with min-height")
);
