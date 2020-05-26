# calcite-input

### Attributes

#### Custom attributes

`status` = [`idle`, `valid`, `invalid`] - defaults to `idle` - Allows setting a status that affects styling of input. This can also be explicitly set on a `calcite-input-message` component or on a wrapping `calcite-input`. Setting `status` on the `calcite-label` will propagate to any child `calcite-input` or `calcite-input-message` components

`loading` = boolean - defaults to `false`

`alignment` = [`start`/`end`] - defaults to `start` - specify the alignment of the value / placeholder inside the input. Useful for aligning numbers, etc.

`icon` = boolean / string - defaults to false. You can use "icon" to default to a recommended icon for that field type (will only work on `tel`, `email`, `password`, `search`, `date`, `time`). You can also pass a valid calcite ui icon string to set a custom icon. We recommend using "icon" / default icon on the above field types for consistency across apps.

`prefix-string` and `suffix-string` allow you position strings in a leading and trailing position.

#### Native attributes

In addition to custom attributes, you can pass any attribute to `<calcite-input>` you could to a native input element:

`autofocus` = [`true`/`false]`- defaults to`false`

`required` = [`true`/`false`] - defaults to `false`

`type` = [`text`/`textarea`/`number`/`file`/`tel`/`email`/`password`•/`search`] - defaults to `text`

- `textarea` type is available as a type of `calcite-input` because the structure and style of an input and a textarea are so similar - you can pass content to a textarea `<calcite-input type=textarea>text area content</div>` and value to an input `<calcite-input value=">`

- `number` type replaces browser "increment" and "decrement" arrows with custom replacements

- `file` type replaces browser "file" input with custom replacement

- `tel`, `email`, `password`, `search`, `date`, `time` types will add type-specific icons by default

### Slots

- a `calcite-action` slot is available for positioning a button next ot an input

### Events

#### Custom events

You can listen for the following custom events from emitted `<calcite-input>`:

All events return an element and a value:

```
  input.addEventListener("calciteInputChange", logChange);
  input.addEventListener("calciteInputFocus", logChange);
  input.addEventListener("calciteInputBlur", logChange);

  function logChange() {
      console.log(event.detail.element)
      console.log(event.detail.value)
  }
```

#### Native events

You can also listen for native events emitted from `<calcite-input>`:

You must use `focusin`/`focusout` instead of `focus`/`blur`because these events bubble up from the rendered child element rendered inside of `<calcite-input>`

All events return an element and a value:

```
  input.addEventListener(“change”, logChange);
  input.addEventListener(“focusin”, logFocus);
  input.addEventListener(“focusout”, logBlur);

    function logChange() {
      console.log(event.target.element)
      console.log(event.target.value)
  }
```

### Usage

#### Structure

##### Basic

```
<calcite-input value="Entered value" placeholder="My placeholder"></calcite-input>
```

##### With a label

It's recommended that you use a wrapping `calcite-label` component:

```
<calcite-label>
    My great label
    <calcite-input value="Entered value" placeholder="My placeholder"></calcite-input>
</calcite-label>
```

##### With a message

```
<calcite-label status="valid">
    My great label
    <calcite-input placeholder=“Enter your information”></calcite-input>
    <calcite-input-message active>Here’s something you should know about this input</calcite-input-message>
</calcite-label>
```

##### Label Usage

Using a wrapping `calcite-input` component lets consumers set the status attribute once and have it propagate to any child elements

```
<calcite-label>
    My great label
    <calcite-input status=“invalid” placeholder=“Enter your information”></calcite-input>
    <calcite-input-message status=“invalid” active>Here’s something you should know about this input</calcite-input-message>
</calcite-label>
```

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute            | Description                                                         | Type                                                                                                                                                                                   | Default      |
| ------------------ | -------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `alignment`        | `alignment`          | specify the alignment of the value of the input                     | `"end" \| "start"`                                                                                                                                                                     | `"start"`    |
| `autofocus`        | `autofocus`          | should the input autofocus                                          | `boolean`                                                                                                                                                                              | `false`      |
| `icon`             | `icon`               | for recognized input types, show an icon if applicable              | `boolean \| string`                                                                                                                                                                    | `false`      |
| `loading`          | `loading`            | specify if the input is in loading state                            | `boolean`                                                                                                                                                                              | `false`      |
| `max`              | `max`                | input max                                                           | `string`                                                                                                                                                                               | `""`         |
| `min`              | `min`                | input min                                                           | `string`                                                                                                                                                                               | `""`         |
| `numberButtonType` | `number-button-type` | specify the placement of the number buttons                         | `"horizontal" \| "none" \| "vertical"`                                                                                                                                                 | `"vertical"` |
| `placeholder`      | `placeholder`        | explicitly whitelist placeholder attribute                          | `string`                                                                                                                                                                               | `undefined`  |
| `prefixText`       | `prefix-text`        | optionally add prefix \*                                            | `string`                                                                                                                                                                               | `undefined`  |
| `required`         | `required`           | is the input required                                               | `boolean`                                                                                                                                                                              | `false`      |
| `scale`            | `scale`              | specify the scale of the input, defaults to m                       | `"l" \| "m" \| "s"`                                                                                                                                                                    | `undefined`  |
| `status`           | `status`             | specify the status of the input field, determines message and icons | `"idle" \| "invalid" \| "valid"`                                                                                                                                                       | `undefined`  |
| `step`             | `step`               | input step                                                          | `string`                                                                                                                                                                               | `""`         |
| `suffixText`       | `suffix-text`        | optionally add suffix \*                                            | `string`                                                                                                                                                                               | `undefined`  |
| `theme`            | `theme`              | specify the alignment of dropdown, defaults to left                 | `"dark" \| "light"`                                                                                                                                                                    | `undefined`  |
| `type`             | `type`               | specify the input type                                              | `"color" \| "date" \| "datetime-local" \| "email" \| "file" \| "image" \| "month" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "textarea" \| "time" \| "url" \| "week"` | `"text"`     |
| `value`            | `value`              | input value                                                         | `string`                                                                                                                                                                               | `""`         |

## Events

| Event               | Description | Type               |
| ------------------- | ----------- | ------------------ |
| `calciteInputBlur`  |             | `CustomEvent<any>` |
| `calciteInputFocus` |             | `CustomEvent<any>` |
| `calciteInputInput` |             | `CustomEvent<any>` |

## Methods

### `setFocus() => Promise<void>`

focus the rendered child element

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [calcite-date](../calcite-date)

### Depends on

- [calcite-progress](../calcite-progress)
- [calcite-icon](../calcite-icon)

### Graph

```mermaid
graph TD;
  calcite-input --> calcite-progress
  calcite-input --> calcite-icon
  calcite-date --> calcite-input
  style calcite-input fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
