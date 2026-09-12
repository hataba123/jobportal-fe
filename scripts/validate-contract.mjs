import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const contractPath = path.resolve("contracts/jobportal.openapi.yaml");
const document = parse(fs.readFileSync(contractPath, "utf8"));

if (document.openapi !== "3.1.0") {
  throw new Error("OpenAPI contract phải dùng phiên bản 3.1.0.");
}

const requiredOperations = {
  "/auth/register": ["post"],
  "/auth/login": ["post"],
  "/auth/oauth-login": ["post"],
  "/jobpost": ["get", "post"],
  "/jobpost/{id}": ["get", "put", "delete"],
  "/jobapplication": ["post"],
  "/companies": ["get"],
  "/companies/{id}": ["get"],
  "/user-settings": ["get", "put"],
  "/company-follows": ["get"],
  "/company-follows/{companyId}": ["post", "delete"],
  "/admin/companies/{id}/verification": ["patch"],
  "/matches/jobs": ["get"],
  "/matches/job-posts/{jobPostId}/candidates": ["get"],
  "/matches/job-posts/{jobPostId}/candidates/{candidateId}": ["get"],
  "/payment-orders": ["post"],
  "/payments/vnpay/ipn": ["get"],
};

for (const [route, methods] of Object.entries(requiredOperations)) {
  const definition = document.paths?.[route];
  if (!definition) throw new Error(`Thiếu path ${route}.`);
  for (const method of methods) {
    if (!definition[method]) throw new Error(`Thiếu operation ${method.toUpperCase()} ${route}.`);
  }
}

const schemas = document.components?.schemas ?? {};
for (const schemaName of ["Error", "JobPost", "Company", "MatchResult", "PaymentOrder"]) {
  if (!schemas[schemaName]) throw new Error(`Thiếu schema ${schemaName}.`);
}

const companyStatus = schemas.Company.properties.verificationStatus.enum;
if (JSON.stringify(companyStatus) !== JSON.stringify(["Pending", "Verified", "Rejected"])) {
  throw new Error("Enum Company.verificationStatus không đúng contract.");
}

const jobStatus = schemas.JobPost.allOf?.[1]?.properties?.status?.enum;
if (JSON.stringify(jobStatus) !== JSON.stringify(["Draft", "PendingApproval", "Active", "Closed", "Expired", "Rejected"])) {
  throw new Error("Enum JobPost.status không đúng contract.");
}

console.log(`Contract hợp lệ: ${Object.keys(document.paths).length} paths, ${Object.keys(schemas).length} schemas.`);
