import { newE2EPage } from "@stencil/core/testing";
import { accessible, defaults, reflects, renders } from "../../tests/commonTests";

describe("calcite-option-group", () => {
  it("renders", async () => renders("calcite-option-group", { display: "block" }));

  it("is accessible", async () => accessible("calcite-option-group"));

  it("has defaults", async () =>
    defaults("calcite-option-group", [
      {
        propertyName: "disabled",
        defaultValue: false
      }
    ]));

  it("reflects", async () =>
    reflects("calcite-option-group", [
      {
        propertyName: "disabled",
        value: true
      }
    ]));

  it("has a label", async () => {
    const page = await newE2EPage({
      html: `<calcite-option-group label="test-group"></calcite-option-group>`
    });

    const group = await page.find("calcite-option-group");
    expect(group.shadowRoot.textContent).toBe("test-group");
  });
});
