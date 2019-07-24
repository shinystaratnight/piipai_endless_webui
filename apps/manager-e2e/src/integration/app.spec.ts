import { getGreeting } from '../support/app.po';

describe('manager', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to manager!');
  });
});
