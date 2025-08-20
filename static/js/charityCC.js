$('#lookupProductInput').on('keypress', function(e) {
  if (e.which === 13) {
    // Code to execute when Enter key is pressed within this input field
    console.log('Enter key pressed in the input field!');
    e.preventDefault(); // Prevent default form submission if inside a form
  }
});

lookupProduct = () => {
    const upc = $('#lookupProductInput').val();
    if(isStringInt(upc)){
        if(upc.length !== 7 && upc.length !== 11 && upc.length !== 12){
            $('#ccc_toast_body').html(`Invlid UPC length of ${upc.length}`)
            $('#ccc_toast').show()
            setTimeout(() => { $('#ccc_toast').hide() }, 3000)
        }
        else{
            $.ajax({
                    type: 'GET',
                    url: `/products/lookup/${upc}`,
                    success: function (data) {
                        $('#lookupProductDescription').val(data.data.description)
                        $('#lookupProductCategory').val(data.data.category)
                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    console.log("error")
                    }
                });
        }
    }
    else{
        $('#ccc_toast_body').html(`${upc} is not a number`)
        $('#ccc_toast').show()
        setTimeout(() => { $('#ccc_toast').hide() }, 3000)
    }
    
    
}

populateAllProductsTable = () => {
    $.ajax({
        type: 'GET',
        url: `/products`,
        success: function (data) {
            $('#root').html(`
                <h2>Found ${data.meta.totalResourceCount} Items</h2>
                <table width=100% class="table table-dark table-stripped">
                <thead><th>UPC</th><th>Description</th><th>Category</th></thead>
                <tbody id=allProductBody>`);
            Object.keys(data.data).forEach((k, v) => {
                $('#allProductBody').append(
                `<tr>
                    <td>${data.data[k].upc}</td>
                    <td>${data.data[k].description}</td>
                    <td>${data.data[k].category}</td>
                </tr>`
                );
            })
                $('#allProductBody').append(
                `</tbody>
                </table>`)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error")
        }
    });
    
}

isStringInt = (str) => {
    const num = Number(str); // Attempt to convert the string to a number
    return Number.isInteger(num) && !isNaN(num);
}