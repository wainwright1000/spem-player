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

  it("getBarFromTime() converts time to bar as expected", () => {
    var result = getBarFromTime(0);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
    
    result = getBarFromTime(4.3);
    expect(result).toBeTypeOf('number');
    expect(Math.floor(result)).toBe(1);
    
    result = getBarFromTime(1000);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
  });

  it("getTimeFromBar() converts bar to time as expected", () => {
    var result = getTimeFromBar(0);
    expect(result).toBeTypeOf('number');
    expect(result).toBe(0);
    
    result = getTimeFromBar(1);
    expect(result).toBeTypeOf('number');
    expect(result).toBeCloseTo(2.5, 1);

    result = getTimeFromBar(65);
    expect(result).toBeTypeOf('number');
    expect(result).toBeCloseTo(234.5, 1);

    result = getTimeFromBar(140);
    expect(result).toBe(0);
  });



})
