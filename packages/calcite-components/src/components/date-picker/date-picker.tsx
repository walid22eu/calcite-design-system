import {
  Build,
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  VNode,
  Watch,
} from "@stencil/core";
import {
  dateFromISO,
  dateFromRange,
  dateToISO,
  getDaysDiff,
  HoverRange,
  setEndOfDay,
} from "../../utils/date";
import {
  componentFocusable,
  LoadableComponent,
  setComponentLoaded,
  setUpLoadableComponent,
} from "../../utils/loadable";
import {
  connectLocalized,
  disconnectLocalized,
  getDateTimeFormat,
  LocalizedComponent,
  NumberingSystem,
  numberStringFormatter,
} from "../../utils/locale";
import {
  connectMessages,
  disconnectMessages,
  setUpMessages,
  T9nComponent,
  updateMessages,
} from "../../utils/t9n";
import { HeadingLevel } from "../functional/Heading";
import { DatePickerMessages } from "./assets/date-picker/t9n";
import { DATE_PICKER_FORMAT_OPTIONS, HEADING_LEVEL } from "./resources";
import { DateLocaleData, getLocaleData, getValueAsDateRange } from "./utils";

@Component({
  assetsDirs: ["assets"],
  tag: "calcite-date-picker",
  styleUrl: "date-picker.scss",
  shadow: {
    delegatesFocus: true,
  },
})
export class DatePicker implements LocalizedComponent, LoadableComponent, T9nComponent {
  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------

  /** Specifies the component's active date. */
  @Prop({ mutable: true }) activeDate: Date;

  @Watch("activeDate")
  activeDateWatcher(newActiveDate: Date): void {
    if (this.activeRange === "end") {
      this.activeEndDate = newActiveDate;
    }
  }

  /**
   * When `range` is true, specifies the active `range`. Where `"start"` specifies the starting range date and `"end"` the ending range date.
   */
  @Prop({ reflect: true }) activeRange: "start" | "end";

  /**
   * Specifies the selected date as a string (`"yyyy-mm-dd"`), or an array of strings for `range` values (`["yyyy-mm-dd", "yyyy-mm-dd"]`).
   */
  @Prop({ mutable: true }) value: string | string[];

  /**
   * Specifies the number at which section headings should start.
   */
  @Prop({ reflect: true }) headingLevel: HeadingLevel;

  /** Specifies the selected date as a full date object (`new Date("yyyy-mm-dd")`), or an array containing full date objects (`[new Date("yyyy-mm-dd"), new Date("yyyy-mm-dd")]`). */
  @Prop({ mutable: true }) valueAsDate: Date | Date[];

  @Watch("valueAsDate")
  valueAsDateWatcher(newValueAsDate: Date | Date[]): void {
    if (this.range && Array.isArray(newValueAsDate)) {
      const { activeStartDate, activeEndDate } = this;
      const newActiveStartDate = newValueAsDate[0];
      const newActiveEndDate = newValueAsDate[1];
      this.activeStartDate = activeStartDate !== newActiveStartDate && newActiveStartDate;
      this.activeEndDate = activeEndDate !== newActiveEndDate && newActiveEndDate;
    } else if (newValueAsDate && newValueAsDate !== this.activeDate) {
      this.activeDate = newValueAsDate as Date;
    }
  }

  /** Specifies the earliest allowed date as a full date object (`new Date("yyyy-mm-dd")`). */
  @Prop({ mutable: true }) minAsDate: Date;

  /** Specifies the latest allowed date as a full date object (`new Date("yyyy-mm-dd")`). */
  @Prop({ mutable: true }) maxAsDate: Date;

  /** Specifies the earliest allowed date (`"yyyy-mm-dd"`). */
  @Prop({ reflect: true }) min: string;

  @Watch("min")
  onMinChanged(min: string): void {
    if (min) {
      this.minAsDate = dateFromISO(min);
    }
  }

  /** Specifies the latest allowed date (`"yyyy-mm-dd"`). */
  @Prop({ reflect: true }) max: string;

  @Watch("max")
  onMaxChanged(max: string): void {
    if (max) {
      this.maxAsDate = dateFromISO(max);
    }
  }

  /**
   * Specifies the Unicode numeral system used by the component for localization. This property cannot be dynamically changed.
   *
   */
  @Prop({ reflect: true }) numberingSystem: NumberingSystem;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: "s" | "m" | "l" = "m";

