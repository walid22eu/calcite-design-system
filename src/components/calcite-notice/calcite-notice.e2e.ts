import { newE2EPage } from "@stencil/core/testing";
import { HYDRATED_ATTR } from "../../tests/commonTests";

describe("calcite-notice", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-notice>
    <div slot="notice-title">Title Text</div>
    <div slot="notice-message">Message Text</div>
    <calcite-link slot="notice-link" href="">Action</calcite-link>
    </calcite-notice>`);
    const element = await page.find("calcite-notice");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
  });

  it("renders default props when none are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-notice>
    <div slot="notice-title">Title Text</div>
    <div slot="notice-message">Message Text</div>
    <calcite-link slot="notice-link" href="">Action</calcite-link>
    </calcite-notice>`);
    const element = await page.find("calcite-notice");
    const close = await page.find("calcite-notice >>> .notice-close");
    const icon = await page.find("calcite-notice >>> .notice-icon");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(element).toEqualAttribute("color", "blue");
    expect(close).toBeNull();
    expect(icon).toBeNull();
  });

  it("renders requested props when valid props are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-notice theme="dark" color="yellow" dismissible>
    <div slot="notice-title">Title Text</div>
    <div slot="notice-message">Message Text</div>
    <calcite-link slot="notice-link" href="">Action</calcite-link>
    </calcite-notice>`);

    const element = await page.find("calcite-notice");
    const close = await page.find("calcite-notice >>> .notice-close");
    const icon = await page.find("calcite-notice >>> .notice-icon");

    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(element).toEqualAttribute("color", "yellow");
    expect(element).toEqualAttribute("theme", "dark");
    expect(close).not.toBeNull();
    expect(icon).toBeNull();
  });

  it("renders an icon and close button when requested", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-notice icon dismissible>
    <div slot="notice-title">Title Text</div>
    <div slot="notice-message">Message Text</div>
    <calcite-link slot="notice-link" href="">Action</calcite-link>
    </calcite-notice>`);

    const element = await page.find("calcite-notice");
    const close = await page.find("calcite-notice >>> .notice-close");
    const icon = await page.find("calcite-notice >>> .notice-icon");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(close).not.toBeNull();
    expect(icon).not.toBeNull();
  });

  it("successfully closes a dismissible notice", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-notice id="notice-1" active dismissible>
    <div slot="notice-title">Title Text</div>
    <div slot="notice-message">Message Text</div>
    <calcite-link slot="notice-link" href="">Action</calcite-link>
    </calcite-notice>
    `);

    const notice1 = await page.find("#notice-1");
    const noticeclose1 = await page.find("#notice-1 >>> .notice-close");

    expect(await notice1.isVisible()).toBe(true);

    await noticeclose1.click();
    // wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(await notice1.isVisible()).not.toBe(true);
  });
});
