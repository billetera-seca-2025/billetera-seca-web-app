describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/login')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#email').clear();
    cy.get('#email').type('prueba@mail.com');
    cy.get('#password').clear();
    cy.get('#password').type('contraseña');
    cy.get('.flex-col > .inline-flex').click();
    /* ==== End Cypress Studio ==== */
  })
})
