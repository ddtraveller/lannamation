# Sources: the old texts the tales are made from, as text

The Lanna tales are told from old printed books that are on the web only as scans, with no text in them. This folder
keeps the text read from those scans by OCR, so that anyone can search, quote and check what a film says (owner,
2026-10-25: "Anything you get from OCR, check it in so everyone has access to it ... just text"). Only text is kept
here: the scans stay where they are published, and each book links to its own.

Only books in the public domain or under a free licence go here, in full. A book still in copyright gets short
quotations and a link to the holder's copy, never its text.

| File | Book | Pages | Used for |
|---|---|---|---|
| `singhanawat_2516.md` | ตำนานสิงหนวติกุมาร ฉบับสอบค้น, ed. Manit Vallibhotama (Office of the Prime Minister, 1973) | 116 | Chang Ngu (`kit/changngu/`): Phrom's part, PDF pages ~79-100 |
| `phuenmueang_cm_2514.md` | ตำนานพื้นเมืองเชียงใหม่ (Office of the Prime Minister, 1971) | 163 | the next tale, Phaya Mangrai founds Chiang Mai (`kit/next_tales.md`); being read, 2026-10-25 |

Both are public domain in Thailand as marked on Wikimedia Commons (PD-Thailand); each file's head links to the
scan and says why.

## What the OCR gets wrong

The text is machine-read and **not corrected by hand**. Letters are sometimes swapped (ด for ค, ติ for ดิ), passage
numbers are sometimes misread, printed page numbers are often dropped, and names come out wrong now and then (ขอมดำ
came out as ขอมคำ). Each section of a file is one page of the PDF, headed "PDF page N" (and the printed page where it
is known), so a quotation can be checked against the scan's same page before it is used. A correction made against
the scan is welcome: say which page and what the scan shows.

## How a book was read

1. The scan's pages rendered at 1800 px on the long side (`pdftoppm -png -scale-to 1800`).
2. Each page read by Typhoon OCR 3B (SCB 10X, Apache-2.0) running in Ollama, with typhoon-ocr 0.4.1's own default
   prompt and settings: one page, one Markdown file, `ocr/pNNN.md`.
3. `book.json` written by hand from the book itself (title, publisher, source, licence, the offset from PDF page to
   printed page where it was read off the scans).
4. `python book_text.py <book folder> <out.md>` joins the pages into one file, the book's details at its head.
