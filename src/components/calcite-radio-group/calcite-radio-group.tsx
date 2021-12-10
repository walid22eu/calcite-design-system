import {
  Component,
  Event,
  h,
  EventEmitter,
  Listen,
  Element,
  Prop,
  Watch,
  Host,
  Build,
  Method,
  VNode
} from "@stencil/core";

import { getElementDir } from "../../utils/dom";
import { Layout, Scale, Width } from "../interfaces";
import { LabelableComponent, connectLabel, disconnectLabel } from "../../utils/label";
import { connectForm, disconnectForm, FormComponent, HiddenFormInputSlot } from "../../utils/form";
import { RadioAppearance } from "./interfaces";

/**
 * @slot - A slot for adding `calcite-radio-group-item`s.
 */
@Component({
  tag: "calcite-radio-group",
  styleUrl: "calcite-radio-group.scss",
  shadow: true
})
export class CalciteRadioGroup implements LabelableComponent, FormComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteRadioGroupElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** specify the appearance style of the radio group, defaults to solid. */
  @Prop({ reflect: true }) appearance: RadioAppearance = "solid";

  /** is the radio group disabled  */
  @Prop({ reflect: true }) disabled = false;

  /**
   * When true, makes the component required for form-submission.
   *
   * @internal
   */
  @Prop({ reflect: true }) required = false;

  /** specify the layout of the radio group, defaults to horizontal */
  @Prop({ reflect: true }) layout: Layout = "horizontal";

  /**
   * The group's name. Gets submitted with the form.
   */
  @Prop() name: string;

  /** The scale of the radio group */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** The value of the selectedItem */
  @Prop({ mutable: true }) value: string = null;

  @Watch("value")
  valueHandler(value: string): void {
    const items = this.getItems();
    items.forEach((item) => (item.checked = item.value === value));
  }

  /**
   * The group's selected item.
   */
  @Prop({ mutable: true }) selectedItem: HTMLCalciteRadioGroupItemElement;

  @Watch("selectedItem")
  protected handleSelectedItemChange<T extends HTMLCalciteRadioGroupItemElement>(
    newItem: T,
    oldItem: T
  ): void {
    this.value = newItem?.value;
    if (newItem === oldItem) {
      return;
    }
    const items = this.getItems();
    const match = Array.from(items)
      .filter((item) => item === newItem)
      .pop();

    if (match) {
      this.selectItem(match);
    } else if (items[0]) {
      items[0].tabIndex = 0;
    }
  }

  /** specify the width of the group, defaults to auto */
  @Prop({ reflect: true }) width: Extract<"auto" | "full", Width> = "auto";

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentWillLoad(): void {
    const items = this.getItems();
    const lastChecked = Array.from(items)
      .filter((item) => item.checked)
      .pop();

    if (lastChecked) {
      this.selectItem(lastChecked);
    } else if (items[0]) {
      items[0].tabIndex = 0;
    }
  }

  connectedCallback(): void {
    connectLabel(this);
    connectForm(this);
  }

  disconnectedCallback(): void {
    disconnectLabel(this);
    disconnectForm(this);
  }

  render(): VNode {
    return (
      <Host onClick={this.handleClick} role="radiogroup" tabIndex={this.disabled ? -1 : null}>
        <slot />
        <HiddenFormInputSlot component={this} />
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  protected handleClick = (event: MouseEvent): void => {
    if ((event.target as HTMLElement).localName === "calcite-radio-group-item") {
      this.selectItem(event.target as HTMLCalciteRadioGroupItemElement, true);
    }
  };

  @Listen("calciteRadioGroupItemChange")
  protected handleSelected(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.selectItem(event.target as HTMLCalciteRadioGroupItemElement);
  }

  @Listen("keydown")
  protected handleKeyDown(event: KeyboardEvent): void {
    const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " "];
    const key = event.key;
    const { el, selectedItem } = this;

    if (keys.indexOf(key) === -1) {
      return;
    }

    let adjustedKey = key;

    if (getElementDir(el) === "rtl") {
      if (key === "ArrowRight") {
        adjustedKey = "ArrowLeft";
      }
      if (key === "ArrowLeft") {
        adjustedKey = "ArrowRight";
      }
    }

    const items = this.getItems();
    let selectedIndex = -1;

    items.forEach((item, index) => {
      if (item === selectedItem) {
        selectedIndex = index;
      }
    });

    switch (adjustedKey) {
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        const previous =
          selectedIndex < 1 ? items.item(items.length - 1) : items.item(selectedIndex - 1);
        this.selectItem(previous, true);
        return;
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        const next =
          selectedIndex === -1 ? items.item(1) : items.item(selectedIndex + 1) || items.item(0);
        this.selectItem(next, true);
        return;
      case " ":
        event.preventDefault();
        this.selectItem(event.target as HTMLCalciteRadioGroupItemElement, true);
        return;
      default:
        return;
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Fired when the selected option changes, event detail is the new value */
  @Event() calciteRadioGroupChange: EventEmitter<string>;

  // --------------------------------------------------------------------------
  //
  //  Methods
  //
  // --------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    (this.selectedItem || this.getItems()[0])?.focus();
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: CalciteRadioGroup["value"];

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  onLabelClick(): void {
    this.setFocus();
  }

  private getItems(): NodeListOf<HTMLCalciteRadioGroupItemElement> {
    return this.el.querySelectorAll("calcite-radio-group-item");
  }

  private selectItem(selected: HTMLCalciteRadioGroupItemElement, emit = false): void {
    if (selected === this.selectedItem) {
      return;
    }

    const items = this.getItems();
    let match: HTMLCalciteRadioGroupItemElement = null;

    items.forEach((item) => {
      const matches = item.value === selected.value;

      if ((matches && !item.checked) || (!matches && item.checked)) {
        item.checked = matches;
      }

      item.tabIndex = matches ? 0 : -1;

      if (matches) {
        match = item;

        if (emit) {
          this.calciteRadioGroupChange.emit(match.value);
        }
      }
    });

    this.selectedItem = match;
    if (Build.isBrowser && match) {
      match.focus();
    }
  }
}
