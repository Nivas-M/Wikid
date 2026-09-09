import requests

title = "James_Webb_Space_Telescope"
url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
headers = {"User-Agent": "Wikid/1.0 (nivasm7958@gmail.com)"}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()

    title = data.get("title")
    short_desc = data.get("description", "No short description")
    intro_extract = data.get("extract", "No summary available")
    thumbnail_url = data.get("thumbnail", {}).get("source")
    full_image_url = data.get("originalimage", {}).get("source")

    print(f"Title: {title}")
    print(f"Short Tagline: {short_desc}")
    print(f"Intro Paragraph:\n{intro_extract}")
    print(f"Thumbnail: {thumbnail_url}")
    print(f"Full Image: {full_image_url}")
else:
    print(f"Error: {response.status_code}")
