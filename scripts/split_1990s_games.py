import re
import os

with open('gaming/gaming-classics-1990s.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the data sources section at the end
data_sources_match = re.search(r'## 数据来源说明.*', content, re.DOTALL)
if data_sources_match:
    data_sources = data_sources_match.group(0)
else:
    data_sources = ""

# Extract all game entries
lines = content.split('\n')
i = 0
game_sections = []

while i < len(lines):
    line = lines[i]
    game_match = re.match(r'^### ([^（]+)（([^）]+)）', line)
    if game_match:
        english_name = game_match.group(1).strip()
        chinese_name = game_match.group(2).strip()
        
        # Collect lines until next ### or ## or end of file
        # Skip standalone --- dividers that separate years/sections in the original file
        j = i + 1
        game_lines = []
        while j < len(lines):
            next_line = lines[j]
            if re.match(r'^(###|##)\s', next_line):
                break
            # Skip standalone divider lines from the original document structure
            if next_line.strip() == '---':
                j += 1
                continue
            game_lines.append(next_line)
            j += 1
        
        # Clean up trailing empty lines
        while game_lines and game_lines[-1].strip() == '':
            game_lines.pop()
        
        game_sections.append({
            'english_name': english_name,
            'chinese_name': chinese_name,
            'lines': game_lines
        })
        i = j
    else:
        i += 1

def sanitize_filename(name):
    # lowercase
    name = name.lower()
    # replace spaces with hyphens
    name = name.replace(' ', '-')
    # remove special characters except hyphens, letters, numbers
    name = re.sub(r'[^a-z0-9\-]', '', name)
    # collapse multiple hyphens
    name = re.sub(r'-+', '-', name)
    # strip leading/trailing hyphens
    name = name.strip('-')
    return name + '.md'

os.makedirs('gaming/games/1990s', exist_ok=True)

created_files = []

for game in game_sections:
    filename = sanitize_filename(game['english_name'])
    filepath = os.path.join('gaming/games/1990s', filename)
    
    # Build file content
    file_lines = []
    file_lines.append(f"# {game['english_name']}（{game['chinese_name']}）")
    file_lines.append('')
    
    for line in game['lines']:
        file_lines.append(line)
    
    file_lines.append('')
    file_lines.append('---')
    file_lines.append('')
    file_lines.append('## 数据来源说明')
    file_lines.append('')
    
    # Parse data sources to extract the list items
    ds_lines = data_sources.split('\n')
    in_list = False
    for ds_line in ds_lines[1:]:  # skip the "## 数据来源说明" header
        stripped = ds_line.strip()
        # Skip the divider line right after the header
        if stripped == '---' and not in_list:
            continue
        if stripped.startswith('*') or stripped.startswith('-'):
            in_list = True
            file_lines.append(ds_line)
        elif in_list and stripped == '':
            file_lines.append(ds_line)
        elif in_list and stripped != '' and not stripped.startswith('*') and not stripped.startswith('-'):
            file_lines.append(ds_line)
        elif stripped == '' and not in_list:
            continue
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(file_lines))
    
    created_files.append(filename)
    print(f"Created: {filename}")

print(f"\nTotal files created: {len(created_files)}")
