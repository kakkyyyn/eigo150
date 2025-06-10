import csv

with open("jp_en_100.csv", encoding="utf-8-sig") as csvfile:  # ←ここがポイント
    reader = csv.DictReader(csvfile)
    for row in reader:
        print({
            "和文": row["Column1"].strip(),
            "英文": row["Column2"].strip(),
            "レベル": row["Column3"].strip(),
        })


import json

csv_file = 'jp_en_100.csv'
json_file = 'output.json'

data = []

with open(csv_file, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append({
            "和文": row["Column1"].strip(),
            "英文": row["Column2"].strip(),
            "chapter": int(row["Column3"].strip())
        })

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("変換完了")
