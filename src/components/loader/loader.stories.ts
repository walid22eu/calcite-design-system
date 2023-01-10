import { color, number, select } from "@storybook/addon-knobs";
import { storyFilters } from "../../../.storybook/helpers";
import { html } from "../../../support/formatting";
import readme from "./readme.md";

export default {
  title: "Components/Loader",
  parameters: {
    notes: readme
  },
  ...storyFilters()
};

export const simple_NoTest = (): string => html`
  <calcite-loader
    type="${select("type", ["determinate", "indeterminate"], "indeterminate")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    value="${number("value", 0, { range: true, min: 0, max: 100, step: 1 })}"
  />
`;

simple_NoTest.parameters = {
  chromatic: { disableSnapshot: true }
};

export const simple_TestOnly = (): string => html`
  <style>
    :root {
      --calcite-duration-factor: 0;
    }
  </style>
  <calcite-loader
    type="${select("type", ["determinate", "indeterminate"], "indeterminate")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    value="${number("value", 0, { range: true, min: 0, max: 100, step: 1 })}"
  />
`;

export const inline_NoTest = (): string => html`
  <div style="display: inline-flex;align-items: center;justify-content: center;width: 100%;">
  <calcite-loader
    scale="${select("scale", ["s", "m", "l"], "m")}"
    inline
  /></calcite-loader><span style="margin:0 10px">Next to some text</span>
  </div>
`;

inline_NoTest.parameters = {
  chromatic: { disableSnapshot: true }
};

export const inline_TestOnly = (): string => html`
  <style>
    :root {
      --calcite-duration-factor: 0;
    }
  </style>
  <div style="display: inline-flex;align-items: center;justify-content: center;width: 100%;">
  <calcite-loader
    scale="${select("scale", ["s", "m", "l"], "m")}"
    inline
  /></calcite-loader><span style="margin:0 10px">Next to some text</span>
  </div>
`;

export const customTheme_NoTest = (): string => html`
  <calcite-loader
    type="${select("type", ["determinate", "indeterminate"], "indeterminate")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    value="${number("value", 0, { range: true, min: 0, max: 100, step: 1 })}"
    style="
    --calcite-ui-brand: ${color("calcite-ui-blue-1", "#50ba5f")};
    --calcite-ui-brand-hover: ${color("calcite-ui-blue-2", "#1a6324")};
    --calcite-ui-brand-press: ${color("calcite-ui-blue-3", "#338033")};"
  />
`;

customTheme_NoTest.parameters = {
  chromatic: { disableSnapshot: true }
};

export const customTheme_TestOnly = (): string => html`
  <style>
    :root {
      --calcite-duration-factor: 0;
    }
  </style>
  <calcite-loader
    type="${select("type", ["determinate", "indeterminate"], "indeterminate")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    value="${number("value", 0, { range: true, min: 0, max: 100, step: 1 })}"
    style="
    --calcite-ui-brand: ${color("calcite-ui-blue-1", "#50ba5f")};
    --calcite-ui-brand-hover: ${color("calcite-ui-blue-2", "#1a6324")};
    --calcite-ui-brand-press: ${color("calcite-ui-blue-3", "#338033")};"
  />
`;
