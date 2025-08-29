$(document).ready(() => {
    $('#lookupProductInput').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
           lookupProduct();
        }
    });
});

saveProduct = () => {
    const data = {
        upc: $('#lookupProductInput').val(),
        description: $('#lookupProductDescription').val(),
        category: $('#lookupProductCategory').val(),
        brand: $('#lookupProductBrand').val(),
        size: $('#lookupProductSize').val(),
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
                        console.log(data)
                        
                        if(data && Object.keys(data).length > 0){
                            
                            $('#lookupProductDescription').val(data.description)
                            $('#lookupProductBrand').val(data.brand)
                            $('#lookupProductCategory').val(data.category)
                            $('#lookupProductSize').val(data.size)
                            $('#lookupProductSource').val(data.source)
                            // if(item.images){
                            //     let imgSrc = "";
                            //     Object.keys(item.images).forEach((v) =>{
                            //         console.log(item.images[v]);
                            //         imgSrc += `<img width=200 height=200 src='${item.images[v]}'><br>`
                            //     })
                            //     $('#itemPics').html(imgSrc);
                            // }
                            
                        }
                        else{
                            $('#lookupProductDescription').val("NOT FOUND")
                            $('#lookupProductCategory').val("NOT FOUND")
                            $('#lookupProductSize').val("NOT FOUND")
                            $('#lookupProductBrand').val("NOT FOUND")
                            $('#lookupProductSource').val("MANUAL")
                        }
                        $('#ccc_toast').hide()
                        
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
                <table width=100% class="table table-striped table-dark">
                <thead><th>#</th><th>UPC</th><th>Brand</th><th>Description</th><th>Category</th><th>Size</th><th>Source</th></thead>
                <tbody id=allProductBody>`);
            let count = 0;
            Object.keys(data).forEach((k, v) => {
                const d = data[k]
                
                
                if(d){
                    // const item = d.items[0];
                    console.log(d)
                    
                    $('#allProductBody').append(
                        `<tr>
                    <td>${++count}</td>
                    <td><a href=# data-toggle="modal" data-target="#addProductModal" onClick='productDetails("${d.upc}")'>${d.upc}</a></td>
                 
                    <td>${d.brand}</td>
                    
                    <td>${truncateString(d.description)}</td>
                    <td>${truncateString(d.category)}</td>
                    <td>${d.size}</td>
                    <td>${d.source}</td>
                </tr>`
                    );
                }
                // else{
                //     let size;
                //     if (data[k].metadata)
                //         size = data[k].metadata.quantity || null
                //     $('#allProductBody').append(
                //         `<tr>
                //             <td>${++count}</td>
                //             <td><a href=# data-toggle="modal" data-target="#addProductModal" onClick='productDetails("${data[k].upc}")'>${data[k].upc}</a></td>
                //             <td>${data[k].barcode}</td>
                //             <td>${data[k].brand}</td>
                //             <td>${data[k].description}</td>
                //             <td>${data[k].category}</td>
                //             <td>${size}</td>
                //             <td>${data[k].source}</td>
                //         </tr>`
                //     );
                // }

                
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
    $('#lookupProductInput').val('').focus();
    $('#lookupProductDescription').val('')
    $('#lookupProductCategory').val('')
    $('#lookupProductSource').val('')
    $('#lookupProductSize').val('')
    $('#lookupProductBrand').val('')
    $('#itemPics').html('')
}

getProductDetails = (upc) => {
    $.ajax({
        type: 'GET',
        url: `/products/details/${upc}`,
        success: function (data) {
            console.log(data)
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error")
        }
    });

}


productDetails = (upc) => {
    $('#lookupProductInput').val(upc);
    lookupProduct();
}

truncateString = (str, maxLength=20) => {
    if (str && str.length > maxLength) {
        // If the string is longer than maxLength, truncate and add ellipsis
        return str.slice(0, maxLength - 3) + '...';
    } else {
        // Otherwise, return the original string
        return str;
    }
}