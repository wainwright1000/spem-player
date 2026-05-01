import { MusicCanvas } from '../ts/MusicCanvas';
import { processLilypond, dict, ranges } from '../ts/lily';

MusicCanvas.define("music-canvas");
processLilypond();

var canvas: MusicCanvas | null;
describe("MusicCanvas custom element", () => {

  beforeAll(async () => {
    document.body.innerHTML = `<music-canvas></music-canvas>`
    canvas = document.querySelector("music-canvas");
    // Wait for connectedCallback -> #init -> processLilypond -> draw
    await new Promise(r => setTimeout(r, 500));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("Check that the canvasent contains a canvas", async () => {
    expect(canvas).not.toBeNull();
    console.log(canvas?.innerHTML);
    expect(canvas?.querySelector("canvas")).not.toBe(null);
  });

  it("draw() renders when dict and ranges are populated", async () => {
    expect(canvas).not.toBeNull();
    expect(canvas!.canvas).not.toBeNull();
    canvas!.draw();
  });

  it("draw() early returns when dict/ranges are empty", async () => {
    const savedDict = dict.splice(0);
    const savedRanges = ranges.splice(0);
    const freshCanvas = document.createElement("music-canvas") as MusicCanvas;
    document.body.appendChild(freshCanvas);
    freshCanvas.draw();
    document.body.removeChild(freshCanvas);
    dict.push(...savedDict);
    ranges.push(...savedRanges);
  });

  it("draw() with playing=true hits FPS branch", async () => {
    expect(canvas).not.toBeNull();
    canvas!.playing = true;
    canvas!.oldTimeStamp = Date.now() - 100; // ensure > 0.01s passed
    canvas!.draw();
    canvas!.playing = false;
  });

  it("draw() with a specific voice part", async () => {
    expect(canvas).not.toBeNull();
    canvas!.voicePart = 2; // Tenor
    canvas!.bar = 10;
    canvas!.draw();
    canvas!.voicePart = "all";
  });

  it("seek() finds next section change", () => {
    expect(canvas).not.toBeNull();
    expect(canvas!.dict.length).toBeGreaterThan(0);
    const pos = { choir: 0, part: "all", bar: 1 };
    const next = canvas!.seek(pos, 1);
    expect(typeof next).toBe('number');
  });

  it("canvas click fires music-canvas-click event", async () => {
    expect(canvas).not.toBeNull();
    const promise = new Promise<void>(resolve => {
      canvas!.addEventListener("music-canvas-click", () => resolve(), { once: true });
    });

    canvas!.getBoundingClientRect = vi.fn(() => ({
      width: 1400, height: 400, top: 0, left: 0, right: 1400, bottom: 400, x: 0, y: 0, toJSON: () => ({})
    } as DOMRect));

    const mouseEvent = new MouseEvent("click", {
      bubbles: true, cancelable: true,
      clientX: 100, clientY: 50
    });
    Object.defineProperty(mouseEvent, 'offsetX', { value: 100 });
    Object.defineProperty(mouseEvent, 'offsetY', { value: 50 });

    canvas!.querySelector("canvas")!.dispatchEvent(mouseEvent);
    await promise;
  });

  it("canvas mousemove fires music-canvas-hover event", async () => {
    expect(canvas).not.toBeNull();
    const promise = new Promise<void>(resolve => {
      canvas!.addEventListener("music-canvas-hover", () => resolve(), { once: true });
    });

    canvas!.getBoundingClientRect = vi.fn(() => ({
      width: 1400, height: 400, top: 0, left: 0, right: 1400, bottom: 400, x: 0, y: 0, toJSON: () => ({})
    } as DOMRect));

    const mouseEvent = new MouseEvent("mousemove", {
      bubbles: true, cancelable: true,
      clientX: 200, clientY: 100
    });
    Object.defineProperty(mouseEvent, 'offsetX', { value: 200 });
    Object.defineProperty(mouseEvent, 'offsetY', { value: 100 });

    canvas!.querySelector("canvas")!.dispatchEvent(mouseEvent);
    await promise;
  });

  it("canvas touch events fire correctly", async () => {
    expect(canvas).not.toBeNull();

    const startPromise = new Promise<void>(resolve => {
      canvas!.addEventListener("music-canvas-touchstart", () => resolve(), { once: true });
    });

    canvas!.getBoundingClientRect = vi.fn(() => ({
      width: 1400, height: 400, top: 0, left: 0, right: 1400, bottom: 400, x: 0, y: 0, toJSON: () => ({})
    } as DOMRect));

    const innerCanvas = canvas!.querySelector("canvas")!;

    const touch = { clientX: 100, clientY: 50, identifier: 0, target: innerCanvas };
    const touchStart = new Event("touchstart", { bubbles: true, cancelable: true });
    Object.defineProperty(touchStart, 'targetTouches', { value: [touch] });
    Object.defineProperty(touchStart, 'preventDefault', { value: vi.fn() });

    innerCanvas.dispatchEvent(touchStart);
    await startPromise;

    const movePromise = new Promise<void>(resolve => {
      canvas!.addEventListener("music-canvas-touchmove", () => resolve(), { once: true });
    });
    const touchMove = new Event("touchmove", { bubbles: true, cancelable: true });
    Object.defineProperty(touchMove, 'targetTouches', { value: [touch] });
    Object.defineProperty(touchMove, 'preventDefault', { value: vi.fn() });
    canvas!.dispatchEvent(touchMove);
    await movePromise;

    const endPromise = new Promise<void>(resolve => {
      canvas!.addEventListener("music-canvas-touchend", () => resolve(), { once: true });
    });
    const touchEnd = new Event("touchend", { bubbles: true, cancelable: true });
    Object.defineProperty(touchEnd, 'preventDefault', { value: vi.fn() });
    canvas!.dispatchEvent(touchEnd);
    await endPromise;
  });

});
