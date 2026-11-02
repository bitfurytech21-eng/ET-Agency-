// Wire / ACH Manual Payment Helper & Copy Account Number
function copyAccountNum(numId) {
    const el = document.getElementById(numId);
    if (el) {
        navigator.clipboard.writeText(el.innerText || el.value);
        if (typeof showNotification === 'function') {
            showNotification('Account details copied to clipboard!', 'success');
        } else {
            alert('Copied to clipboard!');
        }
    }
}
