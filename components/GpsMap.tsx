/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import LatLngTuple from 'leaflet';
import { Vehicle } from "@/types/types";

interface i_gpsData {
  vehicle: Vehicle,
  color: string,
  positions: number[][],
}

interface MapProps {
  gpsData: i_gpsData[]
}
export default function Map({ gpsData }: MapProps) {
  const center: [number, number] = [35.6895, 139.6917] // Tokyo coordinates

  // カスタムアイコンの作成
  const createCustomIcon = (color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
    </svg>`;
  
    const encodedSvg = encodeURIComponent(svg);
  
    return new LatLngTuple.Icon({
      iconUrl: `data:image/svg+xml;utf8,${encodedSvg}`,
      iconSize: [20, 20],
      iconAnchor: [15, 15],
    });
  };

  return (
    <MapContainer center={center} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {gpsData.map((vehicleData, index) => (
        <>
          <Polyline
            key={`line-${index}`}
            positions={vehicleData.positions}
            color={vehicleData.color}
            weight={5} // 線の太さを指定
          />
          {vehicleData.positions.length > 0 && (
            <Marker
              key={`marker-${vehicleData.vehicle.imei}`}
              position={vehicleData.positions[vehicleData.positions.length - 1]}
              icon={createCustomIcon(vehicleData.color)}
            >
              <Popup>
                <div>
                  <strong>車両情報</strong>
                  <p>名前: {vehicleData.vehicle.name}</p>
                  <p>IMEI: {vehicleData.vehicle.imei}</p>
                  <p>規格: {vehicleData.vehicle.trader}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </>
      ))}
    </MapContainer>
  )
}

