/*
  Warnings:

  - You are about to drop the column `make` on the `strokeLog` table. All the data in the column will be lost.
  - You are about to drop the column `max_strokes_pickup` on the `strokeLog` table. All the data in the column will be lost.
  - You are about to drop the column `penalty_stroke` on the `strokeLog` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_strokeLog" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "hole_id" INTEGER NOT NULL,
    "club_id" INTEGER NOT NULL,
    "stroke_number" INTEGER NOT NULL,
    "distance" INTEGER,
    "green" BOOLEAN NOT NULL DEFAULT false,
    "pickup" BOOLEAN NOT NULL DEFAULT false,
    "penalty" BOOLEAN NOT NULL DEFAULT false,
    "direction" INTEGER,
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
INSERT INTO "new_strokeLog" ("club_id", "date_created", "date_updated", "direction", "distance", "golfer_id", "hole_id", "round_id", "stroke_number") SELECT "club_id", "date_created", "date_updated", "direction", "distance", "golfer_id", "hole_id", "round_id", "stroke_number" FROM "strokeLog";
DROP TABLE "strokeLog";
ALTER TABLE "new_strokeLog" RENAME TO "strokeLog";
CREATE TABLE "new_geoLocation" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "hole_id" INTEGER NOT NULL,
    "stroke_number" INTEGER NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "altitude" REAL NOT NULL,
    "accuracy" REAL NOT NULL,
    "altitude_accuracy" REAL NOT NULL,
    "heading" REAL NOT NULL,
    "speed" REAL NOT NULL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,

    PRIMARY KEY ("round_id", "golfer_id", "hole_id", "stroke_number"),
    CONSTRAINT "geoLocation_round_id_golfer_id_hole_id_stroke_number_fkey" FOREIGN KEY ("round_id", "golfer_id", "hole_id", "stroke_number") REFERENCES "strokeLog" ("round_id", "golfer_id", "hole_id", "stroke_number") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_round_id_golfer_id_fkey" FOREIGN KEY ("round_id", "golfer_id") REFERENCES "scoreCard" ("round_id", "golfer_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_hole_id_fkey" FOREIGN KEY ("hole_id") REFERENCES "hole" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "geoLocation_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_geoLocation" ("accuracy", "altitude", "altitude_accuracy", "date_created", "date_updated", "golfer_id", "heading", "hole_id", "latitude", "longitude", "round_id", "speed", "stroke_number") SELECT "accuracy", "altitude", "altitude_accuracy", "date_created", "date_updated", "golfer_id", "heading", "hole_id", "latitude", "longitude", "round_id", "speed", "stroke_number" FROM "geoLocation";
DROP TABLE "geoLocation";
ALTER TABLE "new_geoLocation" RENAME TO "geoLocation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
