describe('Testes de Listagem de Transações', () => {
    beforeAll(async () => {
      await loginUser();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
    });
  
    it('deve exibir lista de transações', async () => {
      await expect(element(by.id('transactions-list'))).toBeVisible();
      await expect(element(by.id('transaction-item'))).toBeVisible();
    });
  
    it('deve filtrar transações por período', async () => {
      await element(by.id('filter-button')).tap();
      await element(by.text('Este mês')).tap();
      await expect(element(by.id('transactions-list'))).toBeVisible();
    });
  
    /* Testes adicionais possíveis:
    - Filtrar por categoria
    - Ordenar transações
    - Buscar por descrição
    - Paginação
    - Atualizar lista (pull to refresh)
    */
  });