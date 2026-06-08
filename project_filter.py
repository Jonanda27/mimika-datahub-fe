import os
from pathlib import Path

# --- KONFIGURASI ---
TARGET_DIRECTORY = r"C:\Users\PC\Documents\Dev\mimika-datahub\mimika-datahub-fe"
OUTPUT_FILE = r"C:\Users\PC\Documents\Dev\mimika-datahub\mimika-datahub-fe\mimika-fe-hybrid.txt"

# 1. Folder yang HARAM hukumnya (Blacklist)
FORBIDDEN_DIRS = {
    "node_modules", ".git", "dist", "build", "__pycache__", ".vscode", ".idea", 
    "venv", ".next", ".nuxt", ".svelte-kit", "coverage", "assets", "public"
}

# 2. Folder yang BOLEH diambil (Whitelist)
ALLOWED_DIRS = {"src", "components"}

# 3. Ekstensi yang diinginkan saja
INCLUDE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".json", ".sql"}

def is_binary(file_path: Path) -> bool:
    try:
        with open(file_path, 'rb') as f:
            return b'\x00' in f.read(512)
    except Exception:
        return True

def main():
    target_path = Path(TARGET_DIRECTORY)
    if not target_path.is_dir():
        print(f"Error: Folder '{TARGET_DIRECTORY}' tidak ditemukan.")
        return

    files_to_process = []
    
    print("Memproses file (Hybrid Mode)...")
    for file_path in target_path.rglob("*"):
        # Cek apakah path mengandung folder terlarang
        if any(part in FORBIDDEN_DIRS for part in file_path.parts):
            continue
            
        # Cek apakah file berada di dalam folder yang diizinkan
        if not any(part in ALLOWED_DIRS for part in file_path.parts):
            continue

        if file_path.is_file() and file_path.suffix in INCLUDE_EXTENSIONS:
            if not is_binary(file_path):
                files_to_process.append(file_path)

    # Tulis hasil
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("=== STRUKTUR & ISI KODE (HYBRID MODE) ===\n\n")
        for file_path in sorted(files_to_process):
            relative_path = file_path.relative_to(target_path)
            try:
                content = file_path.read_text("utf-8", errors="ignore")
                f.write(f"\n--- FILE: {relative_path} ---\n")
                f.write(content)
                f.write("\n")
                print(f"-> Menyalin: {relative_path}")
            except Exception as e:
                print(f"-> Gagal baca {relative_path}: {e}")

    print(f"\nSelesai! File hybrid tersimpan di: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()