  /** When `true`, activates the component's range mode to allow a start and end date. */
  @Prop({ reflect: true }) range = false;

  /** When `true`, disables the default behavior on the third click of narrowing or extending the range and instead starts a new range. */
  @Prop({ reflect: true }) proximitySelectionDisabled = false;

  /**
   * Use this property to override individual strings used by the component.
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messageOverrides: Partial<DatePickerMessages>;

  /**
   * Made into a prop for testing purposes only
   *
   * @internal
   */
  // eslint-disable-next-line @stencil-community/strict-mutable -- updated by t9n module
  @Prop({ mutable: true }) messages: DatePickerMessages;

  @Watch("messageOverrides")
  onMessagesChange(): void {
    /* wired up by t9n util */
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------
  /**
   * Fires when a user changes the component's date. For `range` events, use `calciteDatePickerRangeChange`.
   */
  @Event({ cancelable: false }) calciteDatePickerChange: EventEmitter<void>;

  /**
   * Fires when a user changes the component's date `range`. For components without `range` use `calciteDatePickerChange`.
   */
  @Event({ cancelable: false }) calciteDatePickerRangeChange: EventEmitter<void>;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component's first focusable element. */
  @Method()
  async setFocus(): Promise<void> {
    await componentFocusable(this);
    this.el.focus();
  }

  /**
   * Resets active date state.
   * @internal
   */
  @Method()
  async reset(): Promise<void> {
    this.resetActiveDates();
    this.mostRecentRangeValue = undefined;
  }

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------
  connectedCallback(): void {
    connectLocalized(this);
    connectMessages(this);

    if (Array.isArray(this.value)) {
      this.valueAsDate = getValueAsDateRange(this.value);
    } else if (this.value) {
      this.valueAsDate = dateFromISO(this.value);
    }

    if (this.min) {
      this.minAsDate = dateFromISO(this.min);
    }

    if (this.max) {
      this.maxAsDate = dateFromISO(this.max);
    }
  }

  disconnectedCallback(): void {
    disconnectLocalized(this);
    disconnectMessages(this);
  }

  async componentWillLoad(): Promise<void> {
    setUpLoadableComponent(this);
    await this.loadLocaleData();
    this.onMinChanged(this.min);
    this.onMaxChanged(this.max);
    await setUpMessages(this);
  }

  componentDidLoad(): void {
    setComponentLoaded(this);
  }

  render(): VNode {
    const date = dateFromRange(
      this.range && Array.isArray(this.valueAsDate) ? this.valueAsDate[0] : this.valueAsDate,
      this.minAsDate,
      this.maxAsDate,
    );
    let activeDate = this.getActiveDate(date, this.minAsDate, this.maxAsDate);
    const endDate =
      this.range && Array.isArray(this.valueAsDate)
        ? dateFromRange(this.valueAsDate[1], this.minAsDate, this.maxAsDate)
        : null;
    const activeEndDate = this.getActiveEndDate(endDate, this.minAsDate, this.maxAsDate);
    if (
      (this.activeRange === "end" ||
        (this.hoverRange?.focused === "end" && (!this.proximitySelectionDisabled || endDate))) &&
      activeEndDate
    ) {
      activeDate = activeEndDate;
    }
    if (this.range && this.mostRecentRangeValue) {
      activeDate = this.mostRecentRangeValue;
    }

    const minDate =
      this.range && this.activeRange
        ? this.activeRange === "start"
          ? this.minAsDate
          : date || this.minAsDate
        : this.minAsDate;

    const maxDate =
      this.range && this.activeRange
        ? this.activeRange === "start"
          ? endDate || this.maxAsDate
          : this.maxAsDate
        : this.maxAsDate;
    return (
      <Host onBlur={this.resetActiveDates} onKeyDown={this.keyDownHandler}>
        {this.renderCalendar(activeDate, maxDate, minDate, date, endDate)}
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteDatePickerElement;

  /**
   * Active end date.
   */
  @State() activeEndDate: Date;

  /**
   * Active start date.
   */
  @State() activeStartDate: Date;

  /**
   * The DateTimeFormat used to provide screen reader labels.
   *
   * @internal
   */
  @State() dateTimeFormat: Intl.DateTimeFormat;

  @State() defaultMessages: DatePickerMessages;

  @State() effectiveLocale = "";

  @Watch("effectiveLocale")
  effectiveLocaleChange(): void {
    updateMessages(this, this.effectiveLocale);
  }

  @State() endAsDate: Date;

  @State() private hoverRange: HoverRange;

  @State() private localeData: DateLocaleData;

  @State() private mostRecentRangeValue?: Date;

  @State() startAsDate: Date;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  keyDownHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this.resetActiveDates();
    }
  };

  @Watch("value")
  valueHandler(value: string | string[]): void {
    if (Array.isArray(value)) {
      this.valueAsDate = getValueAsDateRange(value);
    } else if (value) {
      this.valueAsDate = dateFromISO(value);
    }
  }

  @Watch("effectiveLocale")
  private async loadLocaleData(): Promise<void> {
    if (!Build.isBrowser) {
      return;
    }

    numberStringFormatter.numberFormatOptions = {
      numberingSystem: this.numberingSystem,
      locale: this.effectiveLocale,
      useGrouping: false,
    };

    this.localeData = await getLocaleData(this.effectiveLocale);
    this.dateTimeFormat = getDateTimeFormat(this.effectiveLocale, DATE_PICKER_FORMAT_OPTIONS);
  }

  monthHeaderSelectChange = (event: CustomEvent<Date>): void => {
    const date = new Date(event.detail);
    if (!this.range) {
      this.activeDate = date;
    } else {
      if (this.activeRange === "end") {
        this.activeEndDate = date;
      } else {
        this.activeStartDate = date;
      }
      this.mostRecentRangeValue = date;
    }
  };

  monthActiveDateChange = (event: CustomEvent<Date>): void => {
    const date = new Date(event.detail);
    if (!this.range) {
      this.activeDate = date;
    } else {
      if (this.activeRange === "end") {
        this.activeEndDate = date;
      } else {
        this.activeStartDate = date;
      }
      this.mostRecentRangeValue = date;
    }
  };

  monthHoverChange = (event: CustomEvent<Date>): void => {
    if (!this.range) {
      this.hoverRange = undefined;
      return;
    }

    const { valueAsDate } = this;
    const start = Array.isArray(valueAsDate) && valueAsDate[0];
    const end = Array.isArray(valueAsDate) && valueAsDate[1];

    const date = new Date(event.detail);
    this.hoverRange = {
      focused: this.activeRange || "start",
      start,
      end,
    };
    if (!this.proximitySelectionDisabled) {
      if (start && end) {
        const startDiff = getDaysDiff(date, start);
        const endDiff = getDaysDiff(date, end);
        if (endDiff > 0) {
          this.hoverRange.end = date;
          this.hoverRange.focused = "end";
        } else if (startDiff < 0) {
          this.hoverRange.start = date;
          this.hoverRange.focused = "start";
        } else if (startDiff > endDiff) {
          this.hoverRange.start = date;
          this.hoverRange.focused = "start";
        } else {
          this.hoverRange.end = date;
          this.hoverRange.focused = "end";
        }
      } else {
        if (start) {
          if (date < start) {
            this.hoverRange = {
              focused: "start",
              start: date,
              end: start,
            };
          } else {
            this.hoverRange.end = date;
            this.hoverRange.focused = "end";
          }
        }
      }
    } else {
      if (!end) {
        if (date < start) {
          this.hoverRange = {
            focused: "start",
            start: date,
            end: start,
          };
        } else {
          this.hoverRange.end = date;
          this.hoverRange.focused = "end";
        }
      } else {
        this.hoverRange = undefined;
      }
    }
    event.stopPropagation();
  };

  monthMouseOutChange = (): void => {
    if (this.hoverRange) {
      this.hoverRange = undefined;
    }
  };

  /**
   * Render calcite-date-picker-month-header and calcite-date-picker-month
   *
   * @param activeDate
   * @param maxDate
   * @param minDate
   * @param date
   * @param endDate
   */
  private renderCalendar(
    activeDate: Date,
    maxDate: Date,
    minDate: Date,
    date: Date,
    endDate: Date,
  ) {
    return (
      this.localeData && [
        <calcite-date-picker-month-header
          activeDate={activeDate}
          headingLevel={this.headingLevel || HEADING_LEVEL}
          localeData={this.localeData}
          max={maxDate}
          messages={this.messages}
          min={minDate}
          onCalciteInternalDatePickerSelect={this.monthHeaderSelectChange}
          scale={this.scale}
          selectedDate={this.activeRange === "end" ? endDate : date || new Date()}
        />,
        <calcite-date-picker-month
          activeDate={activeDate}
          dateTimeFormat={this.dateTimeFormat}
          endDate={this.range ? endDate : undefined}
          hoverRange={this.hoverRange}
          localeData={this.localeData}
          max={maxDate}
          min={minDate}
          onCalciteInternalDatePickerActiveDateChange={this.monthActiveDateChange}
          onCalciteInternalDatePickerHover={this.monthHoverChange}
          onCalciteInternalDatePickerMouseOut={this.monthMouseOutChange}
          onCalciteInternalDatePickerSelect={this.monthDateChange}
          scale={this.scale}
          selectedDate={this.activeRange === "end" ? endDate : date}
          startDate={this.range ? date : undefined}
        />,
      ]
    );
  }

  private resetActiveDates = (): void => {
    const { valueAsDate } = this;

    if (!Array.isArray(valueAsDate) && valueAsDate && valueAsDate !== this.activeDate) {
      this.activeDate = new Date(valueAsDate);
    }

    if (Array.isArray(valueAsDate)) {
      if (valueAsDate[0] && valueAsDate[0] !== this.activeStartDate) {
        this.activeStartDate = new Date(valueAsDate[0]);
      }
      if (valueAsDate[1] && valueAsDate[1] !== this.activeEndDate) {
        this.activeEndDate = new Date(valueAsDate[1]);
      }
    }
  };

  private getEndDate(): Date {
    return (Array.isArray(this.valueAsDate) && this.valueAsDate[1]) || undefined;
  }

  private setEndDate(date: Date): void {
    const startDate = this.getStartDate();
    const newEndDate = date ? setEndOfDay(date) : date;
    this.value = [dateToISO(startDate), dateToISO(date)];
    this.valueAsDate = [startDate, date];
    this.mostRecentRangeValue = newEndDate;
    this.calciteDatePickerRangeChange.emit();
    this.activeEndDate = date || null;
  }

  private getStartDate(): Date {
    return Array.isArray(this.valueAsDate) && this.valueAsDate[0];
  }

  private setStartDate(date: Date): void {
    const endDate = this.getEndDate();
    this.value = [dateToISO(date), dateToISO(endDate)];
    this.valueAsDate = [date, endDate];
    this.mostRecentRangeValue = date;
    this.calciteDatePickerRangeChange.emit();
    this.activeStartDate = date || null;
  }

  /**
   * Event handler for when the selected date changes
   *
   * @param event
   */
  private monthDateChange = (event: CustomEvent<Date>): void => {
    const date = new Date(event.detail);
    const isoDate = dateToISO(date);

    if (!this.range && isoDate === dateToISO(this.valueAsDate as Date)) {
      return;
    }

    if (!this.range) {
      this.value = isoDate || "";
      this.valueAsDate = date || null;
      this.activeDate = date || null;
      this.calciteDatePickerChange.emit();
      return;
    }

    const start = this.getStartDate();
    const end = this.getEndDate();

    if (!start || (!end && date < start)) {
      if (start) {
        this.setEndDate(new Date(start));
      }
      if (this.activeRange == "end") {
        this.setEndDate(date);
      } else {
        this.setStartDate(date);
      }
    } else if (!end) {
      this.setEndDate(date);
    } else {
      if (!this.proximitySelectionDisabled) {
        if (this.activeRange) {
          if (this.activeRange == "end") {
            this.setEndDate(date);
          } else {
            this.setStartDate(date);
          }
        } else {
          const startDiff = getDaysDiff(date, start);
          const endDiff = getDaysDiff(date, end);
          if (endDiff === 0 || startDiff < 0) {
            this.setStartDate(date);
          } else if (startDiff === 0 || endDiff < 0) {
            this.setEndDate(date);
          } else if (startDiff < endDiff) {
            this.setStartDate(date);
          } else {
            this.setEndDate(date);
          }
        }
      } else {
        this.setStartDate(date);
      }
    }
    this.calciteDatePickerChange.emit();
  };

  /**
   * Get an active date using the value, or current date as default
   *
   * @param value
   * @param min
   * @param max
   */
  private getActiveDate(value: Date | null, min: Date | null, max: Date | null): Date {
    return dateFromRange(this.activeDate, min, max) || value || dateFromRange(new Date(), min, max);
  }

  private getActiveEndDate(value: Date | null, min: Date | null, max: Date | null): Date {
    return (
      dateFromRange(this.activeEndDate, min, max) || value || dateFromRange(new Date(), min, max)
    );
  }
}
