import { newE2EPage } from "@stencil/core/testing";
import { accessible, defaults, hidden, reflects, renders } from "../../tests/commonTests";

describe("calcite-tile-select", () => {
  it("renders", async () => renders("calcite-tile-select"));

  it("is accessible", async () => accessible(`<calcite-tile-select></calcite-tile-select>`));

  it("has defaults", async () =>
    defaults("calcite-tile-select", [
      { propertyName: "checked", defaultValue: false },
      { propertyName: "disabled", defaultValue: false },
      { propertyName: "focused", defaultValue: false },
      { propertyName: "hidden", defaultValue: false },
      { propertyName: "width", defaultValue: "auto" },
      { propertyName: "theme", defaultValue: "light" }
    ]));

  it("reflects", async () =>
    reflects("calcite-tile-select", [
      { propertyName: "checked", value: true },
      { propertyName: "description", value: "My Tile Select Description." },
      { propertyName: "disabled", value: true },
      { propertyName: "focused", value: true },
      { propertyName: "heading", value: "My Tile Select Heading" },
      { propertyName: "hidden", value: true },
      { propertyName: "icon", value: "layers" },
      { propertyName: "name", value: "my-tile-select" },
      { propertyName: "show-input", value: "left" },
      { propertyName: "show-input", value: "right" },
      { propertyName: "show-input", value: "none" },
      { propertyName: "theme", value: "light" },
      { propertyName: "theme", value: "dark" },
      { propertyName: "type", value: "radio" },
      { propertyName: "type", value: "checkbox" },
      { propertyName: "width", value: "auto" },
      { propertyName: "value", value: "option one" }
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
    await page.setContent("<calcite-tile-select name='radio' value='one'></calcite-tile-select>");

    const calciteRadio = await page.find("calcite-radio-button");
    const calciteCheckbox = await page.find("calcite-checkbox");
    const radio = await page.find("input[type='radio']");
    expect(calciteRadio).toBeDefined();
    expect(calciteCheckbox).toBeNull();
    expect(radio).toEqualAttribute("name", "radio");
    expect(radio).toEqualAttribute("value", "one");
  });

  it("renders a calcite-checkbox when in checkbox mode", async () => {
    const page = await newE2EPage();
    await page.setContent(
      "<calcite-tile-select name='checkbox-tile-select' value='one' type='checkbox'></calcite-tile-select>"
    );

    const calciteRadio = await page.find("calcite-radio-button");
    const calciteCheckbox = await page.find("calcite-checkbox");
    const checkbox = await page.find("input[type='checkbox']");
    expect(calciteRadio).toBeNull();
    expect(calciteCheckbox).toBeDefined();
    expect(checkbox).toEqualAttribute("name", "checkbox-tile-select");
    expect(checkbox).toEqualAttribute("value", "one");
  });

  it("removing a tile-select also removes its corresponding calcite-radio-button", async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <calcite-tile-select name="radio" value="first"></calcite-tile-select>
    `);

    let firstRadioButton = await page.find("calcite-radio-button");
    expect(firstRadioButton).toEqualAttribute("name", "radio");
    expect(firstRadioButton).toEqualAttribute("value", "first");

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
    expect(firstRadioButton).toEqualAttribute("name", "checky");
    expect(firstRadioButton).toEqualAttribute("value", "first");

    await page.evaluate(() => {
      const firstTileSelect = document.querySelector("calcite-tile-select");
      firstTileSelect.parentNode.removeChild(firstTileSelect);
    });
    await page.waitForChanges();

    firstRadioButton = await page.find("calcite-checkbox");
    expect(firstRadioButton).toBeNull();
  });
});
