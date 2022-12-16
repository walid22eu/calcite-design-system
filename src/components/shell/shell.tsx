import { Component, Element, Prop, h, VNode, Fragment, State } from "@stencil/core";
import { CSS, SLOTS } from "./resources";
import { slotChangeGetAssignedElements, slotChangeHasAssignedElement } from "../../utils/dom";
import {
  ConditionalSlotComponent,
  connectConditionalSlotComponent,
  disconnectConditionalSlotComponent
} from "../../utils/conditionalSlot";

/**
 * @slot - A slot for adding content to the component. This content will appear between any leading and trailing panels added to the component, such as a map.
 * @slot header - A slot for adding header content. This content will be positioned at the top of the component.
 * @slot footer - A slot for adding footer content. This content will be positioned at the bottom of the component.
 * @slot panel-start - A slot for adding the starting `calcite-shell-panel`.
 * @slot panel-end - A slot for adding the ending `calcite-shell-panel`.
 * @slot center-row - A slot for adding content to the center row.
 * @slot modal - A slot for adding `calcite-modal` components. When placed in this slot, the modal position will be constrained to the extent of the shell.
 * @slot alerts - A slot for adding `calcite-alert` components. When placed in this slot, the alert position will be constrained to the extent of the shell.
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
   * Positions the center content behind any `calcite-shell-panel`s.
   */
  @Prop({ reflect: true }) contentBehind = false;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteShellElement;

  @State() hasHeader = false;

  @State() hasFooter = false;

  @State() hasAlerts = false;

  @State() hasModals = false;

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
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  handleHeaderSlotChange = (event: Event): void => {
    this.hasHeader = !!slotChangeHasAssignedElement(event);
  };

  handleFooterSlotChange = (event: Event): void => {
    this.hasFooter = !!slotChangeHasAssignedElement(event);
  };

  handleAlertsSlotChange = (event: Event): void => {
    this.hasAlerts = !!slotChangeHasAssignedElement(event);
    slotChangeGetAssignedElements(event)?.map((el) => {
      if (el.nodeName === "CALCITE-ALERT") {
        (el as HTMLCalciteAlertElement).slottedInShell = true;
      }
    });
  };

  handleModalsSlotChange = (event: Event): void => {
    this.hasModals = !!slotChangeHasAssignedElement(event);
    slotChangeGetAssignedElements(event)?.map((el) => {
      if (el.nodeName === "CALCITE-MODAL") {
        (el as HTMLCalciteModalElement).slottedInShell = true;
      }
    });
  };

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  renderHeader(): VNode {
    return (
      <div hidden={!this.hasHeader}>
        <slot key="header" name={SLOTS.header} onSlotchange={this.handleHeaderSlotChange} />
      </div>
    );
  }

  renderFooter(): VNode {
    return (
      <div class={CSS.footer} hidden={!this.hasFooter} key="footer">
        <slot name={SLOTS.footer} onSlotchange={this.handleFooterSlotChange} />
      </div>
    );
  }

  renderAlerts(): VNode {
    return (
      <div hidden={!this.hasAlerts}>
        <slot key="alerts" name={SLOTS.alerts} onSlotchange={this.handleAlertsSlotChange} />
      </div>
    );
  }

  renderModals(): VNode {
    return (
      <div hidden={!this.hasModals}>
        <slot key="modals" name={SLOTS.modals} onSlotchange={this.handleModalsSlotChange} />
      </div>
    );
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

  renderMain(): VNode {
    return (
      <div class={CSS.main}>
        <slot name={SLOTS.panelStart} />
        {this.renderContent()}
        <slot name={SLOTS.panelEnd} />
      </div>
    );
  }

  renderPositionedSlots(): VNode {
    return (
      <div class={CSS.positionedSlotWrapper}>
        {this.renderAlerts()}
        {this.renderModals()}
      </div>
    );
  }

  render(): VNode {
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderMain()}
        {this.renderFooter()}
        {this.renderPositionedSlots()}
      </Fragment>
    );
  }
}
