import { Component, Prop, h, VNode, Element } from "@stencil/core";
import { CSS } from "./resources";
import { getAncestors, getDepth } from "../combobox/utils";
import { guid } from "../../utils/guid";
import { ComboboxChildElement } from "../combobox/interfaces";
import { getElementProp } from "../../utils/dom";
import { Scale } from "../interfaces";

/**
 * @slot - A slot for adding `calcite-combobox-item`s.
 */
@Component({
  tag: "calcite-combobox-item-group",
  styleUrl: "combobox-item-group.scss",
  shadow: true
})
export class ComboboxItemGroup {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /** Parent and grandparent combobox items, this is set internally for use from combobox */
  @Prop({ mutable: true }) ancestors: ComboboxChildElement[];

  /** Title of the group */
  @Prop() label!: string;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    this.ancestors = getAncestors(this.el);
    this.scale = getElementProp(this.el, "scale", this.scale);
  }

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteComboboxItemGroupElement;

  guid: string = guid();

  scale: Scale = "m";

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const { el, scale } = this;
    const indent = `${CSS.label}--indent-${getDepth(el)}`;

    return (
      <ul
        aria-labelledby={this.guid}
        class={{ [CSS.list]: true, [`scale--${scale}`]: true }}
        role="group"
      >
        <li class={{ [CSS.label]: true, [indent]: true }} id={this.guid} role="presentation">
          <span class={CSS.title}>{this.label}</span>
        </li>
        <slot />
      </ul>
    );
  }
}
