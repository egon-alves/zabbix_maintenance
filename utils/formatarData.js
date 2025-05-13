// utils/formatarData.js
function formatarData(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { timeZone: 'UTC' });
  }
  
  module.exports = { formatarData };
  