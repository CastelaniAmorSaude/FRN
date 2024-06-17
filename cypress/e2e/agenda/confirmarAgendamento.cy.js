/// <reference types="Cypress"/>

describe('FRN - Validação tela confirmar agendamento', () => {
    
    beforeEach(() => {
        cy.login()
        cy.visit('/schedule/confirm-schedule')        
    });

    it('Validar breadcrumb da tela ', () => {
        cy.get('a[routerlink="/home"]').should('be.visible')
        cy.get('a[routerlink="/schedule/schedule-appointment"]').should('be.visible')
        cy.get('a[routerlink="/schedule/confirm-schedule"]').should('be.visible')
    });

    it('Validar nome da tela', () => {
        cy.get('h3[class="text-primary fs-4 m-0 fw-bold"]')
            .should('be.visible')
            .should('have.text', 'Confirmar agendamentos')
    });

    it('Validar subtítulo da tela', () => {
        cy.get('div[class="py-4"]')
            .should('be.visible')
            .should('have.text', 'Confirmar agendamentos')
    });

    it('Validar campo Paciente', () => {
        cy.get('#paciente')
            .should('be.visible')
            .should('have.attr', 'role', 'combobox')
        cy.get('#paciente').click()
        cy.get('#paciente-panel')
            .should('be.visible')    
            .should('have.attr', 'role', 'listbox')
        cy.get('#paciente-panel').within(() => {
            cy.get('input')
                .should('be.visible')
                .should('have.attr', 'placeholder', 'Pesquisar...')
                .should('have.attr', 'autocomplete', 'off')
        }) 
    }); 

    it('Selecionando paciente no campo paciente', () => {
        cy.get('#paciente').click()        
        cy.get('#paciente_search').type('11701035618')
        cy.contains('span', '11701035618')
            .should('be.visible')    
            .click()
        cy.get('#paciente').within(() => {
            cy.get('span.mat-select-min-line')
                .should('have.text', 'Pedro Henrique Castelani - 11701035618')
        })        
    });

    
});