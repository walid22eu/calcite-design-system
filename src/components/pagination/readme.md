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

| Property            | Attribute             | Description                                                     | Type                | Default              |
| ------------------- | --------------------- | --------------------------------------------------------------- | ------------------- | -------------------- |
| `num`               | `num`                 | number of items per page                                        | `number`            | `20`                 |
| `scale`             | `scale`               | The scale of the pagination                                     | `"l" \| "m" \| "s"` | `"m"`                |
| `start`             | `start`               | index of item that should begin the page                        | `number`            | `1`                  |
| `textLabelNext`     | `text-label-next`     | Used as an accessible label (aria-label) for the next button    | `string`            | `TEXT.nextLabel`     |
| `textLabelPrevious` | `text-label-previous` | Used as an accessible label (aria-label) of the previous button | `string`            | `TEXT.previousLabel` |
| `total`             | `total`               | total number of items                                           | `number`            | `0`                  |

## Events

| Event                     | Description                                                                                                                              | Type                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `calcitePaginationChange` | Emitted whenever the selected page changes.                                                                                              | `CustomEvent<CalcitePaginationDetail>` |
| `calcitePaginationUpdate` | <span style="color:red">**[DEPRECATED]**</span> use calcitePaginationChange instead<br/><br/>Emitted whenever the selected page changes. | `CustomEvent<CalcitePaginationDetail>` |

## Methods

### `nextPage() => Promise<void>`

Go to the next page of results

#### Returns

Type: `Promise<void>`

### `previousPage() => Promise<void>`

Go to the previous page of results

#### Returns

Type: `Promise<void>`

## CSS Custom Properties

| Name                           | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| `--calcite-pagination-spacing` | the amount of padding around each pagination item |

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
