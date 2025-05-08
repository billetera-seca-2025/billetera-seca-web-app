import {TEXT} from "../../../lib/constants";

describe('Home Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it('should render all main elements', () => {
        cy.contains('h1', TEXT.home.title).should('be.visible');

        cy.get('.bg-card').should('have.length', 3);

        cy.contains('a', TEXT.auth.register.loginLink).should('exist');
        cy.contains('a', TEXT.auth.login.registerLink).should('exist');
    });

    it('should navigate to /register when clicking create account', () => {
        cy.contains(TEXT.auth.register.title).click();
        cy.url().should('include', '/register');
    });

    it('should navigate to /login when clicking login', () => {
        cy.contains(TEXT.auth.login.title).click();
        cy.url().should('include', '/login');
    });

    it('should navigate to the correct links', () => {
        cy.get('[href="/register"]').should('have.length', 5);
    });

    it('should render correctly on mobile devices', () => {
        cy.viewport('iphone-6'); // Simula un iPhone 6
        cy.visit('http://localhost:3000/');
        cy.get('h1').should('be.visible');
    });
});