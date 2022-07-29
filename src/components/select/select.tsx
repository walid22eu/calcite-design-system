import {
  Component,
  Element,
  Event,
  EventEmitter,
  Fragment,
  h,
  Listen,
  Method,
  Prop,
  VNode,
  Watch
} from "@stencil/core";
import { focusElement } from "../../utils/dom";
import { Scale, Width } from "../interfaces";
import { LabelableComponent, connectLabel, disconnectLabel } from "../../utils/label";
import {
  afterConnectDefaultValueSet,
  connectForm,
  disconnectForm,
  FormComponent,
  HiddenFormInputSlot
} from "../../utils/form";
import { CSS } from "./resources";
import { createObserver } from "../../utils/observers";
import { InteractiveComponent, updateHostInteraction } from "../../utils/interactive";

type OptionOrGroup = HTMLCalciteOptionElement | HTMLCalciteOptionGroupElement;
type NativeOptionOrGroup = HTMLOptionElement | HTMLOptGroupElement;

function isOption(optionOrGroup: OptionOrGroup): optionOrGroup is HTMLCalciteOptionElement {
  return optionOrGroup.tagName === "CALCITE-OPTION";
}

function isOptionGroup(
  optionOrGroup: OptionOrGroup
): optionOrGroup is HTMLCalciteOptionGroupElement {
  return optionOrGroup.tagName === "CALCITE-OPTION-GROUP";
}

/**
 * @slot - A slot for adding `calcite-option`s.
 */
@Component({
  tag: "calcite-select",
  styleUrl: "select.scss",
  shadow: true
})
export class Select implements LabelableComponent, FormComponent, InteractiveComponent {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /**
   * When true, it prevents the option from being selected.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The component's label. This is required for accessibility purposes.
   *
   */
  @Prop() label!: string;

  /**
   * The select's name. Gets submitted with the form.
   */
  @Prop() name: string;

  /**
   * When true, makes the component required for form-submission.
   *
   * @internal
   */
  @Prop({ reflect: true }) required = false;

  /**
   * The component scale.
   */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** The value of the selectedOption */
  @Prop({ mutable: true }) value: string = null;

  @Watch("value")
  valueHandler(value: string): void {
    const items = this.el.querySelectorAll("calcite-option");
    items.forEach((item) => (item.selected = item.value === value));
  }

  /**
   * The currently selected option.
   *
   * @readonly
   */
  @Prop({ mutable: true }) selectedOption: HTMLCalciteOptionElement;

  @Watch("selectedOption")
  selectedOptionHandler(selectedOption: HTMLCalciteOptionElement): void {
    this.value = selectedOption?.value;
  }

  /**
   * The component width.
   */
  @Prop({ reflect: true }) width: Width = "auto";

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: Select["value"];

  @Element() el: HTMLCalciteSelectElement;

  private componentToNativeEl = new Map<OptionOrGroup, NativeOptionOrGroup>();

  private mutationObserver = createObserver("mutation", () => this.populateInternalSelect());

  private selectEl: HTMLSelectElement;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    const { el } = this;

    this.mutationObserver?.observe(el, {
      subtree: true,
      childList: true
    });

