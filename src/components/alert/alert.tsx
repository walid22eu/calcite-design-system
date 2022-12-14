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
import {
  getSlotted,
  setRequestedIcon,
  toAriaBoolean,
  slotChangeHasAssignedElement
} from "../../utils/dom";
import { CSS, DURATIONS, SLOTS, TEXT } from "./resources";
import { Scale } from "../interfaces";
import { AlertDuration, AlertPlacement, StatusColor, StatusIcons, Sync } from "./interfaces";
import {
  OpenCloseComponent,
  connectOpenCloseComponent,
  disconnectOpenCloseComponent
} from "../../utils/openCloseComponent";
import {
  LocalizedComponent,
  connectLocalized,
  disconnectLocalized,
  NumberingSystem,
  numberStringFormatter
} from "../../utils/locale";
import {
  setUpLoadableComponent,
  setComponentLoaded,
  LoadableComponent,
  componentLoaded
} from "../../utils/loadable";

/**
 * Alerts are meant to provide a way to communicate urgent or important information to users, frequently as a result of an action they took in your app. Alerts are positioned
 * at the bottom of the page. Multiple opened alerts will be added to a queue, allowing users to dismiss them in the order they are provided.
 */

/**
 * @slot title - A slot for adding a title to the component.
 * @slot message - A slot for adding main text to the component.
 * @slot link - A slot for adding a `calcite-action` to take from the component such as: "undo", "try again", "link to page", etc.
 * @slot actions-end - A slot for adding actions to the end of the component. It is recommended to use two or fewer actions.
 */

@Component({
  tag: "calcite-alert",
  styleUrl: "alert.scss",
  shadow: true
})
export class Alert implements OpenCloseComponent, LocalizedComponent, LoadableComponent {
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

  /** When `true`, displays and positions the component. */
  @Prop({ reflect: true, mutable: true }) open = false;

  @Watch("open")
  openHandler(): void {
    if (this.open && !this.queued) {
      this.calciteInternalAlertRegister.emit();
    }
    if (!this.open) {
      this.queue = this.queue.filter((el) => el !== this.el);
      this.calciteInternalAlertSync.emit({ queue: this.queue });
    }
  }

  /** When `true`, the component closes automatically (recommended for passive, non-blocking alerts). */
  @Prop({ reflect: true }) autoClose = false;

  /** Specifies the duration before the component automatically closes (only use with `autoClose`). */
  @Prop({ reflect: true }) autoCloseDuration: AlertDuration = this.autoClose ? "medium" : null;

  /** Specifies the color for the component (will apply to top border and icon). */
  @Prop({ reflect: true }) color: StatusColor = "blue";

  /**
   * When `true`, shows a default recommended icon. Alternatively,
   * pass a Calcite UI Icon name to display a specific icon.
   */
  @Prop({ reflect: true }) icon: string | boolean;

  /**
   * Specifies the text label for the close button.
   *
   * @default "Close"
   */
  @Prop() intlClose: string = TEXT.intlClose;

  /** Specifies an accessible name for the component. */
  @Prop() label!: string;

  /**
   * Specifies the Unicode numeral system used by the component for localization.
   */
  @Prop({ reflect: true }) numberingSystem: NumberingSystem;

  /** Specifies the placement of the component */
  @Prop({ reflect: true }) placement: AlertPlacement = "bottom";

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale = "m";

  @Watch("icon")
  @Watch("color")
  updateRequestedIcon(): void {
    this.requestedIcon = setRequestedIcon(StatusIcons, this.icon, this.color);
  }

