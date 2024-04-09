import supertest from "supertest";
import { BusinessModel } from "../../schemas/business";
import { app } from "../../server";
import { setAnyString } from "../../utils/test-utils";
import { objectIds } from "../../utils/test-dummies";
import { Business } from "../../types/business";

describe("/business", () => {
  it("GET", async () => {
    const dummy1 = new BusinessModel({
      name: "business1",
      routeName: "business1",
      createdBy: objectIds.obj1,
      category: "clothing",
    });

    await dummy1.save();
    //
    const dummy2 = new BusinessModel({
      name: "business2",
      routeName: "business2",
      createdBy: objectIds.obj1,
      category: "clothing",
    });

    await dummy2.save();

    await supertest(app)
      .get(`/business`)
      .expect(200)
      .then((response) => {
        expect(response.body.data[0]).toMatchInlineSnapshot(
          setAnyString<Business>("_id", "createdAt"),
          `
{
  "__v": 0,
  "_id": Anything,
  "aboutUsPage": {
    "visible": false,
  },
  "bannerImages": [],
  "category": "clothing",
  "createdAt": Anything,
  "createdBy": "62a23958e5a9e9b88f853a11",
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
  "name": "business1",
  "postCategories": [],
  "routeName": "business1",
}
`
        );
        expect(response.body.data[1]).toMatchInlineSnapshot(
          setAnyString<Business>("_id", "createdAt"),
          `
{
  "__v": 0,
  "_id": Anything,
  "aboutUsPage": {
    "visible": false,
  },
  "bannerImages": [],
  "category": "clothing",
  "createdAt": Anything,
  "createdBy": "62a23958e5a9e9b88f853a11",
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
  "name": "business2",
  "postCategories": [],
  "routeName": "business2",
}
`
        );
        expect(response.body.paginator).toMatchInlineSnapshot(`
{
  "dataCount": 2,
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
    const dummy1 = new BusinessModel({
      name: "business1",
      routeName: "business1",
      createdBy: objectIds.obj1,
      category: "clothing",
    });

    await dummy1.save();

    await supertest(app)
      .get(`/business/${dummy1.routeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchInlineSnapshot(
          setAnyString<Business>("_id", "createdAt"),
          `
  {
    "__v": 0,
    "_id": Anything,
    "aboutUsPage": {
      "visible": false,
    },
    "bannerImages": [],
    "category": "clothing",
    "createdAt": Anything,
    "createdBy": "62a23958e5a9e9b88f853a11",
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
    "name": "business1",
    "postCategories": [],
    "routeName": "business1",
  }
  `
        );
      });
  });
});
