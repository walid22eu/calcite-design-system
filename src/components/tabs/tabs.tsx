import { Component, Prop, h, Element, Listen, State, VNode, Fragment } from "@stencil/core";
import { TabLayout, TabPosition } from "./interfaces";
import { Scale } from "../interfaces";
import { SLOTS } from "./resources";

/**
 * @slot - A slot for adding `calcite-tab`s.
 * @slot title-group - A slot for adding a `calcite-tab-nav`.
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
   * Specifies the layout of the `calcite-tab-nav`, justifying the `calcite-tab-title`s to the start (`"inline"`), or across and centered (`"center"`).
   */
  @Prop({ reflect: true }) layout: TabLayout = "inline";

  /**
   * Specifies the position of the component in relation to the `calcite-tab`s.
   */
  @Prop({ reflect: true }) position: TabPosition = "top";

  /**
   * Specifies the size of the component.
   */
  @Prop({ reflect: true }) scale: Scale = "m";

  /**
   * When `true`, the component will display with a folder style menu.
   */
  @Prop({ reflect: true, mutable: true }) bordered = false;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  render(): VNode {
    return (
      <Fragment>
        <slot name={SLOTS.titleGroup} />
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
   * @param event
   * @internal
   */
  @Listen("calciteInternalTabTitleRegister")
  calciteInternalTabTitleRegister(event: CustomEvent): void {
    this.titles = [...this.titles, event.target as HTMLCalciteTabTitleElement];
    this.registryHandler();
    event.stopPropagation();
  }

  /**
   * @param event
   * @internal
   */
  @Listen("calciteTabTitleUnregister", { target: "body" })
  calciteTabTitleUnregister(event: CustomEvent): void {
    this.titles = this.titles.filter((el) => el !== event.detail);
    this.registryHandler();
    event.stopPropagation();
  }

  /**
   * @param event
   * @internal
   */
  @Listen("calciteInternalTabRegister")
  calciteInternalTabRegister(event: CustomEvent): void {
    this.tabs = [...this.tabs, event.target as HTMLCalciteTabElement];
    this.registryHandler();
    event.stopPropagation();
  }

  /**
   * @param event
   * @internal
   */
  @Listen("calciteTabUnregister", { target: "body" })
  calciteTabUnregister(event: CustomEvent): void {
    this.tabs = this.tabs.filter((el) => el !== event.detail);
    this.registryHandler();
    event.stopPropagation();
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
    if (this.tabs.some((el) => el.tab) || this.titles.some((el) => el.tab)) {
      // if we are using `tab` based identifiers sort by `tab` to account for
      // possible out of order tabs and get the id of each tab
      tabIds = this.tabs.sort((a, b) => a.tab.localeCompare(b.tab)).map((el) => el.id);
      titleIds = this.titles.sort((a, b) => a.tab.localeCompare(b.tab)).map((el) => el.id);
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
