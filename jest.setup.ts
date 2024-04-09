import {
  closeTestDbConnectionAsync,
  dropTestDbConnectionAsync,
  openTestDbConnectionAsync,
} from "./src/utils/test-utils";

global.beforeAll(async () => {
  await openTestDbConnectionAsync();
});

global.afterEach(async () => {
  await dropTestDbConnectionAsync();
});

global.afterAll(async () => {
  await closeTestDbConnectionAsync();
});
