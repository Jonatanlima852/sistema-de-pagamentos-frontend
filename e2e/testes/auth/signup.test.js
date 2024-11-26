describe('Testes de Cadastro', () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
    });
  
    describe('Validações de campos', () => {
      it('deve mostrar erro quando campos obrigatórios estão vazios', async () => {
        await element(by.id('signup-button')).tap();
        await expect(element(by.text('Nome é obrigatório'))).toBeVisible();
        await expect(element(by.text('E-mail é obrigatório'))).toBeVisible();
        await expect(element(by.text('Senha é obrigatória'))).toBeVisible();
      });
  
      it('deve mostrar erro quando email é inválido', async () => {
        await element(by.id('name-input')).typeText('Usuário Teste');
        await element(by.id('email-input')).typeText('emailinvalido');
        await element(by.id('password-input')).typeText('senha123');
        await element(by.id('signup-button')).tap();
        
        await expect(element(by.text('E-mail inválido'))).toBeVisible();
      });
    });
  
    it('deve cadastrar novo usuário com sucesso', async () => {
      await element(by.id('name-input')).typeText('Usuário Teste');
      await element(by.id('email-input')).typeText('teste@email.com');
      await element(by.id('password-input')).typeText('senha123');
      await element(by.id('signup-button')).tap();
      
      await expect(element(by.id('home-screen'))).toBeVisible();
    });
  
    /* Testes adicionais possíveis:
    - Verificar força da senha
    - Testar confirmação de senha
    - Validar formato do nome
    - Testar email já cadastrado
    - Verificar termos de uso
    */
  });