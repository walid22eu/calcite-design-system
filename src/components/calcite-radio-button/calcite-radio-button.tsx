import {
  Component,
  Host,
  h,
  Listen,
  Prop,
  Element,
  Watch,
  Event,
  EventEmitter,
  VNode,
  Method
} from "@stencil/core";
import { guid } from "../../utils/guid";
import { getElementDir } from "../../utils/dom";
import { Scale, Theme } from "../interfaces";

@Component({
  tag: "calcite-radio-button",
  styleUrl: "calcite-radio-button.scss",
  scoped: true
})
export class CalciteRadioButton {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteRadioButtonElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** The checked state of the radio button. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  @Watch("checked")
  checkedChanged(newChecked: boolean): void {
    if (newChecked) {
      this.uncheckOtherRadioButtonsInGroup();
    }
    if (this.input) {
      this.input.checked = newChecked;
    }
    this.calciteRadioButtonCheckedChange.emit(newChecked);
  }

  /** The disabled state of the radio button. */
  @Prop({ reflect: true }) disabled = false;

  @Watch("disabled")
  disabledChanged(disabled: boolean): void {
    this.input.disabled = disabled;
  }

  /** The focused state of the radio button. */
  @Prop({ mutable: true, reflect: true }) focused = false;

  @Watch("focused")
  focusedChanged(focused: boolean): void {
    if (!this.input) return;
    if (focused && !this.el.hasAttribute("hidden")) {
      this.input.focus();
    } else {
      this.input.blur();
    }
  }

  /** The id attribute of the radio button.  When omitted, a globally unique identifier is used. */
  @Prop({ reflect: true }) guid: string;

  /** The radio button's hidden status.  When a radio button is hidden it is not focusable or checkable. */
  @Prop({ reflect: true }) hidden = false;

  @Watch("hidden")
  hiddenChanged(newHidden: boolean): void {
    this.input.hidden = newHidden;
  }

  /** The hovered state of the radio button. */
  @Prop({ reflect: true, mutable: true }) hovered = false;

  /** The name of the radio button.  <code>name</code> is passed as a property automatically from <code>calcite-radio-button-group</code>. */
  @Prop({ reflect: true }) name: string;

  @Watch("name")
  nameChanged(newName: string): void {
    if (this.name === newName) {
      return;
    }
    if (this.input) {
      this.input.name = newName;
    }
    this.checkLastRadioButton();
    const currentValue: HTMLInputElement = this.rootNode.querySelector(
      `input[name="${this.name}"]:checked`
    );
    if (!currentValue?.value) {
      this.uncheckAllRadioButtonsInGroup();
    }
  }

  /** Requires that a value is selected for the radio button group before the parent form will submit. */
  @Prop({ reflect: true }) required = false;

  @Watch("required")
  requiredChanged(required: boolean): void {
    this.input.required = required;
  }

  /** The scale (size) of the radio button.  <code>scale</code> is passed as a property automatically from <code>calcite-radio-button-group</code>. */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** The color theme of the radio button, <code>theme</code> is passed as a property automatically from <code>calcite-radio-button-group</code>. */
  @Prop({ reflect: true }) theme: Theme = "light";

  /** The value of the radio button. */
  @Prop({ reflect: true }) value!: string;

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  private initialChecked: boolean;

  private input: HTMLInputElement;

  private radio: HTMLCalciteRadioElement;

  private rootNode: HTMLElement;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private checkLastRadioButton(): void {
    const radioButtons = Array.from(this.rootNode.querySelectorAll("calcite-radio-button")).filter(
      (radioButton: HTMLCalciteRadioButtonElement) => radioButton.name === this.name
    ) as HTMLCalciteRadioButtonElement[];

    const checkedRadioButtons = radioButtons.filter((radioButton) => radioButton.checked);

    if (checkedRadioButtons?.length > 1) {
      const lastCheckedRadioButton = checkedRadioButtons[checkedRadioButtons.length - 1];
      checkedRadioButtons
        .filter((checkedRadioButton) => checkedRadioButton !== lastCheckedRadioButton)
        .forEach((checkedRadioButton: HTMLCalciteRadioButtonElement) => {
          checkedRadioButton.checked = false;
          checkedRadioButton.emitCheckedChange();
        });
    }
  }

  /** @internal */
  @Method()
  async emitCheckedChange(): Promise<void> {
    this.calciteRadioButtonCheckedChange.emit();
  }

