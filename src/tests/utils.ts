import { E2EElement, E2EPage } from "@stencil/core/testing";
import { BoundingBox, JSONObject } from "puppeteer";
import dedent from "dedent";

/**
 * Util to help type global props for testing.
 */
export type GlobalTestProps<T> = T & Window & typeof globalThis;

type DragAndDropSelector = string | SelectorOptions;

type PointerPosition = {
  vertical?: "bottom" | "center" | "top";
  horizontal?: "left" | "center" | "right";
  offset?: [number, number];
};

interface SelectorOptions extends JSONObject {
  element: string;
  shadow?: string;
  pointerPosition?: PointerPosition;
}

type MouseInitEvent = Pick<
  MouseEvent,
  "bubbles" | "cancelable" | "composed" | "screenX" | "screenY" | "clientX" | "clientY"
>;

/* based on https://github.com/puppeteer/puppeteer/issues/1366#issuecomment-615887204 */
export async function dragAndDrop(
  page: E2EPage,
  dragStartSelector: DragAndDropSelector,
  dragEndSelector: DragAndDropSelector
): Promise<void> {
  async function getBounds(selector: DragAndDropSelector): Promise<BoundingBox> {
    const elementHandle =
      typeof selector === "string"
        ? await page.waitForSelector(selector)
        : await page.evaluateHandle(({ element, shadow }) => {
            const target = document.querySelector(element);

            return shadow ? target.shadowRoot.querySelector(shadow) : target;
          }, selector);

    return elementHandle.asElement().boundingBox();
  }

  async function createEventInitializer(selector: DragAndDropSelector): Promise<MouseInitEvent> {
    const {
      vertical: verticalPos,
      horizontal: horizontalPos,
      offset = [0, 0]
    }: PointerPosition = typeof selector === "string" || !selector.pointerPosition
      ? { vertical: "center" }
      : selector.pointerPosition;
    const { height, width, x, y } = await getBounds(selector);
    const verticalOffset = verticalPos === "top" ? 0 : verticalPos === "bottom" ? height : height / 2;
    const horizontalOffset = horizontalPos === "left" ? 0 : horizontalPos === "right" ? width : width / 2;

    const eventX = x + horizontalOffset + offset[0];
    const eventY = y + verticalOffset + offset[1];

    return {
      bubbles: true,
      cancelable: true,
      composed: true,
      screenX: eventX,
      screenY: eventY,
      clientX: eventX,
      clientY: eventY
    };
  }

  async function browserContextFunction(
    dragStartSelector: DragAndDropSelector,
    dragEndSelector: DragAndDropSelector,
    dragStartInitializer: MouseInitEvent,
    dragEndInitializer: MouseInitEvent
  ): Promise<void> {
    function getElement(selector: DragAndDropSelector): Element {
      if (typeof selector === "string") {
        return document.querySelector(selector);
      }

      const element = document.querySelector(selector.element);

      return selector.shadow ? element.shadowRoot.querySelector(selector.shadow) : element;
    }

    const dragStart = getElement(dragStartSelector);
    let dragEnd = getElement(dragEndSelector);

    // if has child, put at the end.
    dragEnd = dragEnd.lastElementChild || dragEnd;

    dragStart.dispatchEvent(new PointerEvent("pointerdown", dragStartInitializer));
    dragStart.dispatchEvent(new DragEvent("dragstart", dragStartInitializer));

    await new Promise((resolve) => window.setTimeout(resolve, 2000));

    dragEnd.dispatchEvent(new MouseEvent("dragenter", dragEndInitializer));
    dragStart.dispatchEvent(new DragEvent("dragend", dragEndInitializer));
  }

  return page.evaluate(
    browserContextFunction,
    dragStartSelector,
    dragEndSelector,
    await createEventInitializer(dragStartSelector),
    await createEventInitializer(dragEndSelector)
  );
}

export function selectText(input: E2EElement): Promise<void> {
  // workaround for selecting text based on https://github.com/puppeteer/puppeteer/issues/1313#issuecomment-436932478
  return input.click({ clickCount: 3 });
}

/**
 * Use this tagged template to help Prettier format any HTML template literals.
 * @param strings the
 *
 * @example
 *
 * ```ts
 * const page = await newE2EPage({
 *   html: html`
 *     <calcite-select>
 *       <calcite-option id="1">uno</calcite-option>
 *       <calcite-option id="2">dos</calcite-option>
 *       <calcite-option id="3">tres</calcite-option>
 *     </calcite-select>
 *   `
 * });
 * ```
 */
export function html(strings: string): string;
export function html(strings: TemplateStringsArray, ...placeholders: any[]): string;
export function html(strings: any, ...placeholders: any[]): string {
  return dedent(strings, ...placeholders);
}

