# weather/urls.py
from django.urls import  path
from . import views
 

urlpatterns = [
    path('', views.index, name='index'),
    path('search/', views.search_locations, name='search_locations'),
    path('weather/', views.get_weather, name='get_weather'),
    
]