import { MusicCanvas } from '../ts/MusicCanvas';
import { MusicCanvasWatcher } from '../ts/MusicCanvasWatcher';

MusicCanvas.define("music-canvas");
MusicCanvasWatcher.define("music-canvas-watcher");

describe("MusicCanvasWatcher custom element", () => {
  let watcher: MusicCanvasWatcher | null;

  beforeEach(() => {
    document.body.innerHTML = `<music-canvas></music-canvas><music-canvas-watcher></music-canvas-watcher>`;
    watcher = document.querySelector("music-canvas-watcher");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates output spans on connection", () => {
    expect(watcher).not.toBeNull();
    expect(watcher?.querySelector("#choir-output")).not.toBeNull();
    expect(watcher?.querySelector("#part-output")).not.toBeNull();
    expect(watcher?.querySelector("#bar-output")).not.toBeNull();
  });

  it("handleCanvasHover updates display and shows watcher", () => {
    expect(watcher).not.toBeNull();
    
    const canvas = document.querySelector("music-canvas");
    expect(canvas).not.toBeNull();
    
    const event = new CustomEvent("music-canvas-hover", {
      detail: { position: { choir: 2, part: 1, bar: 42.5 } }
    });
    
    canvas!.dispatchEvent(event);
    
    const choirOutput = watcher!.querySelector("#choir-output");
    const partOutput = watcher!.querySelector("#part-output");
    const barOutput = watcher!.querySelector("#bar-output");
    
    expect(choirOutput?.textContent).toBe("Choir 3");
    expect(partOutput?.textContent).toBe("Alto");
    expect(barOutput?.textContent).toBe("Bar 42");
    expect(watcher!.classList.contains("hide")).toBe(false);
  });

  it("handleCanvasHover hides part output for 'all' parts", () => {
    expect(watcher).not.toBeNull();
    
    const canvas = document.querySelector("music-canvas");
    expect(canvas).not.toBeNull();
    
    const event = new CustomEvent("music-canvas-hover", {
      detail: { position: { choir: 0, part: "all", bar: 10 } }
    });
    
    canvas!.dispatchEvent(event);
    
    const partOutput = watcher!.querySelector("#part-output");
    expect(partOutput?.textContent).toBe("");
  });
});
