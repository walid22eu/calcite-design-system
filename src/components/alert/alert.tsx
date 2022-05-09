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
import { getSlotted, setRequestedIcon, toAriaBoolean } from "../../utils/dom";
import { DURATIONS, SLOTS, TEXT } from "./resources";
import { Scale } from "../interfaces";
import { AlertDuration, AlertPlacement, StatusColor, StatusIcons } from "./interfaces";

/** Alerts are meant to provide a way to communicate urgent or important information to users, frequently as a result of an action they took in your app. Alerts are positioned
 * at the bottom of the page. Multiple opened alerts will be added to a queue, allowing users to dismiss them in the order they are provided.
 */

/**
 * @slot title - Title of the alert (optional)
 * @slot message - Main text of the alert
 * @slot link - Optional action to take from the alert (undo, try again, link to page, etc.)
 */

@Component({
  tag: "calcite-alert",
  styleUrl: "alert.scss",
  shadow: true
})
export class Alert {
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
    if (this.active && !this.queued) {
      this.calciteAlertRegister.emit();
    }
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

  /** string to override English close text
   * @default "Close"
   */
  @Prop() intlClose: string = TEXT.intlClose;

  /** Accessible name for the component */
  @Prop() label!: string;

  /** specify the placement of the alert */
  @Prop() placement: AlertPlacement = "bottom";

  /** specify the scale of the alert, defaults to m */
  @Prop({ reflect: true }) scale: Scale = "m";

  @Watch("icon")
  @Watch("color")
  updateRequestedIcon(): void {
    this.requestedIcon = setRequestedIcon(StatusIcons, this.icon, this.color);
  }

  @Watch("autoDismissDuration")
  updateDuration(): void {
    if (this.autoDismiss && this.autoDismissTimeoutId) {
      window.clearTimeout(this.autoDismissTimeoutId);
      this.autoDismissTimeoutId = window.setTimeout(
        () => this.closeAlert(),
        DURATIONS[this.autoDismissDuration] - (Date.now() - this.trackTimer)
      );
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    if (this.active && !this.queued) {
      this.calciteAlertRegister.emit();
    }
  }

  componentWillLoad(): void {
    this.requestedIcon = setRequestedIcon(StatusIcons, this.icon, this.color);
  }

  disconnectedCallback(): void {
    window.clearTimeout(this.autoDismissTimeoutId);
  }

  render(): VNode {
    const closeButton = (
      <button
        aria-label={this.intlClose}
        class="alert-close"
        onClick={this.closeAlert}
        ref={(el) => (this.closeButton = el)}
        type="button"
      >
        <calcite-icon icon="x" scale={this.scale === "l" ? "m" : "s"} />
      </button>
    );
    const queueText = `+${this.queueLength > 2 ? this.queueLength - 1 : 1}`;
    const queueCount = (
      <div class={`${this.queueLength > 1 ? "active " : ""}alert-queue-count`}>
        <calcite-chip scale={this.scale} value={queueText}>
          {queueText}
        </calcite-chip>
      </div>
    );

    const { active, autoDismiss, label, placement, queued, requestedIcon } = this;
    const role = autoDismiss ? "alert" : "alertdialog";
    const hidden = !active;
    return (
      <Host
        aria-hidden={toAriaBoolean(hidden)}
        aria-label={label}
        calcite-hydrated-hidden={hidden}
        role={role}
      >
        <div
          class={{
            container: true,
            queued,
            [placement]: true
          }}
          onTransitionEnd={this.transitionEnd}
        >
          {requestedIcon ? (
            <div class="alert-icon">
              <calcite-icon icon={requestedIcon} scale={this.scale === "l" ? "m" : "s"} />
            </div>
          ) : null}
          <div class="alert-content">
            <slot name={SLOTS.title} />
            <slot name={SLOTS.message} />
            <slot name={SLOTS.link} />
          </div>
          {queueCount}
          {!autoDismiss ? closeButton : null}
          {active && !queued && autoDismiss ? <div class="alert-dismiss-progress" /> : null}
        </div>
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

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    const alertLinkEl: HTMLCalciteLinkElement = getSlotted(this.el, { selector: "calcite-link" });

    if (!this.closeButton && !alertLinkEl) {
      return;
    } else if (alertLinkEl) {
      alertLinkEl.setFocus();
    } else if (this.closeButton) {
      this.closeButton.focus();
    }
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

  private autoDismissTimeoutId: number = null;

  private queueTimeout: number;

  private trackTimer = Date.now();

  /** the computed icon to render */
  /* @internal */
  @State() requestedIcon?: string;

  private activeTransitionProp = "opacity";

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  /** determine which alert is active */
  private determineActiveAlert(): void {
    if (this.queue?.[0] === this.el) {
      this.openAlert();
      if (this.autoDismiss && !this.autoDismissTimeoutId) {
        this.trackTimer = Date.now();
        this.autoDismissTimeoutId = window.setTimeout(
          () => this.closeAlert(),
          DURATIONS[this.autoDismissDuration]
        );
      }
    } else {
      return;
    }
  }

  /** close and emit the closed alert and the queue */
  private closeAlert = (): void => {
    this.autoDismissTimeoutId = null;
    this.queued = false;
    this.active = false;
    this.queue = this.queue.filter((e) => e !== this.el);
    this.determineActiveAlert();
    this.calciteAlertSync.emit({ queue: this.queue });
  };

  transitionEnd = (event: TransitionEvent): void => {
    if (event.propertyName === this.activeTransitionProp) {
      this.active
        ? this.calciteAlertOpen.emit({
            el: this.el,
            queue: this.queue
          })
        : this.calciteAlertClose.emit({
            el: this.el,
            queue: this.queue
          });
    }
  };

  /** emit the opened alert and the queue */
  private openAlert(): void {
    window.clearTimeout(this.queueTimeout);
    this.queueTimeout = window.setTimeout(() => (this.queued = false), 300);
  }
}
