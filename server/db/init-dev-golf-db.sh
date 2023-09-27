#!/bin/sh
# -e Exit immediately when a command returns a non-zero status.
# -x Print commands before they are executed
set -ex
# Seeding command
sqlite3 golf.db < ./ddl/V0.1.0__initial_golf_tables.sql
sqlite3 golf.db < ./dml/V0.1.1__initial_player_and_course_seeds.sql