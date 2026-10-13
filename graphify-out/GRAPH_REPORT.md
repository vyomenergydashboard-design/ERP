# Graph Report - ERP  (2026-10-13)

## Corpus Check
- 150 files · ~2,436,286 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 5, .pptx 5, .exe 1)

## Summary
- 1806 nodes · 3709 edges · 108 communities (101 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 101 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ae14ab2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- planningData.js
- AllOrdersTableView.jsx
- db.js
- Masters.jsx
- index.js
- react
- server/package.json
- Database Connection & Migrations
- adapt.native.md
- PlanningModule.jsx
- test_design_confirmation.js
- Startup Synchronization & Serials
- onAnnotDown
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point
- deriveUnitStatus
- bolder.md
- verify_codebase.js
- Spec: Design Department Confirmation Gate & Dynamic Release Documents Status
- Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents
- dependencies
- modern-screenshot.umd.js
- Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)
- live-browser.js
- renderDesignVisual
- Persuade and Experience
- connectSSE
- live.md
- Design System: Vyom ERP
- adapt.md
- new-work.md
- handleManualEditActivity
- App.jsx
- mountSvelteComponentVariant
- pg
- onboard.md
- Design Specification: Preserve Completed Panels in Previous Departments
- initGlobalBar
- SKILL.md
- The Toolkit
- setLiveState
- syncEditBadgeHitProxies
- resolveLiveInjectionAnchor
- createLiveBrowserSessionState
- actOnAgentTarget
- OrderDocumentsModal.jsx
- el
- createLiveBrowserDomHelpers
- animate.md
- Handle `generate`
- initPageChat
- Vyom ERP — Comprehensive Project Audit & Development Process Documentation
- Generate Report
- Responsive Design
- DeptWorklist.jsx
- New visual work
- optimize.md
- Design Critique: Task Masters & Modal Interface (`src/components/Masters.jsx`)
- Impeccable Asset Producer
- Scan mode (approach C: auto-extract, then confirm descriptive language)
- startVariantObserver
- critique.md
- Simplify the Design
- Hardening Dimensions
- 2026-10-07T05-46-44Z__src-components-allorderstableview-jsx.md
- 2026-10-07T06-10-21Z__darkmode.md
- Product
- clarify.md
- Nielsen's 10 Heuristics
- document.md
- polish.md
- quieter.md
- 2026-10-08T11-51-14Z__src-index-css.md
- Extract Flow
- Generate Combined Critique Report
- Init flow
- scheduleAcceptCleanup
- Common Cognitive Load Violations
- iOS platform
- Operate mode depth (and Read notes)
- Shape
- handleInsertCreate
- captureElementToBlob
- Android platform
- colorize.md
- Persona-Based Design Testing
- doctor.md
- Impeccable Documenter
- ErrorBoundary
- Generate Report
- Cognitive Load Assessment
- Impeccable Finish Reviewer
- Impeccable Manual Edit Applier
- live-browser-ignores.js
- Diagnostic Scan
- showToast
- Visualize: Direction Comps & Asset Production
- impeccable
- Implementation Plan: Resilient & Dynamic Task Masters Lifecycle
- Region map
- Design Critique: New Purchase Order Modal (`PurchaseNewOrderModal.jsx`)
- Design Critique: New Purchase Order Modal (`PurchaseNewOrderModal.jsx`)
- Heuristics Scoring Guide
- 2026-10-07T04-47-48Z__src-components-allorderstableview-jsx.md
- Read

