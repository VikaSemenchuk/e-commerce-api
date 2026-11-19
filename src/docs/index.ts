import { components } from "./components.ts";
import { paths } from "./paths.ts";

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "eCommerce API",
    version: "1.0.0",
    description:
      "REST API of an online shop: categories, products, users and orders. All errors have the format `{ \"message\": \"...\" }`.",
  },
  servers: [
    {
      url:
        process.env.API_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
    },
  ],
  tags: [
    { name: "Categories" },
    { name: "Products" },
    { name: "Users" },
    { name: "Orders" },
  ],
  paths,
  components,
};
