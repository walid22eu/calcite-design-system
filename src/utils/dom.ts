import { CSS_UTILITY } from "./resources";
import { guid } from "./guid";

/**
 * This helper will guarantee an ID on the provided element.
 *
 * If it already has an ID, it will be preserved, otherwise a unique one will be generated and assigned.
 *
 * @param el
 * @returns {string} The element's ID.
 */
export function ensureId(el: Element): string {
  if (!el) {
    return "";
  }

  return (el.id = el.id || `${el.tagName.toLowerCase()}-${guid()}`);
}

export function nodeListToArray<T extends Element>(nodeList: HTMLCollectionOf<T> | NodeListOf<T> | T[]): T[] {
  return Array.isArray(nodeList) ? nodeList : Array.from(nodeList);
}

export type Direction = "ltr" | "rtl";

export function getThemeName(el: HTMLElement): "light" | "dark" {
  const closestElWithTheme = closestElementCrossShadowBoundary(
    el,
    `.${CSS_UTILITY.darkTheme}, .${CSS_UTILITY.lightTheme}`
  );
  return closestElWithTheme?.classList.contains("calcite-theme-dark") ? "dark" : "light";
}

export function getElementDir(el: HTMLElement): Direction {
  const prop = "dir";
  const selector = `[${prop}]`;
  const closest = closestElementCrossShadowBoundary(el, selector);
  return closest ? (closest.getAttribute(prop) as Direction) : "ltr";
}

export function getElementProp(el: Element, prop: string, fallbackValue: any): any {
  const selector = `[${prop}]`;
  const closest = el.closest(selector);
  return closest ? closest.getAttribute(prop) : fallbackValue;
}

export function getRootNode(el: Element): Document | ShadowRoot {
  return el.getRootNode() as Document | ShadowRoot;
}

export function getHost(root: Document | ShadowRoot): Element | null {
  return (root as ShadowRoot).host || null;
}

/**
 * This helper queries an element's rootNodes and any ancestor rootNodes.
 *
 * @param element
 * @param selector
 * @returns {Element[]} The elements.
 */
export function queryElementsRoots<T extends Element = Element>(element: Element, selector: string): T[] {
  // Gets the rootNode and any ancestor rootNodes (shadowRoot or document) of an element and queries them for a selector.
  // Based on: https://stackoverflow.com/q/54520554/194216
  function queryFromAll<T extends Element = Element>(el: Element, allResults: T[]): T[] {
    if (!el) {
      return allResults;
    }

    if ((el as Slottable).assignedSlot) {
      el = (el as Slottable).assignedSlot;
    }

    const rootNode = getRootNode(el);

    const results = Array.from(rootNode.querySelectorAll(selector)) as T[];

    const uniqueResults = results.filter((result) => !allResults.includes(result));

    allResults = [...allResults, ...uniqueResults];

    const host = getHost(rootNode);

    return host ? queryFromAll(host, allResults) : allResults;
  }

  return queryFromAll(element, []);
}

/**
 * This helper queries an element's rootNode and any ancestor rootNodes.
 *
 * If both an 'id' and 'selector' are supplied, 'id' will take precedence over 'selector'.
 *
 * @param element
 * @param root0
 * @param root0.selector
 * @param root0.id
 * @returns {Element} The element.
 */
export function queryElementRoots<T extends Element = Element>(
  element: Element,
  {
    selector,
    id
  }: {
    selector?: string;
    id?: string;
  }
): T | null {
  // Gets the rootNode and any ancestor rootNodes (shadowRoot or document) of an element and queries them for a selector.
  // Based on: https://stackoverflow.com/q/54520554/194216
  function queryFrom<T extends Element = Element>(el: Element): T | null {
    if (!el) {
      return null;
    }

    if ((el as Slottable).assignedSlot) {
      el = (el as Slottable).assignedSlot;
    }

    const rootNode = getRootNode(el);

    const found = id
      ? "getElementById" in rootNode
        ? /*
          Check to make sure 'getElementById' exists in cases where element is no longer connected to the DOM and getRootNode() returns the element.
          https://github.com/Esri/calcite-components/pull/4280
           */
          (rootNode.getElementById(id) as Element as T)
        : null
      : selector
      ? (rootNode.querySelector(selector) as T)
      : null;

    const host = getHost(rootNode);

    return found ? found : host ? queryFrom(host) : null;
  }

  return queryFrom(element);
}

