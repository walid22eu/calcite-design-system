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
  State,
  VNode,
  Watch,
} from "@stencil/core";

import { focusElementInGroup, slotChangeGetAssignedElements } from "../../utils/dom";
import {
  connectLocalized,
  disconnectLocalized,
  LocalizedComponent,
  NumberingSystem,
} from "../../utils/locale";
import { Layout, Scale } from "../interfaces";
import { StepperItemChangeEventDetail, StepperItemKeyEventDetail } from "./interfaces";
import { createObserver } from "../../utils/observers";
import {
  connectMessages,
  disconnectMessages,
  setUpMessages,
  T9nComponent,
  updateMessages,
} from "../../utils/t9n";
import { StepperMessages } from "./assets/stepper/t9n";

/**
 * @slot - A slot for adding `calcite-stepper-item` elements.
 */
@Component({
  tag: "calcite-stepper",
  styleUrl: "stepper.scss",
  shadow: true,
  assetsDirs: ["assets"],
})
export class Stepper implements LocalizedComponent, T9nComponent {
  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /** When `true`, displays a status icon in the `calcite-stepper-item` heading. */
  @Prop({ reflect: true }) icon = false;

  /** Defines the layout of the component. */
  @Prop({ reflect: true }) layout: Extract<"horizontal" | "vertical", Layout> = "horizontal";

  /** When `true`, displays the step number in the `calcite-stepper-item` heading. */
  @Prop({ reflect: true }) numbered = false;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale = "m";

  @Watch("icon")
  @Watch("layout")
  @Watch("numbered")
  @Watch("scale")
  handleItemPropChange(): void {
    this.updateItems();
  }

  /**
   * Made into a prop for testing purposes only
   *
   * @internal
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messages: StepperMessages;

  /**
   * Specifies the Unicode numeral system used by the component for localization.
   */
  @Prop({ reflect: true }) numberingSystem?: NumberingSystem;

  @Watch("numberingSystem")
  numberingSystemChange(): void {
    this.setStepperItemNumberingSystem();
  }

  /**
   * Specifies the component's selected item.
   *
   * @readonly
   */
  @Prop({ mutable: true }) selectedItem: HTMLCalciteStepperItemElement = null;

  /**
   * Use this property to override individual strings used by the component.
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messageOverrides: Partial<StepperMessages>;

  @Watch("messageOverrides")
  onMessagesChange(): void {
    /* wired up by t9n util */
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Fires when the active `calcite-stepper-item` changes.
   *
   */
  @Event({ cancelable: false })
  calciteStepperItemChange: EventEmitter<void>;

