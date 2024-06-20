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
  it('validar inclusao de grade do profissional', () => {
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

describe('Teste API cashback', () => {
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

  it.only('selecionar slot agendamento', () => {
    cy.selecionarSlotAgendamento()
    cy.agendamento()
  })
});

/*/describe('Testes de Assinatura Digital no Prontuário', () => {
    
  // Cenário 1
  it('Deve ativar a assinatura digital na tela de atendimento acolhimento', () => {
      cy.visit('/atendimento-acolhimento')
      cy.get('#assinatura-digital').should('not.be.checked')
      cy.get('#assinatura-digital').click()
      cy.get('.mensagem-confirmacao').should('be.visible')
  })

  // Cenário 2
  it('Deve verificar que a opção de assinatura digital está desativada por padrão', () => {
      cy.visit('/atendimento-acolhimento')
      cy.get('#assinatura-digital').should('not.be.checked')
  })

  // Cenário 3
  it('Deve exigir uma nova assinatura após modificação no prontuário', () => {
      cy.visit('/atendimento-medico-ato')
      cy.get('#assinatura-digital').click()
      cy.get('.mensagem-confirmacao').should('be.visible')
      // Simular uma modificação
      cy.get('#modificar-prontuario').click()
      cy.wait(1000) // Tempo para modificação ser aplicada
      cy.get('#assinatura-digital').click()
      cy.get('.mensagem-confirmacao').should('be.visible')
  })

  // Cenário 4
  it('Deve registrar a assinatura digital no banco de dados', () => {
      cy.visit('/folha-de-rosto')
      cy.get('#assinatura-digital').click()
      cy.get('.mensagem-confirmacao').should('be.visible')
      // Verificação no banco de dados - Pseudocódigo
      cy.task('queryDb', 'SELECT * FROM assinaturas WHERE usuario="usuarioLogado"')
        .then(result => {
            expect(result).to.have.length(1)
        })
  })

  // Cenário 5
  it('Deve diferenciar registros de assinatura por tipo de documento', () => {
      cy.visit('/atendimento-acolhimento')
      cy.get('#assinatura-digital').click()
      cy.visit('/atestado')
      cy.get('#assinatura-digital').click()
      cy.visit('/prescricao-medica')
      cy.get('#assinatura-digital').click()
      // Verificação no banco de dados - Pseudocódigo
      cy.task('queryDb', 'SELECT * FROM assinaturas WHERE tipo="atendimento-acolhimento"')
        .then(result => {
            expect(result).to.have.length(1)
        })
      cy.task('queryDb', 'SELECT * FROM assinaturas WHERE tipo="atestado"')
        .then(result => {
            expect(result).to.have.length(1)
        })
      cy.task('queryDb', 'SELECT * FROM assinaturas WHERE tipo="prescricao-medica"')
        .then(result => {
            expect(result).to.have.length(1)
        })
  })

  // Cenário 6
  it('Deve salvar evidências de assinatura para consultas posteriores', () => {
      cy.visit('/atendimento-medico-ato')
      cy.get('#assinatura-digital').click()
      // Verificação no banco de dados - Pseudocódigo
      cy.task('queryDb', 'SELECT * FROM assinaturas WHERE usuario="usuarioLogado"')
        .then(result => {
            expect(result[0]).to.have.property('evidencias')
        })
  })

  // Cenário 7
  it('Deve atrelar a assinatura ao usuário logado', () => {
      cy.login('usuarioLogado', 'senha')
      cy.visit('/atendimento-acolhimento')
      cy.get('#assinatura-digital').click()
      // Verificação no banco de dados - Pseudocódigo
      cy.task('queryDb', 'SELECT * FROM assinaturas WHERE usuario="usuarioLogado"')
        .then(result => {
            expect(result).to.have.length(1)
        })
  })

  // Cenário 8
  it('Deve registrar a assinatura do atendimento caso solicitado por operações', () => {
      // Simular solicitação por operações
      cy.task('solicitarAssinaturaAtendimento')
      cy.visit('/atendimento-medico-ato')
      cy.get('#assinatura-digital').click()
      // Verificação no banco de dados - Pseudocódigo
      cy.task('queryDb', 'SELECT * FROM assinaturas WHERE usuario="usuarioLogado" AND tipo="atendimento-medico"')
        .then(result => {
            expect(result).to.have.length(1)
        })
  })

  // Cenário 9
  it('Deve manter a última assinatura no prontuário', () => {
      cy.visit('/prontuario')
      cy.get('#ultima-assinatura').should('exist')
  })
})*/

/*describe('Assinatura Digital de Prontuário', () => {

  // Cenário 1: Ativar Assinatura Digital por 12 Horas
  it('Deve ativar a assinatura digital por 12 horas e exibir mensagem de confirmação', () => {
    cy.visit('/tela_atendimento');
    cy.get('#ativarAssinatura').click();
    cy.contains('Seu certificado ficará disponível por 12 horas a partir desta confirmação').should('be.visible');
    // Verificar se o token está ativo por 12 horas - implementação específica do sistema
  });

  // Cenário 2: Nova Modificação no Prontuário dentro de 48 Horas
  it('Deve submeter a nova assinatura automática ao editar prontuário dentro de 48 horas', () => {
    cy.visit('/tela_prontuario');
    cy.get('#editarProntuario').click();
    cy.get('#campoEdicao').type('Nova informação');
    cy.get('#salvarProntuario').click();
    cy.contains('Prontuário atualizado com nova assinatura digital').should('be.visible');
  });

  // Cenário 3: Registros de Assinatura no Banco de Dados
  it('Deve registrar a assinatura digital no banco de dados para diferentes itens', () => {
    const itens = ['#prontuario', '#atestado', '#prescricaoMed', '#prescricaoExame', '#encaminhamentos', '#orientacoes'];
    itens.forEach(item => {
      cy.get(item).should('have.attr', 'data-assinado', 'true');
    });
  });

  // Cenário 4: Desativação da Assinatura Digital
  it('Não deve permitir desativar a assinatura digital durante as 12 horas', () => {
    cy.visit('/tela_atendimento');
    cy.get('#ativarAssinatura').click();
    cy.get('#desativarAssinatura').should('be.disabled');
  });

  // Cenário 5: Impressão do Prontuário com Assinatura
  it('Deve assinar o prontuário no momento da impressão se estiver dentro das 12 horas', () => {
    cy.visit('/tela_impressao');
    cy.get('#imprimirProntuario').click();
    cy.contains('Documento assinado').should('be.visible');
    // Verificar se o PDF tem a identificação da assinatura - implementação específica
  });

  // Cenário 6: Impressão do Prontuário sem Assinatura
  it('Deve permitir escolher outra forma de assinatura se não desejar assinatura digital', () => {
    cy.visit('/tela_impressao');
    cy.get('#imprimirProntuario').click();
    cy.contains('Assinar de outra forma').click();
    cy.contains('Assinatura manual selecionada').should('be.visible');
  });

  // Cenário 7: Usuário sem Certificado Compatível
  it('Deve exibir mensagem se o usuário não tiver certificado compatível', () => {
    cy.visit('/tela_atendimento');
    cy.get('#ativarAssinatura').click();
    cy.contains('Certificado incompatível').should('be.visible');
    cy.contains('Assinar de outra forma').should('be.visible');
  });

  // Cenário 8: Manter Opção de Assinatura na Impressão
  it('Deve continuar exibindo a opção de assinatura digital na impressão', () => {
    cy.visit('/tela_impressao');
    cy.get('#imprimirProntuario').click();
    cy.contains('Deseja assinar digitalmente?').should('be.visible');
  });

  // Cenário 9: Assinatura de Itens Automatizada
  it('Deve assinar automaticamente novos itens gerados dentro das 12 horas', () => {
    cy.visit('/tela_atendimento');
    cy.get('#ativarAssinatura').click();
    cy.get('#gerarItem').click();
    cy.contains('Item assinado automaticamente').should('be.visible');
  });

  // Cenário 10: Assinatura de Documentos e Prontuário
  it('Deve exibir a identificação de assinatura no rodapé dos documentos', () => {
    cy.visit('/tela_documento');
    cy.get('#visualizarDocumento').click();
    cy.contains('Assinado por').should('be.visible');
  });

  // Cenário 11: Solicitação de Assinatura no Momento da Impressão
  it('Deve solicitar assinatura digital no momento da impressão', () => {
    cy.visit('/tela_impressao');
    cy.get('#imprimirProntuario').click();
    cy.contains('Deseja assinar digitalmente?').should('be.visible');
  });

  // Cenário 12: Validação dos Tokens de Assinaturas Digitais
  it('Deve validar os tokens de assinaturas digitais de acordo com o usuário logado', () => {
    cy.visit('/tela_atendimento');
    cy.get('#ativarAssinatura').click();
    cy.get('#tokenValido').should('have.value', 'true');
  });

  // Cenário 13: Implementação das Opções de Assinatura nas Telas
  it('Deve implementar opções de ativação de assinatura digital nas telas de atendimento', () => {
    const telas = ['/tela_acolhimento', '/tela_folha_rosto', '/tela_atendimento_medico'];
    telas.forEach(tela => {
      cy.visit(tela);
      cy.get('#ativarAssinatura').should('be.visible');
    });
  });

  // Cenário 14: Rotas de Assinatura do Prontuário + Impressão
  it('Deve permitir escolher assinatura na impressão nas rotas específicas', () => {
    const rotas = ['/sala_espera', '/menu_paciente'];
    rotas.forEach(rota => {
      cy.visit(rota);
      cy.get('#escolherPaciente').click();
      cy.get('#folhaRosto').click();
      cy.contains('Deseja assinar digitalmente?').should('be.visible');
    });
  });

  // Cenário 15: Registro de Assinatura no Final do Atendimento
  it('Deve registrar assinatura digital no final do atendimento', () => {
    cy.visit('/tela_atendimento');
    cy.get('#ativarAssinatura').click();
    cy.get('#finalizarAtendimento').click();
    cy.contains('Assinatura registrada').should('be.visible');
  });

  // Cenário 16: Nova Assinatura Não Aplicada Retroativamente
  it('Não deve aplicar assinaturas automaticamente retroativamente após a habilitação', () => {
    cy.visit('/tela_atendimento');
    cy.get('#ativarAssinatura').click();
    // Implementação específica para verificar a não aplicação retroativa
    cy.get('#registroRetroativo').should('not.exist');
  });

}); */


// //span[@class="mat-button-wrapper"][contains(.,"close")]
// //tabela[identificador]//linha ou coluna[identificador]//alvo[identificador]
//exp: //div[contains(@class, “calendar”)]//div[contains(@class, “day”)//div[contains(@class, “hour”)