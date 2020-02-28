import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop
} from "@stencil/core";
import { Scale } from "../../interfaces/common";
import { getElementDir } from "../../utils/dom";

@Component({
  tag: "calcite-button-with-dropdown",
  styleUrl: "calcite-button-with-dropdown.scss",
  shadow: true
})

export class CalciteButtonWithOverflow {
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

  /** specify the color of the control, defaults to blue */
  @Prop({ mutable: true, reflect: true }) color:
    "blue"
    | "dark"
    | "light"
    | "red" = "blue";

  /** Select theme (light or dark), defaults to light */
  @Prop({ mutable: true, reflect: true }) theme: "light" | "dark" = "light";

  /** specify the scale of the control, defaults to m */
  @Prop({ mutable: true, reflect: true }) scale: Scale = "m";

  /** text for primary action button  */
  @Prop({ reflect: true }) primaryText: string;

  /** aria label for overflow button */
  @Prop({ reflect: true }) dropdownLabel: string;

  /** optionally add a calcite-loader component to the control,
    disabling interaction. with the primary button */
  @Prop({ reflect: true }) loading?: boolean = false;

  /** is the control disabled  */
  @Prop({ reflect: true }) disabled?: boolean;

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Fired when the modal begins the open animation */
  @Event() primaryButtonClicked: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback() {
    // prop validations
    let color = ["blue", "red", "dark", "light"];
    if (!color.includes(this.color)) this.color = "blue";

    let scale = ["xs", "s", "m", "l", "xl"];
    if (!scale.includes(this.scale)) this.scale = "m";

    let theme = ["dark", "light"];
    if (!theme.includes(this.theme)) this.theme = "light";
  }

  render() {
    const dir = getElementDir(this.el);
    return (
      <Host dir={dir}>
        <div>
          <calcite-button
              color={this.color}
              scale={this.scale}
              loading={this.loading}
              disabled={this.disabled}
              theme={this.theme}
              onClick={this.primaryButtonClickedHandler}>
            {this.primaryText}
          </calcite-button>
          <div class='divider-container'>
            <div class='divider'/>
          </div>
          <calcite-dropdown
              dir={dir}
              theme={this.theme}
              scale={this.dropdownScale}
              width={this.dropdownScale}>
            <calcite-button
                aria-label={this.dropdownLabel}
                slot="dropdown-trigger"
                scale={this.scale}
                color={this.color}
                disabled={this.disabled}
                theme={this.theme}
                icon='caretDown'
                textless-height='full'>
            </calcite-button>
            <slot />
          </calcite-dropdown>
        </div>
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  private primaryButtonClickedHandler = (e: MouseEvent) => this.primaryButtonClicked.emit(e)

  private get dropdownScale() {
    const scaleLookup: { [id in Scale] : "s" | "m" | "l" } = {
      'xs': 's',
      's': 's',
      'm': 'm',
      'l': 'l',
      'xl': 'l',
    }
    return scaleLookup[this.scale]
  }

}