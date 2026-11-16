import os
import fitz # PyMuPDF

pdf_path = r"C:/Users/Johnrex Louie/.gemini/antigravity/brain/a76c6a1d-c04a-4d59-9747-281673f152c2/.user_uploaded/media_1792917056194_a88f584f.pdf"
out_dir = r"C:/Users/Johnrex Louie/projects/carbon-department/public/images"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

# Render each page as a high-res image
for page_num in range(len(doc)):
    page = doc[page_num]
    pix = page.get_pixmap(dpi=150)
    page_img_path = os.path.join(out_dir, f"page_{page_num + 1}.jpg")
    pix.save(page_img_path)
    print(f"Saved {page_img_path}")

# Also extract embedded images from pages
img_count = 0
for page_num in range(len(doc)):
    page = doc[page_num]
    image_list = page.get_images(full=True)
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        img_name = f"extracted_p{page_num + 1}_img{img_idx + 1}.{image_ext}"
        img_path = os.path.join(out_dir, img_name)
        with open(img_path, "wb") as f:
            f.write(image_bytes)
        img_count += 1
        print(f"Extracted image: {img_name} ({base_image['width']}x{base_image['height']})")

print(f"Done! Rendered {len(doc)} pages and extracted {img_count} embedded images.")
