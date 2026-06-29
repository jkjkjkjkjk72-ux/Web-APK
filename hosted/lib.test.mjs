// 통합 서버 순수 헬퍼 단위 테스트
import { test } from 'node:test';
import assert from 'node:assert';
import { cleanList, addSubmission, removeSubmission, playUrl } from './lib.mjs';

test('cleanList는 빈 키·REPLACE_ME를 거른다', () => {
  assert.deepStrictEqual(
    cleanList([{ name: 'a', publicKey: 'b_1' }, { name: 'x', publicKey: 'REPLACE_ME' }, { name: 'y' }]),
    [{ name: 'a', publicKey: 'b_1' }]
  );
});

test('addSubmission은 뒤에 추가하고 같은 키면 교체', () => {
  assert.deepStrictEqual(addSubmission([{ name: 'a', publicKey: 'b_1' }], ' 새 ', 'b_2'),
    [{ name: 'a', publicKey: 'b_1' }, { name: '새', publicKey: 'b_2' }]);
  assert.deepStrictEqual(addSubmission([{ name: '구', publicKey: 'b_1' }], '신', 'b_1'),
    [{ name: '신', publicKey: 'b_1' }]);
});

test('removeSubmission은 해당 키를 뺀다', () => {
  assert.deepStrictEqual(removeSubmission([{ name: 'a', publicKey: 'b_1' }, { name: 'b', publicKey: 'b_2' }], 'b_1'),
    [{ name: 'b', publicKey: 'b_2' }]);
});

test('playUrl', () => {
  assert.strictEqual(playUrl('b_x'), 'https://appetize.io/app/b_x');
});
