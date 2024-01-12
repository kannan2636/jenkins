// index.test.js
const request = require('supertest')

describe('User Register Function', async () => {
        let app;

        beforeAll(() => {
            app = require('./config/app.js')();
        });

      const res = await request(app)
        .post('/signup')
        .send({
            firstName : "Kannan",
            lastName : "Velu",
            email : "admin123kannan@yopmail.com",
            countryCode : "+91",
            phoneNumber : "1234567890",
            gender : "Male",
            yob : 1960,
            deviceToken : "f6322552dfssdg5456gd6aca72c25",
            password : "SmartWork@123",
            country : "india",
            weight : 100,
            weightUnit : "kg",
            heightFeet : 5,
            heightInch : 11
        });
  
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