    connectLabel(this);
    connectForm(this);
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
    disconnectLabel(this);
    disconnectForm(this);
  }

  componentDidLoad(): void {
    afterConnectDefaultValueSet(this, this.selectedOption?.value ?? "");
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    focusElement(this.selectEl);
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * This event will fire whenever the selected option changes.
   */
  @Event({ cancelable: false }) calciteSelectChange: EventEmitter<void>;

  private handleInternalSelectChange = (): void => {
    const selected = this.selectEl.selectedOptions[0];
    this.selectFromNativeOption(selected);
    requestAnimationFrame(() => this.emitChangeEvent());
  };

  @Listen("calciteInternalOptionChange")
  @Listen("calciteInternalOptionGroupChange")
  protected handleOptionOrGroupChange(event: CustomEvent): void {
    event.stopPropagation();

    const optionOrGroup = event.target as OptionOrGroup;
    const nativeEl = this.componentToNativeEl.get(optionOrGroup);

    if (!nativeEl) {
      return;
    }

    this.updateNativeElement(optionOrGroup, nativeEl);

    if (isOption(optionOrGroup) && optionOrGroup.selected) {
      this.deselectAllExcept(optionOrGroup);
      this.selectedOption = optionOrGroup;
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  onLabelClick(): void {
    this.setFocus();
  }

  private updateNativeElement(
    optionOrGroup: OptionOrGroup,
    nativeOptionOrGroup: NativeOptionOrGroup
  ): void {
    nativeOptionOrGroup.disabled = optionOrGroup.disabled;
    nativeOptionOrGroup.label = optionOrGroup.label;

    if (isOption(optionOrGroup)) {
      const option = nativeOptionOrGroup as HTMLOptionElement;
      option.selected = optionOrGroup.selected;
      option.value = optionOrGroup.value;

      // need to set innerText for mobile
      // see https://stackoverflow.com/questions/35021620/ios-safari-not-showing-all-options-for-select-menu/41749701
      option.innerText = optionOrGroup.label;
    }
  }

  private populateInternalSelect = (): void => {
    const optionsAndGroups = Array.from(
      this.el.children as HTMLCollectionOf<OptionOrGroup | HTMLSlotElement>
    ).filter(
      (child) => child.tagName === "CALCITE-OPTION" || child.tagName === "CALCITE-OPTION-GROUP"
    ) as OptionOrGroup[];

    this.clearInternalSelect();

    optionsAndGroups.forEach((optionOrGroup) =>
      this.selectEl?.append(this.toNativeElement(optionOrGroup))
    );
  };

  private clearInternalSelect(): void {
    this.componentToNativeEl.forEach((value) => value.remove());
    this.componentToNativeEl.clear();
  }

  private storeSelectRef = (node: HTMLSelectElement): void => {
    this.selectEl = node;
    this.populateInternalSelect();

    const selected = this.selectEl.selectedOptions[0];
    this.selectFromNativeOption(selected);
  };

  private selectFromNativeOption(nativeOption: HTMLOptionElement): void {
    if (!nativeOption) {
      return;
    }

    let futureSelected: HTMLCalciteOptionElement;

    this.componentToNativeEl.forEach((nativeOptionOrGroup, optionOrGroup) => {
      if (isOption(optionOrGroup) && nativeOptionOrGroup === nativeOption) {
        optionOrGroup.selected = true;
        futureSelected = optionOrGroup;
        this.deselectAllExcept(optionOrGroup as HTMLCalciteOptionElement);
      }
    });

    if (futureSelected) {
      this.selectedOption = futureSelected;
    }
  }

  private toNativeElement(
    optionOrGroup: HTMLCalciteOptionElement | HTMLCalciteOptionGroupElement
  ): NativeOptionOrGroup {
    if (isOption(optionOrGroup)) {
      const option = document.createElement("option");
      this.updateNativeElement(optionOrGroup, option);
      this.componentToNativeEl.set(optionOrGroup, option);

      return option;
    }

    if (isOptionGroup(optionOrGroup)) {
      const group = document.createElement("optgroup");
      this.updateNativeElement(optionOrGroup, group);

      Array.from(optionOrGroup.children as HTMLCollectionOf<HTMLCalciteOptionElement>).forEach(
        (option) => {
          const nativeOption = this.toNativeElement(option);
          group.append(nativeOption);
          this.componentToNativeEl.set(optionOrGroup, nativeOption);
        }
      );

      this.componentToNativeEl.set(optionOrGroup, group);

      return group;
    }

    throw new Error("unsupported element child provided");
  }

  private deselectAllExcept(except: HTMLCalciteOptionElement): void {
    this.el.querySelectorAll<HTMLCalciteOptionElement>("calcite-option").forEach((option) => {
      if (option === except) {
        return;
      }

      option.selected = false;
    });
  }

  private emitChangeEvent = (): void => {
    this.calciteSelectChange.emit();
  };

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  renderChevron(): VNode {
    return (
      <div class={CSS.iconContainer}>
        <calcite-icon class={CSS.icon} icon="chevron-down" scale="s" />
      </div>
    );
  }

  render(): VNode {
    return (
      <Fragment>
        <select
          aria-label={this.label}
          class={CSS.select}
          disabled={this.disabled}
          onChange={this.handleInternalSelectChange}
          ref={this.storeSelectRef}
        >
          <slot />
        </select>
        {this.renderChevron()}
        <HiddenFormInputSlot component={this} />
      </Fragment>
    );
  }
}
