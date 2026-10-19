function chunkText(
  text: string,
  sentencesPerChunk: number,
  overlap: number,
): string[] {
  const sentences = text
    .split(".")
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  const chunks: string[] = [];

  const step = sentencesPerChunk - overlap;

  for (let i = 0; i < sentences.length; i += step) {
    const chunk = sentences.slice(i, i + sentencesPerChunk).join(". ") + ".";

    chunks.push(chunk);
  }

  return chunks;
}
const text = `
JavaScript is a programming language.
TypeScript is built on JavaScript.
TypeScript adds static typing.
TypeScript is used for web development.
Python is another programming language.
`;

const chunks = chunkText(text, 2, 1);

chunks.forEach((chunk, index) => {
  console.log(`Chunk ${index + 1}:`);
  console.log(chunk);
  console.log("---");
});
