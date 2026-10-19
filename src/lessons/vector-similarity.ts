type Vector = number[];

//dotProduct حاصل‌ضرب داخلی دو بردار را محاسبه می‌کند.
function dotProduct(a: Vector, b: Vector): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    // i < a.length === b.length، پس هر دو مقدار وجود دارند
    result += a[i]! * b[i]!;
  }

  return result;
}

function magnitude(vector: Vector): number {
  let sum = 0;

  for (const value of vector) {
    sum += value * value;
  }

  return Math.sqrt(sum);
}

function cosineSimilarity(a: Vector, b: Vector): number {
  if (a.length !== b.length || a.length === 0) {
    throw new Error("Vectors must have the same non-zero length");
  }

  const denominator = magnitude(a) * magnitude(b);

  if (denominator === 0) {
    throw new Error("Vectors must not be zero vectors");
  }

  return dotProduct(a, b) / denominator;
}

const sentenceA = [1, 2];
const sentenceB = [2, 4];
const sentenceC = [2, -1];

console.log("A vs B:", cosineSimilarity(sentenceA, sentenceB).toFixed(2));

console.log("A vs C:", cosineSimilarity(sentenceA, sentenceC).toFixed(2));
