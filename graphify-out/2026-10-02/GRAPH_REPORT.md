# Graph Report - ERP  (2026-10-02)

## Corpus Check
- 134 files · ~2,413,812 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 5, .pptx 5, .exe 1)

## Summary
- 1621 nodes · 3482 edges · 107 communities (100 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2647f508`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- AllOrdersTableView.jsx
- db.js
- Masters.jsx
- index.js
- react
- server/package.json
- Database Connection & Migrations
- Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)
- PlanningModule.jsx
- test_design_confirmation.js
- Startup Synchronization & Serials
- live-browser.js
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point
- Implementation Plan: Resilient & Dynamic Task Masters Lifecycle
- ErrorBoundary
- verify_codebase.js
- Spec: Design Department Confirmation Gate & Dynamic Release Documents Status
- Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents
- dependencies
- modern-screenshot.umd.js
- el
- renderDesignVisual
- setLiveState
- initPageChat
- normalizeManualContextText
- connectSSE
- initGlobalBar
- planningData.js
- adapt.md
- new-work.md
- handleGo
- mountSvelteComponentVariant
- handleManualEditActivity
- onboard.md
- createLiveBrowserDomHelpers
- pg
- SKILL.md
- The Toolkit
- captureElementToBlob
- resolveLiveInjectionAnchor
- actOnAgentTarget
- OrderDocumentsModal.jsx
- createLiveBrowserSessionState
- showBar
- onAnnotDown
- animate.md
- live.md
- Handle `generate`
- init
- Generate Report
- cleanup
- New visual work
- optimize.md
- startVariantObserver
- Impeccable Asset Producer
- Scan mode (approach C: auto-extract, then confirm descriptive language)
- showToast
- scheduleAcceptCleanup
- critique.md
- Simplify the Design
- Hardening Dimensions
- Product
- clarify.md
- Nielsen's 10 Heuristics
- document.md
- polish.md
- quieter.md
- Generate Combined Critique Report
- Init flow
- Responsive Design
- Common Cognitive Load Violations
- iOS platform
- Operate mode depth (and Read notes)
- Shape
- adapt.native.md
- Android platform
- colorize.md
- Persona-Based Design Testing
- doctor.md
- Extract Flow
- Review Focus
- DeptWorklist.jsx
- Generate Report
- Cognitive Load Assessment
- Impeccable Finish Reviewer
- Impeccable Manual Edit Applier
- live-browser-ignores.js
- Diagnostic Scan
- dependencies
- Visualize: Direction Comps & Asset Production
- impeccable
- Impeccable Documenter
- Region map
- Heuristics Scoring Guide
- bolder.md
- Read
- renderMountErrorCard
- devDependencies
- scripts
- StatsRow.jsx
- Persuade and Experience
- refreshLiveControlsForManualApply

## God Nodes (most connected - your core abstractions)
1. `connectSSE()` - 34 edges
2. `setLiveState()` - 33 edges
3. `resumeSession()` - 33 edges
4. `react` - 33 edges
5. `showToast()` - 31 edges
6. `initGlobalBar()` - 30 edges
7. `el()` - 29 edges
8. `handleKeyDown()` - 27 edges
9. `cleanup()` - 27 edges
10. `buildInsertConfigureRow()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Task 2: Per-Panel PO Advancement in `deriveUnitStatus`` --references--> `deriveUnitStatus()`  [INFERRED]
  docs/superpowers/plans/2026-10-02-panel-po-and-sales-flow.md → server/index.js
- `2. Architecture Decisions` --references--> `deriveUnitStatus()`  [INFERRED]
  tasks/plan.md → server/index.js
- `Phase 2: Pipeline State Machine & Sales Department Retention` --references--> `deriveUnitStatus()`  [INFERRED]
  tasks/plan.md → server/index.js
- `Testing & Verification Strategy` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Panel PO and Sales Flow Implementation Plan` --references--> `deriveUnitStatus()`  [INFERRED]
  docs/superpowers/plans/2026-10-02-panel-po-and-sales-flow.md → server/index.js

## Import Cycles
- None detected.

## Communities (107 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.12
Nodes (13): xlsx, name, private, type, version, react-dom, @tanstack/react-query, @types/react (+5 more)

### Community 1 - "App.jsx"
Cohesion: 0.13
Nodes (15): react-router-dom, App(), Dashboard(), DocumentDirectory, LogsView, Masters, OrderCreationFlow, OrderImport (+7 more)

### Community 2 - "AllOrdersTableView.jsx"
Cohesion: 0.16
Nodes (23): AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS, formatFastDate(), formatFastDateTime(), getCellTooltip() (+15 more)

### Community 3 - "db.js"
Cohesion: 0.14
Nodes (8): pool, extractYearFromOrder(), formatOrderNumber(), migrate(), migrateUnitSerials(), formatOrderNumber(), parseOrderCounter(), realignUnitSerials()

### Community 4 - "Masters.jsx"
Cohesion: 0.17
Nodes (18): DOC_TYPE_THEMES, DocumentPreviewModal(), EXTENSION_TYPE_MAP, formatDMY(), formatSize(), getDocumentType(), ImageViewerPane(), UnsupportedFallbackPane() (+10 more)

### Community 5 - "index.js"
Cohesion: 0.07
Nodes (24): allowedOrigins, app, BLOCKED_EXTENSIONS, DEFAULT_STEPS, defaultAllowedOrigins, deriveUnitStatus(), __dirname, evaluateUnitDesignDocuments() (+16 more)

### Community 6 - "react"
Cohesion: 0.25
Nodes (12): lucide-react, react, AddPartMasterModal(), EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData(), getTodayDateStr() (+4 more)

### Community 7 - "server/package.json"
Cohesion: 0.12
Nodes (14): bcryptjs, cors, dotenv, express, multer, nodemailer, pool, xlsx (+6 more)

### Community 9 - "Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)"
Cohesion: 0.12
Nodes (16): 1. Document Separation & Storage Isolation, 2. Revision Calculation for Non-Standard Documents, 3. Role-Based Access Control (RBAC), Action Boundaries, Boundaries, Code Style & Implementation Standard, Commands, Data Contracts & Architecture (+8 more)

### Community 10 - "PlanningModule.jsx"
Cohesion: 0.25
Nodes (9): PlanningModule, DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS (+1 more)

### Community 11 - "test_design_confirmation.js"
Cohesion: 0.10
Nodes (20): ref_fs, ref_os, ref_path, content, filePath, headerCbIdx, startIdx, tableEndIdx (+12 more)

### Community 13 - "live-browser.js"
Cohesion: 0.05
Nodes (65): applyGlobalBarLabelState(), applyLiveBarPreference(), applyPlaceholderDimensions(), applyPlaceholderSizingStyles(), bindEditBadgeProxy(), bufferToBase64(), buildPlaceholderResizeHandles(), buildSavingRow() (+57 more)

### Community 18 - "Implementation Plan: Resilient & Dynamic Task Masters Lifecycle"
Cohesion: 0.22
Nodes (8): 1. Overview, 2. Architecture Decisions, 3. Task List, 4. Risks & Mitigations, Implementation Plan: Resilient & Dynamic Task Masters Lifecycle, Phase 1: Task Masters Deletion & Addition Mechanics, Phase 2: Pipeline State Machine & Sales Department Retention, Phase 3: Verification & Checkpoint

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

### Community 25 - "el"
Cohesion: 0.11
Nodes (38): bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl(), buildConfigureCountControl(), buildConfigureRow(), buildConfigureSubmitButton(), buildConfigureTrailingCluster() (+30 more)

### Community 26 - "renderDesignVisual"
Cohesion: 0.07
Nodes (42): buildCollapsible(), buildColorModels(), buildDesignHeader(), buildListHtml(), buildRadiiModels(), buildTypographyModels(), cssSafe(), designEmptyMessage() (+34 more)

### Community 27 - "setLiveState"
Cohesion: 0.25
Nodes (25): beginNewLiveConfiguration(), cancelEditingToPicking(), cancelInsertConfigure(), clearAnnotations(), clearInsertPicking(), enterEditingMode(), exitConfigureToPicking(), handleClick() (+17 more)

### Community 28 - "initPageChat"
Cohesion: 0.09
Nodes (48): armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), clearSteerAwaitTimer(), clearSteerFocusRecoverTimer(), collapsePageChat(), expandPageChat(), finishVoiceSession() (+40 more)

