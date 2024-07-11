import { PrismaClient } from "@prisma/client/edge";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

async function seedUser() {
  // Create users
  try {
    const users = await prisma.user.createMany({
      data: Array.from({ length: 20 }, (_, i) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        profilePicture: faker.image.avatar(),
      })),
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedArticle() {
  // Create articles
  try {
    const articles = await prisma.article.createMany({
      data: Array.from({ length: 100 }, (_, i) => ({
        title: faker.lorem.sentence(10),
        content: faker.lorem.paragraphs(5),
        authorId: (i % 20) + 1,
      })),
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedComment() {
  try {
    // Create comments
    const comments = [];
    for (let i = 1; i <= 20; i++) {
      for (let j = 1; j <= 100; j++) {
        comments.push({
          content: faker.lorem.sentences(2),
          userId: i,
          articleId: j,
        });
      }
    }
    await prisma.comment.createMany({ data: comments });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function seedClap() {
  try {
    // Create claps
    const claps = [];
    for (let i = 1; i <= 20; i++) {
      for (let j = 1; j <= 100; j++) {
        claps.push({
          userId: i,
          articleId: j,
        });
      }
    }
    await prisma.clap.createMany({ data: claps });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function seedTags() {
  try {
    // Create tags
    const tags = await prisma.tag.createMany({
      data: [
        { tag: "Technology" },
        { tag: "Health" },
        { tag: "Science" },
        { tag: "Education" },
        { tag: "Finance" },
        { tag: "Sports" },
        { tag: "Entertainment" },
        { tag: "Politics" },
        { tag: "Travel" },
        { tag: "Food" },
        { tag: "Lifestyle" },
        { tag: "Culture" },
        { tag: "Art" },
        { tag: "History" },
        { tag: "Music" },
        { tag: "Nature" },
        { tag: "Fitness" },
        { tag: "Environment" },
        { tag: "Business" },
        { tag: "Career" },
        { tag: "Personal Development" },
        { tag: "Marketing" },
        { tag: "Programming" },
        { tag: "Design" },
        { tag: "Photography" },
        { tag: "Writing" },
        { tag: "Productivity" },
        { tag: "Psychology" },
        { tag: "Self Improvement" },
        { tag: "Relationships" },
        { tag: "Parenting" },
        { tag: "Mindfulness" },
        { tag: "Spirituality" },
        { tag: "Mental Health" },
      ],
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function seedArticleTags() {
  try {
    // Create article tags
    const articleTags: { articleId: number; tagId: number }[] = [];
    const uniqueTags = new Set<string>();

    for (let i = 1; i <= 100; i++) {
      // Select a random number of tags (between 2 and 5) for each article
      const tagCount = faker.number.int({ min: 2, max: 5 });
      // Select the tag IDs (between 1 and 34)
      const tags = Array.from({ length: tagCount }, () =>
        faker.number.int({ min: 1, max: 34 })
      );

      tags.forEach((tagId) => {
        const key = `${i}-${tagId}`;
        if (!uniqueTags.has(key)) {
          uniqueTags.add(key);
          articleTags.push({
            articleId: i,
            tagId: tagId,
          });
        }
      });
    }

    await prisma.articleTag.createMany({ data: articleTags });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    await seedUser();
    await seedArticle();

    await seedComment();
    await seedClap();

    await seedTags();
    await seedArticleTags();
    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().catch((error) => {
  console.error("An unexpected error occurred during seeding:", error);
});
