import { boolean } from "../../../.storybook/helpers";
import { themesDarkDefault } from "../../../.storybook/utils";
import { html, placeholderImage } from "../../tests/utils";
import readme from "./readme.md";

export default {
  title: "Components/Card",

  parameters: {
    notes: readme
  }
};

export const Simple = (): string => html`
  <div style="width:260px">
    <calcite-card ${boolean("loading", false)} ${boolean("selectable", false)}>
      <h3 slot="title">ArcGIS Online: Gallery and Organization pages</h3>
      <span slot="subtitle"
        >A great example of a study description that might wrap to a line or two, but isn't overly verbose.</span
      >
    </calcite-card>
  </div>
`;

export const SimpleWithLinks = (): string => html`
  <div style="width:260px">
    <calcite-card ${boolean("loading", false)} ${boolean("selectable", false)}>
      <h3 slot="title">ArcGIS Online: Gallery and Organization pages</h3>
      <span slot="subtitle"
        >A great example of a study description that might wrap to a line or two, but isn't overly verbose.</span
      >
      <calcite-link class="calcite-theme-dark" slot="footer-leading">Lead footer</calcite-link>
      <calcite-link class="calcite-theme-dark" slot="footer-trailing">Trail footer</calcite-link>
    </calcite-card>
  </div>
`;

SimpleWithLinks.storyName = "Simple with Links";

const footerThumbnail = `<img alt="footer thumbnail" slot="thumbnail" src="${placeholderImage({
  width: 380,
  height: 180
})}" style="width: 380px;" />`;

export const FooterButton = (): string => html`
  <div style="width:260px">
    <calcite-card ${boolean("loading", false)} ${boolean("selectable", false)}>
      ${footerThumbnail}
      <h3 slot="title">Untitled experience</h3>
      <span slot="subtitle">Subtext</span>
      <calcite-button slot="footer-leading" width="full">Go</calcite-button>
    </calcite-card>
  </div>
`;

export const FooterLinks = (): string => html`
  <div style="width:260px">
    <calcite-card ${boolean("loading", false)} ${boolean("selectable", false)}>
      ${footerThumbnail}
      <h3 slot="title">My perhaps multiline card title</h3>
      <span slot="subtitle"
        >A great example of a study description that might wrap to a line or two, but isn't overly verbose.</span
      >
      <calcite-link slot="footer-leading">Lead footer</calcite-link>
      <calcite-link slot="footer-trailing">Trail footer</calcite-link>
    </calcite-card>
  </div>
`;

export const FooterTextButtonsTooltips = (): string => html`
  <div style="width:260px">
    <calcite-tooltip-manager>
      <calcite-card ${boolean("loading", false)} ${boolean("selectable", false)}>
        ${footerThumbnail}
        <h3 slot="title">My great project that might wrap two lines</h3>
        <span slot="subtitle">Johnathan Smith</span>
        <span slot="footer-leading">Nov 25, 2018</span>
        <div slot="footer-trailing">
          <calcite-button id="card-icon-test-6" scale="s" appearance="transparent" color="neutral" icon-start="circle">
          </calcite-button>
          <calcite-button id="card-icon-test-7" scale="s" appearance="transparent" color="neutral" icon-start="circle">
          </calcite-button>
        </div>
      </calcite-card>
    </calcite-tooltip-manager>
  </div>
  <calcite-tooltip placement="top-start" reference-element="card-icon-test-6">Configure </calcite-tooltip>
  <calcite-tooltip placement="bottom-start" reference-element="card-icon-test-7">Delete </calcite-tooltip>
`;

FooterTextButtonsTooltips.storyName = "Footer Text, Buttons, Tooltips";

