import { newE2EPage } from "@stencil/core/testing";
import { accessible, renders, hidden } from "../../tests/commonTests";
import { html } from "../../../support/formatting";

describe("calcite-tab-nav", () => {
  const tabNavHtml = "<calcite-tab-nav></calcite-tab-nav>";

  it("renders", async () => await renders(tabNavHtml, { display: "flex" }));

  it("honors hidden attribute", async () => hidden("calcite-tab-nav"));

  it("is accessible", async () => await accessible(tabNavHtml));

  it("emits on user interaction", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-tab-nav>
      <calcite-tab-title>Tab 1 Title</calcite-tab-title>
    </calcite-tab-nav>`);
    const activeEventSpy = await page.spyOnEvent("calciteTabChange");
    const firstTabTitle = await page.find("calcite-tab-title");

    firstTabTitle.setProperty("active", true);
    await page.waitForChanges();
    expect(activeEventSpy).toHaveReceivedEventTimes(0);

    await firstTabTitle.click();
    expect(activeEventSpy).toHaveReceivedEventTimes(1);

    await page.keyboard.press("Enter");
    expect(activeEventSpy).toHaveReceivedEventTimes(2);
  });

  describe("active indicator", () => {
    const tabTitles = html`
      <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
      <calcite-tab-title>Tab 2 Title</calcite-tab-title>
      <calcite-tab-title>Tab 3 Title</calcite-tab-title>
      <calcite-tab-title>Tab 4 Title</calcite-tab-title>
    `;

    it("has its active indicator positioned from left if LTR", async () => {
      const page = await newE2EPage();
      await page.setContent(`<calcite-tab-nav>${tabTitles}</calcite-tab-nav>`);
      const element = await page.find("calcite-tab-nav >>> .tab-nav-active-indicator");
      const style = await element.getComputedStyle();
      expect(style["left"]).toBe("0px");
      expect(style["right"]).not.toBe("0px");
      expect(style["width"]).not.toBe("0px");
    });

    it("has its active indicator positioned from right if RTL", async () => {
      const page = await newE2EPage();
      await page.setContent(`<calcite-tab-nav dir='rtl'>${tabTitles}</calcite-tab-nav>`);
      const element = await page.find("calcite-tab-nav >>> .tab-nav-active-indicator");
      const style = await element.getComputedStyle();
      expect(style["right"]).toBe("0px");
      expect(style["left"]).not.toBe("0px");
      expect(style["width"]).not.toBe("0px");
    });

    it("updates position when made visible", async () => {
      const page = await newE2EPage();
      await page.setContent(`<calcite-tab-nav hidden>${tabTitles}</calcite-tab-nav>`);
      const tabNav = await page.find("calcite-tab-nav");
      const indicator = await page.find("calcite-tab-nav >>> .tab-nav-active-indicator");

      tabNav.setProperty("hidden", false);
      await page.waitForChanges();

      const style = await indicator.getComputedStyle();
      expect(style["width"]).not.toBe("0px");
    });
  });

  describe("scale property", () => {
    describe("default", () => {
      it("should render without scale", async () => {
        const page = await newE2EPage({
          html: `${tabNavHtml}`
        });
        const element = await page.find("calcite-tab-nav");
        expect(element).not.toHaveAttribute("scale");
      });
    });

    describe("when scale is small", () => {
      it("should render with small scale", async () => {
        const page = await newE2EPage({
          html: `<calcite-tab-nav scale='s'>
            <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
            <calcite-tab-title>Tab 2 Title</calcite-tab-title>
            <calcite-tab-title>Tab 3 Title</calcite-tab-title>
            <calcite-tab-title>Tab 4 Title</calcite-tab-title>
          </calcite-tab-nav>`
        });
        const element = await page.find("calcite-tab-nav");
        expect(await (await element.getComputedStyle())["minHeight"]).toEqual("24px");
        expect(element).toEqualAttribute("scale", "s");
      });
    });

    describe("when scale is medium", () => {
      it("should render with medium scale", async () => {
        const page = await newE2EPage({
          html: `<calcite-tab-nav scale='m'>
            <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
            <calcite-tab-title>Tab 2 Title</calcite-tab-title>
            <calcite-tab-title>Tab 3 Title</calcite-tab-title>
            <calcite-tab-title>Tab 4 Title</calcite-tab-title>
          </calcite-tab-nav>`
        });
        const element = await page.find("calcite-tab-nav");
        expect(await (await element.getComputedStyle())["minHeight"]).toEqual("32px");
        expect(element).toEqualAttribute("scale", "m");
      });
    });

    describe("when scale is large", () => {
      it("should render with medium scale", async () => {
        const page = await newE2EPage({
          html: `<calcite-tab-nav scale='l'>
            <calcite-tab-title active>Tab 1 Title</calcite-tab-title>
            <calcite-tab-title>Tab 2 Title</calcite-tab-title>
            <calcite-tab-title>Tab 3 Title</calcite-tab-title>
            <calcite-tab-title>Tab 4 Title</calcite-tab-title>
          </calcite-tab-nav>`
        });
        const element = await page.find("calcite-tab-nav");
        expect(await (await element.getComputedStyle())["minHeight"]).toEqual("44px");
        expect(element).toEqualAttribute("scale", "l");
      });
    });

    describe("when nested within tabs parent", () => {
      it("should render with default medium scale", async () => {
        const page = await newE2EPage({
          html: `<calcite-tabs>${tabNavHtml}</calcite-tabs>`
        });
        const element = await page.find("calcite-tab-nav");
        expect(element).toEqualAttribute("scale", "m");
      });

      describe("when tabs scale is small", () => {
        it("should render with small scale", async () => {
          const page = await newE2EPage({
            html: `<calcite-tabs scale="s">${tabNavHtml}</calcite-tabs>`
          });
          const element = await page.find("calcite-tab-nav");
          expect(element).toEqualAttribute("scale", "s");
        });
      });

      describe("when tabs scale is large", () => {
        it("should render with large scale", async () => {
          const page = await newE2EPage({
            html: `<calcite-tabs scale="l">${tabNavHtml}</calcite-tabs>`
          });
          const element = await page.find("calcite-tab-nav");
          expect(element).toEqualAttribute("scale", "l");
        });
      });
    });
  });
});
