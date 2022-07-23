import {
  Component,
  Element,
  Prop,
  Host,
  Event,
  EventEmitter,
  Listen,
  h,
  VNode
} from "@stencil/core";

import { getElementDir } from "../../utils/dom";
import { DateLocaleData } from "../date-picker/utils";
import { Scale } from "../interfaces";
import { CSS_UTILITY } from "../../utils/resources";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";

@Component({
  tag: "calcite-date-picker-day",
  styleUrl: "date-picker-day.scss",
  shadow: true
})
export class DatePickerDay implements InteractiveComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteDatePickerDayElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** Day of the month to be shown. */
  @Prop() day: number;

  /** Date is outside of range and can't be selected */
  @Prop({ reflect: true }) disabled = false;

  /** Date is in the current month. */
  @Prop({ reflect: true }) currentMonth = false;

  /** Date is the current selected date of the picker */
  @Prop({ reflect: true }) selected = false;

  /** Date is currently highlighted as part of the range */
  @Prop({ reflect: true }) highlighted = false;

  /** Showing date range */
  @Prop({ reflect: true }) range = false;

  /** Date is the start of date range */
  @Prop({ reflect: true }) startOfRange = false;

  /** Date is the end of date range */
  @Prop({ reflect: true }) endOfRange = false;

  /** Date is being hovered and within the set range */
  @Prop({ reflect: true }) rangeHover = false;

  /** Date is actively in focus for keyboard navigation */
  @Prop({ reflect: true }) active = false;

  /** CLDR data for current locale */
  /* @internal */
  @Prop() localeData: DateLocaleData;

  /** specify the scale of the date picker */
  @Prop({ reflect: true }) scale: Scale;

  /** Date value for the day. */
  @Prop() value: Date;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  onClick = (): void => {
    !this.disabled && this.calciteDaySelect.emit();
  };

  keyDownHandler = (event: KeyboardEvent): void => {
    const key = event.key;
    if (key === " " || key === "Enter") {
      !this.disabled && this.calciteDaySelect.emit();
    }
  };

  @Listen("mouseover")
  mouseoverHandler(): void {
    this.calciteInternalDayHover.emit({
      disabled: this.disabled
    });
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Emitted when user selects day
   */
  @Event() calciteDaySelect: EventEmitter;

  /**
   * Emitted when user hovers over a day
   *
   * @internal
   */
  @Event() calciteInternalDayHover: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------
  render(): VNode {
    const formattedDay = String(this.day)
      .split("")
      .map((i) => this.localeData.numerals[i])
      .join("");
    const dir = getElementDir(this.el);
    return (
      <Host onClick={this.onClick} onKeyDown={this.keyDownHandler} role="gridcell">
        <div class={{ "day-v-wrapper": true, [CSS_UTILITY.rtl]: dir === "rtl" }}>
          <div class="day-wrapper">
            <span class="day">
              <span class="text">{formattedDay}</span>
            </span>
          </div>
        </div>
      </Host>
    );
  }

  componentDidRender(): void {
    updateHostInteraction(this, this.isTabbable);
  }

  isTabbable(): boolean {
    return this.active;
  }
}
