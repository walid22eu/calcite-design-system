import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  VNode
} from "@stencil/core";

import { TEXT } from "./resources";
import { getElementDir } from "../../utils/dom";

/** Notices are intended to be used to present users with important-but-not-crucial contextual tips or copy. Because
 * notices are displayed inline, a common use case is displaying them on page-load to present users with short hints or contextual copy.
 * They are optionally dismissible - useful for keeping track of whether or not a user has dismissed the notice. You can also choose not
 * to display a notice on page load and set the "active" attribute as needed to contextually provide inline messaging to users.
 */

/**
 * @slot notice-title - Title of the notice (optional)
 * @slot notice-message - Main text of the notice
 * @slot notice-link - Optional action to take from the notice (undo, try again, link to page, etc.)
 */

@Component({
  tag: "calcite-notice",
  styleUrl: "calcite-notice.scss",
  shadow: true
})
export class CalciteNotice {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteNoticeElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------------------------------

  /** Is the notice currently active or not */
  @Prop({ reflect: true, mutable: true }) active = false;

  /** Color for the notice (will apply to top border and icon) */
  @Prop({ reflect: true }) color: "blue" | "green" | "red" | "yellow" = "blue";

  /** Optionally show a button the user can click to dismiss the notice */
  @Prop({ reflect: true }) dismissible?: boolean = false;

  /** If false, no icon will be shown in the notice */
  @Prop() icon = false;

  /** String for the close button. */
  @Prop({ reflect: false }) intlClose: string = TEXT.close;

  /** specify the scale of the notice, defaults to m */
  @Prop({ reflect: true }) scale: "s" | "m" | "l" = "m";

  /** Select theme (light or dark) */
  @Prop({ reflect: true }) theme: "light" | "dark";

  /** specify the width of the notice, defaults to m */
  @Prop({ reflect: true }) width: "auto" | "half" | "full" = "auto";

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentDidLoad(): void {
    this.noticeLinkEl = this.el.querySelectorAll("calcite-link")[0] as HTMLCalciteLinkElement;
  }

  render(): VNode {
    const dir = getElementDir(this.el);
    const closeButton = (
      <button
        aria-label={this.intlClose}
        class="notice-close"
        onClick={() => this.close()}
        ref={() => this.closeButton}
      >
        <calcite-icon icon="x" scale="m" />
      </button>
    );

    return (
      <Host active={this.active} dir={dir}>
        {this.icon ? this.renderIcon() : null}
        <div class="notice-content">
          <slot name="notice-title" />
          <slot name="notice-message" />
          <slot name="notice-link" />
        </div>
        {this.dismissible ? closeButton : null}
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Fired when an notice is closed */
  @Event() calciteNoticeClose: EventEmitter;

  /** Fired when an Notice is opened */
  @Event() calciteNoticeOpen: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** close the notice emit the `calciteNoticeClose` event - <calcite-notice> listens for this */
  @Method() async close(): Promise<void> {
    this.active = false;
    this.calciteNoticeClose.emit();
  }

  /** open the notice and emit the `calciteNoticeOpen` event - <calcite-notice> listens for this  */
  @Method() async open(): Promise<void> {
    this.active = true;
    this.calciteNoticeOpen.emit();
  }

  /** focus the close button, if present and requested */
  @Method()
  async setFocus(): Promise<void> {
    if (!this.closeButton && !this.noticeLinkEl) {
      return;
    }
    if (this.noticeLinkEl) this.noticeLinkEl.setFocus();
    else if (this.closeButton) {
      this.closeButton.focus();
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /** the close button element */
  private closeButton?: HTMLElement;

  /** the notice link child element  */
  private noticeLinkEl?: HTMLCalciteLinkElement;

  private iconDefaults = {
    green: "checkCircle",
    yellow: "exclamationMarkTriangle",
    red: "exclamationMarkTriangle",
    blue: "lightbulb"
  };

  private renderIcon(): VNode {
    const path = this.iconDefaults[this.color];
    return (
      <div class="notice-icon">
        <calcite-icon icon={path} scale="m" />
      </div>
    );
  }
}
