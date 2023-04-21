import { Component, Element, forceUpdate, h, Prop, State, VNode, Watch } from "@stencil/core";
import {
  ConditionalSlotComponent,
  connectConditionalSlotComponent,
  disconnectConditionalSlotComponent
} from "../../utils/conditionalSlot";
import {
  getElementDir,
  getSlotted,
  isPrimaryPointerButton,
  slotChangeGetAssignedElements
} from "../../utils/dom";
import { connectLocalized, disconnectLocalized, LocalizedComponent } from "../../utils/locale";
import { clamp } from "../../utils/math";
import {
  connectMessages,
  disconnectMessages,
  setUpMessages,
  T9nComponent,
  updateMessages
} from "../../utils/t9n";
import { Layout, Position, Scale } from "../interfaces";
import { ShellPanelMessages } from "./assets/shell-panel/t9n";
import { CSS, SLOTS } from "./resources";

/**
 * @slot - A slot for adding custom content.
 * @slot action-bar - A slot for adding a `calcite-action-bar` to the component.
 */
@Component({
  tag: "calcite-shell-panel",
  styleUrl: "shell-panel.scss",
  shadow: true,
  assetsDirs: ["assets"]
})
export class ShellPanel implements ConditionalSlotComponent, LocalizedComponent, T9nComponent {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * When `true`, hides the component's content area.
   */
  @Prop({ reflect: true }) collapsed = false;

  /**
   * When `true`, the content area displays like a floating panel.
   */
  @Prop({ reflect: true }) detached = false;

  /**
   * When `detached`, specifies the maximum height of the component.
   */
  @Prop({ reflect: true }) detachedHeightScale: Scale = "l";

  /**
   * Specifies the width of the component's content area.
   */

  @Prop({ reflect: true }) widthScale: Scale = "m";

  /**
   *  The direction of the component.
   */
  @Prop({ reflect: true }) layout: Extract<"horizontal" | "vertical", Layout> = "vertical";

  @Watch("layout")
  layoutHandler(): void {
    this.setActionBarsLayout(this.actionBars);
  }

  /**
   * Specifies the component's position. Will be flipped when the element direction is right-to-left (`"rtl"`).
   */
  @Prop({ reflect: true }) position: Position;

  /**
   * When `true` and not `detached`, the component's content area is resizable.
   */
  @Prop({ reflect: true }) resizable = false;

