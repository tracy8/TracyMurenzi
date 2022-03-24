const {generateMeterNumber,getTokenExpirationDate,validateUUID,getDaysDifference} = require("../../app/utils/imports");

describe("generateMeterNumber function", () => {
    it("Should return a six digit number", () => {
        expect(generateMeterNumber()).toBeGreaterThanOrEqual(100000);
    });
});

describe("getTokenExpirationDate function", () => {
    it("Should return the date of tomorrow", () => {
        expect(getTokenExpirationDate(100).getTime()).toBeGreaterThan(new Date().getTime());
    });
});

describe("validateUUID function", () => {
    it("Should return false", () => {
        expect(validateUUID("this-is-not-uuid")).toBe(false);
    });
});

describe("getDaysDifference function", () => {
    it("Should return 10", () => {
        const date = new Date()
        expect(getDaysDifference(new Date(date.setDate(date.getDate()+10)))).toBe(10);
    });
});