### Community 29 - "normalizeManualContextText"
Cohesion: 0.12
Nodes (20): addManualContextText(), canRestoreManualEditElement(), collectManualContextPieces(), walk(), contextElementForManualEdit(), cssIdent(), directMixedTextRestoreNodes(), findManualEditRestoreElement() (+12 more)

### Community 30 - "connectSSE"
Cohesion: 0.11
Nodes (42): applySavedSessionMeta(), clampVariantIndex(), clearHandled(), completeParameterGenerationIfReady(), completeSourceInjection(), connectSSE(), enterRecoveryWaitingForAnchor(), findActiveSessionSummary() (+34 more)

### Community 31 - "initGlobalBar"
Cohesion: 0.14
Nodes (22): agentHasWorkInFlight(), agentStatusText(), brandMarkSvg(), buildSteerQueueHint(), ensureAgentPollTooltip(), hideAgentPollTooltip(), initGlobalBar(), makeIconBtn() (+14 more)

### Community 32 - "planningData.js"
Cohesion: 0.13
Nodes (20): BoardView(), StatusBadge(), DOC_TYPES, DocumentManager(), PO_AUTHORIZED_ROLES, FlowView(), StatusBadge(), ADMIN_NAV (+12 more)

### Community 33 - "adapt.md"
Cohesion: 0.12
Nodes (15): Assess Adaptation Challenge, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Techniques, Mobile Adaptation (Desktop → Mobile), Navigation Adaptation (+7 more)

