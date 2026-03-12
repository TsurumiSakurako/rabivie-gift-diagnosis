"use client";

import { useMemo, useState } from "react";
import { questions } from "../lib/questions";
import { calculateResult } from "../lib/calculateResult";
import { productDescriptions } from "../lib/productDescriptions";

type Answers = Record<string, string>;

type Variant = {
  name: string;
  image: string;
  url: string;
};

type ResultProduct = {
  id: string;
  name: string;
  price: number;
  score: number;
  variants?: Variant[];
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const results = useMemo(() => {
    if (!finished) return [];
    return calculateResult(answers) as ResultProduct[];
  }, [answers, finished]);

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(nextAnswers);

    const isLastQuestion = currentIndex === questions.length - 1;

    if (isLastQuestion) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
  };

  const handleBack = () => {
  if (currentIndex === 0) return;

  setCurrentIndex((prev) => prev - 1);
};

  if (!started) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor:"#f5efe6",
          color: "#5a3a3a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily:"'Noto Sans JP', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            textAlign: "center",
          }}
        > <h1
            style={{
              fontSize: "clamp(16px,4vw,22px)",
              fontWeight: 700,
              marginBottom: "12px",
          color:"#9c7b66",
          letterSpacing:"0.5px",
            }}
          >
            Gift Finder
          </h1>

          <h1
            style={{
              fontSize: "clamp(42px,11vw,58px)",
              fontWeight: 700,
              marginBottom: "16px",
              letterSpacing:"0.5px",
            }}
          >
            RabiVie プレゼント診断
          </h1>

          <p
            style={{
              fontSize: "clamp(18px,4.8vw,520px)",
              lineHeight: 1.8,
              color: "#5a3a3a",
              marginBottom: "36px",
            }}
          >
            ３分で終わる６つの質問で
            <br />
            あなたにぴったりのギフトが見つかります
          </p>

          <button 
            onClick={() => setStarted(true)}
            className="answerButton"
            style={{
              padding: "18px 32px",
              width:"100%",
              maxWidth:"520px",
              fontSize: "clamp(20px,5vw,22px)",
              borderRadius: "20px",
              border: "none",
              backgroundColor:"#c9a27e",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              transition:"0.2s",

            }}
          >
            診断を始める
          </button>

          <div style={{
          marginTop:"72px",
          fontSize:"clamp(16px,4.3vw,18px)",
          color:"#7a5a5a",
          lineHeight:2
          }}>
          \ こんな人におすすめ /
          <br/>
          ・友達へのプレゼントを探している
          <br/>
          ・推し活ギフトを探している
          <br/>
          ・自分へのご褒美を探している
          </div>
        </div>
      </main>
    );
  }

  if (finished) {
    const [top1, top2, top3] = results;
    const top1MainImage = top1?.variants?.[0]?.image;
    const top2MainImage = top2?.variants?.[0]?.image;
    const top3MainImage = top3?.variants?.[0]?.image;
    const top1Variants = top1?.variants ?? [];
    const hasMultipleVariants = top1Variants.length > 1;
    const singleVariant = top1Variants.length === 1 ? top1Variants[0] : null;

    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor:"#f5efe6",
          color: "#5a3a3a",
          padding: "32px 20px 60px",
          fontFamily:"'Noto Sans JP', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1080px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "50px",
              textAlign: "center",
              marginBottom: "10px",
              color: "#5a3a3a",
            }}
          >
            診断結果
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#7a5a5a",
              marginBottom: "20px",
              fontSize: "20px",
            }}
          >
            あなたに１番おすすめの商品はこちらです
          </p>

