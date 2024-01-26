// @ts-nocheck
@Component({ tag: "sample-tag" })
export class SampleTag {
  @Prop()
  type: "one" | "two" = "one";

  connectedCallback() {
    const child = document.createElement(this.type === "one" ? "my-component-1" : "my-component-2");
    this.el.append(child);
    this.internalEl = child;
  }

  disconnectedCallback() {
    this.internalEl.remove();
  }
}
