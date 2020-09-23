import { newE2EPage } from "@stencil/core/testing";
import { HYDRATED_ATTR } from "../../tests/commonTests";

describe("calcite-split-button", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button>
      </calcite-split-button>`);
    const element = await page.find("calcite-split-button");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
  });

  it("renders default props when none are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button>
      </calcite-split-button>`);
    const element = await page.find("calcite-split-button");
    expect(element).toEqualAttribute("scale", "m");
    expect(element).toEqualAttribute("color", "blue");
    expect(element).toEqualAttribute("dropdown-icon-type", "chevron");
  });

  it("renders requested props when valid props are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button
          scale="s"
          color="red"
          theme="dark"
          dropdown-icon-type="caret"
          loading="true"
          disabled="true"
          dropdown-label="more actions"
          primary-label="primary action">
      </calcite-split-button>`);
    const element = await page.find("calcite-split-button");
    const primaryButton = await page.find("calcite-split-button >>> calcite-button");
    const dropdownButton = await page.find("calcite-split-button >>> calcite-dropdown calcite-button");
    expect(element).toEqualAttribute("scale", "s");
    expect(element).toEqualAttribute("color", "red");
    expect(element).toEqualAttribute("theme", "dark");
    expect(element).toEqualAttribute("dropdown-icon-type", "caret");
    expect(element).toHaveAttribute("loading");
    expect(element).toHaveAttribute("disabled");
    expect(primaryButton).toEqualAttribute("aria-label", "primary action");
    expect(dropdownButton).toEqualAttribute("aria-label", "more actions");
  });

  it("renders primaryText without icons as inner content of primary button", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button primary-text="primary action">
      </calcite-split-button>`);
    const primaryButton = await page.find("calcite-split-button >>> calcite-button");

    expect(primaryButton).toEqualText("primary action");
    expect(primaryButton).not.toHaveAttribute("icon-start");
    expect(primaryButton).not.toHaveAttribute("icon-end");
  });

  it("renders primaryText + primary-icon-start as inner content of primary button", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button primary-text="primary action" primary-icon-start="save">
      </calcite-split-button>`);
    const primaryButton = await page.find("calcite-split-button >>> calcite-button");

    expect(primaryButton).toEqualText("primary action");
    expect(primaryButton).toEqualAttribute("icon-start", "save");
    expect(primaryButton).not.toHaveAttribute("icon-end");
  });

  it("renders primaryText + primary-icon-end as inner content of primary button", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button primary-text="primary action" primary-icon-end="save">
      </calcite-split-button>`);
    const primaryButton = await page.find("calcite-split-button >>> calcite-button");
    expect(primaryButton).toEqualText("primary action");
    expect(primaryButton).not.toHaveAttribute("icon-start");
    expect(primaryButton).toEqualAttribute("icon-end", "save");
  });
  it("renders primaryText + primary-icon-end and primary-icon-start as inner content of primary button", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button primary-text="primary action" primary-icon-start="save" primary-icon-end="save">
      </calcite-split-button>`);
    const primaryButton = await page.find("calcite-split-button >>> calcite-button");
    expect(primaryButton).toEqualText("primary action");
    expect(primaryButton).toEqualAttribute("icon-start", "save");
    expect(primaryButton).toEqualAttribute("icon-end", "save");
  });

  it("changes the size and width of the dropdown + primary button based on scale", async () => {
    const elementScaleToDropdownScale = {
      s: "s",
      m: "m",
      l: "l"
    };
    const elementScaleToButtonScale = {
      s: "s",
      m: "m",
      l: "l"
    };
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-split-button>
      </calcite-split-button>`);
    const element = await page.find("calcite-split-button");
    const primaryButton = await page.find("calcite-split-button >>> calcite-button");
    const dropdown = await page.find("calcite-split-button >>> calcite-dropdown");
    for (const elementScale of Object.keys(elementScaleToDropdownScale)) {
      element.setProperty("scale", elementScale);
      await page.waitForChanges();
      const dropdownScale = elementScaleToDropdownScale[elementScale];
      expect(dropdown).toEqualAttribute("width", dropdownScale);
      expect(dropdown).toEqualAttribute("scale", dropdownScale);
      expect(primaryButton).toEqualAttribute("scale", elementScaleToButtonScale[elementScale]);
    }
  });
});
