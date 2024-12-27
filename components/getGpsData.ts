'use server'

export async function getGpsData(date: Date, timeRange: number, vehicles: string[]) {
  // この関数は実際のアプリケーションでは、データベースやAPIからGPSデータを取得します
  // ここではダミーデータを返します
  return vehicles.map(vehicle => ({
    vehicle,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    positions: Array.from({ length: 10 }, () => [
      35.6895 + (Math.random() - 0.5) * 0.1,
      139.6917 + (Math.random() - 0.5) * 0.1
    ])
  }))
}

