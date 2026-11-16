import os
import shutil

src_dir = r"C:/Users/Johnrex Louie/projects/carbon-department/public/images"
dest_dir = r"C:/Users/Johnrex Louie/projects/carbon-department/public/assets"
os.makedirs(dest_dir, exist_ok=True)

asset_map = {
    # Team photos
    "team-oliver-jimenez.jpg": "extracted_p7_img2.jpeg",
    "team-ramjay-anor.jpg": "extracted_p8_img2.jpeg",
    "team-arman-boadilla.jpg": "extracted_p9_img2.jpeg",
    "team-adrian-arzaga.jpg": "extracted_p10_img2.jpeg",
    "team-monchito-baldovino.jpg": "extracted_p11_img2.jpeg",
    
    # Workshop areas
    "workshop-open-parking.jpg": "extracted_p12_img3.jpeg",
    "workshop-mechanical-area.jpg": "extracted_p12_img4.jpeg",
    "workshop-paint-room.jpg": "extracted_p13_img3.jpeg",
    "workshop-body-repair.jpg": "extracted_p13_img4.jpeg",
    "workshop-carbon-production.jpg": "extracted_p14_img3.jpeg",
    
    # Notable Projects
    "project-boracay-etrike.jpg": "extracted_p15_img3.jpeg",
    "project-nissan-370z-hood.jpg": "extracted_p16_img4.jpeg",
    "project-subaru-sti-widebody.jpg": "extracted_p17_img5.jpeg",
    
    # Permits
    "permit-business.jpg": "extracted_p18_img4.jpeg",
    "permit-barangay.jpg": "extracted_p18_img5.jpeg",
    "permit-environment.jpg": "extracted_p18_img6.jpeg",
    "permit-sanitary.jpg": "extracted_p18_img7.jpeg",
    "permit-philhealth.jpg": "extracted_p19_img4.jpeg",
    "permit-pagibig.jpg": "extracted_p19_img5.jpeg",
    "permit-sss.jpg": "extracted_p19_img6.jpeg",
    "permit-bir2303.jpg": "extracted_p19_img7.jpeg",
    
    # Full Permit Pages for high-res preview modal
    "permit-page-18-full.jpg": "page_18.jpg",
    "permit-page-19-full.jpg": "page_19.jpg",
}

for dest_name, src_name in asset_map.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copyfile(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"WARNING: {src_path} not found!")

# Also copy high-res carbon weave pattern crop from page_1.jpg or page_2.jpg
from PIL import Image
p1_path = os.path.join(src_dir, "page_1.jpg")
if os.path.exists(p1_path):
    img = Image.open(p1_path)
    # Crop a clean seamless carbon fiber tile
    w, h = img.size
    # page 1 top section is pure carbon fiber weave
    crop_box = (50, 50, 450, 450)
    cropped = img.crop(crop_box)
    cropped.save(os.path.join(dest_dir, "carbon-weave-tile.jpg"), quality=95)
    print("Saved carbon-weave-tile.jpg")

print("Asset organization complete!")
