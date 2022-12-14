import {
  Component,
  h,
  Prop,
  State,
  Listen,
  Event,
  EventEmitter,
  Element,
  VNode,
  Method,
  Watch,
  Host
} from "@stencil/core";
import { filter } from "../../utils/filter";
import { debounce } from "lodash-es";

import {
  FloatingCSS,
  OverlayPositioning,
  FloatingUIComponent,
  connectFloatingUI,
  disconnectFloatingUI,
  LogicalPlacement,
  EffectivePlacement,
  defaultMenuPlacement,
  filterComputedPlacements,
  reposition,
  updateAfterClose
} from "../../utils/floating-ui";
import { guid } from "../../utils/guid";
import { Scale } from "../interfaces";
import { ComboboxSelectionMode, ComboboxChildElement } from "./interfaces";
import { ComboboxChildSelector, ComboboxItem, ComboboxItemGroup, TEXT } from "./resources";
import { getItemAncestors, getItemChildren, hasActiveChildren } from "./utils";
import { LabelableComponent, connectLabel, disconnectLabel, getLabelText } from "../../utils/label";
import {
  afterConnectDefaultValueSet,
  connectForm,
  disconnectForm,
  FormComponent,
  HiddenFormInputSlot,
  submitForm
} from "../../utils/form";
import { createObserver } from "../../utils/observers";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";
import { isPrimaryPointerButton, toAriaBoolean } from "../../utils/dom";
import {
  OpenCloseComponent,
  connectOpenCloseComponent,
  disconnectOpenCloseComponent
} from "../../utils/openCloseComponent";
import {
  setUpLoadableComponent,
  setComponentLoaded,
  LoadableComponent,
  componentLoaded
} from "../../utils/loadable";

interface ItemData {
  label: string;
  value: string;
}

const isGroup = (el: ComboboxChildElement): el is HTMLCalciteComboboxItemGroupElement =>
  el.tagName === ComboboxItemGroup;

const itemUidPrefix = "combobox-item-";
const chipUidPrefix = "combobox-chip-";
const labelUidPrefix = "combobox-label-";
const listboxUidPrefix = "combobox-listbox-";
const inputUidPrefix = "combobox-input-";

/**
 * @slot - A slot for adding `calcite-combobox-item`s.
 */
