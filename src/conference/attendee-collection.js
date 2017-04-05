export const AttendeeCollection = class AttendeeCollection {
  constructor() {
    this.attendees = [];
  }

  contains(attendee) {
    return this.attendees.includes(attendee);
  }

  add(attendee) {
    if (!this.contains(attendee)) {
      this.attendees.push(attendee);
    }
  }

  remove(attendee) {
    const attendees = this.attendees;
    const index = attendees.indexOf(attendee);

    if (index > -1) {
      attendees.splice(index, 1);
    }
  }

  iterate(callback) {
    this.attendees.forEach(callback);
  }
};