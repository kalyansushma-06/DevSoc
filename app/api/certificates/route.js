import { crudHandlers } from "@/lib/crud";
import { readCollection } from "@/lib/db";

const handlers = crudHandlers("certificates", {
  requireAuthFor: ["GET", "POST"],
});

async function generateCertificateId() {
  const certificates = await readCollection("certificates");

  const prefix = "TECH-ODYSSEY-";

  let maxNumber = 0;

  for (const certificate of certificates) {
    const certId = certificate?.certId;

    if (!certId || !certId.startsWith(prefix)) {
      continue;
    }

    const numberPart = certId.slice(prefix.length);
    const number = Number.parseInt(numberPart, 10);

if (
  Number.isFinite(number) &&
  number >= 0 &&
  number > maxNumber
) {
  maxNumber = number;
}
  }

  const nextNumber = String(maxNumber + 1).padStart(3, "0");

  return `${prefix}${nextNumber}`;
}

export async function GET(request) {
  return handlers.GET(request);
}

export async function POST(request) {
  const body = await request.json();

  const certificate = {
    ...body,
    certId: await generateCertificateId(),
    status: "valid",
  };

  const newRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify(certificate),
  });

  return handlers.POST(newRequest);
}