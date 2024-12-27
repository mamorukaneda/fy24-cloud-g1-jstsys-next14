'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Home() {
    const [startTime, setStartTime] = useState('2024-12-01T00:00'); // 初期値を設定
    const [endTime, setEndTime] = useState('2024-12-01T23:59');     // 初期値を設定
    const [map, setMap] = useState<L.Map | null>(null);

    // ランダムな色を生成する関数
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    useEffect(() => {
        const mapInstance = L.map('map').setView([36.783761, 136.723564], 9);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
    }, []);

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!map) return;

        try {
            const formattedStart = startTime.replace('T', '').replace(/-/g, '').replace(/:/g, '');
            const formattedEnd = endTime.replace('T', '').replace(/-/g, '').replace(/:/g, '');

            const response = await fetch(
                `https://qnhgfj7e92.execute-api.ap-northeast-1.amazonaws.com/dev/GetFromDynamoDB?start_time=${formattedStart}&end_time=${formattedEnd}`
            );
            const data = await response.json();

            if (!data || data.length === 0) {
                alert('No data found for the specified time range.');
                return;
            }

            // Clear existing layers (タイルレイヤーを除く)
            map.eachLayer(layer => {
                if (!(layer instanceof L.TileLayer)) {
                    map.removeLayer(layer);
                }
            });

            // データをIMEIごとにグループ化
            const imeiGroups: { [key: string]: any[] } = {};
            data.forEach((item: any) => {
                if (!imeiGroups[item.imei]) {
                    imeiGroups[item.imei] = [];
                }
                imeiGroups[item.imei].push(item);
            });

            // IMEIごとにルートを描画
            for (const imei in imeiGroups) {
                const coordinates = imeiGroups[imei].map(item => [item.latitude, item.longitude]);
                const color = getRandomColor();

                // 軌跡を描画
                const polyline = L.polyline(coordinates, { color, weight: 6 }).addTo(map);
                console.log('追加された軌跡:', polyline);

                // 最新の位置情報にカスタムアイコンを設定
                const latestItem = imeiGroups[imei][imeiGroups[imei].length - 1];
                const snowplowIcon = L.icon({
                    iconUrl: 'snowplow.png',
                    iconSize: [32, 37],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -30]
                });

                const marker = L.marker([latestItem.latitude, latestItem.longitude], { icon: snowplowIcon }).addTo(map);

                // 吹き出し内容をフォーマット
                const formattedDatetime = `${latestItem.datetime.substring(0, 4)}/${latestItem.datetime.substring(4, 6)}/${latestItem.datetime.substring(6, 8)} ${latestItem.datetime.substring(8, 10)}:${latestItem.datetime.substring(10, 12)}`;
                const popupContent = `
                    IMEI: ${imei}<br>
                    日時: ${formattedDatetime}<br>
                    規格: ${latestItem.name}<br>
                    業者名: ${latestItem.trader}
                `;
                marker.bindPopup(popupContent);

                console.log('追加されたマーカー:', marker);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch location data.');
        }
   };

    return (
        <div>
            <h1>Location Tracker</h1>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>
            <div id="map" style={{ height: '700px', width: '100%' }}></div>
        </div>
    );
}

