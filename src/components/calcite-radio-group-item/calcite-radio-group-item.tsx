import {
  Component,
  h,
  Prop,
  Element,
  Event,
  EventEmitter,
  Host,
  Watch,
  VNode
} from "@stencil/core";
import { getElementProp } from "../../utils/dom";
import { RadioAppearance } from "../calcite-radio-group/interfaces";
import { Position, Layout, Scale } from "../interfaces";
import { SLOTS, CSS } from "./resources";
import { createObserver } from "../../utils/observers";

@Component({
  tag: "calcite-radio-group-item",
  styleUrl: "calcite-radio-group-item.scss",
  shadow: true
})
export class CalciteRadioGroupItem {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element()
  el: HTMLCalciteRadioGroupItemElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** Indicates whether the control is checked. */
  @Prop({ reflect: true, mutable: true }) checked = false;

  @Watch("checked")
  protected handleCheckedChange(): void {
    this.calciteRadioGroupItemChange.emit();
    this.syncToExternalInput();
  }

  /** optionally pass an icon to display - accepts Calcite UI icon names  */
  @Prop({ reflect: true }) icon?: string;

  /** flip the icon in rtl */
  @Prop({ reflect: true }) iconFlipRtl = false;

  /** optionally used with icon, select where to position the icon */
  @Prop({ reflect: true }) iconPosition?: Position = "start";

  /**
   * The control's value.
   */
  @Prop({ mutable: true })
  value: any | null;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    const inputProxy: HTMLInputElement = this.el.querySelector(`input[slot=${SLOTS.input}]`);

    if (inputProxy) {
      this.value = inputProxy.value;
      this.checked = inputProxy.checked;
      this.mutationObserver?.observe(inputProxy, { attributes: true });
    }

    this.inputProxy = inputProxy;
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
  }

  render(): VNode {
    const { checked, value } = this;
    const scale: Scale = getElementProp(this.el, "scale", "m");
    const appearance: RadioAppearance = getElementProp(this.el, "appearance", "solid");
    const layout: Layout = getElementProp(this.el, "layout", "horizontal");

    const iconEl = (
      <calcite-icon
        class={CSS.radioGroupItemIcon}
        flipRtl={this.iconFlipRtl}
        icon={this.icon}
        scale="s"
      />
    );

    return (
      <Host aria-checked={checked.toString()} role="radio">
        <label
          class={{
            "label--scale-s": scale === "s",
            "label--scale-m": scale === "m",
            "label--scale-l": scale === "l",
            "label--horizontal": layout === "horizontal",
            "label--outline": appearance === "outline"
          }}
        >
          {this.icon && this.iconPosition === "start" ? iconEl : null}
          <slot>{value}</slot>
          <slot name={SLOTS.input} />
          {this.icon && this.iconPosition === "end" ? iconEl : null}
        </label>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Fires when the item has been selected.
   * @internal
   */
  @Event()
  calciteRadioGroupItemChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------
  private inputProxy: HTMLInputElement;

  private mutationObserver = createObserver("mutation", () => this.syncFromExternalInput());

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private syncFromExternalInput(): void {
    if (this.inputProxy) {
      this.value = this.inputProxy.value;
      this.checked = this.inputProxy.checked;
    }
  }

  private syncToExternalInput(): void {
    if (!this.inputProxy) {
      return;
    }

    this.inputProxy.value = this.value;
    if (this.checked) {
      this.inputProxy.setAttribute("checked", "");
    } else {
      this.inputProxy.removeAttribute("checked");
    }
  }
}
