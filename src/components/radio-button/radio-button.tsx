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
  VNode,
  Watch
} from "@stencil/core";
import { guid } from "../../utils/guid";
import { focusElement, getElementDir, toAriaBoolean } from "../../utils/dom";
import { Scale } from "../interfaces";
import { connectLabel, disconnectLabel, getLabelText, LabelableComponent } from "../../utils/label";
import {
  HiddenFormInputSlot,
  connectForm,
  disconnectForm,
  CheckableFormComponent
} from "../../utils/form";
import { CSS } from "./resources";
import { getRoundRobinIndex } from "../../utils/array";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";

@Component({
  tag: "calcite-radio-button",
  styleUrl: "radio-button.scss",
  shadow: true
})
export class RadioButton
  implements LabelableComponent, CheckableFormComponent, InteractiveComponent
{
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

  /** When true, the component is checked. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  @Watch("checked")
  checkedChanged(newChecked: boolean): void {
    if (newChecked) {
      this.uncheckOtherRadioButtonsInGroup();
    }

    this.calciteInternalRadioButtonCheckedChange.emit();
  }

  /** When true, interaction is prevented and the component is displayed with lower opacity. */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The focused state of the component.
   *
   * @internal
   */
  @Prop({ mutable: true, reflect: true }) focused = false;

  /** The id attribute of the component. When omitted, a globally unique identifier is used. */
  @Prop({ reflect: true, mutable: true }) guid: string;

  /** When true, the component is not displayed and is not focusable or checkable. */
  @Prop({ reflect: true }) hidden = false;

  /**
   * The hovered state of the component.
   *
   * @internal
   */
  @Prop({ reflect: true, mutable: true }) hovered = false;

  /**
   * Accessible name for the component.
   *
   * @internal
   */
  @Prop() label?: string;

  /** Specifies the name of the component, passed from the `calcite-radio-button-group` on form submission. */
  @Prop({ reflect: true }) name: string;

  @Watch("name")
  nameChanged(): void {
    this.checkLastRadioButton();
  }

  /** When true, the component must have a value selected from the `calcite-radio-button-group` on form submission. */
  @Prop({ reflect: true }) required = false;

  /** Specifies the size of the component inherited from the `calcite-radio-button-group`. */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** The component's value. */
  @Prop({ mutable: true }) value!: any;

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultChecked: boolean;

  defaultValue: RadioButton["value"];

  rootNode: HTMLElement;

  containerEl: HTMLDivElement;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    if (!this.disabled) {
      focusElement(this.containerEl);
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  selectItem = (items: HTMLCalciteRadioButtonElement[], selectedIndex: number): void => {
    items[selectedIndex].click();
  };

  queryButtons = (): HTMLCalciteRadioButtonElement[] => {
    return Array.from(this.rootNode.querySelectorAll("calcite-radio-button:not([hidden])")).filter(
      (radioButton: HTMLCalciteRadioButtonElement) => radioButton.name === this.name
    ) as HTMLCalciteRadioButtonElement[];
  };

  isDefaultSelectable = (): boolean => {
    const radioButtons = this.queryButtons();
    return !radioButtons.some((radioButton) => radioButton.checked) && radioButtons[0] === this.el;
  };

  check = (): void => {
    if (this.disabled) {
      return;
    }
    this.uncheckAllRadioButtonsInGroup();
    this.checked = true;
    this.focused = true;
    this.calciteRadioButtonChange.emit();
    this.setFocus();
  };

  private clickHandler = (): void => {
    this.check();
  };

  onLabelClick(event: CustomEvent): void {
    if (!this.disabled && !this.hidden) {
      this.uncheckOtherRadioButtonsInGroup();
      const label = event.currentTarget as HTMLCalciteLabelElement;
      const radioButton = label.for
        ? this.rootNode.querySelector<HTMLCalciteRadioButtonElement>(
            `calcite-radio-button[id="${label.for}"]`
          )
        : label.querySelector<HTMLCalciteRadioButtonElement>(
            `calcite-radio-button[name="${this.name}"]`
          );

      if (radioButton) {
        radioButton.checked = true;
        radioButton.focused = true;
      }

      this.calciteRadioButtonChange.emit();
      this.setFocus();
    }
  }

  private checkLastRadioButton(): void {
    const radioButtons = this.queryButtons();
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
    this.calciteInternalRadioButtonCheckedChange.emit();
  }

  private setContainerEl = (el: HTMLDivElement): void => {
    this.containerEl = el;
  };

  private uncheckAllRadioButtonsInGroup(): void {
    const radioButtons = this.queryButtons();
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        radioButton.checked = false;
        radioButton.focused = false;
      }
    });
  }

  private uncheckOtherRadioButtonsInGroup(): void {
    const radioButtons = this.queryButtons();
    const otherRadioButtons = radioButtons.filter((radioButton) => radioButton.guid !== this.guid);
    otherRadioButtons.forEach((otherRadioButton) => {
      if (otherRadioButton.checked) {
        otherRadioButton.checked = false;
        otherRadioButton.focused = false;
      }
    });
  }

  private getTabIndex(): number | undefined {
    if (this.disabled) {
      return undefined;
    }
    return this.checked || this.isDefaultSelectable() ? 0 : -1;
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Fires when the radio button is blurred.
   *
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalRadioButtonBlur: EventEmitter<void>;

  /**
   * Fires only when the radio button is checked.  This behavior is identical to the native HTML input element.
   * Since this event does not fire when the radio button is unchecked, it's not recommended to attach a listener for this event
   * directly on the element, but instead either attach it to a node that contains all of the radio buttons in the group
   * or use the calciteRadioButtonGroupChange event if using this with calcite-radio-button-group.
   */
  @Event({ cancelable: false }) calciteRadioButtonChange: EventEmitter<void>;

  /**
   * Fires when the checked property changes.  This is an internal event used for styling purposes only.
   * Use calciteRadioButtonChange or calciteRadioButtonGroupChange for responding to changes in the checked value for forms.
   *
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalRadioButtonCheckedChange: EventEmitter<void>;

  /**
   * Fires when the radio button is focused.
   *
   * @internal
   */
  @Event({ cancelable: false }) calciteInternalRadioButtonFocus: EventEmitter<void>;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("mouseenter")
  mouseenter(): void {
    this.hovered = true;
  }

  @Listen("mouseleave")
  mouseleave(): void {
    this.hovered = false;
  }

  handleKeyDown = (event: KeyboardEvent): void => {
    const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " "];
    const { key } = event;
    const { el } = this;

    if (keys.indexOf(key) === -1) {
      return;
    }

    if (key === " ") {
      this.check();
      event.preventDefault();
      return;
    }

    let adjustedKey = key;

    if (getElementDir(el) === "rtl") {
      if (key === "ArrowRight") {
        adjustedKey = "ArrowLeft";
      }
      if (key === "ArrowLeft") {
        adjustedKey = "ArrowRight";
      }
    }

    const radioButtons = Array.from(
      this.rootNode.querySelectorAll("calcite-radio-button:not([hidden]")
    ).filter(
      (radioButton: HTMLCalciteRadioButtonElement) => radioButton.name === this.name
    ) as HTMLCalciteRadioButtonElement[];
    let currentIndex = 0;

    const radioButtonsLength = radioButtons.length;

    radioButtons.some((item, index) => {
      if (item.checked) {
        currentIndex = index;
        return true;
      }
    });

    switch (adjustedKey) {
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        this.selectItem(
          radioButtons,
          getRoundRobinIndex(Math.max(currentIndex - 1, -1), radioButtonsLength)
        );
        return;
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        this.selectItem(radioButtons, getRoundRobinIndex(currentIndex + 1, radioButtonsLength));
        return;
      default:
        return;
    }
  };

  private onContainerBlur = (): void => {
    this.focused = false;
    this.calciteInternalRadioButtonBlur.emit();
  };

  private onContainerFocus = (): void => {
    if (!this.disabled) {
      this.focused = true;
      this.calciteInternalRadioButtonFocus.emit();
    }
  };

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    this.rootNode = this.el.getRootNode() as HTMLElement;
    this.guid = this.el.id || `calcite-radio-button-${guid()}`;
    if (this.name) {
      this.checkLastRadioButton();
    }
    connectLabel(this);
    connectForm(this);
  }

  componentDidLoad(): void {
    if (this.focused && !this.disabled) {
      this.setFocus();
    }
  }

  disconnectedCallback(): void {
    disconnectLabel(this);
    disconnectForm(this);
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
    const tabIndex = this.getTabIndex();
    return (
      <Host onClick={this.clickHandler} onKeyDown={this.handleKeyDown}>
        <div
          aria-checked={toAriaBoolean(this.checked)}
          aria-label={getLabelText(this)}
          class={CSS.container}
          onBlur={this.onContainerBlur}
          onFocus={this.onContainerFocus}
          ref={this.setContainerEl}
          role="radio"
          tabIndex={tabIndex}
        >
          <div class="radio" />
        </div>
        <HiddenFormInputSlot component={this} />
      </Host>
    );
  }
}
