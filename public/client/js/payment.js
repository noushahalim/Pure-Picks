document.getElementById('paymentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    axios.post('/createOrder')
        .then(function (response) {
            var options = {
                key: response.data.data.key,
                amount: response.data.order.amount,
                currency: response.data.order.currency,
                order_id: response.data.order.id,
                name: 'PUREPICKS',
                description: 'Payment for your order',
                handler: function (response) {
                    console.log('Razorpay payment success:', response);
                    window.location.href = '/paymentSuccess';
                },
                prefill: {
                    name: response.data.data.name,
                    email: response.data.data.email,
                    contact: response.data.data.contact,
                },
                theme: {
                    color: '#5465ff'
                }
            };
            var rzp = new Razorpay(options);
            rzp.open();
        })
        .catch(function (error) {
            console.error('Error creating Razorpay order:', error);
        });
});
