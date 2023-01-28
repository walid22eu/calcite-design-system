import { select } from "@storybook/addon-knobs";
import { boolean, iconNames, storyFilters } from "../../../.storybook/helpers";
import { modesDarkDefault } from "../../../.storybook/utils";
import { html } from "../../../support/formatting";
import readme from "./readme.md";

export default {
  title: "Components/Alert",
  parameters: {
    notes: readme,
    chromatic: {
      delay: 500
    }
  },
  ...storyFilters()
};

export const titleMessageLink = (): string => html`
<calcite-alert
${boolean("icon", true)}
${boolean("auto-close", false)}
auto-close-duration="${select("auto-close-duration", ["fast", "medium", "slow"], "medium")}"
placement="${select("placement", ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"], "bottom")}"
${boolean("open", true)}
scale="${select("scale", ["s", "m", "l"], "m")}"
kind="${select("kind", ["brand", "info", "danger", "success", "warning"], "brand")}">
<div slot="title">Here's a general bit of information</div></div>
<div slot="message">
  Some kind of contextually relevant content
</div>
<calcite-link slot="link" title="my action">Take action</calcite-link>
</calcite-alert>
`;

titleMessageLink.storyName = "Title, message, link";

export const titleMessage = (): string => html`
  <calcite-alert
    ${boolean("icon", true)}
    ${boolean("auto-close", false)}
    auto-close-duration="${select("auto-close-duration", ["fast", "medium", "slow"], "medium")}"
    placement="${select(
      "placement",
      ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"],
      "bottom"
    )}"
    ${boolean("open", true)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
    kind="${select("kind", ["brand", "info", "danger", "success", "warning"], "danger")}"
  >
    <div slot="title">Something failed</div>
    <div slot="message">That thing you wanted to do didn't work as expected</div>
  </calcite-alert>
`;

titleMessage.storyName = "Title, message";

export const messageLink = (): string => html`
  <calcite-alert
    ${boolean("icon", true)}
    ${boolean("auto-close", false)}
    auto-close-duration="${select("auto-close-duration", ["fast", "medium", "slow"], "medium")}"
    placement="${select(
      "placement",
      ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"],
      "bottom"
    )}"
    ${boolean("open", true)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
    kind="${select("kind", ["brand", "info", "danger", "success", "warning"], "success")}"
  >
    <div slot="message">Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer</div>
    <calcite-link slot="link" title="my action">View layer</calcite-link>
  </calcite-alert>
`;

messageLink.storyName = "Message, link";

export const message = (): string => html`
  <calcite-alert
    ${boolean("icon", true)}
    ${boolean("auto-close", false)}
    auto-close-duration="${select("auto-close-duration", ["fast", "medium", "slow"], "medium")}"
    placement="${select(
      "placement",
      ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"],
      "bottom"
    )}"
    ${boolean("open", true)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
    kind="${select("kind", ["brand", "info", "danger", "success", "warning"], "warning")}"
  >
    <div slot="message">Network connection interruption detected</div>
  </calcite-alert>
`;

export const customIcon = (): string => html`
  <calcite-alert
    icon="${select("icon", iconNames, iconNames[0])}"
    ${boolean("auto-close", false)}
    auto-close-duration="${select("auto-close-duration", ["fast", "medium", "slow"], "medium")}"
    placement="${select(
      "placement",
      ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"],
      "bottom"
    )}"
    ${boolean("open", true)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
    kind="${select("kind", ["brand", "info", "danger", "success", "warning"], "success")}"
  >
    <div slot="message">Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer</div>
    <calcite-link slot="link" title="my action">View layer</calcite-link>
  </calcite-alert>
`;

