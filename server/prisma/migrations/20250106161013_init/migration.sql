/*
  Warnings:

  - You are about to drop the `QuestionTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tags` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "QuestionTag_questionId_tagId_key";

-- DropIndex
DROP INDEX "Tag_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QuestionTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tag";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "tags" TEXT NOT NULL
);
INSERT INTO "new_Question" ("answer", "id", "options", "question") SELECT "answer", "id", "options", "question" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
