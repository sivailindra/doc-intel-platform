import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");
    await prisma.template.create({
        data: {
            name: "Standard Application Form",
            department: "General",
            description: "Default template for standard document extraction",
        }
    });
    console.log("Seeded default template.");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
