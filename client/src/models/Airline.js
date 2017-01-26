class Airline {
  constructor(data) {
    this.airline_code = data.airline_code;
    this.flights = data.flights;
  }

	get_airline_code() {
    return this.airline_code;
  }
	get_flights() {
    return this.flights;
  }
}

export default Airline;
