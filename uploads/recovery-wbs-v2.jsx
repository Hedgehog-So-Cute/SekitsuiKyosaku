import { useState } from "react";

// ── 手術判断セクションのデータ ──────────────────────────────────────
const decisionCriteria = [
  {
    id: "urgent",
    label: "緊急手術",
    title: "今すぐ手術が必要なサイン",
    color: "#C0392B",
    icon: "🚨",
    items: [
      {
        sign: "排尿・排便の障害",
        detail: "尿が出なくなる・便意がなくなるなど。馬尾神経の重篤な圧迫を示す。",
        source: "日本赤十字社愛知医療センター",
      },
      {
        sign: "足首・足指が動かせない",
        detail: "運動麻痺が出現した場合。数日単位で対応が必要。",
        source: "日本赤十字社愛知医療センター",
      },
      {
        sign: "安静時にも激しい痛み",
        detail: "神経の炎症が重篤な段階に達しているサイン。",
        source: "国立長寿医療研究センター",
      },
    ],
    evidence: "これらの症状は保存療法の適応外。放置すると神経ダメージが不可逆になる。",
  },
  {
    id: "elective",
    label: "手術を検討",
    title: "手術を真剣に検討すべき段階",
    color: "#E67E22",
    icon: "⚠️",
    items: [
      {
        sign: "6ヶ月以上の保存療法で改善なし",
        detail: "薬・注射・リハビリを続けても痛みやしびれが改善しない場合。",
        source: "由風BIOメディカル・聖路加国際病院",
      },
      {
        sign: "間欠性跛行が悪化",
        detail: "歩ける距離が月単位で短くなっている場合。日常生活への支障が拡大。",
        source: "足立慶友整形外科",
      },
      {
        sign: "筋力低下が顕著",
        detail: "神経麻痺による筋力低下が見られる場合は、早めの専門医相談が必要。",
        source: "足立慶友整形外科",
      },
    ],
    evidence: "手術成功率は80〜90%（国立長寿医療研究センター）。歩行・痛みの改善は比較的良好。",
  },
  {
    id: "conservative",
    label: "まだ様子見可",
    title: "保存療法を続けてよい段階",
    color: "#27AE60",
    icon: "✅",
    items: [
      {
        sign: "運動麻痺がなく日常生活に支障なし",
        detail: "間欠性跛行があっても、麻痺がない軽〜中等度なら経過観察が妥当。",
        source: "武田病院グループ",
      },
      {
        sign: "1/3は自然に軽快する",
        detail: "軽〜中等度の患者のうち約1/3は保存療法で改善することが知られている。",
        source: "武田病院グループ",
      },
    ],
    evidence: "ただし全体の1/3は経過中に悪化し手術が必要になる。定期的な経過観察が前提。",
  },
];

const numbnessInfo = {
  title: "「しびれ」が示すもの：放置リスク",
  points: [
    {
      icon: "⏳",
      text: "神経は圧迫期間が長いほど回復しにくくなる。しびれが出ている間は神経がまだ生きているサインでもある。",
      source: "リペアセルクリニック東京院",
    },
    {
      icon: "🏥",
      text: "手術が成功しても、しびれが残るケースは珍しくない。歩行時の激しい痛みは比較的早く改善するが、しびれの改善は数ヶ月単位でゆっくりとした回復になる。",
      source: "足立慶友整形外科",
    },
    {
      icon: "👴",
      text: "66歳という年齢は手術回避の理由にならない。国立長寿医療研究センターでは高齢者でも積極的に手術を実施しており、効果は得られている。",
      source: "国立長寿医療研究センター",
    },
  ],
};

const ageNote = {
  title: "66歳というタイミングの医学的意味",
  content: [
    "年齢そのものは手術可否に直結しない。重要なのは全身状態・骨密度・心肺機能。",
    "70代・80代になると骨粗鬆症が進み、固定術でのインプラント緩みリスクが上がる。術前に骨粗鬆症治療が必要になるケースもある。（国立長寿医療研究センター）",
    "体力がある今のタイミングは、医学的にも合理的な判断時期。",
  ],
};

