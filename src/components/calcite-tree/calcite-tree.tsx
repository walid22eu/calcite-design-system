import {
  Component,
  Element,
  Prop,
  Host,
  Event,
  EventEmitter,
  Listen,
  h,
  VNode
} from "@stencil/core";
import { focusElement, nodeListToArray } from "../../utils/dom";
import { TreeItemSelectDetail } from "../calcite-tree-item/interfaces";
import { TreeSelectDetail, TreeSelectionMode } from "./interfaces";
import { Scale } from "../interfaces";

@Component({
  tag: "calcite-tree",
  styleUrl: "calcite-tree.scss",
  shadow: true
})
export class CalciteTree {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteTreeElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** Display indentation guide lines */
  @Prop({ mutable: true, reflect: true }) lines = false;

  /** Display input */
  @Prop({ mutable: true }) inputEnabled = false;

  /** @internal If this tree is nested within another tree, set to false */
  @Prop({ reflect: true, mutable: true }) child: boolean;

  /** Specify the scale of the tree, defaults to m */
  @Prop({ mutable: true, reflect: true }) scale: Extract<"s" | "m", Scale> = "m";

  /** Customize how tree selection works (single, multi, children, multi-children) */
  @Prop({ mutable: true, reflect: true }) selectionMode: TreeSelectionMode =
    TreeSelectionMode.Single;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  componentWillRender(): void {
    const parent: HTMLCalciteTreeElement = this.el.parentElement.closest("calcite-tree");
    this.lines = parent ? parent.lines : this.lines;
    this.scale = parent ? parent.scale : this.scale;
    this.inputEnabled = parent ? parent.inputEnabled : this.inputEnabled;
    this.selectionMode = parent ? parent.selectionMode : this.selectionMode;
    this.child = !!parent;
  }

