/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VehicleSelect from '@/components/VehicleSelect'
import dynamic from "next/dynamic";
//import Map from '@/components/GpsMap'
import { getGpsData } from '@/components/getGpsData'

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const Map = dynamic(() => import("@/components/GpsMap"), { ssr:false });

interface gpsData {
  vehicle: string,
  color: string,
  positions: number[][],
}

const client = generateClient<Schema>();

export default function GpsTrackingMap() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [timeRange, setTimeRange] = useState<string>("3")
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [gpsData, setGpsData] = useState<gpsData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGpsData(new Date(date), parseInt(timeRange), selectedVehicles)
      setGpsData(data)
    }
    fetchData()
  }, [date, timeRange, selectedVehicles])

  // const startTime = '2024-12-02T00:00:00'
  // const formattedStart = startTime.replace('T', '').replace(/-/g, '').replace(/:/g, '')

  // // const getData = async () => {
  // //   try {
  // //     const formattedEnd = "20241202235959";
  // //     const response = await client.queries.getGpsData({
  // //       baseDateTime: new Date(startTime).toISOString(),
  // //       timeRange: parseInt("24"),
  // //     });
  // //     if (response.data) {
  // //       const parsedData = JSON.parse(response.data.body);
  // //       console.log(parsedData);
  // //     } else {
  // //       console.error("No data received");
  // //     }
  // //   } catch (error) {
  // //     console.error("Error fetching GPS data:", error);
  // //   }
  // // };

  // // getData();
  
  return (
    <div className="p-4 space-y-4">
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">GPS  Map</h1>
      </div>
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
      <div>
        <div>
          <h2 className="text-xl font-semibold">Selected Parameters</h2>
          <p>Date: {date}</p>
          <p>Time Range: {timeRange} hours</p>
          <p>Selected Vehicles: {selectedVehicles.join(', ')}</p>
        </div>
      </div>
      <div>
        <Map gpsData={gpsData} />
      </div>
      <div>
        <pre>{JSON.stringify(gpsData, null, 2)}</pre>
      </div>

    </div>
  )
}