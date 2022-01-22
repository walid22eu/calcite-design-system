import { Scale, Status } from "../interfaces";
import {
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
  Watch
} from "@stencil/core";
import { getElementDir, getElementProp, getSlotted, setRequestedIcon } from "../../utils/dom";

import { CSS, INPUT_TYPE_ICONS, SLOTS } from "./resources";
import { InputPlacement } from "./interfaces";
import { Position } from "../interfaces";
import { LabelableComponent, connectLabel, disconnectLabel, getLabelText } from "../../utils/label";
import { connectForm, disconnectForm, FormComponent, HiddenFormInputSlot } from "../../utils/form";
import {
  getDecimalSeparator,
  delocalizeNumberString,
  localizeNumberString
} from "../../utils/locale";
import { numberKeys } from "../../utils/key";
import { isValidNumber, parseNumberString, sanitizeNumberString } from "../../utils/number";
import { CSS_UTILITY, TEXT } from "../../utils/resources";
import { decimalPlaces } from "../../utils/math";
import { createObserver } from "../../utils/observers";

type NumberNudgeDirection = "up" | "down";

/**
 * @slot action - A slot for positioning a button next to an input
 */
@Component({
  tag: "calcite-input",
  styleUrl: "calcite-input.scss",
  shadow: true
})
export class CalciteInput implements LabelableComponent, FormComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteInputElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** specify the alignment of the value of the input */
  @Prop({ reflect: true }) alignment: Position = "start";

  /** should the input autofocus */
  @Prop() autofocus = false;

  /** optionally display a clear button that displays when field has a value
   * shows by default for search, time, date
   * will not display for type="textarea" */
  @Prop({ reflect: true }) clearable = false;

  /** is the input disabled  */
  @Prop({ reflect: true }) disabled = false;

  @Watch("disabled")
  disabledWatcher(): void {
    this.setDisabledAction();
  }

  /** for number values, displays the locale's group separator */
  @Prop() groupSeparator = false;

  /** when true, the component will not be visible */
  @Prop() hidden = false;

  /** when used as a boolean set to true, show a default recommended icon for certain
   * input types (tel, password, email, date, time, search). You can also pass a
   * calcite-ui-icon name to this prop to display a requested icon for any input type */
  @Prop({ reflect: true }) icon: string | boolean;

  /**
   * string to override English loading text
   * @default "Loading"
   */
  @Prop() intlLoading?: string = TEXT.loading;

  /** flip the icon in rtl */
  @Prop({ reflect: true }) iconFlipRtl = false;

  /** Applies to the aria-label attribute on the button or hyperlink */
  @Prop() label?: string;

  /** specify if the input is in loading state */
  @Prop({ reflect: true }) loading = false;

  /** BCP 47 language tag for desired language and country format */
  @Prop() locale?: string = document.documentElement.lang || "en";

  /**
   * Toggles locale formatting for numbers.
   * @internal
   */
  @Prop() localeFormat = false;

  /** input max */
  @Prop({ reflect: true }) max?: number;

  /** watcher to update number-to-string for max */
  @Watch("max")
  maxWatcher(): void {
    this.maxString = this.max?.toString() || null;
  }

  /** input min */
  @Prop({ reflect: true }) min?: number;

  /** watcher to update number-to-string for min */
  @Watch("min")
  minWatcher(): void {
    this.minString = this.min?.toString() || null;
  }

  /**
   * Maximum length of text input.
   * @deprecated use maxLength instead
   */
  @Prop({ reflect: true }) maxlength?: number;

  /** Maximum length of the input value */
  @Prop({ reflect: true }) maxLength?: number;

  /** Minimum length of the text input */
  @Prop({ reflect: true }) minLength?: number;

  /** The name of the input */
  @Prop({ reflect: true }) name: string;

  /** specify the placement of the number buttons */
  @Prop({ reflect: true }) numberButtonType?: InputPlacement = "vertical";

  /** explicitly whitelist placeholder attribute */
  @Prop() placeholder: string;

  /** optionally add prefix  */
  @Prop() prefixText?: string;

  /** When true, a field cannot be modified. */
  @Prop() readOnly = false;

  /** is the input required */
  @Prop() required = false;

  /** specify the scale of the input, defaults to m */
  @Prop({ mutable: true, reflect: true }) scale: Scale = "m";

  /** specify the status of the input field, determines message and icons */
  @Prop({ mutable: true, reflect: true }) status: Status = "idle";

  /** input step */
  @Prop({ reflect: true }) step?: number | "any";

  /** optionally add suffix  **/
  @Prop() suffixText?: string;

  /** @internal adds inline styles for text input when slotted in calcite-inline-editable */
  @Prop({ mutable: true, reflect: true }) editingEnabled = false;

  /**
   * specify the input type
   *
   * Note that the following types add type-specific icons by default: `date`, `email`, `password`, `search`, `tel`, `time`
   */
  @Prop({ reflect: true }) type:
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "image"
    | "month"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "textarea"
    | "time"
    | "url"
    | "week" = "text";

  /** input value */
  @Prop({ mutable: true }) value = "";

  @Watch("value")
  valueWatcher(newValue: string): void {
    if (!this.internalValueChange) {
      this.setValue({
        origin: "external",
        value:
          newValue == null
            ? ""
            : this.type === "number"
            ? isValidNumber(newValue)
              ? newValue
              : this.previousValue || ""
            : newValue
      });
      this.warnAboutInvalidNumberValue(newValue);
    }
    this.internalValueChange = false;
  }

  @Watch("icon")
  @Watch("type")
  updateRequestedIcon(): void {
    this.requestedIcon = setRequestedIcon(INPUT_TYPE_ICONS, this.icon, this.type);
  }

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: CalciteInput["value"];

  inlineEditableEl: HTMLCalciteInlineEditableElement;

  /** keep track of the rendered child type */
  private childEl?: HTMLInputElement | HTMLTextAreaElement;

  /** keep track of the rendered child type */
  private childElType?: "input" | "textarea" = "input";

  /** number text input element for locale */
  private childNumberEl?: HTMLInputElement;

  /** whether the value of the input was changed as a result of user typing or not */
  private internalValueChange = false;

  get isClearable(): boolean {
    return !this.isTextarea && (this.clearable || this.type === "search") && this.value.length > 0;
  }

  get isTextarea(): boolean {
    return this.childElType === "textarea";
  }

  private minString?: string;

  private maxString?: string;

  private preFocusValue: string;

  private previousValue: string;

  /** the computed icon to render */
  private requestedIcon?: string;

  private nudgeNumberValueIntervalId;

  mutationObserver = createObserver("mutation", () => this.setDisabledAction());

  //--------------------------------------------------------------------------
  //
  //  State
  //
  //--------------------------------------------------------------------------

  @State() localizedValue: string;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.scale = getElementProp(this.el, "scale", this.scale);
    this.status = getElementProp(this.el, "status", this.status);
    this.inlineEditableEl = this.el.closest("calcite-inline-editable");
    if (this.inlineEditableEl) {
      this.editingEnabled = this.inlineEditableEl.editingEnabled || false;
    }
    this.setPreviousValue(this.value);
    if (this.type === "number") {
      this.warnAboutInvalidNumberValue(this.value);
      this.setValue({
        origin: "loading",
        value: isValidNumber(this.value) ? this.value : ""
      });
    }
    connectLabel(this);
    connectForm(this);
    this.mutationObserver?.observe(this.el, { childList: true });
    this.setDisabledAction();
  }

  disconnectedCallback(): void {
    disconnectLabel(this);
    disconnectForm(this);
    this.mutationObserver?.disconnect();
  }

  componentWillLoad(): void {
    this.childElType = this.type === "textarea" ? "textarea" : "input";
    this.maxString = this.max?.toString();
    this.minString = this.min?.toString();
    this.requestedIcon = setRequestedIcon(INPUT_TYPE_ICONS, this.icon, this.type);
  }

  componentShouldUpdate(newValue: string, oldValue: string, property: string): boolean {
    if (this.type === "number" && property === "value" && newValue && !isValidNumber(newValue)) {
      this.setValue({
        value: oldValue
      });
      return false;
    }
    return true;
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event() calciteInputFocus: EventEmitter;

  /**
   * @internal
   */
  @Event() calciteInputBlur: EventEmitter;

  /**
   * This event fires each time a new value is typed.
   */
  @Event({ cancelable: true }) calciteInputInput: EventEmitter;

  /**
   * This event fires each time a new value is typed and committed.
   */
  @Event() calciteInputChange: EventEmitter<void>;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    if (this.type === "number") {
      this.childNumberEl?.focus();
    } else {
      this.childEl?.focus();
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  keyDownHandler = (event: KeyboardEvent): void => {
    /* prevent default behavior for input to move the cursor to the beginning of the input with every ArrowUp press */
    if (event.key === "ArrowUp") {
      event.preventDefault();
    }
    if (this.readOnly || this.disabled) {
      return;
    }
    if (this.isClearable && event.key === "Escape") {
      this.clearInputValue(event);
      event.preventDefault();
    }
  };

  onLabelClick(): void {
    this.setFocus();
  }

  incrementOrDecrementNumberValue(
    direction: NumberNudgeDirection,
    inputMax: number | null,
    inputMin: number | null,
    nativeEvent: KeyboardEvent | MouseEvent
  ): void {
    const { value } = this;
    const inputStep = this.step === "any" ? 1 : Math.abs(this.step || 1);
    const inputVal = value && value !== "" ? parseFloat(value) : 0;

    const adjustment = direction === "up" ? 1 : -1;
    const nudgedValue = inputVal + inputStep * adjustment;
    const finalValue =
      (typeof inputMin === "number" && !isNaN(inputMin) && nudgedValue < inputMin) ||
      (typeof inputMax === "number" && !isNaN(inputMax) && nudgedValue > inputMax)
        ? inputVal
        : nudgedValue;

    const inputValPlaces = decimalPlaces(inputVal);
    const inputStepPlaces = decimalPlaces(inputStep);

    this.setValue({
      committing: true,
      nativeEvent,
      value: finalValue.toFixed(Math.max(inputValPlaces, inputStepPlaces))
    });
  }

  private clearInputValue = (nativeEvent: KeyboardEvent | MouseEvent): void => {
    this.setValue({
      committing: true,
      nativeEvent,
      value: ""
    });
  };

  private inputBlurHandler = () => {
    if (this.type === "number") {
      this.setValue({ value: this.value });
    }
    this.calciteInputBlur.emit({
      element: this.childEl,
      value: this.value
    });

    if (this.preFocusValue !== this.value) {
      this.calciteInputChange.emit();
    }
  };

  private inputFocusHandler = (event: FocusEvent): void => {
    const slottedActionEl = getSlotted(this.el, "action");
    if (event.target !== slottedActionEl) {
      this.setFocus();
    }
    this.calciteInputFocus.emit({
      element: this.childEl,
      value: this.value
    });

    this.preFocusValue = this.value;
  };

  private inputInputHandler = (nativeEvent: InputEvent): void => {
    if (this.disabled || this.readOnly) {
      return;
    }
    this.setValue({
      nativeEvent,
      value: (nativeEvent.target as HTMLInputElement).value
    });
  };

  private inputKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.disabled || this.readOnly) {
      return;
    }
    if (event.key === "Enter") {
      this.calciteInputChange.emit();
    }
  };

  private inputNumberInputHandler = (nativeEvent: InputEvent): void => {
    if (this.disabled || this.readOnly) {
      return;
    }
    const value = (nativeEvent.target as HTMLInputElement).value;
    const delocalizedValue = delocalizeNumberString(value, this.locale);
    if (nativeEvent.inputType === "insertFromPaste") {
      if (!isValidNumber(delocalizedValue)) {
        nativeEvent.preventDefault();
      }
      this.setValue({
        nativeEvent,
        value: parseNumberString(delocalizedValue)
      });
      this.childNumberEl.value = this.localizedValue;
    } else {
      this.setValue({
        nativeEvent,
        value: delocalizeNumberString(value, this.locale)
      });
    }
  };

  private inputNumberKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.type !== "number" || this.disabled || this.readOnly) {
      return;
    }
    if (event.key === "ArrowUp") {
      this.nudgeNumberValue("up", event);
      return;
    }
    if (event.key === "ArrowDown") {
      this.nudgeNumberValue("down", event);
      return;
    }
    const supportedKeys = [
      ...numberKeys,
      "ArrowLeft",
      "ArrowRight",
      "Backspace",
      "Delete",
      "Enter",
      "Escape",
      "Tab"
    ];
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    const isShiftTabEvent = event.shiftKey && event.key === "Tab";
    if (supportedKeys.includes(event.key) && (!event.shiftKey || isShiftTabEvent)) {
      if (event.key === "Enter") {
        this.calciteInputChange.emit();
      }
      return;
    }
    const decimalSeparator = getDecimalSeparator(this.locale);
    if (event.key === decimalSeparator) {
      if (!this.value && !this.childNumberEl.value) {
        return;
      }
      if (this.value && this.childNumberEl.value.indexOf(decimalSeparator) === -1) {
        return;
      }
    }
    if (/[eE]/.test(event.key)) {
      if (!this.value && !this.childNumberEl.value) {
        return;
      }
      if (this.value && !/[eE]/.test(this.childNumberEl.value)) {
        return;
      }
    }

    if (event.key === "-") {
      if (!this.value && !this.childNumberEl.value) {
        return;
      }
      if (this.value && this.childNumberEl.value.split("-").length <= 2) {
        return;
      }
    }
    event.preventDefault();
  };

  private nudgeNumberValue = (
    direction: NumberNudgeDirection,
    nativeEvent: KeyboardEvent | MouseEvent
  ): void => {
    if ((nativeEvent instanceof KeyboardEvent && nativeEvent.repeat) || this.type !== "number") {
      return;
    }

    const inputMax = this.maxString ? parseFloat(this.maxString) : null;
    const inputMin = this.minString ? parseFloat(this.minString) : null;
    const valueNudgeDelayInMs = 100;

    this.incrementOrDecrementNumberValue(direction, inputMax, inputMin, nativeEvent);

    if (this.nudgeNumberValueIntervalId) {
      window.clearInterval(this.nudgeNumberValueIntervalId);
    }
    let firstValueNudge = true;
    this.nudgeNumberValueIntervalId = window.setInterval(() => {
      if (firstValueNudge) {
        firstValueNudge = false;
        return;
      }

      this.incrementOrDecrementNumberValue(direction, inputMax, inputMin, nativeEvent);
    }, valueNudgeDelayInMs);
  };

  private numberButtonMouseUpAndMouseOutHandler = (): void => {
    window.clearInterval(this.nudgeNumberValueIntervalId);
  };

  private numberButtonMouseDownHandler = (event: MouseEvent): void => {
    event.preventDefault();
    const direction = (event.target as HTMLDivElement).dataset.adjustment as NumberNudgeDirection;
    this.nudgeNumberValue(direction, event);
  };

  onFormReset(): void {
    this.setValue({
      value: this.defaultValue
    });
  }

  syncHiddenFormInput(input: HTMLInputElement): void {
    if (this.type === "number") {
      input.type = "number";
      input.min = this.min?.toString(10) ?? "";
      input.max = this.max?.toString(10) ?? "";
    } else if (this.type === "text") {
      input.type = "text";

      if (this.minLength != null) {
        input.minLength = this.minLength;
      }

      if (this.maxLength != null) {
        input.maxLength = this.maxLength;
      }
    } else if (this.type === "password") {
      input.type = "password";
    }
  }

  private setChildElRef = (el) => {
    this.childEl = el;
  };

  private setChildNumberElRef = (el) => {
    this.childNumberEl = el;
  };

  private setDisabledAction(): void {
    const slottedActionEl = getSlotted(this.el, "action");

    if (!slottedActionEl) {
      return;
    }

    this.disabled
      ? slottedActionEl.setAttribute("disabled", "")
      : slottedActionEl.removeAttribute("disabled");
  }

  private setInputValue = (newInputValue: string): void => {
    if (this.type === "text" && !this.childEl) {
      return;
    }
    if (this.type === "number" && !this.childNumberEl) {
      return;
    }
    this[`child${this.type === "number" ? "Number" : ""}El`].value = newInputValue;
  };

  private setPreviousValue = (newPreviousValue: string): void => {
    this.previousValue =
      this.type === "number"
        ? isValidNumber(newPreviousValue)
          ? newPreviousValue
          : ""
        : newPreviousValue;
  };

  private setValue = ({
    committing = false,
    nativeEvent,
    origin = "internal",
    value
  }: {
    committing?: boolean;
    nativeEvent?: MouseEvent | KeyboardEvent | InputEvent;
    origin?: "internal" | "external" | "loading";
    value: string;
  }): void => {
    const previousLocalizedValue =
      this.type === "number"
        ? localizeNumberString(this.previousValue, this.locale, this.groupSeparator)
        : "";
    const sanitizedValue = this.type === "number" ? sanitizeNumberString(value) : value;
    const newValue =
      this.type === "number" && value && !sanitizedValue
        ? isValidNumber(this.previousValue)
          ? this.previousValue
          : ""
        : sanitizedValue;
    const newLocalizedValue =
      this.type === "number"
        ? localizeNumberString(newValue, this.locale, this.groupSeparator)
        : "";

    this.internalValueChange = origin === "internal";
    this.setPreviousValue(this.value);
    this.value = newValue;

    if (this.type === "number") {
      this.localizedValue = newLocalizedValue;
    }

    if (origin === "external") {
      this.setInputValue(this.type === "number" ? newLocalizedValue : newValue);
    }

    if (nativeEvent) {
      const calciteInputInputEvent = this.calciteInputInput.emit({
        element: this.childEl,
        nativeEvent,
        value: this.value
      });

      if (calciteInputInputEvent.defaultPrevented) {
        this.value = this.previousValue;
        this.localizedValue = previousLocalizedValue;
      } else if (committing) {
        this.calciteInputChange.emit();
      }
    }
  };

  private inputKeyUpHandler = (): void => {
    window.clearInterval(this.nudgeNumberValueIntervalId);
  };

  private warnAboutInvalidNumberValue(value: string): void {
    if (this.type === "number" && value && !isValidNumber(value)) {
      console.warn(`The specified value "${value}" cannot be parsed, or is out of range.`);
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const dir = getElementDir(this.el);

    const loader = (
      <div class={CSS.loader}>
        <calcite-progress label={this.intlLoading} type="indeterminate" />
      </div>
    );

    const inputClearButton = (
      <button
        class={CSS.clearButton}
        disabled={this.disabled || this.readOnly}
        onClick={this.clearInputValue}
        tabIndex={this.disabled ? -1 : 0}
        type="button"
      >
        <calcite-icon icon="x" scale="s" />
      </button>
    );
    const iconEl = (
      <calcite-icon
        class={CSS.inputIcon}
        flipRtl={this.iconFlipRtl}
        icon={this.requestedIcon}
        scale="s"
      />
    );

    const isHorizontalNumberButton = this.numberButtonType === "horizontal";

    const numberButtonsHorizontalUp = (
      <button
        class={{
          [CSS.numberButtonItem]: true,
          [CSS.buttonItemHorizontal]: isHorizontalNumberButton
        }}
        data-adjustment="up"
        disabled={this.disabled || this.readOnly}
        onMouseDown={this.numberButtonMouseDownHandler}
        onMouseOut={this.numberButtonMouseUpAndMouseOutHandler}
        onMouseUp={this.numberButtonMouseUpAndMouseOutHandler}
        tabIndex={-1}
        type="button"
      >
        <calcite-icon icon="chevron-up" scale="s" />
      </button>
    );

    const numberButtonsHorizontalDown = (
      <button
        class={{
          [CSS.numberButtonItem]: true,
          [CSS.buttonItemHorizontal]: isHorizontalNumberButton
        }}
        data-adjustment="down"
        disabled={this.disabled || this.readOnly}
        onMouseDown={this.numberButtonMouseDownHandler}
        onMouseOut={this.numberButtonMouseUpAndMouseOutHandler}
        onMouseUp={this.numberButtonMouseUpAndMouseOutHandler}
        tabIndex={-1}
        type="button"
      >
        <calcite-icon icon="chevron-down" scale="s" />
      </button>
    );

    const numberButtonsVertical = (
      <div class={CSS.numberButtonWrapper}>
        {numberButtonsHorizontalUp}
        {numberButtonsHorizontalDown}
      </div>
    );

    const prefixText = <div class={CSS.prefix}>{this.prefixText}</div>;

    const suffixText = <div class={CSS.suffix}>{this.suffixText}</div>;

    const localeNumberInput =
      this.type === "number" ? (
        <input
          aria-label={getLabelText(this)}
          autofocus={this.autofocus ? true : null}
          defaultValue={this.defaultValue}
          disabled={this.disabled ? true : null}
          enterKeyHint={this.el.enterKeyHint}
          inputMode={this.el.inputMode}
          key="localized-input"
          maxLength={this.maxLength}
          minLength={this.minLength}
          name={undefined}
          onBlur={this.inputBlurHandler}
          onFocus={this.inputFocusHandler}
          onInput={this.inputNumberInputHandler}
          onKeyDown={this.inputNumberKeyDownHandler}
          onKeyUp={this.inputKeyUpHandler}
          placeholder={this.placeholder || ""}
          readOnly={this.readOnly}
          ref={this.setChildNumberElRef}
          type="text"
          value={this.localizedValue}
        />
      ) : null;

    const childEl =
      this.type !== "number"
        ? [
            <this.childElType
              aria-label={getLabelText(this)}
              autofocus={this.autofocus ? true : null}
              class={{
                [CSS.editingEnabled]: this.editingEnabled,
                [CSS.inlineChild]: !!this.inlineEditableEl
              }}
              defaultValue={this.defaultValue}
              disabled={this.disabled ? true : null}
              enterKeyHint={this.el.enterKeyHint}
              inputMode={this.el.inputMode}
              max={this.maxString}
              maxLength={this.maxLength}
              min={this.minString}
              minLength={this.minLength}
              name={this.name}
              onBlur={this.inputBlurHandler}
              onFocus={this.inputFocusHandler}
              onInput={this.inputInputHandler}
              onKeyDown={this.inputKeyDownHandler}
              onKeyUp={this.inputKeyUpHandler}
              placeholder={this.placeholder || ""}
              readOnly={this.readOnly}
              ref={this.setChildElRef}
              required={this.required ? true : null}
              step={this.step}
              tabIndex={
                this.disabled || (this.inlineEditableEl && !this.editingEnabled) ? -1 : null
              }
              type={this.type}
              value={this.value}
            />,
            this.isTextarea ? (
              <div class={CSS.resizeIconWrapper}>
                <calcite-icon icon="chevron-down" scale="s" />
              </div>
            ) : null
          ]
        : null;

    return (
      <Host onClick={this.inputFocusHandler} onKeyDown={this.keyDownHandler}>
        <div class={{ [CSS.inputWrapper]: true, [CSS_UTILITY.rtl]: dir === "rtl" }}>
          {this.type === "number" && this.numberButtonType === "horizontal" && !this.readOnly
            ? numberButtonsHorizontalDown
            : null}
          {this.prefixText ? prefixText : null}
          <div class={CSS.wrapper}>
            {localeNumberInput}
            {childEl}
            {this.isClearable ? inputClearButton : null}
            {this.requestedIcon ? iconEl : null}
            {this.loading ? loader : null}
          </div>
          <div class={CSS.actionWrapper}>
            <slot name={SLOTS.action} />
          </div>
          {this.type === "number" && this.numberButtonType === "vertical" && !this.readOnly
            ? numberButtonsVertical
            : null}
          {this.suffixText ? suffixText : null}
          {this.type === "number" && this.numberButtonType === "horizontal" && !this.readOnly
            ? numberButtonsHorizontalUp
            : null}
          <HiddenFormInputSlot component={this} />
        </div>
      </Host>
    );
  }
}
