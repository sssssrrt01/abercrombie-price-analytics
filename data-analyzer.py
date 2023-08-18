import pandas as pd
import numpy as np
import psycopg2

host = 'localhost'
password = '1549015@znftsgntxd'
port = '8001'
server = 'abercrombie-database'
database = 'haotinghuang'
table_name = 'product'

con = psycopg2.connect(
            host = host,
            database = database,
            user = "postgres",
            password = password,
            port = port
            )

cur = con.cursor()
cur.execute("SELECT * FROM " + table_name)

data = cur.fetchall()

cols = []
for elt in cur.description:
    cols.append(elt[0])

df = pd.DataFrame(data=data, columns=cols)
df = df.set_index('id')

average_price = df.groupby('link').agg(
    item_name=('item', 'first'),  # Preserve the item_name
    mean_price=('price', 'mean')       # Calculate the mean of prices
)

lowest_price = df.groupby('link').agg(
    item_name=('item', 'first'),  # Preserve the item_name
    lowest_price=('price', 'min')       # Calculate the min of prices
)


print(df)
print(average_price)
print(lowest_price)

con.close()