import {
  Component,
  Element,
  Prop,
  Host,
  Event,
  EventEmitter,
  h,
  Listen
} from "@stencil/core";
import {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  PAGE_UP,
  PAGE_DOWN,
  HOME,
  END,
  ENTER,
  SPACE,
  ESCAPE
} from "../../../../utils/keys";

@Component({
  tag: "calcite-date-month",
  styleUrl: "calcite-date-month.scss",
  shadow: true
})
export class CalciteDateMonth {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /**
   * Be sure to add a jsdoc comment describing your propery for the generated readme file.
   * If your property should be hidden from documentation, you can use the `@internal` tag
   */
  @Prop() month: number = 0;

  @Prop() year: number = 0;

  @Prop() selectedDate: Date;

  @Prop() activeDate: Date;

  @Prop() min: Date;

  @Prop() max: Date;

  /**
   * Sun by default
   * 0: Sunday
   * 1: Monday
   * 2: Tuesday
   * 3: Wednesday
   * 4: Thursday
   * 5: Friday
   * 6: Saturday
   */
  @Prop() startOfWeek: number = 0;

  @Prop() locale: string = "en-US";

  @Listen("keydown") keyDownHandler(e: KeyboardEvent) {
    let currentActiveDate = this.activeDate || this.selectedDate;
    switch (e.keyCode) {
      case UP:
        e.preventDefault();
        this.addDaysToActiveDate(currentActiveDate, 7, "dec");
        break;
      case RIGHT:
        e.preventDefault();
        this.addDaysToActiveDate(currentActiveDate, 1, "inc");
        break;
      case DOWN:
        e.preventDefault();
        this.addDaysToActiveDate(currentActiveDate, 7, "inc");
        break;
      case LEFT:
        e.preventDefault();
        this.addDaysToActiveDate(currentActiveDate, 1, "dec");
        break;
      case PAGE_UP:
        e.preventDefault();
        // TODO: decrease month
        this.addDaysToActiveDate(currentActiveDate, 7, "dec");
        break;
      case PAGE_DOWN:
        e.preventDefault();
        // TODO: increase month
        this.addDaysToActiveDate(currentActiveDate, 7, "dec");
        break;
      case HOME:
        e.preventDefault();
        currentActiveDate.setDate(1);
        this.addDaysToActiveDate(currentActiveDate, 0, "dec");
        break;
      case END:
        e.preventDefault();
        currentActiveDate.setDate(new Date(currentActiveDate.getFullYear(), currentActiveDate.getMonth()+1, 0).getDate());
        this.addDaysToActiveDate(currentActiveDate, 0, "dec");
        break;
      case ENTER:
      case SPACE:
        e.preventDefault();
        this.selectedDate = new Date(this.activeDate);
        this.calciteDateSelect.emit();
        this.addDaysToActiveDate(currentActiveDate, 0, "dec");
        break;
      case ESCAPE:
        e.preventDefault();
        this.selectedDate = null;
        this.calciteActiveDateChange.emit();
        this.addDaysToActiveDate(currentActiveDate, 0, "dec");
        break;
    }
  }

