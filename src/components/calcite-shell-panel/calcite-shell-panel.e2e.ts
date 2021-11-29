import { E2EElement, newE2EPage } from "@stencil/core/testing";

import { CSS, SLOTS } from "./resources";
import { accessible, defaults, hidden, renders } from "../../tests/commonTests";
import { getElementXY } from "../../tests/utils";

describe("calcite-shell-panel", () => {
  it("renders", async () => renders("calcite-shell-panel", { display: "flex" }));

  it("honors hidden attribute", async () => hidden("calcite-shell-panel"));

  it("defaults", async () =>
    defaults("calcite-shell-panel", [
      {
        propertyName: "collapsed",
        defaultValue: false
      },
      {
        propertyName: "resizable",
        defaultValue: false
      },
      {
        propertyName: "intlResize",
        defaultValue: "Resize"
      }
    ]));

  it("has a slot", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-shell-panel></calcite-shell-panel>");

    const contentBodyHasSlot = await page.$eval(
      "calcite-shell-panel",
      (panel: HTMLCalciteShellPanelElement, contentBodyClass: string) => {
        const contentBody = panel.shadowRoot.querySelector(contentBodyClass);
        return contentBody.firstElementChild.tagName == "SLOT";
      },
      `.${CSS.contentBody}`
    );

    expect(contentBodyHasSlot).toBe(true);
  });

  it("should show panel content", async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<calcite-shell-panel><div slot="action-bar">bar</div><div>content</div></calcite-shell-panel>'
    );

    await page.waitForChanges();

    const element = await page.find(`calcite-shell-panel >>> .${CSS.content}`);

    const isVisible = await element.isVisible();

    expect(isVisible).toBe(true);
  });

  it("collapsed property should hide panel content", async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<calcite-shell-panel collapsed><div slot="action-bar">bar</div><div>content</div></calcite-shell-panel>'
    );

    await page.waitForChanges();

    const element = await page.find(`calcite-shell-panel >>> .${CSS.content}`);

    const isVisible = await element.isVisible();

    expect(isVisible).toBe(false);
  });

  it("collapsed change should fire event", async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<calcite-shell-panel><div slot="action-bar">bar</div><div>content</div></calcite-shell-panel>'
    );

    const element = await page.find(`calcite-shell-panel`);

    const eventSpy = await page.spyOnEvent("calciteShellPanelToggle", "window");

    element.setProperty("collapsed", true);

    await page.waitForChanges();

    expect(eventSpy).toHaveReceivedEvent();
  });

  it("start position property should have action slot first", async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<calcite-shell-panel position="start"><div slot="action-bar">bar</div><div>content</div></calcite-shell-panel>'
    );

    const actionSlotIsFirst = await page.$eval(
      "calcite-shell-panel",
      (panel: HTMLCalciteShellPanelElement, containerClass: string, slotName: string) => {
        const container = panel.shadowRoot.querySelector(containerClass);
        return (
          container.firstElementChild.tagName == "SLOT" &&
          (container.firstElementChild as HTMLSlotElement).name == slotName
        );
      },
      `.${CSS.container}`,
      SLOTS.actionBar
    );

    expect(actionSlotIsFirst).toBe(true);
  });

  it("trailing position property should have DIV first", async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<calcite-shell-panel position="end"><div slot="action-bar">bar</div><div>content</div></calcite-shell-panel>'
    );

    const divElementIsFirst = await page.$eval(
      "calcite-shell-panel",
      (panel: HTMLCalciteShellPanelElement, containerClass: string, contentClass: string) => {
        const container = panel.shadowRoot.querySelector(containerClass);
        return container.firstElementChild.className == contentClass;
      },
      `.${CSS.container}`,
      CSS.content
    );

    expect(divElementIsFirst).toBe(true);
  });

  it("should be accessible", async () =>
    accessible(`
    <calcite-shell-panel slot="primary-panel" position="start">
      <calcite-action-bar slot="action-bar">
        <calcite-action-group>
          <calcite-action text="Add" icon="plus"></calcite-action>
          <calcite-action text="Save" icon="save"></calcite-action>
          <calcite-action text="Layers" icon="layers"></calcite-action>
        </calcite-action-group>
      </calcite-action-bar>
      <p>Primary Content</p>
    </calcite-shell-panel>
    `));

  it("should have detached class when detached", async () => {
    const page = await newE2EPage();

    await page.setContent("<calcite-shell-panel><div>content</div></calcite-shell-panel>");

    let detachedElement = await page.find(`calcite-shell-panel >>> .${CSS.contentDetached}`);

    expect(detachedElement).toBeNull();

    const panel = await page.find("calcite-shell-panel");

    panel.setProperty("detached", true);

    await page.waitForChanges();

    detachedElement = await page.find(`calcite-shell-panel >>> .${CSS.contentDetached}`);

    expect(detachedElement).not.toBeNull();
  });

  it("should update width based on the multipier CSS variable", async () => {
    const multipier = 2;

    const page = await newE2EPage();

    await page.setContent(`
      <calcite-shell-panel>
        test
      </calcite-shell-panel>
    `);

    await page.waitForChanges();

    const content = await page.find(`calcite-shell-panel >>> .${CSS.content}`);
    const style = await content.getComputedStyle();
    const widthDefault = parseFloat(style["width"]);

    const page2 = await newE2EPage();
    await page2.setContent(`
      <style>
        :root {
          --calcite-panel-width-multiplier: ${multipier};
        }
      </style>
      <calcite-shell-panel>
        test multiplied
      </calcite-shell-panel>
    `);

    await page2.waitForChanges();

    const content2 = await page2.find(`calcite-shell-panel >>> .${CSS.content}`);
    const style2 = await content2.getComputedStyle();
    const width2 = parseFloat(style2["width"]);

    expect(width2).toEqual(widthDefault * multipier);
  });

  it("calcite-panel should render at the same height as the content__body.", async () => {
    const page = await newE2EPage();

    await page.setViewport({ width: 1600, height: 1200 });
    await page.setContent(`
      <div style="width: 100%; height: 100%;">
        <calcite-shell>
          <calcite-shell-panel slot="primary-panel">
            <calcite-button slot="headder">Header test</calcite-button>
            <calcite-panel>
              Content test
            </calcite-panel>
          </calcite-shell-panel>
        </calcite-shell>
      </div>
    `);

    await page.waitForChanges();

    const shellContent = await page.find(`calcite-shell-panel >>> .${CSS.content}`);
    const shellHeightStyle = await shellContent.getComputedStyle("height");
    const shellHeight = parseFloat(shellHeightStyle["height"]);

    const panel = await page.find(`calcite-panel`);
    const panelHeightStyle = await panel.getComputedStyle("height");
    const panelHeight = parseFloat(panelHeightStyle["height"]);

    expect(panelHeight).toEqual(shellHeight);
  });

  it("Should have separator when resizable", async () => {
    const page = await newE2EPage();

    await page.setViewport({ width: 1600, height: 1200 });
    await page.setContent(`
      <div style="width: 100%; height: 100%;">
        <calcite-shell>
          <calcite-shell-panel slot="primary-panel">
            <calcite-button slot="headder">Header test</calcite-button>
            <calcite-panel>
              Content test
            </calcite-panel>
          </calcite-shell-panel>
        </calcite-shell>
      </div>
    `);

    await page.waitForChanges();

    let separator: E2EElement = await page.find(`calcite-shell-panel >>> .${CSS.separator}`);
    expect(separator).toBeNull();

    const panel = await page.find("calcite-shell-panel");
    panel.setProperty("resizable", true);
    await page.waitForChanges();

    separator = await page.find(`calcite-shell-panel >>> .${CSS.separator}`);
    const content = await page.find(`calcite-shell-panel >>> .${CSS.content}`);
    expect(separator).toBeDefined();
    expect(content).toBeDefined();
    expect(await separator.getProperty("ariaOrientation")).toBe("horizontal");
    expect(separator.getAttribute("role")).toBe("separator");
    expect(separator.getAttribute("tabindex")).toBe("0");
    expect(separator.getAttribute("aria-valuemax")).toBe("420");
    expect(separator.getAttribute("aria-valuemin")).toBe("240");
    expect(separator.getAttribute("aria-valuenow")).toBe("320");
    expect((await content.getComputedStyle()).width).toBe("320px");
  });

  it("Should resize via keyboard", async () => {
    const page = await newE2EPage();

    await page.setViewport({ width: 1600, height: 1200 });
    await page.setContent(`
      <div style="width: 100%; height: 100%;">
        <calcite-shell>
          <calcite-shell-panel slot="primary-panel" resizable>
            <calcite-button slot="headder">Header test</calcite-button>
            <calcite-panel>
              Content test
            </calcite-panel>
          </calcite-shell-panel>
        </calcite-shell>
      </div>
    `);

    await page.waitForChanges();

    const separator: E2EElement = await page.find(`calcite-shell-panel >>> .${CSS.separator}`);
    const content = await page.find(`calcite-shell-panel >>> .${CSS.content}`);

    expect(separator).toBeDefined();
    expect(content).toBeDefined();
    expect(separator.getAttribute("aria-valuenow")).toBe("320");
    expect((await content.getComputedStyle()).width).toBe("320px");

    await separator.press("ArrowRight");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("321");
    expect((await content.getComputedStyle()).width).toBe("321px");

    await separator.press("ArrowUp");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("322");
    expect((await content.getComputedStyle()).width).toBe("322px");

    await separator.press("ArrowLeft");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("321");
    expect((await content.getComputedStyle()).width).toBe("321px");

    await separator.press("ArrowDown");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("320");
    expect((await content.getComputedStyle()).width).toBe("320px");

    await separator.press("PageDown");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("310");
    expect((await content.getComputedStyle()).width).toBe("310px");

    await separator.press("PageUp");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("320");
    expect((await content.getComputedStyle()).width).toBe("320px");

    await separator.press("Home");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("240");
    expect((await content.getComputedStyle()).width).toBe("240px");

    await separator.press("End");
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("420");
    expect((await content.getComputedStyle()).width).toBe("420px");
  });

  it("Should resize via mouse", async () => {
    const page = await newE2EPage();

    await page.setViewport({ width: 1600, height: 1200 });
    await page.setContent(`
      <div style="width: 100%; height: 100%;">
        <calcite-shell>
          <calcite-shell-panel slot="primary-panel" resizable>
            <calcite-button slot="headder">Header test</calcite-button>
            <calcite-panel>
              Content test
            </calcite-panel>
          </calcite-shell-panel>
        </calcite-shell>
      </div>
    `);

    await page.waitForChanges();

    const separator: E2EElement = await page.find(`calcite-shell-panel >>> .${CSS.separator}`);
    const content = await page.find(`calcite-shell-panel >>> .${CSS.content}`);

    expect(separator).toBeDefined();
    expect(content).toBeDefined();
    expect(separator.getAttribute("aria-valuenow")).toBe("320");
    expect((await content.getComputedStyle()).width).toBe("320px");

    const [x, y] = await getElementXY(page, "calcite-shell-panel", `.${CSS.separator}`);

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 10, y);
    await page.waitForChanges();

    expect(separator.getAttribute("aria-valuenow")).toBe("330");
    expect((await content.getComputedStyle()).width).toBe("330px");
  });
});
