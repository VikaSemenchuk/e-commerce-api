import { idSchema } from "#schemas";
import { exampleIds } from "./components.ts";
import {
  errorResponse,
  jsonContent,
  okResponse,
  ref,
  toSchema,
  type JsonObject,
} from "./helpers.ts";

// ---------- Параметри ----------

const idPathParam = (example: string) => ({
  name: "id",
  in: "path",
  required: true,
  description: "MongoDB ObjectId",
  schema: { ...toSchema(idSchema), example },
});

const idQueryParam = (name: string, description: string) => ({
  name,
  in: "query",
  required: false,
  description,
  schema: toSchema(idSchema),
});

// ---------- Типові відповіді ----------

const invalidId = errorResponse(
  "Invalid id format",
  "id: Invalid ID format",
);

const validationError = (message: string) =>
  errorResponse(
    "Validation failed: missing or invalid fields, unknown fields, or invalid JSON",
    message,
  );

const notFound = (entity: string) =>
  errorResponse(`${entity} not found`, `${entity} not found`);

// ---------- Конструктор операції ----------

type OperationOptions = {
  tag: string;
  summary: string;
  description?: string;
  parameters?: JsonObject[];
  requestBody?: string; // назва схеми з components
  responses: Record<number, JsonObject>;
};

const operation = ({
  tag,
  summary,
  description,
  parameters,
  requestBody,
  responses,
}: OperationOptions) => ({
  tags: [tag],
  summary,
  ...(description ? { description } : {}),
  ...(parameters ? { parameters } : {}),
  ...(requestBody
    ? {
        requestBody: {
          required: true,
          content: jsonContent(ref(requestBody)),
        },
      }
    : {}),
  responses,
});

const arrayOf = (name: string): JsonObject => ({
  type: "array",
  items: ref(name),
});

// ---------- Шляхи ----------

