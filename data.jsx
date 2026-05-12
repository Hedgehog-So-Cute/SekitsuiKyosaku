// 全タブで共有するデータ
const COLORS = {
  navy: "#1C2B3A",
  navySoft: "#2E4358",
  ink: "#1a1a1a",
  sub: "#5C6B7A",
  hint: "#8A98A6",
  line: "#E4E2DC",
  paper: "#F5F4F0",
  card: "#FFFFFF",
  cream: "#FAF8F2",
  red: "#C0392B",
  orange: "#D97E2A",
  green: "#2F8F58",
  blue: "#2C6FA8",
  purple: "#7A4FA0",
};

// ── Tab 1: 症状スコア ────────────────────────────────────────────
const walkingOptions = [
  { id: "a", label: "500m 以上",       sub: "ほぼ支障なく歩ける", level: 1, levelLabel: "軽症レベル",   color: COLORS.green },
  { id: "b", label: "100〜500m",        sub: "途中で休憩が必要",   level: 2, levelLabel: "中等度",       color: COLORS.blue },
  { id: "c", label: "50〜100m",         sub: "短距離で症状出現",   level: 3, levelLabel: "経過観察要",   color: COLORS.orange },
  { id: "d", label: "50m 未満",         sub: "屋内移動も困難",     level: 4, levelLabel: "手術適応 高",   color: COLORS.red },
  { id: "e", label: "ほぼ歩けない",     sub: "立位保持が辛い",     level: 5, levelLabel: "早期相談 推奨", color: COLORS.red },
];

const odiItems = [
  { id: "pain",     label: "痛みの強さ",                 hint: "日常生活で感じる痛みの程度" },
  { id: "selfcare", label: "身の回りの動作",             hint: "着替え・入浴・洗面など" },
  { id: "walking",  label: "歩行",                       hint: "外出時の歩行のしやすさ" },
  { id: "sitting",  label: "座る・立つ",                 hint: "椅子・床・立ち上がり動作" },
  { id: "sleep",    label: "睡眠",                       hint: "腰・脚の症状による中途覚醒" },
];
const odiLevels = [
  { v: 0, label: "影響なし" },
  { v: 1, label: "わずか" },
  { v: 2, label: "中等度" },
  { v: 3, label: "強い" },
  { v: 4, label: "全くできない" },
];

// ── Tab 2: 判断基準 ──────────────────────────────────────────────
const decisionCriteria = [
  {
    id: "urgent",
    label: "緊急",
    title: "今すぐ手術が必要なサイン",
    timing: "数日単位で対応",
    color: COLORS.red,
    items: [
      { sign: "排尿・排便の障害", detail: "尿が出なくなる・便意がなくなるなど。馬尾神経の重篤な圧迫を示す。", source: "日本赤十字社愛知医療センター" },
      { sign: "足首・足指が動かせない", detail: "運動麻痺が出現した場合。数日単位で対応が必要。", source: "日本赤十字社愛知医療センター" },
      { sign: "安静時にも激しい痛み", detail: "神経の炎症が重篤な段階に達しているサイン。", source: "国立長寿医療研究センター" },
    ],
    evidence: "これらの症状は保存療法の適応外。放置すると神経ダメージが不可逆になる。",
  },
  {
    id: "elective",
    label: "検討",
    title: "手術を真剣に検討すべき段階",
    timing: "6ヶ月保存療法後が目安",
    color: COLORS.orange,
    items: [
      { sign: "6ヶ月以上の保存療法で改善なし", detail: "薬・注射・リハビリを続けても痛みやしびれが改善しない場合。", source: "由風BIOメディカル・聖路加国際病院" },
      { sign: "間欠性跛行が悪化", detail: "歩ける距離が月単位で短くなっている場合。日常生活への支障が拡大。", source: "足立慶友整形外科" },
      { sign: "筋力低下が顕著", detail: "神経麻痺による筋力低下が見られる場合は、早めの専門医相談が必要。", source: "足立慶友整形外科" },
    ],
    evidence: "手術成功率 80〜90%（国立長寿医療研究センター）。歩行・痛みの改善は比較的良好。",
  },
  {
    id: "conservative",
    label: "様子見",
    title: "保存療法を続けてよい段階",
    timing: "定期観察を継続",
    color: COLORS.green,
    items: [
      { sign: "運動麻痺がなく日常生活に支障なし", detail: "間欠性跛行があっても、麻痺がない軽〜中等度なら経過観察が妥当。", source: "武田病院グループ" },
      { sign: "1/3 は自然に軽快する", detail: "軽〜中等度の患者のうち約 1/3 は保存療法で改善することが知られている。", source: "武田病院グループ" },
    ],
    evidence: "ただし全体の 1/3 は経過中に悪化し手術が必要になる。定期的な経過観察が前提。",
  },
];