  render(): VNode {
    return (
      <Host
        aria-multiselectable={
          this.selectionMode === TreeSelectionMode.Multi ||
          this.selectionMode === TreeSelectionMode.MultiChildren
        }
        role={!this.child ? "tree" : undefined}
        tabIndex={this.getRootTabIndex()}
      >
        <slot />
      </Host>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("focus") onFocus(): void {
    if (!this.child) {
      const focusTarget =
        this.el.querySelector<HTMLCalciteTreeItemElement>("calcite-tree-item[selected]") ||
        this.el.querySelector<HTMLCalciteTreeItemElement>("calcite-tree-item");

      focusElement(focusTarget);
    }
  }

  @Listen("focusin") onFocusIn(event: FocusEvent): void {
    const focusedFromRootOrOutsideTree =
      event.relatedTarget === this.el || !this.el.contains(event.relatedTarget as HTMLElement);

    if (focusedFromRootOrOutsideTree) {
      this.el.tabIndex = -1;
    }
  }

  @Listen("focusout") onFocusOut(event: FocusEvent): void {
    const willFocusOutsideTree = !this.el.contains(event.relatedTarget as HTMLElement);

    if (willFocusOutsideTree) {
      this.el.tabIndex = this.getRootTabIndex();
    }
  }

  @Listen("calciteTreeItemSelect")
  onClick(e: CustomEvent<TreeItemSelectDetail>): void {
    const target = e.target as HTMLCalciteTreeItemElement;
    const childItems = nodeListToArray(
      target.querySelectorAll("calcite-tree-item")
    ) as HTMLCalciteTreeItemElement[];

    if (!this.child) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (this.selectionMode === TreeSelectionMode.Ancestors && !this.child) {
      this.updateAncestorTree(e);
      return;
    }

    const shouldSelect =
      this.selectionMode !== null &&
      (!target.hasChildren ||
        (target.hasChildren &&
          (this.selectionMode === TreeSelectionMode.Children ||
            this.selectionMode === TreeSelectionMode.MultiChildren)));

    const shouldModifyToCurrentSelection =
      e.detail.modifyCurrentSelection &&
      (this.selectionMode === TreeSelectionMode.Multi ||
        this.selectionMode === TreeSelectionMode.MultiChildren);

    const shouldSelectChildren =
      this.selectionMode === TreeSelectionMode.MultiChildren ||
      this.selectionMode === TreeSelectionMode.Children;

    const shouldClearCurrentSelection =
      !shouldModifyToCurrentSelection &&
      (((this.selectionMode === TreeSelectionMode.Single ||
        this.selectionMode === TreeSelectionMode.Multi) &&
        childItems.length <= 0) ||
        this.selectionMode === TreeSelectionMode.Children ||
        this.selectionMode === TreeSelectionMode.MultiChildren);

    const shouldExpandTarget =
      this.selectionMode === TreeSelectionMode.Children ||
      this.selectionMode === TreeSelectionMode.MultiChildren;

    if (!this.child) {
      const targetItems = [];

      if (shouldSelect) {
        targetItems.push(target);
      }

      if (shouldSelectChildren) {
        childItems.forEach((treeItem) => {
          targetItems.push(treeItem);
        });
      }

      if (shouldClearCurrentSelection) {
        const selectedItems = nodeListToArray(
          this.el.querySelectorAll("calcite-tree-item[selected]")
        ) as HTMLCalciteTreeItemElement[];

        selectedItems.forEach((treeItem) => {
          if (!targetItems.includes(treeItem)) {
            treeItem.selected = false;
          }
        });
      }

      if (shouldExpandTarget && !e.detail.forceToggle) {
        target.expanded = true;
      }

      if (shouldModifyToCurrentSelection) {
        window.getSelection().removeAllRanges();
      }

      if (
        (shouldModifyToCurrentSelection && target.selected) ||
        (shouldSelectChildren && e.detail.forceToggle)
      ) {
        targetItems.forEach((treeItem) => {
          treeItem.selected = false;
        });
      } else {
        targetItems.forEach((treeItem) => {
          treeItem.selected = true;
        });
      }
    }

    this.calciteTreeSelect.emit({
      selected: (
        nodeListToArray(
          this.el.querySelectorAll("calcite-tree-item")
        ) as HTMLCalciteTreeItemElement[]
      ).filter((i) => i.selected)
    });
  }

  updateAncestorTree(e: CustomEvent<TreeItemSelectDetail>): void {
    const item = e.target as HTMLCalciteTreeItemElement;
    const children = item.querySelectorAll("calcite-tree-item");
    const ancestors: HTMLCalciteTreeItemElement[] = [];
    let parent = item.parentElement.closest("calcite-tree-item");
    while (parent) {
      ancestors.push(parent);
      parent = parent.parentElement.closest("calcite-tree-item");
    }

    item.selected = !item.selected;
    item.indeterminate = false;
    if (children?.length) {
      children.forEach((el) => {
        el.selected = item.selected;
        el.indeterminate = false;
      });
    }

    if (ancestors) {
      ancestors.forEach((ancestor) => {
        const descendants = nodeListToArray(ancestor.querySelectorAll("calcite-tree-item"));
        const activeDescendants = descendants.filter((el) => el.selected);
        if (activeDescendants.length === 0) {
          ancestor.selected = false;
          ancestor.indeterminate = false;
          return;
        }
        const indeterminate = activeDescendants.length < descendants.length;
        ancestor.indeterminate = indeterminate;
        ancestor.selected = !indeterminate;
      });
    }

    this.calciteTreeSelect.emit({
      selected: (
        nodeListToArray(
          this.el.querySelectorAll("calcite-tree-item")
        ) as HTMLCalciteTreeItemElement[]
      ).filter((i) => i.selected)
    });
  }
  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Emitted when user selects/deselects tree items. An object including an array of selected items will be passed in the event's `detail` property.
   */
  @Event() calciteTreeSelect: EventEmitter<TreeSelectDetail>;

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  getRootTabIndex(): number {
    return !this.child ? 0 : -1;
  }
}
