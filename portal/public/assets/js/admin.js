async function verifyManualPayment(paymentId, decision) {
    const notes = prompt('Enter admin verification notes (optional):', 'Verified with bank statement.');
    if (notes === null) return;
    try {
        const res = await fetch('/portal/admin/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: paymentId, decision: decision, notes: notes })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch(e) {
        alert('Error: ' + e.message);
    }
}
