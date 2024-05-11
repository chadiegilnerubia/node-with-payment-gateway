import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Xendit } from "xendit-node";
import { CreateInvoiceRequest, Invoice } from "xendit-node/invoice/models";

// Load environment variables (.env file required)
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const invoiceFunc = async () => {
  console.log("invoice function called");
  const secretKey = process.env.SECRET_KEY;

  if (secretKey === undefined) {
    console.error("Error: Missing environment variable SECRET_KEY");
    return undefined; // Return undefined if secretKey is missing
  }

  const xenditClient = new Xendit({
    secretKey,
  });
  const { Invoice } = xenditClient;
  const data: CreateInvoiceRequest = {
    externalId: "test123",
    amount: 23232,
    currency: "PHP",
    customer: {
      givenNames: "Ahmad",
      surname: "Gunawan",
      email: "ahmad_gunawan@example.com",
      mobileNumber: "+6287774441111",
    },
    customerNotificationPreference: {
      invoicePaid: ["email", "whatsapp"],
    },
    successRedirectUrl: "example.com/success",
    failureRedirectUrl: "example.com/failure",
    items: [
      {
        name: "Double Cheeseburger",
        quantity: 1,
        price: 7000,
        category: "Fast Food",
      },
      {
        name: "Chocolate Sundae",
        quantity: 1,
        price: 3000,
        category: "Fast Food",
      },
    ],
    fees: [
      {
        type: "Delivery",
        value: 10000,
      },
    ],
  };
  const response: Invoice = await Invoice.createInvoice({ data });
  console.log("response", response.invoiceUrl);
};
invoiceFunc();
app.post("/receive_callback", async (req, res) => {
  const { body } = req;
  if (body.status === "PAID") {
    console.log(
      `Invoice successfully paid with status ${body.status} and id ${body.id}`
    );
  }
  res.sendStatus(200).end();
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
