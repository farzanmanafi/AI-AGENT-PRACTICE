import { retry, withTimeout } from "../src/llm/retry";

let attempts = 0;

// ابزاری که عمداً خطا می‌دهد
async function failingOperation(): Promise<string> {
  attempts++;
  throw new Error("Test tool failed");
}

async function main() {
  try {
    const result = await retry(
      () => withTimeout(() => failingOperation(), 1000),
      3,
    );

    console.log("❌ TEST FAILED: Expected an error");
    console.log(result);
  } catch (error) {
    // خطا را می‌گیریم تا برنامه متوقف نشود
    const message = error instanceof Error ? error.message : "Unknown error";

    // خطا را به یک نتیجه قابل‌استفاده تبدیل می‌کنیم
    const recoveredError = {
      error: true,
      message,
    };

    console.log("Attempts:", attempts);
    console.log("Recovered error:", recoveredError);

    if (
      attempts === 3 &&
      recoveredError.error === true &&
      recoveredError.message === "Test tool failed"
    ) {
      console.log("✅ TEST PASSED");
    } else {
      console.log("❌ TEST FAILED");
    }
  }
}

main();
