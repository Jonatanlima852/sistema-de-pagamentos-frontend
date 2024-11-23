export const currencyMask = (value) => {
  // Remove tudo que não é número
  let numbers = value.replace(/\D/g, '');
  
  // Garante que começamos com pelo menos "000"
  numbers = numbers.padStart(3, '0');
  
  // Converte para centavos (divide por 100)
  const amount = Number(numbers) / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}; 