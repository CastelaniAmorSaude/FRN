describe('telemedicinaAmei', () => {

  beforeEach(() => {
    cy.visit('https://amei-staging.amorsaude.com.br/login')
  });
  it('passes', () => {    
  })

  it('validarTitle', () => {    
    cy.title('Amei').should('eq', 'Amei')
  })
  it('mantermeconectado', () => {
    cy.contains('span', 'Manter-me').should('have.text', ' Manter-me conectado(a)')
  })

  it('Validar se existe o campo E-mail', () => {
    cy.get('#E-mail').should('be.visible')
  })
  it('Validar a nomeação do placeholder do campo E-mail', () => {
    cy.get('#E-mail').should('have.attr', 'data-placeholder', 'E-mail')
  })
  it('Validar se a nomeação do placeholder não é diferente de E-mail', () => {
    cy.get('#E-mail').invoke('attr', 'data-placeholder', ).should('eq', 'E-mail')    
  })
  it('Validar campo E-mail com um e-mail inválido', () => {
    cy.get('#E-mail').type('teste@teste@teste.com.com')
    cy.contains('span', 'Entrar').click()
    cy.contains('Dados incorretos. Por favor, revise seus dados e tente novamente.').should('be.visible')
  });
  it('Validar mensagem de erro ao deixar o campo e-mail vazio', () => {
    cy.get('#E-mail')
    cy.contains('span', 'Entrar').click()
    cy.contains('mat-error', 'Por favor, digite seu usuário (e-mail de cadastro)!').should('be.visible')
  });  
  it.only('validar inclusao de grade do profissional', () => {
    cy.visit('/')
    cy.get('#E-mail').type('larissa.mattozo@amorsaude.com')
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
  })
    cy.get('#Senha').type('Mc100722!')
    cy.get('#login').click()
    cy.get('#Unidade').click()
    cy.contains('span', ' Telemedicina ').click()
    cy.get('#EntrarUnidade').click()
    cy.get('#register').click()
    cy.contains('span', 'Lista de profissionais').click()
    cy.contains('div', 'Procure por CPF ou nome').type('Beatriz T Medica Stg {enter}')
    cy.contains('span', 'edit').click()
    cy.contains('span', 'Horários de atendimento').click()
    cy.contains('button', 'Incluir').click()
    cy.get('.mat-checkbox-layout').eq(4).click()
   
  })

  it('Criando profissional', () => {
    cy.login()
    cadastroProfissionais()
  });
})