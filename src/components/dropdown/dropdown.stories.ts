import { number, select } from "@storybook/addon-knobs";
import { boolean, createSteps, stepStory } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import readme1 from "./readme.md";
import readme2 from "../dropdown-group/readme.md";
import readme3 from "../dropdown-item/readme.md";
import { defaultMenuPlacement, popperMenuPlacements } from "../../utils/popper";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Buttons/Dropdown",

  parameters: {
    notes: [readme1, readme2, readme3]
  }
};

export const Simple = (): string => html`
  <calcite-dropdown
    active
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Sort by"
    >
      <calcite-dropdown-item>Relevance</calcite-dropdown-item>
      <calcite-dropdown-item active>Date modified</calcite-dropdown-item>
      <calcite-dropdown-item>Title</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

export const WithIcons = (): string => html`
  <calcite-dropdown
    active
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Icon Start"
    >
      <calcite-dropdown-item icon-start="list">List</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="grid" active>Grid</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="table">Table</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Icon End"
    >
      <calcite-dropdown-item icon-end="list">List</calcite-dropdown-item>
      <calcite-dropdown-item icon-end="grid" active>Grid</calcite-dropdown-item>
      <calcite-dropdown-item icon-end="table">Table</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Icon Both"
    >
      <calcite-dropdown-item icon-start="list" icon-end="data-check">List</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="grid" icon-end="data-check" active>Grid</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="table" icon-end="data-check">Table</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

export const GroupsAndSelectionModes = (): string => html`
  <calcite-dropdown
    active
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group group-title="Select one">
      <calcite-dropdown-item>Apple</calcite-dropdown-item>
      <calcite-dropdown-item active>Orange</calcite-dropdown-item>
      <calcite-dropdown-item>Grape</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group group-title="Select multi" selection-mode="multi">
      <calcite-dropdown-item>Asparagus</calcite-dropdown-item>
      <calcite-dropdown-item active>Potato</calcite-dropdown-item>
      <calcite-dropdown-item active>Yam</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group group-title="Select none (useful for actions)" selection-mode="none">
      <calcite-dropdown-item>Plant beans</calcite-dropdown-item>
      <calcite-dropdown-item>Add peas</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

GroupsAndSelectionModes.storyName = "Groups and selection modes";

export const ItemsAsLinks = (): string => html`
  <calcite-dropdown
    active
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group selection-mode="none" group-title="Select one">
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title"
        >Throw Apples</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title"
        >Visit Oranges</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title"
        >Eat Grapes</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title" icon-start="camera-flash-on"
        >Plant beans</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title" icon-end="camera-flash-on"
        >Add peas</calcite-dropdown-item
      >
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

ItemsAsLinks.storyName = "Items as Links";

export const AMixOfLinksAndNonLinks = (): string => html`
  <calcite-dropdown
    active
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group selection-mode="none" group-title="Select one">
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title">A link</calcite-dropdown-item>
      <calcite-dropdown-item onclick='alert("not a link")'>Not a link</calcite-dropdown-item>
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title"
        >Another Link</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title" icon-end="camera-flash-on"
        >Another link that might wrap to another line</calcite-dropdown-item
      >
      <calcite-dropdown-item onclick='alert("not a link")'>Not a link</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

AMixOfLinksAndNonLinks.storyName = "A mix of links and non-links";

export const DarkTheme = (): string => html`
  <calcite-dropdown
    active
    class="calcite-theme-dark"
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Sort by"
    >
      <calcite-dropdown-item>Relevance</calcite-dropdown-item>
      <calcite-dropdown-item active>Date modified</calcite-dropdown-item>
      <calcite-dropdown-item>Title</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

DarkTheme.storyName = "Dark theme";
DarkTheme.parameters = { themes: themesDarkDefault };

