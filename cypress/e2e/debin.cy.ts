describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.sm\\:flex-row > .border').click();
    cy.get('#email').type('prueba@mail.com');
    cy.get('#password').clear();
    cy.get('#password').type('contraseña');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.flex-col > .inline-flex').click();
    /* ==== End Cypress Studio ==== */
  })
})