  /**
   * Fires when the active `calcite-stepper-item` changes.
   *
   * @internal
   */
  @Event({ cancelable: false })
  calciteInternalStepperItemChange: EventEmitter<StepperItemChangeEventDetail>;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.mutationObserver?.observe(this.el, { childList: true });
    this.updateItems();
    connectMessages(this);
    connectLocalized(this);
  }

  async componentWillLoad(): Promise<void> {
    await setUpMessages(this);
  }

  componentDidLoad(): void {
    // if no stepper items are set as active, default to the first one
    if (typeof this.currentPosition !== "number") {
      this.calciteInternalStepperItemChange.emit({
        position: this.getFirstEnabledStepperPosition(),
      });
    }
  }

  disconnectedCallback(): void {
    disconnectMessages(this);
    disconnectLocalized(this);
    this.mutationObserver?.disconnect();
  }

  render(): VNode {
    return (
      <Host aria-label={this.messages.label} role="region">
        <slot onSlotchange={this.handleDefaultSlotChange} />
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteInternalStepperItemKeyEvent")
  calciteInternalStepperItemKeyEvent(event: CustomEvent<StepperItemKeyEventDetail>): void {
    const item = event.detail.item;
    const itemToFocus = event.target as HTMLCalciteStepperItemElement;

    switch (item.key) {
      case "ArrowDown":
      case "ArrowRight":
        focusElementInGroup(this.enabledItems, itemToFocus, "next");
        break;
      case "ArrowUp":
      case "ArrowLeft":
        focusElementInGroup(this.enabledItems, itemToFocus, "previous");
        break;
      case "Home":
        focusElementInGroup(this.enabledItems, itemToFocus, "first");
        break;
      case "End":
        focusElementInGroup(this.enabledItems, itemToFocus, "last");
        break;
    }
    event.stopPropagation();
  }

  @Listen("calciteInternalStepperItemRegister")
  registerItem(event: CustomEvent): void {
    const item = event.target as HTMLCalciteStepperItemElement;
    const { content, position } = event.detail;

    this.itemMap.set(item, { position, content });
    this.items = this.sortItems();
    this.enabledItems = this.filterItems();
    event.stopPropagation();
  }

  @Listen("calciteInternalStepperItemSelect")
  updateItem(event: CustomEvent): void {
    const { position } = event.detail;

    if (typeof position === "number") {
      this.currentPosition = position;
      this.selectedItem = event.target as HTMLCalciteStepperItemElement;
    }

    this.calciteInternalStepperItemChange.emit({
      position,
    });
  }

  @Listen("calciteInternalUserRequestedStepperItemSelect")
  handleUserRequestedStepperItemSelect(): void {
    this.calciteStepperItemChange.emit();
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Set the next `calcite-stepper-item` as active. */
  @Method()
  async nextStep(): Promise<void> {
    const enabledStepIndex = this.getEnabledStepIndex(this.currentPosition + 1, "next");

    if (typeof enabledStepIndex !== "number") {
      return;
    }

    this.updateStep(enabledStepIndex);
  }

  /** Set the previous `calcite-stepper-item` as active. */
  @Method()
  async prevStep(): Promise<void> {
    const enabledStepIndex = this.getEnabledStepIndex(this.currentPosition - 1, "previous");

    if (typeof enabledStepIndex !== "number") {
      return;
    }

    this.updateStep(enabledStepIndex);
  }

  /**
   * Set a specified `calcite-stepper-item` as active.
   *
   * @param step
   */
  @Method()
  async goToStep(step: number): Promise<void> {
    const position = step - 1;

    if (this.currentPosition !== position) {
      this.updateStep(position);
    }
  }

  /** Set the first `calcite-stepper-item` as active. */
  @Method()
  async startStep(): Promise<void> {
    const enabledStepIndex = this.getEnabledStepIndex(0, "next");

    if (typeof enabledStepIndex !== "number") {
      return;
    }

    this.updateStep(enabledStepIndex);
  }

  /** Set the last `calcite-stepper-item` as active. */
  @Method()
  async endStep(): Promise<void> {
    const enabledStepIndex = this.getEnabledStepIndex(this.items.length - 1, "previous");

    if (typeof enabledStepIndex !== "number") {
      return;
    }

    this.updateStep(enabledStepIndex);
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteStepperElement;

  @State() defaultMessages: StepperMessages;

  @State() effectiveLocale = "";

  @Watch("effectiveLocale")
  effectiveLocaleChange(): void {
    updateMessages(this, this.effectiveLocale);
  }

  private itemMap = new Map<HTMLCalciteStepperItemElement, { position: number; content: Node[] }>();

  /** list of sorted Stepper items */
  private items: HTMLCalciteStepperItemElement[] = [];

  /** list of enabled Stepper items */
  private enabledItems: HTMLCalciteStepperItemElement[] = [];

  /** keep track of the currently active item position */
  private currentPosition: number;

  private mutationObserver = createObserver("mutation", () => this.updateItems());

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private updateItems(): void {
    this.el.querySelectorAll("calcite-stepper-item").forEach((item) => {
      item.icon = this.icon;
      item.numbered = this.numbered;
      item.layout = this.layout;
      item.scale = this.scale;
    });
  }

  private getEnabledStepIndex(
    startIndex: number,
    direction: "next" | "previous" = "next"
  ): number | null {
    const { items, currentPosition } = this;

    let newIndex = startIndex;

    while (items[newIndex]?.disabled) {
      newIndex = newIndex + (direction === "previous" ? -1 : 1);
    }

    return newIndex !== currentPosition && newIndex < items.length && newIndex >= 0
      ? newIndex
      : null;
  }

  private updateStep(position: number): void {
    this.currentPosition = position;
    this.calciteInternalStepperItemChange.emit({
      position,
    });
  }

  private sortItems(): HTMLCalciteStepperItemElement[] {
    const { itemMap } = this;

    return Array.from(itemMap.keys()).sort(
      (a, b) => itemMap.get(a).position - itemMap.get(b).position
    );
  }

  private filterItems(): HTMLCalciteStepperItemElement[] {
    return this.items.filter((item) => !item.disabled);
  }

  private setStepperItemNumberingSystem(): void {
    this.items.forEach((item: HTMLCalciteStepperItemElement) => {
      item.numberingSystem = this.numberingSystem;
    });
  }

  private handleDefaultSlotChange = (event: Event): void => {
    const slottedItems = slotChangeGetAssignedElements(event);
    const items = slottedItems.filter((el) => el?.tagName === "CALCITE-STEPPER-ITEM");
    const spacing = Array(items.length).fill("1fr").join(" ");
    this.el.style.gridTemplateAreas = spacing;
    this.el.style.gridTemplateColumns = spacing;
    this.setStepperItemNumberingSystem();
  };

  private getFirstEnabledStepperPosition(): number {
    const enabledStepIndex = this.items.findIndex((item) => !item.disabled);
    return enabledStepIndex > -1 ? enabledStepIndex : 0;
  }
}
