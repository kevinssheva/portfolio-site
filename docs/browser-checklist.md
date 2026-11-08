# Browser verification checklist

These checks are pending local execution. The agent environment cannot host the preview or access the browser automation host. Unit tests cover selection logic, not actual browser event ordering, viewport layout, focus, or scrolling.

## Start the portfolio

```sh
nvm use
npm ci --include=dev
npm run check
npm run dev
```

Open <http://localhost:3000>. Keep `CONTENT_PREVIEW_DRAFTS` unset or false for public-content checks. Use your browser's responsive tools to check 1280×900, 1280×720, 390×844, and 320×700 viewports. Include a narrow viewport with increased text size or browser zoom.

## Navigation and scrolling

- [ ] On a fresh `/` load, Overview is active. On mobile, the profile above the README also belongs to Overview.
- [ ] Scroll down through the long Experience section. Experience remains active until the next section reaches the line below the sticky navigation; it does not switch based on how much of a large section is visible.
- [ ] Scroll slowly across section boundaries in both directions. The underline remains stable around tiny boundary movements, then switches after crossing the small tolerance.
- [ ] Scroll or drag rapidly between far-apart positions. The current section becomes active without stepping through skipped sections.
- [ ] Click all four tabs, including clicking the same hash again after manually scrolling away. Native scrolling reaches the intended section, the URL hash updates, and the matching tab activates.
- [ ] Near the document bottom, click Recognition. Its heading may not align exactly at the activation line because the browser cannot scroll farther; Recognition should still activate while its heading is visible. Resume manual scrolling: Recognition stays active through Education, Contact, and the footer.
- [ ] Visit fresh URLs ending in `#experience`, `#projects`, and `#recognition`. The correct heading is visible below the sticky bar and the intended tab activates. Visit `#education` or `#contact`: Recognition activates.
- [ ] Click Experience, Projects, and Recognition, then use Back and Forward. Restored anchor positions and visible content agree with the active state. Manual scrolling alone must not rewrite the hash or create browser history entries.
- [ ] Check cached Back navigation when the browser uses BFCache: click Experience, manually scroll to the secondary sections, follow the GitHub link, then return with Back. The restored bottom reading position should highlight Recognition despite the old Experience hash.
- [ ] Use Home, End, Page Up/Down, and arrow keys. Selection follows normal document scrolling, and End highlights Recognition at the final secondary sections.

## Mobile, layout, and accessibility

- [ ] With `portfolio-theme` removed from local storage, reload: light mode is the default even if the operating system uses dark mode. Activate the moon button beside the section tabs by keyboard and mouse; dark mode appears and its action label becomes "Switch to light mode". Switch back and confirm the reverse.
- [ ] Save dark mode and reload: dark colors should appear without an initial white flash or hydration warning. An invalid saved value falls back to light. With browser storage blocked, switching still works for the current page without errors.
- [ ] Check text, links, focus rings, Markdown/code, cards, borders, the orange active underline, and the original avatar in both themes. At 320px wide, the toggle stays visible while the tab row scrolls horizontally without document overflow. GitHub remains available in the profile and Contact section.
- [ ] At 390px and 320px wide, profile content sits above the README and no document-level horizontal scrollbar appears. Only the tab row, code blocks, or wide Markdown tables may scroll horizontally.
- [ ] Swipe the tab row horizontally. It stays usable without changing the vertical reading position. When scrolling the document changes the active tab, the selected tab becomes visible within the row without a vertical jump.
- [ ] At 1280×900, navigation and profile remain sticky during document scrolling. At 1280×720, the profile scrolls normally and all its links stay reachable. There is no separate vertically scrolling content column.
- [ ] Resize the viewport and increase text size/zoom. Sticky offsets follow the measured navigation height, headings are not obscured, and content still wraps.
- [ ] Use Tab and Shift+Tab to reach the skip link, navigation, profile links, project links when configured, Contact, and footer. Focus is visible; Enter activates ordinary links. Scrolling does not move keyboard focus.
- [ ] With a screen reader or inspector, only the active primary link has `aria-current="location"`; Education/Contact keep it on Recognition. Navigation remains a list of section links, not an ARIA tab widget.
- [ ] Disable JavaScript and reload. All content, links, and anchor scrolling still work in light mode; the theme toggle is hidden and automatic scrollspy is absent. Native hash underlining remains as a visual fallback.
- [ ] Enable reduced motion. There should be no animated backgrounds, forced smooth scrolling, or animated active indicator.
- [ ] Confirm missing email, LinkedIn, avatar, resume, repository, and demo fields create no broken links or placeholder buttons. Provisional metrics and Async Event Processor remain absent from public output.

Record the browser/version, viewport, date, and any failed steps before the release phase. Desktop/mobile screenshots can supplement these checks; they do not replace interaction verification.
