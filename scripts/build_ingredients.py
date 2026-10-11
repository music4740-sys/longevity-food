"""Builds public/data/ingredients.json — Korean raw-ingredient nutrition (per serving).

Source: 공공데이터포털 "전국통합식품영양성분정보(원재료성식품)표준데이터" (15100065,
농촌진흥청 국가표준식품성분표 + 국립수산과학원 표준수산물성분표 + 식약처; 이용허락범위 제한 없음).

Source rows are per 100 g and repeat one food across origin region / harvest month, so
rows are collapsed by name (region/month dropped, values averaged) and rescaled to a
typical single serving. Run: python scripts/build_ingredients.py

Output (compact on purpose — it is fetched lazily, not bundled):
  { "subgroups": [...], "items": [[id, name, family, subgroupIdx, servingGrams,
      kcal, carbs, sugar, protein, fat, saturatedFat, fiber, sodium, calcium, iron], ...] }
Nutrient order == NUTRIENT_KEYS in types/nutrition.ts.
"""
import hashlib
import json
import os
import urllib.parse
import urllib.request
from collections import defaultdict

PK = "15100065"
BASE = "https://www.data.go.kr/download/"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data", "ingredients.json")

# Source column -> NUTRIENT_KEYS order.
NUTRIENT_COLS = ["ENERC", "CHOCDF", "SUGAR", "PROT", "FATCE", "FASAT", "FIBTG", "NAT", "CA", "FE"]
DECIMALS = [0, 1, 1, 1, 1, 1, 1, 0, 0, 1]

STATES = {
    "생것", "삶은것", "데친것", "구운것", "볶은것", "말린것", "튀긴것", "찐것", "절인것", "익힌것",
    "조린것", "냉동", "통조림", "훈제", "젓갈", "삶은것(물)", "구운것(팬)", "구운것(오븐)", "구운것(직화)",
}
DROP_PARTS = {"육", "전체", "대표", "평균", "가식부", "살코기"}

# Typical single serving in grams (or ml) per top-level group.
SERVING = {
    "어패류 및 기타 수산물": 80, "채소류": 70, "육류": 100, "곡류": 90, "과일류": 100,
    "해조류": 30, "버섯류": 50, "감자 및 전분류": 100, "견과 및 종실류": 30, "두류": 40,
    "조미료류": 10, "차류": 5, "기타": 20, "난류": 60, "유지류": 10, "당류": 10, "우유류": 200,
}
DRIED_SEAWEED_G = 10


def fetch_rows():
    col = json.load(urllib.request.urlopen(f"{BASE}columList.json?pk={PK}&ext=CSV", timeout=60))
    cols = col["tableVO"]["colNmList"]
    query = [
        ("publicDataPk", PK),
        ("totalCount", col["totalCount"]),
        ("svcTableNm", col["tableVO"]["svcTableNm"]),
        ("perPage", 10000),
        ("page", 1),
    ] + [("colNmList", c) for c in cols]
    url = f"{BASE}standard.json?" + urllib.parse.urlencode(query)
    return json.load(urllib.request.urlopen(url, timeout=180))


def num(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def clean_parts(row):
    parts = row["FOOD_NM"].split("_")
    # Seafood rows end in "..._<지역>_<N월>": drop the region/month so variants collapse.
    if row.get("PRD_COLL_CAP_MON") and len(parts) >= 3 and parts[-1].endswith("월"):
        parts = parts[:-2]
    return [p for p in parts if p not in ("대표", "평균")]


def display(parts):
    family, rest = parts[0], parts[1:]
    state = rest[-1] if rest and rest[-1] in STATES else None
    core = [p for p in (rest[:-1] if state else rest) if p not in DROP_PARTS]
    name = " ".join(" ".join(core).split()) if core else family
    return f"{name} ({state})" if state else name


def main():
    rows = fetch_rows()
    groups = defaultdict(list)
    for row in rows:
        if num(row["ENERC"]) is None:
            continue
        parts = clean_parts(row)
        groups[tuple(parts)].append((parts, row))

    subgroups = []
    items = []
    names = defaultdict(int)
    for key, members in sorted(groups.items()):
        parts, first = members[0]
        sub = first["FOOD_LV3_NM"]
        if sub not in subgroups:
            subgroups.append(sub)
        grams = SERVING.get(sub, 100)
        if sub == "해조류" and any("말린것" in p for p in parts):
            grams = DRIED_SEAWEED_G
        vals = []
        for col, dec in zip(NUTRIENT_COLS, DECIMALS):
            samples = [num(r[col]) for _, r in members if num(r[col]) is not None]
            avg = sum(samples) / len(samples) if samples else 0.0
            scaled = round(avg * grams / 100, dec)
            vals.append(int(scaled) if dec == 0 else scaled)
        name = display(parts)
        names[name] += 1
        items.append(
            [
                "ing-" + hashlib.sha1("_".join(parts).encode("utf-8")).hexdigest()[:8],
                name,
                parts[0],
                subgroups.index(sub),
                grams,
                *vals,
                "_".join(parts),
            ]
        )

    # Colliding display names fall back to the full cleaned path.
    for item in items:
        if names[item[1]] > 1:
            item[1] = " ".join(item[-1].replace("_", " ").split())
        item.pop()

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"subgroups": subgroups, "items": items}, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(rows)} source rows -> {len(items)} ingredients, {os.path.getsize(OUT) // 1024} KB")


if __name__ == "__main__":
    main()
