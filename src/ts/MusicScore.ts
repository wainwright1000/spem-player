// Copyright (c) 2024 Mark Wainwright
// SPDX-License-Identifier: MIT

import config from "./config";
import { colors, toNum } from "./common";

import { MusicElement } from "./MusicElement";

export class MusicScore extends MusicElement {
  static observedAttributes = ["choir", "part", "bar", "playing", "score-type"];

  svg: SVGGraphicsElement | null = null;
  svgWidth: number = 0;
  svgHeight: number = 0;

  scoreType: string = "modern";
  recording: number = 0; // 0 = ALC, 1 = CotE

  bars: number[] = [];

  highlightBar: SVGRectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  highlightPosition: SVGRectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();

    this.highlightPosition.setAttribute("id", "hPos");
    this.highlightPosition.setAttribute("x", "0");
    this.highlightPosition.setAttribute("y", "0");
    this.highlightPosition.setAttribute("width", "7");
    this.highlightPosition.setAttribute("height", "0"); // Will be set later when we know the height of the SVG
    this.highlightPosition.style.fill = colors().scoreHighlight; //Set stroke colour
    this.highlightPosition.style.fillOpacity = "0"; // initially invisible
    this.highlightPosition.style.strokeWidth = "5px"; //Set stroke width

    this.highlightBar.setAttribute("id", "hBar");
    this.highlightBar.setAttribute("x", "0");
    this.highlightBar.setAttribute("width", "0");
    this.highlightBar.setAttribute("height", "0"); // Will be set later when we know the height of the SVG
    this.highlightBar.style.fill = colors().scoreHighlight; //Set stroke colour
    this.highlightBar.style.fillOpacity = "0"; // initially invisible
    this.highlightBar.style.strokeWidth = "5px"; //Set stroke width

