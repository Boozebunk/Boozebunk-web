import { vendorAddressesTable } from "./address";
import { adminTable } from "./admin";
import { userTable } from "./auth/user";
import { verificationTokensTable } from "./auth/verification";
import { customerTable } from "./customer";
import { FeedbackTable } from "./feedback";
import { productImagesTable } from "./images";
import { VendorQueryTable } from "./query";
import { vendorTable } from "./vendor";

const tables = {
  // auth tables
  user: userTable,
  verification: verificationTokensTable,

  //General tables
  admin: adminTable,
  vendor: vendorTable,
  address: vendorAddressesTable,
  query: VendorQueryTable,
  customer: customerTable,
  feedback: FeedbackTable,
  images: productImagesTable,
};

export type Tables = typeof tables;
export default tables;
