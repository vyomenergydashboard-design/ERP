// Default task_masters templates. index.js uses them as fallbacks and to seed an empty table;
// scripts/seed_ci_fixtures.js uses them to give throwaway CI databases a full workflow.
export const DEFAULT_STEPS = [
  { dept: 'Sales', name: 'Upload PO', sub: 'Customer PO + specs', special: 'sales', requires_upload: true, default_doc_type: 'PO', level: 'order', is_mandatory: true },
  {
    dept: 'Design',
    name: 'Review & Classify',
    sub: 'Standard / Non-Standard',
    special: null,
    requires_upload: false,
    default_doc_type: 'General',
    level: 'unit',
    custom_fields: [
      { id: 'classification', label: 'Classification', type: 'Dropdown', options: ['Standard', 'Non-Standard'], datakey: 'classification' }
    ]
  },
  { dept: 'Design', name: 'Release Documents', sub: 'Panel Layout + Electrical Design + BOM', special: 'design', requires_upload: true, default_doc_type: 'Drawing', level: 'unit' },
  { dept: 'Purchase', name: 'Receive Shortfall', sub: 'From Stores after BOM check', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Purchase', name: 'Procure Materials', sub: 'Raise PO to supplier', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Stores', name: 'Stock Check vs BOM', sub: 'Verify availability', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Stores', name: 'Material Status', sub: 'Allotted → Acceptance → Accept-complete', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Stores', name: 'Inform Purchase', sub: 'Send shortfall list', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Planning', name: 'Production Plan', sub: 'Per day capacity', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Production', name: 'Manufacture', sub: 'Fitter (mechanical) + Wireman (electrical)', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'QC', name: 'Receive Panel', sub: 'Test & inspect', special: 'qc', requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'QC', name: 'QC Decision', sub: 'Pass → Dispatch | Fail → Rework/Redesign', special: 'qc', requires_upload: true, default_doc_type: 'QC Report', level: 'unit' },
  { dept: 'Dispatch', name: 'Ready for Dispatch', sub: 'QC cleared panels', special: null, requires_upload: true, default_doc_type: 'Dispatch Document', level: 'unit' },
  { dept: 'Accounts', name: 'Invoice & Dispatch Note', sub: 'Billing & documentation', special: null, requires_upload: true, default_doc_type: 'Dispatch Document', level: 'unit' }
];
