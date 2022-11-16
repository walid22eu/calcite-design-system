import { newE2EPage } from "@stencil/core/testing";
import {
  defaults,
  disabled,
  formAssociated,
  labelable,
  floatingUIOwner,
  renders,
  hidden
} from "../../tests/commonTests";
import { html } from "../../../support/formatting";
import { CSS } from "./resources";
import { dateFromISO, setEndOfDay } from "../../utils/date";

const animationDurationInMs = 200;

describe("calcite-input-date-picker", () => {
  it("renders", async () => renders("calcite-input-date-picker", { display: "inline-block" }));

  it("honors hidden attribute", async () => hidden("calcite-input-date-picker"));

  it("defaults", async () =>
    defaults("calcite-input-date-picker", [
      {
        propertyName: "overlayPositioning",
        defaultValue: "absolute"
      },
      {
        propertyName: "flipPlacements",
        defaultValue: undefined
      }
    ]));

  it("is labelable", async () => labelable("calcite-input-date-picker"));

  it("can be disabled", () => disabled("calcite-input-date-picker"));

  describe("event emitting when the value changes", () => {
    it("emits change event when value is committed for single date", async () => {
      const page = await newE2EPage();
      await page.setContent("<calcite-input-date-picker></calcite-input-date-picker>");

      const input = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");
      const deprecatedChangeEvent = await page.spyOnEvent("calciteDatePickerChange");

      expect(await input.getProperty("value")).toBe("");

      await input.callMethod("setFocus");
      await page.waitForChanges();
      await page.waitForTimeout(animationDurationInMs);
      const wrapper = (
        await page.waitForFunction(() =>
          document.querySelector("calcite-input-date-picker").shadowRoot.querySelector(".calendar-picker-wrapper")
        )
      ).asElement();
      expect(await wrapper.isIntersectingViewport()).toBe(true);

      await page.keyboard.type("3/7/2020");
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expect(await input.getProperty("value")).toBe("2020-03-07");
      expect(await input.getProperty("valueAsDate")).toBeDefined();

      expect(changeEvent).toHaveReceivedEventTimes(1);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(1);

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expect(changeEvent).toHaveReceivedEventTimes(2);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(2);

      expect(await input.getProperty("value")).toBe("");
      expect(await input.getProperty("valueAsDate")).toBeUndefined();
    });

    it("doesn't emit when cleared programmatically for single date", async () => {
      const page = await newE2EPage();
      await page.setContent(`<calcite-input-date-picker value="2023-03-07"></calcite-input-date-picker>`);
      const element = await page.find("calcite-input-date-picker");
      element.setProperty("value", "");
      await page.waitForChanges();
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");
      const deprecatedChangeEvent = await page.spyOnEvent("calciteDatePickerChange");

      expect(changeEvent).toHaveReceivedEventTimes(0);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(0);
      expect(await element.getProperty("value")).toBe("");
      expect(await element.getProperty("valueAsDate")).toBeUndefined();
    });

    it("doesn't emit when cleared programmatically for date range", async () => {
      const page = await newE2EPage();
      await page.setContent(`<calcite-input-date-picker range></calcite-input-date-picker>`);
      const element = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");
      const deprecatedChangeEvent = await page.spyOnEvent("calciteDatePickerRangeChange");
      element.setProperty("value", ["2023-03-07", "2023-03-08"]);
      await page.waitForChanges();
      expect(changeEvent).toHaveReceivedEventTimes(0);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(0);
      element.setProperty("value", ["", ""]);
      await page.waitForChanges();
      expect(changeEvent).toHaveReceivedEventTimes(0);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(0);
    });

    it("emits when value is committed for date range", async () => {
      const page = await newE2EPage();
      await page.setContent("<calcite-input-date-picker range></calcite-input-date-picker>");
      const input = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");
      const deprecatedChangeEvent = await page.spyOnEvent("calciteDatePickerRangeChange");

      await input.callMethod("setFocus");
      await page.waitForChanges();
      await page.waitForTimeout(animationDurationInMs);

      const wrapper = (
        await page.waitForFunction(() =>
          document.querySelector("calcite-input-date-picker").shadowRoot.querySelector(".calendar-picker-wrapper")
        )
      ).asElement();
      expect(await wrapper.isIntersectingViewport()).toBe(true);

      const inputtedStartDate = "1/1/2020";
      const expectedStartDateComponentValue = "2020-01-01";
      const expectedStartDateISO = dateFromISO(expectedStartDateComponentValue).toISOString();

      const inputtedEndDate = "2/2/2020";
      const expectedEndDateComponentValue = "2020-02-02";
      const expectedEndDateISO = setEndOfDay(dateFromISO(expectedEndDateComponentValue)).toISOString();

      await page.keyboard.type(inputtedStartDate);
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      let expectedEventDetail = { startDate: expectedStartDateISO, endDate: null };

      expect(await input.getProperty("value")).toEqual([expectedStartDateComponentValue, ""]);
      expect(changeEvent).toHaveReceivedEventTimes(1);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(1);
      expect(deprecatedChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);

      await page.keyboard.type(inputtedEndDate);
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expectedEventDetail = {
        startDate: expectedStartDateISO,
        endDate: expectedEndDateISO
      };

      expect(await input.getProperty("value")).toEqual([
        expectedStartDateComponentValue,
        expectedEndDateComponentValue
      ]);
      expect(changeEvent).toHaveReceivedEventTimes(2);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(2);
      expect(deprecatedChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expectedEventDetail = { startDate: expectedStartDateISO, endDate: null };

      expect(await input.getProperty("value")).toEqual([expectedStartDateComponentValue, ""]);
      expect(changeEvent).toHaveReceivedEventTimes(3);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(3);
      expect(deprecatedChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
    });

    it("doesn't emit change event and doesn't clear input when an invalid date is entered in input (allows free form typing)", async () => {
      const page = await newE2EPage();
      await page.setContent("<calcite-input-date-picker></calcite-input-date-picker>");
      const inputDatePicker = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");
      const deprecatedChangeEvent = await page.spyOnEvent("calciteDatePickerRangeChange");

      await inputDatePicker.callMethod("setFocus");
      await page.waitForChanges();
      await page.keyboard.type("3/7/");
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expect(changeEvent).toHaveReceivedEventTimes(0);
      expect(deprecatedChangeEvent).toHaveReceivedEventTimes(0);

      const inputValue = await page.evaluate(() => {
        const inputDatePicker = document.querySelector("calcite-input-date-picker");
        const calciteInput = inputDatePicker.shadowRoot.querySelector("calcite-input");
        const input = calciteInput.shadowRoot.querySelector("input");
        return input.value;
      });
      expect(inputValue).toBe("3/7/");
    });
  });

  it("should clear active date properly when deleted and committed via keyboard", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-input-date-picker value="2021-12-08"></calcite-input-date-picker>`);
    const input = (
      await page.waitForFunction(() =>
        document
          .querySelector("calcite-input-date-picker")
          .shadowRoot.querySelector("calcite-input")
          .shadowRoot.querySelector("input")
      )
    ).asElement();
    await input.focus();
    await page.waitForChanges();

    for (let i = 0; i < 10; i++) {
      await input.press("Backspace");
    }
    input.press("Enter");

    await page.waitForChanges();

    const element = await page.find("calcite-input-date-picker");
    expect(await element.getProperty("value")).toBe("");
  });

  it("displays a calendar when clicked", async () => {
    const page = await newE2EPage({
      html: "<calcite-input-date-picker value='2000-11-27'></calcite-input-date-picker>"
    });
    await page.waitForChanges();
    const date = await page.find("calcite-input-date-picker");

    await date.click();
    await page.waitForChanges();
    const calendar = await page.find("calcite-input-date-picker >>> .calendar-picker-wrapper");

    expect(await calendar.isVisible()).toBe(true);
  });

  it("allows clicking a date in the calendar popup", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-input-date-picker value="2023-01-31"></calcite-input-date-picker>`);
    const inputDatePicker = await page.find("calcite-input-date-picker");

    await inputDatePicker.callMethod("setFocus");
    await page.waitForChanges();

    await page.evaluate(() => {
      const inputDatePicker = document.querySelector("calcite-input-date-picker");
      const datePicker = inputDatePicker.shadowRoot.querySelector("calcite-date-picker");
      const datePickerMonth = datePicker.shadowRoot.querySelector("calcite-date-picker-month");
      const datePickerDay = datePickerMonth.shadowRoot.querySelector("calcite-date-picker-day");

      datePickerDay.click();
    });

    expect(await inputDatePicker.getProperty("value")).toBe("2023-01-01");
  });

  describe("is form-associated", () => {
    it("supports single value", () =>
      formAssociated("calcite-input-date-picker", { testValue: "1985-03-23", submitsOnEnter: true }));
    it("supports range", () =>
      formAssociated(`<calcite-input-date-picker range name="calcite-input-date-picker"></calcite-input-date-picker>`, {
        testValue: ["1985-03-23", "1985-10-30"],
        submitsOnEnter: true
      }));
  });

  it("updates internally when min attribute is updated after initialization", async () => {
    const page = await newE2EPage();
    await page.emulateTimezone("America/Los_Angeles");
    await page.setContent(
      html`<calcite-input-date-picker value="2022-11-27" min="2022-11-15" max="2024-11-15"></calcite-input-date-picker>`
    );

    const element = await page.find("calcite-input-date-picker");
    element.setProperty("min", "2021-11-15");
    element.setProperty("max", "2023-11-15");
    await page.waitForChanges();
    const minDateString = "Mon Nov 15 2021 00:00:00 GMT-0800 (Pacific Standard Time)";
    const minDateAsTime = await page.$eval("calcite-input-date-picker", (picker: HTMLCalciteInputDatePickerElement) =>
      picker.minAsDate.getTime()
    );
    expect(minDateAsTime).toEqual(new Date(minDateString).getTime());
  });

  it("owns a floating-ui", () =>
    floatingUIOwner(
      `<calcite-input-date-picker value="2022-11-27" min="2022-11-15" max="2024-11-15"></calcite-input-date-picker>`,
      "open",
      { shadowSelector: ".menu-container" }
    ));

  it("when set to readOnly, element still focusable but won't display the controls or allow for changing the value", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-input-date-picker read-only id="canReadOnly"></calcite-input-date-picker>`);

    const component = await page.find("#canReadOnly");
    const input = await page.find("#canReadOnly >>> calcite-input");

    expect(await input.getProperty("value")).toBe("");

    await component.callMethod("setFocus");
    await page.waitForChanges();
    const calendar = await page.find(`#canReadOnly >>> .${CSS.menu}`);

    expect(await page.evaluate(() => document.activeElement.id)).toBe("canReadOnly");
    expect(calendar).not.toHaveClass(CSS.menuActive);

    await component.click();
    await page.waitForChanges();
    expect(calendar).not.toHaveClass(CSS.menuActive);

    await component.type("atención atención");
    await page.waitForChanges();

    expect(await input.getProperty("value")).toBe("");
  });

  it("should emit component status for transition-chained events: 'calciteInputDatePickerBeforeOpen', 'calciteInputDatePickerOpen', 'calciteInputDatePickerBeforeClose', 'calciteInputDatePickerClose'", async () => {
    const page = await newE2EPage();
    await page.setContent(
      html` <calcite-input-date-picker id="pickerOpenClose" value="2021-12-08"></calcite-input-date-picker> `
    );

    const element = await page.find("calcite-input-date-picker");
    const container = await page.find(`calcite-input-date-picker >>> .${CSS.menu}`);

    const calciteInputDatePickerBeforeOpenEvent = page.waitForEvent("calciteInputDatePickerBeforeOpen");
    const calciteInputDatePickerOpenEvent = page.waitForEvent("calciteInputDatePickerOpen");

    const calciteInputDatePickerBeforeOpenSpy = await element.spyOnEvent("calciteInputDatePickerBeforeOpen");
    const calciteInputDatePickerOpenSpy = await element.spyOnEvent("calciteInputDatePickerOpen");

    await element.setProperty("open", true);
    await page.waitForChanges();

    expect(container).toHaveClass(CSS.menuActive);

    await calciteInputDatePickerBeforeOpenEvent;
    await calciteInputDatePickerOpenEvent;

    expect(calciteInputDatePickerBeforeOpenSpy).toHaveReceivedEventTimes(1);
    expect(calciteInputDatePickerOpenSpy).toHaveReceivedEventTimes(1);

    const calciteInputDatePickerBeforeCloseEvent = page.waitForEvent("calciteInputDatePickerBeforeClose");
    const calciteInputDatePickerCloseEvent = page.waitForEvent("calciteInputDatePickerClose");

    const calciteInputDatePickerBeforeCloseSpy = await element.spyOnEvent("calciteInputDatePickerBeforeClose");
    const calciteInputDatePickerClose = await element.spyOnEvent("calciteInputDatePickerClose");

    await element.setProperty("open", false);
    await page.waitForChanges();

    expect(container).not.toHaveClass(CSS.menuActive);

    await calciteInputDatePickerBeforeCloseEvent;
    await calciteInputDatePickerCloseEvent;

    expect(calciteInputDatePickerBeforeCloseSpy).toHaveReceivedEventTimes(1);
    expect(calciteInputDatePickerClose).toHaveReceivedEventTimes(1);
  });

  it("should return endDate time as 23:59:999 when end value is typed", async () => {
    const page = await newE2EPage();
    await page.setContent(html` <calcite-input-date-picker layout="horizontal" range />`);

    const datepickerEl = await page.find("calcite-input-date-picker");
    const eventSpy = await datepickerEl.spyOnEvent("calciteDatePickerRangeChange");
    await page.waitForChanges();

    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await datepickerEl.type("08/30/2022");
    await page.keyboard.press("Enter");
    await page.waitForChanges();

    expect(eventSpy).toHaveReceivedEventDetail({
      startDate: null,
      endDate: new Date(2022, 7, 30, 23, 59, 59, 999).toISOString()
    });
  });

  it("should return endDate time as 23:59:999 when valueAsDate property is parsed", async () => {
    const page = await newE2EPage();
    await page.setContent(html` <calcite-input-date-picker layout="horizontal" range />`);

    const datepickerEl = await page.find("calcite-input-date-picker");
    datepickerEl.setProperty("value", ["2022-08-10", "2022-08-20"]);
    const eventSpy = await datepickerEl.spyOnEvent("calciteDatePickerRangeChange");

    await page.keyboard.press("Tab");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();
    await page.keyboard.press("Backspace");
    await page.waitForChanges();

    await datepickerEl.type("08/15/2022");
    await page.keyboard.press("Enter");
    await page.waitForChanges();

    expect(eventSpy).toHaveReceivedEventDetail({
      startDate: new Date(2022, 7, 15).toISOString(),
      endDate: new Date(2022, 7, 20, 23, 59, 59, 999).toISOString()
    });
  });
});
