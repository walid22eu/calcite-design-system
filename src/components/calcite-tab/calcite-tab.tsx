import {
  Component,
  Prop,
  Element,
  Listen,
  Method,
  Event,
  EventEmitter,
  h,
  State,
  Host,
  VNode
} from "@stencil/core";
import { TabChangeEventDetail } from "../../interfaces/TabChange";
import { guid } from "../../utils/guid";
import { nodeListToArray } from "../../utils/dom";

@Component({
  tag: "calcite-tab",
  styleUrl: "calcite-tab.scss",
  shadow: true
})
export class CalciteTab {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteTabElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /**
   * Optionally include a unique name for this tab,
   * be sure to also set this name on the associated title.
   */
  @Prop({ reflect: true }) tab: string;

  /**
   * Show this tab
   */
  @Prop({ reflect: true, mutable: true }) active = false;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  render(): VNode {
    const id = this.el.id || this.guid;

    return (
      <Host
        aria-expanded={this.active.toString()}
        aria-labelledby={this.labeledBy}
        id={id}
        role="tabpanel"
      >
        <section>
          <slot />
        </section>
      </Host>
    );
  }

  componentDidLoad(): void {
    this.calciteTabRegister.emit();
  }

  disconnectedCallback(): void {
    this.calciteTabUnregister.emit();
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Event() calciteTabRegister: EventEmitter;

  /**
   * @internal
   */
  @Event() calciteTabUnregister: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteTabChange", { target: "body" }) tabChangeHandler(
    event: CustomEvent<TabChangeEventDetail>
  ): void {
    // to allow `<calcite-tabs>` to be nested we need to make sure this
    // `calciteTabChange` event was actually fired from a title that is a
    // child of the `<calcite-tabs>` that is the a parent of this tab.
    if ((event.target as HTMLElement).closest("calcite-tabs") !== this.el.closest("calcite-tabs")) {
      return;
    }

    if (this.tab) {
      this.active = this.tab === event.detail.tab;
    } else {
      this.getTabIndex().then((index) => {
        this.active = index === event.detail.tab;
      });
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Return the index of this tab within the tab array
   */
  @Method()
  async getTabIndex(): Promise<number> {
    return Array.prototype.indexOf.call(
      nodeListToArray(this.el.parentElement.children).filter((e) => e.matches("calcite-tab")),
      this.el
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  private guid = `calcite-tab-title-${guid()}`;

  @State() private labeledBy: string;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  /**
   * @internal
   */
  @Method() async updateAriaInfo(tabIds: string[] = [], titleIds: string[] = []): Promise<void> {
    this.labeledBy = titleIds[tabIds.indexOf(this.el.id)] || null;
  }
}
