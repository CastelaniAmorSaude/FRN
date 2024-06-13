/// <reference types="Cypress"/>

describe('FRN - Atribuição de funcionário para o caixa', () => {
    
    beforeEach(() => {
        cy.login()
        cy.visit('/financial/box') 
               
    });

    it('Botão Detalhar visível', () => {
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.contains('Detalhar').should('be.visible')     
        })   
    });

    it('Validação nome do caixa', () => {
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.contains('Detalhar').click({force: true})     
        })
        cy.contains('h2', ' Detalhes do caixa - Caixa QA teste automatizados ').should('be.visible')
    });

    it('Validação botão fechar', () => {
        cy.caixaFechado()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.contains('Detalhar').click({force: true})     
        })

        cy.contains('h2', ' Detalhes do caixa - Caixa QA teste automatizados ').within(() => {
            cy.contains('span', 'close').should('be.visible')
        })
    });

    it('Validação status do caixa', () => {
        cy.caixaFechado()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.contains('Detalhar').click({force: true})     
        })

        cy.contains('h3', ' Status do fechamento : ')
            .should('be.visible')
            .should('have.text', ' Status do fechamento : Fechado')            
    });

    it('Validação botão Lançar Saldo Inicial', () => {
        cy.caixaFechado()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.contains('Detalhar').click({force: true})     
        })

        cy.contains('p', 'Lançar Saldo Inicial').should('be.visible')
    });

    it('Validação botão Reabrir caixa', () => {
        cy.caixaFechado()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.contains('Detalhar').click({force: true})     
        })

        cy.contains('p', 'Reabrir caixa').should('be.visible')
    });
    it('Atribuição de caixa com sucesso', () => {

    //Selecionar caixa com status "Fechado"
        cy.caixaFechado()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado ')
        })

    //Atribuir caixa para um funcionário     
        cy.atribuirFuncionario()
        cy.validacaoFuncionario()

    //Abrindo caixinha do funcionário
        cy.abrirCaixa()

    //Fechando caixinha do funcionário
        cy.fecharCaixa()
        cy.validacaoFechadoSemDivergencia() 
        
    //Aprovando fechamento do caixa
        cy.aprovarFechamento()
        cy.validacaoFechamentoEAprovado()
    });

    it('Atribuição de caixa para o funcionário que já tem caixa atribuido', () => {
    //Pré-requisitos para o teste
        cy.caixaFechado()
        cy.atribuirFuncionario()
        cy.validacaoFuncionario()
        cy.abrirCaixa()   

    //Testando o cenário
        cy.contains('tr', 'Verificação').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado ')
            cy.contains('Detalhar').click({force: true})     
        })
        cy.contains('p', 'Lançar Saldo Inicial').click()
        cy.get('.mat-select-min-line').click()
        cy.xpath('//span[@class="mat-option-text"][contains(.,"QA teste Funcionario")]').click()
        cy.contains('Salvar').click()
        cy.get('#swal2-html-container').should('have.text', 'ATENÇÃO! O usuário já está com caixa aberto ou atribuido com saldo inicial nesta data')
        cy.contains('button', 'Ok').click()
        cy.contains('h2', ' Saldo incial para abertura de caixa ').within(()=> {
            cy.contains('span', 'close').click()})
        cy.contains('h2', ' Detalhes do caixa - Verificação ').within(()=> {
            cy.contains('span', 'close').click()})  
    
    //Validando o teste
        cy.reload()       
        cy.contains('tr', 'Verificação').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado ')
        })

    //Limpando o teste
        cy.fecharCaixa()
        cy.validacaoFechadoSemDivergencia()
    });

    it('Atribuição de caixa, sem informar funcionário responsável', () => {
    //Selecionar caixa com status Fechado
        cy.caixaFechado()

    //Testando o cenário
        cy.contains('tr', 'Verificação').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado ')
            cy.contains('Detalhar').click({force: true})     
        })
        cy.contains('p', 'Lançar Saldo Inicial').click()
        cy.contains('span', 'Selecione um funcionário').should('have.text', 'Selecione um funcionário')        
        cy.contains('Salvar').click()

    //Validando o teste
        cy.get('#swal2-title').should('have.text', 'Precisa selecionar um funcionário')        
        cy.contains('button', 'Ok').click()

        cy.reload()
        cy.contains('tr', 'Verificação').within(()=> {
            cy.get('.cdk-column-usuario').should('have.text', '')
        })
    });
});

