// Tab 6: 総合判断
function SummaryTab({ symptoms, decision, matrix, questions, recovery, onJumpTab }) {

  // ── 各タブのスコア計算（0-100） ──────────────────────────────
  // Tab 1: 症状重度
  const walkOpt = walkingOptions.find(o => o.id === symptoms.walking);
  const walkScore = walkOpt ? ((walkOpt.level - 1) / 4) * 100 : 0;
  const vasScore = ((symptoms.vasRest + symptoms.vasWalk) / 20) * 100;
  const odiTotal = odiItems.reduce((s, it) => s + (symptoms.odi[it.id] ?? 0), 0);
  const odiScore = (odiTotal / 20) * 100;
  const symptomsScore = Math.round(walkScore * 0.4 + vasScore * 0.3 + odiScore * 0.3);

  // Tab 2: 緊急度・保存療法
  const anyUrgent = Object.values(decision.urgent || {}).some(Boolean);
  const consOpt = conservativeStatusOptions.find(o => o.id === decision.conservative);
  const consScore = consOpt ? consOpt.monthsScore : 0;
  const musOpt = muscleWeaknessOptions.find(o => o.id === decision.muscle);
  const musScore = musOpt ? musOpt.score : 0;
  const decisionScore = Math.round(consScore * 0.5 + musScore * 0.5);

  // Tab 3: 意思
  const matrixScore = Math.round(Math.max(0, Math.min(100,
    50 + (matrix.pros.length - matrix.cons.length) * 12
  )));

  // Tab 4: 準備度（質問が議論済かどうか）
  const allQ = [...coreQuestions, ...questions.extras];
  const doneQ = allQ.filter(q => questions.checked[q]).length;
  const questionsScore = allQ.length ? Math.round((doneQ / allQ.length) * 100) : 0;

  // Tab 5: 回復準備
  const readyCount = readinessItems.filter(it => recovery.readiness[it.id]).length;
  const recoveryScore = Math.round((readyCount / readinessItems.length) * 100);

  // ── 総合スコア（重み付き平均） ────────────────────────────
  const weights = [
    { key: "symptoms", label: "症状の重さ",       sub: "Tab 01",  score: symptomsScore, weight: 35, color: COLORS.orange, tab: "symptoms" },
    { key: "decision", label: "保存療法・筋力",   sub: "Tab 02",  score: decisionScore, weight: 30, color: COLORS.red,    tab: "decision" },
    { key: "matrix",   label: "意思の傾き",       sub: "Tab 03",  score: matrixScore,   weight: 15, color: COLORS.blue,   tab: "matrix" },
    { key: "questions",label: "受診準備の進行",   sub: "Tab 04",  score: questionsScore,weight: 10, color: COLORS.navy,   tab: "questions" },
    { key: "recovery", label: "回復環境の準備",   sub: "Tab 05",  score: recoveryScore, weight: 10, color: COLORS.green,  tab: "recovery" },
  ];

  const weighted = weights.reduce((s, w) => s + w.score * w.weight, 0) / 100;
  const totalScore = Math.round(weighted);

  // ── 総合判断 ─────────────────────────────────────────────
  let verdict;
  if (anyUrgent) {
    verdict = {
      label: "緊急受診を推奨",
      tier: "URGENT",
      color: COLORS.red,
      headline: "緊急サインに該当しています",
      message: "排尿排便障害・運動麻痺・安静時激痛のいずれかにチェックがあります。数日単位で整形外科または脊椎専門医を受診してください。保存療法の継続では対応できない段階です。",
    };
  } else if (totalScore >= 70) {
    verdict = {
      label: "手術を強く検討すべき",
      tier: "STRONG",
      color: COLORS.red,
      headline: "手術適応の根拠が揃っています",
      message: "症状の重さ・保存療法の経過・あなたの意思のすべてが手術方向に傾いています。複数の専門医による評価を受け、最終決定に進む段階です。セカンドオピニオンを取った上で術式の選択を進めることを推奨します。",
    };
  } else if (totalScore >= 50) {
    verdict = {
      label: "手術を検討する段階",
      tier: "CONSIDER",
      color: COLORS.orange,
      headline: "手術と保存療法を並行検討",
      message: "症状は無視できないが緊急ではありません。医師に Tab 04 の質問リストを持参し、内視鏡手術の適応・固定術の必要性・術後しびれの見通しを確認してください。1〜3ヶ月後に再評価して傾向を判断するのが妥当です。",
    };
  } else if (totalScore >= 30) {
    verdict = {
      label: "保存療法を継続",
      tier: "WATCH",
      color: COLORS.blue,
      headline: "経過観察と保存療法が妥当",
      message: "現段階で緊急性は低く、保存療法の余地があります。ただし全体の 1/3 は経過中に悪化するため、月単位で歩行距離・しびれ・筋力の変化を記録し、悪化傾向が続く場合は早めに再評価してください。",
    };
  } else {
    verdict = {
      label: "情報不足／経過観察",
      tier: "INFO",
      color: COLORS.hint,
      headline: "判断に必要な情報を埋めましょう",
      message: "各タブの入力が不足しています。Tab 01 で症状の数値化、Tab 02 で保存療法の状況、Tab 03 で意思の整理を進めてから再度この画面を確認してください。",
    };
  }

  // ── 受診メモ ─────────────────────────────────────────────
  const memoText = useMemo(() => {
    const lines = ["【総合判断 受診メモ】", ""];
    lines.push(`総合スコア：${totalScore} / 100`);
    lines.push(`判定：${verdict.label}`);
    if (anyUrgent) lines.push("※ 緊急サインに該当あり");
    lines.push("");
    lines.push("■ スコア内訳");
    weights.forEach(w => lines.push(`・${w.label}（${w.sub}）：${w.score} / 100（重み ${w.weight}%）`));
    lines.push("");
    lines.push("■ 症状サマリー");
    if (walkOpt) lines.push(`・歩行可能距離：${walkOpt.label}`);
    lines.push(`・痛み VAS：安静時 ${symptoms.vasRest} ／ 歩行時 ${symptoms.vasWalk}`);
    lines.push(`・ODI 簡易：${odiTotal} / 20`);
    if (consOpt) lines.push(`・保存療法：${consOpt.label}`);
    if (musOpt) lines.push(`・筋力低下：${musOpt.label}`);
    return lines.join("\n");
  }, [totalScore, verdict.label, anyUrgent, symptoms, walkOpt, odiTotal, consOpt, musOpt]);

  return (
    <div>
      {/* 総合判断ヒーロー */}
      <Section eyebrow="Final Verdict" title="総合判断">
        <div style={{
          background: COLORS.navy,
          borderRadius: 16,
          padding: 24,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 4,
            background: verdict.color,
          }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: 22, flexWrap: "wrap" }}>
            {/* 円グラフ */}
            <ScoreRing score={totalScore} color={verdict.color} />

            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{
                fontSize: 10, letterSpacing: 3, color: "#9DB2C6", fontWeight: 700, marginBottom: 8,
              }}>{verdict.tier} · OVERALL SCORE {totalScore}/100</div>

              <div style={{
                fontSize: 26, fontWeight: 800, color: verdict.color,
                marginBottom: 6, letterSpacing: 0.5,
              }}>{verdict.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                {verdict.headline}
              </div>
              <div style={{ fontSize: 13, color: "#C2D0DD", lineHeight: 1.8 }}>
                {verdict.message}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* スコア内訳 */}
      <Section eyebrow="Breakdown" title="スコア内訳（各タブの寄与）">
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {weights.map(w => (
              <div key={w.key} style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14,
                alignItems: "center",
                paddingBottom: 12, borderBottom: `1px dashed ${COLORS.line}`,
              }}>
                <div style={{ minWidth: 56 }}>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, color: COLORS.hint, fontWeight: 700 }}>{w.sub}</div>
                  <div style={{ fontSize: 10, color: w.color, fontWeight: 700, letterSpacing: 1 }}>WEIGHT {w.weight}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>{w.label}</div>
                  <div style={{ height: 6, background: COLORS.line, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${w.score}%`, height: "100%", background: w.color, transition: "width .3s" }} />
                  </div>
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 800, color: w.color,
                  fontVariantNumeric: "tabular-nums", minWidth: 50, textAlign: "right",
                }}>{w.score}</div>
                <button onClick={() => onJumpTab(w.tab)} style={{
                  padding: "6px 12px", borderRadius: 99,
                  border: `1px solid ${COLORS.line}`,
                  background: "#fff", color: COLORS.sub,
                  fontSize: 11, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}>編集 ›</button>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 16, padding: "14px 16px",
            background: COLORS.cream, borderRadius: 10,
            fontSize: 12, color: COLORS.sub, lineHeight: 1.7,
          }}>
            <span style={{ fontWeight: 700, color: COLORS.ink }}>計算方法：</span>
            各タブの 0〜100 スコアを重み付き平均。
            ただし Tab 02 の緊急サインにチェックがある場合は他のスコアに関わらず「緊急受診を推奨」となります。
            このスコアは医学的診断ではなく、医師との対話のための補助指標です。
          </div>
        </Card>
      </Section>

      {/* 判定基準 */}
      <Section eyebrow="Tier Map" title="判定の目安">
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {[
              { range: "緊急サインあり", color: COLORS.red,    label: "緊急受診を推奨" },
              { range: "70 以上",         color: COLORS.red,    label: "強く検討" },
              { range: "50 〜 69",        color: COLORS.orange, label: "検討段階" },
              { range: "30 〜 49",        color: COLORS.blue,   label: "保存療法継続" },
              { range: "29 以下",         color: COLORS.hint,   label: "情報不足" },
            ].map(t => {
              const active = verdict.label.includes(t.label) || (t.range === "緊急サインあり" && anyUrgent);
              return (
                <div key={t.range} style={{
                  padding: "12px 14px", borderRadius: 10,
                  background: active ? `${t.color}14` : COLORS.cream,
                  border: `1.5px solid ${active ? t.color : "transparent"}`,
                }}>
                  <div style={{ fontSize: 10, color: t.color, fontWeight: 800, letterSpacing: 1.5, marginBottom: 4 }}>{t.range}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{t.label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      {/* メモ */}
      <Section eyebrow="Memo" title="総合受診メモ（コピー可）">
        <div style={{ background: COLORS.navy, borderRadius: 14, padding: 22, color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <CopyButton getText={() => memoText} />
          </div>
          <pre style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "14px 16px", margin: 0,
            color: "#E6EDF3", fontSize: 12.5, lineHeight: 1.85,
            fontFamily: "inherit", whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>{memoText}</pre>
        </div>
      </Section>
    </div>
  );
}

function ScoreRing({ score, color }) {
  const r = 52, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {score}
        </div>
        <div style={{ fontSize: 10, color: "#9DB2C6", letterSpacing: 1.5, marginTop: 4, fontWeight: 700 }}>
          / 100
        </div>
      </div>
    </div>
  );
}

window.SummaryTab = SummaryTab;
