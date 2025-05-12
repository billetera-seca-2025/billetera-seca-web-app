import React from 'react';
import { mount } from 'cypress/react';
import { FeatureCard } from '@/components/feature-card';
import { Wallet } from 'lucide-react';

describe('FeatureCard Component', () => {
    it('renders correctly with props', () => {
        mount(
            <FeatureCard
                Icon={Wallet}
                title="Billetera Digital"
                description="La manera más segura de manejar tu dinero."
                content="Regístrate para administrar tus finanzas como un profesional."
                cta="Empezar"
                href="/register"
            />
        );

        cy.get('svg').should('have.class', 'h-12 w-12');

        cy.contains('Billetera Digital').should('exist');

        cy.contains('La manera más segura de manejar tu dinero.').should('exist');
        cy.contains('Regístrate para administrar tus finanzas como un profesional.').should('exist');

        cy.contains('Empezar').should('exist');

        cy.get('a').contains('Empezar').should('have.attr', 'href', '/register');
    });

    it('responds to hover effects', () => {
        mount(
            <FeatureCard
                Icon={Wallet}
                title="Cuenta Digital"
                description="Prueba nuestros servicios de cuenta."
                content="Gestiona tus cuentas fácilmente."
                cta="Más Información"
                href="/learn-more"
            />
        );

        cy.get('.shadow-md')
            .trigger('mouseover')
            .should('have.class', 'hover:shadow-lg');
    });
});