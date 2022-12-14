import {
  Component,
  Element,
  Prop,
  Event,
  h,
  EventEmitter,
  VNode,
  State,
  Watch,
  Fragment
} from "@stencil/core";
import { dateFromRange, nextMonth, prevMonth, getOrder } from "../../utils/date";

import { DateLocaleData } from "../date-picker/utils";
import { Scale } from "../interfaces";
import { HeadingLevel, Heading } from "../functional/Heading";
import { BUDDHIST_CALENDAR_YEAR_OFFSET, CSS, ICON } from "./resources";
import { isActivationKey } from "../../utils/key";
import { numberStringFormatter } from "../../utils/locale";
import { closestElementCrossShadowBoundary } from "../../utils/dom";
import { Messages } from "../date-picker/assets/date-picker/t9n";

@Component({
  tag: "calcite-date-picker-month-header",
  styleUrl: "date-picker-month-header.scss",
  shadow: true
})
export class DatePickerMonthHeader {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteDatePickerMonthHeaderElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** Already selected date. */
  @Prop() selectedDate: Date;

  /** Focused date with indicator (will become selected date if user proceeds) */
  @Prop() activeDate: Date;

  /**
   * Specifies the number at which section headings should start.
   */
  @Prop() headingLevel: HeadingLevel;

  /** Specifies the earliest allowed date (`"yyyy-mm-dd"`). */
  @Prop() min: Date;

  /** Specifies the latest allowed date (`"yyyy-mm-dd"`). */
  @Prop() max: Date;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale;

  /** CLDR locale data for translated calendar info */
  @Prop() localeData: DateLocaleData;

  /**
   * This property specifies accessible strings for the component's previous month button ,next month button & year input elements.
   * Made into a prop for testing purposes only.
   *
   * @internal
   * @readonly
   */
  @Prop({ mutable: true }) messages: Messages;

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------
  /**
   *  Changes to active date
   */
  @Event({ cancelable: false }) calciteDatePickerSelect: EventEmitter<Date>;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentWillLoad(): void {
    this.parentDatePickerEl = closestElementCrossShadowBoundary(
      this.el,
      "calcite-date-picker"
    ) as HTMLCalciteDatePickerElement;
  }

  connectedCallback(): void {
    this.setNextPrevMonthDates();
  }

  render(): VNode {
    return <div class={CSS.header}>{this.renderContent()}</div>;
  }

