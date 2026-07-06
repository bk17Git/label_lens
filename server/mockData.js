export const mockAnalysis = {
  "ingredients_raw": "Rolled oats, high fructose corn syrup, palm oil, sugar, semi-sweet chocolate chips (sugar, chocolate liquor, cocoa butter, soy lecithin, natural flavor), canola oil, glycerin, fructose, salt, sodium bicarbonate, natural flavor, mixed tocopherols (preservative).",
  "flagged_ingredients": [
    {
      "name": "high fructose corn syrup",
      "concern": "Added Sugar",
      "explanation": "A highly refined sweetener linked to insulin resistance, weight gain, and cardiovascular issues when consumed in large quantities."
    },
    {
      "name": "palm oil",
      "concern": "Saturated Fat / Environmental",
      "explanation": "High in saturated fat, which can impact cholesterol levels. Its production is also widely linked to environmental concerns like deforestation."
    },
    {
      "name": "sugar",
      "concern": "Added Sugar",
      "explanation": "Simple added sugars increase calorie density without adding nutritional value, potentially leading to energy crashes and teeth issues."
    },
    {
      "name": "natural flavor",
      "concern": "Vague Labeling",
      "explanation": "A broad, unregulated industry term that allows manufacturers to mask proprietary chemical mixtures containing up to 100 ingredients."
    },
    {
      "name": "mixed tocopherols",
      "concern": "Preservatives",
      "explanation": "A form of Vitamin E used to prevent oil oxidation. It is generally safe but indicates a highly processed product designed for long shelf life."
    }
  ],
  "verdict": "Consume in Moderation",
  "verdict_reason": "Contains multiple sources of added sugars (high fructose corn syrup, sugar, and fructose) along with palm oil, raising the overall calorie and saturated fat density.",
  "summary": "While this snack bar contains whole-grain oats, it is highly sweetened and contains processed fats. It is best enjoyed as an occasional treat rather than a daily health snack."
};
