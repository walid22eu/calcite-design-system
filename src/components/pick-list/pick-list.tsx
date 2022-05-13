import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  h,
  VNode
} from "@stencil/core";
import { ICON_TYPES } from "./resources";
import {
  ListFocusId,
  calciteListItemChangeHandler,
  calciteInternalListItemValueChangeHandler,
  cleanUpObserver,
  deselectSiblingItems,
  deselectRemovedItems,
  getItemData,
  handleFilter,
  calciteListFocusOutHandler,
  initialize,
  initializeObserver,
  mutationObserverCallback,
  selectSiblings,
  setUpItems,
  keyDownHandler,
  setFocus,
  ItemData,
  removeItem
} from "./shared-list-logic";
import List from "./shared-list-render";
import { HeadingLevel } from "../functional/Heading";
import { createObserver } from "../../utils/observers";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";

/**
 * @slot - A slot for adding `calcite-pick-list-item` elements or `calcite-pick-list-group` elements. Items are displayed as a vertical list.
 * @slot menu-actions - A slot for adding a button + menu combo for performing actions like sorting.
 */
@Component({
  tag: "calcite-pick-list",
  styleUrl: "pick-list.scss",
  shadow: true
})
export class PickList<
  ItemElement extends HTMLCalcitePickListItemElement = HTMLCalcitePickListItemElement
> implements InteractiveComponent
{
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * When true, disabled prevents interaction. This state shows items with lower opacity/grayed.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * When true, an input appears at the top of the list that can be used by end users to filter items in the list.
   */
  @Prop({ reflect: true }) filterEnabled = false;

  /**
   * Placeholder text for the filter input field.
   */
  @Prop({ reflect: true }) filterPlaceholder: string;

  /**
   * Number at which section headings should start for this component.
   */
  @Prop() headingLevel: HeadingLevel;

  /**
   * When true, content is waiting to be loaded. This state shows a busy indicator.
   */
  @Prop({ reflect: true }) loading = false;

  /**
   * Multiple works similar to standard radio buttons and checkboxes.
   * When true, a user can select multiple items at a time.
   * When false, only a single item can be selected at a time
   * and selecting a new item will deselect any other selected items.
   */
  @Prop({ reflect: true }) multiple = false;

  /**
   * When true and single-selection is enabled, the selection will change when navigating items via the keyboard.
   */
  @Prop() selectionFollowsFocus = false;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @State() selectedValues: Map<string, ItemElement> = new Map();

  @State() dataForFilter: ItemData = [];

  items: ItemElement[];

  lastSelectedItem: ItemElement = null;

  mutationObserver = createObserver("mutation", mutationObserverCallback.bind(this));

  @Element() el: HTMLCalcitePickListElement;

  emitCalciteListChange: () => void;

  filterEl: HTMLCalciteFilterElement;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    initialize.call(this);
    initializeObserver.call(this);
  }

  disconnectedCallback(): void {
    cleanUpObserver.call(this);
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Emitted when any of the item selections have changed.
   */
  @Event() calciteListChange: EventEmitter<Map<string, HTMLCalcitePickListItemElement>>;

  @Listen("calciteListItemRemove")
  calciteListItemRemoveHandler(event: CustomEvent<void>): void {
    removeItem.call(this, event);
  }

  @Listen("calciteListItemChange")
  calciteListItemChangeHandler(event: CustomEvent): void {
    calciteListItemChangeHandler.call(this, event);
  }

  @Listen("calciteInternalListItemPropsChange")
  calciteInternalListItemPropsChangeHandler(event: CustomEvent): void {
    event.stopPropagation();
    this.setUpFilter();
  }

  @Listen("calciteInternalListItemValueChange")
  calciteInternalListItemValueChangeHandler(event: CustomEvent): void {
    calciteInternalListItemValueChangeHandler.call(this, event);
    event.stopPropagation();
  }

  @Listen("focusout")
  calciteListFocusOutHandler(event: FocusEvent): void {
    calciteListFocusOutHandler.call(this, event);
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  setUpItems(): void {
    setUpItems.call(this, "calcite-pick-list-item");
  }

  setUpFilter(): void {
    if (this.filterEnabled) {
      this.dataForFilter = this.getItemData();
    }
  }

  setFilterEl = (el: HTMLCalciteFilterElement): void => {
    this.filterEl = el;
  };

  deselectRemovedItems = deselectRemovedItems.bind(this);

  deselectSiblingItems = deselectSiblingItems.bind(this);

  selectSiblings = selectSiblings.bind(this);

  handleFilter = handleFilter.bind(this);

  getItemData = getItemData.bind(this);

  keyDownHandler = keyDownHandler.bind(this);

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  /** Returns the currently selected items */
  @Method()
  async getSelectedItems(): Promise<Map<string, HTMLCalcitePickListItemElement>> {
    return this.selectedValues;
  }

  /**
   * Sets focus on the component.
   *
   * @param focusId
   */
  @Method()
  async setFocus(focusId?: ListFocusId): Promise<void> {
    return setFocus.call(this, focusId);
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  getIconType(): ICON_TYPES {
    return this.multiple ? ICON_TYPES.square : ICON_TYPES.circle;
  }

  render(): VNode {
    return <List onKeyDown={this.keyDownHandler} props={this} />;
  }
}
