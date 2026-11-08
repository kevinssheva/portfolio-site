import assert from "node:assert/strict";
import { test } from "node:test";
import { navigationSectionId, pageShowAnchor, selectSection } from "./select-section";

const viewport = { activationLine: 80, viewportHeight: 900, scrollY: 1000, documentHeight: 5000 };
const sections = [
  { id: "overview", top: -1600 },
  { id: "experience", top: -1100 },
  { id: "projects", top: 100 },
  { id: "recognition", top: 450 },
  { id: "education", top: 800 },
  { id: "contact", top: 1000 },
];

test("empty content has no selection; the profile before the README belongs to Overview", () => {
  assert.equal(selectSection([], viewport), null);
  assert.equal(selectSection([{ id: "overview", top: 700 }, { id: "experience", top: 1200 }], viewport), "overview");
});

test("a long experience section remains selected until the next heading crosses the activation line", () => {
  assert.equal(selectSection(sections, viewport), "experience");
  assert.equal(selectSection(sections.map((section) => ({ ...section, top: section.top - 40 })), viewport), "projects");
});

test("fast jumps in either direction select the current section without visiting intermediate tabs", () => {
  const jumpedDown = sections.map((section) => ({ ...section, top: section.top - 400 }));
  assert.equal(selectSection(jumpedDown, { ...viewport, previousId: "overview" }), "recognition");
  const jumpedUp = sections.map((section) => ({ ...section, top: section.top + 1700 }));
  assert.equal(selectSection(jumpedUp, { ...viewport, previousId: "recognition" }), "overview");
});

test("small boundary movements do not flicker between adjacent sections", () => {
  const at = (top: number) => [{ id: "overview", top: -500 }, { id: "experience", top }];
  assert.equal(selectSection(at(78), { ...viewport, previousId: "overview" }), "overview");
  assert.equal(selectSection(at(75), { ...viewport, previousId: "overview" }), "experience");
  assert.equal(selectSection(at(82), { ...viewport, previousId: "experience" }), "experience");
  assert.equal(selectSection(at(85), { ...viewport, previousId: "experience" }), "overview");
});

test("the measured sticky offset changes the activation boundary", () => {
  assert.equal(selectSection(sections, { ...viewport, activationLine: 120 }), "projects");
});

test("a clicked or restored anchor at the exact boundary overrides hysteresis", () => {
  const aligned = [{ id: "overview", top: -500 }, { id: "experience", top: 80 }];
  assert.equal(selectSection(aligned, { ...viewport, previousId: "overview", anchorId: "experience" }), "experience");
});

test("a visible anchor still selects Recognition when the browser clamps scrolling at the bottom", () => {
  const clamped = [
    { id: "projects", top: -200 }, { id: "recognition", top: 200 },
    { id: "education", top: 500 }, { id: "contact", top: 700 },
  ];
  const bottom = { ...viewport, scrollY: 4100 };
  assert.equal(selectSection(clamped, { ...bottom, anchorId: "recognition" }), "recognition");
  assert.equal(selectSection(clamped, bottom), "contact");
});

test("an old or offscreen hash cannot override the section now being read", () => {
  assert.equal(selectSection(sections, { ...viewport, anchorId: "overview" }), "experience");
  assert.equal(selectSection(sections, { ...viewport, anchorId: "contact" }), "experience");
  assert.equal(selectSection(sections, { ...viewport, anchorId: "unknown" }), "experience");
});

test("Education and Contact remain distinct tracked sections", () => {
  assert.equal(selectSection(sections.map((section) => ({ ...section, top: section.top - 750 })), viewport), "education");
  assert.equal(selectSection(sections.map((section) => ({ ...section, top: section.top - 950 })), viewport), "contact");
});

test("Recognition stays active through secondary sections and the document bottom", () => {
  for (const offset of [400, 750, 950]) {
    const selected = selectSection(sections.map((section) => ({ ...section, top: section.top - offset })), viewport);
    assert.equal(navigationSectionId(selected), "recognition");
  }
  assert.equal(navigationSectionId(selectSection(sections, { ...viewport, scrollY: 4100 })), "recognition");
  assert.equal(navigationSectionId(selectSection(sections, viewport)), "experience");
  assert.equal(navigationSectionId("overview"), "overview");
  assert.equal(navigationSectionId("projects"), "projects");
  assert.equal(navigationSectionId(null), null);
});

test("the document bottom selects the final section, tolerating fractional scroll positions", () => {
  assert.equal(selectSection(sections, { ...viewport, scrollY: 4098.5 }), "contact");
  assert.equal(selectSection(sections.slice(0, 4), { ...viewport, scrollY: 4100 }), "recognition");
});

test("a page fitting entirely in the viewport does not jump to its last section", () => {
  assert.equal(selectSection([{ id: "overview", top: 100 }, { id: "contact", top: 600 }], {
    ...viewport, documentHeight: 900, scrollY: 0,
  }), "overview");
});

test("BFCache restoration preserves dismissed anchor intent instead of reactivating a stale hash", () => {
  const anchorId = pageShowAnchor("#recognition", null, true);
  assert.equal(anchorId, null);
  assert.equal(selectSection([
    { id: "recognition", top: 200 }, { id: "education", top: 500 }, { id: "contact", top: 700 },
  ], { ...viewport, scrollY: 4100, anchorId }), "contact");
  assert.equal(pageShowAnchor("#recognition", "recognition", true), "recognition");
  assert.equal(pageShowAnchor("#experience", null, false), "experience");
});
