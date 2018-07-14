from flask import Flask
from flask import request
import json
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)

@app.route("/getthething", methods=['POST'])
def get_request():
	body = request.get_json(force=True)

	print(body)

	dest = body['trip']['destination']

	fromaddr = 'no-reply@tripbeats.com'

	server = smtplib.SMTP_SSL('smtp.gmail.com', 465)

	with open('email_login.json') as f:
	    data = json.load(f)

	server.login(data['id'], data['passwd'])
	
	for person in body['people']:
		msg = MIMEMultipart()
		msg['From'] = fromaddr
		msg['To'] = person['email']
		msg['Subject'] = 'Your Trip to ' + dest

		body = "YOUR MESSAGE HERE"
		msg.attach(MIMEText(body, 'plain'))
		text = msg.as_string()
		server.sendmail(fromaddr, person['email'], text)

	server.quit()

	return "LINK_TO_SPOTIFY_PLAYLIST"
