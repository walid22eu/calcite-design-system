/**
 * Defines interface for components with open/close public emitter.
 * All implementations of this interface must handle the following events: `beforeOpen`, `open`, `beforeClose`, `close`.
 */
export interface OpenCloseComponent {
  /**
   * The host element.
   */
  readonly el: HTMLElement;

  /**
   * When true, the component opens.
   */
  open: boolean;

  /**
   * Specifies property on which active transition is watched for.
   */
  openTransitionProp: string;

  /**
   * Specifies element that the transition is allowed to emit on.
   */
  transitionEl: HTMLDivElement;

  /**
   * Defines method for `beforeOpen` event handler.
   */
  onBeforeOpen: () => void;

  /**
   * Defines method for `open` event handler:
   */
  onOpen: () => void;

  /**
   * Defines method for `beforeClose` event handler:
   */
  onBeforeClose: () => void;

  /**
   * Defines method for `close` event handler:
   */
  onClose: () => void;
}

const componentToTransitionListeners = new WeakMap<
  OpenCloseComponent,
  [HTMLDivElement, typeof transitionStart, typeof transitionEnd]
>();

function transitionStart(event: TransitionEvent): void {
  if (event.propertyName === this.openTransitionProp && event.target === this.transitionEl) {
    this.open ? this.onBeforeOpen() : this.onBeforeClose();
  }
}

function transitionEnd(event: TransitionEvent): void {
  if (event.propertyName === this.openTransitionProp && event.target === this.transitionEl) {
    this.open ? this.onOpen() : this.onClose();
  }
}
/**
 * Helper to keep track of transition listeners on setTransitionEl and connectedCallback on OpenCloseComponent components.
 *
 * @param component
 */
export function connectOpenCloseComponent(component: OpenCloseComponent): void {
  disconnectOpenCloseComponent(component);
  if (component.transitionEl) {
    const boundOnTransitionStart: (event: TransitionEvent) => void = transitionStart.bind(component);
    const boundOnTransitionEnd: (event: TransitionEvent) => void = transitionEnd.bind(component);

    componentToTransitionListeners.set(component, [
      component.transitionEl,
      boundOnTransitionStart,
      boundOnTransitionEnd
    ]);

    component.transitionEl.addEventListener("transitionstart", boundOnTransitionStart);
    component.transitionEl.addEventListener("transitionend", boundOnTransitionEnd);
  }
}
/**
 * Helper to tear down transition listeners on disconnectedCallback on OpenCloseComponent components.
 *
 * @param component
 */
export function disconnectOpenCloseComponent(component: OpenCloseComponent): void {
  if (!componentToTransitionListeners.has(component)) {
    return;
  }
  const [transitionEl, start, end] = componentToTransitionListeners.get(component);
  transitionEl.removeEventListener("transitionstart", start);
  transitionEl.removeEventListener("transitionend", end);

  componentToTransitionListeners.delete(component);
}