  renderContent(): VNode {
    const { messages, localeData, activeDate } = this;
    if (!activeDate || !localeData) {
      return null;
    }

    if (this.parentDatePickerEl) {
      const { numberingSystem, lang: locale } = this.parentDatePickerEl;

      numberStringFormatter.numberFormatOptions = {
        useGrouping: false,
        ...(numberingSystem && { numberingSystem }),
        ...(locale && { locale })
      };
    }

    const activeMonth = activeDate.getMonth();
    const { months, unitOrder } = localeData;
    const localizedMonth = (months.wide || months.narrow || months.abbreviated)[activeMonth];
    const localizedYear = this.formatCalendarYear(activeDate.getFullYear());
    const iconScale = this.scale === "l" ? "m" : "s";

    const order = getOrder(unitOrder);
    const reverse = order.indexOf("y") < order.indexOf("m");
    const suffix = localeData.year?.suffix;
    return (
      <Fragment>
        <a
          aria-disabled={`${this.prevMonthDate.getMonth() === activeMonth}`}
          aria-label={messages.prevMonth}
          class={CSS.chevron}
          href="#"
          onClick={this.prevMonthClick}
          onKeyDown={this.prevMonthKeydown}
          role="button"
          tabindex={this.prevMonthDate.getMonth() === activeMonth ? -1 : 0}
        >
          <calcite-icon flip-rtl icon={ICON.chevronLeft} scale={iconScale} />
        </a>
        <div class={{ text: true, [CSS.textReverse]: reverse }}>
          <Heading class={CSS.month} level={this.headingLevel}>
            {localizedMonth}
          </Heading>
          <span class={CSS.yearWrap}>
            <input
              aria-label={messages.year}
              class={{
                year: true,
                [CSS.yearSuffix]: !!suffix
              }}
              inputmode="numeric"
              maxlength="4"
              minlength="1"
              onChange={this.onYearChange}
              onInput={this.onYearInput}
              onKeyDown={this.onYearKey}
              pattern="\d*"
              ref={(el) => (this.yearInput = el)}
              type="text"
              value={localizedYear}
            />
            {suffix && <span class={CSS.suffix}>{suffix}</span>}
          </span>
        </div>
        <a
          aria-disabled={`${this.nextMonthDate.getMonth() === activeMonth}`}
          aria-label={messages.nextMonth}
          class={CSS.chevron}
          href="#"
          onClick={this.nextMonthClick}
          onKeyDown={this.nextMonthKeydown}
          role="button"
          tabindex={this.nextMonthDate.getMonth() === activeMonth ? -1 : 0}
        >
          <calcite-icon flip-rtl icon={ICON.chevronRight} scale={iconScale} />
        </a>
      </Fragment>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  @State() globalAttributes = {};

  private yearInput: HTMLInputElement;

  private parentDatePickerEl: HTMLCalciteDatePickerElement;

  @State() nextMonthDate: Date;

  @State() prevMonthDate: Date;

  @Watch("min")
  @Watch("max")
  @Watch("activeDate")
  setNextPrevMonthDates(): void {
    if (!this.activeDate) {
      return;
    }

    this.nextMonthDate = dateFromRange(nextMonth(this.activeDate), this.min, this.max);
    this.prevMonthDate = dateFromRange(prevMonth(this.activeDate), this.min, this.max);
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------
  /**
   * Increment year on UP/DOWN keys
   *
   * @param event
   */
  private onYearKey = (event: KeyboardEvent): void => {
    const localizedYear = this.parseCalendarYear((event.target as HTMLInputElement).value);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.setYear({ localizedYear, offset: -1 });
        break;
      case "ArrowUp":
        event.preventDefault();
        this.setYear({ localizedYear, offset: 1 });
        break;
    }
  };

  private formatCalendarYear(year: number): string {
    const { localeData } = this;
    const buddhistCalendar = localeData["default-calendar"] === "buddhist";
    const yearOffset = buddhistCalendar ? BUDDHIST_CALENDAR_YEAR_OFFSET : 0;

    return numberStringFormatter.localize(`${year + yearOffset}`);
  }

  private parseCalendarYear(year: string): string {
    const { localeData } = this;
    const buddhistCalendar = localeData["default-calendar"] === "buddhist";
    const yearOffset = buddhistCalendar ? BUDDHIST_CALENDAR_YEAR_OFFSET : 0;

    const parsedYear = Number(numberStringFormatter.delocalize(year)) - yearOffset;
    return numberStringFormatter.localize(`${parsedYear}`);
  }

  private onYearChange = (event: Event): void => {
    this.setYear({
      localizedYear: this.parseCalendarYear((event.target as HTMLInputElement).value)
    });
  };

  private onYearInput = (event: Event): void => {
    this.setYear({
      localizedYear: this.parseCalendarYear((event.target as HTMLInputElement).value),
      commit: false
    });
  };

  private prevMonthClick = (event: KeyboardEvent | MouseEvent): void => {
    this.handleArrowClick(event, this.prevMonthDate);
  };

  private prevMonthKeydown = (event: KeyboardEvent): void => {
    if (isActivationKey(event.key)) {
      this.prevMonthClick(event);
    }
  };

  private nextMonthClick = (event: MouseEvent | KeyboardEvent): void => {
    this.handleArrowClick(event, this.nextMonthDate);
  };

  private nextMonthKeydown = (event: KeyboardEvent): void => {
    if (isActivationKey(event.key)) {
      this.nextMonthClick(event);
    }
  };

  /*
   * Update active month on clicks of left/right arrows
   */
  private handleArrowClick = (event: MouseEvent | KeyboardEvent, date: Date): void => {
    event.preventDefault();
    this.calciteDatePickerSelect.emit(date);
  };

  private getInRangeDate({
    localizedYear,
    offset = 0
  }: {
    localizedYear: string;
    offset?: number;
  }): Date {
    const { min, max, activeDate } = this;
    const parsedYear = Number(numberStringFormatter.delocalize(localizedYear));
    const length = parsedYear.toString().length;
    const year = isNaN(parsedYear) ? false : parsedYear + offset;
    const inRange =
      year && (!min || min.getFullYear() <= year) && (!max || max.getFullYear() >= year);
    // if you've supplied a year and it's in range
    if (year && inRange && length === localizedYear.length) {
      const nextDate = new Date(activeDate);
      nextDate.setFullYear(year as number);
      return dateFromRange(nextDate, min, max);
    }
  }

  /**
   * Parse localized year string from input,
   * set to active if in range
   *
   * @param root0
   * @param root0.localizedYear
   * @param root0.commit
   * @param root0.offset
   */
  private setYear({
    localizedYear,
    commit = true,
    offset = 0
  }: {
    localizedYear: string;
    commit?: boolean;
    offset?: number;
  }): void {
    const { yearInput, activeDate } = this;
    const inRangeDate = this.getInRangeDate({ localizedYear, offset });

    // if you've supplied a year and it's in range, update active date
    if (inRangeDate) {
      this.calciteDatePickerSelect.emit(inRangeDate);
    }

    if (commit) {
      yearInput.value = this.formatCalendarYear((inRangeDate || activeDate).getFullYear());
    }
  }
}
