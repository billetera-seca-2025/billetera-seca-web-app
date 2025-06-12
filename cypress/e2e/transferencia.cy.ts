describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.sm\\:flex-row > .border').click();
    cy.get('#email').type('prueba@mail.com');
    cy.get('#password').clear();
    cy.get('#password').type('contraseña');
    cy.get('.flex-col > .inline-flex').click();
    cy.get('.from-blue-50').click();
    cy.get('#recipient').type('rocio@mail.com');
    cy.get('#amount').clear();
    cy.get('#amount').type('8000');
    cy.get('#description').type('Prueba');
    cy.get('form > .flex.items-center > .inline-flex').click();
    cy.get('.flex.gap-4 > .hidden > .inline-flex').click();
    cy.get('.sm\\:flex-row > .border').click();
    cy.get('#email').type('rocio@mail.com');
    cy.get('#password').clear();
    cy.get('#password').type('rocio123');
    cy.get('.flex-col > .inline-flex').click();
    /* ==== End Cypress Studio ==== */
  })
})