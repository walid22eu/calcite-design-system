import { Component, h, Prop, VNode, Watch, Event, EventEmitter, Fragment } from "@stencil/core";

/**
 * @slot - A slot for adding `calcite-option`s.
 */
@Component({
  tag: "calcite-option-group",
  styleUrl: "option-group.scss",
  shadow: true
})
export class OptionGroup {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /**
   * When true, it prevents selection from any of its associated options.
   */
  @Prop({
    reflect: true
  })
  disabled = false;

  /**
   * The group label. This property is required.
   */
  @Prop()
  label!: string;

  @Watch("disabled")
  @Watch("label")
  protected handlePropChange(): void {
    this.calciteInternalOptionGroupChange.emit();
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event()
  private calciteInternalOptionGroupChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  render(): VNode {
    return (
      <Fragment>
        <div>{this.label}</div>
        <slot />
      </Fragment>
    );
  }
}