### Community 34 - "new-work.md"
Cohesion: 0.10
Nodes (17): Recommended Actions, Craft (deprecated alias), Apply, Live-mode signature params, Set the spatial thesis, Two isolated assessments, Verify, Visitor mode (+9 more)

### Community 35 - "handleGo"
Cohesion: 0.17
Nodes (20): applyEditing(), buildInsertPlaceholderSnapshotFromDom(), buildLocatorForLeaf(), buildPickedAnchorSnapshot(), cancelEditing(), copyEditContainerContext(), copyEditLeafContext(), disableInlineEdit() (+12 more)

### Community 36 - "mountSvelteComponentVariant"
Cohesion: 0.21
Nodes (15): abortSvelteComponentInjection(), applyOriginalAttrsToSvelteAnchor(), commitAcceptedSvelteComponentToDom(), componentModuleCandidates(), describeMountFailure(), detectDevServerBase(), getMountedSvelteComponentAnchor(), importFirstReachable() (+7 more)

### Community 37 - "handleManualEditActivity"
Cohesion: 0.19
Nodes (24): clearStoredManualApplyState(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage(), numberOrNull() (+16 more)

### Community 38 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 39 - "createLiveBrowserDomHelpers"
Cohesion: 0.12
Nodes (16): collectEditableTextRows(), visit(), createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable() (+8 more)

### Community 40 - "pg"
Cohesion: 0.10
Nodes (13): ref_assert, jsonwebtoken, pg, pool, pool, pool, designToken, pool (+5 more)

### Community 41 - "SKILL.md"
Cohesion: 0.10
Nodes (16): Craft floor, Refuse, Verify, Constraints, Failure modes, Flow, /impeccable hooks, Routing (+8 more)

### Community 42 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 43 - "captureElementToBlob"
Cohesion: 0.11
Nodes (23): averageRgb01(), captureAndEmit(), captureChromeNodes(), captureElementFromRenderedAncestor(), captureElementToBlob(), checkpointPayload(), compileShader(), cssColorToRgb01() (+15 more)

### Community 44 - "resolveLiveInjectionAnchor"
Cohesion: 0.16
Nodes (19): buildSvelteExpressionTextMap(), buildSveltePropValuesFromLiveElement(), buildSveltePropValuesV2(), cloneWithoutElements(), collectTextNodes(), collectVisibleTexts(), cssEscapeIdent(), elementMatchesOriginalMarkup() (+11 more)

### Community 45 - "actOnAgentTarget"
Cohesion: 0.29
Nodes (17): actOnAgentTarget(), agentTargetBusyReason(), agentTargetOverlayGone(), agentTargetTaken(), claimAgentTarget(), claimAndActOnAgentTarget(), declineAgentTargetBusy(), declineAgentTargetUnresolvable() (+9 more)

### Community 46 - "OrderDocumentsModal.jsx"
Cohesion: 0.26
Nodes (10): ref_xlsx, BulkImportModal(), ExcelSheetViewer(), formatFileSize(), getDocCategoryLabel(), getDocumentUrl(), getFileType(), OrderDocumentsModal() (+2 more)

### Community 47 - "createLiveBrowserSessionState"
Cohesion: 0.22
Nodes (15): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+7 more)

