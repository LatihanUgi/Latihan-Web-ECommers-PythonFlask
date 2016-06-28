import MySQLdb
import hashlib


def login(username,password):
	h = hashlib.md5(password.encode())
	list = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select * from customer where username='"+username+"' and password='"+h.hexdigest()+"'") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_customer = str(row[0])
			nama = row[1]
			jenis_kelamin = row[2]
			email = row[3]
			username = row[5]
		list = [id_customer,nama,jenis_kelamin,email,username]
	except:
		print "Error: unable to fecth data"
	db.close()
	return list
	
def register(nama,jk,email,hp,username,password):
	hasil = False
	h = hashlib.md5(password.encode())
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("insert into customer(nama,jenis_kelamin,email,hp,username,password)values('"+nama+"','"+jk+"','"+email+"','"+hp+"','"+username+"','"+h.hexdigest()+"')") #menjalankan perintah sql
		results = cursor.fetchall()
		db.commit()
		hasil = True
	except:
		print "Error: unable to fecth data"
	db.close()
	return hasil
	