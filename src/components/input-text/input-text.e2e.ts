import { newE2EPage } from "@stencil/core/testing";
import {
  defaults,
  disabled,
  focusable,
  formAssociated,
  labelable,
  reflects,
  renders,
  hidden
} from "../../tests/commonTests";
import { html } from "../../../support/formatting";
import { TEXT } from "./resources";

describe("calcite-input-text", () => {
  it("is labelable", async () => labelable("calcite-input-text"));

  it("renders", () => renders("calcite-input-text", { display: "block" }));

  it("honors hidden attribute", async () => hidden("calcite-input-text"));

  it("reflects", async () =>
    reflects("calcite-input-text", [
      {
        propertyName: "status",
        value: "valid"
      },
      {
        propertyName: "alignment",
        value: "center"
      },
      {
        propertyName: "scale",
        value: "s"
      }
    ]));

  it("has defaults", async () =>
    defaults("calcite-input-text", [
      {
        propertyName: "status",
        defaultValue: "idle"
      },
      {
        propertyName: "alignment",
        defaultValue: "start"
      },
      {
        propertyName: "scale",
        defaultValue: "m"
      },
      {
        propertyName: "value",
        defaultValue: ""
      }
    ]));

  it("can be disabled", () => disabled("calcite-input-text"));

  it("inherits requested props when from wrapping calcite-label when props are provided", async () => {
    const page = await newE2EPage();
    await page.setContent(html`
      <calcite-label status="invalid" scale="s">
        Label text
        <calcite-input-text></calcite-input-text>
      </calcite-label>
    `);

    const deprecatedLabelStatusElement = await page.find("calcite-input-text");
    expect(await deprecatedLabelStatusElement.getProperty("status")).toEqual("invalid");
    expect(await deprecatedLabelStatusElement.getProperty("scale")).toEqual("s");
  });

  it("renders an icon when explicit Calcite UI is requested, and is a type without a default icon", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text icon="key"></calcite-input-text>`);

    const icon = await page.find("calcite-input-text >>> .icon");
    expect(icon).not.toBeNull();
  });

  it("does not render an icon when requested without an explicit Calcite UI, and is a type without a default icon", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text icon></calcite-input-text>`);

    const icon = await page.find("calcite-input-text >>> .icon");
    expect(icon).toBeNull();
  });

  it("is focusable", async () =>
    focusable(`calcite-input-text`, {
      shadowFocusTargetSelector: "input"
    }));

  it("does not fire any input or change events when a focused input is blurred after its value is set directly", async () => {
    const page = await newE2EPage({ html: "<calcite-input-text></calcite-input-text>" });
    const input = await page.find("calcite-input-text");
    const inputEventSpy = await input.spyOnEvent("calciteInputTextInput");
    const changeEventSpy = await input.spyOnEvent("calciteInputTextChange");

    expect(inputEventSpy).not.toHaveReceivedEvent();
    expect(changeEventSpy).not.toHaveReceivedEvent();

    await input.callMethod("setFocus");
    await input.setProperty("value", "not a random value");
    await page.keyboard.press("Tab");
    await page.waitForChanges();

    expect(inputEventSpy).not.toHaveReceivedEvent();
    expect(changeEventSpy).not.toHaveReceivedEvent();
  });

  it.skip("emits events when value is modified", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text></calcite-input-text>`);

    const element = await page.find("calcite-input-text");
    const calciteInputTextInput = await element.spyOnEvent("calciteInputTextInput");
    const calciteInputTextChange = await element.spyOnEvent("calciteInputTextChange");

    const inputFirstPart = "12345";
    await element.callMethod("setFocus");
    await page.keyboard.type(inputFirstPart);
    expect(await element.getProperty("value")).toBe(inputFirstPart);
    expect(calciteInputTextInput).toHaveReceivedEventTimes(5);
    expect(calciteInputTextChange).toHaveReceivedEventTimes(0);

    await element.callMethod("setFocus");
    await page.keyboard.press("Enter");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(5);
    expect(calciteInputTextChange).toHaveReceivedEventTimes(1);

    await element.callMethod("setFocus");
    await page.keyboard.press("Enter");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(5);
    expect(calciteInputTextChange).toHaveReceivedEventTimes(1);

    const textSecondPart = "67890";
    await element.callMethod("setFocus");
    await page.keyboard.type(textSecondPart);
    expect(calciteInputTextInput).toHaveReceivedEventTimes(10);
    expect(calciteInputTextChange).toHaveReceivedEventTimes(1);

    await element.callMethod("setFocus");
    await page.keyboard.press("Tab");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(10);
    expect(calciteInputTextChange).toHaveReceivedEventTimes(2);
    expect(await element.getProperty("value")).toBe(`${inputFirstPart}${textSecondPart}`);

    await element.callMethod("setFocus");
    await page.keyboard.press("Tab");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(10);
    expect(calciteInputTextChange).toHaveReceivedEventTimes(2);
    expect(await element.getProperty("value")).toBe(`${inputFirstPart}${textSecondPart}`);

    const programmaticSetValue = "1337";
    element.setProperty("value", programmaticSetValue);
    await page.waitForChanges();

    expect(await element.getProperty("value")).toBe(programmaticSetValue);
    expect(calciteInputTextInput).toHaveReceivedEventTimes(10);
    expect(calciteInputTextChange).toHaveReceivedEventTimes(2);
  });

  it("renders clear button when clearable is requested and value is populated at load", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text clearable value="John Doe"></calcite-input-text>`);
    const clearButton = await page.find("calcite-input-text >>> .clear-button");
    expect(clearButton).not.toBe(null);
    expect(clearButton.getAttribute("aria-label")).toBe(TEXT.clear);
  });

  it("does not render clear button when clearable is requested and value is not populated", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text clearable></calcite-input-text>`);

    const clearButton = await page.find("calcite-input-text >>> .clear-button");
    expect(clearButton).toBe(null);
  });

  it("does not render clear button when clearable is not requested", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text></calcite-input-text>`);

    const clearButton = await page.find("calcite-input-text >>> .clear-button");
    expect(clearButton).toBe(null);
  });

  it("when clearable is requested, value is cleared on escape key press", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text clearable value="John Doe"></calcite-input-text>`);

    const element = await page.find("calcite-input-text");
    await element.callMethod("setFocus");
    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toBe("");
  });

  it("when clearable is requested, value is cleared on clear button click", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text clearable value="John Doe"></calcite-input-text>`);

    const element = await page.find("calcite-input-text");
    const clearButton = await page.find("calcite-input-text >>> .clear-button");
    await clearButton.click();
    await page.waitForChanges();
    expect(await element.getProperty("value")).toBe("");
  });

  it("when clearable is requested and clear button is clicked, event is received", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text clearable value="John Doe"></calcite-input-text>`);

    const calciteInputTextInput = await page.spyOnEvent("calciteInputTextInput");
    const element = await page.find("calcite-input-text");
    const clearButton = await page.find("calcite-input-text >>> .clear-button");

    await clearButton.click();
    await page.waitForChanges();
    expect(await element.getProperty("value")).toBe("");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(1);
  });

  it("when clearable is requested and input is cleared via escape key, event is received", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text clearable value="John Doe"></calcite-input-text>`);

    const calciteInputTextInput = await page.spyOnEvent("calciteInputTextInput");
    const element = await page.find("calcite-input-text");

    await element.callMethod("setFocus");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(0);
    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toBe("");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(1);
  });

  it("when clearable is not requested and input is cleared via escape key, event is not received", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text value="John Doe"></calcite-input-text>`);

    const calciteInputTextInput = await page.spyOnEvent("calciteInputTextInput");
    const element = await page.find("calcite-input-text");

    await element.callMethod("setFocus");
    expect(calciteInputTextInput).not.toHaveReceivedEvent();
    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toBe("John Doe");
    expect(calciteInputTextInput).not.toHaveReceivedEvent();
  });

  it("allows restricting input length", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text min-length="2" max-length="3" value=""></calcite-input-text>`);

    const getInputValidity = async () =>
      page.$eval("calcite-input-text", (element: HTMLCalciteInputTextElement) => {
        const input = element.shadowRoot.querySelector("input");
        return input.validity.valid;
      });

    const input = await page.find("calcite-input-text");
    await input.callMethod("setFocus");

    await page.keyboard.type("1");

    expect(await getInputValidity()).toBe(false);

    await page.keyboard.type("2");

    expect(await getInputValidity()).toBe(true);

    await page.keyboard.type("3");

    expect(await getInputValidity()).toBe(true);

    await page.keyboard.type("4");

    expect(await getInputValidity()).toBe(true);
    expect(await input.getProperty("value")).toBe("123");
  });

  it(`allows clearing value`, async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text value="hello"></calcite-input-text>`);
    const input = await page.find("calcite-input-text");

    input.setProperty("value", null);
    await page.waitForChanges();

    expect(await input.getProperty("value")).toBe("");

    input.setProperty("value", undefined);
    await page.waitForChanges();

    expect(await input.getProperty("value")).toBe("");
  });

  it("cannot be modified when readOnly is true", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text read-only value="John Doe" clearable></calcite-input-text>`);

    const calciteInputTextInput = await page.spyOnEvent("calciteInputTextInput");
    const element = await page.find("calcite-input-text");
    expect(await element.getProperty("value")).toBe("John Doe");
    await element.callMethod("setFocus");

    await page.keyboard.press("a");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toBe("John Doe");

    await page.keyboard.press("Escape");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toBe("John Doe");
    expect(calciteInputTextInput).toHaveReceivedEventTimes(0);
  });

  it("sets internals to readOnly or disabled when readOnly is true", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-input-text read-only></calcite-input-text>`);

    const inputs = await page.findAll("calcite-input-text >>> input");

    for (const input of inputs) {
      expect(await input.getProperty("readOnly")).toBe(true);
    }

    const buttons = await page.findAll("calcite-input-text button");

    for (const button of buttons) {
      expect(await button.getProperty("disabled")).toBe(true);
    }
  });

  it("ArrowUp/ArrowDown function of moving caret to the beginning/end of text", async () => {
    const determineCaretIndex = (position?: number): Promise<boolean> => {
      return page.evaluate((position) => {
        const element = document.querySelector("calcite-input-text") as HTMLCalciteInputTextElement;
        const el = element.shadowRoot.querySelector("input");
        return el.selectionStart === (position !== undefined ? position : el.value.length);
      }, position);
    };

    const page = await newE2EPage();
    await page.setContent(`<calcite-input-text></calcite-input-text>`);
    const element = await page.find("calcite-input-text");

    await element.callMethod("setFocus");
    await page.keyboard.type("test");
    await page.waitForChanges();

    await page.keyboard.press("ArrowUp");
    await page.waitForChanges();

    expect(await determineCaretIndex(0)).toBeTruthy();

    await page.keyboard.press("ArrowDown");
    await page.waitForChanges();

    expect(await determineCaretIndex()).toBeTruthy();
  });

  it("is form-associated", () => formAssociated("calcite-input-text", { testValue: "test", submitsOnEnter: true }));
});
