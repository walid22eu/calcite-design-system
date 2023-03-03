import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  State,
  VNode,
  Watch
} from "@stencil/core";
import {
  filterDirectChildren,
  focusElementInGroup,
  FocusElementInGroupDestination,
  getElementDir
} from "../../utils/dom";
import { createObserver } from "../../utils/observers";
import { Scale } from "../interfaces";
import { TabChangeEventDetail } from "../tab/interfaces";
import { TabID, TabLayout, TabPosition } from "../tabs/interfaces";

/**
 * @slot - A slot for adding `calcite-tab-title`s.
 */
@Component({
  tag: "calcite-tab-nav",
  styleUrl: "tab-nav.scss",
  shadow: true
})
export class TabNav {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteTabNavElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /**
   * Specifies the name when saving selected `calcite-tab` data to `localStorage`.
   */
  @Prop({ reflect: true }) storageId: string;

  /**
   * Specifies text to update multiple components to keep in sync if one changes.
   */
  @Prop({ reflect: true }) syncId: string;

  /**
   * Specifies the component's selected tab-title.
   *
   * @readonly
   */
  @Prop({ mutable: true }) selectedTitle: HTMLCalciteTabTitleElement = null;

  /**
   * @internal
   */
  @Prop({ reflect: true, mutable: true }) scale: Scale = "m";

  /**
   * @internal
   */
  @Prop({ reflect: true, mutable: true }) layout: TabLayout = "inline";

  /**
   * @internal
   */
  @Prop({ reflect: true, mutable: true }) position: TabPosition = "bottom";

  /**
   * @internal
   */
  @Prop({ reflect: true, mutable: true }) bordered = false;

  /**
   * @internal
   */
  @Prop({ mutable: true }) indicatorOffset: number;

  /**
   * @internal
   */
  @Prop({ mutable: true }) indicatorWidth: number;

  @Watch("selectedTabId")
  async selectedTabIdChanged(): Promise<void> {
    if (
      localStorage &&
      this.storageId &&
      this.selectedTabId !== undefined &&
      this.selectedTabId !== null
    ) {
      localStorage.setItem(`calcite-tab-nav-${this.storageId}`, JSON.stringify(this.selectedTabId));
    }

    this.calciteInternalTabChange.emit({
      tab: this.selectedTabId
    });

    this.selectedTitle = await this.getTabTitleById(this.selectedTabId);
  }

  @Watch("selectedTitle") selectedTitleChanged(): void {
    this.updateOffsetPosition();
    this.updateActiveWidth();
    // reset the animation time on tab selection
    this.activeIndicatorEl.style.transitionDuration = `${this.animationActiveDuration}s`;
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.parentTabsEl = this.el.closest("calcite-tabs");
    this.resizeObserver?.observe(this.el);
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
  }

  componentWillLoad(): void {
    const storageKey = `calcite-tab-nav-${this.storageId}`;
    if (localStorage && this.storageId && localStorage.getItem(storageKey)) {
      const storedTab = JSON.parse(localStorage.getItem(storageKey));
      this.selectedTabId = storedTab;
    }
  }

  componentWillRender(): void {
    const { parentTabsEl } = this;

    this.layout = parentTabsEl?.layout;
    this.position = parentTabsEl?.position;
    this.scale = parentTabsEl?.scale;
    this.bordered = parentTabsEl?.bordered;
    // fix issue with active tab-title not lining up with blue indicator
    if (this.selectedTitle) {
      this.updateOffsetPosition();
    }
  }

  componentDidRender(): void {
    // if every tab title is active select the first tab.
    if (
      this.tabTitles.length &&
      this.tabTitles.every((title) => !title.selected) &&
      !this.selectedTabId
    ) {
      this.tabTitles[0].getTabIdentifier().then((tab) => {
        this.calciteInternalTabChange.emit({
          tab
        });
      });
    }
  }

