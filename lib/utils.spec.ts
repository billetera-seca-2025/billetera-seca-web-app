import { cn, formatCurrency } from "./utils";

describe("cn utility function", () => {
    it("should combine classes correctly", () => {
        const result = cn("btn", "btn-primary");
        expect(result).toBe("btn btn-primary");
    });

    it("should handle empty, null or undefined values", () => {
        const result = cn("btn", undefined, null, "", "btn-primary");
        expect(result).toBe("btn btn-primary");
    });
});

describe("formatCurrency utility function", () => {
    it("should format numbers as ARS currency", () => {
        const result = formatCurrency(12345.67);
        expect(result).toBe("$ 12.345,67");
    });

    it("should add decimals to integers", () => {
        const result = formatCurrency(1000);
        expect(result).toBe("$ 1.000,00");
    });

    it("should format negative numbers correctly", () => {
        const result = formatCurrency(-500.5);
        expect(result).toBe("-$ 500,50");
    });
});