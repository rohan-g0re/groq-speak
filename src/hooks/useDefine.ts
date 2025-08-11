import { useMutation } from "@tanstack/react-query";
import type { Definition, DefineResponse } from "@/types/definition";

const mockDefinition = (input: string): Definition => ({
  term: input.trim(),
  definition:
    "A concise, structured explanation generated in mock mode for demonstration purposes.",
  partOfSpeech: "noun",
  examples: [
    `The term "${input.trim()}" is used frequently in modern AI discussions.`,
    `Researchers defined "${input.trim()}" in multiple ways.`,
    `Understanding "${input.trim()}" improves product clarity.`,
  ],
  synonyms: ["concept", "notion", "idea", "term", "expression"],
});

async function doDefine({
  input,
  mock,
}: {
  input: string;
  mock?: boolean;
}): Promise<Definition> {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a term to define.");
  if (trimmed.length > 500) throw new Error("Input exceeds 500 characters.");

  if (mock) {
    await new Promise((r) => setTimeout(r, 500));
    return mockDefinition(trimmed);
  }

  const res = await fetch("/api/v1/define", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: trimmed }),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server.");
  }

  if (!res.ok) {
    throw new Error(json?.message || "Request failed. Try again later.");
  }

  if (!json?.success || !json?.data) {
    throw new Error("Malformed response. Missing data field.");
  }

  return json.data as Definition;
}

export const useDefine = () =>
  useMutation({
    mutationFn: doDefine,
  });
