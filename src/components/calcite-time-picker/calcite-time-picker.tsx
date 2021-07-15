import {
  Component,
  Element,
  Host,
  h,
  Prop,
  VNode,
  Event,
  EventEmitter,
  Watch,
  State,
  Listen,
  Method
} from "@stencil/core";
import { Scale } from "../interfaces";
import { getKey, isActivationKey, numberKeys } from "../../utils/key";
import { isValidNumber } from "../../utils/number";

import {
  Meridiem,
  formatTimePart,
  MinuteOrSecond,
  Time,
  maxTenthForMinuteAndSecond,
  TimeFocusId,
  getMeridiem,
  getMeridiemHour,
  HourDisplayFormat
} from "../../utils/time";
import { CSS, TEXT } from "./resources";

@Component({
  tag: "calcite-time-picker",
  styleUrl: "calcite-time-picker.scss",
  shadow: true
})
export class CalciteTimePicker {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteTimePickerElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** The hour value (24-hour format) */
  @Prop({ mutable: true }) hour?: string = null;

  /** Format of the hour value (12-hour or 24-hour) (this will be replaced by locale eventually) */
  @Prop({ reflect: true }) hourDisplayFormat: HourDisplayFormat = "12";

  /** aria-label for the hour input
   * @default "Hour"
   */
  @Prop() intlHour = TEXT.hour;

  /** aria-label for the hour down button
   * @default "Decrease hour"
   */
  @Prop() intlHourDown = TEXT.hourDown;

  /** aria-label for the hour up button
   * @default "Increase hour"
   */
  @Prop() intlHourUp = TEXT.hourUp;

  /** aria-label for the meridiem (am/pm) input
   * @default "AM/PM"
   */
  @Prop() intlMeridiem = TEXT.meridiem;

  /** aria-label for the meridiem (am/pm) down button
   * @default "Decrease AM/PM"
   */
  @Prop() intlMeridiemDown = TEXT.meridiemDown;

  /** aria-label for the meridiem (am/pm) up button
   * @default "Increase AM/PM"
   */
  @Prop() intlMeridiemUp = TEXT.meridiemUp;

  /** aria-label for the minute input
   * @default "Minute"
   */
  @Prop() intlMinute = TEXT.minute;

  /** aria-label for the minute down button
   * @default "Decrease minute"
   */
  @Prop() intlMinuteDown = TEXT.minuteDown;

  /** aria-label for the minute up button
   * @default "Increase minute"
   */
  @Prop() intlMinuteUp = TEXT.minuteUp;

  /** aria-label for the second input
   * @default "Second"
   */
  @Prop() intlSecond = TEXT.second;

  /** aria-label for the second down button
   * @default "Decrease second"
   */
  @Prop() intlSecondDown = TEXT.secondDown;

  /** aria-label for the second up button
   * @default "Increase second"
   */
  @Prop() intlSecondUp = TEXT.secondUp;

  /** The minute value */
  @Prop({ mutable: true }) minute?: string = null;

  /** The second value */
  @Prop({ mutable: true }) second?: string = null;

  /** The scale (size) of the time picker */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** number that specifies the granularity that the value must adhere to */
  @Prop({ reflect: true }) step = 60;

  @Watch("hour")
  hourChanged(newHour: string): void {
    if (this.hourDisplayFormat === "12" && isValidNumber(newHour)) {
      this.meridiem = getMeridiem(newHour);
    }
  }

