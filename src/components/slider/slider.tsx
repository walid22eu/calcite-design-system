import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  VNode,
  Watch
} from "@stencil/core";
import { guid } from "../../utils/guid";

import { ColorStop, DataSeries } from "../graph/interfaces";
import { intersects } from "../../utils/dom";
import { clamp, decimalPlaces } from "../../utils/math";
import { Scale } from "../interfaces";
import { LabelableComponent, connectLabel, disconnectLabel } from "../../utils/label";
import {
  afterConnectDefaultValueSet,
  connectForm,
  disconnectForm,
  FormComponent,
  HiddenFormInputSlot
} from "../../utils/form";

type ActiveSliderProperty = "minValue" | "maxValue" | "value" | "minMaxValue";

@Component({
  tag: "calcite-slider",
  styleUrl: "slider.scss",
  shadow: true
})
export class Slider implements LabelableComponent, FormComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------
  @Element() el: HTMLCalciteSliderElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** Disable and gray out the slider */
  @Prop({ reflect: true }) disabled = false;

  /** Indicates if a histogram is present */
  @Prop({ reflect: true, mutable: true }) hasHistogram = false;

  /**
   * List of x,y coordinates within the slider's min and max, displays above the slider track.
   * @see [DataSeries](https://github.com/Esri/calcite-components/blob/master/src/components/graph/interfaces.ts#L5)
   */
  @Prop() histogram?: DataSeries;

  @Watch("histogram")
  histogramWatcher(newHistogram: DataSeries): void {
    this.hasHistogram = !!newHistogram;
  }

  /**
   * Array of values describing a single color stop, sorted by offset ascending.
   */
  @Prop() histogramStops: ColorStop[];

  /** Label handles with their numeric value */
  @Prop({ reflect: true }) labelHandles = false;

  /** Label tick marks with their numeric value. */
  @Prop({ reflect: true }) labelTicks = false;

  /** Maximum selectable value */
  @Prop({ reflect: true }) max = 100;

  /** Used as an accessible label (aria-label) for second handle if needed (ex. "Temperature, upper bound") */
  @Prop() maxLabel?: string;

  /** Currently selected upper number (if multi-select) */
  @Prop({ mutable: true }) maxValue?: number;

  /** Minimum selectable value */
  @Prop({ reflect: true }) min = 0;

  /** Used as an accessible label (aria-label) for first (or only) handle (ex. "Temperature, lower bound") */
  @Prop() minLabel: string;

  /** Currently selected lower number (if multi-select) */
  @Prop({ mutable: true }) minValue?: number;

  /**
   * When true, the slider will display values from high to low.
   *
   * Note that this value will be ignored if the slider has an associated histogram.
   */
  @Prop({ reflect: true }) mirrored = false;

  /** The name of the slider */
  @Prop({ reflect: true }) name: string;

  /** Interval to move on page up/page down keys */
  @Prop() pageStep?: number;

  /** Use finer point for handles */
  @Prop() precise = false;

  /**
   * When true, makes the component required for form-submission.
   */
  @Prop({ reflect: true }) required = false;

  /** When true, enables snap selection along the step interval */
  @Prop() snap = false;

  /** Interval to move on up/down keys */
  @Prop() step?: number = 1;

  /** Show tick marks on the number line at provided interval */
  @Prop() ticks?: number;

  /** Currently selected number (if single select) */
  @Prop({ reflect: true, mutable: true }) value: null | number = null;

  /**
   * Specify the scale of the slider, defaults to m
   */
  @Prop() scale: Scale = "m";

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback(): void {
    connectLabel(this);
    connectForm(this);
  }

  disconnectedCallback(): void {
    disconnectLabel(this);
    disconnectForm(this);
    this.removeDragListeners();
  }

  componentWillLoad(): void {
    this.isRange = !!(this.maxValue || this.maxValue === 0);
    this.tickValues = this.generateTickValues();
    this.value = this.clamp(this.value);
    afterConnectDefaultValueSet(this, this.value);
    if (this.snap) {
      this.value = this.getClosestStep(this.value);
    }
    if (this.histogram) {
      this.hasHistogram = true;
    }
  }

  componentDidRender(): void {
    if (this.labelHandles) {
      this.adjustHostObscuredHandleLabel("value");
      if (this.isRange) {
        this.adjustHostObscuredHandleLabel("minValue");
        if (!(this.precise && this.isRange && !this.hasHistogram)) {
          this.hyphenateCollidingRangeHandleLabels();
        }
      }
    }
    this.hideObscuredBoundingTickLabels();
  }

  render(): VNode {
    const id = this.el.id || this.guid;
    const min = this.minValue || this.min;
    const max = this.maxValue || this.value;
    const maxProp = this.isRange ? "maxValue" : "value";
    const value = this[maxProp];
    const useMinValue = this.shouldUseMinValue();
    const minInterval = this.getUnitInterval(useMinValue ? this.minValue : min) * 100;
    const maxInterval = this.getUnitInterval(max) * 100;
    const mirror = this.shouldMirror();
    const leftThumbOffset = `${mirror ? 100 - minInterval : minInterval}%`;
    const rightThumbOffset = `${mirror ? maxInterval : 100 - maxInterval}%`;

    const handle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.isRange ? this.maxLabel : this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={value}
        class={{
          thumb: true,
          "thumb--value": true,
          "thumb--active": this.lastDragProp !== "minMaxValue" && this.dragProp === maxProp
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = maxProp)}
        onPointerDown={() => this.dragStart(maxProp)}
        ref={(el) => (this.maxHandle = el as HTMLDivElement)}
        role="slider"
        style={{ right: rightThumbOffset }}
        tabIndex={0}
      >
        <div class="handle" />
      </div>
    );

    const labeledHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.isRange ? this.maxLabel : this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={value}
        class={{
          thumb: true,
          "thumb--value": true,
          "thumb--active": this.lastDragProp !== "minMaxValue" && this.dragProp === maxProp
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = maxProp)}
        onPointerDown={() => this.dragStart(maxProp)}
        ref={(el) => (this.maxHandle = el as HTMLDivElement)}
        role="slider"
        style={{ right: rightThumbOffset }}
        tabIndex={0}
      >
        <span aria-hidden="true" class="handle__label handle__label--value">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value static">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value transformed">
          {value ? value.toLocaleString() : value}
        </span>
        <div class="handle" />
      </div>
    );

    const histogramLabeledHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.isRange ? this.maxLabel : this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={value}
        class={{
          thumb: true,
          "thumb--value": true,
          "thumb--active": this.lastDragProp !== "minMaxValue" && this.dragProp === maxProp
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = maxProp)}
        onPointerDown={() => this.dragStart(maxProp)}
        ref={(el) => (this.maxHandle = el as HTMLDivElement)}
        role="slider"
        style={{ right: rightThumbOffset }}
        tabIndex={0}
      >
        <div class="handle" />
        <span aria-hidden="true" class="handle__label handle__label--value">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value static">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value transformed">
          {value ? value.toLocaleString() : value}
        </span>
      </div>
    );

    const preciseHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.isRange ? this.maxLabel : this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={value}
        class={{
          thumb: true,
          "thumb--value": true,
          "thumb--active": this.lastDragProp !== "minMaxValue" && this.dragProp === maxProp,
          "thumb--precise": true
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = maxProp)}
        onPointerDown={() => this.dragStart(maxProp)}
        ref={(el) => (this.maxHandle = el as HTMLDivElement)}
        role="slider"
        style={{ right: rightThumbOffset }}
        tabIndex={0}
      >
        <div class="handle" />
        <div class="handle-extension" />
      </div>
    );

    const histogramPreciseHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.isRange ? this.maxLabel : this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={value}
        class={{
          thumb: true,
          "thumb--value": true,
          "thumb--active": this.lastDragProp !== "minMaxValue" && this.dragProp === maxProp,
          "thumb--precise": true
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = maxProp)}
        onPointerDown={() => this.dragStart(maxProp)}
        ref={(el) => (this.maxHandle = el as HTMLDivElement)}
        role="slider"
        style={{ right: rightThumbOffset }}
        tabIndex={0}
      >
        <div class="handle-extension" />
        <div class="handle" />
      </div>
    );

    const labeledPreciseHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.isRange ? this.maxLabel : this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={value}
        class={{
          thumb: true,
          "thumb--value": true,
          "thumb--active": this.lastDragProp !== "minMaxValue" && this.dragProp === maxProp,
          "thumb--precise": true
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = maxProp)}
        onPointerDown={() => this.dragStart(maxProp)}
        ref={(el) => (this.maxHandle = el as HTMLDivElement)}
        role="slider"
        style={{ right: rightThumbOffset }}
        tabIndex={0}
      >
        <span aria-hidden="true" class="handle__label handle__label--value">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value static">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value transformed">
          {value ? value.toLocaleString() : value}
        </span>
        <div class="handle" />
        <div class="handle-extension" />
      </div>
    );

    const histogramLabeledPreciseHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.isRange ? this.maxLabel : this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={value}
        class={{
          thumb: true,
          "thumb--value": true,
          "thumb--active": this.lastDragProp !== "minMaxValue" && this.dragProp === maxProp,
          "thumb--precise": true
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = maxProp)}
        onPointerDown={() => this.dragStart(maxProp)}
        ref={(el) => (this.maxHandle = el as HTMLDivElement)}
        role="slider"
        style={{ right: rightThumbOffset }}
        tabIndex={0}
      >
        <div class="handle-extension" />
        <div class="handle" />
        <span aria-hidden="true" class="handle__label handle__label--value">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value static">
          {value ? value.toLocaleString() : value}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--value transformed">
          {value ? value.toLocaleString() : value}
        </span>
      </div>
    );

    const minHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={this.minValue}
        class={{
          thumb: true,
          "thumb--minValue": true,
          "thumb--active": this.dragProp === "minValue"
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = "minValue")}
        onPointerDown={() => this.dragStart("minValue")}
        ref={(el) => (this.minHandle = el as HTMLDivElement)}
        role="slider"
        style={{ left: leftThumbOffset }}
        tabIndex={0}
      >
        <div class="handle" />
      </div>
    );

    const minLabeledHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={this.minValue}
        class={{
          thumb: true,
          "thumb--minValue": true,
          "thumb--active": this.dragProp === "minValue"
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = "minValue")}
        onPointerDown={() => this.dragStart("minValue")}
        ref={(el) => (this.minHandle = el as HTMLDivElement)}
        role="slider"
        style={{ left: leftThumbOffset }}
        tabIndex={0}
      >
        <span aria-hidden="true" class="handle__label handle__label--minValue">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--minValue static">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--minValue transformed">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
        <div class="handle" />
      </div>
    );

    const minHistogramLabeledHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={this.minValue}
        class={{
          thumb: true,
          "thumb--minValue": true,
          "thumb--active": this.dragProp === "minValue"
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = "minValue")}
        onPointerDown={() => this.dragStart("minValue")}
        ref={(el) => (this.minHandle = el as HTMLDivElement)}
        role="slider"
        style={{ left: leftThumbOffset }}
        tabIndex={0}
      >
        <div class="handle" />
        <span aria-hidden="true" class="handle__label handle__label--minValue">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--minValue static">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--minValue transformed">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
      </div>
    );

    const minPreciseHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={this.minValue}
        class={{
          thumb: true,
          "thumb--minValue": true,
          "thumb--active": this.dragProp === "minValue",
          "thumb--precise": true
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = "minValue")}
        onPointerDown={() => this.dragStart("minValue")}
        ref={(el) => (this.minHandle = el as HTMLDivElement)}
        role="slider"
        style={{ left: leftThumbOffset }}
        tabIndex={0}
      >
        <div class="handle-extension" />
        <div class="handle" />
      </div>
    );

    const minLabeledPreciseHandle = (
      <div
        aria-disabled={this.disabled}
        aria-label={this.minLabel}
        aria-orientation="horizontal"
        aria-valuemax={this.max}
        aria-valuemin={this.min}
        aria-valuenow={this.minValue}
        class={{
          thumb: true,
          "thumb--minValue": true,
          "thumb--active": this.dragProp === "minValue",
          "thumb--precise": true
        }}
        onBlur={() => (this.activeProp = null)}
        onFocus={() => (this.activeProp = "minValue")}
        onPointerDown={() => this.dragStart("minValue")}
        ref={(el) => (this.minHandle = el as HTMLDivElement)}
        role="slider"
        style={{ left: leftThumbOffset }}
        tabIndex={0}
      >
        <div class="handle-extension" />
        <div class="handle" />
        <span aria-hidden="true" class="handle__label handle__label--minValue">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--minValue static">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
        <span aria-hidden="true" class="handle__label handle__label--minValue transformed">
          {this.minValue && this.minValue.toLocaleString()}
        </span>
      </div>
    );

    return (
      <Host id={id} onTouchStart={this.handleTouchStart}>
        <div
          class={{
            ["container"]: true,
            ["container--range"]: this.isRange,
            [`scale--${this.scale}`]: true
          }}
        >
          {this.renderGraph()}
          <div class="track" ref={this.storeTrackRef}>
            <div
              class="track__range"
              onPointerDown={() => this.dragStart("minMaxValue")}
              style={{
                left: `${mirror ? 100 - maxInterval : minInterval}%`,
                right: `${mirror ? minInterval : 100 - maxInterval}%`
              }}
            />
            <div class="ticks">
              {this.tickValues.map((tick) => {
                const tickOffset = `${this.getUnitInterval(tick) * 100}%`;
                let activeTicks = tick >= min && tick <= max;
                if (useMinValue) {
                  activeTicks = tick >= this.minValue && tick <= this.maxValue;
                }

                return (
                  <span
                    class={{
                      tick: true,
                      "tick--active": activeTicks
                    }}
                    style={{
                      left: mirror ? "" : tickOffset,
                      right: mirror ? tickOffset : ""
                    }}
                  >
                    {this.renderTickLabel(tick)}
                  </span>
                );
              })}
            </div>
          </div>
          <div class="thumb-container">
            {!this.precise && !this.labelHandles && this.isRange && minHandle}
            {!this.hasHistogram &&
              !this.precise &&
              this.labelHandles &&
              this.isRange &&
              minLabeledHandle}
            {this.precise && !this.labelHandles && this.isRange && minPreciseHandle}
            {this.precise && this.labelHandles && this.isRange && minLabeledPreciseHandle}
            {this.hasHistogram &&
              !this.precise &&
              this.labelHandles &&
              this.isRange &&
              minHistogramLabeledHandle}

            {!this.precise && !this.labelHandles && handle}
            {!this.hasHistogram && !this.precise && this.labelHandles && labeledHandle}
            {!this.hasHistogram && this.precise && !this.labelHandles && preciseHandle}
            {this.hasHistogram && this.precise && !this.labelHandles && histogramPreciseHandle}
            {!this.hasHistogram && this.precise && this.labelHandles && labeledPreciseHandle}
            {this.hasHistogram && !this.precise && this.labelHandles && histogramLabeledHandle}
            {this.hasHistogram &&
              this.precise &&
              this.labelHandles &&
              histogramLabeledPreciseHandle}
            <HiddenFormInputSlot component={this} />
          </div>
        </div>
      </Host>
    );
  }

  private renderGraph(): VNode {
    return this.histogram ? (
      <calcite-graph
        class="graph"
        colorStops={this.histogramStops}
        data={this.histogram}
        highlightMax={this.isRange ? this.maxValue : this.value}
        highlightMin={this.isRange ? this.minValue : this.min}
        max={this.max}
        min={this.min}
      />
    ) : null;
  }

  private renderTickLabel(tick: number): VNode {
    const isMinTickLabel = tick === this.min;
    const isMaxTickLabel = tick === this.max;
    const tickLabel = (
      <span
        class={{
          tick__label: true,
          "tick__label--min": isMinTickLabel,
          "tick__label--max": isMaxTickLabel
        }}
      >
        {tick.toLocaleString()}
      </span>
    );
    if (this.labelTicks && !this.hasHistogram && !this.isRange) {
      return tickLabel;
    }
    if (
      this.labelTicks &&
      !this.hasHistogram &&
      this.isRange &&
      !this.precise &&
      !this.labelHandles
    ) {
      return tickLabel;
    }
    if (
      this.labelTicks &&
      !this.hasHistogram &&
      this.isRange &&
      !this.precise &&
      this.labelHandles
    ) {
      return tickLabel;
    }
    if (
      this.labelTicks &&
      !this.hasHistogram &&
      this.isRange &&
      this.precise &&
      (isMinTickLabel || isMaxTickLabel)
    ) {
      return tickLabel;
    }
    if (this.labelTicks && this.hasHistogram && !this.precise && !this.labelHandles) {
      return tickLabel;
    }
    if (
      this.labelTicks &&
      this.hasHistogram &&
      this.precise &&
      !this.labelHandles &&
      (isMinTickLabel || isMaxTickLabel)
    ) {
      return tickLabel;
    }
    if (
      this.labelTicks &&
      this.hasHistogram &&
      !this.precise &&
      this.labelHandles &&
      (isMinTickLabel || isMaxTickLabel)
    ) {
      return tickLabel;
    }
    if (
      this.labelTicks &&
      this.hasHistogram &&
      this.precise &&
      this.labelHandles &&
      (isMinTickLabel || isMaxTickLabel)
    ) {
      return tickLabel;
    }
    return null;
  }

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("keydown")
  keyDownHandler(event: KeyboardEvent): void {
    const mirror = this.shouldMirror();
    const { activeProp, max, min, pageStep, step } = this;
    const value = this[activeProp];
    const key = event.key;

    if (key === "Enter" || key === " ") {
      event.preventDefault();
      return;
    }

    let adjustment: number;

    if (key === "ArrowUp" || key === "ArrowRight") {
      const directionFactor = mirror && key === "ArrowRight" ? -1 : 1;
      adjustment = value + step * directionFactor;
    } else if (key === "ArrowDown" || key === "ArrowLeft") {
      const directionFactor = mirror && key === "ArrowLeft" ? -1 : 1;
      adjustment = value - step * directionFactor;
    } else if (key === "PageUp") {
      if (pageStep) {
        adjustment = value + pageStep;
      }
    } else if (key === "PageDown") {
      if (pageStep) {
        adjustment = value - pageStep;
      }
    } else if (key === "Home") {
      adjustment = min;
    } else if (key === "End") {
      adjustment = max;
    }
    if (isNaN(adjustment)) {
      return;
    }
    event.preventDefault();
    const fixedDecimalAdjustment = Number(adjustment.toFixed(decimalPlaces(step)));
    this.setValue(activeProp, this.clamp(fixedDecimalAdjustment, activeProp));
  }

  @Listen("click")
  clickHandler(event: PointerEvent): void {
    this.focusActiveHandle(event.clientX);
  }

  @Listen("pointerdown")
  pointerDownHandler(event: PointerEvent): void {
    const x = event.clientX || event.pageX;
    const position = this.translate(x);
    let prop: ActiveSliderProperty = "value";
    if (this.isRange) {
      const inRange = position >= this.minValue && position <= this.maxValue;
      if (inRange && this.lastDragProp === "minMaxValue") {
        prop = "minMaxValue";
      } else {
        const closerToMax = Math.abs(this.maxValue - position) < Math.abs(this.minValue - position);
        prop = closerToMax || position > this.maxValue ? "maxValue" : "minValue";
      }
    }
    this.lastDragPropValue = this[prop];
    this.dragStart(prop);
    const isThumbActive = this.el.shadowRoot.querySelector(".thumb:active");
    if (!isThumbActive) {
      this.setValue(prop, this.clamp(position, prop));
    }
  }

  handleTouchStart(event: TouchEvent): void {
    // needed to prevent extra click at the end of a handle drag
    event.preventDefault();
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------
  /**
   * Fires on all updates to the slider.
   * :warning: Will be fired frequently during drag. If you are performing any
   * expensive operations consider using a debounce or throttle to avoid
   * locking up the main thread.
   */
  @Event() calciteSliderInput: EventEmitter;

  /**
   * Fires on when the thumb is released on slider
   * If you need to constantly listen to the drag event,
   * please use calciteSliderInput instead
   */
  @Event() calciteSliderChange: EventEmitter;

  /**
   * Fires on all updates to the slider.
   * :warning: Will be fired frequently during drag. If you are performing any
   * expensive operations consider using a debounce or throttle to avoid
   * locking up the main thread.
   * @deprecated use calciteSliderInput instead
   */
  @Event() calciteSliderUpdate: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    const handle = this.minHandle ? this.minHandle : this.maxHandle;
    handle.focus();
  }

  //--------------------------------------------------------------------------
  //
  //  Private State/Props
  //
  //--------------------------------------------------------------------------

  labelEl: HTMLCalciteLabelElement;

  formEl: HTMLFormElement;

  defaultValue: Slider["value"];

  private guid = `calcite-slider-${guid()}`;

  private isRange = false;

  private dragProp: ActiveSliderProperty;

  private lastDragProp: ActiveSliderProperty;

  private lastDragPropValue: number;

  private minHandle: HTMLDivElement;

  private maxHandle: HTMLDivElement;

  private trackEl: HTMLDivElement;

  @State() private activeProp: ActiveSliderProperty = "value";

  @State() private minMaxValueRange: number = null;

  @State() private minValueDragRange: number = null;

  @State() private maxValueDragRange: number = null;

  @State() private tickValues: number[] = [];

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  onLabelClick(): void {
    this.setFocus();
  }

  private shouldMirror(): boolean {
    return this.mirrored && !this.hasHistogram;
  }

  private shouldUseMinValue(): boolean {
    if (!this.isRange) {
      return false;
    }
    return (
      (this.hasHistogram && this.maxValue === 0) || (!this.hasHistogram && this.minValue === 0)
    );
  }

  private generateTickValues(): number[] {
    const ticks = [];
    let current = this.min;
    while (this.ticks && current < this.max + this.ticks) {
      ticks.push(Math.min(current, this.max));
      current = current + this.ticks;
    }
    return ticks;
  }

  private dragStart(prop: ActiveSliderProperty): void {
    this.dragProp = prop;
    this.lastDragProp = this.dragProp;
    this.activeProp = prop;
    document.addEventListener("pointermove", this.dragUpdate);
    document.addEventListener("pointerup", this.dragEnd);
    document.addEventListener("pointercancel", this.dragEnd);
  }

  private focusActiveHandle(valueX: number): void {
    switch (this.dragProp) {
      case "minValue":
        this.minHandle.focus();
        break;
      case "maxValue":
        this.maxHandle.focus();
        break;
      case "minMaxValue":
        this.getClosestHandle(valueX).focus();
        break;
      default:
        break;
    }
  }

  private dragUpdate = (event: PointerEvent): void => {
    event.preventDefault();
    if (this.dragProp) {
      const value = this.translate(event.clientX || event.pageX);
      if (this.isRange && this.dragProp === "minMaxValue") {
        if (this.minValueDragRange && this.maxValueDragRange && this.minMaxValueRange) {
          const newMinValue = value - this.minValueDragRange;
          const newMaxValue = value + this.maxValueDragRange;
          if (
            newMaxValue <= this.max &&
            newMinValue >= this.min &&
            newMaxValue - newMinValue === this.minMaxValueRange
          ) {
            this.minValue = this.clamp(newMinValue, "minValue");
            this.maxValue = this.clamp(newMaxValue, "maxValue");
          }
        } else {
          this.minValueDragRange = value - this.minValue;
          this.maxValueDragRange = this.maxValue - value;
          this.minMaxValueRange = this.maxValue - this.minValue;
        }
      } else {
        this.setValue(this.dragProp, this.clamp(value, this.dragProp));
      }
    }
  };

  private emitInput(): void {
    this.calciteSliderInput.emit();
    this.calciteSliderUpdate.emit();
  }

  private emitChange(): void {
    this.calciteSliderChange.emit();
  }

  private dragEnd = (event: PointerEvent): void => {
    this.removeDragListeners();
    this.focusActiveHandle(event.clientX);
    if (this.lastDragPropValue != this[this.dragProp]) {
      this.emitChange();
    }
    this.dragProp = null;
    this.lastDragPropValue = null;
    this.minValueDragRange = null;
    this.maxValueDragRange = null;
    this.minMaxValueRange = null;
  };

  private removeDragListeners() {
    document.removeEventListener("pointermove", this.dragUpdate);
    document.removeEventListener("pointerup", this.dragEnd);
    document.removeEventListener("pointercancel", this.dragEnd);
  }

  /**
   * Set the prop value if changed at the component level
   * @param valueProp
   * @param value
   */
  private setValue(valueProp: string, value: number): void {
    const oldValue = this[valueProp];
    const valueChanged = oldValue !== value;

    if (!valueChanged) {
      return;
    }
    this[valueProp] = value;
    const dragging = this.dragProp;
    if (!dragging) {
      this.emitChange();
    }
    this.emitInput();
  }

  /**
   * Set the reference of the track Element
   * @internal
   * @param node
   */
  private storeTrackRef = (node: HTMLDivElement): void => {
    this.trackEl = node;
  };

  /**
   * If number is outside range, constrain to min or max
   * @internal
   */
  private clamp(value: number, prop?: ActiveSliderProperty): number {
    value = clamp(value, this.min, this.max);

    // ensure that maxValue and minValue don't swap positions
    if (prop === "maxValue") {
      value = Math.max(value, this.minValue);
    }
    if (prop === "minValue") {
      value = Math.min(value, this.maxValue);
    }
    return value;
  }

  /**
   * Translate a pixel position to value along the range
   * @internal
   */
  private translate(x: number): number {
    const range = this.max - this.min;
    const { left, width } = this.trackEl.getBoundingClientRect();
    const percent = (x - left) / width;
    const mirror = this.shouldMirror();
    const clampedValue = this.clamp(this.min + range * (mirror ? 1 - percent : percent));
    let value = Number(clampedValue.toFixed(decimalPlaces(this.step)));
    if (this.snap && this.step) {
      value = this.getClosestStep(value);
    }
    return value;
  }

  /**
   * Get closest allowed value along stepped values
   * @internal
   */
  private getClosestStep(num: number): number {
    num = Number(this.clamp(num).toFixed(decimalPlaces(this.step)));
    if (this.step) {
      const step = Math.round(num / this.step) * this.step;
      num = Number(this.clamp(step).toFixed(decimalPlaces(this.step)));
    }
    return num;
  }

  private getClosestHandle(valueX: number): HTMLDivElement {
    return this.getDistanceX(this.maxHandle, valueX) > this.getDistanceX(this.minHandle, valueX)
      ? this.minHandle
      : this.maxHandle;
  }

  private getDistanceX(el: HTMLDivElement, valueX: number): number {
    return Math.abs(el.getBoundingClientRect().left - valueX);
  }

  private getFontSizeForElement(element: HTMLElement): number {
    return Number(window.getComputedStyle(element).getPropertyValue("font-size").match(/\d+/)[0]);
  }

  /**
   * Get position of value along range as fractional value
   * @return {number} number in the unit interval [0,1]
   * @internal
   */
  private getUnitInterval(num: number): number {
    num = this.clamp(num);
    const range = this.max - this.min;
    return (num - this.min) / range;
  }

  private adjustHostObscuredHandleLabel(name: "value" | "minValue"): void {
    const label: HTMLSpanElement = this.el.shadowRoot.querySelector(`.handle__label--${name}`);
    const labelStatic: HTMLSpanElement = this.el.shadowRoot.querySelector(
      `.handle__label--${name}.static`
    );
    const labelTransformed: HTMLSpanElement = this.el.shadowRoot.querySelector(
      `.handle__label--${name}.transformed`
    );
    const labelStaticBounds = labelStatic.getBoundingClientRect();
    const labelStaticOffset = this.getHostOffset(labelStaticBounds.left, labelStaticBounds.right);
    label.style.transform = `translateX(${labelStaticOffset}px)`;
    labelTransformed.style.transform = `translateX(${labelStaticOffset}px)`;
  }

  private hyphenateCollidingRangeHandleLabels(): void {
    const { shadowRoot } = this.el;

    const mirror = this.shouldMirror();
    const leftModifier = mirror ? "value" : "minValue";
    const rightModifier = mirror ? "minValue" : "value";

    const leftValueLabel: HTMLSpanElement = shadowRoot.querySelector(
      `.handle__label--${leftModifier}`
    );
    const leftValueLabelStatic: HTMLSpanElement = shadowRoot.querySelector(
      `.handle__label--${leftModifier}.static`
    );
    const leftValueLabelTransformed: HTMLSpanElement = shadowRoot.querySelector(
      `.handle__label--${leftModifier}.transformed`
    );
    const leftValueLabelStaticHostOffset = this.getHostOffset(
      leftValueLabelStatic.getBoundingClientRect().left,
      leftValueLabelStatic.getBoundingClientRect().right
    );

    const rightValueLabel: HTMLSpanElement = shadowRoot.querySelector(
      `.handle__label--${rightModifier}`
    );
    const rightValueLabelStatic: HTMLSpanElement = shadowRoot.querySelector(
      `.handle__label--${rightModifier}.static`
    );
    const rightValueLabelTransformed: HTMLSpanElement = shadowRoot.querySelector(
      `.handle__label--${rightModifier}.transformed`
    );
    const rightValueLabelStaticHostOffset = this.getHostOffset(
      rightValueLabelStatic.getBoundingClientRect().left,
      rightValueLabelStatic.getBoundingClientRect().right
    );

    const labelFontSize = this.getFontSizeForElement(leftValueLabel);
    const labelTransformedOverlap = this.getRangeLabelOverlap(
      leftValueLabelTransformed,
      rightValueLabelTransformed
    );

    const hyphenLabel = leftValueLabel;
    const labelOffset = labelFontSize / 2;

    if (labelTransformedOverlap > 0) {
      hyphenLabel.classList.add("hyphen", "hyphen--wrap");
      if (rightValueLabelStaticHostOffset === 0 && leftValueLabelStaticHostOffset === 0) {
        // Neither handle overlaps the host boundary
        let leftValueLabelTranslate = labelTransformedOverlap / 2 - labelOffset;
        leftValueLabelTranslate =
          Math.sign(leftValueLabelTranslate) === -1
            ? Math.abs(leftValueLabelTranslate)
            : -leftValueLabelTranslate;

        const leftValueLabelTransformedHostOffset = this.getHostOffset(
          leftValueLabelTransformed.getBoundingClientRect().left +
            leftValueLabelTranslate -
            labelOffset,
          leftValueLabelTransformed.getBoundingClientRect().right +
            leftValueLabelTranslate -
            labelOffset
        );

        let rightValueLabelTranslate = labelTransformedOverlap / 2;
        const rightValueLabelTransformedHostOffset = this.getHostOffset(
          rightValueLabelTransformed.getBoundingClientRect().left + rightValueLabelTranslate,
          rightValueLabelTransformed.getBoundingClientRect().right + rightValueLabelTranslate
        );

        if (leftValueLabelTransformedHostOffset !== 0) {
          leftValueLabelTranslate += leftValueLabelTransformedHostOffset;
          rightValueLabelTranslate += leftValueLabelTransformedHostOffset;
        }

        if (rightValueLabelTransformedHostOffset !== 0) {
          leftValueLabelTranslate += rightValueLabelTransformedHostOffset;
          rightValueLabelTranslate += rightValueLabelTransformedHostOffset;
        }

        leftValueLabel.style.transform = `translateX(${leftValueLabelTranslate}px)`;
        leftValueLabelTransformed.style.transform = `translateX(${
          leftValueLabelTranslate - labelOffset
        }px)`;
        rightValueLabel.style.transform = `translateX(${rightValueLabelTranslate}px)`;
        rightValueLabelTransformed.style.transform = `translateX(${rightValueLabelTranslate}px)`;
      } else if (leftValueLabelStaticHostOffset > 0 || rightValueLabelStaticHostOffset > 0) {
        // labels overlap host boundary on the left side
        leftValueLabel.style.transform = `translateX(${
          leftValueLabelStaticHostOffset + labelOffset
        }px)`;
        rightValueLabel.style.transform = `translateX(${
          labelTransformedOverlap + rightValueLabelStaticHostOffset
        }px)`;
        rightValueLabelTransformed.style.transform = `translateX(${
          labelTransformedOverlap + rightValueLabelStaticHostOffset
        }px)`;
      } else if (leftValueLabelStaticHostOffset < 0 || rightValueLabelStaticHostOffset < 0) {
        // labels overlap host boundary on the right side
        let leftValueLabelTranslate =
          Math.abs(leftValueLabelStaticHostOffset) + labelTransformedOverlap - labelOffset;
        leftValueLabelTranslate =
          Math.sign(leftValueLabelTranslate) === -1
            ? Math.abs(leftValueLabelTranslate)
            : -leftValueLabelTranslate;
        leftValueLabel.style.transform = `translateX(${leftValueLabelTranslate}px)`;
        leftValueLabelTransformed.style.transform = `translateX(${
          leftValueLabelTranslate - labelOffset
        }px)`;
      }
    } else {
      hyphenLabel.classList.remove("hyphen", "hyphen--wrap");
      leftValueLabel.style.transform = `translateX(${leftValueLabelStaticHostOffset}px)`;
      leftValueLabelTransformed.style.transform = `translateX(${leftValueLabelStaticHostOffset}px)`;
      rightValueLabel.style.transform = `translateX(${rightValueLabelStaticHostOffset}px)`;
      rightValueLabelTransformed.style.transform = `translateX(${rightValueLabelStaticHostOffset}px)`;
    }
  }

  /**
   * Hides bounding tick labels that are obscured by either handle.
   */
  private hideObscuredBoundingTickLabels(): void {
    if (!this.hasHistogram && !this.isRange && !this.labelHandles && !this.precise) {
      return;
    }
    if (!this.hasHistogram && !this.isRange && this.labelHandles && !this.precise) {
      return;
    }
    if (!this.hasHistogram && !this.isRange && !this.labelHandles && this.precise) {
      return;
    }
    if (!this.hasHistogram && !this.isRange && this.labelHandles && this.precise) {
      return;
    }
    if (!this.hasHistogram && this.isRange && !this.precise) {
      return;
    }
    if (this.hasHistogram && !this.precise && !this.labelHandles) {
      return;
    }

    const minHandle: HTMLDivElement | null = this.el.shadowRoot.querySelector(".thumb--minValue");
    const maxHandle: HTMLDivElement | null = this.el.shadowRoot.querySelector(".thumb--value");

    const minTickLabel: HTMLSpanElement | null =
      this.el.shadowRoot.querySelector(".tick__label--min");
    const maxTickLabel: HTMLSpanElement | null =
      this.el.shadowRoot.querySelector(".tick__label--max");

    if (!minHandle && maxHandle && minTickLabel && maxTickLabel) {
      minTickLabel.style.opacity = this.isMinTickLabelObscured(minTickLabel, maxHandle) ? "0" : "1";
      maxTickLabel.style.opacity = this.isMaxTickLabelObscured(maxTickLabel, maxHandle) ? "0" : "1";
    }

    if (minHandle && maxHandle && minTickLabel && maxTickLabel) {
      minTickLabel.style.opacity =
        this.isMinTickLabelObscured(minTickLabel, minHandle) ||
        this.isMinTickLabelObscured(minTickLabel, maxHandle)
          ? "0"
          : "1";
      maxTickLabel.style.opacity =
        this.isMaxTickLabelObscured(maxTickLabel, minHandle) ||
        (this.isMaxTickLabelObscured(maxTickLabel, maxHandle) && this.hasHistogram)
          ? "0"
          : "1";
    }
  }

  /**
   * Returns an integer representing the number of pixels to offset on the left or right side based on desired position behavior.
   * @internal
   */
  private getHostOffset(leftBounds: number, rightBounds: number): number {
    const hostBounds = this.el.getBoundingClientRect();
    const buffer = 7;

    if (leftBounds + buffer < hostBounds.left) {
      return hostBounds.left - leftBounds - buffer;
    }

    if (rightBounds - buffer > hostBounds.right) {
      return -(rightBounds - hostBounds.right) + buffer;
    }

    return 0;
  }

  /**
   * Returns an integer representing the number of pixels that the two given span elements are overlapping, taking into account
   * a space in between the two spans equal to the font-size set on them to account for the space needed to render a hyphen.
   * @param leftLabel
   * @param rightLabel
   */
  private getRangeLabelOverlap(leftLabel: HTMLSpanElement, rightLabel: HTMLSpanElement): number {
    const leftLabelBounds = leftLabel.getBoundingClientRect();
    const rightLabelBounds = rightLabel.getBoundingClientRect();
    const leftLabelFontSize = this.getFontSizeForElement(leftLabel);
    const rangeLabelOverlap = leftLabelBounds.right + leftLabelFontSize - rightLabelBounds.left;

    return Math.max(rangeLabelOverlap, 0);
  }

  /**
   * Returns a boolean value representing if the minLabel span element is obscured (being overlapped) by the given handle div element.
   * @param minLabel
   * @param handle
   */
  private isMinTickLabelObscured(minLabel: HTMLSpanElement, handle: HTMLDivElement): boolean {
    const minLabelBounds = minLabel.getBoundingClientRect();
    const handleBounds = handle.getBoundingClientRect();
    return intersects(minLabelBounds, handleBounds);
  }

  /**
   * Returns a boolean value representing if the maxLabel span element is obscured (being overlapped) by the given handle div element.
   * @param maxLabel
   * @param handle
   */
  private isMaxTickLabelObscured(maxLabel: HTMLSpanElement, handle: HTMLDivElement): boolean {
    const maxLabelBounds = maxLabel.getBoundingClientRect();
    const handleBounds = handle.getBoundingClientRect();
    return intersects(maxLabelBounds, handleBounds);
  }
}
