import { nodeListToArray } from "../../utils/dom";
import { ComboboxChildElement } from "./interfaces";
import { ComboboxChildSelector } from "./resources";

export function getAncestors(element: HTMLElement): ComboboxChildElement[] {
  const parent: ComboboxChildElement = element.parentElement?.closest(ComboboxChildSelector);
  const grandparent: ComboboxChildElement = parent?.parentElement?.closest(ComboboxChildSelector);
  return [parent, grandparent].filter((el) => el);
}

export function getItemAncestors(item: HTMLCalciteComboboxItemElement): HTMLCalciteComboboxItemElement[] {
  return (
    (item.ancestors?.filter((el) => el.nodeName === "CALCITE-COMBOBOX-ITEM") as HTMLCalciteComboboxItemElement[]) || []
  );
}

export function getItemChildren(item: HTMLCalciteComboboxItemElement): HTMLCalciteComboboxItemElement[] {
  return nodeListToArray(item.querySelectorAll("calcite-combobox-item"));
}

export function hasActiveChildren(node: HTMLCalciteComboboxItemElement): boolean {
  const items = nodeListToArray(node.querySelectorAll("calcite-combobox-item"));
  return items.filter((item) => item.selected).length > 0;
}

export function getDepth(element: HTMLElement): number {
  const [parent, grandparent] = getAncestors(element);
  if (!parent) {
    return 0;
  }
  if (!grandparent) {
    return 1;
  }
  return 2;
}