export function closestElementCrossShadowBoundary<T extends Element = Element>(
  element: Element,
  selector: string
): T | null {
  // based on https://stackoverflow.com/q/54520554/194216
  function closestFrom<T extends Element = Element>(el: Element): T | null {
    return el ? el.closest(selector) || closestFrom(getHost(getRootNode(el))) : null;
  }

  return closestFrom(element);
}

export interface FocusableElement extends HTMLElement {
  setFocus?: () => Promise<void>;
}

export function isCalciteFocusable(el: FocusableElement): boolean {
  return typeof el?.setFocus === "function";
}

export async function focusElement(el: FocusableElement): Promise<void> {
  if (!el) {
    return;
  }

  return isCalciteFocusable(el) ? el.setFocus() : el.focus();
}

interface GetSlottedOptions {
  all?: boolean;
  direct?: boolean;
  matches?: string;
  selector?: string;
}

const defaultSlotSelector = ":not([slot])";

export function getSlotted<T extends Element = Element>(
  element: Element,
  slotName: string | string[] | (GetSlottedOptions & { all: true }),
  options: GetSlottedOptions & { all: true }
): T[];
export function getSlotted<T extends Element = Element>(
  element: Element,
  slotName?: string | string[] | GetSlottedOptions,
  options?: GetSlottedOptions
): T | null;
export function getSlotted<T extends Element = Element>(
  element: Element,
  slotName?: string | string[] | GetSlottedOptions,
  options?: GetSlottedOptions
): (T | null) | T[] {
  if (slotName && !Array.isArray(slotName) && typeof slotName !== "string") {
    options = slotName;
    slotName = null;
  }

  const slotSelector = slotName
    ? Array.isArray(slotName)
      ? slotName.map((name) => `[slot="${name}"]`).join(",")
      : `[slot="${slotName}"]`
    : defaultSlotSelector;

  if (options?.all) {
    return queryMultiple<T>(element, slotSelector, options);
  }

  return querySingle<T>(element, slotSelector, options);
}

function getDirectChildren<T extends Element = Element>(el: Element, selector: string): T[] {
  return el ? (Array.from(el.children || []) as T[]).filter((child) => child?.matches(selector)) : [];
}

function queryMultiple<T extends Element = Element>(
  element: Element,
  slotSelector: string,
  options?: GetSlottedOptions
): T[] {
  let matches =
    slotSelector === defaultSlotSelector
      ? getDirectChildren<T>(element, defaultSlotSelector)
      : Array.from(element.querySelectorAll<T>(slotSelector));

  matches = options && options.direct === false ? matches : matches.filter((el) => el.parentElement === element);

  matches = options?.matches ? matches.filter((el) => el?.matches(options.matches)) : matches;

  const selector = options?.selector;
  return selector
    ? matches
        .map((item) => Array.from(item.querySelectorAll<T>(selector)))
        .reduce((previousValue, currentValue) => [...previousValue, ...currentValue], [])
        .filter((match) => !!match)
    : matches;
}

function querySingle<T extends Element = Element>(
  element: Element,
  slotSelector: string,
  options?: GetSlottedOptions
): T | null {
  let match =
    slotSelector === defaultSlotSelector
      ? getDirectChildren<T>(element, defaultSlotSelector)[0] || null
      : element.querySelector<T>(slotSelector);

  match = options && options.direct === false ? match : match?.parentElement === element ? match : null;

  match = options?.matches ? (match?.matches(options.matches) ? match : null) : match;

  const selector = options?.selector;
  return selector ? match?.querySelector<T>(selector) : match;
}

export function filterDirectChildren<T extends Element>(el: Element, selector: string): T[] {
  return Array.from(el.children).filter((child): child is T => child.matches(selector));
}

// set a default icon from a defined set or allow an override with an icon name string
export function setRequestedIcon(
  iconObject: Record<string, string>,
  iconValue: string | boolean,
  matchedValue: string
): string {
  if (typeof iconValue === "string" && iconValue !== "") {
    return iconValue;
  } else if (iconValue === "") {
    return iconObject[matchedValue];
  }
}

export function intersects(rect1: DOMRect, rect2: DOMRect): boolean {
  return !(
    rect2.left > rect1.right ||
    rect2.right < rect1.left ||
    rect2.top > rect1.bottom ||
    rect2.bottom < rect1.top
  );
}

/**
 * This helper makes sure that boolean aria attributes are properly converted to a string.
 *
 * It should only be used for aria attributes that require a string value of "true" or "false".
 *
 * @param value
 * @returns {string} The string conversion of a boolean value ("true" | "false").
 */
export function toAriaBoolean(value: boolean): string {
  return Boolean(value).toString();
}
