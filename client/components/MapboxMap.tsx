import { useEffect, useRef } from "react";

interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface MapboxMapProps {
  pickup: Location | null;
  dropoff: Location | null;
  width?: string;
  height?: string;
  className?: string;
}

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2lyam9la3VyaWEiLCJhIjoiY21laGxzZnI0MDBjZzJqcXczc2NtdHZqZCJ9.FhRc9jUcHnkTPuauJrP-Qw";

export default function MapboxMap({
  pickup,
  dropoff,
  width = "100%",
  height = "300px",
  className = "",
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const pickupMarker = useRef<any>(null);
  const dropoffMarker = useRef<any>(null);
  const routeLayer = useRef<any>(null);

  useEffect(() => {
    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      if (typeof window === "undefined") return;

      // Check if mapboxgl is already loaded
      if (window.mapboxgl) {
        initializeMap(window.mapboxgl);
        return;
      }

      // Load Mapbox GL JS and CSS
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
      script.onload = () => {
        if (window.mapboxgl) {
          initializeMap(window.mapboxgl);
        }
      };
      document.head.appendChild(script);

      const link = document.createElement("link");
      link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    };

    const initializeMap = (mapboxgl: any) => {
      if (!mapContainer.current || map.current) return;

      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [36.8219, -1.2921], // Nairobi center
        zoom: 12,
        attributionControl: false,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add attribution control at bottom-left
      map.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true,
        }),
        "bottom-left",
      );
    };

    loadMapbox();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !window.mapboxgl) return;

    const mapboxgl = window.mapboxgl;

    // Clear existing markers
    if (pickupMarker.current) {
      pickupMarker.current.remove();
      pickupMarker.current = null;
    }
    if (dropoffMarker.current) {
      dropoffMarker.current.remove();
      dropoffMarker.current = null;
    }

    const markers: any[] = [];
    const bounds = new mapboxgl.LngLatBounds();

    // Add pickup marker
    if (pickup) {
      const pickupEl = document.createElement("div");
      pickupEl.className = "pickup-marker";
      pickupEl.innerHTML = `
        <div style="
          background: #10b981;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          border: 3px solid white;
        ">📍</div>
      `;

      pickupMarker.current = new mapboxgl.Marker(pickupEl)
        .setLngLat([pickup.lng, pickup.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #10b981; font-weight: bold;">Pickup Location</h3>
              <p style="margin: 0; font-size: 14px;"><strong>${pickup.name}</strong></p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${pickup.address}</p>
            </div>
          `),
        )
        .addTo(map.current);

      bounds.extend([pickup.lng, pickup.lat]);
      markers.push(pickupMarker.current);
    }

    // Add dropoff marker
    if (dropoff) {
      const dropoffEl = document.createElement("div");
      dropoffEl.className = "dropoff-marker";
      dropoffEl.innerHTML = `
        <div style="
          background: #3b82f6;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          border: 3px solid white;
        ">🎯</div>
      `;

      dropoffMarker.current = new mapboxgl.Marker(dropoffEl)
        .setLngLat([dropoff.lng, dropoff.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #3b82f6; font-weight: bold;">Dropoff Location</h3>
              <p style="margin: 0; font-size: 14px;"><strong>${dropoff.name}</strong></p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${dropoff.address}</p>
            </div>
          `),
        )
        .addTo(map.current);

      bounds.extend([dropoff.lng, dropoff.lat]);
      markers.push(dropoffMarker.current);
    }

    // Fit map to show both markers
    if (markers.length > 0) {
      if (markers.length === 1) {
        // If only one marker, center on it
        const location = pickup || dropoff;
        if (location) {
          map.current.flyTo({
            center: [location.lng, location.lat],
            zoom: 14,
            duration: 1000,
          });
        }
      } else {
        // If both markers, fit bounds with padding
        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
      }
    }

    // Draw route if both locations exist
    if (pickup && dropoff) {
      drawRoute(pickup, dropoff);
    } else {
      // Remove existing route
      if (routeLayer.current && map.current.getLayer("route")) {
        map.current.removeLayer("route");
        map.current.removeSource("route");
        routeLayer.current = null;
      }
    }
  }, [pickup, dropoff]);

  const drawRoute = async (pickup: Location, dropoff: Location) => {
    if (!map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?` +
          `access_token=${MAPBOX_ACCESS_TOKEN}&` +
          `geometries=geojson&` +
          `overview=full`,
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        // Remove existing route layer
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route");
          map.current.removeSource("route");
        }

        // Add route source and layer
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#f59e0b",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });

        routeLayer.current = true;
      }
    } catch (error) {
      console.error("Error drawing route:", error);
    }
  };

  return (
    <div className={`mapbox-map ${className}`} style={{ width, height }}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />

      {/* Legend */}
      {(pickup || dropoff) && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          {pickup && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: dropoff ? "4px" : "0",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#10b981",
                  marginRight: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                }}
              >
                📍
              </div>
              <span>Pickup</span>
            </div>
          )}
          {dropoff && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  marginRight: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                }}
              >
                🎯
              </div>
              <span>Dropoff</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Extend window type for mapboxgl
declare global {
  interface Window {
    mapboxgl: any;
  }
}