// ── 回復WBSのデータ ─────────────────────────────────────────────────
const phases = [
  {
    id: 1,
    label: "Phase 1",
    title: "入院・術直後",
    period: "8月上旬〜8月中旬",
    duration: "約2週間",
    color: "#C0392B",
    months: ["8月"],
    tasks: [
      { name: "手術", icon: "⚕️", detail: "全身麻酔・開放手術" },
      { name: "ICU・病室安静", icon: "🛏️", detail: "体位変換のみ許可" },
      { name: "歩行訓練開始", icon: "🚶", detail: "術後2〜3日から平行棒歩行" },
      { name: "排泄・食事の自立", icon: "🍽️", detail: "段階的に自立へ" },
    ],
    restriction: "ベッド上安静。起き上がり・前屈・捻転 すべて禁止",
    goal: "合併症なく離床できること",
  },
  {
    id: 2,
    label: "Phase 2",
    title: "退院・在宅回復",
    period: "8月下旬〜10月",
    duration: "約6〜8週間",
    color: "#E67E22",
    months: ["8月", "9月", "10月"],
    tasks: [
      { name: "退院", icon: "🏠", detail: "術後2週間前後が目安" },
      { name: "外来リハビリ開始", icon: "🏥", detail: "週1〜2回の通院" },
      { name: "短距離歩行", icon: "👣", detail: "1日数回・徐々に距離を伸ばす" },
      { name: "コルセット装着", icon: "🩹", detail: "外出時・座位時に着用" },
      { name: "デスクワーク復帰", icon: "💻", detail: "術後4〜6週ごろから検討" },
    ],
    restriction: "前かがみ禁止・重量物（2kg以上）禁止・長時間座位に注意",
    goal: "室内外を安全に歩行できること。日常生活の基本動作自立",
  },
  {
    id: 3,
    label: "Phase 3",
    title: "リハビリ本格化",
    period: "10月〜12月",
    duration: "約2〜3ヶ月",
    color: "#2980B9",
    months: ["10月", "11月", "12月"],
    tasks: [
      { name: "体幹トレーニング開始", icon: "💪", detail: "腰を支える筋肉を強化" },
      { name: "水中歩行・プール", icon: "🏊", detail: "関節への負担が少ない運動" },
      { name: "長距離歩行", icon: "🚶‍♂️", detail: "30分〜1時間を目標に" },
      { name: "コルセット離脱", icon: "✅", detail: "医師の許可のもと段階的に" },
      { name: "軽作業復帰", icon: "🔧", detail: "立ち仕事・軽い肉体労働の検討" },
    ],
    restriction: "急な動作・ジャンプ・重量物（5kg以上）はまだ控える",
    goal: "1時間以上の連続歩行。痛みなく日常を送れること",
  },
  {
    id: 4,
    label: "Phase 4",
    title: "機能回復期",
    period: "1月〜3月（術後約5〜7ヶ月）",
    duration: "約2〜3ヶ月",
    color: "#27AE60",
    months: ["1月", "2月", "3月"],
    tasks: [
      { name: "軽いジョギング・自転車", icon: "🚴", detail: "医師許可後に開始" },
      { name: "日常的な運動再開", icon: "🧘", detail: "ヨガ・ストレッチ・軽いスポーツ" },
      { name: "通常業務への完全復帰", icon: "📋", detail: "ほぼ支障なく仕事ができる" },
      { name: "経過観察・画像確認", icon: "🩻", detail: "MRIで回復状況を確認" },
    ],
    restriction: "激しい接触スポーツ・重量挙げはまだ要注意",
    goal: "手術前より楽に動けること。しびれ・痛みの大幅改善",
  },
  {
    id: 5,
    label: "Phase 5",
    title: "日常・スポーツ復帰",
    period: "4月以降（術後約8ヶ月〜）",
    duration: "以降継続",
    color: "#8E44AD",
    months: ["4月〜"],
    tasks: [
      { name: "スポーツ本格復帰", icon: "⚽", detail: "種目により個別判断" },
      { name: "体力の維持・向上", icon: "🏋️", detail: "体幹・下肢筋力の継続強化" },
      { name: "セルフケア確立", icon: "📝", detail: "ストレッチ習慣・姿勢管理" },
      { name: "年1回の定期受診", icon: "📅", detail: "再狭窄の早期発見" },
    ],
    restriction: "術前と同水準の運動が多くの場合可能。固定術ありの場合は医師と相談",
    goal: "術前の生活水準以上への回復",
  },
];

const months = ["8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月", "4月〜"];

