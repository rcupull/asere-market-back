import supertest from "supertest";
import { app } from "../../server";
import {
  dropTestDbConnectionAsync,
  generateToken,
  setAnyString,
} from "../../utils/test-utils";
import { Image } from "../../types/general";
import { User } from "../../types/user";
import { Business } from "../../types/business";
import { fillBD } from "../../utils/test-BD";

describe("/user/:userId", () => {
  afterEach(async () => {
    await dropTestDbConnectionAsync();
  });

  it("GET", async () => {
    const { user1 } = await fillBD();

    await supertest(app)
      .get(`/user/${user1._id}`)
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchInlineSnapshot(
          setAnyString<User>(
            "_id",
            "createdAt",
            "payment.planHistory.0.dateOfPurchase"
          ),
          `
{
  "__v": 0,
  "_id": Anything,
  "canCreateBusiness": false,
  "createdAt": Anything,
  "email": "user1@gmail.com",
  "name": "user1",
  "payment": {
    "planHistory": [
      {
        "dateOfPurchase": Anything,
        "planType": "free",
        "status": "current",
        "trialMode": true,
      },
    ],
  },
  "profileImage": null,
  "role": "user",
  "validated": true,
}
`
        );
      });
  });

  it("GET should fail if not autenticated", async () => {
    const { user1 } = await fillBD();

    await supertest(app).get(`/user/${user1._id}`).expect(401);
  });

  it("GET should fail if the user has no access", async () => {
    const { user1, user2 } = await fillBD();

    await supertest(app)
      .get(`/user/${user2._id}`) // wrong id
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(401);
  });

  it("PUT", async () => {
    const { user1 } = await fillBD();

    const profileImage: Image = {
      height: 300,
      width: 300,
      src: "http://link-src.com/image.png",
    };

    //change the profileImage
    await supertest(app)
      .put(`/user/${user1._id}`)
      .send({ profileImage })
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(200);

    await supertest(app)
      .get(`/user/${user1._id}`)
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchInlineSnapshot(
          setAnyString<User>(
            "_id",
            "createdAt",
            "payment.planHistory.0.dateOfPurchase"
          ),
          `
{
  "__v": 0,
  "_id": Anything,
  "canCreateBusiness": false,
  "createdAt": Anything,
  "email": "user1@gmail.com",
  "name": "user1",
  "payment": {
    "planHistory": [
      {
        "dateOfPurchase": Anything,
        "planType": "free",
        "status": "current",
        "trialMode": true,
      },
    ],
  },
  "profileImage": {
    "height": 300,
    "src": "http://link-src.com/image.png",
    "width": 300,
  },
  "role": "user",
  "validated": true,
}
`
        );
      });
  });

  it("PUT should fail if not autenticated", async () => {
    const { user1 } = await fillBD();

    await supertest(app).put(`/user/${user1._id}`).expect(401);
  });

  it("PUT should fail if the user has no access", async () => {
    const { user1, user2 } = await fillBD();

    await supertest(app)
      .put(`/user/${user2._id}`) // wrong id
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(401);
  });
});
describe("/user/:userId/business", () => {
  afterEach(async () => {
    await dropTestDbConnectionAsync();
  });

  it("GET", async () => {
    const { user1 } = await fillBD();

    await supertest(app)
      .get(`/user/${user1.id}/business`)
      .auth(generateToken(user1.id), { type: "bearer" })
      .expect(200)
      .then((response) => {
        expect(response.body.data[0]).toMatchInlineSnapshot(
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

  it("GET should fail if not autenticated", async () => {
    const { user1 } = await fillBD();

    await supertest(app).get(`/user/${user1.id}/business`).expect(401);
  });

  it("GET should fail if the user has no access", async () => {
    const { user1, user2 } = await fillBD();

    await supertest(app)
      .get(`/user/${user2._id}/business`) // wrong id
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(401);
  });

  it("POST should fail if the business already exists", async () => {
    const { user1, business1User1 } = await fillBD();

    await supertest(app)
      .post(`/user/${user1._id}/business`)
      .send({
        name: "newBusiness",
        routeName: business1User1.routeName, // exiting bussiness
        category: "clothing",
      })
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(400);
  });

  it("POST", async () => {
    const { user1 } = await fillBD();

    await supertest(app)
      .post(`/user/${user1._id}/business`)
      .send({
        name: "newBusiness",
        routeName: "newBusiness",
        category: "clothing",
      })
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(200);

    await supertest(app)
      .get(`/user/${user1._id}/business/newBusiness`)
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(200);
  });

  it("POST should fail if not autenticated", async () => {
    const { user1 } = await fillBD();

    await supertest(app)
      .post(`/user/${user1.id}/business`)
      .send({
        name: "newBusiness",
        routeName: "newBusiness",
        category: "clothing",
      })
      .expect(401);
  });

  it("POST should fail if the user has no access", async () => {
    const { user1, user2 } = await fillBD();

    await supertest(app)
      .post(`/user/${user2.id}/business`)
      .send({
        name: "newBusiness",
        routeName: "newBusiness",
        category: "clothing",
      })
      .auth(generateToken(user1._id), { type: "bearer" })
      .expect(401);
  });
});
