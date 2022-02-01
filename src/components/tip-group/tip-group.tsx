import { Component, Prop, h, VNode } from "@stencil/core";

/**
 * @slot - A slot for adding `calcite-tip`s.
 */
@Component({
  tag: "calcite-tip-group",
  styleUrl: "tip-group.scss",
  shadow: true
})
export class TipGroup {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * The title used for all nested tips.
   *
   */
  @Prop() groupTitle?: string;

  render(): VNode {
    return <slot />;
  }
}
