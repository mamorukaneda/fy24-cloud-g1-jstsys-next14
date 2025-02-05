import { type Schema } from "../../data/resource"
import dayjs from 'dayjs';

export const handler: Schema["getGpsData"]["functionHandler"] = async (event) => {
    
    const baseDateTime = dayjs(event.arguments.baseDateTime);
    const timeRange = event.arguments.timeRange;
    const vehicles = event.arguments.vehicleImeis;

    const formattedStart = baseDateTime.subtract(timeRange, 'hour').format('YYYYMMDDHHmmss');
    const formattedEnd = baseDateTime.format('YYYYMMDDHHmmss')
    // const formattedStart = "20241201000000";
    // const formattedEnd = "20241202235959";
    try {

        const response = await fetch(
            `https://qnhgfj7e92.execute-api.ap-northeast-1.amazonaws.com/dev/GetFromDynamoDB?start_time=${formattedStart}&end_time=${formattedEnd}`
        )
        const gpsData = await response.json();
        
        //必要のないvehiclesを外す。
        //取得したGPSデータを整形する。

        return {
            statusCode: 200,
            body: JSON.stringify({
                gpsData: { gpsData }
        })}
    
    } catch (error) {
        console.error('Error inserting todo:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Failed to GetFromDynamoDB?start_time=${formattedStart}&end_time=${formattedEnd}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    } 
}