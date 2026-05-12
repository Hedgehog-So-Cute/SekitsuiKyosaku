// メインアプリ
const { useState: useStateApp } = React;

const TABS = [
  { id: "symptoms", num: "01", label: "症状チェック",       sub: "SYMPTOMS" },
  { id: "decision", num: "02", label: "手術判断ガイド",     sub: "DECISION" },
  { id: "matrix",   num: "03", label: "意思決定マトリクス", sub: "MATRIX" },
  { id: "questions",num: "04", label: "医師への質問",       sub: "QUESTIONS" },
  { id: "recovery", num: "05", label: "回復タイムライン",   sub: "RECOVERY" },
  { id: "summary",  num: "06", label: "総合判断",           sub: "SUMMARY" },
];

function App() {
  const [activeTab, setActiveTab] = useStateApp("symptoms");

  // 各タブの状態
  const [symptoms, setSymptoms] = useStateApp({
    walking: "c",
    vasRest: 3,
    vasWalk: 7,
    odi: { pain: 2, selfcare: 1, walking: 3, sitting: 2, sleep: 1 },
  });
  const [matrix, setMatrix] = useStateApp({
    pros: [proReasons[0], proReasons[3]],
    cons: [conReasons[2]],
    notes: "",
  });
  const [questions, setQuestions] = useStateApp({
    checked: {},
    extras: [],
  });
  const [decision, setDecision] = useStateApp({
    urgent: {},
    conservative: null,
    muscle: null,
  });
  const [recovery, setRecovery] = useStateApp({
    readiness: {},
  });

  return (
    <div style={{
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Noto Sans JP', system-ui, sans-serif",
      background: COLORS.paper,
      minHeight: "100vh",
      color: COLORS.ink,
      WebkitFontSmoothing: "antialiased",
    }}>
      {/* Header */}
      <header style={{
        background: COLORS.navy,
        color: "#fff",
        padding: "28px 24px 22px",
        borderBottom: `1px solid ${COLORS.navySoft}`,
      }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: COLORS.navy,
              letterSpacing: 0,
            }}>脊</div>
            <div style={{ fontSize: 10, color: "#9DB2C6", letterSpacing: 3, fontWeight: 700 }}>
              SPINAL STENOSIS · PATIENT DECISION GUIDE
            </div>
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, margin: "0 0 8px 0",
            letterSpacing: 0.5, lineHeight: 1.35,
          }}>
            脊柱管狭窄症 手術のための判断軸
          </h1>
          <p style={{
            fontSize: 13, color: "#B8C8D6", margin: 0, lineHeight: 1.75,
            maxWidth: 680,
          }}>
            受診前・セカンドオピニオン前に、自分の状態を整理し、医師に何を聞くべきかを明確にするための準備ツール。
          </p>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{
        background: "#fff",
        borderBottom: `1px solid ${COLORS.line}`,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{
          maxWidth: 980, margin: "0 auto",
          display: "flex",
          overflowX: "auto",
        }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  flex: "1 0 auto",
                  minWidth: 130,
                  padding: "14px 16px 12px",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderBottom: `3px solid ${active ? COLORS.navy : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                  color: active ? COLORS.navy : COLORS.hint, marginBottom: 4,
                }}>{t.num} · {t.sub}</div>
                <div style={{
                  fontSize: 13.5, fontWeight: 700,
                  color: active ? COLORS.ink : COLORS.sub,
                }}>{t.label}</div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Body */}
      <main style={{
        maxWidth: 980, margin: "0 auto",
        padding: "28px 24px 40px",
      }}>
        {activeTab === "symptoms" && (
          <SymptomsTab state={symptoms} setState={setSymptoms} />
        )}
        {activeTab === "decision" && (
          <DecisionTab state={decision} setState={setDecision} />
        )}
        {activeTab === "matrix" && (
          <MatrixTab state={matrix} setState={setMatrix} />
        )}
        {activeTab === "questions" && (
          <QuestionsTab state={questions} setState={setQuestions} />
        )}
        {activeTab === "recovery" && (
          <RecoveryTab state={recovery} setState={setRecovery} />
        )}
        {activeTab === "summary" && (
          <SummaryTab
            symptoms={symptoms}
            decision={decision}
            matrix={matrix}
            questions={questions}
            recovery={recovery}
            onJumpTab={setActiveTab}
          />
        )}

        <Disclaimer />

        <footer style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: `1px solid ${COLORS.line}`,
          fontSize: 10,
          color: COLORS.hint,
          letterSpacing: 0.5,
          lineHeight: 1.8,
        }}>
          情報出典：国立長寿医療研究センター・聖路加国際病院・足立慶友整形外科・日本赤十字社愛知医療センター・武田病院グループ・由風BIOメディカル株式会社・リペアセルクリニック東京院 ほか
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
