import csv
import json

csv_file = "jp_en_100.csv"
json_file = "jp_en_100.json"

data = []

with open(csv_file, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append({"和文": row["和文"], "英文": row["英文"]})

with open(json_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ 変換完了: jp_en_100.json")
