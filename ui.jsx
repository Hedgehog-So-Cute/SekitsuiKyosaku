// 共有UIプリミティブ
const { useState, useMemo, useEffect } = React;

function Section({ title, eyebrow, children, style }) {
  return (
    <section style={{ marginBottom: 28, ...style }}>
      {eyebrow && (
        <div style={{
          fontSize: 11, letterSpacing: 3, color: COLORS.hint,
          textTransform: "uppercase", marginBottom: 6, fontWeight: 600,
        }}>{eyebrow}</div>
      )}
      {title && (
        <h2 style={{
          fontSize: 18, fontWeight: 700, color: COLORS.ink,
          margin: "0 0 14px 0", letterSpacing: 0.5,
        }}>{title}</h2>
      )}
      {children}
    </section>
  );
}

function Card({ children, style, accent }) {
  return (
    <div style={{
      background: COLORS.card,
      borderRadius: 14,
      border: `1px solid ${COLORS.line}`,
      padding: 20,
      boxShadow: "0 1px 2px rgba(28,43,58,0.04)",
      borderTop: accent ? `3px solid ${accent}` : `1px solid ${COLORS.line}`,
      ...style,
    }}>{children}</div>
  );
}

function Pill({ color, children, filled }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      background: filled ? color : `${color}14`,
      color: filled ? "#fff" : color,
      border: filled ? "none" : `1px solid ${color}55`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function CopyButton({ getText, label = "受診メモとしてコピー" }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) { /* noop */ }
  };
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "11px 18px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: copied ? COLORS.green : COLORS.navy,
      color: "#fff",
      fontSize: 13, fontWeight: 700,
      letterSpacing: 0.5,
      transition: "all .18s",
      fontFamily: "inherit",
      boxShadow: "0 2px 6px rgba(28,43,58,0.18)",
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 3,
        border: `1.5px solid ${copied ? "#fff" : "#fff"}`,
        display: "inline-block",
        position: "relative",
      }}>
        {copied && (
          <span style={{
            position: "absolute", left: 2, top: -1,
            color: "#fff", fontSize: 11, lineHeight: "14px",
          }}>✓</span>
        )}
      </span>
      {copied ? "コピーしました" : label}
    </button>
  );
}

function Disclaimer() {
  return (
    <div style={{
      marginTop: 36,
      padding: "16px 20px",
      background: COLORS.cream,
      borderRadius: 10,
      border: `1px solid ${COLORS.line}`,
      fontSize: 12,
      color: COLORS.sub,
      lineHeight: 1.85,
    }}>
      <div style={{ fontSize: 10, color: COLORS.hint, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>
        DISCLAIMER
      </div>
      このツールは医療機関の公開情報をもとにした参考資料です。診断・治療の判断は必ず主治医または脊椎専門医にご相談ください。<br/>
      セカンドオピニオンを求めることは、大きな手術前の標準的な行動です。
    </div>
  );
}

Object.assign(window, { Section, Card, Pill, CopyButton, Disclaimer });
