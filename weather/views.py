# weather/views.py
from django.shortcuts import render
from django.http import JsonResponse
from .services import WeatherService

def index(request):
    """
    Landing page for weather app
    """
    return render(request, 'weather/index.html')

def search_locations(request):
    """
    Autocomplete city search
    """
    query = request.GET.get('q', '')
    if len(query) < 2:
        return JsonResponse({'locations': []})
    
    # This is a placeholder implementation
    locations = [
        {'name': 'New York', 'country': 'US'},
        {'name': 'London', 'country': 'UK'},
        {'name': 'Tokyo', 'country': 'JP'}
    ]
    
    filtered_locations = [
        loc for loc in locations 
        if query.lower() in loc['name'].lower()
    ]
    
    return JsonResponse({'locations': filtered_locations})

def get_weather(request):
    """
    Fetch and display weather for a specific location
    """
    city = request.GET.get('city')
    
    if not city:
        return render(request, 'weather/index.html', {
            'error': 'Please enter a city name'
        })
    
    weather_data = WeatherService.get_weather(city)
    
    if not weather_data:
        return render(request, 'weather/index.html', {
            'error': 'Could not fetch weather data for this location'
        })
    
    return render(request, 'weather/results.html', {
        'weather': weather_data
    })