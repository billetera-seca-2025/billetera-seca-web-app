describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.hidden > .hover\\:bg-accent').click();
    // @ts-ignore
      cy.get('#email').clear('u');
    cy.get('#email').type('usuario@ejemplo.com');
    cy.get('#password').clear();
    cy.get('#password').type('password123');
    cy.get('.flex-col > .inline-flex').click();
    cy.get('.hidden > .inline-flex').click();
    /* ==== End Cypress Studio ==== */
  })
})


