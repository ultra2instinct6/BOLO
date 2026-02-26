#!/usr/bin/env python3
"""Apply FIX 10 and FIX 11 to lessons.js"""

import sys

with open('app/data/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# FIX 10: wrong option
old = '"en": "I like tea but I like coffee."'
new = '"en": "I like tea or I like coffee."'
c = content.count(old)
print(f"FIX10 wrong en: {c} match(es)")
if c == 1:
    content = content.replace(old, new, 1)
    changes += 1

# FIX 10: wrong option pa  
old = 'but \u0a2e\u0a48\u0a28\u0a42\u0a70 \u0a15\u0a4c\u0a2b\u0a3c\u0a40'
new = 'or \u0a2e\u0a48\u0a28\u0a42\u0a70 \u0a15\u0a4c\u0a2b\u0a3c\u0a40'
c = content.count(old)
print(f"FIX10 wrong pa: {c} match(es)")
if c == 1:
    content = content.replace(old, new, 1)
    changes += 1

# FIX 10: explanation en
old = "Both ideas are similar (liking), so 'and' is correct. 'but' shows contrast."
new = "Both ideas are similar (liking), so 'and' is correct. 'or' implies a choice, which doesn't fit."
c = content.count(old)
print(f"FIX10 expl en: {c} match(es)")
if c == 1:
    content = content.replace(old, new, 1)
    changes += 1

# FIX 10: explanation pa - search for unique substring without nukta chars
# Target: "'and' ਸਹੀ ਹੈ। 'but' ਫ਼ਰਕ ਦਰਸਾਉਂਦਾ ਹੈ।"
# The ਫ਼ is U+0A2B U+0A3C in the file
old_pa_10 = "'and' \u0a38\u0a39\u0a40 \u0a39\u0a48\u0964 'but' \u0a2b\u0a3c\u0a30\u0a15 \u0a26\u0a30\u0a38\u0a3e\u0a09\u0a70\u0a26\u0a3e \u0a39\u0a48\u0964"
new_pa_10 = "'and' \u0a38\u0a39\u0a40 \u0a39\u0a48\u0964 'or' \u0a1a\u0a4b\u0a23 \u0a26\u0a30\u0a38\u0a3e\u0a09\u0a70\u0a26\u0a3e \u0a39\u0a48, \u0a1c\u0a4b \u0a07\u0a71\u0a25\u0a47 \u0a2b\u0a3f\u0a71\u0a1f \u0a28\u0a39\u0a40\u0a02\u0964"
c = content.count(old_pa_10)
print(f"FIX10 expl pa: {c} match(es)")
if c == 1:
    content = content.replace(old_pa_10, new_pa_10, 1)
    changes += 1

# FIX 11: wrong option en
old = '"en": "It was raining, and we stayed inside."'
new = '"en": "It was raining, or we stayed inside."'
c = content.count(old)
print(f"FIX11 wrong en: {c} match(es)")
if c == 1:
    content = content.replace(old, new, 1)
    changes += 1

# FIX 11: wrong option pa
old = "and \u0a05\u0a38\u0a40\u0a02 \u0a05\u0a70\u0a26\u0a30 \u0a30\u0a39\u0a47"
new = "or \u0a05\u0a38\u0a40\u0a02 \u0a05\u0a70\u0a26\u0a30 \u0a30\u0a39\u0a47"
c = content.count(old)
print(f"FIX11 wrong pa: {c} match(es)")
if c == 1:
    content = content.replace(old, new, 1)
    changes += 1

# FIX 11: explanation en
old = "Staying inside is the result of rain, so 'so' is correct, not 'and'."
new = "Staying inside is the result of rain, so 'so' is correct. 'or' implies a choice, which makes no sense here."
c = content.count(old)
print(f"FIX11 expl en: {c} match(es)")
if c == 1:
    content = content.replace(old, new, 1)
    changes += 1

# FIX 11: explanation pa
old_pa_11 = "'so' \u0a38\u0a39\u0a40 \u0a39\u0a48, 'and' \u0a28\u0a39\u0a40\u0a02\u0964"
new_pa_11 = "'so' \u0a38\u0a39\u0a40 \u0a39\u0a48\u0964 'or' \u0a1a\u0a4b\u0a23 \u0a26\u0a30\u0a38\u0a3e\u0a09\u0a70\u0a26\u0a3e \u0a39\u0a48, \u0a1c\u0a4b \u0a07\u0a71\u0a25\u0a47 \u0a05\u0a30\u0a25 \u0a28\u0a39\u0a40\u0a02 \u0a30\u0a71\u0a16\u0a26\u0a3e\u0964"
c = content.count(old_pa_11)
print(f"FIX11 expl pa: {c} match(es)")
if c == 1:
    content = content.replace(old_pa_11, new_pa_11, 1)
    changes += 1

with open('app/data/lessons.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nTotal changes applied: {changes}/8")