export const FooterButtonsTooltipsDropdown = (): string => html`
<div style="width:260px">
  <calcite-tooltip-manager>
    <calcite-card
    ${boolean("loading", false)}
    ${boolean("selectable", false)}
    >
      <img alt="" slot="thumbnail" src="${placeholderImage({
        width: 260,
        height: 160
      })}" style="width:260px;height:160px" />
      <h3 slot="title">Portland Businesses</h3>
      <span slot="subtitle">by
        <calcite-link href="">example_user</calcite-button>
      </span>
      <div>
        Created: Apr 22, 2019
        <br />
        Updated: Dec 9, 2019
        <br />
        View Count: 0
      </div>
      <calcite-button slot="footer-leading" color="neutral" scale="s"  id="card-icon-test-1" icon-start='circle'></calcite-button>
      <div slot="footer-trailing">
        <calcite-button scale="s" color="neutral" id="card-icon-test-2" icon-start='circle'></calcite-button>
        <calcite-button scale="s" color="neutral" id="card-icon-test-3" icon-start='circle'></calcite-button>
        <calcite-dropdown type="hover">
          <calcite-button id="card-icon-test-5" slot="dropdown-trigger" scale="s" color="neutral" icon-start='circle'></calcite-button>
          <calcite-dropdown-group selection-mode="none">
            <calcite-dropdown-item>View details</calcite-dropdown-item>
            <calcite-dropdown-item>Duplicate</calcite-dropdown-item>
            <calcite-dropdown-item>Delete</calcite-dropdown-item>
          </calcite-dropdown-group>
        </calcite-dropdown>
      </div>
    </calcite-card>
  </calcite-tooltip-manager>
</div>
<calcite-tooltip placement="bottom-start" reference-element="card-icon-test-1">My great tooltip example
</calcite-tooltip>
<calcite-tooltip placement="bottom-start" reference-element="card-icon-test-2">Sharing level: 2
</calcite-tooltip>
<calcite-tooltip placement="top-end" reference-element="card-icon-test-3">More...
</calcite-tooltip>
<calcite-tooltip placement="top-start" reference-element="card-icon-test-5">More options
</calcite-tooltip>
`;

FooterButtonsTooltipsDropdown.storyName = "Footer Buttons, Tooltips, Dropdown";

export const DarkThemeSimple = (): string => html`
  <div style="width:260px">
    <calcite-card class="calcite-theme-dark" ${boolean("loading", false)} ${boolean("selectable", false)}>
      <h3 slot="title">ArcGIS Online: Gallery and Organization pages</h3>
      <span slot="subtitle"
        >A great example of a study description that might wrap to a line or two, but isn't overly verbose.</span
      >
    </calcite-card>
  </div>
`;

DarkThemeSimple.storyName = "Dark Theme - Simple";
DarkThemeSimple.parameters = { themes: themesDarkDefault };

export const DarkThemeSimpleWithLinks = (): string => html`
  <div style="width:260px">
    <calcite-card class="calcite-theme-dark" ${boolean("loading", false)} ${boolean("selectable", false)}>
      <h3 slot="title">ArcGIS Online: Gallery and Organization pages</h3>
      <span slot="subtitle"
        >A great example of a study description that might wrap to a line or two, but isn't overly verbose.</span
      >
      <calcite-link slot="footer-leading">Lead footer</calcite-link>
      <calcite-link slot="footer-trailing">Trail footer</calcite-link>
    </calcite-card>
  </div>
`;

DarkThemeSimpleWithLinks.storyName = "Dark Theme - Simple with Links";
DarkThemeSimpleWithLinks.parameters = { themes: themesDarkDefault };

export const DarkThemeFooterButton = (): string => html`
  <div style="width:260px">
    <calcite-card class="calcite-theme-dark" ${boolean("loading", false)} ${boolean("selectable", false)}>
      ${footerThumbnail}
      <h3 slot="title">Untitled experience</h3>
      <span slot="subtitle">Subtext</span>
      <calcite-button slot="footer-leading" width="full">Go</calcite-button>
    </calcite-card>
  </div>
`;

DarkThemeFooterButton.storyName = "Dark Theme - Footer Button";
DarkThemeFooterButton.parameters = { themes: themesDarkDefault };

export const DarkThemeFooterLinks = (): string => html`
  <div style="width:260px">
    <calcite-card class="calcite-theme-dark" ${boolean("loading", false)} ${boolean("selectable", false)}>
      ${footerThumbnail}
      <h3 slot="title">My perhaps multiline card title</h3>
      <span slot="subtitle"
        >A great example of a study description that might wrap to a line or two, but isn't overly verbose.</span
      >
      <calcite-link slot="footer-leading">Lead footer</calcite-link>
      <calcite-link slot="footer-trailing">Trail footer</calcite-link>
    </calcite-card>
  </div>
`;

DarkThemeFooterLinks.storyName = "Dark Theme - Footer Links";
DarkThemeFooterLinks.parameters = { themes: themesDarkDefault };

