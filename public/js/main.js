// Opens a confirmation modal when asked to delete an item
function confirmDelete(event, form) {
   event.preventDefault();
   const decision = confirm('Tem certeza que deseja excluir este item?');
   if (decision) {
      form.submit();
   }
}