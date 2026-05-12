// Tab 4: 医師への質問リスト
function QuestionsTab({ state, setState }) {
  const { checked, extras } = state;

  const toggleCheck = (q) => setState(s => ({
    ...s,
    checked: { ...s.checked, [q]: !s.checked[q] },
  }));

  const toggleExtra = (q) => setState(s => ({
    ...s,
    extras: s.extras.includes(q) ? s.extras.filter(x => x !== q) : [...s.extras, q],
  }));

  const memoText = useMemo(() => {
    const lines = ["【医師への質問リスト】", ""];
    lines.push("◆ 必須質問");
    coreQuestions.forEach((q, i) => {
      const mark = checked[q] ? "✓" : "□";
      lines.push(`${mark} ${i + 1}. ${q}`);
    });
    if (extras.length > 0) {
      lines.push("");
      lines.push("◆ 追加質問");
      extras.forEach((q, i) => {
        const mark = checked[q] ? "✓" : "□";
        lines.push(`${mark} ${coreQuestions.length + i + 1}. ${q}`);
      });
    }
    return lines.join("\n");
  }, [checked, extras]);

  const allQuestions = [...coreQuestions, ...extras];
  const doneCount = allQuestions.filter(q => checked[q]).length;
  const pct = allQuestions.length ? Math.round((doneCount / allQuestions.length) * 100) : 0;

  return (
    <div>
      <Section eyebrow="Progress" title="質問チェックリスト">
        <Card>
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            marginBottom: 18,
          }}>
            <div style={{
              flex: 1,
              height: 10, background: COLORS.line, borderRadius: 99,
              overflow: "hidden",
            }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: COLORS.navy, transition: "width .3s",
              }} />
            </div>
            <div style={{ fontSize: 13, color: COLORS.sub, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ fontWeight: 700, color: COLORS.navy }}>{doneCount}</span> / {allQuestions.length} 済み
            </div>
          </div>

          <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.hint, fontWeight: 700, marginBottom: 10 }}>
            CORE QUESTIONS — 4 件
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {coreQuestions.map((q, i) => (
              <QuestionRow
                key={q}
                num={i + 1}
                question={q}
                checked={!!checked[q]}
                onToggle={() => toggleCheck(q)}
                required
              />
            ))}
          </div>

          <div style={{
            fontSize: 11, letterSpacing: 2, color: COLORS.hint, fontWeight: 700,
            marginTop: 22, marginBottom: 10,
          }}>
            ADDITIONAL — 症状・状況に応じて追加
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {extraQuestions.map((q, i) => {
              const added = extras.includes(q);
              return (
                <div key={q} style={{
                  display: "grid", gridTemplateColumns: "1fr auto", gap: 10,
                  alignItems: "center",
                  padding: "10px 12px",
                  background: added ? "#fff" : COLORS.cream,
                  border: `1px solid ${added ? COLORS.line : "transparent"}`,
                  borderRadius: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    {added ? (
                      <button
                        onClick={() => toggleCheck(q)}
                        style={{
                          width: 20, height: 20, marginTop: 1, flexShrink: 0,
                          borderRadius: 5,
                          border: `1.5px solid ${checked[q] ? COLORS.green : COLORS.hint}`,
                          background: checked[q] ? COLORS.green : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", padding: 0,
                        }}>
                        {checked[q] && <span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>✓</span>}
                      </button>
                    ) : (
                      <div style={{ width: 20, height: 20, flexShrink: 0 }} />
                    )}
                    <div style={{ fontSize: 13, color: added ? COLORS.ink : COLORS.sub, lineHeight: 1.6 }}>
                      {q}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExtra(q)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      border: `1px solid ${added ? COLORS.red : COLORS.navy}`,
                      background: "transparent",
                      color: added ? COLORS.red : COLORS.navy,
                      fontSize: 11, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                      whiteSpace: "nowrap",
                    }}>
                    {added ? "外す" : "＋ 追加"}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      <Section eyebrow="Memo" title="受診メモ（コピー可）">
        <div style={{
          background: COLORS.navy,
          borderRadius: 14,
          padding: 22,
          color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <CopyButton getText={() => memoText} />
          </div>
          <pre style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "14px 16px",
            margin: 0,
            color: "#E6EDF3",
            fontSize: 12.5,
            lineHeight: 1.85,
            fontFamily: "inherit",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>{memoText}</pre>
        </div>
      </Section>
    </div>
  );
}

function QuestionRow({ num, question, checked, onToggle, required }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%", textAlign: "left",
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12,
        alignItems: "center",
        padding: "12px 14px",
        background: checked ? `${COLORS.green}0d` : "#fff",
        border: `1.5px solid ${checked ? COLORS.green : COLORS.line}`,
        borderRadius: 10,
        cursor: "pointer", fontFamily: "inherit",
        transition: "all .15s",
      }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        border: `1.5px solid ${checked ? COLORS.green : COLORS.hint}`,
        background: checked ? COLORS.green : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 15, lineHeight: 1 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: 10, color: required ? COLORS.red : COLORS.hint, fontWeight: 700, letterSpacing: 1.5, marginBottom: 2 }}>
          Q{num}{required && " · 必須"}
        </div>
        <div style={{ fontSize: 13.5, color: COLORS.ink, lineHeight: 1.6 }}>{question}</div>
      </div>
      <span style={{ fontSize: 11, color: checked ? COLORS.green : COLORS.hint, fontWeight: 700 }}>
        {checked ? "済" : "未"}
      </span>
    </button>
  );
}

window.QuestionsTab = QuestionsTab;
