import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL for seed script.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const demoPasswordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: {
      email: "demo@storyplanner.local",
    },
    update: {
      name: "Demo Writer",
      passwordHash: demoPasswordHash,
    },
    create: {
      email: "demo@storyplanner.local",
      name: "Demo Writer",
      passwordHash: demoPasswordHash,
    },
  });

  const existingProject = await prisma.project.findFirst({
    where: {
      userId: user.id,
      title: "The City Beneath Winter",
    },
  });

  if (existingProject) {
    console.log("Demo project already exists.");
    return;
  }

  await prisma.project.create({
    data: {
      userId: user.id,
      title: "The City Beneath Winter",
      genre: "Fantasy Mystery",
      synopsis:
        "A courier discovers that a frozen capital city is built over a second city that still remembers every hidden promise made above it.",
      styleNotes:
        "Atmospheric, character-focused, and slightly lyrical. Keep revelations grounded in emotional consequence rather than spectacle.",
      targetAudience: "Young Adult / New Adult",
      status: "DRAFT",
      chapters: {
        create: [
          {
            title: "Chapter 1: The Letter in the Ice",
            orderIndex: 1,
            summary:
              "Aren receives an undeliverable letter that points to a district erased from official city maps.",
            content:
              "The cold had a voice tonight. It pressed through the seams of Aren's gloves and settled in his hands like an accusation.",
            status: "DRAFT",
            timeInStory: "Day 1 - Early Winter",
          },
        ],
      },
      characters: {
        create: [
          {
            name: "Aren Vale",
            role: "Protagonist",
            occupation: "Courier",
            goal: "Find the recipient of the vanished letter.",
            fear: "Learning his family helped bury the truth about the lower city.",
            personality: "Observant, stubborn, and quietly protective.",
          },
        ],
      },
      plotThreads: {
        create: [
          {
            title: "Who erased the lower city?",
            description:
              "The central mystery follows who removed an entire district from the record and why fragments of it are resurfacing now.",
            status: "ACTIVE",
          },
        ],
      },
      events: {
        create: [
          {
            title: "Aren receives the frozen letter",
            description:
              "An undeliverable letter appears in the courier archive with a seal from a district that should not exist.",
            timeMarker: "Day 1",
            consequence:
              "Aren begins investigating the erased district, triggering the main mystery thread.",
          },
        ],
      },
    },
  });

  console.log("Seeded demo writer and starter project.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Unknown seed error.");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
