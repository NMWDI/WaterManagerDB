// Various conversion functions
import { GCSdimension } from './enums' 

// Convert a decimal degree to a degree, minute, second string
export function decimalToDMS(decimal: number, dimension: GCSdimension): string {

    // Determine N, S, E, or W from dimension
    let direction: string;
    switch (dimension) {
        case GCSdimension.Latitude:
            direction = decimal > 0 ? 'N' : 'S';
            break;
        case GCSdimension.Longitude:
            direction = decimal > 0 ? 'E' : 'W';
            break;
    }

  decimal = Math.abs(decimal);
  const degrees = Math.floor(decimal);
  const minutes = Math.floor((decimal - degrees) * 60);
  const seconds = Math.floor(((decimal - degrees) * 60 - minutes) * 60);
  return `${direction}${degrees}° ${minutes}' ${seconds}"`;
}

// Formatting of the lat/long
export function formatLatLong(latitude: number, longitude: number): string {
    return `${decimalToDMS(latitude, GCSdimension.Latitude)}, ${decimalToDMS(longitude, GCSdimension.Longitude)}`;
}