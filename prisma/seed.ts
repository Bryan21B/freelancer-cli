import { db } from "../prisma";

async function main() {
  console.log("Starting database seeding process...");

  // Create clients
  console.log("\nCreating clients...");
  const acmeCorp = await db.client.upsert({
    where: { email: "contact@acmecorp.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Smith",
      companyName: "Acme Corporation",
      email: "contact@acmecorp.com",
      addressStreet: "123 Business Ave",
      addressCity: "San Francisco",
      addressZip: "94105",
      phoneCountryCode: "+1",
      phoneNumber: "555-0123",
      isArchived: false,
    },
  });
  console.log("✓ Created Acme Corporation client");

  const techStartup = await db.client.upsert({
    where: { email: "hello@techstartup.io" },
    update: {},
    create: {
      firstName: "Sarah",
      lastName: "Johnson",
      companyName: "TechStartup Inc",
      email: "hello@techstartup.io",
      addressStreet: "456 Innovation Blvd",
      addressCity: "San Francisco",
      addressZip: "94107",
      phoneCountryCode: "+1",
      phoneNumber: "555-0124",
      isArchived: false,
    },
  });
  console.log("✓ Created TechStartup Inc client");

  const designStudio = await db.client.upsert({
    where: { email: "info@designstudio.com" },
    update: {},
    create: {
      firstName: "Michael",
      lastName: "Brown",
      companyName: "Creative Design Studio",
      email: "info@designstudio.com",
      addressStreet: "789 Art Street",
      addressCity: "Los Angeles",
      addressZip: "90001",
      phoneCountryCode: "+1",
      phoneNumber: "555-0125",
      isArchived: false,
    },
  });
  console.log("✓ Created Creative Design Studio client");

  // Create projects
  console.log("\nCreating projects...");
  const websiteRedesign = await db.project.create({
    data: {
      name: "Website Redesign 2024",
      description:
        "Complete overhaul of the company website with modern design and improved UX",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-30"),
      isArchived: true,
      archivedAt: new Date("2024-07-03"),
      client: {
        connect: {
          id: acmeCorp.id,
        },
      },
    },
  });

  console.log("✓ Created Website Redesign project");

  const mobileApp = await db.project.create({
    data: {
      name: "Mobile App Development",
      description: "Cross-platform mobile app for managing customer orders",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-08-31"),
      isArchived: false,
      archivedAt: new Date(),
      client: {
        connect: {
          id: techStartup.id,
        },
      },
    },
  });
  await db.$executeRaw`UPDATE Project SET archivedAt = NULL WHERE id = ${mobileApp.id}`;
  console.log("✓ Created Mobile App Development project");

  const brandIdentity = await db.project.create({
    data: {
      name: "Brand Identity Package",
      description:
        "Complete brand identity design including logo, colors, and typography",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-04-30"),
      isArchived: false,
      archivedAt: new Date(),
      client: {
        connect: {
          id: designStudio.id,
        },
      },
    },
  });
  await db.$executeRaw`UPDATE Project SET archivedAt = NULL WHERE id = ${brandIdentity.id}`;
  console.log("✓ Created Brand Identity Package project");

  // Create additional projects
  console.log("\nCreating additional projects...");
  const ecommercePlatform = await db.project.create({
    data: {
      name: "E-commerce Platform Development",
      description:
        "Full-featured e-commerce platform with inventory management",
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-12-31"),
      isArchived: false,
      archivedAt: new Date(),
      client: {
        connect: {
          id: acmeCorp.id,
        },
      },
    },
  });
  await db.$executeRaw`UPDATE Project SET archivedAt = NULL WHERE id = ${ecommercePlatform.id}`;
  console.log("✓ Created E-commerce Platform project");

  const analyticsDashboard = await db.project.create({
    data: {
      name: "Analytics Dashboard",
      description: "Real-time analytics dashboard with data visualization",
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-10-31"),
      isArchived: false,
      archivedAt: new Date(),
      client: {
        connect: {
          id: techStartup.id,
        },
      },
    },
  });
  await db.$executeRaw`UPDATE Project SET archivedAt = NULL WHERE id = ${analyticsDashboard.id}`;
  console.log("✓ Created Analytics Dashboard project");

  const marketingCampaign = await db.project.create({
    data: {
      name: "Marketing Campaign Design",
      description:
        "Complete marketing campaign design including social media assets",
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-31"),
      isArchived: false,
      archivedAt: new Date(),
      client: {
        connect: {
          id: designStudio.id,
        },
      },
    },
  });
  await db.$executeRaw`UPDATE Project SET archivedAt = NULL WHERE id = ${marketingCampaign.id}`;
  console.log("✓ Created Marketing Campaign project");

  // Create invoices
  console.log("\nCreating invoices...");
  await Promise.all([
    // Acme Corp invoices
    db.invoice.create({
      data: {
        invoiceNumber: 1001,
        totalCost: 5000,
        dueDate: new Date("2024-04-30"),
        status: "PAID",
        validatedAt: new Date("2024-03-15"),
        clientId: acmeCorp.id,
        projectId: websiteRedesign.id,
        isArchived: false,
      },
    }),
    db.invoice.create({
      data: {
        invoiceNumber: 1002,
        totalCost: 7500,
        dueDate: new Date("2024-07-31"),
        status: "DRAFT",
        clientId: acmeCorp.id,
        projectId: websiteRedesign.id,
        isArchived: false,
      },
    }),

    // TechStartup invoices
    db.invoice.create({
      data: {
        invoiceNumber: 2001,
        totalCost: 10000,
        dueDate: new Date("2024-05-15"),
        status: "VALIDATED",
        validatedAt: new Date("2024-04-01"),
        clientId: techStartup.id,
        projectId: mobileApp.id,
        isArchived: false,
      },
    }),
    db.invoice.create({
      data: {
        invoiceNumber: 2002,
        totalCost: 15000,
        dueDate: new Date("2024-09-30"),
        status: "OVERDUE",
        validatedAt: new Date("2024-08-15"),
        clientId: techStartup.id,
        projectId: mobileApp.id,
        isArchived: false,
      },
    }),

    // Design Studio invoices
    db.invoice.create({
      data: {
        invoiceNumber: 3001,
        totalCost: 3000,
        dueDate: new Date("2024-05-31"),
        status: "CANCELLED",
        validatedAt: new Date("2024-04-15"),
        clientId: designStudio.id,
        projectId: brandIdentity.id,
        isArchived: false,
      },
    }),

    // Additional invoices
    db.invoice.create({
      data: {
        invoiceNumber: 1003,
        totalCost: 12000,
        dueDate: new Date("2024-10-31"),
        status: "DRAFT",
        clientId: acmeCorp.id,
        projectId: ecommercePlatform.id,
        isArchived: false,
      },
    }),
    db.invoice.create({
      data: {
        invoiceNumber: 2003,
        totalCost: 8000,
        dueDate: new Date("2024-08-15"),
        status: "VALIDATED",
        validatedAt: new Date("2024-07-01"),
        clientId: techStartup.id,
        projectId: analyticsDashboard.id,
        isArchived: false,
      },
    }),
    db.invoice.create({
      data: {
        invoiceNumber: 3002,
        totalCost: 5000,
        dueDate: new Date("2024-09-30"),
        status: "DRAFT",
        clientId: designStudio.id,
        projectId: marketingCampaign.id,
        isArchived: false,
      },
    }),
    db.invoice.create({
      data: {
        invoiceNumber: 1004,
        totalCost: 15000,
        dueDate: new Date("2024-12-31"),
        status: "DRAFT",
        clientId: acmeCorp.id,
        projectId: ecommercePlatform.id,
        isArchived: false,
      },
    }),
    db.invoice.create({
      data: {
        invoiceNumber: 2004,
        totalCost: 12000,
        dueDate: new Date("2024-11-30"),
        status: "DRAFT",
        clientId: techStartup.id,
        projectId: analyticsDashboard.id,
        isArchived: false,
      },
    }),
    db.invoice.create({
      data: {
        invoiceNumber: 3003,
        totalCost: 6000,
        dueDate: new Date("2024-06-30"),
        status: "PAID",
        validatedAt: new Date("2024-05-15"),
        clientId: designStudio.id,
        projectId: marketingCampaign.id,
        isArchived: true,
        archivedAt: new Date("2025-01-01"),
      },
    }),
  ]);
  console.log("✓ Created 11 invoices");

  console.log("\nSeeding completed successfully!");
  console.log("Created data summary:");
  console.log("- 3 clients");
  console.log("- 6 projects");
  console.log("- 11 invoices");
}

main()
  .then(async () => {
    await db.$disconnect();
    console.log("\nDatabase connection closed.");
  })
  .catch(async (e) => {
    console.error("\nError during seeding:");
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
