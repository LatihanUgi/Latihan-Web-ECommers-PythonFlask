import MySQLdb

def get_kategori():
	listKategori = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select A.*,count(B.nama) as jumlah from kategori A,produk B where A.id_kategori = B.id_kategori  \
			group by A.nama") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_kategori = str(row[0])
			nama = row[1]
			deskripsi = row[2]
			jumlah = row[3]
			listKategori.append(
				{
					'id_kategori':id_kategori,
					'nama':nama,
					'deskripsi':deskripsi,
					'jumlah':jumlah
				}
			)
	except:
		print "Error: unable to fecth data"
	db.close()
	return listKategori
	
def get_slide():
	listSlide = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select * from slide where status=1") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_slide = str(row[0])
			nama = row[1]
			deskripsi = row[2]
			gambar = row[3]
			status = row[4]
			kode = row[5]
			listSlide.append(
				{
					'id_slide':id_slide,
					'nama':nama,
					'deskripsi':deskripsi,
					'gambar':gambar,
					'status':status,
					'kode':kode
				}
			)
	except:
		print "Error: unable to fecth data"
	db.close()
	return listSlide
	
def get_produk(id):
	listProduk = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select A.*,B.nama as kategori from produk A, kategori B where A.id_kategori= "
			+id+" AND A.id_kategori = B.id_kategori") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_produk = str(row[0])
			nama = row[1]
			deskripsi_singkat = row[2]
			harga = row[3]
			harga_coret = row[4]
			deskripsi_lengkap = row[5]
			status = row[6]
			stok = row[7]
			rate = row[8]
			id_kategori = row[9]
			gambar = row[10]
			nama_kategori = row[11]
			listProduk.append(
				{
					'id_produk':id_produk,
					'nama':nama,
					'deskripsi_singkat':deskripsi_singkat,
					'harga':harga,
					'harga_coret':harga_coret,
					'deskripsi_lengkap':deskripsi_lengkap,
					'status':status,
					'stok':stok,
					'rate':rate,
					'id_kategori':id_kategori,
					'gambar':gambar,
					'nama_kategori':nama_kategori
				}
			)
	except:
		print "Error: unable to fecth data"
	db.close()
	return listProduk
		
def get_keranjang(id_customer):
	listKeranjang = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select A.id_customer,A.id_produk,A.tanggal,A.qty,B.nama,B.harga,B.gambar,B.deskripsi_singkat from pembelian A,produk B \
			where A.id_produk = B.id_produk AND A.id_customer= "+id_customer + " AND A.status=1") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_customer = str(row[0])
			id_produk = str(row[1])
			tanggal = str(row[2])
			qty = row[3]
			nama = row[4]
			harga = row[5]
			gambar = row[6]
			deskripsi_singkat = row[7]
			listKeranjang.append(
				{
					'id_customer':id_customer,
					'id_produk':id_produk,
					'tanggal':tanggal,
					'qty':qty,
					'nama':nama,
					'harga':harga,
					'gambar':gambar,
					'deskripsi_singkat':deskripsi_singkat
				}
			)
	except:
		print "Error: unable to fecth data"
	db.close()
	return listKeranjang
	
def get_metode():
	listmetode = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select * from metode") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_metode = str(row[0])
			nama = row[1]
			deskripsi = row[2]
			logo = row[3]
			listmetode.append(
				{
					'id_metode':id_metode,
					'nama':nama,
					'deskripsi':deskripsi,
					'logo':logo
				}
			)
	except:
		print "Error: unable to fecth data"
	db.close()
	return listmetode	
def get_ship():
	listship = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select * from ship") #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_ship = str(row[0])
			nama = row[1]
			deskripsi = row[2]
			gambar = row[3]
			listship.append(
				{
					'id_ship':id_ship,
					'nama':nama,
					'deskripsi':deskripsi,
					'gambar':gambar
				}
			)
	except:
		print "Error: unable to fecth data"
	db.close()
	return listship	

def get_riwayat(id):
	listship = []
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("select * from cekout where id_customer="+id) #menjalankan perintah sql
		results = cursor.fetchall()
		for row in results:
			id_cekout = str(row[0])
			metode = row[2]
			ship = row[3]
			nama_ship = row[4]
			alamat_ship = row[5]
			telephone_ship = row[6]
			tanggal = row[7]
			status = row[8]
			listship.append(
				{
					'id_cekout':id_cekout,
					'metode':metode,
					'ship':ship,
					'nama_ship':nama_ship,
					'alamat_ship':alamat_ship,
					'telephone_ship':telephone_ship,
					'tanggal':tanggal,
					'status':status
				}
			)
	except:
		print "Error: unable to fecth data"
	db.close()
	return listship	
def tambahitem(id_produk,id_customer):
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("insert into pembelian(id_customer,id_produk) values('"+id_customer+"','"+id_produk+"')")
		db.commit()
	except:
		print "Error: unable to fecth data"
	db.close()

def tambah_cekout(a,b,c,d,e,f,g,h,i,j,k):
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("insert into cekout(id_cekout,id_customer,metode,ship,nama_ship,alamat_ship,telephone_ship, nama_bill,alamat_bill,telephone_bill,keterangan) values('"+k+"','"+a+"','"+b+"','"+c+"','"+d+"','"+e+"','"+f+"','"+g+"','"+h+"','"+i+"','"+j+"')")
		db.commit()
	except:
		print "Error: unable to fecth data"
	db.close()
	
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("update pembelian set id_cekout= "+k+",status=2 where status=1 AND id_customer="+a)
		db.commit()
	except:
		print "Error: unable to fecth data"
	db.close()
def ubahitem(id_customer,id_produk,tanggal,qty):
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("update pembelian set qty='"+qty+"' where id_customer='"+id_customer+"' AND id_produk='"+id_produk+
			"' AND tanggal='"+tanggal+"'")
		db.commit()
	except:
		print "Error: unable to fecth data"
	db.close()
	
def hapusitem(id_customer, id_produk, tanggal):
	db = MySQLdb.connect("127.0.0.1:30","root","","e-commerce" )
	cursor = db.cursor()
	try:
		cursor.execute("delete from pembelian where id_customer='"+id_customer+"' AND id_produk='"+id_produk+
			"' AND tanggal='"+tanggal+"'")
		db.commit()
	except:
		print "Error: unable to fecth data"
	db.close()