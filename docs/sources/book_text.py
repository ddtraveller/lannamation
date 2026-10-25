"""book_text.py - one book's OCR'd pages as one Markdown text, for lannamation docs/sources/ (owner, 2026-10-25:
"Anything you get from OCR, check it in so everyone has access to it" and "Don't provide the binaries... just text").

    python book_text.py <book dir> <out.md>

Reads <book dir>/book.json (title, source, licence, how it was read) and <book dir>/ocr/pNNN.md (watdonchan
python/lanna_docs/ocr_pages.py), and writes the pages in order under a heading each, "PDF page N" (and the printed
page when book.json gives page_offset), with the book's details at the top. The text is the OCR's, uncorrected.
"""
import json
import re
import sys
from pathlib import Path


def main():
    book, out = Path(sys.argv[1]), Path(sys.argv[2])
    info = json.loads((book / "book.json").read_text(encoding="utf-8"))
    offset = info.get("page_offset")
    lines = [f"# {info['title_th']}", "", f"*{info['title_en']}*", ""]
    for key, label in (("editor", "Editor"), ("publisher", "Publisher"), ("year", "Year"), ("source_url", "Scan"),
                       ("licence", "Licence"), ("ocr", "Read by"), ("preface_note", "Note")):
        if info.get(key):
            lines.append(f"- **{label}:** {info[key]}")
    lines += ["", "The text below is machine-read from the scan and not corrected by hand: letters are sometimes swapped "
              "(ด for ค, ติ for ดิ), printed page numbers are often dropped and names misread. Check a quotation against "
              "the scan's page before using it. Each section is one page of the PDF.", ""]
    pages = sorted(book.glob("ocr/p*.md"), key=lambda p: int(re.sub(r"\D", "", p.stem)))
    for page in pages:
        n = int(re.sub(r"\D", "", page.stem))
        printed = f" (book page {n - offset})" if offset is not None and n > offset else ""
        text = re.sub(r"^#+", lambda m: "##" + m.group(0), page.read_text(encoding="utf-8").strip(), flags=re.M)   # its headings under the page's
        lines += [f"## PDF page {n}{printed}", "", text, ""]
    out.write_text("\n".join(lines), encoding="utf-8", newline="\n")
    print(out, len(pages), "pages", out.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
