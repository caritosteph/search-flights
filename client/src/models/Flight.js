class Flight {

  constructor(data) {
    this.airline_name = data.airline.name;
    this.flight_number = data.flightNum;
    this.plane_name = data.plane.shortName;
    this.departure_city = data.start.cityName;
    this.destiny_city = data.finish.cityName;
    this.duration = data.durationMin;
    this.start_time = data.start.dateTime;
    this.finish_time = data.finish.dateTime;
    this.price = data.price;
  }

  get_airline_name() {
    return this.flight_number;
  }
  get_flight_number() {
    return this.flight_number;
  }
  get_plane_name() {
    return this.plane_name;
  }
  get_departure_city() {
    return this.departure_city;
  }
  get_destiny_city() {
    return this.destiny_city;
  }
  get_duration() {
    return this.duration;
  }
  get_start_time() {
    return this.start_time;
  }
  get_finish_time() {
    return this.finish_time;
  }
  get_price() {
    return this.price;
  }
}

export default Flight;
