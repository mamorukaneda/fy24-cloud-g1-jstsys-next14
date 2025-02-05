'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"

interface VehicleSelectProps {
  selectedVehicles: Vehicle[]
  setSelectedVehicles: (vehicles: Vehicle[]) => void
}

interface Vehicle {
  imei: string;
  name: string;
  trader: string;
}

export default function VehicleSelect({ selectedVehicles, setSelectedVehicles }: VehicleSelectProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const client = generateClient<Schema>()

  useEffect(() => {
    // setVehicles(['001000000000009', '002000000000004', '001000000000021', '001000000000010', '001000000000006'])
    async function fetchVehicles() {
      try {
        const { data } = await client.models.Vehicle.list()
        const sortedData = data.sort((a, b) => a.imei.localeCompare(b.imei))
        setVehicles( sortedData )
      } catch (error) {
        console.error("Error fetching vehicles:", error)
      }
    }
    fetchVehicles()
  }, []) 

  useEffect(() => {
    // 初期状態ですべての車両を選択
    if (vehicles.length > 0 && selectedVehicles.length === 0) {
      setSelectedVehicles(vehicles)
    }
  }, [vehicles, selectedVehicles, setSelectedVehicles])

  const handleVehicleToggle = (vehicle: Vehicle) => {
    if (selectedVehicles.some((v) => v.imei === vehicle.imei)) {
      setSelectedVehicles(selectedVehicles.filter((v) => v.imei !== vehicle.imei))
    } else {
      setSelectedVehicles([...selectedVehicles, vehicle])
    }
  }

  const isVehicleSelected = (vehicle: Vehicle) => {
    return selectedVehicles.some((v) => v.imei === vehicle.imei)
  }

  return (
    <div className="flex flex-col space-y-2">
      <Label>Select Vehicles</Label>
      {vehicles.map((vehicle) => (
        <div key={vehicle.imei} className="flex items-center space-x-2">
          <Checkbox
            id={vehicle.imei}
            checked={isVehicleSelected(vehicle)}
            onCheckedChange={() => handleVehicleToggle(vehicle)}
          />
          <Label htmlFor={vehicle.imei}>{vehicle.name}</Label>
        </div>
      ))}
    </div>
  )
}

