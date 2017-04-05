export const Attendee = class Attendee {
  constructor(firstName = 'None', lastName = 'None') {
    this.checkdIn = false;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isCheckedIn() {
    return this.checkdIn;
  }

  checkIn() {
    this.checkdIn = true;
  }
};