from flask import Flask
from flask import request
import json
import requests
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

app = Flask(__name__)

@app.route("/getthething", methods=['POST'])
def get_request():
	body = request.get_json()

	dest = body['dest']

	fromaddr = 'no-reply@tripbeats.com'

	msg = MIMEMultipart()
	msg['From'] = fromaddr
	msg['To'] = body['email']
	msg['Subject'] = 'Your Trip to ' + dest

	body = "YOUR MESSAGE HERE"
	msg.attach(MIMEText(body, 'plain'))
	 
	server = smtplib.SMTP('smtp.gmail.com', 587)
	server.starttls()

	with open('email_login.json') as f:
	    data = json.load(f)

	server.login(data['id'], data['passwd'])
	text = msg.as_string()
	server.sendmail(fromaddr, body['email'], text)
	server.quit()