@Component({
  tag: "calcite-combobox",
  styleUrl: "combobox.scss",
  shadow: true
})
export class Combobox
  implements
    LabelableComponent,
    FormComponent,
    InteractiveComponent,
    OpenCloseComponent,
    FloatingUIComponent,
    LoadableComponent
{
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------
  @Element() el: HTMLCalciteComboboxElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /**When `true`, displays and positions the component. */
  @Prop({ reflect: true, mutable: true }) open = false;

  @Watch("open")
  openHandler(value: boolean): void {
    if (!value) {
      updateAfterClose(this.floatingEl);
    }

    if (this.disabled) {
      this.open = false;
      return;
    }

    this.setMaxScrollerHeight();
  }

  /** When `true`, interaction is prevented and the component is displayed with lower opacity. */
  @Prop({ reflect: true }) disabled = false;

  @Watch("disabled")
  handleDisabledChange(value: boolean): void {
    if (!value) {
      this.open = false;
    }
  }

  /** Accessible name for the component. */
  @Prop() label!: string;

  /** Specifies the placeholder text for the input. */
  @Prop() placeholder: string;

  /** Specifies the placeholder icon for the input. */
  @Prop({ reflect: true }) placeholderIcon: string;

  /** Specifies the maximum number of `calcite-combobox-item`s (including nested children) to display before displaying a scrollbar. */
  @Prop({ reflect: true }) maxItems = 0;

  @Watch("maxItems")
  maxItemsHandler(): void {
    this.setMaxScrollerHeight();
  }

  /** Specifies the name of the component on form submission. */
  @Prop({ reflect: true }) name: string;

  /** When `true`, allows entry of custom values, which are not in the original set of items. */
  @Prop({ reflect: true }) allowCustomValues: boolean;

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
   * When `true`, the component must have a value in order for the form to submit.
   *
   * @internal
   */
  @Prop({ reflect: true }) required = false;

  /**
   * specify the selection mode
   * - multiple: allow any number of selected items (default)
   * - single: only one selection)
   * - ancestors: like multiple, but show ancestors of selected items as selected, only deepest children shown in chips
   */
  @Prop({ reflect: true }) selectionMode: ComboboxSelectionMode = "multi";

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** The component's value(s) from the selected `calcite-combobox-item`(s). */
  @Prop({ mutable: true }) value: string | string[] = null;

  @Watch("value")
  valueHandler(value: string | string[]): void {
    if (!this.internalValueChangeFlag) {
      const items = this.getItems();
      if (Array.isArray(value)) {
        items.forEach((item) => (item.selected = value.includes(item.value)));
      } else if (value) {
        items.forEach((item) => (item.selected = value === item.value));
      } else {
        items.forEach((item) => (item.selected = false));
      }
      this.updateItems();
    }
  }

  /**
   * Accessible name for the component's remove tag when a `calcite-combobox-item` is selected.
   *
   * @default "Remove tag"
   */
  @Prop({ reflect: false }) intlRemoveTag: string = TEXT.removeTag;

  /**
   * Defines the available placements that can be used when a flip occurs.
   */
  @Prop() flipPlacements: EffectivePlacement[];

  @Watch("flipPlacements")
  flipPlacementsHandler(): void {
    this.setFilteredPlacements();
    this.reposition(true);
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("pointerdown", { target: "document" })
  documentClickHandler(event: PointerEvent): void {
    if (!isPrimaryPointerButton(event)) {
      return;
    }

    this.setInactiveIfNotContained(event);
  }

  @Listen("calciteComboboxItemChange")
  calciteComboboxItemChangeHandler(event: CustomEvent<HTMLCalciteComboboxItemElement>): void {
    if (this.ignoreSelectedEventsFlag) {
      return;
    }

    const target = event.target as HTMLCalciteComboboxItemElement;
    const newIndex = this.visibleItems.indexOf(target);
    this.updateActiveItemIndex(newIndex);
    this.toggleSelection(target, target.selected);
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

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    await componentLoaded(this);

    this.textInput?.focus();
    this.activeChipIndex = -1;
    this.activeItemIndex = -1;
  }

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Fires when the selected item(s) changes.
   */
  @Event({ cancelable: false }) calciteComboboxChange: EventEmitter<{
    selectedItems: HTMLCalciteComboboxItemElement[];
  }>;

  /** Fires when text is added to filter the options list. */
  @Event({ cancelable: false }) calciteComboboxFilterChange: EventEmitter<{
    visibleItems: HTMLCalciteComboboxItemElement[];
    text: string;
  }>;

  /**
   * Fires when a selected item in the component is dismissed via its `calcite-chip`.
   */
  @Event({ cancelable: false }) calciteComboboxChipDismiss: EventEmitter<void>;

  /** Fires when the component is requested to be closed, and before the closing transition begins. */
  @Event({ cancelable: false }) calciteComboboxBeforeClose: EventEmitter<void>;

  /** Fires when the component is closed and animation is complete. */
  @Event({ cancelable: false }) calciteComboboxClose: EventEmitter<void>;

  /** Fires when the component is added to the DOM but not rendered, and before the opening transition begins. */
  @Event({ cancelable: false }) calciteComboboxBeforeOpen: EventEmitter<void>;

  /** Fires when the component is open and animation is complete. */
  @Event({ cancelable: false }) calciteComboboxOpen: EventEmitter<void>;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    this.internalValueChangeFlag = true;
    this.value = this.getValue();
    this.internalValueChangeFlag = false;
    this.mutationObserver?.observe(this.el, { childList: true, subtree: true });
    connectLabel(this);
    connectForm(this);
    connectOpenCloseComponent(this);
    this.setFilteredPlacements();
    this.reposition(true);
    if (this.open) {
      this.openHandler(this.open);
    }
  }

  componentWillLoad(): void {
    setUpLoadableComponent(this);
    this.updateItems();
  }

  componentDidLoad(): void {
    afterConnectDefaultValueSet(this, this.getValue());
    this.reposition(true);
    setComponentLoaded(this);
  }

  componentDidRender(): void {
    if (this.el.offsetHeight !== this.inputHeight) {
      this.reposition(true);
      this.inputHeight = this.el.offsetHeight;
    }

    updateHostInteraction(this);
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    disconnectLabel(this);
    disconnectForm(this);
    disconnectFloatingUI(this, this.referenceEl, this.floatingEl);
    disconnectOpenCloseComponent(this);
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  placement: LogicalPlacement = defaultMenuPlacement;

  filteredFlipPlacements: EffectivePlacement[];

  internalValueChangeFlag = false;

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: Combobox["value"];

  @State() items: HTMLCalciteComboboxItemElement[] = [];

  @State() groupItems: HTMLCalciteComboboxItemGroupElement[] = [];

  @State() selectedItems: HTMLCalciteComboboxItemElement[] = [];

  @Watch("selectedItems")
  selectedItemsHandler(): void {
    this.internalValueChangeFlag = true;
    this.value = this.getValue();
    this.internalValueChangeFlag = false;
  }

  @State() visibleItems: HTMLCalciteComboboxItemElement[] = [];

  @State() needsIcon: boolean;

  @State() activeItemIndex = -1;

  @State() activeChipIndex = -1;

  @State() activeDescendant = "";

  @State() text = "";

  /** when search text is cleared, reset active to  */
  @Watch("text")
  textHandler(): void {
    this.updateActiveItemIndex(-1);
  }

  textInput: HTMLInputElement = null;

  data: ItemData[];

  mutationObserver = createObserver("mutation", () => this.updateItems());

  resizeObserver = createObserver("resize", () => this.setMaxScrollerHeight());

  private guid = guid();

  private inputHeight = 0;

  private floatingEl: HTMLDivElement;

  private referenceEl: HTMLDivElement;

  private listContainerEl: HTMLDivElement;

  private ignoreSelectedEventsFlag = false;

  openTransitionProp = "opacity";

  transitionEl: HTMLDivElement;

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  setFilteredPlacements = (): void => {
    const { el, flipPlacements } = this;

    this.filteredFlipPlacements = flipPlacements
      ? filterComputedPlacements(flipPlacements, el)
      : null;
  };

  getValue = (): string | string[] => {
    const items = this.selectedItems.map((item) => item?.value?.toString());
    return items?.length ? (items.length > 1 ? items : items[0]) : "";
  };

  onLabelClick = (): void => {
    this.setFocus();
  };

  private comboboxInViewport(): boolean {
    const bounding = this.el.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  keydownHandler = (event: KeyboardEvent): void => {
    const { key } = event;

    switch (key) {
      case "Tab":
        this.activeChipIndex = -1;
        this.activeItemIndex = -1;
        if (this.allowCustomValues && this.text) {
          this.addCustomChip(this.text, true);
          event.preventDefault();
        } else if (this.open) {
          this.open = false;
          event.preventDefault();
        }
        break;
      case "ArrowLeft":
        this.previousChip();
        event.preventDefault();
        break;
      case "ArrowRight":
        this.nextChip();
        event.preventDefault();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.shiftActiveItemIndex(-1);
        if (!this.comboboxInViewport()) {
          this.el.scrollIntoView();
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        }
        this.shiftActiveItemIndex(1);
        if (!this.comboboxInViewport()) {
          this.el.scrollIntoView();
        }
        break;
      case " ":
        if (!this.textInput.value) {
          event.preventDefault();
          this.open = true;
          this.shiftActiveItemIndex(1);
        }
        break;
      case "Home":
        if (!this.open) {
          return;
        }
        event.preventDefault();
        this.updateActiveItemIndex(0);
        this.scrollToActiveItem();
        if (!this.comboboxInViewport()) {
          this.el.scrollIntoView();
        }
        break;
      case "End":
        if (!this.open) {
          return;
        }
        event.preventDefault();
        this.updateActiveItemIndex(this.visibleItems.length - 1);
        this.scrollToActiveItem();
        if (!this.comboboxInViewport()) {
          this.el.scrollIntoView();
        }
        break;
      case "Escape":
        this.open = false;
        event.preventDefault();
        break;
      case "Enter":
        if (this.activeItemIndex > -1) {
          this.toggleSelection(this.visibleItems[this.activeItemIndex]);
          event.preventDefault();
        } else if (this.activeChipIndex > -1) {
          this.removeActiveChip();
          event.preventDefault();
        } else if (this.allowCustomValues && this.text) {
          this.addCustomChip(this.text, true);
          event.preventDefault();
        } else if (!event.defaultPrevented) {
          if (submitForm(this)) {
            event.preventDefault();
          }
        }
        break;
      case "Delete":
      case "Backspace":
        if (this.activeChipIndex > -1) {
          event.preventDefault();
          this.removeActiveChip();
        } else if (!this.text && this.isMulti()) {
          event.preventDefault();
          this.removeLastChip();
        }
        break;
    }
  };

  private toggleCloseEnd = (): void => {
    this.open = false;
    this.el.removeEventListener("calciteComboboxClose", this.toggleCloseEnd);
  };

  private toggleOpenEnd = (): void => {
    this.open = false;
    this.el.removeEventListener("calciteComboboxOpen", this.toggleOpenEnd);
  };

  onBeforeOpen(): void {
    this.calciteComboboxBeforeOpen.emit();
  }

  onOpen(): void {
    this.calciteComboboxOpen.emit();
  }

  onBeforeClose(): void {
    this.calciteComboboxBeforeClose.emit();
  }

  onClose(): void {
    this.calciteComboboxClose.emit();
  }

  setMaxScrollerHeight = async (): Promise<void> => {
    const { listContainerEl, open, referenceEl } = this;

    if (!listContainerEl || !open) {
      return;
    }

    await this.reposition(true);
    const maxScrollerHeight = this.getMaxScrollerHeight();
    listContainerEl.style.maxHeight = maxScrollerHeight > 0 ? `${maxScrollerHeight}px` : "";
    listContainerEl.style.minWidth = `${referenceEl.clientWidth}px`;
    await this.reposition(true);
  };

  calciteChipCloseHandler = (comboboxItem: HTMLCalciteComboboxItemElement): void => {
    this.open = false;

    const selection = this.items.find((item) => item === comboboxItem);

    if (selection) {
      this.toggleSelection(selection, false);
    }

    this.calciteComboboxChipDismiss.emit();
  };

  clickHandler = (event: MouseEvent): void => {
    if (event.composedPath().some((node: HTMLElement) => node.tagName === "CALCITE-CHIP")) {
      return;
    }
    this.open = !this.open;
    this.updateActiveItemIndex(0);
    this.setFocus();
  };

  setInactiveIfNotContained = (event: Event): void => {
    const composedPath = event.composedPath();

    if (!this.open || composedPath.includes(this.el) || composedPath.includes(this.referenceEl)) {
      return;
    }

    if (this.allowCustomValues && this.text.trim().length) {
      this.addCustomChip(this.text);
    }

    if (this.selectionMode === "single") {
      if (this.textInput) {
        this.textInput.value = "";
      }
      this.text = "";
      this.filterItems("");
      this.updateActiveItemIndex(-1);
    }

    this.open = false;
  };

  setFloatingEl = (el: HTMLDivElement): void => {
    this.floatingEl = el;
    connectFloatingUI(this, this.referenceEl, this.floatingEl);
  };

  setContainerEl = (el: HTMLDivElement): void => {
    this.resizeObserver.observe(el);
    this.listContainerEl = el;
    this.transitionEl = el;
    connectOpenCloseComponent(this);
  };

  setReferenceEl = (el: HTMLDivElement): void => {
    this.referenceEl = el;
    connectFloatingUI(this, this.referenceEl, this.floatingEl);
  };

  private getMaxScrollerHeight(): number {
    const items = this.getCombinedItems().filter((item) => !item.hidden);

    const { maxItems } = this;

    let itemsToProcess = 0;
    let maxScrollerHeight = 0;

    if (items.length > maxItems) {
      items.forEach((item) => {
        if (itemsToProcess < maxItems && maxItems > 0) {
          const height = this.calculateSingleItemHeight(item);
          if (height > 0) {
            maxScrollerHeight += height;
            itemsToProcess++;
          }
        }
      });
    }

    return maxScrollerHeight;
  }

  private calculateSingleItemHeight(item: ComboboxChildElement): number {
    let height = item.offsetHeight;
    // if item has children items, don't count their height twice
    const children = Array.from(item.querySelectorAll<ComboboxChildElement>(ComboboxChildSelector));
    children
      .map((child) => child?.offsetHeight)
      .forEach((offsetHeight) => {
        height -= offsetHeight;
      });
    return height;
  }

  inputHandler = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value;
    this.text = value;
    this.filterItems(value);
    if (value) {
      this.activeChipIndex = -1;
    }
  };

  getCombinedItems(): ComboboxChildElement[] {
    return [...this.groupItems, ...this.items];
  }

  private filterItems = (() => {
    const find = (item: ComboboxChildElement, filteredData: ItemData[]) =>
      item &&
      filteredData.some(({ label, value }) => {
        if (isGroup(item)) {
          return value === item.label;
        }

        return (
          value === item.textLabel ||
          value === item.value ||
          label === item.textLabel ||
          label === item.value
        );
      });

    return debounce((text: string): void => {
      const filteredData = filter(this.data, text);
      const items = this.getCombinedItems();
      items.forEach((item) => {
        const hidden = !find(item, filteredData);
        item.hidden = hidden;
        const [parent, grandparent] = item.ancestors;
        if (find(parent, filteredData) || find(grandparent, filteredData)) {
          item.hidden = false;
        }
        if (!hidden) {
          item.ancestors.forEach((ancestor) => (ancestor.hidden = false));
        }
      });

      this.visibleItems = this.getVisibleItems();
      this.calciteComboboxFilterChange.emit({ visibleItems: [...this.visibleItems], text: text });
    }, 100);
  })();

  internalComboboxChangeEvent = (): void => {
    const { selectedItems } = this;
    this.calciteComboboxChange.emit({ selectedItems });
  };

  private emitComboboxChange = debounce(this.internalComboboxChangeEvent, 0);

  toggleSelection(item: HTMLCalciteComboboxItemElement, value = !item.selected): void {
    if (!item) {
      return;
    }

    if (this.isMulti()) {
      item.selected = value;
      this.updateAncestors(item);
      this.selectedItems = this.getSelectedItems();
      this.emitComboboxChange();
      this.resetText();
      this.filterItems("");
    } else {
      this.ignoreSelectedEventsFlag = true;
      this.items.forEach((el) => (el.selected = el === item ? value : false));
      this.ignoreSelectedEventsFlag = false;
      this.selectedItems = this.getSelectedItems();
      this.emitComboboxChange();
      if (this.textInput) {
        this.textInput.value = item.textLabel;
      }
      this.open = false;
      this.updateActiveItemIndex(-1);
      this.resetText();
      this.filterItems("");
    }
  }

  updateAncestors(item: HTMLCalciteComboboxItemElement): void {
    if (this.selectionMode !== "ancestors") {
      return;
    }
    const ancestors = getItemAncestors(item);
    const children = getItemChildren(item);
    if (item.selected) {
      ancestors.forEach((el) => {
        (el as HTMLCalciteComboboxItemElement).selected = true;
      });
    } else {
      children.forEach((el) => (el.selected = false));
      [...ancestors].forEach((el) => {
        if (!hasActiveChildren(el)) {
          el.selected = false;
        }
      });
    }
  }

  getVisibleItems(): HTMLCalciteComboboxItemElement[] {
    return this.items.filter((item) => !item.hidden);
  }

  getSelectedItems(): HTMLCalciteComboboxItemElement[] {
    if (!this.isMulti()) {
      const match = this.items.find(({ selected }) => selected);
      return match ? [match] : [];
    }

    return (
      this.items
        .filter(
          (item) =>
            item.selected && (this.selectionMode !== "ancestors" || !hasActiveChildren(item))
        )
        /** Preserve order of entered tags */
        .sort((a, b) => {
          const aIdx = this.selectedItems.indexOf(a);
          const bIdx = this.selectedItems.indexOf(b);
          if (aIdx > -1 && bIdx > -1) {
            return aIdx - bIdx;
          }
          return bIdx - aIdx;
        })
    );
  }

  updateItems = (): void => {
    this.items = this.getItems();
    this.groupItems = this.getGroupItems();
    this.data = this.getData();
    this.selectedItems = this.getSelectedItems();
    this.visibleItems = this.getVisibleItems();
    this.needsIcon = this.getNeedsIcon();
    if (!this.allowCustomValues) {
      this.setMaxScrollerHeight();
    }
  };

  getData(): ItemData[] {
    return this.items.map((item) => ({
      filterDisabled: item.filterDisabled,
      value: item.value,
      label: item.textLabel
    }));
  }

  getNeedsIcon(): boolean {
    return this.selectionMode === "single" && this.items.some((item) => item.icon);
  }

  resetText(): void {
    if (this.textInput) {
      this.textInput.value = "";
    }
    this.text = "";
  }

  getItems(): HTMLCalciteComboboxItemElement[] {
    const items: HTMLCalciteComboboxItemElement[] = Array.from(
      this.el.querySelectorAll(ComboboxItem)
    );
    return items.filter((item) => !item.disabled);
  }

  getGroupItems(): HTMLCalciteComboboxItemGroupElement[] {
    return Array.from(this.el.querySelectorAll(ComboboxItemGroup));
  }

  addCustomChip(value: string, focus?: boolean): void {
    const existingItem = this.items.find((el) => el.textLabel === value);
    if (existingItem) {
      this.toggleSelection(existingItem, true);
    } else {
      if (!this.isMulti()) {
        this.toggleSelection(this.selectedItems[this.selectedItems.length - 1], false);
      }
      const item = document.createElement(ComboboxItem) as HTMLCalciteComboboxItemElement;
      item.value = value;
      item.textLabel = value;
      item.selected = true;
      this.el.appendChild(item);
      this.resetText();
      if (focus) {
        this.setFocus();
      }
      this.updateItems();
      this.filterItems("");
      this.emitComboboxChange();
    }
  }

  removeActiveChip(): void {
    this.toggleSelection(this.selectedItems[this.activeChipIndex], false);
    this.setFocus();
  }

  removeLastChip(): void {
    this.toggleSelection(this.selectedItems[this.selectedItems.length - 1], false);
    this.setFocus();
  }

  previousChip(): void {
    if (this.text) {
      return;
    }
    const length = this.selectedItems.length - 1;
    const active = this.activeChipIndex;
    this.activeChipIndex = active === -1 ? length : Math.max(active - 1, 0);
    this.updateActiveItemIndex(-1);
    this.focusChip();
  }

  nextChip(): void {
    if (this.text || this.activeChipIndex === -1) {
      return;
    }
    const last = this.selectedItems.length - 1;
    const newIndex = this.activeChipIndex + 1;
    if (newIndex > last) {
      this.activeChipIndex = -1;
      this.setFocus();
    } else {
      this.activeChipIndex = newIndex;
      this.focusChip();
    }
    this.updateActiveItemIndex(-1);
  }

  focusChip(): void {
    const guid = this.selectedItems[this.activeChipIndex]?.guid;

    const chip = guid
      ? this.referenceEl.querySelector<HTMLCalciteChipElement>(`#${chipUidPrefix}${guid}`)
      : null;
    chip?.setFocus();
  }

  private scrollToActiveItem = (): void => {
    const activeItem = this.visibleItems[this.activeItemIndex];
    const height = this.calculateSingleItemHeight(activeItem);
    const { offsetHeight, scrollTop } = this.listContainerEl;
    if (offsetHeight + scrollTop < activeItem.offsetTop + height) {
      this.listContainerEl.scrollTop = activeItem.offsetTop - offsetHeight + height;
    } else if (activeItem.offsetTop < scrollTop) {
      this.listContainerEl.scrollTop = activeItem.offsetTop;
    }
  };

  shiftActiveItemIndex(delta: number): void {
    const { length } = this.visibleItems;
    const newIndex = (this.activeItemIndex + length + delta) % length;
    this.updateActiveItemIndex(newIndex);
    this.scrollToActiveItem();
  }

  updateActiveItemIndex(index: number): void {
    this.activeItemIndex = index;
    let activeDescendant: string = null;
    this.visibleItems.forEach((el, i) => {
      if (i === index) {
        el.active = true;
        activeDescendant = `${itemUidPrefix}${el.guid}`;
      } else {
        el.active = false;
      }
    });
    this.activeDescendant = activeDescendant;
    if (this.activeItemIndex > -1) {
      this.activeChipIndex = -1;
    }
  }

  isMulti(): boolean {
    return this.selectionMode !== "single";
  }

  comboboxFocusHandler = (): void => {
    this.textInput?.focus();
  };

  comboboxBlurHandler = (event: FocusEvent): void => {
    this.setInactiveIfNotContained(event);
  };

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  renderChips(): VNode[] {
    const { activeChipIndex, scale, selectionMode, intlRemoveTag } = this;
    return this.selectedItems.map((item, i) => {
      const chipClasses = {
        chip: true,
        "chip--active": activeChipIndex === i
      };
      const ancestors = [...getItemAncestors(item)].reverse();
      const pathLabel = [...ancestors, item].map((el) => el.textLabel);
      const label = selectionMode !== "ancestors" ? item.textLabel : pathLabel.join(" / ");
      return (
        <calcite-chip
          class={chipClasses}
          closable
          dismissLabel={intlRemoveTag}
          icon={item.icon}
          id={item.guid ? `${chipUidPrefix}${item.guid}` : null}
          key={item.textLabel}
          onCalciteChipClose={() => this.calciteChipCloseHandler(item)}
          scale={scale}
          title={label}
          value={item.value}
        >
          {label}
        </calcite-chip>
      );
    });
  }

  renderInput(): VNode {
    const { guid, disabled, placeholder, selectionMode, selectedItems, open } = this;
    const single = selectionMode === "single";
    const selectedItem = selectedItems[0];
    const showLabel = !open && single && !!selectedItem;
    return (
      <span
        class={{
          "input-wrap": true,
          "input-wrap--single": single
        }}
      >
        {showLabel && (
          <span
            class={{
              label: true,
              "label--icon": !!selectedItem?.icon
            }}
            key="label"
          >
            {selectedItem.textLabel}
          </span>
        )}
        <input
          aria-activedescendant={this.activeDescendant}
          aria-autocomplete="list"
          aria-controls={`${listboxUidPrefix}${guid}`}
          aria-label={getLabelText(this)}
          class={{
            input: true,
            "input--single": true,
            "input--transparent": this.activeChipIndex > -1,
            "input--hidden": showLabel,
            "input--icon": !!this.placeholderIcon
          }}
          disabled={disabled}
          id={`${inputUidPrefix}${guid}`}
          key="input"
          onBlur={this.comboboxBlurHandler}
          onFocus={this.comboboxFocusHandler}
          onInput={this.inputHandler}
          placeholder={placeholder}
          ref={(el) => (this.textInput = el as HTMLInputElement)}
          type="text"
        />
      </span>
    );
  }

  renderListBoxOptions(): VNode[] {
    return this.visibleItems.map((item) => (
      <li
        aria-selected={toAriaBoolean(item.selected)}
        id={item.guid ? `${itemUidPrefix}${item.guid}` : null}
        role="option"
        tabindex="-1"
      >
        {item.textLabel}
      </li>
    ));
  }

  renderFloatingUIContainer(): VNode {
    const { setFloatingEl, setContainerEl, open } = this;
    const classes = {
      "list-container": true,
      [FloatingCSS.animation]: true,
      [FloatingCSS.animationActive]: open
    };

    return (
      <div
        aria-hidden="true"
        class={{
          "floating-ui-container": true,
          "floating-ui-container--active": open
        }}
        ref={setFloatingEl}
      >
        <div class={classes} ref={setContainerEl}>
          <ul class={{ list: true, "list--hide": !open }}>
            <slot />
          </ul>
        </div>
      </div>
    );
  }

  renderIconStart(): VNode {
    const { selectedItems, placeholderIcon, selectionMode } = this;
    const selectedItem = selectedItems[0];
    const selectedIcon = selectedItem?.icon;
    const singleSelectionMode = selectionMode === "single";

    const iconAtStart =
      !this.open && selectedItem
        ? !!selectedIcon && singleSelectionMode
        : !!this.placeholderIcon && (!selectedItem || singleSelectionMode);

    return (
      iconAtStart && (
        <span class="icon-start">
          <calcite-icon
            class="selected-icon"
            icon={!this.open && selectedItem ? selectedIcon : placeholderIcon}
            scale="s"
          />
        </span>
      )
    );
  }

  renderIconEnd(): VNode {
    const { open } = this;
    return (
      <span class="icon-end">
        <calcite-icon icon={open ? "chevron-up" : "chevron-down"} scale="s" />
      </span>
    );
  }

  render(): VNode {
    const { guid, label, open } = this;
    const single = this.selectionMode === "single";

    return (
      <Host onClick={this.comboboxFocusHandler}>
        <div
          aria-autocomplete="list"
          aria-controls={`${listboxUidPrefix}${guid}`}
          aria-expanded={toAriaBoolean(open)}
          aria-haspopup="listbox"
          aria-labelledby={`${labelUidPrefix}${guid}`}
          aria-live="polite"
          aria-owns={`${listboxUidPrefix}${guid}`}
          class={{
            wrapper: true,
            "wrapper--single": single || !this.selectedItems.length,
            "wrapper--active": open
          }}
          onClick={this.clickHandler}
          onKeyDown={this.keydownHandler}
          ref={this.setReferenceEl}
          role="combobox"
        >
          <div class="grid-input">
            {this.renderIconStart()}
            {!single && this.renderChips()}
            <label
              class="screen-readers-only"
              htmlFor={`${inputUidPrefix}${guid}`}
              id={`${labelUidPrefix}${guid}`}
            >
              {label}
            </label>
            {this.renderInput()}
          </div>
          {this.renderIconEnd()}
        </div>
        <ul
          aria-labelledby={`${labelUidPrefix}${guid}`}
          aria-multiselectable="true"
          class="screen-readers-only"
          id={`${listboxUidPrefix}${guid}`}
          role="listbox"
          tabIndex={-1}
        >
          {this.renderListBoxOptions()}
        </ul>
        {this.renderFloatingUIContainer()}
        <HiddenFormInputSlot component={this} />
      </Host>
    );
  }
}
