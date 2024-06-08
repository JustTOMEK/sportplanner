#!/usr/bin/env python3

import os

from dotenv import load_dotenv
import mysql.connector


# Load environment variables from .env file
load_dotenv()

credentials = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

with mysql.connector.connect(**credentials) as connection, connection.cursor() as cursor:
    cursor.execute("SELECT * FROM testtable;")
    for row in cursor.fetchall():
        print(row)
