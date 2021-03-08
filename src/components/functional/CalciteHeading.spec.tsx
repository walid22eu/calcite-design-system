import { h, Component } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { CalciteHeading, ConstrainHeadingLevel } from "./CalciteHeading";

describe("ConstrainHeadingLevel", () => {
  it("should constrain heading levels", () => {
    expect(ConstrainHeadingLevel(10)).toEqual(6);
    expect(ConstrainHeadingLevel(6)).toEqual(6);
    expect(ConstrainHeadingLevel(5)).toEqual(5);
    expect(ConstrainHeadingLevel(1)).toEqual(1);
    expect(ConstrainHeadingLevel(0)).toEqual(1);
    expect(ConstrainHeadingLevel(3.14)).toEqual(4);
  });
});

@Component({ tag: "dummy-component" })
class Dummy {}

describe("CalciteHeading", () => {
  it("should render", async () => {
    const page = await newSpecPage({
      components: [Dummy], // Required so we are feeding it a Dummy component
      template: () => (
        <CalciteHeading class="test" level={1}>
          My Heading
        </CalciteHeading>
      )
    });

    expect(page.root).toEqualHtml(`<h1 class="test">My Heading</h1>`);
  });
});
