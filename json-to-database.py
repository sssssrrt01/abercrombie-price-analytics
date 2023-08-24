import json
import psycopg2
from datetime import date

host = 'localhost'
password = '1549015@znftsgntxd'
port = '8001'
server = 'abercrombie-database'
database = 'haotinghuang'
table_name = 'product'
today_date = date.today()

con = psycopg2.connect(
            host = host,
            database = database,
            user = "postgres",
            password = password,
            port = port
            )


cur = con.cursor()

with open('data.json', 'r') as infile:
    json_data = json.load(infile) 
    for item in json_data:
        insert_query = "INSERT INTO " + table_name + "(item, link, price, date) VALUES (%s, %s, %s, %s) RETURNING id"
        data = (item["productName"], item["productLink"], item["productPrice"], today_date)

        cur.execute(insert_query, data)


con.commit()
cur.close()
con.close()
