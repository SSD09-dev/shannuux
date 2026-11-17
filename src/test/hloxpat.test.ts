import { describe, expect, it } from "vitest";
import { hloxpat } from "@/lib/hloxpat";

describe("HloXpat destinations", () => {
  it("opens the supplied Play Store app", () => {
    expect(hloxpat.links.find(link => link.kind === "app")?.url).toBe("https://play.google.com/store/apps/details?id=com.arfich.hloxpat&hl=en_IN");
  });
  it("opens the supplied website", () => {
    expect(hloxpat.links.find(link => link.kind === "website")?.url).toBe("https://www.hloxpat.com/");
  });
});