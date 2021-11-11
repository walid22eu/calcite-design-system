# calcite-input-date-picker

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<div style="width: 400px">
  <calcite-label layout="inline">
    Date
    <calcite-input-date-picker
      min="2016-08-09"
      max="2023-12-18"
      locale="en"
      intl-next-month="Next month"
      intl-prev-month="Previous month"
      role="application"
      layout="horizontal"
    ></calcite-input-date-picker>
  </calcite-label>
</div>
```

## Properties

| Property                     | Attribute                      | Description                                                                                                                        | Type                         | Default                                   |
| ---------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------- |
| `active`                     | `active`                       | Expand or collapse when calendar does not have input                                                                               | `boolean`                    | `false`                                   |
| `disabled`                   | `disabled`                     | When false, the component won't be interactive.                                                                                    | `boolean`                    | `false`                                   |
| `end`                        | `end`                          | <span style="color:red">**[DEPRECATED]**</span> use value instead<br/><br/>Selected end date                                       | `string`                     | `undefined`                               |
| `endAsDate`                  | --                             | <span style="color:red">**[DEPRECATED]**</span> use valueAsDate instead<br/><br/>Selected end date as full date object             | `Date`                       | `undefined`                               |
| `headingLevel`               | `heading-level`                | Number at which section headings should start for this component.                                                                  | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `undefined`                               |
| `intlNextMonth`              | `intl-next-month`              | Localized string for "next month" (used for aria label)                                                                            | `string`                     | `TEXT.nextMonth`                          |
| `intlPrevMonth`              | `intl-prev-month`              | Localized string for "previous month" (used for aria label)                                                                        | `string`                     | `TEXT.prevMonth`                          |
| `layout`                     | `layout`                       | Layout                                                                                                                             | `"horizontal" \| "vertical"` | `"horizontal"`                            |
| `locale`                     | `locale`                       | BCP 47 language tag for desired language and country format                                                                        | `string`                     | `document.documentElement.lang \|\| "en"` |
| `max`                        | `max`                          | Latest allowed date ("yyyy-mm-dd")                                                                                                 | `string`                     | `undefined`                               |
| `maxAsDate`                  | --                             | Latest allowed date as full date object                                                                                            | `Date`                       | `undefined`                               |
| `min`                        | `min`                          | Earliest allowed date ("yyyy-mm-dd")                                                                                               | `string`                     | `undefined`                               |
| `minAsDate`                  | --                             | Earliest allowed date as full date object                                                                                          | `Date`                       | `undefined`                               |
| `name`                       | `name`                         | The picker's name. Gets submitted with the form.                                                                                   | `string`                     | `undefined`                               |
| `overlayPositioning`         | `overlay-positioning`          | Describes the type of positioning to use for the overlaid content. If your element is in a fixed container, use the 'fixed' value. | `"absolute" \| "fixed"`      | `"absolute"`                              |
| `proximitySelectionDisabled` | `proximity-selection-disabled` | Disables the default behaviour on the third click of narrowing or extending the range and instead starts a new range.              | `boolean`                    | `false`                                   |
| `range`                      | `range`                        | Range mode activation                                                                                                              | `boolean`                    | `false`                                   |
| `scale`                      | `scale`                        | specify the scale of the date picker                                                                                               | `"l" \| "m" \| "s"`          | `"m"`                                     |
| `start`                      | `start`                        | <span style="color:red">**[DEPRECATED]**</span> use value instead<br/><br/>Selected start date                                     | `string`                     | `undefined`                               |
| `startAsDate`                | --                             | <span style="color:red">**[DEPRECATED]**</span> use valueAsDate instead<br/><br/>Selected start date as full date object           | `Date`                       | `undefined`                               |
| `value`                      | `value`                        | Selected date                                                                                                                      | `string \| string[]`         | `undefined`                               |
| `valueAsDate`                | --                             | Selected date as full date object                                                                                                  | `Date \| Date[]`             | `undefined`                               |

## Events

| Event                          | Description                                                     | Type                           |
| ------------------------------ | --------------------------------------------------------------- | ------------------------------ |
| `calciteDatePickerChange`      | Trigger calcite date change when a user changes the date.       | `CustomEvent<Date>`            |
| `calciteDatePickerRangeChange` | Trigger calcite date change when a user changes the date range. | `CustomEvent<DateRangeChange>` |

## Methods

### `reposition() => Promise<void>`

Updates the position of the component.

#### Returns

Type: `Promise<void>`

### `setFocus() => Promise<void>`

Updates the position of the component.

#### Returns

Type: `Promise<void>`

## Dependencies

### Depends on

- [calcite-input](../calcite-input)
- [calcite-date-picker](../calcite-date-picker)
- [calcite-icon](../calcite-icon)

### Graph

```mermaid
graph TD;
  calcite-input-date-picker --> calcite-input
  calcite-input-date-picker --> calcite-date-picker
  calcite-input-date-picker --> calcite-icon
  calcite-input --> calcite-progress
  calcite-input --> calcite-icon
  calcite-date-picker --> calcite-date-picker-month-header
  calcite-date-picker --> calcite-date-picker-month
  calcite-date-picker-month-header --> calcite-icon
  calcite-date-picker-month --> calcite-date-picker-day
  style calcite-input-date-picker fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
