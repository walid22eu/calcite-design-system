import { Component, Element, Event, EventEmitter, Host, Prop, h, VNode } from "@stencil/core";
import { Theme } from "../interfaces";
import { CSS, ICONS, SLOTS, TEXT, HEADING_LEVEL } from "./resources";
import { getSlotted } from "../../utils/dom";
import { HeadingLevel, CalciteHeading } from "../functional/CalciteHeading";

/**
 * @slot thumbnail - A slot for adding an HTML image element to the tip.
 */
@Component({
  tag: "calcite-tip",
  styleUrl: "./calcite-tip.scss",
  shadow: true
})
export class CalciteTip {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------
  /**
   * No longer displays the tip.
   */
  @Prop({ reflect: true, mutable: true }) dismissed = false;

  /**
   * Indicates whether the tip can be dismissed.
   */
  @Prop({ reflect: true }) nonDismissible = false;

  /**
   * The heading of the tip.
   */
  @Prop() heading?: string;

  /**
   * Number at which section headings should start for this component.
   */
  @Prop() headingLevel: HeadingLevel = HEADING_LEVEL;

  /**
   * The selected state of the tip if it is being used inside a `calcite-tip-manager`.
   */
  @Prop({ reflect: true }) selected?: boolean;

  /**
   * Alternate text for closing the tip.
   */
  @Prop() intlClose?: string;

  /**
   * Used to set the component's color scheme.
   */
  @Prop({ reflect: true }) theme: Theme;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteTipElement;

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Emitted when the component has been dismissed.
   */
  @Event() calciteTipDismiss: EventEmitter;

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  hideTip = (): void => {
    this.dismissed = true;

    this.calciteTipDismiss.emit();
  };

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  renderHeader(): VNode {
    const { heading, headingLevel } = this;

    return heading ? (
      <header class={CSS.header}>
        <CalciteHeading class={CSS.heading} level={headingLevel}>
          {heading}
        </CalciteHeading>
      </header>
    ) : null;
  }

  renderDismissButton(): VNode {
    const { nonDismissible, hideTip, intlClose } = this;

    const text = intlClose || TEXT.close;

    return !nonDismissible ? (
      <calcite-action
        class={CSS.close}
        icon={ICONS.close}
        onClick={hideTip}
        scale="l"
        text={text}
      />
    ) : null;
  }

  renderImageFrame(): VNode {
    const { el } = this;

    return getSlotted(el, SLOTS.thumbnail) ? (
      <div class={CSS.imageFrame}>
        <slot name={SLOTS.thumbnail} />
      </div>
    ) : null;
  }

  renderInfoNode(): VNode {
    return (
      <div class={CSS.info}>
        <slot />
      </div>
    );
  }

  renderContent(): VNode {
    return (
      <div class={CSS.content}>
        {this.renderImageFrame()}
        {this.renderInfoNode()}
      </div>
    );
  }

  render(): VNode {
    return (
      <Host>
        <article class={CSS.container}>
          {this.renderHeader()}
          {this.renderContent()}
        </article>
        {this.renderDismissButton()}
      </Host>
    );
  }
}
