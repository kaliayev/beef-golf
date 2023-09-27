-- CreateTable
CREATE TABLE "club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME
);

-- CreateTable
CREATE TABLE "golfer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME
);

-- CreateTable
CREATE TABLE "golferClub" (
    "golfer_id" INTEGER NOT NULL,
    "club_id" INTEGER NOT NULL,
    "in_bag" BOOLEAN NOT NULL DEFAULT true,
    "distance" INTEGER NOT NULL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,

    PRIMARY KEY ("golfer_id", "club_id"),
    CONSTRAINT "golferClub_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "golferClub_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "hole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" INTEGER NOT NULL,
    "hole_number" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "handicap" INTEGER NOT NULL,
    "par" INTEGER NOT NULL,
    "red_distance" INTEGER,
    "green_distance" INTEGER,
    "white_distance" INTEGER,
    "blue_distance" INTEGER,
    "black_distance" INTEGER,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,
    CONSTRAINT "hole_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "matchup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "match_type" INTEGER NOT NULL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME
);

-- CreateTable
CREATE TABLE "round" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "course_id" INTEGER NOT NULL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,
    CONSTRAINT "round_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "scoreCard" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "beef_week" INTEGER,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,

    PRIMARY KEY ("round_id", "golfer_id"),
    CONSTRAINT "scoreCard_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "scoreCard_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "scoreCardHole" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "hole_id" INTEGER NOT NULL,
    "strokes" INTEGER NOT NULL,
    "putts" INTEGER,
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

-- CreateTable
CREATE TABLE "scoreCardMatchup" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "matchup_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,

    PRIMARY KEY ("round_id", "golfer_id", "matchup_id"),
    CONSTRAINT "scoreCardMatchup_matchup_id_fkey" FOREIGN KEY ("matchup_id") REFERENCES "matchup" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "scoreCardMatchup_round_id_golfer_id_fkey" FOREIGN KEY ("round_id", "golfer_id") REFERENCES "scoreCard" ("round_id", "golfer_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "scoreCardMatchup_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "scoreCardMatchup_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "strokeLog" (
    "round_id" INTEGER NOT NULL,
    "golfer_id" INTEGER NOT NULL,
    "hole_id" INTEGER NOT NULL,
    "club_id" INTEGER NOT NULL,
    "stroke_number" INTEGER NOT NULL,
    "golfer_club_id" INTEGER,
    "distance" INTEGER,
    "make" BOOLEAN NOT NULL DEFAULT false,
    "max_strokes_pickup" BOOLEAN NOT NULL DEFAULT false,
    "penalty_stroke" BOOLEAN NOT NULL DEFAULT false,
    "direction" INTEGER,
    "latitude" REAL,
    "longitude" REAL,
    "altitude" REAL,
    "date_created" DATETIME NOT NULL,
    "date_updated" DATETIME,

    PRIMARY KEY ("round_id", "golfer_id", "hole_id", "stroke_number"),
    CONSTRAINT "strokeLog_round_id_golfer_id_hole_id_fkey" FOREIGN KEY ("round_id", "golfer_id", "hole_id") REFERENCES "scoreCardHole" ("round_id", "golfer_id", "hole_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_round_id_golfer_id_fkey" FOREIGN KEY ("round_id", "golfer_id") REFERENCES "scoreCard" ("round_id", "golfer_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_golfer_id_club_id_fkey" FOREIGN KEY ("golfer_id", "club_id") REFERENCES "golferClub" ("golfer_id", "club_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_hole_id_fkey" FOREIGN KEY ("hole_id") REFERENCES "hole" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_golfer_id_fkey" FOREIGN KEY ("golfer_id") REFERENCES "golfer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "strokeLog_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