const numbnessPoints = [
  { text: "神経は圧迫期間が長いほど回復しにくくなる。しびれが出ている間は神経がまだ生きているサインでもある。", source: "リペアセルクリニック東京院" },
  { text: "手術が成功しても、しびれが残るケースは珍しくない。歩行時の激しい痛みは比較的早く改善するが、しびれの改善は数ヶ月単位でゆっくりとした回復になる。", source: "足立慶友整形外科" },
  { text: "66歳という年齢は手術回避の理由にならない。高齢者でも積極的に手術を実施しており、効果は得られている。", source: "国立長寿医療研究センター" },
];

const ageNotes = [
  "年齢そのものは手術可否に直結しない。重要なのは全身状態・骨密度・心肺機能。",
  "70代・80代になると骨粗鬆症が進み、固定術でのインプラント緩みリスクが上がる。術前に骨粗鬆症治療が必要になるケースもある。",
  "体力がある今のタイミングは、医学的にも合理的な判断時期。",
];

// ── Tab 3: 意思決定マトリクス ─────────────────────────────────────
const proReasons = [
  "これ以上しびれを放置したくない",
  "歩けないことで生活の質が落ちている",
  "孫や家族と一緒に出かけたい",
  "体力があるうちに決断したい",
  "薬や注射の効果が感じられなくなってきた",
  "ジムでのトレーニングを再開したい",
];
const conReasons = [
  "手術リスクが怖い",
  "入院・回復期間が長い",
  "しびれが残るかもしれない",
  "まだ保存療法を試したい",
  "セカンドオピニオンを取ってから決めたい",
  "固定術のボルトを体に残すことに抵抗がある",
];

// ── Tab 4: 医師への質問 ──────────────────────────────────────────
const coreQuestions = [
  "今の状態を放置すると、6ヶ月後・1年後どうなりますか？",
  "内視鏡手術（低侵襲手術）の適応はありますか？ない場合の理由は？",
  "固定術は必要ですか？除圧術だけで対応できますか？",
  "手術後、しびれはどの程度改善が期待できますか？",
];
const extraQuestions = [
  "現在の MRI 画像で、神経はどの程度圧迫されていますか？",
  "骨粗鬆症の検査は必要ですか？",
  "セカンドオピニオンを取ることは可能ですか？",
  "術後リハビリはどの病院で行いますか？",
  "固定術のボルトは将来取り出すことがありますか？",
  "椎間板・骨棘の処置は具体的に何を行いますか？",
];

// ── Tab 5: 回復タイムライン ──────────────────────────────────────
const phases = [
  {
    id: 1, label: "Phase 1", title: "入院・術直後",
    period: "8月上旬〜中旬", duration: "約2週間", color: COLORS.red, months: ["8月"],
    tasks: [
      { name: "手術",            detail: "全身麻酔・開放手術" },
      { name: "ICU・病室安静",   detail: "体位変換のみ許可" },
      { name: "歩行訓練開始",    detail: "術後2〜3日から平行棒歩行" },
      { name: "排泄・食事の自立", detail: "段階的に自立へ" },
    ],
    restriction: "ベッド上安静。起き上がり・前屈・捻転すべて禁止",
    goal: "合併症なく離床できること",
  },
  {
    id: 2, label: "Phase 2", title: "退院・在宅回復",
    period: "8月下旬〜10月", duration: "約6〜8週間", color: COLORS.orange, months: ["8月","9月","10月"],
    tasks: [
      { name: "退院",             detail: "術後2週間前後が目安" },
      { name: "外来リハビリ開始", detail: "週1〜2回の通院" },
      { name: "短距離歩行",       detail: "1日数回・徐々に距離を伸ばす" },
      { name: "コルセット装着",   detail: "外出時・座位時に着用" },
      { name: "デスクワーク復帰", detail: "術後4〜6週ごろから検討" },
    ],
    restriction: "前かがみ禁止・重量物（2kg以上）禁止・長時間座位に注意",
    goal: "室内外を安全に歩行できること。日常生活の基本動作自立",
  },
  {
    id: 3, label: "Phase 3", title: "リハビリ本格化",
    period: "10月〜12月", duration: "約2〜3ヶ月", color: COLORS.blue, months: ["10月","11月","12月"],
    tasks: [
      { name: "体幹トレーニング",  detail: "腰を支える筋肉を強化" },
      { name: "水中歩行・プール",  detail: "関節への負担が少ない運動" },
      { name: "長距離歩行",        detail: "30分〜1時間を目標に" },
      { name: "コルセット離脱",    detail: "医師の許可のもと段階的に" },
      { name: "軽作業復帰",        detail: "立ち仕事・軽い肉体労働" },
    ],
    restriction: "急な動作・ジャンプ・重量物（5kg以上）はまだ控える",
    goal: "1時間以上の連続歩行。痛みなく日常を送れること",
  },
  {
    id: 4, label: "Phase 4", title: "機能回復期",
    period: "1月〜3月", duration: "約2〜3ヶ月", color: COLORS.green, months: ["1月","2月","3月"],
    tasks: [
      { name: "軽いジョギング・自転車", detail: "医師許可後に開始" },
      { name: "日常的な運動再開",       detail: "ヨガ・ストレッチ・軽いスポーツ" },
      { name: "通常業務への完全復帰",   detail: "ほぼ支障なく仕事ができる" },
      { name: "経過観察・画像確認",     detail: "MRIで回復状況を確認" },
    ],
    restriction: "激しい接触スポーツ・重量挙げはまだ要注意",
    goal: "手術前より楽に動けること。しびれ・痛みの大幅改善",
  },
  {
    id: 5, label: "Phase 5", title: "日常・スポーツ復帰",
    period: "4月以降", duration: "以降継続", color: COLORS.purple, months: ["4月〜"],
    tasks: [
      { name: "スポーツ本格復帰",   detail: "種目により個別判断" },
      { name: "体力の維持・向上",   detail: "体幹・下肢筋力の継続強化" },
      { name: "セルフケア確立",     detail: "ストレッチ習慣・姿勢管理" },
      { name: "年1回の定期受診",    detail: "再狭窄の早期発見" },
    ],
    restriction: "術前と同水準の運動が多くの場合可能。固定術ありの場合は医師と相談",
    goal: "術前の生活水準以上への回復",
  },
];
const phaseMonths = ["8月","9月","10月","11月","12月","1月","2月","3月","4月〜"];

