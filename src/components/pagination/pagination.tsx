import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  Method,
  VNode,
  Fragment,
  State
} from "@stencil/core";
import { Scale } from "../interfaces";
import {
  GlobalAttrComponent,
  unwatchGlobalAttributes,
  watchGlobalAttributes
} from "../../utils/globalAttributes";
import { localizeNumberString } from "../../utils/locale";
import { CSS, TEXT } from "./resources";

const maxPagesDisplayed = 5;
export interface PaginationDetail {
  start: number;
  total: number;
  num: number;
}

@Component({
  tag: "calcite-pagination",
  styleUrl: "pagination.scss",
  shadow: true
})
export class Pagination implements GlobalAttrComponent {
  //--------------------------------------------------------------------------
  //
  //  Public Properties
  //
  //--------------------------------------------------------------------------
  /** number of items per page */
  @Prop() num = 20;

  /** index of item that should begin the page */
  @Prop({ mutable: true }) start = 1;

  /** total number of items */
  @Prop() total = 0;

  /**
   * Used as an accessible label (aria-label) for the next button
   *
   * @default "Next"
   */
  @Prop() textLabelNext: string = TEXT.nextLabel;

  /**
   * Used as an accessible label (aria-label) of the previous button
   *
   * @default "Previous"
   */
  @Prop() textLabelPrevious: string = TEXT.previousLabel;

  /** The scale of the pagination */
  @Prop({ reflect: true }) scale: Scale = "m";

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------
  @Element() el: HTMLCalcitePaginationElement;

  //--------------------------------------------------------------------------
  //
  //  State
  //
  //--------------------------------------------------------------------------
  @State() globalAttributes = {};

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Emitted whenever the selected page changes.
   *
   * @deprecated use calcitePaginationChange instead
   */
  @Event() calcitePaginationUpdate: EventEmitter<PaginationDetail>;

  /**
   * Emitted whenever the selected page changes.
   *
   * @see [PaginationDetail](https://github.com/Esri/calcite-components/blob/master/src/components/pagination/calcite-pagination.tsx#L18)
   */
  @Event() calcitePaginationChange: EventEmitter<PaginationDetail>;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  connectedCallback(): void {
    watchGlobalAttributes(this, ["lang"]);
  }

  disconnectedCallback(): void {
    unwatchGlobalAttributes(this);
  }

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  /** Go to the next page of results */
  @Method() async nextPage(): Promise<void> {
    this.start = Math.min(this.getLastStart(), this.start + this.num);
  }

  /** Go to the previous page of results */
  @Method() async previousPage(): Promise<void> {
    this.start = Math.max(1, this.start - this.num);
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  private getLastStart(): number {
    const { total, num } = this;
    const lastStart = total % num === 0 ? total - num : Math.floor(total / num) * num;
    return lastStart + 1;
  }

  private previousClicked = (): void => {
    this.previousPage().then();
    this.emitUpdate();
  };

  private nextClicked = (): void => {
    this.nextPage();
    this.emitUpdate();
  };

  private showLeftEllipsis() {
    return Math.floor(this.start / this.num) > 3;
  }

  private showRightEllipsis() {
    return (this.total - this.start) / this.num > 3;
  }

  private emitUpdate() {
    const changePayload = {
      start: this.start,
      total: this.total,
      num: this.num
    };

    this.calcitePaginationChange.emit(changePayload);
    this.calcitePaginationUpdate.emit(changePayload);
  }

  //--------------------------------------------------------------------------
  //
  //  Render Methods
  //
  //--------------------------------------------------------------------------

  renderPages(): VNode[] {
    const lastStart = this.getLastStart();
    let end: number;
    let nextStart: number;

    // if we don't need ellipses render the whole set
    if (this.total / this.num <= maxPagesDisplayed) {
      nextStart = 1 + this.num;
      end = lastStart - this.num;
    } else {
      // if we're within max pages of page 1
      if (this.start / this.num < maxPagesDisplayed - 1) {
        nextStart = 1 + this.num;
        end = 1 + 4 * this.num;
      } else {
        // if we're within max pages of last page
        if (this.start + 3 * this.num >= this.total) {
          nextStart = lastStart - 4 * this.num;
          end = lastStart - this.num;
        } else {
          nextStart = this.start - this.num;
          end = this.start + this.num;
        }
      }
    }

    const pages = [];
    while (nextStart <= end) {
      pages.push(nextStart);
      nextStart = nextStart + this.num;
    }

    return pages.map((page) => this.renderPage(page));
  }

  renderPage(start: number): VNode {
    const lang = this.globalAttributes["lang"] || document.documentElement.lang || "en";
    const page = Math.floor(start / this.num) + (this.num === 1 ? 0 : 1);
    return (
      <button
        class={{
          [CSS.page]: true,
          [CSS.selected]: start === this.start
        }}
        onClick={() => {
          this.start = start;
          this.emitUpdate();
        }}
      >
        {localizeNumberString(page.toString(), lang, true)}
      </button>
    );
  }

  renderLeftEllipsis(): VNode {
    if (this.total / this.num > maxPagesDisplayed && this.showLeftEllipsis()) {
      return <span class={`${CSS.ellipsis} ${CSS.ellipsisStart}`}>&hellip;</span>;
    }
  }

  renderRightEllipsis(): VNode {
    if (this.total / this.num > maxPagesDisplayed && this.showRightEllipsis()) {
      return <span class={`${CSS.ellipsis} ${CSS.ellipsisEnd}`}>&hellip;</span>;
    }
  }

  render(): VNode {
    const { total, num, start } = this;
    const prevDisabled = num === 1 ? start <= num : start < num;
    const nextDisabled = num === 1 ? start + num > total : start + num > total;
    return (
      <Fragment>
        <button
          aria-label={this.textLabelPrevious}
          class={{
            [CSS.previous]: true,
            [CSS.disabled]: prevDisabled
          }}
          disabled={prevDisabled}
          onClick={this.previousClicked}
        >
          <calcite-icon flipRtl icon="chevronLeft" scale="s" />
        </button>
        {total > num ? this.renderPage(1) : null}
        {this.renderLeftEllipsis()}
        {this.renderPages()}
        {this.renderRightEllipsis()}
        {this.renderPage(this.getLastStart())}
        <button
          aria-label={this.textLabelNext}
          class={{
            [CSS.next]: true,
            [CSS.disabled]: nextDisabled
          }}
          disabled={nextDisabled}
          onClick={this.nextClicked}
        >
          <calcite-icon flipRtl icon="chevronRight" scale="s" />
        </button>
      </Fragment>
    );
  }
}
