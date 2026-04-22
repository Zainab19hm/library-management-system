#!/usr/bin/env python3
"""Generate a simple PDF from the assignment markdown without external dependencies."""
from pathlib import Path

SRC = Path('TESTING_ASSIGNMENT_A_TO_Z.md')
OUT = Path('TESTING_ASSIGNMENT_A_TO_Z.pdf')

PAGE_WIDTH = 595
PAGE_HEIGHT = 842
MARGIN = 50
FONT_SIZE = 11
LINE_HEIGHT = 14
MAX_CHARS = 92


def escape_pdf_text(text: str) -> str:
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def wrap_line(line: str, max_chars: int = MAX_CHARS):
    if len(line) <= max_chars:
        return [line]
    words = line.split(' ')
    if len(words) == 1:
        return [line[i:i + max_chars] for i in range(0, len(line), max_chars)]

    wrapped = []
    current = words[0]
    for word in words[1:]:
        candidate = f"{current} {word}"
        if len(candidate) <= max_chars:
            current = candidate
        else:
            wrapped.append(current)
            current = word
    wrapped.append(current)
    return wrapped


def markdown_to_lines(markdown: str):
    out = []
    for raw in markdown.splitlines():
        line = raw.rstrip()
        if line.startswith('### '):
            line = line[4:].strip().upper()
        elif line.startswith('## '):
            line = line[3:].strip().upper()
        elif line.startswith('# '):
            line = line[2:].strip().upper()
        elif line.startswith('- '):
            line = '• ' + line[2:]
        elif line.startswith('1. '):
            line = line
        elif line.startswith('```'):
            continue

        out.extend(wrap_line(line if line else ''))
    return out


def build_pages(lines):
    pages = []
    y = PAGE_HEIGHT - MARGIN
    current = []

    for line in lines:
        if y < MARGIN:
            pages.append(current)
            current = []
            y = PAGE_HEIGHT - MARGIN

        escaped = escape_pdf_text(line)
        current.append(f"BT /F1 {FONT_SIZE} Tf 1 0 0 1 {MARGIN} {y} Tm ({escaped}) Tj ET")
        y -= LINE_HEIGHT

    if current:
        pages.append(current)

    return pages


def create_pdf(pages):
    objects = []

    catalog_obj = "<< /Type /Catalog /Pages 2 0 R >>"
    pages_kids = [f"{4 + i * 2} 0 R" for i in range(len(pages))]
    pages_obj = f"<< /Type /Pages /Kids [{' '.join(pages_kids)}] /Count {len(pages)} >>"

    objects.append(catalog_obj)
    objects.append(pages_obj)

    for i, page_cmds in enumerate(pages):
        page_obj_id = 4 + i * 2
        content_obj_id = page_obj_id + 1

        page_obj = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
            f"/Resources << /Font << /F1 3 0 R >> >> /Contents {content_obj_id} 0 R >>"
        )
        stream = "\n".join(page_cmds)
        content_obj = f"<< /Length {len(stream.encode('latin-1', errors='replace'))} >>\nstream\n{stream}\nendstream"

        objects.append(page_obj)
        objects.append(content_obj)

    font_obj = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    objects.insert(2, font_obj)

    pdf = bytearray(b"%PDF-1.4\n")
    xref = [0]

    for idx, obj in enumerate(objects, start=1):
        xref.append(len(pdf))
        pdf.extend(f"{idx} 0 obj\n{obj}\nendobj\n".encode('latin-1', errors='replace'))

    xref_start = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode('latin-1'))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in xref[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode('latin-1'))

    pdf.extend(
        (
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_start}\n%%EOF\n"
        ).encode('latin-1')
    )

    OUT.write_bytes(pdf)


def main():
    if not SRC.exists():
        raise SystemExit(f"Source file not found: {SRC}")
    text = SRC.read_text(encoding='utf-8')
    lines = markdown_to_lines(text)
    pages = build_pages(lines)
    create_pdf(pages)
    print(f"Generated {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == '__main__':
    main()
