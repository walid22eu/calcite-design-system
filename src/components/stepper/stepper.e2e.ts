import { E2EPage, newE2EPage } from "@stencil/core/testing";
import { renders, hidden } from "../../tests/commonTests";
import { html } from "../../../support/formatting";

// todo test the automatic setting of first item to active
describe("calcite-stepper", () => {
  it("renders", () =>
    renders(
      html`<calcite-stepper>
        <calcite-stepper-item item-title="Step 1" id="step-1">
          <div>Step 1 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 2" id="step-2">
          <div>Step 2 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 3" id="step-3">
          <div>Step 3 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 4" id="step-4">
          <div>Step 4 content</div>
        </calcite-stepper-item>
      </calcite-stepper>`,
      { display: "grid" }
    ));

  it("renders default props when none are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-stepper>
      <calcite-stepper-item item-title="Step 1" id="step-1">
        <div>Step 1 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 2" id="step-2">
        <div>Step 2 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 3" id="step-3">
        <div>Step 3 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 4" id="step-4">
        <div>Step 4 content</div>
      </calcite-stepper-item>
    </calcite-stepper>`);
    const element = await page.find("calcite-stepper");
    expect(element).toEqualAttribute("layout", "horizontal");
    expect(element).toEqualAttribute("scale", "m");
    expect(element).not.toHaveAttribute("numbered");
    expect(element).not.toHaveAttribute("icon");
  });

  it("renders requested props when valid props are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-stepper layout="vertical" scale="l" numbered icon>
      <calcite-stepper-item item-title="Step 1" id="step-1">
        <div>Step 1 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 2" id="step-2">
        <div>Step 2 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 3" id="step-3">
        <div>Step 3 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 4" id="step-4">
        <div>Step 4 content</div>
      </calcite-stepper-item>
    </calcite-stepper>`);
    const element = await page.find("calcite-stepper");
    expect(element).toEqualAttribute("layout", "vertical");
    expect(element).toEqualAttribute("scale", "l");
    expect(element).toHaveAttribute("numbered");
    expect(element).toHaveAttribute("icon");
  });

  it("honors hidden attribute", async () => hidden("calcite-stepper"));

  it("adds selected attribute to requested item", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-stepper layout="vertical" scale="l" numbered icon>
      <calcite-stepper-item item-title="Step 1" id="step-1">
        <div>Step 1 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 2" id="step-2">
        <div>Step 2 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 3" id="step-3" selected>
        <div>Step 3 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 4" id="step-4">
        <div>Step 4 content</div>
      </calcite-stepper-item>
    </calcite-stepper>`);
    const step1 = await page.find("#step-1");
    const step2 = await page.find("#step-2");
    const step3 = await page.find("#step-3");
    const step4 = await page.find("#step-4");
    expect(step1).not.toHaveAttribute("active");
    expect(step1).not.toHaveAttribute("selected");

    expect(step2).not.toHaveAttribute("active");
    expect(step2).not.toHaveAttribute("selected");

    expect(step3).toHaveAttribute("active");
    expect(step3).toHaveAttribute("selected");

    expect(step4).not.toHaveAttribute("active");
    expect(step4).not.toHaveAttribute("selected");
  });

  it("adds active attribute to first item if none are requested", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-stepper layout="vertical" scale="l" numbered icon>
      <calcite-stepper-item item-title="Step 1" id="step-1">
        <div>Step 1 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 2" id="step-2">
        <div>Step 2 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 3" id="step-3">
        <div>Step 3 content</div>
      </calcite-stepper-item>
      <calcite-stepper-item item-title="Step 4" id="step-4">
        <div>Step 4 content</div>
      </calcite-stepper-item>
    </calcite-stepper>`);
    const step1 = await page.find("#step-1");
    const step2 = await page.find("#step-2");
    const step3 = await page.find("#step-3");
    const step4 = await page.find("#step-4");
    expect(step1).toHaveAttribute("active");
    expect(step1).toHaveAttribute("selected");

    expect(step2).not.toHaveAttribute("active");
    expect(step2).not.toHaveAttribute("selected");

    expect(step3).not.toHaveAttribute("active");
    expect(step3).not.toHaveAttribute("selected");

    expect(step4).not.toHaveAttribute("active");
    expect(step4).not.toHaveAttribute("selected");
  });

  describe("navigation", () => {
    it("navigates correctly with nextStep and prevStep methods", async () => {
      const page = await newE2EPage();
      await page.setContent(html`<calcite-stepper>
        <calcite-stepper-item item-title="Step 1" id="step-1">
          <div>Step 1 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 2" id="step-2" selected>
          <div>Step 2 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 3" id="step-3">
          <div>Step 3 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 4" id="step-4">
          <div>Step 4 content</div>
        </calcite-stepper-item>
      </calcite-stepper>`);
      const element = await page.find("calcite-stepper");
      const step1 = await page.find("#step-1");
      const step2 = await page.find("#step-2");
      const step3 = await page.find("#step-3");
      const step4 = await page.find("#step-4");
      const step1Content = await page.find("#step-1 >>> .stepper-item-content");
      const step2Content = await page.find("#step-2 >>> .stepper-item-content");
      const step3Content = await page.find("#step-3 >>> .stepper-item-content");
      const step4Content = await page.find("#step-4 >>> .stepper-item-content");
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).toHaveAttribute("active");
      expect(step2).toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(step4).not.toHaveAttribute("active");
      expect(step4).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(true);
      expect(await step3Content.isVisible()).toBe(false);
      expect(await step4Content.isVisible()).toBe(false);
      await element.callMethod("nextStep");
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("selected");
      expect(step3).toHaveAttribute("active");
      expect(step3).toHaveAttribute("selected");
      expect(step4).not.toHaveAttribute("active");
      expect(step4).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(true);
      expect(await step4Content.isVisible()).toBe(false);
      await element.callMethod("prevStep");
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).toHaveAttribute("active");
      expect(step2).toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(step4).not.toHaveAttribute("active");
      expect(step4).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(true);
      expect(await step3Content.isVisible()).toBe(false);
      expect(await step4Content.isVisible()).toBe(false);
    });

    it("navigates disabled items correctly with nextStep and prevStep methods", async () => {
      const page = await newE2EPage();
      await page.setContent(html`<calcite-stepper>
        <calcite-stepper-item item-title="Step 1" id="step-1" selected>
          <div>Step 1 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 2" id="step-2" disabled>
          <div>Step 2 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 3" id="step-3">
          <div>Step 3 content</div>
        </calcite-stepper-item>
      </calcite-stepper>`);
      const element = await page.find("calcite-stepper");
      const step1 = await page.find("#step-1");
      const step2 = await page.find("#step-2");
      const step3 = await page.find("#step-3");
      const step1Content = await page.find("#step-1 >>> .stepper-item-content");
      const step2Content = await page.find("#step-2 >>> .stepper-item-content");
      const step3Content = await page.find("#step-3 >>> .stepper-item-content");
      expect(step1).toHaveAttribute("active");
      expect(step1).toHaveAttribute("selected");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(true);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(false);
      await element.callMethod("nextStep");
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("active");
      expect(step3).toHaveAttribute("active");
      expect(step3).toHaveAttribute("active");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(true);
      await element.callMethod("prevStep");
      await page.waitForChanges();
      expect(step1).toHaveAttribute("active");
      expect(step1).toHaveAttribute("selected");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(true);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(false);
    });

    it("navigates correctly with startStep and endStep methods", async () => {
      const page = await newE2EPage();
      await page.setContent(html`<calcite-stepper>
        <calcite-stepper-item item-title="Step 1" id="step-1">
          <div>Step 1 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 2" id="step-2">
          <div>Step 2 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 3" id="step-3">
          <div>Step 3 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 4" id="step-4">
          <div>Step 4 content</div>
        </calcite-stepper-item>
      </calcite-stepper>`);
      const element = await page.find("calcite-stepper");
      const step1 = await page.find("#step-1");
      const step2 = await page.find("#step-2");
      const step3 = await page.find("#step-3");
      const step4 = await page.find("#step-4");
      const step1Content = await page.find("#step-1 >>> .stepper-item-content");
      const step2Content = await page.find("#step-2 >>> .stepper-item-content");
      const step3Content = await page.find("#step-3 >>> .stepper-item-content");
      const step4Content = await page.find("#step-4 >>> .stepper-item-content");
      await element.callMethod("startStep");
      await page.waitForChanges();
      expect(step1).toHaveAttribute("active");
      expect(step1).toHaveAttribute("selected");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(step4).not.toHaveAttribute("active");
      expect(step4).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(true);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(false);
      expect(await step4Content.isVisible()).toBe(false);
      await element.callMethod("endStep");
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(step4).toHaveAttribute("active");
      expect(step4).toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(false);
      expect(await step4Content.isVisible()).toBe(true);
    });

    it("navigates disabled items correctly with startStep and endStep methods", async () => {
      const page = await newE2EPage();
      await page.setContent(html`<calcite-stepper>
        <calcite-stepper-item item-title="Step 1" id="step-1" disabled>
          <div>Step 1 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 2" id="step-2">
          <div>Step 2 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 3" id="step-3">
          <div id="step-3 >>> .stepper-item-content">Step 3 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 4" id="step-4" disabled>
          <div>Step 4 content</div>
        </calcite-stepper-item>
      </calcite-stepper>`);
      const element = await page.find("calcite-stepper");
      const step1 = await page.find("#step-1");
      const step2 = await page.find("#step-2");
      const step3 = await page.find("#step-3");
      const step4 = await page.find("#step-4");
      const step1Content = await page.find("#step-1 >>> .stepper-item-content");
      const step2Content = await page.find("#step-2 >>> .stepper-item-content");
      const step3Content = await page.find("#step-3 >>> .stepper-item-content");
      const step4Content = await page.find("#step-4 >>> .stepper-item-content");
      await element.callMethod("endStep");
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("selected");
      expect(step3).toHaveAttribute("active");
      expect(step3).toHaveAttribute("selected");
      expect(step4).not.toHaveAttribute("active");
      expect(step4).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(true);
      expect(await step4Content.isVisible()).toBe(false);
      await element.callMethod("startStep");
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).toHaveAttribute("active");
      expect(step2).toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(step4).not.toHaveAttribute("active");
      expect(step4).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(true);
      expect(await step3Content.isVisible()).toBe(false);
      expect(await step4Content.isVisible()).toBe(false);
    });

    it("navigates to requested step with goToStep method", async () => {
      const page = await newE2EPage();
      await page.setContent(html`<calcite-stepper>
        <calcite-stepper-item item-title="Step 1" id="step-1">
          <div>Step 1 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 2" id="step-2">
          <div>Step 2 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 3" id="step-3">
          <div>Step 3 content</div>
        </calcite-stepper-item>
        <calcite-stepper-item item-title="Step 4" id="step-4">
          <div>Step 4 content</div>
        </calcite-stepper-item>
      </calcite-stepper>`);
      const element = await page.find("calcite-stepper");
      const step1 = await page.find("#step-1");
      const step2 = await page.find("#step-2");
      const step3 = await page.find("#step-3");
      const step4 = await page.find("#step-4");
      const step1Content = await page.find("#step-1 >>> .stepper-item-content");
      const step2Content = await page.find("#step-2 >>> .stepper-item-content");
      const step3Content = await page.find("#step-3 >>> .stepper-item-content");
      const step4Content = await page.find("#step-4 >>> .stepper-item-content");
      await element.callMethod("goToStep", 4);
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).not.toHaveAttribute("active");
      expect(step2).not.toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(step4).toHaveAttribute("active");
      expect(step4).toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(false);
      expect(await step3Content.isVisible()).toBe(false);
      expect(await step4Content.isVisible()).toBe(true);
      await element.callMethod("goToStep", 2);
      await page.waitForChanges();
      expect(step1).not.toHaveAttribute("active");
      expect(step1).not.toHaveAttribute("selected");
      expect(step2).toHaveAttribute("active");
      expect(step2).toHaveAttribute("selected");
      expect(step3).not.toHaveAttribute("active");
      expect(step3).not.toHaveAttribute("selected");
      expect(step4).not.toHaveAttribute("active");
      expect(step4).not.toHaveAttribute("selected");
      expect(await step1Content.isVisible()).toBe(false);
      expect(await step2Content.isVisible()).toBe(true);
      expect(await step3Content.isVisible()).toBe(false);
      expect(await step4Content.isVisible()).toBe(false);
    });

    it("next/previous methods work when placed inside shadow DOM (#992)", async () => {
      const templateHTML = html`
        <calcite-stepper id="stepper">
          <calcite-stepper-item id="item-1" selected item-title="Add info" item-subtitle="Subtitle lorem ipsum" complete
            >Step 1 Content here lorem ipsum</calcite-stepper-item
          >
          <calcite-stepper-item id="item-2" item-title="Add data" item-subtitle="Error example" error
            >Step 2 Content here error</calcite-stepper-item
          >
          <calcite-stepper-item id="item-3" item-title="Upload images" item-subtitle="Subtitle lorem ipsum">
            Step 3 Content here dolor set amet et geographica</calcite-stepper-item
          >
          <calcite-stepper-item id="item-4" item-title="Review" item-subtitle="Disabled example" disabled
            >Step 4 Content here</calcite-stepper-item
          >
        </calcite-stepper>
        <calcite-button id="prev">Previous Step</calcite-button>
        <calcite-button id="next">Next Step</calcite-button>
      `;

      const page = await newE2EPage({ html: templateHTML });

      await page.waitForChanges();

      const finalSelectedItem = await page.evaluate(
        async (templateHTML: string): Promise<string> => {
          const wrapperName = "test-calcite-stepper";

          customElements.define(
            wrapperName,
            class extends HTMLElement {
              constructor() {
                super();
              }

              connectedCallback(): void {
                this.attachShadow({ mode: "open" }).innerHTML = templateHTML;
                const stepper = this.shadowRoot.getElementById("stepper") as HTMLCalciteStepperElement;
                this.shadowRoot.getElementById("next").addEventListener("click", () => stepper.nextStep());
                this.shadowRoot.getElementById("prev").addEventListener("click", () => stepper.prevStep());
              }
            }
          );

          document.body.innerHTML = `<${wrapperName}></${wrapperName}>`;

          const wrapper = document.querySelector(wrapperName);

          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          wrapper.shadowRoot.querySelector<HTMLElement>("#item-2").click();
          wrapper.shadowRoot.querySelector<HTMLElement>("#next").click();
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

          return wrapper.shadowRoot.querySelector("calcite-stepper-item[selected]").id;
        },
        [templateHTML]
      );

      expect(finalSelectedItem).toBe("item-3");
    });
  });

  describe("should emit calciteStepperItemChange on user interaction", () => {
    let layout: HTMLCalciteStepperElement["layout"];

    async function assertEmitting(page: E2EPage, hasContent: boolean): Promise<void> {
      const element = await page.find("calcite-stepper");
      const eventSpy = await element.spyOnEvent("calciteStepperItemChange");
      const firstItem = await page.find("#step-1");

      let expectedEvents = 0;

      // non user interaction
      firstItem.setProperty("active", true);
      await page.waitForChanges();
      expect(eventSpy).toHaveReceivedEventTimes(expectedEvents);

      // we use browser-context function to click on items to workaround `E2EElement#click` error
      async function itemClicker(item: HTMLCalciteStepperItemElement) {
        item.click();
      }

      await page.$eval("#step-2", itemClicker);
      expect(eventSpy).toHaveReceivedEventTimes(++expectedEvents);
      expect(eventSpy.lastEvent.detail.position).toBe(1);

      if (hasContent) {
        await page.$eval("#step-1", (item: HTMLCalciteStepperItemElement) =>
          item.shadowRoot.querySelector<HTMLElement>(".stepper-item-content").click()
        );

        if (layout === "vertical") {
          expect(eventSpy).toHaveReceivedEventTimes(++expectedEvents);
          expect(eventSpy.lastEvent.detail.position).toBe(0);
        } else {
          // no events since horizontal layout moves content outside of item selection hit area
          expect(eventSpy).toHaveReceivedEventTimes(expectedEvents);
        }
      }

      // disabled item
      await page.$eval("#step-3", itemClicker);
      expect(eventSpy).toHaveReceivedEventTimes(expectedEvents);

      await page.$eval("#step-4", itemClicker);
      expect(eventSpy).toHaveReceivedEventTimes(++expectedEvents);
      expect(eventSpy.lastEvent.detail.position).toBe(3);

      await element.callMethod("prevStep");
      await page.waitForChanges();
      expect(eventSpy).toHaveReceivedEventTimes(expectedEvents);

      await element.callMethod("nextStep");
      await page.waitForChanges();
      expect(eventSpy).toHaveReceivedEventTimes(expectedEvents);
    }

    describe("horizontal layout", () => {
      beforeAll(() => {
        layout = "horizontal";
      });

      it("emits with content", async () => {
        const page = await newE2EPage();
        await page.setContent(
          html`<calcite-stepper layout="${layout}">
            <calcite-stepper-item item-title="Step 1" id="step-1">
              <div>Step 1 content</div>
            </calcite-stepper-item>
            <calcite-stepper-item item-title="Step 2" id="step-2">
              <div>Step 2 content</div>
            </calcite-stepper-item>
            <calcite-stepper-item item-title="Step 3" id="step-3" disabled>
              <div>Step 3 content</div>
            </calcite-stepper-item>
            <calcite-stepper-item item-title="Step 4" id="step-4">
              <div>Step 4 content</div>
            </calcite-stepper-item>
          </calcite-stepper>`
        );

        await assertEmitting(page, true);
      });

      it("emits without content", async () => {
        const page = await newE2EPage();
        await page.setContent(
          html`<calcite-stepper layout="${layout}">
            <calcite-stepper-item item-title="Step 1" id="step-1"></calcite-stepper-item>
            <calcite-stepper-item item-title="Step 2" id="step-2"></calcite-stepper-item>
            <calcite-stepper-item item-title="Step 3" id="step-3" disabled></calcite-stepper-item>
            <calcite-stepper-item item-title="Step 4" id="step-4"></calcite-stepper-item>
          </calcite-stepper>`
        );

        await assertEmitting(page, false);
      });
    });

    describe("vertical layout", () => {
      beforeAll(() => {
        layout = "vertical";
      });

      it("emits with content", async () => {
        const page = await newE2EPage();
        await page.setContent(
          html`<calcite-stepper layout="${layout}">
            <calcite-stepper-item item-title="Step 1" id="step-1">
              <div>Step 1 content</div>
            </calcite-stepper-item>
            <calcite-stepper-item item-title="Step 2" id="step-2">
              <div>Step 2 content</div>
            </calcite-stepper-item>
            <calcite-stepper-item item-title="Step 3" id="step-3" disabled>
              <div>Step 3 content</div>
            </calcite-stepper-item>
            <calcite-stepper-item item-title="Step 4" id="step-4">
              <div>Step 4 content</div>
            </calcite-stepper-item>
          </calcite-stepper>`
        );

        await assertEmitting(page, true);
      });

      it("emits without content", async () => {
        const page = await newE2EPage();
        await page.setContent(
          html`<calcite-stepper layout="${layout}">
            <calcite-stepper-item item-title="Step 1" id="step-1"></calcite-stepper-item>
            <calcite-stepper-item item-title="Step 2" id="step-2"></calcite-stepper-item>
            <calcite-stepper-item item-title="Step 3" id="step-3" disabled></calcite-stepper-item>
            <calcite-stepper-item item-title="Step 4" id="step-4"></calcite-stepper-item>
          </calcite-stepper>`
        );

        await assertEmitting(page, false);
      });
    });
  });
});
