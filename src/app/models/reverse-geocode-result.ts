export interface ReverseGeocodeResult {
    display_name: string;
    name: string;
    address: {
        houseNumber: number;
        road: string;
        suburb: string;
        city: string;
        county: string;
        state: string;
        postcode: number;
        country: string;
        countryCode: string;
        town: string;
    };
}
