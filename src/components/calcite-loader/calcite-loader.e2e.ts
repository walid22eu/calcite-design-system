import { newE2EPage } from "@stencil/core/testing";
import { HYDRATED_ATTR } from "../../tests/commonTests";

describe("calcite-loader", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-loader></calcite-loader>");
    const loader = await page.find("calcite-loader");
    expect(loader).toHaveAttribute(HYDRATED_ATTR);
  });

  it("becomes visible when active prop is set", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-loader></calcite-loader>`);
    const loader = await page.find("calcite-loader");
    expect(await loader.isVisible()).not.toBe(true);
    loader.setProperty("active", true);
    await page.waitForChanges();
    expect(await loader.isVisible()).toBe(true);
  });

  it("displays label from text prop", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-loader active text="testing"></calcite-loader>`
    );
    const elm = await page.find("calcite-loader >>> .loader__text");
    expect(elm).toEqualText("testing");
  });

  it("sets aria attributes properly for indeterminate loader", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-loader></calcite-loader>`);
    const loader = await page.find("calcite-loader");
    expect(loader).toEqualAttribute("role", "progressbar");
    expect(loader).not.toHaveAttribute("aria-valuemin");
    expect(loader).not.toHaveAttribute("aria-valuemax");
    expect(loader).not.toHaveAttribute("aria-valuenow");
  });

  it("sets aria attributes properly for determinate loader", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-loader type="determinate"></calcite-loader>`
    );
    const loader = await page.find("calcite-loader");
    expect(loader).toHaveAttribute("aria-valuenow");
    expect(loader).toEqualAttribute("aria-valuenow", 0);
    expect(loader).toEqualAttribute("aria-valuemin", 0);
    expect(loader).toEqualAttribute("aria-valuemax", 100);
    loader.setProperty("value", 24);
    await page.waitForChanges();
    expect(loader).toEqualAttribute("aria-valuenow", 24);
  });

  it("displays inline with text from inline prop", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-loader active inline></calcite-loader>`);
    const rect = await page.find("calcite-loader >>> circle");
    expect(rect).toEqualAttribute("r", "7.2");
  });

  it("validates scale and type properties", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-loader scale="bleep" type="bloop"></calcite-loader>`
    );
    const loader = await page.find("calcite-loader");
    expect(loader).toEqualAttribute("scale", "m");
    expect(loader).toEqualAttribute("type", "indeterminate");
  });
});
