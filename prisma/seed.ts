import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { seedNistCsf } from "./seeds/framework-nist-csf";
import { seedIso27001 } from "./seeds/framework-iso-27001";
import { seedIso27002 } from "./seeds/framework-iso-27002";
import { seedPciDss } from "./seeds/framework-pci-dss";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — cannot run seed.");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    console.log("Seeding framework data...");

    const nist = await seedNistCsf(prisma);
    console.log(`  ✓ ${nist.code} (${nist.version})`);

    const iso27001 = await seedIso27001(prisma);
    console.log(`  ✓ ${iso27001.code} (${iso27001.version})`);

    const iso27002 = await seedIso27002(prisma);
    console.log(`  ✓ ${iso27002.code} (${iso27002.version})`);

    const pci = await seedPciDss(prisma);
    console.log(`  ✓ ${pci.code} (${pci.version})`);

    const [frameworks, domains, controls] = await Promise.all([
      prisma.framework.count(),
      prisma.controlDomain.count(),
      prisma.control.count(),
    ]);

    console.log(
      `Done. ${frameworks} frameworks, ${domains} domains, ${controls} controls.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
