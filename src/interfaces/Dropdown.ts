export interface ItemRegistration {
  position: number;
}

export interface ItemKeyboardEvent {
  keyboardEvent: KeyboardEvent;
}

export interface GroupRegistration {
  items: HTMLCalciteDropdownItemElement[];
  position: number;
  groupId: string;
  titleEl: HTMLSpanElement;
}

export interface RegisteredItem {
  item: HTMLCalciteDropdownItemElement;
  position: number;
}
