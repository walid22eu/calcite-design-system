import { newE2EPage } from "@stencil/core/testing";
import { accessible, defaults, focusable, hidden, reflects, renders } from "../../tests/commonTests";
import { html } from "../../tests/utils";

describe("calcite-tile-select", () => {
  it("renders", async () => renders("calcite-tile-select", { display: "block" }));

  it("is accessible", async () =>
    accessible(`<calcite-label><calcite-tile-select></calcite-tile-select>Label</calcite-label>`));

  it("has defaults", async () =>
    defaults("calcite-tile-select", [
      { propertyName: "checked", defaultValue: false },
      { propertyName: "disabled", defaultValue: false },
      { propertyName: "hidden", defaultValue: false },
      { propertyName: "width", defaultValue: "auto" }
    ]));

  it("reflects", async () =>
    reflects("calcite-tile-select", [
      { propertyName: "checked", value: true },
      { propertyName: "description", value: "My Tile Select Description." },
      { propertyName: "disabled", value: true },
      { propertyName: "heading", value: "My Tile Select Heading" },
      { propertyName: "hidden", value: true },
      { propertyName: "icon", value: "layers" },
      { propertyName: "inputAlignment", value: "start" },
      { propertyName: "name", value: "my-tile-select" },
      { propertyName: "inputEnabled", value: true },
      { propertyName: "type", value: "radio" },
      { propertyName: "width", value: "auto" }
    ]));

  it("honors hidden attribute", async () => hidden("calcite-tile-select"));

  it("renders a calcite-tile", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-tile-select></calcite-tile-select>");

    const tile = await page.find("calcite-tile-select >>> calcite-tile");
    expect(tile).toBeDefined();
  });

  it("renders a calcite-radio-button when in radio mode", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-tile-select name='radio' heading='test' value='one'></calcite-tile-select>");
    const calciteRadio = await page.find("calcite-radio-button");
    const calciteCheckbox = await page.find("calcite-checkbox");
    const radio = await page.find("input[type='radio']");
    expect(calciteRadio).toBeDefined();
    expect(calciteCheckbox).toBeNull();
    expect(await calciteRadio.getProperty("label")).toBe("test");
    expect(radio).toEqualAttribute("name", "radio");
    expect(radio).toEqualAttribute("value", "one");
  });

  it("renders a calcite-checkbox when in checkbox mode", async () => {
    const page = await newE2EPage();
    await page.setContent(
      "<calcite-tile-select name='checkbox-tile-select' heading='test' value='one' type='checkbox'></calcite-tile-select>"
    );

    const calciteRadio = await page.find("calcite-radio-button");
    const calciteCheckbox = await page.find("calcite-checkbox");
    const checkbox = await page.find("input[type='checkbox']");
    expect(calciteRadio).toBeNull();
    expect(calciteCheckbox).toBeDefined();
    expect(await calciteCheckbox.getProperty("label")).toBe("test");
    expect(checkbox).toEqualAttribute("name", "checkbox-tile-select");
    expect(checkbox).toEqualAttribute("value", "one");
  });

  it("removing a tile-select also removes its corresponding calcite-radio-button", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-tile-select name="radio" value="first"></calcite-tile-select>
    `);

    let firstRadioButton = await page.find("calcite-radio-button");
    expect(await firstRadioButton.getProperty("name")).toBe("radio");
    expect(await firstRadioButton.getProperty("value")).toBe("first");

    await page.evaluate(() => {
      const firstTileSelect = document.querySelector("calcite-tile-select");
      firstTileSelect.parentNode.removeChild(firstTileSelect);
    });
    await page.waitForChanges();

    firstRadioButton = await page.find("calcite-radio-button");
    expect(firstRadioButton).toBeNull();
  });

  it("removing a tile-select also removes its corresponding calcite-checkbox", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-tile-select name="checky" value="first" type="checkbox"></calcite-tile-select>
    `);

    let firstRadioButton = await page.find("calcite-checkbox");
    expect(await firstRadioButton.getProperty("name")).toBe("checky");
    expect(await firstRadioButton.getProperty("value")).toBe("first");

    await page.evaluate(() => {
      const firstTileSelect = document.querySelector("calcite-tile-select");
      firstTileSelect.parentNode.removeChild(firstTileSelect);
    });
    await page.waitForChanges();

    firstRadioButton = await page.find("calcite-checkbox");
    expect(firstRadioButton).toBeNull();
  });

  it("focuses calcite-checkbox when setFocus method is called", async () =>
    focusable(html`<calcite-tile-select type="checkbox"></calcite-tile-select>`, {
      focusTargetSelector: "input[type=checkbox]"
    }));

  it("focuses calcite-radio-button when setFocus method is called", async () =>
    focusable(html`<calcite-tile-select type="radio"></calcite-tile-select>`, {
      focusTargetSelector: "input[type=radio]"
    }));
});
