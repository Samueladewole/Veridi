import { PrismaClient, ClientTier, ClientStatus, ApiKeyScope } from "@prisma/client";
import * as argon2 from "argon2";
import { randomBytes, createHash } from "crypto";

const prisma = new PrismaClient();

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

function generateApiKey(prefix: string): { raw: string; hash: string; prefix: string } {
  const raw = `${prefix}${randomBytes(24).toString("base64url")}`;
  return { raw, hash: hashApiKey(raw), prefix };
}

async function main() {
  console.log("Seeding Veridi database...");

  // 1. Admin user
  const adminPasswordHash = await argon2.hash("admin123");
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@veridi.africa" },
    update: {},
    create: {
      email: "admin@veridi.africa",
      name: "Veridi Admin",
      passwordHash: adminPasswordHash,
      isSuperAdmin: true,
    },
  });
  console.log(`Admin: ${admin.email}`);

  // 2. Clients
  const tendr = await prisma.client.upsert({
    where: { email: "dev@tendr.ng" },
    update: {},
    create: {
      name: "Tendr.ng",
      email: "dev@tendr.ng",
      website: "https://tendr.ng",
      tier: ClientTier.GROWTH,
      status: ClientStatus.ACTIVE,
      monthlyCallLimit: 3000,
      mrr: 200000,
    },
  });

  const medstaff = await prisma.client.upsert({
    where: { email: "api@medstaff.ng" },
    update: {},
    create: {
      name: "MedStaff NG",
      email: "api@medstaff.ng",
      website: "https://medstaff.ng",
      tier: ClientTier.SCALE,
      status: ClientStatus.ACTIVE,
      monthlyCallLimit: 10000,
      mrr: 500000,
    },
  });

  const testco = await prisma.client.upsert({
    where: { email: "test@testco.dev" },
    update: {},
    create: {
      name: "TestCo",
      email: "test@testco.dev",
      tier: ClientTier.STARTER,
      status: ClientStatus.PENDING_APPROVAL,
      monthlyCallLimit: 100,
    },
  });

  console.log(`Clients: ${tendr.name}, ${medstaff.name}, ${testco.name}`);

  // 3. API Keys (2 per active client: live + test)
  const activeClients = [tendr, medstaff];
  for (const client of activeClients) {
    const liveKey = generateApiKey("vrd_live_sk_");
    const testKey = generateApiKey("vrd_test_sk_");

    await prisma.apiKey.createMany({
      data: [
        {
          clientId: client.id,
          name: `${client.name} Live Key`,
          keyHash: liveKey.hash,
          keyPrefix: liveKey.prefix,
          scopes: [ApiKeyScope.ALL],
          isLive: true,
        },
        {
          clientId: client.id,
          name: `${client.name} Test Key`,
          keyHash: testKey.hash,
          keyPrefix: testKey.prefix,
          scopes: [ApiKeyScope.ALL],
          isLive: false,
        },
      ],
      skipDuplicates: true,
    });

    console.log(`  ${client.name} keys: ${liveKey.raw.slice(0, 24)}...`);
  }

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
