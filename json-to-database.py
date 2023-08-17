import json
import pyodbc
from datetime import date

username = 'haotinghuang'
password = '1549015@znftsgntxd'
host = 'localhost'
port = '8001'
server = 'abercrombie-database'
database = 'haotinghuang'
driver = 'ODBC Driver 18 for SQL Server'
today_date = date.today()



with open('data.json', 'r') as infile:
    json_data = json.load(infile) 


connection_string = f'DRIVER={driver};SERVER=localhost;DATABASE={database};UID={username};PWD={password}'

connection = pyodbc.connect(connection_string)
cursor = connection.cursor()


# for item in json_data:
#     cursor.execute("INSERT INTO 