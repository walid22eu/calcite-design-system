import { storiesOf } from "@storybook/html";
import { boolean, select } from "@storybook/addon-knobs";

import { darkBackground } from "../../../.storybook/utils";
import readme from "./readme.md";

storiesOf("Components/Alert", module)
  .addParameters({ notes: readme })
  .add(
    "Alert - title, message, link",
    (): string => `
    <calcite-alert
    theme="light"
    icon="${boolean("icon", true)}"
    auto-dismiss="${boolean("auto-dismiss", false)}"
    auto-dismiss-duration="${select("auto-dismiss-duration", ["fast", "medium", "slow"], "medium")}"
    active="${boolean("active", true)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    color="${select("color", ["green", "red", "yellow", "blue"], "blue")}">
    <div slot="alert-title">Here's a general bit of information</div></div>
    <div slot="alert-message">
      Some kind of contextually relevant content
    </div>
    <calcite-link slot="alert-link" title="my action">Take action</calcite-link>
  </calcite-alert>
  `
  )
  .add(
    "Alert - title, message",
    (): string => `
    <calcite-alert
    theme="light"
    icon="${boolean("icon", true)}"
    auto-dismiss="${boolean("auto-dismiss", false)}"
    auto-dismiss-duration="${select("auto-dismiss-duration", ["fast", "medium", "slow"], "medium")}"
    active="${boolean("active", true)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    color="${select("color", ["green", "red", "yellow", "blue"], "red")}">
    <div slot="alert-title">Something failed</div>
    <div slot="alert-message">
      That thing you wanted to do didn't work as expected
    </div>
  </calcite-alert>
  `
  )
  .add(
    "Alert - message, link",
    (): string => `
    <calcite-alert
    theme="light"
    icon="${boolean("icon", true)}"
    auto-dismiss="${boolean("auto-dismiss", false)}"
    auto-dismiss-duration="${select("auto-dismiss-duration", ["fast", "medium", "slow"], "medium")}"
    active="${boolean("active", true)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    color="${select("color", ["green", "red", "yellow", "blue"], "green")}">
    <div slot="alert-message">
     Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer
    </div>
    <calcite-link slot="alert-link" title="my action">View layer</calcite-link>
  </calcite-alert>
  `
  )
  .add(
    "Alert - message",
    (): string => `
    <calcite-alert
    theme="light"
    icon="${boolean("icon", true)}"
    auto-dismiss="${boolean("auto-dismiss", false)}"
    auto-dismiss-duration="${select("auto-dismiss-duration", ["fast", "medium", "slow"], "medium")}"
    active="${boolean("active", true)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    color="${select("color", ["green", "red", "yellow", "blue"], "yellow")}">
    <div slot="alert-message">
      Network connection interruption detected
    </div>
  </calcite-alert>
  `
  )
  .add(
    "Alert - Queue",
    (): string => `
   <div>
    <h5>Open or add to queue</h5>
    <calcite-button onclick='document.querySelector("#one").setAttribute("active", "")'>Open Alert 1</calcite-button>
    <calcite-button onclick='document.querySelector("#two").setAttribute("active", "")'>Open Alert 2</calcite-button>
    <calcite-button onclick='document.querySelector("[data-custom-id=my-id]").setAttribute("active", "")'>Open Alert 3</calcite-button>
    <br/>
    <br/>
    <h5>Close or remove from queue</h5>
    <calcite-button color="red" onclick='document.querySelector("#one").removeAttribute("active")'>Close Alert 1</calcite-button>
    <calcite-button color="red" onclick='document.querySelector("#two").removeAttribute("active")'>Close Alert 2</calcite-button>
    <calcite-button color="red" onclick='document.querySelector("[data-custom-id=my-id]").removeAttribute("active")'>Close Alert 3</calcite-button>
      <calcite-alert
      id="one"
      theme="light"
      icon="${boolean("icon", true)}"
      color="${select("color", ["green", "red", "yellow", "blue"], "green")}">
      <div slot="alert-title">Your great thing happened</div>
      <div slot="alert-message">
        Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer
      </div>
      <calcite-link slot="alert-link" title="my action">View layer</calcite-link>
    </calcite-alert>
    <calcite-alert
    id="two"
    theme="light"
    icon="${boolean("icon-2", true)}"
    color="${select("color-2", ["green", "red", "yellow", "blue"], "blue")}">
    <div slot="alert-title">Your great thing happened</div>
    <div slot="alert-message">
    Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer
    </div>
    <calcite-link slot="alert-link" title="my action">View layer</calcite-link>
    </calcite-alert>
    <calcite-alert
      data-custom-id="my-id"
      theme="light"
      icon="${boolean("icon-3", true)}"
      color="${select("color-3", ["green", "red", "yellow", "blue"], "red")}">
      <div slot="alert-title">That didn't work out</div>
      <div slot="alert-message">
        That thing you wanted to do didn't work
      </div>
      <calcite-link slot="alert-link" title="my action">View layer</calcite-link>
    </calcite-alert>
   </div>
  `
  )
  .add(
    "Alert - Dark Theme",
    (): string => `
    <calcite-alert
    theme="dark"
    icon="${boolean("icon", true)}"
    auto-dismiss="${boolean("auto-dismiss", false)}"
  auto-dismiss-duration="${select("auto-dismiss-duration", ["fast", "medium", "slow"], "medium")}"
    active="${boolean("active", true)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    color="${select("color", ["green", "red", "yellow", "blue"], "red")}">
    <div slot="alert-title">Something failed</div>
    <div slot="alert-message">
      That thing you wanted to do didn't work as expected
    </div>
    <calcite-link theme="dark" slot="alert-link" title="my action">My action</calcite-link>
  </calcite-alert>
  `,
    { backgrounds: darkBackground }
  )
  .add(
    "Alert - Dark Theme Queue",
    (): string => `
   <div>
    <h5 style="color:white">Open or add to queue</h5>
    <calcite-button theme="dark" onclick='document.querySelector("#one").setAttribute("active", "")'>Open Alert 1</calcite-button>
    <calcite-button theme="dark" onclick='document.querySelector("#two").setAttribute("active", "")'>Open Alert 2</calcite-button>
    <calcite-button theme="dark" onclick='document.querySelector("[data-custom-id=my-id]").setAttribute("active", "")'>Open Alert 3</calcite-button>
    <br/>
    <br/>
    <h5 style="color:white">Close or remove from queue</h5>
    <calcite-button theme="dark" color="red" onclick='document.querySelector("#one").removeAttribute("active")'>Close Alert 1</calcite-button>
    <calcite-button theme="dark" color="red" onclick='document.querySelector("#two").removeAttribute("active")'>Close Alert 2</calcite-button>
    <calcite-button theme="dark" color="red" onclick='document.querySelector("[data-custom-id=my-id]").removeAttribute("active")'>Close Alert 3</calcite-button>
      <calcite-alert
      id="one"
      theme="dark"
      icon="${boolean("icon", true)}"
      color="${select("color", ["green", "red", "yellow", "blue"], "green")}">
      <div slot="alert-title">Your great thing happened</div>
      <div slot="alert-message">
        Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer
      </div>
      <calcite-link theme="dark" slot="alert-link" title="my action">My action</calcite-link>
    </calcite-alert>
    <calcite-alert
    id="two"
    theme="dark"
    icon="${boolean("icon-2", true)}"
    color="${select("color-2", ["green", "red", "yellow", "blue"], "blue")}">
    <div slot="alert-title">Your great thing happened</div>
    <div slot="alert-message">
    Successfully duplicated <strong>2019 Sales Demographics by County</strong> layer
    </div>
    <calcite-link theme="dark" slot="alert-link" title="my action">My action</calcite-link>
    </calcite-alert>
    <calcite-alert
      data-custom-id="my-id"
      theme="dark"
      icon="${boolean("icon-3", true)}"
      color="${select("color-3", ["green", "red", "yellow", "blue"], "red")}">
      <div slot="alert-message">
        That thing you wanted to do didn't work out so well.
      </div>
    </calcite-alert>
   </div>
  `,
    { backgrounds: darkBackground }
  )
  .add(
    "Alert - RTL",
    (): string => `
    <div dir="rtl">
    <calcite-alert
    theme="light"
    icon="${boolean("icon", true)}"
    auto-dismiss="${boolean("auto-dismiss", false)}"
    auto-dismiss-duration="${select("auto-dismiss-duration", ["fast", "medium", "slow"], "medium")}"
    active="${boolean("active", true)}"
    scale="${select("scale", ["s", "m", "l"], "m")}"
    color="${select("color", ["green", "red", "yellow", "blue"], "blue")}">
    <div slot="alert-title">Something failed</div>
    <div slot="alert-message">
      That thing you wanted to do didn't work as expected
    </div>
    <calcite-link slot="alert-link" title="my action">Retry</calcite-button>
  </calcite-alert>
  </div>
  `
  );
