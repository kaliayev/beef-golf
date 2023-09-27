#!/bin/sh
# -e Exit immediately when a command returns a non-zero status.
# -x Print commands before they are executed
set -ex
sqlite3 ./db/golf.db < ./db/dml/V0.1.1__initial_player_and_course_seeds.sql