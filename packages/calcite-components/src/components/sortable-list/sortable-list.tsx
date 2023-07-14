import { Component, Element, Event, EventEmitter, h, Listen, Prop, VNode } from "@stencil/core";
import Sortable from "sortablejs";
import {
  connectInteractive,
  disconnectInteractive,
  InteractiveComponent,
  updateHostInteraction,
} from "../../utils/interactive";
import { createObserver } from "../../utils/observers";
import { HandleNudge } from "../handle/interfaces";
import { Layout } from "../interfaces";
import { CSS } from "./resources";
import {
  connectSortableComponent,
  disconnectSortableComponent,
  onSortingStart,
  SortableComponent,
  onSortingEnd,
} from "../../utils/sortableComponent";
import { focusElement } from "../../utils/dom";

/**
 * @slot - A slot for adding sortable items.
 */
@Component({
  tag: "calcite-sortable-list",
  styleUrl: "sortable-list.scss",
  shadow: true,
})
export class SortableList implements InteractiveComponent, SortableComponent {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * Specifies which items inside the element should be draggable.
   */
  @Prop({ reflect: true }) dragSelector?: string;

  /**
   * The list's group identifier.
   *
   * To drag elements from one list into another, both lists must have the same group value.
   */
  @Prop({ reflect: true }) group?: string;

  /**
   * The selector for the handle elements.
   */
  @Prop({ reflect: true }) handleSelector = "calcite-handle";

  /**
   * Indicates the horizontal or vertical orientation of the component.
   */
  @Prop({ reflect: true }) layout: Layout = "vertical";

  /**
   * When true, disabled prevents interaction. This state shows items with lower opacity/grayed.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * When true, content is waiting to be loaded. This state shows a busy indicator.
   */
  @Prop({ reflect: true }) loading = false;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteSortableListElement;

  items: Element[] = [];

  mutationObserver = createObserver("mutation", () => {
    this.setUpSorting();
  });

  sortable: Sortable;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    this.setUpSorting();
    this.beginObserving();
    connectInteractive(this);
  }

  disconnectedCallback(): void {
    disconnectInteractive(this);
    disconnectSortableComponent(this);
    this.endObserving();
  }

  componentDidRender(): void {
    updateHostInteraction(this);
  }

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Emitted when the order of the list has changed.
   */
  @Event({ cancelable: false }) calciteListOrderChange: EventEmitter<void>;

  @Listen("calciteHandleNudge")
  calciteHandleNudgeNextHandler(event: CustomEvent<HandleNudge>): void {
    this.handleNudgeEvent(event);
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  handleNudgeEvent(event: CustomEvent<HandleNudge>): void {
    const { direction } = event.detail;

    const handle = event
      .composedPath()
      .find((el: HTMLElement) => el.matches(this.handleSelector)) as HTMLElement;

    const sortItem = this.items.find((item) => {
      return item.contains(handle) || event.composedPath().includes(item);
    });

    const lastIndex = this.items.length - 1;
    const startingIndex = this.items.indexOf(sortItem);
    let appendInstead = false;
    let buddyIndex: number;

    if (direction === "up") {
      if (startingIndex === 0) {
        appendInstead = true;
      } else {
        buddyIndex = startingIndex - 1;
      }
    } else {
      if (startingIndex === lastIndex) {
        buddyIndex = 0;
      } else if (startingIndex === lastIndex - 1) {
        appendInstead = true;
      } else {
        buddyIndex = startingIndex + 2;
      }
    }

    this.endObserving();

    if (appendInstead) {
      sortItem.parentElement.appendChild(sortItem);
    } else {
      sortItem.parentElement.insertBefore(sortItem, this.items[buddyIndex]);
    }

    this.items = Array.from(this.el.children);

    this.beginObserving();
    requestAnimationFrame(() => focusElement(handle));

    if ("activated" in handle) {
      handle.activated = true;
    }
  }

  setUpSorting(): void {
    const { dragSelector, group, handleSelector } = this;

    this.items = Array.from(this.el.children);

    const sortableOptions: Sortable.Options = {
      dataIdAttr: "id",
      group,
      handle: handleSelector,
      onStart: () => {
        this.endObserving();
        onSortingStart(this);
      },
      onEnd: () => {
        onSortingEnd(this);
        this.beginObserving();
      },
      onUpdate: () => {
        this.items = Array.from(this.el.children);
        this.calciteListOrderChange.emit();
      },
    };

    if (dragSelector) {
      sortableOptions.draggable = dragSelector;
    }

    connectSortableComponent(this, sortableOptions);
  }

  beginObserving(): void {
    this.mutationObserver?.observe(this.el, { childList: true, subtree: true });
  }

  endObserving(): void {
    this.mutationObserver?.disconnect();
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const { layout } = this;
    const horizontal = layout === "horizontal" || false;

    return (
      <div
        class={{
          [CSS.container]: true,
          [CSS.containerVertical]: !horizontal,
          [CSS.containerHorizontal]: horizontal,
        }}
      >
        <slot />
      </div>
    );
  }
}
