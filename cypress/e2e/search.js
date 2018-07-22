describe('Search', () => {
  beforeEach(() => {
    cy.visit('/').clearServiceWorkerRegistrations();
  });

  it('shows matching contacts', () => {
    cy.getByLabelText('Filter list of contacts').type('Fry');
  });
});
