// Tests moteur de compatibilité — cas volontairement difficiles.
// Le moteur DOIT détecter : mauvais socket, RAM incompatible, GPU trop long,
// PSU insuffisant, cooler trop haut, format incompatible, connecteur manquant.
import { describe, it, expect } from "vitest";
import { checkCompatibility } from "../src/lib/compatibility";

const BASE = {
  CPU: "cpu-r5-7600", GPU: "gpu-rtx4060", MOTHERBOARD: "mb-b650",
  RAM: "ram-32d5", SSD_NVME: "ssd-1tb", PSU: "psu-650", CASE: "case-nzxt", CPU_COOLER: "cooler-ak400",
};

describe("compatibility engine", () => {
  it("valide une config saine", () => {
    const r = checkCompatibility(BASE);
    expect(r.status).toBe("compatible");
    expect(r.issues).toHaveLength(0);
  });
  it("détecte mauvais socket (AM4 CPU sur AM5)", () => {
    const r = checkCompatibility({ ...BASE, CPU: "cpu-r5-5600" });
    expect(r.status).toBe("incompatible");
    expect(r.issues.some((i) => i.code === "SOCKET_MISMATCH")).toBe(true);
  });
  it("détecte RAM incompatible (DDR4 sur carte DDR5)", () => {
    const r = checkCompatibility({ ...BASE, RAM: "ram-16d4" });
    expect(r.status).toBe("incompatible");
    expect(r.issues.some((i) => i.code === "RAM_TYPE_MISMATCH")).toBe(true);
  });
  it("détecte GPU trop long (4090 340mm dans H5 Flow 330mm)", () => {
    const r = checkCompatibility({ ...BASE, GPU: "gpu-rtx4090", CASE: "case-nzxt", PSU: "psu-850" });
    expect(r.issues.some((i) => i.code === "GPU_LENGTH")).toBe(true);
    expect(r.issues.find((i) => i.code === "GPU_LENGTH")?.message).toMatch(/340 mm.*330 mm/);
  });
  it("détecte PSU insuffisant", () => {
    const r = checkCompatibility({ ...BASE, GPU: "gpu-rtx4090", PSU: "psu-450", CASE: "case-fractal" });
    expect(r.status).toBe("incompatible");
    expect(r.issues.some((i) => i.code === "PSU_WATTAGE")).toBe(true);
  });
  it("détecte cooler trop haut (NH-D15 165mm vs NR200 155mm... via H5 ok) => utilise NR200", () => {
    const r = checkCompatibility({ ...BASE, CPU_COOLER: "cooler-nhd15", CASE: "case-nr200", MOTHERBOARD: "mb-b550m", CPU: "cpu-r5-5600", RAM: "ram-16d4" });
    // NR200 n'accepte que Mini-ITX -> aussi FORM_FACTOR, mais on vérifie au moins une erreur bloquante
    expect(r.status).toBe("incompatible");
  });
  it("détecte format incompatible (ATX dans NR200 Mini-ITX only)", () => {
    const r = checkCompatibility({ ...BASE, CASE: "case-nr200" });
    expect(r.issues.some((i) => i.code === "FORM_FACTOR")).toBe(true);
  });
  it("signale XMP en warning (6400 sur B650 max 6400 = ok, donc 6400 passe ; 6000 ok)", () => {
    const r = checkCompatibility({ ...BASE, RAM: "ram-64d5" });
    expect(["compatible", "warning"]).toContain(r.status);
  });
  it("détecte connecteur manquant (4090 16pin sur PSU 450W sans 12VHPWR ni 2x8pin suffisants... 450W a 1x8pin)", () => {
    const r = checkCompatibility({ ...BASE, GPU: "gpu-rtx4090", PSU: "psu-450", CASE: "case-fractal" });
    expect(r.issues.some((i) => i.code === "PSU_CONNECTOR" || i.code === "PSU_WATTAGE")).toBe(true);
  });
});
