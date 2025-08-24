import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
import requests
import urllib.parse

API_KEY = "04f653b116954bc9ed0e4931ddede0fc"  # your API key
PORT = 8000

class WeatherHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/weather"):
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            city = params.get("city", [None])[0]

            if not city:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"City parameter missing")
                return

            try:
                url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
                response = requests.get(url)
                response.raise_for_status()
                data = response.json()
                result = {
                    "name": data['name'],
                    "country": data['sys']['country'],
                    "temperature": data['main']['temp'],
                    "condition": data['weather'][0]['main'],
                    "humidity": data['main']['humidity'],
                    "wind_speed": data['wind']['speed']
                }
            except requests.exceptions.HTTPError:
                result = {"error": "City not found"}
            except requests.exceptions.RequestException:
                result = {"error": "Check your internet connection"}

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        else:
            super().do_GET()

if __name__ == "__main__":
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, WeatherHandler)
    print(f"✅ Server running at http://localhost:{PORT}")
    httpd.serve_forever()
