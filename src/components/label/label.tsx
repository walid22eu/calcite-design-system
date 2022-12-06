import { Component, Element, Event, h, Prop, EventEmitter, VNode, Host } from "@stencil/core";
import { Alignment, Scale } from "../interfaces";
import { labelDisconnectedEvent, labelConnectedEvent } from "../../utils/label";
import { CSS } from "./resources";

/**
 * @slot - A slot for adding text and a component that can be labeled.
 */
@Component({
  tag: "calcite-label",
  styleUrl: "label.scss",
  shadow: true
})
export class Label {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteLabelElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** Specifies the text alignment of the component. */
  @Prop({ reflect: true }) alignment: Alignment = "start";

  /** Specifies the `id` of the component the label is bound to. Use when the component the label is bound to does not reside within the component. */
  @Prop({ reflect: true }) for: string;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** Defines the layout of the label in relation to the component. Use `"inline"` positions to wrap the label and component on the same line. */
  @Prop({ reflect: true }) layout: "inline" | "inline-space-between" | "default" = "default";

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event({ bubbles: false, cancelable: false }) calciteInternalLabelClick: EventEmitter<{
    sourceEvent: MouseEvent;
  }>;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  labelClickHandler = (event: MouseEvent): void => {
    this.calciteInternalLabelClick.emit({
      sourceEvent: event
    });
  };

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    document.dispatchEvent(new CustomEvent(labelConnectedEvent));
  }

  disconnectedCallback(): void {
    document.dispatchEvent(new CustomEvent(labelDisconnectedEvent));
  }

  render(): VNode {
    return (
      <Host onClick={this.labelClickHandler}>
        <div class={CSS.container}>
          <slot />
        </div>
      </Host>
    );
  }
}
