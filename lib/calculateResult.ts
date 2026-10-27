import { newProducts } from "./productsNew";
import { scoreProduct } from "./scoring";

type Answers = Record<string, string>;

const budgetRanges: Record<string, { min: number; max: number }> = {
  under1000: { min: 0, max: 1000 },
  "1000_2000": { min: 1000, max: 2000 },
  "2000_3000": { min: 2000, max: 3000 },
  "3000_4500": { min: 3000, max: 4500 },
  "4500_6000": { min: 4500, max: 6000 },
};

export type BudgetFit = "within" | "partial" | "unconfirmed" | "over" | "none";

export function calculateResult(answers: Answers) {
  const budget = budgetRanges[answers.q5];
  const ranked = newProducts.map((product) => {
    const score = scoreProduct(product, answers);
    let budgetFit: BudgetFit = "none";
    let budgetPriority = 0;

    if (budget) {
      if (product.priceStatus === "confirmed" && product.priceMin != null && product.priceMax != null) {
        if (product.priceMin > budget.max) {
          budgetFit = "over";
          budgetPriority = 0;
        } else if (product.priceMax <= budget.max) {
          // 選択した上限以内で購入可能な価格帯（下限より安くても対象）
          budgetFit = "within";
          budgetPriority = 3;
        } else {
          // 最低価格は予算内だが、選ぶオプションによって超える
          budgetFit = "partial";
          budgetPriority = 2;
        }
      } else {
        // 予定価格・個別見積もりは予算内と断定しない
        budgetFit = "unconfirmed";
        budgetPriority = 1;
      }
    }

    return { ...product, score, budgetFit, budgetPriority };
  });

  // 予算を選んだ場合は予算適合度を最優先。同じ適合度なら回答との一致度順。
  // 予算内候補が3件未満のときのみ、未確定・予算超過候補が上位3件に入る。
  return ranked
    .sort((a, b) => b.budgetPriority - a.budgetPriority || b.score - a.score)
    .slice(0, 3);
}
