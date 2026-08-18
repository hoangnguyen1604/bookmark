import re
import json
from urllib.parse import urlparse
import os

with open('/Users/gi/.gemini/antigravity/scratch/bookmark-hub/raw_bookmarks.txt', 'r', encoding='utf-8') as f:
    raw_md = f.read()

categories = [
    {"id": "ai-tools", "title": "🤖 AI Tools & Ứng dụng AI trong Lập trình / Thiết kế", "pattern": "🤖 AI Tools", "icon": "sparkles"},
    {"id": "resources", "title": "📦 Tài nguyên tải về (Icon, Font, Illustration, Mockup, Pattern, 3D...)", "pattern": "📦 Tài nguyên", "icon": "box"},
    {"id": "inspiration", "title": "🎨 Tham khảo & Cảm hứng thiết kế (Portfolio, Gallery, Showcase)", "pattern": "🎨 Tham khảo", "icon": "palette"},
    {"id": "design-system", "title": "🧩 Design System / UI Kit / Component Library", "pattern": "🧩 Design System", "icon": "puzzle"},
    {"id": "colors", "title": "🌈 Màu sắc & Gradient", "pattern": "🌈 Màu sắc", "icon": "rainbow"},
    {"id": "learning", "title": "📚 Học UX/UI & Bài viết kiến thức", "pattern": "📚 Học UX/UI", "icon": "book"},
    {"id": "games", "title": "🎮 Game luyện mắt thẩm mỹ / kỹ năng thiết kế", "pattern": "🎮 Game luyện mắt", "icon": "gamepad"},
    {"id": "english", "title": "🗣️ Học tiếng Anh", "pattern": "🗣️ Học tiếng Anh", "icon": "message-circle"}
]

sections = re.split(r'##\s+', raw_md)

bookmarks = []
current_id = 0

for section in sections:
    if not section.strip():
        continue
    lines = section.strip().split('\n')
    header = lines[0].strip()
    
    matched_cat = None
    for c in categories:
        if c["pattern"] in header:
            matched_cat = c
            break
            
    if not matched_cat:
        continue
        
    for line in lines:
        m = re.match(r'^-\s+\[(.*?)\]\((.*?)\)$', line.strip())
        if m:
            title = m.group(1).strip()
            url = m.group(2).strip()
            parsed = urlparse(url)
            domain = parsed.netloc.replace('www.', '') if parsed.netloc else 'link'
            
            # generate clean tags
            clean_title_words = re.findall(r'\b[A-Za-z0-9]{3,}\b', title.lower())
            tags = list(set(clean_title_words[:6]))
            
            current_id += 1
            bookmarks.append({
                "id": f"bm-{current_id}",
                "title": title,
                "url": url,
                "category": matched_cat["id"],
                "categoryTitle": matched_cat["title"],
                "domain": domain,
                "tags": tags
            })

print(f"Total parsed bookmarks: {len(bookmarks)}")

counts = {}
for b in bookmarks:
    counts[b['category']] = counts.get(b['category'], 0) + 1
print("Category counts:")
for c in categories:
    print(f"  - {c['id']}: {counts.get(c['id'], 0)}")

os.makedirs('/Users/gi/.gemini/antigravity/scratch/bookmark-hub/src/data', exist_ok=True)
output_path = "/Users/gi/.gemini/antigravity/scratch/bookmark-hub/src/data/bookmarks.js"

js_content = f"""// Complete dataset of 314 curated bookmarks
export const CATEGORIES = {json.dumps(categories, ensure_ascii=False, indent=2)};

export const BOOKMARKS = {json.dumps(bookmarks, ensure_ascii=False, indent=2)};
"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Saved bookmarks.js successfully!")
