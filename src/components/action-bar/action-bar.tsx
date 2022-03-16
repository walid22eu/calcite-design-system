import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  Watch,
  h,
  VNode,
  Method
} from "@stencil/core";
import { Position, Scale } from "../interfaces";
import { ExpandToggle, toggleChildActionText } from "../functional/ExpandToggle";
import { CSS, SLOTS, TEXT } from "./resources";
import { getSlotted, focusElement } from "../../utils/dom";
import {
  getOverflowCount,
  overflowActions,
  queryActions,
  overflowActionsDebounceInMs
} from "./utils";
import { createObserver } from "../../utils/observers";
import { debounce } from "lodash-es";
import {
  connectConditionalSlotComponent,
  disconnectConditionalSlotComponent,
  ConditionalSlotComponent
} from "../../utils/conditionalSlot";

/**
 * @slot - A slot for adding `calcite-action`s that will appear at the top of the action bar.
 * @slot bottom-actions - A slot for adding `calcite-action`s that will appear at the bottom of the action bar, above the collapse/expand button.
 * @slot expand-tooltip - Used to set the tooltip for the expand toggle.
 */
@Component({
  tag: "calcite-action-bar",
  styleUrl: "action-bar.scss",
  shadow: true
})
export class ActionBar implements ConditionalSlotComponent {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * When set to true, the expand-toggling behavior will be disabled.
   */
  @Prop({ reflect: true }) expandDisabled = false;

  @Watch("expandDisabled")
  expandHandler(): void {
    this.conditionallyOverflowActions();
  }

  /**
   * Indicates whether widget is expanded.
   */
  @Prop({ reflect: true, mutable: true }) expanded = false;

  @Watch("expanded")
  expandedHandler(expanded: boolean): void {
    toggleChildActionText({ parent: this.el, expanded });
    this.calciteActionBarToggle.emit();
  }

  /**
   * Updates the label of the expand icon when the component is not expanded.
   */
  @Prop() intlExpand?: string;

  /**
   * Updates the label of the collapse icon when the component is expanded.
   */
  @Prop() intlCollapse?: string;

  /**
   * Disables automatically overflowing actions that won't fit into menus.
   */
  @Prop() overflowActionsDisabled = false;

  @Watch("overflowActionsDisabled")
  overflowDisabledHandler(overflowActionsDisabled: boolean): void {
    overflowActionsDisabled
      ? this.resizeObserver.disconnect()
      : this.resizeObserver.observe(this.el);
  }

  /**
   * Arranges the component depending on the elements 'dir' property.
   */
  @Prop({ reflect: true }) position: Position;

  /**
   * Specifies the size of the expand action.
   */
  @Prop({ reflect: true }) scale: Scale;

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Emitted when expanded has been toggled.
   */
  @Event() calciteActionBarToggle: EventEmitter;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteActionBarElement;

  mutationObserver = createObserver("mutation", () => {
    const { el, expanded } = this;
    toggleChildActionText({ parent: el, expanded });
    this.conditionallyOverflowActions();
  });

  resizeObserver = createObserver("resize", (entries) => this.resizeHandlerEntries(entries));

  expandToggleEl: HTMLCalciteActionElement;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  componentDidLoad(): void {
    this.conditionallyOverflowActions();
  }

  connectedCallback(): void {
    const { el, expanded } = this;

    toggleChildActionText({ parent: el, expanded });

    this.mutationObserver?.observe(el, { childList: true, subtree: true });

    if (!this.overflowActionsDisabled) {
      this.resizeObserver?.observe(el);
    }

    this.conditionallyOverflowActions();
    connectConditionalSlotComponent(this);
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    disconnectConditionalSlotComponent(this);
  }

  // --------------------------------------------------------------------------
  //
  //  Methods
  //
  // --------------------------------------------------------------------------

  /**
   * Overflows actions that won't fit into menus.
   * @internal
   */
  @Method()
  async overflowActions(): Promise<void> {
    this.resize(this.el.clientHeight);
  }

  /** Sets focus on the component. */
  @Method()
  async setFocus(focusId?: "expand-toggle"): Promise<void> {
    if (focusId === "expand-toggle") {
      await focusElement(this.expandToggleEl);
      return;
    }

    this.el.focus();
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  actionMenuOpenChangeHandler = (event: CustomEvent<boolean>): void => {
    if (event.detail) {
      const composedPath = event.composedPath();
      Array.from(this.el.querySelectorAll("calcite-action-group")).forEach((group) => {
        if (!composedPath.includes(group)) {
          group.menuOpen = false;
        }
      });
    }
  };

  resizeHandlerEntries = (entries: ResizeObserverEntry[]): void => {
    entries.forEach(this.resizeHandler);
  };

  resizeHandler = (entry: ResizeObserverEntry): void => {
    const { height } = entry.contentRect;
    this.resize(height);
  };

  resize = debounce((height: number): void => {
    const { el, expanded, expandDisabled } = this;

    if (!height) {
      return;
    }

    const actions = queryActions(el);
    const actionCount = expandDisabled ? actions.length : actions.length + 1;
    const actionGroups = Array.from(el.querySelectorAll("calcite-action-group"));
    const groupCount =
      getSlotted(el, SLOTS.bottomActions) || !expandDisabled
        ? actionGroups.length + 1
        : actionGroups.length;

    const overflowCount = getOverflowCount({
      actionCount,
      actionHeight: actions[0]?.clientHeight,
      height,
      groupCount
    });

    overflowActions({
      actionGroups,
      expanded,
      overflowCount
    });
  }, overflowActionsDebounceInMs);

  conditionallyOverflowActions = (): void => {
    if (!this.overflowActionsDisabled) {
      this.overflowActions();
    }
  };

  toggleExpand = (): void => {
    this.expanded = !this.expanded;
  };

  setExpandToggleRef = (el: HTMLCalciteActionElement): void => {
    this.expandToggleEl = el;
  };

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  renderBottomActionGroup(): VNode {
    const {
      expanded,
      expandDisabled,
      intlExpand,
      intlCollapse,
      el,
      position,
      toggleExpand,
      scale
    } = this;

    const tooltip = getSlotted(el, SLOTS.expandTooltip) as HTMLCalciteTooltipElement;
    const expandLabel = intlExpand || TEXT.expand;
    const collapseLabel = intlCollapse || TEXT.collapse;

    const expandToggleNode = !expandDisabled ? (
      <ExpandToggle
        el={el}
        expanded={expanded}
        intlCollapse={collapseLabel}
        intlExpand={expandLabel}
        position={position}
        ref={this.setExpandToggleRef}
        scale={scale}
        toggle={toggleExpand}
        tooltip={tooltip}
      />
    ) : null;

    return getSlotted(el, SLOTS.bottomActions) || expandToggleNode ? (
      <calcite-action-group class={CSS.actionGroupBottom} scale={scale}>
        <slot name={SLOTS.bottomActions} />
        <slot name={SLOTS.expandTooltip} />
        {expandToggleNode}
      </calcite-action-group>
    ) : null;
  }

  render(): VNode {
    return (
      <Host onCalciteActionMenuOpenChange={this.actionMenuOpenChangeHandler}>
        <slot />
        {this.renderBottomActionGroup()}
      </Host>
    );
  }
}
