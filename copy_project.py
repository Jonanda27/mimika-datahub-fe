import os
from pathlib import Path

# --- KONFIGURASI ---
TARGET_DIRECTORY = r"C:\Users\PC\Documents\Dev\mimika-datahub\mimika-datahub-fe"
OUTPUT_FILE = r"C:\Users\PC\Documents\Dev\mimika-datahub\mimika-datahub-fe\mimika-fe-gis.txt"

# Daftar berkas spesifik yang diizinkan untuk disalin (Targeted List)
ALLOWED_RELATIVE_FILES = [
    "src/components/gis/panels/AboutPanel.tsx",
    "src/components/gis/panels/AssetDetailPanel.tsx",
    "src/components/gis/panels/AssetPanel.tsx",
    "src/components/gis/panels/CategoryPanel.tsx",
    "src/components/gis/panels/DetailPanel.tsx",
    "src/components/gis/panels/LayerControl.tsx",
    "src/components/gis/panels/OpdPanel.tsx",
    "src/components/gis/panels/DistrictListPanel.tsx",
    "src/components/gis/AnalysisOverlay.tsx",
    "src/components/gis/AssetDetailModal.tsx",
    "src/components/gis/AssetMarkers.tsx",
    "src/components/gis/MapHUD.tsx",
    "src/components/gis/MapPicker.tsx",
    "src/components/gis/MapWrapper.tsx",
    "src/components/gis/MimikaMap.tsx",
    "src/components/gis/PanelOrchestrator.tsx",
    "src/components/layout/ExplorerNavbar.tsx",
    "src/components/layout/ExplorerSidebar.tsx",
    "src/app/types/gis.ts",
    "src/components/ui/ImageCarousel.tsx"
    "src/app/store/useExplorerStore.ts",
    "src/app/services/gis.service.ts",
    "src/app/(public)/explorer/page.tsx"
]

def main():
    target_path = Path(TARGET_DIRECTORY)
    if not target_path.is_dir():
        print(f"Error: Folder '{TARGET_DIRECTORY}' tidak ditemukan.")
        return

    files_to_process = []
    
    print("Memproses berkas spesifik (Targeted Mode)...")
    for rel_path_str in ALLOWED_RELATIVE_FILES:
        # Konversi ke Path object agar otomatis menyesuaikan dengan OS (Windows/Linux)
        file_path = target_path / Path(rel_path_str)
        
        if file_path.is_file():
            files_to_process.append(file_path)
        else:
            print(f"-> Warning: Berkas tidak ditemukan -> {rel_path_str}")

    # Tulis hasil salinan ke berkas target
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("=== STRUKTUR & ISI KODE (HYBRID MODE) ===\n\n")
        
        for file_path in sorted(files_to_process):
            relative_path = file_path.relative_to(target_path)
            try:
                content = file_path.read_text("utf-8", errors="ignore")
                
                # Normalisasi backslash ke forward-slash untuk keseragaman tulisan header berkas
                header_path = str(relative_path).replace("\\", "/")
                
                f.write(f"\n--- FILE: {header_path} ---\n")
                f.write(content)
                f.write("\n")
                print(f"-> Menyalin: {header_path}")
            except Exception as e:
                print(f"-> Gagal membaca {relative_path}: {e}")

    print(f"\nSelesai! Berkas hybrid tersimpan di: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()