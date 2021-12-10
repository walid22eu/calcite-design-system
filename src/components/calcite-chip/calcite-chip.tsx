import { Component, h, Prop, Event, EventEmitter, Element, VNode, Method } from "@stencil/core";
import { getSlotted } from "../../utils/dom";
import { guid } from "../../utils/guid";
import { CSS, TEXT, SLOTS, ICONS } from "./resources";
import { ChipColor } from "./interfaces";
import { Appearance, Scale } from "../interfaces";

/**
 * @slot - A slot for adding text.
 * @slot image - A slot for adding an image.
 */
@Component({
  tag: "calcite-chip",
  styleUrl: "calcite-chip.scss",
  shadow: true
})
export class CalciteChip {
  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /** specify the appearance style of the button, defaults to solid. */
  @Prop({ reflect: true }) appearance: Extract<"solid" | "clear", Appearance> = "solid";

  /** specify the color of the button, defaults to blue */
  @Prop({ reflect: true }) color: ChipColor = "grey";

  /** Optionally show a button the user can click to dismiss the chip */
  @Prop({ reflect: true }) dismissible = false;

  /** Aria label for the "x" button
   * @default "Close"
   */
  @Prop() dismissLabel?: string = TEXT.close;

  /** optionally pass an icon to display - accepts Calcite UI icon names  */
  @Prop({ reflect: true }) icon?: string;

  /** flip the icon in rtl */
  @Prop({ reflect: true }) iconFlipRtl = false;

  /** specify the scale of the chip, defaults to m */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** The assigned value for the chip */
  @Prop() value!: any;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteChipElement;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    this.closeButton?.focus();
  }

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /** Emitted when the dismiss button is clicked */
  @Event() calciteChipDismiss: EventEmitter;

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  closeClickHandler = (event: MouseEvent): void => {
    event.preventDefault();
    this.calciteChipDismiss.emit(this.el);
  };

  private closeButton: HTMLButtonElement;

  private guid: string = guid();

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  renderChipImage(): VNode {
    const { el } = this;
    const hasChipImage = getSlotted(el, SLOTS.image);

    return hasChipImage ? (
      <div class={CSS.chipImageContainer}>
        <slot name={SLOTS.image} />
      </div>
    ) : null;
  }

  render(): VNode {
    const iconEl = (
      <calcite-icon
        class={CSS.calciteChipIcon}
        flipRtl={this.iconFlipRtl}
        icon={this.icon}
        scale="s"
      />
    );

    const closeButton = (
      <button
        aria-describedby={this.guid}
        aria-label={this.dismissLabel}
        class={CSS.close}
        onClick={this.closeClickHandler}
        ref={(el) => (this.closeButton = el)}
      >
        <calcite-icon icon={ICONS.close} scale="s" />
      </button>
    );

    return (
      <div class="container">
        {this.renderChipImage()}
        {this.icon ? iconEl : null}
        <span class={CSS.title} id={this.guid}>
          <slot />
        </span>
        {this.dismissible ? closeButton : null}
      </div>
    );
  }
}
