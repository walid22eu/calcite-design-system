import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
import { renders, accessible, focusable } from "../../tests/commonTests";

describe("calcite-rating", () => {
  it("renders", async () => renders("<calcite-rating></calcite-rating>"));

  it("should be accessible", async () => accessible(`<calcite-rating></calcite-rating>`));

  it("renders outlined star when no value or average is set", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    const partialStarContainer = await page.find("calcite-rating >>> .fraction");

    expect(partialStarContainer).toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star");
    expect(icons[1]).toEqualAttribute("icon", "star");
    expect(icons[2]).toEqualAttribute("icon", "star");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).not.toHaveClass("selected");
    expect(labels[1]).not.toHaveClass("selected");
    expect(labels[2]).not.toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
  });

  it("displays the correct stars as filled and selected when called with a value", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating value=3></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    const partialStarContainer = await page.find("calcite-rating >>> .fraction");

    expect(partialStarContainer).toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("selected");
    expect(labels[1]).toHaveClass("selected");
    expect(labels[2]).toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
  });

  it("displays the average when value is not present", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating average=2></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    const partialStarContainer = await page.find("calcite-rating >>> .fraction");
    expect(partialStarContainer).toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).not.toHaveClass("selected");
    expect(labels[1]).not.toHaveClass("selected");
    expect(labels[2]).not.toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(labels[0]).toHaveClass("average");
    expect(labels[1]).toHaveClass("average");
    expect(labels[2]).not.toHaveClass("average");
    expect(labels[3]).not.toHaveClass("average");
    expect(labels[4]).not.toHaveClass("average");
  });

  it("displays the value when average and value are present", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating average=3 value=1></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star");
    expect(icons[2]).toEqualAttribute("icon", "star");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("selected");
    expect(labels[1]).not.toHaveClass("selected");
    expect(labels[2]).not.toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(labels[0]).not.toHaveClass("average");
    expect(labels[1]).not.toHaveClass("average");
    expect(labels[2]).not.toHaveClass("average");
    expect(labels[3]).not.toHaveClass("average");
    expect(labels[4]).not.toHaveClass("average");
  });

  it("displays a partial star when average is present and contains a partial value", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating average=3.45></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    const partialStarContainer = await page.find("calcite-rating >>> .fraction");
    expect(partialStarContainer).not.toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).not.toHaveClass("selected");
    expect(labels[1]).not.toHaveClass("selected");
    expect(labels[2]).not.toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(labels[0]).toHaveClass("average");
    expect(labels[1]).toHaveClass("average");
    expect(labels[2]).toHaveClass("average");
    expect(labels[3]).not.toHaveClass("average");
    expect(labels[4]).not.toHaveClass("average");
  });

  it("clicking on an icon will correctly set the value", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating></calcite-rating>");
    const element = await page.find("calcite-rating");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    const partialStarContainer = await page.find("calcite-rating >>> .fraction");

    expect(partialStarContainer).toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star");
    expect(icons[1]).toEqualAttribute("icon", "star");
    expect(icons[2]).toEqualAttribute("icon", "star");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).not.toHaveClass("selected");
    expect(labels[1]).not.toHaveClass("selected");
    expect(labels[2]).not.toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(element).toEqualAttribute("value", "0");
    await labels[2].click();
    await page.waitForChanges();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("selected");
    expect(labels[1]).toHaveClass("selected");
    expect(labels[2]).toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(element).toEqualAttribute("value", "3");
  });

  it("setting a value will remove displayed average and partial average", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating average=3.5></calcite-rating>");
    const element = await page.find("calcite-rating");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    let partialStarContainer = await page.find("calcite-rating >>> .fraction");

    expect(partialStarContainer).not.toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("average");
    expect(labels[1]).toHaveClass("average");
    expect(labels[2]).toHaveClass("average");
    expect(labels[3]).not.toHaveClass("average");
    expect(labels[4]).not.toHaveClass("average");
    expect(element).toEqualAttribute("value", "0");

    await labels[3].click();
    await page.waitForChanges();

    partialStarContainer = await page.find("calcite-rating >>> .fraction");
    expect(partialStarContainer).toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star-f");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("selected");
    expect(labels[1]).toHaveClass("selected");
    expect(labels[2]).toHaveClass("selected");
    expect(labels[3]).toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(labels[0]).not.toHaveClass("average");
    expect(labels[1]).not.toHaveClass("average");
    expect(labels[2]).not.toHaveClass("average");
    expect(labels[3]).not.toHaveClass("average");
    expect(labels[4]).not.toHaveClass("average");
    expect(element).toEqualAttribute("value", "4");
  });

  it("uses the correct data attributes while hovering over an unselected star with no value", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");

    expect(icons[0]).toEqualAttribute("icon", "star");
    expect(icons[1]).toEqualAttribute("icon", "star");
    expect(icons[2]).toEqualAttribute("icon", "star");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).not.toHaveClass("hovered");
    expect(labels[1]).not.toHaveClass("hovered");
    expect(labels[2]).not.toHaveClass("hovered");
    expect(labels[3]).not.toHaveClass("hovered");
    expect(labels[4]).not.toHaveClass("hovered");

    await labels[3].hover();
    await page.waitForChanges();
    expect(icons[0]).toEqualAttribute("icon", "star");
    expect(icons[1]).toEqualAttribute("icon", "star");
    expect(icons[2]).toEqualAttribute("icon", "star");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("hovered");
    expect(labels[1]).toHaveClass("hovered");
    expect(labels[2]).toHaveClass("hovered");
    expect(labels[3]).toHaveClass("hovered");
    expect(labels[4]).not.toHaveClass("hovered");
  });

  it("correctly sets classes while hovering over an unselected star with value", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating value=3></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");

    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("selected");
    expect(labels[1]).toHaveClass("selected");
    expect(labels[2]).toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(labels[0]).not.toHaveClass("hovered");
    expect(labels[1]).not.toHaveClass("hovered");
    expect(labels[2]).not.toHaveClass("hovered");
    expect(labels[3]).not.toHaveClass("hovered");
    expect(labels[4]).not.toHaveClass("hovered");

    await labels[3].hover();
    await page.waitForChanges();

    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star");
    expect(icons[4]).toEqualAttribute("icon", "star");

    expect(labels[0]).toHaveClass("hovered");
    expect(labels[1]).toHaveClass("hovered");
    expect(labels[2]).toHaveClass("hovered");
    expect(labels[3]).toHaveClass("hovered");
    expect(labels[4]).not.toHaveClass("hovered");
  });

  it("correctly sets classes while hovering over an unselected star with average", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating average=4.2></calcite-rating>");
    const icons = await page.findAll("calcite-rating >>> .icon");
    const labels = await page.findAll("calcite-rating >>> .star");
    let partialStarContainer = await page.find("calcite-rating >>> .fraction");

    expect(partialStarContainer).not.toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star-f");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).not.toHaveClass("selected");
    expect(labels[1]).not.toHaveClass("selected");
    expect(labels[2]).not.toHaveClass("selected");
    expect(labels[3]).not.toHaveClass("selected");
    expect(labels[4]).not.toHaveClass("selected");
    expect(labels[0]).not.toHaveClass("hovered");
    expect(labels[1]).not.toHaveClass("hovered");
    expect(labels[2]).not.toHaveClass("hovered");
    expect(labels[3]).not.toHaveClass("hovered");
    expect(labels[4]).not.toHaveClass("hovered");
    await labels[4].hover();
    await page.waitForChanges();
    partialStarContainer = await page.find("calcite-rating >>> .fraction");
    expect(partialStarContainer).toBeNull();
    expect(icons[0]).toEqualAttribute("icon", "star-f");
    expect(icons[1]).toEqualAttribute("icon", "star-f");
    expect(icons[2]).toEqualAttribute("icon", "star-f");
    expect(icons[3]).toEqualAttribute("icon", "star-f");
    expect(icons[4]).toEqualAttribute("icon", "star");
    expect(labels[0]).toHaveClass("hovered");
    expect(labels[1]).toHaveClass("hovered");
    expect(labels[2]).toHaveClass("hovered");
    expect(labels[3]).toHaveClass("hovered");
    expect(labels[4]).toHaveClass("hovered");
  });

  it("emits expected event when user clicks to choose value", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating></calcite-rating>");
    const element = await page.find("calcite-rating");
    const labels = await page.findAll("calcite-rating >>> .star");

    const changeEvent = await element.spyOnEvent("calciteRatingChange");
    expect(changeEvent).toHaveReceivedEventTimes(0);
    await labels[0].click();
    expect(element).toEqualAttribute("value", "1");
    expect(changeEvent).toHaveReceivedEventTimes(1);
    expect(changeEvent).toHaveReceivedEventDetail({
      value: 1
    });
    await labels[3].click();
    expect(element).toEqualAttribute("value", "4");
    expect(changeEvent).toHaveReceivedEventTimes(2);
    expect(changeEvent).toHaveReceivedEventDetail({
      value: 4
    });
  });

  it("can be edited with keyboard like a set of radio inputs", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating></calcite-rating>");
    const element = await page.find("calcite-rating");
    const changeEvent = await element.spyOnEvent("calciteRatingChange");
    await page.keyboard.press("Tab");
    expect(changeEvent).toHaveReceivedEventTimes(0);
    await element.press(" ");
    expect(changeEvent).toHaveReceivedEventTimes(1);
    expect(changeEvent).toHaveReceivedEventDetail({
      value: 1
    });
    await page.keyboard.press("ArrowRight");
    expect(changeEvent).toHaveReceivedEventTimes(2);
    expect(changeEvent).toHaveReceivedEventDetail({
      value: 2
    });
    await page.keyboard.press("ArrowLeft");
    expect(changeEvent).toHaveReceivedEventTimes(3);
    expect(changeEvent).toHaveReceivedEventDetail({
      value: 1
    });
    await page.keyboard.press("ArrowLeft");
    expect(changeEvent).toHaveReceivedEventTimes(4);
    expect(changeEvent).toHaveReceivedEventDetail({
      value: 5
    });
    await page.keyboard.press("ArrowRight");
    expect(changeEvent).toHaveReceivedEventTimes(5);
    expect(changeEvent).toHaveReceivedEventDetail({
      value: 1
    });
  });

  it("disables click interaction when readonly is requested", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating value=4 read-only></calcite-rating>");
    const element = await page.find("calcite-rating");
    const ratingItem1 = await page.find("calcite-rating >>> .star");
    expect(element).toEqualAttribute("value", "4");
    await ratingItem1.click();
    expect(element).toEqualAttribute("value", "4");
  });

  it("disables click interaction when disabled is requested", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating disabled></calcite-rating>");
    const element = await page.find("calcite-rating");
    const ratingItem1 = await page.find("calcite-rating >>> .star");
    expect(element).toEqualAttribute("value", "0");
    await ratingItem1.click();
    expect(element).toEqualAttribute("value", "0");
  });

  it("does not render the calcite chip when count and average are not present", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating show-chip></calcite-rating>");
    const calciteChip = await page.find("calcite-rating >>> calcite-chip");
    expect(calciteChip).toBeNull();
  });

  it("does not render the calcite chip when show-chip is false", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating count=240 average=3 value=2></calcite-rating>");
    const calciteChip = await page.find("calcite-rating >>> calcite-chip");
    expect(calciteChip).toBeNull();
  });

  it("renders the calcite chip and the count span when count is present and average is not", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-rating count=15 show-chip></calcite-rating>`);
    const calciteChip = await page.find("calcite-rating >>> calcite-chip");
    const countSpan = await page.find("calcite-rating >>> .number--count");
    const averageSpan = await page.find("calcite-rating >>> .number--average");
    expect(calciteChip).not.toBeNull();
    expect(countSpan).not.toBeNull();
    expect(averageSpan).toBeNull();
  });

  it("renders the calcite chip and the average span when average is present and count is not", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating average=4.2 show-chip></calcite-rating>");
    const calciteChip = await page.find("calcite-rating >>> calcite-chip");
    const countSpan = await page.find("calcite-rating >>> .number---count");
    const averageSpan = await page.find("calcite-rating >>> .number--average");
    expect(calciteChip).not.toBeNull();
    expect(countSpan).toBeNull();
    expect(averageSpan).not.toBeNull();
  });

  it("renders the calcite chip and both the average and count spans when average and count are present", async () => {
    const page = await newE2EPage();
    await page.setContent("<calcite-rating count=15 average=4.2 show-chip></calcite-rating>");
    const calciteChip = await page.find("calcite-rating >>> calcite-chip");
    const countSpan = await page.find("calcite-rating >>> .number--count");
    const averageSpan = await page.find("calcite-rating >>> .number--average");
    expect(calciteChip).not.toBeNull();
    expect(countSpan).not.toBeNull();
    expect(averageSpan).not.toBeNull();
  });

  describe("when setFocus method is called", () => {
    it("should focus input element in shadow DOM", () =>
      focusable("calcite-rating", {
        shadowFocusTargetSelector: "input"
      }));
  });

  describe("when wrapped inside calcite-label", () => {
    let page: E2EPage;
    let ratingStars: E2EElement[];
    let label: E2EElement;

    beforeEach(async () => {
      page = await newE2EPage();
    });

    describe("when a rating value exists", () => {
      it("should focus the last-selected star on label click", async () => {
        await page.setContent("<calcite-label>Your rating<calcite-rating value='3'></calcite-rating></calcite-label>");
        label = await page.find("calcite-label");
        await label.click();
        ratingStars = await page.findAll("calcite-rating >>> label.selected");
        const lastSelectedStar = ratingStars[ratingStars.length - 1];
        expect(lastSelectedStar).toHaveClass("focused");
        const guid = lastSelectedStar.getAttribute("for");
        const lastSelectedInput = await page.find(`calcite-rating >>> input[id="${guid}"]`);
        expect(await lastSelectedInput.getProperty("value")).toEqual("3");
      });
    });

    describe("when no rating value exists", () => {
      it("should focus the first non-selected star on label click", async () => {
        await page.setContent("<calcite-label dir='rtl'>הדירוג שלי<calcite-rating></calcite-rating></calcite-label>");
        label = await page.find("calcite-label");
        await label.click();
        ratingStars = await page.findAll("calcite-rating >>> label");
        const firstStar = ratingStars[0];
        expect(firstStar).toHaveClass("focused");
        expect(firstStar).not.toHaveClass("selected");
        const guid = firstStar.getAttribute("for");
        const firstInputById = await page.find(`calcite-rating >>> input[id="${guid}"]`);
        expect(await firstInputById.getProperty("value")).toEqual("1");
      });
    });
  });
});