## God Nodes (most connected - your core abstractions)
1. `react` - 37 edges
2. `connectSSE()` - 34 edges
3. `setLiveState()` - 33 edges
4. `resumeSession()` - 33 edges
5. `showToast()` - 31 edges
6. `initGlobalBar()` - 30 edges
7. `el()` - 29 edges
8. `lucide-react` - 28 edges
9. `handleKeyDown()` - 27 edges
10. `cleanup()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `The Problem` --references--> `deriveUnitStatus()`  [INFERRED]
  docs/superpowers/specs/2026-10-02-preserve-completed-panels-in-departments-design.md → server/index.js
- `4.1 Backend Engine (`server/index.js`)` --references--> `deriveUnitStatus()`  [INFERRED]
  PROJECT_AUDIT.md → server/index.js
- `2. Architecture Decisions` --references--> `deriveUnitStatus()`  [INFERRED]
  tasks/plan.md → server/index.js
- `Phase 2: Pipeline State Machine & Sales Department Retention` --references--> `deriveUnitStatus()`  [INFERRED]
  tasks/plan.md → server/index.js
- `Automated Tests` --references--> `calculateUnitStatus()`  [INFERRED]
  docs/superpowers/specs/2026-10-02-preserve-completed-panels-in-departments-design.md → src/components/AllOrdersTableView.jsx

## Import Cycles
- None detected.

## Communities (108 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (29): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+21 more)

### Community 1 - "planningData.js"
Cohesion: 0.13
Nodes (20): BoardView(), StatusBadge(), DOC_TYPES, DocumentManager(), PO_AUTHORIZED_ROLES, FlowView(), StatusBadge(), ADMIN_NAV (+12 more)

### Community 2 - "AllOrdersTableView.jsx"
Cohesion: 0.12
Nodes (29): Task 4: Master Table View Status Calculation (`AllOrdersTableView.jsx`), react-dom, AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS, formatFastDate() (+21 more)

### Community 3 - "db.js"
Cohesion: 0.14
Nodes (8): pool, extractYearFromOrder(), formatOrderNumber(), migrate(), migrateUnitSerials(), formatOrderNumber(), parseOrderCounter(), realignUnitSerials()

### Community 4 - "Masters.jsx"
Cohesion: 0.17
Nodes (18): DOC_TYPE_THEMES, DocumentPreviewModal(), EXTENSION_TYPE_MAP, formatDMY(), formatSize(), getDocumentType(), ImageViewerPane(), UnsupportedFallbackPane() (+10 more)

### Community 5 - "index.js"
Cohesion: 0.08
Nodes (18): allowedOrigins, app, BLOCKED_EXTENSIONS, DEFAULT_STEPS, defaultAllowedOrigins, __dirname, __filename, formatOrderNumber() (+10 more)

### Community 6 - "react"
Cohesion: 0.16
Nodes (19): lucide-react, react, AddPartMasterModal(), EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData(), getTodayDateStr() (+11 more)

### Community 7 - "server/package.json"
Cohesion: 0.12
Nodes (14): bcryptjs, cors, dotenv, express, multer, nodemailer, pool, xlsx (+6 more)

### Community 9 - "adapt.native.md"
Cohesion: 0.25
Nodes (7): Adaptation Strategies, Assess Adaptation Challenge, Implement & Verify, Orientation & foldables, Phone → Tablet (iPad / large screens), Platform → platform (iOS ↔ Android), Web → native (porting a website or web app)

### Community 10 - "PlanningModule.jsx"
Cohesion: 0.25
Nodes (9): PlanningModule, DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS (+1 more)

### Community 11 - "test_design_confirmation.js"
Cohesion: 0.10
Nodes (20): ref_fs, ref_os, ref_path, content, filePath, headerCbIdx, startIdx, tableEndIdx (+12 more)

### Community 13 - "onAnnotDown"
Cohesion: 0.16
Nodes (20): beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), clampPlaceholderSize(), finalizeEditingPin(), initAnnotOverlay(), localCoords() (+12 more)

### Community 18 - "deriveUnitStatus"
Cohesion: 0.12
Nodes (19): Global Constraints, Per-Panel PO Advancement and Sales Flow Implementation Plan, Review Focus, Task 1: Database Migration for Panel Sales Clearance & PO Unlink Flag, Task 2: Per-Panel PO Advancement in `deriveUnitStatus`, Task 3: Safe Panel-Level PO Deletion & Re-derivation, Task 4: Manual Panel Sales Clear Endpoint (`POST /api/units/:id/sales-clear`), Task 5: Unit Update Re-derivation in `PUT /api/units/:id` & Document Upload (+11 more)

### Community 19 - "bolder.md"
Cohesion: 0.33
Nodes (5): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat

### Community 20 - "verify_codebase.js"
Cohesion: 0.14
Nodes (14): ref_babel_parser, ref_babel_traverse, ref_module, ref_url, __dirname, __filename, globalAllowList, parser (+6 more)

### Community 21 - "Spec: Design Department Confirmation Gate & Dynamic Release Documents Status"
Cohesion: 0.12
Nodes (15): 10. Open Questions, 1. Objective, 2. Tech Stack, 3. Commands, 4. Project Structure & Affected Modules, 5.1 Database Schema (Additive & Non-Destructive), 5.2 Backend API & Workflow Logic, 5.3 Frontend UI/UX in `AllOrdersTableView.jsx` (+7 more)

### Community 22 - "Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents"
Cohesion: 0.50
Nodes (3): Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents, Core Intent, Metadata

### Community 23 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, multer, nodemailer (+2 more)

### Community 24 - "modern-screenshot.umd.js"
Cohesion: 0.09
Nodes (55): ae(), be(), bt(), Ce(), s(), Ct(), de(), dt() (+47 more)

### Community 25 - "Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)"
Cohesion: 0.12
Nodes (16): 1. Document Separation & Storage Isolation, 2. Revision Calculation for Non-Standard Documents, 3. Role-Based Access Control (RBAC), Action Boundaries, Boundaries, Code Style & Implementation Standard, Commands, Data Contracts & Architecture (+8 more)

### Community 26 - "live-browser.js"
Cohesion: 0.05
Nodes (67): agentHasWorkInFlight(), applyLiveBarPreference(), applyPlaceholderSizingStyles(), buildLocatorForLeaf(), buildPickedAnchorSnapshot(), buildPlaceholderResizeHandles(), buildSteerQueueHint(), buildSvelteExpressionTextMap() (+59 more)

### Community 27 - "renderDesignVisual"
Cohesion: 0.07
Nodes (43): buildCollapsible(), buildColorModels(), buildDesignHeader(), buildListHtml(), buildRadiiModels(), buildTypographyModels(), copyToClipboard(), cssSafe() (+35 more)

### Community 28 - "Persuade and Experience"
Cohesion: 0.50
Nodes (3): Comps, Directions, Persuade and Experience

### Community 29 - "connectSSE"
Cohesion: 0.10
Nodes (41): applySavedSessionMeta(), clampVariantIndex(), clearHandled(), connectSSE(), enterRecoveryWaitingForAnchor(), finalizeInsertSession(), findActiveSessionSummary(), findAdoptableServerSession() (+33 more)

### Community 30 - "live.md"
Cohesion: 0.07
Nodes (26): Step 1: Parse the request, Step 2: Reuse the page, then start, Step 3: Generate, Step 4: Accept and close, Cleanup, Exit, First-time setup, Handle `accept` (+18 more)

### Community 31 - "Design System: Vyom ERP"
Cohesion: 0.07
Nodes (26): Buttons, Cards & Metrics, Colors, Components, Design System: Vyom ERP, Do:, Do's and Don'ts, Don't: (+18 more)

### Community 32 - "adapt.md"
Cohesion: 0.12
Nodes (15): Assess Adaptation Challenge, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Techniques, Mobile Adaptation (Desktop → Mobile), Navigation Adaptation (+7 more)

### Community 33 - "new-work.md"
Cohesion: 0.10
Nodes (17): Recommended Actions, Craft (deprecated alias), Apply, Live-mode signature params, Set the spatial thesis, Two isolated assessments, Verify, Visitor mode (+9 more)

### Community 34 - "handleManualEditActivity"
Cohesion: 0.18
Nodes (26): clearStoredManualApplyState(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage(), numberOrNull() (+18 more)

### Community 35 - "App.jsx"
Cohesion: 0.10
Nodes (22): What's Working, Design Health Score, react-router-dom, App(), Dashboard(), DocumentDirectory, LogsView, Masters (+14 more)

### Community 36 - "mountSvelteComponentVariant"
Cohesion: 0.14
Nodes (19): applyOriginalAttrsToSvelteAnchor(), captureAndEmit(), checkpointPayload(), commitAcceptedSvelteComponentToDom(), componentModuleCandidates(), describeMountFailure(), detectDevServerBase(), getMountedSvelteComponentAnchor() (+11 more)

### Community 37 - "pg"
Cohesion: 0.10
Nodes (13): ref_assert, jsonwebtoken, pg, pool, pool, pool, designToken, pool (+5 more)

### Community 38 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 39 - "Design Specification: Preserve Completed Panels in Previous Departments"
Cohesion: 0.09
Nodes (22): 1. Executive Summary & Problem Statement, 2. Architecture & Data Model, 3.1 Endpoint Overhaul: `GET /api/dept-worklist/:dept`, 3. Backend Specification (`server/index.js`), 4.1 Department Worklist (`src/components/DeptWorklist.jsx`), 4.2 Master Table View (`src/components/AllOrdersTableView.jsx`), 4. Frontend Specification, 5. Security, Guardrails & Edge Cases (+14 more)

### Community 40 - "initGlobalBar"
Cohesion: 0.13
Nodes (26): agentStatusText(), barPaletteForTheme(), brandMarkSvg(), detectPageTheme(), ensureAgentPollTooltip(), fetchAgentPollingStatus(), hideAgentPollTooltip(), init() (+18 more)

### Community 41 - "SKILL.md"
Cohesion: 0.10
Nodes (16): Craft floor, Refuse, Verify, Constraints, Failure modes, Flow, /impeccable hooks, Routing (+8 more)

### Community 42 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 43 - "setLiveState"
Cohesion: 0.15
Nodes (41): applyEditing(), beginNewLiveConfiguration(), cancelEditing(), cancelEditingToPicking(), cancelInsertConfigure(), clearAnnotations(), clearInsertPicking(), closeTunePopover() (+33 more)

### Community 44 - "syncEditBadgeHitProxies"
Cohesion: 0.27
Nodes (10): bindEditBadgeProxy(), editBadgeProxyTargets(), initEditBadge(), initEditBadgeHitProxies(), positionEditBadge(), proxyMouseEvent(), setImportantStyle(), styleEditBadgeProxy() (+2 more)

### Community 45 - "resolveLiveInjectionAnchor"
Cohesion: 0.62
Nodes (7): elementMatchesOriginalMarkup(), findLiveElementForOriginalMarkup(), findLiveElementFromAnchorSnapshot(), isUsableInjectionAnchor(), normalizeElementClassName(), parseOriginalMarkupElement(), resolveLiveInjectionAnchor()

### Community 46 - "createLiveBrowserSessionState"
Cohesion: 0.22
Nodes (15): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+7 more)

### Community 47 - "actOnAgentTarget"
Cohesion: 0.31
Nodes (16): actOnAgentTarget(), agentTargetBusyReason(), agentTargetOverlayGone(), agentTargetTaken(), claimAgentTarget(), claimAndActOnAgentTarget(), declineAgentTargetBusy(), declineAgentTargetUnresolvable() (+8 more)

### Community 48 - "OrderDocumentsModal.jsx"
Cohesion: 0.26
Nodes (10): ref_xlsx, BulkImportModal(), ExcelSheetViewer(), formatFileSize(), getDocCategoryLabel(), getDocumentUrl(), getFileType(), OrderDocumentsModal() (+2 more)

### Community 49 - "el"
Cohesion: 0.07
Nodes (56): actionLabel(), applyConfigureBarChrome(), bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl(), buildConfigureCountControl(), buildConfigureRow() (+48 more)

### Community 50 - "createLiveBrowserDomHelpers"
Cohesion: 0.05
Nodes (42): addManualContextText(), canRestoreManualEditElement(), collectEditableTextRows(), visit(), collectManualContextPieces(), walk(), contextElementForManualEdit(), copyEditContainerContext() (+34 more)

### Community 51 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 52 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0-4 per variant), 8. Signal done (+8 more)

### Community 53 - "initPageChat"
Cohesion: 0.11
Nodes (39): applyGlobalBarLabelState(), armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), buildSteerProcessingDots(), clearSteerAwaitTimer(), clearSteerFocusRecoverTimer(), collapsePageChat() (+31 more)

### Community 54 - "Vyom ERP — Comprehensive Project Audit & Development Process Documentation"
Cohesion: 0.06
Nodes (33): 10. Conclusion & Final Verdict, 1.1 Purpose & Scope, 1.2 System Vital Metrics, 1. Executive Summary, 2.1 Topology & Containerized Orchestration, 2.2 Technology Stack Analysis, 2. System Architecture & Technology Stack, 3.1 The 9-Stage Manufacturing Pipeline (+25 more)

### Community 55 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Implementation Integrity (CRITICAL), Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+6 more)

### Community 56 - "Responsive Design"
Cohesion: 0.20
Nodes (10): Breakpoints: Content-Driven, Detect Input Method, Not Just Screen Size, Layout Adaptation Patterns, Mobile-First: Write It Right, Picture Element for Art Direction, Responsive Design, Responsive Images: Get It Right, Safe Areas: Handle the Notch (+2 more)

### Community 57 - "DeptWorklist.jsx"
Cohesion: 0.15
Nodes (13): Global Constraints, Preserve Completed Panels in Previous Departments Implementation Plan, Review Focus, Task 1: Backend Integration Tests for Completed Panel Visibility, Task 2: Backend Query Overhaul in `GET /api/dept-worklist/:dept`, Task 3: Frontend Department Worklist Updates (`DeptWorklist.jsx`), Task 5: End-to-End Verification & Production Build, DEPT_COLORS (+5 more)

### Community 58 - "New visual work"
Cohesion: 0.14
Nodes (14): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Both paths (+6 more)

### Community 59 - "optimize.md"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP < 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 60 - "Design Critique: Task Masters & Modal Interface (`src/components/Masters.jsx`)"
Cohesion: 0.14
Nodes (13): Design Critique: Task Masters & Modal Interface (`src/components/Masters.jsx`), Design Health Score, Design Specificity Verdict, Minor Observations, Overall Impression, [P0] What: Broken Contrast on Action Buttons in Light Theme, [P1] What: Theme Inversion on Section Dividers and Headings, [P2] What: Modal Height Cramming and Overflow (+5 more)

### Community 61 - "Impeccable Asset Producer"
Cohesion: 0.15
Nodes (11): Act on the receipt, Assemble and review, Plan and asset review, Plan, capture, serve, Core Rule, Decision Comps, Impeccable Asset Producer, Input Contract (+3 more)

### Community 62 - "Scan mode (approach C: auto-extract, then confirm descriptive language)"
Cohesion: 0.15
Nodes (13): Component translation rules, Narrative mapping, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Step 1: Find the design assets, Step 2: Auto-extract what can be auto-extracted, Step 2b: Stage the frontmatter, Step 3: Ask the user for qualitative language (+5 more)

### Community 63 - "startVariantObserver"
Cohesion: 0.10
Nodes (46): applyParamDefaults(), applyParamValue(), applyPlaceholderDimensions(), buildParamsPanel(), closedClipPath(), commitAcceptedVariantToDom(), completeParameterGenerationIfReady(), completeParameterPublication() (+38 more)

### Community 64 - "critique.md"
Cohesion: 0.17
Nodes (11): Action Summary, Ask the User, Assessment A: Design Review, Assessment B: Detector + Browser Evidence, Assessment Orchestration, Deliver the Report, Hard Invariants, Persist the Snapshot (+3 more)

### Community 65 - "Simplify the Design"
Cohesion: 0.17
Nodes (11): Assess Current State, Code Simplification, Content Simplification, Document Removed Complexity, Information Architecture, Interaction Simplification, Layout Simplification, Plan Simplification (+3 more)

### Community 66 - "Hardening Dimensions"
Cohesion: 0.17
Nodes (11): Accessibility Resilience, Assess Hardening Needs, Edge Cases & Boundary Conditions, Error Handling, Hardening Dimensions, Input Validation & Sanitization, Internationalization (i18n), Performance Resilience (+3 more)

### Community 67 - "2026-10-07T05-46-44Z__src-components-allorderstableview-jsx.md"
Cohesion: 0.25
Nodes (7): Design Health Score, Design Specificity Verdict, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider

### Community 68 - "2026-10-07T06-10-21Z__darkmode.md"
Cohesion: 0.22
Nodes (8): Design Health Score, Design Specificity Verdict, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider, What's Working

### Community 69 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 70 - "clarify.md"
Cohesion: 0.18
Nodes (10): Actions and navigation, Audit the language, Errors and permissions, Forms, Help and instructional text, Loading, empty, and success states, Rewrite by function, Set the message hierarchy (+2 more)

### Community 71 - "Nielsen's 10 Heuristics"
Cohesion: 0.18
Nodes (11): 10. Help and Documentation, 1. Visibility of System Status, 2. Match Between System and Real World, 3. User Control and Freedom, 4. Consistency and Standards, 5. Error Prevention, 6. Recognition Rather Than Recall, 7. Flexibility and Efficiency of Use (+3 more)

### Community 72 - "document.md"
Cohesion: 0.18
Nodes (10): Pitfalls, Seed mode, Step 1: Route through new-work's workshop, Step 2: Write seed DESIGN.md, Step 3: Confirm, Style guidelines, The frontmatter: token schema, The markdown body: eight sections (canonical order) (+2 more)

### Community 73 - "polish.md"
Cohesion: 0.18
Nodes (10): 1. Establish the system, 2. Gather the evidence, 3. Triage, 4. Polish the whole path, 5. Verify and finish, Color, imagery, and icons, Content and code, Flow and hierarchy (+2 more)

### Community 74 - "quieter.md"
Cohesion: 0.18
Nodes (10): Assess Current State, Color Refinement, Composition Refinement, Motion Reduction, Plan Refinement, Refine the Design, Simplification, Verify Quality (+2 more)

### Community 75 - "2026-10-08T11-51-14Z__src-index-css.md"
Cohesion: 0.17
Nodes (11): Design Specificity Verdict, Minor Observations, Overall Impression, [P1] Chromostereopsis & Glare from Neon Accents on Pure Black, [P1] Crushed Tonal Stepping & Weak Alternating Row Visibility in Data Tables, [P1] Pitch-Black Obsidian Canvas Causes Eye Fatigue and Text Halation, [P2] Ad-Hoc Color Proliferation and Hardcoded Dark Hexes (1,078 Detector Findings), Persona Red Flags (+3 more)

### Community 76 - "Extract Flow"
Cohesion: 0.25
Nodes (7): Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 77 - "Generate Combined Critique Report"
Cohesion: 0.20
Nodes (10): Design Health Score, Design Specificity Verdict, Generate Combined Critique Report, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider (+2 more)

### Community 78 - "Init flow"
Cohesion: 0.20
Nodes (10): Completion gate, Init flow, Step 1: Load current state, Step 2: Explore the project, Step 3: Interview for product truth, Step 4: Write PRODUCT.md, Step 5: Record workflow defaults, Step 6: Wrap up or resume (+2 more)

### Community 79 - "scheduleAcceptCleanup"
Cohesion: 0.31
Nodes (11): acceptedDomAlreadyClean(), clearHandledWrapperReloadStamp(), deferredRecoverySuperseded(), ensureAcceptedDomClean(), findAcceptedRuntimeWrappers(), handledWrapperReloadKey(), reloadAfterMissingAcceptedDom(), restoreAcceptedDomFromSnapshot() (+3 more)

### Community 80 - "Common Cognitive Load Violations"
Cohesion: 0.22
Nodes (9): 1. The Wall of Options, 2. The Memory Bridge, 3. The Hidden Navigation, 4. The Jargon Barrier, 5. The Visual Noise Floor, 6. The Inconsistent Pattern, 7. The Multi-Task Demand, 8. The Context Switch (+1 more)

### Community 81 - "iOS platform"
Cohesion: 0.22
Nodes (9): Color & materials, Components & controls, iOS platform, Layout & structure, Motion, The iOS slop test, Touch targets, Typography (+1 more)

### Community 82 - "Operate mode depth (and Read notes)"
Cohesion: 0.22
Nodes (9): Color, Components, Layout, Motion, Operate mode depth (and Read notes), Product constraints, Product permissions, The product slop test (+1 more)

### Community 83 - "Shape"
Cohesion: 0.25
Nodes (8): Cadence, Confirm and stop, Phase 1: Discovery interview, Phase 2: Resolve the design direction, Phase 3: Write the brief, Round 1: purpose, people, and outcome, Round 2: material, behavior, and boundaries, Shape

### Community 84 - "handleInsertCreate"
Cohesion: 0.21
Nodes (14): buildInsertPlaceholderSnapshotFromDom(), finishVoiceSession(), handleInsertCreate(), isEmbeddedPreviewBrowser(), releaseVoiceEngine(), resolveScrollLockAnchorTop(), startScrollLock(), startVoice() (+6 more)

### Community 85 - "captureElementToBlob"
Cohesion: 0.11
Nodes (23): averageRgb01(), bufferToBase64(), captureChromeNodes(), captureElementFromRenderedAncestor(), captureElementToBlob(), collectFontCssText(), compileShader(), cssColorToRgb01() (+15 more)

### Community 86 - "Android platform"
Cohesion: 0.25
Nodes (8): Android platform, Color & theming, Components & motion, Layout & structure, The Android slop test, Touch targets, Typography, Verifying the build

### Community 87 - "colorize.md"
Cohesion: 0.25
Nodes (7): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode

### Community 88 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 89 - "doctor.md"
Cohesion: 0.25
Nodes (7): Monorepo notes, Opting out of the boot check, Step 1: Run the pass, Step 2: Act by severity, Step 3: Deprecated fields are binding, Step 4: Do not overclaim on truth drift, What this owns, and what it does not

### Community 90 - "Impeccable Documenter"
Cohesion: 0.40
Nodes (4): Impeccable Documenter, Input Contract, Output Contract, Workflow

### Community 92 - "Generate Report"
Cohesion: 0.29
Nodes (7): Audit Health Score, Detailed Findings by Severity, Executive Summary, Generate Report, Patterns & Systemic Issues, Platform Conformance Verdict, Positive Findings

### Community 93 - "Cognitive Load Assessment"
Cohesion: 0.29
Nodes (7): Cognitive Load Assessment, Cognitive Load Checklist, Extraneous Load: Bad Design, Germane Load: Learning Effort, Intrinsic Load: The Task Itself, The Working Memory Rule, Three Types of Cognitive Load

### Community 94 - "Impeccable Finish Reviewer"
Cohesion: 0.29
Nodes (6): Checks, in order, Disposition, Impeccable Finish Reviewer, Input Contract, Output Contract, Verdict Pass

### Community 95 - "Impeccable Manual Edit Applier"
Cohesion: 0.29
Nodes (6): Checks, Entry Atomicity, Impeccable Manual Edit Applier, Input Contract, Output Contract, Workflow

### Community 96 - "live-browser-ignores.js"
Cohesion: 0.52
Nodes (6): globToRegex(), matchesScope(), normalizeIgnoreRule(), normalizeIgnoreValue(), pageCandidates(), resolveDetectIgnores()

### Community 97 - "Diagnostic Scan"
Cohesion: 0.33
Nodes (6): 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Diagnostic Scan

### Community 98 - "showToast"
Cohesion: 0.11
Nodes (34): abandonForeignSession(), abandonSupersededGo(), abortSvelteComponentInjection(), cleanup(), cleanupAcceptedSession(), clearMountErrorCard(), clearScrollY(), clearSession() (+26 more)

### Community 99 - "Visualize: Direction Comps & Asset Production"
Cohesion: 0.33
Nodes (5): After approval: the comp becomes a spec, Generate three compositional options, One approval point, Plates and provenance, Visualize: Direction Comps & Asset Production

### Community 100 - "impeccable"
Cohesion: 0.60
Nodes (5): impeccable script, check_download(), fetch_url(), probe_ok(), setup_help()

### Community 101 - "Implementation Plan: Resilient & Dynamic Task Masters Lifecycle"
Cohesion: 0.22
Nodes (8): 1. Overview, 2. Architecture Decisions, 3. Task List, 4. Risks & Mitigations, Implementation Plan: Resilient & Dynamic Task Masters Lifecycle, Phase 1: Task Masters Deletion & Addition Mechanics, Phase 2: Pipeline State Machine & Sales Department Retention, Phase 3: Verification & Checkpoint

### Community 102 - "Region map"
Cohesion: 0.40
Nodes (4): Containment, Painted material, Region map, What varies independently

### Community 103 - "Design Critique: New Purchase Order Modal (`PurchaseNewOrderModal.jsx`)"
Cohesion: 0.20
Nodes (9): 1. Design Health Score (Nielsen Heuristics), 2. Design Specificity & Domain Fit, 3. Cognitive Load & Information Architecture, 4. Priority Issues (P0–P2), 5. Architectural Redesign Blueprint, Design Critique: New Purchase Order Modal (`PurchaseNewOrderModal.jsx`), 🔴 P0 — Critical Functional Deficit, 🟡 P1 — Structural & Ergonomic Misalignments (+1 more)

### Community 104 - "Design Critique: New Purchase Order Modal (`PurchaseNewOrderModal.jsx`)"
Cohesion: 0.20
Nodes (9): 1. Design Health Score (Nielsen Heuristics), 2. Design Specificity & Domain Fit, 3. Cognitive Load & Information Architecture, 4. Priority Issues (P0–P2), 5. Architectural Redesign Blueprint, Design Critique: New Purchase Order Modal (`PurchaseNewOrderModal.jsx`), 🔴 P0 — Critical Functional Deficit, 🟡 P1 — Structural & Ergonomic Misalignments (+1 more)

### Community 105 - "Heuristics Scoring Guide"
Cohesion: 0.50
Nodes (4): Heuristics Scoring Guide, Issue Severity (P0–P3), Reference Material, Score Summary

### Community 106 - "2026-10-07T04-47-48Z__src-components-allorderstableview-jsx.md"
Cohesion: 0.22
Nodes (8): Design Health Score, Design Specificity Verdict, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider, What's Working

### Community 110 - "Read"
Cohesion: 0.50
Nodes (3): Comps, Directions, Read

## Knowledge Gaps
- **660 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+655 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 738 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `init()` connect `initGlobalBar` to `handleManualEditActivity`, `SKILL.md`, `setLiveState`, `syncEditBadgeHitProxies`, `onAnnotDown`, `Init flow`, `initPageChat`, `doctor.md`, `live-browser.js`, `renderDesignVisual`, `connectSSE`, `live.md`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Why does `Commands` connect `SKILL.md` to `initGlobalBar`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `Reference Material` connect `Heuristics Scoring Guide` to `critique.md`, `Persona-Based Design Testing`, `Cognitive Load Assessment`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _660 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `planningData.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._
- **Should `AllOrdersTableView.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12298387096774194 - nodes in this community are weakly interconnected._