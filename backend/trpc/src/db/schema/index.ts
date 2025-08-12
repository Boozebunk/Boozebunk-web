import { vendorAddressesTable } from "./address";
import { adminTable } from "./admin";
import { userTable } from "./auth/user";
import { verificationTokensTable } from "./auth/verification";
import { vendorTable } from "./vendor";

const tables = {
  // auth tables
  user: userTable,
  verification: verificationTokensTable,

  //General tables
  admin: adminTable,
  vendor: vendorTable,
  address: vendorAddressesTable,
};

export type Tables = typeof tables;
export default tables;
