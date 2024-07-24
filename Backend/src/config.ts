import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

const config = {
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION,
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION,
  },
  test_jwt: process.env.TEST_JWT,
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  book: {
    coverPath: process.env.BOOK_COVER_PATH,
    bookFilePathFiction: process.env.BOOK_FILE_PATH_FICTION,
    bookFilePathNonFiction: process.env.BOOK_FILE_PATH_NON_FICTION,
  },
};

export default config;
