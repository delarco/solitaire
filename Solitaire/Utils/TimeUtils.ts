import { ITime } from "../interfaces/ITime";

export class TimeUtis {

    public static calculateTime(startTime: number, endTime: number): ITime {

        let diff = endTime - startTime

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        diff -= days * (1000 * 60 * 60 * 24);

        const hours = Math.floor(diff / (1000 * 60 * 60))
        diff -= hours * (1000 * 60 * 60);

        const minutes = Math.floor(diff / (1000 * 60))
        diff -= minutes * (1000 * 60);

        const seconds = Math.floor(diff / (1000))
        diff -= seconds * (1000);

        const milliseconds = diff

        return { days, hours, minutes, seconds, milliseconds }
    }
}
