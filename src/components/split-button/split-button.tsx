import { Component, Element, Event, EventEmitter, h, Prop, VNode, Watch } from "@stencil/core";
import { CSS } from "./resources";
import { ButtonAppearance, ButtonColor, DropdownIconType } from "../button/interfaces";
import { FlipContext, Scale, Width } from "../interfaces";
import { OverlayPositioning } from "../../utils/floating-ui";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";

/**
 * @slot - A slot for adding `calcite-dropdown` content.
 */
@Component({
  tag: "calcite-split-button",
  styleUrl: "split-button.scss",
  shadow: true
})
export class SplitButton implements InteractiveComponent {
  @Element() el: HTMLCalciteSplitButtonElement;

  /** Specifies the appearance style of the component. */
  @Prop({ reflect: true }) appearance: ButtonAppearance = "solid";

  /** Specifies the color of the component. */
  @Prop({ reflect: true }) color: ButtonColor = "blue";

  /** When `true`, interaction is prevented and the component is displayed with lower opacity. */
  @Prop({ reflect: true }) disabled = false;

  @Watch("disabled")
  handleDisabledChange(value: boolean): void {
    if (!value) {
      this.active = false;
    }
  }

  /**
   * When `true`, the component is active.
   *
   * @internal
   */
  @Prop({ mutable: true, reflect: true }) active = false;

  @Watch("active")
  activeHandler(): void {
    if (this.disabled) {
      this.active = false;
    }
  }

  /** Specifies the icon used for the dropdown menu. */
  @Prop({ reflect: true }) dropdownIconType: DropdownIconType = "chevron";

  /** Accessible name for the dropdown menu. */
  @Prop({ reflect: true }) dropdownLabel?: string;

  /**
    When `true`, a busy indicator is displayed on the primary button.
   */
  @Prop({ reflect: true }) loading = false;

  /**
   * Determines the type of positioning to use for the overlaid content.
   *
   * Using `"absolute"` will work for most cases. The component will be positioned inside of overflowing parent containers and will affect the container's layout.
   *
   * `"fixed"` should be used to escape an overflowing parent container, or when the reference element's `position` CSS property is `"fixed"`.
   *
   */
  @Prop({ reflect: true }) overlayPositioning: OverlayPositioning = "absolute";

  /** Specifies an icon to display at the end of the primary button. */
  @Prop({ reflect: true }) primaryIconEnd?: string;

  /**  When `true`, the primary button icon will be flipped when the element direction is right-to-left (`"rtl"`). */
  @Prop({ reflect: true }) primaryIconFlipRtl?: FlipContext;

  /** Specifies an icon to display at the start of the primary button. */
  @Prop({ reflect: true }) primaryIconStart?: string;

  /** Accessible name for the primary button. */
  @Prop({ reflect: true }) primaryLabel?: string;

  /** Text displayed in the primary button. */
  @Prop({ reflect: true }) primaryText: string;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** Specifies the width of the component. */
  @Prop({ reflect: true }) width: Width = "auto";

  /**
   * Fires when the primary button is clicked.
   */
  @Event({ cancelable: false })
  calciteSplitButtonPrimaryClick: EventEmitter<void>;

  /**
   * Fires when the dropdown menu is clicked.
   */
  @Event({ cancelable: false })
  calciteSplitButtonSecondaryClick: EventEmitter<void>;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  render(): VNode {
    const widthClasses = {
      [CSS.container]: true,
      [CSS.widthAuto]: this.width === "auto",
      [CSS.widthHalf]: this.width === "half",
      [CSS.widthFull]: this.width === "full"
    };
    const buttonWidth = this.width === "auto" ? "auto" : "full";

    return (
      <div class={widthClasses}>
        <calcite-button
          appearance={this.appearance}
          color={this.color}
          disabled={this.disabled}
          icon-end={this.primaryIconEnd ? this.primaryIconEnd : null}
          icon-start={this.primaryIconStart ? this.primaryIconStart : null}
          iconFlipRtl={this.primaryIconFlipRtl ? this.primaryIconFlipRtl : null}
          label={this.primaryLabel}
          loading={this.loading}
          onClick={this.calciteSplitButtonPrimaryClickHandler}
          scale={this.scale}
          splitChild={"primary"}
          type="button"
          width={buttonWidth}
        >
          {this.primaryText}
        </calcite-button>
        <div class={CSS.dividerContainer}>
          <div class={CSS.divider} />
        </div>
        <calcite-dropdown
          disabled={this.disabled}
          onClick={this.calciteSplitButtonSecondaryClickHandler}
          open={this.active}
          overlayPositioning={this.overlayPositioning}
          placement="bottom-end"
          scale={this.scale}
          width={this.scale}
        >
          <calcite-button
            appearance={this.appearance}
            color={this.color}
            disabled={this.disabled}
            icon-start={this.dropdownIcon}
            label={this.dropdownLabel}
            scale={this.scale}
            slot="dropdown-trigger"
            splitChild={"secondary"}
            type="button"
          />
          <slot />
        </calcite-dropdown>
      </div>
    );
  }

  private calciteSplitButtonPrimaryClickHandler = (): CustomEvent =>
    this.calciteSplitButtonPrimaryClick.emit();

  private calciteSplitButtonSecondaryClickHandler = (): CustomEvent =>
    this.calciteSplitButtonSecondaryClick.emit();

  private get dropdownIcon(): string {
    return this.dropdownIconType === "chevron"
      ? "chevronDown"
      : this.dropdownIconType === "caret"
      ? "caretDown"
      : this.dropdownIconType === "ellipsis"
      ? "ellipsis"
      : "handle-vertical";
  }
}
