import {
  Attribute,
  filterComponentAttributes,
  Attributes,
  createComponentHTML as create
} from "../../../.storybook/utils";
import { html } from "../../tests/utils";
import { boolean, text } from "@storybook/addon-knobs";
import selectReadme from "../calcite-select/readme.md";
import optionReadme from "../calcite-option/readme.md";
import optionGroupReadme from "../calcite-option-group/readme.md";

const createSelectAttributes: (options?: { exceptions: string[] }) => Attributes = (
  { exceptions } = { exceptions: [] }
) => {
  const group = "select";

  return filterComponentAttributes(
    [
      {
        name: "disabled",
        commit(): Attribute {
          this.value = boolean("disabled", false, group);
          delete this.build;
          return this;
        }
      }
    ],
    exceptions
  );
};

const createOptionAttributes: () => Attributes = () => {
  const group = "option";

  return [
    {
      name: "disabled",
      value: boolean("disabled", false, group)
    },
    {
      name: "label",
      value: text("label", "fancy label", group)
    },
    {
      name: "selected",
      value: boolean("selected", false, group)
    },
    {
      name: "value",
      value: text("value", "value", group)
    }
  ];
};

const createOptionGroupAttributes: () => Attributes = () => {
  const group = "option-group";
  return [
    {
      name: "label",
      value: text("label", "My fancy group label", group)
    }
  ];
};

export default {
  title: "Components/Controls/Select",
  parameters: {
    notes: {
      select: selectReadme,
      option: optionReadme,
      optionGroup: optionGroupReadme
    }
  }
};

export const basic = (): string =>
  html`<div style="width:260px">
    ${create(
      "calcite-select",
      createSelectAttributes(),
      html`
        ${create("calcite-option", createOptionAttributes())}
        <calcite-option
          selected
          label="some fixed option with a very long label set on it to extend past the end"
          value="some-fixed-value"
        ></calcite-option>
        <calcite-option label="another fixed option" value="another-fixed-value"></calcite-option>
      `
    )}
  </div>`;

export const grouped = (): string =>
  create(
    "calcite-select",
    createSelectAttributes(),
    html`
      ${create(
        "calcite-option-group",
        createOptionGroupAttributes(),
        html`
          ${create("calcite-option", createOptionAttributes())}
          <calcite-option label="some fixed option (A)" value="some-fixed-value-a"></calcite-option>
          <calcite-option label="another fixed option (A)" value="another-fixed-value-a"></calcite-option>
        `
      )}
      <calcite-option-group label="group B (fixed)">
        <calcite-option label="some fixed option (B)" value="some-fixed-value-b"></calcite-option>
        <calcite-option label="another fixed option (B)" value="another-fixed-value-b"></calcite-option>
      </calcite-option-group>
    `
  );

export const RTL = (): string =>
  create(
    "calcite-select",
    [
      ...createSelectAttributes({ exceptions: ["dir"] }),
      {
        name: "dir",
        value: "rtl"
      }
    ],
    html`
      ${create(
        "calcite-option-group",
        createOptionGroupAttributes(),
        html`
          ${create("calcite-option", createOptionAttributes())}
          <calcite-option label="some fixed option (A)" value="some-fixed-value-a"></calcite-option>
          <calcite-option label="another fixed option (A)" value="another-fixed-value-a"></calcite-option>
        `
      )}
      <calcite-option-group label="group B (fixed)">
        <calcite-option label="some fixed option (B)" value="some-fixed-value-b"></calcite-option>
        <calcite-option label="another fixed option (B)" value="another-fixed-value-b"></calcite-option>
      </calcite-option-group>
    `
  );
