#!/usr/bin/env python3

import os

import mysql.connector


credentials = {
    "host": os.environ["DB_HOST"],
    "port": os.environ["DB_PORT"],
    "database": os.environ["DB_NAME"],
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
}

with mysql.connector.connect(**credentials) as connection, connection.cursor() as cursor:
    cursor.execute("SELECT * FROM testtable;")
    for row in cursor.fetchall():
        print(row)
