describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.sm\\:flex-row > .border').click();
    cy.get('#email').clear();
    cy.get('#email').type('prueba@mail.com');
    cy.get('#password').clear();
    cy.get('#password').type('contraseña');
    cy.get('.flex-col > .inline-flex').click();
    cy.get('main > .container').click();
    cy.get('#radix-«r2»-trigger-expenses').click();
    cy.get('[dir="ltr"] > :nth-child(1) > .gap-2').click();
    /* ==== End Cypress Studio ==== */
  })
})