export const DarkThemeFooterTextButtonsTooltips = (): string => html`
  <div style="width:260px">
    <calcite-tooltip-manager>
      <calcite-card class="calcite-theme-dark" ${boolean("loading", false)} ${boolean("selectable", false)}>
        ${footerThumbnail}
        <h3 slot="title">My great project that might wrap two lines</h3>
        <span slot="subtitle">Johnathan Smith</span>
        <span slot="footer-leading">Nov 25, 2018</span>
        <div slot="footer-trailing">
          <calcite-button id="card-icon-test-6" scale="s" appearance="transparent" color="neutral" icon-start="circle">
          </calcite-button>
          <calcite-button id="card-icon-test-7" scale="s" appearance="transparent" color="neutral" icon-start="circle">
          </calcite-button>
        </div>
      </calcite-card>
    </calcite-tooltip-manager>
  </div>
  <calcite-tooltip placement="bottom" class="calcite-theme-dark" reference-element="card-icon-test-6"
    >Configure
  </calcite-tooltip>
  <calcite-tooltip placement="bottom" class="calcite-theme-dark" reference-element="card-icon-test-7"
    >Delete
  </calcite-tooltip>
`;

DarkThemeFooterTextButtonsTooltips.storyName = "Dark Theme - Footer Text, Buttons, Tooltips";
DarkThemeFooterTextButtonsTooltips.parameters = { themes: themesDarkDefault };

export const DarkThemeFooterButtonsTooltipsDropdown = (): string => html`
  <div style="width:260px">
    <calcite-tooltip-manager>
      <calcite-card class="calcite-theme-dark" ${boolean("loading", false)} ${boolean("selectable", false)}>
        <img
          alt=""
          slot="thumbnail"
          src="${placeholderImage({ width: 260, height: 160 })}"
          style="width: 260px; height: 160px;"
        />
        <h3 slot="title">Portland Businesses</h3>
        <span slot="subtitle"
          >by
          <calcite-link href="">example_user</calcite-link>
        </span>
        <div>
          Created: Apr 22, 2019
          <br />
          Updated: Dec 9, 2019
          <br />
          View Count: 0
        </div>
        <calcite-button
          slot="footer-leading"
          color="neutral"
          scale="s"
          id="card-icon-test-1"
          icon-start="circle"
        ></calcite-button>
        <div slot="footer-trailing">
          <calcite-button
            class="calcite-theme-dark"
            color="neutral"
            scale="s"
            id="card-icon-test-2"
            icon-start="circle"
          ></calcite-button>
          <calcite-button
            class="calcite-theme-dark"
            color="neutral"
            scale="s"
            id="card-icon-test-3"
            icon-start="circle"
          ></calcite-button>
          <calcite-dropdown type="hover">
            <calcite-button
              class="calcite-theme-dark"
              color="neutral"
              id="card-icon-test-5"
              slot="dropdown-trigger"
              scale="s"
              icon-start="circle"
            ></calcite-button>
            <calcite-dropdown-group selection-mode="none">
              <calcite-dropdown-item>View details</calcite-dropdown-item>
              <calcite-dropdown-item>Duplicate</calcite-dropdown-item>
              <calcite-dropdown-item>Delete</calcite-dropdown-item>
            </calcite-dropdown-group>
          </calcite-dropdown>
        </div>
      </calcite-card>
    </calcite-tooltip-manager>
  </div>
  <calcite-tooltip
    class="calcite-theme-dark"
    label="bottom placed tooltip"
    placement="bottom-start"
    reference-element="card-icon-test-1"
    >My great tooltip example
  </calcite-tooltip>
  <calcite-tooltip
    class="calcite-theme-dark"
    label="bottom placed tooltip"
    placement="bottom-start"
    reference-element="card-icon-test-2"
    >Sharing level: 2
  </calcite-tooltip>
  <calcite-tooltip
    class="calcite-theme-dark"
    label="top end placed tooltip"
    placement="top-end"
    reference-element="card-icon-test-3"
    >More...
  </calcite-tooltip>
  <calcite-tooltip class="calcite-theme-dark" placement="top-start" reference-element="card-icon-test-5"
    >More options
  </calcite-tooltip>
`;

DarkThemeFooterButtonsTooltipsDropdown.storyName = "Dark Theme - Footer Buttons, Tooltips, Dropdown";
DarkThemeFooterButtonsTooltipsDropdown.parameters = { themes: themesDarkDefault };

export const RTL = (): string => html`
  <div style="width:260px" dir="rtl">
    <calcite-card ${boolean("loading", false)} ${boolean("selectable", false)}>
      <h3 slot="title">ArcGIS Online: Gallery and Organization pages</h3>
      <span slot="subtitle"
        >A great example of a study description that might wrap to a line or two, but isn't overly verbose.</span
      >
    </calcite-card>
  </div>
`;
