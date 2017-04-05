import { Aop } from '../src/aop';

describe('Aop', () => {
  const TARGET_FN = 'TARGET_FN';
  const WRAPPING_ADVICE_START = 'WRAPPING_ADVICE_START';
  const WRAPPING_ADVICE_END = 'WRAPPING_ADVICE_END';
  const A = 'A';
  const B = 'B';

  const targetFn = 'targetFn';
  const targetFnReturn = 'targetFnReturn';

  const Target = function Target() {
    const self = this;

    this[targetFn] = function targetFn() {
      expect(this).toBe(self);
    };
  };

  let targetObj;
  let executionPoints;
  let argPassingAdvice;
  let argsToTarget;

  beforeEach(() => {
    targetObj = {
      [targetFn]: function targetFn(...args) {
        executionPoints.push(TARGET_FN);
        argsToTarget = args;

        return targetFnReturn;
      }
    };

    argPassingAdvice = function argPassingAdvice(targetInfo) {
      return targetInfo.fn.apply(this, targetInfo.args);
    };

    executionPoints = [];
  });

  describe('Aop.around(fnName, advice, targetObj)', () => {
    it('타깃 함수를 호출 시 어드바이스를 실행하도록 한다.', () => {
      const advice = function advice() { executeAdvice = true; };

      let executeAdvice = false;

      Aop.around(targetFn, advice, targetObj);
      targetObj[targetFn]();

      expect(executeAdvice).toBe(true);
    });

    it('어드바이스가 타깃 호출을 래핑한다.', () => {
      const wrappingAdvice = function wrappingAdvice(targetInfo) {
        executionPoints.push(WRAPPING_ADVICE_START);
        targetInfo.fn();
        executionPoints.push(WRAPPING_ADVICE_END);
      };

      Aop.around(targetFn, wrappingAdvice, targetObj);
      targetObj[targetFn]();

      expect(executionPoints).toEqual([WRAPPING_ADVICE_START, TARGET_FN, WRAPPING_ADVICE_END]);
    });

    it('마지막 어드바이스가 기존 어드바이스에 대해 실행되는 방식으로 체이닝할 수 있다.', () => {
      const ID_INNER = 'ID_INNER';
      const ID_OUTER = 'ID_OUTER';

      const adviceFactory = function adviceFactory(adviceID) {
        return function advice(targetInfo) {
          executionPoints.push(WRAPPING_ADVICE_START + adviceID);
          targetInfo.fn();
          executionPoints.push(WRAPPING_ADVICE_END + adviceID);
        };
      };

      Aop.around(targetFn, adviceFactory(ID_INNER), targetObj);
      Aop.around(targetFn, adviceFactory(ID_OUTER), targetObj);
      targetObj[targetFn]();

      expect(executionPoints).toEqual([
        WRAPPING_ADVICE_START + ID_OUTER,
        WRAPPING_ADVICE_START + ID_INNER,
        TARGET_FN,
        WRAPPING_ADVICE_END + ID_INNER,
        WRAPPING_ADVICE_END + ID_OUTER
      ]);
    });

    it('어드바이스에서 타깃으로 일반 인자를 넘길 수 있다.', () => {
      Aop.around(targetFn, argPassingAdvice, targetObj);
      targetObj[targetFn](A, B);

      expect(argsToTarget).toEqual([A, B]);
    });

    it('타깃의 반환값도 어드바이스에서 참조할 수 있다.', () => {
      let returnValue;

      Aop.around(targetFn, argPassingAdvice, targetObj);

      returnValue = targetObj[targetFn]();

      expect(returnValue).toBe(targetFnReturn);
    });

    it('타깃 함수를 해당 객체의 콘텍스트에서 실행한다.', () => {
      const targetInstance = new Target();
      const spyOnInstance = spyOn(targetInstance, targetFn).and.callThrough();

      Aop.around(targetFn, argPassingAdvice, targetInstance);
      targetInstance[targetFn]();

      expect(spyOnInstance).toHaveBeenCalled();
    });

    it('어드바이스를 타깃의 콘텍스트에서 실행한다.', () => {
      const advice = function advice() {
        expect(this).toBe(targetObj);
      };

      Aop.around(targetFn, advice, targetObj);
      targetObj[targetFn]();
    });
  });

  describe('Aop.next(context, targetInfo)', () => {
    const advice = function advice(targetInfo) {
      return Aop.next.call(this, targetInfo);
    };

    let originalFn;

    beforeEach(() => {
      originalFn = targetObj[targetFn];
      Aop.around(targetFn, advice, targetObj);
    });

    it('targetInfo.fn에 있는 함수를 호출한다.', () => {
      targetObj[targetFn]();

      expect(executionPoints).toEqual([TARGET_FN]);
    });

    it('targetInfo.args에 인자를 전달한다.', () => {
      targetObj[targetFn](A, B);

      expect(argsToTarget).toEqual([A, B]);
    });

    it('targetInfo 함수에서 받은 값을 반환한다.', () => {
      const ret = targetObj[targetFn]();

      expect(ret).toEqual(targetFnReturn);
    });

    it('주어진 콘텍스트에서 타깃 함수를 실행한다.', () => {
      const targetInstance = new Target();
      const spyOnInstance = spyOn(targetInstance, targetFn).and.callThrough();

      Aop.around(targetFn, advice, targetInstance);
      targetInstance[targetFn]();

      expect(spyOnInstance).toHaveBeenCalled();
    });
  });
});