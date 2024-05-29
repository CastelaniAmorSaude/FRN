/// <reference types="Cypress" />



describe('Definição da quantidade de parcelas em cartão de crédito - proposta', () => {
    beforeEach(() => {
        cy.login();
        cy.createProposalI()     
    });

    it('gui_ValidarCampoParcelasComValor1ComoDefault', () => {
        
        cy.contains('span', 'Cartão de Crédito').click()
        cy.contains('span', '1').should('be.visible')
    });

    it('gui_ValidarFunçõesDePagamentoEmDinheiroOuPIX', () => {
        
        cy.contains('span', 'Dinheiro').click()
        cy.contains('span', 'Parcelas').should('not.be.exist')
        cy.contains('keyboard_backspace').click()
        cy.contains('span', 'PIX').click()
        cy.contains('span', 'Parcelas').should('not.be.exist')
    });

    it('gui_LimiteDeParcelas', () => {
         
        cy.contains('span', 'Cartão de Crédito').click()
        cy.contains('span', '1').click()
        cy.get('div[role="listbox"]').within(() => {                // limita a busca das options dentro do select.
            let maxNumber = 0                                       //variável para salvar o valor máximo
            cy.get('mat-option[role="option"]>span')                //seleciona todas as options dentro do elemento do cy.get()
                .each(($option) => {                                //itera sobre cada option encontrada
                    const value = parseInt($option.text().trim())   //extrai o texto de cada option, converte para um número inteiro e remove espaços em branco
                cy.wrap(value).should('be.gte', maxNumber)          // Verifica se o valor é maior ou igual ao máximo atual
                    maxNumber = Math.max(maxNumber, value)          // Atualiza o máximo se encontrar um valor maior
                }).then(() => {
            cy.wrap(maxNumber).should('eq', 12)                     //verifica se o valor máximo encontrado é igual a 12
                })            
        }) 
    });

    it('gui_MinimoDeParcelasEmCartãoDeCrédito', () => {
        cy.contains('span', 'Cartão de Crédito').click()
        cy.contains('span', '1').click()
        cy.get('div[role="listbox"]').within(() => {                // limita a busca das options dentro do select.
            cy.get('mat-option[role="option"]>span')                //seleciona todas as options dentro do elemento do cy.get()
                .each(($option) => {                                //itera sobre cada option encontrada
                    const value = parseInt($option.text().trim())   //extrai o texto de cada option, converte para um número inteiro e remove espaços em branco
                    cy.wrap(value).should('be.gte', 1)              //verifica se o valor mínimo encontrado é maior ou igual a 1
            })
        })
    })

    it('gui_DesabilitaçãoDoToggleTEF', () => {
       
        cy.contains('span', 'Cartão de Crédito').click()
        cy.get('span[class="mat-slide-toggle-bar"]>input').should('have.attr', 'aria-checked', 'true')
        cy.get('label[class="mat-slide-toggle-label"]')
            .click()
        cy.get('span[class="mat-slide-toggle-bar"]>input')
            .should('have.attr', 'aria-checked', 'false')            
        cy.contains('span', '1').should('be.visible')
    });
});