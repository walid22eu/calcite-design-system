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
import { RequestedItem } from "../dropdown-group/interfaces";
import {
  setUpLoadableComponent,
  setComponentLoaded,
  LoadableComponent,
  componentLoaded
} from "../../utils/loadable";
import { SelectionMode } from "../interfaces";

/**
 * @slot - A slot for adding text.
 */
@Component({
  tag: "calcite-dropdown-item",
  styleUrl: "dropdown-item.scss",
  shadow: true
})
export class DropdownItem implements LoadableComponent {
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

  /** When `true`, the component is selected. */
  @Prop({ reflect: true, mutable: true }) selected = false;

  /** When `true`, the icon will be flipped when the element direction is right-to-left (`"rtl"`). */
  @Prop({ reflect: true }) iconFlipRtl: FlipContext;

  /** Specifies an icon to display at the start of the component. */
  @Prop({ reflect: true }) iconStart: string;

  /** Specifies an icon to display at the end of the component. */
  @Prop({ reflect: true }) iconEnd: string;

  /**
   *  Specifies the URL of the linked resource, which can be set as an absolute or relative path.
   *
   * Determines if the component will render as an anchor.
   */
  @Prop({ reflect: true }) href: string;

  /** Accessible name for the component. */
  @Prop() label: string;

  /** Specifies the relationship to the linked document defined in `href`. */
  @Prop({ reflect: true }) rel: string;

  /** Specifies the frame or window to open the linked document. */
  @Prop({ reflect: true }) target: string;

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Fires when the component is selected. */
  @Event({ cancelable: false }) calciteDropdownItemSelect: EventEmitter<void>;

  /**
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalDropdownItemSelect: EventEmitter<RequestedItem>;

  /** @internal */
  @Event({ cancelable: false })
  calciteInternalDropdownItemKeyEvent: EventEmitter<ItemKeyboardEvent>;

  /** @internal */
  @Event({ cancelable: false }) calciteInternalDropdownCloseRequest: EventEmitter<void>;
  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    await componentLoaded(this);

    this.el?.focus();
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentWillLoad(): void {
    setUpLoadableComponent(this);
    this.initialize();
  }

  componentDidLoad(): void {
    setComponentLoaded(this);
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
        tabIndex={-1}
        target={this.target}
      >
        {slottedContent}
      </a>
    );

    const itemRole = this.href
      ? null
      : this.selectionMode === "single"
      ? "menuitemradio"
      : this.selectionMode === "multiple"
      ? "menuitemcheckbox"
      : "menuitem";

    const itemAria = this.selectionMode !== "none" ? toAriaBoolean(this.selected) : null;

    return (
      <Host aria-checked={itemAria} role={itemRole} tabindex="0">
        <div
          class={{
            container: true,
            [CSS.containerLink]: !!this.href,
            [CSS.containerSmall]: scale === "s",
            [CSS.containerMedium]: scale === "m",
            [CSS.containerLarge]: scale === "l",
            [CSS.containerMulti]: this.selectionMode === "multiple",
            [CSS.containerSingle]: this.selectionMode === "single",
            [CSS.containerNone]: this.selectionMode === "none"
          }}
        >
          {this.selectionMode !== "none" ? (
            <calcite-icon
              class="dropdown-item-icon"
              icon={this.selectionMode === "multiple" ? "check" : "bullet-point"}
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
  private selectionMode: Extract<"none" | "single" | "multiple", SelectionMode>;

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
      this.selected = false;
    }
  }

  private determineActiveItem(): void {
    switch (this.selectionMode) {
      case "multiple":
        if (this.el === this.requestedDropdownItem) {
          this.selected = !this.selected;
        }
        break;

      case "single":
        if (this.el === this.requestedDropdownItem) {
          this.selected = true;
        } else if (this.requestedDropdownGroup === this.parentDropdownGroupEl) {
          this.selected = false;
        }
        break;

      case "none":
        this.selected = false;
        break;
    }
  }

  private emitRequestedItem(): void {
    this.calciteDropdownItemSelect.emit();
    this.calciteInternalDropdownItemSelect.emit({
      requestedDropdownItem: this.el,
      requestedDropdownGroup: this.parentDropdownGroupEl
    });
  }
}