### Community 48 - "showBar"
Cohesion: 0.15
Nodes (19): actionLabel(), applyConfigureBarChrome(), buildConfirmedRow(), buildCyclingRow(), buildDots(), buildGeneratingRow(), cycleVariant(), cyclingCounterText() (+11 more)

### Community 49 - "onAnnotDown"
Cohesion: 0.20
Nodes (17): beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), clampPlaceholderSize(), finalizeEditingPin(), initAnnotOverlay(), localCoords() (+9 more)

### Community 50 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 51 - "live.md"
Cohesion: 0.07
Nodes (26): Step 1: Parse the request, Step 2: Reuse the page, then start, Step 3: Generate, Step 4: Accept and close, Cleanup, Exit, First-time setup, Handle `accept` (+18 more)

### Community 52 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0-4 per variant), 8. Signal done (+8 more)

### Community 53 - "init"
Cohesion: 0.15
Nodes (18): barPaletteForTheme(), buildSteerProcessingDots(), cursorForInsertAxis(), detectPageTheme(), handleMouseMove(), hideHighlightTagTooltip(), hideInsertLine(), init() (+10 more)

### Community 54 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Implementation Integrity (CRITICAL), Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+6 more)

### Community 55 - "cleanup"
Cohesion: 0.24
Nodes (15): cleanup(), cleanupAcceptedSession(), clearScrollY(), clearSession(), discardedWrappers(), discardStateStyleId(), releaseDiscardedStaticWrapper(), releaseDiscardedStaticWrappers() (+7 more)

### Community 56 - "New visual work"
Cohesion: 0.14
Nodes (14): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Both paths (+6 more)

### Community 57 - "optimize.md"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP < 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 58 - "startVariantObserver"
Cohesion: 0.11
Nodes (38): applyParamDefaults(), applyParamValue(), buildParamsPanel(), closedClipPath(), closeTunePopover(), commitAcceptedVariantToDom(), completeParameterPublication(), ensureInsertPlaceholder() (+30 more)

### Community 59 - "Impeccable Asset Producer"
Cohesion: 0.15
Nodes (11): Act on the receipt, Assemble and review, Plan and asset review, Plan, capture, serve, Core Rule, Decision Comps, Impeccable Asset Producer, Input Contract (+3 more)

### Community 60 - "Scan mode (approach C: auto-extract, then confirm descriptive language)"
Cohesion: 0.15
Nodes (13): Component translation rules, Narrative mapping, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Step 1: Find the design assets, Step 2: Auto-extract what can be auto-extracted, Step 2b: Stage the frontmatter, Step 3: Ask the user for qualitative language (+5 more)

### Community 61 - "showToast"
Cohesion: 0.15
Nodes (19): abandonForeignSession(), abandonSupersededGo(), copyToClipboard(), discardOrphanedSession(), handleAccept(), handleDiscard(), isVariantShown(), markSessionHandled() (+11 more)

### Community 62 - "scheduleAcceptCleanup"
Cohesion: 0.31
Nodes (11): acceptedDomAlreadyClean(), clearHandledWrapperReloadStamp(), deferredRecoverySuperseded(), ensureAcceptedDomClean(), findAcceptedRuntimeWrappers(), handledWrapperReloadKey(), reloadAfterMissingAcceptedDom(), restoreAcceptedDomFromSnapshot() (+3 more)

### Community 63 - "critique.md"
Cohesion: 0.17
Nodes (11): Action Summary, Ask the User, Assessment A: Design Review, Assessment B: Detector + Browser Evidence, Assessment Orchestration, Deliver the Report, Hard Invariants, Persist the Snapshot (+3 more)

### Community 64 - "Simplify the Design"
Cohesion: 0.17
Nodes (11): Assess Current State, Code Simplification, Content Simplification, Document Removed Complexity, Information Architecture, Interaction Simplification, Layout Simplification, Plan Simplification (+3 more)

### Community 65 - "Hardening Dimensions"
Cohesion: 0.17
Nodes (11): Accessibility Resilience, Assess Hardening Needs, Edge Cases & Boundary Conditions, Error Handling, Hardening Dimensions, Input Validation & Sanitization, Internationalization (i18n), Performance Resilience (+3 more)

### Community 66 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 67 - "clarify.md"
Cohesion: 0.18
Nodes (10): Actions and navigation, Audit the language, Errors and permissions, Forms, Help and instructional text, Loading, empty, and success states, Rewrite by function, Set the message hierarchy (+2 more)

