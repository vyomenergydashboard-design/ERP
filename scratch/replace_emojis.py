import os

def remove_emojis_from_file(file_path):
    print(f"Processing: {file_path}")
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Define exact search and replacement strings to eliminate all emojis cleanly
    replacements = {
        # General Emojis
        '📥 Import': 'Import',
        '🏢 ': '',
        '🚚 ': 'Delivery: ',
        '🎉': '',
        '📎': '',
        'ℹ️': '',
        '⛔': '',
        '⚠️': '',
        '⚡': '',
        '📄 ': '',
        '✏️ ': '',
        '✏ ': '',
        '✅ Yes': 'Yes',
        '❌ No': 'No',
        '✔️': '',
        '✔': '',
        '❌': '',
        '✅': '',
        '↩ Production': 'Production',
        '↩ Design': 'Design',
        '↩ Returned': 'Returned',
        '⚙ ': '',
        '✎': '',
        '⬇ ': '',
        '📊': '',
        '📂': '',
        '☀': '',
        '🌙': '',
        '☀️': '',
    }

    # Custom file-by-file overrides for specific patterns
    if 'OrderList.jsx' in file_path:
        content = content.replace("field.value === true ? '✅ Yes' : '❌ No'", "field.value === true ? 'Yes' : 'No'")
    if 'StepModal.jsx' in file_path:
        content = content.replace("field.value === true ? '✅ Yes' : '❌ No'", "field.value === true ? 'Yes' : 'No'")
        content = content.replace("checklist.layout ? '✅' : '❌'", "checklist.layout ? 'Yes' : 'No'")
        content = content.replace("checklist.electrical ? '✅' : '❌'", "checklist.electrical ? 'Yes' : 'No'")
        content = content.replace("checklist.bom ? '✅' : '❌'", "checklist.bom ? 'Yes' : 'No'")

    for target, replacement in replacements.items():
        content = content.replace(target, replacement)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

files_to_clean = [
    'src/components/OrderList.jsx',
    'src/components/PlanningModule.jsx',
    'src/components/RightPanel.jsx',
    'src/components/StepModal.jsx',
    'src/index.css'
]

for file in files_to_clean:
    if os.path.exists(file):
        remove_emojis_from_file(file)

print("All replacements done!")
