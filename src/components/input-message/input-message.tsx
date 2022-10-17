import { Component, Element, Host, h, Prop, VNode, Watch } from "@stencil/core";
import { getElementProp, setRequestedIcon } from "../../utils/dom";
import { Scale, Status } from "../interfaces";
import { StatusIconDefaults } from "./interfaces";

/**
 * @slot - A slot for adding text.
 */
@Component({
  tag: "calcite-input-message",
  styleUrl: "input-message.scss",
  shadow: true
})
export class InputMessage {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteInputMessageElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** When `true`, the component is active. */
  @Prop({ reflect: true }) active = false;

  /** Specifies an icon to display. */
  @Prop({ reflect: true }) icon: boolean | string;

  /** Specifies the size of the component. */
  @Prop({ reflect: true, mutable: true }) scale: Scale = "m";

  /** Specifies the status of the input field, which determines message and icons. */
  @Prop({ reflect: true, mutable: true }) status: Status = "idle";

  /**
   * Specifies the appearance of a slotted message - `"default"` (displayed under the component), or `"floating"` (positioned absolutely under the component).
   *
   * @deprecated The `"floating"` type is no longer supported.
   */
  @Prop({ reflect: true }) type: "default";

  @Watch("status")
  @Watch("icon")
  handleIconEl(): void {
    this.requestedIcon = setRequestedIcon(StatusIconDefaults, this.icon, this.status);
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.status = getElementProp(this.el, "status", this.status);
    this.scale = getElementProp(this.el, "scale", this.scale);
    this.requestedIcon = setRequestedIcon(StatusIconDefaults, this.icon, this.status);
  }

  render(): VNode {
    const hidden = !this.active;
    return (
      <Host calcite-hydrated-hidden={hidden}>
        {this.renderIcon(this.requestedIcon)}
        <slot />
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /** the computed icon to render */
  private requestedIcon?: string;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private renderIcon(iconName: string): VNode {
    if (iconName) {
      return <calcite-icon class="calcite-input-message-icon" icon={iconName} scale="s" />;
    }
  }
}
