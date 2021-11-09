import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  Listen,
  VNode,
  Watch,
  State,
  Method
} from "@stencil/core";
import { Alignment, Width } from "../interfaces";
import { TileSelectType } from "./interfaces";
import { getElementDir } from "../../utils/dom";
import { CSS_UTILITY } from "../../utils/resources";
import { guid } from "../../utils/guid";

/**
 * @slot - A slot for adding custom content.
 */
@Component({
  tag: "calcite-tile-select",
  styleUrl: "calcite-tile-select.scss",
  shadow: true
})
export class CalciteTileSelect {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteTileSelectElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** The checked state of the tile select. */
  @Prop({ reflect: true, mutable: true }) checked = false;

  @Watch("checked")
  checkedChanged(newChecked: boolean): void {
    this.input.checked = newChecked;
  }

  /** The description text that appears beneath the heading of the tile. */
  @Prop({ reflect: true }) description?: string;

  /** The disabled state of the tile select. */
  @Prop({ reflect: true }) disabled = false;

  /** The heading text that appears between the icon and description of the tile. */
  @Prop({ reflect: true }) heading?: string;

  /** The hidden state of the tile select. */
  @Prop({ reflect: true }) hidden = false;

  /** The icon that appears at the top of the tile. */
  @Prop({ reflect: true }) icon?: string;

  /** The name of the tile select.  This name will appear in form submissions as either a radio or checkbox identifier based on the `type` property. */
  @Prop({ reflect: true }) name;

  @Watch("name")
  nameChanged(newName: string): void {
    this.input.name = newName;
  }

  /** Display an interactive radio or checkbox. */
  @Prop({ reflect: true }) inputEnabled = false;

  /** The side of the tile that the radio or checkbox appears on when inputEnabled is true. */
  @Prop({ reflect: true }) inputAlignment: Extract<"end" | "start", Alignment> = "start";

  /** The selection mode of the tile select: radio (single) or checkbox (multiple). */
  @Prop({ reflect: true }) type: TileSelectType = "radio";

  /** The value of the tile select.  This value will appear in form submissions when this tile select is checked. */
  @Prop() value?: any;

  /** specify the width of the tile, defaults to auto */
  @Prop({ reflect: true }) width: Extract<"auto" | "full", Width> = "auto";

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  private input: HTMLCalciteCheckboxElement | HTMLCalciteRadioButtonElement;

  guid = `calcite-tile-select-${guid()}`;

  //--------------------------------------------------------------------------
  //
  //  State
  //
  //--------------------------------------------------------------------------

  /** The focused state of the tile-select. */
  @State() focused = false;

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Emits a custom change event.  For checkboxes, it emits when the checkbox is checked or unchecked.  For radios it only emits when it is checked.
   */
  @Event() calciteTileSelectChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    this.input.setFocus();
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteCheckboxChange")
  checkboxChangeHandler(event: CustomEvent): void {
    const checkbox = event.target as HTMLCalciteCheckboxElement;
    if (checkbox === this.input) {
      this.checked = checkbox.checked;
    }
    event.stopPropagation();
    this.calciteTileSelectChange.emit();
  }

  @Listen("calciteInternalCheckboxFocus")
  checkboxFocusHandler(event: CustomEvent): void {
    const checkbox = event.target as HTMLCalciteCheckboxElement;
    if (checkbox === this.input) {
      this.focused = event.detail;
    }
    event.stopPropagation();
  }

  @Listen("calciteRadioButtonChange")
  radioButtonChangeHandler(event: CustomEvent): void {
    const radioButton = event.target as HTMLCalciteRadioButtonElement;
    if (radioButton === this.input) {
      this.checked = radioButton.checked;
    }
    event.stopPropagation();
    this.calciteTileSelectChange.emit();
  }

  @Listen("calciteInternalRadioButtonCheckedChange")
  radioButtonCheckedChangeHandler(event: CustomEvent): void {
    const radioButton = event.target as HTMLCalciteRadioButtonElement;
    if (radioButton === this.input) {
      this.checked = radioButton.checked;
    }
    event.stopPropagation();
  }

  @Listen("calciteInternalRadioButtonFocus")
  radioButtonFocusHandler(event: CustomEvent): void {
    const radioButton = event.target as HTMLCalciteRadioButtonElement;
    if (radioButton === this.input) {
      this.focused = radioButton.focused;
    }
    event.stopPropagation();
  }

  @Listen("click")
  click(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const targets = ["calcite-tile", "calcite-tile-select"];
    if (targets.includes(target.localName)) {
      this.input.click();
    }
  }

  @Listen("mouseenter")
  mouseenter(): void {
    if (this.input.localName === "calcite-radio-button") {
      (this.input as HTMLCalciteRadioButtonElement).hovered = true;
    }
    if (this.input.localName === "calcite-checkbox") {
      (this.input as HTMLCalciteCheckboxElement).hovered = true;
    }
  }

  @Listen("mouseleave")
  mouseleave(): void {
    if (this.input.localName === "calcite-radio-button") {
      (this.input as HTMLCalciteRadioButtonElement).hovered = false;
    }
    if (this.input.localName === "calcite-checkbox") {
      (this.input as HTMLCalciteCheckboxElement).hovered = false;
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.renderInput();
  }

  disconnectedCallback(): void {
    this.input.parentNode.removeChild(this.input);
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  private renderInput(): void {
    this.input = document.createElement(
      this.type === "radio" ? "calcite-radio-button" : "calcite-checkbox"
    );
    this.input.checked = this.checked;
    this.input.disabled = this.disabled;
    this.input.hidden = this.hidden;
    this.input.id = this.guid;
    this.input.label = this.heading || this.name || "";

    if (this.name) {
      this.input.name = this.name;
    }

    if (this.value) {
      this.input.value = this.value != null ? this.value.toString() : "";
    }

    this.el.insertAdjacentElement("beforeend", this.input);
  }

  render(): VNode {
    const dir = getElementDir(this.el);

    return (
      <div class={{ focused: this.focused, root: true, [CSS_UTILITY.rtl]: dir === "rtl" }}>
        <calcite-tile
          active={this.checked}
          description={this.description}
          embed
          heading={this.heading}
          icon={this.icon}
        />
        <slot />
      </div>
    );
  }
}
