/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useRef } from 'react'
import { PlusCircle, Pencil, Trash2, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { type vehicleType } from "../types/types"
import { generateClient } from 'aws-amplify/api'
import type { Schema } from "../amplify/data/resource"

const client = generateClient<Schema>();

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<vehicleType[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState<vehicleType | null>(null)
  const [newVehicle, setNewVehicle] = useState<Omit<vehicleType, 'id' | 'createdAt' | 'updatedAt'>>({ name: '', type: '', imei: '' })
  // const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const sub = client.models.Vehicle.observeQuery().subscribe({
      next: ( { items  } ) => {
        setVehicles([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const addVehicle = async () => {
    await client.models.Vehicle.create({
      name: newVehicle.name,
      type: newVehicle.type,
      imei: newVehicle.imei,
    });
  };

  const updateVehicle = async (vehicle: vehicleType) => {
    await client.models.Vehicle.update({
      id: vehicle.id,
      name: vehicle.name, 
      type: vehicle.type, 
      imei: vehicle.imei,
    });
  }
  
  const deleteVehicle = (id: string) => {
    client.models.Vehicle.delete({ id });
  }

  const handleAddVehicle = () => {
    addVehicle()
    setIsAddDialogOpen(false)
    setNewVehicle({ name: '', type: '', imei: '' })
    toast({
      title: "車両追加",
      description: "新しい車両が正常に追加されました。",
    })
  }

  const handleEditVehicle = () => {
    if (currentVehicle) {
      updateVehicle(currentVehicle)
      setIsEditDialogOpen(false)
      setCurrentVehicle(null)
      toast({
        title: "車両更新",
        description: "車両情報が正常に更新されました。",
      })
    }
  }

  const handleDeleteVehicle = () => {
    if (currentVehicle) {
      deleteVehicle(currentVehicle.id)
      setIsDeleteDialogOpen(false)
      setCurrentVehicle(null)
      toast({
        title: "車両削除",
        description: "車両が正常に削除されました。",
        variant: "destructive",
      })
    }
  }

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       const content = e.target?.result as string
  //       const lines = content.split('\n')
  //       const newVehicles: Vehicle[] = []
        
  //       for (let i = 1; i < lines.length; i++) {  // Skip header row
  //         const [name, type, imei] = lines[i].split(',')
  //         if (name && type && imei) {
  //           newVehicles.push({
  //             id: Date.now() + i,  // Unique ID
  //             name: name.trim(),
  //             type: type.trim(),
  //             imei: imei.trim()
  //           })
  //         }
  //       }

  //       setVehicles([...vehicles, ...newVehicles])
  //       toast({
  //         title: "CSVアップロード",
  //         description: `${newVehicles.length}台の車両が正常にインポートされました。`,
  //       })
  //     }
  //     reader.readAsText(file)
  //   }
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">車両管理</h1>
      <div className="flex justify-between mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> 新規車両追加
        </Button>
        {/* <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
            aria-label="CSVファイルをアップロード"
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> CSVアップロード
          </Button>
        </div> */}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>車両名</TableHead>
            <TableHead>車両種別</TableHead>
            <TableHead>IMEIコード</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.name}</TableCell>
              <TableCell>{vehicle.type}</TableCell>
              <TableCell>{vehicle.imei}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                  setCurrentVehicle(vehicle)
                  setIsEditDialogOpen(true)
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setCurrentVehicle(vehicle)
                  setIsDeleteDialogOpen(true)
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 新規追加ダイアログ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規車両追加</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                車両名
              </Label>
              <Input
                id="name"
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                車両種別
              </Label>
              <Select
                onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="車両種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="トラック">トラック</SelectItem>
                  <SelectItem value="乗用車">乗用車</SelectItem>
                  <SelectItem value="バス">バス</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imei" className="text-right">
                IMEIコード
              </Label>
              <Input
                id="imei"
                value={newVehicle.imei}
                onChange={(e) => setNewVehicle({ ...newVehicle, imei: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddVehicle}>追加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>車両情報編集</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                車両名
              </Label>
              <Input
                id="edit-name"
                value={currentVehicle?.name || ''}
                onChange={(e) => setCurrentVehicle(currentVehicle ? { ...currentVehicle, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                車両種別
              </Label>
              <Select
                onValueChange={(value) => setCurrentVehicle(currentVehicle ? { ...currentVehicle, type: value } : null)}
                value={currentVehicle?.type}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="車両種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="トラック">トラック</SelectItem>
                  <SelectItem value="乗用車">乗用車</SelectItem>
                  <SelectItem value="バス">バス</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imei" className="text-right">
                IMEIコード
              </Label>
              <Input
                id="edit-imei"
                value={currentVehicle?.imei || ''}
                onChange={(e) => setCurrentVehicle(currentVehicle ? { ...currentVehicle, imei: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditVehicle}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>車両削除の確認</DialogTitle>
          </DialogHeader>
          <p>本当に「{currentVehicle?.name}」を削除しますか？</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>キャンセル</Button>
            <Button variant="destructive" onClick={handleDeleteVehicle}>削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

