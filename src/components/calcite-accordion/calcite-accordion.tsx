import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
} from "@stencil/core";
import { getKey } from "../../utils/key";

@Component({
  tag: "calcite-accordion",
  styleUrl: "calcite-accordion.scss",
  shadow: true,
})
export class CalciteAccordion {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /** specify the theme of accordion, defaults to light */
  @Prop({ mutable: true, reflect: true }) theme: "light" | "dark";

  /** specify the scale of accordion, defaults to m */
  @Prop({ mutable: true, reflect: true }) scale: "s" | "m" | "l" = "m";

  /** specify the appearance - default (containing border), or minimal (no containing border), defaults to default */
  @Prop({ mutable: true, reflect: true }) appearance:
    | "default"
    | "minimal"
    | "transparent" = "default";

  /** specify the placement of the icon in the header, defaults to end */
  @Prop({ mutable: true, reflect: true }) iconPosition: "start" | "end" = "end";

  /** specify the type of the icon in the header, defaults to chevron */
  @Prop({ mutable: true, reflect: true }) iconType:
    | "chevron"
    | "caret"
    | "plus-minus" = "chevron";

  /** specify the selection mode - multi (allow any number of open items), single (allow one open item),
   * or single-persist (allow and require one open item), defaults to multi */
  @Prop({ mutable: true, reflect: true }) selectionMode:
    | "multi"
    | "single"
    | "single-persist" = "multi";

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  @Event() calciteAccordionChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback() {
    // validate props
    let appearance = ["default", "minimal", "transparent"];
    if (!appearance.includes(this.appearance)) this.appearance = "default";

    let iconPosition = ["start", "end"];
    if (!iconPosition.includes(this.iconPosition)) this.iconPosition = "end";

    let iconType = ["chevron", "caret", "plus-minus"];
    if (!iconType.includes(this.iconType)) this.iconType = "chevron";

    let scale = ["s", "m", "l"];
    if (!scale.includes(this.scale)) this.scale = "m";

    let selectionMode = ["multi", "single", "single-persist"];
    if (!selectionMode.includes(this.selectionMode))
      this.selectionMode = "multi";
  }

  componentDidLoad() {
    if (!this.sorted) {
      this.items = this.sortItems(this.items);
      this.sorted = true;
    }
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteAccordionItemKeyEvent") calciteAccordionItemKeyEvent(
    e: CustomEvent
  ) {
    const item = e.detail.item;
    const parent = e.detail.parent as HTMLCalciteAccordionElement;
    if (this.el === parent) {
      const key = getKey(item.key);
      let itemToFocus = e.target;
      let isFirstItem = this.itemIndex(itemToFocus) === 0;
      let isLastItem = this.itemIndex(itemToFocus) === this.items.length - 1;
      switch (key) {
        case "ArrowDown":
          if (isLastItem) this.focusFirstItem();
          else this.focusNextItem(itemToFocus);
          break;
        case "ArrowUp":
          if (isFirstItem) this.focusLastItem();
          else this.focusPrevItem(itemToFocus);
          break;
        case "Home":
          this.focusFirstItem();
          break;
        case "End":
          this.focusLastItem();
          break;
      }
    }
  }

  @Listen("calciteAccordionItemRegister") registerCalciteAccordionItem(
    e: CustomEvent
  ) {
    const item = {
      item: e.target as HTMLCalciteAccordionItemElement,
      parent: e.detail.parent as HTMLCalciteAccordionElement,
      position: e.detail.position as Number,
    };
    if (this.el === item.parent) this.items.push(item);
  }

  @Listen("calciteAccordionItemSelect") updateActiveItemOnChange(
    event: CustomEvent
  ) {
    this.requestedAccordionItem = event.detail.requestedAccordionItem;
    this.calciteAccordionChange.emit({
      requestedAccordionItem: this.requestedAccordionItem,
    });
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /** created list of Accordion items */
  private items = [];

  /** keep track of whether the items have been sorted so we don't re-sort */
  private sorted = false;

  /** keep track of the requested item for multi mode */
  private requestedAccordionItem: HTMLCalciteAccordionItemElement;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private focusFirstItem() {
    const firstItem = this.items[0];
    this.focusElement(firstItem);
  }

  private focusLastItem() {
    const lastItem = this.items[this.items.length - 1];
    this.focusElement(lastItem);
  }

  private focusNextItem(e) {
    const index = this.itemIndex(e);
    const nextItem = this.items[index + 1] || this.items[0];
    this.focusElement(nextItem);
  }

  private focusPrevItem(e) {
    const index = this.itemIndex(e);
    const prevItem = this.items[index - 1] || this.items[this.items.length - 1];
    this.focusElement(prevItem);
  }

  private itemIndex(e) {
    return this.items.indexOf(e);
  }

  private focusElement(item) {
    const target = item as HTMLCalciteAccordionItemElement;
    target.focus();
  }

  private sortItems = (items: any[]): any[] =>
    items.sort((a, b) => a.position - b.position).map((a) => a.item);
}
