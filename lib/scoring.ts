
import type { GiftProduct } from "./productsNew";

type Answers = Record<string, string>;

export function scoreProduct(
  product: GiftProduct,
  answers: Answers
): number {
  let score = 0;

  const { q1, q4, q6, q7 } = answers;
  const { id, category } = product;

  // Q1：お花を選ぶ目的
  if (q1 === "gift_special") {
    if (category === "bouquet") score += 4;
    if (category === "arrangement") score += 4;
    if (category === "cake") score += 3;
    if (category === "singleFlower") score += 2;
  }

  if (q1 === "gift_friend") {
    if (id === "petit-bouquet") score += 5;
    if (id === "mini-bouquet") score += 4;
    if (category === "charm") score += 4;
    if (category === "singleFlower") score += 4;
  }

  if (q1 === "reward_myself") {
    if (category === "charm") score += 4;
    if (category === "arrangement") score += 3;
    if (category === "singleFlower") score += 3;
  }

  if (q1 === "oshi") {
    if (id === "alphabet-charm") score += 7;
    if (id === "rabi-doll-charm") score += 7;
    if (id === "rose-charm") score += 5;
    if (category === "bouquet") score += 2;
  }

  if (q1 === "special_event") {
    if (category === "bouquet") score += 5;
    if (category === "arrangement") score += 5;
    if (category === "cake") score += 6;
    if (id === "full-order") score += 3;
  }

  if (q1 === "handmade") {
    if (id === "handmade-kit") score += 20;
  }

  // Q4：欲しいギフトのタイプ（重要）
  if (q4 === "portable") {
    if (category === "charm") score += 12;
    if (category === "singleFlower") score += 2;
  }

  if (q4 === "display") {
    if (category === "arrangement") score += 12;
    if (category === "bouquet") score += 7;
    if (category === "cake") score += 9;
    if (category === "singleFlower") score += 5;
  }

  if (q4 === "bouquet") {
    if (category === "bouquet") score += 14;
  }

  if (q4 === "special_big") {
    if (id === "large-bouquet") score += 14;
    if (id === "large-arrangement") score += 14;
    if (id === "mole-cake") score += 12;
    if (id === "standard-bouquet") score += 5;
    if (id === "standard-arrangement") score += 5;
  }

  if (q4 === "unique_custom") {
    if (id === "full-order") score += 14;
    if (category === "bouquet") score += 6;
    if (category === "arrangement") score += 6;
    if (id === "rabi-doll-charm") score += 5;
  }

  // Q6：選ぶときに大切にしたいこと
  if (q6 === "design") {
    if (category === "bouquet") score += 3;
    if (category === "cake") score += 4;
    if (category === "charm") score += 3;
  }

  if (q6 === "long_display") {
    if (category === "arrangement") score += 7;
    if (category === "bouquet") score += 4;
    if (category === "cake") score += 5;
    if (category === "singleFlower") score += 3;
  }

  if (q6 === "easy_carry") {
    if (category === "charm") score += 8;
  }

  if (q6 === "impact") {
    if (id === "large-bouquet") score += 7;
    if (id === "large-arrangement") score += 7;
    if (id === "mole-cake") score += 7;
  }

  if (q6 === "originality") {
    if (id === "full-order") score += 8;
    if (category === "bouquet") score += 4;
    if (category === "arrangement") score += 4;
    if (id === "rabi-doll-charm") score += 5;
    if (id === "alphabet-charm") score += 4;
  }

  // Q7：ギフトの選び方
  if (q7 === "ready_made") {
    if (id === "rabi-doll-charm") score += 5;
    if (id === "mole-cake") score += 3;
    if (id === "single-flower") score += 3;
    if (id === "full-order") score -= 12;
  }

  if (q7 === "semi_custom") {
    if (category === "bouquet") score += 6;
    if (category === "arrangement") score += 6;
    if (id === "alphabet-charm") score += 5;
    if (id === "rose-charm") score += 4;
    if (id === "rabi-doll-charm") score += 5;
  }

  if (q7 === "full_custom") {
    if (id === "full-order") score += 18;
    if (category === "bouquet") score += 4;
    if (category === "arrangement") score += 4;
    if (id === "rabi-doll-charm") score += 5;
  }

  // 手作りキットは、作りたい人に優先して提案
  if (id === "handmade-kit" && q1 !== "handmade") {
    score -= 20;
  }

  // フルオーダーは、強い希望がある場合に優先
  if (
    id === "full-order" &&
    q7 !== "full_custom" &&
    q4 !== "unique_custom"
  ) {
    score -= 20;
  }

  return score;
}
