/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VehicleSelect from '@/components/VehicleSelect'
import dynamic from "next/dynamic";
//import Map from '@/components/GpsMap'
import { getGpsData } from '@/components/getGpsData'
import dayjs from 'dayjs';

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Vehicle } from "@/types/types";

const Map = dynamic(() => import("@/components/GpsMap"), { ssr:false });

interface gpsData {
  vehicle: Vehicle,
  color: string,
  positions: number[][],
}

const client = generateClient<Schema>();

export default function GpsTrackingMap() {
  const [date, setDate] = useState<string>(new Date("2024-12-03T00:00").toISOString().split('T')[0])
  const [timeRange, setTimeRange] = useState<string>("3")
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([])
  const [gpsData, setGpsData] = useState<gpsData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      //日本時間に合わせる。
      const dateJST = new Date(date).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
      const data = await getGpsData(new Date(dateJST), parseInt(timeRange), selectedVehicles);
      setGpsData(data)
    }
    fetchData()
  }, [date, timeRange, selectedVehicles])

  //確認用
  const dateJST = new Date(date).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const baseDateTime = dayjs(dateJST);
  const formattedStart = baseDateTime.subtract(Number(timeRange), 'hour').format('YYYYMMDDHHmmss');
  const formattedEnd = baseDateTime.format('YYYYMMDDHHmmss')

  
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
      <div>
        <div>
          <h2 className="text-xl font-semibold">Selected Parameters</h2>
          <p>Date: {date}, Start:{formattedStart}, End:{formattedEnd}</p>
          <p>Time Range: {timeRange} hours</p>
          <p>Selected Vehicles: {selectedVehicles.map(vehicle => vehicle.name).join(', ')}</p>
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