  /**
   * Made into a prop for testing purposes only
   *
   * @internal
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messages: ShellPanelMessages;

  /**
   * Use this property to override individual strings used by the component.
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messageOverrides: Partial<ShellPanelMessages>;

  @Watch("messageOverrides")
  onMessagesChange(): void {
    /* wired up by t9n util */
  }
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    connectConditionalSlotComponent(this);
    connectLocalized(this);
    connectMessages(this);
  }

  async componentWillLoad(): Promise<void> {
    await setUpMessages(this);
  }

  disconnectedCallback(): void {
    disconnectConditionalSlotComponent(this);
    this.disconnectSeparator();
    disconnectLocalized(this);
    disconnectMessages(this);
  }

  componentDidLoad(): void {
    this.updateAriaValues();
  }

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteShellPanelElement;

  @State() contentWidth: number = null;

  @State() contentHeight: number = null;

  initialContentWidth: number = null;

  initialContentHeight: number = null;

  initialClientX: number = null;

  initialClientY: number = null;

  contentEl: HTMLDivElement;

  separatorEl: HTMLDivElement;

  contentWidthMax: number = null;

  contentWidthMin: number = null;

  contentHeightMax: number = null;

  contentHeightMin: number = null;

  step = 1;

  stepMultiplier = 10;

  actionBars: HTMLCalciteActionBarElement[] = [];

  @State() defaultMessages: ShellPanelMessages;

  @State() effectiveLocale = "";

  @Watch("effectiveLocale")
  effectiveLocaleChange(): void {
    updateMessages(this, this.effectiveLocale);
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------
  renderHeader(): VNode {
    const { el } = this;

    const hasHeader = getSlotted(el, SLOTS.header);

    return hasHeader ? (
      <div class={CSS.contentHeader} key="header">
        <slot name={SLOTS.header} />
      </div>
    ) : null;
  }

  render(): VNode {
    const {
      collapsed,
      detached,
      position,
      initialContentWidth,
      initialContentHeight,
      contentWidth,
      contentWidthMax,
      contentWidthMin,
      contentHeight,
      contentHeightMax,
      contentHeightMin,
      resizable,
      layout
    } = this;

    const allowResizing = !detached && resizable;

    const style = allowResizing
      ? layout === "horizontal"
        ? contentHeight
          ? { height: `${contentHeight}px` }
          : null
        : contentWidth
        ? { width: `${contentWidth}px` }
        : null
      : null;

    const contentNode = (
      <div
        class={{ [CSS.content]: true, [CSS.contentDetached]: detached }}
        hidden={collapsed}
        key="content"
        style={style}
        // eslint-disable-next-line react/jsx-sort-props
        ref={this.storeContentEl}
      >
        {this.renderHeader()}
        <div class={CSS.contentBody}>
          <slot />
        </div>
      </div>
    );

    const separatorNode = allowResizing ? (
      <div
        aria-label={this.messages.resize}
        aria-orientation={layout === "horizontal" ? "vertical" : "horizontal"}
        aria-valuemax={layout == "horizontal" ? contentHeightMax : contentWidthMax}
        aria-valuemin={layout == "horizontal" ? contentHeightMin : contentWidthMin}
        aria-valuenow={
          layout == "horizontal"
            ? contentHeight ?? initialContentHeight
            : contentWidth ?? initialContentWidth
        }
        class={CSS.separator}
        key="separator"
        onKeyDown={this.separatorKeyDown}
        role="separator"
        tabIndex={0}
        touch-action="none"
        // eslint-disable-next-line react/jsx-sort-props
        ref={this.connectSeparator}
      />
    ) : null;

    const actionBarNode = (
      <slot key="action-bar" name={SLOTS.actionBar} onSlotchange={this.handleActionBarSlotChange} />
    );

    const mainNodes = [actionBarNode, contentNode, separatorNode];

    if (position === "end") {
      mainNodes.reverse();
    }

    return <div class={{ [CSS.container]: true }}>{mainNodes}</div>;
  }

  // --------------------------------------------------------------------------
  //
  //  private Methods
  //
  // --------------------------------------------------------------------------

  setContentWidth(width: number): void {
    const { contentWidthMax, contentWidthMin } = this;

    const roundedWidth = Math.round(width);

    this.contentWidth =
      typeof contentWidthMax === "number" && typeof contentWidthMin === "number"
        ? clamp(roundedWidth, contentWidthMin, contentWidthMax)
        : roundedWidth;
  }

  updateAriaValues(): void {
    const { contentEl } = this;
    const computedStyle = contentEl && getComputedStyle(contentEl);

    if (!computedStyle) {
      return;
    }

    this.layout === "horizontal"
      ? this.updateHeights(computedStyle)
      : this.updateWidths(computedStyle);

    forceUpdate(this);
  }

  setContentHeight(height: number): void {
    const { contentHeightMax, contentHeightMin } = this;

    const roundedWidth = Math.round(height);

    this.contentHeight =
      typeof contentHeightMax === "number" && typeof contentHeightMin === "number"
        ? clamp(roundedWidth, contentHeightMin, contentHeightMax)
        : roundedWidth;
  }

  updateWidths(computedStyle: CSSStyleDeclaration): void {
    const max = parseInt(computedStyle.getPropertyValue("max-width"), 10);
    const min = parseInt(computedStyle.getPropertyValue("min-width"), 10);
    const valueNow = parseInt(computedStyle.getPropertyValue("width"), 10);

    if (typeof valueNow === "number" && !isNaN(valueNow)) {
      this.initialContentWidth = valueNow;
    }

    if (typeof max === "number" && !isNaN(max)) {
      this.contentWidthMax = max;
    }

    if (typeof min === "number" && !isNaN(min)) {
      this.contentWidthMin = min;
    }
  }

  updateHeights(computedStyle: CSSStyleDeclaration): void {
    const max = parseInt(computedStyle.getPropertyValue("max-height"), 10);
    const min = parseInt(computedStyle.getPropertyValue("min-height"), 10);
    const valueNow = parseInt(computedStyle.getPropertyValue("height"), 10);

    if (typeof valueNow === "number" && !isNaN(valueNow)) {
      this.initialContentHeight = valueNow;
    }

    if (typeof max === "number" && !isNaN(max)) {
      this.contentHeightMax = max;
    }

    if (typeof min === "number" && !isNaN(min)) {
      this.contentHeightMin = min;
    }
  }

  storeContentEl = (contentEl: HTMLDivElement): void => {
    this.contentEl = contentEl;
  };

  getKeyAdjustedSize = (event: KeyboardEvent): number | null => {
    const { key } = event;
    const {
      el,
      step,
      stepMultiplier,
      layout,
      contentWidthMin,
      contentWidthMax,
      initialContentWidth,
      initialContentHeight,
      contentHeightMin,
      contentHeightMax,
      position
    } = this;
    const multipliedStep = step * stepMultiplier;

    const MOVEMENT_KEYS = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "PageUp",
      "PageDown"
    ];

    if (MOVEMENT_KEYS.indexOf(key) > -1) {
      event.preventDefault();
    }

    const dir = getElementDir(el);

    const horizontalKeys = ["ArrowLeft", "ArrowRight"];
    const verticalKeys = ["ArrowDown", "ArrowUp"];
    const directionFactor = dir === "rtl" && horizontalKeys.includes(key) ? -1 : 1;

    const increaseKeys =
      layout === "horizontal"
        ? position === "end"
          ? key === verticalKeys[1] || key === horizontalKeys[0]
          : key === verticalKeys[0] || key === horizontalKeys[1]
        : key === verticalKeys[1] ||
          (position === "end" ? key === horizontalKeys[0] : key === horizontalKeys[1]);

    if (increaseKeys) {
      const stepValue = event.shiftKey ? multipliedStep : step;

      return layout === "horizontal"
        ? initialContentHeight + directionFactor * stepValue
        : initialContentWidth + directionFactor * stepValue;
    }

    const decreaseKeys =
      layout === "horizontal"
        ? position === "end"
          ? key === verticalKeys[0] || key === horizontalKeys[0]
          : key === verticalKeys[1] || key === horizontalKeys[1]
        : key === verticalKeys[0] ||
          (position === "end" ? key === horizontalKeys[1] : key === horizontalKeys[0]);

    if (decreaseKeys) {
      const stepValue = event.shiftKey ? multipliedStep : step;

      return layout === "horizontal"
        ? initialContentHeight - directionFactor * stepValue
        : initialContentWidth - directionFactor * stepValue;
    }

    if (key === "Home" && layout === "horizontal" && typeof contentHeightMin === "number") {
      return contentHeightMin;
    }

    if (key === "Home" && layout === "vertical" && typeof contentWidthMin === "number") {
      return contentWidthMin;
    }

    if (key === "End" && layout === "horizontal" && typeof contentHeightMax === "number") {
      return contentHeightMax;
    }

    if (key === "End" && layout === "vertical" && typeof contentWidthMax === "number") {
      return contentWidthMax;
    }

    if (key === "PageDown") {
      return layout === "horizontal"
        ? initialContentHeight - multipliedStep
        : initialContentWidth - multipliedStep;
    }

    if (key === "PageUp") {
      return layout === "horizontal"
        ? initialContentHeight + multipliedStep
        : initialContentWidth + multipliedStep;
    }

    return null;
  };

  initialKeydownWidth = (event: KeyboardEvent): void => {
    this.setInitialContentWidth();
    const width = this.getKeyAdjustedSize(event);

    if (typeof width === "number") {
      this.setContentWidth(width);
    }
  };

  initialKeydownHeight = (event: KeyboardEvent): void => {
    this.setInitialContentHeight();
    const height = this.getKeyAdjustedSize(event);

    if (typeof height === "number") {
      this.setContentHeight(height);
    }
  };

  separatorKeyDown = (event: KeyboardEvent): void => {
    this.layout === "horizontal"
      ? this.initialKeydownHeight(event)
      : this.initialKeydownWidth(event);
  };

  separatorPointerMove = (event: PointerEvent): void => {
    event.preventDefault();

    const {
      el,
      layout,
      initialContentWidth,
      initialContentHeight,
      position,
      initialClientX,
      initialClientY
    } = this;

    const offset =
      layout === "horizontal" ? event.clientY - initialClientY : event.clientX - initialClientX;

    const adjustmentDirection = layout === "vertical" && getElementDir(el) === "rtl" ? -1 : 1;

    const adjustedOffset =
      layout === "horizontal"
        ? position === "end"
          ? -adjustmentDirection * offset
          : adjustmentDirection * offset
        : position === "end"
        ? -adjustmentDirection * offset
        : adjustmentDirection * offset;

    layout === "horizontal"
      ? this.setContentHeight(initialContentHeight + adjustedOffset)
      : this.setContentWidth(initialContentWidth + adjustedOffset);
  };

  separatorPointerUp = (event: PointerEvent): void => {
    if (!isPrimaryPointerButton(event)) {
      return;
    }

    event.preventDefault();
    document.removeEventListener("pointerup", this.separatorPointerUp);
    document.removeEventListener("pointermove", this.separatorPointerMove);
  };

  setInitialContentHeight = (): void => {
    this.initialContentHeight = this.contentEl?.getBoundingClientRect().height;
  };

  setInitialContentWidth = (): void => {
    this.initialContentWidth = this.contentEl?.getBoundingClientRect().width;
  };

  separatorPointerDown = (event: PointerEvent): void => {
    if (!isPrimaryPointerButton(event)) {
      return;
    }

    event.preventDefault();
    const { separatorEl } = this;

    separatorEl && document.activeElement !== separatorEl && separatorEl.focus();

    if (this.layout === "horizontal") {
      this.setInitialContentHeight();
      this.initialClientY = event.clientY;
    } else {
      this.setInitialContentWidth();
      this.initialClientX = event.clientX;
    }

    document.addEventListener("pointerup", this.separatorPointerUp);
    document.addEventListener("pointermove", this.separatorPointerMove);
  };

  connectSeparator = (separatorEl: HTMLDivElement): void => {
    this.disconnectSeparator();
    this.separatorEl = separatorEl;
    separatorEl.addEventListener("pointerdown", this.separatorPointerDown);
  };

  disconnectSeparator = (): void => {
    this.separatorEl?.removeEventListener("pointerdown", this.separatorPointerDown);
  };

  setActionBarsLayout = (actionBars: HTMLCalciteActionBarElement[]): void => {
    actionBars.forEach((actionBar) => (actionBar.layout = this.layout));
  };

  handleActionBarSlotChange = (event: Event): void => {
    const actionBars = slotChangeGetAssignedElements(event).filter((el) =>
      el?.matches("calcite-action-bar")
    ) as HTMLCalciteActionBarElement[];

    this.actionBars = actionBars;
    this.setActionBarsLayout(actionBars);
  };
}
