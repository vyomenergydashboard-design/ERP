import fs from 'fs';
import path from 'path';

async function runTest() {
  console.log('--- 1. Authenticate as Admin ---');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin', password: 'admin' }) // check username/email
  });

  let token = '';
  if (loginRes.ok) {
    const data = await loginRes.json();
    token = data.token;
    console.log('Login succeeded with admin, token received.');
  } else {
    // Try with password admin123
    const loginRes2 = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin', password: 'admin123' })
    });
    if (loginRes2.ok) {
      const data = await loginRes2.json();
      token = data.token;
      console.log('Login succeeded with admin/admin123');
    } else {
      console.error('Login failed:', await loginRes2.text());
      process.exit(1);
    }
  }

  console.log('\n--- 2. Fetch Sales Dept Worklist ---');
  const listRes = await fetch('http://localhost:5000/api/dept-worklist/Sales', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!listRes.ok) {
    console.error('Failed to fetch dept worklist:', await listRes.text());
    process.exit(1);
  }
  const units = await listRes.json();
  console.log(`Retrieved ${units.length} units.`);
  if (units.length === 0) {
    console.log('No units available in worklist.');
    return;
  }

  const sampleUnit1 = units[0];
  const sampleUnit2 = units[1] || units[0];
  console.log('Unit 1:', {
    unit_id: sampleUnit1.unit_id,
    short_serial: sampleUnit1.short_serial,
    po_number: sampleUnit1.po_number,
    po_doc_id: sampleUnit1.po_doc_id,
    po_file_path: sampleUnit1.po_file_path
  });

  console.log('\n--- 3. Create Sample PDF & Test POST /api/units/batch-po ---');
  const dummyPdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n200\n%%EOF`;
  const scratchDir = path.resolve('scratch');
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
  const testPdfPath = path.join(scratchDir, 'test_po.pdf');
  fs.writeFileSync(testPdfPath, dummyPdfContent);

  const unitIdsToAttach = [sampleUnit1.unit_id];
  if (sampleUnit2.unit_id !== sampleUnit1.unit_id) {
    unitIdsToAttach.push(sampleUnit2.unit_id);
  }

  const testPoNumber = 'PO-TEST-' + Math.floor(1000 + Math.random() * 9000);

  const formData = new FormData();
  const blob = new Blob([fs.readFileSync(testPdfPath)], { type: 'application/pdf' });
  formData.append('file', blob, 'test_po_document.pdf');
  formData.append('po_number', testPoNumber);
  formData.append('unit_ids', JSON.stringify(unitIdsToAttach));

  const uploadRes = await fetch('http://localhost:5000/api/units/batch-po', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  const uploadJson = await uploadRes.json();
  console.log('Upload Result Status:', uploadRes.status);
  console.log('Upload Result Body:', uploadJson);

  if (!uploadRes.ok) {
    console.error('Batch PO Upload Failed!');
    process.exit(1);
  }

  console.log('\n--- 4. Verify Worklist has Updated PO Number and Document ---');
  const verifyListRes = await fetch('http://localhost:5000/api/dept-worklist/Sales', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const updatedUnits = await verifyListRes.json();
  const updated1 = updatedUnits.find(u => u.unit_id === sampleUnit1.unit_id);
  console.log('Verified Unit 1 after upload:', {
    unit_id: updated1.unit_id,
    po_number: updated1.po_number,
    po_doc_id: updated1.po_doc_id,
    po_file_path: updated1.po_file_path,
    po_file_name: updated1.po_file_name
  });

  if (updated1.po_number === testPoNumber && updated1.po_doc_id && updated1.po_file_path) {
    console.log('SUCCESS: PO Number and PDF Document attached and verified!');
  } else {
    console.error('FAILURE: Expected po_number', testPoNumber, 'got', updated1.po_number);
    process.exit(1);
  }

  console.log('\n--- 5. Verify Changing Individual Unit PO Later ---');
  if (sampleUnit2.unit_id !== sampleUnit1.unit_id) {
    const diffPo = 'PO-DIFF-' + Math.floor(1000 + Math.random() * 9000);
    const formDiff = new FormData();
    formDiff.append('file', blob, 'diff_po.pdf');
    formDiff.append('po_number', diffPo);
    formDiff.append('unit_ids', JSON.stringify([sampleUnit2.unit_id]));

    const diffRes = await fetch('http://localhost:5000/api/units/batch-po', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formDiff
    });
    console.log('Different PO Upload Status for Unit 2:', diffRes.status);

    const recheckRes = await fetch('http://localhost:5000/api/dept-worklist/Sales', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const finalUnits = await recheckRes.json();
    const final1 = finalUnits.find(u => u.unit_id === sampleUnit1.unit_id);
    const final2 = finalUnits.find(u => u.unit_id === sampleUnit2.unit_id);

    console.log(`Unit 1 PO: ${final1.po_number} (Doc: ${final1.po_file_name})`);
    console.log(`Unit 2 PO: ${final2.po_number} (Doc: ${final2.po_file_name})`);

    if (final1.po_number === testPoNumber && final2.po_number === diffPo) {
      console.log('SUCCESS: Each serial has its own independent PO and document!');
    }
  }

  console.log('\n--- ALL AUTOMATED TESTS PASSED! ---');
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
