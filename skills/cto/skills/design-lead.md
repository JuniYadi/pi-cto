# Design Lead — Frontend & UX Thinking

Use when reviewing UI, planning frontend architecture, evaluating design decisions, or assessing user experience.

## Protocol

```
INPUT:  (UI, frontend feature, design question, or UX issue)
  ↓
STEP 1: USER JOB      → What job is the user trying to get done on this screen?
STEP 2: LAYOUT        → Is the information hierarchy clear? Can user find primary action in 2s?
STEP 3: INTERACTION   → How many clicks/steps to complete the job? Is it intuitive?
STEP 4: STATE         → What happens during loading, error, empty, and success states?
STEP 5: ACCESSIBILITY → Can everyone use this? (keyboard, screen reader, color blind, mobile)
STEP 6: PERFORMANCE   → Will this feel fast? (Core Web Vitals, bundle size, rendering)
STEP 7: CONSISTENCY   → Does this match existing patterns? (design system, conventions)
```

## UI/UX Checklist

### Layout & Hierarchy
- [ ] Primary action is obvious within 2 seconds
- [ ] Information hierarchy guides the eye (H1 → body → CTA)
- [ ] White space used intentionally (not crammed)
- [ ] Responsive: works on mobile, tablet, desktop
- [ ] No visual clutter — every element earns its place

### Interaction Design
- [ ] Minimum clicks to complete the job
- [ ] Affordances are clear (buttons look clickable, inputs look editable)
- [ ] Feedback on every action (loading, success, error)
- [ ] Undo available for destructive actions
- [ ] Keyboard navigation works (Tab, Enter, Escape)

### State Management (UI States)
- [ ] Loading state: skeleton/spinner, not blank
- [ ] Empty state: helpful message + call to action
- [ ] Error state: what happened + what to do next
- [ ] Success state: confirmation + next step
- [ ] Partial state: progressive loading where appropriate

## Accessibility (WCAG 2.1 AA)

- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Color contrast ratio ≥ 4.5:1 (text), ≥ 3:1 (large text)
- [ ] Images have alt text (or decorative images marked decorative)
- [ ] Form inputs have associated labels
- [ ] Error messages are associated with inputs (aria-describedby)
- [ ] Dynamic content announced to screen readers (aria-live)
- [ ] Page has logical heading hierarchy (h1 → h2 → h3)
- [ ] Skip navigation link present for long pages

## Frontend Architecture

### Component Design
- [ ] Single Responsibility: one component = one job
- [ ] Composition over inheritance
- [ ] Props are minimal and typed (no prop drilling > 2 levels)
- [ ] State is local where possible, global only when needed
- [ ] Components are testable in isolation

### Performance
- [ ] Bundle size reasonable (code split, lazy load)
- [ ] Images optimized (WebP, responsive, lazy loaded)
- [ ] No unnecessary re-renders
- [ ] Critical CSS inlined, rest deferred
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

## Validation

- [ ] USER-FIRST: User's job is completable on this screen
- [ ] KISS: Simplest UI that achieves the goal
- [ ] Accessibility: WCAG 2.1 AA minimum
- [ ] Performance: Core Web Vitals targets met
- [ ] Consistency: Matches existing design system patterns
- [ ] States: Loading, error, empty, success all handled
