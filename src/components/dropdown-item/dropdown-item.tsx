import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  VNode
} from "@stencil/core";
import { getElementProp, toAriaBoolean } from "../../utils/dom";
import { ItemKeyboardEvent } from "../dropdown/interfaces";

import { FlipContext } from "../interfaces";
import { CSS } from "./resources";
import { RequestedItem, SelectionMode } from "../dropdown-group/interfaces";

/**
 * @slot - A slot for adding text.
 */
@Component({
  tag: "calcite-dropdown-item",
  styleUrl: "dropdown-item.scss",
  shadow: true
})
export class DropdownItem {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteDropdownItemElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /** Indicates whether the item is active. */
  @Prop({ reflect: true, mutable: true }) active = false;

  /** flip the icon(s) in rtl */
  @Prop({ reflect: true }) iconFlipRtl?: FlipContext;

  /** optionally pass an icon to display at the start of an item - accepts calcite ui icon names  */
  @Prop({ reflect: true }) iconStart?: string;

  /** optionally pass an icon to display at the end of an item - accepts calcite ui icon names  */
  @Prop({ reflect: true }) iconEnd?: string;

  /** optionally pass a href - used to determine if the component should render as anchor */
  @Prop({ reflect: true }) href?: string;

  /** Applies to the aria-label attribute on the button or hyperlink */
  @Prop() label?: string;

  /** The rel attribute to apply to the hyperlink */
  @Prop() rel?: string;

  /** The target attribute to apply to the hyperlink */
  @Prop() target?: string;

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event() calciteInternalDropdownItemSelect: EventEmitter<RequestedItem>;

  /** @internal */
  @Event() calciteInternalDropdownItemKeyEvent: EventEmitter<ItemKeyboardEvent>;

  /** @internal */
  @Event() calciteInternalDropdownCloseRequest: EventEmitter<void>;
  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    this.el?.focus();
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentWillLoad(): void {
    this.initialize();
  }

  connectedCallback(): void {
    this.initialize();
  }

  render(): VNode {
    const scale = getElementProp(this.el, "scale", "m");
    const iconStartEl = (
      <calcite-icon
        class="dropdown-item-icon-start"
        flipRtl={this.iconFlipRtl === "start" || this.iconFlipRtl === "both"}
        icon={this.iconStart}
        scale="s"
      />
    );
    const contentNode = (
      <span class="dropdown-item-content">
        <slot />
      </span>
    );
    const iconEndEl = (
      <calcite-icon
        class="dropdown-item-icon-end"
        flipRtl={this.iconFlipRtl === "end" || this.iconFlipRtl === "both"}
        icon={this.iconEnd}
        scale="s"
      />
    );

    const slottedContent =
      this.iconStart && this.iconEnd
        ? [iconStartEl, contentNode, iconEndEl]
        : this.iconStart
        ? [iconStartEl, <slot />]
        : this.iconEnd
        ? [contentNode, iconEndEl]
        : contentNode;

    const contentEl = !this.href ? (
      slottedContent
    ) : (
      <a
        aria-label={this.label}
        class="dropdown-link"
        href={this.href}
        ref={(el) => (this.childLink = el)}
        rel={this.rel}
        target={this.target}
      >
        {slottedContent}
      </a>
    );

    const itemRole = this.href
      ? null
      : this.selectionMode === "single"
      ? "menuitemradio"
      : this.selectionMode === "multi"
      ? "menuitemcheckbox"
      : "menuitem";

    const itemAria = this.selectionMode !== "none" ? toAriaBoolean(this.active) : null;

    return (
      <Host aria-checked={itemAria} role={itemRole} tabindex="0">
        <div
          class={{
            container: true,
            [CSS.containerLink]: !!this.href,
            [CSS.containerSmall]: scale === "s",
            [CSS.containerMedium]: scale === "m",
            [CSS.containerLarge]: scale === "l",
            [CSS.containerMulti]: this.selectionMode === "multi",
            [CSS.containerSingle]: this.selectionMode === "single",
            [CSS.containerNone]: this.selectionMode === "none"
          }}
        >
          {this.selectionMode !== "none" ? (
            <calcite-icon
              class="dropdown-item-icon"
              icon={this.selectionMode === "multi" ? "check" : "bullet-point"}
              scale="s"
            />
          ) : null}
          {contentEl}
        </div>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("click") onClick(): void {
    this.emitRequestedItem();
  }

  @Listen("keydown")
  keyDownHandler(event: KeyboardEvent): void {
    switch (event.key) {
      case " ":
      case "Enter":
        this.emitRequestedItem();
        if (this.href) {
          this.childLink.click();
        }
        event.preventDefault();
        break;
      case "Escape":
        this.calciteInternalDropdownCloseRequest.emit();
        event.preventDefault();
        break;
      case "Tab":
        this.calciteInternalDropdownItemKeyEvent.emit({ keyboardEvent: event });
        break;
      case "ArrowUp":
      case "ArrowDown":
      case "Home":
      case "End":
        event.preventDefault();
        this.calciteInternalDropdownItemKeyEvent.emit({ keyboardEvent: event });
        break;
    }
  }

  @Listen("calciteInternalDropdownItemChange", { target: "body" })
  updateActiveItemOnChange(event: CustomEvent): void {
    const parentEmittedChange = event.composedPath().includes(this.parentDropdownGroupEl);

    if (parentEmittedChange) {
      this.requestedDropdownGroup = event.detail.requestedDropdownGroup;
      this.requestedDropdownItem = event.detail.requestedDropdownItem;
      this.determineActiveItem();
    }
    event.stopPropagation();
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /** id of containing group */
  private parentDropdownGroupEl: HTMLCalciteDropdownGroupElement;

  /** requested group */
  private requestedDropdownGroup: HTMLCalciteDropdownGroupElement;

  /** requested item */
  private requestedDropdownItem: HTMLCalciteDropdownItemElement;

  /** what selection mode is the parent dropdown group in */
  private selectionMode: SelectionMode;

  /** if href is requested, track the rendered child link*/
  private childLink: HTMLAnchorElement;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private initialize(): void {
    this.selectionMode = getElementProp(this.el, "selection-mode", "single");
    this.parentDropdownGroupEl = this.el.closest("calcite-dropdown-group");
    if (this.selectionMode === "none") {
      this.active = false;
    }
  }

  private determineActiveItem(): void {
    switch (this.selectionMode) {
      case "multi":
        if (this.el === this.requestedDropdownItem) {
          this.active = !this.active;
        }
        break;

      case "single":
        if (this.el === this.requestedDropdownItem) {
          this.active = true;
        } else if (this.requestedDropdownGroup === this.parentDropdownGroupEl) {
          this.active = false;
        }
        break;

      case "none":
        this.active = false;
        break;
    }
  }

  private emitRequestedItem(): void {
    this.calciteInternalDropdownItemSelect.emit({
      requestedDropdownItem: this.el,
      requestedDropdownGroup: this.parentDropdownGroupEl
    });
  }
}
