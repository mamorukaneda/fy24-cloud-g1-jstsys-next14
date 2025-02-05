'use client'
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";

// layout.tsxでconfigure済みのはずだが...
import { Amplify } from 'aws-amplify';
import config from "@/amplify_outputs.json";

Amplify.configure(config);

const client = generateClient<Schema>();

interface GpsItem {
  imei: string;
  latitude: number;
  longitude: number;
  datetime: string;
  name: string;
  trader: string;
}

interface Vehicle {
  imei: string;
  name: string;
  trader: string;
}

  // ランダムな色を生成する関数
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export async function getGpsData(date: Date, timeRange: number, vehicles: Vehicle[]) {
  // この関数は実際のアプリケーションでは、データベースやAPIからGPSデータを取得します
  // ここではダミーデータを返します
  // const res = await fetch(
  //   `https://qnhgfj7e92.execute-api.ap-northeast-1.amazonaws.com/dev/GetFromDynamoDB?start_time=${formattedStart}&end_time=${formattedEnd}`
  // );

  const response = await client.queries.getGpsData({
    baseDateTime: date.toISOString(),
    timeRange: parseInt(timeRange.toString()),
    vehicleImeis: vehicles.map(vehicle => vehicle.imei),
  });
  let gpsData
  if (response.data) {
    const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    const gpsDataJson = JSON.parse(parsedData.body);
    gpsData = gpsDataJson.gpsData.gpsData;
  } else {
    gpsData = [];
  }

  console.log(gpsData);
  // データをIMEIごとにグループ化
  const imeiGroups: { [key: string]: GpsItem[] } = {};
  gpsData.forEach((item: GpsItem) => {
    if (!imeiGroups[item.imei]) {
        imeiGroups[item.imei] = [];
    }
    imeiGroups[item.imei].push(item);
  });

  return vehicles.map(vehicle => {
    const vehicleData = imeiGroups[vehicle.imei] || [];
    return {
      vehicle: vehicle.imei,
      color: getRandomColor(),
      positions: vehicleData.map(item => [item.latitude, item.longitude])
    };
  });
}

