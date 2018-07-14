from flask import Flask, request, Response, jsonify
import json
import requests
import smtplib
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_cors import CORS

def get_list(destination):

    URL = "https://api.spotify.com/v1/search"

    PARAMS = {

        "q": "The Sound of " + destination,

        "type": "playlist"

    }

    HEADERS = {

        "Accept": "application/json",

        "Content-Type": "application/json",

        "Authorization": "Bearer " + get_auth_token()

    }

    return requests.get(url=URL, params=PARAMS, headers=HEADERS).content

def get_playlist(destination):

    response = get_list(destination)

    parsed = json.loads(response)["playlists"]

    target_name = "The Sound of " + destination

    if parsed["total"] > 0:

        for item in parsed["items"]:

            if target_name in item["name"]:

                return item["external_urls"]["spotify"]

        return parsed["items"][0]["external_urls"]["spotify"]

    else:

        return "No playlists found"

def get_auth_token():

    # For Phase 1:

    URL = "https://accounts.spotify.com/api/token"

    DATA = {

        "grant_type": "client_credentials"

    }

    HEADERS = {

        "Authorization": "Basic " + base64.b64encode("7a0ec994dec14b5aae6b994e6728d8ed:245e48245ec34e099e3da331465bc753".encode('utf-8')).decode("ascii")

    }

    response = requests.post(url=URL, data=DATA, headers=HEADERS)

    parsed = json.loads(response.text)

    return parsed["access_token"]

app = Flask(__name__)
CORS(app)

@app.route("/getthething", methods=['POST'])
def get_request():
	body = request.get_json(force=True)

	dest = body['trip']['destination']

	fromaddr = 'no-reply@tripbeats.com'

	server = smtplib.SMTP_SSL('smtp.gmail.com', 465)

	with open('email_login.json') as f:
	    data = json.load(f)

	server.login(data['id'], data['passwd'])
    
	spotify_playlist = get_playlist(dest)
    
	for person in body['people']:
		msg = MIMEMultipart()
		msg['From'] = fromaddr
		msg['To'] = person['email']
		msg['Subject'] = 'Your Trip to ' + dest

		body = "Spotify: " + spotify_playlist
		msg.attach(MIMEText(body, 'plain'))
		text = msg.as_string()
		server.sendmail(fromaddr, person['email'], text)

	server.quit()

	data = {
		'spotify' : spotify_playlist
	}

	resp = jsonify(data)
	resp.status_code = 200

	return resp
