import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Digi-Kitab API",
      version: "1.0.0",
      description: "An API documentation for the Digi-Kitab project",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/Routes/*.ts", "./src/Model/*.ts", "./src/Controller/*.ts"],
};

const specs = swaggerJsdoc(options);

export default specs;
