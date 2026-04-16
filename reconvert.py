# -*- coding: utf-8 -*-
"""用新版 parse_pdf（pdfplumber + fitz 雙引擎）重新轉換 PDF"""
import os, sys

# 確保可以 import app 模組
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import parse_pdf

class FakeUploadedFile:
    """模擬 Streamlit UploadedFile"""
    def __init__(self, path):
        self.name = os.path.basename(path)
        with open(path, "rb") as f:
            self._data = f.read()
    def read(self):
        return self._data
    def seek(self, pos):
        pass

# 設定路徑
RAW_DIR = os.path.join(os.path.dirname(__file__), "Raw_Files")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output_md")
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

# 掃描所有 Raw_Files 中的 PDF 並重新轉換
count = 0
for root, dirs, files in os.walk(RAW_DIR):
    for fname in files:
        if fname.lower().endswith(".pdf"):
            pdf_path = os.path.join(root, fname)
            print(f"Converting: {fname} ...")
            
            fake_file = FakeUploadedFile(pdf_path)
            result = parse_pdf(fake_file, images_dir=IMAGES_DIR)
            
            md_name = os.path.splitext(fname)[0] + ".md"
            md_path = os.path.join(OUTPUT_DIR, md_name)
            
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(f"# 檔案來源: {fname}\n\n")
                f.write(result)
            
            print(f"  -> {md_path} ({len(result):,} chars)")
            count += 1

print(f"\nDone! Converted {count} PDF files.")
