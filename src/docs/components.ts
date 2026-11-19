import {
  categorySchema,
  idSchema,
  orderSchema,
  productSchema,
  userSchema,
  userUpdateSchema,
} from "#schemas";
import { toSchema, type JsonObject } from "./helpers.ts";

// Приклади id — просто заповнювачі. Для "Try it out" підставляй справжні id
// зі своєї бази (наприклад, з Compass).
export const exampleIds = {
  category: "6651f0a1b2c3d4e5f6a7b8c9",
  product: "6652f0a1b2c3d4e5f6a7b8c9",
  user: "6653f0a1b2c3d4e5f6a7b8c9",
  order: "6654f0a1b2c3d4e5f6a7b8c9",
};

const timestamps = {
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
};

const idProperty = (description?: string) => ({
  type: "string",
  description: description ?? "MongoDB ObjectId",
  ...toSchema(idSchema),
});

// У Zod email перевіряється через pipe, тому toJSONSchema не додає format: email
const withEmailFormat = (schema: JsonObject): JsonObject => ({
  ...schema,
  properties: {
    ...(schema.properties as JsonObject),
    email: { type: "string", format: "email" },
  },
});

export const components = {
  schemas: {
    // ---------- Помилка ----------
    Error: {
      type: "object",
      properties: { message: { type: "string" } },
      required: ["message"],
      example: { message: "Category not found" },
    },

    // ---------- Те, що надсилає клієнт (з Zod-схем) ----------
    CategoryInput: {
      ...toSchema(categorySchema),
      example: { name: "Electronics" },
    },
    ProductInput: {
      ...toSchema(productSchema),
      example: {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        price: 24.99,
        categoryId: exampleIds.category,
      },
    },
    UserInput: {
      ...withEmailFormat(toSchema(userSchema)),
      example: {
        name: "Anna Schmidt",
        email: "anna@example.com",
        password: "password123",
      },
    },
    UserUpdateInput: {
      ...withEmailFormat(toSchema(userUpdateSchema)),
      description:
        "Password cannot be changed here. Sending extra fields (including password) returns 400.",
      example: { name: "Anna Schmidt", email: "anna@example.com" },
    },
    OrderInput: {
      ...toSchema(orderSchema),
      description:
        "Only ids and quantities. The server takes prices from the database and calculates total. Duplicate productId values are not allowed.",
      example: {
        userId: exampleIds.user,
        products: [{ productId: exampleIds.product, quantity: 2 }],
      },
    },

    // ---------- Те, що повертає сервер ----------
    Category: {
      type: "object",
      properties: {
        id: idProperty(),
        name: { type: "string" },
        ...timestamps,
      },
      example: {
        id: exampleIds.category,
        name: "Electronics",
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      },
    },
    Product: {
      type: "object",
      properties: {
        id: idProperty(),
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        categoryId: idProperty("Id of the category"),
        ...timestamps,
      },
      example: {
        id: exampleIds.product,
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        price: 24.99,
        categoryId: exampleIds.category,
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      },
    },
    User: {
      type: "object",
      description: "The password is never returned.",
      properties: {
        id: idProperty(),
        name: { type: "string" },
        email: { type: "string", format: "email" },
        ...timestamps,
      },
      example: {
        id: exampleIds.user,
        name: "Anna Schmidt",
        email: "anna@example.com",
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      },
    },
    OrderItem: {
      type: "object",
      properties: {
        productId: idProperty("Id of the ordered product"),
        quantity: { type: "integer", minimum: 1 },
        priceAtPurchase: {
          type: "number",
          description: "Unit price at the moment of purchase (snapshot).",
        },
        currentProduct: {
          type: "object",
          nullable: true,
          description:
            "The product as it is in the catalog now, with its category. null if the product no longer exists.",
          properties: {
            id: idProperty(),
            name: { type: "string" },
            description: { type: "string" },
            price: {
              type: "number",
              description: "Current catalog price (may differ from priceAtPurchase).",
            },
            categoryId: {
              type: "object",
              properties: { id: idProperty(), name: { type: "string" } },
            },
          },
        },
      },
    },
    Order: {
      type: "object",
      properties: {
        id: idProperty(),
        userId: idProperty("Id of the user who placed the order"),
        products: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
        total: {
          type: "number",
          description: "Calculated by the server: sum of priceAtPurchase × quantity.",
        },
        ...timestamps,
      },
      example: {
        id: exampleIds.order,
        userId: exampleIds.user,
        products: [
          {
            productId: exampleIds.product,
            quantity: 2,
            priceAtPurchase: 24.99,
            currentProduct: {
              id: exampleIds.product,
              name: "Wireless Mouse",
              description: "Ergonomic wireless mouse",
              price: 24.99,
              categoryId: { id: exampleIds.category, name: "Electronics" },
            },
          },
        ],
        total: 49.98,
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      },
    },
  },
};
