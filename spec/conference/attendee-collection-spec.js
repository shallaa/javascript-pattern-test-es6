import { Attendee, AttendeeCollection } from '../../src/conference';

describe('conference.AttendeeCollection', () => {
  describe('contains(attendee)', () => {

  });

  describe('add(attendee)', () => {

  });

  describe('remove(attendee)', () => {

  });

  describe('iterate(callback)', () => {

  });

  describe('iterate(callback)', () => {
    const addAttendeesToCollection = function addAttendeesToCollection(attendeeArray) {
      attendeeArray.forEach(attendee => collection.add(attendee));
    };

    const verifyCallbackWasExecutedForEachAttendee = function verifyCallbackWasExecutedForEachAttendee(attendeeArray) {
      const calls = callbackSpy.calls;
      const allCalls = calls.all();
      const count = calls.count();

      expect(count).toBe(attendeeArray.length);

      allCalls.forEach((call, index) => expect(call.args[0]).toBe(attendeeArray[index]));
    };

    let collection;
    let callbackSpy;

    beforeEach(() => {
      collection = new AttendeeCollection();
      callbackSpy = jasmine.createSpy();
    });

    it('빈 컬렉션에서는 콜백을 실행하지 않는다.', () => {
      collection.iterate(callbackSpy);

      expect(callbackSpy).not.toHaveBeenCalled();
    });

    it('원소가 하나뿐인 컬렉션은 콜백을 한 번만 실행한다.', () => {
      const attendees = [new Attendee('윤지', '김')];

      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });

    it('컬렉션 원소마다 한 번씩 콜백을 실행한다.', () => {
      const attendees = [
        new Attendee('Tom', 'Kazansky'),
        new Attendee('Chariotte', 'Blackwood'),
        new Attendee('태영', '김')
      ];

      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });
  });
});