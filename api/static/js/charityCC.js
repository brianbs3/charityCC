saveProduct = () => {
    const data = {
        upc: $('#lookupProductInput').val(),
        description: $('#lookupProductDescription').val(),
        category: $('#lookupProductCategory').val(),
        source: "manual"
    }
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: `/products/add`,
        success: function (d) {
            console.log(d)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.readyState == 0)
                window.location.replace(global_site_redirect);
            $("#bsNetworkStatus").html(jqXHR);
        }
    });
    console.log(data);
}


lookupProduct = () => {
    const upc = $('#lookupProductInput').val();
    if(isStringInt(upc)){
        if (upc.length !== 7 && upc.length !== 11 && upc.length !== 12 && upc.length !== 13 && upc.length !== 14){
            $('#ccc_toast_body').html(`Invlid UPC length of ${upc.length}`)
            $('#ccc_toast').show()
            setTimeout(() => { $('#ccc_toast').hide() }, 3000)
        }
        else{
            $('#ccc_toast_body').html(`Looking up ${upc}`)
            $('#ccc_toast').show()
            $.ajax({
                    type: 'GET',
                    url: `/products/lookup/${upc}`,
                    success: function (data) {
                        console.log(data);
                        $('#ccc_toast').hide()
                        if(data.success){
                            $('#lookupProductDescription').val(data.title)
                            $('#lookupProductCategory').val(data.category)
                            $('#lookupProductSource').val(data.source)
                            
                        }
                        else{
                            $('#lookupProductDescription').val("NOT FOUND")
                            $('#lookupProductCategory').val("NOT FOUND")
                            $('#lookupProductSource').val("MANUAL")
                        }
                        
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
            // console.log(data)
            $('#root').html(`
                <h2>Found ${data.length} Items</h2>
                <table width=100% class="table table-dark table-stripped">
                <thead><th>#</th><th>UPC</th><th>Barcode</th><th>Brand</th><th>Description</th><th>Category</th></thead>
                <tbody id=allProductBody>`);
            let count = 0;
            Object.keys(data).forEach((k, v) => {
                $('#allProductBody').append(
                `<tr>
                    <td>${++count}</td>
                    <td>${data[k].upc}</td>
                    <td>${data[k].barcode}</td>
                    <td>${data[k].brand}</td>
                    <td>${data[k].description}</td>
                    <td>${data[k].category}</td>
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

clearProductForm = () => {
    $('#lookupProductInput').val('')
    $('#lookupProductDescription').val('')
    $('#lookupProductCategory').val('')
    $('#lookupProductSource').val('')
    $('#lookupProductInput').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('input[name = butAssignProd]').click();
            return false;
        }
    });   

}

getProductDetails = (upc) => {
    $.ajax({
        type: 'GET',
        url: `/products/details/${upc}`,
        success: function (data) {
            console.log(data)
            // $('#root').html(`
            //     <h2>Found ${data.length} Items</h2>
            //     <table width=100% class="table table-dark table-stripped">
            //     <thead><th>#</th><th>UPC</th><th>Brand</th><th>Description</th><th>Category</th></thead>
            //     <tbody id=allProductBody>`);
            // let count = 0;
            // Object.keys(data).forEach((k, v) => {
            //     $('#allProductBody').append(
            //         `<tr>
            //         <td>${++count}</td>
            //         <td>${data[k].upc || data[k].barcode}</td>
            //         <td>${data[k].brand}</td>
            //         <td>${data[k].description}</td>
            //         <td>${data[k].category}</td>
            //     </tr>`
            //     );
            // })
            // $('#allProductBody').append(
            //     `</tbody>
            //     </table>`)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error")
        }
    });

}
