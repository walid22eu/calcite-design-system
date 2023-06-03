import { Component, Element, h, Prop, VNode } from "@stencil/core";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";
import { TileSelectGroupLayout } from "./interfaces";

/**
 * @slot - A slot for adding `calcite-tile-select` elements.
 */
@Component({
  tag: "calcite-tile-select-group",
  styleUrl: "tile-select-group.scss",
  shadow: true
})
export class TileSelectGroup implements InteractiveComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteTileSelectGroupElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** When `true`, interaction is prevented and the component is displayed with lower opacity. */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Defines the layout of the component.
   *
   * Use `"horizontal"` for rows, and `"vertical"` for a single column.
   */
  @Prop({ reflect: true }) layout: TileSelectGroupLayout = "horizontal";

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  render(): VNode {
    return <slot />;
  }
}
