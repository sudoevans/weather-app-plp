import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class WeatherService:
    BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
    GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct"
    
    @classmethod
    def get_coordinates(cls, city_name):
        """
        Get coordinates for a given city name
        """
        params = {
            'q': city_name,
            'limit': 5,
            'appid': settings.OPENWEATHERMAP_API_KEY
        }
        
        try:
            response = requests.get(cls.GEOCODING_URL, params=params)
            response.raise_for_status()
            locations = response.json()
            
            if not locations:
                return None
            
            # Return the first match
            first_location = locations[0]
            return {
                'lat': first_location['lat'],
                'lon': first_location['lon'],
                'name': first_location['name'],
                'country': first_location.get('country', '')
            }
        except requests.RequestException as e:
            logger.error(f"Geocoding API error: {e}")
            return None
    
    @classmethod
    def get_weather(cls, city_name=None, lat=None, lon=None):
        """
        Fetch weather data for a city or coordinates
        """
        # If city name is provided, first get coordinates
        if city_name:
            coord_data = cls.get_coordinates(city_name)
            if not coord_data:
                return None
            lat, lon = coord_data['lat'], coord_data['lon']
        
        # Prepare weather API request
        params = {
            'lat': lat,
            'lon': lon,
            'appid': settings.OPENWEATHERMAP_API_KEY,
            'units': 'metric'  # Use metric units
        }
        
        try:
            response = requests.get(cls.BASE_URL, params=params)
            response.raise_for_status()
            weather_data = response.json()
            
            # Extract and transform relevant data
            return {
                'city': weather_data['name'],
                'country': weather_data['sys']['country'],
                'temperature': round(weather_data['main']['temp'], 1),
                'feels_like': round(weather_data['main']['feels_like'], 1),
                'description': weather_data['weather'][0]['description'],
                'icon': weather_data['weather'][0]['icon'],
                'humidity': weather_data['main']['humidity'],
                'wind_speed': round(weather_data['wind']['speed'], 1),
                'pressure': weather_data['main']['pressure']
            }
        except requests.RequestException as e:
            logger.error(f"Weather API error: {e}")
            return None