    this.addEventListener("click", this.scoreClicked);
    this.addEventListener("wheel", this.#preventVerticalScroll, {
      passive: false,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("wheel", this.#preventVerticalScroll);
  }

  #preventVerticalScroll = (e: WheelEvent) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
    }
  };

  async attributeChangedCallback(
    name: string,
    _oldValue: string,
    newValue: string
  ) {
    if (name == "score-type") {
      this.setScoreType(newValue);
    } else {
      super.attributeChangedCallback(name, _oldValue, newValue);
    }
  }

  scoreClicked(e: MouseEvent) {
    if (!this.svg) return;

    var pt: DOMPoint = new DOMPoint(e.clientX, e.clientY);

    // The cursor point, translated into svg coordinates
    const m = this.svg.getScreenCTM();
    var cursorpt = pt.matrixTransform(m?.inverse());

    var result = this.bars.find((x) => x > cursorpt.x);
    if (result) {
      this.setBar(this.bars.indexOf(result));
      this.fireEvent("music-score-click");
    }
  }

  #loadSvg = async (): Promise<string | null> => {
    try {
      const choirName = config.choirs[this.recording][this.choir];
      const svgModule = await import(
        `../scores/Hugh Keyte/${this.scoreType}/Choir ${choirName}.svg?raw`
      );
      this.fireEvent("music-score-loaded");
      return svgModule.default;
    } catch (error) {
      console.error(`Error loading SVG: ${error}`);
      return null;
    }
  };

  async #loadScore() {
    const svgComp = await this.#loadSvg();
    if (svgComp) {
      this.innerHTML = svgComp;
    }
    this.svg = document.querySelector("music-score svg");

    if (!this.svg) {
      console.error("Could not load score for choir " + (this.choir + 1));
      return;
    }

    var viewBoxString = this.svg.getAttribute("viewBox");
    const viewBoxParts = viewBoxString?.split(" ") ?? [];
    this.svgWidth = Number(viewBoxParts[2]);
    this.svgHeight = Number(viewBoxParts[3]);

    this.highlightPosition.setAttribute("height", String(this.svgHeight));
    this.highlightBar.setAttribute("height", String(this.svgHeight));
    this.svg.prepend(this.highlightPosition);
    this.svg.prepend(this.highlightBar);

    // determine what the bar positions are for this score
    this.bars = this.getBars();

    // Highlight and scroll to the current bar
    this.highlight();
    this.scrollSmooth();
  }

  async setChoir(c: string | number) {
    super.setChoir(c);

    // load the correct score for this choir
    await this.#loadScore();

    // set the border color to match
    this.style.borderColor = `hsla(${colors().choir[this.choir]}, 80%, 55%, 1)`;
  }

  setBar(b: string | number) {
    super.setBar(b);

    // scroll smootlhy and highlight the current position
    this.highlight();
    this.scrollSmooth();
  }

  setPlaying(p: string | boolean) {
    super.setPlaying(p);

    this.highlight();
  }

  scrollSmooth() {
    if (this.svg == null) {
      return 0;
    }
    // we can't scroll past the last bar for this choir
    var intbar = toNum(this.bar, true, this.bars.length);
    const idealBarPercentage = 0.25;
    const frameWidth = this.offsetWidth; // the width of the visible score on the screen
    const scoreWidth = this.svg.getBoundingClientRect().width; // the total width of the score
    const barstartpct = intbar <= 0 ? 0 : this.bars[intbar - 1] / this.svgWidth; // % along the score of this bar
    const barendpct =
      intbar >= this.bars.length ? 1 : this.bars[intbar] / this.svgWidth; // % along the score of the next bar
    const barcurrentpct =
      (this.bar - intbar) * (barendpct - barstartpct) + barstartpct; // % along the score of current position in the bar
    const idealPos =
      barcurrentpct * scoreWidth - idealBarPercentage * frameWidth;

    this.scrollTo({
      top: 0,
      left: idealPos,
      behavior: "instant",
    });

    // set highlight the current position
    if (this.bar >= 1) {
      this.highlightPosition.setAttribute(
        "x",
        String(barcurrentpct * this.svgWidth - 2.5)
      );
    }

    // set the highlight for the current bar
    var left, width;
    if (intbar < 1) {
      left = 0;
      width = 0;
    } else if (intbar >= this.bars.length - 1) {
      left = this.bars[this.bars.length - 2];
      width = this.bars[this.bars.length - 1] - left;
    } else {
      left = this.bars[intbar - 1];
      width = this.bars[intbar] - left;
    }
    this.highlightBar.setAttribute("x", String(left));
    this.highlightBar.setAttribute(
      "width",
      String(isNaN(width) ? this.svgWidth : width)
    );
  }

  highlight() {
    if (this.playing) {
      this.highlightPosition.style.fillOpacity = this.bar > 1 ? "0.1" : "0";
      this.highlightBar.style.fillOpacity = "0";
      this.style.overflow = "hidden"; // hide the scroll bar while playing
    } else {
      this.highlightBar.style.fillOpacity = "0.1";
      this.highlightPosition.style.fillOpacity = "0";
      this.style.overflow = "auto";
    }
  }

  async setScoreType(s: string) {
    this.scoreType = s;
    if (config.scores.indexOf(s) < 0) {
      this.scoreType = config.scores[0];
    }
    await this.#loadScore();
  }

  // Lilypond (currently) outputs SVG with bar numbers looking as follows.  The x position
  // of the translate is the beginning of each bar as long as the <tspan> contains a number
  // rather than lyrics.  Also, a pain in the arse: the tenor clef contains a <tspan>8</tspan>
  // underneath the treble clef, so we don't want that.
  //
  // <g transform="translate(164.5950, 2.8265)">
  //   <text font-family="serif" font-size="1.7461" text-anchor="start" fill="currentColor">
  //     <tspan>9</tspan>
  //   </text>
  // </g>
  getBars() {
    if (!this.svg) return [];
    var bars: number[] = [...this.svg.querySelectorAll("tspan")] // get all the tspans the SVG element
      .filter((tspan) => !isNaN(Number(tspan.innerHTML))) // keep only those containing a bar number
      .map((tspan) => {
        // e.g. transform = "translate(137.1800, 2.8299)"
        if (!tspan.parentElement || !tspan.parentElement.parentElement)
          return 0;
        const translate =
          tspan.parentElement.parentElement.getAttribute("transform");
        if (!translate) return 0;
        const commaPos = translate.indexOf(",");
        const x = Number(translate.substring(10, commaPos));
        return x;
      })
      .sort((a, b) => a - b) // sort numerically
      .filter((bar) => bar > 6); // any supposed bars that are too close to the beginning
    // of the score are probably part of the tenor clef and not proper bar numbers
    bars.unshift(0); // Add the initial bar line
    bars.push(this.svgWidth); // Add the final bar line
    return bars;
  }
}
