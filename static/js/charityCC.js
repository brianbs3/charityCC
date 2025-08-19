

lookupProduct = () => {
    const upc = $('#lookupProductInput').val();
    $.ajax({
        type: 'GET',
        url: `/products/lookup/${upc}`,
        success: function (data) {
            console.log(data);
            $('#root').html(`
                <table width=100%>
                <thead><th>UPC</th><th>Description</th><th>Category</th></thead>
                <tbody>
                <tr>
                    <td>${data.data.upc}</td>
                    <td>${data.data.description}</td>
                    <td>${data.data.category}</td>
                    </tr>
                </tbody>
                </table>`)
        },
        error: function (jqXHR, textStatus, errorThrown) {
           console.log("error")
        }
    });
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