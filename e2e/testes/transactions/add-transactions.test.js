describe('Testes de Adicionar Transação', () => {
    beforeAll(async () => {
      // Fazer login antes dos testes
      await loginUser();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
      await element(by.id('add-transaction-button')).tap();
    });
  
    it('deve adicionar uma despesa com sucesso', async () => {
      await element(by.id('value-input')).typeText('50.00');
      await element(by.id('description-input')).typeText('Almoço');
      await element(by.id('category-picker')).tap();
      await element(by.text('Alimentação')).tap();
      await element(by.id('save-transaction-button')).tap();
  
      await expect(element(by.text('Transação adicionada'))).toBeVisible();
    });
  
    it('deve validar campos obrigatórios', async () => {
      await element(by.id('save-transaction-button')).tap();
      await expect(element(by.text('Valor é obrigatório'))).toBeVisible();
      await expect(element(by.text('Categoria é obrigatória'))).toBeVisible();
    });
  
    /* Testes adicionais possíveis:
    - Adicionar receita
    - Testar valores negativos
    - Adicionar data futura
    - Testar anexos
    - Validar formatos de valor
    */
  });