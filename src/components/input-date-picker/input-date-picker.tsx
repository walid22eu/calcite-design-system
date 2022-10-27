import {
  Component,
  h,
  Prop,
  Element,
  Host,
  State,
  Listen,
  Watch,
  VNode,
  Method,
  Event,
  EventEmitter,
  Build
} from "@stencil/core";
import { getLocaleData, DateLocaleData, getValueAsDateRange } from "../date-picker/utils";
import {
  dateFromRange,
  inRange,
  dateFromISO,
  dateToISO,
  parseDateString,
  sameDate,
  setEndOfDay
} from "../../utils/date";
import { HeadingLevel } from "../functional/Heading";

import { TEXT } from "../date-picker/resources";
import { CSS } from "./resources";
import { LabelableComponent, connectLabel, disconnectLabel, getLabelText } from "../../utils/label";
import {
  connectForm,
  disconnectForm,
  FormComponent,
  HiddenFormInputSlot,
  submitForm
} from "../../utils/form";
import {
  FloatingCSS,
  OverlayPositioning,
  FloatingUIComponent,
  connectFloatingUI,
  disconnectFloatingUI,
  EffectivePlacement,
  MenuPlacement,
  defaultMenuPlacement,
  filterComputedPlacements,
  reposition,
  updateAfterClose
} from "../../utils/floating-ui";
import { DateRangeChange } from "../date-picker/interfaces";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";
import { toAriaBoolean } from "../../utils/dom";
import {
  OpenCloseComponent,
  connectOpenCloseComponent,
  disconnectOpenCloseComponent
} from "../../utils/openCloseComponent";
import {
  connectLocalized,
  disconnectLocalized,
  LocalizedComponent,
  NumberingSystem,
  numberStringFormatter
} from "../../utils/locale";
import { numberKeys } from "../../utils/key";

