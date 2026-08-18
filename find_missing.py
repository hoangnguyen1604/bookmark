import re
with open('/Users/gi/.gemini/antigravity/scratch/bookmark-hub/raw_bookmarks.txt', 'r', encoding='utf-8') as f:
    raw_md = f.read()

lines = raw_md.split('\n')
for i, l in enumerate(lines):
    l_str = l.strip()
    if l_str.startswith('- ['):
        m = re.match(r'^-\s+\[(.*?)\]\((.*?)\)$', l_str)
        if not m:
            print(f"Line {i+1}: {l_str}")
