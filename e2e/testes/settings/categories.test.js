describe('Testes de Categorias', () => {
    beforeAll(async () => {
      await loginUser();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
      await element(by.id('settings-tab')).tap();
      await element(by.id('categories-option')).tap();
    });
  
    it('deve adicionar nova categoria', async () => {
      await element(by.id('add-category-button')).tap();
      await element(by.id('category-name-input')).typeText('Nova Categoria');
      await element(by.id('category-type-picker')).tap();
      await element(by.text('Despesa')).tap();
      await element(by.id('save-category-button')).tap();
  
      await expect(element(by.text('Nova Categoria'))).toBeVisible();
    });
  
    it('deve editar categoria existente', async () => {
      await element(by.id('category-item-0')).tap();
      await element(by.id('category-name-input')).clearText();
      await element(by.id('category-name-input')).typeText('Categoria Editada');
      await element(by.id('save-category-button')).tap();
  
      await expect(element(by.text('Categoria Editada'))).toBeVisible();
    });
  
    /* Testes adicionais possíveis:
    - Excluir categoria
    - Validar nome duplicado
    - Ordenar categorias
    - Filtrar por tipo
    */
  });