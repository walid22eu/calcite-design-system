import { boolean, select, text } from "@storybook/addon-knobs";

import { storyFilters } from "../../../.storybook/helpers";
import { ATTRIBUTES } from "../../../.storybook/resources";
import {
  Attribute,
  Attributes,
  createComponentHTML as create,
  filterComponentAttributes,
  modesDarkDefault
} from "../../../.storybook/utils";
import { html } from "../../../support/formatting";
import { locales } from "../../utils/locale";
import readme from "./readme.md";
const { scale } = ATTRIBUTES;

export default {
  title: "Components/Controls/DatePicker",
  parameters: {
    notes: readme,
    chromatic: {
      // https://www.chromatic.com/docs/threshold
      diffThreshold: Number(process.env.CHROMATIC_DIFF_THRESHOLD) || 0.3,
      delay: 500
    }
  },
  ...storyFilters()
};

const createAttributes: (options?: { exceptions: string[] }) => Attributes = ({ exceptions } = { exceptions: [] }) => {
  return filterComponentAttributes(
    [
      {
        name: "dir",
        commit(): Attribute {
          this.value = text("dir", "");
          delete this.build;
          return this;
        }
      },
      {
        name: "lang",
        commit(): Attribute {
          this.value = select("lang", locales, "en");
          delete this.build;
          return this;
        }
      },
      {
        name: "max",
        commit(): Attribute {
          this.value = text("max", "");
          delete this.build;
          return this;
        }
      },
      {
        name: "min",
        commit(): Attribute {
          this.value = text("min", "");
          delete this.build;
          return this;
        }
      },
      {
        name: "next-month-label",
        commit(): Attribute {
          this.value = text("next-month-label", "");
          delete this.build;
          return this;
        }
      },
      {
        name: "prev-month-label",
        commit(): Attribute {
          this.value = text("prev-month-label", "");
          delete this.build;
          return this;
        }
      },
      {
        name: "range",
        commit(): Attribute {
          this.value = boolean("range", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "scale",
        commit(): Attribute {
          this.value = select("scale", scale.values, scale.defaultValue);
          delete this.build;
          return this;
        }
      },
      {
        name: "value",
        commit(): Attribute {
          this.value = text("value", "2020-02-28");
          delete this.build;
          return this;
        }
      }
    ],
    exceptions
  );
};

export const simple = (): string =>
  html`<div style="width: 400px">${create("calcite-date-picker", createAttributes())}</div>`;

export const range = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["min", "range"] }).concat([
        { name: "min", value: "2016-08-09" },
        { name: "range", value: "true" }
      ])
    )}
  </div>`;

export const rangeRTL_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["min", "range", "dir"] }).concat([
        { name: "dir", value: "rtl" },
        { name: "min", value: "2016-08-09" },
        { name: "range", value: "true" }
      ])
    )}
  </div>`;

export const darkModeRTL_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["class", "dir"] }).concat([
        { name: "dir", value: "rtl" },
        { name: "class", value: "calcite-mode-dark" }
      ])
    )}
  </div>`;

darkModeRTL_TestOnly.parameters = { modes: modesDarkDefault };

export const bgLang_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create("calcite-date-picker", createAttributes({ exceptions: ["lang"] }).concat([{ name: "lang", value: "bg" }]))}
  </div>`;

export const ptPTLang_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang"] }).concat([{ name: "lang", value: "pt-PT" }])
    )}
  </div>`;

export const germanLang_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang", "value"] }).concat([
        { name: "lang", value: "de" },
        { name: "value", value: "2022-08-11" }
      ])
    )}
  </div>`;

export const spanishLang_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang", "value"] }).concat([
        { name: "lang", value: "es" },
        { name: "value", value: "2023-05-11" }
      ])
    )}
  </div>`;

export const norwegianLang_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang", "value"] }).concat([
        { name: "lang", value: "nb" },
        { name: "value", value: "2023-05-11" }
      ])
    )}
  </div>`;

export const britishLang_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang", "value"] }).concat([
        { name: "lang", value: "en-gb" },
        { name: "value", value: "2024-01-11" }
      ])
    )}
  </div>`;

export const chineseLang_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang", "value"] }).concat([
        { name: "lang", value: "zh-cn" },
        { name: "value", value: "2024-01-11" }
      ])
    )}
  </div>`;

export const arabLangNumberingSystem_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang", "numberingSystem"] }).concat([
        { name: "lang", value: "ar" },
        { name: "numbering-system", value: "arab" }
      ])
    )}
  </div>`;

arabLangNumberingSystem_TestOnly.parameters = {
  chromatic: { diffThreshold: 1 }
};

export const thaiLangNumberingSystem_TestOnly = (): string =>
  html`<div style="width: 400px">
    ${create(
      "calcite-date-picker",
      createAttributes({ exceptions: ["lang", "numberingSystem"] }).concat([
        { name: "lang", value: "th" },
        { name: "numbering-system", value: "thai" }
      ])
    )}
  </div>`;
