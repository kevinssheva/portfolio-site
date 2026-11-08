export type SectionPosition = { id: string; top: number };

type ViewportPosition = {
  activationLine: number;
  viewportHeight: number;
  scrollY: number;
  documentHeight: number;
  previousId?: string | null;
  anchorId?: string | null;
};

const boundaryTolerance = 4;

export function navigationSectionId(sectionId: string | null): string | null {
  return sectionId === "education" || sectionId === "contact" ? "recognition" : sectionId;
}

export function pageShowAnchor(hash: string, currentAnchor: string | null, persisted: boolean): string | null {
  return persisted ? currentAnchor : hash.slice(1) || null;
}

// Positions are viewport coordinates in document order, including secondary sections.
export function selectSection(sections: SectionPosition[], position: ViewportPosition): string | null {
  if (sections.length === 0) return null;
  const atBottom = position.documentHeight > position.viewportHeight + 2
    && position.documentHeight - position.scrollY - position.viewportHeight <= 2;
  const anchor = sections.find((section) => section.id === position.anchorId);

  // A short section can be a valid clicked/hash target even when the browser
  // cannot scroll far enough to place its heading at the activation line.
  if (anchor && anchor.top >= position.activationLine - boundaryTolerance
    && anchor.top < position.viewportHeight
    && (atBottom || anchor.top <= position.activationLine + boundaryTolerance)) {
    return anchor.id;
  }
  if (atBottom) return sections[sections.length - 1].id;

  let index = 0;
  sections.forEach((section, sectionIndex) => {
    if (section.top <= position.activationLine) index = sectionIndex;
  });
  const previousIndex = sections.findIndex((section) => section.id === position.previousId);
  if (previousIndex >= 0) {
    if (index === previousIndex + 1 && sections[index].top > position.activationLine - boundaryTolerance) {
      return sections[previousIndex].id;
    }
    if (index === previousIndex - 1 && sections[previousIndex].top < position.activationLine + boundaryTolerance) {
      return sections[previousIndex].id;
    }
  }
  return sections[index].id;
}
