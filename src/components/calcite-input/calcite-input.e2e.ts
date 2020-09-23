import { newE2EPage } from "@stencil/core/testing";
import { HYDRATED_ATTR } from "../../tests/commonTests";

describe("calcite-input", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-input></calcite-input>");
    const input = await page.find("calcite-input");
    expect(input).toHaveAttribute(HYDRATED_ATTR);
  });

  it("renders default props when none are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input></calcite-input>
    `);
    await page.waitForChanges();

    const element = await page.find("calcite-input");
    expect(element).toEqualAttribute("status", "idle");
    expect(element).toEqualAttribute("alignment", "start");
    expect(element).toEqualAttribute("number-button-type", "vertical");
    expect(element).toEqualAttribute("type", "text");
    expect(element).toEqualAttribute("scale", "m");
  });

  it("renders requested props when valid props are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input status="invalid" theme="dark" alignment="end" number-button-type="none" type="number" scale="s"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    expect(element).toEqualAttribute("status", "invalid");
    expect(element).toEqualAttribute("theme", "dark");
    expect(element).toEqualAttribute("alignment", "end");
    expect(element).toEqualAttribute("number-button-type", "none");
    expect(element).toEqualAttribute("type", "number");
    expect(element).toEqualAttribute("scale", "s");
  });

  it("inherits requested props when from wrapping calcite-label when props are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-label status="invalid" theme="dark" scale="s">
    Label text
    <calcite-input></calcite-input>
    </calcite-label>
    `);

    const element = await page.find("calcite-input");
    expect(element).toEqualAttribute("status", "invalid");
    expect(element).toEqualAttribute("scale", "s");
  });

  it("renders an icon when explicit Calcite UI is requested, and is a type without a default icon", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input icon="key" type="number"></calcite-input>
    `);

    const icon = await page.find("calcite-input .calcite-input-icon");
    expect(icon).not.toBeNull();
  });

  it("renders an icon when explicit Calcite UI is requested, and is a type with a default icon", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input icon="key" type="date"></calcite-input>
    `);

    const icon = await page.find("calcite-input .calcite-input-icon");
    expect(icon).not.toBeNull();
  });

  it("renders an icon when requested without an explicit Calcite UI, and is a type with a default icon", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input icon type="date"></calcite-input>
    `);

    const icon = await page.find("calcite-input .calcite-input-icon");
    expect(icon).not.toBeNull();
  });

  it("does not render an icon when requested without an explicit Calcite UI, and is a type without a default icon", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input icon type="number"></calcite-input>
    `);

    const icon = await page.find("calcite-input .calcite-input-icon");
    expect(icon).toBeNull();
  });

  it("renders number buttons in default vertical alignment when type=number", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number"></calcite-input>
    `);

    const numberVerticalWrapper = await page.find("calcite-input .calcite-input-number-button-wrapper");
    const numberHorizontalItemDown = await page.find(
      "calcite-input .number-button-item-horizontal[data-adjustment='down']"
    );
    const numberHorizontalItemUp = await page.find(
      "calcite-input .number-button-item-horizontal[data-adjustment='up']"
    );

    expect(numberVerticalWrapper).not.toBeNull();
    expect(numberHorizontalItemDown).toBeNull();
    expect(numberHorizontalItemUp).toBeNull();
  });

  it("renders number buttons in horizontal vertical alignment when type=number and number button type is horizontal", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" number-button-type="horizontal"></calcite-input>
    `);

    const numberVerticalWrapper = await page.find("calcite-input .calcite-input-number-button-wrapper");
    const numberHorizontalItemDown = await page.find(
      "calcite-input .number-button-item-horizontal[data-adjustment='down']"
    );
    const numberHorizontalItemUp = await page.find(
      "calcite-input .number-button-item-horizontal[data-adjustment='up']"
    );

    expect(numberVerticalWrapper).toBeNull();
    expect(numberHorizontalItemDown).not.toBeNull();
    expect(numberHorizontalItemUp).not.toBeNull();
  });

  it("renders no buttons in type=number and number button type is none", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" number-button-type="none"></calcite-input>
    `);

    const numberVerticalWrapper = await page.find("calcite-input .calcite-input-number-button-wrapper");
    const numberHorizontalItemDown = await page.find(
      "calcite-input .number-button-item-horizontal[data-adjustment='down']"
    );
    const numberHorizontalItemUp = await page.find(
      "calcite-input .number-button-item-horizontal[data-adjustment='up']"
    );

    expect(numberVerticalWrapper).toBeNull();
    expect(numberHorizontalItemDown).toBeNull();
    expect(numberHorizontalItemUp).toBeNull();
  });

  it("focuses child input when setFocus method is called", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-label>
    Label text
    <calcite-input></calcite-input>
    </calcite-label>
    `);

    const element = await page.find("calcite-input");
    await element.callMethod("setFocus");
    await page.waitForChanges();
    const activeEl = await page.evaluate(() => document.activeElement["s-hn"]);
    expect(activeEl).toEqual(element.nodeName);
  });

  it("correctly increments and decrements value when number buttons are clicked", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" value="3"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    const numberHorizontalItemDown = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='down']"
    );
    const numberHorizontalItemUp = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='up']"
    );
    expect(element.getAttribute("value")).toBe("3");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("2");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("3");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("4");
  });

  it("correctly increments and decrements value when number buttons are clicked and step is set", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" step="10" value="15"></calcite-input>
    `);

    const element = await page.find("calcite-input");

    const numberHorizontalItemDown = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='down']"
    );
    const numberHorizontalItemUp = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='up']"
    );
    expect(element.getAttribute("value")).toBe("15");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("5");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("15");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("25");
  });

  it("correctly stops decrementing value when min is set", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" min="10" value="12"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    const numberHorizontalItemDown = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='down']"
    );
    expect(element.getAttribute("value")).toBe("12");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("11");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("10");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("10");
  });
  it("correctly stops incrementing value when max is set", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" max="10" value="8"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    const numberHorizontalItemUp = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='up']"
    );
    expect(element.getAttribute("value")).toBe("8");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("9");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("10");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("10");
  });
  it("correctly stops decrementing value when min is 0", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" min="0" value="2"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    const numberHorizontalItemDown = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='down']"
    );
    expect(element.getAttribute("value")).toBe("2");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("1");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("0");
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("0");
  });
  it("correctly stops incrementing value when max is 0", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" max="0" value="-2"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    const numberHorizontalItemUp = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='up']"
    );
    expect(element.getAttribute("value")).toBe("-2");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("-1");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("0");
    await numberHorizontalItemUp.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("0");
  });

  it("renders clear button when clearable is requested and value is populated at load", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input clearable value="John Doe"></calcite-input>
    `);
    const clearButton = await page.find("calcite-input .calcite-input-clear-button");
    expect(clearButton).not.toBe(null);
  });

  it("does not render clear button when clearable is requested and value is not populated", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input clearable></calcite-input>
    `);

    const clearButton = await page.find("calcite-input .calcite-input-clear-button");
    expect(clearButton).toBe(null);
  });

  it("does not render clear button when clearable is not requested", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input></calcite-input>
    `);

    const clearButton = await page.find("calcite-input .calcite-input-clear-button");
    expect(clearButton).toBe(null);
  });

  it("when clearable is requested, value is cleared on escape key press", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input clearable value="John Doe"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    expect(element.getAttribute("value")).toBe("John Doe");
    await element.callMethod("setFocus");
    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("");
  });

  it("when clearable is requested, value is cleared on clear button click", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input clearable value="John Doe"></calcite-input>
    `);

    const element = await page.find("calcite-input");
    const clearButton = await page.find(".calcite-input-clear-button");
    expect(element.getAttribute("value")).toBe("John Doe");
    clearButton.click();
    await page.waitForChanges();
    expect(element.getAttribute("value")).toBe("");
  });

  it("should emit event when up or down clicked on input", async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <calcite-input type="number" max="0" value="-2"></calcite-input>
    `);

    const calciteInputInput = await page.spyOnEvent("calciteInputInput");

    const numberHorizontalItemUp = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='up']"
    );
    await numberHorizontalItemUp.click();
    await page.waitForChanges();

    expect(calciteInputInput).toHaveReceivedEvent();

    const numberHorizontalItemDown = await page.find(
      "calcite-input .calcite-input-number-button-item[data-adjustment='down']"
    );
    await numberHorizontalItemDown.click();
    await page.waitForChanges();
    expect(calciteInputInput).toHaveReceivedEvent();
  });
});
