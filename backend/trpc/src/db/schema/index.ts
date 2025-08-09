import { vendorAddressesTable } from "./address";
import { adminTable } from "./admin";
import { userTable } from "./auth/user";
import { verificationTokensTable } from "./auth/verification";
import { vendorTable } from "./vendor";

export const AllSchemas = {
  // auth tables
  user: userTable,
  verification: verificationTokensTable,

  //General tables
  admin: adminTable,
  vendor: vendorTable,
  address: vendorAddressesTable,
};
