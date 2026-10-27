"use client";

import { useMemo, useState } from "react";
import { questions } from "../lib/questions";
import { calculateResult } from "../lib/calculateResult";
import type { GiftProduct } from "../lib/productsNew";
import "./rabivie.css";

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


const SWATCHES: Record<string, string> = {
  red: "#e45e69", pink: "#f2a7ba", orange: "#f5a15e", yellow: "#f5cf72",
  beige: "#d9bfa9", green: "#82b89c", blue: "#8bbce5", purple: "#aa8bd1",
  white: "#fffdf9", black: "#45454a",
};
const NAME_TO_COLOR: Record<string, string> = Object.fromEntries(
  Object.entries(COLOR_NAMES).map(([key, value]) => [value, SWATCHES[key]])
);
const QUESTION_ICONS: Record<string, Record<string, string>> = {
  q1: { gift_special:"💐", gift_friend:"🎁", reward_myself:"🌼", oshi:"🎀", special_event:"🎂", handmade:"🧵", purpose_any:"🐰" },
  q2: { cute:"🎀", natural:"🌿", elegant:"👑", pop:"🌈", cool:"❄️", mood_any:"🐰" },
  q3: { color_any:"🐰" },
  q4: { portable:"👜", display:"🏠", bouquet:"💐", special_big:"🌟", unique_custom:"🏰", type_any:"🐰" },
  q5: {},
  q6: { design:"🎀", long_display:"🥀", easy_carry:"👜", impact:"✨", originality:"👑", priority_any:"🐰" },
  q7: { ready_made:"🎁", semi_custom:"🎨", full_custom:"💬", leave:"🐰" },
};
const STYLE_ICONS: Record<string, string> = {
  "キュート":"🎀", "ナチュラル":"🌿", "エレガント":"👑",
  "ポップ":"🌈", "クール":"❄️", "おまかせ":"🐰",
};
const CARD_IMAGES: Record<string, string | null> = {
  // 後から選択肢の写真URLを登録できます。例: "q2:cute": "/images/cute.jpg"
  "q1:gift_special": null,
  "q2:cute": null,
  "q4:bouquet": null,
};
function Swatch({ value, size = "normal" }: { value: string; size?: "normal" | "small" }) {
  const color = SWATCHES[value] || NAME_TO_COLOR[value];
  if (!color) return null;
  return <span className={`rv-swatch rv-swatch-${size}`} style={{ backgroundColor: color }} aria-hidden="true" />;
}
function ProductCard({ product, answers, featured = false, rank }: {
  product: ResultProduct; answers: Answers; featured?: boolean; rank: number;
}) {
  const variant = recommendedVariant(product, answers);
  const options = recommendedOptions(product, answers);
  const targetUrl = variant?.url ?? product.url;
  const targetImage = variant?.image || product.image;
  return (
    <article className={`rv-product ${featured ? "rv-featured" : ""}`}>
      <div className="rv-product-photo">
        {targetImage ? <img src={targetImage} alt={`${product.name}の商品写真`} /> : <span className="rv-placeholder" aria-label="商品写真準備中">🌷<small>PHOTO COMING SOON</small></span>}
        <span className="rv-rank">{rank}</span>
      </div>
      <div className="rv-product-content">
        {featured && <p className="rv-eyebrow">♡ あなたにいちばんおすすめ ♡</p>}
        <h3>{product.name}</h3>
        <p className="rv-price">{formatPrice(product)}</p>
        <p className="rv-description">{recommendationReason(product, answers)}</p>
        {options.length > 0 && <div className="rv-options">{options.map((option) => (
          <div key={option.name} className="rv-option-line"><span>{option.name}</span><strong>{option.name === "カラー" && <Swatch value={option.value} size="small" />}{option.name === "スタイル" && <span className="rv-style-icon" aria-hidden="true">{STYLE_ICONS[option.value] ?? "🐰"}</span>}{option.value}</strong></div>
        ))}</div>}
        {product.priceStatus !== "confirmed" && <p className="rv-note">{product.priceStatus === "estimated" ? "※予定価格です。最新情報は商品ページをご確認ください。" : "※価格・制作内容はご相談のうえ決定します。"}</p>}
        <a className="rv-primary rv-product-link" href={targetUrl} target="_blank" rel="noopener noreferrer">{product.resultType === "fullOrder" ? "オーダーについて見る" : "商品を詳しく見る"} <span>›</span></a>
        {product.id === "single-flower" && <p className="rv-note">花言葉診断は準備中です。商品一覧をご覧ください。</p>}
        {product.variants && product.variants.length > 1 && <div className="rv-variants"><p>ほかのタイプも見る</p>{product.variants.filter((v) => v.id !== variant?.id).map((v) => <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer">{v.label} ↗</a>)}</div>}
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
  const selected = answers[currentQuestion?.id] || "";
  const results = useMemo<ResultProduct[]>(() => finished ? calculateResult(answers) : [], [answers, finished]);
  const restart = () => { setStarted(false); setCurrentIndex(0); setAnswers({}); setFinished(false); };
  const next = () => {
    if (!selected) return;
    if (currentIndex === questions.length - 1) setFinished(true);
    else setCurrentIndex((index) => index + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <main className="rv-page">
    <div className="rv-shell">
      <header className="rv-brand"><span>✿</span> RabiVie <span>✿</span><small>GIFT DIAGNOSIS</small></header>
      {!started ? <section className="rv-panel rv-hero">
        <img className="rv-hero-logo" src="/images/rabivie-logo.jpg" alt="RabiVie MALL FLOWER" />
        <p className="rv-eyebrow">A LITTLE GIFT, A LOT OF LOVE</p>
        <h1>大切な想いに、<br /><em>ぴったりのギフトを。</em></h1>
        <img className="rv-hero-photo" src="/images/rabivie-bouquet.jpg" alt="花束のイメージ" /><p className="rv-hero-copy">7つの質問に答えるだけで<br />あなたにぴったりの贈りものが見つかります。</p>
        <div className="rv-hero-icons"><span>♡ 想いを込めて</span><span>✿ あなたらしく</span><span>✧ 3分で診断</span></div>
        <button className="rv-primary rv-wide" onClick={() => setStarted(true)}>プレゼント診断をはじめる <span>›</span></button>
        <p className="rv-tiny">自分へのご褒美や推し活ギフトにも ♡</p>
      </section> : finished ? <section className="rv-results">
        <div className="rv-result-heading"><p className="rv-eyebrow">YOUR GIFT MATCH</p><h1>診断結果 <span>✿</span></h1><p>あなたにぴったりのギフトをご紹介します ♡</p></div>
        <section className="rv-result-summary"><p className="rv-eyebrow">YOUR COLOR & STYLE</p><h2>あなたにおすすめのイメージ</h2><div className="rv-summary-tags"><div><Swatch value={chooseColor(answers)} /><span>{chooseColor(answers)}</span></div><div><span className="rv-style-icon">{STYLE_ICONS[chooseStyle(answers)] ?? "🐰"}</span><span>{chooseStyle(answers)}</span></div></div><p>選んだ色と雰囲気をヒントに、あなたらしいギフトを。</p></section>
        {results[0] && <ProductCard product={results[0]} answers={answers} featured rank={1} />}
        {results.length > 1 && <section className="rv-more"><h2>こちらもおすすめ <span>♡</span></h2><div className="rv-more-grid">{results.slice(1).map((product, i) => <ProductCard key={product.id} product={product} answers={answers} rank={i + 2} />)}</div></section>}
        <p className="rv-note rv-price-note">※価格はオプション等で変わる場合があります。購入前に商品ページをご確認ください。</p>
        <div className="rv-result-actions"><button className="rv-secondary" onClick={restart}>↶ もう一度診断する</button><button className="rv-primary" onClick={() => { const message = `RabiVieプレゼント診断の結果は「${results[0]?.name ?? ""}」でした。あなたも診断してみてね！`; const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.origin)}`; window.open(url, "_blank", "noopener,noreferrer"); }}>診断結果をシェア ↗</button></div>
      </section> : <section className="rv-panel rv-question">
        <div className="rv-progress-top"><span>QUESTION {String(currentIndex + 1).padStart(2,"0")}</span><span>{currentIndex + 1} / {questions.length}</span></div>
        <div className="rv-progress"><span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>
        <p className="rv-question-decoration">✿ ─ ♡ ─ ✿</p>
        <h1>{currentQuestion.title}</h1>
        <p className="rv-question-hint">いちばん近いものをひとつ選んでください</p>
        <div className={`rv-choices ${currentQuestion.id === "q3" ? "rv-colors" : ""} ${currentQuestion.id === "q5" ? "rv-budget" : ""}`}>
          {currentQuestion.options.map((option) => {
            const isSelected = selected === option.value;
            const swatch = SWATCHES[option.value];
            const icon = QUESTION_ICONS[currentQuestion.id]?.[option.value];
            const image = CARD_IMAGES[`${currentQuestion.id}:${option.value}`];
            return <button type="button" key={option.value} className={`rv-choice ${isSelected ? "rv-choice-selected" : ""} ${swatch ? "rv-color-choice" : ""}`} onClick={() => setAnswers((previous) => ({ ...previous, [currentQuestion.id]: option.value }))} aria-pressed={isSelected}>
              {swatch ? <Swatch value={option.value} /> : image ? <span className="rv-choice-photo"><img src={image} alt="" /></span> : icon ? <span className="rv-choice-icon" aria-hidden="true">{icon}</span> : null}
              <span className="rv-choice-label">{option.label}</span>
              <span className="rv-choice-check" aria-hidden="true">{isSelected ? "✓" : ""}</span>
            </button>;
          })}
        </div>
        <div className="rv-nav"><button className="rv-secondary" onClick={() => currentIndex === 0 ? setStarted(false) : setCurrentIndex((i) => i - 1)}>‹ 戻る</button><button className="rv-primary" disabled={!selected} onClick={next}>{currentIndex === questions.length - 1 ? "結果を見る" : "次へ"} <span>›</span></button></div>
      </section>}
      <footer className="rv-footer">Made with ♡ by RabiVie</footer>
    </div>
  </main>;
}
