"use client";

import { useMemo, useState } from "react";
import { questions } from "../lib/questions";
import { calculateResult } from "../lib/calculateResult";
import type { GiftProduct } from "../lib/productsNew";

type Answers = Record<string, string>;
type ResultProduct = GiftProduct & { score: number };

const COLOR_NAMES: Record<string, string> = {
  red: "レッド", pink: "ピンク", orange: "オレンジ", yellow: "イエロー",
  beige: "ベージュ", green: "グリーン", blue: "ブルー", purple: "パープル",
  white: "ホワイト", black: "ブラック",
};
const STYLE_NAMES: Record<string, string> = {
  cute: "キュート", natural: "ナチュラル", elegant: "エレガント",
  pop: "ポップ", cool: "クール",
};

function chooseColor(answers: Answers): string {
  if (COLOR_NAMES[answers.q3]) return COLOR_NAMES[answers.q3];
  if (answers.q1 === "oshi") return "ブルー";
  if (answers.q2 === "cool") return "ブルー";
  if (answers.q2 === "natural") return "ベージュ";
  if (answers.q2 === "pop") return "イエロー";
  if (answers.q2 === "elegant") return "ホワイト";
  return "ピンク";
}

function chooseStyle(answers: Answers): string {
  if (STYLE_NAMES[answers.q2]) return STYLE_NAMES[answers.q2];
  if (answers.q1 === "oshi") return "ポップ";
  if (answers.q6 === "impact") return "エレガント";
  if (answers.q6 === "long_display") return "ナチュラル";
  if (["blue", "black"].includes(answers.q3)) return "クール";
  return "キュート";
}

function formatPrice(product: GiftProduct): string {
  if (product.priceStatus === "quote") return "個別見積もり";
  if (product.priceMin == null || product.priceMax == null) return "価格は商品ページでご確認ください";
  const min = `¥${product.priceMin.toLocaleString("ja-JP")}`;
  const max = `¥${product.priceMax.toLocaleString("ja-JP")}`;
  const range = min === max ? min : `${min}〜${max}`;
  return product.priceStatus === "estimated" ? `${range}（予定価格・未確定）` : range;
}

function recommendedVariant(product: GiftProduct, answers: Answers) {
  if (!product.variants?.length) return null;
  if (product.id === "rabi-doll-charm") {
    return product.variants.find((v) =>
      v.id === (answers.q7 === "ready_made" || answers.q7 === "leave" ? "select" : "custom")
    ) ?? product.variants[0];
  }
  if (product.id === "mole-cake") {
    const chocolate = answers.q2 === "cool" || answers.q3 === "black" || answers.q3 === "beige";
    return product.variants.find((v) => v.id === (chocolate ? "chocolate" : "shortcake")) ?? product.variants[0];
  }
  return product.variants[0];
}

function recommendedOptions(product: GiftProduct, answers: Answers) {
  const color = chooseColor(answers);
  const style = chooseStyle(answers);
  const options: { name: string; value: string }[] = [];
  // BASEの商品オプションに存在する場合のみ表示する
  for (const option of product.options) {
    if (option.name === "カラー" && option.values.includes(color)) {
      options.push({ name: "カラー", value: color });
    } else if (option.name === "スタイル" && option.values.includes(style)) {
      options.push({ name: "スタイル", value: style });
    } else if (option.name === "デザイン") {
      const design = answers.q7 === "ready_made" ? "ノーマル" :
        answers.q2 === "pop" ? "グリッター&リボン" : "リボン";
      if (option.values.includes(design)) options.push({ name: "デザイン", value: design });
    }
  }
  const variant = recommendedVariant(product, answers);
  if (variant) options.push({ name: "おすすめタイプ", value: variant.label });
  return options;
}

function recommendationReason(product: GiftProduct, answers: Answers): string {
  if (product.id === "handmade-kit") return "自分の手で作る時間も楽しめる、手作りキットがおすすめです。完成までの過程も思い出に。";
  if (product.id === "full-order") return "イメージやこだわりを相談しながら、特別なギフトを形にしたい方におすすめです。価格は個別見積もりです。";
  if (product.category === "charm") {
    if (answers.q1 === "oshi") return "推し活のおともに。好きなカラーやデザインを取り入れて、持ち歩く楽しさをプラスできます。";
    return "バッグなどにつけて、いつでも身近に楽しめる小さなギフトです。";
  }
  if (product.category === "bouquet") {
    return answers.q4 === "bouquet"
      ? "花束を贈りたいという気持ちにぴったり。お好みのカラーとスタイルで、想いが伝わるブーケに。"
      : "枯れないお花を花束に。飾るたびに贈ったときの気持ちを思い出せるギフトです。";
  }
  if (product.category === "arrangement") return "お部屋に飾って長く楽しめるアレンジ。空間にやさしい彩りを添えます。";
  if (product.category === "cake") return "お祝いの気持ちを華やかに伝えられる、ケーキモチーフの特別なギフトです。";
  if (product.category === "singleFlower") return "気持ちを一輪に込めて。花言葉から選ぶ楽しみもある、さりげない贈り物です。";
  return "あなたの回答をもとに選んだ、おすすめのギフトです。";
}

