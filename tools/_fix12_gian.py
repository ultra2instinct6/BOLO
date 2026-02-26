#!/usr/bin/env python3
"""FIX 12: Differentiate explanation from hint in all 29 gian_check entries.
Each gian_check currently has identical hint and explanation text.
We keep the hint as-is and replace the explanation with new, more detailed text.
We locate each explanation by finding the unique hint text (which stays unchanged)
and then replacing the explanation block that immediately follows it."""

import json, re, sys

with open('app/data/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

def replace_explanation(content, gian_id, new_en, new_pa):
    """Find a gian_check by id, then replace its explanation en and pa."""
    global changes
    
    # Find the id
    id_str = f'"id": "{gian_id}"'
    idx = content.find(id_str)
    if idx == -1:
        print(f"  ERROR: could not find {gian_id}")
        return content
    
    # Find "explanation": { after this id (but before the next step)
    expl_key = '"explanation": {'
    expl_idx = content.find(expl_key, idx)
    if expl_idx == -1 or expl_idx > idx + 3000:
        print(f"  ERROR: could not find explanation for {gian_id}")
        return content
    
    # Find the "en": line
    en_start = content.find('"en": "', expl_idx)
    if en_start == -1 or en_start > expl_idx + 200:
        print(f"  ERROR: could not find en in explanation for {gian_id}")
        return content
    
    # Find end of en value (look for the closing quote before comma/newline)
    # The en value ends with "," or just "
    en_val_start = en_start + 7  # after '"en": "'
    # Find the closing quote - handle escaped quotes
    i = en_val_start
    while i < len(content):
        if content[i] == '\\':
            i += 2  # skip escaped char
            continue
        if content[i] == '"':
            break
        i += 1
    en_val_end = i
    old_en = content[en_val_start:en_val_end]
    
    # Find the "pa": line
    pa_start = content.find('"pa": "', en_val_end)
    if pa_start == -1 or pa_start > en_val_end + 200:
        print(f"  ERROR: could not find pa in explanation for {gian_id}")
        return content
    
    pa_val_start = pa_start + 7
    j = pa_val_start
    while j < len(content):
        if content[j] == '\\':
            j += 2
            continue
        if content[j] == '"':
            break
        j += 1
    pa_val_end = j
    old_pa = content[pa_val_start:pa_val_end]
    
    # Replace
    # Build new content: replace pa first (later position), then en
    new_content = content[:pa_val_start] + new_pa + content[pa_val_end:]
    # Adjust en replacement (pa replacement doesn't affect earlier positions)
    new_content = new_content[:en_val_start] + new_en + new_content[en_val_end:]
    
    # But wait - if new_pa is different length than old_pa, the en positions are before pa, so no adjustment needed
    # Actually we need to be careful: replace en first since it's at earlier position
    # Let me redo this properly
    content_new = content[:en_val_start] + new_en + content[en_val_end:]
    # Now pa positions shifted by (len(new_en) - len(old_en))
    shift = len(new_en) - len(old_en)
    new_pa_val_start = pa_val_start + shift
    new_pa_val_end = pa_val_end + shift
    content_new = content_new[:new_pa_val_start] + new_pa + content_new[new_pa_val_end:]
    
    print(f"  {gian_id}: OK")
    changes += 1
    return content_new

# 1. gian_l_nouns_basics_01
content = replace_explanation(content, "gian_l_nouns_basics_01",
    "'bird' is a living thing \\u2014 nouns name people, animals, places, and things. 'sings' is a verb, 'loudly' is an adverb.",
    "'bird' \\u0a1c\\u0a40\\u0a35 \\u0a39\\u0a48 \\u2014 \\u0a28\\u0a3e\\u0a02 \\u0a32\\u0a4b\\u0a15\\u0a3e\\u0a02, \\u0a1c\\u0a3e\\u0a28\\u0a35\\u0a30\\u0a3e\\u0a02, \\u0a25\\u0a3e\\u0a35\\u0a3e\\u0a02 \\u0a05\\u0a24\\u0a47 \\u0a1a\\u0a40\\u0a1c\\u0a3c\\u0a3e\\u0a02 \\u0a26\\u0a3e \\u0a28\\u0a3e\\u0a02 \\u0a26\\u0a71\\u0a38\\u0a26\\u0a47 \\u0a39\\u0a28\\u0964 'sings' \\u0a15\\u0a3f\\u0a30\\u0a3f\\u0a06 \\u0a39\\u0a48, 'loudly' \\u0a15\\u0a3f\\u0a30\\u0a3f\\u0a06-\\u0a35\\u0a3f\\u0a38\\u0a3c\\u0a47\\u0a38\\u0a3c\\u0a23 \\u0a39\\u0a48\\u0964"
)

# Hmm, these escape sequences won't work in Python strings like this. Let me use actual Unicode.
print("ERROR in approach - rewriting with direct Unicode")
sys.exit(1)
