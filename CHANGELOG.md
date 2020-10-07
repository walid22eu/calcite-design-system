# Changelog

This document maintains a list of released versions and changes introduced by them.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [1.0.0-beta.41](https://github.com/Esri/calcite-components/compare/v1.0.0-beta.40...v1.0.0-beta.41) (2020-10-05)

### ⚠ BREAKING CHANGES

- dropping prop validation helps keep components lean and should not be necessary with existing component documentation and typings.

### Features

- **calcite-radio-button-group:** calciteRadioButtonGroup change event ([#1056](https://github.com/Esri/calcite-components/issues/1056)) ([662173d](https://github.com/Esri/calcite-components/commit/662173d78b38210b971d22cf45614e0fb97ca3d2))
- **date:** add full localization support ([#585](https://github.com/Esri/calcite-components/issues/585), [#979](https://github.com/Esri/calcite-components/issues/979)) ([#1043](https://github.com/Esri/calcite-components/issues/1043)) ([4c95292](https://github.com/Esri/calcite-components/commit/4c95292dc336f2fbd041964fd61521acda53f528))
- **date:** respect order of year and month in date-header ([#908](https://github.com/Esri/calcite-components/issues/908)) ([#1046](https://github.com/Esri/calcite-components/issues/1046)) ([18ffe9a](https://github.com/Esri/calcite-components/commit/18ffe9aea6eea5dcab466f95d1bd5ecd455a1fe4))
- **dom:** allow prop lookup to go beyond shadow boundary ([#982](https://github.com/Esri/calcite-components/issues/982)) ([51b2f8e](https://github.com/Esri/calcite-components/commit/51b2f8eb38bccbc618067a9882e91171c63bf1cd))
- **dropdown:** Update styling of dropdown groups ([#1024](https://github.com/Esri/calcite-components/issues/1024)) ([eb08309](https://github.com/Esri/calcite-components/commit/eb08309e1a2e81be0aba61bbd88cddc9f2baf95b))

### Bug Fixes

- **calcite-radio-button, calcite-checkbox:** no longer fires custom change event when the checked attribute is controlled ([#1019](https://github.com/Esri/calcite-components/issues/1019)) ([3fabd6d](https://github.com/Esri/calcite-components/commit/3fabd6d7b68e0e7acb18feb39729ee546a57c216))
- **color:** initial user-defined value gets set properly ([#1038](https://github.com/Esri/calcite-components/issues/1038)) ([0482868](https://github.com/Esri/calcite-components/commit/0482868d548f40f68ae02eb4a5e333fcd7d12443))
- **date:** allow 3 digit years in input [#905](https://github.com/Esri/calcite-components/issues/905) ([#1047](https://github.com/Esri/calcite-components/issues/1047)) ([8c7717c](https://github.com/Esri/calcite-components/commit/8c7717cdb59b2367a609f9afdb806cb4795c9ada))
- **date:** don't fire event on outside value update ([#722](https://github.com/Esri/calcite-components/issues/722)) ([#1053](https://github.com/Esri/calcite-components/issues/1053)) ([3b7912a](https://github.com/Esri/calcite-components/commit/3b7912a2641c5be66c7323562d705946b36496f9))
- **date:** fire date change on interactions with calcite-date-hmonth-header element ([#1017](https://github.com/Esri/calcite-components/issues/1017)) ([#1048](https://github.com/Esri/calcite-components/issues/1048)) ([df380eb](https://github.com/Esri/calcite-components/commit/df380eb789b37c95012e8360a565db39dc9ca871))
- **date:** fix display of year in languages with year unit - ja,ko,ch ([#907](https://github.com/Esri/calcite-components/issues/907)) ([#1045](https://github.com/Esri/calcite-components/issues/1045)) ([7f233c0](https://github.com/Esri/calcite-components/commit/7f233c0a81344d70501c9aea047832de0896898a))
- **pagination:** prev/next disabled, page 1 shown ([#1030](https://github.com/Esri/calcite-components/issues/1030)) ([8f17589](https://github.com/Esri/calcite-components/commit/8f17589ebbe5fdd410996af14530247271d845bc))
- **shell-panel:** fixes height styling for panel and flow in undetached shell-panel ([#1028](https://github.com/Esri/calcite-components/issues/1028)) ([16c01a5](https://github.com/Esri/calcite-components/commit/16c01a5cdd8ff1bb6b20d82477dd1a35473e551f))

- drop prop validation in favor of documentation and types ([#954](https://github.com/Esri/calcite-components/issues/954)) ([3986771](https://github.com/Esri/calcite-components/commit/3986771b7c2a232bdd13879bfd2f0b9db3960179)), closes [#637](https://github.com/Esri/calcite-components/issues/637)

## [1.0.0-beta.40](https://github.com/Esri/calcite-components/compare/v1.0.0-beta.39...v1.0.0-beta.40) (2020-09-23)

### Bug Fixes

- **calcite-radio-button:** fixing issue where input isn't properly initialized in some cases ([#1011](https://github.com/Esri/calcite-components/issues/1011)) ([2f59ea6](https://github.com/Esri/calcite-components/commit/2f59ea6dfab845b922560182bfede49fb643cd9b))
- **dropdown:** Adjust display of slotted full width buttons ([#1013](https://github.com/Esri/calcite-components/issues/1013)) ([407ef02](https://github.com/Esri/calcite-components/commit/407ef02cf2e7ba9434f04395adee44fcd567b4ce))

## [1.0.0-beta.39](https://github.com/Esri/calcite-components/compare/v1.0.0-beta.38...v1.0.0-beta.39) (2020-09-17)

### Features

- **label:** Adjust spacing ([#956](https://github.com/Esri/calcite-components/issues/956)) ([5483740](https://github.com/Esri/calcite-components/commit/5483740c6dc0956c0bfb49b9b2f52e046b7937c9))

### Bug Fixes

- **calcite-checkbox:** visibility of hidden input controlled by inline styles to prevent outside CSS from affecting its display ([#999](https://github.com/Esri/calcite-components/issues/999)) ([e1e31bc](https://github.com/Esri/calcite-components/commit/e1e31bc4dbbbde3221b8c7da4419ee072acd408d))
- **color:** ensure color object values are rounded ([#883](https://github.com/Esri/calcite-components/issues/883)) ([ce9fd18](https://github.com/Esri/calcite-components/commit/ce9fd187933c901eb23c99fa32437ddbc657aa71))
- **dropdown:** fix item selection when dropdown is in a shadow DOM context ([#995](https://github.com/Esri/calcite-components/issues/995)) ([bc0308a](https://github.com/Esri/calcite-components/commit/bc0308ae0398a1664ce7b279d909f096d516de36)), closes [#992](https://github.com/Esri/calcite-components/issues/992)
- **tooltip:** Add a11y improvements for hovering over a tooltip ([#987](https://github.com/Esri/calcite-components/issues/987)) ([943bd86](https://github.com/Esri/calcite-components/commit/943bd86a625b39d356d6d401f798101ad2374aca)), closes [#938](https://github.com/Esri/calcite-components/issues/938)
- **tooltip:** Keep tooltip visible if focus occurs after hover [#938](https://github.com/Esri/calcite-components/issues/938) ([#1005](https://github.com/Esri/calcite-components/issues/1005)) ([94ed432](https://github.com/Esri/calcite-components/commit/94ed432f2a22e739d841c90c10d5988e4d4e9e4a))

## [1.0.0-beta.38](https://github.com/Esri/calcite-components/compare/v1.0.0-beta.37...v1.0.0-beta.38) (2020-09-04)

### Features

- **calcite-label:** adds disable-spacing property also updates label-text spacing ([2cca2c6](https://github.com/Esri/calcite-components/commit/2cca2c6f2cf215240841df9b1c135cbf1de33e3c)), closes [#916](https://github.com/Esri/calcite-components/issues/916) [#916](https://github.com/Esri/calcite-components/issues/916)
- **label:** Adds disabled prop to label, radio-group ([#923](https://github.com/Esri/calcite-components/issues/923)) ([cc34b51](https://github.com/Esri/calcite-components/commit/cc34b51914d100b68d529b81bf39faee4c1b7b93))
- **label:** Updates alignment and spacing ([#914](https://github.com/Esri/calcite-components/issues/914)) ([943e5c2](https://github.com/Esri/calcite-components/commit/943e5c2318fd9ba2661e55ef712c7e2788aa9a09))
- **split-button:** add secondary click event ([#889](https://github.com/Esri/calcite-components/issues/889)) ([bb3b141](https://github.com/Esri/calcite-components/commit/bb3b141336c855a418b6cdcc53e807c87714946d))
- **tabs:** add tab-title disabled state ([#879](https://github.com/Esri/calcite-components/issues/879)) ([adef10f](https://github.com/Esri/calcite-components/commit/adef10f5c0f341f3b6198ffafa587ed1f649ecf1))

### Bug Fixes

- **dropdown:** fix tab through ([#880](https://github.com/Esri/calcite-components/issues/880)) ([acbef6f](https://github.com/Esri/calcite-components/commit/acbef6f47726d5cc8dd28f385b84126deb90304d))
- **input:** emit calcite input input on up and down click on number input [#886](https://github.com/Esri/calcite-components/issues/886) ([#888](https://github.com/Esri/calcite-components/issues/888)) ([01a140b](https://github.com/Esri/calcite-components/commit/01a140bbe89e4208e2be6f889891633c12ccc826))
- **input:** No longer set clearable by default on type date or time ([#895](https://github.com/Esri/calcite-components/issues/895)) ([d5d9d6a](https://github.com/Esri/calcite-components/commit/d5d9d6a0fb620c69e329ca4454bd30311e5bf007))
- **tree:** change tabindex to 0 to prevent forced first tab stop on page ([#911](https://github.com/Esri/calcite-components/issues/911)) ([ef4a7ad](https://github.com/Esri/calcite-components/commit/ef4a7adfc7572411717d77f6240497f095730362)), closes [#634](https://github.com/Esri/calcite-components/issues/634)

## [1.0.0-beta.37](https://github.com/Esri/calcite-components/compare/v1.0.0-beta.36...v1.0.0-beta.37) (2020-08-19)

### Features

- **calcite-checkbox:** label support ([#849](https://github.com/Esri/calcite-components/issues/849)) ([30db0f3](https://github.com/Esri/calcite-components/commit/30db0f3829a71646aef4b19e11458076116d94e5))
- **color:** allow hiding sections ([#841](https://github.com/Esri/calcite-components/issues/841)) ([f31fbb3](https://github.com/Esri/calcite-components/commit/f31fbb384dd402f8f5736ef246be14afd27c3e39)), closes [#763](https://github.com/Esri/calcite-components/issues/763)
- **input:** Update default icon of input type email ([#865](https://github.com/Esri/calcite-components/issues/865)) ([be42e9e](https://github.com/Esri/calcite-components/commit/be42e9e968ff46d057e99be4522565edd9b0af8a))
- **switch:** add disabled prop ([#856](https://github.com/Esri/calcite-components/issues/856)) ([d00cb5e](https://github.com/Esri/calcite-components/commit/d00cb5e7e3e854b34c563cac6e04bc4dd868dfe8))
- **tabs:** Add support for content positioning (tabs can now be positioned `above` (default) or `below` the tab content with the `position` prop) ([#809](https://github.com/Esri/calcite-components/issues/809)) ([3b0fc79](https://github.com/Esri/calcite-components/commit/3b0fc79e8a1707632edac8309f4124766bdbfc97))
- **tabs:** Add support for icons in tab-title (now supports icons: `icon-start` and `icon-end` props have been added for explicit positioning of up to two icons.) ([#807](https://github.com/Esri/calcite-components/issues/807)) ([5afc650](https://github.com/Esri/calcite-components/commit/5afc650cc4ed255da1f5c032c9e4e913493a432a))
- **tooltip:** Dismiss calcite-tooltip via ESC key [#877](https://github.com/Esri/calcite-components/issues/877) ([#878](https://github.com/Esri/calcite-components/issues/878)) ([5b2262e](https://github.com/Esri/calcite-components/commit/5b2262e520ced633c32450b9be887213b597a84c))

### Bug Fixes

- **calcite-checkbox:** cleaning up hidden input when checkbox is unmo… ([#813](https://github.com/Esri/calcite-components/issues/813)) ([2bc35e8](https://github.com/Esri/calcite-components/commit/2bc35e8022f9295c190e99381b2a490e8152e0fc))
- **calcite-icon:** Fixing issue where calcite-icon being rendered in a flex container wasn't sizing properly or not appearing at all. ([#805](https://github.com/Esri/calcite-components/issues/805)) ([2b1c528](https://github.com/Esri/calcite-components/commit/2b1c528dfdbe51c150923d896f80de67ecbe9367))
- **calcite-radio-button:** removing css class on host element ([#854](https://github.com/Esri/calcite-components/issues/854)) ([831b9f4](https://github.com/Esri/calcite-components/commit/831b9f4867442776244320949740a0f525ec7f8d))
- **color:** ensure color change event is emitted when color is modified via API or interaction ([#881](https://github.com/Esri/calcite-components/issues/881)) ([13d796f](https://github.com/Esri/calcite-components/commit/13d796f16ca03de539fa6c0b5e371288d7c19c20)), closes [#822](https://github.com/Esri/calcite-components/issues/822)
- **input:** Removed calciteInputInput event on componentWillUpdate ([#830](https://github.com/Esri/calcite-components/issues/830)) ([10ccd62](https://github.com/Esri/calcite-components/commit/10ccd62aea6b4b0e21f60c45acf53e7009e86617))
- **loader:** ensure fallback id for loaders is generated properly ([#836](https://github.com/Esri/calcite-components/issues/836)) ([9136777](https://github.com/Esri/calcite-components/commit/9136777a5348581c485b4cd47fa234ef837c5891))
- **pagination:** prevent page one rendering twice when total is smaller than num ([#835](https://github.com/Esri/calcite-components/issues/835)) ([bbc74a0](https://github.com/Esri/calcite-components/commit/bbc74a037b2be4df5487604e102d9ccaea94cd02))
- **storybook:** fix split button storybook ([#794](https://github.com/Esri/calcite-components/issues/794)) ([da8f90a](https://github.com/Esri/calcite-components/commit/da8f90abdda9cf7cfd6a01dafc24a9f3c341c75b))
- **storybook:** fix stepper storybook ([#793](https://github.com/Esri/calcite-components/issues/793)) ([685cea1](https://github.com/Esri/calcite-components/commit/685cea129402583d1d504c7433d6c8bb8a8d57b0))
- **tabs:** ensure proper ARIA roles ([#832](https://github.com/Esri/calcite-components/issues/832)) ([12467a7](https://github.com/Esri/calcite-components/commit/12467a7de4ac57050cdc5c9630a62c2ba7fe98e2)), closes [#831](https://github.com/Esri/calcite-components/issues/831)

## [v1.0.0-beta.36]

### Added

- Added custom element bundle for tree-shaking bundlers like rollup
- `calcite-color` - new `appearance` prop to support embedded use case (#750)

### Fixes

- `calcite-dropdown` - fix regression where multiple triggers didn't work (#774)

## [v1.0.0-beta.35]

### Fixes

- Added `@types/color` as a dependency, so public types resolve properly

## [v1.0.0-beta.34]

### Added

- New component `calcite-color`
- New component `calcite-color-hex-input`
- New component `calcite-color-swatch`
- `calcite-dropdown` - restore support for multiple triggers

### Fixes

- `calcite-modal` - fix styling for modal when there are no footer buttons
- `calcite-popover` - prevent tooltip-manager selector conflicting with popover-manager selector
- `calcite-tabs` - uses proper `aria-labelledby` attribute

## [v1.0.0-beta.33]

### Breaking Changes

- `calcite-alert` - `open` and `close` methods have been removed. You can use the `active` prop to open or add an alert to the queue.
- `calcite-alert` - `currentAlert` prop has been removed
- `calcite-alert` - `alertQueue` prop has been removed (`queue` is emitted as a detail of the `calciteAlertOpen` and `calciteAlertClose` events)
- `calcite-alert` - `alertQueueLength` prop has been removed

### Fixes

- `calcite-modal` - turn off pointer events on hidden modals to prevent interaction (#549)

### Added

- `calcite-modal` - add `background-color` property for light grey backgrounds (#527)
- `calcite-alert` - `intlClose` prop has been added to optionally provide a translated override of the English "close" text

## [v1.0.0-beta.32]

- `calcite-stepper` - `calciteStepperItemHasChanged` event has been renamed to `calciteStepperItemChange`
- `calcite-stepper-item` - `calciteStepperItemSelected` event has been renamed to `calciteStepperItemSelect`
- `calcite-stepper-item` - `registerCalciteStepperItem` event has been renamed to `calciteStepperItemRegister`

### Breaking Changes

- `calcite-modal` - `close-label` prop is now renamed to `intl-close` for consistency (#466)
- `calcite-modal` - `open` and `close` methods removed in favor of `active` prop (#466)
- `calcite-modal` - `size => width`, which can be passed standard (s/m/l) or custom width in px (#239)
- `calcite-modal` - `fullscreen` made it's own prop (#466)
- `calcite-modal` - new `scale` prop for setting UI scale of modal (#466);
- `calcite-date` - `prevMonthLabel` and `nextMonthLabel` updated to `intlPrevMonth` and `intlNextMonth` (#97)
- `calcite-switch` - `switched` boolean has been added to `calciteSwitchChange` event detail

## [v1.0.0-beta.31]

### Breaking Changes

- `calcite-label` - `calciteLabelSelectedEvent` event has been renamed to `calciteLabelFocus`
- `calcite-button` - `icon-position` and `icon` props have been removed - you can now use `icon-start` and `icon-end` props to position up to two icons.
- `calcite-link` - `icon-position` and `icon` props have been removed - you can now use `icon-start` and `icon-end` props to position up to two icons.
- `calcite-split-button` - `primary-icon` prop has been removed - you can now use `primary-icon-start` and `primary-icon-end` props to position up to two icons.
- `calcite-tab` - `isActive` prop is now `active` to be consistent with other components
- `calcite-tab-title` - `isActive` prop is now `active` to be consistent with other components
- `calcite-loader` - `isActive` prop is now `active` to be consistent with other components
- `calcite-popover` `textClose` has been changed to `intlClose`.
- `calcite-card` - event name change `calciteCardSelected => calciteCardSelect` (#459)

### Added

- Generate new types for using components inside a Preact + TypeScript
- `calcite-loader` - add `scale` for both standard and inline loaders (#465)
- `calcite-dropdown` now has a `disable-close-on-select` attribute that allows dropdowns to remain open on selection when `calcite-dropdown-group` `selection-mode` is set to `single` or `multi`
- `calcite-dropdown` now emits `calciteDropdownClose` when it closes.
- `calcite-dropdown` now emits `calciteDropdownOpen` when it opens.
- `calcite-dropdown` now has a `disabled` prop.
- `calcite-input` - adds `clearable` prop to display a clear button when field has a value - this also enables clearing of value while focused and using `Escape` key.
- `calcite-input` - adds `disabled` prop
- `calcite-button` - `icon-start` and `icon-end` props have been added for explicit positioning of up to two icons.
- `calcite-link` - `icon-start` and `icon-end` props have been added for explicit positioning of up to two icons.
- `calcite-split-button` - `primary-icon-start` and `primary-icon-end` props have been added for explicit positioning of up to two icons.
- `calcite-split-button` - `dropdown-icon-type` prop now accepts an `overflow` value for an additional icon option.
- `calcite-notice` now has a `intl-close` attribute that allows the title of the close button to be set. It defaults to the English "Close".
- `calcite-modal` - added `disable-close-button` prop for hiding X (#669)
- `calcite-popover` - added `disable-close-button` prop for hiding X (#669)

### Fixed

- `calcite-dropdown` - will now correctly focus the slotted `dropdown-trigger` element when the dropdown is closed
- `calcite-input` - fixes inconsistencies in height of inputs with various configurations
- `calcite-label` - fixes inconsistencies in `layout=inline` padding applications
- `calcite-slider` - fixes positioning of handles and labels, better focus styles (#660)
- `calcite-split-button` - fixed split button triggering of dropdown
- `calcite-tab-title` - improve focus state

### Updated

- `calcite-dropdown` - a dropdown will now close if another dropdown is opened
- `calcite-dropdown` - mouse clicks on `calcite-dropdown-group` titles will no longer close the dropdown
- `calcite-slider` - improved `disabled` styles (#676)

## [v1.0.0-beta.30] - June 12th 2020

### Fixed

- fix NPM release issue

## [v1.0.0-beta.29] - June 12th 2020

### Fixed

- fix NPM release issue

## [v1.0.0-beta.28] - June 11th 2020

### Breaking Changes

- `calcite-accordion` - `calciteAccordionItemHasChanged` event has been renamed to `calciteAccordionChange`
- `calcite-accordion-item` - `calciteAccordionItemSelected` event has been renamed to `calciteAccordionItemSelect`
- `calcite-accordion-item` - `closeCalciteAccordionItem` event has been renamed to `calciteAccordionItemClose`
- `calcite-accordion-item` - `registerCalciteAccordionItem` event has been renamed to `calciteAccordionItemRegister`
- `calcite-dropdown-group` - `registerCalciteItemHasChanged` event has been renamed to `calciteDropdownItemChange`
- `calcite-dropdown-group` - `registerCalciteDropdownGroup` event has been renamed to `calciteDropdownGroupRegister`
- `calcite-dropdown-item` - `registerCalciteDropdownItem` event has been renamed to `calciteDropdownItemRegister`
- `calcite-dropdown-item` - `calciteDropdownItemSelected` event has been renamed to `calciteDropdownItemSelect` and is now internal.
- `calcite-dropdown-item` - `closeCalciteDropdown` event has been renamed to `calciteDropdownClose`

### Added

- `calcite-dropdown` now has a read-only `selectedItems` prop that contains all selected items.
- `calcite-dropdown` now emits `calciteDropdownSelect` when an item selection changes.

### Fixed

- `calcite-accordion` - Fix for incorrect keyboard navigation behavior when a `calcite-accordion` was nested inside another `calcite-accordion`
- `calcite-accordion` - Fix for incorrect display of `icon-position` when a `calcite-accordion` was nested inside another `calcite-accordion`

### Updated

- `calcite-popover` - `max-width` has been removed. Content may need width set.

## [v1.0.0-beta.27] - May 26th 2020

### Breaking Changes

- `calcite-input` - `calciteInputChange` event has been renamed to `calciteInputInput`

### Added

- `calcite-radio-group` now has a `width` prop that accepts `auto` (default) or `full` values.

### Fixed

- `calcite-input` - will now properly position a requested `icon` if `prefix-text` is also set
- `calcite-switch` - will now properly display in RTL
- `calcite-alert` - will now properly animate the direction of the auto-dismiss progress bar in RTL
- `calcite-tree` - will now properly wrap long, unbroken strings in `calcite-tree-item` children

### Updated

- `calcite-accordion` - styling of `icon-position=end` icons has been updated for `chevron` and `caret` values - it will now display upward when a `calcite-accordion-item` is collapsed, and downward when expanded
- `calcite-input` - when `status="valid"`, icon (if present) will appear green

## [v1.0.0-beta.26] - May 18th 2020

### Breaking Changes

- `calcite-checkbox` - `size` prop is now `scale` to be consistent with other components
- `calcite-chip` - will not show the dismiss ("x") button unless new `dismissible` prop is `true`
- `calcite-button` - will no longer accept `xs` or `xl` values for `scale` prop
- `calcite-chip` - will no longer accept `xs` or `xl` values for `scale`
- `calcite-combobox` - will no longer accept `xs` or `xl` values for `scale`

### Added

- `calcite-radio-group-item` can now display an icon by passing a Calcite UI Icon name to the `icon` attribute. The icon can be positioned with the `icon-position` attribute.
- `calcite-split-button` now accepts `ellipsis` as a value for the `dropdown-icon-type` attribute
- `calcite-graph` component for simple area graphs from series data sets
- `calcite-chip` - now has a `color` prop that will accept `grey` (default), `blue`, `red`, `yellow`, and `green` as values
- `calcite-chip` - now has an `appearance` prop that will accept `solid` (default) and `clear` as values

### Fixed

- `calcite-dropdown` - will now properly open and close when children of the `dropdown-trigger` slot are acted on.
- `calcite-button` - now trims whitespace to accurately display "icon only" buttons as squares.
- `:root` styles now include some text rendering improvements
- `calcite-input` - fixed missing icons in firefox
- `calcite-date` - fixed small margin/gap above input

### Updated

- `calcite-button` - styling of `appearance=transparent` buttons has been updated
- `calcite-button` - dimensions and font-size of buttons have been updated

## [v1.0.0-beta.25] - Apr 28th 2020

### Breaking Changes

- `calcite-button` no longer accepts `inline` as a value for `appearance` - you can instead use the new `calcite-link` component
- `calcite-pagination` - `backgroundStyle` property removed (always transparent)
- `calcite-pagination` - `num`, `start`, and `total` now refer to records not pages
- `calcite-pagination` - `calcitePaginationUpdate` event now only fires in response to user input
- `calcite-pagination` - `setPage` method removed
- `calcite-date` - `show-calendar` prop changed to `active`

### Added

- new component `calcite-link`
- new `calcite-label`, `calcite-input`, and `calcite-input-message` components
- `calcite-slider` can now be programmatically focused with the `setFocus()` method
- `calcite-date` now has `scale` prop for small, medium, and large
- `calcite-radio-group` now has an `appearance` prop that accepts `outline` or `solid` (default) values
- `calcite-radio-group` now has a `layout` prop that accepts `vertical` or `horizontal` (default) values
- `calcite-input` can now be programmatically focused with the `setFocus()` method
- `calcite-pagination` now has a `scale` prop that accepts `s`, `m` (default), or `l` values
- `calcite-accordion-item` can now display an icon by passing a Calcite UI Icon name to the `icon` attribute

### Fixed

- `calcite-pagination` - pages and next/previous can now be navigated with keyboard
- `calcite-icon` - fixed use of kebab case in filled icon variants (#494)

## [v1.0.0-beta.24] - Apr 8th 2020

### Fixed

- fix NPM release issue

## [v1.0.0-beta.23] - Apr 7th 2020

### Breaking Changes

- `calcite-icon` - `filled` prop removed (use `F` at end of icon name)

### Added

- Support for icons which use multiple paths + opacity

## [v1.0.0-beta.22] - Apr 3rd 2020

### Breaking Changes

- `calcite-date-picker` is now `calcite-date`
- `calcite-date` no longer accepts start of week as a prop

### Added

- new component `calcite-stepper`
- new component `calcite-split-button`
- improved focus styles across all components
- a `max-items` attribute has been added to `calcite-dropdown` (#396)

### Updated

- `calcite-date` - automatically finds start of week for given locale
- `calcite-date` - automatically formats date in input for given locale
- `calcite-date` - support for buddhist era
- `calcite-date` - support for arabic numerals
- `calcite-date` - `calciteDateChange` emits selected `Date` object in `event.detail`

### Fixed

- `calcite-date` - fixed in ie11 (#368)
- `calcite-date` - fixed date entering via input (#307)
- `calcite-date` - columns correct even when very narrow (#308)
- `calcite-icon` - always render in target size to prevent shifting layout (#432)
- `calcite-accordion` - fixed in ie11 (#366)
- `calcite-dropdown` - fixed in ie11 (#369)

## [v1.0.0-beta.21] - Mar 31st 2020

### Added

- new `calcite-combobox` component (#328)
- new `calcite-chip` component (#328)
- new `calcite-popover-manager` component (#411)
- new `calcite-tooltip-manager` component (#411)
- `calcite-radio-group` - added `setFocus()` method

### Breaking Changes

- `calcite-dropdown` - `alignment` attribute now uses `start` and `end` values instead of `left` and `right`
- `calcite-dropdown-item` - `link-title` attribute has been removed
- `calcite-icon` - drop `filled` prop as it's no longer valid with the latest calcite UI icons
- `calcite-tree` - `size` prop is now `scale` to be consistent with other components

### Updated

- `calcite-dropdown` - active state indicators for `selection-mode=none` have been removed
- `calcite-dropdown` - active state indicators for `selection-mode=multi` have been updated to use checkmarks
- `calcite-dropdown-item` - any attributes passed to a `calcite-dropdown-item` that has a `href` attribute will now be spread to the rendered child link
- `calcite-icon` - SVG no longer rendered when icon fails to load
- `calcite-loader` - now displays as circle, added fade out at the end of determinate loader

### Fixed

- `calcite-dropdown` - `alignment=center` now correctly positions the dropdown if the slotted `dropdown-trigger` is wider than the dropdown container
- `calcite-dropdown` - items are now focused when the dropdown is opened
- `calcite-dropdown` - items are now scrollable when the dropdown gets long
- `calcite-icon` - update rendering when `scale` changes
- `calcite-icon` - fixed in ie11
- `calcite-loader` - fixed in ie11
- `calcite-radio-group` - fixed in ie11
- `calcite-progress` - fixed in ie11
- `calcite-modal` - fixed in ie11
- `calcite-slider` - fixed in ie11
- `calcite-tabs` - tabs occupy full height
- `calcite-tree-item` - fixed in ie11
- `calcite-tree` - fixed in ie11

## [v1.0.0-beta.20] - Feb 25th 2020

### Added

- new component `calcite-card`

### Updated

- `calcite-tooltip`, `calcite-popover` - Allow pointer events for poppers that have escaped their container

## [v1.0.0-beta.19] - Feb 19th 2020

### Added

- `calcite-dropdown-item` can now display icons by passing a Calcite UI Icon name(s) to the `icon-start` and / or `icon-end` attribute
- `calcite-dropdown` now has a `width` attribute which accept a value of "s", "m", or "l", and defaults to "m"

### Breaking Changes

- `calcite-button` no longer accepts path data passed to the `icon` attribute - instead you can now pass a Calcite UI Icon name.
- `calcite-popover` and `calcite-tooltip` - Removed property `boundariesElement`. It is no longer necessary with the latest version of [Popper](https://popper.js.org).
- `calcite-popover` - Removed property `flowInner`. Is no longer supported with the latest version of [Popper](https://popper.js.org). A user can use negative offset values instead.
- `calcite-popover` - Renamed property `xOffset` to `offsetDistance` to better match [popper API](https://popper.js.org/docs/v2/modifiers/offset/). The property now has a default of '6'.
- `calcite-popover` - Renamed property `yOffset` to `offsetSkidding` to better match [popper API](https://popper.js.org/docs/v2/modifiers/offset/).

### Fixed

- `calcite-popover` - Fixed an issue with background color on the close button.
- Addressed RTL inconsistencies for `calcite-accordion`, `calcite-alert`, and `calcite-notice`

## [v1.0.0-beta.18] - Feb 3rd 2020

### Fixed

- `calcite-icon` - fixed issue where icon would not load its icon data. #314
- `calcite-tree` - long strings inside calcite-tree-item no longer overflow from calcite-tree.

## [v1.0.0-beta.17] - Jan 22nd 2020

### Breaking Changes

- `calcite-progress` no longer accepts slotted content

### Added

- new `calcite-pagination` component (#281)
- `calcite-accordion` now accepts `transparent` as an `appearance` attribute value
- `calcite-accordion` now accepts an `icon-type` attribute to specify icon type - "chevron" (default), "caret" or "plus-minus"
- `calcite-accordion-item` now accepts an `item-subtitle` attribute to display beneath `item-title`
- `setFocus()` added to `calcite-alert` - focuses a slotted link or a close button, if present
- `calcite-loader` now accepts a `no-padding` boolean attribute
- `calcitePopoverClose` and `calcitePopoverOpen` events added to `calcite-popover` component

### Updated

- `setFocus()` now focuses the first element in a `calcite-notice` - a slotted link or a close button, if present
- styling fixes for `calcite-button`, `calcite-dropdown`

## [v1.0.0-beta.16] - Dec 19th 2019

### Added

- new `calcite-icon` component
- new `CalciteModal.focusElement` method for restoring focus to an element in a modal
- `calcite-button` now accepts boolean attributes `round` and `floating`
- `calcite-button` can now be programmatically focused with the `setFocus()` method
- the close button of a `dismissible` `calcite-notice` can now be programmatically focused with the `setFocus()` method

### Fixed

- fixes for date picker in Edge (#257)

## [v1.0.0-beta.15] - Nov 26th 2019

### Fixed

- `calcite-date-picker` - Corrected date picker calendar opening up on null or no value property.
- `calcite-date-picker` - Change of input value updates the calendar to show same date.

## [v1.0.0-beta.14] - Nov 18th 2019

### Breaking Changes

- `calcite-button` - `iconposition` attribute updated to `icon-position`
- `calcite-dropdown-group` - `grouptitle` attribute updated to `group-title`
- `calcite-dropdown-item` - `linktitle` attribute updated to `link-title`
- `calcite-alert` - `dismiss` attribute updated to `auto-dismiss`
- `calcite-alert` - `duration` attribute updated to `auto-dismiss-duration`
- `calcite-alert` - `.openCalciteAlert()` method updated to `.open()`
- `calcite-alert` - `.closeCalciteAlert()` method updated to `.close()`
- `calcite-alert` no longer requires a wrapping `calcite-alerts` component
- `calcite-alerts` has been removed

### Added

- `calcite-notice` - new component has been added
- `calcite-alert` - `scale` is now available as a configurable attribute
- `calcite-dropdown` now has configurable `selection-mode` (#220)
- `no-padding` attribute for modals allowing modal content to fill space
- `calcite-dropdown` now has configurable `type` - click or hover (#220)

### Fixed

- Fix for `calcite-dropdown` taking up height when closed (#213)
- Fixed incorrect dark theme color, other styling updates

## [v1.0.0-beta.13] - Nov 11th 2019

### Added

- Added accordion component (#10)
- New `ScrollContent` method on modals, which allows manipulating scroll position of modal content
- Border radius on popover (#218)

### Fixed

- Fix clicks of radio group item in Edge (#139)
- Fix clicks of calcite-switch in Edge (#138)
- Fix `calcite-button` of type `submit` (#193)
- Fix `calcite-dropdown` focus style (#181)

### Updated

- Improved modal styling (#191)

## [v1.0.0-beta.12] - Nov 1st 2019

### Updated

- Medium modals are now a more readable line length (#205)
- Popover modifier enhancements (#207)
- Progress component style
- Button component style
- Dropdown component style
- Popover and tooltip shadow / caret style

### Fixed

- Fix back and secondary slots in modal (#209)
- Make docked modal's content section visible on mobile (#203)
- Fix display of modals in edge (#135)
- Fix escape key press when no element is focused but modal is open (#130)
- Fix for button form submission (#193)

## [v1.0.0-beta.11] - Oct 22nd 2019

### Fixed

- Fixes to popup styling
- Fixes duplicate id in button component
- Fixes for tree nav in Edge
- Fixes for toggle styling

### Added

- Added tooltip component
- Added configuration options for Popover

## [v1.0.0-beta.10] - Sep 19th 2019

### Fixed

- Fixed trees with strange nesting
- Edge fixes for alerts, dropdowns, buttons
- Fixed button container styling
- Fixed button appearance inline / no href tab issue

### Added

- Added popover component

## [v1.0.0-beta.9] - Sep 9th 2019

### Fixed

- Fixed scroll behavior in tall modals (only scroll modal content)
- Bug with nesing tree items with and without links
- Fixes for buttons, alerts and dropdowns in Edge
- Allow buttons to fill the height of their host

## [v1.0.0-beta.8] - Sep 3rd 2019

### Added

- Adds a boolean "disableEscape" prop to calcite-modal to make closing on escape optional.

## [v1.0.0-beta.7] - Aug 30th 2019

### Added

- Adds support for dropdown items as links
- Updates toggle styling and adds props for scale

## [v1.0.0-beta.6] - Aug 26th 2019

### Fixed

- `calcite-tree-item`s with both a `<a>` and a `calcite-tree`

## [v1.0.0-beta.5] - Aug 21th 2019

### Added

- adds scale prop to `calcite-radio-group`
- updates style of `calcite-radio-group`
- adds transparent appearance style for `calcite-button`
- adds `iconposition` prop to `calcite-button`
- updates dark theme style for `calcite-button`
- updates theme for `calcite-tree`
- adds support for disabled `calcite-button`

### Fixed

- fix width of medium/large modals with narrow contents

## [v1.0.0-beta.4] - Aug 19th 2019

### Added

- dark theme for `calcite-slider`
- added `<calcite-dropdown>`
- added `<calcite-tree>`

### Fixed

- solved issue with incorrect positioning of handle in `calcite-slider`
- fix various issue in Edge

## [v1.0.0-beta.3] - Aug 16th 2019

### Added

- date picker keyboard support
- date picker page-up and page-down buttons
- pre-render support for existing components

### Fixed

- style updates/dark theme for buttons
- fixed styling of modals in firefox
- fixed radio-group styling in Edge
- pointed calcite-base to correct npm version

## [v1.0.0-beta.2] - Aug 2nd 2019

Fix issue with previous release.

## [v1.0.0-beta.1] - Aug 2nd 2019

First initial beta release.
