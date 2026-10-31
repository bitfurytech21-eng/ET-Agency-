async function executeInternalPayFromBalance(bookingId, units) {
    if (!confirm('Execute internal command to settle booking #' + bookingId + ' using ' + units + ' units from balance?')) return;
    try {
        const res = await fetch('/portal/payments/pay-from-balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ booking_id: bookingId, units: units, command_code: 'INTERNAL_EXEC_PAY_FROM_BALANCE' })
        });
        const data = await res.json();
        alert(data.message || (data.success ? 'Command executed successfully!' : 'Failed'));
        if (data.success) location.reload();
    } catch(e) {
        alert('Network error executing command: ' + e.message);
    }
}
