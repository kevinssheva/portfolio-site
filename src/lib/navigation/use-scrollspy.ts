"use client";

import { useEffect, useRef, useState } from "react";
import { pageShowAnchor, selectSection } from "./select-section";

const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

export function useScrollspy() {
  const navigationRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<{ sectionId: string | null; ready: boolean }>({ sectionId: null, ready: false });

  useEffect(() => {
    const navigation = navigationRef.current;
    const main = document.getElementById("main-content");
    if (!navigation || !main) return;
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue("--navigation-height");
    let previousId: string | null = null;
    let anchorId: string | null = window.location.hash.slice(1) || null;
    let restoringCachedPage = false;
    let frame: number | undefined;
    let stopped = false;

    function update() {
      frame = undefined;
      if (stopped) return;
      const navigationBox = navigation!.getBoundingClientRect();
      const height = `${navigationBox.height}px`;
      if (root.style.getPropertyValue("--navigation-height") !== height) root.style.setProperty("--navigation-height", height);
      const offset = Number.parseFloat(window.getComputedStyle(main!).scrollMarginTop) || navigationBox.height + 24;
      const sections = Array.from(main!.querySelectorAll<HTMLElement>(".portfolio-section"), (section) => ({
        id: section.id, top: section.getBoundingClientRect().top,
      }));
      const sectionId = selectSection(sections, {
        activationLine: navigationBox.top + offset,
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY,
        documentHeight: root.scrollHeight,
        previousId,
        anchorId,
      });
      if (sectionId !== anchorId) anchorId = null;
      previousId = sectionId;
      restoringCachedPage = false;
      setState((current) => current.ready && current.sectionId === sectionId ? current : { sectionId, ready: true });
    }

    function schedule() {
      if (!stopped && frame === undefined) frame = window.requestAnimationFrame(update);
    }
    function restoreAnchor() {
      // popstate can follow pageshow in the same cached restoration.
      if (!restoringCachedPage) anchorId = window.location.hash.slice(1) || null;
      schedule();
    }
    function onPageShow(event: PageTransitionEvent) {
      restoringCachedPage = event.persisted;
      anchorId = pageShowAnchor(window.location.hash, anchorId, event.persisted);
      schedule();
    }
    function clearAnchor() {
      anchorId = null;
      schedule();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (scrollKeys.has(event.key)) clearAnchor();
    }
    function onWheel(event: WheelEvent) {
      if (event.deltaY !== 0 && !event.shiftKey) clearAnchor();
    }
    function onPointerDown(event: PointerEvent) {
      // Browsing the horizontal tab row does not change the reading position.
      if (!(event.target instanceof Node) || !navigation!.contains(event.target)) clearAnchor();
    }
    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a.section-link") : null;
      if (link) {
        anchorId = link.hash.slice(1);
        schedule();
      }
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(navigation);
    observer.observe(main);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", restoreAnchor);
    window.addEventListener("popstate", restoreAnchor);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("load", restoreAnchor);
    // User input ends anchor intent; these never prevent native scrolling or focus.
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    navigation.addEventListener("click", onAnchorClick);
    schedule();

    return () => {
      stopped = true;
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", restoreAnchor);
      window.removeEventListener("popstate", restoreAnchor);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("load", restoreAnchor);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      navigation.removeEventListener("click", onAnchorClick);
      if (previousHeight) root.style.setProperty("--navigation-height", previousHeight);
      else root.style.removeProperty("--navigation-height");
    };
  }, []);

  useEffect(() => {
    if (!state.ready || !state.sectionId) return;
    const list = navigationRef.current?.querySelector<HTMLElement>(".section-links");
    const active = list?.querySelector<HTMLAnchorElement>('a[aria-current="location"]');
    if (!list || !active) return;
    const listBox = list.getBoundingClientRect();
    const linkBox = active.getBoundingClientRect();
    if (linkBox.left < listBox.left) list.scrollBy({ left: linkBox.left - listBox.left - 8, behavior: "auto" });
    else if (linkBox.right > listBox.right) list.scrollBy({ left: linkBox.right - listBox.right + 8, behavior: "auto" });
  }, [state.ready, state.sectionId]);

  return { navigationRef, ...state };
}
