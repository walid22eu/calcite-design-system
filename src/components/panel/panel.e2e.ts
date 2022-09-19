import { newE2EPage } from "@stencil/core/testing";
import { accessible, defaults, disabled, focusable, hidden, renders, slots } from "../../tests/commonTests";
import { html } from "../../../support/formatting";
import { CSS, SLOTS } from "./resources";

const panelTemplate = (scrollable = false) => html`<div style="height: 200px; display: flex">
  <calcite-panel>
    <div>
      ${scrollable ? '<p style="height: 400px">Hello world!</p>' : ""}
      <p>Hello world!</p>
    </div>
  </calcite-panel>
</div>`;

describe("calcite-panel", () => {
  it("renders", async () => renders("calcite-panel", { display: "flex" }));

  it("honors hidden attribute", async () => hidden("calcite-panel"));

  it("has property defaults", async () =>
    defaults("calcite-panel", [
      {
        propertyName: "widthScale",
        defaultValue: undefined
      },
      {
        propertyName: "headingLevel",
        defaultValue: undefined
      }
    ]));

  it("has slots", () => slots("calcite-panel", SLOTS));

  it("can be disabled", () => disabled(`<calcite-panel closable>scrolling content</calcite-panel>`));

  it("honors dismissed prop (deprecated)", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel dismissible>test</calcite-panel>");

    const element = await page.find("calcite-panel");
    const container = await page.find(`calcite-panel >>> .${CSS.container}`);

    await page.waitForChanges();

    expect(await container.isVisible()).toBe(true);

    element.setProperty("dismissed", true);

    await page.waitForChanges();

    expect(await element.getProperty("closed")).toBe(true);
    expect(await container.isVisible()).toBe(false);
  });

  it("honors closed prop", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel closable>test</calcite-panel>");

    const element = await page.find("calcite-panel");
    const container = await page.find(`calcite-panel >>> .${CSS.container}`);

    await page.waitForChanges();

    expect(await container.isVisible()).toBe(true);

    element.setProperty("closed", true);

    await page.waitForChanges();

    expect(await element.getProperty("dismissed")).toBe(true);
    expect(await container.isVisible()).toBe(false);
  });

  it("close event should fire when closed", async () => {
    const page = await newE2EPage({ html: "<calcite-panel closable>test</calcite-panel>" });

    const calcitePanelClose = await page.spyOnEvent("calcitePanelClose", "window");
    const calcitePanelDismiss = await page.spyOnEvent("calcitePanelDismiss", "window");
    const calcitePanelDismissedChange = await page.spyOnEvent("calcitePanelDismissedChange", "window");

    const closeButton = await page.find("calcite-panel >>> calcite-action");

    await closeButton.click();

    expect(calcitePanelClose).toHaveReceivedEvent();
    expect(calcitePanelDismiss).toHaveReceivedEvent();
    expect(calcitePanelDismissedChange).toHaveReceivedEvent();
  });

  it("dismiss event should not fire when closed via prop", async () => {
    const page = await newE2EPage({ html: "<calcite-panel closable>test</calcite-panel>" });

    const eventSpy = await page.spyOnEvent("calcitePanelDismiss", "window");

    const panel = await page.find("calcite-panel");

    panel.setProperty("dismissed", true);

    await page.waitForChanges();

    expect(await panel.getProperty("closed")).toBe(true);
    expect(eventSpy).not.toHaveReceivedEvent();
  });

  it("should be accessible", async () =>
    accessible(`
    <calcite-panel>
      <div slot="${SLOTS.headerActionsStart}">test start</div>
      <div slot="${SLOTS.headerContent}">test content</div>
      <div slot="${SLOTS.headerActionsEnd}">test end</div>
      <p>Content</p>
      <calcite-button slot="${SLOTS.footerActions}">test button 1</calcite-button>
      <calcite-button slot="${SLOTS.footerActions}">test button 2</calcite-button>
    </calcite-panel>
    `));

  it("should focus on close button (deprecated)", async () =>
    focusable(`<calcite-panel dismissible>test</calcite-panel>`, {
      focusId: "dismiss-button",
      shadowFocusTargetSelector: "calcite-action"
    }));

  it("should focus on close button )", async () =>
    focusable(`<calcite-panel closable>test</calcite-panel>`, {
      shadowFocusTargetSelector: "calcite-action"
    }));

  it("should focus on back button", async () =>
    focusable(`<calcite-panel show-back-button>test</calcite-panel>`, {
      shadowFocusTargetSelector: "calcite-action"
    }));

  it("should focus on container", async () =>
    focusable(`<calcite-panel>test</calcite-panel>`, {
      shadowFocusTargetSelector: "article"
    }));

  it("honors calcitePanelScroll event", async () => {
    const page = await newE2EPage({
      html: "<calcite-panel>test</calcite-panel>"
    });

    const scrollSpy = await page.spyOnEvent("calcitePanelScroll");

    await page.evaluate((contentContainerSelector) => {
      const contentContainer = document
        .querySelector("calcite-panel")
        .shadowRoot.querySelector(contentContainerSelector);

      contentContainer.dispatchEvent(new CustomEvent("scroll"));
    }, `.${CSS.contentWrapper}`);

    await page.waitForChanges();

    expect(scrollSpy).toHaveReceivedEventTimes(1);
  });

  it("should have default heading", async () => {
    const page = await newE2EPage();

    await page.setContent('<calcite-panel heading="test heading"></calcite-panel>');

    const element = await page.find(`calcite-panel >>> .${CSS.heading}`);

    expect(element).toEqualText("test heading");
  });

  it("should have default summary (deprecated)", async () => {
    const page = await newE2EPage();

    await page.setContent('<calcite-panel summary="test summary"></calcite-panel>');

    const element = await page.find(`calcite-panel >>> .${CSS.description}`);

    expect(element).toEqualText("test summary");
  });

  it("should have default description", async () => {
    const page = await newE2EPage();

    await page.setContent('<calcite-panel description="test description"></calcite-panel>');

    const element = await page.find(`calcite-panel >>> .${CSS.description}`);

    expect(element).toEqualText("test description");
  });

  it("should not render a header if there are no actions or content", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel>test</calcite-panel>");

    const header = await page.find(`calcite-panel >>> .${CSS.header}`);

    expect(await header.isVisible()).toBe(false);
  });

  it("menuOpen should show/hide when toggled", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<calcite-panel>
        <calcite-action slot="${SLOTS.headerMenuActions}" text="hello"></calcite-action>
        <calcite-action slot="${SLOTS.headerMenuActions}" text="hello2"></calcite-action>
      </calcite-panel>`
    );

    await page.waitForChanges();

    const element = await page.find("calcite-panel");

    expect(element.getAttribute("menuOpen")).toBeNull();

    element.setProperty("menuOpen", true);

    await page.waitForChanges();

    const menu = await page.find(`calcite-panel >>> calcite-action-menu`);

    expect(menu).not.toBeNull();

    const menuVisible = await menu.isVisible();

    expect(menuVisible).toBe(true);

    const menuOpen = await menu.getProperty("open");

    expect(menuOpen).toBe(true);
  });

  it("should not render start or end actions containers when there are no start or end actions", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel></calcite-panel>");

    const actionsContainerStart = await page.find(`calcite-panel >>> .${CSS.headerActionsStart}`);
    const actionsContainerEnd = await page.find(`calcite-panel >>> .${CSS.headerActionsEnd}`);

    expect(await actionsContainerStart.isVisible()).toBe(false);
    expect(await actionsContainerEnd.isVisible()).toBe(false);
  });

  it("header-content should override heading and summary properties (deprecated)", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<calcite-panel heading="test heading" summary="test summary">
        <div slot=${SLOTS.headerContent}>custom header content</div>
      </calcite-panel>`
    );

    const heading = await page.find(`calcite-panel >>> ${CSS.heading}`);
    const summary = await page.find(`calcite-panel >>> ${CSS.description}`);
    const header = await page.find(`calcite-panel >>> ${CSS.header}`);

    expect(heading).toBeNull();
    expect(summary).toBeNull();
    expect(header).not.toBeNull();
  });

  it("header-content should override heading and description properties", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<calcite-panel heading="test heading" description="test description">
        <div slot=${SLOTS.headerContent}>custom header content</div>
      </calcite-panel>`
    );

    const heading = await page.find(`calcite-panel >>> ${CSS.heading}`);
    const description = await page.find(`calcite-panel >>> ${CSS.description}`);
    const header = await page.find(`calcite-panel >>> ${CSS.header}`);

    expect(heading).toBeNull();
    expect(description).toBeNull();
    expect(header).not.toBeNull();
  });

  it("showBackButton", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel></calcite-panel>");

    const element = await page.find("calcite-panel");

    const showBackButton = await element.getProperty("showBackButton");

    expect(showBackButton).toBe(false);

    const backButton = await page.find(`calcite-panel >>> .${CSS.backButton}`);

    expect(backButton).toBeNull();

    element.setProperty("showBackButton", true);

    await page.waitForChanges();

    const showBackButtonNew = await element.getProperty("showBackButton");

    expect(showBackButtonNew).toBe(true);

    const backButtonNew = await page.find(`calcite-panel >>> .${CSS.backButton}`);

    expect(backButtonNew).not.toBeNull();

    expect(await backButtonNew.isVisible()).toBe(true);

    const eventSpy = await page.spyOnEvent("calcitePanelBackClick", "window");

    await page.$eval("calcite-panel", (elm: HTMLElement) => {
      const nativeBackButton = elm.shadowRoot.querySelector(`calcite-action`);
      nativeBackButton.click();
    });

    expect(eventSpy).toHaveReceivedEvent();
  });

  it("should not render footer node if there are no actions or content", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel>test</calcite-panel>");

    const footer = await page.find(`calcite-panel >>> .${CSS.footer}`);

    expect(await footer.isVisible()).toBe(false);
  });

  it("should update width based on the multipier CSS variable", async () => {
    const multipier = 2;

    const page = await newE2EPage();
    await page.setViewport({ width: 1600, height: 1200 });

    await page.setContent(`
      <calcite-panel width-scale="m">
        test
      </calcite-panel>
    `);

    await page.waitForChanges();

    const content = await page.find(`calcite-panel >>> .${CSS.container}`);
    const style = await content.getComputedStyle("width");
    const widthDefault = parseFloat(style["width"]);

    const page2 = await newE2EPage();
    await page2.setViewport({ width: 1600, height: 1200 });

    await page2.setContent(`
      <style>
        :root {
          --calcite-panel-width-multiplier: ${multipier};
        }
      </style>
      <calcite-panel width-scale="m">
        test multiplied
      </calcite-panel>
    `);

    await page2.waitForChanges();

    const content2 = await page2.find(`calcite-panel >>> .${CSS.container}`);
    const style2 = await content2.getComputedStyle("width");
    const width2 = parseFloat(style2["width"]);

    expect(width2).toEqual(widthDefault * multipier);
  });

  it("should set tabIndex of -1 on a non-scrollable panel", async () => {
    const page = await newE2EPage();

    await page.setContent(panelTemplate());

    const scrollEl = await page.find(`calcite-panel >>> .${CSS.contentWrapper}`);

    expect(await scrollEl.getProperty("tabIndex")).toBe(-1);
  });

  it("should set tabIndex of 0 on a scrollable panel", async () => {
    const page = await newE2EPage();

    await page.setContent(panelTemplate(true));

    const scrollEl = await page.find(`calcite-panel >>> .${CSS.contentWrapper}`);

    expect(await scrollEl.getProperty("tabIndex")).toBe(0);
  });

  it("handles scrollContentTo method", async () => {
    const page = await newE2EPage();

    await page.setContent(panelTemplate(true));

    const scrollEl = await page.find(`calcite-panel >>> .${CSS.contentWrapper}`);

    expect(await scrollEl.getProperty("scrollTop")).toBe(0);

    await page.$eval("calcite-panel", async (panel: HTMLCalcitePanelElement) => {
      await panel.scrollContentTo({ top: 100 });
    });

    expect(await scrollEl.getProperty("scrollTop")).toBe(100);
  });

  it("should close when Escape key is pressed and closable is true", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-panel>test</calcite-panel>");
    const panel = await page.find("calcite-panel");
    const container = await page.find(`calcite-panel >>> .${CSS.container}`);
    expect(await panel.getProperty("closed")).toBe(false);
    expect(await container.isVisible()).toBe(true);
    await container.press("Escape");
    await page.waitForChanges();
    expect(await panel.getProperty("closed")).toBe(false);
    expect(await container.isVisible()).toBe(true);
    panel.setProperty("closable", true);
    await page.waitForChanges();
    await container.press("Escape");
    expect(await panel.getProperty("closed")).toBe(true);
    expect(await container.isVisible()).toBe(false);
  });
});
