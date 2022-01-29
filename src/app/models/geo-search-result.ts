export interface GeoSearchResult {
    x: number;
    y: number;
    label: string;
    bounds: [
      [number, number], // s, w - lat, lon
      [number, number], // n, e - lat, lon
    ];
    raw: Record<string, any>;
  };
