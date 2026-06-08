import os
from pathlib import Path

# --- KONFIGURASI ---
# Sesuaikan direktori ini ke folder Frontend Anda
TARGET_DIRECTORY = r"C:\Users\PC\Documents\Dev\mimika-datahub\mimika-datahub-fe"
OUTPUT_FILE = r"C:\Users\PC\Documents\Dev\mimika-datahub\mimika-datahub-fe\mimika-fe-gis-integration.txt"

# --- DAFTAR FILE FRONTEND SPASIAL & INTEGRASI ---
ALLOWED_RELATIVE_FILES = [
    # 1. Halaman Utama (Main Wrapper)
    "src/app/(public)/explorer/page.tsx",
    
    # 2. Presentation Layer (Komponen Peta Leaflet)
    "src/components/gis/MapWrapper.tsx",
    "src/components/gis/MimikaMap.tsx",
    "src/components/gis/MapHUD.tsx",
    "src/components/gis/AssetMarkers.tsx",
    "src/components/gis/MapPicker.tsx",
    
    # 3. Presentation Layer (UI Panels)
    "src/components/gis/PanelOrchestrator.tsx",
    "src/components/gis/panels/AboutPanel.tsx",
    "src/components/gis/panels/AssetDetailPanel.tsx",
    "src/components/gis/panels/AssetPanel.tsx",
    "src/components/gis/panels/CategoryPanel.tsx",
    "src/components/gis/panels/DetailPanel.tsx",
    "src/components/gis/panels/LayerControl.tsx",
    "src/components/gis/panels/OpdPanel.tsx",
    "src/components/gis/panels/DistrictListPanel.tsx",
    "src/components/ui/ImageCarousel.tsx",
    
    # 4. Layouting & Navigation
    "src/components/layout/ExplorerNavbar.tsx",
    "src/components/layout/ExplorerSidebar.tsx",
    
    # 5. INTEGRASI: Controller / State Management (Zustand)
    "src/app/store/useExplorerStore.ts",
    
    # 6. INTEGRASI: Data Access / Service Layer (Fetch API ke Backend)
    "src/app/services/gis.service.ts",
    "src/app/services/asset.service.ts",
    
    # 7. Tipe Data & Utils (Data Contracts)
    "src/app/types/gis.ts",
    "src/app/lib/gisUtils.ts",
    "src/app/lib/assetConfig.ts"
]

def main():
    target_path = Path(TARGET_DIRECTORY)
    if not target_path.is_dir():
        print(f"Error: Folder '{TARGET_DIRECTORY}' tidak ditemukan. Pastikan path benar.")
        return

    files_to_process = []
    
    print("Mengekstrak UI GIS & Layer Integrasi API (Frontend Mode)...")
    for rel_path_str in ALLOWED_RELATIVE_FILES:
        # Konversi ke Path object agar otomatis menyesuaikan dengan OS (Windows/Linux)
        file_path = target_path / Path(rel_path_str)
        
        if file_path.is_file():
            files_to_process.append(file_path)
        else:
            print(f"-> Warning: Berkas tidak ditemukan (Cek nama file/path) -> {rel_path_str}")

    # Tulis hasil salinan ke berkas target
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("=== DOKUMENTASI UI GIS & INTEGRASI BE (FRONTEND ONLY) ===\n\n")
        
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

    print(f"\nSelesai! Berkas siap dianalisis: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()