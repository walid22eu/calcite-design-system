import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
import {
  defaults,
  disabled,
  formAssociated,
  labelable,
  floatingUIOwner,
  renders,
  hidden,
  t9n,
  accessible
} from "../../tests/commonTests";
import { html } from "../../../support/formatting";
import { CSS } from "./resources";
import { CSS as MONTH_HEADER_CSS } from "../date-picker-month-header/resources";
import { getFocusedElementProp, skipAnimations } from "../../tests/utils";
const animationDurationInMs = 200;

describe("calcite-input-date-picker", () => {
  it("is accessible", () =>
    accessible(html`
      <calcite-label>
        Input Date Picker
        <calcite-input-date-picker></calcite-input-date-picker>
      </calcite-label>
    `));

  describe("renders", () => {
    renders("calcite-input-date-picker", { display: "inline-block" });
  });

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

  it.skip("supports t9n", () => t9n("calcite-input-date-picker"));

  describe("event emitting when the value changes", () => {
    it("emits change event when value is committed for single date", async () => {
      const page = await newE2EPage();
      await page.setContent("<calcite-input-date-picker></calcite-input-date-picker>");

      const input = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");

      expect(await input.getProperty("value")).toBe("");

      await input.click();
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

      expect(changeEvent).toHaveReceivedEventTimes(0);
      expect(await element.getProperty("value")).toBe("");
      expect(await element.getProperty("valueAsDate")).toBeUndefined();
    });

    it("doesn't emit when cleared programmatically for date range", async () => {
      const page = await newE2EPage();
      await page.setContent(`<calcite-input-date-picker range></calcite-input-date-picker>`);
      const element = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");
      element.setProperty("value", ["2023-03-07", "2023-03-08"]);
      await page.waitForChanges();
      expect(changeEvent).toHaveReceivedEventTimes(0);
      element.setProperty("value", ["", ""]);
      await page.waitForChanges();
      expect(changeEvent).toHaveReceivedEventTimes(0);
    });

    it("emits when value is committed for date range", async () => {
      const page = await newE2EPage();
      await page.setContent("<calcite-input-date-picker range></calcite-input-date-picker>");
      const input = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");

      await input.click();
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

      const inputtedEndDate = "2/2/2020";
      const expectedEndDateComponentValue = "2020-02-02";

      await page.keyboard.type(inputtedStartDate);
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expect(await input.getProperty("value")).toEqual([expectedStartDateComponentValue, ""]);
      expect(changeEvent).toHaveReceivedEventTimes(1);

      await page.keyboard.type(inputtedEndDate);
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expect(await input.getProperty("value")).toEqual([
        expectedStartDateComponentValue,
        expectedEndDateComponentValue
      ]);
      expect(changeEvent).toHaveReceivedEventTimes(2);

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

      expect(await input.getProperty("value")).toEqual([expectedStartDateComponentValue, ""]);
      expect(changeEvent).toHaveReceivedEventTimes(3);
    });

    it("doesn't emit change event and doesn't clear input when an invalid date is entered in input (allows free form typing)", async () => {
      const page = await newE2EPage();
      await page.setContent("<calcite-input-date-picker></calcite-input-date-picker>");
      const inputDatePicker = await page.find("calcite-input-date-picker");
      const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");

      await inputDatePicker.click();
      await page.waitForChanges();
      await page.keyboard.type("3/7/");
      await page.keyboard.press("Enter");
      await page.waitForChanges();

      expect(changeEvent).toHaveReceivedEventTimes(0);

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
    await input.press("Enter");

    await page.waitForChanges();

    const element = await page.find("calcite-input-date-picker");
    expect(await element.getProperty("value")).toBe("");
  });

  describe("toggling date picker", () => {
    let page: E2EPage;
    let inputDatePicker: E2EElement;

    beforeEach(async () => {
      page = await newE2EPage();
      await page.setContent(html` <calcite-input-date-picker value="2000-11-27"></calcite-input-date-picker>`);
      await skipAnimations(page);
      await page.waitForChanges();
      inputDatePicker = await page.find("calcite-input-date-picker");
    });

    it("toggles the date picker when clicked", async () => {
      let calendar = await page.find("calcite-input-date-picker >>> .calendar-picker-wrapper");

      expect(await calendar.isVisible()).toBe(false);

      await inputDatePicker.click();
      await page.waitForChanges();
      calendar = await page.find("calcite-input-date-picker >>> .calendar-picker-wrapper");

      expect(await calendar.isVisible()).toBe(true);

      await inputDatePicker.click();
      await page.waitForChanges();
      calendar = await page.find("calcite-input-date-picker >>> .calendar-picker-wrapper");

      expect(await calendar.isVisible()).toBe(false);
    });

    it("toggles the date picker when using arrow down/escape key", async () => {
      let calendar = await page.find("calcite-input-date-picker >>> .calendar-picker-wrapper");

      expect(await calendar.isVisible()).toBe(false);

      await inputDatePicker.callMethod("setFocus");
      await page.waitForChanges();
      await page.keyboard.press("ArrowDown");
      await page.waitForChanges();
      calendar = await page.find("calcite-input-date-picker >>> .calendar-picker-wrapper");

      expect(await calendar.isVisible()).toBe(true);

      await page.keyboard.press("Escape");
      await page.waitForChanges();
      calendar = await page.find("calcite-input-date-picker >>> .calendar-picker-wrapper");

      expect(await calendar.isVisible()).toBe(false);
    });
  });

  describe("localization", () => {
    it("renders arabic numerals while typing in the input when numbering-system is set to arab", async () => {
      const page = await newE2EPage();
      await page.setContent(
        `<calcite-input-date-picker lang="ar" numbering-system="arab"></calcite-input-date-picker>`
      );
      const getInputValue = async () =>
        await page.evaluate(
          () =>
            document
              .querySelector("calcite-input-date-picker")
              .shadowRoot.querySelector("calcite-input")
              .shadowRoot.querySelector("input").value
        );

      await page.keyboard.press("Tab");
      await page.keyboard.type("1/");
      await page.waitForChanges();

      expect(await getInputValue()).toBe("١‏/");

      await page.keyboard.type("2");
      await page.waitForChanges();

      // NOTE: This asserted value was copied from the received value in a test failure caused by
      // typing these same values into the test file using an Arabic input source on macOS.
      // Make sure to preserve this value when refactoring instead of typing these characters from scratch.
      expect(await getInputValue()).toBe("١‏‏/٢");

      await page.keyboard.type("/");
      await page.waitForChanges();

      expect(await getInputValue()).toBe("١‏‏‏/٢‏/");

      await page.keyboard.type("1234");
      await page.waitForChanges();

      expect(await getInputValue()).toBe("١‏‏‏‏‏‏‏/٢‏‏‏‏‏/١٢٣٤");
    });

    it("syncs lang changes to internal date-picker and input", async () => {
      // note that lang values should be available as bundles for both input-date-picker and date-picker
      const lang = "en";
      const newLang = "es";

      const year = "2020";
      const month = "4";
      const day = "19";

      const langTranslations = await import(`../date-picker/assets/date-picker/nls/${lang}.json`);
      const newLangTranslations = await import(`../date-picker/assets/date-picker/nls/${newLang}.json`);

      const page = await newE2EPage();
      await page.setContent(
        `<calcite-input-date-picker lang=${lang} value="${year}-${month}-${day}"></calcite-input-date-picker>`
      );
      const inputDatePicker = await page.find("calcite-input-date-picker");

      const getLocalizedMonth = async () =>
        await page.evaluate(
          async (MONTH_HEADER_CSS) =>
            document
              .querySelector("calcite-input-date-picker")
              .shadowRoot.querySelector("calcite-date-picker")
              .shadowRoot.querySelector("calcite-date-picker-month-header")
              .shadowRoot.querySelector(`.${MONTH_HEADER_CSS.month}`).textContent,
          MONTH_HEADER_CSS
        );

      const getLocalizedInputValue = async () =>
        await page.evaluate(
          async () =>
            document
              .querySelector("calcite-input-date-picker")
              .shadowRoot.querySelector("calcite-input")
              .shadowRoot.querySelector("input").value
        );

      expect(await getLocalizedMonth()).toEqual(langTranslations.months.wide[Number(month) - 1]);
      expect(await getLocalizedInputValue()).toBe(
        langTranslations.placeholder.replace("DD", day).replace("MM", month).replace("YYYY", year)
      );

      inputDatePicker.setProperty("lang", newLang);
      await page.waitForChanges();

      expect(await getLocalizedMonth()).toEqual(newLangTranslations.months.wide[Number(month) - 1]);
      expect(await getLocalizedInputValue()).toBe(
        newLangTranslations.placeholder.replace("DD", day).replace("MM", month).replace("YYYY", year)
      );
    });
  });

  it("allows clicking a date in the calendar popup", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-input-date-picker value="2023-01-31"></calcite-input-date-picker>`);
    const inputDatePicker = await page.find("calcite-input-date-picker");

    await inputDatePicker.click();
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
    describe("supports single value", () => {
      formAssociated("calcite-input-date-picker", { testValue: "1985-03-23", submitsOnEnter: true });
    });

    describe("supports range", () => {
      formAssociated(`<calcite-input-date-picker range name="calcite-input-date-picker"></calcite-input-date-picker>`, {
        testValue: ["1985-03-23", "1985-10-30"],
        submitsOnEnter: true
      });
    });
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

    await component.click();
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
    await page.setContent(html` <calcite-input-date-picker layout="horizontal" range></calcite-input-date-picker>`);
    const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");
    const datePickerEl = await page.find("calcite-input-date-picker");
    await page.waitForChanges();

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await datePickerEl.type("08/30/2022");
    await page.keyboard.press("Enter");
    await page.waitForChanges();

    expect(changeEvent).toHaveReceivedEventTimes(1);
    expect(await datePickerEl.getProperty("value")).toEqual(["", "2022-08-30"]);
  });

  it("should update this.value and input value when valueAsDate is set", async () => {
    const page = await newE2EPage();
    await page.setContent(html` <calcite-input-date-picker></calcite-input-date-picker>`);

    const inputDatePickerEl = await page.find("calcite-input-date-picker");

    await page.$eval("calcite-input-date-picker", (element: any) => {
      element.valueAsDate = new Date("2022-10-1");
    });

    const expectedValue = "2022-10-01";
    const expectedInputValue = "10/1/2022";

    expect(await inputDatePickerEl.getProperty("value")).toEqual(expectedValue);

    const inputValue = await page.evaluate(() => {
      const inputDatePicker = document.querySelector("calcite-input-date-picker");
      const calciteInput = inputDatePicker.shadowRoot.querySelector("calcite-input");
      const input = calciteInput.shadowRoot.querySelector("input");
      return input.value;
    });

    expect(inputValue).toEqual(expectedInputValue);
  });

  it("should update this.value and both input values when valueAsDate is set for range", async () => {
    const page = await newE2EPage();
    await page.setContent(html` <calcite-input-date-picker range></calcite-input-date-picker>`);

    const inputDatePickerEl = await page.find("calcite-input-date-picker");

    await page.$eval("calcite-input-date-picker", (element: any) => {
      element.valueAsDate = [new Date("2022-10-1"), new Date("2022-10-2")];
    });

    const expectedStartDateValue = "2022-10-01";
    const expectedEndDateValue = "2022-10-02";
    const expectedValue = [expectedStartDateValue, expectedEndDateValue];

    expect(await inputDatePickerEl.getProperty("value")).toEqual(expectedValue);

    const expectedStartDateInputValue = "10/1/2022";
    const expectedEndDateInputValue = "10/2/2022";

    const startDateInputValue = await page.evaluate(() => {
      const inputDatePicker = document.querySelector("calcite-input-date-picker");
      const calciteInput = inputDatePicker.shadowRoot.querySelector("calcite-input");
      const input = calciteInput.shadowRoot.querySelector("input");
      return input.value;
    });

    const endDateInputValue = await page.evaluate(() => {
      const inputDatePicker = document.querySelector("calcite-input-date-picker");
      const calciteInputs = inputDatePicker.shadowRoot.querySelectorAll("calcite-input");
      const input = calciteInputs[1].shadowRoot.querySelector("input");
      return input.value;
    });

    expect(startDateInputValue).toEqual(expectedStartDateInputValue);
    expect(endDateInputValue).toEqual(expectedEndDateInputValue);
  });

  it("should return endDate time as 23:59:999 when valueAsDate property is parsed", async () => {
    const page = await newE2EPage();
    await page.setContent(html` <calcite-input-date-picker layout="horizontal" range></calcite-input-date-picker>`);

    const changeEvent = await page.spyOnEvent("calciteInputDatePickerChange");

    const datepickerEl = await page.find("calcite-input-date-picker");
    datepickerEl.setProperty("value", ["2022-08-10", "2022-08-20"]);

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

    expect(changeEvent).toHaveReceivedEventTimes(1);
    expect(await datepickerEl.getProperty("value")).toEqual(["2022-08-15", "2022-08-20"]);
  });

  it("should position on scroll when overlayPositioning is fixed", async () => {
    const page = await newE2EPage();

    await page.setContent(
      html`<div id="scrollEl" style="max-height: 300px; height:300px; overflow: auto;">
        <div style="height:100px"></div>
        <calcite-input-date-picker open overlay-positioning="fixed"></calcite-input-date-picker>
        <div style="height:400px"></div>
      </div>`
    );

    await page.waitForChanges();

    const scrollEl = await page.find("#scrollEl");

    expect(await scrollEl.getProperty("scrollTop")).toBe(0);

    const inputDatePicker = await page.find("calcite-input-date-picker");
    const floatingEl = await page.find(`calcite-input-date-picker >>> .${CSS.menu}`);

    expect(await inputDatePicker.isVisible()).toBe(true);
    expect(await floatingEl.isVisible()).toBe(true);
    expect((await floatingEl.getComputedStyle()).transform).toBe("matrix(1, 0, 0, 1, 8, 140)");

    await page.$eval("#scrollEl", async (scrollEl: HTMLDivElement) => {
      scrollEl.scrollTo({ top: 100 });
    });

    await page.waitForChanges();

    expect(await inputDatePicker.isVisible()).toBe(true);
    expect(await floatingEl.isVisible()).toBe(true);
    expect((await floatingEl.getComputedStyle()).transform).toBe("matrix(1, 0, 0, 1, 8, 40)");
  });

  describe("focus trapping", () => {
    it("traps focus only when open", async () => {
      const page = await newE2EPage();
      await page.setContent(
        html` <calcite-input-date-picker></calcite-input-date-picker>
          <div id="next-sibling" tabindex="0">next sibling</div>`
      );

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "id")).toBe("next-sibling");

      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-INPUT");

      const opening = page.waitForEvent("calciteInputDatePickerOpen");
      await page.keyboard.press("ArrowDown");
      await opening;
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      const closing = page.waitForEvent("calciteInputDatePickerClose");
      await page.keyboard.press("Escape");
      await closing;
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-INPUT");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "id")).toBe("next-sibling");
    });

    it("traps focus only when open (range)", async () => {
      const page = await newE2EPage();
      await page.setContent(
        html`<calcite-input-date-picker range></calcite-input-date-picker>
          <div id="next-sibling" tabindex="0">next sibling</div>`
      );

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "id")).toBe("next-sibling");

      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");

      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-INPUT");

      const startOpening = page.waitForEvent("calciteInputDatePickerOpen");
      await page.keyboard.press("ArrowDown");
      await startOpening;
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      const startClosing = page.waitForEvent("calciteInputDatePickerClose");
      await page.keyboard.press("Escape");
      await startClosing;
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-INPUT");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-INPUT");

      const endOpening = page.waitForEvent("calciteInputDatePickerOpen");
      await page.keyboard.press("ArrowDown");
      await endOpening;
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-DATE-PICKER");

      const endClosing = page.waitForEvent("calciteInputDatePickerClose");
      await page.keyboard.press("Escape");
      await endClosing;
      expect(await getFocusedElementProp(page, "tagName")).toBe("CALCITE-INPUT-DATE-PICKER");
      expect(await getFocusedElementProp(page, "tagName", { shadow: true })).toBe("CALCITE-INPUT");

      await page.keyboard.press("Tab");
      expect(await getFocusedElementProp(page, "id")).toBe("next-sibling");
    });
  });
});
