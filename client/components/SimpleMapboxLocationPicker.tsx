import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Search, X, ArrowDown } from 'lucide-react';

interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onLocationSelect: (pickup: Location, dropoff: Location) => void;
  onDistanceCalculated?: (distance: number, duration: number) => void;
}

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
  text: string;
}

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoic2lyam9la3VyaWEiLCJhIjoiY21laGxzZnI0MDBjZzJqcXczc2NtdHZqZCJ9.FhRc9jUcHnkTPuauJrP-Qw';

export default function SimpleMapboxLocationPicker({ onLocationSelect, onDistanceCalculated }: LocationPickerProps) {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [pickupQuery, setPickupQuery] = useState('');
  const [dropoffQuery, setDropoffQuery] = useState('');
  const [pickupResults, setPickupResults] = useState<SearchResult[]>([]);
  const [dropoffResults, setDropoffResults] = useState<SearchResult[]>([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDropoff, setIsSearchingDropoff] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [showPickupResults, setShowPickupResults] = useState(false);
  const [showDropoffResults, setShowDropoffResults] = useState(false);

  const pickupTimeoutRef = useRef<NodeJS.Timeout>();
  const dropoffTimeoutRef = useRef<NodeJS.Timeout>();

  // Geocoding search function
  const searchLocation = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim() || query.length < 3) return [];
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${MAPBOX_ACCESS_TOKEN}&` +
        `country=KE&` +
        `proximity=36.8219,-1.2921&` + // Bias towards Nairobi
        `types=place,locality,neighborhood,address,poi&` +
        `limit=5`
      );
      
      if (!response.ok) throw new Error('Geocoding request failed');
      
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  };

  // Debounced search for pickup location
  useEffect(() => {
    if (pickupTimeoutRef.current) {
      clearTimeout(pickupTimeoutRef.current);
    }

    if (pickupQuery.length >= 3) {
      setIsSearchingPickup(true);
      setShowPickupResults(true);
      
      pickupTimeoutRef.current = setTimeout(async () => {
        const results = await searchLocation(pickupQuery);
        setPickupResults(results);
        setIsSearchingPickup(false);
      }, 300);
    } else {
      setPickupResults([]);
      setShowPickupResults(false);
      setIsSearchingPickup(false);
    }

    return () => {
      if (pickupTimeoutRef.current) {
        clearTimeout(pickupTimeoutRef.current);
      }
    };
  }, [pickupQuery]);

  // Debounced search for dropoff location
  useEffect(() => {
    if (dropoffTimeoutRef.current) {
      clearTimeout(dropoffTimeoutRef.current);
    }

    if (dropoffQuery.length >= 3) {
      setIsSearchingDropoff(true);
      setShowDropoffResults(true);
      
      dropoffTimeoutRef.current = setTimeout(async () => {
        const results = await searchLocation(dropoffQuery);
        setDropoffResults(results);
        setIsSearchingDropoff(false);
      }, 300);
    } else {
      setDropoffResults([]);
      setShowDropoffResults(false);
      setIsSearchingDropoff(false);
    }

    return () => {
      if (dropoffTimeoutRef.current) {
        clearTimeout(dropoffTimeoutRef.current);
      }
    };
  }, [dropoffQuery]);

  // Calculate distance and duration using Mapbox Directions API
  const calculateRoute = useCallback(async (pickup: Location, dropoff: Location) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?` +
        `access_token=${MAPBOX_ACCESS_TOKEN}&` +
        `geometries=geojson&` +
        `overview=simplified`
      );
      
      if (!response.ok) throw new Error('Directions request failed');
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceInKm = route.distance / 1000; // Convert meters to kilometers
        const durationInMinutes = route.duration / 60; // Convert seconds to minutes
        
        setDistance(distanceInKm);
        setDuration(durationInMinutes);
        
        if (onDistanceCalculated) {
          onDistanceCalculated(distanceInKm, durationInMinutes);
        }
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      // Fallback to straight-line distance
      const straightLineDistance = calculateStraightLineDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
      const estimatedDuration = (straightLineDistance / 25) * 60; // Assume 25 km/h average speed
      
      setDistance(straightLineDistance);
      setDuration(estimatedDuration);
      
      if (onDistanceCalculated) {
        onDistanceCalculated(straightLineDistance, estimatedDuration);
      }
    }
  }, [onDistanceCalculated]);

  // Fallback straight-line distance calculation
  const calculateStraightLineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle location selection
  const selectPickupLocation = (result: SearchResult) => {
    const location: Location = {
      name: result.text,
      address: result.place_name,
      lat: result.center[1],
      lng: result.center[0]
    };
    
    setPickupLocation(location);
    setPickupQuery(result.place_name);
    setShowPickupResults(false);
  };

  const selectDropoffLocation = (result: SearchResult) => {
    const location: Location = {
      name: result.text,
      address: result.place_name,
      lat: result.center[1],
      lng: result.center[0]
    };
    
    setDropoffLocation(location);
    setDropoffQuery(result.place_name);
    setShowDropoffResults(false);
  };

  // Get user's current location
  const getCurrentLocation = (isPickup: boolean) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
              `access_token=${MAPBOX_ACCESS_TOKEN}&` +
              `types=address,poi`
            );
            
            const data = await response.json();
            const place = data.features?.[0];
            
            const location: Location = {
              name: place ? place.text : 'Current Location',
              address: place ? place.place_name : `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              lat,
              lng
            };
            
            if (isPickup) {
              setPickupLocation(location);
              setPickupQuery(location.address);
            } else {
              setDropoffLocation(location);
              setDropoffQuery(location.address);
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            const location: Location = {
              name: 'Current Location',
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              lat,
              lng
            };
            
            if (isPickup) {
              setPickupLocation(location);
              setPickupQuery(location.address);
            } else {
              setDropoffLocation(location);
              setDropoffQuery(location.address);
            }
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your current location. Please select manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Clear location
  const clearPickupLocation = () => {
    setPickupLocation(null);
    setPickupQuery('');
    setShowPickupResults(false);
  };

  const clearDropoffLocation = () => {
    setDropoffLocation(null);
    setDropoffQuery('');
    setShowDropoffResults(false);
  };

  // Calculate route when both locations are selected
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      calculateRoute(pickupLocation, dropoffLocation);
      onLocationSelect(pickupLocation, dropoffLocation);
    }
  }, [pickupLocation, dropoffLocation, calculateRoute, onLocationSelect]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-rocs-green" />
        Select Pickup & Drop-off Locations
      </h3>

      {/* Vertical Layout for Location Inputs */}
      <div className="space-y-6 mb-6">
        {/* Pickup Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location *
          </label>
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={pickupQuery}
                onChange={(e) => setPickupQuery(e.target.value)}
                onFocus={() => pickupQuery.length >= 3 && setShowPickupResults(true)}
                onBlur={() => setTimeout(() => setShowPickupResults(false), 200)}
                placeholder="Type pickup location..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-rocs-green focus:border-transparent text-sm"
              />
              {pickupQuery && (
                <button
                  onClick={clearPickupLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => getCurrentLocation(true)}
              className="px-4 py-3 bg-rocs-yellow text-gray-800 rounded-r-lg hover:bg-rocs-yellow/90 transition-colors flex items-center text-sm"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Current
            </button>
          </div>
          
          {/* Pickup Search Results */}
          {showPickupResults && (pickupResults.length > 0 || isSearchingPickup) && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearchingPickup ? (
                <div className="p-3 text-center text-gray-500">Searching...</div>
              ) : (
                pickupResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => selectPickupLocation(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-800 text-sm">{result.text}</div>
                    <div className="text-xs text-gray-600">{result.place_name}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-rocs-green/10 rounded-full flex items-center justify-center">
            <ArrowDown className="w-4 h-4 text-rocs-green" />
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drop-off Location *
          </label>
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={dropoffQuery}
                onChange={(e) => setDropoffQuery(e.target.value)}
                onFocus={() => dropoffQuery.length >= 3 && setShowDropoffResults(true)}
                onBlur={() => setTimeout(() => setShowDropoffResults(false), 200)}
                placeholder="Type drop-off location..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-rocs-green focus:border-transparent text-sm"
              />
              {dropoffQuery && (
                <button
                  onClick={clearDropoffLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => getCurrentLocation(false)}
              className="px-4 py-3 bg-rocs-yellow text-gray-800 rounded-r-lg hover:bg-rocs-yellow/90 transition-colors flex items-center text-sm"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Current
            </button>
          </div>
          
          {/* Dropoff Search Results */}
          {showDropoffResults && (dropoffResults.length > 0 || isSearchingDropoff) && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearchingDropoff ? (
                <div className="p-3 text-center text-gray-500">Searching...</div>
              ) : (
                dropoffResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => selectDropoffLocation(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-800 text-sm">{result.text}</div>
                    <div className="text-xs text-gray-600">{result.place_name}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Locations Summary */}
      {(pickupLocation || dropoffLocation) && (
        <div className="space-y-3 mb-6">
          {pickupLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-800 text-sm">Pickup: {pickupLocation.name}</div>
                  <div className="text-xs text-green-600">{pickupLocation.address}</div>
                </div>
                <button
                  onClick={clearPickupLocation}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {dropoffLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-blue-800 text-sm">Drop-off: {dropoffLocation.name}</div>
                  <div className="text-xs text-blue-600">{dropoffLocation.address}</div>
                </div>
                <button
                  onClick={clearDropoffLocation}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Distance and Time Display */}
      {distance && duration && (
        <div className="bg-rocs-green/10 border border-rocs-green/20 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-rocs-green">
                {distance.toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600">Distance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rocs-green">
                {Math.round(duration)} min
              </div>
              <div className="text-sm text-gray-600">Est. Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <div className="font-medium">Map will appear here</div>
          <div className="text-sm">Showing {pickupLocation && dropoffLocation ? 'pickup and delivery' : 'selected'} locations</div>
          {pickupLocation && dropoffLocation && (
            <div className="text-xs mt-2 text-rocs-green">
              Route: {pickupLocation.name} → {dropoffLocation.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
