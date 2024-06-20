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

    it('Validar data atual como default no campo Data Início', () => {
        const now = new Date()
        const day = String(now.getDate()).padStart(2, '0')
        const month = String(now.getMonth() + 1).padStart(2, '0') // Janeiro é 0!
        const year = now.getFullYear()
        const today = `${day}/${month}/${year}`

       
        cy.get('#dateInit')
            .should('be.visible')
            .invoke('val')
            .then((dataValue) => {
                expect(dataValue).to.equal(today)
            })        
    });

    it('Validar obrigatoriedade do campo Data Início', () => {
        cy.get('#dateInit').should('have.attr', 'required')
        cy.get('#dateInit').clear()
        cy.contains('span', 'Pesquisar').click()

        cy.get('mat-error')
            .should('be.visible')
            .should('have.text', ' *Campo obrigatório. ')        
    })
    
    it('Validação campo Data Fim', () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        const day = String(tomorrow.getDate()).padStart(2, '0');
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        const year = tomorrow.getFullYear();
        const tomorrowDate = `${day}/${month}/${year}`;

    // Seleciona o campo de data pelo ID
        cy.get('#dateEnd')
        .should('be.visible')
        .invoke('val')
        .then((dateValue) => {
    // Compara o valor do campo de data com a data de amanhã
            expect(dateValue).to.equal(tomorrowDate);
        })
    })

    it('Validar obrigatoriedade do campo Data Início', () => {
        cy.get('#dateEnd').should('have.attr', 'required')
        cy.get('#dateEnd').clear()
        cy.contains('span', 'Pesquisar').click()

        cy.get('mat-error')
            .should('be.visible')
            .should('have.text', ' *Campo obrigatório. ')        
    })
        
    it('Validar opção Agendado como default no campo Status', () => {
        cy.get('#status')
            .should('be.visible')
        cy.get('#status .mat-select-value-text').should('contain.text', 'Agendado');
    });

    it('Validar obrigatoriedade do campo Status', () => {
        cy.get('#status').click()
        cy.get('mat-pseudo-checkbox.mat-pseudo-checkbox-checked').click()
        cy.get('body').click()
        cy.contains('span', 'Pesquisar').click()

        cy.get('#swal2-title')
            .should('be.visible')
            .should('have.text', 'Precisa preencher todos os campos')
        cy.contains('button', 'Ok').click()

        cy.get('mat-error')
            .should('be.visible')
            .should('have.text', ' *Campo obrigatório. ')
        
    });

    it('Validar quantidade e nomeclatura das opções do campo Status', () => {
        cy.get('#status').click()

    // Verifica se há quatro opções
        cy.get('mat-option').should('have.length', 4)

    // Verifica os nomes das opções
        const expectedOptions = ['Agendado', 'Desmarcado pela clínica', 'Desmarcado pelo paciente', 'Marcado - Confirmado']
    
        cy.get('mat-option').each(($el, index) => {
            cy.wrap($el).should('contain.text', expectedOptions[index])
        
        });
    })

    it('Validar campo Área de Atuação', () => {
        let numberOfOptions;

        cy.get('#area_atuacao')
            .should('be.visible')
            .click()        
        cy.get('mat-option').then(($options) => {
            numberOfOptions = $options.length;
            cy.get('mat-option').should('have.length', numberOfOptions)        
        });
    });

    it('Validar especialidade buscada no campo Área de atuação', () => {
        cy.get('#area_atuacao').click()
        cy.get('#area_atuacao_search').type('Cardiologia')
        cy.contains('mat-option', 'Cardiologia').should('be.visible')
        cy.contains('mat-option', 'Cardiologia').click()
        cy.get('#area_atuacao .mat-select-value-text').should('contain', 'Cardiologia')
        
    });

    it('Validar campo Profissional', () => {
        let numberOfOptions

        cy.get('#profissional')
            .should('be.visible')
            .click()
        cy.get('mat-option').then(($options) => {
            numberOfOptions = $options.length
            cy.get('mat-option').should('have.length', numberOfOptions)
        })
    });
    it('Validar nome buscado no campo Profissional', () => {
        cy.get('#profissional').click()
        cy.get('#profissional_search').type('Pedro Teste')
        cy.contains('mat-option', 'Pedro Teste').should('be.visible')
        cy.contains('mat-option', 'Pedro Teste').click()
        cy.get('#profissional .mat-select-value-text').should('contain', 'Pedro Teste')        
    });

    it('Validar campo Tipo de procedimento', () => {
        let numberOfOptions
       
        cy.get('#area_atuacao').click()
        cy.get('#area_atuacao_search').type('Cardiologia').click()
        cy.contains('mat-option', 'Cardiologia').click()
        cy.get('#profissional').click()
        cy.get('#profissional_search').type('Pedro Teste')
        cy.contains('mat-option', 'Pedro Teste').click()

        cy.get('#procedimento')
            .should('be.visible')            
            .click({force: true})
        cy.get('mat-option').then(($options) => {
            numberOfOptions = $options.length
            cy.get('mat-option').should('have.length', numberOfOptions)
        })       
    });

    it('Validar opção selecionada no campo Tipo de procedimento', () => {

        cy.get('#area_atuacao').click()
        cy.get('#area_atuacao_search').type('Cardiologia').click()
        cy.contains('mat-option', 'Cardiologia').click()
        cy.get('#profissional').click()
        cy.get('#profissional_search').type('Pedro Teste').click()
        cy.contains('mat-option', 'Pedro Teste').click()

        cy.get('#procedimento').click()
    // Verifica e seleciona a opção "Todos"
        cy.contains('mat-option', 'Todos').click()
        cy.get('mat-option').each(($option) => {
            cy.wrap($option).should('have.class', 'mat-selected')
        })
    // Desmarca a opção "Todos"
        cy.contains('mat-option', 'Todos').click()
        cy.get('mat-option').each(($option) => {
            cy.wrap($option).should('not.have.class', 'mat-selected')            
        })
    // Seleciona todas as opções uma a uma      
        cy.get('mat-option').not(':contains("Todos")').each(($option) => {
            cy.wrap($option).click()
        })
    // Verifica se a opção "Todos" foi automaticamente selecionada
        cy.contains('mat-option', 'Todos').should('have.class', 'mat-selected')
    });

    it('Validar botão Pesquisar', () => {
        cy.contains('span', 'Pesquisar')
            .should('be.visible')        
    });    
})

