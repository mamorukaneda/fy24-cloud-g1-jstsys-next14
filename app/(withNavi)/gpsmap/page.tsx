/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VehicleSelect from '@/components/VehicleSelect'
import dynamic from "next/dynamic";
//import Map from '@/components/GpsMap'
import { getGpsData } from '@/components/getGpsData'
import dayjs from 'dayjs';

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import type { Vehicle } from "@/types/types";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const Map = dynamic(() => import("@/components/GpsMap"), { ssr:false });

interface gpsData {
  vehicle: Vehicle,
  color: string,
  positions: number[][],
}

const client = generateClient<Schema>();

export default function GpsTrackingMap() {
  const [fetchMode, setFetchMode] = useState<"dateRange" | "timestamps">("dateRange")

  // Date Range Mode states
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"))
  // const [date, setDate] = useState<string>(new Date("2024-12-03T00:00").toISOString().split('T')[0])
  const [timeRange, setTimeRange] = useState<string>("3")

  // Timestamp Mode states
  const [startTimestamp, setStartTimestamp] = useState<string>(dayjs().subtract(3, "hour").format("YYYY-MM-DDTHH:mm"))
  const [endTimestamp, setEndTimestamp] = useState<string>(dayjs().format("YYYY-MM-DDTHH:mm"))

  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([])
  const [gpsData, setGpsData] = useState<gpsData[]>([])

  const fetchData = useCallback(async () => {
    let start: string, end: string
    if (fetchMode === "dateRange") {
      const baseDateTime = dayjs(date)
      start = baseDateTime.subtract(Number(timeRange), "hour").format("YYYYMMDDHHmmss")
      end = baseDateTime.format("YYYYMMDDHHmmss")
      console.log(start, end)
    } else {
      start = dayjs(startTimestamp).format("YYYYMMDDHHmmss")
      end = dayjs(endTimestamp).format("YYYYMMDDHHmmss")
      console.log(start, end)
    }
    const data = await getGpsData(start, end, selectedVehicles)
    setGpsData(data)
  }, [fetchMode, date, timeRange, startTimestamp, endTimestamp, selectedVehicles])

  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">GPS Tracking Map</h1>

      <RadioGroup defaultValue="dateRange" onValueChange={(value) => setFetchMode(value as "dateRange" | "timestamps")}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dateRange" id="dateRange" />
          <Label htmlFor="dateRange">Date and Time Range</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="timestamps" id="timestamps" />
          <Label htmlFor="timestamps">Start and End Timestamps</Label>
        </div>
      </RadioGroup>

      {fetchMode === "dateRange" ? (
      <div className="flex space-x-4">
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Input
              id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
          </div>
          <div className="space-y-2">
            <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">
              Time Range
            </label>
        <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]" id="timeRange">
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
          </div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <div className="space-y-2">
            <label htmlFor="start-timestamp" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <Input
              id="start-timestamp"
              type="datetime-local"
              value={startTimestamp}
              onChange={(e) => setStartTimestamp(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="end-timestamp" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <Input
              id="end-timestamp"
              type="datetime-local"
              value={endTimestamp}
              onChange={(e) => setEndTimestamp(e.target.value)}
              className="px-3 py-2 border rounded-md"
        />
      </div>
        </div>
      )}

      <VehicleSelect selectedVehicles={selectedVehicles} setSelectedVehicles={setSelectedVehicles} />

      <Button onClick={fetchData}>Fetch GPS Data</Button>
      <div>
        <Map gpsData={gpsData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Selected Parameters</h2>
        {fetchMode === "dateRange" ? (
          <>
            <p>Date: {date}</p>
            <p>Time Range: {timeRange} hours</p>
          </>
        ) : (
          <>
            <p>Start Time: {dayjs(startTimestamp).format("YYYY-MM-DD HH:mm:ss")}</p>
            <p>End Time: {dayjs(endTimestamp).format("YYYY-MM-DD HH:mm:ss")}</p>
          </>
        )}
        <p>Selected Vehicles: {selectedVehicles.map((vehicle) => vehicle.name).join(", ")}</p>
      </div>

      <div>
        <pre>{JSON.stringify(gpsData, null, 2)}</pre>
      </div>
    </div>
  )
}