describe('FRN - Abrir caixa funcionário', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/financial/box')
    });

    it('Menu caixa pessoal visível', () => {
        cy.get('#open-financial').should('be.visible')
    });

    it('Validação nome do caixa pessoal', () => {
    //Pré-requisitos para o teste
        cy.caixaFechado()
        cy.atribuirFuncionario()

    //Testando o cenário
        cy.get('#open-financial').click()        
        cy.contains('h2', ' Meu caixa - Caixa QA teste automatizados ').should('be.visible')
        cy.contains('h2', ' Meu caixa - Caixa QA teste automatizados ').within(()=> {
            cy.contains('span', 'close').click()
        })
    
    //Limpando o teste
        cy.abrirCaixa()
        cy.fecharCaixa()
        cy.aprovarFechamento()
    });
    it('Validando nome do usuário no caixa pessoal', () => {
    //Pré-requisitos para o teste
        cy.caixaFechado()
        cy.atribuirFuncionario()

    //Testando o cenário
        cy.get('#open-financial').click()
        cy.get('#user-full-name').should('have.text', 'QA teste Funcionario')
        cy.contains('h2', ' Meu caixa - Caixa QA teste automatizados ').within(()=> {
            cy.contains('span', 'close').click()
        })
    
    //Limpando o teste
        cy.abrirCaixa()
        cy.fecharCaixa()
        cy.aprovarFechamento()
    });

    it('Validando botão Abrir Caixa', () => {
        cy.caixaFechado()
        cy.atribuirFuncionario()

        cy.get('#open-financial').click()
        cy.contains('Abrir Caixa').should('be.visible')
        cy.contains('h2', ' Meu caixa - Caixa QA teste automatizados ').within(() => {
            cy.contains('span', 'close').click()
        })

    //Limpando o teste
        cy.abrirCaixa()
        cy.fecharCaixa()
        cy.aprovarFechamento()
    });

    it('Abrir caixa atribuído para o funcionário', () => {
    //Pré-requisitos para o teste
        cy.caixaFechado()
        cy.atribuirFuncionario()

    //Testando o cenário
    cy.get('#open-financial').click()
    cy.get('#user-full-name').should('have.text', 'QA teste Funcionario')
    cy.contains('h2', ' Meu caixa - Caixa QA teste automatizados ').should('be.visible')
    cy.contains('Abrir Caixa').click()
    cy.contains('Ok').click() 
    cy.contains('h2', ' Detalhamento de Caixa - Caixa QA teste automatizados ').within(()=> {
        cy.contains('span', 'close').click()
    })

    //Validando o teste        
        cy.validacaoFuncionario()        

    //Limpando o teste
        cy.fecharCaixa()
        cy.aprovarFechamento()
    });

    it('Abrir caixa sem atribuição de funcionário', () => {
    //Testando o cenário    
        cy.get('#open-financial').click()
        cy.get('#swal2-title')
            .should('be.visible')
            .should('have.text', 'Seu usuário não possui guichê/caixa configurado')
        cy.get('#swal2-html-container')
            .should('be.visible')
            .should('have.text', 'Por favor, entre em contato com o gestor ou responsável financeiro da unidade.')
        cy.contains('button', 'Ok').click()
    });
});

describe('FRN - Validação dos status do caixa', () => {
    
    beforeEach(() => {
        cy.login()
        cy.visit('/financial/box')
    });

    it('Validação caixa com status Fechado', () => {
        cy.caixaFechado()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado ')
        })        
    });

    it('Validação caixa com status Saldo inicial', () => {
        cy.caixaFechado()
        cy.atribuirFuncionario()

        cy.validacaoSaldoInicial()

        cy.abrirCaixa()
        cy.fecharCaixa()
    });

    it('Validação caixa com status Aberto', () => {
        cy.caixaFechado()
        cy.atribuirFuncionario()
        cy.abrirCaixa()

        cy.validacaoAberto()

        cy.fecharCaixa()
    });

    it('Validação caixa com status Fechado sem divergência', () => {
        cy.caixaFechado()
        cy.atribuirFuncionario()
        cy.abrirCaixa()
        cy.fecharCaixa()

        cy.validacaoFechadoSemDivergencia()
    });

    it('Validação caixa com status Fechado com divergência', () => {
        cy.caixaFechado()
        cy.atribuirFuncionario()
        cy.abrirCaixa()

        cy.get('#open-financial').click()
        cy.get('textarea[placeholder="Observações"]').type('Teste')
        cy.get('input[formcontrolname="saldoPrevisto"]').type('1')        
        cy.contains('p', 'Fechar Caixa').click()
        cy.contains('button', 'Sim').click()
        cy.get('#swal2-title')
            .should('have.text', 'Sucesso')
        cy.contains('button', 'Ok').click()
        
        cy.validacaoFechadoComDivergencia()
    });

    it('Validação caixa com status Fechado e Aprovado', () => {
        cy.caixaFechado()
        cy.atribuirFuncionario()
        cy.abrirCaixa()
        cy.fecharCaixa()

        cy.reload()
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado sem divergência ')
            cy.contains('Detalhar').click({force: true})     
        }) 
        cy.contains('p', 'Aprovar Fechamento')
            .should('be.visible')  
            .click()
        cy.get('#swal2-html-container').should('be.visible').within(() => {
            cy.get('textarea[placeholder="Digite aqui o motivo da aprovação"]')
                .should('be.visible')
                .type('Teste')
        })
        cy.contains('button', 'Confirmar').click()
        cy.get('#swal2-html-container')
            .should('be.visible')
            .should('have.text', 'Fechamento de caixa aprovado com sucesso.')
        cy.contains('button', 'Ok').click()    
        
        cy.contains('tr', 'Caixa QA teste automatizados').within(()=> {
            cy.get('.cdk-column-flgStatusCaixa').should('have.text', ' Fechado e Aprovado ')
        })
    });
    
});