  private uncheckAllRadioButtonsInGroup(): void {
    const otherRadioButtons = Array.from(
      this.rootNode.querySelectorAll("calcite-radio-button")
    ).filter(
      (radioButton: HTMLCalciteRadioButtonElement) => radioButton.name === this.name
    ) as HTMLCalciteRadioButtonElement[];
    otherRadioButtons.forEach((otherRadioButton: HTMLCalciteRadioButtonElement) => {
      if (otherRadioButton.checked) {
        otherRadioButton.checked = false;
        otherRadioButton.focused = false;
      }
    });
  }

  private uncheckOtherRadioButtonsInGroup(): void {
    const otherRadioButtons = Array.from(
      this.rootNode.querySelectorAll("calcite-radio-button")
    ).filter(
      (radioButton: HTMLCalciteRadioButtonElement) =>
        radioButton.name === this.name && radioButton.guid !== this.guid
    ) as HTMLCalciteRadioButtonElement[];
    otherRadioButtons.forEach((otherRadioButton: HTMLCalciteRadioButtonElement) => {
      if (otherRadioButton.checked) {
        otherRadioButton.checked = false;
        otherRadioButton.focused = false;
      }
    });
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Fires only when the radio button is checked.  This behavior is identical to the native HTML input element.
   * Since this event does not fire when the radio button is unchecked, it's not recommended to attach a listener for this event
   * directly on the element, but instead either attach it to a node that contains all of the radio buttons in the group
   * or use the calciteRadioButtonGroupChange event if using this with calcite-radio-button-group.
   */
  @Event() calciteRadioButtonChange: EventEmitter;

  /** Fires when the checked property changes.  This is an internal event used for styling purposes only.
   * Use calciteRadioButtonChange or calciteRadioButtonGroupChange for responding to changes in the checked value for forms.
   * @internal
   */
  @Event() calciteRadioButtonCheckedChange: EventEmitter;

  /** Fires when the radio button is either focused or blurred. */
  @Event() calciteRadioButtonFocusedChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("click")
  check(event: MouseEvent | FocusEvent): void {
    // Prevent parent label from clicking the first radio when calcite-radio-button is clicked
    if (this.el.closest("label") && (event.target === this.el || event.target === this.radio)) {
      event.preventDefault();
    }
    if (!this.disabled && !this.hidden) {
      this.uncheckOtherRadioButtonsInGroup();
      this.checked = true;
      this.focused = true;
      this.calciteRadioButtonChange.emit();
    }
  }

  @Listen("mouseenter")
  mouseenter(): void {
    this.hovered = true;
  }

  @Listen("mouseleave")
  mouseleave(): void {
    this.hovered = false;
  }

  private formResetHandler = (): void => {
    this.checked = this.initialChecked;
    this.initialChecked && this.input?.setAttribute("checked", "");
  };

  private onInputBlur = (): void => {
    this.focused = false;
    this.calciteRadioButtonFocusedChange.emit();
  };

  private onInputFocus = (): void => {
    this.focused = true;
    this.calciteRadioButtonFocusedChange.emit();
  };

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.rootNode = this.el.getRootNode() as HTMLElement;
    this.guid = this.el.id || `calcite-radio-button-${guid()}`;
    this.initialChecked = this.checked;
    if (this.name) {
      this.checkLastRadioButton();
    }
    const form = this.el.closest("form");
    if (form) {
      form.addEventListener("reset", this.formResetHandler);
    }
  }

  componentDidLoad(): void {
    if (this.focused) {
      this.input.focus();
    }
  }

  disconnectedCallback(): void {
    const form = this.el.closest("form");
    if (form) {
      form.removeEventListener("reset", this.formResetHandler);
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  private renderLabel(): VNode {
    if (this.el.textContent) {
      return (
        <calcite-label
          dir={getElementDir(this.el)}
          disable-spacing
          disabled={this.disabled}
          for={`${this.guid}-input`}
          layout="inline"
          scale={this.scale}
        >
          <slot />
        </calcite-label>
      );
    }
    return <slot />;
  }

  render(): VNode {
    const inputStyle = { opacity: "0", position: "fixed", zIndex: "-1" };
    return (
      <Host labeled={!!this.el.textContent}>
        <input
          aria-label={this.value || this.guid}
          checked={this.checked}
          disabled={this.disabled}
          hidden={this.hidden}
          id={`${this.guid}-input`}
          name={this.name}
          onBlur={this.onInputBlur}
          onFocus={this.onInputFocus}
          ref={(el) => (this.input = el)}
          required={this.required}
          style={inputStyle}
          type="radio"
          value={this.value}
        />
        <calcite-radio
          checked={this.checked}
          disabled={this.disabled}
          focused={this.focused}
          hidden={this.hidden}
          hovered={this.hovered}
          ref={(el) => (this.radio = el)}
          scale={this.scale}
          theme={this.theme}
        />
        {this.renderLabel()}
      </Host>
    );
  }
}