  render(): VNode {
    const dir = getElementDir(this.el);
    const width = `${this.indicatorWidth}px`;
    const offset = `${this.indicatorOffset}px`;
    const indicatorStyle = dir !== "rtl" ? { width, left: offset } : { width, right: offset };
    return (
      <Host role="tablist">
        <div
          class="tab-nav"
          onScroll={this.handleContainerScroll}
          // eslint-disable-next-line react/jsx-sort-props
          ref={(el: HTMLDivElement) => (this.tabNavEl = el)}
        >
          <div
            class="tab-nav-active-indicator-container"
            // eslint-disable-next-line react/jsx-sort-props
            ref={(el) => (this.activeIndicatorContainerEl = el)}
          >
            <div
              class="tab-nav-active-indicator"
              style={indicatorStyle}
              // eslint-disable-next-line react/jsx-sort-props
              ref={(el) => (this.activeIndicatorEl = el as HTMLElement)}
            />
          </div>
          <slot />
        </div>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteInternalTabsFocusPrevious")
  focusPreviousTabHandler(event: CustomEvent): void {
    this.handleTabFocus(event, event.target as HTMLCalciteTabTitleElement, "previous");
  }

  @Listen("calciteInternalTabsFocusNext")
  focusNextTabHandler(event: CustomEvent): void {
    this.handleTabFocus(event, event.target as HTMLCalciteTabTitleElement, "next");
  }

  @Listen("calciteInternalTabsFocusFirst")
  focusFirstTabHandler(event: CustomEvent): void {
    this.handleTabFocus(event, event.target as HTMLCalciteTabTitleElement, "first");
  }

  @Listen("calciteInternalTabsFocusLast")
  focusLastTabHandler(event: CustomEvent): void {
    this.handleTabFocus(event, event.target as HTMLCalciteTabTitleElement, "last");
  }

  @Listen("calciteInternalTabsActivate")
  internalActivateTabHandler(event: CustomEvent<TabChangeEventDetail>): void {
    this.selectedTabId = event.detail.tab
      ? event.detail.tab
      : this.getIndexOfTabTitle(event.target as HTMLCalciteTabTitleElement);
    event.stopPropagation();
    event.preventDefault();
  }

  @Listen("calciteTabsActivate") activateTabHandler(event: CustomEvent<void>): void {
    this.calciteTabChange.emit();

    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * Check for active tabs on register and update selected
   *
   * @param event
   */
  @Listen("calciteInternalTabTitleRegister")
  updateTabTitles(event: CustomEvent<TabID>): void {
    if ((event.target as HTMLCalciteTabTitleElement).selected) {
      this.selectedTabId = event.detail;
    }
  }

  @Listen("calciteInternalTabChange", { target: "body" })
  globalInternalTabChangeHandler(event: CustomEvent<TabChangeEventDetail>): void {
    if (
      this.syncId &&
      event.target !== this.el &&
      (event.target as HTMLCalciteTabNavElement).syncId === this.syncId &&
      this.selectedTabId !== event.detail.tab
    ) {
      this.selectedTabId = event.detail.tab;
    }
    event.stopPropagation();
  }

  @Listen("calciteInternalTabIconChanged")
  iconStartChangeHandler(): void {
    this.updateActiveWidth();
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Emits when the selected `calcite-tab` changes.
   */
  @Event({ cancelable: false }) calciteTabChange: EventEmitter<void>;

  /**
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalTabChange: EventEmitter<TabChangeEventDetail>;

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  @State() selectedTabId: TabID;

  parentTabsEl: HTMLCalciteTabsElement;

  tabNavEl: HTMLDivElement;

  activeIndicatorEl: HTMLElement;

  activeIndicatorContainerEl: HTMLDivElement;

  animationActiveDuration = 0.3;

  resizeObserver = createObserver("resize", () => {
    if (!this.activeIndicatorEl) {
      return;
    }

    // remove active indicator transition duration during resize to prevent wobble
    this.activeIndicatorEl.style.transitionDuration = "0s";
    this.updateActiveWidth();
    this.updateOffsetPosition();
  });

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  handleTabFocus = (
    event: CustomEvent,
    el: HTMLCalciteTabTitleElement,
    destination: FocusElementInGroupDestination
  ): void => {
    focusElementInGroup(this.enabledTabTitles, el, destination);

    event.stopPropagation();
    event.preventDefault();
  };

  handleContainerScroll = (): void => {
    // remove active indicator transition duration while container is scrolling to prevent wobble
    this.activeIndicatorEl.style.transitionDuration = "0s";
    this.updateOffsetPosition();
  };

  updateOffsetPosition(): void {
    const dir = getElementDir(this.el);
    const navWidth = this.activeIndicatorContainerEl?.offsetWidth;
    const tabLeft = this.selectedTitle?.offsetLeft;
    const tabWidth = this.selectedTitle?.offsetWidth;
    const offsetRight = navWidth - (tabLeft + tabWidth);
    this.indicatorOffset =
      dir !== "rtl" ? tabLeft - this.tabNavEl?.scrollLeft : offsetRight + this.tabNavEl?.scrollLeft;
  }

  updateActiveWidth(): void {
    this.indicatorWidth = this.selectedTitle?.offsetWidth;
  }

  getIndexOfTabTitle(el: HTMLCalciteTabTitleElement, tabTitles = this.tabTitles): number {
    // In most cases, since these indexes correlate with tab contents, we want to consider all tab titles.
    // However, when doing relative index operations, it makes sense to pass in this.enabledTabTitles as the 2nd arg.
    return tabTitles.indexOf(el);
  }

  async getTabTitleById(id: TabID): Promise<HTMLCalciteTabTitleElement | null> {
    return Promise.all(this.tabTitles.map((el) => el.getTabIdentifier())).then((ids) => {
      return this.tabTitles[ids.indexOf(id)];
    });
  }

  get tabTitles(): HTMLCalciteTabTitleElement[] {
    return filterDirectChildren<HTMLCalciteTabTitleElement>(this.el, "calcite-tab-title");
  }

  get enabledTabTitles(): HTMLCalciteTabTitleElement[] {
    return filterDirectChildren<HTMLCalciteTabTitleElement>(
      this.el,
      "calcite-tab-title:not([disabled])"
    );
  }
}
