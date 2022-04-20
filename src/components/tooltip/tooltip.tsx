import { Component, Element, Host, Method, Prop, State, Watch, h, VNode } from "@stencil/core";
import { CSS, ARIA_DESCRIBED_BY } from "./resources";
import { StrictModifiers, Instance as Popper } from "@popperjs/core";
import { guid } from "../../utils/guid";
import {
  PopperPlacement,
  defaultOffsetDistance,
  createPopper,
  updatePopper,
  CSS as PopperCSS,
  OverlayPositioning
} from "../../utils/popper";
import { queryElementRoots } from "../../utils/dom";

import TooltipManager from "./TooltipManager";

const manager = new TooltipManager();

/**
 * @slot - A slot for adding text.
 */
@Component({
  tag: "calcite-tooltip",
  styleUrl: "tooltip.scss",
  shadow: true
})
export class Tooltip {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /** Accessible name for the component */
  @Prop() label!: string;

  /**
   * Offset the position of the tooltip away from the reference element.
   * @default 6
   */
  @Prop({ reflect: true }) offsetDistance = defaultOffsetDistance;

  @Watch("offsetDistance")
  offsetDistanceOffsetHandler(): void {
    this.reposition();
  }

  /**
   * Offset the position of the tooltip along the reference element.
   */
  @Prop({ reflect: true }) offsetSkidding = 0;

  @Watch("offsetSkidding")
  offsetSkiddingHandler(): void {
    this.reposition();
  }

  /**
   * Display and position the component.
   */
  @Prop({ reflect: true }) open = false;

  @Watch("open")
  openHandler(): void {
    this.reposition();
  }

  /** Describes the type of positioning to use for the overlaid content. If your element is in a fixed container, use the 'fixed' value. */
  @Prop() overlayPositioning: OverlayPositioning = "absolute";

  /**
   * Determines where the component will be positioned relative to the referenceElement.
   * @see [PopperPlacement](https://github.com/Esri/calcite-components/blob/master/src/utils/popper.ts#L25)
   */
  @Prop({ reflect: true }) placement: PopperPlacement = "auto";

  @Watch("placement")
  placementHandler(): void {
    this.reposition();
  }

  /**
   * Reference HTMLElement used to position this component according to the placement property. As a convenience, a string ID of the reference element can be used. However, setting this property to use an HTMLElement is preferred so that the component does not need to query the DOM for the referenceElement.
   */
  @Prop() referenceElement: HTMLElement | string;

  @Watch("referenceElement")
  referenceElementHandler(): void {
    this.setUpReferenceElement();
  }

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteTooltipElement;

  @State() effectiveReferenceElement: HTMLElement;

  arrowEl: HTMLDivElement;

  popper: Popper;

  guid = `calcite-tooltip-${guid()}`;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  componentWillLoad(): void {
    this.setUpReferenceElement();
  }

  componentDidLoad(): void {
    this.reposition();
  }

  disconnectedCallback(): void {
    this.removeReferences();
    this.destroyPopper();
  }

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  /** Updates the position of the component. */
  @Method()
  async reposition(): Promise<void> {
    const { popper, el, placement } = this;
    const modifiers = this.getModifiers();

    popper
      ? await updatePopper({
          el,
          modifiers,
          placement,
          popper
        })
      : this.createPopper();
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  setUpReferenceElement = (): void => {
    this.removeReferences();
    this.effectiveReferenceElement = this.getReferenceElement();

    const { el, referenceElement, effectiveReferenceElement } = this;
    if (referenceElement && !effectiveReferenceElement) {
      console.warn(`${el.tagName}: reference-element id "${referenceElement}" was not found.`, {
        el
      });
    }

    this.addReferences();
    this.createPopper();
  };

  getId = (): string => {
    return this.el.id || this.guid;
  };

  addReferences = (): void => {
    const { effectiveReferenceElement } = this;

    if (!effectiveReferenceElement) {
      return;
    }

    const id = this.getId();

    effectiveReferenceElement.setAttribute(ARIA_DESCRIBED_BY, id);
    manager.registerElement(effectiveReferenceElement, this.el);
  };

  removeReferences = (): void => {
    const { effectiveReferenceElement } = this;

    if (!effectiveReferenceElement) {
      return;
    }

    effectiveReferenceElement.removeAttribute(ARIA_DESCRIBED_BY);
    manager.unregisterElement(effectiveReferenceElement);
  };

  getReferenceElement(): HTMLElement {
    const { referenceElement, el } = this;

    return (
      (typeof referenceElement === "string"
        ? queryElementRoots(el, { id: referenceElement })
        : referenceElement) || null
    );
  }

  getModifiers(): Partial<StrictModifiers>[] {
    const { arrowEl, offsetDistance, offsetSkidding } = this;

    const arrowModifier: Partial<StrictModifiers> = {
      name: "arrow",
      enabled: true,
      options: {
        element: arrowEl
      }
    };

    const offsetModifier: Partial<StrictModifiers> = {
      name: "offset",
      enabled: true,
      options: {
        offset: [offsetSkidding, offsetDistance]
      }
    };

    const eventListenerModifier: Partial<StrictModifiers> = {
      name: "eventListeners",
      enabled: this.open
    };

    return [arrowModifier, offsetModifier, eventListenerModifier];
  }

  createPopper(): void {
    this.destroyPopper();

    const { el, placement, effectiveReferenceElement: referenceEl, overlayPositioning } = this;
    const modifiers = this.getModifiers();

    this.popper = createPopper({
      el,
      modifiers,
      placement,
      overlayPositioning,
      referenceEl
    });
  }

  destroyPopper(): void {
    const { popper } = this;

    if (popper) {
      popper.destroy();
    }

    this.popper = null;
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const { effectiveReferenceElement, label, open } = this;
    const displayed = effectiveReferenceElement && open;
    const hidden = !displayed;

    return (
      <Host
        aria-hidden={hidden.toString()}
        aria-label={label}
        calcite-hydrated-hidden={hidden}
        id={this.getId()}
        role="tooltip"
      >
        <div
          class={{
            [PopperCSS.animation]: true,
            [PopperCSS.animationActive]: displayed
          }}
        >
          <div class={CSS.arrow} ref={(arrowEl) => (this.arrowEl = arrowEl)} />
          <div class={CSS.container}>
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}
