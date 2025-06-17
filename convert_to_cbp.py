import argparse
import datetime
import json
import os
import re
import zipfile
import xml.etree.ElementTree as ET


def parse_docx(path: str):
    """Extract plain text paragraphs from a DOCX file."""
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        texts = []
        for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
            if t.text:
                texts.append(t.text)
        para_text = ''.join(texts).strip()
        if para_text:
            paragraphs.append(para_text)
    return paragraphs


def parse_pdf(path: str):
    """Extract text from a PDF file using pdfminer.six."""
    try:
        from pdfminer.high_level import extract_text
    except ImportError as exc:
        raise RuntimeError('pdfminer.six is required to parse PDF files') from exc
    text = extract_text(path)
    paragraphs = [line.strip() for line in text.splitlines() if line.strip()]
    return paragraphs


def _security() -> dict:
    """Return default security object used by Section and StepAction."""
    return {
        'Role': [],
        'Qualification': [],
        'QualificationGroup': []
    }


def _create_section(number: str, title: str, uid: int) -> dict:
    """Create a section object mirroring Section model defaults."""
    return {
        'text': '',
        'children': [],
        'id': '',
        'number': number,
        'dgSequenceNumber': number,
        'title': title,
        'numberedChildren': True,
        'dgUniqueID': str(uid),
        'dgType': 'Section',
        'type': 'Section',
        'numberedSteps': True,
        'acknowledgementReqd': None,
        'applicabilityRule': [],
        'rule': [],
        'ctrlKey': False,
        'usage': 'Continuous',
        'dependency': 'Default',
        'configureDependency': [],
        'dependencyChecked': False,
        'checkboxNode': True,
        'Security': _security(),
        'dynamic_number': 0,
        'dynamic_section': False,
        'hide_section': False,
        'selectedDgType': 'Section'
    }


def _create_step_action(number: str, text: str, uid: int) -> dict:
    """Create a step action object mirroring StepAction model defaults."""
    return {
        'text': '',
        'children': [],
        'id': '',
        'stepType': 'Simple Action',
        'condition': None,
        'action': '',
        'itemType': None,
        'actionText': text,
        'additionalInfo': None,
        'dgUniqueID': str(uid),
        'criticalLocation': '',
        'actionVerb': None,
        'object': None,
        'criticalSupplementalInformation': None,
        'requiresIV': False,
        'requiresCV': False,
        'requiresQA': False,
        'requiresPC': False,
        'holdPointStart': False,
        'holdPointEnd': False,
        'isCritical': False,
        'number': number,
        'dgSequenceNumber': number,
        'status': '',
        'compID': None,
        'compDescription': None,
        'building': None,
        'elevation': None,
        'room': None,
        'location': None,
        'dgType': 'StepAction',
        'applicabilityRule': [],
        'rule': [],
        'numberedChildren': True,
        'ctrlKey': False,
        'numberedSubSteps': True,
        'componentInformation': [],
        'dependencyChecked': False,
        'checkboxNode': True,
        'Security': _security()
    }


def build_cbp_json(paragraphs):
    """Convert document paragraphs into a structured cbp.json."""
    cbp = {'section': []}
    current_section = None
    step_lookup = {}
    uid = 1

    section_re = re.compile(r'^(\d+\.0)\s*(.*)')
    step_re = re.compile(r'(?:^\[(\d+(?:\.\d+)+)\]|^(\d+\.\d+(?:\.\d+)*))')

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        m = section_re.match(para)
        if m:
            number, title = m.group(1), m.group(2).strip()
            current_section = _create_section(number, title, uid)
            uid += 1
            cbp['section'].append(current_section)
            step_lookup = {}
            continue

        m = step_re.match(para)
        if m:
            number = m.group(1) or m.group(2)
            text = para[m.end(0):].strip()
            step = _create_step_action(number, text, uid)
            uid += 1
            step_lookup[number] = step
            parent_number = '.'.join(number.split('.')[:-1])
            if parent_number and parent_number in step_lookup:
                step_lookup[parent_number]['children'].append(step)
            elif current_section:
                current_section['children'].append(step)
            continue

        if current_section:
            step = _create_step_action('', para, uid)
            uid += 1
            current_section['children'].append(step)

    return cbp


def main():
    parser = argparse.ArgumentParser(description='Convert DOCX or PDF to cbp.json')
    parser.add_argument('input_file', help='Input DOCX or PDF file')
    parser.add_argument('output_json', help='Path to output cbp.json')
    args = parser.parse_args()

    ext = os.path.splitext(args.input_file)[1].lower()
    if ext in ('.docx', '.doc'):
        paragraphs = parse_docx(args.input_file)
    elif ext == '.pdf':
        paragraphs = parse_pdf(args.input_file)
    else:
        raise SystemExit('Unsupported input file type: %s' % ext)

    cbp_json = build_cbp_json(paragraphs)
    with open(args.output_json, 'w', encoding='utf-8') as f:
        json.dump(cbp_json, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
