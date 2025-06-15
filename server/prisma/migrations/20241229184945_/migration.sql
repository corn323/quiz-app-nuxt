-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "tags" TEXT NOT NULL
);
