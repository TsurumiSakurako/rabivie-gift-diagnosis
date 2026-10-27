
import { newProducts } from "./productsNew";
import { scoreProduct } from "./scoring";

type Answers = Record<string, string>;

const budgetRanges: Record<
  string,
  { min: number; max: number }
> = {
  under1000: { min: 0, max: 1000 },
  "1000_2000": { min: 1000, max: 2000 },
  "2000_3000": { min: 2000, max: 3000 },
  "3000_4500": { min: 3000, max: 4500 },
  "4500_6000": { min: 4500, max: 6000 },
};

export function calculateResult(answers: Answers) {
  const budget = budgetRanges[answers.q5];

  const ranked = newProducts.map((product) => {
    let score = scoreProduct(product, answers);

    if (budget) {
      if (product.priceStatus === "confirmed") {
        const min = product.priceMin ?? 0;
        const max = product.priceMax ?? 0;

        if (min > budget.max) {
          // 予算上限を超える商品
          score -= 100;
        } else if (max <= budget.max && max >= budget.min) {
          // 商品の価格帯全体が予算上限以内
          score += 8;
        } else if (min <= budget.max && max > budget.max) {
          // オプションによって予算を超える可能性
          score += 2;
        } else if (max < budget.min) {
          // 予算より安い商品も候補には残す
          score += 1;
        }
      }

      if (product.priceStatus === "estimated") {
        // キットの価格は未確定
        if (answers.q1 === "handmade") {
          score += 3;
        } else {
          score -= 8;
        }
      }

      if (product.priceStatus === "quote") {
        // フルオーダーは予算適合を断定しない
        score -= 5;
      }
    }

    return {
      ...product,
      score,
    };
  });

  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
