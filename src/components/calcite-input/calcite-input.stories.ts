import { storiesOf } from "@storybook/html";
import { select, text } from "@storybook/addon-knobs";
import { boolean } from "../../../.storybook/helpers";
import { darkBackground } from "../../../.storybook/utils";
import readme from "./readme.md";

storiesOf("Components/Input", module)
  .addParameters({ notes: readme })
  .add(
    "With Label",
    (): string => `
    <div style="width:300px;max-width:100%;text-align:center;">
    <calcite-label status="${select("status", ["idle", "valid", "invalid"], "idle")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    >
    ${text("label text", "My great label")}
    <calcite-input
      type="${select(
        "type",
        ["text", "textarea", "email", "password", "tel", "number", "search", "file", "time", "date"],
        "text"
      )}"
      status="${select("status", ["idle", "invalid", "valid"], "idle")}"
      alignment="${select("alignment", ["start", "end"], "start")}"
      number-button-type="${select("number-button-type", ["none", "horizontal", "vertical"], "horizontal")}"
      min="${text("min", "")}"
      max="${text("max", "")}"
      step="${text("step", "")}"
      prefix-text="${text("prefix-text", "")}"
      suffix-text="${text("suffix-text", "")}"
      ${boolean("loading", false)}
      ${boolean("clearable", false)}
      ${boolean("disabled", false)}
      value="${text("value", "")}"
      placeholder="${text("placeholder", "Placeholder text")}">
    </calcite-input>
    <calcite-input-message
    ${boolean("input-message-active", false)}
    type="${select("input message type", ["default", "floating"], "default")}"
    status="${select("input message status", ["idle", "valid", "invalid"], "idle")}">${text(
      "input message text",
      "My great input message"
    )}</calcite-input-message>
    </calcite-label>
    </div>
  `
  )
  .add(
    "With Label and Input Message",
    (): string => `
    <div style="width:300px;max-width:100%;text-align:center;">
    <calcite-label
    status="${select("status", ["idle", "valid", "invalid"], "idle", "Label")}"
    scale="${select("scale", ["s", "m", "l"], "m", "Label")}"
    layout="${select("layout", ["default", "inline", "inline-space-between"], "default", "Label")}"
    >
    ${text("label text", "My great label", "Label")}
    <calcite-input
      type="${select(
        "type",
        ["text", "textarea", "email", "password", "tel", "number", "search", "file", "time", "date"],
        "text",
        "Input"
      )}"
      status="${select("status", ["idle", "invalid", "valid"], "idle", "Input")}"
      alignment="${select("alignment", ["start", "end"], "start", "Input")}"
      number-button-type="${select("number-button-type", ["none", "horizontal", "vertical"], "horizontal", "Input")}"
      min="${text("min", "", "Input")}"
      max="${text("max", "", "Input")}"
      step="${text("step", "", "Input")}"
      prefix-text="${text("prefix-text", "", "Input")}"
      suffix-text="${text("suffix-text", "", "Input")}"
      ${boolean("loading", false, "Input")}
      ${boolean("autofocus", false, "Input")}
      ${boolean("required", false, "Input")}
      value="${text("value", "", "Input")}"
      placeholder="${text("placeholder", "Placeholder text", "Input")}">
    </calcite-input>
    <calcite-input-message
    ${boolean("active", true, "Input Message")}
    ${boolean("icon", true, "Input Message")}
    type="${select("type", ["default", "floating"], "default", "Input Message")}"
   >${text("input message text", "My great input message", "Input Message")}</calcite-input-message>
    </calcite-label>
    </div>
  `
  )
  .add(
    "Without Label",
    (): string => `
    <div style="width:300px;max-width:100%;text-align:center;">
    <calcite-input
      scale="${select("scale", ["s", "m", "l"], "m")}"
      status="${select("status", ["idle", "valid", "invalid"], "idle")}"
      type="${select(
        "type",
        ["text", "textarea", "email", "password", "tel", "number", "search", "file", "time", "date"],
        "text"
      )}"

      status="${select("status", ["idle", "invalid", "valid"], "idle")}"
      alignment="${select("alignment", ["start", "end"], "start")}"
      number-button-type="${select("number-button-type", ["none", "horizontal", "vertical"], "horizontal")}"
      min="${text("min", "")}"
      max="${text("max", "")}"
      step="${text("step", "")}"
      prefix-text="${text("prefix-text", "")}"
      suffix-text="${text("suffix-text", "")}"
      ${boolean("loading", false)}
      ${boolean("clearable", false)}
      ${boolean("disabled", false)}
      value="${text("value", "")}"
      placeholder="${text("placeholder", "Placeholder text")}">
    </calcite-input>
    </div>
  `
  )
  .add(
    "With Slotted Action",
    (): string => `
    <div style="width:300px;max-width:100%;text-align:center;">
    <calcite-label status="${select("status", ["idle", "valid", "invalid"], "idle")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    >
    ${text("label text", "My great label")}
    <calcite-input
      type="${select(
        "type",
        ["text", "textarea", "email", "password", "tel", "number", "search", "file", "time", "date"],
        "text"
      )}"
      status="${select("status", ["idle", "invalid", "valid"], "idle")}"
      alignment="${select("alignment", ["start", "end"], "start")}"
      number-button-type="${select("number-button-type", ["none", "horizontal", "vertical"], "horizontal")}"
      min="${text("min", "")}"
      max="${text("max", "")}"
      step="${text("step", "")}"
      prefix-text="${text("prefix-text", "")}"
      suffix-text="${text("suffix-text", "")}"
      ${boolean("loading", false)}
      ${boolean("clearable", false)}
      ${boolean("disabled", false)}
      value="${text("value", "")}"
      placeholder="${text("placeholder", "Placeholder text")}">
      <calcite-button slot="input-action">${text("action button text", "Go")}</calcite-button>
    </calcite-input>
    <calcite-input-message
    ${boolean("input-message-active", false)}
    type="${select("input message type", ["default", "floating"], "default")}"
    status="${select("input message status", ["idle", "valid", "invalid"], "idle")}">${text(
      "input message text",
      "My great input message"
    )}</calcite-input-message>
    </calcite-label>
    </div>
  `
  )
  .add(
    "Textarea",
    (): string => `
    <div style="width:300px;max-width:100%;text-align:center;">
    <calcite-label status="${select("status", ["idle", "valid", "invalid"], "idle")}">
    ${text("label text", "My great label")}
    <calcite-input
      type="textarea"
      ${boolean("loading", false)}
      ${boolean("clearable", false)}
      ${boolean("disabled", false)}
      value="${text("value", "")}"
      placeholder="${text("placeholder", "Placeholder text")}">
    </calcite-input>
    <calcite-input-message
    ${boolean("input-message-active", false)}
    type="${select("input message type", ["default", "floating"], "default")}"
    status="${select("input message status", ["idle", "valid", "invalid"], "idle")}">${text(
      "input message text",
      "My great input message"
    )}</calcite-input-message>
    </calcite-label>
    </div>
  `
  )
  .add(
    "Simple - Dark mode",
    (): string => `
    <div style="width:300px;max-width:100%;text-align:center;">
    <calcite-label theme="dark" status="${select("status", ["idle", "valid", "invalid"], "idle")}">
    ${text("label text", "My great label")}
    <calcite-input
      type="${select(
        "type",
        ["text", "textarea", "email", "password", "tel", "number", "search", "file", "time", "date"],
        "text"
      )}"
      status="${select("status", ["idle", "invalid", "valid"], "idle")}"
      alignment="${select("alignment", ["start", "end"], "start")}"
      number-button-type="${select("number-button-type", ["none", "horizontal", "vertical"], "horizontal")}"
      min="${text("min", "")}"
      max="${text("max", "")}"
      step="${text("step", "")}"
      prefix-text="${text("prefix-text", "")}"
      suffix-text="${text("suffix-text", "")}"
      ${boolean("loading", false)}
      ${boolean("clearable", false)}
      ${boolean("disabled", false)}
      value="${text("value", "")}"
      placeholder="${text("placeholder", "Placeholder text")}">
    </calcite-input>
    <calcite-input-message
    ${boolean("calcite-input-message-active", false)}
    type="${select("input message type", ["default", "floating"], "default")}"
    status="${select("input message status", ["idle", "valid", "invalid"], "idle")}">${text(
      "input message text",
      "My great input message"
    )}</calcite-input-message>
    </calcite-label>
    </div>
  `,
    { backgrounds: darkBackground }
  );
