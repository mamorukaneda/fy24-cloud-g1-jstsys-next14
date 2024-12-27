'use client'

import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import { LatLngTuple } from 'leaflet';


interface MapProps {
  gpsData: any[]
}

export default function Map({ gpsData }: MapProps) {
  const center: LatLngTuple = [35.6895, 139.6917] // Tokyo coordinates

  return (
    <MapContainer center={center} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {gpsData.map((vehicleData, index) => (
        <Polyline
          key={index}
          positions={vehicleData.positions}
          color={vehicleData.color}
        />
      ))}
    </MapContainer>
  )
}

