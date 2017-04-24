import { SamplePage } from './app.po';

describe('sample App', () => {
  let page: SamplePage;

  beforeEach(() => {
    page = new SamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
