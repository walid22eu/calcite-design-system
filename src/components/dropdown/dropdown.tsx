import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  VNode,
  Watch
} from "@stencil/core";
import { ItemKeyboardEvent, Selection } from "./interfaces";

import { focusElement, isPrimaryPointerButton, toAriaBoolean } from "../../utils/dom";
import {
  FloatingCSS,
  OverlayPositioning,
  FloatingUIComponent,
  connectFloatingUI,
  disconnectFloatingUI,
  EffectivePlacement,
  MenuPlacement,
  defaultMenuPlacement,
  filterComputedPlacements,
  reposition,
  updateAfterClose
} from "../../utils/floating-ui";
import { Scale } from "../interfaces";
import { SLOTS } from "./resources";
import { createObserver } from "../../utils/observers";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";
import {
  OpenCloseComponent,
  connectOpenCloseComponent,
  disconnectOpenCloseComponent
} from "../../utils/openCloseComponent";
import { guid } from "../../utils/guid";
import { RequestedItem } from "../dropdown-group/interfaces";
import { isActivationKey } from "../../utils/key";

/**
 * @slot - A slot for adding `calcite-dropdown-group` components. Every `calcite-dropdown-item` must have a parent `calcite-dropdown-group`, even if the `groupTitle` property is not set.
 * @slot dropdown-trigger - A slot for the element that triggers the `calcite-dropdown`.
 */