{top1 && (
  <section
    style={{
      backgroundColor: "#f8f6f2",
      borderRadius: "24px",
      padding: "32px",
      marginBottom: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      border: "1px solid #d8c9bb",
    }}
  >
    <div
      style={{
        display: "inline-block",
        fontSize: "22px",
        backgroundColor: "#c9a27e",
        color: "#fff",
        padding: "8px 18px",
        borderRadius: "999px",
        marginBottom: "12px",
        fontWeight: 700,
      }}
    >
      あなたにおすすめ
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "28px",
        alignItems: "start",
      }}
    >
      <div>
        {top1MainImage && (
          <img
            src={top1MainImage}
            alt={top1.name}
            style={{
              width: "100%",
              maxWidth: "470px",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: "20px",
              border: "1px solid #222",
            }}
          />
        )}
      </div>

      <div>
        <h2
          style={{
            fontSize: "38px",
            marginBottom: "10px",
            fontWeight: 500,
          }}
        >
          {top1.name}
        </h2>

        <p
          style={{
            fontSize: "30px",
            marginBottom: "12px",
            color: "#b07f5c",
            fontWeight: 700,
          }}
        >
          {top1.price.toLocaleString()}円
        </p>

        <p
          style={{
            lineHeight: 1.9,
            color: "#7a5a5a",
            marginBottom: "16px",
            fontSize: "19px",
          }}
        >
          {productDescriptions[top1.id]}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "8px",
            marginBottom: "8px",
          }}
        >
          {singleVariant && (
            <button
 onClick={handleRestart}
            className="answerButton"
            style={{
                display: "inline-block",
                padding: "14px 24px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#c9a27e",
                color: "#fff",
                textDecoration: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              商品を見る
            </button>
          )}

          <button

            onClick={handleRestart}
            className="answerButton"
            style={{
              padding: "14px 24px",
              fontSize: "16px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#c9a27e",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              transition: "0.2s",
            }}
          >
            もう一度診断する
          </button>

          <button
            onClick={() => {
              const text = `RabiVieプレゼント診断の結果は「${top1.name}」でした🌼\n\nあなたも診断してみてね！`;
              const url = window.location.origin;

              const shareUrl =
                "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(text) +
                "&url=" +
                encodeURIComponent(url);

              window.open(shareUrl, "_blank");
            }}
             className="answerButton"
            style={{
              padding: "14px 24px",
              fontSize: "16px",
              borderRadius: "12px",
              border: "1px solid #444",
              backgroundColor: "#fff",
              color: "#5a3a3a",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            診断結果をシェア
          </button>
        </div>

        <p
          style={{
            marginTop: "18px",
            color: "#7a5a5a",
            lineHeight: 1.8,
            fontSize: "15px",
          }}
        >
          Instagramのストーリーズでシェアしてね✨
        </p>
        <p
          style={{
            marginTop: "10px",
            color: "#7a5a5a",
            fontSize: "14px",
            lineHeight: 1.8,
          }}
        >
          結果をスクショしてシェアも大歓迎です♡
        </p>
      </div>
    </div>

    {hasMultipleVariants && (
      <section
        style={{
          marginTop: "36px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            marginBottom: "18px",
          }}
        >
          ▼ おすすめ商品の種類を選ぶ
        </h3>

        <p
          style={{
            color: "#7a5a5a",
            marginBottom: "20px",
            lineHeight: 1.8,
          }}
        >
          気になる種類を選んで、詳細ページをご覧ください。
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          {top1Variants.map((variant) => (

                      <article
                        key={variant.name}
                        style={{
                          backgroundColor: "#faebd7",
                          border: "1px solid #d2b48c",
                          borderRadius: "18px",
                          padding: "16px",
                        }}
                      >
                        <img
                          src={variant.image}
                          alt={variant.name}
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 0.85",
                            objectFit: "cover",
                            borderRadius: "14px",
                            marginBottom: "14px",
                          }}
                        />

                        <h4
                          style={{
                            fontSize: "20px",
                            marginBottom: "12px",
                          }}
                        >
                          {variant.name}
                        </h4>

                         <button
                            onClick={handleRestart}
                            className="answerButton"
                            style={{
                            display: "inline-block",
                            padding: "12px 18px",
                            borderRadius: "12px",
                            border: "#7a5a5a",
                            backgroundColor:"#c9a27e",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 700,
                          }}
                        >
                          商品を見る
                        </button>

                      </article>
                    ))}
                  </div>
                </section>
              )}
            </section>
          )}

          <section>
          
            <h3
              style={{
                fontSize: "22px",
                marginTop: "50px",
                marginBottom: "8px",
              }}            >
             ▼ こちらもおすすめ
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
              }}
            >
              {[top2, top3].filter(Boolean).map((item) => {
                const mainImage = item?.variants?.[0]?.image;

                return (
                  <article
                    key={item!.id}
                    style={{
                      backgroundColor:"#f8f6f2", color:"#333", boxShadow:"0 10px 30px rgba(0,0,0,0.05)",
                      borderRadius: "20px",
                      padding: "24px",
                      border: "1px solid #d8c9bb",
                    }}
                  >
                    {mainImage && (
                      <img
                        src={mainImage}
                        alt={item!.name}
                        style={{
                          width: "80%",
                          
                          aspectRatio: "1 / 0.85",
                          objectFit: "cover",
                          borderRadius: "16px",
                          marginBottom: "16px",
                        }}
                      />
                    )}

                    <h4
                      style={{
                        fontSize: "24px",
                        marginBottom: "10px",
                      }}
                    >
                      {item!.name}
                    </h4>

                    <p
                      style={{
                        color: "#b07f5c",
                        fontSize: "20px",
                        fontWeight: 700,
                        marginBottom: "12px",
                      }}
                    >
                      {item!.price.toLocaleString()}円
                    </p>

                    <p
                      style={{
                        color: "#7a5a5a",
                        marginBottom: "16px",
                        lineHeight: 1.7,
                      }}
                    >
                      近い傾向でおすすめされた候補です。
                    </p>

                    <div
                      style={{
                        fontSize: "14px",
                        color: "#ccc",
                        marginBottom: "14px",
                      }}
                    >
                    </div>

                    {item!.variants && item!.variants.length > 0 && (
                      <button
                          onClick={handleRestart}
                          className="answerButton"
                          style={{
                          display: "inline-block",
                          padding: "12px 18px",
                          borderRadius: "12px",
                          backgroundColor:"#c9a27e",
                          color: "#fff",
                          textDecoration: "none",
                          fontWeight: 700,
                        }}
                      >
                        商品を見る
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:"#f5efe6",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily:"'Noto Sans JP', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          backgroundColor:"#ffffff", color:"#333", boxShadow:"0 10px 24px rgba(0,0,0,0.06)",
          borderRadius: "24px",
          padding: "32px 24px",
          border: "1px solid #222",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color:"#9c7b66",
            marginBottom: "16px",
          }}
        >
          STEP {currentIndex + 1} / {questions.length}
        </div>

        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#eadfd2",
            borderRadius: "999px",
            marginBottom: "24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              height: "100%",
              backgroundColor: "#c9a27e",
              borderRadius: "999px",
              transition: "width 0.3s ease",
            }}
          />
        </div>


        <h1
          style={{
            fontSize: "32px",
            marginBottom: "36px",
            lineHeight: 1.5,
          }}
        >
          {currentQuestion.title}
        </h1>


<div
  style={{
    marginBottom: "20px",
  }}
>
  {currentIndex > 0 && (
    <button

      onClick={handleBack}
      className="answerButton"
      style={{
        padding: "10px 16px",
        fontSize: "14px",
        borderRadius: "12px",
        border: "1px solid #bfa58d",
        backgroundColor: "transparent",
        color: "#8a6a55",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      ← 前の質問に戻る
    </button>
  )}
</div>



        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="answerButton"
              style={{
                textAlign: "left",
                fontWeight: 1000,
                padding: "18px 24px",
                borderRadius: "16px",
                border: "1px solid #333",
                backgroundColor:"#c9a27e",
                color: "#fff",
                cursor: "pointer",
                fontSize: "19px",
                lineHeight: 1.6,
                transition:"0.2s",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}