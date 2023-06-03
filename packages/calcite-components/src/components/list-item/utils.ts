import { Build } from "@stencil/core";

const listItemGroupSelector = "calcite-list-item-group";
const listItemSelector = "calcite-list-item";

export function getListItemChildren(event: Event): HTMLCalciteListItemElement[] {
  const assignedElements = (event.target as HTMLSlotElement).assignedElements({ flatten: true });

  const listItemGroupChildren = (
    assignedElements.filter((el) => el?.matches(listItemGroupSelector)) as HTMLCalciteListItemGroupElement[]
  )
    .map((group) => Array.from(group.querySelectorAll(listItemSelector)))
    .reduce((previousValue, currentValue) => [...previousValue, ...currentValue], []);

  const listItemChildren = assignedElements.filter((el) =>
    el?.matches(listItemSelector)
  ) as HTMLCalciteListItemElement[];

  return [...listItemGroupChildren, ...listItemChildren];
}

export function updateListItemChildren(listItemChildren: HTMLCalciteListItemElement[]): void {
  listItemChildren.forEach((listItem) => {
    listItem.setPosition = listItemChildren.indexOf(listItem) + 1;
    listItem.setSize = listItemChildren.length;
  });
}

export function getDepth(element: HTMLElement, includeGroup = false): number {
  if (!Build.isBrowser) {
    return 0;
  }

  const expression = includeGroup
    ? "ancestor::calcite-list-item | ancestor::calcite-list-item-group"
    : "ancestor::calcite-list-item";

  const result = document.evaluate(expression, element, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

  return result.snapshotLength;
}
