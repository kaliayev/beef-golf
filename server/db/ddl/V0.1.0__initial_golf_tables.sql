CREATE TABLE IF NOT EXISTS course
(
    id           INTEGER PRIMARY KEY,
    name         TEXT    NOT NULL,
    description  TEXT,
    date_created DATE    NOT NULL,
    date_updated DATE
);

CREATE TABLE IF NOT EXISTS hole
(
    id               INTEGER PRIMARY KEY,
    course_id        INTEGER NOT NULL,
    hole_number      INTEGER NOT NULL,
    name             TEXT,
    description      TEXT,
    handicap         INTEGER NOT NULL,
    par              INTEGER NOT NULL,
    -- distance to pin in yards by tee
    red_distance     INTEGER,
    green_distance   INTEGER,
    white_distance   INTEGER,
    blue_distance    INTEGER,
    black_distance   INTEGER,
    date_created     DATE    NOT NULL,
    date_updated     DATE,
    FOREIGN KEY (course_id) REFERENCES course (id)
);

CREATE TABLE IF NOT EXISTS round
(
    id           INTEGER PRIMARY KEY,
    description  TEXT,
    course_id    INTEGER NOT NULL,
    date_created DATE    NOT NULL,
    date_updated DATE,
    FOREIGN KEY (course_id) REFERENCES course (id)
);

CREATE TABLE IF NOT EXISTS golfer
(
    id           INTEGER PRIMARY KEY,
    name         TEXT    NOT NULL,
    date_created DATE    NOT NULL,
    date_updated DATE
);

CREATE TABLE IF NOT EXISTS club
(
    id           INTEGER PRIMARY KEY,
    key          TEXT    NOT NULL,
    name         TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS golferClub
(
    golfer_id    INTEGER NOT NULL,
    club_id      INTEGER NOT NULL,
    in_bag       BOOLEAN NOT NULL DEFAULT 1,
    distance     INTEGER NOT NULL, -- user-entered approximations, used for club selection if data is missing/incomplete
    date_created DATE    NOT NULL,
    date_updated DATE,
    PRIMARY KEY (golfer_id, club_id),
    FOREIGN KEY (golfer_id) REFERENCES golfer (id),
    FOREIGN KEY (club_id) REFERENCES club (id)
);

CREATE TABLE IF NOT EXISTS scoreCard
(
    round_id     INTEGER NOT NULL,
    golfer_id    INTEGER NOT NULL,
    beef_week    INTEGER,
    date_created DATE    NOT NULL,
    date_updated DATE,
    PRIMARY KEY (round_id, golfer_id), -- basic composite key
    FOREIGN KEY (round_id) REFERENCES round (id),
    FOREIGN KEY (golfer_id) REFERENCES golfer (id)
);

CREATE TABLE IF NOT EXISTS matchup
(
    id             INTEGER PRIMARY KEY,
    match_type     INTEGER NOT NULL, -- matchplay, strokeplay, stableford, skins etc
    date_created   DATE    NOT NULL,
    date_updated   DATE
);

CREATE TABLE IF NOT EXISTS scoreCardMatchup
(
    round_id       INTEGER NOT NULL,
    golfer_id      INTEGER NOT NULL,
    matchup_id     INTEGER NOT NULL,
    score          INTEGER NOT NULL,
    date_created   DATE    NOT NULL,
    date_updated   DATE,
    FOREIGN KEY (round_id) REFERENCES round (id),
    FOREIGN KEY (golfer_id) REFERENCES golfer (id),
    FOREIGN KEY (round_id, golfer_id) REFERENCES scoreCard (round_id, golfer_id), -- composite foreign key to scoreCard
    FOREIGN KEY (matchup_id) REFERENCES matchup (id),
    PRIMARY KEY (round_id, golfer_id, matchup_id)
);

CREATE TABLE IF NOT EXISTS scoreCardHole
(
    round_id      INTEGER NOT NULL,
    golfer_id     INTEGER NOT NULL,
    hole_id       INTEGER NOT NULL,
    strokes       INTEGER NOT NULL,
    putts         INTEGER,
    drops         INTEGER,
    penalties     INTEGER,
    obs           INTEGER,
    date_created  DATE    NOT NULL,
    date_updated  DATE,
    FOREIGN KEY (round_id) REFERENCES round (id),
    FOREIGN KEY (golfer_id) REFERENCES golfer (id),
    FOREIGN KEY (round_id, golfer_id) REFERENCES scoreCard (round_id, golfer_id), -- composite foreign key to scoreCard
    FOREIGN KEY (hole_id) REFERENCES hole (id),
    PRIMARY KEY (round_id, golfer_id, hole_id)
);

CREATE TABLE IF NOT EXISTS strokeLog
(
    round_id           INTEGER NOT NULL,
    golfer_id          INTEGER NOT NULL,
    hole_id            INTEGER NOT NULL,
    club_id            INTEGER NOT NULL,
    stroke_number      INTEGER NOT NULL,
    golfer_club_id     INTEGER,
    distance           INTEGER, -- mostly inferred from start/end geo, but this is available for manual entry for putts, etc.
    make               BOOLEAN NOT NULL DEFAULT 0, -- omits it from scoring -- used for tagging the hole
    max_strokes_pickup BOOLEAN NOT NULL DEFAULT 0, -- omits it from scoring -- used for tagging completion of hole
    penalty_stroke     BOOLEAN NOT NULL DEFAULT 0, -- omits it from calculation of stroke/club distances
    direction          INTEGER, -- 0 = hit, 1 = left, 2 = right, 3 = short, 4 = long
    latitude           REAL,
    longitude          REAL,
    altitude           REAL,
    date_created       DATE    NOT NULL,
    date_updated       DATE,
    FOREIGN KEY (round_id) REFERENCES round (id),
    FOREIGN KEY (golfer_id) REFERENCES golfer (id),
    FOREIGN KEY (hole_id) REFERENCES hole (id),
    FOREIGN KEY (club_id) REFERENCES club (id),
    FOREIGN KEY (golfer_id, club_id) REFERENCES golferClub (golfer_id, club_id), -- composite foreign key to golferClub
    FOREIGN KEY (round_id, golfer_id) REFERENCES scoreCard (round_id, golfer_id), -- composite foreign key to scoreCard
    FOREIGN KEY (round_id, golfer_id, hole_id) REFERENCES scoreCardHole (round_id, golfer_id, hole_id), -- composite foreign key to scoreCardHole
    PRIMARY KEY (round_id, golfer_id, hole_id, stroke_number)
);