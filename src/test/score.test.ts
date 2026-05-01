import { MusicScore } from '../ts/MusicScore';
import config from '../ts/config';

// Polyfill DOMPoint for jsdom
if (typeof DOMPoint === 'undefined') {
  globalThis.DOMPoint = class DOMPoint {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
    }
    matrixTransform(_matrix: any) {
      return { x: this.x, y: this.y };
    }
  } as any;
}

// A helper function that allows us to detect events on element
// of type eventName have been fired
// HACK: duplicated with controls.test.ts
var expectedBar: any;
var expectedChoir: any;
var expectedPart: any;
function waitForEvent(element: HTMLElement, eventName: string, handler: (event: Event) => Promise<any>, c?: any, p?: any, b?: any): Promise<any> {
  expectedChoir = c;
  expectedPart = p;
  expectedBar = b;
  return new Promise<any>((resolve, reject) => {
    const eventListener = async (event: Event) => {
      try {
        const result = await handler(event);
        resolve(result); // Resolve with handler's result
      } catch (error) {
        reject(error); // Reject on error
      } finally {
        element.removeEventListener(eventName, eventListener, false);
      }
    };
    element.addEventListener(eventName, eventListener, false);
  });
}



describe("MusicScore custom element", () => {

  beforeAll(() => {
    MusicScore.define("music-score");

    // vi.spyOn(HTMLElement.prototype, "scrollTo").mockReturnValue();

  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    document.body.innerHTML = `<music-score></music-score>`
  });

  const handleScoreLoaded = async (event: Event) => {
    // ... your logic ...
    return new Promise((resolve, reject) => {
      try {
        // Perform assertions
        const d = (event as CustomEvent).detail;
        expect(d).not.toBeNull();
        if (expectedChoir) expect(d.position.choir).toBe(expectedChoir);
        if (expectedPart) expect(d.position.part).toBe(expectedPart);
        if (expectedBar) expect(d.position.choir).toBe(expectedBar);

        resolve(true); // Resolve if assertions pass
      } catch (error) {
        reject(error); // Reject if an assertion fails
      }
    });
  };


  it("Check that we can load the score correctly", async () => {
    const elem = document.querySelector("music-score") as MusicScore;

    elem.scrollTo = vi.fn();  // jsdom doesn't seem to implement HTMLElement.scrollTo()

    // wait for score to be loaded
    const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem?.setAttribute("choir", "0");
    const loadResult = await waitingForLoaded;
    expect(loadResult).toStrictEqual(true);

    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();

    const hPos = document.querySelector("svg rect[id='hPos']") as SVGRectElement;
    expect(hPos).not.toBeNull();  // highlight has been added
    expect(hPos?.style.fillOpacity).toBe("0"); // but currently invisible

    const hBar = document.querySelector("svg rect[id='hBar']") as SVGRectElement;
    expect(hBar).not.toBeNull();  // highlight has been added
    expect(hBar?.getAttribute("width")).toBe("0"); // but currently invisible

  });

  it("Check all scores have the same number of bars", async () => {
    const elem = document.querySelector("music-score") as MusicScore;

    elem.scrollTo = vi.fn();  // jsdom doesn't seem to implement HTMLElement.scrollTo()

    for (var c = 0; c < config.choirs; c++) {
      // wait for score to be loaded
      const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
      elem?.setAttribute("choir", String(c));
      const loadResult = await waitingForLoaded;
      expect(loadResult).toStrictEqual(true);
      
      const svg = document.querySelector("svg");
      expect(svg).not.toBeNull();

      expect(elem.bars.length).toBe(139);
      expect(elem.bars[0]).toBe(0);
      expect(elem.bars[138]).toBe(elem.svgWidth);
    }

  });

  it("Changing bar sets the highlight correctly", async () => {
    const elem = document.querySelector("music-score") as MusicScore;

    elem.scrollTo = vi.fn();  // jsdom doesn't seem to implement HTMLElement.scrollTo()

    // wait for score to be loaded
    const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem?.setAttribute("choir", "0");
    const loadResult = await waitingForLoaded;
    expect(loadResult).toStrictEqual(true);

    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();

    elem.setAttribute("bar", "40");
    expect(elem.highlightBar.getAttribute("width")).not.toBe("0");
    expect(elem.highlightBar.style.fillOpacity).not.toBe("0");
    expect(elem.highlightBar.getAttribute("x")).toBe(String(elem.bars[39]));
  });

  it("Bar 138 highlight uses last bar width", async () => {
    const elem = document.querySelector("music-score") as MusicScore;
    elem.scrollTo = vi.fn();
    const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem?.setAttribute("choir", "0");
    await waitingForLoaded;
    elem.setAttribute("bar", "138");
    expect(elem.highlightBar.getAttribute("width")).not.toBe("0");
  });

  it("Changing score type works", async () => {
    const elem = document.querySelector("music-score") as MusicScore;

    elem.scrollTo = vi.fn();  // jsdom doesn't seem to implement HTMLElement.scrollTo()

    // wait for score to be loaded
    elem?.setAttribute("choir", "0");
    const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem.setAttribute("score-type", "early");
    const loadResult = await waitingForLoaded;
    expect(loadResult).toStrictEqual(true);

    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();

  });

  it("Changing score type to a bad one works", async () => {
    const elem = document.querySelector("music-score") as MusicScore;

    elem.scrollTo = vi.fn();  // jsdom doesn't seem to implement HTMLElement.scrollTo()

    // wait for score to be loaded
    elem?.setAttribute("choir", "0");
    const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem.setAttribute("score-type", "frog");
    const loadResult = await waitingForLoaded;
    expect(loadResult).toStrictEqual(true);

    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();

  });

  it("When playing, highlight bar disappears and position highligt shows", async () => {
    const elem = document.querySelector("music-score") as MusicScore;

    elem.scrollTo = vi.fn();  // jsdom doesn't seem to implement HTMLElement.scrollTo()

    // wait for score to be loaded
    const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem?.setAttribute("choir", "0");
    elem.setAttribute("bar", "77");
    const loadResult = await waitingForLoaded;
    expect(loadResult).toStrictEqual(true);

    expect(elem.highlightBar.style.fillOpacity).not.toBe("0");
    expect(elem.highlightPosition.style.fillOpacity).toBe("0");

    elem.setAttribute("playing", "true");

    expect(elem.highlightBar.style.fillOpacity).toBe("0");
    expect(elem.highlightPosition.style.fillOpacity).not.toBe("0");


  });

  it("Changing score type results in different highlited bar", async () => {
    const elem = document.querySelector("music-score") as MusicScore;

    elem.scrollTo = vi.fn();  // jsdom doesn't seem to implement HTMLElement.scrollTo()

    // wait for score to be loaded
    var waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem?.setAttribute("choir", "4");
    elem.setAttribute("bar", "40");
    var loadResult = await waitingForLoaded;
    expect(loadResult).toStrictEqual(true);

    // get the highlight bar start position
    const startpos = elem.highlightBar.getAttribute("x");
    const width = elem.highlightBar.getAttribute("width");

    // wait for score to be loaded
    waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem.setAttribute("score-type", "early");
    loadResult = await waitingForLoaded;
    expect(loadResult).toStrictEqual(true);

    expect(elem.highlightBar.getAttribute("x")).not.toBe(startpos); // highlight bar x pos has changed
    expect(elem.highlightBar.getAttribute("width")).not.toBe(width); // highlight bar width has changed

  });

  it("scoreClicked sets bar and fires event", async () => {
    const elem = document.querySelector("music-score") as MusicScore;
    elem.scrollTo = vi.fn();

    const waitingForLoaded = waitForEvent(elem, "music-score-loaded", handleScoreLoaded, 0, null, 0);
    elem?.setAttribute("choir", "0");
    await waitingForLoaded;

    const svg = elem.svg!;
    svg.getScreenCTM = vi.fn(() => ({
      inverse: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })
    } as any));

    elem.bars = [0, 100, 200, 300];

    const clickPromise = new Promise<void>(resolve => {
      elem.addEventListener("music-score-click", () => resolve(), { once: true });
    });

    const mockEvent = new MouseEvent("click", { clientX: 150, clientY: 50 });
    elem.scoreClicked(mockEvent);

    await clickPromise;
    expect(elem.bar).toBe(2);
  });

});


