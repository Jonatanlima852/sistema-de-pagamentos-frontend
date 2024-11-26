describe('Testes de Perfil', () => {
    beforeAll(async () => {
      await loginUser();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
      await element(by.id('settings-tab')).tap();
      await element(by.id('profile-option')).tap();
    });
  
    it('deve atualizar nome do usuário', async () => {
      await element(by.id('name-input')).clearText();
      await element(by.id('name-input')).typeText('Novo Nome');
      await element(by.id('save-profile-button')).tap();
  
      await expect(element(by.text('Perfil atualizado'))).toBeVisible();
    });
  
    it('deve alterar senha', async () => {
      await element(by.id('change-password-button')).tap();
      await element(by.id('current-password')).typeText('senha123');
      await element(by.id('new-password')).typeText('novaSenha123');
      await element(by.id('confirm-password')).typeText('novaSenha123');
      await element(by.id('save-password-button')).tap();
  
      await expect(element(by.text('Senha alterada'))).toBeVisible();
    });
  
    /* Testes adicionais possíveis:
    - Atualizar foto de perfil
    - Validar formato de email
    - Testar logout
    - Excluir conta
    */
  });