// ── メインコンポーネント ─────────────────────────────────────────────
export default function SpinalStenosisGuide() {
  const [activeTab, setActiveTab] = useState("decision");
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedCriteria, setSelectedCriteria] = useState(null);

  return (
    <div style={{
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
      background: "#F5F4F0",
      minHeight: "100vh",
      padding: "24px 16px",
      color: "#1a1a1a",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          background: "#1C2B3A",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 10, color: "#7A9BB5", letterSpacing: 3, marginBottom: 6 }}>
            SPINAL STENOSIS PATIENT GUIDE
          </div>
          <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, marginBottom: 4 }}>
            脊柱管狭窄症　手術判断 ＆ 回復ガイド
          </div>
          <div style={{ fontSize: 12, color: "#7A9BB5" }}>
            国立長寿医療研究センター・聖路加国際病院・足立慶友整形外科 ほか複数医療機関の情報をもとに作成
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { id: "decision", label: "🩺 手術判断ガイド" },
            { id: "wbs", label: "📅 回復WBS（8月手術想定）" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
                background: activeTab === tab.id ? "#1C2B3A" : "#fff",
                color: activeTab === tab.id ? "#fff" : "#666",
                boxShadow: activeTab === tab.id
                  ? "0 2px 12px rgba(28,43,58,0.25)"
                  : "0 1px 4px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: 手術判断ガイド ── */}
        {activeTab === "decision" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* 66歳メモ */}
            <div style={{
              background: "#EAF4FB",
              border: "1px solid #AED6F1",
              borderRadius: 10,
              padding: "14px 18px",
            }}>
              <div style={{ fontSize: 12, color: "#2980B9", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
                👤 66歳という年齢について
              </div>
              {ageNote.content.map((c, i) => (
                <div key={i} style={{ fontSize: 13, color: "#2C3E50", marginBottom: 4, paddingLeft: 12, borderLeft: "2px solid #AED6F1" }}>
                  {c}
                </div>
              ))}
            </div>

            {/* しびれのリスク */}
            <div style={{
              background: "#FEF9E7",
              border: "1px solid #F9E79F",
              borderRadius: 10,
              padding: "14px 18px",
            }}>
              <div style={{ fontSize: 12, color: "#B7950B", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
                ⚡ しびれと「神経の時間」
              </div>
              {numbnessInfo.points.map((p, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, marginBottom: 8,
                  paddingBottom: 8,
                  borderBottom: i < numbnessInfo.points.length - 1 ? "1px solid #F9E79F" : "none",
                }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, color: "#2C3E50", lineHeight: 1.6 }}>{p.text}</div>
                    <div style={{ fontSize: 10, color: "#AAA", marginTop: 2 }}>出典：{p.source}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 判断基準3段階 */}
            {decisionCriteria.map(criteria => (
              <div
                key={criteria.id}
                onClick={() => setSelectedCriteria(selectedCriteria === criteria.id ? null : criteria.id)}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: `2px solid ${selectedCriteria === criteria.id ? criteria.color : "transparent"}`,
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: selectedCriteria === criteria.id
                    ? `0 4px 20px ${criteria.color}33`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", gap: 14 }}>
                  <span style={{ fontSize: 24 }}>{criteria.icon}</span>
                  <div style={{
                    background: criteria.color,
                    color: "#fff",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}>
                    {criteria.label}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{criteria.title}</div>
                  </div>
                  <div style={{
                    fontSize: 16, color: criteria.color,
                    transform: selectedCriteria === criteria.id ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}>▶</div>
                </div>

                {selectedCriteria === criteria.id && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                      {criteria.items.map((item, i) => (
                        <div key={i} style={{
                          background: "#F8F8F6",
                          borderRadius: 8,
                          padding: "10px 14px",
                          borderLeft: `3px solid ${criteria.color}`,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>
                            {item.sign}
                          </div>
                          <div style={{ fontSize: 12, color: "#555", marginBottom: 3 }}>{item.detail}</div>
                          <div style={{ fontSize: 10, color: "#AAA" }}>出典：{item.source}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      marginTop: 12,
                      background: `${criteria.color}11`,
                      border: `1px solid ${criteria.color}44`,
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 12,
                      color: "#444",
                    }}>
                      📌 {criteria.evidence}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 医師への質問リスト */}
            <div style={{
              background: "#fff",
              borderRadius: 10,
              padding: "16px 20px",
              border: "1px solid #E8E8E8",
            }}>
              <div style={{ fontSize: 12, color: "#555", fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
                💬 受診時に確認すべき4つの質問
              </div>
              {[
                "「今の状態を放置すると、6ヶ月後・1年後どうなりますか？」",
                "「内視鏡手術（低侵襲手術）の適応はありますか？ない場合の理由は？」",
                "「固定術は必要ですか？除圧術だけで対応できますか？」",
                "「手術後、しびれはどの程度改善が期待できますか？」",
              ].map((q, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "8px 0",
                  borderBottom: i < 3 ? "1px solid #F0F0F0" : "none",
                }}>
                  <div style={{
                    background: "#1C2B3A", color: "#fff",
                    borderRadius: "50%", width: 20, height: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ fontSize: 13, color: "#2C3E50", lineHeight: 1.5 }}>{q}</div>
                </div>
              ))}
            </div>

            <div style={{
              padding: "12px 16px",
              background: "#FFF0F0",
              borderRadius: 8,
              border: "1px solid #FFCCCC",
              fontSize: 11,
              color: "#993333",
              lineHeight: 1.8,
            }}>
              ※ このガイドは医療機関の公開情報をもとにした参考資料です。診断・治療の判断は必ず主治医または脊椎専門医にご相談ください。<br/>
              ※ セカンドオピニオンを求めることは大きな手術前の標準的な行動です。
            </div>
          </div>
        )}

        {/* ── TAB 2: 回復WBS ── */}
        {activeTab === "wbs" && (
          <div>
            {/* Timeline bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 10 }}>
                月別スケジュール
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {months.map((m) => {
                  const phaseForMonth = phases.find(p => p.months.some(pm => pm === m || (pm === "4月〜" && m === "4月〜")));
                  return (
                    <div key={m} style={{
                      flex: m === "4月〜" ? 1.5 : 1,
                      background: phaseForMonth ? phaseForMonth.color : "#ccc",
                      borderRadius: 6,
                      padding: "8px 4px",
                      textAlign: "center",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      opacity: 0.9,
                    }}>
                      {m}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                {phases.map(p => (
                  <div key={p.id} style={{
                    flex: p.months.length === 1 && p.months[0] === "4月〜" ? 1.5 :
                      p.months.length === 1 ? 1 : p.months.length,
                    fontSize: 10,
                    color: p.color,
                    fontWeight: 700,
                    textAlign: "center",
                  }}>
                    {p.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: `2px solid ${selectedPhase === phase.id ? phase.color : "transparent"}`,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: selectedPhase === phase.id
                      ? `0 4px 20px ${phase.color}33`
                      : "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", gap: 14 }}>
                    <div style={{
                      background: phase.color,
                      color: "#fff",
                      borderRadius: 6,
                      padding: "5px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}>
                      {phase.label}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                        {phase.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {phase.period}　／　{phase.duration}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 16, color: phase.color,
                      transform: selectedPhase === phase.id ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}>▶</div>
                  </div>

                  {selectedPhase === phase.id && (
                    <div style={{ padding: "0 18px 18px", borderTop: "1px solid #f0f0f0" }}>
                      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                        {phase.tasks.map((task, i) => (
                          <div key={i} style={{
                            background: "#F8F8F6",
                            borderRadius: 8,
                            padding: "10px 12px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                          }}>
                            <span style={{ fontSize: 16 }}>{task.icon}</span>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                                {task.name}
                              </div>
                              <div style={{ fontSize: 11, color: "#888" }}>{task.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{
                        background: `${phase.color}11`,
                        border: `1px solid ${phase.color}44`,
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 8,
                        fontSize: 12,
                        color: "#444",
                      }}>
                        <span style={{ color: phase.color, fontWeight: 700 }}>⚠ この時期の制限：</span> {phase.restriction}
                      </div>
                      <div style={{
                        background: "#F0F8F0",
                        border: "1px solid #B8DDB8",
                        borderRadius: 8,
                        padding: "10px 14px",
                        fontSize: 12,
                        color: "#444",
                      }}>
                        <span style={{ color: "#27AE60", fontWeight: 700 }}>✓ ゴール：</span> {phase.goal}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 20,
              padding: "14px 18px",
              background: "#FFF9EC",
              borderRadius: 10,
              border: "1px solid #F0D080",
              fontSize: 11,
              color: "#7A6020",
              lineHeight: 1.8,
            }}>
              ※ 固定術（フュージョン）を伴う場合、各フェーズが1〜2ヶ月延長される場合があります。<br/>
              ※ しびれの改善は神経の回復速度に依存するため、運動機能の回復より遅れることがあります（足立慶友整形外科）。<br/>
              ※ このWBSはあくまで参考です。必ず主治医・リハビリ担当の指示に従ってください。
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
