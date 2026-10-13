export function prepareToolResult(result: any) {
  const text = JSON.stringify(result);

  if (text.length > 5000) {
    return text.slice(0, 5000);
  }

  return text;
}
