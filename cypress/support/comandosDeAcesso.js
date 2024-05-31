const user = Cypress.env('user_name_Admin')
const password = Cypress.env('user_password_Admin')

Cypress.Commands.add('telaLogin', () => {
    cy.visit(Cypress.env('url_stag'))
    cy.title().should('be.equal', 'Amei')
}) 

Cypress.Commands.add('login', () => {
    cy.visit('/')    
    cy.get("#E-mail").type(user)
    cy.get("#Senha").type(password, {log: false})
    cy.get("#login").click()
    cy.get("#Unidade").type("Unidade Teste{enter}")
    cy.get("#EntrarUnidade").click()
    cy.contains('span', 'staging')
  // cy.session(user, login)
})


Cypress.Commands.add('loginPerfil_adm', (
  user = Cypress.env('user_name_Admin'),
  password = Cypress.env('user_password_Admin'),
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
    cy.session([user, password], login, options)
  } else {
    login()
  }  
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