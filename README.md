# Django Weather App with Neumorphic Design

## Features
- Modern Brutal Morphic UI design
- Real-time weather data fetching
- City search with autocomplete
- Responsive design
- Detailed weather information

## Prerequisites
- Python 3.9+
- Django 4.2+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sudoevans/weather-app-plp.git
cd weather-app-plp
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

5. Add your OpenWeatherMap API key to the `.env` file
   - Sign up at https://openweathermap.org/api
   - Replace `your_openweathermap_api_key_here` with your actual API key

6. Run migrations:
```bash
python manage.py migrate
```

7. Collect static files:
```bash
python manage.py collectstatic
```
_Note: If you dont do this, scss won't compile
_

8. Run the development server:
```bash
python manage.py runserver
```

## Deployment Considerations
- Use a production-ready database (PostgreSQL recommended)
- Set `DEBUG=False` in production
- Use a proper secret key
- Configure static file hosting

## Technologies Used
- Django
- OpenWeatherMap API
- SCSS
- Brutal Morphic Design Principles
- JavaScript (ES6+)

## Contributing-I will putyour name on this readme
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
