import { Component, Prop, h, VNode, Host, Element, State } from "@stencil/core";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";
import { CSS } from "./resources";
import { MAX_COLUMNS } from "../list-item/resources";
import { getDepth } from "../list-item/utils";
/**
 * @slot - A slot for adding `calcite-list-item` and `calcite-list-item-group` elements.
 */
@Component({
  tag: "calcite-list-item-group",
  styleUrl: "list-item-group.scss",
  shadow: true
})
export class ListItemGroup implements InteractiveComponent {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * When `true`, interaction is prevented and the component is displayed with lower opacity.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The header text for all nested `calcite-list-item` rows.
   *
   */
  @Prop({ reflect: true }) heading: string;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    const { el } = this;
    this.visualLevel = getDepth(el, true);
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteListItemGroupElement;

  @State() visualLevel: number = null;

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const { heading, visualLevel } = this;
    return (
      <Host>
        <tr
          class={CSS.container}
          style={{ "--calcite-list-item-spacing-indent-multiplier": `${visualLevel}` }}
        >
          <td class={CSS.heading} colSpan={MAX_COLUMNS}>
            {heading}
          </td>
        </tr>
        <slot />
      </Host>
    );
  }
}
