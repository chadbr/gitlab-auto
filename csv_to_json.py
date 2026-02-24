import csv
import json

csv_file = 'EPAM OSDU Release Status - repos.csv'
json_file = 'repo-info.json'

with open(csv_file, 'r', encoding='utf-8') as f:
    # Skip the first two lines which are empty/filler
    next(f)
    next(f)
    
    # DictReader will use the third line as the header
    reader = csv.DictReader(f)
    
    # Read all remaining rows into a list of dictionaries
    rows = list(reader)

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(rows, f, indent=2)

print("Conversion complete. Wrote to " + json_file)
