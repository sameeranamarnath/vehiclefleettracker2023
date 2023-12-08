export interface Coordinates {
    lat: number,
    long: number
  }
  
  export interface Geo {
    coordinates: Coordinates,
    country: string,
    country_code: string,
    full_name: string,
    id: string,
    name: string,
    place_type?: string,
  }
  
  export interface Tweet {
    date: string,
    geo: Geo,
    id: string,
    image?: string,
    text: string,
    userId: string,
    userName: string
  }
  //[ { "M" : { "date" : { "S" : "02/08/23" }, "geo" : { "M" : { "country" : { "S" : "USA" }, "country_code" : { "S" : "USA" }, "full_name" : { "S" : "place 1" }, "place_type" : { "S" : "place 1" }, "name" : { "S" : "Geo location1" }, "coordinates" : { "M" : { "lat" : { "N" : "34.01283" }, "long" : { "N" : "41.1818" } } }, "id" : { "S" : "geo1" } } }, "id" : { "S" : "tweet1" }, "text" : { "S" : "Test tweet" }, "userName" : { "S" : "DC Taco Truck" }, "userId" : { "S" : "DcTacoTruck" } } } ]
  
  export interface Vendor {
      name: string,
      image: string,
      updatedtimestamp: number,
      tweets: Tweet[],
      twitterId: string,
      createdtimestamp: number,
      description: string
  }
  
  export interface Vendors {
      Items: Vendor[],
      count: number,
      lastEvaluatedKey: string | null
  }
  