export const WithIconsDarkTheme = (): string => html`
  <calcite-dropdown
    active
    class="calcite-theme-dark"
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Icon Start"
    >
      <calcite-dropdown-item icon-start="list">List</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="grid" active>Grid</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="table">Table</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Icon End"
    >
      <calcite-dropdown-item icon-end="list">List</calcite-dropdown-item>
      <calcite-dropdown-item icon-end="grid" active>Grid</calcite-dropdown-item>
      <calcite-dropdown-item icon-end="table">Table</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Icon Both"
    >
      <calcite-dropdown-item icon-start="list" icon-end="data-check">List</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="grid" icon-end="data-check" active>Grid</calcite-dropdown-item>
      <calcite-dropdown-item icon-start="table" icon-end="data-check">Table</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

WithIconsDarkTheme.storyName = "With Icons - Dark theme";
WithIconsDarkTheme.parameters = { themes: themesDarkDefault };

export const GroupsAndSelectionModesDarkTheme = (): string => html`
  <calcite-dropdown
    active
    class="calcite-theme-dark"
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group group-title="Select one">
      <calcite-dropdown-item>Apple</calcite-dropdown-item>
      <calcite-dropdown-item active>Orange</calcite-dropdown-item>
      <calcite-dropdown-item>Grape</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group group-title="Select multi" selection-mode="multi">
      <calcite-dropdown-item>Asparagus</calcite-dropdown-item>
      <calcite-dropdown-item active>Potato</calcite-dropdown-item>
      <calcite-dropdown-item active>Yam</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group group-title="Select none (useful for actions)" selection-mode="none">
      <calcite-dropdown-item>Plant beans</calcite-dropdown-item>
      <calcite-dropdown-item>Add peas</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

GroupsAndSelectionModesDarkTheme.storyName = "Groups and selection modes dark theme";
GroupsAndSelectionModesDarkTheme.parameters = { themes: themesDarkDefault };

export const ItemsAsLinksDarkTheme = (): string => html`
  <calcite-dropdown
    active
    class="calcite-theme-dark"
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group selection-mode="none" group-title="Select one">
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title"
        >Throw Apples</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title"
        >Visit Oranges</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title"
        >Eat Grapes</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title" icon-start="camera-flash-on"
        >Plant beans</calcite-dropdown-item
      >
      <calcite-dropdown-item href="http://google.com" target="_blank" title="Test title" icon-end="camera-flash-on"
        >Add peas</calcite-dropdown-item
      >
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

ItemsAsLinksDarkTheme.storyName = "Items as Links - dark theme";
ItemsAsLinksDarkTheme.parameters = { themes: themesDarkDefault };

export const SimpleRtl = (): string => html`
  <calcite-dropdown
    active
    dir="rtl"
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group
      selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
      group-title="Sort by"
    >
      <calcite-dropdown-item>Relevance</calcite-dropdown-item>
      <calcite-dropdown-item active>Date modified</calcite-dropdown-item>
      <calcite-dropdown-item>Title</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

SimpleRtl.storyName = "Simple - RTL";

export const ScrollingAfterCertainItems = (): string => html`
  <calcite-dropdown
    active
    placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
    max-items="${number("max-items", 7, { min: 0, max: 10, step: 1 })}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    width="${select("width", ["s", "m", "l"], "m")}"
    type="${select("type", ["click", "hover"], "click")}"
    ${boolean("disable-close-on-select", false)}
    ${boolean("disabled", false)}
  >
    <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
    <calcite-dropdown-group group-title="First group">
      <calcite-dropdown-item>1</calcite-dropdown-item>
      <calcite-dropdown-item>2</calcite-dropdown-item>
      <calcite-dropdown-item>3</calcite-dropdown-item>
      <calcite-dropdown-item>4</calcite-dropdown-item>
      <calcite-dropdown-item>5</calcite-dropdown-item>
    </calcite-dropdown-group>
    <calcite-dropdown-group group-title="Second group">
      <calcite-dropdown-item>6</calcite-dropdown-item>
      <calcite-dropdown-item>7</calcite-dropdown-item>
      <calcite-dropdown-item>8</calcite-dropdown-item>
      <calcite-dropdown-item>9</calcite-dropdown-item>
      <calcite-dropdown-item>10</calcite-dropdown-item>
    </calcite-dropdown-group>
  </calcite-dropdown>
`;

