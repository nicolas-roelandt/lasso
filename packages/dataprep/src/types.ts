import { LayerSpecification, SourceSpecification } from "maplibre-gl";
import { Style } from "mapbox-gl";

export type BBOX = [[number, number], [number, number]];

// TODO: featureIdentifier doesn't need to be a complex variable only a string.
// also we might want to allow random variables on top of specific ones
export type SOUNDSCAPE_VARIABLES_TYPES =
  | "acoustic_soundlevel"
  | "acoustic_birds"
  | "acoustic_trafic"
  | "acoustic_voices"
  | "emotion_eventful"
  | "emotion_pleasant";

export type MapLayerType =
  | string
  | {
      layerId: string;
      variable: SOUNDSCAPE_VARIABLES_TYPES;
    };

export interface IProjectMap {
  /**
   * Unique identifier of the map across the project.
   * Will be used in the URL.
   */
  id: string;
  /**
   * Name of the map
   */
  name: string;
  /**
   * Mapgl style specification to boostrap the map with
   */
  basemapStyle?: string | Style;
  /**
   * List of ordered layers IDS for the map
   * Layers will be drawn one of top oth the other folowwing the order (first = bottom).
   * If a style is provided the extra layers listed in this variable will be drawn on top of the style layers.
   */
  layers: Array<LayerSpecification & { beforeId: string }>;
}

/**
 * Layer variables definitions
 */
enum WeekDay {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
}
enum Month {
  january,
  february,
  march,
  april,
  may,
  june,
  july,
  august,
  september,
  october,
  november,
  december,
}

export type LayerVariable = {
  propertyName: string;
  minimumValue: number;
  maximumValue: number;
};

/**
 * Expected time series variable expression in GeoJSON
 */
export interface TimeSeriesGeoJSONProperty {
  value: number;
  hours: [number, number];
  weekDays: WeekDay[];
}
[];

export interface TimeSpecification {
  timestampPropertyName: string;
  hoursLabels?: Record<string, { label: { fr: string; en: string }; hours: [number, number] }>;
  daysLabels?: Record<string, { label: { fr: string; en: string }; weekDays: WeekDay[] }>;
  monthsLabels?: Record<string, { label: { fr: string; en: string }; months: Month[] }>;
}

export type LassoSourceVariables = Partial<Record<SOUNDSCAPE_VARIABLES_TYPES, LayerVariable>>;

export type LassoSource = SourceSpecification & {
  variables?: LassoSourceVariables;
  timeSeries?: TimeSpecification;
};

interface IProject {
  /**
   * Unique identifier of the project acroos all projects.
   */
  id: string;
  /**
   * Name of the project.
   */
  name: string;
  /**
   * A short description of the project in text only.
   * Will be used for the project's card.
   */
  description?: Record<string, string>;
  /**
   * Image of the project that will be used to create the project card.
   * It's a relative path to the image.
   */
  image?: string;
  /**
   * Color of the project.
   * Will be used on the home map to draw the rectangle.
   * If not specified, a random color will be generated.
   */
  color?: string;
  /**
   * BBOX of the project  (minX, minY, maxX, maxY)
   * If not specified, we will compute the outer BBOX from GeoJSON layers
   */
  bbox?: BBOX;
  /**
   * List of layer that can be used on maps
   * A layer can be a tiles URL or a path to a geojson
   */
  sources: {
    [sourceKey: string]: LassoSource;
  };
  /**
   * Maps list of the project.
   */
  maps: Array<IProjectMap>;
}

type IProjectFull = IProject & {
  pages: { [key: string]: string };
};

export type ImportProject = IProject;
export type InternalProject = IProjectFull;
export type Project = IProjectFull & { bbox: BBOX; color: string };

export interface ExportedData {
  bbox: BBOX;
  projects: Array<Project>;
}