// ── 仮説 ────────────────────────────────────────────────────────
const hypotheses = [
  { n: 1, claim: "神経を切って繋ぎ直す手術だと思っていた",            verify: "実際は神経への圧迫を取り除く除圧術であり、神経を切断・縫合はしない。この理解で正しいか？" },
  { n: 2, claim: "手術は脊髄そのものを扱うと思っていた",                verify: "腰椎レベルでは脊髄本体はほぼなく「馬尾神経」という神経根の束が対象。この理解で正しいか？" },
  { n: 3, claim: "すり減った脊椎骨を何らかの方法で処置すると聞いた",    verify: "椎間板の処置（摘出・置換など）か、骨棘の除去か、具体的内容を確認したい。" },
  { n: 4, claim: "固定術のボルトは永久に体内に残る",                    verify: "基本的に除去しないケースが多いが、医師に確認が必要。" },
  { n: 5, claim: "内視鏡手術（低侵襲手術）の選択肢は提示されなかった",  verify: "提示されなかった理由（狭窄範囲・骨変形など）を確認したい。" },
];

// ── 総合判断（自己評価項目） ───────────────────────────────────
// Tab 2 で問う「緊急サイン」の自己チェック
const urgentSigns = [
  { id: "bladder",  label: "排尿・排便の障害がある（尿閉・便失禁）" },
  { id: "paralysis", label: "足首・足指が動かしにくい（運動麻痺）" },
  { id: "restPain", label: "安静時にも激しい痛みが続いている" },
];

// 保存療法の継続状況
const conservativeStatusOptions = [
  { id: "none",  label: "保存療法は受けていない",       monthsScore: 0, color: COLORS.hint },
  { id: "u3",    label: "3ヶ月未満",                    monthsScore: 25, color: COLORS.green },
  { id: "3to6",  label: "3〜6ヶ月",                     monthsScore: 55, color: COLORS.orange },
  { id: "o6",    label: "6ヶ月以上 改善なし",           monthsScore: 90, color: COLORS.red },
];

// 筋力低下の自己評価
const muscleWeaknessOptions = [
  { id: "none",      label: "筋力低下なし",               score: 0,   color: COLORS.green },
  { id: "mild",      label: "軽度（時々つまずく程度）",   score: 30,  color: COLORS.orange },
  { id: "moderate",  label: "明らかな筋力低下",           score: 70,  color: COLORS.red },
  { id: "severe",    label: "顕著・歩行困難",             score: 100, color: COLORS.red },
];

// Tab 5: 回復への準備度
const readinessItems = [
  { id: "support",  label: "入院中・退院後を支えてくれる家族・支援がある" },
  { id: "rehab",    label: "術後リハビリに通える環境がある" },
  { id: "time",     label: "半年〜1年の回復期間を確保できる" },
  { id: "fitness",  label: "現在の体力・筋力を維持できている" },
  { id: "bone",     label: "骨粗鬆症の検査・治療を受けている／予定がある" },
];

Object.assign(window, {
  COLORS, walkingOptions, odiItems, odiLevels,
  decisionCriteria, numbnessPoints, ageNotes,
  proReasons, conReasons,
  coreQuestions, extraQuestions,
  phases, phaseMonths, hypotheses,
  urgentSigns, conservativeStatusOptions, muscleWeaknessOptions, readinessItems,
});
