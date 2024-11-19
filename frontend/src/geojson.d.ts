// Type declaration for geojson

declare module "*.geojson" {
    const value: GeoJSON.FeatureCollection;
    export default value;
}