### Community 68 - "Nielsen's 10 Heuristics"
Cohesion: 0.18
Nodes (11): 10. Help and Documentation, 1. Visibility of System Status, 2. Match Between System and Real World, 3. User Control and Freedom, 4. Consistency and Standards, 5. Error Prevention, 6. Recognition Rather Than Recall, 7. Flexibility and Efficiency of Use (+3 more)

### Community 69 - "document.md"
Cohesion: 0.18
Nodes (10): Pitfalls, Seed mode, Step 1: Route through new-work's workshop, Step 2: Write seed DESIGN.md, Step 3: Confirm, Style guidelines, The frontmatter: token schema, The markdown body: eight sections (canonical order) (+2 more)

### Community 70 - "polish.md"
Cohesion: 0.18
Nodes (10): 1. Establish the system, 2. Gather the evidence, 3. Triage, 4. Polish the whole path, 5. Verify and finish, Color, imagery, and icons, Content and code, Flow and hierarchy (+2 more)

### Community 71 - "quieter.md"
Cohesion: 0.18
Nodes (10): Assess Current State, Color Refinement, Composition Refinement, Motion Reduction, Plan Refinement, Refine the Design, Simplification, Verify Quality (+2 more)

### Community 72 - "Generate Combined Critique Report"
Cohesion: 0.20
Nodes (10): Design Health Score, Design Specificity Verdict, Generate Combined Critique Report, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider (+2 more)

### Community 73 - "Init flow"
Cohesion: 0.20
Nodes (10): Completion gate, Init flow, Step 1: Load current state, Step 2: Explore the project, Step 3: Interview for product truth, Step 4: Write PRODUCT.md, Step 5: Record workflow defaults, Step 6: Wrap up or resume (+2 more)

### Community 74 - "Responsive Design"
Cohesion: 0.20
Nodes (10): Breakpoints: Content-Driven, Detect Input Method, Not Just Screen Size, Layout Adaptation Patterns, Mobile-First: Write It Right, Picture Element for Art Direction, Responsive Design, Responsive Images: Get It Right, Safe Areas: Handle the Notch (+2 more)

### Community 75 - "Common Cognitive Load Violations"
Cohesion: 0.22
Nodes (9): 1. The Wall of Options, 2. The Memory Bridge, 3. The Hidden Navigation, 4. The Jargon Barrier, 5. The Visual Noise Floor, 6. The Inconsistent Pattern, 7. The Multi-Task Demand, 8. The Context Switch (+1 more)

### Community 76 - "iOS platform"
Cohesion: 0.22
Nodes (9): Color & materials, Components & controls, iOS platform, Layout & structure, Motion, The iOS slop test, Touch targets, Typography (+1 more)

### Community 77 - "Operate mode depth (and Read notes)"
Cohesion: 0.22
Nodes (9): Color, Components, Layout, Motion, Operate mode depth (and Read notes), Product constraints, Product permissions, The product slop test (+1 more)

### Community 78 - "Shape"
Cohesion: 0.25
Nodes (8): Cadence, Confirm and stop, Phase 1: Discovery interview, Phase 2: Resolve the design direction, Phase 3: Write the brief, Round 1: purpose, people, and outcome, Round 2: material, behavior, and boundaries, Shape

### Community 79 - "adapt.native.md"
Cohesion: 0.25
Nodes (7): Adaptation Strategies, Assess Adaptation Challenge, Implement & Verify, Orientation & foldables, Phone → Tablet (iPad / large screens), Platform → platform (iOS ↔ Android), Web → native (porting a website or web app)

### Community 80 - "Android platform"
Cohesion: 0.25
Nodes (8): Android platform, Color & theming, Components & motion, Layout & structure, The Android slop test, Touch targets, Typography, Verifying the build

### Community 81 - "colorize.md"
Cohesion: 0.25
Nodes (7): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode

### Community 82 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 83 - "doctor.md"
Cohesion: 0.25
Nodes (7): Monorepo notes, Opting out of the boot check, Step 1: Run the pass, Step 2: Act by severity, Step 3: Deprecated fields are binding, Step 4: Do not overclaim on truth drift, What this owns, and what it does not

### Community 84 - "Extract Flow"
Cohesion: 0.25
Nodes (7): Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 85 - "Review Focus"
Cohesion: 0.20
Nodes (9): Global Constraints, Panel PO and Sales Flow Implementation Plan, Review Focus, Task 1: Database Migration for Panel Sales Clearance & PO Unlink Flag, Task 2: Per-Panel PO Advancement in `deriveUnitStatus`, Task 3: Safe Panel-Level PO Deletion, Task 4: Panel Sales Clear Endpoint (`POST /api/units/:id/sales-clear`), Task 5: StepModal & FlowView Updates (+1 more)

