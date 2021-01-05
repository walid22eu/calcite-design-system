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
  State,
  VNode,
  Watch
} from "@stencil/core";
import { getElementDir, setRequestedIcon } from "../../utils/dom";
import { DURATIONS, TEXT } from "./calcite-alert.resources";
import { Scale, Theme } from "../interfaces";
import { StatusColor, AlertDuration, StatusIcons } from "./interfaces";

/** Alerts are meant to provide a way to communicate urgent or important information to users, frequently as a result of an action they took in your app. Alerts are positioned
 * at the bottom of the page. Multiple opened alerts will be added to a queue, allowing users to dismiss them in the order they are provided.
 */

/**
 * @slot alert-title - Title of the alert (optional)
 * @slot alert-message - Main text of the alert
 * @slot alert-link - Optional action to take from the alert (undo, try again, link to page, etc.)
 */

@Component({
  tag: "calcite-alert",
  styleUrl: "calcite-alert.scss",
  shadow: true
})
export class CalciteAlert {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteAlertElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //---------------------------------------------------------------------------

  /** Is the alert currently active or not */
  @Prop({ reflect: true, mutable: true }) active = false;

  @Watch("active")
  watchActive(): void {
    if (this.active && !this.queued) this.calciteAlertRegister.emit();
    if (!this.active) {
      this.queue = this.queue.filter((e) => e !== this.el);
      this.calciteAlertSync.emit({ queue: this.queue });
    }
  }

  /** Close the alert automatically (recommended for passive, non-blocking alerts) */
  @Prop() autoDismiss = false;

  /** Duration of autoDismiss (only used with `autoDismiss`) */
  @Prop({ reflect: true }) autoDismissDuration: AlertDuration = this.autoDismiss ? "medium" : null;

  /** Color for the alert (will apply to top border and icon) */
  @Prop({ reflect: true }) color: StatusColor = "blue";

  /** when used as a boolean set to true, show a default recommended icon. You can
   * also pass a calcite-ui-icon name to this prop to display a requested icon */
  @Prop({ reflect: true }) icon: string | boolean;

  /** string to override English close text */
  @Prop() intlClose: string = TEXT.intlClose;

  /** Accessible name for the component */
  @Prop() label!: string;

  /** specify the scale of the button, defaults to m */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** Select theme (light or dark) */
  @Prop({ reflect: true }) theme: Theme;

  @Watch("icon")
  @Watch("color")
  updateRequestedIcon(): void {
    this.requestedIcon = setRequestedIcon(StatusIcons, this.icon, this.color);
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    if (this.active && !this.queued) this.calciteAlertRegister.emit();
  }

  componentWillLoad(): void {
    this.requestedIcon = setRequestedIcon(StatusIcons, this.icon, this.color);
  }

  componentDidLoad(): void {
    this.alertLinkEl = this.el.querySelectorAll("calcite-link")[0] as HTMLCalciteLinkElement;
  }

  render(): VNode {
    const dir = getElementDir(this.el);
    const closeButton = (
      <button
        aria-label={this.intlClose}
        class="alert-close"
        onClick={this.closeAlert}
        ref={(el) => (this.closeButton = el)}
        type="button"
      >
        <calcite-icon icon="x" scale="m" />
      </button>
    );
    const queueCount = (
      <div class={`${this.queueLength > 1 ? "active " : ""}alert-queue-count`}>
        +{this.queueLength > 2 ? this.queueLength - 1 : 1}
      </div>
    );

    const { active } = this;
    const progress = <div class="alert-dismiss-progress" />;
    const role = this.autoDismiss ? "alert" : "alertdialog";
    const hidden = !active;

    return (
      <Host
        active={active}
        aria-hidden={hidden.toString()}
        aria-label={this.label}
        calcite-hydrated-hidden={hidden}
        dir={dir}
        queued={this.queued}
        role={role}
      >
        {this.requestedIcon ? (
          <div class="alert-icon">
            <calcite-icon icon={this.requestedIcon} scale="m" />
          </div>
        ) : null}
        <div class="alert-content">
          <slot name="alert-title" />
          <slot name="alert-message" />
          <slot name="alert-link" />
        </div>
        {queueCount}
        {!this.autoDismiss ? closeButton : null}
        {this.active && !this.queued && this.autoDismiss ? progress : null}
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Fired when an alert is closed */
  @Event() calciteAlertClose: EventEmitter;

  /** Fired when an alert is opened */
  @Event() calciteAlertOpen: EventEmitter;

  /**
   * Fired to sync queue when opened or closed
   *
   * @internal
   */
  @Event() calciteAlertSync: EventEmitter;

  /**
   * Fired when an alert is added to dom - used to receive initial queue
   *
   * @internal
   */
  @Event() calciteAlertRegister: EventEmitter;

  // when an alert is opened or closed, update queue and determine active alert
  @Listen("calciteAlertSync", { target: "window" })
  alertSync(event: CustomEvent): void {
    if (this.queue !== event.detail.queue) {
      this.queue = event.detail.queue;
    }
    this.queueLength = this.queue.length;
    this.determineActiveAlert();
  }

  // when an alert is first registered, trigger a queue sync to get queue
  @Listen("calciteAlertRegister", { target: "window" })
  alertRegister(): void {
    if (this.active && !this.queue.includes(this.el as HTMLCalciteAlertElement)) {
      this.queued = true;
      this.queue.push(this.el as HTMLCalciteAlertElement);
    }
    this.calciteAlertSync.emit({ queue: this.queue });
    this.determineActiveAlert();
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** focus either the slotted alert-link or the close button */
  @Method()
  async setFocus(): Promise<void> {
    if (!this.closeButton && !this.alertLinkEl) return;
    else if (this.alertLinkEl) this.alertLinkEl.setFocus();
    else if (this.closeButton) this.closeButton.focus();
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /** the list of queued alerts */
  @State() queue: HTMLCalciteAlertElement[] = [];

  /** the count of queued alerts */
  @State() queueLength = 0;

  /** is the alert queued */
  @State() queued = false;

  /** the close button element */
  private closeButton?: HTMLButtonElement;

  /** the slotted alert link child element  */
  private alertLinkEl?: HTMLCalciteLinkElement;

  /** the computed icon to render */
  /* @internal */
  @State() requestedIcon?: string;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  /** determine which alert is active */
  private determineActiveAlert(): void {
    if (this.queue?.[0] === this.el) {
      this.openAlert();
      if (this.autoDismiss) {
        setTimeout(() => this.closeAlert(), DURATIONS[this.autoDismissDuration]);
      }
    } else return;
  }

  /** close and emit the closed alert and the queue */
  private closeAlert = (): void => {
    this.queued = false;
    this.active = false;
    this.queue = this.queue.filter((e) => e !== this.el);
    this.determineActiveAlert();
    this.calciteAlertSync.emit({ queue: this.queue });
    this.calciteAlertClose.emit({
      el: this.el,
      queue: this.queue
    });
  };

  /** emit the opened alert and the queue */
  private openAlert(): void {
    setTimeout(() => (this.queued = false), 300);
    this.calciteAlertOpen.emit({
      el: this.el,
      queue: this.queue
    });
  }
}
