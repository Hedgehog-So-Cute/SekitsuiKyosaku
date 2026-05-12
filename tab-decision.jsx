// Tab 2: 手術判断ガイド
function DecisionTab({ state, setState }) {
  const [open, setOpen] = useState("urgent");
  const { urgent, conservative, muscle } = state;

  const toggleUrgent = (id) => setState(s => ({
    ...s, urgent: { ...s.urgent, [id]: !s.urgent[id] },
  }));

  const anyUrgent = Object.values(urgent).some(Boolean);

  return (
    <div>
      <Section eyebrow="Self Check" title="自己評価：緊急サイン & 保存療法状況">
        <Card style={{ borderTop: `3px solid ${anyUrgent ? COLORS.red : COLORS.navy}` }}>
          <div style={{ fontSize: 12, color: COLORS.sub, lineHeight: 1.7, marginBottom: 12 }}>
            該当する項目をチェック。総合判断タブのスコアに反映されます。
          </div>

          <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.hint, fontWeight: 700, marginBottom: 8 }}>
            URGENT SIGNS — 緊急サイン（あれば数日単位で受診）
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {urgentSigns.map(s => {
              const active = !!urgent[s.id];
              return (
                <label key={s.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  border: `1.5px solid ${active ? COLORS.red : COLORS.line}`,
                  background: active ? `${COLORS.red}0d` : "#fff",
                  borderRadius: 10, cursor: "pointer", transition: "all .15s",
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: `1.5px solid ${active ? COLORS.red : COLORS.hint}`,
                    background: active ? COLORS.red : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{active && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}</span>
                  <input type="checkbox" checked={active} onChange={() => toggleUrgent(s.id)} style={{ display: "none" }} />
                  <span style={{ fontSize: 13, color: COLORS.ink }}>{s.label}</span>
                </label>
              );
            })}
          </div>
          {anyUrgent && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              background: `${COLORS.red}14`, border: `1px solid ${COLORS.red}55`,
              borderRadius: 10, fontSize: 12.5, color: COLORS.red, fontWeight: 700, lineHeight: 1.6,
            }}>
              ⚠ 緊急サインに該当：早急に整形外科・脊椎専門医を受診してください。
            </div>
          )}

          <div style={{ height: 1, background: COLORS.line, margin: "18px 0" }} />

          <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.hint, fontWeight: 700, marginBottom: 8 }}>
            CONSERVATIVE THERAPY — 保存療法の継続期間
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
            {conservativeStatusOptions.map(o => {
              const active = conservative === o.id;
              return (
                <button key={o.id}
                  onClick={() => setState(s => ({ ...s, conservative: o.id }))}
                  style={{
                    padding: "10px 12px", borderRadius: 10,
                    border: `1.5px solid ${active ? o.color : COLORS.line}`,
                    background: active ? `${o.color}0d` : "#fff",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{o.label}</div>
                </button>
              );
            })}
          </div>

          <div style={{ height: 1, background: COLORS.line, margin: "18px 0" }} />

          <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.hint, fontWeight: 700, marginBottom: 8 }}>
            MUSCLE WEAKNESS — 筋力低下の自己評価
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
            {muscleWeaknessOptions.map(o => {
              const active = muscle === o.id;
              return (
                <button key={o.id}
                  onClick={() => setState(s => ({ ...s, muscle: o.id }))}
                  style={{
                    padding: "10px 12px", borderRadius: 10,
                    border: `1.5px solid ${active ? o.color : COLORS.line}`,
                    background: active ? `${o.color}0d` : "#fff",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{o.label}</div>
                </button>
              );
            })}
          </div>
        </Card>
      </Section>

      <Section eyebrow="3-Tier Framework" title="手術判断の 3 段階">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {decisionCriteria.map(c => {
            const isOpen = open === c.id;
            return (
              <div key={c.id} style={{
                background: "#fff",
                borderRadius: 12,
                border: `1px solid ${isOpen ? c.color : COLORS.line}`,
                overflow: "hidden",
                transition: "all .2s",
              }}>
                <button
                  onClick={() => setOpen(isOpen ? null : c.id)}
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
                    background: c.color, borderRadius: 0,
                  }} />
                  <Pill color={c.color} filled>{c.label}</Pill>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.hint }}>{c.timing}</div>
                  </div>
                  <span style={{
                    fontSize: 18, color: c.color, lineHeight: 1,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform .18s",
                  }}>＋</span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 20px 18px", borderTop: `1px solid ${COLORS.line}` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                      {c.items.map((it, i) => (
                        <div key={i} style={{
                          background: COLORS.cream,
                          borderRadius: 10,
                          padding: "12px 14px",
                          borderLeft: `3px solid ${c.color}`,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>{it.sign}</div>
                          <div style={{ fontSize: 12.5, color: COLORS.sub, lineHeight: 1.7, marginBottom: 6 }}>{it.detail}</div>
                          <div style={{ fontSize: 10, color: COLORS.hint, letterSpacing: 0.5 }}>出典：{it.source}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      marginTop: 12,
                      background: `${c.color}0d`,
                      border: `1px solid ${c.color}33`,
                      borderRadius: 10,
                      padding: "11px 14px",
                      fontSize: 12.5,
                      color: COLORS.ink, lineHeight: 1.7,
                    }}>
                      <span style={{ color: c.color, fontWeight: 700, marginRight: 6 }}>POINT</span>{c.evidence}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Numbness & Time" title="「しびれ」と神経の時間">
        <Card accent={COLORS.orange}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {numbnessPoints.map((p, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "32px 1fr", gap: 12,
                paddingBottom: i < numbnessPoints.length - 1 ? 14 : 0,
                borderBottom: i < numbnessPoints.length - 1 ? `1px dashed ${COLORS.line}` : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: COLORS.navy, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13.5, color: COLORS.ink, lineHeight: 1.75 }}>{p.text}</div>
                  <div style={{ fontSize: 10, color: COLORS.hint, marginTop: 6, letterSpacing: 0.5 }}>出典：{p.source}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section eyebrow="Age 66" title="66 歳というタイミングの医学的意味">
        <Card accent={COLORS.blue}>
          {ageNotes.map((c, i) => (
            <div key={i} style={{
              fontSize: 13.5, color: COLORS.ink, lineHeight: 1.8,
              padding: "10px 0",
              borderBottom: i < ageNotes.length - 1 ? `1px dashed ${COLORS.line}` : "none",
              display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start",
            }}>
              <span style={{
                fontSize: 10, color: COLORS.blue, fontWeight: 800, letterSpacing: 1.5,
                marginTop: 4, minWidth: 24,
              }}>0{i + 1}</span>
              <span>{c}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: 10, color: COLORS.hint }}>
            参考：国立長寿医療研究センター
          </div>
        </Card>
      </Section>

      <Section eyebrow="Hypotheses" title="医師に確認したい仮説（不確かな理解の整理）">
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {hypotheses.map((h, i) => (
              <div key={h.n} style={{
                display: "grid", gridTemplateColumns: "auto 1fr", gap: 14,
                padding: "14px 0",
                borderTop: i === 0 ? "none" : `1px solid ${COLORS.line}`,
              }}>
                <div style={{
                  fontSize: 10, color: COLORS.hint, fontWeight: 700, letterSpacing: 2,
                  paddingTop: 2,
                }}>仮説 {h.n}</div>
                <div>
                  <div style={{ fontSize: 13.5, color: COLORS.ink, marginBottom: 6, lineHeight: 1.7 }}>{h.claim}</div>
                  <div style={{
                    fontSize: 12, color: COLORS.sub, lineHeight: 1.7,
                    paddingLeft: 12, borderLeft: `2px solid ${COLORS.orange}`,
                  }}>
                    <span style={{ color: COLORS.orange, fontWeight: 700, marginRight: 4 }}>確認：</span>{h.verify}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}

window.DecisionTab = DecisionTab;