@Component({
  tag: "calcite-input-date-picker",
  styleUrl: "input-date-picker.scss",
  shadow: true
})
export class InputDatePicker
  implements
    LabelableComponent,
    FormComponent,
    InteractiveComponent,
    OpenCloseComponent,
    FloatingUIComponent,
    LocalizedComponent
{
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------
  @Element() el: HTMLCalciteInputDatePickerElement;

  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------
  /**
   * When `true`, interaction is prevented and the component is displayed with lower opacity.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * When `true`, the component's value can be read, but controls are not accessible and the value cannot be modified.
   *
   * @mdn [readOnly](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly)
   */
  @Prop({ reflect: true }) readOnly = false;

  @Watch("disabled")
  @Watch("readOnly")
  handleDisabledAndReadOnlyChange(value: boolean): void {
    if (!value) {
      this.open = false;
    }
  }

  /** The component's value. */
  @Prop({ mutable: true }) value: string | string[];

  @Watch("value")
  valueHandler(value: string | string[]): void {
    if (Array.isArray(value)) {
      this.valueAsDate = getValueAsDateRange(value);
      this.start = value[0];
      this.end = value[1];
    } else if (value) {
      this.valueAsDate = dateFromISO(value);
      this.start = "";
      this.end = "";
    } else {
      this.valueAsDate = undefined;
      this.start = undefined;
      this.end = undefined;
    }
  }

  /**
   * Defines the available placements that can be used when a flip occurs.
   */
  @Prop() flipPlacements?: EffectivePlacement[];

  @Watch("flipPlacements")
  flipPlacementsHandler(): void {
    this.setFilteredPlacements();
    this.reposition(true);
  }

  /**
   * Specifies the number at which section headings should start.
   */
  @Prop({ reflect: true }) headingLevel: HeadingLevel;

  /** The component's value as a full date object. */
  @Prop({ mutable: true }) valueAsDate?: Date | Date[];

  /**
   * The component's start date as a full date object.
   *
   * @deprecated use `valueAsDate` instead.
   */
  @Prop({ mutable: true }) startAsDate?: Date;

  /**
   * The component's end date as a full date object.
   *
   * @deprecated use `valueAsDate` instead.
   */
  @Prop({ mutable: true }) endAsDate?: Date;

  /** Specifies the earliest allowed date as a full date object. */
  @Prop({ mutable: true }) minAsDate?: Date;

  /** Specifies the latest allowed date as a full date object. */
  @Prop({ mutable: true }) maxAsDate?: Date;

  /** Specifies the earliest allowed date ("yyyy-mm-dd"). */
  @Prop({ mutable: true }) min?: string;

  @Watch("min")
  onMinChanged(min: string): void {
    if (min) {
      this.minAsDate = dateFromISO(min);
    }
  }

  /** Specifies the latest allowed date ("yyyy-mm-dd"). */
  @Prop({ mutable: true }) max?: string;

  @Watch("max")
  onMaxChanged(max: string): void {
    if (max) {
      this.maxAsDate = dateFromISO(max);
    }
  }

  /**
   * When `true`, the component is active.
   *
   * @deprecated use `open` instead.
   */
  @Prop({ mutable: true, reflect: true }) active = false;

  @Watch("active")
  activeHandler(value: boolean): void {
    this.open = value;
  }

  /** When `true`, displays the `calcite-date-picker` component. */
  @Prop({ mutable: true, reflect: true }) open = false;

  @Watch("open")
  openHandler(value: boolean): void {
    this.active = value;

    if (this.disabled || this.readOnly) {
      if (!value) {
        updateAfterClose(this.floatingEl);
      }
      this.open = false;
      return;
    }

    if (value) {
      this.reposition(true);
    } else {
      updateAfterClose(this.floatingEl);
    }
  }

  /**
   * Specifies the name of the component on form submission.
   */
  @Prop({ reflect: true }) name: string;

  /**
   * Accessible name for the component's previous month button.
   *
   * @default "Previous month"
   */
  @Prop() intlPrevMonth?: string = TEXT.prevMonth;

  /**
   * Accessible name for the component's next month button.
   *
   * @default "Next month"
   */
  @Prop() intlNextMonth?: string = TEXT.nextMonth;

  /**
   * Accessible name for the component's year input.
   *
   * @default "Year"
   */
  @Prop() intlYear?: string = TEXT.year;

  /**
   * Specifies the BCP 47 language tag for the desired language and country format.
   *
   * @deprecated set the global `lang` attribute on the element instead.
   * @mdn [lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
   */
  @Prop() locale?: string;

  /**
   * Specifies the Unicode numeral system used by the component for localization. This property cannot be dynamically changed.
   *
   */
  @Prop({ reflect: true }) numberingSystem?: NumberingSystem;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: "s" | "m" | "l" = "m";

  /**
   * Specifies the placement of the `calcite-date-picker` relative to the component.
   *
   * @default "bottom-start"
   */
  @Prop({ reflect: true }) placement: MenuPlacement = defaultMenuPlacement;

  /** When `true`, activates a range for the component. */
  @Prop({ reflect: true }) range = false;

  /**
   * When `true`, the component must have a value in order for the form to submit.
   *
   * @internal
   */
  @Prop({ reflect: true }) required = false;

  /**
   * The component's start date.
   *
   * @deprecated use `value` instead.
   */
  @Prop({ mutable: true, reflect: true }) start?: string;

  /**
   * The component's end date.
   *
   * @deprecated use `value` instead.
   */
  @Prop({ mutable: true, reflect: true }) end?: string;

  /**
   * Determines the type of positioning to use for the overlaid content.
   *
   * Using `"absolute"` will work for most cases. The component will be positioned inside of overflowing parent containers and will affect the container's layout.
   *
   * `"fixed"` should be used to escape an overflowing parent container, or when the reference element's `position` CSS property is `"fixed"`.
   *
   */
  @Prop({ reflect: true }) overlayPositioning: OverlayPositioning = "absolute";

  @Watch("overlayPositioning")
  overlayPositioningHandler(): void {
    this.reposition(true);
  }

  /**
   * When `true`, disables the default behavior on the third click of narrowing or extending the range.
   * Instead starts a new range.
   */
  @Prop() proximitySelectionDisabled = false;

  /** Defines the layout of the component. */
  @Prop({ reflect: true }) layout: "horizontal" | "vertical" = "horizontal";

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteDatePickerChange")
  @Listen("calciteDatePickerRangeChange")
  handleDateOrRangeChange(): void {
    this.calciteInputDatePickerChange.emit();
  }

  @Listen("calciteDaySelect")
  calciteDaySelectHandler(): void {
    if (this.shouldFocusRangeStart() || this.shouldFocusRangeEnd()) {
      return;
    }

    this.open = false;
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------
  /**
   * Fires when a user changes the date.
   *
   * @deprecated use `calciteInputDatePickerChange` instead.
   */
  @Event({ cancelable: false }) calciteDatePickerChange: EventEmitter<Date>;

  /**
   * Fires when a user changes the date range.
   *
   * @see [DateRangeChange](https://github.com/Esri/calcite-components/blob/master/src/components/date-picker/interfaces.ts#L1)
   * @deprecated use `calciteInputDatePickerChange` instead.
   */
  @Event({ cancelable: false }) calciteDatePickerRangeChange: EventEmitter<DateRangeChange>;

  /**
   * Fires when the component's value changes.
   */
  @Event({ cancelable: false }) calciteInputDatePickerChange: EventEmitter<void>;

  /** Fires when the component is requested to be closed and before the closing transition begins. */
  @Event({ cancelable: false }) calciteInputDatePickerBeforeClose: EventEmitter<void>;

  /** Fires when the component is closed and animation is complete. */
  @Event({ cancelable: false }) calciteInputDatePickerClose: EventEmitter<void>;

  /** Fires when the component is added to the DOM but not rendered, and before the opening transition begins. */
  @Event({ cancelable: false }) calciteInputDatePickerBeforeOpen: EventEmitter<void>;

  /** Fires when the component is open and animation is complete. */
  @Event({ cancelable: false }) calciteInputDatePickerOpen: EventEmitter<void>;

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    this.startInput?.setFocus();
  }

  /**
   * Updates the position of the component.
   *
   * @param delayed
   */
  @Method()
  async reposition(delayed = false): Promise<void> {
    const { floatingEl, referenceEl, placement, overlayPositioning, filteredFlipPlacements } = this;

    return reposition(
      this,
      {
        floatingEl,
        referenceEl,
        overlayPositioning,
        placement,
        flipPlacements: filteredFlipPlacements,
        type: "menu"
      },
      delayed
    );
  }

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    connectLocalized(this);

    const isOpen = this.active || this.open;
    isOpen && this.activeHandler(isOpen);
    isOpen && this.openHandler(isOpen);
    if (Array.isArray(this.value)) {
      this.valueAsDate = getValueAsDateRange(this.value);
      this.start = this.value[0];
      this.end = this.value[1];
    } else if (this.value) {
      this.valueAsDate = dateFromISO(this.value);
      this.start = "";
      this.end = "";
    }

    if (this.start) {
      this.startAsDate = dateFromISO(this.start);
    }

    if (this.end) {
      this.endAsDate = setEndOfDay(dateFromISO(this.end));
    }

    if (this.min) {
      this.minAsDate = dateFromISO(this.min);
    }

    if (this.max) {
      this.maxAsDate = dateFromISO(this.max);
    }

    connectLabel(this);
    connectForm(this);
    connectOpenCloseComponent(this);

    this.setFilteredPlacements();
    this.reposition(true);

    numberStringFormatter.numberFormatOptions = {
      numberingSystem: this.numberingSystem,
      locale: this.effectiveLocale,
      useGrouping: false
    };
  }

  async componentWillLoad(): Promise<void> {
    await this.loadLocaleData();
    this.onMinChanged(this.min);
    this.onMaxChanged(this.max);
  }

  componentDidLoad(): void {
    this.reposition(true);
  }

  disconnectedCallback(): void {
    disconnectLabel(this);
    disconnectForm(this);
    disconnectFloatingUI(this, this.referenceEl, this.floatingEl);
    disconnectOpenCloseComponent(this);
    disconnectLocalized(this);
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  render(): VNode {
    const { disabled, readOnly, numberingSystem, effectiveLocale } = this;

    numberStringFormatter.numberFormatOptions = {
      numberingSystem,
      locale: effectiveLocale,
      useGrouping: false
    };

    const date = dateFromRange(
      this.range ? this.startAsDate : this.valueAsDate,
      this.minAsDate,
      this.maxAsDate
    );
    const endDate = this.range
      ? dateFromRange(this.endAsDate, this.minAsDate, this.maxAsDate)
      : null;

    const formattedEndDate = endDate
      ? this.formatNumerals(endDate.toLocaleDateString(effectiveLocale))
      : "";

    const formattedDate = date ? this.formatNumerals(date.toLocaleDateString(effectiveLocale)) : "";

    return (
      <Host onBlur={this.deactivate} onKeyDown={this.keyDownHandler} role="application">
        {this.localeData && (
          <div aria-expanded={toAriaBoolean(this.open)} class="input-container" role="application">
            {
              <div class="input-wrapper" ref={this.setStartWrapper}>
                <calcite-input
                  class={`input ${
                    this.layout === "vertical" && this.range ? `no-bottom-border` : ``
                  }`}
                  disabled={disabled}
                  icon="calendar"
                  label={getLabelText(this)}
                  lang={effectiveLocale}
                  number-button-type="none"
                  numberingSystem={numberingSystem}
                  onCalciteInputInput={this.startInputInput}
                  onCalciteInternalInputBlur={this.inputBlur}
                  onCalciteInternalInputFocus={this.startInputFocus}
                  placeholder={this.localeData?.placeholder}
                  readOnly={readOnly}
                  ref={this.setStartInput}
                  scale={this.scale}
                  type="text"
                  value={formattedDate}
                />
              </div>
            }
            <div
              aria-hidden={toAriaBoolean(!this.open)}
              class={{
                [CSS.menu]: true,
                [CSS.menuActive]: this.open
              }}
              ref={this.setFloatingEl}
            >
              <div
                class={{
                  ["calendar-picker-wrapper"]: true,
                  ["calendar-picker-wrapper--end"]: this.focusedInput === "end",
                  [FloatingCSS.animation]: true,
                  [FloatingCSS.animationActive]: this.open
                }}
                ref={this.setTransitionEl}
              >
                <calcite-date-picker
                  activeRange={this.focusedInput}
                  endAsDate={this.endAsDate}
                  headingLevel={this.headingLevel}
                  intlNextMonth={this.intlNextMonth}
                  intlPrevMonth={this.intlPrevMonth}
                  intlYear={this.intlYear}
                  lang={effectiveLocale}
                  max={this.max}
                  maxAsDate={this.maxAsDate}
                  min={this.min}
                  minAsDate={this.minAsDate}
                  numberingSystem={numberingSystem}
                  onCalciteDatePickerChange={this.handleDateChange}
                  onCalciteDatePickerRangeChange={this.handleDateRangeChange}
                  proximitySelectionDisabled={this.proximitySelectionDisabled}
                  range={this.range}
                  scale={this.scale}
                  startAsDate={this.startAsDate}
                  tabIndex={0}
                  valueAsDate={this.valueAsDate}
                />
              </div>
            </div>

            {this.range && this.layout === "horizontal" && (
              <div class="horizontal-arrow-container">
                <calcite-icon flipRtl={true} icon="arrow-right" scale="s" />
              </div>
            )}
            {this.range && this.layout === "vertical" && this.scale !== "s" && (
              <div class="vertical-arrow-container">
                <calcite-icon icon="arrow-down" scale="s" />
              </div>
            )}
            {this.range && (
              <div class="input-wrapper" ref={this.setEndWrapper}>
                <calcite-input
                  class={{
                    input: true,
                    "border-top-color-one": this.layout === "vertical" && this.range
                  }}
                  disabled={disabled}
                  icon="calendar"
                  lang={effectiveLocale}
                  number-button-type="none"
                  numberingSystem={numberingSystem}
                  onCalciteInputInput={this.endInputInput}
                  onCalciteInternalInputBlur={this.inputBlur}
                  onCalciteInternalInputFocus={this.endInputFocus}
                  placeholder={this.localeData?.placeholder}
                  readOnly={readOnly}
                  ref={this.setEndInput}
                  scale={this.scale}
                  type="text"
                  value={formattedEndDate}
                />
              </div>
            )}
          </div>
        )}
        <HiddenFormInputSlot component={this} />
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  filteredFlipPlacements: EffectivePlacement[];

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: InputDatePicker["value"];

  @State() effectiveLocale = "";

  @State() focusedInput: "start" | "end" = "start";

  @State() globalAttributes = {};

  @State() private localeData: DateLocaleData;

  private startInput: HTMLCalciteInputElement;

  private endInput: HTMLCalciteInputElement;

  private floatingEl: HTMLDivElement;

  private referenceEl: HTMLDivElement;

  private startWrapper: HTMLDivElement;

  private endWrapper: HTMLDivElement;

  openTransitionProp = "opacity";

  transitionEl: HTMLDivElement;

  @Watch("layout")
  @Watch("focusedInput")
  setReferenceEl(): void {
    const { focusedInput, layout, endWrapper, startWrapper } = this;

    this.referenceEl =
      focusedInput === "end" || layout === "vertical"
        ? endWrapper || startWrapper
        : startWrapper || endWrapper;

    connectFloatingUI(this, this.referenceEl, this.floatingEl);
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  setFilteredPlacements = (): void => {
    const { el, flipPlacements } = this;

    this.filteredFlipPlacements = flipPlacements
      ? filterComputedPlacements(flipPlacements, el)
      : null;
  };

  private setTransitionEl = (el): void => {
    this.transitionEl = el;
    connectOpenCloseComponent(this);
  };

  onLabelClick(): void {
    this.setFocus();
  }

  onBeforeOpen(): void {
    this.calciteInputDatePickerBeforeOpen.emit();
  }

  onOpen(): void {
    this.calciteInputDatePickerOpen.emit();
  }

  onBeforeClose(): void {
    this.calciteInputDatePickerBeforeClose.emit();
  }

  onClose(): void {
    this.calciteInputDatePickerClose.emit();
  }

  setStartInput = (el: HTMLCalciteInputElement): void => {
    this.startInput = el;
  };

  setEndInput = (el: HTMLCalciteInputElement): void => {
    this.endInput = el;
  };

  deactivate = (): void => {
    this.open = false;
  };

  keyDownHandler = (event: KeyboardEvent): void => {
    const { defaultPrevented, key } = event;
    if (key === "Enter" && !defaultPrevented) {
      if (submitForm(this)) {
        event.preventDefault();
      }
    } else if (key === "Escape" && !defaultPrevented) {
      this.active = false;
      this.open = false;
      event.preventDefault();
    }
  };

  inputBlur = (event: CustomEvent<any>): void => {
    this.blur(event.currentTarget as HTMLCalciteInputElement);
  };

  startInputFocus = (): void => {
    if (!this.readOnly) {
      this.open = true;
    }
    this.focusedInput = "start";
  };

  endInputFocus = (): void => {
    if (!this.readOnly) {
      this.open = true;
    }
    this.focusedInput = "end";
  };

  startInputInput = (): void => {
    const parsedValue = this.parseNumerals(this.startInput.value);
    const formattedValue = this.formatNumerals(parsedValue);

    this.startInput.value = formattedValue;
    this.input(parsedValue);
  };

  endInputInput = (): void => {
    const parsedValue = this.parseNumerals(this.endInput.value);
    const formattedValue = this.formatNumerals(parsedValue);

    this.endInput.value = formattedValue;
    this.input(parsedValue);
  };

  setFloatingEl = (el: HTMLDivElement): void => {
    if (el) {
      this.floatingEl = el;
      connectFloatingUI(this, this.referenceEl, this.floatingEl);
    }
  };

  setStartWrapper = (el: HTMLDivElement): void => {
    this.startWrapper = el;
    this.setReferenceEl();
  };

  setEndWrapper = (el: HTMLDivElement): void => {
    this.endWrapper = el;
    this.setReferenceEl();
  };

  @Watch("start")
  startWatcher(start: string): void {
    this.startAsDate = dateFromISO(start);
  }

  @Watch("end")
  endWatcher(end: string): void {
    this.endAsDate = end ? setEndOfDay(dateFromISO(end)) : dateFromISO(end);
  }

  @Watch("effectiveLocale")
  private async loadLocaleData(): Promise<void> {
    if (!Build.isBrowser) {
      return;
    }

    this.localeData = await getLocaleData(this.effectiveLocale);
  }

  private clearCurrentValue(): void {
    if (!this.range) {
      if (typeof this.value === "string" && this.value) {
        this.calciteDatePickerChange.emit();
      }
      this.value = "";
      return;
    }

    const { focusedInput } = this;

    if (focusedInput === "start") {
      if (this.start) {
        this.calciteDatePickerRangeChange.emit();
      }
      this.value = Array.isArray(this.value) ? ["", this.value[1] || ""] : [""];
      this.start = undefined;
    } else if (focusedInput === "end") {
      if (this.end) {
        this.calciteDatePickerRangeChange.emit();
      }
      this.value = Array.isArray(this.value) ? [this.value[0] || "", ""] : ["", ""];
      this.end = undefined;
    }
  }

  /**
   * If inputted string is a valid date, update value/active
   *
   * @param value
   */
  private input(value: string): void {
    const date = this.getDateFromInput(value);

    if (!date) {
      this.clearCurrentValue();
      return;
    }

    if (!this.range) {
      this.value = dateToISO(date);
      this.calciteDatePickerChange.emit(date);
      return;
    }

    const { focusedInput } = this;

    if (focusedInput === "start") {
      if (!this.startAsDate || !sameDate(date, this.startAsDate)) {
        const startDateISO = dateToISO(date);
        this.value = Array.isArray(this.value)
          ? [startDateISO, this.value[1] || ""]
          : [startDateISO];
        this.start = startDateISO;
        this.calciteDatePickerRangeChange.emit({
          startDate: date,
          endDate: this.endAsDate
        });
      }
    } else if (focusedInput === "end") {
      if (!this.endAsDate || !sameDate(date, this.endAsDate)) {
        const endDateISO = dateToISO(date);
        this.value = Array.isArray(this.value)
          ? [this.value[0] || "", endDateISO]
          : ["", endDateISO];
        this.end = endDateISO;
        this.calciteDatePickerRangeChange.emit({
          startDate: this.startAsDate,
          endDate: setEndOfDay(date)
        });
      }
    }
  }

  /**
   * Clean up invalid date from input on blur
   *
   * @param target
   */
  private blur(target: HTMLCalciteInputElement): void {
    const { focusedInput, endAsDate, range, startAsDate, valueAsDate } = this;
    const locale = this.effectiveLocale;
    const date = this.getDateFromInput(target.value);
    if (!date) {
      if (!range && valueAsDate) {
        target.value = this.formatNumerals(
          Array.isArray(valueAsDate)
            ? valueAsDate[focusedInput === "end" ? 1 : 0].toLocaleDateString(locale)
            : valueAsDate.toLocaleDateString(locale)
        );
      } else if (focusedInput === "start" && startAsDate) {
        target.value = this.formatNumerals(startAsDate.toLocaleDateString(locale));
      } else if (focusedInput === "end" && endAsDate) {
        target.value = this.formatNumerals(endAsDate.toLocaleDateString(locale));
      }
    }
  }

  /**
   * Event handler for when the selected date changes
   *
   * @param event
   */
  handleDateChange = (event: CustomEvent<Date>): void => {
    if (this.range) {
      return;
    }

    this.value = dateToISO(event.detail);
  };

  private shouldFocusRangeStart(): boolean {
    return !!(
      this.endAsDate &&
      !this.startAsDate &&
      this.focusedInput === "end" &&
      this.startInput
    );
  }

  private shouldFocusRangeEnd(): boolean {
    return !!(
      this.startAsDate &&
      !this.endAsDate &&
      this.focusedInput === "start" &&
      this.endInput
    );
  }

  private handleDateRangeChange = (event: CustomEvent<DateRangeChange>): void => {
    if (!this.range || !event.detail) {
      return;
    }

    const { startDate, endDate } = event.detail;

    this.start = dateToISO(startDate);
    this.end = dateToISO(endDate);
    this.value = [this.start, this.end];

    if (this.shouldFocusRangeEnd()) {
      this.endInput?.setFocus();
    } else if (this.shouldFocusRangeStart()) {
      this.startInput?.setFocus();
    }
  };

  /**
   * Find a date from input string
   * return false if date is invalid, or out of range
   *
   * @param value
   */
  private getDateFromInput(value: string): Date | false {
    if (!this.localeData) {
      return false;
    }
    const { separator } = this.localeData;
    const { day, month, year } = parseDateString(value, this.localeData);
    const validDay = day > 0;
    const validMonth = month > -1;
    const date = new Date(year, month, day);
    date.setFullYear(year);
    const validDate = !isNaN(date.getTime());
    const validLength = value.split(separator).filter((c) => c).length > 2;
    const validYear = year.toString().length > 0;
    if (
      validDay &&
      validMonth &&
      validDate &&
      validLength &&
      validYear &&
      inRange(date, this.min, this.max)
    ) {
      return date;
    }
    return false;
  }

  private commonDateSeparators = [".", "-", "/"];

  private formatNumerals = (value: string): string =>
    value
      ? value
          .split("")
          .map((char: string) =>
            // convert common separators to the locale's
            this.commonDateSeparators.includes(char)
              ? this.localeData.separator
              : numberKeys.includes(char)
              ? numberStringFormatter.numberFormatter.format(Number(char))
              : char
          )
          .join("")
      : "";

  private parseNumerals = (value: string): string =>
    value
      ? value
          .split("")
          .map((char: string) =>
            numberKeys.includes(char) ? numberStringFormatter.delocalize(char) : char
          )
          .join("")
      : "";
}
