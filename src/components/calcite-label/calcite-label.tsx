import {
  Component,
  Element,
  Event,
  Listen,
  Host,
  h,
  Prop,
  EventEmitter,
  VNode,
  Watch
} from "@stencil/core";
import { getAttributes, getElementDir } from "../../utils/dom";
import { FocusRequest } from "./interfaces";
import { Alignment, Scale, Status, Theme } from "../interfaces";

@Component({
  tag: "calcite-label",
  styleUrl: "calcite-label.scss",
  scoped: true
})
export class CalciteLabel {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteLabelElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** specify the text alignment of the label */
  @Prop({ reflect: true }) alignment: Alignment = "start";

  /** specify the status of the label and any child input / input messages */
  @Prop({ reflect: true }) status: Status = "idle";

  /** The id of the input associated with the label */
  @Prop({ reflect: true }) for: string;

  /** specify the scale of the input, defaults to m */
  @Prop({ reflect: true }) scale: Scale = "m";

  /** specify theme of the label and its any child input / input messages */
  @Prop({ reflect: true }) theme: Theme;

  /** is the wrapped element positioned inline with the label slotted text */
  @Prop({ reflect: true }) layout: "inline" | "inline-space-between" | "default" = "default";

  /** eliminates any space around the label */
  @Prop() disableSpacing?: boolean;

  /** is the label disabled  */
  @Prop({ reflect: true }) disabled?: boolean;

  @Watch("disabled")
  disabledWatcher(): void {
    this.setDisabledControls();
  }
  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event() calciteLabelFocus: EventEmitter<FocusRequest>;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("click")
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.calciteLabelFocus.emit({
      labelEl: this.el,
      interactedEl: target,
      requestedInput: this.for
    });
    this.handleCalciteHtmlForClicks(target);
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private handleCalciteHtmlForClicks = (target: HTMLElement) => {
    // 1. has htmlFor
    if (!this.for) return;

    // 2. htmlFor matches a calcite component
    const inputForThisLabel = document.getElementById(this.for);
    if (!inputForThisLabel) return;
    if (!inputForThisLabel.localName.startsWith("calcite")) return;

    // 5. target is NOT the calcite component that this label matches
    if (target === inputForThisLabel) return;

    // 3. target is not a labelable native form element
    const labelableNativeElements = [
      "button",
      "input",
      "meter",
      "output",
      "progress",
      "select",
      "textarea"
    ];
    if (labelableNativeElements.includes(target.localName)) return;

    // 4. target is not a labelable calcite form element
    const labelableCalciteElements = [
      "calcite-button",
      "calcite-checkbox",
      "calcite-date",
      "calcite-inline-editable",
      "calcite-input",
      "calcite-radio",
      "calcite-radio-button",
      "calcite-radio-button-group",
      "calcite-radio-group",
      "calcite-rating",
      "calcite-select",
      "calcite-slider",
      "calcite-switch"
    ];
    if (labelableCalciteElements.includes(target.localName)) return;

    // 5. target is not a child of a labelable calcite form element
    for (let i = 0; i < labelableCalciteElements.length; i++) {
      if (target.closest(labelableCalciteElements[i])) {
        return;
      }
    }

    inputForThisLabel.click();
  };

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentDidLoad(): void {
    this.setDisabledControls();
  }

  render(): VNode {
    const attributes = getAttributes(this.el, [
      "disabled",
      "id",
      "layout",
      "scale",
      "status",
      "theme"
    ]);
    const dir = getElementDir(this.el);
    return (
      <Host dir={dir}>
        <label {...attributes} ref={(el) => (this.labelEl = el)}>
          <slot />
        </label>
      </Host>
    );
  }
  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  // the rendered wrapping label element
  private labelEl: HTMLLabelElement;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private setDisabledControls() {
    this.labelEl?.childNodes.forEach((item: HTMLElement) => {
      if (item.nodeName.includes("CALCITE")) {
        this.disabled ? item.setAttribute("disabled", "") : item.removeAttribute("disabled");
      }
    });
  }
}
