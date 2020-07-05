import pymysql
import pandas as pd
#make connection to mysql
config=dict(host='localhost', user='root', password='root2020',
            cursorclass=pymysql.cursors.DictCursor)

conn = pymysql.connect(**config)
conn.autocommit(1)
cursor = conn.cursor()
#read the table to df
df = pd.read_csv('earthquake.csv', encoding='utf-8', usecols=[0, 1, 2, 3, 4, 5, 6, 7])
# replace NAN with None
df = df.astype(object).where(pd.notnull(df), None)

def make_table_sql(df):
	columns = df.columns.tolist()
	make_table = []
	for item in columns:
		char = item + ' VARCHAR(255)'            
		make_table.append(char)
	return ','.join(make_table)

def csv2mysql(db_name, table_name, df):
	cursor.execute('CREATE DATABASE IF NOT EXISTS {}'.format(db_name))
	conn.select_db(db_name)
	cursor.execute('DROP TABLE IF EXISTS {}'.format(table_name))
	cursor.execute('CREATE TABLE {}({})'.format(table_name, make_table_sql(df)))
	values = df.values.tolist()
	s = ','.join(['%s' for _ in range(len(df.columns))])
	cursor.executemany('INSERT INTO {} VALUES ({})'.format(table_name, s), values)

#database name: ERA, table name: earthquake
csv2mysql("ERA", "earthquake", df)


