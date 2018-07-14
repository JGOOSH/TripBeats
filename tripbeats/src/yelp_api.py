import requests
import json

with open('yelp.json') as f:
    data = json.load(f)
apiKey = data['apiKey']

def get_Businesses(destination) :
    url = "https://api.yelp.com/v3/businesses/search"

    querystring = {
            "latitude": str(destination["latitude"]),
            "longitude": str(destination["longitude"]),
            "categories" : "musicvenues,musicians,jazzandblues,karaoke,bars",
            "sort_by" : "rating"}
    headers = {
        'Authorization': "Bearer sTsOTbcOO0JG2QVT2WNQjhstoKm6atvrg6-3Cfn5vOM9RsCgWf8JaSfC5wemkdGvHmEqbBK_VJbCid4XZrwwcxuMpww4lnK2DsW1uNgBPBgklHxTMO6WgQkcXD1KW3Yx",
        'Cache-Control': "no-cache",
        'Postman-Token': apiKey
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    return response.json()


def get_Event(destination, departure, arrival) :
    url = "https://api.yelp.com/v3/events"

    querystring = {
            "latitude": str(destination["latitude"]),
            "longitude": str(destination["longitude"]),
            "categories" : "music",
            "start_date" : 1531603514,
            "end_date" : 1631603514}
    headers = {
        'Authorization': "Bearer sTsOTbcOO0JG2QVT2WNQjhstoKm6atvrg6-3Cfn5vOM9RsCgWf8JaSfC5wemkdGvHmEqbBK_VJbCid4XZrwwcxuMpww4lnK2DsW1uNgBPBgklHxTMO6WgQkcXD1KW3Yx",
        'Cache-Control': "no-cache",
        'Postman-Token': apiKey
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    return response.json()
