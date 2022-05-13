import { createObserver } from "./observers";

type AttributeObject = { [k: string]: any };
type AllowedGlobalAttribute = "lang";
const allowedGlobalAttributes = ["lang"];

const elementToComponentAndObserverOptionsMap = new Map<
  HTMLElement,
  [GlobalAttrComponent, { attributeFilter: AllowedGlobalAttribute[] }]
>();

let mutationObserver: MutationObserver;

function updateGlobalAttributes(component: GlobalAttrComponent, attributeFilter: AllowedGlobalAttribute[]): void {
  const { el } = component;
  const updatedAttributes: AttributeObject = {};

  attributeFilter
    .filter((attr) => !!allowedGlobalAttributes.includes(attr) && !!el.hasAttribute(attr))
    .forEach((attr) => {
      const value = el.getAttribute(attr);

      if (value !== null) {
        updatedAttributes[attr] = value;
      }
    });

  component.globalAttributes = updatedAttributes;
}

function processMutations(mutations: MutationRecord[]): void {
  mutations.forEach(({ target }) => {
    const [component, options] = elementToComponentAndObserverOptionsMap.get(target as HTMLElement);
    updateGlobalAttributes(component, options.attributeFilter);
  });
}

/**
 * Watches global attributes of a component.
 *
 * Derived from: https://gist.github.com/willmartian/b4dd6b57d71dd0438fb9e7c6f4048578
 */
export interface GlobalAttrComponent {
  /**
   * The host element.
   */
  readonly el: HTMLElement;

  /**
   * The watched attributes object.
   * Should be stateful.
   * '@State() inheritedAttributes = {};'
   */
  globalAttributes: AttributeObject;
}

/**
 * Helper to set up listening for changes to global attributes.
 *
 * render(): VNode {
 *   const lang = this.inheritedAttributes['lang'] ?? 'en';
 *   return <div>My lang is {lang}</div>;
 * }
 *
 * @param component
 * @param attributeFilter
 */
export function watchGlobalAttributes(component: GlobalAttrComponent, attributeFilter: AllowedGlobalAttribute[]): void {
  const { el } = component;
  const observerOptions = { attributeFilter };

  elementToComponentAndObserverOptionsMap.set(el, [component, observerOptions]);

  updateGlobalAttributes(component, attributeFilter);

  if (!mutationObserver) {
    mutationObserver = createObserver("mutation", processMutations);
  }

  mutationObserver.observe(el, observerOptions);
}

/**
 * Helper remove listening for changes to inherited attributes.
 *
 * @param component
 */
export function unwatchGlobalAttributes(component: GlobalAttrComponent): void {
  elementToComponentAndObserverOptionsMap.delete(component.el);

  // we explicitly process queued mutations and disconnect and reconnect
  // the observer until MutationObserver gets an `unobserve` method
  // see https://github.com/whatwg/dom/issues/126
  processMutations(mutationObserver.takeRecords());
  mutationObserver.disconnect();
  for (const [element, [, observerOptions]] of elementToComponentAndObserverOptionsMap.entries()) {
    mutationObserver.observe(element, observerOptions);
  }
}