@Component({
  tag: "calcite-dropdown",
  styleUrl: "dropdown.scss",
  shadow: true
})
export class Dropdown implements InteractiveComponent, OpenCloseComponent, FloatingUIComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteDropdownElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /**
   * Opens or closes the dropdown
   *
   * @deprecated use open instead.
   */
  @Prop({ reflect: true, mutable: true }) active = false;

  @Watch("active")
  activeHandler(value: boolean): void {
    this.open = value;
  }

  /** When true, opens the dropdown */
  @Prop({ reflect: true, mutable: true }) open = false;

  @Watch("open")
  openHandler(value: boolean): void {
    if (!this.disabled) {
      if (value) {
        this.reposition(true);
      } else {
        updateAfterClose(this.floatingEl);
      }
      this.active = value;
      return;
    }

    if (!value) {
      updateAfterClose(this.floatingEl);
    }

    this.open = false;
  }

  /**
   allow the dropdown to remain open after a selection is made
   if the selection-mode of the selected item's containing group is "none", the dropdown will always close
   */
  @Prop({ reflect: true }) disableCloseOnSelect = false;

  /** is the dropdown disabled  */
  @Prop({ reflect: true }) disabled = false;

  @Watch("disabled")
  handleDisabledChange(value: boolean): void {
    if (!value) {
      this.open = false;
    }
  }

  /**
   * Defines the available placements that can be used when a flip occurs.
   */
  @Prop() flipPlacements?: EffectivePlacement[];

  @Watch("flipPlacements")
  flipPlacementsHandler(): void {
    this.setFilteredPlacements();
    this.reposition(true);
  }

  /**
   specify the maximum number of calcite-dropdown-items to display before showing the scroller, must be greater than 0 -
   this value does not include groupTitles passed to calcite-dropdown-group
   */
  @Prop({ reflect: true }) maxItems = 0;

  @Watch("maxItems")
  maxItemsHandler(): void {
    this.setMaxScrollerHeight();
  }

  /**
   * Determines the type of positioning to use for the overlaid content.
   *
   * Using `"absolute"` will work for most cases. The component will be positioned inside of overflowing parent containers and will affect the container's layout.
   *
   * `"fixed"` should be used to escape an overflowing parent container, or when the reference element's `position` CSS property is `"fixed"`.
   *
   */
  @Prop({ reflect: true }) overlayPositioning: OverlayPositioning = "absolute";

  @Watch("overlayPositioning")
  overlayPositioningHandler(): void {
    this.reposition(true);
  }

  /**
   * Determines where the dropdown will be positioned relative to the button.
   *
   * @default "bottom-start"
   */
  @Prop({ reflect: true }) placement: MenuPlacement = defaultMenuPlacement;

  @Watch("placement")
  placementHandler(): void {
    this.reposition(true);
  }

  /** specify the scale of dropdown, defaults to m */
  @Prop({ reflect: true }) scale: Scale = "m";

  /**
   * **read-only** The currently selected items
   *
   * @readonly
   */
  @Prop({ mutable: true }) selectedItems: HTMLCalciteDropdownItemElement[] = [];

  /** specify whether the dropdown is opened by hover or click of a trigger element */
  @Prop({ reflect: true }) type: "hover" | "click" = "click";

  /** specify the width of dropdown */
  @Prop({ reflect: true }) width?: Scale;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.mutationObserver?.observe(this.el, { childList: true, subtree: true });
    this.setFilteredPlacements();
    this.reposition(true);
    if (this.open) {
      this.openHandler(this.open);
    }
    if (this.active) {
      this.activeHandler(this.active);
    }
    connectOpenCloseComponent(this);
  }

  componentDidLoad(): void {
    this.reposition(true);
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
    disconnectFloatingUI(this, this.referenceEl, this.floatingEl);
    this.resizeObserver?.disconnect();
    disconnectOpenCloseComponent(this);
  }

  render(): VNode {
    const { open, guid } = this;
    return (
      <Host>
        <div
          class="calcite-dropdown-trigger-container"
          id={`${guid}-menubutton`}
          onClick={this.openCalciteDropdown}
          onKeyDown={this.keyDownHandler}
          ref={this.setReferenceEl}
        >
          <slot
            aria-controls={`${guid}-menu`}
            aria-expanded={toAriaBoolean(open)}
            aria-haspopup="menu"
            name={SLOTS.dropdownTrigger}
            onSlotchange={this.updateTriggers}
          />
        </div>
        <div
          aria-hidden={toAriaBoolean(!open)}
          class="calcite-dropdown-wrapper"
          ref={this.setFloatingEl}
        >
          <div
            aria-labelledby={`${guid}-menubutton`}
            class={{
              ["calcite-dropdown-content"]: true,
              [FloatingCSS.animation]: true,
              [FloatingCSS.animationActive]: open
            }}
            id={`${guid}-menu`}
            ref={this.setScrollerAndTransitionEl}
            role="menu"
          >
            <slot onSlotchange={this.updateGroups} />
          </div>
        </div>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Updates the position of the component.
   *
   * @param delayed
   */
  @Method()
  async reposition(delayed = false): Promise<void> {
    const { floatingEl, referenceEl, placement, overlayPositioning, filteredFlipPlacements } = this;

    return reposition(
      this,
      {
        floatingEl,
        referenceEl,
        overlayPositioning,
        placement,
        flipPlacements: filteredFlipPlacements,
        type: "menu"
      },
      delayed
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** fires when a dropdown item has been selected or deselected */
  @Event({ cancelable: false }) calciteDropdownSelect: EventEmitter<Selection>;

  /** Fires when the component is requested to be closed and before the closing transition begins. */
  @Event({ cancelable: false }) calciteDropdownBeforeClose: EventEmitter<void>;

  /** Fires when the component is closed and animation is complete. */
  @Event({ cancelable: false }) calciteDropdownClose: EventEmitter<void>;

  /** Fires when the component is added to the DOM but not rendered, and before the opening transition begins. */
  @Event({ cancelable: false }) calciteDropdownBeforeOpen: EventEmitter<void>;

  /** Fires when the component is open and animation is complete. */
  @Event({ cancelable: false }) calciteDropdownOpen: EventEmitter<void>;

  @Listen("pointerdown", { target: "window" })
  closeCalciteDropdownOnClick(event: PointerEvent): void {
    if (!isPrimaryPointerButton(event) || !this.open || event.composedPath().includes(this.el)) {
      return;
    }

    this.closeCalciteDropdown(false);
  }

  @Listen("calciteInternalDropdownCloseRequest")
  closeCalciteDropdownOnEvent(event: Event): void {
    this.closeCalciteDropdown();
    event.stopPropagation();
  }

  @Listen("calciteDropdownOpen", { target: "window" })
  closeCalciteDropdownOnOpenEvent(event: Event): void {
    if (event.composedPath().includes(this.el)) {
      return;
    }

    this.open = false;
  }

  @Listen("pointerenter")
  mouseEnterHandler(): void {
    if (this.type === "hover") {
      this.openCalciteDropdown();
    }
  }

  @Listen("pointerleave")
  mouseLeaveHandler(): void {
    if (this.type === "hover") {
      this.closeCalciteDropdown();
    }
  }

  @Listen("calciteInternalDropdownItemKeyEvent")
  calciteInternalDropdownItemKeyEvent(event: CustomEvent<ItemKeyboardEvent>): void {
    const { keyboardEvent } = event.detail;
    // handle edge
    const target = keyboardEvent.target as HTMLCalciteDropdownItemElement;
    const itemToFocus = target.nodeName !== "A" ? target : target.parentNode;
    const isFirstItem = this.itemIndex(itemToFocus) === 0;
    const isLastItem = this.itemIndex(itemToFocus) === this.items.length - 1;
    switch (keyboardEvent.key) {
      case "Tab":
        if (isLastItem && !keyboardEvent.shiftKey) {
          this.closeCalciteDropdown();
        } else if (isFirstItem && keyboardEvent.shiftKey) {
          this.closeCalciteDropdown();
        } else if (keyboardEvent.shiftKey) {
          this.focusPrevItem(itemToFocus);
        } else {
          this.focusNextItem(itemToFocus);
        }
        break;
      case "ArrowDown":
        this.focusNextItem(itemToFocus);
        break;
      case "ArrowUp":
        this.focusPrevItem(itemToFocus);
        break;
      case "Home":
        this.focusFirstItem();
        break;
      case "End":
        this.focusLastItem();
        break;
    }

    event.stopPropagation();
  }

  @Listen("calciteInternalDropdownItemSelect")
  handleItemSelect(event: CustomEvent<RequestedItem>): void {
    this.updateSelectedItems();
    event.stopPropagation();
    this.calciteDropdownSelect.emit({
      item: event.detail.requestedDropdownItem
    });
    if (
      !this.disableCloseOnSelect ||
      event.detail.requestedDropdownGroup.selectionMode === "none"
    ) {
      this.closeCalciteDropdown();
    }
    event.stopPropagation();
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  filteredFlipPlacements: EffectivePlacement[];

  private items: HTMLCalciteDropdownItemElement[] = [];

  private groups: HTMLCalciteDropdownGroupElement[] = [];

  /** trigger elements */
  private triggers: HTMLElement[];

  floatingEl: HTMLDivElement;

  referenceEl: HTMLDivElement;

  private scrollerEl: HTMLDivElement;

  mutationObserver = createObserver("mutation", () => this.updateItems());

  resizeObserver = createObserver("resize", (entries) => this.resizeObserverCallback(entries));

  openTransitionProp = "visibility";

  transitionEl: HTMLDivElement;

  guid = `calcite-dropdown-${guid()}`;

  defaultAssignedElements: Element[] = [];

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  slotChangeHandler = (event: Event): void => {
    this.defaultAssignedElements = (event.target as HTMLSlotElement).assignedElements({
      flatten: true
    });

    this.updateItems();
  };

  setFilteredPlacements = (): void => {
    const { el, flipPlacements } = this;

    this.filteredFlipPlacements = flipPlacements
      ? filterComputedPlacements(flipPlacements, el)
      : null;
  };

  updateTriggers = (event: Event): void => {
    this.triggers = (event.target as HTMLSlotElement).assignedElements({
      flatten: true
    }) as HTMLElement[];

    this.reposition(true);
  };

  updateItems = (): void => {
    this.items = this.groups
      .map((group) => Array.from(group?.querySelectorAll("calcite-dropdown-item")))
      .reduce((previousValue, currentValue) => [...previousValue, ...currentValue], []);

    this.updateSelectedItems();

    this.reposition(true);
  };

  updateGroups = (event: Event): void => {
    const groups = (event.target as HTMLSlotElement)
      .assignedElements({ flatten: true })
      .filter((el) => el?.matches("calcite-dropdown-group")) as HTMLCalciteDropdownGroupElement[];

    this.groups = groups;

    this.updateItems();
  };

  resizeObserverCallback = (entries: ResizeObserverEntry[]): void => {
    entries.forEach((entry) => {
      const { target } = entry;
      if (target === this.referenceEl) {
        this.setDropdownWidth();
      } else if (target === this.scrollerEl) {
        this.setMaxScrollerHeight();
      }
    });
  };

  setDropdownWidth = (): void => {
    const { referenceEl, scrollerEl } = this;
    const referenceElWidth = referenceEl?.clientWidth;

    if (!referenceElWidth || !scrollerEl) {
      return;
    }

    scrollerEl.style.minWidth = `${referenceElWidth}px`;
  };

  setMaxScrollerHeight = (): void => {
    const { scrollerEl } = this;
    if (!scrollerEl) {
      return;
    }

    this.reposition(true);
    const maxScrollerHeight = this.getMaxScrollerHeight();
    scrollerEl.style.maxHeight = maxScrollerHeight > 0 ? `${maxScrollerHeight}px` : "";
    this.reposition(true);
  };

  setScrollerAndTransitionEl = (el: HTMLDivElement): void => {
    this.resizeObserver.observe(el);
    this.scrollerEl = el;

    this.transitionEl = el;
    connectOpenCloseComponent(this);
  };

  onBeforeOpen(): void {
    this.calciteDropdownBeforeOpen.emit();
  }

  onOpen(): void {
    this.calciteDropdownOpen.emit();
  }

  onBeforeClose(): void {
    this.calciteDropdownBeforeClose.emit();
  }

  onClose(): void {
    this.calciteDropdownClose.emit();
  }

  setReferenceEl = (el: HTMLDivElement): void => {
    this.referenceEl = el;
    connectFloatingUI(this, this.referenceEl, this.floatingEl);
    this.resizeObserver.observe(el);
  };

  setFloatingEl = (el: HTMLDivElement): void => {
    this.floatingEl = el;
    connectFloatingUI(this, this.referenceEl, this.floatingEl);
  };

  private keyDownHandler = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;

    if (target !== this.referenceEl) {
      return;
    }
    const { defaultPrevented, key } = event;

    if (defaultPrevented) {
      return;
    }

    if (this.open) {
      if (key === "Escape") {
        this.closeCalciteDropdown();
        event.preventDefault();
        return;
      } else if (event.shiftKey && key === "Tab") {
        this.closeCalciteDropdown();
        event.preventDefault();
        return;
      }
    }

    if (isActivationKey(key)) {
      this.openCalciteDropdown();
      event.preventDefault();
    } else if (key === "Escape") {
      this.closeCalciteDropdown();
      event.preventDefault();
    }
  };

  private updateSelectedItems(): void {
    this.selectedItems = this.items.filter((item) => item.selected);
  }

  private getMaxScrollerHeight(): number {
    const { maxItems, items } = this;
    let itemsToProcess = 0;
    let maxScrollerHeight = 0;
    let groupHeaderHeight: number;

    this.groups.forEach((group) => {
      if (maxItems > 0 && itemsToProcess < maxItems) {
        Array.from(group.children).forEach((item: HTMLCalciteDropdownItemElement, index) => {
          if (index === 0) {
            if (isNaN(groupHeaderHeight)) {
              groupHeaderHeight = item.offsetTop;
            }

            maxScrollerHeight += groupHeaderHeight;
          }

          if (itemsToProcess < maxItems) {
            maxScrollerHeight += item.offsetHeight;
            itemsToProcess += 1;
          }
        });
      }
    });

    return items.length > maxItems ? maxScrollerHeight : 0;
  }

  private closeCalciteDropdown(focusTrigger = true) {
    this.open = false;

    if (focusTrigger) {
      focusElement(this.triggers[0]);
    }
  }

  private focusOnFirstActiveOrFirstItem = (): void => {
    this.getFocusableElement(this.items.find((item) => item.selected) || this.items[0]);
  };

  private focusFirstItem() {
    const firstItem = this.items[0];
    this.getFocusableElement(firstItem);
  }

  private focusLastItem() {
    const lastItem = this.items[this.items.length - 1];
    this.getFocusableElement(lastItem);
  }

  private focusNextItem(el): void {
    const index = this.itemIndex(el);
    const nextItem = this.items[index + 1] || this.items[0];
    this.getFocusableElement(nextItem);
  }

  private focusPrevItem(el): void {
    const index = this.itemIndex(el);
    const prevItem = this.items[index - 1] || this.items[this.items.length - 1];
    this.getFocusableElement(prevItem);
  }

  private itemIndex(el): number {
    return this.items.indexOf(el);
  }

  private getFocusableElement(item): void {
    if (!item) {
      return;
    }

    const target = item.attributes.isLink
      ? item.shadowRoot.querySelector("a")
      : (item as HTMLCalciteDropdownItemElement);

    focusElement(target);
  }

  private toggleOpenEnd = (): void => {
    this.focusOnFirstActiveOrFirstItem();
    this.el.removeEventListener("calciteDropdownOpen", this.toggleOpenEnd);
  };

  private openCalciteDropdown = () => {
    this.open = !this.open;
    if (this.open) {
      this.el.addEventListener("calciteDropdownOpen", this.toggleOpenEnd);
    }
  };
}
