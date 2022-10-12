import { boolean, text } from "@storybook/addon-knobs";
import {
  Attribute,
  filterComponentAttributes,
  Attributes,
  createComponentHTML as create,
  themesDarkDefault
} from "../../../.storybook/utils";
import readme from "./readme.md";
import groupReadme from "../tip-group/readme.md";
import { TEXT } from "./resources";
import { placeholderImage } from "../../../.storybook/placeholderImage";
import { storyFilters } from "../../../.storybook/helpers";

export default {
  title: "Components/Tips/Tip",
  parameters: {
    notes: [readme, groupReadme]
  },
  ...storyFilters()
};

const createAttributes: (options?: { exceptions: string[] }) => Attributes = ({ exceptions } = { exceptions: [] }) => {
  return filterComponentAttributes(
    [
      {
        name: "dismissed",
        commit(): Attribute {
          this.value = boolean("dismissed", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "non-dismissible",
        commit(): Attribute {
          this.value = boolean("nonDismissible", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "heading",
        commit(): Attribute {
          this.value = text("heading", "My Tip");
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-close",
        commit(): Attribute {
          this.value = text("intlClose", TEXT.close);
          delete this.build;
          return this;
        }
      }
    ],
    exceptions
  );
};

const html = `<img slot="thumbnail" src="${placeholderImage({
  width: 1000,
  height: 600
})}" alt="This is an image." />Enim nascetur erat faucibus ornare varius arcu fames bibendum habitant felis elit ante. Nibh morbi massa curae; leo semper diam aenean congue taciti eu porta. Varius faucibus ridiculus donec. Montes sit ligula purus porta ante lacus habitasse libero cubilia purus! In quis congue arcu maecenas felis cursus pellentesque nascetur porta donec non. Quisque, rutrum ligula pharetra justo habitasse facilisis rutrum neque. Magnis nostra nec nulla dictumst taciti consectetur. Non porttitor tempor orci dictumst magna porta vitae. </div><a href="http://www.esri.com">This is a link</a>.`;

export const simple = (): string => create("calcite-tip", createAttributes(), html);

export const darkThemeRTL_TestOnly = (): string =>
  create(
    "calcite-tip",
    createAttributes({ exceptions: ["dir", "class"] }).concat([
      { name: "dir", value: "rtl" },
      { name: "class", value: "calcite-theme-dark" }
    ]),
    html
  );
darkThemeRTL_TestOnly.parameters = { themes: themesDarkDefault };
