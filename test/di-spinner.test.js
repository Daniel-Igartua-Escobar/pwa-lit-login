import { html, fixture, expect } from '@open-wc/testing';

import '../src/components/di-spinner.js';

describe('DiSppinner', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<di-spinner></di-spinner>`);
  });

  it('should open the spinner', () => {
    element.open();
    expect(element.opened).to.be.true;
  });

  it('should close the spinner', () => {
    element.open();
    element.close();
    expect(element.opened).to.be.false;
  });
});
