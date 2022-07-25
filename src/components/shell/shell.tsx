import { Component, Element, Prop, h, VNode, Fragment } from "@stencil/core";
import { CSS, SLOTS } from "./resources";
import { getSlotted } from "../../utils/dom";
import {
  ConditionalSlotComponent,
  connectConditionalSlotComponent,
  disconnectConditionalSlotComponent
} from "../../utils/conditionalSlot";

/**
 * @slot - A slot for adding content to the shell. This content will appear between any leading and trailing panels added to the shell. (eg. a map)
 * @slot header - A slot for adding header content. This content will be positioned at the top of the shell.
 * @slot footer - A slot for adding footer content. This content will be positioned at the bottom of the shell.
 * @slot panel-start - A slot for adding the starting `calcite-shell-panel`.
 * @slot panel-end - A slot for adding the ending `calcite-shell-panel`.
 * @slot primary-panel - [DEPRECATED] A slot for adding the leading `calcite-shell-panel`.
 * @slot contextual-panel - [DEPRECATED] A slot for adding the trailing `calcite-shell-panel`.
 * @slot center-row - A slot for adding custom content in the center row.
 */
@Component({
  tag: "calcite-shell",
  styleUrl: "shell.scss",
  shadow: true
})
export class Shell implements ConditionalSlotComponent {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * Positions the center content behind any calcite-shell-panels.
   */
  @Prop({ reflect: true }) contentBehind = false;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteShellElement;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    connectConditionalSlotComponent(this);
  }

  disconnectedCallback(): void {
    disconnectConditionalSlotComponent(this);
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  renderHeader(): VNode {
    const hasHeader = !!getSlotted(this.el, SLOTS.header);

    return hasHeader ? <slot key="header" name={SLOTS.header} /> : null;
  }

  renderContent(): VNode[] {
    const defaultSlotNode: VNode = <slot key="default-slot" />;
    const centerRowSlotNode: VNode = <slot key="center-row-slot" name={SLOTS.centerRow} />;
    const contentContainerKey = "content-container";

    const content = !!this.contentBehind
      ? [
          <div
            class={{
              [CSS.content]: true,
              [CSS.contentBehind]: true
            }}
            key={contentContainerKey}
          >
            {defaultSlotNode}
          </div>,
          centerRowSlotNode
        ]
      : [
          <div class={CSS.content} key={contentContainerKey}>
            {defaultSlotNode}
            {centerRowSlotNode}
          </div>
        ];

    return content;
  }

  renderFooter(): VNode {
    const hasFooter = !!getSlotted(this.el, SLOTS.footer);

    return hasFooter ? (
      <div class={CSS.footer} key="footer">
        <slot name={SLOTS.footer} />
      </div>
    ) : null;
  }

  renderMain(): VNode {
    const primaryPanel = getSlotted<HTMLCalciteShellPanelElement>(this.el, SLOTS.primaryPanel);

    const mainClasses = {
      [CSS.main]: true,
      [CSS.mainReversed]: primaryPanel?.position === "end"
    };

    return (
      <div class={mainClasses}>
        <slot name={SLOTS.primaryPanel} />
        <slot name={SLOTS.panelStart} />
        {this.renderContent()}
        <slot name={SLOTS.panelEnd} />
        <slot name={SLOTS.contextualPanel} />
      </div>
    );
  }

  render(): VNode {
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderMain()}
        {this.renderFooter()}
      </Fragment>
    );
  }
}
