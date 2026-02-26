#!/usr/bin/env python3
"""Fix remaining FIX 10 explanation pa"""
with open('app/data/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find unique context: the explanation en for fix 10 is already changed
# Use it plus partial pa to find and replace
old = "\"en\": \"Both ideas are similar (liking), so 'and' is correct. 'or' implies a choice, which doesn't fit.\""

idx = content.find(old)
if idx == -1:
    print("ERROR: could not find FIX 10 explanation en context")
    exit(1)

# The pa line is on the next line after the en line
# Find the pa line after this location
pa_start = content.find('"pa": "', idx)
pa_end = content.find('"\n', pa_start + 7)
old_pa = content[pa_start:pa_end+1]
print(f"Found pa: {old_pa!r}")

new_pa = '"pa": "\u0a26\u0a4b\u0a35\u0a47\u0a02 \u0a35\u0a3f\u0a1a\u0a3e\u0a30 \u0a2e\u0a3f\u0a32\u0a26\u0a47 \u0a39\u0a28 (\u0a2a\u0a38\u0a70\u0a26), \u0a07\u0a38 \u0a32\u0a08 \'and\' \u0a38\u0a39\u0a40 \u0a39\u0a48\u0964 \'or\' \u0a1a\u0a4b\u0a23 \u0a26\u0a30\u0a38\u0a3e\u0a09\u0a70\u0a26\u0a3e \u0a39\u0a48, \u0a1c\u0a4b \u0a07\u0a71\u0a25\u0a47 \u0a2b\u0a3f\u0a71\u0a1f \u0a28\u0a39\u0a40\u0a02\u0964"'
content = content[:pa_start] + new_pa + content[pa_end+1:]
print(f"Replaced with: {new_pa!r}")

with open('app/data/lessons.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
