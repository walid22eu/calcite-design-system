# calcite-pagination

`calcite-pagination` allows users to select a page from a paginated API.

<!-- Auto Generated Below -->

## Usage

### Basic

The component is meant to interface with responses from ArcGIS REST services, so the props share names with [response properties](https://developers.arcgis.com/rest/users-groups-and-items/search.htm) from various search endpoints.

For example, after querying the search API, you'll get back a response similar to JSON below. The response can be passed straight to the `calcite-pagination` component.

```JSON
{
  "total": 2021,
  "start": 1,
  "num": 100,
  "results": []
}
```

```html
<calcite-pagination start="1" num="100" total="2021"></calcite-pagination>
```

## Properties

| Property            | Attribute             | Description                                                                                                       | Type                                                                                                                                                                                                                                    | Default              |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `groupSeparator`    | `group-separator`     | When `true`, number values are displayed with a group separator corresponding to the language and country format. | `boolean`                                                                                                                                                                                                                               | `false`              |
| `num`               | `num`                 | Specifies the number of items per page.                                                                           | `number`                                                                                                                                                                                                                                | `20`                 |
| `numberingSystem`   | `numbering-system`    | Specifies the Unicode numeral system used by the component for localization.                                      | `"arab" \| "arabext" \| "bali" \| "beng" \| "deva" \| "fullwide" \| "gujr" \| "guru" \| "hanidec" \| "khmr" \| "knda" \| "laoo" \| "latn" \| "limb" \| "mlym" \| "mong" \| "mymr" \| "orya" \| "tamldec" \| "telu" \| "thai" \| "tibt"` | `undefined`          |
| `scale`             | `scale`               | Specifies the size of the component.                                                                              | `"l" \| "m" \| "s"`                                                                                                                                                                                                                     | `"m"`                |
| `start`             | `start`               | Specifies the starting item number.                                                                               | `number`                                                                                                                                                                                                                                | `1`                  |
| `textLabelNext`     | `text-label-next`     | Accessible name for the component's next button.                                                                  | `string`                                                                                                                                                                                                                                | `TEXT.nextLabel`     |
| `textLabelPrevious` | `text-label-previous` | Accessible name for the component's previous button.                                                              | `string`                                                                                                                                                                                                                                | `TEXT.previousLabel` |
| `total`             | `total`               | Specifies the total number of items.                                                                              | `number`                                                                                                                                                                                                                                | `0`                  |

## Events

| Event                     | Description                           | Type                            |
| ------------------------- | ------------------------------------- | ------------------------------- |
| `calcitePaginationChange` | Emits when the selected page changes. | `CustomEvent<PaginationDetail>` |

## Methods

### `nextPage() => Promise<void>`

Go to the next page of results.

#### Returns

Type: `Promise<void>`

### `previousPage() => Promise<void>`

Go to the previous page of results.

#### Returns

Type: `Promise<void>`

## CSS Custom Properties

| Name                           | Description                                        |
| ------------------------------ | -------------------------------------------------- |
| `--calcite-pagination-spacing` | The amount of padding around each pagination item. |

## Dependencies

### Depends on

- [calcite-icon](../icon)

### Graph

```mermaid
graph TD;
  calcite-pagination --> calcite-icon
  style calcite-pagination fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
