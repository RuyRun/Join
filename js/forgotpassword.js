/**
 * Displays a message indicating that the email has been sent and redirects to the index.html page after a delay.
 */
function showEmailSentMessage() {
    document.getElementById('emailSentPopup').classList.add('slide-in-bottom');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}