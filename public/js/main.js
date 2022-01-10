// Starting TinyMCE
// tinymce.init({
//    language: 'pt_BR',
//    selector: '#article',
//    plugins: [
//       'advlist autolink link image lists print preview hr searchreplace wordcount fullscreen insertdatetime media save table paste emoticons'
//    ],
// });
ClassicEditor
   .create( document.querySelector( '#editor' ) )
   .catch( error => {
      console.error( error );
   }
);

// Opens a confirmation modal when asked to delete an item
function confirmDelete(event, form) {
   event.preventDefault();
   const decision = confirm('Tem certeza que deseja excluir este item?');
   if (decision) {
      form.submit();
   }
}