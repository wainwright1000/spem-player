import { toNum, getBarFromTime, getTimeFromBar } from '../ts/common';

describe("common", () => {
  it("toNum() converts string and numbers as expected", () => {
    var result = toNum(1);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(1);

    result = toNum("1");
    expect(result).toBeTypeOf('number');
    expect(result).toBe(1);

    expect(toNum(0, true)).toBe(0);
    expect(toNum(0.2, true)).toBe(0);
    expect(toNum(0.2, false)).toBe(0.2);
    expect(toNum(-1, true)).toBe(-1);
    expect(toNum("1.2", false)).toBe(1.2);
    expect(toNum("1.2", true)).toBe(1);
    expect(toNum("1.2", true, 7)).toBe(1);
    expect(toNum("7.2", false, 7)).toBe(7);
    expect(toNum("7.2", true, 7)).toBe(7);
    expect(toNum("10.999999958333332", true)).toBe(11);
  });

  it("getBarFromTime() converts time to bar as expected for ALC audio", () => {
    var result = getBarFromTime(0, 0);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
    
    result = getBarFromTime(4.3, 0);
    expect(result).toBeTypeOf('number');
    expect(Math.floor(result)).toBe(1);
    
    result = getBarFromTime(200, 0);
    expect(Math.floor(result)).toBe(55);
    
    result = getBarFromTime(1000, 0);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
  });

  it("getBarFromTime() converts time to bar as expected for CotE audio", () => {
    var result = getBarFromTime(0, 1);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
    
    result = getBarFromTime(4.3, 1);
    expect(result).toBeTypeOf('number');
    expect(Math.floor(result)).toBe(1);
    
    result = getBarFromTime(200, 1);
    expect(Math.floor(result)).toBe(51);
    
    result = getBarFromTime(1000, 1);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
  });

  it("getTimeFromBar() converts bar to time as expected for ALC", () => {
    var result = getTimeFromBar(0, 0);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
    
    result = getTimeFromBar(1, 0);
    expect(result).toBeTypeOf('number');
    expect(result).toBeCloseTo(2.5); // ALC

    result = getTimeFromBar(65, 0);
    expect(result).toBeTypeOf('number');
    expect(result).toBeCloseTo(234.5); // ALC

    result = getTimeFromBar(140, 0);
    expect(result).toBe(0);
  });

  it("getTimeFromBar() converts bar to time as expected for CotE", () => {
    var result = getTimeFromBar(0, 1);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
    
    result = getTimeFromBar(1, 1);
    expect(result).toBeTypeOf('number');
    expect(result).toBeCloseTo(4.2); // CotE

    result = getTimeFromBar(65, 1);
    expect(result).toBeTypeOf('number');
    expect(result).toBeCloseTo(252);  // CotE

    result = getTimeFromBar(140, 1);
    expect(result).toBe(0);
  });


})
