import { getShadowRootNode, isPrimaryPointerButton } from "../../utils/dom";
import { ReferenceElement } from "../../utils/floating-ui";
import { TOOLTIP_DELAY_MS } from "./resources";
import { getEffectiveReferenceElement } from "./utils";

export default class TooltipManager {
  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  private registeredElements = new WeakMap<ReferenceElement, HTMLCalciteTooltipElement>();

  private registeredShadowRootCounts = new WeakMap<ShadowRoot, number>();

  private hoverTimeout: number = null;

  private hoveredTooltip: HTMLCalciteTooltipElement = null;

  private clickedTooltip: HTMLCalciteTooltipElement = null;

  private activeTooltip: HTMLCalciteTooltipElement = null;

  private registeredElementCount = 0;

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  registerElement(referenceEl: ReferenceElement, tooltip: HTMLCalciteTooltipElement): void {
    this.registeredElementCount++;
    this.registeredElements.set(referenceEl, tooltip);
    const shadowRoot = this.getReferenceElShadowRootNode(referenceEl);

    if (shadowRoot) {
      this.registerShadowRoot(shadowRoot);
    }

    if (this.registeredElementCount === 1) {
      this.addListeners();
    }
  }

  unregisterElement(referenceEl: ReferenceElement): void {
    const shadowRoot = this.getReferenceElShadowRootNode(referenceEl);

    if (shadowRoot) {
      this.unregisterShadowRoot(shadowRoot);
    }

    if (this.registeredElements.delete(referenceEl)) {
      this.registeredElementCount--;
    }

    if (this.registeredElementCount === 0) {
      this.removeListeners();
    }
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  private queryTooltip = (composedPath: EventTarget[]): HTMLCalciteTooltipElement => {
    const { registeredElements } = this;

    const registeredElement = (composedPath as HTMLElement[]).find((pathEl) => registeredElements.has(pathEl));

    return registeredElements.get(registeredElement);
  };

  private keyDownHandler = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && !event.defaultPrevented) {
      const { activeTooltip } = this;

      if (activeTooltip?.open) {
        this.clearHoverTimeout();
        this.closeExistingTooltip();

        const referenceElement = getEffectiveReferenceElement(activeTooltip);

        if (referenceElement instanceof Element && referenceElement.contains(event.target as HTMLElement)) {
          event.preventDefault();
        }
      }
    }
  };

  private pointerMoveHandler = (event: PointerEvent): void => {
    const composedPath = event.composedPath();
    const { activeTooltip } = this;
    const hoveringActiveTooltip = activeTooltip?.open && composedPath.includes(activeTooltip);

    if (hoveringActiveTooltip) {
      this.clearHoverTimeout();
      return;
    }

    const tooltip = this.queryTooltip(composedPath);
    this.hoveredTooltip = tooltip;

    if (this.isClosableClickedTooltip(tooltip)) {
      return;
    }

    this.clickedTooltip = null;

    if (tooltip) {
      this.toggleHoveredTooltip(tooltip, true);
    } else if (activeTooltip) {
      this.toggleHoveredTooltip(activeTooltip, false);
    }
  };

  private pointerDownHandler = (event: PointerEvent): void => {
    if (!isPrimaryPointerButton(event)) {
      return;
    }

    const clickedTooltip = this.queryTooltip(event.composedPath());

    this.clickedTooltip = clickedTooltip;

    if (clickedTooltip?.closeOnClick) {
      this.toggleTooltip(clickedTooltip, false);
      this.clearHoverTimeout();
    }
  };

  private focusInHandler = (event: FocusEvent): void => {
    this.queryFocusedTooltip(event, true);
  };

  private focusOutHandler = (event: FocusEvent): void => {
    this.queryFocusedTooltip(event, false);
  };

  private addShadowListeners(shadowRoot: ShadowRoot): void {
    shadowRoot.addEventListener("focusin", this.focusInHandler, { capture: true });
    shadowRoot.addEventListener("focusout", this.focusOutHandler, { capture: true });
  }

  private removeShadowListeners(shadowRoot: ShadowRoot): void {
    shadowRoot.removeEventListener("focusin", this.focusInHandler, { capture: true });
    shadowRoot.removeEventListener("focusout", this.focusOutHandler, { capture: true });
  }

  private addListeners(): void {
    document.addEventListener("keydown", this.keyDownHandler, { capture: true });
    document.addEventListener("pointermove", this.pointerMoveHandler, { capture: true });
    document.addEventListener("pointerdown", this.pointerDownHandler, { capture: true });
    document.addEventListener("focusin", this.focusInHandler, { capture: true });
    document.addEventListener("focusout", this.focusOutHandler, { capture: true });
  }

  private removeListeners(): void {
    document.removeEventListener("keydown", this.keyDownHandler, { capture: true });
    document.removeEventListener("pointermove", this.pointerMoveHandler, { capture: true });
    document.removeEventListener("pointerdown", this.pointerDownHandler, { capture: true });
    document.removeEventListener("focusin", this.focusInHandler, { capture: true });
    document.removeEventListener("focusout", this.focusOutHandler, { capture: true });
  }

  private clearHoverTimeout(): void {
    window.clearTimeout(this.hoverTimeout);
    this.hoverTimeout = null;
  }

  private closeExistingTooltip(): void {
    const { activeTooltip } = this;

    if (activeTooltip?.open) {
      this.toggleTooltip(activeTooltip, false);
    }
  }

  private toggleFocusedTooltip(tooltip: HTMLCalciteTooltipElement, value: boolean): void {
    this.closeExistingTooltip();

    if (value) {
      this.clearHoverTimeout();
    }

    this.toggleTooltip(tooltip, value);
  }

  private toggleTooltip(tooltip: HTMLCalciteTooltipElement, value: boolean): void {
    tooltip.open = value;

    if (value) {
      this.activeTooltip = tooltip;
    }
  }

  private toggleHoveredTooltip = (tooltip: HTMLCalciteTooltipElement, value: boolean): void => {
    this.hoverTimeout = window.setTimeout(() => {
      if (this.hoverTimeout === null) {
        return;
      }

      this.closeExistingTooltip();

      if (tooltip !== this.hoveredTooltip) {
        return;
      }

      this.toggleTooltip(tooltip, value);
    }, TOOLTIP_DELAY_MS);
  };

  private queryFocusedTooltip(event: FocusEvent, value: boolean): void {
    const tooltip = this.queryTooltip(event.composedPath());

    if (!tooltip || this.isClosableClickedTooltip(tooltip)) {
      return;
    }

    this.toggleFocusedTooltip(tooltip, value);
  }

  private isClosableClickedTooltip(tooltip: HTMLCalciteTooltipElement): boolean {
    return tooltip?.closeOnClick && tooltip === this.clickedTooltip;
  }

  private registerShadowRoot(shadowRoot: ShadowRoot): void {
    const { registeredShadowRootCounts } = this;

    const newCount = (registeredShadowRootCounts.get(shadowRoot) ?? 0) + 1;

    if (newCount === 1) {
      this.addShadowListeners(shadowRoot);
    }

    registeredShadowRootCounts.set(shadowRoot, newCount);
  }

  private unregisterShadowRoot(shadowRoot: ShadowRoot): void {
    const { registeredShadowRootCounts } = this;

    const newCount = registeredShadowRootCounts.get(shadowRoot) - 1;

    if (newCount === 0) {
      this.removeShadowListeners(shadowRoot);
    }

    registeredShadowRootCounts.set(shadowRoot, newCount);
  }

  private getReferenceElShadowRootNode(referenceEl: ReferenceElement): ShadowRoot | null {
    return referenceEl instanceof Element ? getShadowRootNode(referenceEl) : null;
  }
}
