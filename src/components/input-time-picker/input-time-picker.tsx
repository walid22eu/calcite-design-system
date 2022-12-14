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
import { guid } from "../../utils/guid";
import { formatTimeString, isValidTime, localizeTimeString } from "../../utils/time";
import { Scale } from "../interfaces";
import { FloatingUIComponent, LogicalPlacement, OverlayPositioning } from "../../utils/floating-ui";
import { connectLabel, disconnectLabel, getLabelText, LabelableComponent } from "../../utils/label";
import {
  connectForm,
  disconnectForm,
  FormComponent,
  HiddenFormInputSlot,
  submitForm
} from "../../utils/form";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";
import {
  connectLocalized,
  disconnectLocalized,
  LocalizedComponent,
  NumberingSystem,
  numberStringFormatter,
  updateEffectiveLocale
} from "../../utils/locale";
import { Messages } from "../time-picker/assets/time-picker/t9n";
import { numberKeys } from "../../utils/key";
import {
  setUpLoadableComponent,
  setComponentLoaded,
  LoadableComponent,
  componentLoaded
} from "../../utils/loadable";

@Component({
  tag: "calcite-input-time-picker",
  styleUrl: "input-time-picker.scss",
  shadow: true
})
export class InputTimePicker
  implements
    LabelableComponent,
    FormComponent,
    InteractiveComponent,
    FloatingUIComponent,
    LocalizedComponent,
    LoadableComponent
{
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteInputTimePickerElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** When `true`, displays the `calcite-time-picker` component. */

  @Prop({ reflect: true, mutable: true }) open = false;

  @Watch("open")
  openHandler(value: boolean): void {
    if (this.disabled || this.readOnly) {
      this.open = false;
      return;
    }

    if (value) {
      this.reposition(true);
    }
  }

  /** When `true`, interaction is prevented and the component is displayed with lower opacity. */
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

  /**
   * Accessible name for the component's hour input.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlHour?: string;

  /**
   * Accessible name for the component's hour down button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlHourDown?: string;

  /**
   * Accessible name for the component's hour up button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlHourUp?: string;

  /**
   * Accessible name for the component's meridiem (am/pm) input.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlMeridiem?: string;

  /**
   * Accessible name for the component's meridiem (am/pm) down button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlMeridiemDown?: string;

  /**
   * Accessible name for the component's meridiem (am/pm) up button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlMeridiemUp?: string;

  /**
   * Accessible name for the component's minute input.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlMinute?: string;

  /**
   * Accessible name for the component's minute down button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlMinuteDown?: string;

  /**
   * Accessible name for the component's minute up button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlMinuteUp?: string;

  /**
   * Accessible name for the component's second input.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlSecond?: string;

  /**
   * Accessible name for the component's second down button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlSecondDown?: string;

  /**
   * Accessible name for the component's second up button.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() intlSecondUp?: string;

  /**
   * Use this property to override individual strings used by the component.
   *
   * @deprecated - translations are now built-in, if you need to override a string, please use `messageOverrides`
   */
  @Prop() messagesOverrides: Partial<Messages>;

  /**
   * BCP 47 language tag for desired language and country format.
   *
   * @internal
   * @deprecated set the global `lang` attribute on the element instead.
   * @mdn [lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
   */
  @Prop({ mutable: true }) locale: string;

  @Watch("locale")
  localeChanged(): void {
    updateEffectiveLocale(this);
  }

  /** Specifies the name of the component on form submission. */
  @Prop() name: string;

  /**
   * Specifies the Unicode numeral system used by the component for localization.
   */
  @Prop() numberingSystem: NumberingSystem;

  /**
   * When `true`, the component must have a value in order for the form to submit.
   *
   * @internal
   */
  @Prop({ reflect: true }) required = false;

  /** Specifies the size of the component. */
  @Prop({ reflect: true }) scale: Scale = "m";

  /**
   * Determines the type of positioning to use for the overlaid content.
   *
   * Using `"absolute"` will work for most cases. The component will be positioned inside of overflowing parent containers and will affect the container's layout.
   *
   * `"fixed"` should be used to escape an overflowing parent container, or when the reference element's `position` CSS property is `"fixed"`.
   *
   */
  @Prop() overlayPositioning: OverlayPositioning = "absolute";

  /**
   * Determines where the popover will be positioned relative to the input.
   */
  @Prop({ reflect: true }) placement: LogicalPlacement = "auto";

  /** Specifies the granularity the component's `value` must adhere to (in seconds). */
  @Prop() step = 60;

  /** The component's value in UTC (always 24-hour format). */
  @Prop({ mutable: true }) value: string = null;

  @Watch("value")
  valueWatcher(newValue: string): void {
    if (!this.internalValueChange) {
      this.setValue({ value: newValue, origin: "external" });
    }
    this.internalValueChange = false;
  }

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: InputTimePicker["value"];

  private calciteInputEl: HTMLCalciteInputElement;

  private calciteTimePickerEl: HTMLCalciteTimePickerElement;

  /** whether the value of the input was changed as a result of user typing or not */
  private internalValueChange = false;

  private previousValidValue: string = null;

  private referenceElementId = `input-time-picker-${guid()}`;

  popoverEl: HTMLCalcitePopoverElement;

  //--------------------------------------------------------------------------
  //
  //  State
  //
  //--------------------------------------------------------------------------

  @State() effectiveLocale = "";

  @Watch("effectiveLocale")
  effectiveLocaleWatcher(): void {
    this.setInputValue(
      localizeTimeString({
        value: this.value,
        locale: this.effectiveLocale,
        numberingSystem: this.numberingSystem,
        includeSeconds: this.shouldIncludeSeconds()
      })
    );
  }

  @State() localizedValue: string;

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Fires when the time value is changed as a result of user input.
   */
  @Event({ cancelable: true }) calciteInputTimePickerChange: EventEmitter<string>;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  private calciteInternalInputBlurHandler = (): void => {
    this.open = false;
    const shouldIncludeSeconds = this.shouldIncludeSeconds();
    const { effectiveLocale: locale, numberingSystem, value, calciteInputEl } = this;

    numberStringFormatter.numberFormatOptions = {
      locale,
      numberingSystem,
      useGrouping: false
    };

    const delocalizedValue = numberStringFormatter.delocalize(calciteInputEl.value);

    const localizedInputValue = localizeTimeString({
      value: delocalizedValue,
      includeSeconds: shouldIncludeSeconds,
      locale,
      numberingSystem
    });
    this.setInputValue(
      localizedInputValue ||
        localizeTimeString({ value, locale, numberingSystem, includeSeconds: shouldIncludeSeconds })
    );
  };

  private calciteInternalInputFocusHandler = (event: CustomEvent): void => {
    if (!this.readOnly) {
      this.open = true;
      event.stopPropagation();
    }
  };

  private calciteInputInputHandler = (event: CustomEvent): void => {
    const target = event.target as HTMLCalciteTimePickerElement;

    numberStringFormatter.numberFormatOptions = {
      locale: this.effectiveLocale,
      numberingSystem: this.numberingSystem,
      useGrouping: false
    };

    const delocalizedValue = numberStringFormatter.delocalize(target.value);
    this.setValue({ value: delocalizedValue });

    // only translate the numerals until blur
    const localizedValue = delocalizedValue
      .split("")
      .map((char) =>
        numberKeys.includes(char)
          ? numberStringFormatter.numberFormatter.format(Number(char))
          : char
      )
      .join("");

    this.setInputValue(localizedValue);
  };

  @Listen("click")
  clickHandler(event: MouseEvent): void {
    if (event.composedPath().includes(this.calciteTimePickerEl)) {
      return;
    }
    this.setFocus();
  }

  @Listen("calciteInternalTimePickerBlur")
  timePickerBlurHandler(event: CustomEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.open = false;
  }

  private timePickerChangeHandler = (event: CustomEvent): void => {
    event.stopPropagation();
    const target = event.target as HTMLCalciteTimePickerElement;
    const value = target.value;
    this.setValue({ value, origin: "time-picker" });
  };

  @Listen("calciteInternalTimePickerFocus")
  timePickerFocusHandler(event: CustomEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.readOnly) {
      this.open = true;
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    await componentLoaded(this);

    this.calciteInputEl?.setFocus();
  }

  /**
   * Updates the position of the component.
   *
   * @param delayed
   */
  @Method()
  async reposition(delayed = false): Promise<void> {
    this.popoverEl?.reposition(delayed);
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  keyDownHandler = (event: KeyboardEvent): void => {
    const { defaultPrevented, key } = event;

    if (defaultPrevented) {
      return;
    }

    if (key === "Enter") {
      if (submitForm(this)) {
        event.preventDefault();
      }
    }

    if (key === "Escape" && this.open) {
      this.open = false;
      event.preventDefault();
    }
  };

  onLabelClick(): void {
    this.setFocus();
  }

  private shouldIncludeSeconds(): boolean {
    return this.step < 60;
  }

  private setCalcitePopoverEl = (el: HTMLCalcitePopoverElement): void => {
    this.popoverEl = el;
  };

  private setCalciteInputEl = (el: HTMLCalciteInputElement): void => {
    this.calciteInputEl = el;
  };

  private setCalciteTimePickerEl = (el: HTMLCalciteTimePickerElement): void => {
    this.calciteTimePickerEl = el;
  };

  private setInputValue = (newInputValue: string): void => {
    if (!this.calciteInputEl) {
      return;
    }
    this.calciteInputEl.value = newInputValue;
  };

  private setValue = ({
    value,
    origin = "input"
  }: {
    value: string;
    origin?: "input" | "time-picker" | "external" | "loading";
  }): void => {
    const previousValue = this.value;
    const newValue = formatTimeString(value);
    const newLocalizedValue = localizeTimeString({
      value: newValue,
      locale: this.effectiveLocale,
      numberingSystem: this.numberingSystem,
      includeSeconds: this.shouldIncludeSeconds()
    });
    this.internalValueChange = origin !== "external" && origin !== "loading";

    const shouldEmit =
      origin !== "loading" &&
      origin !== "external" &&
      ((value !== this.previousValidValue && !value) ||
        !!(!this.previousValidValue && newValue) ||
        (newValue !== this.previousValidValue && newValue));

    if (value) {
      if (shouldEmit) {
        this.previousValidValue = newValue;
      }
      if (newValue && newValue !== this.value) {
        this.value = newValue;
      }
      this.localizedValue = newLocalizedValue;
    } else {
      this.value = value;
      this.localizedValue = null;
    }

    if (origin === "time-picker" || origin === "external") {
      this.setInputValue(newLocalizedValue);
    }

    if (shouldEmit) {
      const changeEvent = this.calciteInputTimePickerChange.emit();

      if (changeEvent.defaultPrevented) {
        this.internalValueChange = false;
        this.value = previousValue;
        this.setInputValue(previousValue);
        this.previousValidValue = previousValue;
      } else {
        this.previousValidValue = newValue;
      }
    }
  };

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback() {
    connectLocalized(this);

    if (this.value) {
      this.setValue({ value: isValidTime(this.value) ? this.value : undefined, origin: "loading" });
    }

    connectLabel(this);
    connectForm(this);
  }

  componentWillLoad(): void {
    setUpLoadableComponent(this);
  }

  componentDidLoad() {
    setComponentLoaded(this);
    this.setInputValue(this.localizedValue);
  }

  disconnectedCallback() {
    disconnectLabel(this);
    disconnectForm(this);
    disconnectLocalized(this);
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const popoverId = `${this.referenceElementId}-popover`;
    return (
      <Host onKeyDown={this.keyDownHandler}>
        <div
          aria-controls={popoverId}
          aria-haspopup="dialog"
          aria-label={this.name}
          aria-owns={popoverId}
          id={this.referenceElementId}
          role="combobox"
        >
          <calcite-input
            disabled={this.disabled}
            icon="clock"
            label={getLabelText(this)}
            onCalciteInputInput={this.calciteInputInputHandler}
            onCalciteInternalInputBlur={this.calciteInternalInputBlurHandler}
            onCalciteInternalInputFocus={this.calciteInternalInputFocusHandler}
            readOnly={this.readOnly}
            ref={this.setCalciteInputEl}
            scale={this.scale}
            step={this.step}
          />
        </div>
        <calcite-popover
          disableFocusTrap={true}
          id={popoverId}
          label="Time Picker"
          open={this.open}
          overlayPositioning={this.overlayPositioning}
          placement={this.placement}
          ref={this.setCalcitePopoverEl}
          referenceElement={this.referenceElementId}
          triggerDisabled={true}
        >
          <calcite-time-picker
            //t9n props are used here to forward the messages only.
            intlHour={this.intlHour}
            intlHourDown={this.intlHourDown}
            intlHourUp={this.intlHourUp}
            intlMeridiem={this.intlMeridiem}
            intlMeridiemDown={this.intlMeridiemDown}
            intlMeridiemUp={this.intlMeridiemUp}
            intlMinute={this.intlMinute}
            intlMinuteDown={this.intlMinuteDown}
            intlMinuteUp={this.intlMinuteUp}
            intlSecond={this.intlSecond}
            intlSecondDown={this.intlSecondDown}
            intlSecondUp={this.intlSecondUp}
            lang={this.effectiveLocale}
            messageOverrides={this.messagesOverrides}
            numberingSystem={this.numberingSystem}
            onCalciteInternalTimePickerChange={this.timePickerChangeHandler}
            ref={this.setCalciteTimePickerEl}
            scale={this.scale}
            step={this.step}
            value={this.value}
          />
        </calcite-popover>
        <HiddenFormInputSlot component={this} />
      </Host>
    );
  }
}
