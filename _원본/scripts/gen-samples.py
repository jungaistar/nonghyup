# 6차시(AI 데이터 분석) 실습용 가상 샘플 데이터 생성
# 실제 데이터가 아닌 교육용 가상 데이터. UTF-8 BOM 저장(엑셀 한글 호환).
import csv, os, random

random.seed(20260702)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'samples')
os.makedirs(OUT, exist_ok=True)

def write_csv(name, header, rows):
    path = os.path.join(OUT, name)
    with open(path, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print('생성:', name, f'({len(rows)}행)')

# ── 1) 월별 배합사료 판매 (long format) ──
products = [
    ('육계사료', 1200, 720),
    ('산란계사료', 900, 650),
    ('비육돈사료', 1500, 900),
    ('젖소사료', 800, 700),
    ('한우사료', 1100, 880),
]
# 계절 계수(축산 성수기 반영) — 여름 폭염기 육계↓, 겨울 비육↑ 등
season = [0.95,0.93,1.02,1.05,1.08,1.10,0.90,0.88,1.06,1.12,1.15,1.20]
rows = []
for m in range(1, 13):
    for pname, base_ton, unit_price in products:
        ton = int(base_ton * season[m-1] * random.uniform(0.92, 1.08))
        # 이상치 1건 삽입: 8월 육계사료 폭염 급감
        if m == 8 and pname == '육계사료':
            ton = int(ton * 0.55)
        sales = ton * unit_price  # 천원
        rows.append([f'{m}월', pname, ton, sales])
write_csv('월별_사료판매_샘플.csv', ['월', '제품군', '판매량_톤', '매출_천원'], rows)

# ── 2) 거래처 주문 현황 ──
regions = ['경기','충남','전북','전남','경북','경남','강원','충북']
species = ['양계','양돈','낙농','한우']
grades = ['A','B','C']
farms = ['푸른들','새벽','한마음','대성','금강','햇살','너른','청솔','미래','초록',
         '동산','다솔','한별','늘봄','참든','두레','솔가','하늘','온누리','바른',
         '가온','드림','좋은','풍년','해뜰','너울','예든','솔밭','새싹','청우']
rows = []
for i, base in enumerate(farms[:26], start=1):
    name = f'{base}농장'
    reg = random.choice(regions)
    sp = random.choice(species)
    ton = random.choice([12,18,24,30,45,60,80,120])
    day = random.randint(1, 28)
    grade = random.choices(grades, weights=[3,4,3])[0]
    rows.append([f'C{i:03d}', name, reg, sp, ton, f'2026-06-{day:02d}', grade])
write_csv('거래처_주문_샘플.csv',
          ['거래처코드','거래처명','지역','축종','월평균주문_톤','최근주문일','거래등급'], rows)

# ── 3) 고객문의 처리 이력 ──
types = ['주문','배송문의','품질클레임','반품','일반문의']
channels = ['전화','이메일','대리점','홈페이지']
teams = ['영업지원팀','품질관리팀','물류팀','고객만족팀']
status = ['완료','처리중','대기']
rows = []
for i in range(1, 46):
    day = random.randint(1, 30)
    t = random.choices(types, weights=[5,4,3,2,4])[0]
    ch = random.choice(channels)
    team = random.choice(teams)
    # 처리시간: 클레임/반품이 김
    if t in ('품질클레임','반품'):
        hours = round(random.uniform(6, 48), 1)
    else:
        hours = round(random.uniform(0.5, 12), 1)
    st = random.choices(status, weights=[7,2,1])[0]
    rows.append([f'2026-06-{day:02d}', t, ch, team, hours, st])
rows.sort(key=lambda r: r[0])
write_csv('고객문의_처리_샘플.csv',
          ['접수일','문의유형','접수채널','담당팀','처리시간_시간','처리상태'], rows)

print('완료: public/samples/ 3개 파일')
