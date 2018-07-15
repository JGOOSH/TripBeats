from flask import Flask, request, Response, jsonify
import json
import requests
import smtplib
import base64
import urllib.parse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_cors import CORS

with open('spotify_token.json') as f:
        token_json = json.load(f)

SPOTIFY_AUTH_TOKEN = base64.b64encode(token_json['token'].encode('utf-8')).decode('ascii')
SPOTIFY_CLIENT_ID = token_json['client']
REDIRECT_URI_FIRST_USER = "http://localhost:5000/callback/firstuser"
REDIRECT_URI_ADD_SONGS = "http://localhost:5000/callback/addsongs/"

def get_playlist(destination):
    response = get_list(destination)
    parsed = json.loads(response)["playlists"]
    target_name = "The Sound of " + destination

    if parsed["tracks"]["total"] > 0:
        for item in parsed["items"]:
            if target_name in item["name"]:
                return item["tracks"]["href"]
        return parsed["items"][0]["tracks"]["href"]

    else:
        return None

def get_auth_token():
    # For Phase 1:
    URL = "https://accounts.spotify.com/api/token"
    DATA = {
        "grant_type": "client_credentials"
    }
    HEADERS = {
        "Authorization": "Basic " + SPOTIFY_AUTH_TOKEN
    }
    response = requests.post(url=URL, data=DATA, headers=HEADERS)
    parsed = json.loads(response.text)
    return parsed["access_token"]

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

def refresh_access_token(refresh_token):
    URL = "https://accounts.spotify.com/api/token"
    DATA = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }
    HEADERS = {
        "Authorization": "Basic " + SPOTIFY_AUTH_TOKEN
    }
    refresh_response = requests.post(url=URL, data=DATA, headers=HEADERS)
    return json.loads(refresh_response.text)["access_token"]

app = Flask(__name__)
CORS(app)

@app.route("/getthething", methods=['POST'])
def get_request():
    body = request.get_json(force=True)
    dest = body['trip']['destination']
    user_token = body['playlist']['token']
    playlist_name = body['playlist']['name']

    URL = "https://api.spotify.com/v1/me"
    HEADERS = { "Authorization" : "Bearer " + user_token }
    user_id = json.loads(requests.get(url=URL, headers=HEADERS).text)['id']

    URL = "https://api.spotify.com/v1/users/{}/playlists".format(user_id)
    HEADERS = { 
        "Authorization" : "Bearer " + user_token,
        "Content-Type" : "application/json"
    }
    PARAMS = {
        "name" : playlist_name
    }
    playlist_info = json.loads(requests.post(url=URL, params=PARAMS, headers=HEADERS).text)
    playlist_id = playlist_info['id']
    playlist_url = playlist_info['external_urls']['spotify']
    
    spotify_playlist_url = get_playlist(dest)
    if spotify_playlist_url is not None:
        HEADERS = { "Authorization" : "Bearer " + user_token }
        PARAMS = { "limit" : "50" }
        res = json.loads(requests.get(url=spotify_playlist_url, params=PARAMS, headers=HEADERS))
        tracks_list = [track['track']['uri'] for track in res['items']]

        URL = "https://api.spotify.com/v1/users/{}/playlists/{}/tracks".format(user_id, playlist_id)
        HEADERS = { 
            "Authorization" : "Bearer " + user_token,
            "Content-Type" : "application/json"
        }
        requests.post(url=URL, headers=HEADERS, json=tracks_list)

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

        body = "Spotify Playlist: {}\n Add your library to the playlist: http://localhost:5000/addsongs/{}\n".format(playlist_url, playlist_id) 
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

@app.route("/firstuser", methods=['GET'])
def get_first_user():
    # If we use personal data:
    URL = "https://accounts.spotify.com/authorize"
    PARAMS = {
        "client_id": SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI_FIRST_USER, # set redirect uri
        "scope": "user-top-read"
    }
    args = "&".join(["{}={}".format(key,urllib.parse.quote(val)) for key,val in PARAMS.items()])
    auth_url = "{}/?{}".format(URL, url_args)
    return redirect(auth_url)
    """ 
    Figure out what response_url object looks like and extract authorization code from it: 
    https://developer.spotify.com/documentation/general/guides/authorization-guide/
    Set that equal to auth_code
    """

@app.route("/callback/firstuser")
def callback_first_user():
    return callback_get_token(REDIRECT_URI_FIRST_USER)

@app.route("/addsongs/<playlist_id>", methods=['POST'])
def add_songs(playlist_id):
    # If we use personal data:
    URL = "https://accounts.spotify.com/authorize"
    PARAMS = {
        "client_id": SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI_ADD_SONGS + playlist_id, # set redirect uri
        "scope": "user-top-read"
    }
    args = "&".join(["{}={}".format(key,urllib.parse.quote(val)) for key,val in PARAMS.items()])
    auth_url = "{}/?{}".format(URL, url_args)
    return redirect(auth_url)

@app.route("/callback/addsongs/<playlist_id>")
def callback_add_songs(playlist_id):
    access_token = callback_get_token(REDIRECT_URI_ADD_SONGS + playlist_id)


def callback_get_token(redirect_uri):
    auth_code = request.args['code']
    post_URL = "https://accounts.spotify.com/api/token"
    DATA = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": redirect_uri # has to match redirect uri from above
    }
    HEADERS = {
        "Authorization": "Basic " + SPOTIFY_AUTH_TOKEN
    }
    auth_response = requests.post(url=post_URL, data=DATA, headers=HEADERS)
    parsed_auth = json.loads(auth_response.text)
    access_token = parsed_auth["access_token"]
    refresh_token = parsed_auth["refresh_token"]
    # Make API calls, get songs from playlists, combine playlists, and if response is error do the following to refresh and get new access token
    if error:
        access_token = refresh_access_token(refresh_token)

    return access_token



if __name__ == "__main__":
	app.run(port=5000)