const colors = {
  background: "#f5efe6", surface: "#fffaf6", ink: "#5a3a3a",
  muted: "#80695e", accent: "#b98d73", border: "#e4d3c6",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block", padding: "14px 22px", borderRadius: 16,
  border: "none", background: colors.accent, color: "white",
  fontWeight: 700, fontSize: 16, cursor: "pointer", textDecoration: "none",
  textAlign: "center", lineHeight: 1.6,
};

function ProductCard({ product, answers, featured = false }: {
  product: ResultProduct; answers: Answers; featured?: boolean;
}) {
  const variant = recommendedVariant(product, answers);
  const options = recommendedOptions(product, answers);
  const targetUrl = variant?.url ?? product.url;
  const targetImage = variant?.image || product.image;
  const needsBudgetNotice = product.priceStatus === "estimated" || product.priceStatus === "quote";

  return (
    <article className={`gift-product-card${featured ? " gift-product-featured" : ""}`}>
      {featured && <p style={{ color: colors.accent, fontWeight: 700, marginBottom: 16 }}>♡ あなたにいちばんおすすめ ♡</p>}
      <div className="gift-product-layout">
       {targetImage && (
          <div className="gift-product-image-wrap">
            <img
              src={targetImage}
  alt={`${product.name}の表紙写真`}
  className="gift-product-image"
            />
          </div>
        )}
        <div className="gift-product-info">
          <h2 style={{ fontSize: featured ? "clamp(24px, 4vw, 32px)" : "clamp(21px, 3vw, 26px)",
            lineHeight: 1.4, marginBottom: 8 }}>{product.name}</h2>
          <p style={{ fontSize: featured ? 23 : 19, fontWeight: 700, color: colors.accent, marginBottom: 14 }}>{formatPrice(product)}</p>
          {options.length > 0 && (
            <div style={{ background: "#f6ede7", padding: 16, borderRadius: 16, marginBottom: 16 }}>
              {options.map((option) => (
                <div key={option.name} style={{ display: "flex", justifyContent: "space-between", gap: 12,
                  padding: "7px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ color: colors.muted }}>{option.name}</span>
                  <strong style={{ textAlign: "right" }}>{option.value}</strong>
                </div>
              ))}
            </div>
          )}
          <p style={{ lineHeight: 1.9, color: colors.muted, marginBottom: 18 }}>{recommendationReason(product, answers)}</p>
          {needsBudgetNotice && <p style={{ color: colors.muted, fontSize: 13, marginBottom: 12 }}>
            {product.priceStatus === "estimated" ? "※価格は未確定です。最新情報は商品ページをご確認ください。" : "※価格・制作内容はご相談のうえ決定します。"}
          </p>}
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={buttonStyle}>
            {product.resultType === "fullOrder" ? "オーダーについて見る" : "商品を見る"}
          </a>
          {product.id === "single-flower" && (
            <p style={{ fontSize: 13, color: colors.muted, marginTop: 12 }}>
              花言葉診断は準備中です。まずはシングルフラワーの商品一覧をご覧ください。
            </p>
          )}
          {product.variants && product.variants.length > 1 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>ほかのタイプも見る</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {product.variants.filter((v) => v.id !== variant?.id).map((v) => (
                  <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: colors.ink, border: `1px solid ${colors.border}`, borderRadius: 12,
                      padding: "9px 12px", textDecoration: "none", fontSize: 14 }}>{v.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);
  const currentQuestion = questions[currentIndex];

  const results = useMemo<ResultProduct[]>(() => {
    if (!finished) return [];
    return calculateResult(answers);
  }, [answers, finished]);

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
    if (currentIndex === questions.length - 1) setFinished(true);
    else setCurrentIndex((previous) => previous + 1);
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
  };

  const shell: React.CSSProperties = {
    minHeight: "100vh", background: colors.background, color: colors.ink,
    padding: "36px 20px 70px", fontFamily: "'Noto Sans JP', sans-serif",
  };

  if (!started) {
    return (
      <main style={{ ...shell, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 650, width: "100%", textAlign: "center" }}>
          <p style={{ color: colors.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>Gift Finder</p>
          <h1 style={{ fontSize: "clamp(38px, 10vw, 56px)", lineHeight: 1.25, marginBottom: 20 }}>
            RabiVie<br /><span style={{ fontSize: ".65em" }}>プレゼント診断</span>
          </h1>
          <p style={{ lineHeight: 2, fontSize: 18, marginBottom: 34 }}>
            3分で終わる7つの質問で<br />あなたにぴったりのギフトが見つかります
          </p>
          <button onClick={() => setStarted(true)} className="answerButton"
            style={{ ...buttonStyle, width: "100%", maxWidth: 460, padding: "18px 24px", fontSize: 20 }}>
            診断を始める
          </button>
          <p style={{ lineHeight: 2.2, color: colors.muted, marginTop: 45 }}>
            こんな人におすすめ<br />友達へのプレゼントを探している<br />推し活ギフトを探している<br />自分へのご褒美を探している
          </p>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main style={shell}>
        <style>{`
          .gift-product-card {
            background: #fffaf6;
            border: 1px solid #e4d3c6;
            border-radius: 24px;
            padding: 22px;
            box-shadow: 0 8px 26px rgba(90,58,58,0.06);
          }
          .gift-product-featured { padding: 28px; }
          .gift-product-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 20px;
            align-items: start;
          }
          .gift-product-image-wrap {
            width: 100%;
            aspect-ratio: 1 / 1;
            background: #f6ede7;
            border-radius: 18px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .gift-product-image {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .gift-product-info { min-width: 0; }
          @media (min-width: 720px) {
            .gift-product-layout {
              grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
              gap: 28px;
            }
          }
          @media (max-width: 719px) {
            .gift-product-card { padding: 18px; }
            .gift-product-featured { padding: 20px; }
          }
        `}</style>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <header style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ color: colors.accent, fontWeight: 700, marginBottom: 8 }}>RabiVie Gift Finder</p>
            <h1 style={{ fontSize: "clamp(32px, 8vw, 46px)", marginBottom: 12 }}>診断結果</h1>
            <p style={{ color: colors.muted, lineHeight: 1.8 }}>あなたにぴったりのギフトをご紹介します ♡</p>
          </header>
          {results[0] && <ProductCard product={results[0]} answers={answers} featured />}
          {results.length > 1 && (
            <section style={{ marginTop: 36 }}>
              <h2 style={{ fontSize: 24, marginBottom: 18 }}>こちらもおすすめ</h2>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18 }}>
                {results.slice(1).map((product) => <ProductCard key={product.id} product={product} answers={answers} />)}
              </div>
            </section>
          )}
          <p style={{ color: colors.muted, fontSize: 13, lineHeight: 1.8, marginTop: 24 }}>
            ※価格は選択するオプションなどで変わる場合があります。ご購入前に商品ページでご確認ください。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <button onClick={handleRestart} className="answerButton" style={buttonStyle}>もう一度診断する</button>
            <button onClick={() => {
              const text = `RabiVieプレゼント診断の結果は「${results[0]?.name ?? ""}」でした。あなたも診断してみてね！`;
              const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
              window.open(shareUrl, "_blank", "noopener,noreferrer");
            }} className="answerButton" style={{ ...buttonStyle, background: "white", color: colors.ink, border: `1px solid ${colors.border}` }}>
              診断結果をシェア
            </button>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: colors.muted }}>結果をスクリーンショットしてシェアするのも大歓迎です♡</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ ...shell, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 720, width: "100%", background: "white", borderRadius: 28,
        border: `1px solid ${colors.border}`, padding: "32px 22px", boxShadow: "0 10px 24px rgba(90,58,58,0.06)" }}>
        <p style={{ color: colors.accent, fontWeight: 700, marginBottom: 14 }}>
          STEP {currentIndex + 1} / {questions.length}
        </p>
        <div style={{ height: 8, background: "#eadfd2", borderRadius: 100, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, height: "100%",
            background: colors.accent, borderRadius: 100, transition: "width .2s" }} />
        </div>
        <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", lineHeight: 1.5, marginBottom: 22 }}>
          {currentQuestion.title}
        </h1>
        {currentIndex > 0 && (
          <button onClick={() => setCurrentIndex((index) => index - 1)} className="answerButton"
            style={{ background: "#fffaf5", border: `1px solid ${colors.border}`, color: colors.ink,
              padding: "10px 15px", borderRadius: 12, marginBottom: 20, cursor: "pointer" }}>
            ← 前の質問に戻る
          </button>
        )}
        <div style={{ display: "grid", gap: 12 }}>
          {currentQuestion.options.map((option) => (
            <button key={option.value} onClick={() => handleSelect(option.value)} className="answerButton"
              style={{ ...buttonStyle, width: "100%", textAlign: "left", fontSize: "clamp(16px, 4vw, 18px)",
                padding: "17px 20px", background: answers[currentQuestion.id] === option.value ? "#9c7058" : colors.accent }}>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
