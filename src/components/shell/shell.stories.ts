import { boolean, select } from "@storybook/addon-knobs";
import {
  filterComponentAttributes,
  Attributes,
  createComponentHTML as create,
  placeholderImage
} from "../../../.storybook/utils";
import { ATTRIBUTES } from "../../../.storybook/resources";
import readme from "./readme.md";
import panelReadme from "../shell-panel/readme.md";
import centerRowReadme from "../shell-center-row/readme.md";
import { html } from "../../../support/formatting";

export default {
  title: "Components/Shell",
  parameters: {
    notes: [readme, panelReadme, centerRowReadme]
  }
};

const createAttributes: (group: string, options?: { exceptions: string[] }) => Attributes = (
  group,
  { exceptions } = { exceptions: [] }
) => {
  return filterComponentAttributes([], exceptions);
};

const createShellPanelAttributes: (group: "Leading Panel" | "Trailing Panel", resizable?: boolean) => Attributes = (
  group,
  resizable = false
) => {
  const { position } = ATTRIBUTES;

  return [
    {
      name: "slot",
      value: group === "Leading Panel" ? "panel-start" : "panel-end"
    },
    {
      name: "collapsed",
      value: boolean("collapsed", false, group)
    },
    {
      name: "detached",
      value: boolean("detached", false, group)
    },
    {
      name: "position",
      value: select(
        "position",
        position.values,
        group === "Leading Panel" ? position.values[0] : position.values[1],
        group
      )
    },
    {
      name: "resizable",
      value: boolean("resizable", resizable, group)
    }
  ];
};

const createShellCenterRowAttributes: (group: string) => Attributes = (group) => {
  const { position, scale } = ATTRIBUTES;

  return [
    {
      name: "detached",
      value: boolean("detached", false, group)
    },
    {
      name: "height-scale",
      value: select("heightScale", scale.values, scale.values[0], group)
    },
    {
      name: "position",
      value: select("position", position.values, position.values[1], group)
    },
    {
      name: "slot",
      value: "center-row"
    }
  ];
};

const actionBarStartContentHTML = html`
  <calcite-action-group>
    <calcite-action text="Add" label="Add Item" icon="plus"></calcite-action>
    <calcite-action text="Save" label="Save Item" icon="save"></calcite-action>
  </calcite-action-group>
  <calcite-action-group>
    <calcite-action text="Layers" label="View Layers" icon="layers"></calcite-action>
  </calcite-action-group>
`;

const actionBarEndContentHTML = html`
  <calcite-action-group>
    <calcite-action text="Idea" label="Add Item" icon="lightbulb"></calcite-action>
    <calcite-action text="Information" label="Save Item" icon="information"></calcite-action>
  </calcite-action-group>
  <calcite-action-group>
    <calcite-action text="Question" label="View Layers" icon="question"></calcite-action>
  </calcite-action-group>
`;

const actionBarStartHTML = html`
  <calcite-action-bar class="calcite-theme-dark" slot="action-bar"> ${actionBarStartContentHTML} </calcite-action-bar>
`;

const actionBarEndHTML = html`
  <calcite-action-bar slot="action-bar"> ${actionBarEndContentHTML} </calcite-action-bar>
`;

const leadingPanelHTML = html`
  ${actionBarStartHTML}
  <p>My Leading Panel</p>
`;

const centerRowHTML = html`
  <div
    style="
    width:50vw;
    background-color: var(--calcite-app-background-content);
    padding: var(--calcite-app-cap-spacing) var(--calcite-app-side-spacing);
    "
  >
    <span>My Shell Center Row</span>
  </div>
`;

const trailingPanelHTML = html`
  ${actionBarEndHTML}
  <p>My Trailing Panel</p>
`;

const headerHTML = html`
  <header slot="header">
    <h2>My Shell Header</h2>
  </header>
`;

const footerHTML = `<footer slot="footer">My Shell Footer</footer>`;