export const queue_NoTest = (): string => html`
  <div>
    <h5>Open or add to queue</h5>
    <calcite-button onclick='document.querySelector("#one").setAttribute("open", "")'>Open Alert 1</calcite-button>
    <calcite-button onclick='document.querySelector("#two").setAttribute("open", "")'>Open Alert 2</calcite-button>
    <calcite-button onclick='document.querySelector("[data-custom-id=my-id]").setAttribute("open", "")'
      >Open Alert 3</calcite-button
    >
    <br />
    <br />
    <h5>Close or remove from queue</h5>
    <calcite-button kind="danger" onclick='document.querySelector("#one").removeAttribute("open")'
      >Close Alert 1</calcite-button
    >
    <calcite-button kind="danger" onclick='document.querySelector("#two").removeAttribute("open")'
      >Close Alert 2</calcite-button
    >
    <calcite-button kind="danger" onclick='document.querySelector("[data-custom-id=my-id]").removeAttribute("open")'
      >Close Alert 3</calcite-button
    >
    <calcite-alert id="one" icon kind="${select("kind", ["brand", "info", "danger", "success", "warning"], "success")}">
      <div slot="title">Your great thing happened</div>
      <div slot="message">Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer</div>
      <calcite-link slot="link" title="my action">View layer</calcite-link>
    </calcite-alert>
    <calcite-alert id="two" icon kind="${select("kind-2", ["brand", "info", "danger", "success", "warning"], "info")}">
      <div slot="title">Your great thing happened</div>
      <div slot="message">Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer</div>
      <calcite-link slot="link" title="my action">View layer</calcite-link>
    </calcite-alert>
    <calcite-alert
      data-custom-id="my-id"
      icon
      kind="${select("kind-3", ["brand", "info", "danger", "success", "warning"], "danger")}"
    >
      <div slot="title">That didn't work out</div>
      <div slot="message">That thing you wanted to do didn't work</div>
      <calcite-link slot="link" title="my action">View layer</calcite-link>
    </calcite-alert>
  </div>
`;

queue_NoTest.parameters = {
  chromatic: { disableSnapshot: true }
};

export const darkModeRTL_TestOnly = (): string => html`
  <style>
    :root {
      --calcite-duration-factor: 0;
    }
  </style>
  <calcite-alert
    class="calcite-mode-dark"
    ${boolean("icon", true)}
    ${boolean("auto-close", false)}
    auto-close-duration="${select("auto-close-duration", ["fast", "medium", "slow"], "medium")}"
    placement="${select(
      "placement",
      ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"],
      "bottom"
    )}"
    ${boolean("open", true)}
    scale="${select("scale", ["s", "m", "l"], "m")}"
    kind="${select("kind", ["brand", "info", "danger", "success", "warning"], "danger")}"
  >
    <div slot="title">Something failed</div>
    <div slot="message">That thing you wanted to do didn't work as expected</div>
    <calcite-link slot="link" title="my action">My action</calcite-link>
  </calcite-alert>
`;

darkModeRTL_TestOnly.parameters = { modes: modesDarkDefault };

export const actionsEndNoQueue_TestOnly = (): string => html`
  <style>
    :root {
      --calcite-duration-factor: 0;
    }
  </style>
  <calcite-alert label="this is a default danger with icon and link" scale="l" kind="danger" icon open>
    <div slot="title">Hello there!</div>
    <div slot="message">Do you really want to proceed?</div>
    <calcite-action scale="l" slot="actions-end" title="Tips" icon="lightbulb"></calcite-action>
    <calcite-action scale="l" slot="actions-end" title="Get info" icon="attachment"></calcite-action>
  </calcite-alert>
`;

export const actionsEndQueued_TestOnly = (): string => html`
  <style>
    :root {
      --calcite-duration-factor: 0;
    }
  </style>
  <calcite-alert id="one" label="One" scale="l" kind="danger" icon open>
    <div slot="title">Hello there, alert one!</div>
    <div slot="message">Do you really want to proceed?</div>
    <calcite-action scale="l" slot="actions-end" title="Tips" icon="lightbulb"></calcite-action>
    <calcite-action scale="l" slot="actions-end" title="Get info" icon="attachment"></calcite-action>
  </calcite-alert>
  <calcite-alert id="two" label="Two" scale="l" kind="danger" icon>
    <div slot="title">Hello there, alert two!</div>
    <div slot="message">Do you really want to proceed?</div>
    <calcite-action scale="l" slot="actions-end" title="Tips" icon="lightbulb"></calcite-action>
    <calcite-action scale="l" slot="actions-end" title="Get info" icon="attachment"></calcite-action>
  </calcite-alert>
  <script>
    setTimeout(() => {
      document.querySelector("#two").open = true;
    }, "1000");
  </script>
`;

export const autoClosableRetainsCloseButton_TestOnly = (): string => html`
  <style>
    :root {
      --calcite-duration-factor: 0;
    }
  </style>
  <calcite-alert auto-close auto-close-duration="medium" open scale="m" kind="info">
    <div slot="title">Here's a general bit of information</div>
    <div slot="message">Some kind of contextually relevant content</div>
    <calcite-link slot="link" title="my action" role="presentation"> Take action </calcite-link>
  </calcite-alert>
`;
