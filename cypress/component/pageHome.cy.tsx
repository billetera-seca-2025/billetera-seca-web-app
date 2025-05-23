import React from 'react';
import Home from "@/app/page";
import { TEXT } from "@/lib/constants";

describe('Home Component', () => {
    beforeEach(() => {
        cy.mount(<Home />);
    });

    it('should render the main title and subtitle', () => {
        cy.contains('h1', TEXT.home.title).should('be.visible');
        cy.contains(TEXT.home.subtitle).should('be.visible');
    });

    it('should display the Create Account and Login buttons', () => {
        cy.contains('a', TEXT.home.createAccount).should('exist');
        cy.contains('a', TEXT.home.login).should('exist');
    });

    it('should render the three feature cards with correct labels and buttons', () => {
        cy.contains(TEXT.home.accountManagement.title).should('be.visible');
        cy.contains(TEXT.home.p2pTransfers.title).should('be.visible');
        cy.contains(TEXT.home.bankIntegration.title).should('be.visible');

        cy.contains(TEXT.home.accountManagement.cta).should('exist');
        cy.contains(TEXT.home.p2pTransfers.cta).should('exist');
        cy.contains(TEXT.home.bankIntegration.cta).should('exist');
    });
});
