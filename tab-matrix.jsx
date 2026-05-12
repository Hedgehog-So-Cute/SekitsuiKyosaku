// Tab 3: 意思決定マトリクス
function MatrixTab({ state, setState }) {
  const { pros, cons, notes } = state;

  const toggle = (key, value) => {
    setState(s => {
      const arr = s[key];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...s, [key]: next };
    });
  };

  const memoText = useMemo(() => {
    const lines = [];
    lines.push("【手術判断 意思決定メモ】");
    lines.push("");
    lines.push("■ 手術を選びたい理由");
    if (pros.length === 0) lines.push("（未選択）");
    else pros.forEach(r => lines.push(`・${r}`));
    lines.push("");
    lines.push("■ 手術をためらう理由");
    if (cons.length === 0) lines.push("（未選択）");
    else cons.forEach(r => lines.push(`・${r}`));
    if (notes.trim()) {
      lines.push("");
      lines.push("■ その他・補足");
      lines.push(notes.trim());
    }
    return lines.join("\n");
  }, [pros, cons, notes]);

  const balance = pros.length - cons.length;
  const balanceLabel =
    balance >= 2 ? { text: "手術へ前向きな傾向", color: COLORS.orange }
    : balance <= -2 ? { text: "ためらいが優勢", color: COLORS.blue }
    : { text: "拮抗：医師との対話で深掘り", color: COLORS.navy };

  return (
    <div>
      <Section eyebrow="Step 1 — Pros" title="手術を選びたい理由">
        <Card accent={COLORS.orange}>
          <CheckList
            items={proReasons}
            selected={pros}
            onToggle={v => toggle("pros", v)}
            accent={COLORS.orange}
          />
        </Card>
      </Section>

      <Section eyebrow="Step 2 — Cons" title="手術をためらう理由">
        <Card accent={COLORS.blue}>
          <CheckList
            items={conReasons}
            selected={cons}
            onToggle={v => toggle("cons", v)}
            accent={COLORS.blue}
          />
        </Card>
      </Section>

      <Section eyebrow="Step 3 — Free Notes" title="自分の言葉で書き残す">
        <Card>
          <textarea
            value={notes}
            onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
            placeholder="医師に伝えたいこと、家族と話し合った内容、不安な点などを自由に書く"
            style={{
              width: "100%",
              minHeight: 96,
              padding: "12px 14px",
              border: `1px solid ${COLORS.line}`,
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "inherit",
              color: COLORS.ink,
              background: COLORS.cream,
              resize: "vertical",
              boxSizing: "border-box",
              lineHeight: 1.7,
              outline: "none",
            }}
          />
        </Card>
      </Section>

      <Section eyebrow="Result" title="受診メモ（コピー可）">
        <div style={{
          background: COLORS.navy,
          borderRadius: 14,
          padding: 22,
          color: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Pill color={balanceLabel.color} filled>{balanceLabel.text}</Pill>
              <span style={{ fontSize: 12, color: "#B8C8D6" }}>
                選びたい {pros.length} ／ ためらう {cons.length}
              </span>
            </div>
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

function CheckList({ items, selected, onToggle, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 8 }}>
      {items.map(it => {
        const active = selected.includes(it);
        return (
          <label key={it} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "11px 13px",
            border: `1.5px solid ${active ? accent : COLORS.line}`,
            background: active ? `${accent}0d` : "#fff",
            borderRadius: 10,
            cursor: "pointer",
            transition: "all .15s",
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              border: `1.5px solid ${active ? accent : COLORS.hint}`,
              background: active ? accent : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: 1,
            }}>
              {active && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
            </span>
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(it)}
              style={{ display: "none" }}
            />
            <span style={{ fontSize: 13, color: COLORS.ink, lineHeight: 1.55 }}>{it}</span>
          </label>
        );
      })}
    </div>
  );
}

window.MatrixTab = MatrixTab;
