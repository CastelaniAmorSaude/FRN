Cypress.Commands.add('slotVazio', () => {
  cy.visit('/schedule/schedule-appointment') 
   
  // Obtém a hora atual
    const now = new Date()

    cy.get('#area_atuacao').click()
    cy.get('#area_atuacao_search').type('Cardiologia').click()
    cy.contains('mat-option', 'Cardiologia').click()

    cy.get('#profissional').click()
    cy.get('#profissional_search').type('Pedro Teste').click()
    cy.contains('mat-option', 'Pedro Teste').click()

    cy.contains('span', 'Pesquisar').click()

    // Identifica a div do dia atual
    cy.get('.calendar-overview').within(() => {
      cy.get('.cal-day-headers .cal-today').then(($todayDiv) => {
        const todayIndex = $todayDiv.index()

        // Seleciona a coluna de horários referente ao dia atual
        cy.get('.cal-day-columns .cal-day-column').eq(todayIndex).within(() => {
          // Encontra o primeiro slot de horário vazio
          cy.get('.cal-hour-segment').each(($hourDiv) => {
            if ($hourDiv.length) {
              // Obtém o texto do horário
              const timeText = $hourDiv.find('.cal-time').text().trim()

              // Converte o timeText em um objeto Date para comparação
              const slotDateTime = new Date(now);
              const [hours, minutes] = timeText.split(':')
              slotDateTime.setHours(hours)
              slotDateTime.setMinutes(minutes)

              // Verifica se o slot é maior que a hora atual e se está vazio
              if (slotDateTime > now && !$hourDiv.find('span[title]').length) {
                // Seleciona o slot se atender aos critérios
                cy.wrap($hourDiv).click()
                return false; // Interrompe o each após selecionar o slot
              }
            }
          })
        })
      })
    })
   cy.contains('Agendar paciente').should('be.visible')   
})

Cypress.Commands.add('agendamento', () => {
    cy.get('#cpf').type('11701035618')
    cy.get('mat-select[formcontrolname="priceTable"]').within(() => {
      cy.get('.mat-select-min-line').should('have.text', 'Cartão de TODOS')      
    })
    cy.contains('button', ' + Incluir procedimento ')
      .should('be.visible')
      .click()
    cy.get('div[class="cdk-overlay-pane"]').within(() => {
      cy.get('mat-select[role="combobox"]').click()
    })
    cy.xpath('//span[@class="mat-option-text"][contains(., " consulta teste ")]').click()
    cy.contains('span', ' Adicionar ').click()
    cy.contains('span', ' Confirmar ').click()
    cy.get('#swal2-title')
      .should('be.visible')
      .should('have.text', 'Agendamento criado com sucesso')
    cy.contains('button', 'Ok').click()
})
