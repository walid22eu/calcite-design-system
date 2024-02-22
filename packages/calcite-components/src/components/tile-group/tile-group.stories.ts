import { select, boolean } from "@storybook/addon-knobs";
import { html } from "../../../support/formatting";
import readme from "./readme.md";
import { storyFilters } from "../../../.storybook/helpers";

export default {
  title: "Components/Tiles/Tile Group",
  parameters: {
    notes: readme,
    chromatic: { delay: 10000 },
  },
  ...storyFilters(),
};

export const playground = (): string => html`
  <calcite-tile-group
    dir="${select("dir", ["ltr", "rtl"], "ltr", "Tile Group")}"
    ${boolean("disabled", false)}
    layout="${select("layout", ["horizontal", "vertical"], "horizontal", "Tile Group")}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
  >
    <calcite-tile
      heading="Tile heading lorem ipsum"
      description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
      icon="layers"
    ></calcite-tile>
    <calcite-tile
      heading="Tile heading lorem ipsum"
      description="Leverage agile frameworks to provide a robust synopsis for high level overviews."
      icon="layers"
    ></calcite-tile>
    <calcite-tile
      heading="Tile heading lorem ipsum"
      description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
      icon="layers"
    ></calcite-tile>
    <calcite-tile
      heading="Tile heading lorem ipsum"
      description="Iterative approaches to corporate strategy foster collab."
      icon="layers"
    ></calcite-tile>
  </calcite-tile-group>
`;

export const allVariants_NoTest = (): string => html`
  <style>
    .parent {
      display: flex;
      color: var(--calcite-color-text-3);
      font-family: var(--calcite-sans-family);
      font-size: var(--calcite-font-size-0);
      font-weight: var(--calcite-font-weight-medium);
    }

    .child {
      display: inline-flex;
      flex-direction: column;
      flex: 0 1 50%;
      padding: 15px;
    }

    .right-aligned-text {
      text-align: right;
      flex: 0 0 21%;
    }

    hr {
      margin: 25px 0;
      border-top: 1px solid var(--calcite-color-border-2);
    }
  </style>
  <!-- horizontal -->
  <div class="parent">
    <div class="child right-aligned-text"><h2>horizontal</h2></div>
  </div>

  <div class="parent">
    <div class="child"></div>
    <div class="child">small</div>
    <div class="child">medium</div>
    <div class="child">large</div>
  </div>

  <!-- icon, heading, description -->
  <div class="parent">
    <div class="child right-aligned-text">icon, heading, description</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Iterative approaches to corporate strategy foster collab."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Iterative approaches to corporate strategy foster collab."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Iterative approaches to corporate strategy foster collab."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon, heading, description as link -->
  <div class="parent">
    <div class="child right-aligned-text">icon, heading, description as link</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon, heading, description disabled -->
  <div class="parent">
    <div class="child right-aligned-text">icon, heading, description disabled</div>
    <div class="child">
      <calcite-tile-group scale="s" disabled>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group disabled>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l" disabled>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- heading only -->
  <div class="parent">
    <div class="child right-aligned-text">heading only</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- heading only as link -->
  <div class="parent">
    <div class="child right-aligned-text">heading only as link</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- description only -->
  <div class="parent">
    <div class="child right-aligned-text">description only</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- description only as link -->
  <div class="parent">
    <div class="child right-aligned-text">description only as link</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- heading and description -->
  <div class="parent">
    <div class="child right-aligned-text">heading and description</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- heading and description as link -->
  <div class="parent">
    <div class="child right-aligned-text">heading and description as link</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon and heading (large visual) -->
  <div class="parent">
    <div class="child right-aligned-text">icon and heading (large visual)</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon and heading (large visual) as link -->
  <div class="parent">
    <div class="child right-aligned-text">icon and heading (large visual) as link</div>
    <div class="child">
      <calcite-tile-group scale="s">
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group scale="l">
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- A horizonal line-->
  <hr />

  <!-- Vertical -->
  <div class="parent">
    <div class="child right-aligned-text"><h2>vertical</h2></div>
  </div>

  <!-- heading only -->
  <div class="parent">
    <div class="child right-aligned-text">heading only</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
        <calcite-tile heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- heading only as link -->
  <div class="parent">
    <div class="child right-aligned-text">heading only as link</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
        <calcite-tile href="/" heading="Tile title"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- description only -->
  <div class="parent">
    <div class="child right-aligned-text">description only</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
        <calcite-tile description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- description only as link -->
  <div class="parent">
    <div class="child right-aligned-text">description only as link</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
        <calcite-tile href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- heading and description -->
  <div class="parent">
    <div class="child right-aligned-text">heading and description</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- heading and description as link -->
  <div class="parent">
    <div class="child right-aligned-text">heading and description as link</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
        <calcite-tile heading="Tile title" href="/" description="Tile description"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon, heading, description -->
  <div class="parent">
    <div class="child right-aligned-text">icon, heading, description</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon, heading, description as link -->
  <div class="parent">
    <div class="child right-aligned-text">icon, heading, description as link</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
        <calcite-tile
          heading="Tile heading lorem ipsum"
          href="/"
          description="Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collab on thinking to further the overall."
          icon="layers"
        ></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon and heading (large visual) -->
  <div class="parent">
    <div class="child right-aligned-text">icon and heading (large visual)</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>

  <!-- icon and heading (large visual) as link -->
  <div class="parent">
    <div class="child right-aligned-text">icon and heading (large visual) as link</div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="s">
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical">
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
    <div class="child">
      <calcite-tile-group layout="vertical" scale="l">
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
        <calcite-tile heading="Tile heading lorem ipsum" href="/" icon="layers"></calcite-tile>
      </calcite-tile-group>
    </div>
  </div>
`;
