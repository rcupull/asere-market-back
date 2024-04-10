import supertest from "supertest";
import { BusinessModel } from "../../schemas/business";
import { app } from "../../server";
import { setAnyString } from "../../utils/test-utils";
import { objectIds } from "../../utils/test-dummies";
import { Business } from "../../types/business";
import { fillBD } from "../../utils/test-BD";

describe("/business", () => {
  it("GET", async () => {
    await fillBD();

    await supertest(app)
      .get(`/business`)
      .expect(200)
      .then((response) => {
        expect(response.body.data[0]).toMatchInlineSnapshot(
  setAnyString<Business>("_id", "createdAt", "createdBy"), `
{
  "__v": 0,
  "_id": Anything,
  "aboutUsPage": {
    "visible": false,
  },
  "bannerImages": [],
  "createdAt": Anything,
  "createdBy": Anything,
  "hidden": false,
  "layouts": {
    "banner": {
      "type": "static",
    },
    "footer": {
      "type": "basic",
    },
    "search": {
      "type": "right",
    },
  },
  "logo": null,
  "name": "business1User1",
  "postCategories": [],
  "routeName": "business1User1",
}
`);

        expect(response.body.data[1]).toMatchInlineSnapshot(
  setAnyString<Business>("_id", "createdAt", "createdBy"), `
{
  "__v": 0,
  "_id": Anything,
  "aboutUsPage": {
    "visible": false,
  },
  "bannerImages": [],
  "createdAt": Anything,
  "createdBy": Anything,
  "hidden": false,
  "layouts": {
    "banner": {
      "type": "static",
    },
    "footer": {
      "type": "basic",
    },
    "search": {
      "type": "right",
    },
  },
  "logo": null,
  "name": "business2User1",
  "postCategories": [],
  "routeName": "business2User1",
}
`);

        expect(response.body.paginator).toMatchInlineSnapshot(`
{
  "dataCount": 3,
  "hasNextPage": false,
  "hasPrevPage": false,
  "limit": 10,
  "nextPage": null,
  "offset": 0,
  "page": 1,
  "pageCount": 1,
  "pagingCounter": 1,
  "prevPage": null,
}
`);
      });
  });
});

describe("/business/:routeName", () => {
  it("GET", async () => {
    const { business1User1 } = await fillBD();

    await supertest(app)
      .get(`/business/${business1User1.routeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchInlineSnapshot(
          setAnyString<Business>("_id", "createdAt", "createdBy"),
          `
{
  "__v": 0,
  "_id": Anything,
  "aboutUsPage": {
    "visible": false,
  },
  "bannerImages": [],
  "createdAt": Anything,
  "createdBy": Anything,
  "hidden": false,
  "layouts": {
    "banner": {
      "type": "static",
    },
    "footer": {
      "type": "basic",
    },
    "search": {
      "type": "right",
    },
  },
  "logo": null,
  "name": "business1User1",
  "postCategories": [],
  "routeName": "business1User1",
}
`
        );
      });
  });
});
