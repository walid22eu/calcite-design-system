import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  VNode,
  Watch
} from "@stencil/core";

import { Layout, Scale } from "../interfaces";

/**
 * @slot - A slot for adding `calcite-stepper-item`s.
 */
@Component({
  tag: "calcite-stepper",
  styleUrl: "stepper.scss",
  shadow: true
})
export class Stepper {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteStepperElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /** optionally display a status icon next to the step title */
  @Prop({ reflect: true }) icon = false;

  /** specify the layout of stepper, defaults to horizontal */
  @Prop({ reflect: true }) layout: Layout = "horizontal";

  /** optionally display the number next to the step title */
  @Prop({ reflect: true }) numbered = false;

  /** specify the scale of stepper, defaults to m */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** @internal */
  @Prop({ mutable: true }) requestedContent: HTMLElement[] | NodeListOf<any>;

  // watch for removal of disabled to register step
  @Watch("requestedContent") contentWatcher(): void {
    if (this.layout === "horizontal") {
      if (!this.stepperContentContainer && this.requestedContent) {
        this.addHorizontalContentContainer();
      }
      this.updateContent(this.requestedContent);
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * This event fires when the active stepper item has changed.
   * @internal
   */
  @Event() calciteStepperItemChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------
  componentDidLoad(): void {
    // if no stepper items are set as active, default to the first one
    if (!this.currentPosition) {
      this.calciteStepperItemChange.emit({
        position: 0
      });
    }
  }

  componentWillLoad() {
    if (this.layout === "horizontal" && !this.stepperContentContainer) {
      this.addHorizontalContentContainer();
    }
  }

  render(): VNode {
    return <slot />;
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteStepperItemKeyEvent") calciteStepperItemKeyEvent(e: CustomEvent): void {
    const item = e.detail.item;
    const itemToFocus = e.target;
    const isFirstItem = this.itemIndex(itemToFocus) === 0;
    const isLastItem = this.itemIndex(itemToFocus) === this.sortedItems.length - 1;
    switch (item.key) {
      case "ArrowDown":
      case "ArrowRight":
        if (isLastItem) {
          this.focusFirstItem();
        } else {
          this.focusNextItem(itemToFocus);
        }
        break;
      case "ArrowUp":
      case "ArrowLeft":
        if (isFirstItem) {
          this.focusLastItem();
        } else {
          this.focusPrevItem(itemToFocus);
        }
        break;
      case "Home":
        this.focusFirstItem();
        break;
      case "End":
        this.focusLastItem();
        break;
    }
  }

  @Listen("calciteStepperItemRegister") registerItem(event: CustomEvent): void {
    const item = {
      item: event.target as HTMLCalciteStepperItemElement,
      position: event.detail.position,
      content: event.detail.content
    };
    if (item.content && item.item.active) {
      this.requestedContent = item.content;
    }
    if (!this.items.includes(item)) {
      this.items.push(item);
    }
    this.sortedItems = this.sortItems();
  }

  @Listen("calciteStepperItemSelect") updateItem(event: CustomEvent): void {
    if (event.detail.content) {
      this.requestedContent = event.detail.content;
    }
    this.currentPosition = event.detail.position;
    this.calciteStepperItemChange.emit({
      position: this.currentPosition
    });
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** set the next step as active */
  @Method()
  async nextStep(): Promise<void> {
    this.currentPosition =
      this.currentPosition + 1 < this.items.length
        ? this.currentPosition + 1
        : this.currentPosition;
    this.emitChangedItem();
  }

  /** set the previous step as active */
  @Method()
  async prevStep(): Promise<void> {
    this.currentPosition =
      this.currentPosition - 1 >= 0 ? this.currentPosition - 1 : this.currentPosition;
    this.emitChangedItem();
  }

  /** set the requested step as active */
  @Method()
  async goToStep(num: number): Promise<void> {
    this.currentPosition = num - 1;
    this.emitChangedItem();
  }

  /** set the first step as active */
  @Method()
  async startStep(): Promise<void> {
    this.currentPosition = 0;
    this.emitChangedItem();
  }

  /** set the last step as active */
  @Method()
  async endStep(): Promise<void> {
    this.currentPosition = this.items.length - 1;
    this.emitChangedItem();
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /** created list of Stepper items */
  private items = [];

  /** sorted list of Stepper items */
  private sortedItems = [];

  /** keep track of the currently active item position */
  private currentPosition: number;

  /** the container where we place horizontal layout step content */
  private stepperContentContainer: HTMLDivElement;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private addHorizontalContentContainer(): void {
    this.stepperContentContainer = document.createElement("div") as HTMLDivElement;
    this.stepperContentContainer.classList.add("calcite-stepper-content");
    this.el.insertAdjacentElement("beforeend", this.stepperContentContainer);
  }

  private emitChangedItem(): void {
    this.calciteStepperItemChange.emit({
      position: this.currentPosition
    });
  }

  private focusFirstItem(): void {
    const firstItem = this.sortedItems[0];
    this.focusElement(firstItem);
  }

  private focusLastItem(): void {
    const lastItem = this.sortedItems[this.sortedItems.length - 1];
    this.focusElement(lastItem);
  }

  private focusNextItem(e): void {
    const index = this.itemIndex(e);
    const nextItem = this.sortedItems[index + 1] || this.sortedItems[0];
    this.focusElement(nextItem);
  }

  private focusPrevItem(e): void {
    const index = this.itemIndex(e);
    const prevItem = this.sortedItems[index - 1] || this.sortedItems[this.sortedItems.length - 1];
    this.focusElement(prevItem);
  }

  private itemIndex(e): number {
    return this.sortedItems.indexOf(e);
  }

  private focusElement(item) {
    const target = item as HTMLCalciteStepperItemElement;
    target.focus();
  }

  private sortItems() {
    const items = Array.from(this.items)
      .filter((a) => !a.item.disabled)
      .sort((a, b) => a.position - b.position)
      .map((a) => a.item);

    return [...Array.from(new Set(items))];
  }

  private updateContent(content) {
    this.stepperContentContainer.innerHTML = "";
    this.stepperContentContainer.append(...content);
  }
}
