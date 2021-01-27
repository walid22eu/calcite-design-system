import { newE2EPage } from "@stencil/core/testing";

describe("calcite-date-picker-month-header", () => {
  const localeDataFixture = {
    "default-calendar": "gregorian",
    separator: "/",
    unitOrder: "DD/MM/YYYY",
    weekStart: 7,
    placeholder: "DD/MM/YYYY",
    days: {
      narrow: ["D", "L", "M", "M", "J", "V", "S"]
    },
    numerals: "0123456789",
    months: {
      abbreviated: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."],
      narrow: ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      wide: [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
      ]
    }
  };

  it("displays next/previous options", async () => {
    const page = await newE2EPage({
      // intentionally using calcite-date-picker to wire up supporting components to be used in `evaluate` fn below
      html: "<calcite-date-picker></calcite-date-picker>"
    });
    await page.waitForChanges();

    await page.evaluate((localeData) => {
      const dateMonthHeader = document.createElement(
        "calcite-date-picker-month-header"
      ) as HTMLCalciteDatePickerMonthHeaderElement;
      const now = new Date();
      dateMonthHeader.activeDate = now;
      dateMonthHeader.selectedDate = now;
      dateMonthHeader.localeData = localeData;

      document.body.innerHTML = "";
      document.body.append(dateMonthHeader);
    }, localeDataFixture);
    await page.waitForChanges();

    const [prev, next] = await page.findAll("calcite-date-picker-month-header >>> .chevron");

    expect(await prev.isVisible()).toBe(true);
    expect(await next.isVisible()).toBe(true);
  });
});