  @Watch("hour")
  @Watch("minute")
  @Watch("second")
  timeChangeHandler(): void {
    const { hour, minute } = this.getTime();
    if (!hour && !minute) {
      this.setTime("meridiem", null, false);
    }
    if (this.timeChanged) {
      this.timeChanged = false;
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  private activeEl: HTMLSpanElement;

  private meridiemEl: HTMLSpanElement;

  private hourEl: HTMLSpanElement;

  private minuteEl: HTMLSpanElement;

  private secondEl: HTMLSpanElement;

  private timeChanged = false;

  // --------------------------------------------------------------------------
  //
  //  State
  //
  // --------------------------------------------------------------------------

  /** The am/pm value */
  @State() meridiem: Meridiem = null;

  @State() displayHour: string = this.getDisplayHour();

  @State() editingHourWhileFocused = false;

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event() calciteTimePickerBlur: EventEmitter<Time>;

  /**
   * @internal
   */
  @Event() calciteTimePickerChange: EventEmitter<Time>;

  /**
   * @internal
   */
  @Event() calciteTimePickerFocus: EventEmitter<Time>;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("blur")
  hostBlurHandler(): void {
    this.calciteTimePickerBlur.emit();
  }

  @Listen("focus")
  hostFocusHandler(): void {
    this.calciteTimePickerFocus.emit();
  }

  @Listen("keydown")
  keyDownHandler(event: KeyboardEvent): void {
    const key = getKey(event.key);
    switch (this.activeEl) {
      case this.hourEl:
        if (key === "ArrowRight") {
          this.setFocus("minute");
        }
        break;
      case this.minuteEl:
        switch (key) {
          case "ArrowLeft":
            this.setFocus("hour");
            break;
          case "ArrowRight":
            if (this.step !== 60) {
              this.setFocus("second");
            } else if (this.hourDisplayFormat === "12") {
              this.setFocus("meridiem");
            }
            break;
        }
        break;
      case this.secondEl:
        switch (key) {
          case "ArrowLeft":
            this.setFocus("minute");
            break;
          case "ArrowRight":
            if (this.hourDisplayFormat === "12") {
              this.setFocus("meridiem");
            }
            break;
        }
        break;
      case this.meridiemEl:
        switch (key) {
          case "ArrowLeft":
            if (this.step !== 60) {
              this.setFocus("second");
            } else {
              this.setFocus("minute");
            }
            break;
        }
        break;
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  @Method()
  async setFocus(target: TimeFocusId): Promise<void> {
    this[`${target || "hour"}El`]?.focus();
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  private decrementHour = (): void => {
    const newHour = !this.hour ? 0 : this.hour === "00" ? 23 : parseInt(this.hour) - 1;
    this.setTime("hour", newHour);
  };

  private decrementMeridiem = (): void => {
    const newMeridiem = this.meridiem === "PM" ? "AM" : "PM";
    this.setTime("meridiem", newMeridiem);
  };

  private decrementMinuteOrSecond = (key: MinuteOrSecond): void => {
    let newValue;
    if (isValidNumber(this[key])) {
      const valueAsNumber = parseInt(this[key]);
      if (valueAsNumber === 0) {
        newValue = 59;
      } else {
        newValue = valueAsNumber - 1;
      }
    } else {
      newValue = 59;
    }
    this.setTime(key, newValue);
  };

  private decrementMinute = (): void => {
    this.decrementMinuteOrSecond("minute");
  };

  private decrementSecond = (): void => {
    this.decrementMinuteOrSecond("second");
  };

  private buttonActivated(event: KeyboardEvent): boolean {
    const key = getKey(event.key);

    if (key === " ") {
      event.preventDefault();
    }

    return isActivationKey(key);
  }

  private focusHandler = (event: FocusEvent): void => {
    this.activeEl = event.currentTarget as HTMLSpanElement;
  };

  private getDisplayHour(): string {
    if (!this.hour) {
      return "--";
    }
    if (this.hourDisplayFormat === "12") {
      return this.editingHourWhileFocused ? this.hour : getMeridiemHour(this.hour);
    }
    return this.hour;
  }

  private getTime(): Time {
    return {
      hour: this.hour,
      minute: this.minute,
      second: this.second
    };
  }

  private hourBlurHandler = (): void => {
    this.editingHourWhileFocused = false;
  };

  private hourDownButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.decrementHour();
    }
  };

  private hourKeyDownHandler = (event: KeyboardEvent): void => {
    const key = getKey(event.key);
    if (numberKeys.includes(key)) {
      this.editingHourWhileFocused = true;
      const keyAsNumber = parseInt(key);
      let newHour;
      if (isValidNumber(this.hour)) {
        switch (this.hourDisplayFormat) {
          case "12":
            if (this.hour === "01" && keyAsNumber >= 0 && keyAsNumber <= 2) {
              newHour = `1${keyAsNumber}`;
            } else {
              newHour = keyAsNumber;
            }
            break;
          case "24":
            if (this.hour === "01") {
              newHour = `1${keyAsNumber}`;
            } else if (this.hour === "02" && keyAsNumber >= 0 && keyAsNumber <= 3) {
              newHour = `2${keyAsNumber}`;
            } else {
              newHour = keyAsNumber;
            }
            break;
        }
      } else {
        newHour = keyAsNumber;
      }
      this.setTime("hour", newHour);
    } else {
      switch (key) {
        case "Backspace":
          this.setTime("hour", null);
          break;
        case "ArrowDown":
          event.preventDefault();
          this.decrementHour();
          break;
        case "ArrowUp":
          event.preventDefault();
          this.incrementHour();
          break;
        case " ":
        case "Spacebar":
          event.preventDefault();
          break;
      }
    }
  };

  private hourUpButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.incrementHour();
    }
  };

  private incrementMeridiem = (): void => {
    const newMeridiem = this.meridiem === "AM" ? "PM" : "AM";
    this.setTime("meridiem", newMeridiem);
  };

  private incrementHour = (): void => {
    const newHour = isValidNumber(this.hour)
      ? this.hour === "23"
        ? 0
        : parseInt(this.hour) + 1
      : 1;
    this.setTime("hour", newHour);
  };

  private incrementMinuteOrSecond = (key: MinuteOrSecond): void => {
    const newValue = isValidNumber(this[key])
      ? this[key] === "59"
        ? 0
        : parseInt(this[key]) + 1
      : 0;
    this.setTime(key, newValue);
  };

  private incrementMinute = (): void => {
    this.incrementMinuteOrSecond("minute");
  };

  private incrementSecond = (): void => {
    this.incrementMinuteOrSecond("second");
  };

  private meridiemDownButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.decrementMeridiem();
    }
  };

  private meridiemKeyDownHandler = (event: KeyboardEvent): void => {
    switch (getKey(event.key)) {
      case "a":
        this.setTime("meridiem", "AM");
        break;
      case "p":
        this.setTime("meridiem", "PM");
        break;
      case "Backspace":
        this.setTime("meridiem", null);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.incrementMeridiem();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.decrementMeridiem();
        break;
      case " ":
      case "Spacebar":
        event.preventDefault();
        break;
    }
  };

  private meridiemUpButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.incrementMeridiem();
    }
  };

  private minuteDownButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.decrementMinute();
    }
  };

  private minuteKeyDownHandler = (event: KeyboardEvent): void => {
    const key = getKey(event.key);
    if (numberKeys.includes(key)) {
      const keyAsNumber = parseInt(key);
      let newMinute;
      if (isValidNumber(this.minute) && this.minute.startsWith("0")) {
        const minuteAsNumber = parseInt(this.minute);
        if (minuteAsNumber > maxTenthForMinuteAndSecond) {
          newMinute = keyAsNumber;
        } else {
          newMinute = `${minuteAsNumber}${keyAsNumber}`;
        }
      } else {
        newMinute = keyAsNumber;
      }
      this.setTime("minute", newMinute);
    } else {
      switch (key) {
        case "Backspace":
          this.setTime("minute", null);
          break;
        case "ArrowDown":
          event.preventDefault();
          this.decrementMinute();
          break;
        case "ArrowUp":
          event.preventDefault();
          this.incrementMinute();
          break;
        case " ":
        case "Spacebar":
          event.preventDefault();
          break;
      }
    }
  };

  private minuteUpButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.incrementMinute();
    }
  };

  private secondDownButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.decrementSecond();
    }
  };

  private secondKeyDownHandler = (event: KeyboardEvent): void => {
    const key = getKey(event.key);
    if (numberKeys.includes(key)) {
      const keyAsNumber = parseInt(key);
      let newSecond;
      if (isValidNumber(this.second) && this.second.startsWith("0")) {
        const secondAsNumber = parseInt(this.second);
        if (secondAsNumber > maxTenthForMinuteAndSecond) {
          newSecond = keyAsNumber;
        } else {
          newSecond = `${secondAsNumber}${keyAsNumber}`;
        }
      } else {
        newSecond = keyAsNumber;
      }
      this.setTime("second", newSecond);
    } else {
      switch (key) {
        case "Backspace":
          this.setTime("second", null);
          break;
        case "ArrowDown":
          event.preventDefault();
          this.decrementSecond();
          break;
        case "ArrowUp":
          event.preventDefault();
          this.incrementSecond();
          break;
        case " ":
        case "Spacebar":
          event.preventDefault();
          break;
      }
    }
  };

  private secondUpButtonKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.buttonActivated(event)) {
      this.incrementSecond();
    }
  };

  private setTime = (
    key: "hour" | "minute" | "second" | "meridiem",
    value: number | string | Meridiem,
    emit = true
  ): void => {
    switch (key) {
      default:
        return;
      case "hour":
        this.hour = typeof value === "number" ? formatTimePart(value) : value;
        break;
      case "minute":
        this.minute = typeof value === "number" ? formatTimePart(value) : value;
        break;
      case "second":
        this.second = typeof value === "number" ? formatTimePart(value) : value;
        break;
      case "meridiem":
        if (isValidNumber(this.hour)) {
          const hourAsNumber = parseInt(this.hour);
          switch (value) {
            case "AM":
              if (hourAsNumber >= 12) {
                this.hour = formatTimePart(hourAsNumber - 12);
              }
              break;
            case "PM":
              if (hourAsNumber < 12) {
                this.hour = formatTimePart(hourAsNumber + 12);
              }
              break;
          }
          this.meridiem = value as Meridiem;
        } else {
          this.meridiem = value as Meridiem;
        }
        break;
    }
    this.timeChanged = true;
    if (emit) {
      this.calciteTimePickerChange.emit(this.getTime());
    }
  };

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback() {
    if (this.hourDisplayFormat === "12") {
      this.meridiem = getMeridiem(this.hour);
    }
    if (isValidNumber(this.hour)) {
      this.hour = formatTimePart(parseInt(this.hour));
    }
    if (isValidNumber(this.minute)) {
      this.minute = formatTimePart(parseInt(this.minute));
    }
    if (isValidNumber(this.second)) {
      this.second = formatTimePart(parseInt(this.second));
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const iconScale = this.scale === "s" || this.scale === "m" ? "s" : "m";
    const includeSeconds = this.step !== 60;
    const hourIsNumber = isValidNumber(this.hour);
    const minuteIsNumber = isValidNumber(this.minute);
    const secondIsNumber = isValidNumber(this.second);
    return (
      <Host>
        <div class={CSS.timePicker}>
          <div role="group">
            <span
              aria-label={this.intlHourUp}
              class={{
                [CSS.button]: true,
                [CSS.buttonHourUp]: true,
                [CSS.buttonTopLeft]: true
              }}
              onClick={this.incrementHour}
              onKeyDown={this.hourUpButtonKeyDownHandler}
              role="button"
              tabIndex={-1}
            >
              <calcite-icon icon="chevron-up" scale={iconScale} />
            </span>
            <span
              aria-label={this.intlHour}
              aria-valuemax="23"
              aria-valuemin="1"
              aria-valuenow={hourIsNumber && parseInt(this.hour)}
              aria-valuetext={this.hour}
              class={{
                [CSS.input]: true,
                [CSS.hour]: true
              }}
              onBlur={this.hourBlurHandler}
              onFocus={this.focusHandler}
              onKeyDown={this.hourKeyDownHandler}
              ref={(el) => (this.hourEl = el)}
              role="spinbutton"
              tabIndex={0}
            >
              {this.getDisplayHour()}
            </span>
            <span
              aria-label={this.intlHourDown}
              class={{
                [CSS.button]: true,
                [CSS.buttonHourDown]: true,
                [CSS.buttonBottomLeft]: true
              }}
              onClick={this.decrementHour}
              onKeyDown={this.hourDownButtonKeyDownHandler}
              role="button"
              tabIndex={-1}
            >
              <calcite-icon icon="chevron-down" scale={iconScale} />
            </span>
          </div>
          <span class={CSS.delimiter}>:</span>
          <div role="group">
            <span
              aria-label={this.intlMinuteUp}
              class={{
                [CSS.button]: true,
                [CSS.buttonMinuteUp]: true
              }}
              onClick={this.incrementMinute}
              onKeyDown={this.minuteUpButtonKeyDownHandler}
              role="button"
              tabIndex={-1}
            >
              <calcite-icon icon="chevron-up" scale={iconScale} />
            </span>
            <span
              aria-label={this.intlMinute}
              aria-valuemax="12"
              aria-valuemin="1"
              aria-valuenow={minuteIsNumber && parseInt(this.minute)}
              aria-valuetext={this.minute}
              class={{
                [CSS.input]: true,
                [CSS.minute]: true
              }}
              onFocus={this.focusHandler}
              onKeyDown={this.minuteKeyDownHandler}
              ref={(el) => (this.minuteEl = el)}
              role="spinbutton"
              tabIndex={0}
            >
              {this.minute ? this.minute : "--"}
            </span>
            <span
              aria-label={this.intlMinuteDown}
              class={{
                [CSS.button]: true,
                [CSS.buttonMinuteDown]: true
              }}
              onClick={this.decrementMinute}
              onKeyDown={this.minuteDownButtonKeyDownHandler}
              role="button"
              tabIndex={-1}
            >
              <calcite-icon icon="chevron-down" scale={iconScale} />
            </span>
          </div>
          {includeSeconds && <span class={CSS.delimiter}>:</span>}
          {includeSeconds && (
            <div role="group">
              <span
                aria-label={this.intlSecondUp}
                class={{
                  [CSS.button]: true,
                  [CSS.buttonSecondUp]: true
                }}
                onClick={this.incrementSecond}
                onKeyDown={this.secondUpButtonKeyDownHandler}
                role="button"
                tabIndex={-1}
              >
                <calcite-icon icon="chevron-up" scale={iconScale} />
              </span>
              <span
                aria-label={this.intlSecond}
                aria-valuemax="59"
                aria-valuemin="0"
                aria-valuenow={secondIsNumber && parseInt(this.second)}
                aria-valuetext={this.second}
                class={{
                  [CSS.input]: true,
                  [CSS.second]: true
                }}
                onFocus={this.focusHandler}
                onKeyDown={this.secondKeyDownHandler}
                ref={(el) => (this.secondEl = el)}
                role="spinbutton"
                tabIndex={0}
              >
                {this.second ? this.second : "--"}
              </span>
              <span
                aria-label={this.intlSecondDown}
                class={{
                  [CSS.button]: true,
                  [CSS.buttonSecondDown]: true
                }}
                onClick={this.decrementSecond}
                onKeyDown={this.secondDownButtonKeyDownHandler}
                role="button"
                tabIndex={-1}
              >
                <calcite-icon icon="chevron-down" scale={iconScale} />
              </span>
            </div>
          )}
          {this.hourDisplayFormat === "12" && (
            <div role="group">
              <span
                aria-label={this.intlMeridiemUp}
                class={{
                  [CSS.button]: true,
                  [CSS.buttonMeridiemUp]: true,
                  [CSS.buttonTopRight]: true
                }}
                onClick={this.incrementMeridiem}
                onKeyDown={this.meridiemUpButtonKeyDownHandler}
                role="button"
                tabIndex={-1}
              >
                <calcite-icon icon="chevron-up" scale={iconScale} />
              </span>
              <span
                aria-label={this.intlMeridiem}
                aria-valuemax="2"
                aria-valuemin="1"
                aria-valuenow={
                  this.meridiem === "AM" ? "1" : this.meridiem === "PM" ? "2" : undefined
                }
                aria-valuetext={this.meridiem}
                class={{
                  [CSS.input]: true,
                  [CSS.meridiem]: true
                }}
                onFocus={this.focusHandler}
                onKeyDown={this.meridiemKeyDownHandler}
                ref={(el) => (this.meridiemEl = el)}
                role="spinbutton"
                tabIndex={0}
              >
                {this.meridiem ? this.meridiem : "--"}
              </span>
              <span
                aria-label={this.intlMeridiemDown}
                class={{
                  [CSS.button]: true,
                  [CSS.buttonMeridiemDown]: true,
                  [CSS.buttonBottomRight]: true
                }}
                onClick={this.decrementMeridiem}
                onKeyDown={this.meridiemDownButtonKeyDownHandler}
                role="button"
                tabIndex={-1}
              >
                <calcite-icon icon="chevron-down" scale={iconScale} />
              </span>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
