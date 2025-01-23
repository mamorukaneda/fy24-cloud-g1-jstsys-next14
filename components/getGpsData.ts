'use client'

export async function getGpsData(date: Date, timeRange: number, vehicles: string[]) {
  // この関数は実際のアプリケーションでは、データベースやAPIからGPSデータを取得します
  // ここではダミーデータを返します
  // const res = await fetch(
  //   `https://qnhgfj7e92.execute-api.ap-northeast-1.amazonaws.com/dev/GetFromDynamoDB?start_time=${formattedStart}&end_time=${formattedEnd}`
  // );
  return vehicles.map(vehicle => ({
    vehicle,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    positions: Array.from({ length: 10 }, () => [
      35.6895 + (Math.random() - 0.5) * 0.1,
      139.6917 + (Math.random() - 0.5) * 0.1
    ])
  }))
}

