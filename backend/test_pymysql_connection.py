import pymysql

try:
    connection = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        port=3306
    )
    print('✅ Connexion pymysql réussie sur le port 3306')
    with connection.cursor() as cursor:
        cursor.execute('SHOW DATABASES;')
        print('Bases de données:', [db[0] for db in cursor.fetchall()])
    connection.close()
except Exception as e:
    print('❌ Erreur de connexion pymysql:', e) 