### Community 86 - "DeptWorklist.jsx"
Cohesion: 0.32
Nodes (7): DEPT_COLORS, DeptWorklist(), PIPELINE, PRIORITY_CONFIG, STEP_STATUS_CONFIG, StepPill(), UnitRow()

### Community 87 - "Generate Report"
Cohesion: 0.29
Nodes (7): Audit Health Score, Detailed Findings by Severity, Executive Summary, Generate Report, Patterns & Systemic Issues, Platform Conformance Verdict, Positive Findings

### Community 88 - "Cognitive Load Assessment"
Cohesion: 0.29
Nodes (7): Cognitive Load Assessment, Cognitive Load Checklist, Extraneous Load: Bad Design, Germane Load: Learning Effort, Intrinsic Load: The Task Itself, The Working Memory Rule, Three Types of Cognitive Load

### Community 89 - "Impeccable Finish Reviewer"
Cohesion: 0.29
Nodes (6): Checks, in order, Disposition, Impeccable Finish Reviewer, Input Contract, Output Contract, Verdict Pass

### Community 90 - "Impeccable Manual Edit Applier"
Cohesion: 0.29
Nodes (6): Checks, Entry Atomicity, Impeccable Manual Edit Applier, Input Contract, Output Contract, Workflow

### Community 91 - "live-browser-ignores.js"
Cohesion: 0.52
Nodes (6): globToRegex(), matchesScope(), normalizeIgnoreRule(), normalizeIgnoreValue(), pageCandidates(), resolveDetectIgnores()

### Community 92 - "Diagnostic Scan"
Cohesion: 0.33
Nodes (6): 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Diagnostic Scan

### Community 93 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand

### Community 94 - "Visualize: Direction Comps & Asset Production"
Cohesion: 0.33
Nodes (5): After approval: the comp becomes a spec, Generate three compositional options, One approval point, Plates and provenance, Visualize: Direction Comps & Asset Production

### Community 95 - "impeccable"
Cohesion: 0.60
Nodes (5): impeccable script, check_download(), fetch_url(), probe_ok(), setup_help()

### Community 96 - "Impeccable Documenter"
Cohesion: 0.40
Nodes (4): Impeccable Documenter, Input Contract, Output Contract, Workflow

### Community 97 - "Region map"
Cohesion: 0.40
Nodes (4): Containment, Painted material, Region map, What varies independently

### Community 98 - "Heuristics Scoring Guide"
Cohesion: 0.50
Nodes (4): Heuristics Scoring Guide, Issue Severity (P0–P3), Reference Material, Score Summary

### Community 99 - "bolder.md"
Cohesion: 0.33
Nodes (5): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat

### Community 100 - "Read"
Cohesion: 0.50
Nodes (3): Comps, Directions, Read

### Community 101 - "renderMountErrorCard"
Cohesion: 0.50
Nodes (5): clearMountErrorCard(), mountErrorCardBottomOffset(), renderMountErrorCard(), retryMountErrorCard(), truncateMiddle()

### Community 102 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 103 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, check, dev, preview

### Community 104 - "StatsRow.jsx"
Cohesion: 0.70
Nodes (4): AggregateStats(), DaysChip(), OrderStats(), StatsRow()

### Community 105 - "Persuade and Experience"
Cohesion: 0.50
Nodes (3): Comps, Directions, Persuade and Experience

### Community 106 - "refreshLiveControlsForManualApply"
Cohesion: 0.67
Nodes (3): hasTextRows(), check(), refreshLiveControlsForManualApply()

## Knowledge Gaps
- **552 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+547 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 623 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `init()` connect `init` to `handleManualEditActivity`, `Init flow`, `SKILL.md`, `live-browser.js`, `onAnnotDown`, `live.md`, `doctor.md`, `renderDesignVisual`, `setLiveState`, `initPageChat`, `connectSSE`, `initGlobalBar`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Why does `Commands` connect `SKILL.md` to `init`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `Reference Material` connect `Heuristics Scoring Guide` to `Cognitive Load Assessment`, `Persona-Based Design Testing`, `critique.md`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _552 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13105413105413105 - nodes in this community are weakly interconnected._
- **Should `db.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14130434782608695 - nodes in this community are weakly interconnected._