// static/js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const citySearch = document.getElementById('city-search');
    const searchBtn = document.getElementById('search-btn');
    const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');

    // External API for city suggestions
    const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

    // Debounce function to limit API calls
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // Fetch city suggestions
    async function fetchCitySuggestions(query) {
        if (query.length < 2) {
            return [];
        }

        try {
            const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Map results to a consistent format
            return data.results ? data.results.map(result => ({
                name: result.name,
                country: result.country,
                latitude: result.latitude,
                longitude: result.longitude
            })) : [];
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return [];
        }
    }

    // Render autocomplete suggestions
    function renderSuggestions(suggestions) {
        // Clear previous suggestions
        autocompleteSuggestions.innerHTML = '';

        // If no suggestions, hide the container
        if (suggestions.length === 0) {
            autocompleteSuggestions.style.display = 'none';
            return;
        }

        // Show suggestions container
        autocompleteSuggestions.style.display = 'block';

        // Create suggestion items
        suggestions.forEach(location => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.innerHTML = `
                <strong>${location.name}</strong>, ${location.country}
            `;
            
            // Add click event to select the suggestion
            suggestionItem.addEventListener('click', () => {
                citySearch.value = `${location.name}, ${location.country}`;
                autocompleteSuggestions.style.display = 'none';
                
                // Optional: Store additional data for weather search
                citySearch.dataset.latitude = location.latitude;
                citySearch.dataset.longitude = location.longitude;
            });

            autocompleteSuggestions.appendChild(suggestionItem);
        });
    }

    // Autocomplete functionality with debounce
    const performAutocomplete = debounce(async (query) => {
        if (query.length < 2) {
            autocompleteSuggestions.style.display = 'none';
            return;
        }

        try {
            const suggestions = await fetchCitySuggestions(query);
            renderSuggestions(suggestions);
        } catch (error) {
            console.error('Autocomplete error:', error);
            autocompleteSuggestions.style.display = 'none';
        }
    }, 300);

    // Event listeners
    citySearch.addEventListener('input', (e) => {
        performAutocomplete(e.target.value);
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!autocompleteSuggestions.contains(e.target) && e.target !== citySearch) {
            autocompleteSuggestions.style.display = 'none';
        }
    });

    // Search button functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch();
        });
    }

    // Search on Enter key
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Perform search
    function performSearch() {
        const city = citySearch.value.trim();
        
        if (city) {
            // Check if a specific location was selected
            const latitude = citySearch.dataset.latitude;
            const longitude = citySearch.dataset.longitude;

            // Construct search URL
            let searchUrl = `/weather/?city=${encodeURIComponent(city)}`;
            
            // Add coordinates if available
            if (latitude && longitude) {
                searchUrl += `&lat=${latitude}&lon=${longitude}`;
            }

            // Navigate to weather results
            window.location.href = searchUrl;
        }
    }
});