ScrollingAfterCertainItems.storyName = "Scrolling after certain items";

export const FlipPositioning = stepStory(
  (): string => html`
    <div style="margin:10px;">
      <calcite-dropdown placement="${select("placement", popperMenuPlacements, "top")}">
        <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
        <calcite-dropdown-item>1</calcite-dropdown-item>
        <calcite-dropdown-item>2</calcite-dropdown-item>
        <calcite-dropdown-item>3</calcite-dropdown-item>
        <calcite-dropdown-item>4</calcite-dropdown-item>
        <calcite-dropdown-item>5</calcite-dropdown-item>
      </calcite-dropdown>
    </div>
  `,
  createSteps("calcite-dropdown").snapshot("Default").click("calcite-button").snapshot("Open")
);
FlipPositioning.parameters = {
  layout: "fullscreen"
};

export const disabled = (): string => html` <calcite-dropdown disabled>
  <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
  <calcite-dropdown-group group-title="First group">
    <calcite-dropdown-item>1</calcite-dropdown-item>
    <calcite-dropdown-item>2</calcite-dropdown-item>
    <calcite-dropdown-item>3</calcite-dropdown-item>
    <calcite-dropdown-item>4</calcite-dropdown-item>
    <calcite-dropdown-item>5</calcite-dropdown-item>
  </calcite-dropdown-group>
  <calcite-dropdown-group group-title="Second group">
    <calcite-dropdown-item>6</calcite-dropdown-item>
    <calcite-dropdown-item>7</calcite-dropdown-item>
    <calcite-dropdown-item>8</calcite-dropdown-item>
    <calcite-dropdown-item>9</calcite-dropdown-item>
    <calcite-dropdown-item>10</calcite-dropdown-item>
  </calcite-dropdown-group>
</calcite-dropdown>`;

export const AlignedCenter = (): string => html`
  <div style="text-align:center">
    <calcite-dropdown
      active
      placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      width="${select("width", ["s", "m", "l"], "m")}"
      type="${select("type", ["click", "hover"], "click")}"
      ${boolean("disable-close-on-select", false)}
      ${boolean("disabled", false)}
    >
      <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
      <calcite-dropdown-group
        selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
        group-title="Sort by"
      >
        <calcite-dropdown-item>Relevance</calcite-dropdown-item>
        <calcite-dropdown-item active>Date modified</calcite-dropdown-item>
        <calcite-dropdown-item>Title</calcite-dropdown-item>
      </calcite-dropdown-group>
    </calcite-dropdown>
  </div>
`;

export const AlignedCenterRTL = (): string => html`
  <div dir="rtl" style="text-align:center">
    <calcite-dropdown
      active
      placement="${select("placement", popperMenuPlacements, defaultMenuPlacement)}"
      scale="${select("scale", ["s", "m", "l"], "m")}"
      width="${select("width", ["s", "m", "l"], "m")}"
      type="${select("type", ["click", "hover"], "click")}"
      ${boolean("disable-close-on-select", false)}
      ${boolean("disabled", false)}
    >
      <calcite-button slot="dropdown-trigger">Open Dropdown</calcite-button>
      <calcite-dropdown-group
        selection-mode="${select("group selection mode", ["single", "multi", "none"], "single")}"
        group-title="Sort by"
      >
        <calcite-dropdown-item>Relevance</calcite-dropdown-item>
        <calcite-dropdown-item active>Date modified</calcite-dropdown-item>
        <calcite-dropdown-item>Title</calcite-dropdown-item>
      </calcite-dropdown-group>
    </calcite-dropdown>
  </div>
`;
