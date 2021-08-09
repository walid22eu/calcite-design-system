import { Config } from "@stencil/core";
import { postcss } from "@stencil/postcss";
import { sass } from "@stencil/sass";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { generatePreactTypes } from "./support/preact";

export const create: () => Config = () => ({
  buildEs5: "prod",
  namespace: "calcite",
  bundles: [
    { components: ["calcite-accordion", "calcite-accordion-item"] },
    { components: ["calcite-action"] },
    { components: ["calcite-action-bar"] },
    { components: ["calcite-action-menu"] },
    { components: ["calcite-action-pad"] },
    { components: ["calcite-alert"] },
    { components: ["calcite-avatar"] },
    { components: ["calcite-block", "calcite-block-section"] },
    { components: ["calcite-button"] },
    { components: ["calcite-card"] },
    { components: ["calcite-checkbox"] },
    { components: ["calcite-chip"] },
    { components: ["calcite-color-picker", "calcite-color-picker-hex-input", "calcite-color-picker-swatch"] },
    { components: ["calcite-combobox", "calcite-combobox-item-group", "calcite-combobox-item"] },
    {
      components: [
        "calcite-date-picker",
        "calcite-date-picker-month",
        "calcite-date-picker-month-header",
        "calcite-date-picker-day"
      ]
    },
    { components: ["calcite-dropdown", "calcite-dropdown-group", "calcite-dropdown-item"] },
    { components: ["calcite-icon"] },
    { components: ["calcite-inline-editable"] },
    { components: ["calcite-input"] },
    { components: ["calcite-input-date-picker"] },
    { components: ["calcite-input-message"] },
    { components: ["calcite-input-time-picker", "calcite-time-picker"] },
    { components: ["calcite-label"] },
    { components: ["calcite-link"] },
    { components: ["calcite-loader"] },
    { components: ["calcite-list", "calcite-list-item", "calcite-list-item-group"] },
    { components: ["calcite-modal"] },
    { components: ["calcite-notice"] },
    { components: ["calcite-pagination"] },
    { components: ["calcite-fab"] },
    { components: ["calcite-flow"] },
    { components: ["calcite-panel"] },
    { components: ["calcite-popover", "calcite-popover-manager"] },
    { components: ["calcite-progress"] },
    { components: ["calcite-pick-list", "calcite-pick-list-group", "calcite-pick-list-item"] },
    { components: ["calcite-radio-button", "calcite-radio"] },
    { components: ["calcite-radio-button-group"] },
    { components: ["calcite-radio-group", "calcite-radio-group-item"] },
    { components: ["calcite-rating"] },
    { components: ["calcite-scrim"] },
    { components: ["calcite-select", "calcite-option", "calcite-option-group"] },
    { components: ["calcite-shell", "calcite-shell-center-row", "calcite-shell-panel"] },
    { components: ["calcite-slider", "calcite-graph"] },
    { components: ["calcite-sortable-list"] },
    { components: ["calcite-split-button"] },
    { components: ["calcite-stepper", "calcite-stepper-item"] },
    { components: ["calcite-switch"] },
    { components: ["calcite-tab", "calcite-tab-title", "calcite-tab-nav", "calcite-tabs"] },
    { components: ["calcite-tip", "calcite-tip-group", "calcite-tip-manager"] },
    { components: ["calcite-tile"] },
    { components: ["calcite-tile-select-group", "calcite-tile-select"] },
    { components: ["calcite-tooltip", "calcite-tooltip-manager"] },
    { components: ["calcite-tree", "calcite-tree-item"] },
    { components: ["calcite-value-list", "calcite-value-list-item"] }
  ],
  outputTargets: [
    { type: "dist-hydrate-script" },
    { type: "dist-custom-elements-bundle" },
    { type: "dist" },
    { type: "docs-readme" },
    { type: "docs-json", file: "./dist/extras/docs-json.json" },
    { type: "custom", name: "preact", generator: generatePreactTypes },
    {
      type: "www",
      baseUrl: "https://stenciljs.com/",
      prerenderConfig: "./prerender.config.ts",
      copy: [
        { src: "demos", dest: "demos" },
        { src: "robots.txt", dest: "robots.txt" }
      ],
      serviceWorker: {
        unregister: true
      }
    }
  ],
  globalStyle: "src/assets/styles/global.scss",
  plugins: [
    sass({
      injectGlobalPaths: ["src/assets/styles/includes.scss"]
    }),
    postcss({
      plugins: [tailwind(), autoprefixer()]
    })
  ],
  testing: {
    moduleNameMapper: {
      "^/assets/(.*)$": "<rootDir>/src/tests/iconPathDataStub.ts"
    },
    setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"]
  },
  hydratedFlag: {
    selector: "attribute",
    name: "calcite-hydrated"
  },
  extras: {
    scriptDataOpts: true
  }
});

export const config = create();
