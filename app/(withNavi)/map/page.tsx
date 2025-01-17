/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VehicleSelect from '@/components/VehicleSelect'
import Map from '@/components/Map'
import { getGpsData } from '@/components/getGpsData'

export default function GpsTrackingMap() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [timeRange, setTimeRange] = useState<string>("3")
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [gpsData, setGpsData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGpsData(new Date(date), parseInt(timeRange), selectedVehicles)
      setGpsData(data)
    }
    fetchData()
  }, [date, timeRange, selectedVehicles])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">GPS Tracking Map</h1>
      <div className="flex space-x-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 hour</SelectItem>
            <SelectItem value="3">3 hours</SelectItem>
            <SelectItem value="6">6 hours</SelectItem>
            <SelectItem value="12">12 hours</SelectItem>
            <SelectItem value="24">24 hours</SelectItem>
          </SelectContent>
        </Select>
        <VehicleSelect
          selectedVehicles={selectedVehicles}
          setSelectedVehicles={setSelectedVehicles}
        />
      </div>
      <Map gpsData={gpsData} />
    </div>
  )
}