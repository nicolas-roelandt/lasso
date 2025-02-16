# LASSO Data

Lasso software can host multiple project data. One project is a set of soundscape variables mapped into one specific territory.
Each project must configure the way it will use the lasso web application by:

1. documenting the project with content
2. tuning the way the maps will use the provided GeoJson

## Project folder

Each project use a specific folder inside `/data`.

> create a folder into `/data/project_name`

The projects will be listed following the folder name alphabetic order to feel free to prefix the folder name if needed. Don"t bother naming the folder with the complete project name the configuration will allow you to name the project fully.

## Static content pages

Finally you can add context to your project by adding markdown files in the project folder:

- `project.md`: about page
- `sponsors.md`: sponsors page
- `bibliography.md`: references page

Those contents will be rendered as web pages accessible from the project page menu.

## Main data: one GeoJSON file

The main data of the project should be added as a GeoJson file holding the many data variable into geolocalised features.
The features can be point or geometry depending to your needs.
You can keep the property name we are using in your project you will be able to map those specific names into the normalized Lasso variables in the configuration file.

> Add one GeoJson file into your project folder `/data/project_name/layers/data.geojson`

## Project configuration : `index.json`

The main file you will be edited is the configuration file `/data/project_name/index.json`.

> create or copy from other project `/data/project_name/index.json`

Please consult this [full example](./project_index_example.json) while reading this documentation.

### metadata

Here the first section of the `index.json` file which describe your project identity:

- id: a unique slug which will be used to build the project url `https://ouestware.github.io/lasso/project/{id]` (must be alphanumeric + \_)
- name: the project name in full text
- description: a short text which will present the project in the home page. Descriptions must be language specific by using different language ISO alpha-2 codes as keys.
- image: filename of an image representing the project. This file must be added in the `/data/project_name/` folder. This image will be used in the home page project's presentation card.

### sources

The sources section is based on maplibre-gl Style specification syntax (https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/).

You must add one source describing your main GeoJson file.
This source must be of `geojon` type and the point to the file (`data` field) you added in the project.

we added two Lasso specific sections in the source description : variables and timeSeries.

#### `variables`

The variables is a dictionary indicating which Lasso specific variable can be found in our main geojson file and under each property name.

The Lasso variables are :

- acoustic_soundlevel
- acoustic_birds
- acoustic_trafic
- acoustic_voices
- emotion_eventful
- emotion_pleasant

For each, the variables should indicate:

- propertyName: name of the variable the geojson feature properties
- minimumValue: the minimum possible value of the variable
- maximumValue: the maximum possible value of the variable

```json
{
  "variables": {
    "emotion_pleasant": {
      "propertyName": "Agr_Mean",
      "minimumValue": 0,
      "maximumValue": 10
    },
    "emotion_eventful": {
      "propertyName": "Ani_Mean",
      "minimumValue": 0,
      "maximumValue": 10
    },
    "acoustic_trafic": {
      "propertyName": "Circ_Mean",
      "minimumValue": 1,
      "maximumValue": 11
    },
    "acoustic_birds": {
      "propertyName": "Ois_Mean",
      "minimumValue": 1,
      "maximumValue": 11
    },
    "acoustic_voices": {
      "propertyName": "Voix_Mean",
      "minimumValue": 1,
      "maximumValue": 11
    },
    "acoustic_soundlevel": {
      "propertyName": "Bru_Mean",
      "minimumValue": 1,
      "maximumValue": 11
    }
  }
}
```

#### `timeseries`

The `timeseries` section indicate if your data are time-based and if yes what are the time steps according to Lasso constraints.

In the GeoJson file time based variables must be represented as one feature by time step. The property name are therefore stable, the time step must be documented as a timestamp property. The absolut time is not important only the months, day of the week and hours of the day can be used in Lasso.

You can also provide a series of features with empty timestamps in which case those features will be used as the static version of the map, i.e. the map with no time filter applied. This let the data producer decide how to best aggregate the time steps into one static version. Note all the features doesn't have to have a value for every time steps. Missing data will be displayed as such in the map and timeline.

