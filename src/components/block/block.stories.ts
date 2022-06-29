import { boolean, select, text } from "@storybook/addon-knobs";
import {
  Attribute,
  filterComponentAttributes,
  Attributes,
  createComponentHTML as create,
  placeholderImage
} from "../../../.storybook/utils";
import blockReadme from "./readme.md";
import sectionReadme from "../block-section/readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Block",
  parameters: {
    notes: {
      block: blockReadme,
      section: sectionReadme
    }
  }
};

const createBlockAttributes: (options?: { exceptions: string[] }) => Attributes = (
  { exceptions } = { exceptions: [] }
) => {
  const group = "block";

  return filterComponentAttributes(
    [
      {
        name: "heading",
        commit(): Attribute {
          this.value = text("heading", "Heading", group);
          delete this.build;
          return this;
        }
      },

      {
        name: "summary",
        commit(): Attribute {
          this.value = text("summary", "summary", group);
          delete this.build;
          return this;
        }
      },
      {
        name: "open",
        commit(): Attribute {
          this.value = boolean("open", true, group);
          delete this.build;
          return this;
        }
      },
      {
        name: "collapsible",
        commit(): Attribute {
          this.value = boolean("collapsible", true, group);
          delete this.build;
          return this;
        }
      },
      {
        name: "loading",
        commit(): Attribute {
          this.value = boolean("loading", false, group);
          delete this.build;
          return this;
        }
      },
      {
        name: "disabled",
        commit(): Attribute {
          this.value = boolean("disabled", false, group);
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-collapse",
        commit(): Attribute {
          this.value = text("intlCollapse", "Collapse", group);
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-expand",
        commit(): Attribute {
          this.value = text("intlExpand", "Expand", group);
          delete this.build;
          return this;
        }
      }
    ],
    exceptions
  );
};

const createSectionAttributes: () => Attributes = () => {
  const group = "section (animals)";
  const toggleDisplayOptions = ["button", "switch"];

  return [
    {
      name: "text",
      value: text("text", "Animals", group)
    },
    {
      name: "open",
      value: boolean("open", true, group)
    },
    {
      name: "toggle-display",
      value: select("toggleDisplay", toggleDisplayOptions, toggleDisplayOptions[0], group)
    },
    {
      name: "intl-collapse",
      value: text("intlCollapse", "Collapse", group)
    },
    {
      name: "intl-expand",
      value: text("intlExpand", "Expand", group)
    }
  ];
};

export const basic = (): string =>
  create(
    "calcite-block",
    createBlockAttributes(),
    html`
      ${create(
        "calcite-block-section",
        createSectionAttributes(),
        `<img alt="demo" src="${placeholderImage({ width: 320, height: 240 })}" />`
      )}

      <calcite-block-section text="Nature" open>
        <img alt="demo" src="${placeholderImage({ width: 320, height: 240 })}" />
      </calcite-block-section>
    `
  );

export const RTL = (): string =>
  create(
    "calcite-block",
    createBlockAttributes({ exceptions: ["dir"] }).concat({ name: "dir", value: "rtl" }),
    html`
      ${create(
        "calcite-block-section",
        createSectionAttributes(),
        `<img alt="demo" src="${placeholderImage({ width: 320, height: 240 })}" />`
      )}

      <calcite-block-section text="Nature" open>
        <img alt="demo" src="${placeholderImage({ width: 320, height: 240 })}" />
      </calcite-block-section>
    `
  );

export const withHeaderControl = (): string =>
  create(
    "calcite-block",
    createBlockAttributes({ exceptions: ["open", "collapsible"] }),
    `<label slot="control">test <input placeholder="I'm a header control"/></label>`
  );

export const withIconAndHeader = (): string =>
  create("calcite-block", createBlockAttributes({ exceptions: ["open", "collapsible"] }), `<div slot="icon">✅</div>`);

export const disabled = (): string => html`<calcite-block heading="heading" summary="summary" open collapsible disabled>
  <calcite-block-section text="Nature" open>
    <img alt="demo" src="${placeholderImage({ width: 320, height: 240 })}" />
  </calcite-block-section>
</calcite-block>`;

export const noPadding = (): string => html` <calcite-panel heading="Properties">
  <calcite-block heading="Example block heading" summary="example summary heading" collapsible open disable-padding>
    <div>calcite components ninja</div>
  </calcite-block>
</calcite-panel>`;