const contentHTML = html`
  <div
    style="
    width:100%;
    height:100%;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  "
  ></div>
`;

const centerRowAdvancedHTML = html`
  <calcite-tip-manager slot="center-row">
    <calcite-tip-group group-title="Astronomy">
      <calcite-tip heading="The Red Rocks and Blue Water">
        <img slot="thumbnail" src="${placeholderImage({ width: 1000, height: 600 })}" alt="This is an image." />
        <p>
          This tip is how a tip should really look. It has a landscape or square image and a small amount of text
          content. This paragraph is in an "info" slot.
        </p>
        <p>
          This is another paragraph in a subsequent "info" slot. In publishing and graphic design, Lorem ipsum is a
          placeholder text commonly used to demonstrate the visual form of a document without relying on meaningful
          content (also called greeking). Replacing the actual content with placeholder text allows designers to design
          the form of the content before the content itself has been produced.
        </p>
        <a href="http://www.esri.com">This is the "link" slot.</a>
      </calcite-tip>
      <calcite-tip heading="The Long Trees">
        <img slot="thumbnail" src="${placeholderImage({ width: 1000, height: 600 })}" alt="This is an image." />
        <p>This tip has an image that is a pretty tall. And the text will run out before the end of the image.</p>
        <p>In astronomy, the terms object and body are often used interchangeably.</p>
        <a href="http://www.esri.com">View Esri</a>
      </calcite-tip>
    </calcite-tip-group>
    <calcite-tip heading="Square Nature">
      <img slot="thumbnail" src="${placeholderImage({ width: 1000, height: 1000 })}" alt="This is an image." />
      <p>This tip has an image that is square. And the text will run out before the end of the image.</p>
      <p>In astronomy, the terms object and body are often used interchangeably.</p>
      <p>
        In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form
        of a document without relying on meaningful content (also called greeking). Replacing the actual content with
        placeholder text allows designers to design the form of the content before the content itself has been produced.
      </p>
      <a href="http://www.esri.com">View Esri</a>
    </calcite-tip>
    <calcite-tip heading="The lack of imagery">
      <p>This tip has no image. As such, the content area will take up the entire width of the tip.</p>
      <p>
        This is the next paragraph and should show how wide the content area is now. Of course, the width of the overall
        tip will affect things. In astronomy, the terms object and body are often used interchangeably.
      </p>
      <a href="http://www.esri.com">View Esri</a>
    </calcite-tip>
  </calcite-tip-manager>
`;

export const basic = (): string =>
  create(
    "calcite-shell",
    createAttributes("Shell"),
    html`
      ${headerHTML} ${create("calcite-shell-panel", createShellPanelAttributes("Leading Panel"), leadingPanelHTML)}
      ${contentHTML} ${create("calcite-shell-center-row", createShellCenterRowAttributes("Center Row"), centerRowHTML)}
      ${create("calcite-shell-panel", createShellPanelAttributes("Trailing Panel"), trailingPanelHTML)} ${footerHTML}
    `
  );

export const RTL = (): string =>
  create(
    "calcite-shell",
    createAttributes("Shell", { exceptions: ["dir"] }).concat({ name: "dir", value: "rtl" }),
    html`
      ${headerHTML} ${create("calcite-shell-panel", createShellPanelAttributes("Leading Panel"), leadingPanelHTML)}
      ${contentHTML} ${create("calcite-shell-center-row", createShellCenterRowAttributes("Center Row"), centerRowHTML)}
      ${create("calcite-shell-panel", createShellPanelAttributes("Trailing Panel"), trailingPanelHTML)} ${footerHTML}
    `
  );

