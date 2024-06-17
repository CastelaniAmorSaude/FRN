const user = Cypress.env('user_name_Admin')
const password = Cypress.env('user_password_Admin')

Cypress.Commands.add('telaLogin', () => {
    cy.visit(Cypress.env('url_stag'))
    cy.title().should('be.equal', 'Amei')
}) 

Cypress.Commands.add('login', (
  user = Cypress.env('user_name_Admin'),
  password = Cypress.env('user_password_Admin')) => {
    cy.session([user, password], () => {
    cy.visit(Cypress.env('url_stag'))
      cy.get("#E-mail").type(user)
      cy.get("#Senha").type(password, {log:false})
      cy.get("#login").click()
      cy.get("#Unidade").type("Unidade Teste{enter}")
      cy.get("#EntrarUnidade").click()
      cy.get('#schedule').click()
      cy.url().should('contain', '/schedule/schedule-appointment')
    })
  })  



Cypress.Commands.add('validarPermissao', () => {
  cy.get('body').then($body => {
    if ($body.find('#swal2-title').length > 0) { //Avalia se o modal de erro de permissão existe
      cy.get('#swal2-title').then($header => {
        if($header.is(':visible'))             //Verifica se o botão existe e está visível
        cy.contains('button', 'Ok').click()
        cy.get("#E-mail").type(user)
        cy.get("#Senha").type(password)
        cy.get("#login").click()
        cy.get("#Unidade").type("Unidade Teste{enter}")
        cy.get("#EntrarUnidade").click()
        cy.get('#schedule').click()
        cy.url().should('contain', '/schedule/schedule-appointment')        
      })
    } 
  })
})

Cypress.Commands.add('loginPerfil_Professional', (
  user = Cypress.env('user_name_Profissional'),
  password = Cypress.env('user_password_Profissional'),
  {cacheSession = true} = {},
) => {
  const login = () => {
    cy.visit(Cypress.env('url_stag'))

  
    
  cy.get("#E-mail").type(user); 
  cy.get("#Senha").type(password);
    cy.get("#login").click();

    cy.get("#Unidade").type("Unidade Teste{enter}");
    cy.get("#EntrarUnidade").click();
  }
  
  const options = {
    cacheAcrossSpecs: true,
  }

  if (cacheSession) {
    cy.session(user, login, options)
  } else {
    login()
  }
})



Cypress.Commands.add('logout', () => {
    cy.get('usuario-logado')
      .should('be.visible')
      .click()
    cy.contains('Sair')
      .should('be.visible')
      .click()
    cy.title().should('be.equal', 'Amei!')
})


Cypress.Commands.add('cadastroProfissionais', () => {
  cy.get('#register')
    .should('be.visible', 'Cadastro')
    .click()
  cy.contains('Lista de profissionais')
    .should('be.visible')
    .click() 
  cy.contains('Cadastro do profissional')
    .should('be.visible')
    .click()
  cy.contains('input=["cpf"]')
    .type()
})