export const paths = {
  // ===== Categories =====
  "/categories": {
    get: operation({
      tag: "Categories",
      summary: "Get all categories",
      responses: { 200: okResponse("List of categories", arrayOf("Category")) },
    }),
    post: operation({
      tag: "Categories",
      summary: "Create a category",
      requestBody: "CategoryInput",
      responses: {
        201: okResponse("Category created", ref("Category")),
        400: validationError("name: Name is required"),
        409: errorResponse(
          "A category with this name already exists",
          "Resource with such value already exists",
        ),
      },
    }),
  },
  "/categories/{id}": {
    get: operation({
      tag: "Categories",
      summary: "Get a category by id",
      parameters: [idPathParam(exampleIds.category)],
      responses: {
        200: okResponse("The category", ref("Category")),
        400: invalidId,
        404: notFound("Category"),
      },
    }),
    put: operation({
      tag: "Categories",
      summary: "Update a category",
      parameters: [idPathParam(exampleIds.category)],
      requestBody: "CategoryInput",
      responses: {
        200: okResponse("Updated category", ref("Category")),
        400: validationError("name: Name is required"),
        404: notFound("Category"),
        409: errorResponse(
          "A category with this name already exists",
          "Resource with such value already exists",
        ),
      },
    }),
    delete: operation({
      tag: "Categories",
      summary: "Delete a category",
      description: "A category that still has products cannot be deleted.",
      parameters: [idPathParam(exampleIds.category)],
      responses: {
        200: okResponse("Deleted category", ref("Category")),
        400: invalidId,
        404: notFound("Category"),
        409: errorResponse(
          "The category has products",
          "Category has products and cannot be deleted",
        ),
      },
    }),
  },

  // ===== Products =====
  "/products": {
    get: operation({
      tag: "Products",
      summary: "Get all products",
      description: "Optionally filter by category with ?categoryId=.",
      parameters: [
        idQueryParam("categoryId", "Return only products of this category"),
      ],
      responses: {
        200: okResponse("List of products", arrayOf("Product")),
        400: errorResponse(
          "Invalid categoryId",
          "categoryId: Invalid ID format",
        ),
      },
    }),
    post: operation({
      tag: "Products",
      summary: "Create a product",
      requestBody: "ProductInput",
      responses: {
        201: okResponse("Product created", ref("Product")),
        400: errorResponse(
          "Validation failed or the category does not exist",
          "Category does not exist",
        ),
      },
    }),
  },
  "/products/{id}": {
    get: operation({
      tag: "Products",
      summary: "Get a product by id",
      parameters: [idPathParam(exampleIds.product)],
      responses: {
        200: okResponse("The product", ref("Product")),
        400: invalidId,
        404: notFound("Product"),
      },
    }),
    put: operation({
      tag: "Products",
      summary: "Update a product",
      parameters: [idPathParam(exampleIds.product)],
      requestBody: "ProductInput",
      responses: {
        200: okResponse("Updated product", ref("Product")),
        400: errorResponse(
          "Validation failed or the category does not exist",
          "Category does not exist",
        ),
        404: notFound("Product"),
      },
    }),
    delete: operation({
      tag: "Products",
      summary: "Delete a product",
      description: "A product that is part of an order cannot be deleted.",
      parameters: [idPathParam(exampleIds.product)],
      responses: {
        200: okResponse("Deleted product", ref("Product")),
        400: invalidId,
        404: notFound("Product"),
        409: errorResponse(
          "The product is used in orders",
          "Product is used in orders and cannot be deleted",
        ),
      },
    }),
  },

  // ===== Users =====
  "/users": {
    get: operation({
      tag: "Users",
      summary: "Get all users",
      responses: { 200: okResponse("List of users", arrayOf("User")) },
    }),
    post: operation({
      tag: "Users",
      summary: "Create a user",
      requestBody: "UserInput",
      responses: {
        201: okResponse("User created", ref("User")),
        400: validationError("email: Invalid email format"),
        409: errorResponse("Email is already taken", "Email already in use"),
      },
    }),
  },
  "/users/{id}": {
    get: operation({
      tag: "Users",
      summary: "Get a user by id",
      parameters: [idPathParam(exampleIds.user)],
      responses: {
        200: okResponse("The user", ref("User")),
        400: invalidId,
        404: notFound("User"),
      },
    }),
    put: operation({
      tag: "Users",
      summary: "Update a user",
      description:
        "Updates name and email. The password cannot be changed with this endpoint.",
      parameters: [idPathParam(exampleIds.user)],
      requestBody: "UserUpdateInput",
      responses: {
        200: okResponse("Updated user", ref("User")),
        400: validationError('Unrecognized key: "password"'),
        404: notFound("User"),
        409: errorResponse("Email is already taken", "Email already in use"),
      },
    }),
    delete: operation({
      tag: "Users",
      summary: "Delete a user",
      description: "A user who has orders cannot be deleted.",
      parameters: [idPathParam(exampleIds.user)],
      responses: {
        200: okResponse("Deleted user", ref("User")),
        400: invalidId,
        404: notFound("User"),
        409: errorResponse(
          "The user has orders",
          "User has orders and cannot be deleted",
        ),
      },
    }),
  },

  // ===== Orders =====
  "/orders": {
    get: operation({
      tag: "Orders",
      summary: "Get all orders",
      description:
        "Optionally filter by user with ?userId=. Each item includes currentProduct with the product details and its category.",
      parameters: [
        idQueryParam("userId", "Return only orders of this user"),
      ],
      responses: {
        200: okResponse("List of orders", arrayOf("Order")),
        400: errorResponse("Invalid userId", "userId: Invalid ID format"),
      },
    }),
    post: operation({
      tag: "Orders",
      summary: "Create an order",
      description:
        "The server checks that the user and all products exist, stores the current price of each product as priceAtPurchase and calculates total.",
      requestBody: "OrderInput",
      responses: {
        201: okResponse("Order created", ref("Order")),
        400: errorResponse(
          "Validation failed, or the user or a product does not exist",
          "Product does not exist",
        ),
      },
    }),
  },
  "/orders/{id}": {
    get: operation({
      tag: "Orders",
      summary: "Get an order by id",
      parameters: [idPathParam(exampleIds.order)],
      responses: {
        200: okResponse("The order", ref("Order")),
        400: invalidId,
        404: notFound("Order"),
      },
    }),
    put: operation({
      tag: "Orders",
      summary: "Update an order",
      description:
        "Replaces the order. Prices and total are calculated again from the current catalog prices.",
      parameters: [idPathParam(exampleIds.order)],
      requestBody: "OrderInput",
      responses: {
        200: okResponse("Updated order", ref("Order")),
        400: errorResponse(
          "Validation failed, or the user or a product does not exist",
          "User does not exist",
        ),
        404: notFound("Order"),
      },
    }),
    delete: operation({
      tag: "Orders",
      summary: "Delete an order",
      parameters: [idPathParam(exampleIds.order)],
      responses: {
        200: okResponse("Deleted order", ref("Order")),
        400: invalidId,
        404: notFound("Order"),
      },
    }),
  },
};
