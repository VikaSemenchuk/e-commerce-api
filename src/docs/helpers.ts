import { z } from "zod";
import type { ZodType } from "zod";

export type JsonObject = Record<string, unknown>;

// Перетворює Zod-схему на JSON Schema для OpenAPI 3.0.
// io: "input" — описуємо те, що надсилає клієнт (до trim/toLowerCase).
export const toSchema = (schema: ZodType): JsonObject => {
  const json = z.toJSONSchema(schema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  });

  // Zod додає "$schema" і технічну межу для цілих чисел — у документації це шум.
  return JSON.parse(
    JSON.stringify(json, (key, value) => {
      if (key === "$schema") return undefined;
      if (key === "maximum" && value === Number.MAX_SAFE_INTEGER)
        return undefined;
      return value;
    }),
  );
};

export const ref = (name: string): JsonObject => ({
  $ref: `#/components/schemas/${name}`,
});

export const jsonContent = (schema: JsonObject, example?: unknown) => ({
  "application/json": {
    schema,
    ...(example === undefined ? {} : { example }),
  },
});

// Відповідь із повідомленням про помилку у форматі { "message": "..." }
export const errorResponse = (description: string, message: string) => ({
  description,
  content: jsonContent(ref("Error"), { message }),
});

export const okResponse = (description: string, schema: JsonObject) => ({
  description,
  content: jsonContent(schema),
});
