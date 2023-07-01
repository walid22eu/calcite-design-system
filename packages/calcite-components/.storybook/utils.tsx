/* @jsx React.createElement */

import {
  array,
  boolean,
  button,
  color,
  date,
  files,
  number,
  object,
  optionsKnob as options,
  radios,
  select,
  text
} from "@storybook/addon-knobs";
import { CSS_UTILITY } from "../src/utils/resources";

import { colors } from "../../../node_modules/@esri/calcite-colors/dist/colors";
import { Description, DocsPage } from "@storybook/addon-docs";
import { Theme as Mode } from "storybook-addon-themes/dist/models/Theme";
import React from "react";

const autoValue = {
  name: "Auto",
  value: colors["blk-200"]
};

const lightValue = {
  name: "Light",
  value: colors["blk-005"]
};

const darkValue = {
  name: "Dark",
  value: colors["blk-210"]
};

const list: Mode[] = [
  {
    name: lightValue.name,
    class: CSS_UTILITY.lightMode,
    color: lightValue.value
  },
  {
    name: darkValue.name,
    class: CSS_UTILITY.darkMode,
    color: darkValue.value
  },
  {
    name: autoValue.name,
    class: CSS_UTILITY.autoMode,
    color: autoValue.value
  }
];

export const modes = {
  default: lightValue.name,
  list
};

export const modesDarkDefault = {
  default: darkValue.name,
  list
};

/**
 * This transforms a component markdown to properly render in Storybook notes.
 */
export const parseReadme = (content: string) =>
  content
    // the generated readme includes escape characters which actually get rendered, remove them
    .replace(/ \\\| /g, " | ")

    // markdown uses relative paths for component links
    .replace(/\.\.\//g, "https://github.com/Esri/calcite-design-system/tree/main/src/components/");

export interface KnobbedAttribute {
  name: string;
  value: ReturnType<
    | typeof boolean
    | typeof color
    | typeof date
    | typeof number
    | typeof array
    | typeof files
    | typeof button
    | typeof object
    | typeof radios
    | typeof options
    | typeof select
    | typeof text
  >;
}

export interface SimpleAttribute {
  name: string;
  value: string | boolean | number;
}

export type Attribute = KnobbedAttribute | SimpleAttribute;
export type Attributes = Attribute[];

interface DeferredAttribute {
  name: string;
  commit: () => Attribute;
}

export const createComponentHTML = (
  tagName: string,
  attributes: Attributes,
  contentHTML: string = ""
): string =>
  `<${tagName} ${attributes
    .map(({ name, value }) => {
      const booleanAttr = typeof value === "boolean";
      if (booleanAttr) {
        return value ? name : "";
      }
      return `${name}="${value}"`;
    })
    .join(" ")}>${contentHTML}</${tagName}>`;

export const globalDocsPage: typeof DocsPage = () => (
  <React.Fragment>
    {/* omit <Title /> as Description includes it (from component READMEs) */}
    <Description />
  </React.Fragment>
);

export const filterComponentAttributes = (
  attributesList: DeferredAttribute[],
  exceptions: string[]
): Attributes => {
  if (!exceptions.length) {
    return attributesList.map((attr) => attr.commit());
  }
  return attributesList
    .filter((attr) => !exceptions.find((except) => except === attr.name))
    .map((attr) => attr.commit());
};