/*
MIT License

Copyright (c) 2020 Cloud Four

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/cloudfour/simple-svg-placeholder
*/

interface SimpleSvgPlaceholderParams {
  width?: number;
  height?: number;
  text?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  dy?: number;
  bgColor?: string;
  textColor?: string;
  dataUri?: boolean;
  charset?: string;
}

export function placeholderImage({
  width = 300,
  height = 150,
  text = `${width}×${height}`,
  fontFamily = "sans-serif",
  fontWeight = "bold",
  fontSize = Math.floor(Math.min(width, height) * 0.2),
  dy = fontSize * 0.35,
  bgColor = "#ddd",
  textColor = "rgba(0,0,0,0.5)",
  dataUri = true,
  charset = "UTF-8"
}: SimpleSvgPlaceholderParams): string {
  const str = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect fill="${bgColor}" width="${width}" height="${height}"/>
    <text fill="${textColor}" font-family="${fontFamily}" font-size="${fontSize}" dy="${dy}" font-weight="${fontWeight}" x="50%" y="50%" text-anchor="middle">${text}</text>
  </svg>`;

  // Thanks to: filamentgroup/directory-encoder
  const cleaned = str
    .replace(/[\t\n\r]/gim, "") // Strip newlines and tabs
    .replace(/\s\s+/g, " ") // Condense multiple spaces
    .replace(/'/gim, "\\i"); // Normalize quotes

  if (dataUri) {
    const encoded = encodeURIComponent(cleaned)
      .replace(/\(/g, "%28") // Encode brackets
      .replace(/\)/g, "%29");

    return `data:image/svg+xml;charset=${charset},${encoded}`;
  }

  return cleaned;
}

/**
 * Helper to get an E2EElement's x,y coordinates
 * @param page
 * @param elementSelector
 * @param shadowSelector
 */
export async function getElementXY(
  page: E2EPage,
  elementSelector: string,
  shadowSelector?: string
): Promise<[number, number]> {
  return page.evaluate(
    ([elementSelector, shadowSelector]): [number, number] => {
      const element = document.querySelector(elementSelector);
      const measureTarget = shadowSelector ? element.shadowRoot.querySelector(shadowSelector) : element;
      const { x, y } = measureTarget.getBoundingClientRect();

      return [x, y];
    },
    [elementSelector, shadowSelector]
  );
}

/**
 * This util helps visualize mouse movement when running tests in headful mode.
 *
 * Note that this util should only be used for test debugging purposes and not be included in a test.
 *
 * Based on https://github.com/puppeteer/puppeteer/issues/4378#issuecomment-499726973
 */
export async function visualizeMouseCursor(page: E2EPage): Promise<void> {
  await page.evaluate(() => {
    const box = document.createElement("puppeteer-mouse-pointer");
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
        puppeteer-mouse-pointer {
          pointer-events: none;
          position: absolute;
          top: 0;
          z-index: 10000;
          left: 0;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,.4);
          border: 1px solid white;
          border-radius: 10px;
          margin: -10px 0 0 -10px;
          padding: 0;
          transition: background .2s, border-radius .2s, border-color .2s;
        }
        puppeteer-mouse-pointer.button-1 {
          transition: none;
          background: rgba(0,0,0,0.9);
        }
        puppeteer-mouse-pointer.button-2 {
          transition: none;
          border-color: rgba(0,0,255,0.9);
        }
        puppeteer-mouse-pointer.button-3 {
          transition: none;
          border-radius: 4px;
        }
        puppeteer-mouse-pointer.button-4 {
          transition: none;
          border-color: rgba(255,0,0,0.9);
        }
        puppeteer-mouse-pointer.button-5 {
          transition: none;
          border-color: rgba(0,255,0,0.9);
        }
      `;
    document.head.appendChild(styleElement);
    document.body.appendChild(box);

    document.addEventListener(
      "mousemove",
      (event) => {
        box.style.left = event.pageX + "px";
        box.style.top = event.pageY + "px";
        updateButtons(event.buttons);
      },
      true
    );

    document.addEventListener(
      "mousedown",
      (event) => {
        updateButtons(event.buttons);
        box.classList.add("button-" + event.which);
      },
      true
    );

    document.addEventListener(
      "mouseup",
      (event) => {
        updateButtons(event.buttons);
        box.classList.remove("button-" + event.which);
      },
      true
    );

    function updateButtons(buttons: number): void {
      for (let i = 0; i < 5; i++) {
        box.classList.toggle("button-" + i, (buttons & (1 << i)) as unknown as boolean);
      }
    }
  });
}