You must provide a `timeseries` configuration to define discrete time steps from the continuous timestamp. This configuration will be used to display the variable in a time line.

First you must indicate the `timestampPropertyName`: name of the geojson property where to find the timestamp.

Then you can indicate the time steps for the months, days of the week and hours appropriate for you data.
/!\ hours needs to be contiguous and [min,max]. For now you can't do something like [23,7] to go over midnight. It might be possible in a close future see https://github.com/ouestware/lasso/issues/9

A complete example of timeseries specification

```json
{
  "timeSeries": {
    "timestampPropertyName": "timestamPP",
    "hoursLabels": {
      "day": {
        "label": {
          "fr": "jour",
          "en": "day"
        },
        "hours": [8, 18]
      },
      "evening": {
        "label": {
          "fr": "soirée",
          "en": "evening"
        },
        "hours": [19, 23]
      },
      "night": {
        "label": {
          "fr": "nuit",
          "en": "night"
        },
        "hours": [0, 7]
      }
    },
    "daysLabels": {
      "week": {
        "label": {
          "fr": "semaine",
          "en": "week"
        },
        "weekDays": [1, 2, 3, 4, 5]
      },
      "weekend": {
        "label": {
          "fr": "week-end",
          "en": "week-end"
        },
        "weekDays": [6, 7]
      }
    },
    "monthsLabels": {
      "fallWinter": {
        "label": {
          "fr": "automne-hiver",
          "en": "fall-winter"
        },
        "months": [10, 11, 12, 1, 2, 3]
      },
      "springSummer": {
        "label": {
          "fr": "printemps-été",
          "en": "spring-summer"
        },
        "months": [4, 5, 6, 7, 8, 9]
      }
    }
  }
}
```

### maps

The maps section list the different maps a user can explore using lasso in your project.

A map must have an id and a name.

It is composed of layers which are rendered one on top of the other.
Layers are maplibre-gl styles see https://maplibre.org/maplibre-gl-js-docs/style-spec/.

In Lasso layers has a few constraints on top of maplibre-gl specification:

- a layer representing one of the Lasso variable must use the variable name as an id
- a layer will be interactive only if you add a `"interactive":true` in `metadata` (might change)
- you can add a `basemapStyle` field which must be a local maplibre-style file or an URL to a style file somewhere on the web (CORS must be enabled). The `basemapStyle` allow to define in one single file the map background on which you want your data layer to be rendered on. For instance one can tune a precise basemap by tuning the IGN style with maputnik as explained here https://geoservices.ign.fr/documentation/services/utilisation-sig/tutoriel-maputnik see [ign_simple_bright.json](./ign_simple_bright.json) as an example where road colors were reset
- by adding a `beforeId` field you can force one of your data layer to be rendered under/before an other layer defined for instance in the `basemapStyle`. You must indicate an existing layer id in this field.

By exposing the maplibre-gl style specification directly we chose to enable the maximum flexibility at the cost of complexity and repetition. Indeed for a full project exposing all the acoustic and emotion variables, an editor needs to write six maps specifications. Each needs to describe how the data will be rendered on the map using the paint directive (circle, fill existing geometry...).

This configuration should indicate how to paint data when:

- there is data indicating the colour scale
- there is no data indicating the no-data colour or symbol
- the feature has been selected by the user

Which makes a complex and verbose specification but opens experimentation and precise customization of the layout.

When writing those specification it's important to keep in mind that:

1. it's usually safe to copy/paste maps from one project to the other as the variable specificities are handled in the source object
2. to make sure the data value range are accurate in style paint as you need to indicate it twice in variables and in the style specification
3. not to worry about time it will be handled automatically for you. Note that data value ranges must cover all time steps cases
4. the `feature-state` will contain a `{"selected":true}` when selected
5. the color scales your are defining in those specifications will be automatically reused to adapt the selected feature panel which acts as a legend.
