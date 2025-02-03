'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface VehicleSelectProps {
  selectedVehicles: string[]
  setSelectedVehicles: (vehicles: string[]) => void
}

export default function VehicleSelect({ selectedVehicles, setSelectedVehicles }: VehicleSelectProps) {
  const [vehicles, setVehicles] = useState<string[]>([])

  useEffect(() => {
    // 実際のアプリケーションでは、ここで車両リストを取得するAPIを呼び出します
    setVehicles(['001000000000009', '002000000000004', '001000000000021', '001000000000010', '001000000000006'])
  }, [])

  useEffect(() => {
    // 初期状態ですべての車両を選択
    if (vehicles.length > 0 && selectedVehicles.length === 0) {
      setSelectedVehicles(vehicles)
    }
  }, [vehicles, selectedVehicles, setSelectedVehicles])

  const handleVehicleToggle = (vehicle: string) => {
    if (selectedVehicles.includes(vehicle)) {
      setSelectedVehicles(selectedVehicles.filter(v => v !== vehicle))
    } else {
      setSelectedVehicles([...selectedVehicles, vehicle])
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <Label>Select Vehicles</Label>
      {vehicles.map((vehicle) => (
        <div key={vehicle} className="flex items-center space-x-2">
          <Checkbox
            id={vehicle}
            checked={selectedVehicles.includes(vehicle)}
            onCheckedChange={() => handleVehicleToggle(vehicle)}
          />
          <Label htmlFor={vehicle}>{vehicle}</Label>
        </div>
      ))}
    </div>
  )
}

