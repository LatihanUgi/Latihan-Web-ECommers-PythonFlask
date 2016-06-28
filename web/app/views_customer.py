from flask import render_template, flash, redirect, request, url_for, send_from_directory,session
from app import app
from .forms import Input,Login,Register,Cekout1,Cekout2 #import data dari class LoginForms 
from werkzeug import secure_filename
import os
import time
import random
import models_customer,models_login 
from random import randint

@app.route('/')
@app.route('/index')
def index():
	form = Login()
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	return render_template("index.html",form=form,kategori=listKategori,slide=listslide,keranjang=listkeranjang)
	
@app.route('/login', methods=['GET', 'POST'])	
def login(): #panggil procedure login
	form = Login()
	if form.validate_on_submit():
		username = str(request.form.get('username'))
		password = str(request.form.get('password'))
		list = models_login.login(username,password)
		if(list):
			session['id_customer'] = list[0]
			session['nama'] = list[1]
			session['jenis_kelamin'] = list[2]
			session['email'] = list[3]
			session['username'] = list[4]
			session['administrasi'] = random.randint(600,900)
			session['ship'] = ""
			session['metode'] = ""
		return redirect('/index')
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	return render_template("index.html",form=form,kategori=listKategori,slide=listslide,keranjang=listkeranjang)
	
@app.route('/register', methods=['GET', 'POST'])	
def register(): #panggil procedure login
	form = Register()
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	if form.validate_on_submit():
		nama = str(request.form.get('nama'))
		jk = str(request.form.get('jk'))
		email = str(request.form.get('email'))
		hp = str(request.form.get('hp'))
		username = str(request.form.get('username'))
		password = str(request.form.get('password'))
		if(models_login.register(nama,jk,email,hp,username,password)):
			return redirect('/index')
		else:
			return redirect('/register')
	return render_template("register.html",form=form,kategori=listKategori,slide=listslide,keranjang=listkeranjang)
	
@app.route('/logout')	
def logout():
	session.clear()
	return redirect('/login')

@app.route('/kategori/<id>')
def kategori(id):
	form = Login()
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	listProduk = models_customer.get_produk(id)
	return render_template("kategori.html",form=form,kategori=listKategori,slide=listslide,produk=listProduk,keranjang=listkeranjang)
	
@app.route('/cart')
def cart():
	form = Login()
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	listProduk = models_customer.get_produk(id)
	return render_template("cart.html",form=form,kategori=listKategori,slide=listslide,produk=listProduk,keranjang=listkeranjang)

@app.route('/ubahjumlah', methods=['GET', 'POST'])
def ubahjumlah():
	id_customer = str(request.form.get('id_customer'))
	id_produk = str(request.form.get('id_produk'))
	tanggal = str(request.form.get('tanggal'))
	qty = str(request.form.get('qty'))
	models_customer.ubahitem(id_customer,id_produk,tanggal,qty)
	return redirect('/cart')	
	
@app.route('/tambahitem/<id_kategori>/<id_produk>')
def tambahitem(id_kategori,id_produk):
	id_customer = session['id_customer']
	models_customer.tambahitem(id_produk,id_customer)
	return redirect('/kategori/'+id_kategori)
	
@app.route('/hapusitem/<id_customer>/<id_produk>/<tanggal>')
def hapusitem(id_customer,id_produk,tanggal):
	models_customer.hapusitem(id_customer,id_produk,tanggal)
	return redirect('/cart')
	
@app.route('/cekout1')
def cekout1():
	form = Cekout1()
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	listProduk = models_customer.get_produk(id)
	return render_template("cekout1.html",form=form,kategori=listKategori,slide=listslide,produk=listProduk,keranjang=listkeranjang)

@app.route('/cekout2', methods=['GET', 'POST'])
def cekout2():
	form = Cekout1()
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	listProduk = models_customer.get_produk(id)
	listship = models_customer.get_ship()
	listmetode = models_customer.get_metode()
	if form.validate_on_submit():
		name_billing = str(request.form.get('name_billing'))
		address_billing = str(request.form.get('address_billing'))
		telephone_billing = str(request.form.get('telephone_billing'))
		shipping_name = str(request.form.get('shipping_name'))
		shipping_address = str(request.form.get('shipping_address'))
		telephone_address = str(request.form.get('telephone_address'))
		ship ={	'name_billing':name_billing,
				'address_billing':address_billing,
				'telephone_billing':telephone_billing,
				'shipping_name':shipping_name,
				'shipping_address':shipping_address,
				'telephone_address':telephone_address	
			}
		session['ship'] = ship
	return render_template("cekout2.html",form=form,kategori=listKategori,slide=listslide,produk=listProduk,keranjang=listkeranjang,ship=listship,metode=listmetode)
	
@app.route('/cekout3', methods=['GET', 'POST'])
def cekout3():
	form = Cekout2()
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	listProduk = models_customer.get_produk(id)
	if form.validate_on_submit():
		id_metode = str(request.form.get('id_metode'))
		id_ship = str(request.form.get('id_ship'))
		metode = {	
			'id_metode':id_metode,
			'id_ship':id_ship
		}
		session['metode'] = metode
		
	return render_template("cekout3.html",form=form,kategori=listKategori,slide=listslide,produk=listProduk,keranjang=listkeranjang)	
	
@app.route('/cekout4', methods=['GET', 'POST'])
def cekout4():
	form = Cekout2()
	if form.validate_on_submit():
		a = session['id_customer']
		b = str(request.form.get('a'))
		c = str(request.form.get('b'))
		d = str(request.form.get('c'))
		e = str(request.form.get('d'))
		f = str(request.form.get('e'))
		g = str(request.form.get('f'))
		h = str(request.form.get('g'))
		i = str(request.form.get('h'))
		j = str(request.form.get('message'))
		k = (time.strftime("%d%m%Y%H%M%S")+str(randint(0,10000)))
		models_customer.tambah_cekout(a,b,c,d,e,f,g,h,i,j,k)
		try:
			id_customer = session['id_customer']
			listkeranjang = models_customer.get_keranjang(id_customer)
		except:
			listkeranjang = ""
		listKategori = models_customer.get_kategori()
		listslide = models_customer.get_slide()
		listProduk = models_customer.get_produk(id)
		#return(a+b+c+d+e+f+g+h+i+j+k)
		return render_template("cekout4.html",kategori=listKategori,slide=listslide,produk=listProduk,keranjang=listkeranjang)	
@app.route('/riwayat')
def riwayat():
	try:
		id_customer = session['id_customer']
		listkeranjang = models_customer.get_keranjang(id_customer)
		riwayat = models_customer.get_riwayat(id_customer)
	except:
		listkeranjang = ""
	listKategori = models_customer.get_kategori()
	listslide = models_customer.get_slide()
	listProduk = models_customer.get_produk(id)
	return render_template("riwayat.html",kategori=listKategori,slide=listslide,produk=listProduk,keranjang=listkeranjang,riwayat=riwayat)
