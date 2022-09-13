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
  VNode,
  Watch
} from "@stencil/core";
import { getElementDir, getElementProp, getSlotted, setRequestedIcon } from "../../utils/dom";

import { CSS, SLOTS, TEXT } from "./resources";
import { Position } from "../interfaces";
import { LabelableComponent, connectLabel, disconnectLabel, getLabelText } from "../../utils/label";
import {
  connectForm,
  disconnectForm,
  FormComponent,
  HiddenFormInputSlot,
  submitForm
} from "../../utils/form";
import { CSS_UTILITY, TEXT as COMMON_TEXT } from "../../utils/resources";

import { createObserver } from "../../utils/observers";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";

type SetValueOrigin = "initial" | "connected" | "user" | "reset" | "direct";

/**
 * @slot action - A slot for positioning a button next to the component.
 */
@Component({
  tag: "calcite-input-text",
  styleUrl: "input-text.scss",
  shadow: true
})
export class InputText implements LabelableComponent, FormComponent, InteractiveComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteInputTextElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** Specifies the text alignment of the component's value. */
  @Prop({ reflect: true }) alignment: Position = "start";

  /**
   * When true, the component is focused on page load.
   *
   * @mdn [autofocus](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus)
   */
  @Prop({ reflect: true }) autofocus = false;

  /**
   * When true, a clear button is displayed when the component has a value.
   */
  @Prop({ reflect: true }) clearable = false;

  /**
   * When true, interaction is prevented and the component is displayed with lower opacity.
   *
   * @mdn [disabled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled)
   */
  @Prop({ reflect: true }) disabled = false;

  @Watch("disabled")
  disabledWatcher(): void {
    this.setDisabledAction();
  }

  /**
   * When true, the component will not be visible.
   *
   * @mdn [hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden)
   */
  @Prop({ reflect: true }) hidden = false;

  /**
   * When true, shows a default recommended icon. Alternatively, pass a Calcite UI Icon name to display a specific icon.
   */
  @Prop({ reflect: true }) icon: string | boolean;

  /**
   * A text label that will appear on the clear button for screen readers.
   */
  @Prop() intlClear?: string;

  /**
   * Accessible name that will appear while loading.
   *
   * @default "Loading"
   */
  @Prop() intlLoading?: string = COMMON_TEXT.loading;

  /** When true, the icon is flipped in RTL. */
  @Prop({ reflect: true }) iconFlipRtl = false;

  /** Accessible name for the component's button or hyperlink. */
  @Prop() label?: string;

  /** When true, the component is in the loading state and `calcite-progress` is displayed. */
  @Prop({ reflect: true }) loading = false;

  /**
   * Specifies the maximum length of text for the component's value.
   *
   * @mdn [maxlength](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength)
   */
  @Prop({ reflect: true }) maxLength?: number;

  /**
   * Specifies the minimum length of text for the component's value.
   *
   * @mdn [minlength](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength)
   */
  @Prop({ reflect: true }) minLength?: number;

  /**
   * Specifies the name of the component.
   *
   * @mdn [name](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)
   */
  @Prop({ reflect: true }) name: string;

  /**
   * Specifies placeholder text for the component.
   *
   * @mdn [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder)
   */
  @Prop() placeholder: string;

  /** Adds text to the start of the component. */
  @Prop() prefixText?: string;

  /**
   * When true, the value cannot be modified.
   *
   * @mdn [readOnly](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly)
   */
  @Prop({ reflect: true }) readOnly = false;

  /** When true, the component must have a value in order for the form to submit. */
  @Prop({ reflect: true }) required = false;

  /** Specifies the size of the component. */
  @Prop({ mutable: true, reflect: true }) scale: Scale = "m";

  /** Specifies the status of the input field, which determines message and icons. */
  @Prop({ mutable: true, reflect: true }) status: Status = "idle";

  /** Adds text to the end of the component.  */
  @Prop() suffixText?: string;

  /**
   * @internal
   */
  @Prop({ mutable: true, reflect: true }) editingEnabled = false;

  /** The component's value. */
  @Prop({ mutable: true }) value = "";

  @Watch("value")
  valueWatcher(newValue: string, previousValue: string): void {
    if (!this.userChangedValue) {
      this.setValue({
        origin: "direct",
        previousValue,
        value: !newValue ? "" : newValue
      });
    }
    this.userChangedValue = false;
  }

  @Watch("icon")
  updateRequestedIcon(): void {
    this.requestedIcon = setRequestedIcon({}, this.icon, "text");
  }

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: InputText["value"];

  inlineEditableEl: HTMLCalciteInlineEditableElement;

  /** keep track of the rendered child */
  private childEl?: HTMLInputElement;

  get isClearable(): boolean {
    return this.clearable && this.value.length > 0;
  }

  private previousEmittedValue: string;

  private previousValue: string;

  private previousValueOrigin: SetValueOrigin = "initial";

  /** the computed icon to render */
  private requestedIcon?: string;

  mutationObserver = createObserver("mutation", () => this.setDisabledAction());

  private userChangedValue = false;

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
    this.setPreviousEmittedValue(this.value);
    this.setPreviousValue(this.value);

    connectLabel(this);
    connectForm(this);
    this.mutationObserver?.observe(this.el, { childList: true });
    this.setDisabledAction();
    this.el.addEventListener("calciteInternalHiddenInputChange", this.hiddenInputChangeHandler);
  }

  disconnectedCallback(): void {
    disconnectLabel(this);
    disconnectForm(this);
    this.mutationObserver?.disconnect();
    this.el.removeEventListener("calciteInternalHiddenInputChange", this.hiddenInputChangeHandler);
  }

  componentWillLoad(): void {
    this.requestedIcon = setRequestedIcon({}, this.icon, "text");
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event() calciteInternalInputTextFocus: EventEmitter<{
    element: HTMLInputElement;
    value: string;
  }>;

  /**
   * @internal
   */
  @Event() calciteInternalInputTextBlur: EventEmitter<{ element: HTMLInputElement; value: string }>;

  /**
   * Fires each time a new value is typed.
   */
  @Event({ cancelable: true }) calciteInputTextInput: EventEmitter<{
    element: HTMLInputElement;
    nativeEvent: MouseEvent | KeyboardEvent | InputEvent;
    value: string;
  }>;

  /**
   * Fires each time a new value is typed and committed.
   */
  @Event() calciteInputTextChange: EventEmitter<void>;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    this.childEl?.focus();
  }

  /** Selects all text of the component's `value`. */
  @Method()
  async selectText(): Promise<void> {
    this.childEl?.select();
  }
  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  keyDownHandler = (event: KeyboardEvent): void => {
    if (this.readOnly || this.disabled) {
      return;
    }
    if (this.isClearable && event.key === "Escape") {
      this.clearInputTextValue(event);
      event.preventDefault();
    }
    if (event.key === "Enter" && !event.defaultPrevented) {
      if (submitForm(this)) {
        event.preventDefault();
      }
    }
  };

  onLabelClick(): void {
    this.setFocus();
  }

  private clearInputTextValue = (nativeEvent: KeyboardEvent | MouseEvent): void => {
    this.setValue({
      committing: true,
      nativeEvent,
      origin: "user",
      value: ""
    });
  };

  private emitChangeIfUserModified = (): void => {
    if (this.previousValueOrigin === "user" && this.value !== this.previousEmittedValue) {
      this.calciteInputTextChange.emit();
    }
    this.previousEmittedValue = this.value;
  };

  private inputTextBlurHandler = () => {
    this.calciteInternalInputTextBlur.emit({
      element: this.childEl,
      value: this.value
    });

    this.emitChangeIfUserModified();
  };

  private inputTextFocusHandler = (event: FocusEvent): void => {
    const slottedActionEl = getSlotted(this.el, "action");
    if (event.target !== slottedActionEl) {
      this.setFocus();
    }
    this.calciteInternalInputTextFocus.emit({
      element: this.childEl,
      value: this.value
    });
  };

  private inputTextInputHandler = (nativeEvent: InputEvent): void => {
    if (this.disabled || this.readOnly) {
      return;
    }
    this.setValue({
      nativeEvent,
      origin: "user",
      value: (nativeEvent.target as HTMLInputElement).value
    });
  };

  private inputTextKeyDownHandler = (event: KeyboardEvent): void => {
    if (this.disabled || this.readOnly) {
      return;
    }
    if (event.key === "Enter") {
      this.emitChangeIfUserModified();
    }
  };

  onFormReset(): void {
    this.setValue({
      origin: "reset",
      value: this.defaultValue
    });
  }

  syncHiddenFormInput(input: HTMLInputElement): void {
    if (this.minLength != null) {
      input.minLength = this.minLength;
    }

    if (this.maxLength != null) {
      input.maxLength = this.maxLength;
    }
  }

  hiddenInputChangeHandler = (event: Event): void => {
    if ((event.target as HTMLInputElement).name === this.name) {
      this.setValue({
        value: (event.target as HTMLInputElement).value,
        origin: "direct"
      });
    }
    event.stopPropagation();
  };

  private setChildElRef = (el) => {
    this.childEl = el;
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
    if (!this.childEl) {
      return;
    }
    this.childEl.value = newInputValue;
  };

  private setPreviousEmittedValue = (newPreviousEmittedValue: string): void => {
    this.previousEmittedValue = newPreviousEmittedValue;
  };

  private setPreviousValue = (newPreviousValue: string): void => {
    this.previousValue = newPreviousValue;
  };

  private setValue = ({
    committing = false,
    nativeEvent,
    origin,
    previousValue,
    value
  }: {
    committing?: boolean;
    nativeEvent?: MouseEvent | KeyboardEvent | InputEvent;
    origin: SetValueOrigin;
    previousValue?: string;
    value: string;
  }): void => {
    this.setPreviousValue(previousValue || this.value);
    this.previousValueOrigin = origin;
    this.userChangedValue = origin === "user" && value !== this.value;
    this.value = value;

    if (origin === "direct") {
      this.setInputValue(value);
    }

    if (nativeEvent) {
      const calciteInputTextInputEvent = this.calciteInputTextInput.emit({
        element: this.childEl,
        nativeEvent,
        value: this.value
      });

      if (calciteInputTextInputEvent.defaultPrevented) {
        this.value = this.previousValue;
      } else if (committing) {
        this.emitChangeIfUserModified();
      }
    }
  };

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
        aria-label={this.intlClear || TEXT.clear}
        class={CSS.clearButton}
        disabled={this.disabled || this.readOnly}
        onClick={this.clearInputTextValue}
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
    const prefixText = <div class={CSS.prefix}>{this.prefixText}</div>;

    const suffixText = <div class={CSS.suffix}>{this.suffixText}</div>;

    const childEl = (
      <input
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
        maxLength={this.maxLength}
        minLength={this.minLength}
        name={this.name}
        onBlur={this.inputTextBlurHandler}
        onFocus={this.inputTextFocusHandler}
        onInput={this.inputTextInputHandler}
        onKeyDown={this.inputTextKeyDownHandler}
        placeholder={this.placeholder || ""}
        readOnly={this.readOnly}
        ref={this.setChildElRef}
        required={this.required ? true : null}
        tabIndex={this.disabled || (this.inlineEditableEl && !this.editingEnabled) ? -1 : null}
        type="text"
        value={this.value}
      />
    );

    return (
      <Host onClick={this.inputTextFocusHandler} onKeyDown={this.keyDownHandler}>
        <div class={{ [CSS.inputWrapper]: true, [CSS_UTILITY.rtl]: dir === "rtl" }}>
          {this.prefixText ? prefixText : null}
          <div class={CSS.wrapper}>
            {childEl}
            {this.isClearable ? inputClearButton : null}
            {this.requestedIcon ? iconEl : null}
            {this.loading ? loader : null}
          </div>
          <div class={CSS.actionWrapper}>
            <slot name={SLOTS.action} />
          </div>
          {this.suffixText ? suffixText : null}
          <HiddenFormInputSlot component={this} />
        </div>
      </Host>
    );
  }
}
