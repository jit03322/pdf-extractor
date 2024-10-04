document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('pdf-file');
    const headingInput = document.getElementById('heading');
    const messageDiv = document.getElementById('message');

    const formData = new FormData();
    formData.append('pdf', fileInput.files[0]);
    formData.append('heading', headingInput.value);

    try {
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const message = await response.json();
            messageDiv.textContent = message.message;
        } else {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;

            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'output';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match.length > 1) {
                    fileName = match[1];
                }
            }
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();

            messageDiv.textContent = "File downloaded successfully!";
        }
    } catch (error) {
        messageDiv.textContent = 'Error: ' + error.message;
    }
});