  @Watch("autoCloseDuration")
  updateDuration(): void {
    if (this.autoClose && this.autoCloseTimeoutId) {
      window.clearTimeout(this.autoCloseTimeoutId);
      this.autoCloseTimeoutId = window.setTimeout(
        () => this.closeAlert(),
        DURATIONS[this.autoCloseDuration] - (Date.now() - this.trackTimer)
      );
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    connectLocalized(this);
    const open = this.open;
    if (open && !this.queued) {
      this.openHandler();
      this.calciteInternalAlertRegister.emit();
    }
    connectOpenCloseComponent(this);
  }

  componentWillLoad(): void {
    setUpLoadableComponent(this);
    this.requestedIcon = setRequestedIcon(StatusIcons, this.icon, this.color);
  }

  componentDidLoad(): void {
    setComponentLoaded(this);
  }

  disconnectedCallback(): void {
    window.clearTimeout(this.autoCloseTimeoutId);
    window.clearTimeout(this.queueTimeout);
    disconnectOpenCloseComponent(this);
    disconnectLocalized(this);
  }

  render(): VNode {
    const { hasEndActions } = this;
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

    numberStringFormatter.numberFormatOptions = {
      locale: this.effectiveLocale,
      numberingSystem: this.numberingSystem,
      signDisplay: "always"
    };

    const queueNumber = this.queueLength > 2 ? this.queueLength - 1 : 1;
    const queueText = numberStringFormatter.numberFormatter.format(queueNumber);

    const queueCount = (
      <div class={`${this.queueLength > 1 ? "active " : ""}alert-queue-count`}>
        <calcite-chip scale={this.scale} value={queueText}>
          {queueText}
        </calcite-chip>
      </div>
    );

    const { open, autoClose, label, placement, queued, requestedIcon } = this;
    const role = autoClose ? "alert" : "alertdialog";
    const hidden = !open;

    const slotNode = (
      <slot
        key="actionsEndSlot"
        name={SLOTS.actionsEnd}
        onSlotchange={this.actionsEndSlotChangeHandler}
      />
    );

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
          onPointerOut={this.autoClose && this.autoCloseTimeoutId ? this.handleMouseLeave : null}
          onPointerOver={this.autoClose && this.autoCloseTimeoutId ? this.handleMouseOver : null}
          ref={this.setTransitionEl}
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
          <div class={CSS.actionsEnd} hidden={!hasEndActions}>
            {slotNode}
          </div>
          {this.queueLength > 1 ? queueCount : null}
          {closeButton}
          {open && !queued && autoClose ? <div class="alert-dismiss-progress" /> : null}
        </div>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Fires when the component is requested to be closed and before the closing transition begins. */
  @Event({ cancelable: false }) calciteAlertBeforeClose: EventEmitter<void>;

  /** Fires when the component is closed and animation is complete. */
  @Event({ cancelable: false }) calciteAlertClose: EventEmitter<void>;

  /** Fires when the component is added to the DOM but not rendered, and before the opening transition begins. */
  @Event({ cancelable: false }) calciteAlertBeforeOpen: EventEmitter<void>;

  /** Fires when the component is open and animation is complete. */
  @Event({ cancelable: false }) calciteAlertOpen: EventEmitter<void>;

  /**
   * Fires to sync queue when opened or closed.
   *
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalAlertSync: EventEmitter<Sync>;

  /**
   * Fires when the component is added to DOM - used to receive initial queue.
   *
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalAlertRegister: EventEmitter<void>;

  // when an alert is opened or closed, update queue and determine active alert
  @Listen("calciteInternalAlertSync", { target: "window" })
  alertSync(event: CustomEvent): void {
    if (this.queue !== event.detail.queue) {
      this.queue = event.detail.queue;
    }
    this.queueLength = this.queue.length;
    this.determineActiveAlert();
    event.stopPropagation();
  }

  // when an alert is first registered, trigger a queue sync
  @Listen("calciteInternalAlertRegister", { target: "window" })
  alertRegister(): void {
    if (this.open && !this.queue.includes(this.el as HTMLCalciteAlertElement)) {
      this.queued = true;
      this.queue.push(this.el as HTMLCalciteAlertElement);
    }
    this.calciteInternalAlertSync.emit({ queue: this.queue });
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
    await componentLoaded(this);

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

  @State() effectiveLocale = "";

  @State() hasEndActions = false;

  /** the list of queued alerts */
  @State() queue: HTMLCalciteAlertElement[] = [];

  /** the count of queued alerts */
  @State() queueLength = 0;

  /** is the alert queued */
  @State() queued = false;

  /** the close button element */
  private closeButton?: HTMLButtonElement;

  private autoCloseTimeoutId: number = null;

  private queueTimeout: number;

  private trackTimer: number;

  private remainingPausedTimeout = 0;

  /** the computed icon to render */
  /* @internal */
  @State() requestedIcon?: string;

  openTransitionProp = "opacity";

  transitionEl: HTMLDivElement;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private setTransitionEl = (el): void => {
    this.transitionEl = el;
    connectOpenCloseComponent(this);
  };

  /** determine which alert is active */
  private determineActiveAlert(): void {
    if (this.queue?.[0] === this.el) {
      this.openAlert();
      if (this.autoClose && !this.autoCloseTimeoutId) {
        this.trackTimer = Date.now();
        this.autoCloseTimeoutId = window.setTimeout(
          () => this.closeAlert(),
          DURATIONS[this.autoCloseDuration]
        );
      }
    } else {
      return;
    }
  }

  /** close and emit calciteInternalAlertSync event with the updated queue payload */
  private closeAlert = (): void => {
    this.autoCloseTimeoutId = null;
    this.queued = false;
    this.open = false;
    this.queue = this.queue.filter((el) => el !== this.el);
    this.determineActiveAlert();
    this.calciteInternalAlertSync.emit({ queue: this.queue });
  };

  onBeforeOpen(): void {
    this.calciteAlertBeforeOpen.emit();
  }

  onOpen(): void {
    this.calciteAlertOpen.emit();
  }

  onBeforeClose(): void {
    this.calciteAlertBeforeClose.emit();
  }

  onClose(): void {
    this.calciteAlertClose.emit();
  }

  /** remove queued class after animation completes */
  private openAlert(): void {
    window.clearTimeout(this.queueTimeout);
    this.queueTimeout = window.setTimeout(() => (this.queued = false), 300);
  }

  private actionsEndSlotChangeHandler = (event: Event): void => {
    this.hasEndActions = slotChangeHasAssignedElement(event);
  };

  private handleMouseOver = (): void => {
    window.clearTimeout(this.autoCloseTimeoutId);
    this.remainingPausedTimeout = DURATIONS[this.autoCloseDuration] - Date.now() - this.trackTimer;
  };

  private handleMouseLeave = (): void => {
    this.autoCloseTimeoutId = window.setTimeout(
      () => this.closeAlert(),
      this.remainingPausedTimeout
    );
  };
}