// TODO: UPDATE
const advancedLeadingPanelHTML = html`
  ${actionBarStartHTML}
  <calcite-block collapsible open heading="Start Content" summary="This is the primary.">
    <calcite-block-content>
      <calcite-action text="Play" text-enabled indicator icon="play"></calcite-action>
      <calcite-action text="Extent" text-enabled icon="extent"></calcite-action>
      <calcite-action text="Chart" text-enabled icon="arrow-up-right"></calcite-action>
    </calcite-block-content>
  </calcite-block>
  <calcite-block collapsible open heading="Another Block" summary="This is the primary.">
    <calcite-block-content>
      <div style="height: 300px;">
        <p>Cool thing.</p>
      </div>
    </calcite-block-content>
  </calcite-block>
  <calcite-block collapsible open heading="Additional Block" summary="This is the primary.">
    <calcite-block-content>
      <div style="height: 300px;">
        <p>Cool thing.</p>
      </div>
    </calcite-block-content>
  </calcite-block>
  <calcite-block collapsible open heading="More Block" summary="This is the primary.">
    <calcite-block-content>
      <div style="height: 300px;">
        <p>Cool thang.</p>
      </div>
    </calcite-block-content>
  </calcite-block>
`;

// TODO: UPDATE
const advancedTrailingPanelHTMl = html`
  ${actionBarEndHTML}
  <calcite-flow>
    <calcite-panel heading="Layer settings">
      <calcite-action slot="header-menu-actions" text="Cool thing" text-enabled></calcite-action>
      <calcite-action slot="header-menu-actions" text="Cool thing" text-enabled></calcite-action>
      <calcite-action slot="header-menu-actions" text="Cool thing" text-enabled></calcite-action>
      <calcite-block collapsible open heading="End Content" summary="Select goodness">
        <calcite-block-content>
          <img alt="demo" src="${placeholderImage({ width: 640, height: 480 })}" width="100%" />
          <calcite-block-section text="Cool things">
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
          </calcite-block-section>
          <calcite-block-section text="Neat things">
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
          </calcite-block-section>
        </calcite-block-content>
      </calcite-block>
      <calcite-button slot="footer-actions" width="half" appearance="clear">Cancel</calcite-button>
      <calcite-button slot="footer-actions" width="half">Save</calcite-button>
    </calcite-panel>
    <calcite-panel heading="Deeper flow item">
      <calcite-block collapsible open heading="End Content" summary="Select goodness">
        <calcite-block-content>
          <calcite-block-section text="Cool things">
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
          </calcite-block-section>
          <img alt="demo" src="${placeholderImage({ width: 640, height: 480 })}" width="100%" />
          <calcite-block-section text="Neat things">
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
          </calcite-block-section>
        </calcite-block-content>
      </calcite-block>
      <calcite-block collapsible open heading="Even more content" summary="Select goodness">
        <calcite-block-content>
          <calcite-block-section text="Cool things">
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
          </calcite-block-section>
          <img alt="demo" src="${placeholderImage({ width: 640, height: 480 })}" width="100%" />
          <calcite-block-section text="Neat things">
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
            <calcite-action text="Cool thing" text-enabled></calcite-action>
          </calcite-block-section>
        </calcite-block-content>
      </calcite-block>
      <calcite-button slot="footer-actions" width="half" appearance="clear">Cancel</calcite-button>
      <calcite-button slot="footer-actions" width="half">Save</calcite-button>
    </calcite-panel>
  </calcite-flow>
`;

export const advanced = (): string =>
  create(
    "calcite-shell",
    createAttributes("Shell"),
    html`
      ${headerHTML}
      ${create("calcite-shell-panel", createShellPanelAttributes("Leading Panel", true), advancedLeadingPanelHTML)}
      ${contentHTML} ${centerRowAdvancedHTML}
      ${create("calcite-shell-panel", createShellPanelAttributes("Trailing Panel", true), advancedTrailingPanelHTMl)}
      ${footerHTML}
    `
  );

