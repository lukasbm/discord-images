import "reflect-metadata";
import { createConnection } from "typeorm";
import { Image } from "./models";

createConnection({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  entities: [Image],
  synchronize: true,
})
  .then((connection) => {
    console.log("connected to database");
  })
  .catch((error) => console.log(error));
