import { newE2EPage, E2EPage, E2EElement } from "@stencil/core/testing";
import { disabled, HYDRATED_ATTR, renders, hidden } from "../../tests/commonTests";
import { html } from "../../../support/formatting";
import { CSS } from "./resources";

describe("calcite-tab-title", () => {
  const tabTitleHtml = "<calcite-tab-title></calcite-tab-title>";
  const tabTitleClosableHtml = "<calcite-tab-title closable></calcite-tab-title>";
  const multiTabTitleClosableMarkup = `
    <calcite-tabs bordered position="top">
      <calcite-tab-nav slot="title-group">
        <calcite-tab-title id="title1" closable>Watercraft</calcite-tab-title>
        <calcite-tab-title id="title2" closable>Automobiles</calcite-tab-title>
        <calcite-tab-title id="title3" closable>Aircraft</calcite-tab-title>
        <calcite-tab-title id="title4" closable>Bicycles</calcite-tab-title>
      </calcite-tab-nav>
      <calcite-tab id="tab1">
        <calcite-notice icon="embark" open>
          <div slot="message">Recommended for coastal use</div>
        </calcite-notice>
      </calcite-tab>
      <calcite-tab id="tab2">
        <calcite-notice icon="car" open>
          <div slot="message">A good choice for inland adventure</div>
        </calcite-notice>
      </calcite-tab>
      <calcite-tab id="tab3">
        <calcite-notice icon="plane" open>
          <div slot="message">Cross continents quickly</div>
        </calcite-notice>
      </calcite-tab>
      <calcite-tab id="tab4">
        <calcite-notice icon="biking" open>
          <div slot="message">Healthy and gets you from point A to B</div>
        </calcite-notice>
      </calcite-tab>
    </calcite-tabs>
  `;
  const iconStartSelector = `calcite-tab-title >>> .${CSS.titleIcon}.${CSS.iconStart}`;
  const iconEndSelector = `calcite-tab-title >>> .${CSS.titleIcon}.${CSS.iconEnd}`;
  const closeSelector = `calcite-tab-title >>> .${CSS.closeButton}`;

  describe("renders", () => {
    renders(tabTitleHtml, { display: "block" });
    renders(multiTabTitleClosableMarkup, { display: "flex" });
  });

  describe("honors hidden attribute", () => {
    hidden("calcite-tab-title");
  });

  describe("disabled", () => {
    disabled("<calcite-tab-title selected></calcite-tab-title>");
  });

  it("renders with an icon-start", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-tab-title icon-start='plus'>Text</calcite-tab-title>`);
    const element = await page.find("calcite-tab-title");
    const iconStart = await page.find(iconStartSelector);
    const iconEnd = await page.find(iconEndSelector);
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(iconStart).not.toBeNull();
    expect(iconEnd).toBeNull();
  });

  it("renders with an icon-end", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-tab-title icon-end='plus'>Text</calcite-tab-title>`);
    const element = await page.find("calcite-tab-title");
    const iconStart = await page.find(iconStartSelector);
    const iconEnd = await page.find(iconEndSelector);
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(iconStart).toBeNull();
    expect(iconEnd).not.toBeNull();
  });

  it("renders with an icon-start and icon-end", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-tab-title icon-start='plus' icon-end='plus'>Text</calcite-tab-title>`);
    const element = await page.find("calcite-tab-title");
    const iconStart = await page.find(iconStartSelector);
    const iconEnd = await page.find(iconEndSelector);
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(iconStart).not.toBeNull();
    expect(iconEnd).not.toBeNull();
  });

  describe("basic closing behavior", () => {
    let page: E2EPage;

    beforeEach(async () => {
      page = await newE2EPage();
      await page.setContent(tabTitleClosableHtml);
    });

    it("clicking on close button closes the tab", async () => {
      const close = await page.find(closeSelector);

      await close.click();
      await page.waitForChanges();

      const containerEl = await page.find(`calcite-tab-title >>> .${CSS.container}`);
      expect(await containerEl.getProperty("hidden")).toBe(true);
    });

    it("becomes no longer closable when it's the last remaining tab", async () => {
      page = await newE2EPage();
      await page.setContent(
        html`
          <tab-nav>
            <calcite-tab-title id="one" closable>Text</calcite-tab-title>
            <calcite-tab-title id="two" closable>Text</calcite-tab-title>
          </tab-nav>
        `
      );

      let containerElOne = await page.find(`calcite-tab-title[id='one']`);
      const closeOne = await page.find(`calcite-tab-title[id='one'] >>> .${CSS.closeButton}`);
      expect(containerElOne).toHaveAttribute(HYDRATED_ATTR);

      await closeOne.click();
      await page.waitForChanges();

      containerElOne = await page.find(`calcite-tab-title[id='one']>>> .${CSS.container}`);
      expect(await containerElOne.getProperty("hidden")).toBe(true);

      const closeTwo = await page.find(`calcite-tab-title[id='two'] >>> .${CSS.closeButton}`);
      expect(await closeTwo.getProperty("closable")).not.toBe(true);
    });
  });

  describe("closing sequence", () => {
    let page: E2EPage;

    let matchingTabEl: E2EElement;
    let tabTitleCloseButtonEl: E2EElement;

    const closeTabsInSequenceOfGivenArrayOfIds = async (arrayOfIds: string[]): Promise<void> => {
      for (let i = 0; i < arrayOfIds.length - 1; i++) {
        let tabEl: E2EElement;
        let tabTitleContainerEl: E2EElement;

        const id = arrayOfIds[i];

        tabEl = await page.find(`#${id}`);
        tabTitleContainerEl = await page.find(`calcite-tab-title[id='${id}'] >>> .${CSS.container}`);
        const tabTitleCloseButtonEl = await page.find(`calcite-tab-title[id='${id}'] >>> .${CSS.closeButton}`);

        expect(await tabTitleContainerEl.getProperty("hidden")).not.toBe(true);

        await tabTitleCloseButtonEl.click();
        await page.waitForChanges();

        const tabTitleEl = await page.find(`#${id}`);
        tabEl = await page.find(`#${id}`);
        tabTitleContainerEl = await page.find(`calcite-tab-title[id='${id}'] >>> .${CSS.container}`);

        expect(await tabTitleContainerEl.getProperty("hidden")).toBe(true);
        expect(await tabTitleEl.getProperty("selected")).not.toBe(true);
        expect(await tabEl.getProperty("selected")).not.toBe(true);

        const nextId = arrayOfIds[i + 1];
        const nextTabTitleEl = await page.find(`#${nextId}`);
        const nextTabEl = await page.find(`#${nextId}`);
        const nextTabTitleContainerEl = await page.find(`calcite-tab-title[id='${nextId}'] >>> .${CSS.container}`);

        expect(await nextTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
        expect(await nextTabTitleEl.getProperty("selected")).toBe(true);
        expect(await nextTabEl.getProperty("selected")).toBe(true);
      }
    };

    beforeEach(async () => {
      page = await newE2EPage();
      await page.setContent(multiTabTitleClosableMarkup);
    });

    it(`when closing tab-titles in sequence 1 (first selected) through 4, 
        tab-title and corresponding tab become hidden, 
        and selection fallback is the next tab`, async () => {
      await closeTabsInSequenceOfGivenArrayOfIds(["title1", "title2", "title3", "title4"]);
    });

    it(`when closing tab-titles in sequence 4 (last selected) through 1, 
        tab-title and corresponding tab become hidden, 
        and selection fallback is the previous tab`, async () => {
      const arrayOfReversedIds = ["title1", "title2", "title3", "title4"].reverse();

      const bikingTabTitleEl = await page.find(`#title4`);
      bikingTabTitleEl.setProperty("selected", true);

      await page.waitForChanges();

      await closeTabsInSequenceOfGivenArrayOfIds(arrayOfReversedIds);
    });

    it(`closing an unselected tab-title does not deselect the current selection`, async () => {
      const selectedEmbarkTabEl = await page.find("#tab1");
      const selectedEmbarkTabTitleContainerEl = await page.find(`#title1>>> .${CSS.container}`);

      const carTabTitleContainerEl = await page.find(`#title2 >>> .${CSS.container}`);
      matchingTabEl = await page.find("#tab2");
      tabTitleCloseButtonEl = await page.find(`#title2 >>> .${CSS.closeButton}`);

      await tabTitleCloseButtonEl.click();
      await page.waitForChanges();

      expect(await carTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await matchingTabEl.getProperty("selected")).not.toBe(true);

      expect(await selectedEmbarkTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await selectedEmbarkTabEl.getProperty("selected")).toBe(true);

      const planeTabTitleContainerEl = await page.find(`#title3 >>> .${CSS.container}`);
      matchingTabEl = await page.find("#tab3");
      tabTitleCloseButtonEl = await page.find(`#title3 >>> .${CSS.closeButton}`);

      await tabTitleCloseButtonEl.click();
      await page.waitForChanges();

      expect(await carTabTitleContainerEl.getProperty("hidden")).toBe(true);

      expect(await planeTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await matchingTabEl.getProperty("selected")).not.toBe(true);

      expect(await selectedEmbarkTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await selectedEmbarkTabEl.getProperty("selected")).toBe(true);

      const bikingTabTitleContainerEl = await page.find(`#title4 >>> .${CSS.container}`);
      matchingTabEl = await page.find("#tab4");
      tabTitleCloseButtonEl = await page.find(`#title4 >>> .${CSS.closeButton}`);

      await tabTitleCloseButtonEl.click();
      await page.waitForChanges();

      expect(await carTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await planeTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await bikingTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await matchingTabEl.getProperty("selected")).not.toBe(true);

      expect(await selectedEmbarkTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await selectedEmbarkTabEl.getProperty("selected")).toBe(true);
    });

    it(`case 1: works with randomized closing sequence with mixed selected and not`, async () => {
      const carTabTitleEl = await page.find(`#title2`);
      const carTabTitleContainerEl = await page.find(`#title2 >>> .${CSS.container}`);
      matchingTabEl = await page.find("#tab2");

      carTabTitleEl.setProperty("selected", true);
      await page.waitForChanges();

      expect(await matchingTabEl.getProperty("selected")).toBe(true);

      const embarkTabTitleContainerEl = await page.find(`#title1 >>> .${CSS.container}`);
      tabTitleCloseButtonEl = await page.find(`#title1 >>> .${CSS.closeButton}`);

      await tabTitleCloseButtonEl.click();
      await page.waitForChanges();

      expect(await embarkTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await carTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await carTabTitleEl.getProperty("selected")).toBe(true);
      expect(await matchingTabEl.getProperty("selected")).toBe(true);

      const planeTabTitleContainerEl = await page.find(`#title3 >>> .${CSS.container}`);
      matchingTabEl = await page.find("#tab3");
      tabTitleCloseButtonEl = await page.find(`#title2 >>> .${CSS.closeButton}`);

      await tabTitleCloseButtonEl.click();
      await page.waitForChanges();

      expect(await carTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await planeTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await carTabTitleEl.getProperty("selected")).not.toBe(true);
      expect(await matchingTabEl.getProperty("selected")).toBe(true);
    });

    it(`case 2: works with randomized closing sequence with mixed selected and not`, async () => {
      const carTabTitleEl = await page.find(`#title2`);
      const carTabTitleContainerEl = await page.find(`#title2 >>> .${CSS.container}`);
      matchingTabEl = await page.find("#tab2");

      carTabTitleEl.setProperty("selected", true);
      await page.waitForChanges();

      expect(await matchingTabEl.getProperty("selected")).toBe(true);

      const embarkTabTitleContainerEl = await page.find(`#title1 >>> .${CSS.container}`);
      tabTitleCloseButtonEl = await page.find(`#title1 >>> .${CSS.closeButton}`);

      await tabTitleCloseButtonEl.click();
      await page.waitForChanges();

      expect(await embarkTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await carTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await carTabTitleEl.getProperty("selected")).toBe(true);
      expect(await matchingTabEl.getProperty("selected")).toBe(true);

      const planeTabTitleEl = await page.find(`#title3`);

      planeTabTitleEl.setProperty("selected", true);
      await page.waitForChanges();

      expect(await planeTabTitleEl.getProperty("selected")).toBe(true);

      const planeTabTitleContainerEl = await page.find(`#title3 >>> .${CSS.container}`);
      const bikingTabTitleContainerEl = await page.find(`#title4 >>> .${CSS.container}`);
      matchingTabEl = await page.find("#title3");
      tabTitleCloseButtonEl = await page.find(`#title2 >>> .${CSS.closeButton}`);

      await tabTitleCloseButtonEl.click();
      await page.waitForChanges();

      expect(await planeTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await carTabTitleContainerEl.getProperty("hidden")).toBe(true);
      expect(await bikingTabTitleContainerEl.getProperty("hidden")).not.toBe(true);
      expect(await planeTabTitleEl.getProperty("selected")).toBe(true);
      expect(await matchingTabEl.getProperty("selected")).toBe(true);
    });
  });

  it.skip("emits active event on user interaction only", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-tab-title>Title</calcite-tab-title>`);
    const activeEventSpy = await page.spyOnEvent("calciteTabsActivate");
    const title = await page.find("calcite-tab-title");

    title.setProperty("selected", true);
    await page.waitForChanges();
    expect(activeEventSpy).toHaveReceivedEventTimes(0);

    await title.click();
    expect(activeEventSpy).toHaveReceivedEventTimes(1);

    await page.keyboard.press("Enter");
    expect(activeEventSpy).toHaveReceivedEventTimes(2);
  });

  describe("when parent element is tab-nav", () => {
    describe("when position is top, default", () => {
      it("should render with bottom border on hover", async () => {
        const page = await newE2EPage({
          html: `
          <calcite-tab-nav>
            <calcite-tab-title id="for-hover">Tab 1 title</calcite-tab-title>
          </calcite-tab-nav>
          `,
        });
        const element = await page.find("#for-hover");
        await element.hover();

        const container = await page.find("#for-hover >>> .container");
        const containerStyles = await container.getComputedStyle();
        expect(containerStyles["border-top-width"]).toEqual("0px");
        expect(containerStyles["border-bottom-width"]).not.toEqual("0px");
      });
    });

    describe("when position is bottom", () => {
      it("should render with top border on hover", async () => {
        const page = await newE2EPage({
          html: `
          <calcite-tab-nav position="bottom">
            <calcite-tab-title selected>Tab 1 Title</calcite-tab-title>
            <calcite-tab-title id="for-hover">Tab 2 Title</calcite-tab-title>
          </calcite-tab-nav>
          `,
        });
        const element = await page.find("#for-hover");
        await element.hover();

        const container = await page.find("#for-hover >>> .container");
        const containerStyles = await container.getComputedStyle();
        expect(containerStyles["border-top-width"]).not.toEqual("0px");
        expect(containerStyles["border-bottom-width"]).toEqual("0px");
      });
    });

    describe("scale property", () => {
      let page: E2EPage;

      beforeEach(async () => {
        page = await newE2EPage();
      });

      it("should inherit default medium scale from tab-nav", async () => {
        await page.setContent(
          html`
            <calcite-tab-nav scale="m">
              <calcite-tab-title selected>Tab Title</calcite-tab-title>
              <calcite-tab-title>Tab 2 Title</calcite-tab-title>
            </calcite-tab-nav>
          `
        );

        const tabTitleNav = await page.find("calcite-tab-nav");
        const tabTitleEl = await page.find("calcite-tab-title");
        const content = await page.find(`calcite-tab-title >>> .${CSS.content}`);
        const contentStyles = await content.getComputedStyle();

        expect(tabTitleEl).toEqualAttribute("scale", "m");
        expect(tabTitleNav).toEqualAttribute("scale", "m");
        expect(contentStyles.fontSize).toEqual("14px");
        expect(contentStyles.lineHeight).toEqual("16px");
      });

      it("should inherit small scale from tab-nav", async () => {
        await page.setContent(
          html`
            <calcite-tab-nav scale="s">
              <calcite-tab-title selected>Tab Title</calcite-tab-title>
              <calcite-tab-title>Tab 2 Title</calcite-tab-title>
            </calcite-tab-nav>
          `
        );

        const tabTitleNav = await page.find("calcite-tab-nav");
        const tabTitleEl = await page.find("calcite-tab-title");
        const content = await page.find(`calcite-tab-title >>> .${CSS.content}`);
        const contentStyles = await content.getComputedStyle();

        expect(tabTitleEl).toEqualAttribute("scale", "s");
        expect(tabTitleNav).toEqualAttribute("scale", "s");
        expect(contentStyles.fontSize).toEqual("12px");
        expect(contentStyles.lineHeight).toEqual("16px");
      });

      it("should inherit large scale from tab-nav", async () => {
        await page.setContent(
          html`
            <calcite-tab-nav scale="l">
              <calcite-tab-title selected>Tab Title</calcite-tab-title>
              <calcite-tab-title>Tab 2 Title</calcite-tab-title>
            </calcite-tab-nav>
          `
        );

        const tabTitleNav = await page.find("calcite-tab-nav");
        const tabTitleEl = await page.find("calcite-tab-title");
        const content = await page.find(`calcite-tab-title >>> .${CSS.content}`);
        const contentStyles = await content.getComputedStyle();

        expect(tabTitleEl).toEqualAttribute("scale", "l");
        expect(tabTitleNav).toEqualAttribute("scale", "l");
        expect(contentStyles.fontSize).toEqual("16px");
        expect(contentStyles.lineHeight).toEqual("20px");
      });
    });
  });

  describe("when parent element is tabs", () => {
    describe("scale property", () => {
      it("should inherit default m scale", async () => {
        const page = await newE2EPage({
          html: `<calcite-tabs>
            <calcite-tab-title selected>Tab Title</calcite-tab-title>
            <calcite-tab-title>Tab 2 Title</calcite-tab-title>
          </calcite-tabs>`,
        });
        const element = await page.find("calcite-tab-title");
        expect(element).toEqualAttribute("scale", "m");
      });

      it("should inherit small scale from tabs", async () => {
        const page = await newE2EPage({
          html: `<calcite-tabs scale="s">
            <calcite-tab-title selected>Tab Title</calcite-tab-title>
            <calcite-tab-title>Tab 2 Title</calcite-tab-title>
          </calcite-tabs>`,
        });
        const element = await page.find("calcite-tab-title");
        expect(element).toEqualAttribute("scale", "s");
      });

      it("should inherit large scale from tabs", async () => {
        const page = await newE2EPage({
          html: `<calcite-tabs scale="l">
            <calcite-tab-title selected>Tab 1 Title</calcite-tab-title>
            <calcite-tab-title>Tab 2 Title</calcite-tab-title>
          </calcite-tabs>`,
        });
        const element = await page.find("calcite-tab-title");
        expect(element).toEqualAttribute("scale", "l");
      });
    });
  });

  describe("when the active tab-title changes", () => {
    it("should move the active tab nav indicator", async () => {
      const page = await newE2EPage({
        html: `
        <calcite-tabs>
          <calcite-tab-nav slot="title-group">
            <calcite-tab-title class="title-1">Tab 1 Title</calcite-tab-title>
            <calcite-tab-title class="title-2" selected>Tab 2 Title</calcite-tab-title>
            <calcite-tab-title>Tab 3 Title</calcite-tab-title>
            <calcite-tab-title>Tab 4 Title</calcite-tab-title>
          </calcite-tab-nav>
          <calcite-tab>Tab 1 Content</calcite-tab>
          <calcite-tab selected>Tab 2 Content</calcite-tab>
          <calcite-tab>Tab 3 Content</calcite-tab>
          <calcite-tab>Tab 4 Content</calcite-tab>
        </calcite-tabs>
        `,
      });
      const tabTitle1 = await page.find(".title-1");
      const tabTitle2 = await page.find(".title-2");

      expect(await (await page.find("calcite-tab-title[selected]")).innerText).toEqual("Tab 2 Title");
      expect(
        await page.evaluate(() => {
          return (
            document
              .querySelector("calcite-tab-nav")
              .shadowRoot.querySelector(".tab-nav-active-indicator") as HTMLDivElement
          ).style.left;
        })
      ).not.toEqual("0px");

      // toggle new selected tab-title
      await tabTitle2.removeAttribute("selected");
      await tabTitle1.setAttribute("selected", true);
      await page.waitForChanges();

      expect(await (await page.find("calcite-tab-title[selected]")).innerText).toEqual("Tab 1 Title");
      expect(
        await page.evaluate(() => {
          return (
            document
              .querySelector("calcite-tab-nav")
              .shadowRoot.querySelector(".tab-nav-active-indicator") as HTMLDivElement
          ).style.left;
        })
      ).toEqual("0px");
    });
  });
});
