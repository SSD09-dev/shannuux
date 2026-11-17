import { describe, expect, it } from "vitest";
import { kissan } from "@/lib/kissan";

describe("Kissan project destination", () => {
  it("opens the supplied Kissan Agri Mall website", () => {
    expect(kissan.website.url).toBe("https://kissanagrimall.com/");
  });
});