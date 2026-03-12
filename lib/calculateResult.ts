import { products } from "./products";
import { scoring } from "./scoring";

export function calculateResult(answers: Record<string, string>) {
  const scoreMap: Record<string, number> = {};

  for (const product of products) {
    scoreMap[product.id] = 0;
  }

  for (const [questionId, answerValue] of Object.entries(answers)) {
    const questionScores =
      scoring[questionId as keyof typeof scoring]?.[
        answerValue as never
      ] as Record<string, number> | undefined;

    if (!questionScores) continue;

    for (const [productId, score] of Object.entries(questionScores)) {
      scoreMap[productId] = (scoreMap[productId] || 0) + score;
    }
  }

  return [...products]
    .map((product) => ({
      ...product,
      score: scoreMap[product.id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}