export const advancedRTL = (): string =>
  create(
    "calcite-shell",
    createAttributes("Shell", { exceptions: ["dir"] }).concat({ name: "dir", value: "rtl" }),
    html`
      ${headerHTML}
      ${create("calcite-shell-panel", createShellPanelAttributes("Leading Panel"), advancedLeadingPanelHTML)}
      ${contentHTML} ${centerRowAdvancedHTML}
      ${create("calcite-shell-panel", createShellPanelAttributes("Trailing Panel"), advancedTrailingPanelHTMl)}
      ${footerHTML}
    `
  );

export const dismissedPanels = (): string => html`<calcite-shell content-behind>
  <calcite-shell-panel slot="panel-start" detached>
    <calcite-action-bar slot="action-bar">
      <calcite-action data-action-id="layers" icon="layers" text="Layers"></calcite-action>
      <calcite-action data-action-id="basemaps" icon="basemap" text="Basemaps"></calcite-action>
      <calcite-action data-action-id="legend" icon="legend" text="Legend"></calcite-action>
      <calcite-action data-action-id="bookmarks" icon="bookmark" text="Bookmarks"></calcite-action>
      <calcite-action data-action-id="print" icon="print" text="Print"></calcite-action>
    </calcite-action-bar>
    <calcite-panel heading="Layers" height-scale="l" data-panel-id="layers" dismissible dismissed>
      <div id="layers-container"></div>
    </calcite-panel>
    <calcite-panel heading="Basemaps" height-scale="l" data-panel-id="basemaps" dismissible dismissed>
      <div id="basemaps-container"></div>
    </calcite-panel>
    <calcite-panel heading="Legend" height-scale="l" data-panel-id="legend" dismissible dismissed>
      <div id="legend-container"></div>
    </calcite-panel>
    <calcite-panel heading="Bookmarks" height-scale="l" data-panel-id="bookmarks" dismissible dismissed>
      <div id="bookmarks-container"></div>
    </calcite-panel>
    <calcite-panel heading="Print" height-scale="l" data-panel-id="print" dismissible dismissed>
      <div id="print-container"></div>
    </calcite-panel>
  </calcite-shell-panel>
</calcite-shell>`;

