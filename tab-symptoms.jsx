// Tab 1: 症状チェック & スコアリング
function SymptomsTab({ state, setState }) {
  const { walking, vasRest, vasWalk, odi } = state;

  const odiTotal = useMemo(
    () => odiItems.reduce((s, it) => s + (odi[it.id] ?? 0), 0),
    [odi]
  );
  const odiPct = Math.round((odiTotal / 20) * 100);
  const odiLevel =
    odiTotal <= 4 ? { label: "軽度の障害",   color: COLORS.green }
    : odiTotal <= 8 ? { label: "中等度の障害", color: COLORS.orange }
    : odiTotal <= 13 ? { label: "重度の障害",  color: COLORS.red }
    :                  { label: "完全障害に近い", color: COLORS.red };

  const selectedWalk = walkingOptions.find(o => o.id === walking);

  const vasMessage = (rest, walk) => {
    if (walk - rest >= 4) return "歩行時に大きく痛みが増す＝間欠性跛行の典型パターン。歩行距離と合わせて伝えるとよい。";
    if (rest >= 6) return "安静時にも強い痛みがある。緊急性の判断材料として医師に必ず伝える。";
    if (walk >= 6) return "歩行時痛が強い。間欠性跛行の悪化傾向を確認したい。";
    return "数値の絶対値より、月単位での変化（増えているか）を併せて医師に伝える。";
  };

  return (
    <div>
      <Section eyebrow="STEP 1 — Walking" title="間欠性跛行：今、続けて歩ける最大距離">
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {walkingOptions.map(o => {
              const active = walking === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setState(s => ({ ...s, walking: o.id }))}
                  style={{
                    textAlign: "left",
                    padding: "14px 14px",
                    borderRadius: 12,
                    border: `1.5px solid ${active ? o.color : COLORS.line}`,
                    background: active ? `${o.color}0d` : "#fff",
                    cursor: "pointer",
                    transition: "all .15s",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: active ? o.color : COLORS.hint, fontWeight: 700, marginBottom: 6 }}>
                    LEVEL {o.level}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, marginBottom: 2 }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: COLORS.sub }}>{o.sub}</div>
                </button>
              );
            })}
          </div>

          {selectedWalk && (
            <div style={{
              marginTop: 16, padding: "14px 16px",
              background: `${selectedWalk.color}0d`,
              border: `1px solid ${selectedWalk.color}40`,
              borderRadius: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Pill color={selectedWalk.color} filled>{selectedWalk.levelLabel}</Pill>
                <div style={{ fontSize: 12, color: COLORS.sub }}>あなたの選択：{selectedWalk.label}</div>
              </div>
              <div style={{ fontSize: 13, color: COLORS.ink, lineHeight: 1.7 }}>
                医師には「先月は◯m歩けたが、今月は{selectedWalk.label}に短縮した」のように、月単位の変化を伝えると判断しやすい。
              </div>
            </div>
          )}
        </Card>
      </Section>

      <Section eyebrow="STEP 2 — Pain VAS" title="しびれ・痛みの強さ（0〜10）">
        <Card>
          <VasSlider
            label="安静時の痛み"
            sub="座っている・横になっている時"
            value={vasRest}
            onChange={v => setState(s => ({ ...s, vasRest: v }))}
          />
          <div style={{ height: 1, background: COLORS.line, margin: "20px 0" }} />
          <VasSlider
            label="歩行時の痛み"
            sub="歩いて何分か経った時の最大痛"
            value={vasWalk}
            onChange={v => setState(s => ({ ...s, vasWalk: v }))}
          />
          <div style={{
            marginTop: 18, padding: "12px 14px",
            background: COLORS.cream, borderRadius: 10,
            borderLeft: `3px solid ${COLORS.navy}`,
            fontSize: 13, color: COLORS.ink, lineHeight: 1.7,
          }}>
            <span style={{ fontWeight: 700 }}>医師へ伝える一言：</span>{vasMessage(vasRest, vasWalk)}
          </div>
        </Card>
      </Section>

      <Section eyebrow="STEP 3 — ODI (簡易版)" title="日常生活への障害度（合計 0〜20点）">
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {odiItems.map(it => (
              <OdiRow
                key={it.id}
                item={it}
                value={odi[it.id] ?? 0}
                onChange={v => setState(s => ({ ...s, odi: { ...s.odi, [it.id]: v } }))}
              />
            ))}
          </div>

          <div style={{
            marginTop: 22,
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 18,
            alignItems: "center",
            padding: "16px 18px",
            background: COLORS.navy, borderRadius: 12,
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#9DB2C6", fontWeight: 700, marginBottom: 2 }}>TOTAL</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {odiTotal}<span style={{ fontSize: 16, color: "#9DB2C6", marginLeft: 4 }}>/ 20</span>
              </div>
            </div>
            <div>
              <div style={{
                height: 8, borderRadius: 99,
                background: "rgba(255,255,255,0.12)",
                overflow: "hidden", marginBottom: 8,
              }}>
                <div style={{
                  width: `${odiPct}%`, height: "100%",
                  background: odiLevel.color, transition: "width .3s",
                }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill color={odiLevel.color} filled>{odiLevel.label}</Pill>
                <span style={{ fontSize: 12, color: "#B8C8D6" }}>達成度 {odiPct}%</span>
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}

function VasSlider({ label, sub, value, onChange }) {
  const color = value >= 7 ? COLORS.red : value >= 4 ? COLORS.orange : COLORS.green;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>{label}</div>
          <div style={{ fontSize: 11, color: COLORS.hint, marginTop: 2 }}>{sub}</div>
        </div>
        <div style={{
          fontSize: 28, fontWeight: 800, color: color,
          fontVariantNumeric: "tabular-nums",
        }}>
          {value}<span style={{ fontSize: 12, color: COLORS.hint, fontWeight: 600 }}> / 10</span>
        </div>
      </div>
      <input
        type="range" min="0" max="10" step="1"
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        style={{
          width: "100%", accentColor: color,
          marginTop: 4,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.hint, marginTop: 2 }}>
        <span>0 痛みなし</span>
        <span>5 中等度</span>
        <span>10 最大</span>
      </div>
    </div>
  );
}

function OdiRow({ item, value, onChange }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{item.label}</div>
          <div style={{ fontSize: 11, color: COLORS.hint, marginTop: 1 }}>{item.hint}</div>
        </div>
        <div style={{ fontSize: 11, color: COLORS.hint, fontVariantNumeric: "tabular-nums" }}>{value} / 4</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
        {odiLevels.map(lv => {
          const active = value === lv.v;
          const color = lv.v <= 1 ? COLORS.green : lv.v <= 2 ? COLORS.orange : COLORS.red;
          return (
            <button
              key={lv.v}
              onClick={() => onChange(lv.v)}
              style={{
                padding: "8px 4px",
                borderRadius: 8,
                border: `1.5px solid ${active ? color : COLORS.line}`,
                background: active ? `${color}14` : "#fff",
                color: active ? color : COLORS.sub,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .15s",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{lv.v}</div>
              <div style={{ fontSize: 10, marginTop: 2 }}>{lv.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

window.SymptomsTab = SymptomsTab;
