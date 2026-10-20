export function shouldUseKnowledgeBase(question: string): boolean {
  const text = question.toLowerCase();

  const knowledgeKeywords = [
    "python",
    "javascript",
    "typescript",
    "programming",
    "course",
    "lesson",
  ];

  return knowledgeKeywords.some((keyword) => text.includes(keyword));
}
