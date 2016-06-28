from flask import render_template, flash, redirect, request, url_for, send_from_directory,session
from app import app
from .forms import Input,Login #import data dari class LoginForms 
from werkzeug import secure_filename
import MySQLdb
import os
import time
from random import randint

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

@app.route('/lihat') #route ke login, dengan method get dan post
def lihat(): #panggil procedure login
	listData = []
	db = MySQLdb.connect("127.0.0.1:30:30","root","","data" )
	cursor = db.cursor()
	try:
		cursor.execute("SELECT * FROM tb_admin") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id = str(row[0])
			nama = row[1]
			gambar = row[2]
			listData.append(
				{
					'id':id,
					'nama':nama,
					'gambar':gambar
				}
			)
	except:
	   print "Error: unable to fecth data"
	db.close()
	return render_template("lihat.html",title='Home',posts=listData)
						   
@app.route('/tambah', methods=['GET', 'POST'])
def tambah():
	optionData = []
	form = Input()
	if form.validate_on_submit():
		#upload folder
		file = request.files['file']
		kategori = str(request.form.get('kategori'))
		jk = str(request.form.get('jk'))
		if file and allowed_file(file.filename):
			uniq = (time.strftime("%d%m%Y%H%M%S")+str(randint(0,10000))) #nama file diambil dari waktu
			filename = secure_filename(file.filename) #nama file lengkap untuk upload
			ekstension = filename.rsplit('.', 1)[1] #extension
			filename = uniq + "." + ekstension #nama file setelah diedit
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		#end upload folder
		db = MySQLdb.connect("127.0.0.1:30","root","","data" )
		cursor = db.cursor()
		try:
			nama = form.nama.data
			cursor.execute("insert into tb_admin(nama,gambar,kategori,jk) values('"+nama+"','"+filename+"','"+kategori+"','"+jk+"')") #menjalankan perintah sql
			results = cursor.fetchall()
			db.commit()
		except:
			print "Error: unable to fecth data"
		db.close()
		return redirect('/lihat')
	optionData = [{'id':'1','nama':'komputer'},{'id':'2','nama':'monitor'}]
	#ambil dari database : table kategori kemudian data nya simpan di list, list nya dikirim
	return render_template('input.html',aksi = 'tambah' ,
                           title='Tambah Data', option=optionData,
                           form=form)
						   
@app.route('/hapus/<id>') #route ke login, dengan method get dan post
def hapus(id): #panggil procedure login
	db = MySQLdb.connect("127.0.0.1:30","root","","data" )
	cursor = db.cursor()
	try:
		cursor.execute("delete from tb_admin where id_admin="+id) #menjalankan perintah sql
		results = cursor.fetchall()
		db.commit()
	except:
	   print "Error: unable to fecth data"
	db.close()
	return redirect('/lihat')

@app.route('/ubah/<id>', methods=['GET', 'POST']) #route ke login, dengan method get dan post
def ubah(id): #panggil procedure login
	form = Input()
	listData = []
	if form.validate_on_submit():
		db = MySQLdb.connect("127.0.0.1:30","root","","data" )
		cursor = db.cursor()
		try:
			nama_update = form.nama.data
			cursor.execute("update tb_admin set nama='"+nama_update+"' where id_admin='"+id+"'") #menjalankan perintah sql
			results = cursor.fetchall()
			db.commit()
		except:
			print "Error: unable to fecth data"
		db.close()
		return redirect('/lihat')
	db = MySQLdb.connect("127.0.0.1:30","root","","data" )
	cursor = db.cursor()
	try:
		cursor.execute("SELECT * FROM tb_admin where id_admin="+id) #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id = str(row[0])
			nama = row[1]
			listData.append(
				{
					'id':id,
					'nama':nama
				}
			)
	except:
	   print "Error: unable to fecth data"
	db.close()
	return render_template('input.html', aksi = 'ubah',
                           title='Ubah Data',id=id,
                           form=form,posts=listData)
			
@app.route('/login', methods=['GET', 'POST'])			   
def login(): #panggil procedure login
	form = Login()
	if form.validate_on_submit():
		username = str(request.form.get('username'))
		password = str(request.form.get('password'))
		db = MySQLdb.connect("127.0.0.1:30","root","","data" )
		cursor = db.cursor()
		try:
			cursor.execute("select * from tb_admin where username='"+username+"' and password='"+password+"'") #menjalankan perintah sql
			results = cursor.fetchall()
			for row in results:
				id_admin = str(row[0])
				nama = row[1]
				gambar = row[2]
				kategori = row[3]
				jk = row[4]
				session['id_admin'] = id_admin
				session['nama'] = nama
				session['gambar'] = gambar
				session['kategori'] = kategori
				session['jk'] = jk
		except:
			print "Error: unable to fecth data"
		db.close()
		return redirect('/lihat')
	return render_template("login.html",title='Login',session=session,form=form)
@app.route('/logout')	
def logout():
	session.clear()
	return redirect('/login')
