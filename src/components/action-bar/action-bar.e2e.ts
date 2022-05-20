import { newE2EPage } from "@stencil/core/testing";
import { accessible, defaults, focusable, hidden, reflects, renders, slots } from "../../tests/commonTests";
import { CSS, SLOTS } from "./resources";
import { overflowActionsDebounceInMs } from "./utils";
import { html } from "../../../support/formatting";

describe("calcite-action-bar", () => {
  it("renders", async () => renders("calcite-action-bar", { display: "inline-flex" }));

  it("honors hidden attribute", async () => hidden("calcite-action-bar"));

  it("defaults", async () =>
    defaults("calcite-action-bar", [
      {
        propertyName: "expandDisabled",
        defaultValue: false
      },
      {
        propertyName: "expanded",
        defaultValue: false
      },
      {
        propertyName: "scale",
        defaultValue: undefined
      }
    ]));

  it("reflects", async () =>
    reflects("calcite-action-bar", [
      {
        propertyName: "expandDisabled",
        value: true
      },
      {
        propertyName: "expanded",
        value: true
      }
    ]));

  describe("expand functionality", () => {
    it("should not modify actions within an action-menu", async () => {
      const page = await newE2EPage({
        html: html`<calcite-action-bar expanded>
          <calcite-action-group>
            <calcite-action id="my-action" text="Add" label="Add Item" icon="plus"></calcite-action>
          </calcite-action-group>
          <calcite-action-group>
            <calcite-action-menu label="Save and open">
              <calcite-action id="menu-action" text-enabled text="Save" label="Save" icon="save"></calcite-action>
            </calcite-action-menu>
          </calcite-action-group>
        </calcite-action-bar>`
      });
      await page.waitForChanges();
      const actionBar = await page.find("calcite-action-bar");
      const actionBarAction = await page.find("#my-action");
      const menuAction = await page.find("#menu-action");
      expect(await actionBar.getProperty("expanded")).toBe(true);
      expect(await actionBarAction.getProperty("textEnabled")).toBe(true);
      expect(await menuAction.getProperty("textEnabled")).toBe(true);
      actionBar.setProperty("expanded", false);
      await page.waitForChanges();
      expect(await menuAction.getProperty("textEnabled")).toBe(true);
      expect(await actionBarAction.getProperty("textEnabled")).toBe(false);
    });

    it("should be expandable by default", async () => {
      const page = await newE2EPage();

      await page.setContent("<calcite-action-bar></calcite-action-bar>");

      await page.waitForChanges();

      const expandAction = await page.find("calcite-action-bar >>> calcite-action");

      expect(expandAction).not.toBeNull();
    });

    it("allows disabling expandable behavior", async () => {
      const page = await newE2EPage();

      await page.setContent("<calcite-action-bar expand-disabled></calcite-action-bar>");

      await page.waitForChanges();

      const expandAction = await page.find("calcite-action-bar >>> calcite-action");

      expect(expandAction).toBeNull();
    });

    it("should toggle expanded", async () => {
      const page = await newE2EPage({ html: "<calcite-action-bar></calcite-action-bar>" });

      const bar = await page.find("calcite-action-bar");

      const buttonGroup = await page.find(`calcite-action-bar >>> .${CSS.actionGroupBottom}`);

      const button = await buttonGroup.find("calcite-action");

      expect(button).not.toBeNull();

      await button.click();

      expect(bar).toHaveAttribute("expanded");
    });

    it("should not fire expanded event when expanded programmatically", async () => {
      const page = await newE2EPage();

      await page.setContent("<calcite-action-bar></calcite-action-bar>");

      const element = await page.find("calcite-action-bar");

      const eventSpy = await element.spyOnEvent("calciteActionBarToggle");

      element.setProperty("expanded", true);

      await page.waitForChanges();

      expect(eventSpy).not.toHaveReceivedEvent();
    });

    it("should fire expanded event on user interaction", async () => {
      const page = await newE2EPage();

      await page.setContent("<calcite-action-bar></calcite-action-bar>");

      const element = await page.find("calcite-action-bar");

      const eventSpy = await element.spyOnEvent("calciteActionBarToggle");

      await element.click();

      await page.waitForChanges();

      expect(eventSpy).toHaveReceivedEvent();
    });

    it("should have child actions be textEnabled when expanded is set", async () => {
      const page = await newE2EPage();

      await page.setContent("<calcite-action-bar expanded></calcite-action-bar>");

      const buttonGroup = await page.find(`calcite-action-bar >>> .${CSS.actionGroupBottom}`);

      const button = await buttonGroup.find("calcite-action");

      const textEnabled = await button.getProperty("textEnabled");

      expect(textEnabled).toBe(true);
    });

    it("should not have bottomGroup when not expandable", async () => {
      const page = await newE2EPage();

      await page.setContent(html`<calcite-action-bar expand-disabled></calcite-action-bar>`);

      const buttonGroup = await page.find(`calcite-action-bar >>> .${CSS.actionGroupBottom}`);

      expect(buttonGroup).toBeNull();
    });

    it("should modify textEnabled on actions when expanded and expandDisabled", async () => {
      const page = await newE2EPage();

      await page.setContent(html`<calcite-action-bar expand-disabled expanded>
        <calcite-action-group>
          <calcite-action id="my-action" text="Add" label="Add Item" icon="plus"></calcite-action>
        </calcite-action-group>
      </calcite-action-bar>`);

      const expandAction = await page.find("calcite-action-bar >>> calcite-action");
      const action = await page.find("calcite-action");
      const actionBar = await page.find("calcite-action-bar");
      const group = await page.find("calcite-action-group");

      expect(await actionBar.getProperty("expanded")).toBe(true);
      expect(expandAction).toBeNull();
      expect(action).not.toBeNull();
      expect(await group.getProperty("expanded")).toBe(true);
      expect(await action.getProperty("textEnabled")).toBe(true);
    });

    it("should modify textEnabled on actions when expanded is true and new children are added", async () => {
      const page = await newE2EPage();

      await page.setContent(
        `<calcite-action-bar expanded><calcite-action text="hello"></calcite-action></calcite-action-bar>`
      );

      await page.evaluate(() => {
        const actionBar = document.querySelector("calcite-action-bar");
        const newAction = document.createElement("calcite-action");
        newAction.textEnabled = false;
        newAction.id = "new-child";
        actionBar.appendChild(newAction);
      });

      const action = await page.find("#new-child");

      const textEnabled = await action.getProperty("textEnabled");

      expect(textEnabled).toBe(true);
    });
  });

  it("should be accessible", async () =>
    accessible(`
    <calcite-action-bar>
      <calcite-action-group>
        <calcite-action text="Add" icon="plus"></calcite-action>
      </calcite-action-group>
    </calcite-action-bar>
    `));

  it("should be accessible when expanded", async () =>
    accessible(`
    <calcite-action-bar expanded>
      <calcite-action-group>
        <calcite-action text="Add" icon="plus"></calcite-action>
      </calcite-action-group>
    </calcite-action-bar>
    `));

  it("should focus on toggle button", async () =>
    focusable(
      html`
        <calcite-action-bar>
          <calcite-action-group>
            <calcite-action text="Add" icon="plus"></calcite-action>
          </calcite-action-group>
        </calcite-action-bar>
      `,
      {
        focusId: "expand-toggle",
        focusTargetSelector: "calcite-action-bar"
      }
    ));

  it("has slots", () => slots("calcite-action-bar", SLOTS));

  it("should set other 'calcite-action-group' - 'menuOpen' to false", async () => {
    const page = await newE2EPage();
    await page.setContent(html`<calcite-action-bar>
      <calcite-action-group>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Add" icon="plus" slot="menu-actions"></calcite-action>
        <calcite-action text="Add" icon="plus" slot="menu-actions"></calcite-action>
      </calcite-action-group>
      <calcite-action-group menu-open>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Add" icon="plus"></calcite-action>
        <calcite-action text="Add" icon="plus" slot="menu-actions"></calcite-action>
        <calcite-action text="Add" icon="plus" slot="menu-actions"></calcite-action>
      </calcite-action-group>
    </calcite-action-bar>`);

    await page.waitForChanges();

    let groups = await page.findAll("calcite-action-group");

    expect(groups).toHaveLength(2);
    expect(await groups[0].getProperty("menuOpen")).toBe(false);
    expect(await groups[1].getProperty("menuOpen")).toBe(true);

    const calciteActionMenuOpenChangeEvent = page.waitForEvent("calciteActionMenuOpenChange");

    await page.$eval("calcite-action-group", (firstActionGroup: HTMLCalciteActionGroupElement) => {
      firstActionGroup.menuOpen = true;
    });

    await calciteActionMenuOpenChangeEvent;

    await page.waitForChanges();

    groups = await page.findAll("calcite-action-group");

    expect(groups).toHaveLength(2);
    expect(await groups[0].getProperty("menuOpen")).toBe(true);
    expect(await groups[1].getProperty("menuOpen")).toBe(false);
  });

  it("should honor scale of expand icon", async () => {
    const page = await newE2EPage({ html: html`<calcite-action-bar scale="l"></calcite-action-bar>` });

    const buttonGroup = await page.find(`calcite-action-bar >>> .${CSS.actionGroupBottom}`);

    const button = await buttonGroup.find("calcite-action");

    expect(await button.getProperty("scale")).toBe("l");
  });

  const dynamicGroupActionsSelector = "#dynamic-group calcite-action";
  const slottedActionsSelector = "calcite-action[slot='menu-actions']";

  describe("overflow actions", () => {
    it("should slot 'menu-actions' on sublist changes", async () => {
      const page = await newE2EPage({
        html: html`<calcite-action-bar style="height: 290px">
          <calcite-action-group id="dynamic-group"
            ><calcite-action text="Layer properties" icon="sliders-horizontal"></calcite-action>
            <calcite-action id="second-action" text="Styles" icon="shapes"></calcite-action
          ></calcite-action-group>
          <calcite-action-group>
            <calcite-action text="Save" icon="save" disabled></calcite-action>
            <calcite-action icon="layers" text="Layers"></calcite-action>
          </calcite-action-group>
          <calcite-action-group slot="bottom-actions">
            <calcite-action text="Tips" icon="lightbulb"></calcite-action>
          </calcite-action-group>
        </calcite-action-bar>`
      });
      await page.waitForTimeout(overflowActionsDebounceInMs);

      expect(await page.findAll(dynamicGroupActionsSelector)).toHaveLength(2);
      expect(await page.findAll(slottedActionsSelector)).toHaveLength(0);

      await page.$eval("calcite-action-bar", (element: HTMLCalciteActionBarElement) => {
        element.ownerDocument.getElementById("second-action").insertAdjacentHTML(
          "afterend",
          `
          <calcite-action text="Styles" icon="shapes"></calcite-action>
          <calcite-action text="Filter" icon="layer-filter"></calcite-action>
          <calcite-action text="Configure pop-ups" icon="popup"></calcite-action>
          <calcite-action text="Configure attributes" icon="feature-details"></calcite-action>
          <calcite-action text="Labels" icon="label" active></calcite-action>
          <calcite-action text="Table" icon="table"></calcite-action>`
        );
      });
      await page.waitForTimeout(overflowActionsDebounceInMs);

      expect(await page.findAll(dynamicGroupActionsSelector)).toHaveLength(8);
      expect(await page.findAll(slottedActionsSelector)).toHaveLength(7);
    });

    it("should slot 'menu-actions' on resize of component", async () => {
      const page = await newE2EPage({
        html: html`<calcite-action-bar style="height: 290px">
          <calcite-action-group id="dynamic-group"
            ><calcite-action text="Layer properties" icon="sliders-horizontal"></calcite-action>
            <calcite-action text="Styles" icon="shapes"></calcite-action>
            <calcite-action text="Styles" icon="shapes"></calcite-action>
            <calcite-action text="Filter" icon="layer-filter"></calcite-action>
            <calcite-action text="Configure pop-ups" icon="popup"></calcite-action>
            <calcite-action text="Configure attributes" icon="feature-details"></calcite-action>
            <calcite-action text="Labels" icon="label" active></calcite-action>
            <calcite-action text="Table" icon="table"></calcite-action
          ></calcite-action-group>
          <calcite-action-group>
            <calcite-action text="Save" icon="save" disabled></calcite-action>
            <calcite-action icon="layers" text="Layers"></calcite-action>
          </calcite-action-group>
          <calcite-action-group slot="bottom-actions">
            <calcite-action text="Tips" icon="lightbulb"></calcite-action>
          </calcite-action-group>
        </calcite-action-bar>`
      });
      await page.waitForTimeout(overflowActionsDebounceInMs);

      expect(await page.findAll(dynamicGroupActionsSelector)).toHaveLength(8);
      expect(await page.findAll(slottedActionsSelector)).toHaveLength(7);

      await page.$eval("calcite-action-bar", (element: HTMLCalciteActionBarElement) => {
        element.style.height = "550px";
      });
      await page.waitForTimeout(overflowActionsDebounceInMs);

      expect(await page.findAll(dynamicGroupActionsSelector)).toHaveLength(8);
      expect(await page.findAll(slottedActionsSelector)).toHaveLength(2);
    });
  });
});
