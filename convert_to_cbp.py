import argparse
import datetime
import json
import os
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


def build_cbp_json(paragraphs):
    """Convert a list of paragraphs into a cbp.json style structure."""
    section = {'children': []}
    cbp = {'section': [section]}
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    for idx, para in enumerate(paragraphs, start=1):
        field = {
            'fieldName': '',
            'type': 'datapara',
            'dataType': 'label-paragrah',
            'multiline': 'true',
            'text': para,
            'dgType': 'Para',
            'isDataEntry': False,
            'createdBy': 'converter',
            'createdDate': now,
            'dgUniqueID': str(idx),
            'level': 2,
            'isHtmlText': False
        }
        child = {
            'children': [field],
            'number': str(idx),
            'dgSequenceNumber': str(idx),
            'title': f'Paragraph {idx}',
            'level': 1
        }
        section['children'].append(child)
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
