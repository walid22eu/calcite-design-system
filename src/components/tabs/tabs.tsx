import { Component, Prop, h, Element, Listen, State, VNode, Fragment } from "@stencil/core";
import { TabLayout, TabPosition } from "./interfaces";
import { Scale } from "../interfaces";
import { SLOTS } from "./resources";

/**
 * @slot - A slot for adding `calcite-tab`s.
 * @slot tab-nav - A slot for adding a tab navigation component.
 */
@Component({
  tag: "calcite-tabs",
  styleUrl: "tabs.scss",
  shadow: true
})
export class Tabs {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteTabsElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /**
   * Align tab titles to the edge or fully justify them across the tab nav ("center")
   */
  @Prop({ reflect: true }) layout: TabLayout = "inline";

  /**
   * Display the tabs above (default) or below the tab content
   */
  @Prop({ reflect: true }) position: TabPosition = "above";

  /**
   * Specify the scale of the tabs component, defaults to m
   */
  @Prop({ reflect: true }) scale: Scale = "m";

  /**
   * Optionally enable tabs to appear like a folder-style menu when its layout is "inline"
   */
  @Prop({ reflect: true, mutable: true }) bordered = false;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    if (this.layout === "center") {
      this.bordered = false;
    }
  }

  render(): VNode {
    return (
      <Fragment>
        <slot name={SLOTS.tabNav} />
        <section>
          <slot />
        </section>
      </Fragment>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  /**
   * @param e
   * @internal
   */
  @Listen("calciteInternalTabTitleRegister")
  calciteInternalTabTitleRegister(e: CustomEvent): void {
    this.titles = [...this.titles, e.target as HTMLCalciteTabTitleElement];
    this.registryHandler();
    e.stopPropagation();
  }

  /**
   * @param e
   * @internal
   */
  @Listen("calciteTabTitleUnregister", { target: "body" })
  calciteTabTitleUnregister(e: CustomEvent): void {
    this.titles = this.titles.filter((el) => el !== e.detail);
    this.registryHandler();
    e.stopPropagation();
  }

  /**
   * @param e
   * @internal
   */
  @Listen("calciteInternalTabRegister")
  calciteInternalTabRegister(e: CustomEvent): void {
    this.tabs = [...this.tabs, e.target as HTMLCalciteTabElement];
    this.registryHandler();
    e.stopPropagation();
  }

  /**
   * @param e
   * @internal
   */
  @Listen("calciteTabUnregister", { target: "body" })
  calciteTabUnregister(e: CustomEvent): void {
    this.tabs = this.tabs.filter((el) => el !== e.detail);
    this.registryHandler();
    e.stopPropagation();
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /**
   *
   * Stores an array of ids of `<calcite-tab-titles>`s to match up ARIA
   * attributes.
   */
  @State() titles: HTMLCalciteTabTitleElement[] = [];

  /**
   *
   * Stores an array of ids of `<calcite-tab>`s to match up ARIA attributes.
   */
  @State() tabs: HTMLCalciteTabElement[] = [];

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  /**
   *
   * Matches up elements from the internal `tabs` and `titles` to automatically
   * update the ARIA attributes and link `<calcite-tab>` and
   * `<calcite-tab-title>` components.
   */
  async registryHandler(): Promise<void> {
    let tabIds;
    let titleIds;

    // determine if we are using `tab` based or `index` based tab identifiers.
    if (this.tabs.some((e) => e.tab) || this.titles.some((e) => e.tab)) {
      // if we are using `tab` based identifiers sort by `tab` to account for
      // possible out of order tabs and get the id of each tab
      tabIds = this.tabs.sort((a, b) => a.tab.localeCompare(b.tab)).map((e) => e.id);
      titleIds = this.titles.sort((a, b) => a.tab.localeCompare(b.tab)).map((e) => e.id);
    } else {
      // if we are using index based tabs then the `<calcite-tab>` and
      // `<calcite-tab-title>` might have been rendered out of order so the
      // order of `this.tabs` and `this.titles` might not reflect the DOM state,
      // and might not match each other so we need to get the index of all the
      // tabs and titles in the DOM order to match them up as a source of truth
      const tabDomIndexes = await Promise.all(this.tabs.map((el) => el.getTabIndex()));

      const titleDomIndexes = await Promise.all(this.titles.map((el) => el.getTabIndex()));

      // once we have the DOM order as a source of truth we can build the
      // matching tabIds and titleIds arrays
      tabIds = tabDomIndexes.reduce((ids, indexInDOM, registryIndex) => {
        ids[indexInDOM] = this.tabs[registryIndex].id;
        return ids;
      }, []);

      titleIds = titleDomIndexes.reduce((ids, indexInDOM, registryIndex) => {
        ids[indexInDOM] = this.titles[registryIndex].id;
        return ids;
      }, []);
    }

    // pass all our new aria information to each `<calcite-tab>` and
    // `<calcite-tab-title>` which will check if they can update their internal
    // `controlled` or `labeledBy` states and re-render if necessary
    this.tabs.forEach((el) => el.updateAriaInfo(tabIds, titleIds));
    this.titles.forEach((el) => el.updateAriaInfo(tabIds, titleIds));
  }
}
