describe('Register', () => {
    it('should create a new account', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:3000/register');
        // @ts-ignore
        cy.get('#email').clear('p');
        cy.get('#email').type('prueba@mail.com');
        // @ts-ignore
        cy.get('#password').clear('c');
        cy.get('#password').type('contraseña');
        // @ts-ignore
        cy.get('#confirmPassword').clear('c');
        cy.get('#confirmPassword').type('contraseña');
        cy.get('.flex-col > .inline-flex').click();
        /* ==== End Cypress Studio ==== */
    });
});
