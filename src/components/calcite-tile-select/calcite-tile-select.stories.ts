import { storiesOf } from "@storybook/html";
import { select, text } from "@storybook/addon-knobs";
import { iconNames, boolean } from "../../../.storybook/helpers";
import { darkBackground } from "../../../.storybook/utils";
import readme from "./readme.md";

storiesOf("Components/Tile Select", module)
  .addParameters({ notes: readme })
  .add(
    "Light",
    (): string => `
      <calcite-tile-select
        ${boolean("checked", false)}
        description="${text(
          "description",
          "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
        )}"
        ${boolean("disabled", false)}
        ${boolean("focused", false)}
        heading="${text("heading", "Tile heading lorem ipsum")}"
        ${boolean("hidden", false)}
        icon="${select("icon", iconNames, iconNames[296])}"
        name="${text("name", "tile-select-demo")}"
        show-input="${select("show-input", ["left", "right", "none"], "left")}"
        type="${select("type", ["radio", "checkbox"], "radio")}"
        value="${text("value", "one")}"
      >
      </calcite-tile-select>
  `
  )
  .add(
    "Dark",
    (): string => `
      <calcite-tile-select
        ${boolean("checked", false)}
        description="${text(
          "description",
          "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
        )}"
        ${boolean("disabled", false)}
        ${boolean("focused", false)}
        heading="${text("heading", "Tile heading lorem ipsum")}"
        ${boolean("hidden", false)}
        icon="${select("icon", iconNames, iconNames[296])}"
        name="${text("name", "tile-select-demo")}"
        show-input="${select("show-input", ["left", "right", "none"], "left")}"
        theme="dark"
        type="${select("type", ["radio", "checkbox"], "radio")}"
        value="${text("value", "one")}"
      >
      </calcite-tile-select>
  `,
    { backgrounds: darkBackground }
  );