  private addDaysToActiveDate(currentActiveDate: Date, step: number, type: string) {
    let [activeDay, activeMonth, activeYear] = [currentActiveDate.getDate(), currentActiveDate.getMonth(), currentActiveDate.getFullYear()];
    let noOfDaysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
    switch (type) {
      case "inc":
        activeDay += step;
        if (activeDay > noOfDaysInMonth) {
          activeDay -= noOfDaysInMonth;
          activeMonth += 1;
          if (activeMonth === 12) {
            activeMonth = 1;
            activeYear += 1;
          }
        }
        if(this.validateDate(activeDay, activeMonth, activeYear)){
          this.activeDate = new Date(activeYear, activeMonth, activeDay);
          this.calciteActiveDateChange.emit();
        }
        break;
      case "dec":
        let noOfDaysInPrevMonth = new Date(activeYear, activeMonth, 0).getDate();
        activeDay -= step;
        if (activeDay < 0) {
          activeDay = noOfDaysInPrevMonth + activeDay;
          activeMonth -= 1;
          if (activeMonth === -1) {
            activeMonth = 11;
            activeYear -= 1;
          }
        }
        if(this.validateDate(activeDay, activeMonth, activeYear)){
          this.activeDate = new Date(activeYear, activeMonth, activeDay);
          this.calciteActiveDateChange.emit();
        }
      break;
    }

  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentWillUpdate(): void { }

  render() {
    let weekDays = this.getLocalizedWeekday(),
      curMonDays = [...Array(new Date(this.year, this.month + 1, 0).getDate()).keys()],
      prevMonDays = this.getPrevMonthdays(this.month, this.year),
      nextMonDays = this.getNextMonthdays(this.month, this.year),
      splitDays = [],
      days = [
        ...prevMonDays.map(prev => <calcite-date-day day={prev} enable={false} />),
        ...curMonDays.map(cur => <calcite-date-day day={cur + 1} enable={this.validateDate(cur + 1, this.month, this.year)} selected={this.isSelectedDate(this.year, this.month, cur + 1)} active={this.activeDate.getDate() === cur + 1} onCalciteDaySelect={() => this.onSelectDate(cur + 1)} />),
        ...nextMonDays.map(next => <calcite-date-day day={next + 1} enable={false} />)
      ];

    for (let i = 0; i < days.length; i += 7)
      splitDays.push(days.slice(i, i + 7));

    return (
      <Host>
        <div class="calender" role="grid">
          <div class="week-headers" role="presentation">
            {weekDays.map(weekday => (
              <span class="week-header" role="columnheader">
                {weekday}
              </span>
            ))}
          </div>
          {splitDays.map(days => (
            <div class="week-days" role="row">
              {days}
            </div>
          ))}
        </div>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------
  @Event() calciteDateSelect: EventEmitter;
  @Event() calciteActiveDateChange: EventEmitter;

  private onSelectDate(date): void {
    this.selectedDate = new Date(this.year, this.month, date);
    this.calciteDateSelect.emit();
  }

  private isSelectedDate(year, month, day) {
    let date = new Date(year, month, day);
    return date.toDateString() === this.selectedDate.toDateString();
  }

  private validateDate(day, month, year) {
    let isValid = true;
    if (this.min) {
      let minYear = this.min.getFullYear();
      let minMonth = this.min.getMonth();
      let minDay = this.min.getDate();

      isValid = isValid && (minYear < year ? true : minYear === year && minMonth < month ? true : minMonth === month && minDay < day ? true : false);
    }
    if (this.max) {
      let maxYear = this.max.getFullYear();
      let maxMonth = this.max.getMonth();
      let maxDay = this.max.getDate();
      isValid = isValid && (maxYear > year ? true : maxYear === year && maxMonth > month ? true : maxMonth === month && maxDay > day ? true : false);
    }
    return isValid;
  }

  private getPrevMonthdays(month, year) {
    let startDay = new Date(year, month, 1).getDay(),
      days = [],
      prevMonDays = new Date(year, month, 0).getDate();

    if (startDay === this.startOfWeek) {
      return days;
    }

    for (let i = (6 - this.startOfWeek + startDay) % 7; i >= 0; i--) {
      days.push(prevMonDays - i);
    }

    return days;
  }

  private getNextMonthdays(month, year) {
    let endDay = new Date(year, month + 1, 0).getDay(),
      days = [];
    if (endDay === (this.startOfWeek + 6) % 7) {
      return days;
    }

    return [...Array((6 - (endDay - this.startOfWeek)) % 7).keys()];
  }

  private getLocalizedWeekday() {
    let w = 1,
      startWeek = [],
      endWeek = [],
      date = new Date();
    for (; w < 8; w++) {
      date.setDate(w);
      let day = new Intl.DateTimeFormat(this.locale, {
        weekday: "short"
      }).format(date);
      date.getDay() === this.startOfWeek || startWeek.length > 0
        ? startWeek.push(day)
        : endWeek.push(day);
    }

    return [...startWeek, ...endWeek];
  }
}
