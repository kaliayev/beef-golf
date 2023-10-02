/*
  Warnings:

  - The primary key for the `geoLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `direction` on the `strokeLog` table. All the data in the column will be lost.
  - You are about to drop the column `distance` on the `strokeLog` table. All the data in the column will be lost.
  - You are about to drop the column `green` on the `strokeLog` table. All the data in the column will be lost.
  - You are about to drop the column `pickup` on the `strokeLog` table. All the data in the column will be lost.
  - Added the required column `id` to the `geoLocation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_geoLocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "hole_id" INTEGER NOT NULL,
    "stroke_number" INTEGER NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "altitude" REAL,
    "accuracy" REAL NOT NULL,
    "altitude_accuracy" REAL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,
    CONSTRAINT "geoLocation_round_id_golfer_id_hole_id_stroke_number_fkey" FOREIGN KEY ("round_id", "golfer_id", "hole_id", "stroke_number") REFERENCES "strokeLog" ("round_id", "golfer_id", "hole_id", "stroke_number") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_round_id_golfer_id_fkey" FOREIGN KEY ("round_id", "golfer_id") REFERENCES "scoreCard" ("round_id", "golfer_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_hole_id_fkey" FOREIGN KEY ("hole_id") REFERENCES "hole" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_geoLocation" ("accuracy", "altitude", "altitude_accuracy", "date_created", "date_updated", "golfer_id", "hole_id", "latitude", "longitude", "round_id", "stroke_number") SELECT "accuracy", "altitude", "altitude_accuracy", "date_created", "date_updated", "golfer_id", "hole_id", "latitude", "longitude", "round_id", "stroke_number" FROM "geoLocation";
DROP TABLE "geoLocation";
ALTER TABLE "new_geoLocation" RENAME TO "geoLocation";
CREATE TABLE "new_strokeLog" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "hole_id" INTEGER NOT NULL,
    "club_id" INTEGER NOT NULL,
    "stroke_number" INTEGER NOT NULL,
    "penalty" BOOLEAN NOT NULL DEFAULT false,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,

    PRIMARY KEY ("round_id", "golfer_id", "hole_id", "stroke_number"),
    CONSTRAINT "strokeLog_round_id_golfer_id_fkey" FOREIGN KEY ("round_id", "golfer_id") REFERENCES "scoreCard" ("round_id", "golfer_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_golfer_id_club_id_fkey" FOREIGN KEY ("golfer_id", "club_id") REFERENCES "golferClub" ("golfer_id", "club_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_hole_id_fkey" FOREIGN KEY ("hole_id") REFERENCES "hole" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_strokeLog" ("club_id", "date_created", "date_updated", "golfer_id", "hole_id", "penalty", "round_id", "stroke_number") SELECT "club_id", "date_created", "date_updated", "golfer_id", "hole_id", "penalty", "round_id", "stroke_number" FROM "strokeLog";
DROP TABLE "strokeLog";
ALTER TABLE "new_strokeLog" RENAME TO "strokeLog";
CREATE TABLE "new_scoreCardHole" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "hole_id" INTEGER NOT NULL,
    "strokes" INTEGER NOT NULL,
    "putts" INTEGER NOT NULL DEFAULT 0,
    "drops" INTEGER,
    "penalties" INTEGER,
    "obs" INTEGER,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,

    PRIMARY KEY ("round_id", "golfer_id", "hole_id"),
    CONSTRAINT "scoreCardHole_hole_id_fkey" FOREIGN KEY ("hole_id") REFERENCES "hole" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "scoreCardHole_round_id_golfer_id_fkey" FOREIGN KEY ("round_id", "golfer_id") REFERENCES "scoreCard" ("round_id", "golfer_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "scoreCardHole_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "scoreCardHole_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_scoreCardHole" ("date_created", "date_updated", "drops", "golfer_id", "hole_id", "obs", "penalties", "putts", "round_id", "strokes") SELECT "date_created", "date_updated", "drops", "golfer_id", "hole_id", "obs", "penalties", coalesce("putts", 0) AS "putts", "round_id", "strokes" FROM "scoreCardHole";
DROP TABLE "scoreCardHole";
ALTER TABLE "new_scoreCardHole" RENAME TO "scoreCardHole";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
