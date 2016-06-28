from flask.ext.wtf import Form #library wtf -> ambil Form
from wtforms import StringField, BooleanField, HiddenField,FileField,SelectField   #stringfield untuk input string, booleanfield untuk input boolean
from wtforms.validators import DataRequired #ini validator, untuk menjalankan validasi tiap data yg di submit

class Input(Form): #class SignUp untuk signup
	nama = StringField('Nama', validators = [DataRequired()])
	file = FileField()
class Login(Form): #class SignUp untuk signup
	username = StringField('Username', validators = [DataRequired()])
class Register(Form): #class SignUp untuk signup
	username = StringField('Username', validators = [DataRequired()])
class Cekout1(Form): #class SignUp untuk signup
	nama_billing = StringField('Nama')
class Cekout2(Form): #class SignUp untuk signup
	username = StringField('Username')
class Cekout3(Form): #class SignUp untuk signup
	username = StringField('Username')