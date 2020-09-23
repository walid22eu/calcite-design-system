import { newE2EPage } from "@stencil/core/testing";
import { HYDRATED_ATTR } from "../../tests/commonTests";

describe("calcite-button", () => {
  it("renders as a button with default props", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button>Continue</calcite-button>`);

    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");

    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(element).toEqualAttribute("color", "blue");
    expect(element).toEqualAttribute("appearance", "solid");
    expect(element).toEqualAttribute("scale", "m");
    expect(element).toEqualAttribute("width", "auto");
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).toBeNull();
  });

  it("renders as a link with default props", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button href="/">Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");

    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(element).toEqualAttribute("color", "blue");
    expect(element).toEqualAttribute("appearance", "solid");
    expect(element).toEqualAttribute("scale", "m");
    expect(element).toEqualAttribute("width", "auto");
    expect(elementAsLink).not.toBeNull();
    expect(elementAsButton).toBeNull();
    expect(iconStart).toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).toBeNull();
  });

  it("renders as a button with requested props", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-button color="red" scale="l" width="half" appearance="outline">Continue</calcite-button>`
    );
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");

    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(element).toEqualAttribute("color", "red");
    expect(element).toEqualAttribute("appearance", "outline");
    expect(element).toEqualAttribute("scale", "l");
    expect(element).toEqualAttribute("width", "half");
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).toBeNull();
  });

  it("renders as a link with requested props", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-button href="/" color="red" scale="l" width="half" appearance="outline">Continue</calcite-button>`
    );
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");

    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(element).toEqualAttribute("color", "red");
    expect(element).toEqualAttribute("appearance", "outline");
    expect(element).toEqualAttribute("scale", "l");
    expect(element).toEqualAttribute("width", "half");
    expect(elementAsLink).not.toBeNull();
    expect(elementAsButton).toBeNull();
    expect(iconStart).toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).toBeNull();
  });

  it("passes attributes to rendered child link", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<calcite-button rel="noopener noreferrer" target="_blank" class="mycustomclass" href="google.com">Continue</calcite-button>`
    );
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).not.toBeNull();
    expect(elementAsButton).toBeNull();
    expect(elementAsLink).toHaveClass("mycustomclass");
    expect(elementAsLink).toEqualAttribute("href", "google.com");
    expect(elementAsLink).toEqualAttribute("rel", "noopener noreferrer");
    expect(elementAsLink).toEqualAttribute("target", "_blank");
    expect(iconStart).toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).toBeNull();
  });

  it("passes attributes to rendered child button", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button type="reset" name="myname" class="mycustomclass">Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(elementAsButton).toHaveClass("mycustomclass");
    expect(elementAsButton).toEqualAttribute("type", "reset");
    expect(elementAsButton).toEqualAttribute("name", "myname");
    expect(iconStart).toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).toBeNull();
  });

  it("renders with an icon-start", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button icon-start='plus'>Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).not.toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).toBeNull();
  });

  it("renders with an icon-end", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button icon-end='plus'>Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).toBeNull();
    expect(iconEnd).not.toBeNull();
    expect(loader).toBeNull();
  });

  it("renders with an icon-start and icon-end", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button icon-start='plus' icon-end='plus'>Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).not.toBeNull();
    expect(iconEnd).not.toBeNull();
    expect(loader).toBeNull();
  });

  it("renders with a loader and an icon-start when both icon-start and loader are requested", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button loading icon-start='plus'>Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).not.toBeNull();
    expect(iconEnd).toBeNull();
    expect(loader).not.toBeNull();
  });

  it("renders with a loader and an icon-end when both icon-end and loader are requested", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button loading icon-end='plus'>Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).toBeNull();
    expect(iconEnd).not.toBeNull();
    expect(loader).not.toBeNull();
  });

  it("renders with a loader and an icon-start and icon-end when all are requested", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button loading icon-start='plus' icon-end='plus'>Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    const elementAsButton = await page.find("calcite-button >>> button");
    const elementAsLink = await page.find("calcite-button >>> a");
    const iconStart = await page.find("calcite-button >>> .calcite-button--icon.icon-start");
    const iconEnd = await page.find("calcite-button >>> .calcite-button--icon.icon-end");
    const loader = await page.find("calcite-button >>> .calcite-button--loader");
    expect(element).toHaveAttribute(HYDRATED_ATTR);
    expect(elementAsLink).toBeNull();
    expect(elementAsButton).not.toBeNull();
    expect(iconStart).not.toBeNull();
    expect(iconEnd).not.toBeNull();
    expect(loader).not.toBeNull();
  });

  it("hastext is true when text is present", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button>Continue</calcite-button>`);
    const element = await page.find("calcite-button");
    expect(element).toHaveAttribute("hastext");
  });

  it("hastext is false when text is not present", async () => {
    const page = await newE2EPage();
    await page.setContent(`<calcite-button icon-start='plus'></calcite-button>`);
    const element = await page.find("calcite-button");
    expect(element).not.toHaveAttribute("hastext");
  });
});
