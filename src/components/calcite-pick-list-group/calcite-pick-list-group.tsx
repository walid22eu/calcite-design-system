import { Component, Element, Host, Prop, h, VNode } from "@stencil/core";
import { CSS, SLOTS } from "./resources";
import { CSS_UTILITY } from "../../utils/resources";
import { HEADING_LEVEL } from "./resources";
import { getElementDir, getSlotted } from "../../utils/dom";
import { HeadingLevel, CalciteHeading } from "../functional/CalciteHeading";

/**
 * @slot - A slot for adding `calcite-pick-list-item` elements.
 */
@Component({
  tag: "calcite-pick-list-group",
  styleUrl: "./calcite-pick-list-group.scss",
  shadow: true
})
export class CalcitePickListGroup {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * The title used for all nested `calcite-pick-list` rows.
   *
   */
  @Prop({ reflect: true }) groupTitle: string;

  /**
   * Number at which section headings should start for this component.
   */
  @Prop() headingLevel: HeadingLevel = HEADING_LEVEL;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalcitePickListGroupElement;

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const { el, groupTitle, headingLevel } = this;
    const rtl = getElementDir(el) === "rtl";
    const hasParentItem = getSlotted(el, SLOTS.parentItem) !== null;
    const sectionClasses = {
      [CSS.container]: true,
      [CSS.indented]: hasParentItem,
      [CSS_UTILITY.rtl]: rtl
    };

    const title = groupTitle;

    return (
      <Host>
        {title ? (
          <CalciteHeading class={CSS.heading} level={headingLevel}>
            {title}
          </CalciteHeading>
        ) : null}
        <slot name={SLOTS.parentItem} />
        <section class={sectionClasses}>
          <slot />
        </section>
      </Host>
    );
  }
}
