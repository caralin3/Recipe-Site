import { NumberToLabelPipe } from './number-to-label.pipe';

describe('NumberToLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberToLabelPipe();
    expect(pipe).toBeTruthy();
  });
});
