Cypress.Commands.add('caixaFechado', () => {
    cy.get('#financial').click()
    cy.contains('span', 'Caixas').click()
    cy.get('#dateInit').clear({force: true}).type('01/06/2024')
    cy.contains('p', 'Filtrar').click()
    
})
Cypress.Commands.add('atribuirFuncionario', () => {
    cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
        cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado ')
        cy.contains('Detalhar').click({force: true})     
    })   
    cy.contains('p', 'Lançar Saldo Inicial').click()
    cy.get('.mat-select-min-line').click()
    cy.xpath('//span[@class="mat-option-text"][contains(.,"QA teste Funcionario")]').click()
    cy.contains('Salvar').click()
    cy.get('#swal2-html-container').should('have.text', 'Caixa criado com sucesso.')
    cy.contains('button', 'Ok').click()    
    cy.contains('h2', ' Detalhes do caixa - Caixa QA teste automatizados ').within(()=> {
        cy.contains('span', 'close').click()}) 

})
Cypress.Commands.add('abrirCaixa', () => {
    cy.get('#open-financial').click()
    cy.contains('Abrir Caixa').click()
    cy.contains('Ok').click() 
    cy.contains('h2', ' Detalhamento de Caixa - Caixa QA teste automatizados ').within(()=> {
        cy.contains('span', 'close').click()
    })
})

Cypress.Commands.add('fecharCaixa', () => {
    cy.get('#open-financial').click()   
    cy.get('input[formcontrolname="saldoPrevisto"]')
        .should('have.attr', 'placeholder', 'Valor em dinheiro')
        .type('0,00')        
    cy.contains('p', 'Fechar Caixa').click()
    cy.contains('button', 'Sim').click()
    cy.get('#swal2-title')
        .should('be.visible') 
        .should('have.text', 'Sucesso')
    cy.contains('button', 'Ok').click()
})

Cypress.Commands.add('aprovarFechamento', () => {
    cy.reload()
    cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
        cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado sem divergência ')
        cy.contains('Detalhar').click({force: true})     
    }) 
    cy.contains('p', 'Aprovar Fechamento').click()
    cy.get('textarea[placeholder="Digite aqui o motivo da aprovação"]').type('Teste')        
    cy.contains('button', 'Confirmar').click()
    cy.contains('button', 'Ok').click()
})












Cypress.Commands.add('validacaoFuncionario', () => {
    cy.reload()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.get('.cdk-column-usuario').should('have.text', 'QA teste Funcionario')
        })
})

Cypress.Commands.add('validacaoSaldoInicial', () => {
    cy.reload()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Saldo inicial ')            
        })
})

Cypress.Commands.add('validacaoAberto', () => {    
    cy.reload()       
    cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
        cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Aberto ')
    })
})

Cypress.Commands.add('validacaoFechado', () => {    
    cy.reload()       
    cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
        cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado ')
    })
})

Cypress.Commands.add('validacaoFechadoSemDivergencia', () => {
    cy.reload()
    cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
        cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado sem divergência ')
    })
})

Cypress.Commands.add('validacaoFechadoComDivergencia', () => {
    cy.reload()
    cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
        cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado com divergência ')
    })
})

Cypress.Commands.add('validacaoFechamentoEAprovado', () => {    
    cy.reload()    
    cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
        cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado e Aprovado ')
    })

})