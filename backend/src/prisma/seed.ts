import { db } from "./db";

const leads = [
  {
    name: "Ana Torres",
    phone: "600100001",
    isNewCustomer: true,
    commercialInterest: 95,
    source: "WEB",
    leadDate: new Date("2026-11-16"),
    status: "NEW" as const,
  },
  {
    name: "Luis Pérez",
    phone: "600100002",
    isNewCustomer: false,
    commercialInterest: 65,
    source: "CAMPAIGN",
    leadDate: new Date("2026-11-14"),
    status: "IN_PROGRESS" as const,
  },
  {
    name: "María Ruiz",
    phone: "600100003",
    isNewCustomer: false,
    commercialInterest: 35,
    source: "OTHER",
    leadDate: new Date("2026-11-01"),
    status: "CONTACTED" as const,
  },
  {
    name: "Carlos Gómez",
    phone: "600100004",
    isNewCustomer: true,
    commercialInterest: 88,
    source: "REFERRAL",
    leadDate: new Date("2026-11-17"),
    status: "NEW" as const,
  },
  {
    name: "Laura Sánchez",
    phone: "600100005",
    isNewCustomer: true,
    commercialInterest: 72,
    source: "WEB",
    leadDate: new Date("2026-11-15"),
    status: "IN_PROGRESS" as const,
  },
  {
    name: "Javier Martín",
    phone: "600100006",
    isNewCustomer: false,
    commercialInterest: 45,
    source: "CAMPAIGN",
    leadDate: new Date("2026-11-10"),
    status: "CONTACTED" as const,
  },
  {
    name: "Elena López",
    phone: "600100007",
    isNewCustomer: true,
    commercialInterest: 98,
    source: "REFERRAL",
    leadDate: new Date("2026-11-17"),
    status: "NEW" as const,
  },
  {
    name: "David Romero",
    phone: "600100008",
    isNewCustomer: false,
    commercialInterest: 20,
    source: "OTHER",
    leadDate: new Date("2026-10-20"),
    status: "CLOSED" as const,
  },
  {
    name: "Lucía Fernández",
    phone: "600100009",
    isNewCustomer: true,
    commercialInterest: 80,
    source: "WEB",
    leadDate: new Date("2026-11-16"),
    status: "NEW" as const,
  },
  {
    name: "Miguel Navarro",
    phone: "600100010",
    isNewCustomer: false,
    commercialInterest: 55,
    source: "CAMPAIGN",
    leadDate: new Date("2026-11-12"),
    status: "IN_PROGRESS" as const,
  },
  {
    name: "Sara Molina",
    phone: "600100011",
    isNewCustomer: true,
    commercialInterest: 91,
    source: "REFERRAL",
    leadDate: new Date("2026-11-16"),
    status: "NEW" as const,
  },
  {
    name: "Pablo Ortega",
    phone: "600100012",
    isNewCustomer: false,
    commercialInterest: 40,
    source: "OTHER",
    leadDate: new Date("2026-11-05"),
    status: "CONTACTED" as const,
  },
  {
    name: "Carmen Vega",
    phone: "600100013",
    isNewCustomer: true,
    commercialInterest: 77,
    source: "WEB",
    leadDate: new Date("2026-11-13"),
    status: "IN_PROGRESS" as const,
  },
  {
    name: "Daniel Castro",
    phone: "600100014",
    isNewCustomer: false,
    commercialInterest: 15,
    source: "OTHER",
    leadDate: new Date("2026-10-15"),
    status: "CLOSED" as const,
  },
  {
    name: "Paula Herrera",
    phone: "600100015",
    isNewCustomer: true,
    commercialInterest: 85,
    source: "CAMPAIGN",
    leadDate: new Date("2026-11-17"),
    status: "NEW" as const,
  },
];

async function seed() {
  console.log("Seeding database...");

  // Agentes
  let agent1 = await db.orm.public.Agent
    .where({ email: "agente01@ganaenergia.test" })
    .first();

  if (!agent1) {
    agent1 = await db.orm.public.Agent.create({
      name: "Agente 01",
      email: "agente01@ganaenergia.test",
      role: "AGENT",
    });
  }

  let agent2 = await db.orm.public.Agent
    .where({ email: "agente02@ganaenergia.test" })
    .first();

  if (!agent2) {
    agent2 = await db.orm.public.Agent.create({
      name: "Agente 02",
      email: "agente02@ganaenergia.test",
      role: "AGENT",
    });
  }

  // Administrador para probar permisos
  const existingAdmin = await db.orm.public.Agent
    .where({ email: "admin@ganaenergia.test" })
    .first();

  if (!existingAdmin) {
    await db.orm.public.Agent.create({
      name: "Administrador",
      email: "admin@ganaenergia.test",
      role: "ADMIN",
    });
  }

  // Leads
  for (const lead of leads) {
    const existing = await db.orm.public.Lead
      .where({ phone: lead.phone })
      .first();

    if (existing) {
      continue;
    }

    const index = leads.indexOf(lead);

let agentId: number | null = null;

if (index % 3 === 0) {
  agentId = agent1.id;
}

if (index % 3 === 1) {
  agentId = agent2.id;
}

await db.orm.public.Lead.create({
  ...lead,
  agentId,
});
  }

  console.log("Seed completed.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});