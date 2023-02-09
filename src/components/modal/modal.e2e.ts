import { newE2EPage } from "@stencil/core/testing";
import { focusable, renders, slots, hidden, t9n } from "../../tests/commonTests";
import { html } from "../../../support/formatting";
import { CSS, SLOTS, DURATIONS } from "./resources";
import { newProgrammaticE2EPage, skipAnimations } from "../../tests/utils";

describe("calcite-modal properties", () => {
  it("renders", () => renders("calcite-modal", { display: "flex", visible: false }));

  it("honors hidden attribute", async () => hidden("calcite-modal"));

  it("has slots", () => slots("calcite-modal", SLOTS));

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
    page.setViewport({ width: 1440, height: 1440 });
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
    page.setViewport({ width: 1440, height: 1440 });
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
    page.setViewport({ width: 1440, height: 1440 });
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
    page.setViewport({ width: 1440, height: 1440 });
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
    page.setViewport({ width: 800, height: 800 });
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
  function getTransitionTransform(
    modalSelector: string,
    modalContainerSelector: string,
    type: "none" | "matrix"
  ): boolean {
    const modalContainer = document
      .querySelector(modalSelector)
      .shadowRoot.querySelector<HTMLElement>(modalContainerSelector);
    return getComputedStyle(modalContainer).transform.startsWith(type);
  }

  const getTransitionDuration = (): { duration: string } => {
    const modal = document.querySelector("calcite-modal");
    const { transitionDuration } = window.getComputedStyle(modal);
    return {
      duration: transitionDuration
    };
  };

  it.skip("opens and closes", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-modal style="transition: opacity ${DURATIONS.test}s"></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    const beforeOpenSpy = await modal.spyOnEvent("calciteModalBeforeOpen");
    const openSpy = await modal.spyOnEvent("calciteModalOpen");
    const beforeCloseSpy = await modal.spyOnEvent("calciteModalBeforeClose");
    const closeSpy = await modal.spyOnEvent("calciteModalClose");

    expect(beforeOpenSpy).toHaveReceivedEventTimes(0);
    expect(openSpy).toHaveReceivedEventTimes(0);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(0);
    expect(closeSpy).toHaveReceivedEventTimes(0);
    await page.waitForFunction(getTransitionTransform, {}, "calcite-modal", `.${CSS.modal}`, "none");

    await modal.setProperty("open", true);
    let waitForEvent = page.waitForEvent("calciteModalBeforeOpen");
    await page.waitForChanges();
    await waitForEvent;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(0);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(0);
    expect(closeSpy).toHaveReceivedEventTimes(0);
    await page.waitForFunction(getTransitionTransform, {}, "calcite-modal", `.${CSS.modal}`, "matrix");

    waitForEvent = page.waitForEvent("calciteModalOpen");
    await waitForEvent;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(0);
    expect(closeSpy).toHaveReceivedEventTimes(0);
    expect(await modal.getProperty("open")).toBe(true);
    await page.waitForFunction(getTransitionTransform, {}, "calcite-modal", `.${CSS.modal}`, "matrix");
    await page.waitForFunction(getTransitionTransform, {}, "calcite-modal", `.${CSS.modal}`, "none");

    await modal.setProperty("open", false);
    waitForEvent = page.waitForEvent("calciteModalBeforeClose");
    await page.waitForChanges();
    await waitForEvent;

    const opacityTransition = await page.evaluate(getTransitionDuration);
    expect(opacityTransition.duration).toEqual(`${DURATIONS.test}s`);

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(1);
    expect(closeSpy).toHaveReceivedEventTimes(0);
    await page.waitForFunction(getTransitionTransform, {}, "calcite-modal", `.${CSS.modal}`, "matrix");

    waitForEvent = page.waitForEvent("calciteModalClose");
    await waitForEvent;

    expect(beforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(openSpy).toHaveReceivedEventTimes(1);
    expect(beforeCloseSpy).toHaveReceivedEventTimes(1);
    expect(closeSpy).toHaveReceivedEventTimes(1);
    await page.waitForFunction(getTransitionTransform, {}, "calcite-modal", `.${CSS.modal}`, "matrix");
    await page.waitForFunction(getTransitionTransform, {}, "calcite-modal", `.${CSS.modal}`, "none");
    expect(await modal.getProperty("open")).toBe(false);
  });

  it("emits when set to open on initial render", async () => {
    const page = await newProgrammaticE2EPage();

    const beforeOpenSpy = await page.spyOnEvent("calciteModalBeforeOpen");
    const openSpy = await page.spyOnEvent("calciteModalOpen");

    await page.evaluate((transitionDuration: string): void => {
      const modal = document.createElement("calcite-modal");
      modal.open = true;
      modal.style.transition = `opacity ${transitionDuration}s`;
      document.body.append(modal);
    }, `${DURATIONS.test}`);

    await page.waitForTimeout(DURATIONS.test);

    const waitForBeforeOpenEvent = page.waitForEvent("calciteModalBeforeOpen");
    const waitForOpenEvent = page.waitForEvent("calciteModalOpen");

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

    await page.evaluate((): void => {
      const modal = document.createElement("calcite-modal");
      modal.open = true;
      document.body.append(modal);
    });

    const opacityTransition = await page.evaluate(getTransitionDuration);
    expect(opacityTransition.duration).toEqual("0s");

    await page.waitForChanges;

    const waitForOpenEvent = page.waitForEvent("calciteModalOpen");
    const waitForBeforeOpenEvent = page.waitForEvent("calciteModalBeforeOpen");

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

    const opacityTransition = await page.evaluate(getTransitionDuration);
    expect(opacityTransition.duration).toEqual("0s");

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
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-modal>
        <div slot="content">
          <button class="btn-1">Focus1</button>
          <button class="btn-2">Focus1</button>
        </div>
      </calcite-modal>`
    );
    const modal = await page.find("calcite-modal");
    let $button1;
    let $button2;
    let $close;
    await page.$eval(".btn-1", (elm) => ($button1 = elm));
    await page.$eval(".btn-2", (elm) => ($button2 = elm));
    await page.$eval("calcite-modal", (elm) => {
      $close = elm.shadowRoot.querySelector(".close");
    });
    await modal.setProperty("open", true);
    await page.waitForChanges();
    expect(document.activeElement).toEqual($close);
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button1);
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button2);
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($close);
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button2);
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button1);
  });

  it("restores focus to previously focused element when closed", async () => {
    const page = await newE2EPage();
    await page.setContent(`<button>Focus</button><calcite-modal></calcite-modal>`);
    const modal = await page.find("calcite-modal");
    let $button;
    await page.$eval("button", (elm: any) => {
      $button = elm;
      $button.focus();
    });
    await modal.setProperty("open", true);
    await page.waitForChanges();
    await modal.setProperty("open", false);
    await page.waitForChanges();
    expect(document.activeElement).toEqual($button);
  });

  it("traps focus within the modal when open and disabled close button", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-modal close-button-disabled>
        <div slot="content">
          <button class="btn-1">Focus1</button>
          <button class="btn-2">Focus1</button>
        </div>
      </calcite-modal>`
    );
    const modal = await page.find("calcite-modal");
    let $button1;
    let $button2;
    await page.$eval(".btn-1", (elm) => ($button1 = elm));
    await page.$eval(".btn-2", (elm) => ($button2 = elm));

    await modal.setProperty("open", true);
    await page.waitForChanges();
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button1);
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button2);
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button2);
    await page.keyboard.press("Tab");
    expect(document.activeElement).toEqual($button1);
  });

  it("traps focus within the modal when user clicks inside the modal", async () => {
    const page = await newE2EPage();
    await page.setContent(
      html`
        <calcite-modal aria-labelledby="modal-title" close-button-disabled open>
          <div slot="header" id="modal-title">Modal title</div>
          <div slot="content">
            <p>Modal content.</p>
            <calcite-button icon-start="plus" id="plus" round></calcite-button>
          </div>
          <calcite-button slot="back" color="neutral" width="full">Back</calcite-button>
          <calcite-button slot="secondary" width="full" appearance="outline">Cancel</calcite-button>
          <calcite-button slot="primary" width="full">Save</calcite-button>
        </calcite-modal>
      `
    );

    const contentEl = await page.find(`div[slot="content"]`);
    const backButtonEl = await page.find(`calcite-button[slot="back"]`);

    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement.id)).toBe("plus");

    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement.slot)).toBe("back");

    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement.slot)).toBe("secondary");

    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement.slot)).toBe("primary");

    await contentEl.click();
    await page.waitForChanges();
    await backButtonEl.click();
    await page.waitForChanges();

    expect(await page.evaluate(() => document.activeElement.slot)).toBe("back");
  });

  describe("setFocus", () => {
    const createModalHTML = (contentHTML?: string, attrs?: string) =>
      `<calcite-modal open ${attrs}>${contentHTML}</calcite-modal>`;

    const closeButtonTargetSelector = ".close";
    const focusableContentTargetClass = "test";

    const focusableContentHTML = html`<h3 slot="header">Title</h3>
      <p slot="content">This is the content <button class=${focusableContentTargetClass}>test</button></p>`;

    it("focuses close button by default", async () =>
      focusable(createModalHTML(focusableContentHTML), {
        shadowFocusTargetSelector: closeButtonTargetSelector
      }));

    it("focuses content if there is no close button", async () =>
      focusable(createModalHTML(focusableContentHTML, "close-button-disabled"), {
        focusTargetSelector: `.${focusableContentTargetClass}`
      }));
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
    const documentClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("overflow-hidden");
    });
    expect(documentClass).toEqual(true);
  });

  it("correctly does not add overflow class on document when open and slotted in shell modals slot", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-shell><calcite-modal slot="modals"></calcite-modal></calcite-shell>`);
    const modal = await page.find("calcite-modal");
    await modal.setProperty("open", true);
    await page.waitForChanges();
    const documentClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("overflow-hidden");
    });
    expect(documentClass).toEqual(false);
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
      `
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
      `
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

  it("supports translation", () => t9n("calcite-modal"));
});
