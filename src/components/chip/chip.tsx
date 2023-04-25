import {
  Build,
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  VNode,
  Watch
} from "@stencil/core";
import { toAriaBoolean } from "../../utils/dom";
import { CSS, SLOTS, ICONS } from "./resources";
import { Appearance, Kind, Scale, SelectionMode } from "../interfaces";
import {
  ConditionalSlotComponent,
  connectConditionalSlotComponent,
  disconnectConditionalSlotComponent
} from "../../utils/conditionalSlot";
import { slotChangeHasAssignedElement } from "../../utils/dom";
import {
  componentLoaded,
  LoadableComponent,
  setComponentLoaded,
  setUpLoadableComponent
} from "../../utils/loadable";

import {
  connectMessages,
  disconnectMessages,
  setUpMessages,
  T9nComponent,
  updateMessages
} from "../../utils/t9n";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";
import { connectLocalized, disconnectLocalized, LocalizedComponent } from "../../utils/locale";
import { createObserver } from "../../utils/observers";
import { isActivationKey } from "../../utils/key";
import { ChipMessages } from "./assets/chip/t9n";

/**
 * @slot - A slot for adding text.
 * @slot image - A slot for adding an image.
 */
@Component({
  tag: "calcite-chip",
  styleUrl: "chip.scss",
  shadow: true,
  assetsDirs: ["assets"]
})
export class Chip
  implements
    ConditionalSlotComponent,
    InteractiveComponent,
    LoadableComponent,
    LocalizedComponent,
    T9nComponent
{
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteChipElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------
  /** When true, interaction is prevented and the component is displayed with lower opacity. */
  @Prop({ reflect: true }) disabled = false;

  /** Specifies the appearance style of the component. */
  @Prop({ reflect: true }) appearance: Extract<"outline" | "outline-fill" | "solid", Appearance> =
    "solid";

  /** Specifies the kind of the component (will apply to border and background if applicable). */
  @Prop({ reflect: true }) kind: Extract<"brand" | "inverse" | "neutral", Kind> = "neutral";

  /** When `true`, a close button is added to the component. */
  @Prop({ reflect: true }) closable = false;

  /** Specifies an icon to display. */
  @Prop({ reflect: true }) icon: string;

  /** When `true`, the icon will be flipped when the element direction is right-to-left (`"rtl"`). */
  @Prop({ reflect: true }) iconFlipRtl = false;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** Accessible name for the component. */
  @Prop() label: string;

  /** The component's value. */
  @Prop() value!: any;

  /** When `true`, hides the component. */
  @Prop({ reflect: true, mutable: true }) closed = false;

  /**
   * This internal property, managed by a containing `calcite-chip-group`, is
   * conditionally set based on the `selectionMode` of the parent
   *
   * @internal
   */
  @Prop() selectionMode: Extract<"multiple" | "single" | "single-persist" | "none", SelectionMode> =
    "none";

  /** When true, the component is selected.  */
  @Prop({ reflect: true, mutable: true }) selected = false;

  /**
   * Use this property to override individual strings used by the component.
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messageOverrides: Partial<ChipMessages>;

  /**
   * Made into a prop for testing purposes only
   *
   * @internal
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messages: ChipMessages;

  @Watch("messageOverrides")
  onMessagesChange(): void {
    /* wired up by t9n util */
  }

  /**
   * When true, enables the chip to be focused, and allows the `calciteChipSelect` to emit.
   * This is set to `true` by a parent Chip Group component.
   *
   * @internal
   */
  @Prop() interactive = false;

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  // --------------------------------------------------------------------------

  @State() defaultMessages: ChipMessages;

  @State() effectiveLocale: string;

  @Watch("effectiveLocale")
  effectiveLocaleChange(): void {
    updateMessages(this, this.effectiveLocale);
  }

  @State() private hasText = false;

  @State() private hasImage = false;

  private containerEl: HTMLDivElement;

  private closeButtonEl: HTMLButtonElement;

  private mutationObserver = createObserver("mutation", () => this.updateHasText());

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Fires when the component's close button is selected.
   */
  @Event({ cancelable: false }) calciteChipClose: EventEmitter<void>;

  /**
   * Fires when the selected state of the component changes.
   */
  @Event({ cancelable: false }) calciteChipSelect: EventEmitter<void>;

  /**
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalChipKeyEvent: EventEmitter<KeyboardEvent>;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    connectConditionalSlotComponent(this);
    connectLocalized(this);
    connectMessages(this);
    this.setupTextContentObserver();
  }

  componentDidLoad(): void {
    setComponentLoaded(this);
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  disconnectedCallback(): void {
    disconnectConditionalSlotComponent(this);
    disconnectLocalized(this);
    disconnectMessages(this);
  }

  async componentWillLoad(): Promise<void> {
    setUpLoadableComponent(this);
    if (Build.isBrowser) {
      await setUpMessages(this);
      this.updateHasText();
    }
  }
  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("keydown")
  keyDownHandler(event: KeyboardEvent): void {
    if (event.target === this.el) {
      switch (event.key) {
        case " ":
        case "Enter":
          this.handleEmittingEvent();
          event.preventDefault();
          break;
        case "ArrowRight":
        case "ArrowLeft":
        case "Home":
        case "End":
          this.calciteInternalChipKeyEvent.emit(event);
          event.preventDefault();
          break;
      }
    }
  }

  @Listen("click")
  clickHandler(): void {
    if (!this.interactive && this.closable) {
      this.closeButtonEl.focus();
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    await componentLoaded(this);
    if (!this.disabled && this.interactive) {
      this.containerEl?.focus();
    } else if (!this.disabled && this.closable) {
      this.closeButtonEl?.focus();
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  private close = (): void => {
    this.calciteChipClose.emit();
    this.selected = false;
    this.closed = true;
  };

  private closeButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (isActivationKey(event.key)) {
      event.preventDefault();
      this.close();
    }
  };

  private updateHasText() {
    this.hasText = this.el.textContent.trim().length > 0;
  }

  private setupTextContentObserver() {
    this.mutationObserver?.observe(this.el, { childList: true, subtree: true });
  }

  private handleSlotImageChange = (event: Event): void => {
    this.hasImage = slotChangeHasAssignedElement(event);
  };

  private handleEmittingEvent = (): void => {
    if (this.interactive) {
      this.calciteChipSelect.emit();
    }
  };

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  renderChipImage(): VNode {
    return (
      <div class={CSS.imageContainer}>
        <slot name={SLOTS.image} onSlotchange={this.handleSlotImageChange} />
      </div>
    );
  }

  renderSelectionIcon(): VNode {
    const icon =
      this.selectionMode === "multiple" && this.selected
        ? ICONS.checked
        : this.selectionMode === "multiple"
        ? ICONS.unchecked
        : this.selected
        ? ICONS.checkedSingle
        : undefined;

    return (
      <div
        class={{
          [CSS.selectIcon]: true,
          [CSS.selectIconActive]: this.selectionMode === "multiple" || this.selected
        }}
      >
        <calcite-icon icon={icon} scale={this.scale === "l" ? "m" : "s"} />
      </div>
    );
  }

  renderCloseButton(): VNode {
    return (
      <button
        aria-label={this.messages.dismissLabel}
        class={CSS.close}
        onClick={this.close}
        onKeyDown={this.closeButtonKeyDownHandler}
        tabIndex={this.disabled ? -1 : 0}
        // eslint-disable-next-line react/jsx-sort-props
        ref={(el) => (this.closeButtonEl = el)}
      >
        <calcite-icon icon={ICONS.close} scale={this.scale === "l" ? "m" : "s"} />
      </button>
    );
  }

  renderIcon(): VNode {
    return (
      <calcite-icon
        class={CSS.chipIcon}
        flipRtl={this.iconFlipRtl}
        icon={this.icon}
        scale={this.scale === "l" ? "m" : "s"}
      />
    );
  }

  render(): VNode {
    const disableInteraction = this.disabled || (!this.disabled && !this.interactive);
    return (
      <Host>
        <div
          aria-checked={this.interactive ? toAriaBoolean(this.selected) : undefined}
          aria-disabled={disableInteraction ? toAriaBoolean(this.disabled) : undefined}
          aria-label={this.label}
          class={{
            [CSS.container]: true,
            [CSS.textSlotted]: this.hasText,
            [CSS.imageSlotted]: this.hasImage,
            [CSS.selectable]: this.selectionMode !== "none",
            [CSS.multiple]: this.selectionMode === "multiple",
            [CSS.closable]: this.closable,
            [CSS.nonInteractive]: !this.interactive,
            [CSS.isCircle]:
              !this.closable &&
              !this.hasText &&
              (!this.icon || !this.hasImage) &&
              (this.selectionMode === "none" ||
                (!!this.selectionMode && this.selectionMode !== "multiple" && !this.selected))
          }}
          onClick={this.handleEmittingEvent}
          role={
            this.selectionMode === "multiple" && this.interactive
              ? "checkbox"
              : this.interactive
              ? "radio"
              : undefined
          }
          tabIndex={disableInteraction ? -1 : 0}
          // eslint-disable-next-line react/jsx-sort-props
          ref={(el) => (this.containerEl = el)}
        >
          {this.selectionMode !== "none" && this.renderSelectionIcon()}
          {this.renderChipImage()}
          {this.icon && this.renderIcon()}
          <span class={CSS.title}>
            <slot />
          </span>
          {this.closable && this.renderCloseButton()}
        </div>
      </Host>
    );
  }
}
