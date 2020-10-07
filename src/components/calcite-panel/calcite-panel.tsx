import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  Watch,
  h
} from "@stencil/core";
import { CSS, ICONS, SLOTS, TEXT } from "./resources";
import { focusElement, getElementDir, getSlotted } from "../../utils/dom";
import { CSS_UTILITY } from "../../utils/resources";
import { VNode } from "@stencil/core/internal";
import { CalciteScale, CalciteTheme } from "../interfaces";
import { getRoundRobinIndex } from "../../utils/array";

const SUPPORTED_ARROW_KEYS = ["ArrowUp", "ArrowDown"];

/**
 * @slot header-actions-start - a slot for adding actions or content to the start side of the panel header.
 * @slot header-actions-end - a slot for adding actions or content to the end side of the panel header.
 * @slot header-content - a slot for adding custom content to the header.
 * @slot header-menu-actions - a slot for adding an overflow menu with actions inside a dropdown.
 * @slot fab - a slot for adding a `calcite-fab` (floating action button) to perform an action.
 * @slot footer-actions - a slot for adding buttons to the footer.
 * @slot footer - a slot for adding custom content to the footer.
 */
@Component({
  tag: "calcite-panel",
  styleUrl: "calcite-panel.scss",
  shadow: true
})
export class CalcitePanel {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * Hides the panel.
   */
  @Prop({ mutable: true, reflect: true }) dismissed = false;

  @Watch("dismissed")
  dismissedHandler(): void {
    this.calcitePanelDismissedChange.emit();
  }

  /**
   * When provided, this method will be called before it is removed from the parent flow.
   */
  @Prop() beforeBack?: () => Promise<void>;

  /**
   * When true, disabled prevents interaction. This state shows items with lower opacity/grayed.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Displays a close button in the trailing side of the header.
   */
  @Prop({ reflect: true }) dismissible = false;

  /**
   * Shows a back button in the header.
   */
  @Prop({ reflect: true }) showBackButton = false;

  /**
   * 'Back' text string.
   */
  @Prop() intlBack?: string;

  /**
   * 'Open' text string for the menu.
   */
  @Prop() intlOpen?: string;

  /**
   * Specifies the maxiumum height of the panel.
   */
  @Prop({ reflect: true }) heightScale: CalciteScale;

  /**
   * This sets width and max-width of the content area.
   */
  @Prop({ reflect: true }) widthScale: CalciteScale;

  /**
   * When true, content is waiting to be loaded. This state shows a busy indicator.
   */
  @Prop({ reflect: true }) loading = false;

  /**
   * 'Close' text string for the close button. The close button will only be shown when 'dismissible' is true.
   */
  @Prop() intlClose?: string;

  /**
   * Used to set the component's color scheme.
   */

  @Prop({ reflect: true }) theme: CalciteTheme;

  /**
   * Heading text.
   */
  @Prop() heading?: string;

  /**
   * Summary text. A description displayed underneath the heading.
   */
  @Prop() summary?: string;

  /**
   * Opens the action menu.
   */
  @Prop({ reflect: true }) menuOpen = false;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalcitePanelElement;

  dismissButtonEl: HTMLCalciteActionElement;

  menuButtonEl: HTMLCalciteActionElement;

  containerEl: HTMLElement;

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Emitted when the close button has been clicked.
   */

  @Event() calcitePanelDismissedChange: EventEmitter;

  /**
   * Emitted when the content has been scrolled.
   */

  @Event() calcitePanelScroll: EventEmitter;

  /**
   * Emitted when the back button has been clicked.
   */

  @Event() calcitePanelBackClick: EventEmitter;

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  setContainerRef = (node: HTMLElement): void => {
    this.containerEl = node;
  };

  setMenuButonRef = (node: HTMLCalciteActionElement): void => {
    this.menuButtonEl = node;
  };

  setDismissRef = (node: HTMLCalciteActionElement): void => {
    this.dismissButtonEl = node;
  };

  panelKeyUpHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this.dismiss();
    }
  };

  dismiss = (): void => {
    this.dismissed = true;
  };

  panelScrollHandler = (): void => {
    this.calcitePanelScroll.emit();
  };

  backButtonClick = (): void => {
    this.calcitePanelBackClick.emit();
  };

  queryActions(): HTMLCalciteActionElement[] {
    return getSlotted<HTMLCalciteActionElement>(this.el, SLOTS.headerActionsEnd, {
      all: true
    });
  }

  isValidKey(key: string, supportedKeys: string[]): boolean {
    return !!supportedKeys.find((k) => k === key);
  }

  toggleMenuOpen = (): void => {
    this.menuOpen = !this.menuOpen;
  };

  menuButtonKeyDown = (event: KeyboardEvent): void => {
    const { key } = event;
    const { menuOpen } = this;

    if (!this.isValidKey(key, SUPPORTED_ARROW_KEYS)) {
      return;
    }

    const actions = this.queryActions();
    const { length } = actions;

    if (!length) {
      return;
    }

    event.preventDefault();

    if (!menuOpen) {
      this.menuOpen = true;
    }

    if (key === "ArrowUp") {
      const lastAction = actions[length - 1];
      focusElement(lastAction);
    }

    if (key === "ArrowDown") {
      const firstAction = actions[0];
      focusElement(firstAction);
    }
  };

  menuActionsKeydown = (event: KeyboardEvent): void => {
    const { key, target } = event;

    if (!this.isValidKey(key, SUPPORTED_ARROW_KEYS)) {
      return;
    }

    const actions = this.queryActions();
    const { length } = actions;
    const currentIndex = actions.indexOf(target as HTMLCalciteActionElement);

    if (!length || currentIndex === -1) {
      return;
    }

    event.preventDefault();

    if (key === "ArrowUp") {
      const value = getRoundRobinIndex(currentIndex - 1, length);
      const previousAction = actions[value];
      focusElement(previousAction);
    }

    if (key === "ArrowDown") {
      const value = getRoundRobinIndex(currentIndex + 1, length);
      const nextAction = actions[value];
      focusElement(nextAction);
    }
  };

  menuActionsContainerKeyDown = (event: KeyboardEvent): void => {
    const { key } = event;

    if (key === "Escape") {
      this.menuOpen = false;
    }
  };

  // --------------------------------------------------------------------------
  //
  //  Methods
  //
  // --------------------------------------------------------------------------

  @Method()
  async setFocus(focusId?: "dismiss-button"): Promise<void> {
    if (focusId === "dismiss-button") {
      this.dismissButtonEl?.setFocus();
      return;
    }

    this.containerEl?.focus();
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  renderBackButton(): VNode {
    const { el } = this;

    const rtl = getElementDir(el) === "rtl";
    const { showBackButton, intlBack, backButtonClick } = this;
    const label = intlBack || TEXT.back;
    const icon = rtl ? ICONS.backRight : ICONS.backLeft;

    return showBackButton ? (
      <calcite-action
        aria-label={label}
        class={CSS.backButton}
        icon={icon}
        key="back-button"
        onClick={backButtonClick}
        scale="s"
        slot={SLOTS.headerActionsStart}
        text={label}
      />
    ) : null;
  }

  renderHeaderContent(): VNode {
    const { heading, summary } = this;
    const headingNode = heading ? <h4 class={CSS.heading}>{heading}</h4> : null;
    const summaryNode = summary ? <span class={CSS.summary}>{summary}</span> : null;

    return headingNode || summaryNode ? (
      <div class={CSS.headerContent} key="header-content">
        {headingNode}
        {summaryNode}
      </div>
    ) : null;
  }

  /**
   * Allows user to override the entire header-content node.
   */
  renderHeaderSlottedContent(): VNode {
    return (
      <div class={CSS.headerContent} key="header-content">
        <slot name={SLOTS.headerContent} />
      </div>
    );
  }

  renderHeaderStartActions(): VNode {
    const { el } = this;
    const hasStartActions = getSlotted(el, SLOTS.headerActionsStart);
    return hasStartActions ? (
      <div
        class={{ [CSS.headerActionsStart]: true, [CSS.headerActions]: true }}
        key="header-actions-start"
      >
        <slot name={SLOTS.headerActionsStart} />
      </div>
    ) : null;
  }

  renderHeaderActionsEnd(): VNode {
    const { dismiss, dismissible, el, intlClose } = this;
    const text = intlClose || TEXT.close;

    const dismissibleNode = dismissible ? (
      <calcite-action
        aria-label={text}
        icon={ICONS.close}
        onClick={dismiss}
        ref={this.setDismissRef}
        text={text}
      />
    ) : null;

    const slotNode = <slot name={SLOTS.headerActionsEnd} />;
    const hasEndActions = getSlotted(el, SLOTS.headerActionsEnd);

    return hasEndActions || dismissibleNode ? (
      <div
        class={{ [CSS.headerActionsEnd]: true, [CSS.headerActions]: true }}
        key="header-actions-end"
      >
        {slotNode}
        {dismissibleNode}
      </div>
    ) : null;
  }

  renderMenuItems(): VNode {
    const { menuOpen, menuButtonEl } = this;

    return (
      <calcite-popover
        disablePointer={true}
        flipPlacements={["bottom-end", "top-end"]}
        offsetDistance={0}
        onKeyDown={this.menuActionsKeydown}
        open={menuOpen}
        placement="bottom-end"
        referenceElement={menuButtonEl}
      >
        <div class={CSS.menu}>
          <slot name={SLOTS.headerMenuActions} />
        </div>
      </calcite-popover>
    );
  }

  renderMenuButton(): VNode {
    const { menuOpen, intlOpen, intlClose } = this;
    const closeLabel = intlClose || TEXT.close;
    const openLabel = intlOpen || TEXT.open;

    const menuLabel = menuOpen ? closeLabel : openLabel;

    return (
      <calcite-action
        aria-label={menuLabel}
        class={CSS.menuButton}
        icon={ICONS.menu}
        onClick={this.toggleMenuOpen}
        onKeyDown={this.menuButtonKeyDown}
        ref={this.setMenuButonRef}
        text={menuLabel}
      />
    );
  }

  renderMenu(): VNode {
    const { el } = this;

    const hasMenuItems = getSlotted(el, SLOTS.headerMenuActions);

    return hasMenuItems ? (
      <div class={CSS.menuContainer} onKeyDown={this.menuActionsContainerKeyDown}>
        {this.renderMenuButton()}
        {this.renderMenuItems()}
      </div>
    ) : null;
  }

  renderHeaderNode(): VNode {
    const { el, showBackButton } = this;

    const backButtonNode = this.renderBackButton();

    const hasHeaderSlottedContent = getSlotted(el, SLOTS.headerContent);
    const headerContentNode = hasHeaderSlottedContent
      ? this.renderHeaderSlottedContent()
      : this.renderHeaderContent();

    const actionsNodeStart = this.renderHeaderStartActions();
    const actionsNodeEnd = this.renderHeaderActionsEnd();
    const headerMenuNode = this.renderMenu();

    return actionsNodeStart ||
      headerContentNode ||
      actionsNodeEnd ||
      headerMenuNode ||
      showBackButton ? (
      <header class={CSS.header}>
        {backButtonNode}
        {actionsNodeStart}
        {headerContentNode}
        {actionsNodeEnd}
        {headerMenuNode}
      </header>
    ) : null;
  }

  /**
   * Allows user to override the entire footer node.
   */
  renderFooterSlottedContent(): VNode {
    const { el } = this;

    const hasFooterSlottedContent = getSlotted(el, SLOTS.footer);

    return hasFooterSlottedContent ? (
      <footer class={CSS.footer}>
        <slot name={SLOTS.footer} />
      </footer>
    ) : null;
  }

  renderFooterActions(): VNode {
    const { el } = this;

    const hasFooterActions = getSlotted(el, SLOTS.footerActions);

    return hasFooterActions ? (
      <footer class={CSS.footer}>
        <slot name={SLOTS.footerActions} />
      </footer>
    ) : null;
  }

  renderContent(): VNode {
    return (
      <section class={CSS.contentContainer} onScroll={this.panelScrollHandler} tabIndex={0}>
        <slot />
        {this.renderFab()}
      </section>
    );
  }

  renderFab(): VNode {
    const { el } = this;

    const hasFab = getSlotted(el, SLOTS.fab);

    return hasFab ? (
      <div class={CSS.fabContainer}>
        <slot name={SLOTS.fab} />
      </div>
    ) : null;
  }

  render(): VNode {
    const { dismissed, disabled, dismissible, el, loading, panelKeyUpHandler } = this;

    const rtl = getElementDir(el) === "rtl";

    const panelNode = (
      <article
        aria-busy={loading.toString()}
        class={{
          [CSS.container]: true,
          [CSS_UTILITY.rtl]: rtl
        }}
        hidden={dismissible && dismissed}
        onKeyUp={panelKeyUpHandler}
        ref={this.setContainerRef}
        tabIndex={dismissible ? 0 : -1}
      >
        {this.renderHeaderNode()}
        {this.renderContent()}
        {this.renderFooterSlottedContent() || this.renderFooterActions()}
      </article>
    );

    return (
      <Host>
        {loading || disabled ? (
          <calcite-scrim loading={loading}>{panelNode}</calcite-scrim>
        ) : (
          panelNode
        )}
      </Host>
    );
  }
}
