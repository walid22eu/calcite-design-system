import { boolean, select, text } from "@storybook/addon-knobs";
import { placeholderImage } from "../../../.storybook/placeholderImage";
import { html } from "../../../support/formatting";
import readme from "./readme.md";
import {
  Attribute,
  Attributes,
  filterComponentAttributes,
  themesDarkDefault,
  createComponentHTML as create
} from "../../../.storybook/utils";
import { storyFilters } from "../../../.storybook/helpers";
import { TEXT } from "./resources";
import { ATTRIBUTES } from "../../../.storybook/resources";

export default {
  title: "Components/Card",
  parameters: {
    notes: readme
  },
  ...storyFilters()
};

const createAttributes: (options?: { exceptions: string[] }) => Attributes = ({ exceptions } = { exceptions: [] }) => {
  const { logicalFlowPosition } = ATTRIBUTES;
  return filterComponentAttributes(
    [
      {
        name: "loading",
        commit(): Attribute {
          this.value = boolean("loading", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "selected",
        commit(): Attribute {
          this.value = boolean("selected", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "selectable",
        commit(): Attribute {
          this.value = boolean("selectable", false);
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-loading",
        commit(): Attribute {
          this.value = text("intl-loading", TEXT.loading);
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-select",
        commit(): Attribute {
          this.value = text("intl-select", TEXT.select);
          delete this.build;
          return this;
        }
      },
      {
        name: "intl-deselect",
        commit(): Attribute {
          this.value = text("intl-deselect", TEXT.deselect);
          delete this.build;
          return this;
        }
      },
      {
        name: "thumbnail-position",
        commit(): Attribute {
          this.value = select("thumbnail-position", logicalFlowPosition.values, logicalFlowPosition.defaultValue);
          delete this.build;
          return this;
        }
      }
    ],
    exceptions
  );
};

const titleHtml = html`
  <h3 slot="title">ArcGIS Online: Gallery and Organization pages</h3>
  <span slot="subtitle">
    A great example of a study description that might wrap to a line or two, but isn't overly verbose.
  </span>
`;

const footerButtonHtml = html` <calcite-button slot="footer-leading" width="full">Go</calcite-button> `;

const footerLeadingTextHtml = html`<span slot="footer-leading">Nov 25, 2018</span>`;

const footerLinksHtml = html`
  <calcite-link class="calcite-theme-dark" slot="footer-leading">Lead footer</calcite-link>
  <calcite-link class="calcite-theme-dark" slot="footer-trailing">Trail footer</calcite-link>
`;

const thumbnailHtml = html`<img
  alt="thumbnail"
  slot="thumbnail"
  src="${placeholderImage({
    width: 380,
    height: 180
  })}"
  style="width: 380px;"
/> `;

const footerTrailingButtonsHtml = html`
  <div slot="footer-trailing">
    <calcite-button id="card-icon-test-6" scale="s" appearance="transparent" color="neutral" icon-start="circle">
    </calcite-button>
    <calcite-button id="card-icon-test-7" scale="s" appearance="transparent" color="neutral" icon-start="circle">
    </calcite-button>
  </div>
`;

const tooltipHtml = html`
  <calcite-tooltip placement="top-start" reference-element="card-icon-test-6">Configure</calcite-tooltip>
  <calcite-tooltip placement="bottom-start" reference-element="card-icon-test-7">Delete</calcite-tooltip>
`;

export const simple = (): string => html` <div style="width: 260px">
  ${create("calcite-card", createAttributes(), titleHtml)}
</div>`;

export const simpleWithFooterLinks = (): string => html`
  <div style="width:260px">${create("calcite-card", createAttributes(), html`${titleHtml}${footerLinksHtml}`)}</div>
`;

export const simpleWithFooterButton = (): string => html`
  <div style="width:260px">${create("calcite-card", createAttributes(), html`${titleHtml}${footerButtonHtml}`)}</div>
`;

export const simpleWithFooterTextButtonTooltip_NoTest = (): string => html`
  <div style="width:260px">
    ${create(
      "calcite-card",
      createAttributes(),
      html`${titleHtml}${footerLeadingTextHtml}${footerTrailingButtonsHtml}`
    )}
  </div>
  ${tooltipHtml}
`;

export const thumbnail = (): string => html`
  <div style="width:260px">
    ${create(
      "calcite-card",
      createAttributes(),
      html`
        ${thumbnailHtml}
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
          <calcite-button scale="s" color="neutral" id="card-icon-test-2" icon-start="circle"></calcite-button>
          <calcite-button scale="s" color="neutral" id="card-icon-test-3" icon-start="circle"></calcite-button>
          <calcite-dropdown type="hover">
            <calcite-button
              id="card-icon-test-5"
              slot="dropdown-trigger"
              scale="s"
              color="neutral"
              icon-start="circle"
            ></calcite-button>
            <calcite-dropdown-group selection-mode="none">
              <calcite-dropdown-item>View details</calcite-dropdown-item>
              <calcite-dropdown-item>Duplicate</calcite-dropdown-item>
              <calcite-dropdown-item>Delete</calcite-dropdown-item>
            </calcite-dropdown-group>
          </calcite-dropdown>
        </div>
      `
    )}
    <calcite-tooltip placement="bottom-start" reference-element="card-icon-test-1"
      >My great tooltip example
    </calcite-tooltip>
    <calcite-tooltip placement="bottom-start" reference-element="card-icon-test-2">Sharing level: 2 </calcite-tooltip>
    <calcite-tooltip placement="top-end" reference-element="card-icon-test-3">More... </calcite-tooltip>
    <calcite-tooltip placement="top-start" reference-element="card-icon-test-5">More options </calcite-tooltip>
  </div>
`;

export const thumbnailRounded = (): string => html`
  <div id="card-container" style="width:260px;">
    <style>
      calcite-card {
        --calcite-border-radius-base: 12px;
      }
    </style>
    <calcite-card>
      ${thumbnailHtml}
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
    </calcite-card>
  </div>
`;

export const headerDoesNotOverlapWithCheckbox_TestOnly = (): string => html`
  <calcite-card selectable style="width:260px">
    <h3 slot="title">Pokem ipsum dolor sit amet Skitty Hoothoot</h3>
    <span slot="subtitle"
      >Pika-pi Soul Badge Zoroark Starly Spoink Diglett Rotom. Water Kyogre Hitmontop Rampardos</span
    >
    <p>
      Team Rocket Whimsicott Snover Duskull Servine Kakuna Bellsprout. Scratch Shelgon Oddish Hitmonchan Quagsire Earth
      Badge Leaf Green. Pika-pi Bonsly Rare Candy Seadra blast off at the speed of light Shellos Kirlia. Celadon City
      Seviper Omanyte Espeon Body Slam Victini Darumaka. Normal Krookodile Junichi Masuda Machoke Body Slam Zigzagoon to
      protect the world from devastation.
    </p>
  </calcite-card>
`;

export const darkThemeRTL_TestOnly = (): string => html`
  <div dir="rtl" style="width:260px;">
    <calcite-card>${thumbnailHtml}${titleHtml}${footerLeadingTextHtml}${footerTrailingButtonsHtml}</calcite-card>
  </div>
`;

darkThemeRTL_TestOnly.parameters = { themes: themesDarkDefault };
