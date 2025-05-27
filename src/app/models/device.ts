export interface Measure {
  timestamp: string;
  temperature: number;
  humidity: number;
  luminosity: number;
  waterTemperature: number;
  waterFlux: boolean;
  ph: number;
  containerLevel: number;
  onlineTime: number;
  engineStatus: boolean;
  conductivity: number;
  uv: number;
}

export interface Device {
  _id: string;
  name: string;
  image: string;
  registrationDate: string;
  measures: Measure[];
}
