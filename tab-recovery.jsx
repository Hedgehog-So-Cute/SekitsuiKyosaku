// Tab 5: 回復タイムライン
function RecoveryTab({ state, setState }) {
  const [open, setOpen] = useState(1);
  const { readiness } = state;

  const toggleReady = (id) => setState(s => ({
    ...s, readiness: { ...s.readiness, [id]: !s.readiness[id] },
  }));
  const readyCount = readinessItems.filter(it => readiness[it.id]).length;
  const readyPct = Math.round((readyCount / readinessItems.length) * 100);

  return (
    <div>
      <Section eyebrow="Readiness Check" title="術後回復への準備度（総合判断に反映）">
        <Card accent={COLORS.green}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 8, background: COLORS.line, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${readyPct}%`, height: "100%", background: COLORS.green, transition: "width .3s" }} />
            </div>
            <div style={{ fontSize: 12, color: COLORS.sub, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ fontWeight: 700, color: COLORS.green }}>{readyCount}</span> / {readinessItems.length}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {readinessItems.map(it => {
              const active = !!readiness[it.id];
              return (
                <label key={it.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  border: `1.5px solid ${active ? COLORS.green : COLORS.line}`,
                  background: active ? `${COLORS.green}0d` : "#fff",
                  borderRadius: 10, cursor: "pointer", transition: "all .15s",
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: `1.5px solid ${active ? COLORS.green : COLORS.hint}`,
                    background: active ? COLORS.green : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{active && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}</span>
                  <input type="checkbox" checked={active} onChange={() => toggleReady(it.id)} style={{ display: "none" }} />
                  <span style={{ fontSize: 13, color: COLORS.ink }}>{it.label}</span>
                </label>
              );
            })}
          </div>
        </Card>
      </Section>

      <Section eyebrow="Timeline" title="8月手術想定の回復スケジュール">
        <Card style={{ padding: "18px 18px 22px" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.hint, fontWeight: 700, marginBottom: 10 }}>
            月別フェーズ配分
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {phaseMonths.map(m => {
              const phase = phases.find(p => p.months.some(pm => pm === m));
              const isExtra = m === "4月〜";
              return (
                <div key={m} style={{
                  flex: isExtra ? 1.4 : 1,
                  background: phase ? phase.color : "#ccc",
                  borderRadius: 6,
                  padding: "10px 4px",
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}>{m}</div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
            {phases.map(p => {
              const span = p.months.includes("4月〜") ? 1.4 : p.months.length;
              return (
                <div key={p.id} style={{
                  flex: span, fontSize: 10, color: p.color,
                  fontWeight: 700, textAlign: "center", letterSpacing: 1,
                }}>{p.label}</div>
              );
            })}
          </div>
        </Card>
      </Section>

      <Section eyebrow="Phases" title="各フェーズの詳細">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {phases.map(phase => {
            const isOpen = open === phase.id;
            return (
              <div key={phase.id} style={{
                background: "#fff",
                borderRadius: 12,
                border: `1px solid ${isOpen ? phase.color : COLORS.line}`,
                overflow: "hidden",
                transition: "all .2s",
              }}>
                <button
                  onClick={() => setOpen(isOpen ? null : phase.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 20px",
                    border: "none", background: "transparent",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  <div style={{
                    width: 6, alignSelf: "stretch", margin: "-16px 0",
                    background: phase.color,
                  }} />
                  <div style={{
                    minWidth: 50,
                    fontSize: 10, color: phase.color,
                    fontWeight: 800, letterSpacing: 1.5,
                  }}>
                    {phase.label.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, marginBottom: 2 }}>{phase.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.hint }}>
                      {phase.period}　·　{phase.duration}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 18, color: phase.color, lineHeight: 1,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform .18s",
                  }}>＋</span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${COLORS.line}` }}>
                    <div style={{ marginTop: 14, fontSize: 10, letterSpacing: 2, color: COLORS.hint, fontWeight: 700, marginBottom: 8 }}>
                      MAIN TASKS
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, marginBottom: 14 }}>
                      {phase.tasks.map((task, i) => (
                        <div key={i} style={{
                          background: COLORS.cream,
                          borderRadius: 10,
                          padding: "11px 13px",
                          borderLeft: `3px solid ${phase.color}`,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 3 }}>
                            {task.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: COLORS.sub, lineHeight: 1.55 }}>{task.detail}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{
                        background: `${COLORS.red}0d`,
                        border: `1px solid ${COLORS.red}33`,
                        borderRadius: 10,
                        padding: "11px 14px",
                      }}>
                        <div style={{ fontSize: 10, color: COLORS.red, fontWeight: 800, letterSpacing: 1.5, marginBottom: 5 }}>
                          ⚠ 制限事項
                        </div>
                        <div style={{ fontSize: 12.5, color: COLORS.ink, lineHeight: 1.7 }}>{phase.restriction}</div>
                      </div>
                      <div style={{
                        background: `${COLORS.green}0d`,
                        border: `1px solid ${COLORS.green}33`,
                        borderRadius: 10,
                        padding: "11px 14px",
                      }}>
                        <div style={{ fontSize: 10, color: COLORS.green, fontWeight: 800, letterSpacing: 1.5, marginBottom: 5 }}>
                          ✓ ゴール
                        </div>
                        <div style={{ fontSize: 12.5, color: COLORS.ink, lineHeight: 1.7 }}>{phase.goal}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Notes" title="補足">
        <Card>
          <div style={{ fontSize: 12.5, color: COLORS.sub, lineHeight: 1.85 }}>
            ・固定術（フュージョン）を伴う場合、各フェーズが 1〜2 ヶ月延長されることがある。<br/>
            ・しびれの改善は神経の回復速度に依存するため、運動機能の回復より遅れることがある（足立慶友整形外科）。<br/>
            ・このタイムラインは参考。必ず主治医・リハビリ担当の指示に従う。
          </div>
        </Card>
      </Section>
    </div>
  );
}

window.RecoveryTab = RecoveryTab;
