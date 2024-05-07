const displayPropreties = ( nodeElt,objPropreties) => {
    for (const key of Object.keys(objPropreties)) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const strong = document.createElement('strong');
        strong.textContent = `${key}: `;
        span.appendChild(strong);
        const span_2 = document.createElement('span');
        span_2.textContent = `${objPropreties[key]}`;
        span.appendChild(strong);
        span.appendChild(span_2);
        li.appendChild(span);
        nodeElt.appendChild(li);
    }
}

const displayDeliveryStatus = (status) =>{
    const statusElt = document.getElementById('delivery-status');
    statusElt.textContent = ` Delivery Status:  ${status}`;
}

module.exports =  { displayPropreties, displayDeliveryStatus }