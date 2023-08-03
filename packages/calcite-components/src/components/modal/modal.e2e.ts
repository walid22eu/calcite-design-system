import { newE2EPage } from "@stencil/core/testing";
import { focusable, renders, slots, hidden, t9n } from "../../tests/commonTests";
import { html } from "../../../support/formatting";
import { CSS, SLOTS } from "./resources";
import { GlobalTestProps, isElementFocused, newProgrammaticE2EPage, skipAnimations } from "../../tests/utils";

describe("calcite-modal properties", () => {
  describe("renders", () => {
    renders("calcite-modal", { display: "flex", visible: false });
  });

  describe("honors hidden attribute", () => {
    hidden("calcite-modal");
  });

  describe("slots", () => {
    slots("calcite-modal", SLOTS);
  });

  it("should hide closeButton when disabled", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-modal></calcite-modal>");
    const modal = await page.find("calcite-modal");
    modal.setProperty("closeButtonDisabled", true);
    await page.waitForChanges();
    const closeButton = await page.find("calcite-modal >>> .close");
    expect(closeButton).toBe(null);
  });

  it("sets custom width correctly", async () => {
    const page = await newE2EPage();
    // set large page to ensure test modal isn't becoming fullscreen
    await page.setViewport({ width: 1440, height: 1440 });
    await page.setContent(`<calcite-modal style="--calcite-modal-width:600px;"></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const style = await page.$eval("calcite-modal", (elm) => {
      const m = elm.shadowRoot.querySelector(".modal");
      return window.getComputedStyle(m).getPropertyValue("width");
    });
    expect(style).toEqual("600px");
  });

  it("sets custom height correctly", async () => {
    const page = await newE2EPage();
    // set large page to ensure test modal isn't becoming fullscreen
    await page.setViewport({ width: 1440, height: 1440 });
    await page.setContent(`<calcite-modal style="--calcite-modal-height:600px;" open></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const style = await page.$eval("calcite-modal", (elm) => {
      const m = elm.shadowRoot.querySelector(".modal");
      return window.getComputedStyle(m).getPropertyValue("height");
    });
    expect(style).toEqual("600px");
  });

  it("expectedly does not set custom width when `fullscreen` is true", async () => {
    const page = await newE2EPage();
    // set large page to ensure test modal isn't becoming fullscreen
    await page.setViewport({ width: 1440, height: 1440 });
    await page.setContent(`<calcite-modal style="--calcite-modal-width:600px;" fullscreen open></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const style = await page.$eval("calcite-modal", (elm) => {
      const m = elm.shadowRoot.querySelector(".modal");
      return window.getComputedStyle(m).getPropertyValue("width");
    });
    expect(style).not.toEqual("600px");
  });

  it("expectedly does not set custom height when `fullscreen` is true", async () => {
    const page = await newE2EPage();
    // set large page to ensure test modal isn't becoming fullscreen
    await page.setViewport({ width: 1440, height: 1440 });
    await page.setContent(`<calcite-modal style="--calcite-modal-height:600px;" fullscreen open></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const style = await page.$eval("calcite-modal", (elm) => {
      const m = elm.shadowRoot.querySelector(".modal");
      return window.getComputedStyle(m).getPropertyValue("height");
    });
    expect(style).not.toEqual("600px");
  });

  it("does not overflow page bounds when requested css variable sizes are larger than viewport", async () => {
    const page = await newE2EPage();
    // set small page to test overflow
    await page.setViewport({ width: 800, height: 800 });
    await page.setContent(
      `<calcite-modal style="--calcite-modal-height:1200px;--calcite-modal-width:1200px;" open></calcite-modal>`
    );
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const styleW = await page.$eval("calcite-modal", (elm) => {
      const m = elm.shadowRoot.querySelector(".modal");
      return window.getComputedStyle(m).getPropertyValue("width");
    });
    const styleH = await page.$eval("calcite-modal", (elm) => {
      const m = elm.shadowRoot.querySelector(".modal");
      return window.getComputedStyle(m).getPropertyValue("height");
    });
    expect(styleW).toEqual("800px");
    expect(styleH).toEqual("800px");
  });

  it("calls the beforeClose method prior to closing", async () => {
    const page = await newE2EPage();
    const mockCallBack = jest.fn();
    await page.exposeFunction("beforeClose", mockCallBack);
    await page.setContent(`
      <calcite-modal open></calcite-modal>
    `);
    const modal = await page.find("calcite-modal");
    await page.$eval(
      "calcite-modal",
      (elm: HTMLCalciteModalElement) =>
        (elm.beforeClose = (window as typeof window & Pick<typeof elm, "beforeClose">).beforeClose)
    );
    await page.waitForChanges();
    await modal.setProperty("open", true);
    await page.waitForChanges();
    await modal.setProperty("open", false);
    await page.waitForChanges();
    expect(mockCallBack).toHaveBeenCalled();
  });
});

describe("opening and closing behavior", () => {
  it("opens and closes", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-modal></calcite-modal>`);
    const modal = await page.find("calcite-modal");

    type ModalEventOrderWindow = GlobalTestProps<{ events: string[] }>;

    await page.$eval("calcite-modal", (modal: HTMLCalciteModalElement) => {
      const receivedEvents: string[] = [];
      (window as ModalEventOrderWindow).events = receivedEvents;

      ["calciteModalBeforeOpen", "calciteModalOpen", "calciteModalBeforeClose", "calciteModalClose"].forEach(
        (eventType) => {
          modal.addEventListener(eventType, (event) => receivedEvents.push(event.type));
        }
      );
    });

    const beforeOpenSpy = await modal.spyOnEvent("calciteModalBeforeOpen");
    const openSpy = await modal.spyOnEvent("calciteModalOpen");
    const beforeCloseSpy = await modal.spyOnEvent("calciteModalBeforeClose");
    const closeSpy = await modal.spyOnEvent("calciteModalClose");

    expect(beforeOpenSpy).toHaveReceivedEventTimes(0);
    expect(openSpy).toHaveReceivedEventTimes(0);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(0);
    expect(closeSpy).toHaveReceivedEventTimes(0);

    expect(await modal.isVisible()).toBe(false);

    const modalBeforeOpen = page.waitForEvent("calciteModalBeforeOpen");
    const modalOpen = page.waitForEvent("calciteModalOpen");
    await modal.setProperty("open", true);
    await page.waitForChanges();

    await modalBeforeOpen;
    await modalOpen;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(0);
    expect(closeSpy).toHaveReceivedEventTimes(0);

    expect(await modal.isVisible()).toBe(true);

    const modalBeforeClose = page.waitForEvent("calciteModalBeforeClose");
    const modalClose = page.waitForEvent("calciteModalClose");
    await modal.setProperty("open", false);
    await page.waitForChanges();

    await modalBeforeClose;
    await modalClose;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(1);
    expect(closeSpy).toHaveReceivedEventTimes(1);

    expect(await modal.isVisible()).toBe(false);

    expect(await page.evaluate(() => (window as ModalEventOrderWindow).events)).toEqual([
      "calciteModalBeforeOpen",
      "calciteModalOpen",
      "calciteModalBeforeClose",
      "calciteModalClose",
    ]);
  });

  it("emits when set to open on initial render", async () => {
    const page = await newProgrammaticE2EPage();

    const beforeOpenSpy = await page.spyOnEvent("calciteModalBeforeOpen");
    const openSpy = await page.spyOnEvent("calciteModalOpen");

    const waitForBeforeOpenEvent = page.waitForEvent("calciteModalBeforeOpen");
    const waitForOpenEvent = page.waitForEvent("calciteModalOpen");

    await page.evaluate((): void => {
      const modal = document.createElement("calcite-modal");
      modal.open = true;
      document.body.append(modal);
    });

    await page.waitForChanges();
    await waitForBeforeOpenEvent;
    await waitForOpenEvent;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);
  });

  it("emits when set to open on initial render and duration is 0", async () => {
    const page = await newProgrammaticE2EPage();
    await skipAnimations(page);

    const beforeOpenSpy = await page.spyOnEvent("calciteModalBeforeOpen");
    const openSpy = await page.spyOnEvent("calciteModalOpen");

    const waitForOpenEvent = page.waitForEvent("calciteModalOpen");
    const waitForBeforeOpenEvent = page.waitForEvent("calciteModalBeforeOpen");

    await page.evaluate((): void => {
      const modal = document.createElement("calcite-modal");
      modal.open = true;
      document.body.append(modal);
    });

    await page.waitForChanges();
    await waitForBeforeOpenEvent;
    await waitForOpenEvent;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);
  });

  it("emits when duration is set to 0", async () => {
    const page = await newProgrammaticE2EPage();
    await skipAnimations(page);

    const beforeOpenSpy = await page.spyOnEvent("calciteModalBeforeOpen");
    const openSpy = await page.spyOnEvent("calciteModalOpen");

    const beforeCloseSpy = await page.spyOnEvent("calciteModalBeforeClose");
    const closeSpy = await page.spyOnEvent("calciteModalClose");

    await page.evaluate((): void => {
      const modal = document.createElement("calcite-modal");
      modal.open = true;
      document.body.append(modal);
    });

    await page.waitForChanges();
    await beforeOpenSpy;
    await openSpy;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);

    await page.evaluate(() => {
      const modal = document.querySelector("calcite-modal");
      modal.open = false;
    });

    await page.waitForChanges();
    await beforeCloseSpy;
    await closeSpy;

    expect(beforeCloseSpy).toHaveReceivedEventTimes(1);
    expect(closeSpy).toHaveReceivedEventTimes(1);
  });
});

describe("calcite-modal accessibility checks", () => {
  it("traps focus within the modal when open", async () => {
    const button1Id = "button1";
    const button2Id = "button2";
    const page = await newE2EPage();
    await page.setContent(
      html`<calcite-modal>
        <div slot="content">
          <button id="${button1Id}">Focus1</button>
          <button id="${button2Id}">Focus2</button>
        </div>
      </calcite-modal>`
    );
    const modal = await page.find("calcite-modal");
    const opened = page.waitForEvent("calciteModalOpen");
    modal.setProperty("open", true);
    await page.waitForChanges();
    await opened;

    expect(await isElementFocused(page, `.${CSS.close}`, { shadowed: true })).toBe(true);
    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button1Id}`)).toBe(true);
    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button2Id}`)).toBe(true);

    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `.${CSS.close}`, { shadowed: true })).toBe(true);
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button2Id}`)).toBe(true);

    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button1Id}`)).toBe(true);
  });

  it("restores focus to previously focused element when closed", async () => {
    const initiallyFocusedId = "initially-focused";
    const initiallyFocusedIdSelector = `#${initiallyFocusedId}`;
    const page = await newE2EPage();
    await page.setContent(
      html`
        <button id="${initiallyFocusedId}">Focus</button>
        <calcite-modal></calcite-modal>
      `
    );
    await skipAnimations(page);
    const modal = await page.find("calcite-modal");
    await page.$eval(initiallyFocusedIdSelector, (button: HTMLButtonElement) => {
      button.focus();
    });
    await modal.setProperty("open", true);
    await page.waitForChanges();
    await modal.setProperty("open", false);
    await page.waitForChanges();
    expect(await isElementFocused(page, initiallyFocusedIdSelector)).toBe(true);
  });

  it("traps focus within the modal when open and disabled close button", async () => {
    const button1Id = "button1";
    const button2Id = "button2";
    const page = await newE2EPage();
    await page.setContent(
      html`<calcite-modal close-button-disabled>
        <div slot="content">
          <button id="${button1Id}">Focus1</button>
          <button id="${button2Id}">Focus2</button>
        </div>
      </calcite-modal>`
    );
    await skipAnimations(page);
    const modal = await page.find("calcite-modal");

    await modal.setProperty("open", true);
    await page.waitForChanges();
    expect(await isElementFocused(page, `#${button1Id}`)).toBe(true);

    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button2Id}`)).toBe(true);

    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button1Id}`)).toBe(true);
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button2Id}`)).toBe(true);
    await page.keyboard.press("Tab");
    expect(await isElementFocused(page, `#${button1Id}`)).toBe(true);
  });

  describe("setFocus", () => {
    const createModalHTML = (contentHTML?: string, attrs?: string) =>
      `<calcite-modal open ${attrs}>${contentHTML}</calcite-modal>`;

    const closeButtonTargetSelector = ".close";
    const focusableContentTargetClass = "test";

    const focusableContentHTML = html`<h3 slot="header">Title</h3>
      <p slot="content">This is the content <button class=${focusableContentTargetClass}>test</button></p>`;

    describe("focuses close button by default", () => {
      focusable(createModalHTML(focusableContentHTML), {
        shadowFocusTargetSelector: closeButtonTargetSelector,
      });
    });

    describe("focuses content if there is no close button", () => {
      focusable(createModalHTML(focusableContentHTML, "close-button-disabled"), {
        focusTargetSelector: `.${focusableContentTargetClass}`,
      });
    });
  });

  it("has correct aria role/attribute", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    expect(modal).toEqualAttribute("role", "dialog");
    expect(modal).toEqualAttribute("aria-modal", "true");
  });

  it("closes and allows re-opening when Escape key is pressed", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal ></calcite-modal>`);
    await skipAnimations(page);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    expect(await modal.isVisible()).toBe(true);
    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(await modal.isVisible()).toBe(false);
    expect(await modal.getProperty("open")).toBe(false);
    await modal.setProperty("open", true);
    await page.waitForChanges();
    expect(await modal.isVisible()).toBe(true);
  });

  it("closes when Escape key is pressed and modal is open on page load", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal  open></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await page.waitForChanges();
    expect(modal).toHaveAttribute("open");
    expect(modal).toHaveAttribute("open");
    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(modal).not.toHaveAttribute("open");
    expect(modal).not.toHaveAttribute("open");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    expect(modal).toHaveAttribute("open");
    expect(modal).toHaveAttribute("open");
  });

  it("closes and allows re-opening when Close button is clicked", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal ></calcite-modal>`);
    await skipAnimations(page);
    const modal = await page.find("calcite-modal");
    modal.setProperty("open", true);
    await page.waitForChanges();
    expect(await modal.isVisible()).toBe(true);
    const closeButton = await page.find("calcite-modal >>> .close");
    await closeButton.click();
    await page.waitForChanges();
    expect(await modal.isVisible()).toBe(false);
    expect(await modal.getProperty("open")).toBe(false);
    modal.setProperty("open", true);
    await page.waitForChanges();
    expect(await modal.isVisible()).toBe(true);
  });

  it("should close when the scrim is clicked", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal ></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    modal.setProperty("open", true);
    await page.waitForChanges();
    expect(modal).toHaveAttribute("open");
    await page.$eval("calcite-modal", (elm) => elm.shadowRoot.querySelector("calcite-scrim").click());
    await page.waitForChanges();
    expect(await modal.getProperty("open")).toBe(false);
  });

  it("should not close when the scrim is clicked", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal outside-close-disabled ></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    modal.setProperty("open", true);
    await page.waitForChanges();
    expect(modal).toHaveAttribute("open");
    await page.$eval("calcite-modal", (elm) => elm.shadowRoot.querySelector("calcite-scrim").click());
    await page.waitForChanges();
    expect(await modal.getProperty("open")).toBe(true);
  });

  it("does not close when Escape is pressed and escape-disabled is set", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal escape-disabled></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    expect(modal).toHaveAttribute("open");
    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(modal).toHaveAttribute("open");
  });

  it("correctly adds overflow class on document when open", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const isOverflowHidden = await page.evaluate(() => {
      return document.documentElement.style.overflow === "hidden";
    });
    expect(isOverflowHidden).toEqual(true);
  });

  it("correctly does not add overflow class on document when open and slotted in shell modals slot", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-shell><calcite-modal slot="modals"></calcite-modal></calcite-shell>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const isOverflowHidden = await page.evaluate(() => {
      return document.documentElement.style.overflow === "hidden";
    });
    expect(isOverflowHidden).toEqual(false);
  });

  it("correctly removes overflow class on document once closed", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-modal></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    await modal.setProperty("open", false);
    await page.waitForChanges();
    const documentClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("overflow-hidden");
    });
    expect(documentClass).toEqual(false);
  });

  it("renders correctly with no footer", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-modal>
        <calcite-button slot="primary">TEST</calcite-button>
      </calcite-modal>
    `);
    let footer = await page.$eval("calcite-modal", (elm) => elm.shadowRoot.querySelector(".footer"));
    expect(footer).toBeDefined();
    await page.$eval("calcite-button", (elm) => elm.parentElement.removeChild(elm));
    await page.waitForChanges();
    footer = await page.$eval("calcite-modal", (elm) => elm.shadowRoot.querySelector(".footer"));
    expect(footer).toBeFalsy();
  });

  it("should render calcite-scrim with default background color", async () => {
    const page = await newE2EPage({
      html: `
      <calcite-modal aria-labelledby="modal-title" open>
        <h3 slot="header" id="modal-title">Title of the modal</h3>
        <div slot="content">The actual content of the modal</div>
        <calcite-button slot="back" kind="neutral" appearance="outline" icon="chevron-left" width="full">
          Back
        </calcite-button>
        <calcite-button slot="secondary" width="full" appearance="outline"> Cancel </calcite-button>
        <calcite-button slot="primary" width="full"> Save </calcite-button>
      </calcite-modal>
      `,
    });
    const scrimStyles = await page.evaluate(() => {
      const scrim = document.querySelector("calcite-modal").shadowRoot.querySelector(".scrim");
      return window.getComputedStyle(scrim).getPropertyValue("--calcite-scrim-background");
    });
    expect(scrimStyles.trim()).toEqual("rgba(0, 0, 0, 0.85)");
  });

  it("when modal css override set, scrim should adhere to requested color", async () => {
    const overrideStyle = "rgba(160, 20, 10, 0.5)";
    const page = await newE2EPage({
      html: `
      <calcite-modal aria-labelledby="modal-title" open style="--calcite-modal-scrim-background:${overrideStyle}">
        <h3 slot="header" id="modal-title">Title of the modal</h3>
        <div slot="content">The actual content of the modal</div>
        <calcite-button slot="back" kind="neutral" appearance="outline" icon="chevron-left" width="full">
          Back
        </calcite-button>
        <calcite-button slot="secondary" width="full" appearance="outline"> Cancel </calcite-button>
        <calcite-button slot="primary" width="full"> Save </calcite-button>
      </calcite-modal>
      `,
    });
    const scrimStyles = await page.evaluate(() => {
      const scrim = document.querySelector("calcite-modal").shadowRoot.querySelector(".scrim");
      return window.getComputedStyle(scrim).getPropertyValue("--calcite-scrim-background");
    });
    expect(scrimStyles).toEqual(overrideStyle);
  });

  it("correctly reflects the scale of the modal on the close button icon", async () => {
    const page = await newE2EPage();
    await page.setContent(html` <calcite-modal open></calcite-modal> `);
    const modal = await page.find("calcite-modal");
    modal.setProperty("scale", "s");
    await page.waitForChanges();
    let closeIcon = await page.find('calcite-modal >>> calcite-icon[scale="s"]');
    expect(closeIcon).not.toBe(null);

    modal.setProperty("scale", "m");
    await page.waitForChanges();
    closeIcon = await page.find('calcite-modal >>> calcite-icon[scale="m"]');
    expect(closeIcon).not.toBe(null);

    modal.setProperty("scale", "l");
    await page.waitForChanges();
    closeIcon = await page.find('calcite-modal >>> calcite-icon[scale="l"]');
    expect(closeIcon).not.toBe(null);
  });

  describe("translation support", () => {
    t9n("calcite-modal");
  });
});
