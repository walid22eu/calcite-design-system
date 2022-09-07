import { boolean, select, text } from "@storybook/addon-knobs";
import {
  Attributes,
  Attribute,
  filterComponentAttributes,
  createComponentHTML as create,
  themesDarkDefault
} from "../../../.storybook/utils";
import readme from "./readme.md";
import { ATTRIBUTES } from "../../../.storybook/resources";
import { html } from "../../../support/formatting";
import { TEXT } from "./resources";
import { storyFilters } from "../../../.storybook/helpers";

export default {
  title: "Components/Action Bar",
  parameters: {
    notes: readme
  },
  ...storyFilters()
};

const createAttributes: (options?: { exceptions: string[] }) => Attributes = ({ exceptions } = { exceptions: [] }) => {
  const { position } = ATTRIBUTES;

  return filterComponentAttributes(
    [
      {
        name: "expand-disabled",
        commit(): Attribute {
          this.value = boolean("expandDisabled", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "expanded",
        commit(): Attribute {
          this.value = boolean("expanded", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-expand",
        commit(): Attribute {
          this.value = text("intlExpand", TEXT.expand);
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-collapse",
        commit(): Attribute {
          this.value = text("intlCollapse", TEXT.collapse);
          delete this.build;
          return this;
        }
      },
      {
        name: "position",
        commit(): Attribute {
          this.value = select("position", position.values, position.defaultValue);
          delete this.build;
          return this;
        }
      }
    ],
    exceptions
  );
};

export const simple = (): string =>
  create(
    "calcite-action-bar",
    createAttributes(),
    html`
      <calcite-action-group>
        <calcite-action text="Add" label="Add Item" icon="plus"></calcite-action>
        <calcite-action text="Save" label="Save Item" icon="save"></calcite-action>
      </calcite-action-group>
      <calcite-action-group>
        <calcite-action text="Layers" label="View Layers" icon="layers"></calcite-action>
      </calcite-action-group>
    `
  );

export const horizontal = (): string => html`
  <div style="width: 500px;">
    <calcite-action-bar layout="horizontal" style="width:100%">
      <calcite-action-group layout="horizontal">
        <calcite-action text="Add" icon="plus"> </calcite-action>
        <calcite-action text="Save" icon="save"> </calcite-action>
        <calcite-action text="Layers" icon="layers"> </calcite-action>
      </calcite-action-group>
      <calcite-action-group layout="horizontal">
        <calcite-action text="Add" icon="plus"> </calcite-action>
        <calcite-action text="Save" active icon="save"> </calcite-action>
        <calcite-action text="Layers" icon="layers"> </calcite-action>
      </calcite-action-group>
      <calcite-action slot="bottom-actions" text="hello world" icon="layers"> </calcite-action>
    </calcite-action-bar>
  </div>
`;

export const horizontalSmall = (): string => html`
  <div style="width: 250px;">
    <calcite-action-bar layout="horizontal" style="width:100%">
      <calcite-action-group layout="horizontal">
        <calcite-action text="Add" icon="plus"> </calcite-action>
        <calcite-action text="Save" icon="save"> </calcite-action>
        <calcite-action text="Layers" icon="layers"> </calcite-action>
      </calcite-action-group>
      <calcite-action-group layout="horizontal">
        <calcite-action text="Add" icon="plus"> </calcite-action>
        <calcite-action text="Save" active icon="save"> </calcite-action>
        <calcite-action text="Layers" icon="layers"> </calcite-action>
      </calcite-action-group>
      <calcite-action slot="bottom-actions" text="hello world" icon="layers"> </calcite-action>
    </calcite-action-bar>
  </div>
`;

export const withDefinedWidths = (): string =>
  html`
    <style>
      calcite-action-bar {
        --calcite-action-bar-expanded-max-width: 150px;
      }
    </style>
    <calcite-action-bar expanded>
      <calcite-action-group>
        <calcite-action text="Add to my custom action bar application" icon="plus"></calcite-action>
        <calcite-action text="Save to my custom action bar application" icon="save"></calcite-action>
      </calcite-action-group>
      <calcite-action-group>
        <calcite-action text="Layers in my custom action bar application" icon="layers"></calcite-action>
      </calcite-action-group>
    </calcite-action-bar>
  `;

export const darkThemeRTL_TestOnly = (): string =>
  create(
    "calcite-action-bar",
    createAttributes({ exceptions: ["dir", "class"] }).concat([
      {
        name: "dir",
        value: "rtl"
      },
      {
        name: "class",
        value: "calcite-theme-dark"
      }
    ]),
    html`
      <calcite-action-group>
        <calcite-action text="Add" label="Add Item" icon="plus"></calcite-action>
        <calcite-action text="Save" label="Save Item" icon="save"></calcite-action>
      </calcite-action-group>
      <calcite-action-group>
        <calcite-action text="Layers" label="View Layers" icon="layers"></calcite-action>
      </calcite-action-group>
    `
  );

darkThemeRTL_TestOnly.parameters = { themes: themesDarkDefault };

export const withTooltip_NoTest = (): string =>
  create(
    "calcite-action-bar",
    createAttributes(),
    html`
      <calcite-tooltip placement="bottom" slot="expand-tooltip">Expand</calcite-tooltip>
      <calcite-action text="Add" icon="plus"></calcite-action>
    `
  );
