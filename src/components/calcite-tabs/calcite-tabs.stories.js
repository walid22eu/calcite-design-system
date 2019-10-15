import { storiesOf } from '@storybook/html';
import { withKnobs, text, number, boolean, select } from '@storybook/addon-knobs'
import { darkBackground, scaleOptions, colorOptions } from "../../../.storybook/helpers";
import notes from './readme.md';

storiesOf('Tabs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    return `
    <calcite-tabs
      layout="${select("layout", {inline: "inline", center: "center" })}"
    >
      <calcite-tab-nav slot="tab-nav">
        <calcite-tab-title is-active>Tab 1 Title</calcite-tab-title>
        <calcite-tab-title>Tab 2 Title</calcite-tab-title>
        <calcite-tab-title>Tab 3 Title</calcite-tab-title>
        <calcite-tab-title>Tab 4 Title</calcite-tab-title>
      </calcite-tab-nav>

      <calcite-tab is-active><p>Tab 1 Content</p></calcite-tab>
      <calcite-tab><p>Tab 2 Content</p></calcite-tab>
      <calcite-tab><p>Tab 3 Content</p></calcite-tab>
      <calcite-tab><p>Tab 4 Content</p></calcite-tab>
    </calcite-tabs>
    `
  }, { notes })
  .add('Dark mode', () => `
    <calcite-tabs theme="dark">
      <calcite-tab-nav slot="tab-nav">
        <calcite-tab-title is-active>Tab 1 Title</calcite-tab-title>
        <calcite-tab-title>Tab 2 Title</calcite-tab-title>
        <calcite-tab-title>Tab 3 Title</calcite-tab-title>
        <calcite-tab-title>Tab 4 Title</calcite-tab-title>
      </calcite-tab-nav>
    </calcite-tabs>
  `, { notes, backgrounds: darkBackground });
