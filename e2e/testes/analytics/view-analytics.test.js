describe('Testes de Análises', () => {
    beforeAll(async () => {
      await loginUser();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
      await element(by.id('analytics-tab')).tap();
    });
  
    it('deve exibir gráfico de despesas por categoria', async () => {
      await expect(element(by.id('expenses-chart'))).toBeVisible();
    });
  
    it('deve alterar período de análise', async () => {
      await element(by.id('period-picker')).tap();
      await element(by.text('Este mês')).tap();
      await expect(element(by.id('expenses-chart'))).toBeVisible();
    });
  
    /* Testes adicionais possíveis:
    - Comparar períodos
    - Exportar relatórios
    - Filtrar por conta
    - Análise de tendências
    - Metas e limites
    */
  });