import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch,
  h,
  VNode
} from "@stencil/core";
import { CSS, ICONS, TEXT, HEADING_LEVEL } from "./resources";
import { getElementDir, toAriaBoolean } from "../../utils/dom";
import { HeadingLevel, Heading } from "../functional/Heading";
import { createObserver } from "../../utils/observers";

/**
 * @slot - A slot for adding `calcite-tip`s.
 */
@Component({
  tag: "calcite-tip-manager",
  styleUrl: "tip-manager.scss",
  shadow: true
})
export class TipManager {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------
  /**
   * Closed state of the `calcite-tip-manager`.
   */
  @Prop({ reflect: true, mutable: true }) closed = false;

  @Watch("closed")
  closedChangeHandler(): void {
    this.direction = null;
    this.calciteTipManagerToggle.emit();
  }

  /**
   * Number at which section headings should start for this component.
   */
  @Prop() headingLevel: HeadingLevel;

  /**
   * Alternate text for closing the tip.
   */
  @Prop() intlClose?: string;

  /**
   * The default group title for the `calcite-tip-manager`.
   */
  @Prop() intlDefaultTitle?: string;

  /**
   * Alternate text for navigating to the next tip.
   */
  @Prop() intlNext?: string;

  /**
   * Label that appears on hover of pagination icon.
   */
  @Prop() intlPaginationLabel?: string;

  /**
   * Alternate text for navigating to the previous tip.
   */
  @Prop() intlPrevious?: string;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteTipManagerElement;

  @State() selectedIndex: number;

  @Watch("selectedIndex")
  selectedChangeHandler(): void {
    this.showSelectedTip();
    this.updateGroupTitle();
  }

  @State() tips: HTMLCalciteTipElement[];

  @State() total: number;

  @State() direction: "advancing" | "retreating";

  @State() groupTitle: string;

  mutationObserver = createObserver("mutation", () => this.setUpTips());

  container: HTMLDivElement;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    this.setUpTips();
    this.mutationObserver?.observe(this.el, { childList: true, subtree: true });
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
  }

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  /** Selects the next tip to display */
  @Method()
  async nextTip(): Promise<void> {
    this.direction = "advancing";
    const nextIndex = this.selectedIndex + 1;
    this.selectedIndex = (nextIndex + this.total) % this.total;
  }

  /** Selects the previous tip to display */
  @Method()
  async previousTip(): Promise<void> {
    this.direction = "retreating";
    const previousIndex = this.selectedIndex - 1;
    this.selectedIndex = (previousIndex + this.total) % this.total;
  }

  // --------------------------------------------------------------------------
  //
  //  Events
  //
  // --------------------------------------------------------------------------

  /**
   * Emitted when the `calcite-tip-manager` has been toggled open or closed.
   *
   * @deprecated use calciteTipManagerClose instead.
   */
  @Event({ cancelable: false }) calciteTipManagerToggle: EventEmitter<void>;

  /**
   * Emitted when the `calcite-tip-manager` has been closed.
   */
  @Event({ cancelable: false }) calciteTipManagerClose: EventEmitter<void>;

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  setUpTips(): void {
    const tips = Array.from(this.el.querySelectorAll("calcite-tip"));
    this.total = tips.length;
    if (this.total === 0) {
      return;
    }
    const selectedTip = this.el.querySelector<HTMLCalciteTipElement>("calcite-tip[selected]");

    this.tips = tips;
    this.selectedIndex = selectedTip ? tips.indexOf(selectedTip) : 0;

    tips.forEach((tip) => {
      tip.nonDismissible = true;
    });
    this.showSelectedTip();
    this.updateGroupTitle();
  }

  hideTipManager = (): void => {
    this.closed = true;
    this.calciteTipManagerToggle.emit();
    this.calciteTipManagerClose.emit();
  };

  showSelectedTip(): void {
    this.tips.forEach((tip, index) => {
      const isSelected = this.selectedIndex === index;
      tip.selected = isSelected;
      tip.hidden = !isSelected;
    });
  }

  updateGroupTitle(): void {
    const selectedTip = this.tips[this.selectedIndex];
    const tipParent = selectedTip.closest("calcite-tip-group");
    this.groupTitle = tipParent?.groupTitle || this.intlDefaultTitle || TEXT.defaultGroupTitle;
  }

  previousClicked = (): void => {
    this.previousTip();
  };

  nextClicked = (): void => {
    this.nextTip();
  };

  tipManagerKeyDownHandler = (event: KeyboardEvent): void => {
    if (event.target !== this.container) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        this.nextTip();
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.previousTip();
        break;
      case "Home":
        event.preventDefault();
        this.selectedIndex = 0;
        break;
      case "End":
        event.preventDefault();
        this.selectedIndex = this.total - 1;
        break;
    }
  };

  storeContainerRef = (el: HTMLDivElement): void => {
    this.container = el;
  };

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  renderPagination(): VNode {
    const dir = getElementDir(this.el);
    const { selectedIndex, tips, total, intlNext, intlPrevious, intlPaginationLabel } = this;

    const nextLabel = intlNext || TEXT.next;
    const previousLabel = intlPrevious || TEXT.previous;
    const paginationLabel = intlPaginationLabel || TEXT.defaultPaginationLabel;

    return tips.length > 1 ? (
      <footer class={CSS.pagination}>
        <calcite-action
          class={CSS.pagePrevious}
          icon={dir === "ltr" ? ICONS.chevronLeft : ICONS.chevronRight}
          onClick={this.previousClicked}
          scale="m"
          text={previousLabel}
        />
        <span class={CSS.pagePosition}>{`${paginationLabel} ${selectedIndex + 1}/${total}`}</span>
        <calcite-action
          class={CSS.pageNext}
          icon={dir === "ltr" ? ICONS.chevronRight : ICONS.chevronLeft}
          onClick={this.nextClicked}
          scale="m"
          text={nextLabel}
        />
      </footer>
    ) : null;
  }

  render(): VNode {
    const { closed, direction, headingLevel, groupTitle, selectedIndex, intlClose, total } = this;

    const closeLabel = intlClose || TEXT.close;

    if (total === 0) {
      return null;
    }

    return (
      <section
        aria-hidden={toAriaBoolean(closed)}
        class={CSS.container}
        hidden={closed}
        onKeyDown={this.tipManagerKeyDownHandler}
        ref={this.storeContainerRef}
        tabIndex={0}
      >
        <header class={CSS.header}>
          <Heading class={CSS.heading} level={headingLevel || HEADING_LEVEL}>
            {groupTitle}
          </Heading>
          <calcite-action
            class={CSS.close}
            onClick={this.hideTipManager}
            scale="m"
            text={closeLabel}
          >
            <calcite-icon icon={ICONS.close} scale="m" />
          </calcite-action>
        </header>
        <div
          class={{
            [CSS.tipContainer]: true,
            [CSS.tipContainerAdvancing]: !closed && direction === "advancing",
            [CSS.tipContainerRetreating]: !closed && direction === "retreating"
          }}
          key={selectedIndex}
          tabIndex={0}
        >
          <slot />
        </div>
        {this.renderPagination()}
      </section>
    );
  }
}
