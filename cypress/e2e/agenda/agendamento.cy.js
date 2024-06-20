/// <reference types="Cypress"/>

describe('FRN - Validação Agendamento ', () => {
  cy.slotVazio()
  cy.agendamento()
  
});

describe('FRN - Validação função Cashback', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/schedule/schedule-appointment?especialidadeId=616&profissionalId=1958')
    });
    
    it('Interceptando API cashback para ter o timeout', () => {
        cy.intercept(
          'GET',
          'https://amei-staging.amorsaude.com.br/api/v1/cartao-todos/cashback?matriculaoucpf=11701035618',
          { statusCode: 400, body: {
            mensagem:  "Validação de valores de cashback indisponível. Favor contatar a Central do Cartão de Todos."
          } },
        ).as('APIError')
        
        cy.get('.cal-day-column').eq(6).within(() => {
          cy.contains('23:40').click()
        })
        cy.get('#cpf').type('11701035618 {enter}')
        cy.wait('@APIError')
        cy.get('.mat-simple-snack-bar-content').should('be.visible')        
      });
});