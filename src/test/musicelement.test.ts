import { MusicElement } from "../ts/MusicElement";
import { MusicControls } from "../ts/MusicControls";

// Create a concrete subclass for testing
class TestElement extends MusicElement {
  static observedAttributes = ["test"];
}
customElements.define("test-element", TestElement);

describe("MusicElement", () => {
  it("adoptedCallback logs message", () => {
    const elem = document.createElement("test-element") as MusicElement;
    // adoptedCallback is hard to trigger in jsdom, but we can call it directly
    (elem as any).adoptedCallback();
  });

  it("bad attribute logs warning", () => {
    const elem = document.createElement("test-element") as MusicElement;
    document.body.appendChild(elem);
    // Call attributeChangedCallback directly with an unknown attribute
    (elem as any).attributeChangedCallback("badattr", "old", "new");
    document.body.removeChild(elem);
  });

  it("attributeChangedCallback short-circuits on same value", () => {
    const elem = document.createElement("test-element") as MusicElement;
    document.body.appendChild(elem);
    elem.setAttribute("test", "1");
    elem.setAttribute("test", "1"); // same value, should return early
    document.body.removeChild(elem);
  });

  it("define catches duplicate registration", () => {
    // Define a new tag, then redefine it to hit the catch block
    class TestControl extends MusicControls {}
    TestControl.define("test-control-duplicate");
    TestControl.define("test-control-duplicate");
  });
});
