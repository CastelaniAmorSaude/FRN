/// <reference types="Cypress"/>

describe('FRN- Atribuição caixa', () => {
    
    beforeEach(() => {
        cy.login() 
               
    });

    it('Atribuição de caixa com sucesso', () => {
        cy.get('#financial').click()
        cy.contains('span', 'Caixas').click()
        cy.get('#caixa-93').click({force: true})
        cy.contains('p', 'Lançar Saldo Inicial').click()
        cy.get('.mat-select-min-line').click()
        cy.contains('span', 'QA teste Funcionario').click()
        cy.contains('Salvar').click()
        cy.get('#swal2-html-container').should('have.text', 'Caixa criado com sucesso.')
        cy.contains('button', 'Ok').click()
    });
    it('Atribuição de caixa para o funcionário que já tem caixa atribuido', () => {
        cy.get('#financial').click()
        cy.contains('span', 'Caixas').click()
        cy.get('#caixa-93').click({force: true})
        cy.contains('p', 'Lançar Saldo Inicial').click()
        cy.get('.mat-select-min-line').click()
        cy.contains('span', 'QA teste Funcionario').click()
        cy.contains('Salvar').click()
        cy.get('#swal2-html-container').should('have.text', 'ATENÇÃO! O usuário já está com caixa aberto ou atribuido com saldo inicial nesta data')
        cy.contains('button', 'Ok').click()    
    });

    it.only('Atribuição de caixa, sem informar funcionário responsável', () => {
        cy.get('#financial').click()
        cy.contains('span', 'Caixas').click()
        cy.get('#caixa-93').click({force: true})
        cy.contains('p', 'Lançar Saldo Inicial').click()
        cy.contains('Salvar').click()
        cy.get('#swal2-title').should('have.text', 'Precisa selecionar um funcionário')
        cy.contains('button', 'Ok').click()
    });
});