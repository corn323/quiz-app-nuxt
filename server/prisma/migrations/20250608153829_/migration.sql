/*
  Warnings:

  - Added the required column `isMath` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "isMath" BOOLEAN NOT NULL
);
INSERT INTO "new_Question" ("answer", "id", "options", "question", "tags") SELECT "answer", "id", "options", "question", "tags" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
