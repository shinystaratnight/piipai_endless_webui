import { getGreeting } from '../support/app.po';

describe('candidate', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to candidate!');
  });
});