describe('FRN - Validar buscas da tela Confirmar Agendamento', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/schedule/confirm-schedule')        
    });

    it('Validar pesquisa do campo Paciente', () => {
       let quantidadeDeLinhas = 0;
    
    //criando massa de dados para o teste
       cy.slotVazio()
       cy.agendamento()

    //Esperar a tela agendamento ser carregada para mudar de tela
        cy.get('.calendar-overview').should('be.visible')
        cy.contains('span', 'Confirmar agendamento').click()
       
    //Selecionar paciente para realizar a busca
        cy.get('#paciente').click()
        cy.get('#paciente_search').type('11701035618')
        cy.contains('mat-option', '11701035618').click()
        cy.contains('span', 'Pesquisar').click()

    //Alterar a quantidade de itens por página
        cy.get('mat-select[aria-label="Items per page:"]').click()
        cy.get('mat-option').contains('50').click({force: true})
        cy.wait(300)

    // Validar que a tabela exibe informações apenas para o paciente selecionado
        cy.get('table tbody tr').then(($row) =>{
            quantidadeDeLinhas = $row.length
        }).then(() => {
            for (let i = 0; i < quantidadeDeLinhas; i++) {
                cy.get('table tbody tr').eq(i).should('contain', 'Pedro Henrique Castelani');                
            }
        })    
               
        cy.get('table').within(() => {
    // Verificar a quantidade de linhas geradas na tabela
            cy.get('tbody tr').should('have.length.greaterThan', 0);
      
    // Iterar sobre cada linha e validar as informações
            cy.get('tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(1).should('contain', 'Pedro Henrique Castelani');
                })
            })
        })
    })

    it('Validar resultado da pesquisa do campo Data Inicío e Data Fim', () => {
        let quantidadeDeLinhas = 0;
        
        cy.get('#dateInit')
            .clear()
            .type(30042024)
        cy.get('#dateEnd')
            .clear()
            .type('30042024')
        cy.contains('span','Pesquisar').click()

    //Alterar a quantidade de itens por página
        cy.get('mat-select[aria-label="Items per page:"]').click()
        cy.get('mat-option').contains('50').click({force: true})
        cy.wait(400)

        cy.get('table tbody tr').then(($row) =>{
            quantidadeDeLinhas = $row.length
        }).then(() => {
            for (let i = 0; i < quantidadeDeLinhas; i++) {
                cy.get('table tbody tr').eq(i).should('contain', '30/04/2024');                
            }
        })           
    });

    it('Validar resultado da pesquisa com o status selecionado', () => {
        const statuses = ['Agendado', 'Desmarcado pela clínica', 'Desmarcado pelo paciente', 'Marcado - Confirmado']
    
    //Escolher data para validação
        cy.get('#dateInit')
            .clear()            
            .type('08042024')
        cy.get('#dateEnd')
            .clear()
            .type('30042024')
        cy.contains('span', 'Pesquisar').click()
   
    // Selecionar cada status individualmente e validar
        statuses.forEach(status => { 
    // Selecionar o status no mat-select
            cy.get('#status').click();
            cy.get('mat-pseudo-checkbox.mat-pseudo-checkbox-checked').click()
            cy.get('mat-option').contains(status).click()
            cy.get('mat-pseudo-checkbox.mat-pseudo-checkbox-checked').should('be.visible')
            cy.get('body').click(); // Fechar o mat-select
    
            // Clicar no botão "Pesquisar"
            cy.contains('span', 'Pesquisar').click();
            cy.wait(500)
    
            // Validar os ícones na tabela de resultados
            cy.get('table tbody tr').each(($row, index) => {
        // Verificar o texto do status na tabela
                cy.wrap($row).find('td').eq(6).find('mat-icon').invoke('attr', 'data-mat-icon-name').then(iconName => {
                    switch (status) {
                        case 'Agendado':
                        expect(iconName).to.equal('icon-question');
                        break;
                        case 'Desmarcado pela clínica':
                        expect(iconName).to.equal('icon-close-red');
                        break;
                        case 'Desmarcado pelo paciente':
                        expect(iconName).to.equal('icon-close-blue');
                        break;
                        case 'Marcado - Confirmado':
                        expect(iconName).to.equal('icon-check');
                        break;
                        default:
                        throw new Error(`Ícone para o status "${status}" não encontrado.`);
                    }
                });
            });           
        });
    })

    it('Validar resultado da pesquisa com todos os status selecionados', () => {
        const statuses = ['Agendado', 'Desmarcado pela clínica', 'Desmarcado pelo paciente', 'Marcado - Confirmado']

    //Escolher data para validação
        cy.get('#dateInit')
            .clear()            
            .type('30042024')        
        cy.contains('span', 'Pesquisar').click()

    //Alterar a quantidade de itens por página
        cy.get('mat-select[aria-label="Items per page:"]').click()
        cy.get('mat-option').contains('50').click({force: true})
        cy.wait(400)
    
    //Desmarcando o status Agendado    
        cy.get('#status').click();
        cy.get('mat-pseudo-checkbox.mat-pseudo-checkbox-checked').click()
        cy.get('body').click()*
    
    //Início do teste
        cy.get('#status').click();
        statuses.forEach(status => {
          cy.get('mat-option').contains(status).click();
        });
        cy.get('body').click(); // Fechar o mat-select
        
    // Clicar no botão "Pesquisar" para todos os status selecionados
        cy.contains('span', 'Pesquisar').click();
        cy.wait(500)
    
    // Validar os ícones na tabela de resultados para todos os status
        cy.get('table tbody tr').each(($row, index) => {
            cy.wrap($row).find('td').eq(6).find('mat-icon').invoke('attr', 'data-mat-icon-name').then(iconName => {
                switch (iconName) {
                    case 'icon-question':
                        expect(statuses).to.include('Agendado');
                        break;
                    case 'icon-close-red':
                        expect(statuses).to.include('Desmarcado pela clínica');
                        break;
                    case 'icon-close-blue':
                        expect(statuses).to.include('Desmarcado pelo paciente');
                        break;
                    case 'icon-check':
                        expect(statuses).to.include('Marcado - Confirmado');
                        break;
                    default:
                        throw new Error(`Ícone "${iconName}" não reconhecido.`);
                }
            });
        });
    });    
})