export const endPanelOnly = (): string =>
  html`<calcite-shell content-behind>
    <header slot="header">
      <h2>My Shell Header</h2>
    </header>
    <div
      style="
width:100%;
height:100%;
background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size: 20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
"
    ></div>
    <calcite-shell-panel slot="panel-end" position="end" detached>
      <calcite-action-bar slot="action-bar">
        <calcite-action-group layout="vertical">
          <calcite-action text="Idea" label="Add Item" icon="lightbulb" appearance="solid" scale="m"></calcite-action>
          <calcite-action
            text="Information"
            label="Save Item"
            icon="information"
            appearance="solid"
            scale="m"
          ></calcite-action>
        </calcite-action-group>
        <calcite-action-group layout="vertical">
          <calcite-action
            text="Question"
            label="View Layers"
            icon="question"
            appearance="solid"
            scale="m"
          ></calcite-action>
        </calcite-action-group>
      </calcite-action-bar>
      <calcite-flow>
        <calcite-panel heading="Layer settings">
          <calcite-action
            slot="header-menu-actions"
            text="Cool thing"
            text-enabled
            appearance="solid"
            scale="m"
          ></calcite-action>
          <calcite-action
            slot="header-menu-actions"
            text="Cool thing"
            text-enabled
            appearance="solid"
            scale="m"
          ></calcite-action>
          <calcite-action
            slot="header-menu-actions"
            text="Cool thing"
            text-enabled
            appearance="solid"
            scale="m"
          ></calcite-action>
          <calcite-block collapsible open heading="End Content" summary="Select goodness">
            <calcite-block-content>
              <img
                alt="demo"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22640%22%20height%3D%22480%22%20viewBox%3D%220%200%20640%20480%22%3E%20%3Crect%20fill%3D%22%23ddd%22%20width%3D%22640%22%20height%3D%22480%22%2F%3E%20%3Ctext%20fill%3D%22rgba%280%2C0%2C0%2C0.5%29%22%20font-family%3D%22sans-serif%22%20font-size%3D%2296%22%20dy%3D%2233.599999999999994%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3E640%C3%97480%3C%2Ftext%3E%20%3C%2Fsvg%3E"
                width="100%"
              />
              <calcite-block-section text="Cool things" toggle-display="button">
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
              </calcite-block-section>
              <calcite-block-section text="Neat things" toggle-display="button">
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
              </calcite-block-section>
            </calcite-block-content>
          </calcite-block>
          <calcite-button
            slot="footer-actions"
            width="half"
            appearance="clear"
            alignment="center"
            color="blue"
            scale="m"
          >
            Cancel
          </calcite-button>
          <calcite-button
            slot="footer-actions"
            width="half"
            alignment="center"
            appearance="solid"
            color="blue"
            scale="m"
          >
            Save
          </calcite-button>
        </calcite-panel>
        <calcite-panel heading="Deeper flow item" show-back-button>
          <calcite-block collapsible open heading="End Content" summary="Select goodness">
            <calcite-block-content>
              <calcite-block-section text="Cool things" toggle-display="button">
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
              </calcite-block-section>
              <img
                alt="demo"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22640%22%20height%3D%22480%22%20viewBox%3D%220%200%20640%20480%22%3E%20%3Crect%20fill%3D%22%23ddd%22%20width%3D%22640%22%20height%3D%22480%22%2F%3E%20%3Ctext%20fill%3D%22rgba%280%2C0%2C0%2C0.5%29%22%20font-family%3D%22sans-serif%22%20font-size%3D%2296%22%20dy%3D%2233.599999999999994%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3E640%C3%97480%3C%2Ftext%3E%20%3C%2Fsvg%3E"
                width="100%"
              />
              <calcite-block-section text="Neat things" toggle-display="button">
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
              </calcite-block-section>
            </calcite-block-content>
          </calcite-block>
          <calcite-block collapsible open heading="Even more content" summary="Select goodness">
            <calcite-block-content>
              <calcite-block-section text="Cool things" toggle-display="button">
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
              </calcite-block-section>
              <img
                alt="demo"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22640%22%20height%3D%22480%22%20viewBox%3D%220%200%20640%20480%22%3E%20%3Crect%20fill%3D%22%23ddd%22%20width%3D%22640%22%20height%3D%22480%22%2F%3E%20%3Ctext%20fill%3D%22rgba%280%2C0%2C0%2C0.5%29%22%20font-family%3D%22sans-serif%22%20font-size%3D%2296%22%20dy%3D%2233.599999999999994%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3E640%C3%97480%3C%2Ftext%3E%20%3C%2Fsvg%3E"
                width="100%"
              />
              <calcite-block-section text="Neat things" toggle-display="button">
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
                <calcite-action text="Cool thing" text-enabled appearance="solid" scale="m"></calcite-action>
              </calcite-block-section>
            </calcite-block-content>
          </calcite-block>
          <calcite-button
            slot="footer-actions"
            width="half"
            appearance="clear"
            alignment="center"
            color="blue"
            scale="m"
          >
            Cancel
          </calcite-button>
          <calcite-button
            slot="footer-actions"
            width="half"
            alignment="center"
            appearance="solid"
            color="blue"
            scale="m"
          >
            Save
          </calcite-button>
        </calcite-panel>
      </calcite-flow>
    </calcite-shell-panel>
    <footer slot="footer">My Shell Footer</footer>
  </calcite-shell>`;

export const contentBehind = (): string => html`<calcite-shell content-behind>
  ${headerHTML}
  <calcite-shell-panel slot="panel-start">${leadingPanelHTML}</calcite-shell-panel>
  ${contentHTML}
  <calcite-shell-center-row slot="center-row">${centerRowHTML}</calcite-shell-center-row>
  <calcite-shell-panel slot="panel-end">${trailingPanelHTML}</calcite-shell-panel>
  ${footerHTML}
</calcite-shell>`;
