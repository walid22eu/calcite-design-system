import { newE2EPage } from "@stencil/core/testing";
import { accessible, hidden, renders } from "../../tests/commonTests";
import { CSS, SLOTS } from "./resources";

describe("calcite-panel", () => {
  it("renders", async () => renders("calcite-panel"));

  it("honors hidden attribute", async () => hidden("calcite-panel"));

  it("honors dismissed prop", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel dismissible>test</calcite-panel>");

    const element = await page.find("calcite-panel");
    const container = await page.find(`calcite-panel >>> .${CSS.container}`);

    await page.waitForChanges();

    expect(await container.isVisible()).toBe(true);

    element.setProperty("dismissed", true);

    await page.waitForChanges();

    expect(await container.isVisible()).toBe(false);
  });

  it("dismissible should fire event when closed", async () => {
    const page = await newE2EPage({ html: "<calcite-panel dismissible>test</calcite-panel>" });

    const eventSpy = await page.spyOnEvent("calcitePanelDismissedChange", "window");

    const closeButton = await page.find("calcite-panel >>> calcite-action");

    await closeButton.click();

    expect(eventSpy).toHaveReceivedEvent();
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

  it("should focus on close button", async () => {
    const page = await newE2EPage({ html: "<calcite-panel dismissible>test</calcite-panel>" });

    const tagName = await page.evaluate(async () => {
      const calcitePanel = document.querySelector("calcite-panel");
      await calcitePanel.setFocus("dismiss-button");
      const activeElement = calcitePanel.shadowRoot.activeElement;
      return activeElement.tagName;
    });

    expect(tagName).toBe("CALCITE-ACTION");
  });

  it("should focus on container", async () => {
    const page = await newE2EPage({ html: "<calcite-panel dismissible>test</calcite-panel>" });

    const tagName = await page.evaluate(async () => {
      const calcitePanel = document.querySelector("calcite-panel");
      await calcitePanel.setFocus();
      const activeElement = calcitePanel.shadowRoot.activeElement;
      return activeElement.tagName;
    });

    expect(tagName).toBe("ARTICLE");
  });

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
    }, `.${CSS.contentContainer}`);

    await page.waitForChanges();

    expect(scrollSpy).toHaveReceivedEventTimes(1);
  });

  it("should have default heading", async () => {
    const page = await newE2EPage();

    await page.setContent('<calcite-panel heading="test heading"></calcite-panel>');

    const element = await page.find(`calcite-panel >>> .${CSS.heading}`);

    expect(element).toEqualText("test heading");
  });

  it("should have default summary", async () => {
    const page = await newE2EPage();

    await page.setContent('<calcite-panel summary="test summary"></calcite-panel>');

    const element = await page.find(`calcite-panel >>> .${CSS.summary}`);

    expect(element).toEqualText("test summary");
  });

  it("should not render a header if there are no actions or content", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel>test</<calcite-panel>");

    const header = await page.find(`calcite-panel >>> .${CSS.header}`);

    expect(header).toBeNull();
  });

  it("should not render menu nodes when there are no header-menu-actions", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel></calcite-panel>");

    const menuButton = await page.find(`calcite-panel >>> .${CSS.menuButton}`);
    const menuContainer = await page.find(`calcite-panel >>> .${CSS.menuContainer}`);

    expect(menuButton).toBeNull();
    expect(menuContainer).toBeNull();
  });

  it("should render menu button when there are header-menu-actions", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<calcite-panel>
        <calcite-action slot="${SLOTS.headerMenuActions}" text="hello"></calcite-action>
        <calcite-action slot="${SLOTS.headerMenuActions}" text="hello2"></calcite-action>
      </calcite-panel>`
    );

    const menuButton = await page.find(`calcite-panel >>> .${CSS.menuButton}`);
    const menuContainer = await page.find(`calcite-panel >>> .${CSS.menuContainer}`);

    expect(menuButton).not.toBeNull();
    expect(menuContainer).not.toBeNull();
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

    const menu = await page.find(`calcite-panel >>> .${CSS.menu}`);

    expect(menu).not.toBeNull();

    const menuVisible = await menu.isVisible();

    expect(menuVisible).toBe(true);

    const menuButton = await page.find(`calcite-panel >>> .${CSS.menuButton}`);

    expect(menuButton).not.toBeNull();

    const menuButtonVisible = await menuButton.isVisible();

    expect(menuButtonVisible).toBe(true);
  });

  it("should not render start or end actions containers when there are no start or end actions", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-panel></calcite-panel>");

    const actionsContainerStart = await page.find(`calcite-panel >>> .${CSS.headerActionsStart}`);
    const actionsContainerEnd = await page.find(`calcite-panel >>> .${CSS.headerActionsEnd}`);

    expect(actionsContainerStart).toBeNull();
    expect(actionsContainerEnd).toBeNull();
  });

  it("should render start actions containers header-actions-start", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<calcite-panel>
        <calcite-action slot=${SLOTS.headerActionsStart} text="test start"></calcite-action>
      </calcite-panel>`
    );

    const actionsContainerStart = await page.find(`calcite-panel >>> .${CSS.headerActionsStart}`);

    expect(actionsContainerStart).not.toBeNull();
  });

  it("should render end actions containers header-actions-end", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<calcite-panel>
        <calcite-action slot=${SLOTS.headerActionsEnd} text="test end"></calcite-action>
      </calcite-panel>`
    );

    const actionsContainerEnd = await page.find(`calcite-panel >>> .${CSS.headerActionsEnd}`);

    expect(actionsContainerEnd).not.toBeNull();
  });

  it("header-content should override heading and summary properties", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<calcite-panel heading="test heading" summary="test summary">
        <div slot=${SLOTS.headerContent}>custom header content</div>
      </calcite-panel>`
    );

    const heading = await page.find(`calcite-panel >>> ${CSS.heading}`);
    const summary = await page.find(`calcite-panel >>> ${CSS.summary}`);
    const header = await page.find(`calcite-panel >>> ${CSS.header}`);

    expect(heading).toBeNull();
    expect(summary).toBeNull();
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

    await page.setContent("<calcite-panel>test</<calcite-panel>");

    const footer = await page.find(`calcite-panel >>> .${CSS.footer}`);

    expect(footer).toBeNull();
  });
});
